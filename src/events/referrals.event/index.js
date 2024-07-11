const { getNumberOfReferrals } = require('@/controllers/user.controller');
const { getLifeTimeIncome } = require('@/controllers/income.controller');
const { encrypt } = require('@/utils');
const { referralsMsg } = require('./messages');
const { referralsKeyboard } = require('./keyboards');

const showReferrals = async (bot, msg) => {
  const chatId = msg.chat.id;
  const { message, keyboard } = await showReferrals.getMessage(chatId);

  bot.sendMessage(chatId, message, {
    parse_mode: 'HTML',
    reply_markup: {
      inline_keyboard: keyboard,
    },
  });
};

showReferrals.getMessage = async (chatId) => {
  const code = encrypt(chatId.toString());
  const referrals = await getNumberOfReferrals(chatId);
  const income = await getLifeTimeIncome(chatId);

  return {
    message: referralsMsg({ code, referrals, income }),
    keyboard: referralsKeyboard(),
  };
};

module.exports = {
  showReferrals,
};
