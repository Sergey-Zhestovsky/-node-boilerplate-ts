import { logger } from '@/libs/Logger';
import { config, IProcessEnv } from '@/libs/config';
import { trimObject } from '@/utils';

const debug = logger.getDebug('service:health');

export interface IServerStatus {
  status: string;
  started: boolean;
  environment?: IProcessEnv;
}

export class HealthService {
  static getServerStatus(withEnvironment = false) {
    debug(`Get in pingController with environment: '%s'`, withEnvironment);

    const result: IServerStatus = {
      status: 'OK',
      started: true,
      environment: withEnvironment ? config.env : undefined,
    };

    debug(`Get out pingController with status: '%s'`, result.status);
    return trimObject(result);
  }
}
