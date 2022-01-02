import { HealthService } from '@/services/HealthService';
import { config } from '@/libs/config';

const ping = () => 'pong';

interface IHealthCheckDto {
  withEnv?: boolean;
}

const healthCheck = (_: unknown, { input }: { input: IHealthCheckDto }) => {
  let { withEnv = false } = input;
  if (config.isProduction()) withEnv = false;
  return HealthService.getServerStatus(withEnv);
};

export = {
  Query: {
    ping,
    healthCheck,
  },
};
