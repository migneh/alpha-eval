const { EmbedBuilder } = require("discord.js");
const { db, ensureGuild } = require("../../utils/database");
const emojis = require("../../emojis");

module.exports = async (client, message, args) => {
  ensureGuild(message.guild.id);

  const member =
    message.mentions.members.first() || message.member;

  const points =
    db.guilds[message.guild.id].points[member.id] ?? 0;

  const embed = new EmbedBuilder()
    .setColor(0x3498db)
    .setTitle(`${emojis.points} نقاط الإداري`)
    .setThumbnail(member.displayAvatarURL({ dynamic: true }))
    .addFields({
      name: "النقاط الحالية",
      value: `**${points}** نقطة`
    })
    .setFooter({
      text: message.guild.name,
      iconURL: message.guild.iconURL({ dynamic: true })
    })
    .setTimestamp();

  message.channel.send({ embeds: [embed] });
};
