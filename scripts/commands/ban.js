module.exports.config = {
  name: "ban",
  version: "1.0.3",
  permission: 2,
  credits: "Joy",
  prefix: true,
  description: "Ban a user and prevent them from using commands or sending messages.",
  category: "moderation",
  usages: "[reply/userID]",
  cooldowns: 3
};

// Banlist and message index tracking
global.banList = global.banList || [];
global.banMessageIndex = global.banMessageIndex || {};

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
  global.banMessageIndex[uid] = 0;

  if (event.type === "message_reply") {
    api.sendMessage("🚫 You have been banned from using this bot.", event.threadID, event.messageReply.messageID);
  }

  return api.sendMessage(`✅ User ${uid} has been banned.`, event.threadID, event.messageID);
};

// Auto-reply with different messages on each interaction
module.exports.handleEvent = async function({ api, event }) {
  const uid = event.senderID;
  global.banList = global.banList || [];
  global.banMessageIndex = global.banMessageIndex || {};

  if (global.banList.includes(uid)) {
    const index = global.banMessageIndex[uid] || 0;
    const message = messages[index];

    // Update index for next time
    global.banMessageIndex[uid] = (index + 1) % messages.length;

    return api.sendMessage(message, event.threadID, event.messageID);
  }
};

// Prevent all command execution by banned users
module.exports.beforeRun = async function({ event }) {
  global.banList = global.banList || [];

  return !global.banList.includes(event.senderID);
};
