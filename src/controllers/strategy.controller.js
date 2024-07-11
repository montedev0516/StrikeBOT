const { prisma } = require('../configs/database');

const findStrategy = async (id) => {
  const strategies = await prisma.strategy.findMany({
    where: {
      userId: id.toString(),
    },
    select: {
      id: true,
      percent: true,
      amount: true,
    },
  });
  return strategies;
};

const createStrategy = async (params) => {
  try {
    await prisma.strategy.create({
      data: params,
    });
  } catch {
    return null;
  }
};

const updateStrategy = async (id, params) => {
  await prisma.strategy.updateMany({
    where: {
      id: id,
    },
    data: params,
  });
  const strategies = await findStrategy(id);
  return strategies;
};

module.exports = {
  findStrategy,
  createStrategy,
  updateStrategy,
};
