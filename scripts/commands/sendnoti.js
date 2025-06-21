module.exports.config = {
  name: "sendnoti",
  version: "1.2",
  permission: 2, // Custom handled via botAdminIDs
  credits: "Joy",
  description: "Sends a message/photo/video/sticker/file to all groups (bot admin only).",
  prefix: true,
  category: "message",
  usages: "[reply to media or text]",
  cooldowns: 5
};

module.exports.run = async function({ api, event, args }) {
  const { threadID, messageID, senderID, messageReply } = event;

  // ✅ Only allow these specific UIDs as bot admins
  const botAdminIDs = [
    "100001435123762", // Replace with actual admin UID
    "100001435123762"  // Add more if needed
  ];

  if (!botAdminIDs.includes(senderID)) {
    return api.sendMessage("❌ এই কমান্ডটি শুধুমাত্র নির্ধারিত বট অ্যাডমিনদের জন্য!", threadID, messageID);
  }

  let notifMessage = "";
  let attachments = [];

  if (messageReply) {
    notifMessage = messageReply.body || "";
    if (messageReply.attachments?.length > 0) {
      attachments = messageReply.attachments.map(att => att.url);
    }
  } else {
    notifMessage = args.join(" ");
    if (!notifMessage) {
      return api.sendMessage("📌 বিজ্ঞপ্তি পাঠানোর জন্য কোনো মেসেজ দিন বা রিপ্লাই করুন।", threadID, messageID);
    }
  }

  let threadList = [];
  try {
    threadList = await api.getThreadList(100, null, ["INBOX"]);
  } catch (error) {
    return api.sendMessage("❌ থ্রেড লিস্ট আনতে সমস্যা হয়েছে!", threadID, messageID);
  }

  let sentCount = 0;
  let notSentCount = 0;

  const sendMsg = await api.sendMessage("⏳ বিজ্ঞপ্তি পাঠানো শুরু হয়েছে...", threadID, messageID);

  async function sendToThread(thread) {
    try {
      if (attachments.length === 0) {
        await api.sendMessage(
          `📢 বিজ্ঞপ্তি\n━━━━━━━━━━━━━━\n${notifMessage}`,
          thread.threadID
        );
      } else {
        await api.sendMessage(
          {
            body: `📢 বিজ্ঞপ্তি\n━━━━━━━━━━━━━━\n${notifMessage}`,
            attachment: await api.getStream(attachments[0])
          },
          thread.threadID
        );

        for (let i = 1; i < attachments.length; i++) {
          await api.sendMessage(
            await api.getStream(attachments[i]),
            thread.threadID
          );
        }
      }
      sentCount++;
    } catch (error) {
      console.error(`Error sending to thread ${thread.threadID}:`, error);
      notSentCount++;
    }
  }

  for (const thread of threadList) {
    if (sentCount >= 20) break;
    if (thread.isGroup && thread.threadID !== threadID) {
      await sendToThread(thread);
    }
  }

  let summary = `✅ বিজ্ঞপ্তি সফলভাবে পাঠানো হয়েছে ${sentCount} গ্রুপে।`;
  if (notSentCount > 0) summary += `\n❌ ${notSentCount} গ্রুপে পাঠানো যায়নি।`;

  await api.editMessage(summary, sendMsg.messageID, threadID);
};
