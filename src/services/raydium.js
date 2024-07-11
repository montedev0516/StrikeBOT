const { TOKEN_PROGRAM_ID } = require('@solana/spl-token');
const {
  Liquidity,
  jsonInfo2PoolKeys,
  Token,
  TokenAmount,
  Percent,
} = require('@raydium-io/raydium-sdk');
const connection = require('@/configs/connection');

const getPoolInfo = async ({ baseMint, quoteMint }) => {
  // fetch the liquidity pool list
  const liquidityJsonResp = await fetch(
    'https://api.raydium.io/v2/sdk/liquidity/mainnet.json'
  );

  if (!(await liquidityJsonResp).ok) return null;

  const liquidityJson = await liquidityJsonResp.json();

  const allPoolKeysJson = [
    ...(liquidityJson?.official ?? []),
    ...(liquidityJson?.unOfficial ?? []),
  ];

  // find the liquidity pair
  const poolKeysRaySolJson =
    allPoolKeysJson.filter(
      (item) => item.baseMint === baseMint && item.quoteMint === quoteMint
    )?.[0] || null;

  // convert the json info to pool key using jsonInfo2PoolKeys
  const poolKeys = jsonInfo2PoolKeys(poolKeysRaySolJson);

  return poolKeys;
};

const calcAmountOut = async ({
  poolKeys,
  rawAmountIn,
  swapInDirection = true,
}) => {
  const poolInfo = await Liquidity.fetchInfo({ connection, poolKeys });
  let currencyInMint = poolKeys.baseMint;
  let currencyInDecimals = poolInfo.baseDecimals;
  let currencyOutMint = poolKeys.quoteMint;
  let currencyOutDecimals = poolInfo.quoteDecimals;

  if (!swapInDirection) {
    currencyInMint = poolKeys.quoteMint;
    currencyInDecimals = poolInfo.quoteDecimals;
    currencyOutMint = poolKeys.baseMint;
    currencyOutDecimals = poolInfo.baseDecimals;
  }

  const currencyIn = new Token(
    TOKEN_PROGRAM_ID,
    currencyInMint,
    currencyInDecimals
  );
  const amountIn = new TokenAmount(currencyIn, rawAmountIn, false);
  const currencyOut = new Token(
    TOKEN_PROGRAM_ID,
    currencyOutMint,
    currencyOutDecimals
  );
  const slippage = new Percent(5, 100);

  const {
    amountOut,
    minAmountOut,
    currentPrice,
    executionPrice,
    priceImpact,
    fee,
  } = Liquidity.computeAmountOut({
    poolKeys,
    poolInfo,
    amountIn,
    currencyOut,
    slippage,
  });

  return {
    amountIn,
    amountOut,
    minAmountOut,
    currentPrice,
    executionPrice,
    priceImpact,
    fee,
  };
};

module.exports = {
  getPoolInfo,
  calcAmountOut,
};
