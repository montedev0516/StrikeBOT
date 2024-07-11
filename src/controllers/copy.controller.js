const { prisma } = require('../configs/database');

const findCopyTrade = async (address) => {
  const copyTrades = await prisma.copyTrade.findMany({
    where: {
      copyWalletAddress: address.toString(),
    },
  })
  return copyTrades
};

const createCopyTrade = async (params) => {
  try {
    const copyTrades = await prisma.copyTrade.findMany({
      where: {
        userId: params.userId.toString(),
      },
    })
    if (copyTrades.length > 0) {
      copyTrades.map(async (item) => {
        if (item.copyWalletAddress === params.copyWalletAddress)
          await prisma.copyTrade.delete({
            where: {
              id: item.id,
            },
          })
      })
    }
    
    await prisma.copyTrade.create({
      data: params
    });
  } catch (error) {
    console.log(error.message)
    return null;
  }
};

const updateCopyTrade = async (id, params) => {
  await prisma.copyTrade.update({
    where: {
      id,
    },
    data: params,
  });
  const copyTrades = await findCopyTrade(id);
  return copyTrades;
};

module.exports = {
  findCopyTrade,
  createCopyTrade,
  updateCopyTrade,
};
