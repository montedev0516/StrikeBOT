const getPair = (tokenAddress) => {
  const url = `https://api.dexscreener.com/latest/dex/tokens/${tokenAddress}`;
  return fetch(url)
    .then((res) => res.json())
    .then(({ pairs }) => {
      if (pairs === null || pairs === undefined) {
        throw new Error('No pair');
      }

      const pair = pairs.find(
        ({ quoteToken }) =>
          quoteToken.address === 'So11111111111111111111111111111111111111112'
      );
      if (pair === null || pair === undefined) {
        throw new Error('No pair');
      }
      return pair;
    });
};

module.exports = {
  getPair,
};
