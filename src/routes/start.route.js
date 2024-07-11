const { start } = require('@/events/start.event');

const startRouter = (bot) => {
  bot.onText(/^\/start(?: ref_(\w+))?$/, (msg, match) => {
    if (msg.chat.id) {
      start(bot, msg, { code: match[1], refresh: false });
    }
  });

  bot.on('callback_query', (query) => {
    const data = query.data.split(' ');

    switch (data[0]) {
      case 'refreshStart':
        start(bot, query.message, { refresh: true });
        break;
      default:
    }
  });
};

module.exports = startRouter;
