module.exports = {
  config: {
    name: "ban",
    aliases: ["block"],
    version: "1.0.1",
    permission: 2,
    credits: "Joy",
    prefix: "true"
    description: "Ban a user and auto-reply when they message in group.",
    category: "moderation",
    cooldowns: 3
  },

  onStart: async function ({ api, event, args }) {
    const uid = event.type === "message_reply" ? event.messageReply.senderID : args[0];

    if (!uid || isNaN(uid)) return api.sendMessage("❌ Reply to a message or provide a valid user ID.", event.threadID);

    global.banList = global.banList || [];

    if (global.banList.includes(uid)) {
      return api.sendMessage("⚠️ This user is already banned.", event.threadID);
    }

    global.banList.push(uid);
    return api.sendMessage(`✅ User ${uid} has been banned.`, event.threadID);
  },

  onMessage: async function ({ api, event }) {
    global.banList = global.banList || [];

    if (global.banList.includes(event.senderID)) {
      return api.sendMessage("⛔ You are banned from interacting in this group.", event.threadID);
    }
  }
};
