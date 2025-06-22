const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports.config = {
  name: "drive",
  version: "1.0.0",
  role: 0,
  credits: "Joy Ahmed",
  description: "Download a public Google Drive file by URL",
  prefix: true,
  category: "tools",
  usages: "{prefix}drive [google drive link]",
  cooldowns: 5
};

module.exports.run = async function({ api, event, args }) {
  const link = args[0];
  if (!link) return api.sendMessage("🔗 Please provide a Google Drive file link.", event.threadID, event.messageID);

  try {
    const fileIdMatch = link.match(/[-\w]{25,}/);
    if (!fileIdMatch) return api.sendMessage("❌ Invalid Google Drive link.", event.threadID, event.messageID);

    const fileId = fileIdMatch[0];
    const downloadUrl = `https://drive.google.com/uc?export=download&id=${fileId}`;

    const response = await axios.get(downloadUrl, {
      responseType: "stream"
    });

    const contentDisposition = response.headers["content-disposition"];
    const fileNameMatch = contentDisposition?.match(/filename="(.+)"/);
    const fileName = fileNameMatch ? fileNameMatch[1] : `${fileId}.file`;

    const filePath = path.join(__dirname, "cache", fileName);
    const writer = fs.createWriteStream(filePath);
    response.data.pipe(writer);

    writer.on("finish", () => {
      api.sendMessage({
        body: `📁 File downloaded from Google Drive:\n${fileName}`,
        attachment: fs.createReadStream(filePath)
      }, event.threadID, () => fs.unlinkSync(filePath), event.messageID);
    });

    writer.on("error", err => {
      console.error(err);
      api.sendMessage("❌ Error writing file.", event.threadID, event.messageID);
    });

  } catch (error) {
    console.error(error);
    api.sendMessage("❌ Failed to download file. Make sure the link is public and valid.", event.threadID, event.messageID);
  }
};
