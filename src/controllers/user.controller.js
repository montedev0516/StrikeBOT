const { prisma } = require('../configs/database');
const store = require('@/store');
const { decrypt } = require('@/utils');

const findAllUsers = async () => {
  const users = await prisma.user.findMany();
  return users;
};

const createUser = async (id, username, code = null) => {
  try {
    const referrerId = code && decrypt(code);

    const userController = await prisma.user.create({
      data: {
        id: id.toString(),
        username: username,
        referrerId,
      },
    });

    store.setUser(userController);
    store.setReferrer(userController);

    return userController;
  } catch(error) {
    console.error(error.message)
    return null;
  }
};

const findUser = (id) => {
  return store.getUser(id);
};

const findRandomUser = async () => {
  const user = await prisma.user.findFirst({
    orderBy: { random: 'asc' },
  });
  return user;
};

const findReferrer = (id) => {
  return store.getReferrer(id.toString());
};

const getNumberOfReferrals = async (id) => {
  const count = await prisma.user.count({
    where: {
      referrerId: id.toString(),
    },
  });
  return count;
};

module.exports = {
  findAllUsers,
  createUser,
  findUser,
  findRandomUser,
  findReferrer,
  getNumberOfReferrals,
};
