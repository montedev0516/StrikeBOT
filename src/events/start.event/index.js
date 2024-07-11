const { LAMPORTS_PER_SOL } = require('@solana/web3.js');
const { createSettings, findSettings } = require('@/controllers/settings.controller');
const { getTradesData } = require('@/controllers/trade.controller');
const { createUser, findUser } = require('@/controllers/user.controller');
const { createWallet, findWallet } = require('@/controllers/wallet.controller');
const { WalletNotFoundError } = require('@/errors/common');
const { autoSellToken } = require('@/events/token.event');
const { getTokenAccountsByOwner } = require('@/features/token.feature');
const { getBalance } = require('@/services/solana');
const { clearAllInterval, getIntervalID, setIntervalID } = require('@/store');
const { welcomeMsg, positionsMsg } = require('./messages');
const { startKeyboard } = require('./keyboards');

const TimeInterval = 30 * 1000;

const start = async (bot, msg, params) => {
  await startInterval(bot, msg, params);
  await autoSellToken(bot, msg);

  // clearAllInterval();

  // const startId = setInterval(async () => {
  //   await startInterval(bot, msg, { ...params, refresh: true });
  // }, TimeInterval)

  // let { autoSell } = getIntervalID();
  // if (!autoSell) {
  //   autoSell = setInterval(async () => {
  //     await autoSellToken(bot, msg);
  //   }, TimeInterval)
  // }

  // setIntervalID({
  //   start: startId,
  //   managePostition: null,
  //   token: null,
  //   autoSell: autoSell,
  // })
};

const startInterval = async (bot, msg, params) => {
  const chatId = msg.chat.id;
  const username = msg.chat.username;
  const { code, refresh } = params;

  if (findUser(chatId) === null) {
    await createUser(chatId, username, code);
    await createWallet(chatId);
    await createSettings(chatId);
  }

  const wallet = findWallet(chatId);
  if (wallet === null) {
    console.error(WalletNotFoundError);
    return;
  }

  const { message, keyboard } = await startInterval.getMessage(
    chatId,
    wallet.publicKey
  );

  if (refresh === false) {
    bot.sendMessage(chatId, message, {
      parse_mode: 'HTML',
      disable_web_page_preview: true,
      reply_markup: {
        inline_keyboard: keyboard,
      },
    });
  } else {
    bot
      .editMessageText(message, {
        chat_id: chatId,
        message_id: msg.message_id,
        parse_mode: 'HTML',
        disable_web_page_preview: true,
        reply_markup: {
          inline_keyboard: keyboard,
        },
      })
      .catch(() => { });
  }

  const settings = await findSettings(chatId);
  if (settings === null) {
    console.error(SettingsNotFoundError);
    return;
  }
};

startInterval.getMessage = async (userId, walletAddress) => {
  const walletBalance = await getBalance(walletAddress);
  const tokenAccounts = await getTokenAccountsByOwner(walletAddress);

  if (tokenAccounts.length === 0) {
    return {
      message: welcomeMsg({ walletAddress, walletBalance }),
      keyboard: startKeyboard(),
    };
  }

  for (i = tokenAccounts.length - 1; i >= 0; i--) {
    const { mint, decimals, priceNative } = tokenAccounts[i];
    const { initial, baseAmount, quoteAmount } = await getTradesData(
      userId,
      mint
    );

    const profitSol =
      (quoteAmount / 10 ** decimals) * priceNative -
      baseAmount / LAMPORTS_PER_SOL;
    const profitPercent = (profitSol * 100.0) / (initial / LAMPORTS_PER_SOL);

    tokenAccounts[i].profitSol = profitSol;
    tokenAccounts[i].profitPercent = profitPercent;
  }

  return {
    message: positionsMsg({ tokenAccounts, walletBalance }),
    keyboard: startKeyboard(),
  };
};

module.exports = {
  start,
};
