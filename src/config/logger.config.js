const path = require('path');

const env = require('../data/env.json');

module.exports = {
  logPath: path.join(__dirname, '../../logs'),
  console: {
    blackListModes: [env.TEST],
  },
  fileTransport: {
    datePattern: 'DD-MM-YYYY',
    maxFiles: '90d',
    maxSize: '20m',
    zippedArchive: true,
  },
};
