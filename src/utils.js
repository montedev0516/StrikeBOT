const trim = (text) => {
  const lines = text.split('\n');
  const trimmedLines = lines.map((line) => line.trim());
  return trimmedLines.join('\n');
};

const roundPrice = (price) => {
  if (price === undefined) {
    return '';
  }

  let k = price;
  let decimalPlaces = 0;

  while (k !== 0 && Math.abs(k) < 1) {
    k *= 10;
    decimalPlaces++;
  }

  decimalPlaces += 2;
  return price.toFixed(decimalPlaces);
};

const convertToShort = (number) => {
  if (number === undefined) {
    return '';
  }

  if (number >= 1e9) {
    return (number / 1e9).toFixed(2) + 'B';
  } else if (number >= 1e6) {
    return (number / 1e6).toFixed(2) + 'M';
  } else if (number >= 1e3) {
    return (number / 1e3).toFixed(2) + 'K';
  } else {
    return number.toString();
  }
};

const formatNumber = (number) => {
  if (isNaN(number)) {
    return NaN;
  }
  if (number > 0) {
    return `+${number}`;
  } else if (number < 0) {
    return `-${Math.abs(number)}`;
  } else {
    return '0';
  }
};

const getHistoryPrice = (price, changeRate) => {
  return parseFloat(price) * (1 + changeRate / 100.0);
};

const getChangeRate = (oldPrice, newPrice) => {
  return (100.0 * ((newPrice - oldPrice) / newPrice)).toFixed(2);
};

const encrypt = (message) => {
  let result = '';
  for (let i = 0; i < message.length; i++) {
    if ((i + 1) % 3 === 0) {
      result += message[i];
    } else {
      result += String.fromCharCode(97 + parseInt(message[i]));
    }
  }
  return result;
};

const decrypt = (encryptedMessage) => {
  let result = '';
  for (let i = 0; i < encryptedMessage.length; i++) {
    if ((i + 1) % 3 === 0) {
      result += encryptedMessage[i];
    } else {
      result += String.fromCharCode(48 + encryptedMessage.charCodeAt(i) - 97);
    }
  }
  return result;
};

const sleep = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

module.exports = {
  trim,
  roundPrice,
  convertToShort,
  formatNumber,
  getHistoryPrice,
  getChangeRate,
  encrypt,
  decrypt,
  sleep,
};
