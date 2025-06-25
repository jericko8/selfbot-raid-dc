const RED = '\x1b[31m';
const YELLOW = '\x1b[33m';
const RESET = '\x1b[0m';
const GREEN = '\x1b[32m';

// sender.js
async function sendAndDelete(channel, cycle, MESSAGES) {
  const text = MESSAGES[Math.floor(Math.random() * MESSAGES.length)];
  try {
    const msg = await channel.send(text);
    console.log(`📤 [#${cycle}] ${new Date().toLocaleTimeString()} → "${text}"`);
    await msg.delete();
    console.log(`${GREEN}✅ Sukses kirim & hapus pesan ke #${cycle}`);
  } catch (e) {
    console.error(`${RED}❗ [#${cycle}] Gagal kirim/hapus pesan:`, e);
  }
}

module.exports = { sendAndDelete };