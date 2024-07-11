const bs58 = require('bs58');
const { Keypair, PublicKey } = require('@solana/web3.js');
const connection = require('@/configs/connection');
const { WalletNotFoundError } = require('@/errors/common');
const { createTrade } = require('@/controllers/trade.controller');
const { findWallet } = require('@/controllers/wallet.controller');
const { findSettings } = require('@/controllers/settings.controller');
const { coverFee } = require('@/features/fee.feature');
const { initiateSwap, swapToken } = require('@/features/swap.feature');
const { confirmTransaction } = require('@/services/solana');
const { getPair } = require('@/services/dexscreener');
const {
  transactionInitiateMsg,
  transactionBuildFailedMsg,
  transactionConfirmedMsg,
  transactionFailedMsg,
} = require('./messages');

const parseTransaction = async (bot, msg, { copyWalletAddress }) => {
  const chatId = msg.chat.id;

  const settings = await findSettings(chatId);
  if (settings === null) {
    console.error(SettingsNotFoundError);
    return;
  }

  const signatures = await connection.getSignaturesForAddress(new PublicKey(copyWalletAddress));
  const transaction = await connection.getTransaction(signatures[0].signature, {
    maxSupportedTransactionVersion: 0
  });

  const meta = transaction.meta
  if (meta.err) return;

  const postTokenBalances = meta.postTokenBalances;
  const preTokenBalances = meta.preTokenBalances;
  if (postTokenBalances.length === 0 || preTokenBalances.length === 0)
    return;
  

  let inputMint, outputMint, slippage, amount, mode;
  const isAuto = true;

  const targetTokenBalances = postTokenBalances.filter(one => one.owner === copyWalletAddress);
  console.log("targetTokneBalances => ", targetTokenBalances)
  if (targetTokenBalances.length <= 0)
    return
  
  const postAmount = targetTokenBalances[0].uiTokenAmount.uiAmount;
  const preAmount = preTokenBalances.filter(one => one.accountIndex === targetTokenBalances[0].accountIndex)[0].uiTokenAmount.uiAmount;
  
  const pair = await getPair(targetTokenBalances[0].mint);
  priceSol = parseFloat(pair.priceNative);
  amount=(postAmount-preAmount)*priceSol* Math.pow(10, 9)
  
  if (postAmount === preAmount) {
    return
  } else if (postAmount > preAmount) {
    inputMint = 'So11111111111111111111111111111111111111112';
    outputMint = targetTokenBalances[0].mint;
    slippage = settings.autoBuySlippage;
    amount = parseInt(amount* 0.99);
    mode = 'buy';
  } else {
    inputMint = targetTokenBalances[0].mint;
    outputMint = 'So11111111111111111111111111111111111111112';
    slippage = settings.autoSellSlippage;
    amount = parseInt(-amount / preAmount);
    mode = 'sell';
  }

  const timer = setTimeout(async () => {
    const result = copyTrade(bot, msg, {
      inputMint,
      outputMint,
      amount,
      slippage,
      mode,
      isAuto
    });
    if (result === 'success') clearTimeout(timer)
  }, 1000)

};

const copyTrade = async (bot, msg, params) => {
  const chatId = msg.chat.id;
  const { inputMint, outputMint, amount, slippage, mode, isAuto } = params;

  const wallet = findWallet(chatId);
  if (wallet === null) {
    console.error(WalletNotFoundError);
    return;
  }

  let txid, quoteResponse;
  const payer = Keypair.fromSecretKey(bs58.decode(wallet.secretKey));

  bot.sendMessage(chatId, await transactionInitiateMsg({ mode, isAuto }), {
    parse_mode: 'HTML',
  }).then(async ({ message_id }) => {
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

      await confirmTransaction(txid);

      bot.editMessageText(transactionConfirmedMsg({ mode, isAuto, txid }), {
        chat_id: chatId,
        message_id,
        parse_mode: 'HTML',
        disable_web_page_preview: true,
      });

      createTrade({
        userId: chatId.toString(),
        inputMint: quoteResponse.inputMint,
        inAmount: amount,
        outputMint: quoteResponse.outputMint,
        outAmount: parseInt(
          quoteResponse.outAmount * (mode === 'buy' ? 1 : 0.99)
        ),
      });

      if (quoteResponse.inputMint === 'So11111111111111111111111111111111111111112') {
        await coverFee(chatId, amount / 100);
      } else {
        await coverFee(chatId, quoteResponse.outAmount / 100);
      }
      return 'success';
    } catch (e) {
      console.error(e);
      bot.sendMessage(chatId, transactionFailedMsg({ mode, isAuto, txid }), {
        parse_mode: 'HTML',
        disable_web_page_preview: true,
      });
      return 'fail';
    }
  });
};

module.exports = {
  parseTransaction,
  copyTrade,
};
