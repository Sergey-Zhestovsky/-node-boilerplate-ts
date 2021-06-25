const env = require('../data/env.json');

module.exports = {
  withCors: process.env.NODE_ENV === env.PRODUCTION,
  config: {},
};
