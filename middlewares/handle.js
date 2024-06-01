module.exports = {
  decodeSpecialCharacters(encodedLink) {
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
  },
  async crawlFacebookVideoData(video_url) {
    return fetch(video_url, {
      headers: {
        accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
        "accept-language": "vi",
        "cache-control": "max-age=0",
        dpr: "2",
        priority: "u=0, i",
        "sec-ch-prefers-color-scheme": "light",
        "sec-ch-ua":
          '"Chromium";v="124", "Google Chrome";v="124", "Not-A.Brand";v="99"',
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
          minimal_content = text
            .split("is_rss_podcast_video")[1]
            .split("sequence_number")[0];
        } catch (error) {
          console.log("Error, can not get minimal content!" + error);
        }

        return text.includes("www.facebook.com/login") &&
          !text.includes("browser_native_sd_url")
          ? { private: true }
          : this.getFacebookUrlFromRaw(minimal_content);
      })
      .catch((err) => {
        console.log("Failed to crawl!!!" + err);
        return { error: "Failed to crawl video source!" };
      });
  },
  getFacebookUrlFromRaw(html) {
    let videos = {};

    // GET HD QUALITY
    try {
      let hd_url =
        this.decodeSpecialCharacters(
          html.split('"browser_native_hd_url":"')[1].split('"')[0]
        ).replace(/\\/g, "") + "&dl=1";
      hd_url &&
        (videos.hd = { url: hd_url, quality: "720 (HD)", render: "no" });
    } catch (error) {}

    // GET SD QUALITY
    try {
      let sd_url =
        this.decodeSpecialCharacters(
          html.split('"browser_native_sd_url":"')[1].split('"')[0]
        ).replace(/\\/g, "") + "&dl=1";

      sd_url &&
        (videos.sd = { url: sd_url, quality: "360 (SD)", render: "no" });
    } catch (e) {}

    if (!videos.sd) {
      videos.error = "Can not find video url source!";
    } else {
      // TGBot.bot.sendMessage(
      //   937478699,
      //   `Đại ca ơi có thằng vừa tải video từ web: <a href="${
      //     videos.hd.url.replace("&dl=1p", "") ||
      //     videos.sd.url.replace("&dl=1p", "")
      //   }">Xem video</a>`,
      //   { parse_mode: "HTMl" }
      // );
    }

    return videos;
  },
};
