const { prisma } = require('../configs/database');

const createTrade = async (params) => {
  const trade = await prisma.trade.create({
    data: params,
  });
  return trade;
};

const getTradesData = async (userId, mintAddress) => {
  const trades = await prisma.trade.findMany({
    where: {
      userId: userId.toString(),
      OR: [
        { inputMint: mintAddress },
        { outputMint: mintAddress }
      ],
    },
    select: {
      inputMint: true,
      inAmount: true,
      outAmount: true,
    },
  });

  let baseAmount = 0;
  let quoteAmount = 0;
  let initial = 0;

  trades.forEach((trade) => {
    if (trade.inputMint === 'So11111111111111111111111111111111111111112') {
      initial += trade.inAmount;
      baseAmount += trade.inAmount;
      quoteAmount += trade.outAmount;
    }
    if (trade.inputMint === mintAddress) {
      initial -= trade.outAmount;
      quoteAmount -= trade.inAmount;
      baseAmount -= trade.outAmount;
    }
  });

  return { initial, baseAmount, quoteAmount };
};

module.exports = {
  createTrade,
  getTradesData,
};
