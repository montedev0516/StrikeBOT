const { prisma } = require('../configs/database');

const findAllIncomes = async () => {
  const incomes = await prisma.income.findMany();
  return incomes;
};

const createIncome = async ({ userId, senderId, referral, lucky }) => {
  const income = await prisma.income.create({
    data: {
      userId,
      senderId,
      referral,
      lucky,
    },
  });
  return income;
};

const getLifeTimeIncome = async (id) => {
  const incomes = await prisma.income.findMany({
    where: {
      userId: id.toString(),
    },
  });

  return incomes.reduce(
    (total, current) => total + (current.referral || 0) + (current.lucky || 0),
    0
  );
};

module.exports = {
  findAllIncomes,
  createIncome,
  getLifeTimeIncome,
};
