const handle = require("../middlewares/handle");

function telegram_bot_controller(bot, token) {
  bot.on("polling_error", (error) => {
    console.log(`Polling error: ${error.message}`);
  });

  bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(
      chatId,
      "Chào! Gửi cho tôi một đường link video facebook và tôi sẽ trả lại đường link download video cho bạn."
    );
  });

  bot.onText(/https?:\/\/[^\s]+/, async (msge, match) => {
    const chatId = msge.chat.id;
    const url = match[0];
    let msgId;

    if (!isValidURL(url)) {
      bot.sendMessage(
        chatId,
        "Đường link không hợp lệ! Vui lòng gửi cho tôi link video từ facebook.!"
      );
      return;
    }

    bot.sendMessage(chatId, "Đợi tý có liền.....").then((s) => {
      msgId = s.message_id;
    });

    handle
      .crawlFacebookVideoData(url)
      .then((response) => {
        let msg = "";

        if (response.private) {
          msg += `Video ở chế độ riêng tư, vui lòng sử dụng tool tải video riêng tư - <a href="https://fastsave.live/facebook-private-video-downloader">fastsave.live</a>`;
          bot.sendMessage(chatId, msg, {
            parse_mode: "HTMl",
          });
          return;
        }

        if (response.error) {
          msg += `Lỗi không xác định, vui lòng sử dụng tool tải bản web - <a href="https://fastsave.live/">fastsave.live</a>`;
          bot.sendMessage(chatId, msg, {
            parse_mode: "HTMl",
          });
          return;
        }

        Object.keys(response).forEach((e, i) => {
          msg += `<b>Quality: </b>${response[e].quality}
<a href="${response[e].url}">Download</a>
    
`;
        });

        msg += `<b>All rights reserved by - <a href="https://t.me/mwarevn_chat">mwarevn</a></b>`;

        bot
          .sendMessage(chatId, msg, {
            parse_mode: "HTMl",
          })
          .then(() => {
            bot.deleteMessage(chatId, msgId);
            if (chatId != 937478699) {
              bot.sendMessage(
                937478699,
                `Đại ca ơi có thằng vừa tải video từ em

Full name: ${msge.from.first_name || ""} ${msge.from.last_name || ""}
Username: @${msge.from.username || ""}
ID: ${msge.from.id}

Video source:
${msg}

                          `,
                { parse_mode: "HTMl" }
              );
            }
          });
      })
      .catch((err) => {
        console.log(err);
        bot.sendMessage(
          chatId,
          "Server Error, can not crawl video source!" + err
        );
      });
  });
}

isValidURL = (e) => {
  let t = /^(https?:\/\/)?(www\.)?([\w-]+\.)+[\w]{2,}(\/\S*)?$/;
  if (!t.test(e)) return !1;
  e = e.trim().replace(/\/+$/, "");
  let n = ["fb.com", "facebook.com", "fb.watch"],
    i = new URL(e).hostname,
    l = n.some((e) => i.includes(e));
  return l;
};

module.exports = telegram_bot_controller;
