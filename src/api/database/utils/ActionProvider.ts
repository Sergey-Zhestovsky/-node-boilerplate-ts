import { Sequelize } from 'sequelize';

import { TModelList } from '../types';

export type TActionProviderConstructor<T extends TModelList = TModelList> = (
  sequelize: Sequelize,
  models: T
) => ActionProvider<T>;

export abstract class ActionProvider<T extends TModelList = TModelList> {
  constructor(protected sequelize: Sequelize, protected models: T) {}
}
