const { WalletNotFoundError } = require('@/errors/common');
const { findWallet, updateWallet } = require('@/controllers/wallet.controller');
const { getBalance } = require('@/services/solana');
const {
  walletMsg,
  depositMsg,
  walletAddressMsg,
  resetWalletMsg,
  oldPrivateKeyMsg,
  newWalletMsg,
  exportPrivateKeyMsg,
  privateKeyMsg,
} = require('./messages');
const {
  walletKeyboard,
  resetWalletKeyboard,
  exportPrivateKeyKeyboard,
} = require('./keyboards');

const showWallet = async (bot, msg, params) => {
  const chatId = msg.chat.id;
  const { refresh } = params;

  const wallet = findWallet(chatId);
  if (wallet === null) {
    console.error(WalletNotFoundError);
    return;
  }

  const balance = await getBalance(wallet.publicKey);
  const message = walletMsg({ address: wallet.publicKey, balance });
  const keyboard = walletKeyboard({ address: wallet.publicKey });

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
      .catch(() => {});
  }
};

const deposit = (bot, msg) => {
  const chatId = msg.chat.id;

  const wallet = findWallet(chatId);
  if (wallet === null) {
    console.error(WalletNotFoundError);
    return;
  }

  bot.sendMessage(chatId, depositMsg()).then(async () => {
    bot.sendMessage(chatId, walletAddressMsg(wallet.publicKey), {
      parse_mode: 'HTML',
    });
  });
};

const resetWallet = (bot, msg) => {
  const chatId = msg.chat.id;

  bot.sendMessage(chatId, resetWalletMsg(), {
    parse_mode: 'HTML',
    reply_markup: {
      inline_keyboard: resetWalletKeyboard(),
    },
  });
};

const confirmResetWallet = (bot, msg) => {
  const chatId = msg.chat.id;

  const wallet = findWallet(chatId);
  if (wallet === null) {
    console.error(WalletNotFoundError);
    return;
  }

  bot
    .sendMessage(chatId, oldPrivateKeyMsg(wallet.secretKey), {
      parse_mode: 'HTML',
    })
    .then(async () => {
      const wallet = await updateWallet(chatId);
      bot.sendMessage(chatId, newWalletMsg(wallet.publicKey), {
        parse_mode: 'HTML',
      });
    });
};

const exportPrivateKey = (bot, msg) => {
  const chatId = msg.chat.id;

  bot.sendMessage(chatId, exportPrivateKeyMsg(), {
    parse_mode: 'HTML',
    reply_markup: {
      inline_keyboard: exportPrivateKeyKeyboard(),
    },
  });
};

const confirmExportPrivateKey = (bot, msg) => {
  const chatId = msg.chat.id;

  const wallet = findWallet(msg.chat.id);
  if (wallet === null) {
    console.error(WalletNotFoundError);
    return;
  }

  bot.sendMessage(chatId, privateKeyMsg(wallet.secretKey), {
    parse_mode: 'HTML',
  });
};

module.exports = {
  showWallet,
  deposit,
  resetWallet,
  confirmResetWallet,
  exportPrivateKey,
  confirmExportPrivateKey,
};
