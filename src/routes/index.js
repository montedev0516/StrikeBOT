const startRouter = require('./start.route');
const tokenRouter = require('./token.route');
const manageRouter = require('./manage.route');
const buyRouter = require('./buy.route');
const sellRouter = require('./sell.route');
const walletRouter = require('./wallet.route');
const withdrawRouter = require('./withdraw.route');
const settingsRouter = require('./settings.route');
const referralsRouter = require('./referrals.route');
const helpRouter = require('./help.route');

const router = (bot) => {
  startRouter(bot);
  tokenRouter(bot);
  manageRouter(bot);
  buyRouter(bot);
  sellRouter(bot);
  walletRouter(bot);
  withdrawRouter(bot);
  settingsRouter(bot);
  referralsRouter(bot);
  helpRouter(bot);

  bot.on('callback_query', (query) => {
    const data = query.data.split(' ');
    switch (data[0]) {
      case 'close':
        const chatId = query.message.chat.id;
        const messageId = query.message.message_id;
        bot.deleteMessage(chatId, messageId);
        break;
    }
    bot.answerCallbackQuery(query.id);
  });

  bot.on('polling_error', (e) => {
    console.error(e);
  });
};

module.exports = router;
