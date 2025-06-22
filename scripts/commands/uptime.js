const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports = {
  config: {
    name: "uptime",
    version: "1.0",
    author: "Joy Ahmed",
    prefix: "true",
    countDown: 5,
    role: 0,
    description: {
      en: "Shows how long the bot has been running."
    },
    category: "system",
    guide: {
      en: "{pn}"
    }
  },

  onStart: async function ({ api, event }) {
    const time = process.uptime();

    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = Math.floor(time % 60);

    const uptimeText = 
`🤖 𝑴𝒆𝒓𝒂𝒊 𝑩𝒐𝒕 𝑼𝒑𝒕𝒊𝒎𝒆 🕒

⏳ Running Since:
📆 ${hours} hour(s)
🕐 ${minutes} minute(s)
⏱️ ${seconds} second(s)

💡 Status: Online ✅`;

    // Download image
    const imageUrl = "https://i.imgur.com/cB1RXf4.jpeg"; // You can change this to your own image link
    const imgPath = path.join(__dirname, "uptime.jpg");

    const response = await axios.get(imageUrl, { responseType: "arraybuffer" });
    fs.writeFileSync(imgPath, Buffer.from(response.data, "binary"));

    const msg = {
      body: uptimeText,
      attachment: fs.createReadStream(imgPath)
    };

    api.sendMessage(msg, event.threadID, () => {
      fs.unlinkSync(imgPath); // Clean up after sending
    }, event.messageID);
  }
};
