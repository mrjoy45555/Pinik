module.exports.config = {
  name: "autoreact",
  version: "1.0.1",
  role: 0,
  credits: "Joy Ahmed",
  prefix: "true",
  description: {
    en: "Enable or disable auto-reactions in the thread"
  },
  category: "system",
  usages: "{pn} on/off",
  cooldowns: 5
};

module.exports.handleEvent = async function ({ api, event }) {
  const { threadID, messageID, senderID } = event;

  // বট নিজে যেন রিঅ্যাক্ট না করে
  if (senderID === api.getCurrentUserID()) return;

  const data = global.data.threadData.get(threadID) || {};
  if (data.autoreact !== true) return;

  // র্যান্ডম রিঅ্যাক্ট ইমোজি (বর্ধিত তালিকা)
  const reacts = [
    "❤️", "😆", "😮", "😢", "👍", "😡", "😂", "🥰", "😍", "🤣", "🔥", "💯",
    "🤩", "😎", "🫶", "👌", "🙏", "😇", "🫡", "🎉", "🥳", "💖", "😋", "💥",
    "💔", "💘", "👀", "🙌", "🤯", "💤", "😴", "🤫", "🤐", "😐", "🤔", "😶",
    "🤗", "😜", "😛", "😏", "😤", "😈", "😺", "😸", "😹"
  ];

  const emoji = reacts[Math.floor(Math.random() * reacts.length)];
  return api.setMessageReaction(emoji, messageID, threadID, true);
};

module.exports.run = async function ({ api, event, args, Threads }) {
  const { threadID, messageID } = event;
  const data = (await Threads.getData(threadID)).data || {};

  if (args[0] === "on") {
    data.autoreact = true;
    await Threads.setData(threadID, { data });
    global.data.threadData.set(threadID, data);
    return api.sendMessage("✅ AutoReact is now enabled for this thread.", threadID, messageID);
  }

  if (args[0] === "off") {
    data.autoreact = false;
    await Threads.setData(threadID, { data });
    global.data.threadData.set(threadID, data);
    return api.sendMessage("❌ AutoReact is now disabled for this thread.", threadID, messageID);
  }

  return api.sendMessage("⚠️ Usage: autoreact on/off", threadID, messageID);
};
