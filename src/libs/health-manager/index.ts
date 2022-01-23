import { HealthManager as HM } from './HealthManager';
import { adapters } from './report-adaptors';

export const HealthManager = new HM({
  reportAdapters: adapters,
});
