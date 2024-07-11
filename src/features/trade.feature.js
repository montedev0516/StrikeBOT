const { LAMPORTS_PER_SOL } = require('@solana/web3.js');
const { getTradesData } = require('@/controllers/trade.controller');

const getTrade = async ({ userId, mint, decimals, priceNative }) => {
  const { initial, baseAmount, quoteAmount } = await getTradesData(
    userId,
    mint
  );

  const profitSol =
    (quoteAmount / 10 ** decimals) * priceNative -
    baseAmount / LAMPORTS_PER_SOL;
  const profitPercent = (profitSol * 100.0) / (initial / LAMPORTS_PER_SOL);

  return { initial: initial / LAMPORTS_PER_SOL, profitSol, profitPercent };
};

module.exports = {
  getTrade,
};
