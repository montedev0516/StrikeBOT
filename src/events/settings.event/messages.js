const { trim } = require('@/utils');

const settingsMsg = () => `
  <b>⚙️ Settings:</b>

  <b>TRANSACTION PRIORITY</b>
  🚀 Fast/Turbo/Custom Fee: Set your preferred priority fee to decrease likelihood of failed transactions.

  <b>== AUTO BUY</b>
  Immediately buy when pasting token address. Tap to toggle.

  <b>== AUTO SELL</b>
  Automatically set your specified limit sell orders for any swap or Auto Buy made. Click “Add Order” to add additional orders to your strategy. Reply “none” to either prompt to remove an order.

  - Set a S/L by using a negative percentage (-XX%) and updating the sell amount to 100% or less.
              
  - Set a T/P strategy by setting as many limit TP targets as you would like. The Amount column for T/P should add up to only 100%. Structure accordingly.
              
  Finally, set your slippage for the Auto Sell limit orders.
              
  Note: If you perform multiple buys, be sure to close the limits previously set.

  Example: -25% SL with 4 TP targets.
  -25%; 100%
  100%; 50% (i.e. takes out your initials)
  250%; 20%
  400%; 20%
  1000%; 10%

  <b>== BUTTONS CONFIG</b>
  Customize your buy and sell buttons for buy token and manage position. Tap to edit.

  <b>== SLIPPAGE CONFIG</b>
  Customize your slippage settings for buys and sells. Tap to edit.

  <b>== TRANSACTION PRIORITY</b>
  Increase your Transaction Priority to improve transaction speed. Select preset or tap to edit.
`;

const replyMinPosValueMsg = () => `
  ↪️ Reply with your new minimum $ value for positions to be displayed. Example: 0.01
`;

const minPosValueMsg = (minPosValue) => `
  🔽💵 Minimum Position Value set to $${minPosValue}.
`;

const autoBuyMsg = (value) => `
  Auto Buy ${value ? '🟢 enabled' : '🔴 disabled'}.
`;

const autoSellMsg = (value) => `
  Auto Sell ${value ? '🟢 enabled' : '🔴 disabled'}.
`;

const replyAutoBuyAmountMsg = () => `
  ↪️💲 Reply with your new Auto Buy Amount in SOL. <i>Example: 0.5</i>
`;

const autoBuyAmountMsg = (value) => `
  🤖💲 Auto Buy Amount set to ${value} SOL.
`;

const replyLeftBuyAmountMsg = () => `
  ↪️ Reply with your new setting for the left Buy Button in SOL. Example: 0.5
`;

const leftBuyAmountMsg = (value) => `
  🟢💰 Left Buy Button set to ${value} SOL.
`;

const replyRightBuyAmountMsg = () => `
  ↪️ Reply with your new setting for the right Buy Button in SOL. Example: 1.5
`;

const rightBuyAmountMsg = (value) => `
  🟢💰 Right Buy Button set to ${value} SOL.
`;

const replyLeftSellAmountMsg = () => `
  ↪️ Reply with your new setting for the left Sell Button in % (0 - 100%). Example: 25
`;

const leftSellAmountMsg = (value) => `
  🔻💰 Left Sell Button set to ${value}%.
`;

const replyRightSellAmountMsg = () => `
  ↪️ Reply with your new setting for the right Sell Button in % (0 - 100%). Example: 25
`;

const rightSellAmountMsg = (value) => `
  🔻💰 Right Sell Button set to ${value}%.
`;

const replyBuySlippageMsg = () => `
  ↪️ Reply with your new slippage setting for buys in % (0.00 - 50.00%). Example: 5.5
`;

const buySlippageMsg = (value) => `
  🟢💧 Buy Slippage set to ${value}%.
`;

const replySellSlippageMsg = () => `
  ↪️ Reply with your new slippage setting for sells in % (0.00 - 50.00%). Example: 5.5
`;

const sellSlippageMsg = (value) => `
  🟢💧 Sell Slippage set to ${value}%.
`;

const replyAutoBuySlippageMsg = () => `
  ↪️ Reply with your new slippage setting for auto buys in % (0.00 - 50.00%). Example: 5.5
`;

const autoBuySlippageMsg = (value) => `
  🤖 Auto Buy Slippage set to ${value}%.
`;

