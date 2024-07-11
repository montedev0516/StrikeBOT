const { LAMPORTS_PER_SOL, PublicKey } = require('@solana/web3.js');
const connection = require('@/configs/connection');
const { createCopyTrade } = require('@/controllers/copy.controller');
const { findSettings } = require('@/controllers/settings.controller');
const { findStrategy } = require('@/controllers/strategy.controller');
const { getTradesData } = require('@/controllers/trade.controller');
const { findUser } = require('@/controllers/user.controller');
const { findWallet } = require('@/controllers/wallet.controller');
const {
  SettingsNotFoundError,
  WalletNotFoundError,
} = require('@/errors/common');
const { buyAmount } = require('@/events/buy.event');
const { parseTransaction } = require('@/events/copy.event');
const { sellPercent } = require('@/events/sell.event');
const { getPair } = require('@/services/dexscreener');
const { getBalance } = require('@/services/solana');
const { getTokenMetadata } = require('@/services/metaplex');
const { getTokenAccountsByOwner } = require('@/features/token.feature');
const { clearAllInterval, setIntervalID } = require('@/store');
const {
  buyTokenMsg,
  tokenMsg,
  tokenNotFoundMsg,
  noRouteMsg,
  autoBuyFailedMsg,
  copyWalletMsg,
  invalidInputMsg,
  invalidWalletAddressMsg,
  copyTradeMsg,
  tokenSniperSettingMsg,
} = require('./messages');
const { buyTokenKeyboard, tokenKeyboard } = require('./keyboards');

const TimeInterval = 30 * 1000;

const buyToken = (bot, msg) => {
  const chatId = msg.chat.id;

  bot.sendMessage(chatId, buyTokenMsg(), {
    parse_mode: 'HTML',
    reply_markup: {
      inline_keyboard: buyTokenKeyboard(),
    },
  });
};

const processToken = async (bot, msg) => {
  const chatId = msg.chat.id;

  const settings = await findSettings(chatId);
  if (settings === null) {
    console.error(SettingsNotFoundError);
    return;
  }

  if (settings.autoBuy) {
    autoBuyToken(bot, msg, {
      mintAddress: msg.text,
      settings,
    });
  } else {
    showToken(bot, msg, {
      settings,
      mintAddress: msg.text,
      refresh: false,
    });
  }
};

const autoBuyToken = async (bot, msg, params) => {
  const chatId = msg.chat.id;

  const wallet = findWallet(chatId);
  if (wallet === null) {
    console.error(WalletNotFoundError);
    return;
  }

  const walletAddress = wallet.publicKey;
  const { mintAddress, settings } = params;

  try {
    await getTokenMetadata(mintAddress);
  } catch (e) {
    console.error(e);
    bot.sendMessage(chatId, tokenNotFoundMsg(mintAddress));
    return;
  }

  const walletBalance = await getBalance(walletAddress);

  if (settings.autoBuyAmount > walletBalance) {
    bot.sendMessage(
      chatId,
      autoBuyFailedMsg({ amount: settings.autoBuyAmount, walletBalance })
    );
    return;
  }

  buyAmount(bot, msg, {
    mintAddress,
    amount: settings.autoBuyAmount,
    isAuto: true,
  });
};

const autoSellToken = async (bot, msg) => {
  const chatId = msg.chat.id;

  if (findUser(chatId) === null) {
    console.log('New User');
    return;
  }

  const settings = await findSettings(chatId);
  if (settings === null) {
    console.error(SettingsNotFoundError);
    return;
  }
  if (!settings.autoSell) {
    return;
  }

  const wallet = findWallet(chatId);
  if (wallet === null) {
    console.error(WalletNotFoundError);
    return;
  }

  const tokens = await getTokenAccountsByOwner(wallet.publicKey);

  if (tokens.length === 0) {
    console.log('Empty Token')
    return;
  }

  tokens.forEach(async (token) => {
    try {
      await getTokenMetadata(token.mint);
    } catch (e) {
      console.error(e);
      bot.sendMessage(chatId, tokenNotFoundMsg(token.mint));
      return;
    }

    const { mint, decimals, priceNative } = token;
    const { initial, baseAmount, quoteAmount } = await getTradesData(
      chatId,
      mint
    );

    const profitSol =
      (quoteAmount / 10 ** decimals) * priceNative -
      baseAmount / LAMPORTS_PER_SOL;
    const profitPercent = (profitSol * 100.0) / (initial / LAMPORTS_PER_SOL);

    const strategies = await findStrategy(chatId);
    for (const strategy of strategies) {
      if (profitPercent > 0 && strategy.percent > 0 && profitPercent >= strategy.percent) {
        sellPercent(bot, msg, {
          tokenInfo: token,
          percent: strategy.amount,
          isAuto: true,
        });
      }
      if (profitPercent < 0 && strategy.percent < 0 && profitPercent <= strategy.percent) {
        sellPercent(bot, msg, {
          tokenInfo: token,
          percent: strategy.amount,
          isAuto: true,
        });
      }
    }
  });
};

