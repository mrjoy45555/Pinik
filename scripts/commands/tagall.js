const axios = require("axios");

module.exports = {
  config: {
    name: "tagall",
    aliases: ["@all", "ata"],
    version: "1.0",
    permission: 1,
    credits: "Joy Ahmed",
    description: "Tag all members in the group",
    category: "group",
    usages: "[optional message]",
    cooldowns: 5,
  },

  onStart: async function ({ api, event, args }) {
    const threadID = event.threadID;

    // Get group info
    const threadInfo = await api.getThreadInfo(threadID);
    const mentions = [];
    const nameList = [];

    threadInfo.participantIDs.forEach((id) => {
      if (id !== api.getCurrentUserID()) {
        const member = threadInfo.userInfo.find(user => user.id === id);
        const name = member ? member.name : "Member";
        mentions.push({ tag: name, id: id });
        nameList.push(name);
      }
    });

    const message = args.join(" ") || "📢 Tagging everyone:";
    const finalMessage = `${message}\n\n👥 Total Tagged: ${mentions.length}`;

    return api.sendMessage({
      body: finalMessage,
      mentions
    }, threadID);
  }
};
