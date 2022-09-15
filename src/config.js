const CREDENTIALS = process.env.SHOP_CREDENTIALS;
const LOG_LEVEL = process.env.LOG_LEVEL || 'info';
const URL = process.env.SHOP_URL || 'https://www.hiperdino.es';

module.exports = {CREDENTIALS, LOG_LEVEL};