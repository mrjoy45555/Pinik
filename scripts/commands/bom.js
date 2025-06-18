const axios = require("axios");

module.exports = {
  config: {
    name: "bom",
    version: "1.0.0",
    credits: "Rahad",
    prefix: false,
    permission: 2,
    description: "Sends a message multiple times with a delay.",
    category: "fun",
    cooldowns: 5
  },

  start: async function({ nayan, events, args }) {
    const userId = events.senderID;

    try {
      // Fetch the list of approved admin UIDs from GitHub
      const githubResponse = await axios.get('https://raw.githubusercontent.com/JUBAED-AHMED-JOY/Joy/refs/heads/main/admins.json');
      const approvedAdmins = githubResponse.data.adminUIDs;

      // Check if the user's UID is approved
      if (!approvedAdmins.includes(userId)) {
        return nayan.reply(
          `𝐘𝐨𝐮 𝐝𝐨 𝐧𝐨𝐭 𝐡𝐚𝐯𝐞 𝐩𝐞𝐫𝐦𝐢𝐬𝐬𝐢𝐨𝐧 𝐭𝐨 𝐮𝐬𝐞 𝐭𝐡𝐢𝐬 𝐜𝐨𝐦𝐦𝐚𝐧𝐝. 𝐌𝐞𝐬𝐬𝐚𝐠𝐞 𝐭𝐡𝐞 𝐚𝐝𝐦𝐢𝐧 𝐟𝐨𝐫 𝐚𝐩𝐩𝐫𝐨𝐯𝐞😗.\n` +
          `(𝗔𝗱𝗺𝗶𝗻) JOY AHMED\n\n` +
          `(🔵):m.me/100001435123762\n\n` +
          `(🔵𝗙𝗯):https://www.facebook.com/100001435123762`,
          events.threadID
        );
      }
    } catch (error) {
      console.error("Error fetching admin list from GitHub:", error.message);
      nayan.reply("Could not verify admin status. Please try again later.", events.threadID);
      return;
    }

    const times = parseInt(args[0]);

    // Validate the number of messages
    if (!args[0] || isNaN(times) || times <= 0) {
      return nayan.reply("Please provide a valid number of spam messages.", events.threadID);
    }

    try {
      // Fetch spam message from GitHub
      const response = await axios.get('https://raw.githubusercontent.com/JUBAED-AHMED-JOY/Joy/refs/heads/main/bom.json');
      const msg = response.data.message;

      // Notify that spam is starting
      nayan.reply(`Spam starting...😁🖕`, events.threadID);

      setTimeout(() => {
        let count = 0;

        const spamInterval = setInterval(() => {
          if (count >= times) {
            clearInterval(spamInterval);
            return;
          }

          nayan.reply(`${msg}`, events.threadID); // Send the message
          count++;
        }, 5000); // Send message every 5 seconds
      }, 5000); // Initial wait of 5 seconds

    } catch (error) {
      console.error("Error fetching message:", error.message);
      nayan.reply("Failed to fetch message. Please try again later.", events.threadID);
    }
  }
};
