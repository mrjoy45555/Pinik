const axios = require("axios");

module.exports = {
  config: {
    name: "gift",
    aliases: [],
    version: "1.1",
    author: "Mostakim", // 🔒 Don't change
    countDown: 5,
    role: 3, // Only bot admin or root
    shortDescription: "Bom attack using remote JSON",
    longDescription: "Performs simulated bom attack by fetching remote JSON APIs multiple times",
    category: "tools",
    guide: {
      en: "{pn} <count>",
    },
  },

  onStart: async function ({ api, event, args }) {
    const { threadID, messageID } = event;

    // 🔒 Protect original credit
    if (module.exports.config.author !== "Mostakim") {
      return api.sendMessage("❌ Pok ।", threadID, messageID);
    }

    let count = parseInt(args[0]);
    if (isNaN(count) || count <= 0) {
      return api.sendMessage("⚠️ সঠিকভাবে সংখ্যা দাও যেমন: bom 10", threadID, messageID);
    }

    if (count > 50) count = 50;

    const urls = [
      "https://raw.githubusercontent.com/Alifhosson/ALIF-BOT.json/refs/heads/main/bom2.json",
      "https://raw.githubusercontent.com/dipto-008/D1PT0/refs/heads/main/bom.json"
    ];

    let success = 0, fail = 0;

    for (let i = 0; i < count; i++) {
      const url = urls[Math.floor(Math.random() * urls.length)];
      try {
        await axios.get(url);
        success++;
      } catch (err) {
        fail++;
      }
      await new Promise(resolve => setTimeout(resolve, 1000)); // 1 sec delay per hit
    }

    return api.sendMessage(
      `✅ বোমিং সম্পন্ন:\nসফল: ${success} বার\nব্যর্থ: ${fail} বার`,
      threadID,
      messageID
    );
  },
};
