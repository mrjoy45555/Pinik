module.exports = {
  config: {
    name: "report",
    version: "1.0.0",
    permission: 0,
    credits: "Joy",
    description: "Report a bug or issue to the bot admin",
    prefix: true,
    category: "utility",
    usages: "report <your message>",
    cooldowns: 5
  },

  onStart: async function ({ api, event, args }) {
    const message = args.join(" ");

    if (!message) {
      return api.sendMessage("⚠️ Please type your report.\nUsage: report <your message>", event.threadID, event.messageID);
    }

    const reportMessage = 
`📩 New Report Received:

👤 From: ${event.senderID}
📥 Message: ${message}
📍 Thread ID: ${event.threadID}`;

    const ADMIN_ID = "100001435123762"; // 🔁 এখানে তোমার Facebook ID বসাও (owner/admin)

    try {
      await api.sendMessage(reportMessage, ADMIN_ID);
      api.sendMessage("✅ Report sent successfully to the admin. Thanks!", event.threadID, event.messageID);
    } catch (e) {
      console.error(e);
      api.sendMessage("❌ Failed to send report. Try again later.", event.threadID, event.messageID);
    }
  }
};
