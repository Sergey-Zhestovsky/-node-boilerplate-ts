const env = require('../data/env.json');

const config = {};

switch (process.env.NODE_ENV) {
  case env.DEVELOPMENT:
    config.contentSecurityPolicy = false;
    break;

  case env.PRODUCTION:
    break;

  case env.TEST:
    config.contentSecurityPolicy = false;
    break;

  default:
    break;
}

module.exports = config;
