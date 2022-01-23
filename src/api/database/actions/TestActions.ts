import { ModelCtor, Sequelize } from 'sequelize';

import { ActionProvider } from '../utils/ActionProvider';
import { IPostgresModels, TestModel } from '../models';

export class TestActions extends ActionProvider<IPostgresModels> {
  private readonly TestModel: ModelCtor<TestModel>;

  constructor(sequelize: Sequelize, models: IPostgresModels) {
    super(sequelize, models);

    this.TestModel = models.TestModel;
  }

  async getAll() {
    return this.TestModel.findAll();
  }
}
