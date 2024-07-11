const { sellX, sellPercent } = require('@/events/sell.event');

const sellRouter = (bot) => {
  bot.on('callback_query', (query) => {
    const data = query.data.split(' ');

    switch (data[0]) {
      case 'sellX':
        sellX(bot, query.message, { ata: data[1] });
        break;
      case 'sellPercent':
        sellPercent(bot, query.message, {
          ata: data[1],
          percent: parseFloat(data[2]),
        });
        break;
      default:
    }
  });
};

module.exports = sellRouter;
