const { writeFileSync } = require("fs-extra");

module.exports = {
  config: {
    name: "whitelists",
    aliases: ["wlonly", "onlywlst", "onlywhitelist", "wl"],
    version: "1.5",
    author: "Joy",
    prefix: true,
    cooldowns: 5,
    permission: 3,
    description: "Add, remove, edit whiteListIds role",
    category: "owner",
    usage: "[add/remove/list/m] [uid/@tag/on/off]",
  },

  onStart: async function ({ api, event, args, usersData }) {
    const config = global.configModule;
    const client = global.client;
    const { threadID, messageID, senderID, mentions, messageReply } = event;

    if (!config.adminBot.includes(senderID)) return api.sendMessage("❌ | You are not allowed to use this command!", threadID, messageID);

    switch (args[0]) {
      case "add":
      case "-a":
      case "+": {
        let uids = [];
        if (Object.keys(mentions).length > 0) {
          uids = Object.keys(mentions);
        } else if (messageReply) {
          uids.push(messageReply.senderID);
        } else {
          uids = args.slice(1).filter(id => !isNaN(id));
        }

        if (!uids.length) return api.sendMessage("⚠️ | Please enter UID(s) to add.", threadID, messageID);

        const notAdded = [];
        const alreadyAdded = [];

        for (const uid of uids) {
          if (config.whiteListMode.whiteListIds.includes(uid)) {
            alreadyAdded.push(uid);
          } else {
            config.whiteListMode.whiteListIds.push(uid);
            notAdded.push(uid);
          }
        }

        writeFileSync(client.dirConfig, JSON.stringify(config, null, 2));

        const getNames = await Promise.all(
          uids.map(uid => usersData.getName(uid).then(name => ({ uid, name })))
        );

        const addedMsg = notAdded.length
          ? `✅ Added ${notAdded.length} user(s):\n` +
            getNames
              .filter(({ uid }) => notAdded.includes(uid))
              .map(({ uid, name }) => `├‣ USER NAME: ${name}\n├‣ USER ID: ${uid}`)
              .join("\n")
          : "";

        const alreadyMsg = alreadyAdded.length
          ? `\n⚠️ Already added ${alreadyAdded.length} user(s):\n` +
            alreadyAdded.map(uid => `├‣ USER ID: ${uid}`).join("\n")
          : "";

        return api.sendMessage(addedMsg + alreadyMsg, threadID, messageID);
      }

      case "remove":
      case "-r":
      case "-": {
        let uids = [];
        if (Object.keys(mentions).length > 0) {
          uids = Object.keys(mentions);
        } else if (messageReply) {
          uids.push(messageReply.senderID);
        } else {
          uids = args.slice(1).filter(id => !isNaN(id));
        }

        if (!uids.length) return api.sendMessage("⚠️ | Please enter UID(s) to remove.", threadID, messageID);

        const removed = [];
        const notFound = [];

        for (const uid of uids) {
          const index = config.whiteListMode.whiteListIds.indexOf(uid);
          if (index !== -1) {
            config.whiteListMode.whiteListIds.splice(index, 1);
            removed.push(uid);
          } else {
            notFound.push(uid);
          }
        }

        writeFileSync(client.dirConfig, JSON.stringify(config, null, 2));

        const getNames = await Promise.all(
          removed.map(uid => usersData.getName(uid).then(name => ({ uid, name })))
        );

        const removedMsg = removed.length
          ? `✅ Removed ${removed.length} user(s):\n` +
            getNames.map(({ uid, name }) => `├‣ USER NAME: ${name}\n├‣ USER ID: ${uid}`).join("\n")
          : "";

        const notAddedMsg = notFound.length
          ? `\n⚠️ Not in whitelist:\n` +
            notFound.map(uid => `├‣ USER ID: ${uid}`).join("\n")
          : "";

        return api.sendMessage(removedMsg + notAddedMsg, threadID, messageID);
      }

      case "list":
      case "-l": {
        const getNames = await Promise.all(
          config.whiteListMode.whiteListIds.map(uid =>
            usersData.getName(uid).then(name => ({ uid, name }))
          )
        );
        const list = getNames
          .map(({ uid, name }) => `├‣ USER NAME: ${name}\n├‣ USER ID: ${uid}`)
          .join("\n");

        return api.sendMessage(`✨ Whitelist Users:\n${list}`, threadID, messageID);
      }

      case "m":
      case "mode":
      case "-m": {
        const submode = args[1];
        const status = args[2];

        if (submode === "noti") {
          if (status === "on") {
            config.hideNotiMessage.whiteListMode = false;
            api.sendMessage("✅ Notification ON when non-whitelisted users use bot.", threadID, messageID);
          } else if (status === "off") {
            config.hideNotiMessage.whiteListMode = true;
            api.sendMessage("❎ Notification OFF when non-whitelisted users use bot.", threadID, messageID);
          }
        } else {
          if (submode === "on") {
            config.whiteListMode.enable = true;
            api.sendMessage("✅ Only whitelisted users can use the bot now.", threadID, messageID);
          } else if (submode === "off") {
            config.whiteListMode.enable = false;
            api.sendMessage("❎ Whitelist mode disabled. All users can use the bot.", threadID, messageID);
          }
        }

        writeFileSync(client.dirConfig, JSON.stringify(config, null, 2));
        break;
      }

      default:
        return api.sendMessage("⚠️ | Invalid usage.\nTry: add/remove/list/m", threadID, messageID);
    }
  },
};