const showToken = async (bot, msg, params) => {
  await showTokenInterval(bot, msg, params);

  clearAllInterval();

  // const id = setInterval(async () => {
  //   await showTokenInterval(bot, msg, { ...params, refresh: true });
  // }, TimeInterval)

  // setIntervalID({
  //   start: null,
  //   managePostition: null,
  //   token: id,
  // })
};

const showTokenInterval = async (bot, msg, params) => {
  const chatId = msg.chat.id;
  const { mintAddress, refresh } = params;

  const settings = params.settings || (await findSettings(chatId));
  if (settings === null) {
    console.error(SettingsNotFoundError);
    return;
  }

  const wallet = findWallet(chatId);
  if (wallet === null) {
    console.error(WalletNotFoundError);
    return;
  }

  const { message, keyboard } = await showTokenInterval.getMessage({
    walletAddress: wallet.publicKey,
    mintAddress,
    settings,
  });

  if (refresh === false) {
    bot.sendMessage(chatId, message, {
      parse_mode: 'HTML',
      reply_markup: {
        inline_keyboard: keyboard,
      },
    });
  } else {
    bot
      .editMessageText(message, {
        chat_id: chatId,
        message_id: msg.message_id,
        parse_mode: 'HTML',
        reply_markup: {
          inline_keyboard: keyboard,
        },
      })
      .catch(() => { });
  }
}

showTokenInterval.getMessage = async ({ walletAddress, mintAddress, settings }) => {
  let metadata, walletBalance;
  let priceUsd, priceChange;
  let liquidity, pooledSol;

  try {
    metadata = await getTokenMetadata(mintAddress);
  } catch (e) {
    console.error(e);
    return {
      message: tokenNotFoundMsg(mintAddress),
      keyboard: [],
    };
  }

  try {
    walletBalance = await getBalance(walletAddress);
  } catch (e) {
    console.error(e);
    return {
      message: error.message,
      keyboard: [],
    };
  }

  try {
    const pair = await getPair(mintAddress);
    priceUsd = parseFloat(pair.priceUsd);
    priceChange = pair.priceChange;
    liquidity = pair.liquidity.usd / 2;
    pooledSol = pair.liquidity.quote
  } catch (e) {
    console.error(e);
    return {
      message: noRouteMsg({
        tokenName: metadata.name,
        tokenSymbol: metadata.symbol,
        mintAddress,
        walletBalance,
      }),
      keyboard: tokenKeyboard({ mintAddress, settings }),
    };
  }

  return {
    message: tokenMsg({
      mint: mintAddress,
      name: metadata.name,
      symbol: metadata.symbol,
      priceUsd,
      priceChange,
      mcap:
        (priceUsd * metadata.mint.supply.basisPoints.toString()) /
        10 ** metadata.mint.decimals,
      liquidity,
      pooledSol,
      walletBalance,
    }),
    keyboard: tokenKeyboard({ mintAddress, settings }),
  };
};

const copyTrade = (bot, msg) => {
  const chatId = msg.chat.id;
  bot
    .sendMessage(chatId, copyWalletMsg(), {
      parse_mode: 'HTML',
      reply_markup: {
        force_reply: true,
      },
    })
    .then(({ message_id }) => {
      bot.onReplyToMessage(chatId, message_id, async (reply) => {
        const text = reply.text.split(' ');
        const copyWalletAddress = text[0];
        const amount = parseFloat(text[1]);

        const isAddressValidated = PublicKey.isOnCurve(new PublicKey(copyWalletAddress))

        if (!isAddressValidated) {
          bot.sendMessage(chatId, invalidWalletAddressMsg());
          return;
        }
        if (text.length < 2) {
          bot.sendMessage(chatId, invalidInputMsg(), {
            parse_mode: 'HTML'
          });
          return;
        }
        if (amount < 0) {
          bot.sendMessage(chatId, invalidInputMsg(), {
            parse_mode: 'HTML'
          });
          return;
        }
        const tokenAccounts = await getTokenAccountsByOwner(copyWalletAddress)
        console.log('tokenAccounts => ', tokenAccounts)

        await createCopyTrade({ copyWalletAddress, amount, userId: chatId.toString() });

        bot.sendMessage(chatId, copyTradeMsg());

        connection.onAccountChange(new PublicKey(copyWalletAddress), async () => {
          parseTransaction(bot, msg, { copyWalletAddress })
        })
      });
    })
}

const tokenSniper = (bot, msg) => {
  const chatId = msg.chat.id;
  let metadata;

  bot
    .sendMessage(chatId, tokenSniperSettingMsg(), {
      parse_mode: 'HTML',
      reply_markup: {
        force_reply: true,
      },
    })
    .then(({ message_id }) => {
      bot.onReplyToMessage(chatId, message_id, async (reply) => {
        const sniperTokenMint = reply.text;

        try {
          metadata = await getTokenMetadata(sniperTokenMint);
        } catch (e) {
          console.error(e);
          bot.sendMessage(chatId, tokenNotFoundMsg(sniperTokenMint), {
            parse_mode: 'HTML',
          });
          return;
        }
      });
    })
}

module.exports = {
  buyToken,
  processToken,
  showToken,
  autoBuyToken,
  autoSellToken,
  copyTrade,
  tokenSniper,
};
