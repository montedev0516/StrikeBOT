const { SettingsNotFoundError } = require('@/errors/common');
const {
  findSettings,
  updateSettings,
} = require('@/controllers/settings.controller');
const { createStrategy, updateStrategy } = require('@/controllers/strategy.controller');
const { autoSellToken } = require('@/events/token.event');
const { getIntervalID, setIntervalID } = require('@/store');
const {
  settingsMsg,
  replyMinPosValueMsg,
  minPosValueMsg,
  autoBuyMsg,
  autoSellMsg,
  replyAutoBuyAmountMsg,
  autoBuyAmountMsg,
  replyLeftBuyAmountMsg,
  leftBuyAmountMsg,
  replyRightBuyAmountMsg,
  rightBuyAmountMsg,
  replyLeftSellAmountMsg,
  leftSellAmountMsg,
  replyRightSellAmountMsg,
  rightSellAmountMsg,
  replyBuySlippageMsg,
  buySlippageMsg,
  replySellSlippageMsg,
  sellSlippageMsg,
  replyAutoBuySlippageMsg,
  autoBuySlippageMsg,
  replyAutoSellSlippageMsg,
  autoSellSlippageMsg,
  replyGasFeeMsg,
  gasFeeMsg,
  replyStrategyPercentMsg,
  strategyPercentMsg,
  replyStrategyAmountMsg,
  strategyAmountMsg,
  replyOrderMsg,
  orderMsg,
  invalidNumberMsg,
  numberLimitMsg,
} = require('./messages');
const { settingsKeyboard } = require('./keyboards');

const showSettings = async (bot, msg) => {
  const chatId = msg.chat.id;

  const settings = await findSettings(chatId);
  if (settings === null) {
    console.error(SettingsNotFoundError);
    return;
  }

  bot.sendMessage(chatId, settingsMsg(), {
    parse_mode: 'HTML',
    reply_markup: {
      inline_keyboard: settingsKeyboard(settings),
    },
  });
};

const toggleSetting = async (bot, msg, params) => {
  const chatId = msg.chat.id;
  const { name, value } = params;
  const settings = await updateSettings(chatId, { [name]: name === 'gasFee' ? value / 10000 : value });

  bot
    .editMessageText(settingsMsg(), {
      chat_id: chatId,
      message_id: msg.message_id,
      parse_mode: 'HTML',
      reply_markup: {
        inline_keyboard: settingsKeyboard(settings),
      },
    })
    .then(async () => {
      switch (name) {
        case 'autoBuy':
          bot.sendMessage(chatId, autoBuyMsg(settings.autoBuy));
          break;
        case 'autoSell':
          bot.sendMessage(chatId, autoSellMsg(settings.autoSell));
          break;
        case 'gasFee':
          bot.sendMessage(chatId, gasFeeMsg(settings.gasFee));
          break;
      }

      if (settings.autoSell) {
        await autoSellToken(bot, msg);

        // let { autoSell } = getIntervalID();
        // if (!autoSell) {
        //   autoSell = setInterval(async () => {
        //     await autoSellToken(bot, msg);
        //   }, TimeInterval)
        // }

        // setIntervalID({
        //   start: startId,
        //   managePostition: null,
        //   token: null,
        //   autoSell: autoSell,
        // })
      }
    })
    .catch(() => { });
};

