const { EmbedBuilder } = require("discord.js");
const { db, ensureGuild } = require("../../utils/database");
const emojis = require("../../emojis");

module.exports = async (client, message) => {
  ensureGuild(message.guild.id);

  const data = Object.entries(
    db.guilds[message.guild.id].points
  )
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);

  if (!data.length) {
    return message.channel.send(
      `${emojis.error} لا يوجد بيانات نقاط`
    );
  }

  const desc = data
    .map(([id, pts], i) => {
      const member = message.guild.members.cache.get(id);
      return `**${i + 1}.** ${member ?? "عضو غير موجود"} — **${pts}**`;
    })
    .join("\n");

  const embed = new EmbedBuilder()
    .setColor(0xf1c40f)
    .setTitle(`${emojis.top} ترتيب النقاط`)
    .setDescription(desc)
    .setThumbnail(message.guild.iconURL({ dynamic: true }))
    .setTimestamp();

  message.channel.send({ embeds: [embed] });
};
