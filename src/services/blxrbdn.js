const getRaydiumQuote = ({ inputMint, outputMint, amount }) => {
  const url = `https://uk.solana.dex.blxrbdn.com/api/v2/raydium/quotes?inToken=${inputMint}&outToken=${outputMint}&inAmount=${amount}`;
  const options = {
    headers: {
      Authorization: process.env.BLXRBDN_API_KEY,
    },
    method: 'GET',
  };

  return fetch(url, options).then(async (res) => {
    const data = await res.json();

    if (data.message) {
      throw new Error(data.message);
    }

    return data;
  });
};

module.exports = {
  getRaydiumQuote,
};
