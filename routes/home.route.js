var express = require("express");
var homeRouter = express.Router();
var homeCtrl = require("../controllers/home.controller");

homeRouter.get("/", homeCtrl.index);
homeRouter.get("/facebook-private-video-downloader", homeCtrl.privateDownloadPage);
homeRouter.post("/get-public-video", homeCtrl.getPublicVideo);
homeRouter.post("/get-private-video", homeCtrl.getPrivateVideo);

module.exports = homeRouter;
