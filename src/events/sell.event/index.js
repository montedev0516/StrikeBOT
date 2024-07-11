const web3 = require('@solana/web3.js')
const { getAccount } = require('@solana/spl-token');
const { findSettings } = require('@/controllers/settings.controller');
const { SettingsNotFoundError } = require('@/errors/common');
const { swap } = require('@/events/swap.event');
// const { getAccount } = require('@/services/solscan');
const { replyAmountMsg, invalidAmountMsg } = require('./messages');

const sellX = async (bot, msg, params) => {
  const chatId = msg.chat.id;
  const { ata } = params;

  bot
    .sendMessage(chatId, replyAmountMsg(), {
      reply_markup: {
        force_reply: true,
      },
    })
    .then(({ message_id }) => {
      bot.onReplyToMessage(chatId, message_id, async (reply) => {
        const percent = parseFloat(reply.text);
        if (isNaN(percent) || percent < 0 || percent > 100) {
          bot.sendMessage(chatId, invalidAmountMsg());
          return;
        }
        sellPercent(bot, msg, { ata, percent });
      });
    });
};

const sellPercent = async (bot, msg, params) => {
  const chatId = msg.chat.id;
  const { ata, percent, tokenInfo, isAuto } = params;

  const settings = await findSettings(chatId);
  if (settings === null) {
    console.error(SettingsNotFoundError);
    return;
  }

  if (isAuto) {
    swap(bot, msg, {
      inputMint: tokenInfo.mint,
      outputMint: 'So11111111111111111111111111111111111111112',
      amount: parseInt((parseInt(tokenInfo.balance * (10 ** tokenInfo.decimals)) * percent) / 100),
      slippage: settings.autoSellSlippage,
      mode: 'sell',
      isAuto,
    });
  } else {
    const connection = new web3.Connection('https://api.mainnet-beta.solana.com', 'confirmed');
    const accountPublicKey = new web3.PublicKey(ata);
    const account = await getAccount(connection, accountPublicKey)

    swap(bot, msg, {
      inputMint: account.mint.toBase58(),
      outputMint: 'So11111111111111111111111111111111111111112',
      amount: parseInt((parseInt(account.amount) * percent) / 100),
      slippage: settings.sellSlippage,
      mode: 'sell',
    });
  }
};

module.exports = {
  sellX,
  sellPercent,
};
