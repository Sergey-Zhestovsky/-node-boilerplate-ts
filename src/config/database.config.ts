import '../core/helpers/setup-modules';
import '../core/helpers/setup-environment';

import { ISequelizeOptions } from '@/api/database/types';
import { environment } from '@/libs/config';

const config: ISequelizeOptions = {
  url: environment.vars.DB_URL.href,
  dialect: 'postgres',
  logging: false,
};

export default config;
