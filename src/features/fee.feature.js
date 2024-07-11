const { createIncome } = require('@/controllers/income.controller');
const {
  findRandomUser,
  findReferrer,
} = require('@/controllers/user.controller');
const { findWallet } = require('@/controllers/wallet.controller');
const { transferLamports } = require('./transfer.feature');

const GAS_FEE = 20000;

const coverFee = async (userId, feeAmount) => {
  const fromSeckey = findWallet(userId).secretKey;
  const teamAddress = process.env.TEAM_WALLET_ADDRESS;
  const referrer = findReferrer(userId);
  const referrerAddress = referrer ? findWallet(referrer).publicKey : null;

  console.log('Fee is ', feeAmount);

  const cover = (fromSeckey, toPubkey, amount, percent, options) => {
    const value = parseInt(amount * percent - GAS_FEE);
    if (value <= 0) {
      return;
    }
    try {
      transferLamports(fromSeckey, toPubkey, value);

      if (options?.isReferral) {
        createIncome({
          userId: options.toId.toString(),
          senderId: options.fromId.toString(),
          referral: value,
        });
      }
    } catch (e) {
      console.error(e);
    }
  };

  if (referrerAddress) {
    cover(fromSeckey, teamAddress, feeAmount, 0.7);
    cover(fromSeckey, referrerAddress, feeAmount, 0.3, {
      fromId: userId,
      toId: referrer,
      isReferral: true,
    });
  } else {
    cover(fromSeckey, teamAddress, feeAmount, 1);
  }
};

module.exports = {
  coverFee,
};
