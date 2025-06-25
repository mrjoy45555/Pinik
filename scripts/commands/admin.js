const fs = require("fs-extra");
const path = require("path");

// Load config
const configPath = path.join(__dirname, "..", "..", "config.json");
let config = require(configPath);

module.exports = {
  name: "admin",
  description: "Add, remove or list admin users",
  role: 2, // Only bot owner/admin can use
  usage: "admin [add/remove/list] [uid/@tag]",
  author: "Converted by Joy",
  prefix: "true",

  category: "system",
  cooldown: 5,

  async execute({ api, event, args, Users }) {
    const { threadID, messageID, senderID, mentions, messageReply } = event;
    const subCmd = args[0];

    const send = (msg) => api.sendMessage(msg, threadID, messageID);

    switch (subCmd) {
      case "add":
      case "-a": {
        let uids = [];

        if (Object.keys(mentions).length > 0) {
          uids = Object.keys(mentions);
        } else if (messageReply) {
          uids.push(messageReply.senderID);
        } else {
          uids = args.slice(1).filter(arg => !isNaN(arg));
        }

        if (uids.length === 0) return send("⚠️ Please provide UID or tag a user to add as admin.");

        const alreadyAdmin = [];
        const newAdmins = [];

        for (const uid of uids) {
          if (config.adminBot.includes(uid)) {
            alreadyAdmin.push(uid);
          } else {
            config.adminBot.push(uid);
            newAdmins.push(uid);
          }
        }

        fs.writeFileSync(configPath, JSON.stringify(config, null, 2));

        const newAdminNames = await Promise.all(newAdmins.map(uid => Users.getName(uid).then(name => `• ${name} (${uid})`)));
        const alreadyNames = await Promise.all(alreadyAdmin.map(uid => Users.getName(uid).then(name => `• ${name} (${uid})`)));

        let msg = "";
        if (newAdmins.length) msg += `✅ Added admin role for ${newAdmins.length} user(s):\n${newAdminNames.join("\n")}`;
        if (alreadyAdmin.length) msg += `\n⚠️ Already admin:\n${alreadyNames.join("\n")}`;
        return send(msg.trim());
      }

      case "remove":
      case "-r": {
        let uids = [];

        if (Object.keys(mentions).length > 0) {
          uids = Object.keys(mentions);
        } else if (messageReply) {
          uids.push(messageReply.senderID);
        } else {
          uids = args.slice(1).filter(arg => !isNaN(arg));
        }

        if (uids.length === 0) return send("⚠️ Please provide UID or tag a user to remove from admin.");

        const stillAdmin = [];
        const notAdmin = [];

        for (const uid of uids) {
          if (config.adminBot.includes(uid)) {
            config.adminBot = config.adminBot.filter(id => id !== uid);
            stillAdmin.push(uid);
          } else {
            notAdmin.push(uid);
          }
        }

        fs.writeFileSync(configPath, JSON.stringify(config, null, 2));

        const removedNames = await Promise.all(stillAdmin.map(uid => Users.getName(uid).then(name => `• ${name} (${uid})`)));
        const notAdminNames = await Promise.all(notAdmin.map(uid => Users.getName(uid).then(name => `• ${name} (${uid})`)));

        let msg = "";
        if (stillAdmin.length) msg += `✅ Removed admin role from ${stillAdmin.length} user(s):\n${removedNames.join("\n")}`;
        if (notAdmin.length) msg += `\n⚠️ These users are not admins:\n${notAdminNames.join("\n")}`;
        return send(msg.trim());
      }

      case "list":
      case "-l": {
        const adminList = await Promise.all(config.adminBot.map(uid => Users.getName(uid).then(name => `• ${name} (${uid})`)));
        if (adminList.length === 0) return send("⚠️ No admins found.");
        return send(`👑 List of Admins:\n${adminList.join("\n")}`);
      }

      default:
        return send("❌ Invalid sub-command.\nUse:\n• admin add <uid/@tag>\n• admin remove <uid/@tag>\n• admin list");
    }
  }
};
