module.exports.config = {
  name: "ban",
  version: "1.0.2",
  permission: 2,
  credits: "Joy",
  prefix: "true",
  description: "Ban a user and prevent them from using commands or sending messages.",
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

  // Optional: Reply directly to user's message if reply used
  if (event.type === "message_reply") {
    api.sendMessage("🚫 You have been banned from using this bot.", event.threadID, event.messageReply.messageID);
  }

  return api.sendMessage(`✅ User ${uid} has been banned.`, event.threadID, event.messageID);
};

// Block all messages from banned users (auto-reply)
module.exports.handleEvent = async function({ api, event }) {
  global.banList = global.banList || [];

  if (global.banList.includes(event.senderID)) {
    return api.sendMessage("⛔ You are banned from interacting in this group.", event.threadID, event.messageID);
  }
};

// Block all command execution for banned users
module.exports.beforeRun = async function({ event }) {
  global.banList = global.banList || [];

  if (global.banList.includes(event.senderID)) {
    return false; // Prevent any command from running
  }

  return true; // Allow others
};
