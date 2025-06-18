module.exports = {
  config: {
    name: "out",
    version: "1.0.0",
    credits: "Joy Ahmed",
    description: "Remove bot from group",
    category: "admin",
    permission: 2, // Only bot admins or group admins
    cooldowns: 3
  },

  onStart: async function ({ message, event, api }) {
    const threadID = event.threadID;

    // Optional: Check if user is group admin (only for group)
    try {
      const threadInfo = await api.getThreadInfo(threadID);
      const isGroup = threadInfo.isGroup;

      if (!isGroup) {
        return message.reply("❌ This command only works in group chats.");
      }

      const senderID = event.senderID;
      const admins = threadInfo.adminIDs.map(admin => admin.id);

      if (!admins.includes(senderID)) {
        return message.reply("🚫 Only group admins can use this command.");
      }

      await message.reply("👋 Leaving the group... Bye!");
      setTimeout(() => {
        api.removeUserFromGroup(api.getCurrentUserID(), threadID);
      }, 2000);

    } catch (error) {
      console.error("Failed to leave group:", error);
      message.reply("⚠️ Failed to leave the group. Try again later.");
    }
  }
};
