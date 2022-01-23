import { Config } from '@/libs/config';
import { Logger } from '@/libs/logger';
import { HealthService } from '@/services/HealthService';

import { HealthCheckDto, PingDto } from './dto';

export class HealthCheckController {
  private readonly debug = Logger.getDebug('controller:health-check');

  constructor(private readonly healthService = new HealthService()) {}

  health(healthCheckDto: HealthCheckDto) {
    this.debug(`Get in healthController with environment: '%s'`, healthCheckDto.withEnv);
    if (Config.isProduction()) healthCheckDto.withEnv = false;
    const result = this.healthService.getServerStatus(healthCheckDto.withEnv);
    this.debug(`Get out healthController`);
    return result;
  }

  ping(pingDto: PingDto) {
    this.debug(`Get in pingController with time: '%s'`, pingDto.withTime);
    if (pingDto.withTime) return { timeStamp: new Date() };
    return 'pong';
  }
}
