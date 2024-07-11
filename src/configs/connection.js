const { Connection, clusterApiUrl } = require('@solana/web3.js');

const endpoint = clusterApiUrl(process.env.CLUSTER_ENDPOINT);
// const endpoint =
//   'https://tame-withered-tab.solana-mainnet.quiknode.pro/b47b262f16263a90edbb42ac229e8ea0d728e3e7/';
//const endpoint = 'https://wild-maximum-feather.solana-mainnet.quiknode.pro/bad28e86405bb95ac15dfb25ee3bec4ff4dc4595/';
// const connection = new Connection(endpoint, 'confirmed');
const connection = new Connection('https://api.mainnet-beta.solana.com');

module.exports = connection;
