const getToken = async (mintAddress) => {
  const url = `https://api.solana.fm/v0/tokens/${mintAddress}`;
  const options = {
    headers: {
      accept: 'application/json',
      ApiKey: process.env.SOLANA_FM_API_KEY,
    },
    method: 'GET',
  };
  return fetch(url, options).then((res) => res.json());
};

const getAllTokensByOwner = async (ownerAdress) => {
  const url = `https://api.solana.fm/v1/addresses/${ownerAdress}/tokens`;
  const options = {
    headers: {
      accept: 'application/json',
      ApiKey: process.env.SOLANA_FM_API_KEY,
    },
    method: 'GET',
  };
  return fetch(url, options).then((res) => res.json());
};

module.exports = {
  getToken,
  getAllTokensByOwner,
};
