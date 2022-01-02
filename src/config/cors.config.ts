import { CorsOptions } from 'cors';

import { environment } from '@/libs/config';

interface ICorsConfig {
  withCors: boolean;
  config: CorsOptions;
}

const config: ICorsConfig = {
  withCors: environment.isProduction(),
  config: {},
};

export default config;
