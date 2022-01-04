import { Sequelize, DataTypes } from 'sequelize';

import { TModelFactory, TModelList } from '../types';

export const buildSequelizeModels = <T extends TModelList = TModelList>(
  list: TModelFactory[],
  sequelize: Sequelize
): T => {
  const result: TModelList = {};

  list.forEach((modelFactory) => {
    const model = modelFactory(sequelize, DataTypes);
    result[model.name] = model;
  });

  for (const [, model] of Object.entries(result)) {
    if (model.associate) model.associate(result);
  }

  return result as T;
};

export const getSequelizeModelsFactory = <T extends TModelList = TModelList>(
  list: TModelFactory[]
) => {
  return (sequelize: Sequelize) => buildSequelizeModels<T>(list, sequelize);
};
