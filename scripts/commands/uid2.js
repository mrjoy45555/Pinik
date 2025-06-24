const axios = require("axios");

module.exports = {
  config: {
    name: "uid2",
    aliases: ["fbid"],
    version: "1.1",
    author: "Joy Ahmed",
    prefix: "true",
    countDown: 5,
    role: 0,
    shortDescription: {
      en: "Get Facebook UID and profile link"
    },
    longDescription: {
      en: "Shows the UID and profile link of yourself, tagged person, or replied user."
    },
    category: "info",
    guide: {
      en: "{pn} or {pn} @mention"
    }
  },

  onStart: async function ({ api, event, message }) {
    let uid;

    if (event.type === "message_reply") {
      uid = event.messageReply.senderID;
    } else if (event.mentions && Object.keys(event.mentions).length > 0) {
      uid = Object.keys(event.mentions)[0];
    } else {
      uid = event.senderID;
    }

    let name = "Unknown User";
    try {
      const info = await api.getUserInfo(uid);
      name = info[uid]?.name || "Unknown User";
    } catch (e) {}

    const fbLink = `https://www.facebook.com/${uid}`;

    message.reply(`📌 Name: ${name}\n🔗 UID: ${uid}\n🌐 Profile: ${fbLink}`);
  }
};
