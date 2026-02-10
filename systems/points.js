const point = require("./points/point");
const points = require("./points/points");
const leaderboard = require("./points/leaderboard");
const settings = require("./points/settings");

module.exports = async (client, message) => {
  const args = message.content.trim().split(/\s+/);
  const cmd = args.shift().toLowerCase();

  if (cmd === ";point") return point(client, message);
  if (cmd === ";points") return points(client, message, args);
  if (cmd === ";top") return leaderboard(client, message);
  if (cmd === ";point-settings") return settings(client, message);
};
