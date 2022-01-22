/* eslint-disable @typescript-eslint/no-require-imports */

import { Router } from 'express';
import fs from 'fs';
import path from 'path';

const DEFAULT_CONFIG = {
  /** relative folder path to file */
  pathPattern: './routers',
  /** file name */
  fileName: 'routes.ts',
};

const routesAssembler = (relativePath = __dirname, config = DEFAULT_CONFIG) => {
  const rootPath = path.resolve(relativePath, config.pathPattern);
  const root = fs.readdirSync(rootPath);
  const result: Router[] = [];

  for (const rootFolder of root) {
    if (!fs.statSync(path.join(rootPath, rootFolder)).isDirectory()) continue;
    const relPath = path.join(config.pathPattern, rootFolder);
    const fullPath = path.resolve(relativePath, relPath, config.fileName);
    const router = require(fullPath) as RequireModule<Router>;
    // @ts-ignore: Suppose that `router.default` property comes from `export default`.
    result.push(router.default ?? router);
  }

  return result;
};

export default routesAssembler;
