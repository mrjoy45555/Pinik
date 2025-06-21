const axios = require("axios");

module.exports.config = {
  name: "bom",
  version: "1.4",
  permission: 2,
  credits: "Joy",
  prefix: false,
  description: "BOM attack with animated message effects",
  usages: "[count]",
  category: "fun",
  cooldowns: 5
};

module.exports.run = async function ({ api, event, args }) {
  const { threadID, messageID } = event;

  // ✅ Correct working raw GitHub URLs
  const url1 = "https://raw.githubusercontent.com/JUBAED-AHMED-JOY/Joy/main/bom.json";
  const url2 = "https://raw.githubusercontent.com/JUBAED-AHMED-JOY/Joy/main/bom2.json";

  try {
    const [res1, res2] = await Promise.all([
      axios.get(url1),
      axios.get(url2)
    ]);

    const raw1 = res1.data.message || "💣 বোম ফাটলো!";
    const raw2 = res2.data.message || "🔥 আরেকটা বোম পড়লো!";

    const animations = [
      "💥 BOOM!",
      "💣💨 দ্যাশে ফাটলো!",
      "🔥 আগুনে ঝলসে গেলো!",
      "🚀 ধুয়া ধুয়া!",
      "💫 মাটি কাপছে!",
      "💥 KABOOM!",
      "🧨 ঘর উড়ে গেল!",
      "⚡ Thunder strike!",
      "💀 RIP...",
      "🌪️ ঝড় তুলছে!"
    ];

    const count = Math.min(parseInt(args[0]) || 5, 50);
    api.sendMessage(`🧨 ${count} বার animated বোম শুরু হচ্ছে...`, threadID, messageID);

    for (let i = 0; i < count; i++) {
      setTimeout(() => {
        const animated1 = `${raw1} ${animations[Math.floor(Math.random() * animations.length)]}`;
        const animated2 = `${raw2} ${animations[Math.floor(Math.random() * animations.length)]}`;

        api.sendMessage(animated1, threadID);
        setTimeout(() => {
          api.sendMessage(animated2, threadID);
        }, 1500);
      }, i * 3000);
    }

  } catch (err) {
    console.error("BOM error:", err.message);
    api.sendMessage("❌ বোম ডেটা আনতে সমস্যা হয়েছে GitHub থেকে!", threadID, messageID);
  }
};
