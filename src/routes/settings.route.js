const {
  showSettings,
  toggleSetting,
  editSetting,
  addStrategy,
  editStrategy
} = require('@/events/settings.event');

const settingsRouter = (bot) => {
  bot.onText(/^\/settings$/, (msg, match) => {
    if (msg.chat.id) {
      showSettings(bot, msg, { refresh: false });
    }
  });

  bot.on('callback_query', (query) => {
    const data = query.data.split(' ');

    switch (data[0]) {
      case 'showSettings':
        showSettings(bot, query.message, { refresh: true });
        break;
      case 'toggleSetting':
        toggleSetting(bot, query.message, {
          name: data[1],
          value: parseInt(data[2]),
        });
        break;
      case 'editSetting':
        editSetting(bot, query.message, {
          name: data[1],
        });
        break;
      case 'addStrategy':
        addStrategy(bot, query.message);
        break;
      case 'editStrategy':
        editStrategy(bot, query.message, {
          name: data[1],
          id: data[2]
        });
        break;
      default:
    }
  });
};

module.exports = settingsRouter;
