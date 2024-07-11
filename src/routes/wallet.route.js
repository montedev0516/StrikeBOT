const {
  showWallet,
  deposit,
  resetWallet,
  confirmResetWallet,
  exportPrivateKey,
  confirmExportPrivateKey,
} = require('@/events/wallet.event');

const walletRouter = (bot) => {
  bot.onText(/^\/wallet$/, (msg) => {
    if (msg.chat.id) {
      showWallet(bot, msg, { refresh: false });
    }
  });

  bot.on('callback_query', (query) => {
    const data = query.data.split(' ');

    switch (data[0]) {
      case 'showWallet':
        showWallet(bot, query.message, { refresh: false });
        break;
      case 'deposit':
        deposit(bot, query.message);
        break;
      case 'resetWallet':
        resetWallet(bot, query.message);
        break;
      case 'confirmResetWallet':
        confirmResetWallet(bot, query.message);
        break;
      case 'exportPrivateKey':
        exportPrivateKey(bot, query.message);
        break;
      case 'confirmExportPrivateKey':
        confirmExportPrivateKey(bot, query.message);
        break;
      case 'refreshWallet':
        showWallet(bot, query.message, { refresh: true });
        break;
      default:
    }
  });
};

module.exports = walletRouter;
