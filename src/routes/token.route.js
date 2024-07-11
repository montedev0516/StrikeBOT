const { buyToken, copyTrade, processToken, showToken, tokenSniper } = require('@/events/token.event');

const tokenRouter = (bot) => {
  bot.on('callback_query', (query) => {
    const data = query.data.split(' ');

    switch (data[0]) {
      case 'buyToken':
        buyToken(bot, query.message);
        break;
      case 'refreshToken':
        showToken(bot, query.message, { mintAddress: data[1], refresh: true });
        break;
      case 'copyTrades':
        copyTrade(bot, query.message);
        break;
      case 'tokenSniper':
        tokenSniper(bot, query.message);
        break;
      default:
    }
  });

  bot.on('message', (msg) => {
    if (msg.text.startsWith('/') || msg.reply_to_message) {
      return;
    }

    processToken(bot, msg);
  });
};

module.exports = tokenRouter;
