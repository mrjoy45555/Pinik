const fs = require("fs");
const targetFile = __dirname + "/Joy/target.json";

// ফাইল না থাকলে তৈরি করো
if (!fs.existsSync(targetFile)) fs.writeFileSync(targetFile, JSON.stringify({}));

module.exports = {
  config: {
    name: "targetwelcome",
    version: "1.0",
    author: "Joy Ahmed",
    role: 2,
    shortDescription: "Tag someone to welcome on next message",
    longDescription: "Set a target user in group, who will get welcome message when they type",
    category: "fun",
    guide: "{pn} @mention"
  },

  onStart: async function ({ api, event }) {
    const { mentions, threadID } = event;
    const targetData = JSON.parse(fs.readFileSync(targetFile));

    if (!mentions || Object.keys(mentions).length === 0) {
      return api.sendMessage("⚠️ দয়া করে কাউকে tag করুন যাকে welcome জানাতে চান।", threadID, event.messageID);
    }

    const uid = Object.keys(mentions)[0];
    if (!targetData[threadID]) targetData[threadID] = [];

    if (!targetData[threadID].includes(uid)) {
      targetData[threadID].push(uid);
      fs.writeFileSync(targetFile, JSON.stringify(targetData, null, 2));
      return api.sendMessage(`✅ এখন ${mentions[uid]} যদি কিছু লেখে, বট তাকে welcome বলবে।`, threadID, event.messageID);
    } else {
      return api.sendMessage(`ℹ️ ${mentions[uid]} আগেই টার্গেট লিস্টে আছে।`, threadID, event.messageID);
    }
  },

  onChat: async function ({ event, api }) {
    const { threadID, senderID } = event;
    const targetData = JSON.parse(fs.readFileSync(targetFile));

    if (targetData[threadID] && targetData[threadID].includes(senderID)) {
      api.sendMessage(`🎉 স্বাগতম ${event.senderID}! তুমি আবার একটিভ হয়েছো!`, threadID);
      
      // একবার বলা হলে লিস্ট থেকে মুছে ফেলো
      targetData[threadID] = targetData[threadID].filter(id => id !== senderID);
      fs.writeFileSync(targetFile, JSON.stringify(targetData, null, 2));
    }
  }
};
