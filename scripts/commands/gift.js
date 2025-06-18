const axios = require("axios");

module.exports.config = {
  name: "gift",
  version: "1.1",
  hasPermssion: 2,
  credits: "Mostakim",
  prefix: false,
  description: "bom attack",
  usages: "[count]",
  category: "tools",
  cooldowns: 5,
};

module.exports.run = async function ({ api, event, args }) {
  const { threadID, messageID } = event;

  
  if (module.exports.config.credits !== "Mostakim") {
    return api.sendMessage("❌ POK U ।", threadID, messageID);
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
    } catch (e) {
      fail++;
    }
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  return api.sendMessage(`✅ বোমিং সম্পন্ন\nসফল: ${success}\nব্যর্থ: ${fail}`, threadID, messageID);
};
