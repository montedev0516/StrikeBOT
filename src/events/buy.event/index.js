const { LAMPORTS_PER_SOL } = require('@solana/web3.js');
const { findSettings } = require('@/controllers/settings.controller');
const { findWallet } = require('@/controllers/wallet.controller');
const {
  SettingsNotFoundError,
  WalletNotFoundError,
} = require('@/errors/common');
const { swap } = require('@/events/swap.event');
const { getBalance } = require('@/services/solana');
const { replyAmountMsg, invalidAmountMsg } = require('./messages');

const buyX = async (bot, msg, params) => {
  const chatId = msg.chat.id;
  const { mintAddress } = params;

  const wallet = findWallet(chatId);
  if (wallet === null) {
    console.error(WalletNotFoundError);
    return;
  }

  const walletBalance = await getBalance(wallet.publicKey);

  bot
    .sendMessage(chatId, replyAmountMsg(walletBalance), {
      reply_markup: {
        force_reply: true,
      },
    })
    .then(({ message_id }) => {
      bot.onReplyToMessage(chatId, message_id, async (reply) => {
        const amount = parseFloat(reply.text);
        if (isNaN(amount) || amount < 0 || amount > walletBalance) {
          bot.sendMessage(chatId, invalidAmountMsg());
          return;
        }
        buyAmount(bot, msg, {
          mintAddress,
          amount,
        });
      });
    });
};

const buyAmount = async (bot, msg, params) => {
  const chatId = msg.chat.id;
  const { mintAddress, amount, isAuto } = params;

  const settings = await findSettings(chatId);
  if (settings === null) {
    console.error(SettingsNotFoundError);
    return;
  }

  swap(bot, msg, {
    inputMint: 'So11111111111111111111111111111111111111112',
    outputMint: mintAddress,
    amount: amount * LAMPORTS_PER_SOL,
    slippage: isAuto ? settings.autoBuySlippage : settings.buySlippage,
    mode: 'buy',
    isAuto,
  });
};

module.exports = {
  buyX,
  buyAmount,
};
