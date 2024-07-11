const { managePositions } = require('@/events/manage.event');

const manageRouter = (bot) => {
  bot.onText(/^\/(\d)+$/, (msg, match) => {
    if (msg.chat.id) {
      managePositions(bot, msg, { index: parseInt(match[1]), refresh: false });
    }
  });

  bot.on('callback_query', (query) => {
    const data = query.data.split(' ');

    switch (data[0]) {
      case 'managePositions':
        managePositions(bot, query.message, { index: 1, refresh: false });
        break;
      case 'refreshManagePositions':
        managePositions(bot, query.message, {
          index: parseInt(data[1]),
          refresh: true,
        });
        break;
      default:
    }
  });
};

module.exports = manageRouter;
