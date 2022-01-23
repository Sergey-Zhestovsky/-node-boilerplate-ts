import { HealthService } from '@/services/HealthService';
import { Config } from '@/libs/config';

const healthService = new HealthService();

const ping = () => 'pong';

interface IHealthCheckDto {
  withEnv?: boolean;
}

const healthCheck = (_: unknown, { input }: { input: IHealthCheckDto }) => {
  let { withEnv = false } = input;
  if (Config.isProduction()) withEnv = false;
  return healthService.getServerStatus(withEnv);
};

export = {
  Query: {
    ping,
    healthCheck,
  },
};
