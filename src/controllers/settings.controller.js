const { prisma } = require('../configs/database');
const { findStrategy } = require('./strategy.controller');

const findSettings = async (id) => {
  const settings = await prisma.settings.findUnique({
    where: {
      id: id.toString(),
    },
  });
  const strategies = await findStrategy(id.toString());
  strategies.sort((a, b) => a.percent - b.percent);
  return { ...settings, strategies: strategies };
};

const createSettings = async (id) => {
  try {
    await prisma.settings.create({
      data: {
        id: id.toString(),
      },
    });
  } catch(error) {
    console.error(error.message)
    return null;
  }
};

const updateSettings = async (id, params) => {
  if (params.autoSell !== undefined) {
    params.autoSell = !!params.autoSell;
  }

  if (params.autoBuy !== undefined) {
    params.autoBuy = !!params.autoBuy;
  }

  await prisma.settings.update({
    where: {
      id: id.toString(),
    },
    data: params,
  });

  const settings = await findSettings(id.toString());

  return settings;
};

module.exports = {
  findSettings,
  createSettings,
  updateSettings,
};
