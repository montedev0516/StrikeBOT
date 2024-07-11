const excludeDexes = [
  // 'Lifinity V2',
  // 'Mercurial',
  // 'Sanctum',
  // 'Raydium',
  // 'Marinade',
  // 'StepN',
  // 'Lifinity V1',
  // 'Whirlpool',
  // 'Aldrin V2',
  // 'Invariant',
  // 'Raydium CLMM',
  // 'Saros',
  // 'Openbook',
  // 'Meteora',
  // 'Phoenix',
  // 'Crema',
  // 'Orca V2',
  // 'FluxBeam',
  // 'Jupiter LO',
  // 'Token Swap',
  // 'Meteora DLMM',
  // 'Oasis',
  // 'Helium Network',
  // 'Saber',
  // 'Bonkswap',
  // 'Perps',
  // 'Orca V1',
  // 'Aldrin',
  // 'GooseFX',
  // 'Penguin',
  // 'Balansol',
  // 'Saber (Decimals)',
  // 'Cropper',
];

const getPrice = async (mintAddress) => {
  const url = `https://price.jup.ag/v4/price?ids=${mintAddress}`;

  return fetch(url)
    .then((res) => res.json())
    .then((data) => {
      return data.data[mintAddress].price;
    });
};

const getQuote = async ({ inputMint, outputMint, amount, slippageBps }) => {
  // const url = `https://quote-api.jup.ag/v6/quote?inputMint=${inputMint}&outputMint=${outputMint}&amount=${amount}&excludeDexes=${excludeDexes.join(
  //   ','
  // )}`;
  const url = `https://quote-api.jup.ag/v6/quote?inputMint=${inputMint}&outputMint=${outputMint}&amount=${amount}&slippageBps=${slippageBps}`;

  return fetch(url).then(async (res) => {
    const data = await res.json();

    if (data.error) {
      throw new Error(data.error);
    }

    return data;
  });
};

const getSwapTransaction = async ({ quoteResponse, payer }) => {
  const url = `https://quote-api.jup.ag/v6/swap`;
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      quoteResponse,
      userPublicKey: payer.publicKey.toString(),
      wrapAndUnwrapSol: true
    }),
  };
  return fetch(url, options)
    .then((res) => res.json())
    .then((data) => {
      // Edit the prioritizationFeeLamports property here
      data.prioritizationFeeLamports = 200000; // Replace 12345 with your desired value
      console.log(data)
      return data;
    });
};

module.exports = {
  getPrice,
  getQuote,
  getSwapTransaction,
};
