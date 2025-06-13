const fs = require("fs");
const path = __dirname + "/../Joy.json";

module.exports = {
  config: {
    name: "adminadd",
    version: "1.0",
    author: "Joy Ahmed",
    role: 2,
    shortDescription: "নতুন অ্যাডমিন যোগ করুন",
    longDescription: "UID দিয়ে Merai bot-এ নতুন admin add করা যায়",
    category: "system",
    usages: ".adminadd <uid>",
    cooldowns: 5,
    prefix: "."
  },

  onStart: async function ({ api, event, args }) {
    if (!args[0]) return api.sendMessage("⚠️ দয়া করে একটি UID দিন!", event.threadID, event.messageID);

    const uid = args[0];
    const config = JSON.parse(fs.readFileSync(path));

    if (!config.admins.includes(uid)) {
      config.admins.push(uid);
      fs.writeFileSync(path, JSON.stringify(config, null, 2));
      return api.sendMessage(`✅ ${uid} এখন থেকে বট অ্যাডমিন।`, event.threadID, event.messageID);
    } else {
      return api.sendMessage("ℹ️ এই UID আগেই অ্যাডমিন লিস্টে আছে।", event.threadID, event.messageID);
    }
  }
};
