const checkTokenExistence = async (address) => {
  const url = `https://public-api.birdeye.so/public/exists_token?address=${address}`;
  const options = {
    headers: {
      'X-API-KEY': process.env.BIRDEYE_API_KEY,
    },
    method: 'GET',
  };
  return fetch(url, options).then((res) => res.json());
};

const getTokenList = async ({ offset, limit }) => {
  const url = `https://public-api.birdeye.so/public/tokenlist?sort_by=v24hUSD&sort_type=desc&offset=${offset}&limit=${limit}`;
  const options = {
    headers: {
      'X-API-KEY': process.env.BIRDEYE_API_KEY,
    },
    method: 'GET',
  };
  return fetch(url, options).then((res) => res.json());
};

const getPrice = async (mintAddress) => {
  const url = `https://public-api.birdeye.so/public/price?address=${mintAddress}`;
  const options = {
    headers: {
      'X-API-KEY': process.env.BIRDEYE_API_KEY,
    },
    method: 'GET',
  };
  return fetch(url, options).then((res) => res.json());
};

module.exports = {
  checkTokenExistence,
  getTokenList,
  getPrice,
};
