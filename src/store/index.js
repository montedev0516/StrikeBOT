const store = {
  users: {},
  wallets: {},
  referrers: {},
  numberOfReferrals: {},
  lifeTimeIncomes: {},
  intervalID: {
    start: null,
    managePositions: null,
    token: null,
    autoSell: null,
  },

  getUser: function (id) {
    return this.users[id] || null;
  },

  setUser: function (user) {
    const { id } = user;
    this.users[id] = user;
  },

  getWallet: function (id) {
    return this.wallets[id] || null;
  },

  setWallet: function (wallet) {
    const { id } = wallet;
    this.wallets[id] = wallet;
  },

  getReferrer: function (id) {
    return this.referrers[id.toString()] || null;
  },

  setReferrer: function (user) {
    const { id, referrerId } = user;
    if (referrerId) {
      this.referrers[referrerId.toString()] = id;
    }
  },

  getIntervalID: function () {
    return this.intervalID || {
      start: null,
      managePositions: null,
      token: null,
      autoSell: null,
    };
  },

  setIntervalID: function (id) {
    this.intervalID = id;
  },

  clearAllInterval: function () {
    if (this.intervalID?.start) {
      clearInterval(this.intervalID.start);
    }
    if (this.intervalID?.managePositions) {
      clearInterval(this.intervalID.managePositions);
    }
    if (this.intervalID?.token) {
      clearInterval(this.intervalID.token);
    }

    this.intervalID = {
      start: null,
      managePositions: null,
      token: null,
      autoSell: this.intervalID.autoSell,
    };
  }
};

module.exports = store;
