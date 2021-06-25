const HealthService = require('../../../services/HealthService');
const env = require('../../../data/env.json');

const ping = () => 'pong';

const healthCheck = (_, { input }) => {
  let { withEnv = false } = input;
  if (process.env.NODE_ENV === env.PRODUCTION) withEnv = false;
  return HealthService.getServerStatus(withEnv);
};

module.exports = {
  Query: {
    ping,
    healthCheck,
  },
};
