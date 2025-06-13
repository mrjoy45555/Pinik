module.exports = {
  config: {
    name: "simsms",
    version: "1.1.0",
    permission: 0,
    credits: "Joy",
    description: "Send fake SIM SMS to mentioned user",
    prefix: true,
    category: "fun",
    usages: "simsms @user",
    cooldowns: 5
  },

  onStart: async function ({ api, event }) {
    const mention = Object.keys(event.mentions);
    if (mention.length === 0) {
      return api.sendMessage("📌 Usage: simsms @someone", event.threadID, event.messageID);
    }

    const name = event.mentions[mention[0]].replace("@", "");

    const fakeSMS = [
      `📲 GP Offer: ${name}, apnar number e 1GB free data add kora hoyeche. Dial *121*1*4#`,
      `📶 Robi: ${name}, apnar balance sesh hoye geche. Emergency balance pete dial korun *8811*1#`,
      `📢 Airtel: ${name}, apni 10GB bonus internet peyesen! Valid 3 din.`,
      `💰 Banglalink: ${name}, recharge 29 Tk & get 3GB for 3 days. Dial *5000*329#`,
      `🔔 Teletalk: ${name}, apnar SIM 7 din por bondho hoye jabe. Recharge korun taratari!`
    ];

    const randomSMS = fakeSMS[Math.floor(Math.random() * fakeSMS.length)];

    api.sendMessage({
      body: `📡 Fake SIM SMS:\n\n${randomSMS}`,
      mentions: [{
        tag: name,
        id: mention[0]
      }]
    }, event.threadID, event.messageID);
  }
};
