const { TOKEN_PROGRAM_ID } = require('@solana/spl-token');

const getTokenAccountsByOwner = async (ownerAddress) => {
  const url = `https://solana-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`;
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      id: 1,
      jsonrpc: '2.0',
      method: 'getTokenAccountsByOwner',
      params: [
        ownerAddress,
        {
          programId: TOKEN_PROGRAM_ID,
        },
        {
          encoding: 'jsonParsed',
        },
      ],
    }),
  };

  /* return fetch(url, options)
    .then((res) => res.json())
    .then((res) => res.result.value); */
    return fetch(url, options)
    .then((res) => res.json())
    .then((res) => {
      if (res.result && res.result.value) {
        return res.result.value;
      } else {
        throw new Error("Error in obtain data for api...");
      }
    });
};

const getTokenAccountBalance = (ata) => {
  const url = `https://solana-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`;
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      id: 1,
      jsonrpc: '2.0',
      method: 'getTokenAccountBalance',
      params: [ata],
    }),
  };

  return fetch(url, options).then((res) => res.json());
};

const getTokenSupply = (mintAddress) => {
  const url = `https://solana-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`;
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      id: 1,
      jsonrpc: '2.0',
      method: 'getTokenSupply',
      params: [mintAddress],
    }),
  };

  return fetch(url, options).then((res) => res.json());
};

module.exports = {
  getTokenAccountsByOwner,
  getTokenAccountBalance,
  getTokenSupply,
};
