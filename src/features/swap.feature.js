const { VersionedTransaction } = require('@solana/web3.js');
const connection = require('@/configs/connection');
const { getQuote, getSwapTransaction } = require('@/services/jupiter');

const signTransaction = (swapTransaction, payer) => {
  const swapTransactionBuf = Buffer.from(swapTransaction, 'base64');
  const transaction = VersionedTransaction.deserialize(swapTransactionBuf);
  transaction.sign([payer]);
  return transaction;
};

const executeTransaction = async (transaction) => {
  const rawTransaction = await transaction.serialize();
  const options = {
    skipPreflight: true,
    commitment: 'confirmed', // Adjust as needed
    preflightCommitment: 'processed',
  };
  const txid = await connection.sendRawTransaction( rawTransaction, options);

  return txid;
};

const initiateSwap = async ({ inputMint, outputMint, amount, payer, slippageBps }) => {
  const quoteResponse = await getQuote({
    inputMint,
    outputMint,
    amount,
    slippageBps,
  });

  if (quoteResponse.error) {
    throw new Error(quoteResponse.error);
  }

  const { swapTransaction } = await getSwapTransaction({
    quoteResponse,
    payer,
  });

  return {
    quoteResponse,
    swapTransaction,
  };
};

const swapToken = async (swapTransaction, payer) => {
  const transaction = signTransaction(swapTransaction, payer);
  return executeTransaction(transaction);
};

module.exports = {
  initiateSwap,
  swapToken,
};
