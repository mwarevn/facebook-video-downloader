var token = process.env.TELEGRAM_BOT_TOKEN;
var TelegramBot = require("node-telegram-bot-api");

var bot = new TelegramBot(token, { polling: true });


module.exports = {
    bot,
    token
}