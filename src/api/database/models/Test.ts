import { Model, Optional } from 'sequelize';

import { trimObject } from '@/utils';
import { TModelClass, TModelFactory } from '../types';
import { IPostgresModels } from '.';

interface ITestAttributes {
  id: number;
  name: string;
}

interface ITestConstructor extends Optional<ITestAttributes, 'id'> {}

export class TestModel extends Model<ITestAttributes, ITestConstructor> {
  static associate(models: IPostgresModels) {}

  public declare id: number;
  public declare name: string;

  public declare readonly createdAt: Date;
  public declare readonly updatedAt: Date;

  public declare readonly dataValues: ITestAttributes;

  getDataValues() {
    return trimObject({
      ...this.dataValues,
    });
  }
}

export const initialize: TModelFactory<TestModel> = (sequelize, DataTypes) => {
  TestModel.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
      },
    },
    { sequelize }
  );

  return TestModel as TModelClass<TestModel>;
};

export default initialize;
