const logger = require('../libs/Logger');

const debug = logger.getDebug('service:health');

class HealthService {
  static getServerStatus(withEnvironment = false) {
    debug(`Get in pingController with environment: '%s'`, withEnvironment);

    const result = {
      status: 'OK',
      started: true,
    };
    if (withEnvironment) result.environment = process.initialEnvironmentConfig;

    debug(`Get out pingController with status: '%s'`, result.status);
    return result;
  }
}

module.exports = HealthService;
