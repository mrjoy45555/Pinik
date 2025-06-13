const ytdl = require("ytdl-core");
const fs = require("fs");
const path = require("path");
const axios = require("axios");

module.exports = {
  config: {
    name: "music",
    version: "1.0.0",
    permission: 0,
    credits: "Joy",
    description: "Download music from YouTube by link",
    prefix: true,
    category: "media",
    usages: "music [YouTube link]",
    cooldowns: 5,
  },

  onStart: async function ({ api, event, args }) {
    const link = args[0];
    if (!link || !ytdl.validateURL(link)) {
      return api.sendMessage("🔗 Valid YouTube link dao!\nUsage: music [YouTube Link]", event.threadID);
    }

    try {
      const info = await ytdl.getInfo(link);
      const title = info.videoDetails.title.replace(/[^\w\s]/gi, '');
      const filePath = path.join(__dirname, `${title}.mp3`);
      const stream = ytdl(link, { filter: "audioonly" });

      api.sendMessage(`🎵 Downloading: ${info.videoDetails.title}`, event.threadID, event.messageID);

      stream.pipe(fs.createWriteStream(filePath))
        .on("finish", () => {
          api.sendMessage({
            body: `✅ Done! ${title}`,
            attachment: fs.createReadStream(filePath),
          }, event.threadID, () => fs.unlinkSync(filePath), event.messageID);
        });

    } catch (err) {
      console.error(err);
      api.sendMessage("❌ Music download e error hoise.", event.threadID);
    }
  },
};
