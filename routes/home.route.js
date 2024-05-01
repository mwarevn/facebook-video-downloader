var express = require("express");
var homeRouter = express.Router();
var homeCtrl = require("../controllers/home.controller");

// render pages

homeRouter.get(
    ["/facebook-private-video-downloader/:lang", "/facebook-private-video-downloader"],
    homeCtrl.privateDownloadPage
);
homeRouter.get(["/tiktok-video-downloader/:lang", "/tiktok-video-downloader"], homeCtrl.tiktokDownloadPage);
homeRouter.get(["/:lang", "/"], homeCtrl.index);

// handle get video source requests
homeRouter.post("/save-tmp-blob", homeCtrl.saveTmpBlob);
homeRouter.post("/get-public-video", homeCtrl.getPublicVideo);
homeRouter.post("/get-private-video", homeCtrl.getPrivateVideo);
homeRouter.post("/get-tiktok-video", homeCtrl.getTikTokVideo);
homeRouter.post("/force-download-video-tiktok", homeCtrl.forceDownloadVideoTiktok);

module.exports = homeRouter;
