const { EmbedBuilder } = require("discord.js");
const { db, ensureGuild, saveDB } = require("../../utils/database");
const resolveMembers = require("../../utils/resolveMembers");
const { canUse } = require("../../utils/permissions");
const cooldown = require("../../utils/cooldown");
const emojis = require("../../emojis");

module.exports = async (client, message) => {
  ensureGuild(message.guild.id);

  if (!canUse(message)) return;

  const cd = cooldown(message.author.id, "point", 5000);
  if (cd) {
    return message.channel.send(
      `${emojis.error} انتظر **${Math.ceil(cd / 1000)}** ثواني قبل استخدام الأمر مرة أخرى`
    );
  }

  const args = message.content.split(/\s+/).slice(1);
  if (args.length < 3) {
    return message.channel.send(
      `${emojis.error} الصيغة:\n\`;point add/remove <عدد> @admins\``
    );
  }

  const action = args.shift().toLowerCase();
  const amount = parseInt(args.shift());

  if (!["add", "remove"].includes(action)) {
    return message.channel.send(`${emojis.error} اختر add أو remove`);
  }

  if (isNaN(amount) || amount <= 0) {
    return message.channel.send(`${emojis.error} العدد غير صحيح`);
  }

  const members = await resolveMembers(message, args.join(" "));
  if (!members.length) {
    return message.channel.send(`${emojis.error} لم يتم العثور على إداريين`);
  }

  const cfg = db.guilds[message.guild.id].config;
  const affected = [];

  for (const member of members) {
    if (cfg.adminPointsRole && !member.roles.cache.has(cfg.adminPointsRole)) {
      continue;
    }

    const uid = member.id;
    db.guilds[message.guild.id].points[uid] ??= 0;
    db.guilds[message.guild.id].pointsHistory[uid] ??= [];

    if (action === "add") {
      db.guilds[message.guild.id].points[uid] += amount;
    } else {
      db.guilds[message.guild.id].points[uid] = Math.max(
        0,
        db.guilds[message.guild.id].points[uid] - amount
      );
    }

    db.guilds[message.guild.id].pointsHistory[uid].push({
      action,
      amount,
      by: message.author.id,
      at: Date.now()
    });

    affected.push(member);
  }

  saveDB();

  if (!affected.length) {
    return message.channel.send(
      `${emojis.error} لا يوجد أعضاء يملكون رتبة الإداريين المحددة`
    );
  }

  const resultEmbed = new EmbedBuilder()
    .setColor(action === "add" ? 0x2ecc71 : 0xe74c3c)
    .setTitle(
      `${action === "add" ? emojis.add : emojis.remove} ${
        action === "add" ? "إضافة نقاط" : "إزالة نقاط"
      }`
    )
    .setDescription(
      `**${action === "add" ? "تم إضافة" : "تم إزالة"} ${amount} نقطة لـ:**\n` +
        affected.map(m => `• ${m}`).join("\n")
    )
    .setFooter({ text: `بواسطة ${message.author.tag}` })
    .setTimestamp();

  await message.channel.send({ embeds: [resultEmbed] });

  if (cfg.logChannel) {
    const logChannel = message.guild.channels.cache.get(cfg.logChannel);
    if (logChannel) {
      logChannel.send({ embeds: [resultEmbed] });
    }
  }
};