const replyAutoSellSlippageMsg = () => `
  ↪️ Reply with your new slippage setting for auto sells in % (0.00 - 50.00%). Example: 5.5
`;

const autoSellSlippageMsg = (value) => `
  🤖 Auto Sell Slippage set to ${value}%.
`;

const replyGasFeeMsg = () => `
  ↪️ Reply with your new gas fee setting in SOL. Example: 0.0005
`;

const replyStrategyPercentMsg = () => `
  ↪️ Reply with your new T/P(S/L) setting in %. Example: 50(-25)
`;

const strategyPercentMsg = (value) => `
  🚦 T/P(S/L) set to ${value}%.
`;

const replyStrategyAmountMsg = () => `
  ↪️ Reply with your new sell amount setting in % (0 - 100%). Example: 50
`;

const strategyAmountMsg = (value) => `
  🔻 Sell Amount set to ${value}%.
`;

const replyOrderMsg = () => `
  ↪️ Respond with the desired order for Take Profit / Stop Loss.

  Example:

  200 100
  If you want to exit at 3x with 100% of your position

  -30 100
  If you want to exit the position 100% with a 30% loss
`;

const orderMsg = () => `
  🆕 New Order added.
`;

const gasFeeMsg = (value) => `
  ⛽ Gas fee set to ${value} SOL.
`;

const invalidNumberMsg = () => `
  ❌🔢 Invalid number entered. Please try again. Example: 0.5
`;

const numberLimitMsg = () => `
  ❌🔢 Number can not be under 0 or over 100. Please try again. Example: 50
`;

module.exports = {
  settingsMsg: () => trim(settingsMsg()),
  replyMinPosValueMsg: () => trim(replyMinPosValueMsg()),
  minPosValueMsg: (params) => trim(minPosValueMsg(params)),
  autoBuyMsg: (params) => trim(autoBuyMsg(params)),
  autoSellMsg: (params) => trim(autoSellMsg(params)),
  replyAutoBuyAmountMsg: () => trim(replyAutoBuyAmountMsg()),
  autoBuyAmountMsg: (params) => trim(autoBuyAmountMsg(params)),
  replyLeftBuyAmountMsg: () => trim(replyLeftBuyAmountMsg()),
  leftBuyAmountMsg: (params) => trim(leftBuyAmountMsg(params)),
  replyRightBuyAmountMsg: () => trim(replyRightBuyAmountMsg()),
  rightBuyAmountMsg: (params) => trim(rightBuyAmountMsg(params)),
  replyLeftSellAmountMsg: () => trim(replyLeftSellAmountMsg()),
  leftSellAmountMsg: (params) => trim(leftSellAmountMsg(params)),
  replyRightSellAmountMsg: () => trim(replyRightSellAmountMsg()),
  rightSellAmountMsg: (params) => trim(rightSellAmountMsg(params)),
  replyBuySlippageMsg: () => trim(replyBuySlippageMsg()),
  buySlippageMsg: (params) => trim(buySlippageMsg(params)),
  replySellSlippageMsg: () => trim(replySellSlippageMsg()),
  sellSlippageMsg: (params) => trim(sellSlippageMsg(params)),
  replyAutoBuySlippageMsg: () => trim(replyAutoBuySlippageMsg()),
  autoBuySlippageMsg: (params) => trim(autoBuySlippageMsg(params)),
  replyAutoSellSlippageMsg: () => trim(replyAutoSellSlippageMsg()),
  autoSellSlippageMsg: (params) => trim(autoSellSlippageMsg(params)),
  replyGasFeeMsg: () => trim(replyGasFeeMsg()),
  gasFeeMsg: (params) => trim(gasFeeMsg(params)),
  replyStrategyPercentMsg: () => trim(replyStrategyPercentMsg()),
  strategyPercentMsg: (params) => trim(strategyPercentMsg(params)),
  replyStrategyAmountMsg: () => trim(replyStrategyAmountMsg()),
  strategyAmountMsg: (params) => trim(strategyAmountMsg(params)),
  replyOrderMsg: () => trim(replyOrderMsg()),
  orderMsg: () => trim(orderMsg()),
  invalidNumberMsg: () => trim(invalidNumberMsg()),
  numberLimitMsg: () => trim(numberLimitMsg()),
};
