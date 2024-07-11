const apiClientAlchemy = require('@/services/alchemy');
const apiClientMetaplex = require('@/services/metaplex');
const apiClientSolana = require('@/services/solana');
const apiClientSolanaFm = require('@/services/solana-fm');
const apiClientMoralis = require('@/services/moralis');
const apiClientJupiter = require('@/services/jupiter');
const apiClientDexScreener = require('@/services/dexscreener');

const priceChangeNaN = {
  m5: NaN,
  h1: NaN,
  h6: NaN,
  h24: NaN,
};

const getTokenAccountsByOwner = async (ownerAddress) => {
  const res = [];
  const tokenAccounts = await apiClientAlchemy.getTokenAccountsByOwner(
    ownerAddress
  );
  tokenAccounts.sort((a, b) =>
    a.account.data.parsed.info.mint.localeCompare(
      b.account.data.parsed.info.mint
    )
  );

  for (let i = 0; i < tokenAccounts.length; i++) {
    const tokenAccount = tokenAccounts[i].account;
    const mintAddress = tokenAccount.data.parsed.info.mint;
    const tokenAmount = tokenAccount.data.parsed.info.tokenAmount.uiAmount;
    const decimals = tokenAccount.data.parsed.info.tokenAmount.decimals;
    let pair, metadata;

    if (tokenAmount === 0) {
      continue;
    }

    try {
      pair = await apiClientDexScreener.getPair(mintAddress);
    } catch {
      metadata = await apiClientMetaplex.getTokenMetadata(mintAddress);
    }

    const supply = await apiClientSolana.getTokenSupply(mintAddress);
    const priceUsd = pair ? parseFloat(pair.priceUsd) : NaN;
    const priceNative = pair ? parseFloat(pair.priceNative) : NaN;
    const priceChange = pair ? pair.priceChange : priceChangeNaN;
    const liquidity = pair ? pair.liquidity.usd / 2 : NaN;
    const pooledSol = pair ? pair.liquidity.quote : NaN;

    res.push({
      mint: mintAddress,
      name: pair?.baseToken?.name || metadata?.name,
      symbol: pair?.baseToken?.symbol || metadata?.symbol,
      decimals: decimals,
      balance: tokenAmount,
      balanceUsd: tokenAmount * priceUsd,
      balanceSol: tokenAmount * priceNative,
      priceUsd,
      priceNative,
      priceChange,
      mcap: priceUsd * supply.uiAmount,
      liquidity,
      pooledSol,
    });
  }

  return res;
};

const getTokenAccountByIndex = async (ownerAddress, index) => {
  let tokenAccounts = [];
  tokenAccounts = await apiClientAlchemy.getTokenAccountsByOwner(ownerAddress);
  tokenAccounts = tokenAccounts.filter(
    ({ account }) => account.data.parsed.info.tokenAmount.uiAmount !== 0
  );
  tokenAccounts.sort((a, b) =>
    a.account.data.parsed.info.mint.localeCompare(
      b.account.data.parsed.info.mint
    )
  );

  if (tokenAccounts.length === 0) {
    return null;
  } else {
    index = (index - 1) % tokenAccounts.length;
  }

  const tokenAccount = tokenAccounts[index].account;
  const ata = tokenAccounts[index].pubkey;
  const mintAddress = tokenAccount.data.parsed.info.mint;
  const tokenAmount = tokenAccount.data.parsed.info.tokenAmount.uiAmount;
  const decimals = tokenAccount.data.parsed.info.tokenAmount.decimals;
  let pair, metadata;

  try {
    pair = await apiClientDexScreener.getPair(mintAddress);
  } catch {
    metadata = await apiClientMetaplex.getTokenMetadata(mintAddress);
  }

  const supply = await apiClientSolana.getTokenSupply(mintAddress);
  const priceUsd = pair ? parseFloat(pair.priceUsd) : NaN;
  const priceNative = pair ? parseFloat(pair.priceNative) : NaN;
  const priceChange = pair ? pair.priceChange : priceChangeNaN;
  const liquidity = pair ? pair.liquidity.usd / 2 : NaN;
  const pooledSol = pair ? pair.liquidity.quote : NaN;

  return {
    mint: mintAddress,
    ata,
    name: pair?.baseToken?.name || metadata?.name,
    symbol: pair?.baseToken?.symbol || metadata?.symbol,
    decimals: decimals,
    balance: tokenAmount,
    balanceUsd: tokenAmount * priceUsd,
    balanceSol: tokenAmount * priceNative,
    priceUsd,
    priceNative,
    priceChange,
    mcap: priceUsd * supply.uiAmount,
    liquidity,
    pooledSol,
  };
};

const getTokenAccountByMint = async (
  ownerAddress,
  mintAddress,
  tradeAmount
) => {
  const ata = await apiClientSolana.getATASync(mintAddress, ownerAddress);

  let decimals, tokenAmount;

  try {
    const balance = await apiClientAlchemy.getTokenAccountBalance(ata);
    decimals = balance.result.value.decimals;
    tokenAmount = balance.result.value.uiAmount + tradeAmount / (10 ** decimals);
  } catch {
    const metadata = await apiClientMetaplex.getTokenMetadata(mintAddress);
    decimals = metadata.mint.decimals;
    tokenAmount = tradeAmount / (10 ** decimals);
  }

  let pair, metadata;

  try {
    pair = await apiClientDexScreener.getPair(mintAddress);
  } catch {
    metadata = await apiClientMetaplex.getTokenMetadata(mintAddress);
  }

  const supply = await apiClientSolana.getTokenSupply(mintAddress);
  const priceUsd = pair ? parseFloat(pair.priceUsd) : NaN;
  const priceNative = pair ? parseFloat(pair.priceNative) : NaN;
  const priceChange = pair ? pair.priceChange : priceChangeNaN;
  const liquidity = pair ? pair.liquidity.usd / 2 : NaN;
  const pooledSol = pair ? pair.liquidity.quote : NaN;

  const getIndex = async (ownerAddress, mintAddress) => {
    const tokenAccounts = await apiClientAlchemy.getTokenAccountsByOwner(
      ownerAddress
    );
    const mints = Array.from(
      new Set(
        ...tokenAccounts
          .filter(
            ({ account }) => account.data.parsed.info.tokenAmount.uiAmount !== 0
          )
          .map(({ account }) => account.data.parsed.info.mint),
        mintAddress
      )
    );
    return mints.findIndex((value) => value.mintAddress) + 1;
  };

  const index = await getIndex(ownerAddress, mintAddress);

  return {
    mint: mintAddress,
    ata,
    name: pair?.baseToken?.name || metadata?.name,
    symbol: pair?.baseToken?.symbol || metadata?.symbol,
    decimals: decimals,
    balance: tokenAmount,
    balanceUsd: tokenAmount * priceUsd,
    balanceSol: tokenAmount * priceNative,
    priceUsd,
    priceNative,
    priceChange,
    mcap: priceUsd * supply.uiAmount,
    liquidity,
    pooledSol,
    index,
  };
};

module.exports = {
  getTokenAccountsByOwner,
  getTokenAccountByIndex,
  getTokenAccountByMint,
};
