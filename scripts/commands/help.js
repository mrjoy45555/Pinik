axios = require("axios");
const fs = require("fs");
const path = require("path");
name: "help",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "Joy",
  description: "Guide for new users",
  category: "system",
  usages: "/help",
  prefix: true,
  premium: false,
  cooldowns: 5
};


module.exports.run = async function ({ api, event, args }) {
  const uid = event.senderID;
  const userName = (await api.getUserInfo(uid))[uid].name;

  const { commands } = global.client;
  const { threadID } = event;
  const threadSetting = global.data.threadData.get(parseInt(threadID)) || {};
  const prefix = threadSetting.hasOwnProperty("PREFIX") ? threadSetting.PREFIX : global.config.PREFIX;

  const categories = new Set();
  const categorizedCommands = new Map();

  for (const [name, value] of commands) {
    const categoryName = value.config.category;
    if (!categories.has(categoryName)) {
      categories.add(categoryName);
      categorizedCommands.set(categoryName, []);
    }
    categorizedCommands.get(categoryName).push(`│ ✧ ${value.config.name}`);
  }

  let msg = `Hey ${userName}, these are commands that may help your assignments and essays:\n\n`;

  for (const categoryName of categories) {
    const categoryNameSansBold = categoryName.split("").map(c => mathSansBold[c] || c).join("");
    msg += `╭─❍「 ${categoryNameSansBold} 」\n`;
    msg += categorizedCommands.get(categoryName).join("\n");
    msg += "\n╰───────────⟡\n";
  }

  const randomQuotes = [
    "Wombat poop is cube-shaped.",
    "The unicorn is Scotland's national animal.",
    "Polar bears are left-handed."
    // Add more if you want
  ];

  const randomQuote = randomQuotes[Math.floor(Math.random() * randomQuotes.length)];

  msg += `├─────☾⋆\n│ » Total commands: [ ${commands.size} ]\n│「 ☾⋆ PREFIX: ${prefix} 」\n╰──────────⧕\n\n𝗥𝗔𝗡𝗗𝗢𝗠 𝗙𝗔𝗖𝗧: ${randomQuote}\n\nOwner: JOY AHMED`;

  // 👇 Replace with your own Imgur image URL
  const imgurUrl = "https://i.imgur.com/TiD05Au.jpeg"; // <-- Replace this

  const filePath = path.join(__dirname, "cache", "help_image.jpg");

  try {
    const response = await axios.get(imgurUrl, { responseType: "arraybuffer" });
    fs.writeFileSync(filePath, Buffer.from(response.data, "binary"));

    return api.sendMessage({
      body: msg,
      attachment: fs.createReadStream(filePath)
    }, threadID, () => fs.unlinkSync(filePath)); // Delete after send
  } catch (err) {
    console.error("Imgur image error:", err);
    return api.sendMessage(msg, threadID);
  }
};
