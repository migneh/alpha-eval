const { db, ensureGuild } = require("./database");
const emojis = require("../emojis");

module.exports = {
  canUse(message) {
    ensureGuild(message.guild.id);
    const cfg = db.guilds[message.guild.id].config;

    if (!cfg.allowedRole) {
      if (!message.member.permissions.has("Administrator")) {
        message.channel.send(
          `${emojis.error} لا تملك الصلاحيات`
        );
        return false;
      }
      return true;
    }

    if (!message.member.roles.cache.has(cfg.allowedRole)) {
      message.channel.send(
        `${emojis.error} لا تملك الرتبة المطلوبة`
      );
      return false;
    }

    return true;
  }
};
