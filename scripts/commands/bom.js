const axios = require("axios");

module.exports = {
  config: {
    name: "bom",
    version: "1.1.0",
    credits: "Rahad (Enhanced by Joy for Botpack)",
    prefix: false,
    permission: 2,
    description: "Send spam message repeatedly with delay.",
    category: "fun",
    cooldowns: 5
  },

  onStart: async function ({ message, event, args }) {
    const userId = event.senderID;

    // Validate message count
    const times = parseInt(args[0]);
    if (!args[0] || isNaN(times) || times <= 0 || times > 50) {
      return message.reply("❌ Please provide a valid number of messages (1–50).\n\nExample: `bom 5`");
    }

    // Check admin from GitHub
    try {
      const adminRes = await axios.get('https://raw.githubusercontent.com/JUBAED-AHMED-JOY/Joy/refs/heads/main/admins.json');
      const approvedAdmins = adminRes.data.adminUIDs;

      if (!approvedAdmins.includes(userId)) {
        return message.reply(
          `🚫 You don't have permission to use this command.\n\n` +
          `👤 Admin: JOY AHMED\n` +
          `🔗 m.me/100001435123762\n` +
          `🌐 https://facebook.com/100001435123762`
        );
      }
    } catch (err) {
      console.error("Admin fetch error:", err.message);
      return message.reply("⚠️ Could not verify admin list from GitHub. Please try again later.");
    }

    // Fetch spam message content
    let msg;
    try {
      const msgRes = await axios.get('https://raw.githubusercontent.com/JUBAED-AHMED-JOY/Joy/refs/heads/main/bom.json');
      msg = msgRes.data.message;
    } catch (err) {
      console.error("Spam message fetch error:", err.message);
      return message.reply("❌ Failed to load spam message. Please try again later.");
    }

    // Spam initiation
    message.reply(`✅ Spam will start shortly... (${times} times)`);

    setTimeout(() => {
      let count = 0;
      const spamInterval = setInterval(() => {
        if (count >= times) {
          clearInterval(spamInterval);
          return message.reply("✅ Spam completed successfully.");
        }

        message.reply(`${msg}`);
        count++;
      }, 5000); // 5s delay between messages
    }, 3000); // Initial delay of 3s
  }
};
