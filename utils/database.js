const fs = require("fs");

const path = "./data.json";
let db = { guilds: {} };

if (fs.existsSync(path)) {
  db = JSON.parse(fs.readFileSync(path));
}

function ensureGuild(guildId) {
  if (!db.guilds[guildId]) {
    db.guilds[guildId] = {
      points: {},
      pointsHistory: {},
      config: {
        allowedRole: null,
        adminPointsRole: null,
        logChannel: null
      }
    };
  }
}

function saveDB() {
  fs.writeFileSync(path, JSON.stringify(db, null, 2));
}

module.exports = { db, ensureGuild, saveDB };
