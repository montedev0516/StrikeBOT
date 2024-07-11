const { help } = require('@/events/help.event');

const helpRouter = (bot) => {
  bot.onText(/^\/help$/, (msg) => {
    if (msg.chat.id) {
      help(bot, msg);
    }
  });
};

module.exports = helpRouter;
