/* eslint-disable @typescript-eslint/no-require-imports */

import fs from 'fs';
import path from 'path';
import glob from 'glob';
import yaml from 'js-yaml';
import _ from 'lodash';
import SwaggerParser from '@apidevtools/swagger-parser';
import { OpenAPI } from 'openapi-types';

import { logger } from '@/libs/logger';
import { getServerDomain } from '@/utils';

interface ISwaggerFileObject<T = object> {
  servers?: unknown[];
  tags?: unknown[];
  components?: T;
  paths?: object;
}

interface ISwaggerObject
  extends ISwaggerFileObject<{
    securitySchemes?: object;
    schemas?: object;
  }> {}

const DEFAULT_OPTIONS = {
  filePath: './routers/*/',
  fileName: 'swagger.@(yaml|yml|json)',
};

const extractObjectFromFile = (pathToFile: string) => {
  const ext = path.extname(pathToFile);

  if (/y(a)?ml/.test(ext)) {
    try {
      const doc = yaml.load(fs.readFileSync(pathToFile, 'utf8'));
      if (typeof doc === 'object') return doc;
      return null;
    } catch {
      return {};
    }
  } else if (ext === 'json') {
    return require(pathToFile) as object;
  }

  return {};
};

const swaggerLoader = (relativePath = __dirname, options = DEFAULT_OPTIONS) => {
  return async () => {
    // load base file
    const baseSwaggerPath = path.resolve(__dirname, '../../config/swagger', options.fileName);
    const swaggerBasePaths = glob.sync(baseSwaggerPath);

    if (swaggerBasePaths.length === 0) {
      logger.error(`Base swagger file not found by path '${baseSwaggerPath}'`);
      return null;
    }

    const baseSwaggerFile: ISwaggerFileObject | null = extractObjectFromFile(swaggerBasePaths[0]);
    if (baseSwaggerFile === null) throw new Error('Could not parse swagger base file');
    // add server path
    baseSwaggerFile.servers = [...(baseSwaggerFile.servers ?? []), { url: getServerDomain() }];

    // load all files from app
    const pathToAllSwaggerFiles = path.resolve(relativePath, options.filePath, options.fileName);
    const foundSwaggerFilePaths = glob.sync(pathToAllSwaggerFiles);
    const foundSwaggerFiles = foundSwaggerFilePaths
      .map<ISwaggerFileObject | null>((sp) => {
        const obj: ISwaggerFileObject | null = extractObjectFromFile(sp);
        if (obj === null) return null;
        // only fields `tags`, `components`, `paths`
        return { tags: obj.tags ?? [], components: obj.components ?? {}, paths: obj.paths ?? {} };
      })
      .filter<ISwaggerFileObject>((v): v is ISwaggerFileObject => v !== null);

    // parse and concat file
    const concatSwaggerAPI = _.mergeWith(
      {},
      ...foundSwaggerFiles,
      (objValue: object | null, srcValue: object | null) => {
        if (objValue === null) return srcValue;
        if (srcValue === null) return objValue;
        return objValue;
      }
    );

    // merge resulted swagger file
    const resSwagger: ISwaggerObject = _.merge({}, baseSwaggerFile, concatSwaggerAPI);
    if (!resSwagger.tags) resSwagger.tags = [];
    if (!resSwagger.paths) resSwagger.paths = {};
    if (!resSwagger.components) resSwagger.components = {};
    if (!resSwagger.components.securitySchemes) resSwagger.components.securitySchemes = {};
    if (!resSwagger.components.schemas) resSwagger.components.schemas = {};

    // validate file
    try {
      return SwaggerParser.validate(resSwagger as OpenAPI.Document);
    } catch (err) {
      if (err instanceof Error) logger.error(`Swagger validation error: ${err.message}`);
      return null;
    }
  };
};

export default swaggerLoader;
