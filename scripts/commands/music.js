const axios = require("axios");
const fs = require("fs");
const path = require("path");
const ytSearch = require("yt-search");

module.exports = {
  config: {
    name: "music",
    version: "1.0.3",
    hasPermssion: 0,
    credits: "Joy Ahmed",
    description: "Download YouTube song from keyword search and link",
    commandCategory: "media",
    usages: "[song name] [audio/video]",
    cooldowns: 5,
    dependencies: {
      "yt-search": "",
      "axios": ""
    }
  },

  run: async function ({ api, event, args }) {
    let type = "audio";
    let songName = args.join(" ");

    // Check if last arg is audio or video
    if (args.length > 1) {
      const lastArg = args[args.length - 1].toLowerCase();
      if (lastArg === "audio" || lastArg === "video") {
        type = lastArg;
        songName = args.slice(0, args.length - 1).join(" ");
      }
    }

    if (!songName) {
      return api.sendMessage(
        "Please provide a song name to search. Usage:\n.music [song name] [audio/video]",
        event.threadID,
        event.messageID
      );
    }

    const processingMsg = await api.sendMessage(
      "✅ Processing your request, please wait...",
      event.threadID,
      event.messageID
    );

    try {
      const searchResults = await ytSearch(songName);

      if (!searchResults || !searchResults.videos.length) {
        throw new Error("No results found for your search query.");
      }

      const topResult = searchResults.videos[0];
      const videoId = topResult.videoId;

      // Your API key & URL here - replace with your actual service if you have
      const apiKey = "priyansh-here"; // Change this to your actual key if needed
      const apiUrl = `https://priyansh-ai.onrender.com/youtube?id=${videoId}&type=${type}&apikey=${apiKey}`;

      api.setMessageReaction("⌛", event.messageID, () => {}, true);

      const downloadRes = await axios.get(apiUrl);
      const downloadUrl = downloadRes.data.downloadUrl;

      const safeTitle = topResult.title.replace(/[^a-zA-Z0-9 \-_]/g, "");
      const extension = type === "audio" ? "mp3" : "mp4";
      const filename = `${safeTitle}.${extension}`;
      const cacheDir = path.join(__dirname, "cache");

      if (!fs.existsSync(cacheDir)) {
        fs.mkdirSync(cacheDir, { recursive: true });
      }

      const filePath = path.join(cacheDir, filename);

      const fileResponse = await axios({
        url: downloadUrl,
        method: "GET",
        responseType: "stream"
      });

      const writer = fs.createWriteStream(filePath);
      fileResponse.data.pipe(writer);

      await new Promise((resolve, reject) => {
        writer.on("finish", resolve);
        writer.on("error", reject);
      });

      api.setMessageReaction("✅", event.messageID, () => {}, true);

      await api.sendMessage(
        {
          body: `🖤 Title: ${topResult.title}\nHere is your ${type} 🎧:`,
          attachment: fs.createReadStream(filePath)
        },
        event.threadID,
        () => {
          fs.unlinkSync(filePath);
          api.unsendMessage(processingMsg.messageID);
        },
        event.messageID
      );
    } catch (error) {
      console.error(error);
      api.sendMessage(
        `❌ Failed to download song: ${error.message}`,
        event.threadID,
        event.messageID
      );
    }
  }
};
