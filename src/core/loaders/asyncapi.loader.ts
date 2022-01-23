/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-require-imports */

import fs from 'fs';
import path from 'path';
import glob from 'glob';
import yaml from 'js-yaml';
import _ from 'lodash';

import { Logger } from '@/libs/logger';
import { Config } from '@/libs/config';

const logger = new Logger('AsyncAPI:Loader');

interface IAsyncApiFileObject<T = object> {
  tags?: unknown[];
  components?: T;
  channels?: object;
}

interface IAsyncApiObject
  extends IAsyncApiFileObject<{
    securitySchemes?: object;
    schemas?: object;
  }> {}

export interface IPathContract {
  path: string;
}

export interface IFileContract {
  file: string;
}

export type TAsyncApiResponse = () => Promise<IPathContract | IFileContract | null>;

const DEFAULT_OPTIONS = {
  tempFileFolder: path.resolve(__dirname, '../../../temp/temp-async-api'),
  filePath: './socket/{docs/,namespaces/docs}',
  fileName: '*asyncapi.@(yaml|yml|json)',
  style: '#asyncapi { min-height: 100vh; }',
  inMemory: true,
};

const extractObjectFromFile = (pathToFile: string, preprocessor = (file: string) => file) => {
  const ext = path.extname(pathToFile);

  if (/y(a)?ml/.test(ext)) {
    try {
      const rowFile = fs.readFileSync(pathToFile, 'utf8');
      const processedFile = preprocessor(rowFile);
      const doc = yaml.load(processedFile);
      return doc as object;
    } catch {
      return {};
    }
  } else if (ext === 'json') {
    return require(pathToFile) as object;
  }

  return {};
};

const asyncAPILoader = (relativePath = __dirname, options = DEFAULT_OPTIONS): TAsyncApiResponse => {
  return async () => {
    // assemble asyncapi doc
    // get base file
    const baseAsyncapiPath = path.resolve(__dirname, '../../config/asyncapi', options.fileName);
    const existedAsyncapiBasePaths = glob.sync(baseAsyncapiPath);

    if (existedAsyncapiBasePaths.length === 0) {
      logger.error(`Base asyncapi file not found by path '${baseAsyncapiPath}'`);
      return null;
    }

    const baseAsyncapiFile = extractObjectFromFile(existedAsyncapiBasePaths[0], (doc) => {
      return doc.replace(/\{\{(.+?)\}\}/g, (origin, variable: string) => {
        return (Config.global.asyncapi.vars[variable] as string | undefined) ?? origin;
      });
    });

    // get all spec files
    const pathToAllAsyncapiFiles = path.resolve(relativePath, options.filePath, options.fileName);
    const foundAsyncapiFilePaths = glob.sync(pathToAllAsyncapiFiles);
    const foundAsyncapiFiles = foundAsyncapiFilePaths.map((aa) => {
      const obj: IAsyncApiFileObject = extractObjectFromFile(aa);
      // only fields `tags`, `components`, `channels`
      return {
        tags: obj.tags ?? [],
        components: obj.components ?? {},
        channels: obj.channels ?? {},
      };
    });

    // parse and concat file
    const concatAsyncapiAPI = _.mergeWith(
      {},
      ...foundAsyncapiFiles,
      (objValue: object | null, srcValue: object | null) => {
        if (objValue === null) return srcValue;
        if (srcValue === null) return objValue;
        return objValue;
      }
    );

    // merge resulted asyncapi file
    const resAsyncapi: IAsyncApiObject = _.merge({}, baseAsyncapiFile, concatAsyncapiAPI);
    if (!resAsyncapi.tags) resAsyncapi.tags = [];
    if (!resAsyncapi.channels) resAsyncapi.channels = {};
    if (!resAsyncapi.components) resAsyncapi.components = {};
    if (!resAsyncapi.components.securitySchemes) resAsyncapi.components.securitySchemes = {};
    if (!resAsyncapi.components.schemas) resAsyncapi.components.schemas = {};

    // validate asyncapi model
    let validAsyncapi = null;

    try {
      // loading optimization
      const parser = require('@asyncapi/parser');
      validAsyncapi = await parser.parse(resAsyncapi);
    } catch (error) {
      logger.error(error as Error);
      return null;
    }

    // create new static file, save it in memory
    // loading optimization
    const Generator = require('@asyncapi/generator');
    const generator = new Generator('@asyncapi/html-template', options.tempFileFolder, {
      entrypoint: 'index.html',
    });

    fs.rmSync(options.tempFileFolder, { recursive: true, force: true });
    generator.asyncapi = validAsyncapi;
    await generator.generate(validAsyncapi);

    // add new styles
    const pathToAsyncapiResFile = path.join(options.tempFileFolder, 'index.html');
    let asyncapiHTML = fs.readFileSync(pathToAsyncapiResFile).toString();

    asyncapiHTML = asyncapiHTML.replace(
      /( *)(<link href="css\/styles.min.css" rel="stylesheet">)/,
      (origin, shift) => {
        return `${origin}\n\n${shift}<style>\n${shift}  ${options.style}\n${shift}</style>\n`;
      }
    );

    if (options.inMemory) {
      fs.rmSync(options.tempFileFolder, { recursive: true, force: true });
      return { file: asyncapiHTML };
    }

    fs.writeFileSync(pathToAsyncapiResFile, asyncapiHTML);
    return { path: pathToAsyncapiResFile };
  };
};

export default asyncAPILoader;
