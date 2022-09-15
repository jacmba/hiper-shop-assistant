const log4s = require('log4js');
const config = require('./config');

log4s.configure({
  appenders: {
    console: {type: 'stdout'}
  },
  categories: {
    default: {
      appenders: ['console'], level: config.LOG_LEVEL
    }
  }
});

const logger = log4s.getLogger();

module.exports = logger;