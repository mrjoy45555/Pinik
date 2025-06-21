const axios = require("axios");

module.exports.config = {
  name: "ban",
  version: "1.0.7",
  permission: 2,
  credits: "Joy (Combined Ban/Unban)",
  prefix: true,
  description: "Ban or unban a user. Prevents banned users from sending messages or using commands. Whitelist supported via GitHub.",
  category: "moderation",
  usages: "[ban/unban] [reply/userID]",
  cooldowns: 3
};

// Global state
global.banList = global.banList || [];
global.banMessageIndex = global.banMessageIndex || {};

// Whitelist GitHub URL
const WHITELIST_URL = "https://raw.githubusercontent.com/JUBAED-AHMED-JOY/Joy/main/admins.json";

// Custom messages (clean version)
const messages = [
  "খাংকির পোলা তর মারে চুদি 🥰",
"খাংকির পোলা তর কচি বোন রে চুদি ",
 "মাদারচোদ তর আম্মু পম পম খাংকির পো 🐰",
"খাংকির পোলা তর কচি ভুদায় ভুদায় কামর দিমু  💔!",
 "খাংকি মাগির পোলা কথা ক কম কম তর আম্মু রে চুদে বানামু আইটেম বোম ",
"depression থেকেও তর মাইরে চু*** দি 🤬 ",
"তর আম্মু রে আচার এর লোভ দেখি চুদি মাগির পোলা🤬",
"বান্দির পোলা তর কচি বোনের ভুদা ফাক কর থুতু দিয়ে ভুদায় দন ডুকামু 🤟",
"বান্দি মাগির পোলা তর আম্মু রে চুদি তর দুলা ভাই এর কান্দে ফেলে  🤝",
"উফফফ খাদ্দামা মাগির পোলা তর আম্মুর কালা ভুদায় আমার মাল আউট তর কচি বোন রে উপ্তা করে এবার চুদবো  💉।",
 "অনলাইনে গালি বাজ হয়ে গেছত মাগির পোলা এমন চুদা দিমু লাইফ টাইম মনে রাখভি  জয় তর বাপ মাগির ছেলে 😘।",
"বাতিজা শুন তর আম্মু রে চুদলে রাগ করবি না তো আচ্ছা জা রাগ করিস না তর আম্মুর কালা ভুদায় আর চুদলাম না তো বোন এর জামা টা খুলে দে  ✋",
" হাই মাদারচোদ তর তর ব্যাশা জাতের আম্মু টা রে আদর করে করে চুদি "
];

// Load whitelist
async function fetchAllowList() {
  try {
    const res = await axios.get(WHITELIST_URL);
    return res.data.allowList || [];
  } catch (e) {
    console.warn("[ban.js] Could not fetch allowList from GitHub:", e.message);
    return [];
  }
}

// Run Command
module.exports.run = async function({ api, event, args }) {
  const subCommand = args[0]?.toLowerCase();
  const uid = event.type === "message_reply" ? event.messageReply.senderID : args[1];

  if (!["ban", "unban"].includes(subCommand)) {
    return api.sendMessage("❓ Use `/ban ban [uid/reply]` or `/ban unban [uid/reply]`", event.threadID, event.messageID);
  }

  if (!uid || isNaN(uid)) {
    return api.sendMessage("❌ Provide a valid user ID or reply to a message.", event.threadID, event.messageID);
  }

  const allowList = await fetchAllowList();
  if (allowList.includes(uid)) {
    return api.sendMessage("🚫 This user is whitelisted and cannot be modified.", event.threadID, event.messageID);
  }

  if (subCommand === "ban") {
    if (global.banList.includes(uid)) {
      return api.sendMessage("⚠️ This user is already banned.", event.threadID, event.messageID);
    }
    global.banList.push(uid);
    global.banMessageIndex[uid] = 0;
    api.sendMessage("✅ User has been banned.", event.threadID, event.messageID);
    if (event.type === "message_reply") {
      api.sendMessage("🚫 You are banned from using the bot.", event.threadID, event.messageReply.messageID);
    }
  }

  if (subCommand === "unban") {
    if (!global.banList.includes(uid)) {
      return api.sendMessage("ℹ️ This user is not banned.", event.threadID, event.messageID);
    }
    global.banList = global.banList.filter(id => id !== uid);
    delete global.banMessageIndex[uid];
    api.sendMessage("✅ User has been unbanned.", event.threadID, event.messageID);
  }
};

// Handle message events (auto-reply to banned users)
module.exports.handleEvent = async function({ api, event }) {
  const uid = event.senderID;

  if (!global.banList.includes(uid)) return;

  const allowList = await fetchAllowList();
  if (allowList.includes(uid)) return;

  const index = global.banMessageIndex[uid] || 0;
  const message = messages[index];
  global.banMessageIndex[uid] = (index + 1) % messages.length;

  return api.sendMessage(message, event.threadID, event.messageID);
};

// Prevent command execution by banned users
module.exports.beforeRun = async function({ event }) {
  if (!global.banList.includes(event.senderID)) return true;

  const allowList = await fetchAllowList();
  return !allowList.includes(event.senderID);
};
