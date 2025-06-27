module.exports.config = {
  config: {
    name: "adminKick",
    eventType: ["log:unsubscribe"],
    version: "1.1.1",
    credits: "Joy",
    description: "Admin jokhon keu group theke bad dey, tokhon bangla funny message dey",
  },

  onEvent: async function ({ api, event }) {
    try {
      const { author, logMessageData, threadID } = event;

      // নিজে লিভ করলে ignore
      if (logMessageData.leftParticipantFbId === author) return;

      const kickedID = logMessageData.leftParticipantFbId;
      const kickerID = author;

      const [kickedUser, kickerUser] = await Promise.all([
        api.getUserInfo(kickedID),
        api.getUserInfo(kickerID),
      ]);

      const kickedName = kickedUser[kickedID]?.name || "অজানা ভিকটিম";
      const kickerName = kickerUser[kickerID]?.name || "অজানা অ্যাডমিন";

      // বাংলাদেশ সময়
      const now = new Date();
      const time = now.toLocaleString("bn-BD", {
        timeZone: "Asia/Dhaka",
        weekday: "long",
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      });

      // বাংলা funny মেসেজ লিস্ট
      const funnyMessages = [
        `😱 ও মা! ${kickerName} এক লাথিতে ${kickedName} কে গ্রুপ থেকে উড়িয়ে দিলো! 📤 (${time})`,
        `🤣 দুঃখিত ${kickedName}, তুমি এখন আর আমাদের মাঝে নেই! ${kickerName} তোমায় কিক করলো 😭 (${time})`,
        `🚪 ${kickedName} বেরিয়ে গেলো না, বের করে দেওয়া হলো! ${kickerName} বললো "চলে যা!" 😤 (${time})`,
        `🔥 ${kickerName} দিলো এক "ডাইরেক্ট কিক" আর ${kickedName} গেলো গ্রুপের বাইরে! 😂 (${time})`,
        `📢 ঘোষণা: ${kickedName} আজ ${time} তে ${kickerName} এর হাতে গ্রুপ থেকে বিদায় নিয়েছেন! 🥲`,
        `🎯 ${kickerName} এর নিশানা এতটাই পারফেক্ট, ${kickedName} সরাসরি আউট! 😆 (${time})`
      ];

      const msg = funnyMessages[Math.floor(Math.random() * funnyMessages.length)];

      api.sendMessage(msg, threadID);
    } catch (err) {
      console.error("❌ adminKick event error:", err);
    }
  }
};
