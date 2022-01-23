import { postgres } from './connection';

export const db = {
  postgres,
  actions: postgres.actions,
};
