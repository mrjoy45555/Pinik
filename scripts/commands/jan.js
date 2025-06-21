const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports = {
  config: {
    name: "bot",
    version: "1.0.0",
    author: "Joy Ahmed",
    countDown: 5,
    role: 0,
    description: {
      en: "Talk with the bot like a simi AI"
    },
    category: "fun",
    guide: {
      en: "{pn} [message] or {pn} teach ask=hi&ans=hello"
    }
  },

  onStart: async function ({ api, event, args, users }) {
    const msg = args.join(" ");
    const { threadID, messageID, senderID } = event;

    const name = await users.getName(senderID);

    try {
      const apiData = await axios.get("https://raw.githubusercontent.com/MOHAMMAD-NAYAN-07/Nayan/main/api.json");
      const apiUrl = apiData.data.sim;
      const apiUrl2 = apiData.data.api2;

      if (!msg) {
        const greetings = [
          "আহ শুনা আমার তোমার অলিতে গলিতে উম্মাহ😇😘",
          "কি গো সোনা আমাকে ডাকছ কেনো",
          "বার বার আমাকে ডাকস কেন😡",
          "আহ শোনা আমার আমাকে এতো ডাক্তাছো কেনো আসো বুকে আশো🥱",
          "হুম জান তোমার অইখানে উম্মমাহ😷😘",
          "আসসালামু আলাইকুম বলেন আপনার জন্য কি করতে পারি",
          "আমাকে এতো না ডেকে বস জয়কে একটা গফ দে 🙄",
          "jang hanga korba",
          "jang bal falaba🙂"
        ];
        const rand = greetings[Math.floor(Math.random() * greetings.length)];
        return api.sendMessage(
          {
            body: `${name}, ${rand}`,
            mentions: [{ id: senderID, tag: name }]
          },
          threadID,
          (err, info) => {
            if (!err) {
              global.client.handleReply.push({
                type: "reply",
                name: this.config.name,
                messageID: info.messageID,
                author: senderID,
                head: msg
              });
            }
          },
          messageID
        );
      }

      // Handle textType change
      if (msg.startsWith("textType")) {
        const selectedStyle = msg.split(" ")[1];
        const options = ['serif', 'sans', 'italic', 'italic-sans', 'medieval', 'normal'];

        if (options.includes(selectedStyle)) {
          saveTextStyle(threadID, selectedStyle);
          return api.sendMessage(`✅ Text type set to "${selectedStyle}" successfully!`, threadID, messageID);
        } else {
          return api.sendMessage(`❌ Invalid text type! Choose from: ${options.join(", ")}`, threadID, messageID);
        }
      }

      // Handle teach
      if (msg.startsWith("teach")) {
        const [askPart, ansPart] = msg.replace("teach", "").trim().split("&");
        const question = askPart.replace("ask=", "").trim();
        const answer = ansPart.replace("ans=", "").trim();

        const response = await axios.get(`${apiUrl}/sim?type=teach&ask=${encodeURIComponent(question)}&ans=${encodeURIComponent(answer)}`);
        const replyMsg = response.data.msg;
        const ask = response.data.data?.ask;
        const ans = response.data.data?.ans;

        if (replyMsg.includes("already")) {
          return api.sendMessage(`📝 Already Exists:\n1️⃣ ASK: ${ask}\n2️⃣ ANS: ${ans}`, threadID, messageID);
        }

        return api.sendMessage(`📝 Added Successfully:\n1️⃣ ASK: ${ask}\n2️⃣ ANS: ${ans}`, threadID, messageID);
      }

      // Handle delete
      if (msg.startsWith("delete")) {
        const [askPart, ansPart] = msg.replace("delete", "").trim().split("&");
        const question = askPart.replace("ask=", "").trim();
        const answer = ansPart.replace("ans=", "").trim();

        const res = await axios.get(`${apiUrl}/sim?type=delete&ask=${encodeURIComponent(question)}&ans=${encodeURIComponent(answer)}&uid=${senderID}`);
        return api.sendMessage(res.data.msg || res.data.data?.msg, threadID, messageID);
      }

      // Handle edit
      if (msg.startsWith("edit")) {
        const [oldPart, newPart] = msg.replace("edit", "").trim().split("&");
        const oldQ = oldPart.replace("old=", "").trim();
        const newQ = newPart.replace("new=", "").trim();

        const res = await axios.get(`${apiUrl}/sim?type=edit&old=${encodeURIComponent(oldQ)}&new=${encodeURIComponent(newQ)}&uid=${senderID}`);
        return api.sendMessage(res.data.msg || res.data.data?.msg, threadID, messageID);
      }

      // Info
      if (msg.startsWith("info")) {
        const res = await axios.get(`${apiUrl}/sim?type=info`);
        return api.sendMessage(`📊 Total Keys: ${res.data.data.totalKeys}\n📋 Total Answers: ${res.data.data.totalResponses}`, threadID, messageID);
      }

      // askinfo
      if (msg.startsWith("askinfo")) {
        const question = msg.replace("askinfo", "").trim();
        if (!question) return api.sendMessage("❌ Please provide a question.", threadID, messageID);

        const res = await axios.get(`${apiUrl}/sim?type=keyinfo&ask=${encodeURIComponent(question)}`);
        const answers = res.data.data?.answers || [];
        if (answers.length === 0) return api.sendMessage(`❌ No info found for "${question}"`, threadID, messageID);

        const list = answers.map((ans, i) => `${i + 1}. ${ans}`).join("\n");
        return api.sendMessage(`📚 Answers for "${question}":\n\n${list}\n\nTotal: ${answers.length}`, threadID, messageID);
      }

      // help
      if (msg.startsWith("help")) {
        return api.sendMessage(
          `📘 Available Commands:
🔹 {pn} teach ask=hi&ans=hello
🔹 {pn} delete ask=hi&ans=hello
🔹 {pn} edit old=hi&new=hello there
🔹 {pn} askinfo [question]
🔹 {pn} info
🔹 {pn} textType serif|italic|normal|medieval
🔹 {pn} hi (or just write something)`,
          threadID,
          messageID
        );
      }

      // Default ASK
      const res = await axios.get(`${apiUrl}/sim?type=ask&ask=${encodeURIComponent(msg)}`);
      const replyText = res.data.data.msg;

      const style = loadTextStyles()[threadID]?.style || "normal";
      const styledRes = await axios.get(`${apiUrl2}/bold?text=${encodeURIComponent(replyText)}&type=${style}`);
      const styled = styledRes.data.data?.bolded || replyText;

      api.sendMessage(styled, threadID, (err, info) => {
        if (!err) {
          global.client.handleReply.push({
            type: "reply",
            name: this.config.name,
            messageID: info.messageID,
            author: senderID,
            head: msg
          });
        }
      }, messageID);

    } catch (err) {
      console.error("Bot error:", err);
      return api.sendMessage("❌ কিছু একটা ভুল হয়েছে। পরে আবার চেষ্টা করুন।", threadID, messageID);
    }
  },

  onReply: async function ({ api, event }) {
    const { body, threadID, messageID, senderID } = event;
    try {
      const apiData = await axios.get("https://raw.githubusercontent.com/MOHAMMAD-NAYAN-07/Nayan/main/api.json");
      const sim = apiData.data.sim;
      const api2 = apiData.data.api2;

      const reply = await axios.get(`${sim}/sim?type=ask&ask=${encodeURIComponent(body)}`);
      const styled = await axios.get(`${api2}/bold?text=${encodeURIComponent(reply.data.data.msg)}&type=normal`);

      return api.sendMessage(styled.data.data.bolded, threadID, messageID);
    } catch (err) {
      console.error("Reply error:", err);
      return api.sendMessage("❌ উত্তর আনতে সমস্যা হয়েছে।", threadID, messageID);
    }
  }
};

// Utility: text style system
function loadTextStyles() {
  const p = path.join(__dirname, "system", "textStyles.json");
  try {
    if (!fs.existsSync(p)) fs.writeFileSync(p, JSON.stringify({}));
    return JSON.parse(fs.readFileSync(p, "utf8"));
  } catch {
    return {};
  }
}

function saveTextStyle(threadID, style) {
  const styles = loadTextStyles();
  styles[threadID] = { style };
  const p = path.join(__dirname, "system", "textStyles.json");
  fs.writeFileSync(p, JSON.stringify(styles, null, 2));
}
