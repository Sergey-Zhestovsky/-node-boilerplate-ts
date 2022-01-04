import path from 'path';

import { config } from '@/libs/config';
import { PostgresConnectionInterface } from './PostgresConnectionInterface';
import { getSequelizeModelsFactory } from './utils/build-sequelize-models';
import { getActionsFactory } from './utils/build-actions';

import { modelFactory, IPostgresModels } from './models';
import { actionFactory, IPostgresActions } from './actions';

const postgres = new PostgresConnectionInterface<IPostgresModels>(
  config.global.database,
  getSequelizeModelsFactory<IPostgresModels>(modelFactory),
  getActionsFactory<IPostgresModels, IPostgresActions>(actionFactory),
  path.resolve(__dirname, './migrations/*.js')
);

export { postgres };
