import { HealthService } from '@/services/HealthService';
import { logger } from '@/libs/Logger';
import { config } from '@/libs/config';
import { HealthCheckDto, PingDto } from './dto';

const debug = logger.getDebug('controller:health-check');

export const healthController = (healthCheckDto: HealthCheckDto) => {
  debug(`Get in healthController with environment: '%s'`, healthCheckDto.withEnv);
  if (config.isProduction()) healthCheckDto.withEnv = false;
  const result = HealthService.getServerStatus(healthCheckDto.withEnv);
  debug(`Get out healthController`);
  return result;
};

export const pingController = (pingDto: PingDto) => {
  debug(`Get in pingController with time: '%s'`, pingDto.withTime);
  if (pingDto.withTime) return { timeStamp: new Date() };
  return 'pong';
};
