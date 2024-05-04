var express = require("express");
var homeRouter = express.Router();
var homeCtrl = require("../controllers/home.controller");

// render pages

homeRouter.get("/", (req, res) => res.redirect("/facebook-video-downloader"));

homeRouter.get("/facebook-private-video-downloader", homeCtrl.facebookPrivateDownloadPage);
homeRouter.get("/tiktok-video-downloader", homeCtrl.tiktokDownloadPage);
homeRouter.get("/facebook-video-downloader", homeCtrl.facebookPublicDownloadPage);

// handle get video source requests
homeRouter.post("/get-details-tiktok-video", homeCtrl.getDetailsTikTokVideo);
homeRouter.post("/get-public-facebook-video", homeCtrl.getPublicFacebookVideo);
homeRouter.post("/get-private-facebook-video", homeCtrl.getPrivateFaceBookVideo);

module.exports = homeRouter;
