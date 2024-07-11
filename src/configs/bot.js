const TelegramBot = require("node-telegram-bot-api");
const commands = require("@/constants/commands");
const { description } = require("@/constants/descriptions");

const token = process.env.TELEGRAM_BOT_TOKEN;
const bot = new TelegramBot(token, { polling: true });

bot.setMyCommands(commands);
bot.setMyDescription({ description: description() });

module.exports = bot;
