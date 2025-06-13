const axios = require("axios");

module.exports = {
  config: {
    name: "fbinfo",
    version: "1.0",
    author: "Joy Ahmed",
    role: 0,
    shortDescription: "Facebook আইডি info দেখায়",
    longDescription: "কাউকে tag করলে বা UID দিলে Facebook profile info (name, link, profile pic) দেখাবে",
    category: "utility",
    usages: ".fbinfo @mention বা .fbinfo <uid>",
    cooldowns: 5,
    prefix: "."
  },

  onStart: async function ({ api, event, args }) {
    const { mentions, threadID, senderID, messageID } = event;
    let uid;

    // কাউকে mention করলে তার uid নাও
    if (Object.keys(mentions).length > 0) {
      uid = Object.keys(mentions)[0];
    } else if (args[0]) {
      uid = args[0];
    } else {
      uid = senderID; // নিজেকে দেখাও
    }

    try {
      // Free Mock API (public profile pic + name guess)
      const response = await axios.get(`https://graph.facebook.com/${uid}/picture?type=large&redirect=false`);
      const avatar = response.data.data.url;

      const nameGuess = `https://www.facebook.com/${uid}`;
      const infoMessage = `👤 Facebook Profile Info:
━━━━━━━━━━━━━━
🆔 UID: ${uid}
🔗 Profile: ${nameGuess}
🖼️ Profile Picture:`;

      return api.sendMessage({
        body: infoMessage,
        attachment: await global.utils.getStreamFromURL(avatar)
      }, threadID, messageID);
      
    } catch (err) {
      return api.sendMessage("❌ ইউজার খোঁজার সময় ত্রুটি হয়েছে বা mock API কাজ করছে না:\n" + err.message, threadID, messageID);
    }
  }
};
