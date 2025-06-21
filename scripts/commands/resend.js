const axios = require("axios");
const fs = require("fs-extra");

module.exports.config = {
  name: "resendinbox",
  version: "1.0.2",
  permission: 0,
  credits: "Joy",
  description: "Resend unsent inbox messages with time, date, UID and forward to admin",
  prefix: false,
  category: "system",
  usages: "resendinbox",
  cooldowns: 0
};

// এখানে তোমার অ্যাডমিনের Facebook UID বসাও (স্ট্রিং হিসেবে)
const ADMIN_UID = "7749531411724175";

module.exports.handleEvent = async function ({ event, api, Users }) {
  const { messageID, senderID, threadID, type, body, attachments, timestamp } = event;

  if (!global.logInboxMessages) global.logInboxMessages = new Map();
  if (!global.data.botID) global.data.botID = api.getCurrentUserID();

  // শুধুমাত্র ইনবক্স চ্যাটে কাজ করবে
  if (threadID !== senderID) return;

  // Ignore বট নিজের মেসেজ
  if (senderID === global.data.botID) return;

  // সাধারণ মেসেজ লগ করো
  if (type !== "message_unsend") {
    global.logInboxMessages.set(messageID, {
      msgBody: body || "",
      attachment: attachments || [],
      senderID,
      timestamp
    });
  }

  // আনসেন্ড ইভেন্ট হ্যান্ডেল
  if (type === "message_unsend") {
    const getMsg = global.logInboxMessages.get(messageID);
    if (!getMsg) return;

    // ইউজারের নাম নাও
    const senderName = await Users.getNameUser(getMsg.senderID);

    // আনসেন্ডের সময় ফরম্যাট (বাংলায়)
    const timeDate = new Date(Date.now()).toLocaleString("bn-BD", {
      timeZone: "Asia/Dhaka",
      hour12: false,
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      weekday: "long"
    });

    // মেসেজ তৈরি করো (UID + নাম + আনসেন্ড টাইম সহ)
    let msgText = `❗️ ${senderName} (UID: ${getMsg.senderID}) ইনবক্সে মেসেজ আনসেন্ড করেছে\n\n🕰 আনসেন্ডের সময়: ${timeDate}\n\n📩 মেসেজ: ${getMsg.msgBody || "N/A"}`;

    // অ্যাটাচমেন্ট সংগ্রহ
    let msgAttachments = [];
    if (getMsg.attachment.length > 0) {
      let counter = 0;
      for (const file of getMsg.attachment) {
        counter++;
        try {
          const fileUrl = file.url;
          const ext = fileUrl.split('.').pop().split("?")[0];
          const filePath = __dirname + `/cache/resendinbox_${messageID}_${counter}.${ext}`;

          const fileData = (await axios.get(fileUrl, { responseType: "arraybuffer" })).data;
          await fs.writeFile(filePath, Buffer.from(fileData));
          msgAttachments.push(fs.createReadStream(filePath));
        } catch (e) {
          console.error("Attachment download error:", e.message);
        }
      }
    }

    // এখন বট অ্যাডমিনের ইনবক্সে পাঠাও (admin UID ব্যবহার করে)
    return api.sendMessage(
      {
        body: msgText,
        attachment: msgAttachments.length > 0 ? msgAttachments : undefined
      },
      ADMIN_UID
    );
  }
};

module.exports.run = async function ({ api, event }) {
  return api.sendMessage(
    "✅ ইনবক্সে আনসেন্ড মেসেজ রিসেন্ড কমান্ড চালু হয়েছে। আনসেন্ড মেসেজ অ্যাডমিনের ইনবক্সে পাঠানো হবে।",
    event.threadID,
    event.messageID
  );
};
