const fs = require("fs-extra");
const path = require("path");

const configPath = path.join(__dirname, "..", "..", "config.json");
let config = require(configPath);

module.exports = {
  name: "admins",
  version: "2.0.0",
  permission: 0,
  credits: "Ryuko + Modified by Joy",
  prefix: false,
  premium: false,
  description: "Show group/bot admins or add/remove bot admins",
  category: "without prefix",
  usages: "admins [add/remove/listbot] [@tag/reply/uid]",
  cooldowns: 5,
  dependencies: [],
};

module.exports.run = async function ({ api, event, args, Users }) {
  const { threadID, messageID, senderID, mentions, messageReply } = event;
  const send = (msg) => api.sendMessage(msg, threadID, messageID);
  const subCmd = args[0];

  const threadInfo = await api.getThreadInfo(threadID);
  const threadAdmins = threadInfo.adminIDs;

  if (!subCmd || subCmd === "list") {
    // Show both group admins & bot admins
    let count = 1;
    let groupList = "";
    for (const ad of threadAdmins) {
      const userInfo = await api.getUserInfo(ad.id);
      groupList += `${count++}. ${userInfo[ad.id].name} (${ad.id})\n`;
    }

    let botList = "";
    if (config.adminBot.length === 0) {
      botList = "No bot admins added.";
    } else {
      const botAdmins = await Promise.all(
        config.adminBot.map(async (uid, index) => {
          const name = await Users.getName(uid).catch(() => null);
          return `${index + 1}. ${name || "Unknown"} (${uid})`;
        })
      );
      botList = botAdmins.join("\n");
    }

    return send(
      `👑 Group Admins (${threadAdmins.length}):\n${groupList}\n\n🤖 Bot Admins (${config.adminBot.length}):\n${botList}`
    );
  }

  // Proceed with bot admin add/remove
  if (!["add", "-a", "remove", "-r", "listbot"].includes(subCmd)) {
    return send(
      "❌ Invalid sub-command.\n\nUse:\n• admins — Show all admins\n• admins listbot — Show bot admins only\n• admins add @tag/reply/uid — Add bot admin\n• admins remove @tag/reply/uid — Remove bot admin"
    );
  }

  // Just list bot admins
  if (subCmd === "listbot") {
    if (config.adminBot.length === 0) return send("🤖 No bot admins set.");
    const botAdmins = await Promise.all(
      config.adminBot.map(async (uid, index) => {
        const name = await Users.getName(uid).catch(() => null);
        return `${index + 1}. ${name || "Unknown"} (${uid})`;
      })
    );
    return send(`🤖 Bot Admins (${config.adminBot.length}):\n${botAdmins.join("\n")}`);
  }

  // Add/Remove logic
  let uids = [];

  if (Object.keys(mentions).length > 0) {
    uids = Object.keys(mentions);
  } else if (messageReply) {
    uids.push(messageReply.senderID);
  } else {
    uids = args.slice(1).filter(arg => !isNaN(arg));
  }

  if (uids.length === 0) return send("⚠️ Please tag, reply, or provide UID.");

  const added = [];
  const already = [];
  const removed = [];
  const notFound = [];

  if (["add", "-a"].includes(subCmd)) {
    for (const uid of uids) {
      if (!config.adminBot.includes(uid)) {
        config.adminBot.push(uid);
        added.push(uid);
      } else {
        already.push(uid);
      }
    }
  } else if (["remove", "-r"].includes(subCmd)) {
    for (const uid of uids) {
      if (config.adminBot.includes(uid)) {
        config.adminBot = config.adminBot.filter(id => id !== uid);
        removed.push(uid);
      } else {
        notFound.push(uid);
      }
    }
  }

  fs.writeFileSync(configPath, JSON.stringify(config, null, 2));

  const getNameList = async (arr) =>
    await Promise.all(
      arr.map(async (uid) => {
        const name = await Users.getName(uid).catch(() => null);
        return `• ${name || "Unknown"} (${uid})`;
      })
    );

  let msg = "";

  if (added.length > 0) {
    const lines = await getNameList(added);
    msg += `✅ Added as bot admin:\n${lines.join("\n")}\n`;
  }

  if (already.length > 0) {
    const lines = await getNameList(already);
    msg += `⚠️ Already bot admin:\n${lines.join("\n")}\n`;
  }

  if (removed.length > 0) {
    const lines = await getNameList(removed);
    msg += `✅ Removed from bot admin:\n${lines.join("\n")}\n`;
  }

  if (notFound.length > 0) {
    const lines = await getNameList(notFound);
    msg += `⚠️ Not in admin list:\n${lines.join("\n")}`;
  }

  return send(msg.trim());
};
