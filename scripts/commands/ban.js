module.exports.config = {
  name: "ban",
  version: "1.0.1",
  permission: 2,
  credits: "Joy",
  prefix: true,
  description: "Ban a user and auto-reply when they message in group.",
  category: "moderation",
  usages: "[reply/userID]",
  cooldowns: 3
};

global.banList = global.banList || [];

module.exports.run = async function({ api, event, args }) {
  const uid = event.type === "message_reply"
    ? event.messageReply.senderID
    : args[0];

  if (!uid || isNaN(uid)) {
    return api.sendMessage("❌ Reply to a message or provide a valid user ID.", event.threadID, event.messageID);
  }

  if (global.banList.includes(uid)) {
    return api.sendMessage("⚠️ This user is already banned.", event.threadID, event.messageID);
  }

  global.banList.push(uid);
  return api.sendMessage(`✅ User ${uid} has been banned.`, event.threadID, event.messageID);
};

// Auto reply when banned user sends message
module.exports.handleEvent = async function({ api, event }) {
  global.banList = global.banList || [];

  if (global.banList.includes(event.senderID)) {
    return api.sendMessage("⛔ You are banned from interacting in this group.", event.threadID, event.messageID);
  }
};
