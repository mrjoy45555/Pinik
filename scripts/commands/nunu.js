module.exports = {
  config: {
    name: "nunu",
    version: "1.0",
    author: "JOY",
    prefix: "true",
    countDown: 5,
    role: 0,
    shortDescription: "Measure 🍆",
    longDescription: "Shows how big your 🍆 is, or someone else's if tagged",
    category: "fun",
    guide: {
      en: "{pn} [@mention]"
    }
  },

  onStart: async function ({ message, event, usersData }) {
    const nunuSizes = [
      "8D", "8=D", "8==D", "8===D", "8====D", "8=====D", "8======D",
      "8=======D", "8========D", "8=========D", "8==========D",
      "8===========D", "8============D", "8=============D",
      "8==============D", "8===============D", "8================D"
    ];

    const mention = Object.keys(event.mentions)[0];
    const tagName = mention
      ? event.mentions[mention]
      : await usersData.getName(event.senderID);

    const nunu = nunuSizes[Math.floor(Math.random() * nunuSizes.length)];

    const msg = `${tagName}'s 🍆 size:\n\n${nunu} cm 😂`;

    message.reply({
      body: msg,
      mentions: mention ? [{
        tag: tagName,
        id: mention
      }] : []
    });
  }
};
