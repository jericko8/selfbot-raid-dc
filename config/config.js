// config.js
require('dotenv').config();
const fs = require('fs');

const {
  TOKEN,
  CHANNEL_ID,
  GUILD_ID,
  WATCH_USER_IDS,
  LOUNGE
} = process.env;

if (!TOKEN || !CHANNEL_ID || !GUILD_ID || !WATCH_USER_IDS || !LOUNGE) {
  console.error('❗ Pastikan .env berisi TOKEN, CHANNEL_ID, GUILD_ID, WATCH_USER_IDS');
  process.exit(1);
}

const WATCH_IDS = WATCH_USER_IDS.split(',').map(id => id.trim()).filter(Boolean);

let MESSAGES;
try {
  MESSAGES = fs.readFileSync('kata.txt', 'utf8')
    .split(/\r?\n/)
    .map(l => l.trim())
    .filter(Boolean);
  if (!MESSAGES.length) throw new Error('kata.txt kosong');
} catch (e) {
  console.error('❗ Gagal baca kata.txt:', e.message);
  process.exit(1);
}

module.exports = { TOKEN, CHANNEL_ID, GUILD_ID, WATCH_IDS, MESSAGES, LOUNGE };