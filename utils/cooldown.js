const cooldowns = new Map();

module.exports = (userId, command, time = 5000) => {
  const key = `${userId}-${command}`;
  const now = Date.now();

  if (cooldowns.has(key)) {
    const diff = now - cooldowns.get(key);
    if (diff < time) return time - diff;
  }

  cooldowns.set(key, now);
  return null;
};
