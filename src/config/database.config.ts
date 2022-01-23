import '../core/helpers/setup-modules';
import '../core/helpers/setup-environment';

import { ISequelizeOptions } from '@/api/database/types';
import { Environment } from '@/libs/config';

const config: ISequelizeOptions = {
  url: Environment.vars.DB_URL.href,
  dialect: 'postgres',
  logging: false,
};

export default config;
