const { showReferrals } = require('@/events/referrals.event');

const referralsRouter = (bot) => {
  bot.onText(/^\/referrals$/, (msg) => {
    if (msg.chat.id) {
      showReferrals(bot, msg);
    }
  });

  bot.on('callback_query', (query) => {
    const data = query.data.split(' ');

    switch (data[0]) {
      case 'showReferrals':
        showReferrals(bot, query.message);
        break;
      default:
    }
  });
};

module.exports = referralsRouter;
