/* eslint-disable @typescript-eslint/no-require-imports */

import { Router } from 'express';
import fs from 'fs';
import path from 'path';

import logger from '../libs/Logger';

const DEFAULT_CONFIG = {
  /** relative folder path to file */
  pathPattern: './routers',
  /** file name */
  fileName: 'routes.ts',
};

const routesAssembler = (relativePath = __dirname, config = DEFAULT_CONFIG) => {
  const root = fs.readdirSync(path.resolve(relativePath, config.pathPattern));
  const result: Router[] = [];

  root.forEach((rootFolder) => {
    const relPath = path.join(config.pathPattern, rootFolder);

    try {
      const pathToRouter = path.resolve(relativePath, relPath, config.fileName);
      const router = require(pathToRouter) as RequireModule<Router>;
      // @ts-ignore: Suppose that `router.default` property comes from `export default`.
      result.push(router.default ?? router);
    } catch (e) {
      logger.warn(`Cant find '${config.fileName}' file in '${relPath}'`);
    }
  });

  return result;
};

export default routesAssembler;
