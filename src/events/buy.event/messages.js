const { trim } = require('@/utils');

const replyAmountMsg = (walletBalance) => `
  ↪️ Reply with the amount you wish to buy (0 - ${walletBalance} SOL):
`;

const invalidAmountMsg = () => `Invalid amount. Press button and try again.`;

module.exports = {
  replyAmountMsg: (params) => trim(replyAmountMsg(params)),
  invalidAmountMsg: () => trim(invalidAmountMsg()),
};
