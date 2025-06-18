const axios = require("axios");

module.exports.config = {
  name: "bom",
  version: "1.3",
  hasPermssion: 0,
  credits: "Mostakim",
  prefix: false,
  description: "bom attack from 2 JSON sources",
  usages: "[count]",
  category: "tools",
  cooldowns: 5,
};

module.exports.run = async function ({ api, event, args }) {
  const { threadID, messageID } = event;

  if (module.exports.config.credits !== "Mostakim") {
    return api.sendMessage("❌ Don't remove credits!", threadID, messageID);
  }

  const url1 = "https://raw.githubusercontent.com/JUBAED-AHMED-JOY/Joy/refs/heads/main/bom.json";
  const url2 = "https://raw.githubusercontent.com/JUBAED-AHMED-JOY/Joy/refs/heads/main/bom2.json";

  try {
    const [res1, res2] = await Promise.all([
      axios.get(url1),
      axios.get(url2)
    ]);

    const message1 = res1.data.message || "💣 বোম ১ ফাটলো!";
    const message2 = res2.data.message || "🔥 বোম ২ ফাটলো!";

    const amount = parseInt(args[0]) || 5;
    const limit = amount > 50 ? 50 : amount;

    api.sendMessage(`💥 শুরু হচ্ছে ${limit} বার বোম হামলা...`, threadID);

    for (let i = 0; i < limit; i++) {
      setTimeout(() => {
        api.sendMessage(message1, threadID);
        setTimeout(() => {
          api.sendMessage(message2, threadID);
        }, 1500);
      }, i * 3000); // প্রতি ৩ সেকেন্ড পর পর একসেট পাঠাবে
    }

  } catch (error) {
    api.sendMessage("❌ GitHub JSON থেকে বার্তা নিতে সমস্যা হয়েছে!", threadID, messageID);
    console.error("BOM ERROR:", error);
  }
};
