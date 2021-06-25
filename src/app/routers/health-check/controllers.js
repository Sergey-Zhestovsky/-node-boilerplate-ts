const HealthService = require('../../../services/HealthService');
const logger = require('../../../libs/Logger');
const env = require('../../../data/env.json');

const debug = logger.getDebug('controller:health-check');

exports.healthController = (healthCheckDto) => {
  debug(`Get in healthController with environment: '%s'`, healthCheckDto.withEnv);
  if (process.env.NODE_ENV === env.PRODUCTION) healthCheckDto.withEnv = false;
  const result = HealthService.getServerStatus(healthCheckDto.withEnv);
  debug(`Get out healthController`);
  return result;
};

exports.pingController = (pingDto) => {
  debug(`Get in pingController with time: '%s'`, pingDto.withTime);
  if (pingDto.withTime) return { timeStamp: new Date() };
  return 'pong';
};
