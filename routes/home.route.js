var express = require("express");
var homeRouter = express.Router();
var homeCtrl = require("../controllers/home.controller");

// render pages
homeRouter.get("/", homeCtrl.index);
homeRouter.get("/facebook-private-video-downloader", homeCtrl.privateDownloadPage);
homeRouter.get("/tiktok-video-downloader", homeCtrl.tiktokDownloadPage);

// handle get video source requests
homeRouter.post("/get-public-video", homeCtrl.getPublicVideo);
homeRouter.post("/get-private-video", homeCtrl.getPrivateVideo);
homeRouter.post("/get-tiktok-video", homeCtrl.getTikTokVideo);

module.exports = homeRouter;
