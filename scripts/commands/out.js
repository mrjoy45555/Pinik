module.exports = {
  config: {
    name: "out",
    version: "1.0",
    author: "Joy Ahmed",
    role: 2, // শুধু admin ইউজার ব্যবহার করতে পারবে
    shortDescription: "বটকে গ্রুপ থেকে বের করে দেয়",
    longDescription: "বটকে চলমান গ্রুপ থেকে বের করে দেয়",
    category: "group",
    usages: ".out",   // এখানে তোমার পছন্দের prefix সেট করো
    cooldowns: 5,
    prefix: ".",     // <-- এই লাইন দিয়ে prefix সেট করো
  },

  onStart: async function ({ api, event }) {
    const { threadID, messageID, isGroup } = event;

    if (!isGroup) {
      return api.sendMessage("❌ এই কমান্ডটি গ্রুপ চ্যাটে ব্যবহার করতে হবে!", threadID, messageID);
    }

    try {
      await api.sendMessage("👋 বাই! বট গ্রুপ থেকে বের হয়ে যাচ্ছে...", threadID, messageID);
      if (typeof api.removeUserFromGroup === "function") {
        return api.removeUserFromGroup(api.getCurrentUserID(), threadID);
      } else if (typeof api.leaveGroup === "function") {
        return api.leaveGroup(threadID);
      } else {
        return api.sendMessage("❌ বটের API তে গ্রুপ থেকে বের হওয়ার ফাংশন পাওয়া যায়নি।", threadID, messageID);
      }
    } catch (error) {
      return api.sendMessage("❌ বট গ্রুপ থেকে বের হতে পারেনি:\n" + error.message, threadID, messageID);
    }
  }
};
