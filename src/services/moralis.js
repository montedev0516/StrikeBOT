const Moralis = require('moralis').default;
const { SolNetwork } = require('@moralisweb3/common-sol-utils');

(async () => {
  try {
    await Moralis.start({
      apiKey: process.env.MORALIS_API_KEY,
    });
  } catch (e) {
    console.error(e);
  }
})();

const getNfts = async (ownerAddress) => {
  const network = SolNetwork.MAINNET;
  const response = await Moralis.SolApi.account.getNFTs({
    network,
    address: ownerAddress,
  });
};

module.exports = {
  getNfts,
};
