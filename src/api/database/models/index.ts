import testModelFactory, { TestModel } from './Test';
import { TModelClass, TModelList } from '../types';

export interface IPostgresModels extends TModelList {
  TestModel: TModelClass<TestModel>;
}

export { TestModel } from './Test';
export const modelFactory = [testModelFactory];
