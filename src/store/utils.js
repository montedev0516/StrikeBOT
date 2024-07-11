const { findAllUsers } = require('@/controllers/user.controller');
const { findAllWallets } = require('@/controllers/wallet.controller');

const initStore = async (store) => {
  const users = await findAllUsers();
  const wallets = await findAllWallets();

  users.forEach((user) => {
    store.setUser(user);
    store.setReferrer(user);
  });
  wallets.forEach((wallet) => store.setWallet(wallet));
  
  store.setIntervalID({
    start: null,
    managePositions: null,
    token: null,
  })
};

module.exports = {
  initStore,
};
