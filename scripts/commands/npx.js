const fs = require("fs");
module.exports.config = {
  name: "npx",
  version: "1.0.0", 
  permission: 0,
  credits: "Joy",
  description: "", 
  prefix: true,
  category: "user",
  usages: "",
  cooldowns: 5, 
  
};

module.exports.handleEvent = function({ api, event, client, __GLOBAL }) {
	var { threadID, messageID } = event;
	if (event.body.indexOf("bristi")==0 || event.body.indexOf("Bristi")==0 || event.body.indexOf("BRISTI")==0 || event.body.indexOf("bristi")==0) {
		var msg = {
				body: "-𝗝𝗢𝗬 𝗔𝗛𝗠𝗘𝗗 😻",
				attachment: fs.createReadStream(__dirname + `/Joy/JOY12.mp3`)
			}
			api.sendMessage( msg, threadID, messageID);
    api.setMessageReaction("😇", event.messageID, (err) => {}, true)
		}
	}
	module.exports.run = function({ api, event, client, __GLOBAL }) {

  }
