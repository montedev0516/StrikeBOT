const getTokenMeta = (tokenAddress) => {
  const url = `https://pro-api.solscan.io/v1.0/token/meta?tokenAddress=${tokenAddress}`;
  const options = {
    headers: {
      token: process.env.SOLSCAN_API_KEY,
    },
    method: 'GET',
  };
  return fetch(url, options).then((res) => res.json());
};

const getMarketToken = (tokenAddress) => {
  const url = `https://pro-api.solscan.io/v1.0/market/token/${tokenAddress}`;
  const options = {
    headers: {
      token: process.env.SOLSCAN_API_KEY,
    },
    method: 'GET',
  };
  return fetch(url, options).then((res) => res.json());
};

const getTokenAccounts = (account) => {
  const url = `https://pro-api.solscan.io/v1.0/account/tokens?account=${account}`;
  const options = {
    headers: {
      token: process.env.SOLSCAN_API_KEY,
    },
    method: 'GET',
  };
  return fetch(url, options).then((res) => res.json());
};

const getAccount = (account) => {
  const url = `https://pro-api.solscan.io/v1.0/account/${account}`;
  const options = {
    headers: {
      token: process.env.SOLSCAN_API_KEY,
    },
    method: 'GET',
  };
  return fetch(url, options).then((res) => res.json());
};

module.exports = {
  getTokenMeta,
  getMarketToken,
  getTokenAccounts,
  getAccount,
};
