const { trim } = require('@/utils');

const walletMsg = ({ address, balance }) => `
  <b>💳 Your Wallet</b>:
    
  <b>  </b>🔑 Address: <code>${address}</code>
  <b>  </b>⚖️ Balance: <b>${balance.toFixed(9)}</b> SOL
  
  <b>  </b>Tap to copy the address and send SOL to deposit.
`;

const depositMsg = () => `
  ↪️ To deposit send SOL to below address:
`;

const walletAddressMsg = (address) => `
  💳 <code>${address}</code>
`;

const resetWalletMsg = () => `
  Are you sure you want to reset your Fisher Solana bot <b>Wallet</b>?

  🚨 <b>WARNING</b>: This action is irreversible!

  Fisher Solana bot will generate a new wallet for you and discard your old one.
`;

const oldPrivateKeyMsg = (secretKey) => `
  Your Private Key for your <b>OLD</b> wallet is:

  <code>${secretKey}</code>

  You can now i.e. import the key into a wallet like Solflare. (tap to copy).
  Save this key in case you need to access this wallet again.
`;

const newWalletMsg = (address) => `
  ✅ Success: Your new wallet is:

  <code>${address}</code>

  You can now send SOL to this address to deposit into your new wallet. Press refresh to see your new wallet.
`;

const exportPrivateKeyMsg = () => `
  ❗️🔐 Are you sure you want to export your <b>Private Key</b>?
`;

const privateKeyMsg = (secretKey) => `
  Your <b>Private Key</b> is:

  <code>${secretKey}</code>

  You can now i.e. import the key into a wallet like Solflare. (tap to copy).
  Delete this message once you are done.
`;

module.exports = {
  walletMsg: (params) => trim(walletMsg(params)),
  depositMsg: () => trim(depositMsg()),
  walletAddressMsg: (params) => trim(walletAddressMsg(params)),
  resetWalletMsg: () => trim(resetWalletMsg()),
  oldPrivateKeyMsg: (params) => trim(oldPrivateKeyMsg(params)),
  newWalletMsg: (params) => trim(newWalletMsg(params)),
  exportPrivateKeyMsg: () => trim(exportPrivateKeyMsg()),
  privateKeyMsg: (params) => trim(privateKeyMsg(params)),
};
