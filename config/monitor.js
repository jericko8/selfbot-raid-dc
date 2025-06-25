const RED = '\x1b[31m';
const YELLOW = '\x1b[33m';
const RESET = '\x1b[0m';
const GREEN = '\x1b[32m';


// monitor.js
async function setupMonitoring(client, channelId, guildId, watchUserIds) {
  const guild = await client.guilds.fetch(guildId);

  // Fetch hanya member yang dipantau
  for (const id of watchUserIds) {
    try {
      await guild.members.fetch(id);
      console.log(`${YELLOW}✅ Member ${id} fetched`);
    } catch (e) {
      console.warn(`${RED}⚠️ Gagal fetch member ${id}:`, e.message);
    }
  }

  client.on('messageCreate', async msg => {
    if (msg.guild?.id === guildId && msg.channel.id === channelId) {
      const authorId = msg.author.id;
      const repliedMe = msg.reference && (await msg.fetchReference()).author.id === client.user.id;
      if (
        watchUserIds.includes(authorId) ||
        msg.mentions.users.has(client.user.id) ||
        repliedMe
      ) {
        console.log(`${RED}🚨 Deteksi aktivitas oleh ${msg.author.tag}`);
        client.destroy();
        process.exit(0);
      }
    }
  });

  client.on('typingStart', typing => {
    if (
      typing.guild?.id === guildId &&
      typing.channel.id === channelId &&
      watchUserIds.includes(typing.user.id)
    ) {
      console.log(`${RED}⌨️ User ${typing.user.id} mulai mengetik`);
      client.destroy();
      process.exit(0);
    }
  });
}

module.exports = { setupMonitoring };