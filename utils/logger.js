const winston = require('winston');

const tsFormat = new Date().toLocaleTimeString();
const logger = new winston.Logger({
  transports: [
    new winston.transports.Console({
      timestamp: tsFormat,
      colorize: true,
      level: 'info',
      silent: process.env.NODE_ENV === 'test'
    }),
  ],
});

module.exports = logger;
