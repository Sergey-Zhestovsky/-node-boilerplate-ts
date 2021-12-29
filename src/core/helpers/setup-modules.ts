import path from 'path';
import moduleAlias from 'module-alias';

import tsconfig from '../../../tsconfig.json';

const trimTsPath = (pathStr: string) => {
  return pathStr.replace(/\/\*$/, '');
};

const resolveModulePath = (filePath: string, baseUrl = tsconfig.compilerOptions.baseUrl) => {
  return path.resolve(__dirname, '../../../', baseUrl, filePath);
};

const adaptTsPathsForModules = (paths = tsconfig.compilerOptions.paths) => {
  const result: Record<string, string> = {};

  for (const [key, value] of Object.entries(paths)) {
    result[trimTsPath(key)] = resolveModulePath(trimTsPath(value[0]));
  }

  return result;
};

moduleAlias.addAliases(adaptTsPathsForModules());
