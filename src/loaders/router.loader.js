const fs = require('fs');
const path = require('path');

const logger = require('../libs/Logger');

const DEFAULT_CONFIG = {
  /** relative folder path to file */
  pathPattern: './routers',
  /** file name */
  fileName: 'routes.js',
};

const routesAssembler = (relativePath = __dirname, config = DEFAULT_CONFIG) => {
  const root = fs.readdirSync(path.resolve(relativePath, config.pathPattern));
  const result = [];

  root.forEach((rootFolder) => {
    const relPath = path.join(config.pathPattern, rootFolder);

    try {
      result.push(require(path.resolve(relativePath, relPath, config.fileName)));
    } catch (e) {
      logger.warn(`Cant find '${config.fileName}' file in '${relPath}'`);
    }
  });

  return result;
};

module.exports = routesAssembler;
