module.exports = async (message, input) => {
  const members = new Map();

  message.mentions.members.forEach(m => {
    members.set(m.id, m);
  });

  const parts = input.split(/\s+/).map(t =>
    t.replace(/[<@!>]/g, "")
  );

  for (const id of parts) {
    if (!/^\d{17,20}$/.test(id)) continue;

    let member =
      message.guild.members.cache.get(id) ||
      (await message.guild.members.fetch(id).catch(() => null));

    if (member) members.set(member.id, member);
  }

  return [...members.values()];
};
