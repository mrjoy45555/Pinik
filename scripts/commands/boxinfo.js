const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  name: "boxinfo",
  version: "2.2.0",
  permission: 0,
  credits: "Joy",
  prefix: "true",
  description: "Show full thread info with emoji, icon, admin list, etc.",
  category: "utility",
  usages: "",
  cooldowns: 5,
  async run({ api, event }) {
    const threadID = event.threadID;
    const senderID = event.senderID;

    try {
      const threadInfo = await api.getThreadInfo(threadID);
      const userInfo = await api.getUserInfo(senderID);

      const threadName = threadInfo.threadName || "Unnamed Thread";
      const threadEmoji = threadInfo.emoji || "😊";
      const messageCount = threadInfo.messageCount || "Unknown";
      const participantCount = threadInfo.participantIDs.length || 0;
      const senderName = userInfo[senderID]?.name || "Unknown User";
      const approvalMode = threadInfo.approvalMode ? "✅ On" : "❌ Off";
      const threadIcon = threadInfo.imageSrc;

      // Admin list
      const adminIDs = threadInfo.adminIDs || [];
      const adminNames = [];
      for (const admin of adminIDs) {
        const info = await api.getUserInfo(admin.id);
        adminNames.push(info[admin.id]?.name || "Unknown");
      }
      const adminList = adminNames.length > 0 ? adminNames.join(", ") : "No admins";

      // Nicknames
      const nicknames = threadInfo.nicknames || {};
      let nicknameList = "None";
      if (Object.keys(nicknames).length > 0) {
        nicknameList = Object.entries(nicknames)
          .map(([uid, name]) => `${name}`)
          .join(", ");
      }

      // Main info message
      const infoMsg = 
`📥 THREAD INFORMATION

${threadEmoji} Thread Name: ${threadName}
🆔 Thread ID: ${threadID}
👤 Sender: ${senderName}
💬 Messages: ${messageCount}
👥 Participants: ${participantCount}
🛡️ Admins: ${adminList}
🏷️ Nicknames: ${nicknameList}
🛑 Approval Mode: ${approvalMode}`;

      // If there's a group icon, download and send with message
      if (threadIcon) {
        const iconPath = path.join(__dirname, `cache/group_icon_${threadID}.jpg`);
        const response = await axios.get(threadIcon, { responseType: "arraybuffer" });
        fs.writeFileSync(iconPath, Buffer.from(response.data, "utf-8"));

        api.sendMessage(
          {
            body: infoMsg,
            attachment: fs.createReadStream(iconPath)
          },
          threadID,
          () => fs.unlinkSync(iconPath) // delete after send
        );
      } else {
        // No icon, just send text
        api.sendMessage(infoMsg, threadID);
      }

    } catch (err) {
      console.error(err);
      api.sendMessage("❌ Could not fetch thread info.", threadID);
    }
  }
};
