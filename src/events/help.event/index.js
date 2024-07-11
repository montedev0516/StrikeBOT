const { helpMsg } = require('./messages');
const { helpKeyboard } = require('./keyboards');

const help = (bot, msg) => {
  const chatId = msg.chat.id;

  bot.sendMessage(chatId, helpMsg(), {
    parse_mode: 'HTML',
    reply_markup: {
      inline_keyboard: helpKeyboard(),
    },
  });
};

module.exports = {
  help,
};
