const { Metaplex } = require('@metaplex-foundation/js');
const { PublicKey } = require('@solana/web3.js');
const connection = require('@/configs/connection');

const metaplex = new Metaplex(connection);

const getTokenMetadata = async (mintAddress) => {
  return metaplex
    .nfts()
    .findByMint({ mintAddress: new PublicKey(mintAddress) });
};

const findAllNftsByOwner = async (ownerAddress) => {
  const res = await metaplex.nfts().findAllByOwner({
    owner: new PublicKey(ownerAddress),
  });
};

module.exports = {
  getTokenMetadata,
  findAllNftsByOwner,
};
