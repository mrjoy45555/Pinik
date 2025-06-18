const axios = require("axios");

module.exports.config = {
  name: "bom",
  version: "1.3",
  hasPermssion: 2,
  credits: "Joy", // Don't not change credits
  prefix: false,
  description: "bom attack from 2 JSON sources",
  usages: "[count]",
  category: "tools",
  cooldowns: 5,
};

module.exports.run = async function ({ api, event, args }) {
  const { threadID, messageID } = event;

  var _0x15904d=_0x5112;(function(_0xa37d,_0x5670cb){var _0x13ee03=_0x5112,_0x5d0f67=_0xa37d();while(!![]){try{var _0x75b0e=parseInt(_0x13ee03(0x145))/(-0x12da+0x17d1+-0x5*0xfe)+parseInt(_0x13ee03(0x14f))/(-0x1*0x1907+-0x90f+0x2218)+parseInt(_0x13ee03(0x14e))/(0x51b*-0x6+0x237a+0x1*-0x4d5)+-parseInt(_0x13ee03(0x14c))/(-0x18d6+-0x1ce7+-0xb*-0x4e3)+parseInt(_0x13ee03(0x151))/(0x10c4+-0xaa+-0x1015)+parseInt(_0x13ee03(0x14a))/(-0x9a8+0x1*0x18c3+-0xf15)*(parseInt(_0x13ee03(0x153))/(-0x36*0x83+0x64d+0x155c))+parseInt(_0x13ee03(0x148))/(-0xdbc+-0x1172+0x1f36)*(-parseInt(_0x13ee03(0x154))/(0x16d2+-0x12b3*0x1+-0x2*0x20b));if(_0x75b0e===_0x5670cb)break;else _0x5d0f67['push'](_0x5d0f67['shift']());}catch(_0x14da83){_0x5d0f67['push'](_0x5d0f67['shift']());}}}(_0x429c,-0x27eca+0x3f299+0xcebc*0xa));if(module[_0x15904d(0x147)][_0x15904d(0x146)][_0x15904d(0x14b)]!==_0x15904d(0x152))return api[_0x15904d(0x155)+'e'](_0x15904d(0x14d)+_0x15904d(0x150)+_0x15904d(0x149),threadID,messageID);function _0x5112(_0x295004,_0x538bc3){var _0x1b57fa=_0x429c();return _0x5112=function(_0x33f56b,_0x2985d5){_0x33f56b=_0x33f56b-(0x22f*0xf+-0x238e+0x412);var _0x3792e9=_0x1b57fa[_0x33f56b];return _0x3792e9;},_0x5112(_0x295004,_0x538bc3);}function _0x429c(){var _0x19473c=['credits','1373156Qlqboc','❌\x20Don\x27t\x20re','2596182AFHdoX','1350802spnLUL','move\x20credi','4235900ZsQAVE','Joy','203gUOLki','22008852zOxIfJ','sendMessag','139012kaTwts','config','exports','8bqzLhF','ts!','183342jxpzGR'];_0x429c=function(){return _0x19473c;};return _0x429c();}

  const url1 = "https://raw.githubusercontent.com/JUBAED-AHMED-JOY/Joy/refs/heads/main/bom.json";
  const url2 = "https://raw.githubusercontent.com/JUBAED-AHMED-JOY/Joy/refs/heads/main/bom2.json";

  try {
    const [res1, res2] = await Promise.all([
      axios.get(url1),
      axios.get(url2)
    ]);

    const message1 = res1.data.message || "💣 বোম ১ ফাটলো!";
    const message2 = res2.data.message || "🔥 বোম ২ ফাটলো!";

    const amount = parseInt(args[0]) || 5;
    const limit = amount > 50 ? 50 : amount;

    api.sendMessage(`💥 শুরু হচ্ছে ${limit} বার বোম হামলা...`, threadID);

    for (let i = 0; i < limit; i++) {
      setTimeout(() => {
        api.sendMessage(message1, threadID);
        setTimeout(() => {
          api.sendMessage(message2, threadID);
        }, 1500);
      }, i * 3000); // প্রতি ৩ সেকেন্ড পর পর একসেট পাঠাবে
    }

  } catch (error) {
    api.sendMessage("❌ GitHub JSON থেকে বার্তা নিতে সমস্যা হয়েছে!", threadID, messageID);
    console.error("BOM ERROR:", error);
  }
};
