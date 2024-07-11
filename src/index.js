require('dotenv').config();
require('module-alias/register');

// require('@/seeds');

const bot = require('@/configs/bot');
const router = require('@/routes');
const store = require('@/store');
const { initStore } = require('@/store/utils');

(async () => {
  await initStore(store);

  router(bot);
})();

console.log("\n Fisher Solana Bot is running... \n");