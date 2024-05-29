function telegram_bot_controller(bot, token) {
    bot.on('polling_error', (error) => {
        
        console.log(`Polling error: ${error.message}`);
        // bot = new TelegramBot(bot.token, { polling: true });
    
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
            bot.sendMessage(chatId, "Đường link không hợp lệ! Vui lòng gửi cho tôi link video từ facebook.!");
            return;
        }

        bot.sendMessage(chatId, "Đợi tý có liền.....").then((s) => {
            msgId = s.message_id;
        });

        crawlFacebookVideoData(url)
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

                // console.log(chatId);

                bot.sendMessage(chatId, msg, {
                    parse_mode: "HTMl",
                }).then(() => {
                    bot.deleteMessage(chatId, msgId);
                    if (chatId != 937478699) {
                        bot.sendMessage(
                          937478699,
                          `Đại ca ơi có thằng vừa tải video từ em
${msg}
                          `,
                          { parse_mode: "HTMl" }
                        );
                      }
                });
            })
            .catch((err) => {
                console.log(err);
                bot.sendMessage(chatId, "Server Error, can not crawl video source!" + err);
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

function decodeSpecialCharacters(encodedLink) {
    let decodedLink = encodedLink
        .replace(/\\u0025/g, "%")
        .replace(/\\u0026/g, "&")
        .replace(/\\u002F/g, "/")
        .replace(/\\u003A/g, ":")
        .replace(/\\u003F/g, "?")
        .replace(/\\u0023/g, "#")
        .replace(/\\u0024/g, "$")
        .replace(/\\u002B/g, "+")
        .replace(/\\u002C/g, ",")
        .replace(/\\u0020/g, " ")
        .replace(/\\u005F/g, "_")
        .replace(/\\u002E/g, ".")
        .replace(/\\u003D/g, "=")
        .replace(/\\u0025/g, "%")
        .replace(/\\u007B/g, "{")
        .replace(/\\u007D/g, "}")
        .replace(/\\u003C/g, "<")
        .replace(/\\u003E/g, ">")
        .replace(/\\u005B/g, "[")
        .replace(/\\u005D/g, "]")
        .replace(/\\u0022/g, '"')
        .replace(/\\u005C/g, "\\")
        .replace(/\\u005E/g, "^")
        .replace(/\\u0026/g, "&")
        .replace(/\\u003B/g, ";")
        .replace(/\\u007C/g, "|")
        .replace(/\\u0060/g, "`")
        .replace(/\\u0027/g, "'")
        .replace(/\\u002D/g, "-")
        .replace(/\\u0021/g, "!")
        .replace(/\\u0040/g, "@")
        .replace(/\\u002A/g, "*")
        .replace(/\\u0028/g, "(")
        .replace(/\\u0029/g, ")")
        .replace(/\\u003A/g, ":")
        .replace(/\\u002F/g, "/")
        .replace(/\\u003F/g, "?")
        .replace(/\\u0023/g, "#")
        .replace(/\\u0024/g, "$")
        .replace(/\\u002B/g, "+")
        .replace(/\\u002C/g, ",")
        .replace(/\\u0020/g, " ")
        .replace(/\\u005F/g, "_")
        .replace(/\\u002E/g, ".")
        .replace(/\\u003D/g, "=")
        .replace(/\\u0025/g, "%")
        .replace(/\\u007B/g, "{")
        .replace(/\\u007D/g, "}")
        .replace(/\\u003C/g, "<")
        .replace(/\\u003E/g, ">")
        .replace(/\\u005B/g, "[")
        .replace(/\\u005D/g, "]")
        .replace(/\\u0022/g, '"')
        .replace(/\\u005C/g, "\\")
        .replace(/\\u005E/g, "^")
        .replace(/\\u0026/g, "&")
        .replace(/\\u003B/g, ";")
        .replace(/\\u007C/g, "|")
        .replace(/\\u0060/g, "`")
        .replace(/\\u0027/g, "'")
        .replace(/\\u002D/g, "-")
        .replace(/\\u0021/g, "!")
        .replace(/\\u0040/g, "@")
        .replace(/\\u002A/g, "*")
        .replace(/\\u0028/g, "(")
        .replace(/\\u0029/g, ")");
    return decodedLink;
}

const getFacebookUrlFromRaw = (html) => {
    let videos = {};

    // get full hd quality
    try {
        let url, audio_url;
        let representations = JSON.parse(
            html
                .split('"extensions":{"all_video_dash_prefetch_representations":[{"representations":')[1]
                .split(',"video_id":')[0]
        );

        for (let i of representations) {
            if (i.height >= 1080 && i.width >= 1920 && i.mime_type == "video/mp4") {
                url = i.base_url;
            } else if (i.height == 0 && i.width == 0 && i.mime_type == "audio/mp4") {
                audio_url = i.base_url;
            }
        }

        audio_url && (videos.audio = audio_url);
        url && (videos.fullhd = { url: url, quality: "1080 (FULL HD)", render: "yes" });
    } catch (error) {
        console.log("Full HD Quality not found!" + error);
    }

    // get hd qulity
    try {
        let hd_url =
            decodeSpecialCharacters(html.split('"browser_native_hd_url":"')[1].split('"')[0]).replace(/\\/g, "") +
            "&dl=1";
        hd_url && (videos.hd = { url: hd_url, quality: "720 (HD)", render: "no" });
    } catch (error) {
        console.log("Error, HD quality nor found!" + error);
    }

    // get sd quality
    try {
        let sd_url =
            decodeSpecialCharacters(html.split('"browser_native_sd_url":"')[1].split('"')[0]).replace(/\\/g, "") +
            "&dl=1";

        sd_url && (videos.sd = { url: sd_url, quality: "360 (SD)", render: "no" });
    } catch (e) {
        console.log("Error, SD quality not found!");
    }

    if (!videos.sd) {
        videos.error = "Can not find video url source!";
    }
    return videos;
};

const crawlFacebookVideoData = (video_url) => {
    return fetch(video_url, {
        headers: {
            accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
            "accept-language": "vi",
            "cache-control": "max-age=0",
            dpr: "2",
            priority: "u=0, i",
            "sec-ch-prefers-color-scheme": "light",
            "sec-ch-ua": '"Chromium";v="124", "Google Chrome";v="124", "Not-A.Brand";v="99"',
            "sec-ch-ua-full-version-list":
                '"Chromium";v="124.0.6367.92", "Google Chrome";v="124.0.6367.92", "Not-A.Brand";v="99.0.0.0"',
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-model": '""',
            "sec-ch-ua-platform": '"macOS"',
            "sec-ch-ua-platform-version": '"14.4.1"',
            "sec-fetch-dest": "document",
            "sec-fetch-mode": "navigate",
            "sec-fetch-site": "same-origin",
            "sec-fetch-user": "?1",
            "upgrade-insecure-requests": "1",
            "viewport-width": "674",
        },
        referrerPolicy: "strict-origin-when-cross-origin",
        body: null,
        method: "GET",
    })
        .then((response) => response.text())
        .then((text) => {
            let minimal_content = text;

            try {
                minimal_content = text.split("is_rss_podcast_video")[1].split("sequence_number")[0];
            } catch (error) {
                console.log("Error, can not get minimal content!" + error);
            }

            return text.includes("www.facebook.com/login") && !text.includes("browser_native_sd_url")
                ? { private: true }
                : getFacebookUrlFromRaw(minimal_content);
        })
        .catch((err) => {
            console.log("Failed to crawl!!!" + err);
            return { error: "Failed to crawl video source!" };
        });
};

module.exports = telegram_bot_controller;
