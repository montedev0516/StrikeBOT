const walletKeyboard = ({ address }) => [
  [
    { text: '👀 View on Solscan', url: `https://solscan.io/account/${address}` },
    { text: '❌ Close', callback_data: 'close' },
  ],
  [{ text: '📤 Deposit SOL', callback_data: 'deposit' }],
  [
    { text: '📤 Withdraw all SOL', callback_data: 'withdrawAll' },
    { text: '📤 Withdraw X SOL', callback_data: 'withdrawX' },
  ],
  [
    { text: '🔃 Reset Wallet', callback_data: 'resetWallet' },
    { text: '🔑 Export Private Key', callback_data: 'exportPrivateKey' },
  ],
  [{ text: '🔄 Refresh', callback_data: 'refreshWallet' }],
];

const resetWalletKeyboard = () => [
  [
    { text: '❌ Cancel', callback_data: 'close' },
    { text: '✔️ Confirm', callback_data: 'confirmResetWallet' },
  ],
];

const exportPrivateKeyKeyboard = () => [
  [
    { text: '❌ Cancel', callback_data: 'close' },
    { text: '✔️ Confirm', callback_data: 'confirmExportPrivateKey' },
  ],
];

module.exports = {
  walletKeyboard,
  resetWalletKeyboard,
  exportPrivateKeyKeyboard,
};
