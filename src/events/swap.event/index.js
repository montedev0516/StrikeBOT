const bs58 = require('bs58');
const { Keypair } = require('@solana/web3.js');
const { WalletNotFoundError } = require('@/errors/common');
const { createTrade } = require('@/controllers/trade.controller');
const { findWallet } = require('@/controllers/wallet.controller');
const { showPositionAfterTrade } = require('@/events/manage.event');
const { coverFee } = require('@/features/fee.feature');
const { initiateSwap, swapToken } = require('@/features/swap.feature');
const { confirmTransaction } = require('@/services/solana');
const {
  transactionInitiateMsg,
  transactionBuildFailedMsg,
  transactionSentMsg,
  transactionConfirmedMsg,
  transactionFailedMsg,
} = require('./messages');

const swap = async (bot, msg, params) => {
  const chatId = msg.chat.id;
  const { inputMint, outputMint, amount, slippage, mode, isAuto } = params;

  const wallet = findWallet(chatId);
  if (wallet === null) {
    console.error(WalletNotFoundError);
    return;
  }

  const payer = Keypair.fromSecretKey(bs58.decode(wallet.secretKey));

  bot
    .sendMessage(chatId, transactionInitiateMsg({ mode, isAuto }), {
      parse_mode: 'HTML',
    })
    .then(async ({ message_id }) => {
      let txid, quoteResponse;

      try {
        const res = await initiateSwap({
          inputMint,
          outputMint,
          amount: mode === 'buy' ? parseInt(amount * 0.99) : parseInt(amount),
          slippageBps: slippage,
          payer,
        });
        quoteResponse = res.quoteResponse;
        txid = await swapToken(res.swapTransaction, payer);
      } catch (e) {
        console.error(e);
        bot.editMessageText(transactionBuildFailedMsg({ mode, isAuto }), {
          chat_id: chatId,
          message_id,
          parse_mode: 'HTML',
          disable_web_page_preview: true,
        });
        return;
      }

      await bot.editMessageText(transactionSentMsg({ mode, isAuto }), {
        chat_id: chatId,
        message_id: message_id,
        parse_mode: 'HTML',
      });

      try {
        await confirmTransaction(txid);

        bot.editMessageText(transactionConfirmedMsg({ mode, isAuto, txid }), {
          chat_id: chatId,
          message_id,
          parse_mode: 'HTML',
          disable_web_page_preview: true,
        });

        showPositionAfterTrade(bot, msg, {
          mint: mode === 'buy' ? outputMint : inputMint,
          tradeAmount:
            mode === 'buy' ? quoteResponse.outAmount : -quoteResponse.inAmount,
        });

        createTrade({
          userId: chatId.toString(),
          inputMint: quoteResponse.inputMint,
          // inAmount: quoteResponse.inAmount,
          inAmount: amount,
          outputMint: quoteResponse.outputMint,
          outAmount: parseInt(
            quoteResponse.outAmount * (mode === 'buy' ? 1 : 0.99)
          ),
        });

        if (
          quoteResponse.inputMint ===
          'So11111111111111111111111111111111111111112'
        ) {
          coverFee(chatId, amount / 100);
        } else {
          coverFee(chatId, quoteResponse.outAmount / 100);
        }
      } catch (e) {
        console.error(e);
        bot.editMessageText(transactionFailedMsg({ mode, isAuto, txid }), {
          chat_id: chatId,
          message_id,
          parse_mode: 'HTML',
          disable_web_page_preview: true,
        });
      }
    });
};

module.exports = {
  swap,
};
