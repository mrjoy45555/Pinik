const axios = require("axios");

module.exports = {
  config: {
    name: "bom",
    version: "1.0.0",
    credits: "Rahad (converted for Botpack by Joy)",
    prefix: true,
    permission: 2,
    description: "Sends a message multiple times with a delay.",
    category: "fun",
    cooldowns: 5
  },

  onStart: async function ({ message, event, args }) {
    const userId = event.senderID;

    try {
      // Fetch admin list from GitHub
      const githubResponse = await axios.get('https://raw.githubusercontent.com/JUBAED-AHMED-JOY/Joy/refs/heads/main/admins.json');
      const approvedAdmins = githubResponse.data.adminUIDs;

      if (!approvedAdmins.includes(userId)) {
        return message.reply(
          `𝐘𝐨𝐮 𝐝𝐨 𝐧𝐨𝐭 𝐡𝐚𝐯𝐞 𝐩𝐞𝐫𝐦𝐢𝐬𝐬𝐢𝐨𝐧 𝐭𝐨 𝐮𝐬𝐞 𝐭𝐡𝐢𝐬 𝐜𝐨𝐦𝐦𝐚𝐧𝐝.\n` +
          `\n(𝗔𝗱𝗺𝗶𝗻) JOY AHMED\n` +
          `(🔵): m.me/100001435123762\n` +
          `(🔵𝗙𝗯): https://www.facebook.com/100001435123762`
        );
      }
    } catch (err) {
      console.error("Error verifying admin list:", err.message);
      return message.reply("Could not verify admin status. Please try again later.");
    }

    const times = parseInt(args[0]);
    if (!args[0] || isNaN(times) || times <= 0) {
      return message.reply("Please provide a valid number of spam messages.");
    }

    try {
      const response = await axios.get('https://raw.githubusercontent.com/JUBAED-AHMED-JOY/Joy/refs/heads/main/bom.json');
      const msg = response.data.message;

      message.reply("Spam starting...😁🖕");

      setTimeout(() => {
        let count = 0;

        const spamInterval = setInterval(() => {
          if (count >= times) {
            clearInterval(spamInterval);
            return;
          }

          message.reply(`${msg}`);
          count++;
        }, 5000);
      }, 5000);
    } catch (err) {
      console.error("Error fetching spam message:", err.message);
      message.reply("Failed to fetch message. Please try again later.");
    }
  }
};
