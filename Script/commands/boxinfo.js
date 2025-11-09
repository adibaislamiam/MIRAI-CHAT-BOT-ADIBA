const fs = require("fs");
const request = require("request");

module.exports.config = {
  name: "boxinfo",
  version: "2.3.0",
  hasPermssion: 1,
  credits: "MOHAMMAD AKASH",
  description: "Get stylish group info with fancy 𝙰𝚋𝚌 font",
  commandCategory: "Box",
  usages: "groupinfo",
  cooldowns: 2
};

module.exports.run = async function({ api, event }) {
  const threadInfo = await api.getThreadInfo(event.threadID);
  const members = threadInfo.participantIDs.length;
  const admins = threadInfo.adminIDs.length;
  const emoji = threadInfo.emoji || "❌";
  const groupName = threadInfo.threadName || "Unnamed Group";
  const groupID = threadInfo.threadID;
  const totalMsg = threadInfo.messageCount || 0;
  const approvalMode = threadInfo.approvalMode ? "🟢 𝙾𝙽" : "🔴 𝙾𝙵𝙵";
  const groupImage = threadInfo.imageSrc;

  // Gender Count
  let male = 0, female = 0;
  for (const user of threadInfo.userInfo) {
    if (user.gender === "MALE") male++;
    else if (user.gender === "FEMALE") female++;
  }

  // Admin List
  const adminList = threadInfo.adminIDs.map(admin => {
    const user = threadInfo.userInfo.find(u => u.id === admin.id);
    return user ? `• ${user.name}` : null;
  }).filter(Boolean);

  const msg = `
╭───────────⭓
│ 💎 𝗚𝗥𝗢𝗨𝗣 𝗜𝗡𝗙𝗢 💎
│─────────────────
│ 📛 𝙽𝚊𝚖𝚎: 𝙼𝚒𝚛𝚊𝚒 𝙱𝚘𝚝 𝚂𝚞𝚙𝚙𝚘𝚛𝚝
│ 🆔 𝙸𝙳: ${groupID}
│ 🔐 𝙰𝚙𝚙𝚛𝚘𝚟𝚊𝚕: ${approvalMode}
│ 😀 𝙴𝚖𝚘𝚓𝚒: ${emoji}
│─────────────────
│ 👥 𝙼𝚎𝚖𝚋𝚎𝚛𝚜: ${members}
│ 👨 𝙼𝚊𝚕𝚎: ${male} | 👩 𝙵𝚎𝚖𝚊𝚕𝚎: ${female}
│─────────────────
│ 👑 𝙰𝚍𝚖𝚒𝚗𝚜 (${admins.length}):
│ ${adminList.join("\n│ ")}
│─────────────────
│ 💬 𝚃𝚘𝚝𝚊𝚕 𝙼𝚎𝚜𝚜𝚊𝚐𝚎𝚜: ${totalMsg}
╰───────────────⭓
`.trim();

  const callback = () => {
    api.sendMessage(
      {
        body: msg,
        attachment: fs.createReadStream(__dirname + "/cache/1.png")
      },
      event.threadID,
      () => fs.unlinkSync(__dirname + "/cache/1.png"),
      event.messageID
    );
  };

  if (groupImage) {
    request(encodeURI(groupImage))
      .pipe(fs.createWriteStream(__dirname + "/cache/1.png"))
      .on("close", () => callback());
  } else {
    api.sendMessage(msg, event.threadID, event.messageID);
  }
};
