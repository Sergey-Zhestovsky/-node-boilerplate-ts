import testModelFactory, { TestModel } from './Test';

import { TModelClass, TModelList } from '../types';

export { TestModel };

export interface IPostgresModels extends TModelList {
  TestModel: TModelClass<TestModel>;
}

export const modelFactory = [testModelFactory];
