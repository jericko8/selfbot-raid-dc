// bot.js
const { Client, Intents } = require('discord.js-selfbot-v13');
const readline = require('readline');
const RED = '\x1b[31m';
const YELLOW = '\x1b[33m';
const RESET = '\x1b[0m';
const GREEN = '\x1b[32m';

const {
  TOKEN,
  CHANNEL_ID,
  GUILD_ID,
  WATCH_IDS,
  MESSAGES,
  LOUNGE
} = require('./config/config');
const { sendAndDelete } = require('./config/sender');
const { setupMonitoring } = require('./config/monitor');

// input interval
const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
function parseInterval(str) {
  const m = str.trim().match(/^(\d+(\.\d+)?)([sm])$/i);
  if (!m) return null;
  return parseFloat(m[1]) * (m[3].toLowerCase() === 's' ? 1000 : 60000);
}

console.log(`${GREEN}
===========================
  Badut Discord Selfbot
===========================
`);

rl.question(`${YELLOW}⏱ Masukkan interval (20s s untuk detik atau 1.5m m untuk menit ): `, ans => {
  const ms = parseInterval(ans);
  if (!ms || ms <= 0) {
    console.error(`${RED}❗ Format salah. ${RESET}Gunakan contoh: "20s" atau "1.5m"`);
    process.exit(1);
  }
  rl.close();

  const client = new Client({
    checkUpdate: false,
    intents: [
      Intents.FLAGS.GUILDS,
      Intents.FLAGS.GUILD_MESSAGES,
      Intents.FLAGS.MESSAGE_CONTENT
    ],
    partials: ['CHANNEL', 'GUILD_MEMBER']
  });

  client.once('ready', async () => {
    console.log(`${GREEN}✅ Logged in sebagai ${client.user.tag}`);

    const channel = await client.channels.fetch(CHANNEL_ID);
    if (!channel.isText()) {
      console.error(`${RED}🚫 Channel bukan teks`);
      process.exit(1);
    }

    let cycle = 0;
    await sendAndDelete(channel, ++cycle, MESSAGES);
    setInterval(() => sendAndDelete(channel, ++cycle, MESSAGES), ms);

    // monitoring banyak user
    try {
      await setupMonitoring(client, CHANNEL_ID, GUILD_ID, WATCH_IDS);
      console.log(`📍 Monitoring user IDs: ${WATCH_IDS.join(', ')}`);
    } catch (e) {
      console.error('❗ Gagal setup monitoring:', e);
    }
  });

  client.login(TOKEN);
});