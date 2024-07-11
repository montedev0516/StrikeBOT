const { prisma } = require('../configs/database');
const bs58 = require('bs58');
const store = require('@/store');
const { Keypair } = require('@solana/web3.js');

const findAllWallets = async () => {
  const wallets = await prisma.wallet.findMany();
  return wallets;
};

const createWallet = async (id) => {
  try {
    const keypair = Keypair.generate();
    const publicKey = keypair.publicKey.toBase58();
    const secretKey = bs58.encode(keypair.secretKey);
    const wallet = await prisma.wallet.create({
      data: {
        id: id.toString(),
        publicKey,
        secretKey,
      },
    });

    store.setWallet(wallet);

    return wallet;
  } catch(error) {
    console.error(error.message)
    return null;
  }
};

const findWallet = (id) => {
  return store.getWallet(id.toString());
};

const updateWallet = async (id) => {
  const keypair = Keypair.generate();
  const publicKey = keypair.publicKey.toBase58();
  const secretKey = bs58.encode(keypair.secretKey);

  const wallet = await prisma.wallet.update({
    where: {
      id: id.toString(),
    },
    data: {
      publicKey,
      secretKey,
    },
  });

  store.setWallet(wallet);

  return wallet;
};

module.exports = {
  findAllWallets,
  createWallet,
  findWallet,
  updateWallet,
};
