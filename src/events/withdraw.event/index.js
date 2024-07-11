const { LAMPORTS_PER_SOL } = require('@solana/web3.js');
const { findWallet } = require('@/controllers/wallet.controller');
const { WalletNotFoundError } = require('@/errors/common');
const { transferLamports } = require('@/features/transfer.feature');
const { confirmTransaction, getBalance } = require('@/services/solana');
const {
  replyAmountMsg,
  replyAddressMsg,
  invalidNumberMsg,
  transactionInitiateMsg,
  transactionBuildFailedMsg,
  transactionSentMsg,
  transactionConfirmedMsg,
  transactionFailedMsg,
} = require('./messages');

const withdrawX = async (bot, msg) => {
  const chatId = msg.chat.id;

  const wallet = findWallet(chatId);
  if (wallet === null) {
    console.error(WalletNotFoundError);
    return;
  }

  const balance = await getBalance(wallet.publicKey);

  bot
    .sendMessage(chatId, replyAmountMsg(balance), {
      reply_markup: {
        force_reply: true,
      },
    })
    .then(({ message_id }) => {
      bot.onReplyToMessage(chatId, message_id, (reply) => {
        replyAmount(bot, reply, balance);
      });
    });
};

const withdrawAll = async (bot, msg) => {
  const chatId = msg.chat.id;

  const wallet = findWallet(chatId);
  if (wallet === null) {
    console.error(WalletNotFoundError);
    return;
  }

  const amount = await getBalance(wallet.publicKey);
  replyAddress(bot, msg, amount);
};

const replyAmount = async (bot, msg, balance) => {
  const chatId = msg.chat.id;
  const amount = parseFloat(msg.text);

  if (isNaN(amount) || amount < 0 || amount > balance) {
    bot
      .sendMessage(chatId, invalidNumberMsg({ text: amount, balance }), {
        reply_markup: { force_reply: true },
      })
      .then(({ message_id }) => {
        bot.onReplyToMessage(chatId, message_id, (reply) => {
          replyAmount(bot, reply, balance);
        });
      });
  } else {
    replyAddress(bot, msg, amount);
  }
};

const replyAddress = async (bot, msg, amount) => {
  const chatId = msg.chat.id;

  bot
    .sendMessage(chatId, replyAddressMsg(), {
      reply_markup: {
        force_reply: true,
      },
    })
    .then(({ message_id }) => {
      bot.onReplyToMessage(chatId, message_id, async (reply) => {
        withdraw(bot, msg, {
          toPubkey: reply.text,
          amount: amount * LAMPORTS_PER_SOL - 5000,
        });
      });
    });
};

const withdraw = (bot, msg, { toPubkey, amount }) => {
  const chatId = msg.chat.id;

  const wallet = findWallet(chatId);
  if (wallet === null) {
    console.error(WalletNotFoundError);
    return;
  }

  bot
    .sendMessage(chatId, transactionInitiateMsg())
    .then(async ({ message_id }) => {
      let txid;

      try {
        txid = await transferLamports(
          wallet.secretKey,
          toPubkey,
          parseInt(amount)
        );
      } catch (e) {
        console.error(e);
        bot.editMessageText(transactionBuildFailedMsg(), {
          chat_id: msg.chat.id,
          message_id: message_id,
          disable_web_page_preview: true,
          parse_mode: 'HTML',
        });
        return;
      }

      await bot.editMessageText(transactionSentMsg(txid), {
        chat_id: chatId,
        message_id,
        disable_web_page_preview: true,
        parse_mode: 'HTML',
      });

      try {
        await confirmTransaction(txid);
        bot.editMessageText(transactionConfirmedMsg(txid), {
          chat_id: chatId,
          message_id,
          disable_web_page_preview: true,
          parse_mode: 'HTML',
        });
      } catch (error) {
        bot.editMessageText(transactionFailedMsg(error), {
          chat_id: chatId,
          message_id,
          disable_web_page_preview: true,
          parse_mode: 'HTML',
        });
      }
    });
};

module.exports = {
  withdrawX,
  withdrawAll,
};
