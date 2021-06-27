import { CorsOptions } from 'cors';

import env from '../data/env.json';

interface ICorsConfig {
  withCors: boolean;
  config: CorsOptions;
}

const config: ICorsConfig = {
  withCors: process.env.NODE_ENV === env.PRODUCTION,
  config: {},
};

export default config;
