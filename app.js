var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var partials = require("express-partials");
var i18n = require("i18n");
var routes = require("./routes");
var os = require("os");
var cors = require("cors");
var app = express();
var { rateLimit } = require("express-rate-limit");

const telegram_bot_controller = require("./controllers/telegram.bot.controller");
var TGBot = require("./bot/TGBot");

const limiter = rateLimit({
  windowMs: 3000,
  limit: 5,
  handler: function (req, res, next) {
    next(createError(429, "Quý khách zui lòng thao tác chậmmmmmm lại :)"));
    // res.status(429).send("<script>alert('Quý khách zui lòng thao tác chậmmmmmm lại :)')</script>");
  },
});

const whitelist = ["https://fastsave.live"];
const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
};

i18n.configure({
  locales: [
    "af",
    "ga",
    "sq",
    "it",
    "ar",
    "ja",
    "az",
    "kn",
    "eu",
    "ko",
    "bn",
    "la",
    "be",
    "lv",
    "bg",
    "lt",
    "ca",
    "mk",
    "zh-CN",
    "ms",
    "zh-TW",
    "mt",
    "hr",
    "no",
    "cs",
    "da",
    "pl",
    "nl",
    "pt",
    "en",
    "ro",
    "eo",
    "ru",
    "sr",
    "sk",
    "fi",
    "sl",
    "fr",
    "es",
    "gl",
    "sw",
    "ka",
    "sv",
    "de",
    "el",
    "ht",
    "iw",
    "hi",
    "hu",
    "vi",
    "is",
    "cy",
    "id",
  ],
  directory: __dirname + "/language",
  cookie: "lang",
  header: "accept-language",
});
// i18n.init({
//   interpolation: {
//     escapeValue: false,
//   },
// });
app.use(i18n.init);
app.use(cors(corsOptions));
app.set("trust proxy", 1);
app.use(limiter);
app.use(cors());

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
console.log("Website URL: " + process.env.WEBSITE_URL);
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

telegram_bot_controller(TGBot.bot, TGBot.token);

module.exports = app;
