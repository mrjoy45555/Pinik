const nunuSizes = [
  "8D", "8=D", "8==D", "8===D", "8====D", "8=====D", "8======D",
  "8=======D", "8========D", "8=========D", "8==========D",
  "8===========D", "8============D", "8=============D",
  "8==============D", "8===============D", "8================D"
];

module.exports.config = {
  name: "nunu",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "JOY",
  prefix: "true",
  description: "Shows your nunu size 😂",
  commandCategory: "fun",
  usages: "[tag someone or yourself]",
  cooldowns: 5,
};

module.exports.run = async function ({ api, event, args }) {
  const mention = Object.keys(event.mentions)[0];
  const name = mention ? event.mentions[mention] : event.senderID;
  const nunu = nunuSizes[Math.floor(Math.random() * nunuSizes.length)];
  const tagName = mention ? Object.values(event.mentions)[0] : "Your";

  const msg = `${tagName}'s 🍆 size:\n\n${nunu} cm 😂`;

  api.sendMessage({
    body: msg,
    mentions: mention ? [{
      tag: tagName,
      id: mention
    }] : []
  }, event.threadID, event.messageID);
};
