import { Config, IProcessEnv } from '@/libs/config';
import { Logger } from '@/libs/logger';
import { trimObject } from '@/utils';

export interface IServerStatus {
  status: string;
  started: boolean;
  environment?: IProcessEnv;
}

export class HealthService {
  private readonly debug = Logger.getDebug('service:health');

  getServerStatus(withEnvironment = false) {
    this.debug(`Get in pingController with environment: '%s'`, withEnvironment);

    const result: IServerStatus = {
      status: 'OK',
      started: true,
      environment: withEnvironment ? Config.env : undefined,
    };

    this.debug(`Get out pingController with status: '%s'`, result.status);
    return trimObject(result);
  }
}
