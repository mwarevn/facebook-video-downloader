var { app } = require("../utils/common");
var i18n = require("i18n");
var glob = require("glob");
var fs = require("fs");
var language_dict = {};
var createHttpError = require("http-errors");
const handle = require("../middlewares/handle");

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

function getLanguageCode(req) {
  var code;
  try {
    code = req.params.code;
  } catch (error) {}
  code = language_dict.hasOwnProperty(code) ? code : "en";
  i18n.setLocale(req, code);
  return code;
}

function validateLanguageCodeAndRoute(code) {
  return code && !language_dict.hasOwnProperty(code);
}

class HomeController {
  // [GET] - /facebook-video-downloader
  facebookPublicDownloadPage(req, res, next) {
    let canonical = app.WEBSITE_URL + req.url;

    var code = req.params.code;
    if (validateLanguageCodeAndRoute(code)) {
      return next(createHttpError(404));
    }

    code = getLanguageCode(req);

    res.render("pages/index.ejs", {
      ...app,
      languageCode: code,
      canonical,
      t: language_dict[code],
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

    handle
      .crawlFacebookVideoData(video_url)
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
