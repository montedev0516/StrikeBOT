const { withdrawX, withdrawAll } = require('@/events/withdraw.event');

const withdrawRouter = (bot) => {
  bot.on('callback_query', (query) => {
    const data = query.data.split(' ');

    switch (data[0]) {
      case 'withdrawX':
        withdrawX(bot, query.message);
        break;
      case 'withdrawAll':
        withdrawAll(bot, query.message);
        break;
      default:
    }
  });
};

module.exports = withdrawRouter;