const editSetting = async (bot, msg, params) => {
  const chatId = msg.chat.id;
  const { name } = params;
  let message;

  switch (name) {
    case 'minPosValue':
      message = replyMinPosValueMsg();
      break;
    case 'autoBuyAmount':
      message = replyAutoBuyAmountMsg();
      break;
    case 'leftBuyAmount':
      message = replyLeftBuyAmountMsg();
      break;
    case 'rightBuyAmount':
      message = replyRightBuyAmountMsg();
      break;
    case 'leftSellAmount':
      message = replyLeftSellAmountMsg();
      break;
    case 'rightSellAmount':
      message = replyRightSellAmountMsg();
      break;
    case 'buySlippage':
      message = replyBuySlippageMsg();
      break;
    case 'sellSlippage':
      message = replySellSlippageMsg();
      break;
    case 'autoBuySlippage':
      message = replyAutoBuySlippageMsg();
      break;
    case 'autoSellSlippage':
      message = replyAutoSellSlippageMsg();
      break;
    case 'gasFee':
      message = replyGasFeeMsg();
      break;
    default:
      message = '';
  }

  bot
    .sendMessage(chatId, message, {
      parse_mode: 'HTML',
      reply_markup: {
        force_reply: true,
      },
    })
    .then(({ message_id }) => {
      bot.onReplyToMessage(chatId, message_id, async (reply) => {
        const value = parseFloat(reply.text);

        switch (name) {
          case 'leftSellAmount':
          case 'rightSellAmount':
          case 'buySlippage':
          case 'sellSlippage':
          case 'autoBuySlippage':
          case 'autoSellSlippage':
            if (value < 0 || value > 100) {
              bot.sendMessage(chatId, numberLimitMsg());
              return;
            }
          case 'minPosValue':
          case 'gasFee':
          case 'autoBuyAmount':
          case 'leftBuyAmount':
          case 'rightBuyAmount':
            if (isNaN(value)) {
              bot.sendMessage(chatId, invalidNumberMsg());
              return;
            }
        }

        const settings = await updateSettings(chatId, { [name]: value });

        bot.editMessageText(settingsMsg(settings), {
          chat_id: chatId,
          message_id: msg.message_id,
          parse_mode: 'HTML',
          reply_markup: {
            inline_keyboard: settingsKeyboard(settings),
          },
        });

        switch (name) {
          case 'minPosValue':
            bot.sendMessage(chatId, minPosValueMsg(value));
            break;
          case 'autoBuyAmount':
            bot.sendMessage(chatId, autoBuyAmountMsg(value));
            break;
          case 'leftBuyAmount':
            bot.sendMessage(chatId, leftBuyAmountMsg(value));
            break;
          case 'rightBuyAmount':
            bot.sendMessage(chatId, rightBuyAmountMsg(value));
            break;
          case 'leftSellAmount':
            bot.sendMessage(chatId, leftSellAmountMsg(value));
            break;
          case 'rightSellAmount':
            bot.sendMessage(chatId, rightSellAmountMsg(value));
            break;
          case 'buySlippage':
            bot.sendMessage(chatId, buySlippageMsg(value));
            break;
          case 'sellSlippage':
            bot.sendMessage(chatId, sellSlippageMsg(value));
            break;
          case 'autoBuySlippage':
            bot.sendMessage(chatId, autoBuySlippageMsg(value));
            break;
          case 'autoSellSlippage':
            bot.sendMessage(chatId, autoSellSlippageMsg(value));
            break;
          case 'gasFee':
            bot.sendMessage(chatId, gasFeeMsg(value));
            break;
          default:
        }
      });
    });
};

const addStrategy = async (bot, msg) => {
  const chatId = msg.chat.id;

  bot
    .sendMessage(chatId, replyOrderMsg(), {
      reply_markup: {
        force_reply: true,
      },
    })
    .then(({ message_id }) => {
      bot.onReplyToMessage(chatId, message_id, async (reply) => {
        const text = reply.text.split(' ');

        const percent = parseInt(text[0]);
        const amount = parseInt(text[1]);
        if (text.length < 2) {
          bot.sendMessage(chatId, invalidNumberMsg());
          return;
        }
        if (amount > 100) {
          bot.sendMessage(chatId, numberLimitMsg());
          return;
        }

        await createStrategy({ userId: chatId.toString(), percent, amount });
        const settings = await findSettings(chatId);

        bot.editMessageText(settingsMsg(settings), {
          chat_id: chatId,
          message_id: msg.message_id,
          parse_mode: 'HTML',
          reply_markup: {
            inline_keyboard: settingsKeyboard(settings),
          },
        });

        bot.sendMessage(chatId, orderMsg());
      });
    });
};

const editStrategy = async (bot, msg, params) => {
  const chatId = msg.chat.id;
  const { name, id } = params;
  let message;

  switch (name) {
    case 'percent':
      message = replyStrategyPercentMsg();
      break;
    case 'amount':
      message = replyStrategyAmountMsg();
      break;
    default:
      message = '';
  }

  bot
    .sendMessage(chatId, message, {
      reply_markup: {
        force_reply: true,
      },
    })
    .then(({ message_id }) => {
      bot.onReplyToMessage(chatId, message_id, async (reply) => {
        const value = parseFloat(reply.text);

        switch (name) {
          case 'percent':
          case 'amount':
            if (value > 100) {
              bot.sendMessage(chatId, numberLimitMsg());
              return;
            }
            if (isNaN(value)) {
              bot.sendMessage(chatId, invalidNumberMsg());
              return;
            }
        }

        await updateStrategy(id, { [name]: value });
        const settings = await findSettings(chatId);

        bot.editMessageText(settingsMsg(settings), {
          chat_id: chatId,
          message_id: msg.message_id,
          parse_mode: 'HTML',
          reply_markup: {
            inline_keyboard: settingsKeyboard(settings),
          },
        });

        switch (name) {
          case 'percent':
            bot.sendMessage(chatId, strategyPercentMsg(value));
            break;
          case 'amount':
            bot.sendMessage(chatId, strategyAmountMsg(value));
            break;
          default:
        }
      });
    });
};

module.exports = {
  showSettings,
  toggleSetting,
  editSetting,
  addStrategy,
  editStrategy,
};
