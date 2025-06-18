const axios = require("axios");

module.exports.config = {
  name: "gift",
  version: "1.4",
  hasPermssion: 2,
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

  const url1 = "https://raw.githubusercontent.com/Alifhosson/ALIF-BOT.json/refs/heads/main/bom.json";
  const url2 = "https://raw.githubusercontent.com/Alifhosson/ALIF-BOT.json/refs/heads/main/bom2.json";

  try {
    const [res1, res2] = await Promise.all([
      axios.get(url1),
      axios.get(url2)
    ]);

    const message1 = res1.data.message || "💣 বোম ১ ফাটলো!";
    const message2 = res2.data.message || "🔥 বোম ২ ফাটলো!";

    
    const userInput = parseInt(args[0]) || 5;
    const count = userInput > 50 ? 50 : userInput;

    api.sendMessage(`💥 শুরু হচ্ছে ${count} বার বোম হামলা...`, threadID);

    for (let i = 0; i < count; i++) {
      setTimeout(() => {
        const random = Math.random() < 0.5 ? message1 : message2;
        api.sendMessage(random, threadID);
      }, i * 2000); 
    }

  } catch (error) {
    api.sendMessage("❌ GitHub JSON থেকে বার্তা নিতে সমস্যা হয়েছে!", threadID, messageID);
    console.error("BOM ERROR:", error);
  }
};
