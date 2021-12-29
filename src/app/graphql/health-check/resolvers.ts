import { HealthService } from '@/services/HealthService';
import env from '@/data/env.json';

const ping = () => 'pong';

interface IHealthCheckDto {
  withEnv?: boolean;
}

const healthCheck = (_: unknown, { input }: { input: IHealthCheckDto }) => {
  let { withEnv = false } = input;
  if (process.env.NODE_ENV === env.PRODUCTION) withEnv = false;
  return HealthService.getServerStatus(withEnv);
};

export = {
  Query: {
    ping,
    healthCheck,
  },
};
