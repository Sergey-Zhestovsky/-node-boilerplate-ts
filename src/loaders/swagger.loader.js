const fs = require('fs');
const path = require('path');
const glob = require('glob');
const yaml = require('js-yaml');
const _ = require('lodash');
const SwaggerParser = require('swagger-parser');

const logger = require('../libs/Logger');
const swaggerConfig = require('../config/swagger/swagger.config');

const DEFAULT_CONFIG = {
  filePath: './routers/*/',
  fileName: 'swagger.@(yaml|yml|json)',
};

const extractObjectFromFile = (pathToFile) => {
  const ext = path.extname(pathToFile);

  if (/y(a)?ml/.test(ext)) {
    try {
      const doc = yaml.load(fs.readFileSync(pathToFile, 'utf8'));
      return doc;
    } catch (e) {
      return {};
    }
  } else if (ext === 'json') {
    return require(pathToFile);
  }

  return {};
};

const swaggerLoader = (relativePath = __dirname, config = DEFAULT_CONFIG) => {
  return async () => {
    // load base file
    const baseSwaggerPath = path.resolve(__dirname, '../config/swagger', config.fileName);
    const existedSwaggerBasePaths = glob.sync(baseSwaggerPath);

    if (existedSwaggerBasePaths.length === 0) {
      logger.error(`Base swagger file not found by path '${baseSwaggerPath}'`);
      return null;
    }

    const baseSwaggerFile = extractObjectFromFile(existedSwaggerBasePaths[0]);
    // add server path
    baseSwaggerFile.servers = [
      ...(baseSwaggerFile.servers || []),
      { url: swaggerConfig.serverURL },
    ];

    // load all files from app
    const pathToAllSwaggerFiles = path.resolve(relativePath, config.filePath, config.fileName);
    const foundSwaggerFilePaths = glob.sync(pathToAllSwaggerFiles);
    const foundSwaggerFiles = foundSwaggerFilePaths.map((sp) => {
      const obj = extractObjectFromFile(sp);
      // only fields `tags`, `components`, `paths`
      return { tags: obj.tags || [], components: obj.components || {}, paths: obj.paths || {} };
    });

    // parse and concat file
    const concatSwaggerAPI = _.mergeWith({}, ...foundSwaggerFiles, (objValue, srcValue) => {
      if (objValue === null) return srcValue;
      if (srcValue === null) return objValue;
      return objValue;
    });

    // merge resulted swagger file
    const resSwagger = _.merge({}, baseSwaggerFile, concatSwaggerAPI);
    if (!resSwagger.tags) resSwagger.tags = [];
    if (!resSwagger.paths) resSwagger.paths = {};
    if (!resSwagger.components) resSwagger.components = {};
    if (!resSwagger.components.securitySchemes) resSwagger.components.securitySchemes = {};
    if (!resSwagger.components.schemas) resSwagger.components.schemas = {};

    // validate file
    try {
      return SwaggerParser.validate(resSwagger);
    } catch (err) {
      logger.error(err.message);
      return null;
    }
  };
};

module.exports = swaggerLoader;
