const { buyX, buyAmount } = require('@/events/buy.event');

const buyRouter = (bot) => {
  bot.on('callback_query', (query) => {
    const data = query.data.split(' ');

    switch (data[0]) {
      case 'buyX':
        buyX(bot, query.message, { mintAddress: data[1] });
        break;
      case 'buyAmount':
        buyAmount(bot, query.message, {
          mintAddress: data[1],
          amount: parseFloat(data[2]),
        });
        break;
      default:
    }
  });
};

module.exports = buyRouter;
