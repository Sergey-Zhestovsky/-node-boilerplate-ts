import { TestActions } from './TestActions';

import { TActionList } from '../types';
import { IPostgresModels } from '../models';

export interface IPostgresActions extends TActionList<IPostgresModels> {
  TestActions: TestActions;
}

export const actionFactory = [TestActions];
