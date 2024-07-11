const bs58 = require('bs58');
const {
  SystemProgram,
  TransactionMessage,
  VersionedTransaction,
  PublicKey,
  Keypair,
} = require('@solana/web3.js');
const connection = require('@/configs/connection');

const transferLamports = async (fromSeckey, toPubkey, lamports) => {
  try {
    const payer = Keypair.fromSecretKey(bs58.decode(fromSeckey));
    const payerBalance = await connection.getBalance(payer.publicKey);

    if (payerBalance < lamports) {
      console.log('Insufient balance for init transaction...');
      console.log(`Current balance is ${payerBalance} lamports`);
      console.log(`Request balance is ${lamports} lamports`);
      return;
    }

    const instructions = [
      SystemProgram.transfer({
        fromPubkey: payer.publicKey,
        toPubkey: new PublicKey(toPubkey),
        lamports,
      }),
    ];
    const blockhash = await connection
      .getLatestBlockhash()
      .then((res) => res.blockhash);
    const messageV0 = new TransactionMessage({
      payerKey: payer.publicKey,
      recentBlockhash: blockhash,
      instructions,
    }).compileToV0Message();
    const transaction = new VersionedTransaction(messageV0);

    transaction.sign([payer]);
    const txid = await connection.sendTransaction(transaction);

    return txid;
  } catch (error) {
    console.error(`Error in transfer.js: ${error.message}`);
  }
};

module.exports = {
  transferLamports,
};
