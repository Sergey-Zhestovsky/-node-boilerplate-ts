import { CorsOptions } from 'cors';

import { Environment } from '@/libs/config';

interface ICorsConfig {
  withCors: boolean;
  config: CorsOptions;
}

const config: ICorsConfig = {
  withCors: Environment.isProduction(),
  config: {},
};

export default config;
