import _ from 'lodash';

import * as cfg from '@/config';
import { environment } from './Environment';

class Config {
  private readonly environment: typeof environment;
  public readonly global: typeof cfg;

  constructor() {
    this.environment = environment;
    this.global = cfg;
  }

  get nodeEnv() {
    return this.environment.nodeEnv;
  }

  get env() {
    return this.environment.vars;
  }

  get getNodeEnv() {
    return this.environment.getNodeEnv.bind(this.environment);
  }

  get isProduction() {
    return this.environment.isProduction.bind(this.environment);
  }

  get isDevelopment() {
    return this.environment.isDevelopment.bind(this.environment);
  }

  get isTest() {
    return this.environment.isTest.bind(this.environment);
  }

  get<T = unknown>(path: string, defaultValue?: T): T extends undefined ? T | undefined : T {
    // @ts-ignore: incorrect understanding of conditional types from ts
    return _.get(this.global, path, defaultValue) as T;
  }
}

export const config = new Config();
