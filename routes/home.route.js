var express = require("express");
var homeRouter = express.Router();
var homeCtrl = require("../controllers/home.controller");

// render pages

homeRouter.get(
	["/facebook-private-video-downloader", "/facebook-private-video-downloader/:code"],
	homeCtrl.facebookPrivateDownloadPage
);

homeRouter.get(["/older-version/:code", "/older-version/"], homeCtrl.olderVersion);


homeRouter.get(["/:code", "/"], homeCtrl.facebookPublicDownloadPage);

homeRouter.post("/get-public-facebook-video", homeCtrl.getPublicFacebookVideo);

homeRouter.post("/get-private-facebook-video", homeCtrl.getPrivateFaceBookVideo);

module.exports = homeRouter;
