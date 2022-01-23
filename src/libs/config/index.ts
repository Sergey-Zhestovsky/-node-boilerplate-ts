export { environment as Environment, ENodeEnv, IProcessEnv, ITestProcessEnv } from './Environment';
export * from './types';

import { Config as ConfigClass } from './Config';
export const Config = new ConfigClass();
