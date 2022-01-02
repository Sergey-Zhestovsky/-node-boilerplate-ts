/* eslint-disable no-console */

import 'colors';

import path from 'path';
import dotenv from 'dotenv';

import { Validator, IExtendedValidator } from '@/libs/validator';
import nodeEnv from '@/data/env.json';
import { TNodeEnv, TEnumNodeEnv } from './types';

interface IBaseProcessEnv {
  NODE_ENV: string;

  PORT?: number;
  HOST?: string;

  // Database connection
  DB_URL: URL;
  DB_NAME: string;

  // Swagger
  SWAGGER: 'on' | 'off';
  SWAGGER_SERVER_URL?: URL;

  // AsyncAPI
  ASYNCAPI: 'on' | 'off';
  ASYNCAPI_PUBLIC_URL?: URL;
}

export interface IProcessEnv extends IBaseProcessEnv {}

export interface ITestProcessEnv extends IBaseProcessEnv {}

export const ENodeEnv = Object.fromEntries(
  Object.entries(nodeEnv).map(([key]) => [key, key])
) as TEnumNodeEnv;

let envLoader: (forEnv?: TNodeEnv) => void;

class Environment {
  static getValidationSchema(forNodeEnv: TNodeEnv, joi: IExtendedValidator) {
    const onOffSchema = joi
      .string()
      .pattern(/^(on)|(off)$/)
      .message(`{{#label}} must be one of the values: 'on', 'off'.`)
      .default('off');

    return {
      NODE_ENV: joi.string(),
      PORT: joi.number().optional(),
      HOST: joi.string().optional(),
      DB_URL: joi.string().url(),
      DB_NAME: joi.string(),
      SWAGGER: onOffSchema,
      SWAGGER_SERVER_URL: joi.string().url().optional(),
      ASYNCAPI: onOffSchema,
      ASYNCAPI_PUBLIC_URL: joi.string().url().optional(),
    };
  }

  static get EnvFolderPath() {
    return 'environment/';
  }

  static loadEnvFiles(forNodeEnv: TNodeEnv) {
    const getConfigFilePath = (fileName: string) => {
      return path.join(Environment.EnvFolderPath, fileName);
    };

    let configFileName: string;

    switch (forNodeEnv) {
      case ENodeEnv.PRODUCTION:
        configFileName = `.env.production`;
        break;

      case ENodeEnv.TEST:
        configFileName = `.env.test`;
        break;

      case ENodeEnv.DEVELOPMENT:
      default:
        configFileName = `.env.development`;
        break;
    }

    dotenv.config({ path: getConfigFilePath(`${configFileName}.local`) });
    dotenv.config({ path: getConfigFilePath(configFileName) });
    dotenv.config({ path: getConfigFilePath('.env.local') });
    dotenv.config({ path: getConfigFilePath('.env') });
  }

  static getValidatedEnvironment<T extends IBaseProcessEnv = IProcessEnv>(forNodeEnv: TNodeEnv): T {
    Environment.loadEnvFiles(forNodeEnv);

    const validator = new Validator();
    validator.setSchema(Environment.getValidationSchema.bind(Environment, forNodeEnv));
    const res = validator.validate<T>(process.env);

    if (!res) throw new Error();
    const { value, errors } = res;

    if (errors) {
      const errDescription = Object.values(errors)
        .map((errText) => `  — ${errText}`.red)
        .join('\n');

      console.log();
      console.log(`Environment validation error for '${forNodeEnv}':`.red);
      console.log(errDescription);
      console.log();
      return process.exit(1);
    }

    return value;
  }

  private nodeEnvName: TNodeEnv;
  private env?: IProcessEnv;

  constructor() {
    this.nodeEnvName = this.setupNodeEnv();
    envLoader = this.load.bind(this);
  }

  get nodeEnv() {
    if (!this.env) {
      throw new Error(`Environment is still not loaded. Do you forget to use 'load()' method?`);
    }

    return this.nodeEnvName;
  }

  get vars() {
    if (!this.env) {
      throw new Error(`Environment is still not loaded. Do you forget to use 'load()' method?`);
    }

    return this.env;
  }

  private load(forEnv = this.nodeEnvName) {
    if (this.env) return;
    this.env = Environment.getValidatedEnvironment(forEnv);
    this.nodeEnvName = this.setupNodeEnv();
  }

  private setupNodeEnv() {
    return this.getNodeEnv(this.env?.NODE_ENV ?? process.env.NODE_ENV, ENodeEnv.DEVELOPMENT);
  }

  getNodeEnv<T extends TNodeEnv>(
    envName: string,
    defaultEnv?: T
  ): T extends undefined ? TNodeEnv | null : TNodeEnv {
    for (const [key, value] of Object.entries(nodeEnv)) {
      const nameList = Array.isArray(value) ? value : [value];
      if (nameList.includes(envName)) return key as TNodeEnv;
    }

    // @ts-ignore: incorrect understanding of conditional types from ts
    return defaultEnv ?? null;
  }

  isProduction() {
    return this.nodeEnv === ENodeEnv.PRODUCTION;
  }

  isDevelopment() {
    return this.nodeEnv === ENodeEnv.DEVELOPMENT;
  }

  isTest() {
    return this.nodeEnv === ENodeEnv.TEST;
  }
}

export const environment = new Environment();
export { envLoader };
