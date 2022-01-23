import { Config } from '@/libs/config';
import { Localization as LocalizationClass } from './Localization';

export const Localization = new LocalizationClass(Config.global.localization);
export * from './strings';
export { ENamespace, IOptions } from './types';
