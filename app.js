var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var partials = require("express-partials");
var mongoose = require("mongoose");
var fs = require("fs");
var i18n = require("i18n");
const glob = require("glob");
const routes = require("./routes");
const os = require("os");
var app = express();

i18n.configure({
    locales: [
        "af",
        "sq",
        "am",
        "ar",
        "hy",
        "az",
        "eu",
        "be",
        "bn",
        "bs",
        "bg",
        "ca",
        "ceb",
        "zh-CN",
        "zh-TW",
        "co",
        "hr",
        "cs",
        "da",
        "nl",
        "en",
        "eo",
        "et",
        "fi",
        "fr",
        "fy",
        "gl",
        "ka",
        "de",
        "el",
        "gu",
        "ht",
        "ha",
        "haw",
        "iw",
        "hi",
        "hmn",
        "hu",
        "is",
        "ig",
        "id",
        "ga",
        "it",
        "ja",
        "jw",
        "kn",
        "kk",
        "km",
        "ko",
        "ku",
        "ky",
        "lo",
        "la",
        "lv",
        "lt",
        "lb",
        "mk",
        "mg",
        "ms",
        "ml",
        "mt",
        "mi",
        "mr",
        "mn",
        "my",
        "ne",
        "no",
        "ny",
        "ps",
        "fa",
        "pl",
        "pt",
        "pa",
        "ro",
        "ru",
        "sm",
        "gd",
        "sr",
        "st",
        "sn",
        "sd",
        "si",
        "sk",
        "sl",
        "so",
        "es",
        "su",
        "sw",
        "sv",
        "tl",
        "tg",
        "ta",
        "te",
        "th",
        "tr",
        "uk",
        "ur",
        "uz",
        "vi",
        "cy",
        "xh",
        "yi",
        "yo",
        "zu",
    ],
    directory: __dirname + "/language",
    cookie: "lang",
    header: "accept-language",
});

const language_dict = {};
glob.sync("./language/*.json").forEach(function (file) {
    let dash = file.split("/");
    console.log(dash);
    if (dash.length == 2) {
        let dot = dash[1].split(".");
        if (dot.length == 2) {
            let lang = dot[0];
            fs.readFile(file, function (err, data) {
                language_dict[lang] = JSON.parse(data.toString());
            });
        }
    } else {
        console.log("fdfd");
    }
});

app.use(i18n.init);

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(partials());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// Lấy danh sách các giao diện mạng của máy tính
const networkInterfaces = os.networkInterfaces();

// Duyệt qua danh sách và lấy ra địa chỉ IPv4
let serverIP = null;
Object.keys(networkInterfaces).forEach((interfaceName) => {
    const interfaces = networkInterfaces[interfaceName];
    interfaces.forEach((interfaceInfo) => {
        if (interfaceInfo.family === "IPv4" && !interfaceInfo.internal) {
            serverIP = interfaceInfo.address;
        }
    });
});

console.log("=====================================");
console.log(`Server IP: ${serverIP}:${process.env.PORT}`);
console.log("=====================================");

routes(app);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render("error");
});

// mongoose
// 	.connect(process.env.MONGODB_CONNECTION_STRING)
// 	.then((success) => console.log("Connected to mongodb server!"))
// 	.catch((err) => console.log("Error, Couldn't connect to mongodb server!!!\n> Stack: " + err));

module.exports = app;
