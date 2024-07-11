const { trim, convertToShort, formatNumber, roundPrice } = require('@/utils');

const welcomeMsg = ({ walletAddress, walletBalance }) => {
  if (walletBalance) {
    return `
      <b>🐶 Fisher 🐶</b>

      You currently have a balance of <b>${walletBalance} SOL</b>, but no open positions.

      To get started trading, you can open a position by buying a token.

      To buy a token just enter a token address, and you will see a Buy dashboard pop up where you can choose how much you want to buy.

      Advanced traders can enable Auto Buy in their settings. When enabled, Fisher Solana bot will instantly buy any token you enter with a fixed amount that you set. This is disabled by default.

      Wallet: <code>${walletAddress}</code>

      💰Fee Discount: You are receiving a 10% discount on trading fees for being a referral of another user.
    `;
  }

  return `
    <b>🐶 Fisher 🐶</b>

    You currently have no SOL balance.

    To get started with trading, send some SOL to your Fisher Solana wallet address:

    <code>${walletAddress}</code> <i>(tap to copy)</i>

    Once done tap refresh and your balance will appear here.

    To buy a token just enter a token address of the coin.

    ⭐ <i>For more info on your wallet and to retrieve your private key, type <code>/wallet</code> command. We guarantee the safety of user funds on Fisher Solana bot, but if you expose your private key your funds will not be safe.</i>

    💰Fee Discount: You are receiving a 10% discount on trading fees for being a referral of another user.
  `;
};

const positionsMsg = ({ tokenAccounts, walletBalance }) => {
  let msg = '';

  msg += `
    📌 Positions Overview:
  `;

  tokenAccounts.forEach((tokenAccount, index) => {
    const {
      mint,
      symbol,
      balanceUsd,
      balanceSol,
      mcap,
      liquidity,
      pooledSol,
      priceUsd,
      priceChange,
      profitPercent,
      profitSol,
    } = tokenAccount;

    msg += `
      /${index + 1} <a href="https://birdeye.so/token/${mint}?chain=solana">${symbol}</a>
      💰 Worth: <b>${roundPrice(balanceSol)} SOL</b> / <b>$${roundPrice(balanceUsd)}</b>
      🚀 Profit: <b>${roundPrice(profitPercent)}%</b> / <b>${roundPrice(profitSol)} SOL</b>
      💥 5m: <b>${formatNumber(priceChange.m5)}%</b>, 1h: <b>${formatNumber(priceChange.h1)}%</b>, 6h: <b>${formatNumber(priceChange.h6)}%</b>, 24h: <b>${formatNumber(priceChange.h24)}%</b>
      💡 Market cap: <b>$${convertToShort(mcap)}</b> @ <b>$${roundPrice(priceUsd)}</b>
      💧 Liquidity: <b>$${convertToShort(liquidity)}</b>
      ⛽ Pooled SOL: <b>${pooledSol.toFixed(2)} SOL</b>
    `;
  });

  msg += `
    ⚖️ Balance: <b>${walletBalance} SOL</b>

    <i>Tip: Tap number next to token to sell and manage your position</i>
  `;

  return msg;
};

module.exports = {
  welcomeMsg: (params) => trim(welcomeMsg(params)),
  positionsMsg: (params) => trim(positionsMsg(params)),
};
