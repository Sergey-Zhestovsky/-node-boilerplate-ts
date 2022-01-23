import helmet from 'helmet';

import { Environment, ENodeEnv } from '@/libs/config';

type THelmetOptions = Writeable<Exclude<Parameters<typeof helmet>[0], undefined>>;

const config: THelmetOptions = {};

switch (Environment.nodeEnv) {
  case ENodeEnv.DEVELOPMENT:
    config.contentSecurityPolicy = false;
    break;

  case ENodeEnv.PRODUCTION:
    break;

  case ENodeEnv.TEST:
    config.contentSecurityPolicy = false;
    break;

  default:
    break;
}

export default config;
