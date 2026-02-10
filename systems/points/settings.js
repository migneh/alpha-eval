const { EmbedBuilder } = require("discord.js");
const { db, ensureGuild, saveDB } = require("../../utils/database");
const emojis = require("../../emojis");

module.exports = async (client, message) => {
  if (!message.member.permissions.has("Administrator")) {
    return message.channel.send(
      `${emojis.error} هذا الأمر للإدارة فقط`
    );
  }

  ensureGuild(message.guild.id);
  const cfg = db.guilds[message.guild.id].config;

  const embed = new EmbedBuilder()
    .setColor(0x95a5a6)
    .setTitle("⚙️ إعدادات نظام النقاط")
    .setDescription(
      `**رتبة الإداريين:** ${
        cfg.adminPointsRole
          ? `<@&${cfg.adminPointsRole}>`
          : "غير محددة"
      }\n` +
      `**Log Channel:** ${
        cfg.logChannel ? `<#${cfg.logChannel}>` : "غير محدد"
      }`
    )
    .addFields(
      {
        name: "تعيين رتبة الإداريين",
        value: "`;point-settings role @Role`"
      },
      {
        name: "تعيين قناة اللوق",
        value: "`;point-settings log #channel`"
      }
    )
    .setTimestamp();

  const args = message.content.split(/\s+/).slice(1);

  if (!args.length) {
    return message.channel.send({ embeds: [embed] });
  }

  if (args[0] === "role") {
    const role = message.mentions.roles.first();
    if (!role) {
      return message.channel.send(
        `${emojis.error} منشن الرتبة`
      );
    }

    if (cfg.adminPointsRole === role.id) {
      return message.channel.send(
        `${emojis.error} هذه الرتبة مضبوطة بالفعل`
      );
    }

    cfg.adminPointsRole = role.id;
    saveDB();

    return message.channel.send(
      `${emojis.success} تم تعيين رتبة الإداريين بنجاح`
    );
  }

  if (args[0] === "log") {
    const channel = message.mentions.channels.first();
    if (!channel) {
      return message.channel.send(
        `${emojis.error} منشن قناة صحيحة`
      );
    }

    cfg.logChannel = channel.id;
    saveDB();

    return message.channel.send(
      `${emojis.success} تم تعيين قناة اللوق`
    );
  }
};
