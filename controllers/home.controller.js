const { app } = require("../utils/common");
var i18n = require("i18n");
var glob = require("glob");
var fs = require("fs");
var language_dict = {};
const createHttpError = require("http-errors");
var TGBot = require('../bot/TGBot')

glob.sync("./language/*.json").forEach(function (file) {
  let dash = file.split("/");
  if (dash.length == 2) {
    let dot = dash[1].split(".");
    if (dot.length == 2) {
      let lang = dot[0];
      fs.readFile(file, function (err, data) {
        language_dict[lang] = JSON.parse(data.toString());
      });
    }
  } else {
    console.log("Error, failed to create language files!");
  }
});

function validateLanguageCodeAndRoute(code) {
  return code && !language_dict.hasOwnProperty(code);
}

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
        .split(
          'all_video_dash_prefetch_representations":[{"representations":'
        )[1]
        .split('"video_id":')[0]
    );

    for (let i of representations) {
      if (i.height >= 1080 && i.width >= 1920 && i.mime_type == "video/mp4") {
        url = i.base_url;
      } else if (i.height == 0 && i.width == 0 && i.mime_type == "audio/mp4") {
        audio_url = i.base_url;
      }
    }

    audio_url && (videos.audio = audio_url);
    url &&
      (videos.fullhd = { url: url, quality: "1080 (FULL HD)", render: "yes" });
  } catch (error) {
    // console.log("Full HD Quality not found!" + error);
  }

  // get hd qulity
  try {
    let hd_url =
      decodeSpecialCharacters(
        html.split('"browser_native_hd_url":"')[1].split('"')[0]
      ).replace(/\\/g, "") + "&dl=1";
    hd_url && (videos.hd = { url: hd_url, quality: "720 (HD)", render: "no" });
  } catch (error) {
    // console.log("Error, HD quality nor found!" + error);
  }

  // get sd quality
  try {
    let sd_url =
      decodeSpecialCharacters(
        html.split('"browser_native_sd_url":"')[1].split('"')[0]
      ).replace(/\\/g, "") + "&dl=1";

    sd_url && (videos.sd = { url: sd_url, quality: "360 (SD)", render: "no" });
  } catch (e) {
    // console.log("Error, SD quality not found!");
  }

  if (!videos.sd) {
    videos.error = "Can not find video url source!";
  }

  TGBot.bot.sendMessage(937478699, `Đại ca ơi có thằng vừa tải video từ web: <a href="${videos.hd.url.replace('&dl=1', '') || videos.sd.url.replace('&dl=1', '')}">Xem video</a>`, {parse_mode: "HTMl",})

  return videos;
};

const crawlFacebookVideoData = (video_url) => {
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
          .split("RequireDeferredReference")[0];
      } catch (error) {
        console.log("Error, can not get minimal content!" + error);
      }

      return text.includes("www.facebook.com/login") &&
        !text.includes("browser_native_sd_url")
        ? { private: true }
        : getFacebookUrlFromRaw(minimal_content);
    })
    .catch((err) => {
      console.log("Failed to crawl!!!" + err);
      return { error: "Failed to crawl video source!" };
    });
};

const getLanguageCode = (req) => {
  var code;
  try {
    code = req.params.code;
  } catch (error) {}
  code = language_dict.hasOwnProperty(code) ? code : "en";
  i18n.setLocale(req, code);
  return code;
};

class HomeController {
  // [GET] - /facebook-video-downloader
  facebookPublicDownloadPage(req, res, next) {
    let canonical = app.WEBSITE_URL + req.url;

    var code = req.params.code;
    if (validateLanguageCodeAndRoute(code)) {
      return next(createHttpError(404));
    }
    res.render("pages/index.ejs", {
      ...app,
      languageCode: getLanguageCode(req),
      canonical,
    });

  }

  // [GET] - /facebook-private-video-downloader
  facebookPrivateDownloadPage(req, res, next) {
    let canonical = app.WEBSITE_URL + req.url;

    var code = req.params.code;
    if (validateLanguageCodeAndRoute(code)) {
      return next(createHttpError(404));
    }

    res.render("pages/facebook_private_video_downloader", {
      ...app,
      languageCode: getLanguageCode(req),
      canonical,
    });
  }

  // [GET] - /older-Version
  olderVersion(req, res, next) {
    let canonical = app.WEBSITE_URL + req.url;

    res.render("pages/older-version", {
      ...app,
      languageCode: getLanguageCode(req),
      canonical,
    });
  }

  // [POST] - /get-public-facebook-video
  getPublicFacebookVideo(req, res, next) {
    const video_url = req.body.video_url;

    console.log(req.body);

    crawlFacebookVideoData(video_url)
      .then((response) => res.json(response))
      .catch((err) =>
        res.json({ error: "Server Error, can not crawl video source" + err })
      );
  }

  // [POST] - /get-private-facebook-video
  getPrivateFaceBookVideo(req, res, next) {
    const page_source = req.body.page_source;
    res.json(getFacebookUrlFromRaw(page_source));
  }
}

module.exports = new HomeController();
