const { trim } = require('@/utils');

const replyAddressMsg = () => `
  ↪️ Reply with the destination address
`;

const replyAmountMsg = (balance) => `
  ↪️ Reply with the amount to withdraw (0 - ${balance})
`;

const invalidNumberMsg = ({ text, balance }) => `
  ❌🔢 Invalid number (${text}) entered. Please reply with a number between 0 and ${balance}:
`;

const transactionInitiateMsg = () => `
  ⏳ Initiating withdraw...
`;

const transactionBuildFailedMsg = () => `
  ⛔ Building transaction failed, please try again.
`;

const transactionSentMsg = (txid) => `
  ➡ Transaction sent, txid:
  <a href="https://solscan.io/tx/${txid}">${txid}</a>
  Waiting for confirmation...
`;

const transactionConfirmedMsg = (txid) => `
  ✅ Transaction confirmed, txid:
  <a href="https://solscan.io/tx/${txid}">${txid}</a>
`;

const transactionFailedMsg = (error) => `
  ⛔ Transaction failed
  <code>${error}</code>
`;

module.exports = {
  replyAddressMsg: () => trim(replyAddressMsg()),
  replyAmountMsg: (params) => trim(replyAmountMsg(params)),
  invalidNumberMsg: (params) => trim(invalidNumberMsg(params)),
  transactionInitiateMsg: () => trim(transactionInitiateMsg()),
  transactionBuildFailedMsg: () => trim(transactionBuildFailedMsg()),
  transactionSentMsg: (params) => trim(transactionSentMsg(params)),
  transactionConfirmedMsg: (params) => trim(transactionConfirmedMsg(params)),
  transactionFailedMsg: (params) => trim(transactionFailedMsg(params)),
};
