import { Sequelize, DataTypes as DT, Options, ModelCtor, Model } from 'sequelize';

import { ActionProvider, TActionProviderConstructor } from '../utils/ActionProvider';

export interface ISequelizeOptions extends Options {
  url: string;
}

export interface IModel {
  associate?(models: TModelList): void;
}

export type TModelClass<M extends Model = Model> = ModelCtor<M> & IModel;

export type TModelList = Record<string, TModelClass>;

export type TModelFactory<T extends Model = Model> = (
  sequelize: Sequelize,
  DataTypes: typeof DT
) => TModelClass<T>;

export type TActionList<T extends TModelList = TModelList> = Record<string, ActionProvider<T>>;

export type TModelBuilder<T extends TModelList> = ((sequelize: Sequelize) => T) | T;

export type TActionBuilder<T extends TModelList, R extends TActionList<T>> =
  | ((...args: Parameters<TActionProviderConstructor<T>>) => R)
  | R;
