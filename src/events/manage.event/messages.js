const { trim, convertToShort, roundPrice, formatNumber } = require('@/utils');

const positionMessage = ({
  tokenAccount: {
    name,
    symbol,
    mint,
    balance,
    balanceUsd,
    balanceSol,
    priceUsd,
    mcap,
    liquidity,
    pooledSol,
    priceChange,
  },
  trade: { profitPercent, profitSol, initial },
  walletBalance,
}) => `
  📌 ${name} | <b>${symbol}</b>

  🪅 CA: <code>${mint}</code>

  💰 Initial: <b>${roundPrice(initial)} SOL</b>
  💰 Worth: <b>${roundPrice(balanceSol)} SOL</b> / <b>$${roundPrice(balanceUsd)}</b>
  💸 Profit: <b>${roundPrice(profitPercent)}%</b> / <b>${roundPrice(
  profitSol
)} SOL</b>
  🏷️ 5m: <b>${formatNumber(priceChange.m5)}%</b>, 1h: <b>${formatNumber(
  priceChange.h1
)}%</b>, 6h: <b>${formatNumber(priceChange.h6)}%</b> 24h: <b>${formatNumber(
  priceChange.h24
)}%</b>
  🔼 Market cap: <b>$${convertToShort(mcap)}</b> @ <b>$${roundPrice(priceUsd)}</b>
  💧 Liquidity: <b>$${convertToShort(liquidity)}</b>
  ⛽ Pooled SOL: <b>${pooledSol.toFixed(2)} SOL</b>

  ⚖️ Balance: <b>${balance.toFixed(2)}</b> <b>${symbol}</b>
  💳 Wallet Balance: <b>${walletBalance}</b> <b>SOL</b>
`;

const noOpenPositionsMessage = () => `No open positions`;

module.exports = {
  positionMessage: (params) => trim(positionMessage(params)),
  noOpenPositionsMessage: () => trim(noOpenPositionsMessage()),
};
