import logger from '../libs/Logger';

const debug = logger.getDebug('service:health');

interface IServerStatus {
  status: string;
  started: boolean;
  environment?: Record<string, string>;
}

class HealthService {
  static getServerStatus(withEnvironment = false) {
    debug(`Get in pingController with environment: '%s'`, withEnvironment);

    const result: IServerStatus = {
      status: 'OK',
      started: true,
    };
    if (withEnvironment) result.environment = process.initialEnvironmentConfig;

    debug(`Get out pingController with status: '%s'`, result.status);
    return result;
  }
}

export default HealthService;