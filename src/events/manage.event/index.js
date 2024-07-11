const { LAMPORTS_PER_SOL } = require('@solana/web3.js');
const {
  SettingsNotFoundError,
  WalletNotFoundError,
} = require('@/errors/common');
const { findWallet } = require('@/controllers/wallet.controller');
const { findSettings } = require('@/controllers/settings.controller');
const { getTradesData } = require('@/controllers/trade.controller');
const {
  getTokenAccountByIndex,
  getTokenAccountByMint,
} = require('@/features/token.feature');
const { getTrade } = require('@/features/trade.feature');
const { getBalance } = require('@/services/solana');
const { clearAllInterval } = require('@/store');
const { positionMessage, noOpenPositionsMessage } = require('./messages');
const { positionKeyboard, noOpenPositionsKeyboard } = require('./keyboards');

const TimeInterval = 30 * 1000;

const managePositions = async (bot, msg, params) => {
  await managePositionsInterval(bot, msg, params);

  // clearAllInterval();

  // const id = setInterval(async () => {
  //   await managePositionsInterval(bot, msg, { ...params, refresh: true });
  // }, TimeInterval)

  // setIntervalID({
  //   start: null,
  //   managePostition: id,
  //   token: null,
  // })
};

const managePositionsInterval = async (bot, msg, params) => {
  const chatId = msg.chat.id;
  const { index, refresh } = params;

  const wallet = findWallet(chatId);
  if (wallet === null) {
    console.error(WalletNotFoundError);
    return;
  }

  const settings = await findSettings(chatId);
  if (settings === null) {
    console.error(SettingsNotFoundError);
    return;
  }

  const { message, keyboard } = await managePositionsInterval.getMessage({
    userId: chatId.toString(),
    wallet,
    settings,
    index,
  });

  if (refresh === false) {
    bot.sendMessage(chatId, message, {
      parse_mode: 'HTML',
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
        reply_markup: {
          inline_keyboard: keyboard,
        },
      })
      .catch(() => { });
  }
}

managePositionsInterval.getMessage = async ({ userId, wallet, settings, index }) => {
  const walletAddress = wallet.publicKey;
  const walletBalance = await getBalance(walletAddress);

  const tokenAccount = await getTokenAccountByIndex(walletAddress, index);

  if (tokenAccount === null) {
    return {
      message: noOpenPositionsMessage(),
      keyboard: noOpenPositionsKeyboard(),
    };
  }

  const trade = await getTrade({
    userId,
    mint: tokenAccount.mint,
    decimals: tokenAccount.decimals,
    priceNative: tokenAccount.priceNative,
  });

  return {
    message: positionMessage({
      tokenAccount,
      trade,
      walletBalance,
    }),
    keyboard: positionKeyboard({
      tokenAccount,
      index,
      settings,
    }),
  };
};

const showPositionAfterTrade = async (bot, msg, params) => {
  const chatId = msg.chat.id;
  const { mint, tradeAmount } = params;

  const wallet = findWallet(chatId);
  if (wallet === null) {
    console.error(WalletNotFoundError);
    return;
  }

  const settings = await findSettings(chatId);
  if (settings === null) {
    console.error(SettingsNotFoundError);
    return;
  }

  const { message, keyboard } = await showPositionAfterTrade.getMessage({
    userId: chatId.toString(),
    wallet,
    settings,
    mint,
    tradeAmount,
  });

  if (message === null && keyboard === null) {
    return;
  }

  bot.sendMessage(chatId, message, {
    parse_mode: 'HTML',
    reply_markup: {
      inline_keyboard: keyboard,
    },
  });
};

showPositionAfterTrade.getMessage = async ({
  userId,
  wallet,
  settings,
  mint,
  tradeAmount,
}) => {
  const walletAddress = wallet.publicKey;
  const walletBalance = await getBalance(walletAddress);

  const tokenAccount = await getTokenAccountByMint(
    walletAddress,
    mint,
    tradeAmount
  );

  if (tokenAccount.balance === 0) {
    return {
      message: null,
      keyboard: null,
    };
  }

  const trade = await getTrade({
    userId,
    mint: tokenAccount.mint,
    decimals: tokenAccount.decimals,
    priceNative: tokenAccount.priceNative,
  });

  const index = tokenAccount.index;
  tokenAccount.index = undefined;

  return {
    message: positionMessage({
      tokenAccount,
      trade,
      walletBalance,
    }),
    keyboard: positionKeyboard({
      tokenAccount,
      index,
      settings,
    }),
  };
};

module.exports = {
  managePositions,
  showPositionAfterTrade,
};
