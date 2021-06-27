import helmet from 'helmet';

import env from '../data/env.json';

type THelmetOptions = Writeable<Exclude<Parameters<typeof helmet>[0], undefined>>;

const config: THelmetOptions = {};

switch (process.env.NODE_ENV) {
  case env.DEVELOPMENT:
    config.contentSecurityPolicy = false;
    break;

  case env.PRODUCTION:
    break;

  case env.TEST:
    config.contentSecurityPolicy = false;
    break;

  default:
    break;
}

export default config;
