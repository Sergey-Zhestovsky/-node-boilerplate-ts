const fs = require('fs');
const path = require('path');
const glob = require('glob');
const yaml = require('js-yaml');
const _ = require('lodash');

const logger = require('../libs/Logger');
const asyncapiConfig = require('../config/asyncapi/asyncapi.config');

const DEFAULT_CONFIG = {
  tempFileFolder: path.resolve(__dirname, '../../temp/temp-async-api'),
  filePath: './socket/{docs/,namespaces/docs}',
  fileName: '*asyncapi.@(yaml|yml|json)',
  style: '#asyncapi { min-height: 100vh; }',
  inMemory: true,
};

const extractObjectFromFile = (pathToFile, preprocessor = (file) => file) => {
  const ext = path.extname(pathToFile);

  if (/y(a)?ml/.test(ext)) {
    try {
      const rowFile = fs.readFileSync(pathToFile, 'utf8');
      const processedFile = preprocessor(rowFile);
      const doc = yaml.load(processedFile);
      return doc;
    } catch (e) {
      return {};
    }
  } else if (ext === 'json') {
    return require(pathToFile);
  }

  return {};
};

const asyncAPILoader = (relativePath = __dirname, config = DEFAULT_CONFIG) => {
  return async () => {
    // assemble asyncapi doc
    // get base file
    const baseAsyncapiPath = path.resolve(__dirname, '../config/asyncapi', config.fileName);
    const existedAsyncapiBasePaths = glob.sync(baseAsyncapiPath);

    if (existedAsyncapiBasePaths.length === 0) {
      logger.error(`Base asyncapi file not found by path '${baseAsyncapiPath}'`);
      return null;
    }

    const baseAsyncapiFile = extractObjectFromFile(existedAsyncapiBasePaths[0], (doc) => {
      return doc.replace(/\{\{(.+?)\}\}/g, (origin, variable) => {
        return asyncapiConfig.vars[variable] || origin;
      });
    });

    // get all spec files
    const pathToAllAsyncapiFiles = path.resolve(relativePath, config.filePath, config.fileName);
    const foundAsyncapiFilePaths = glob.sync(pathToAllAsyncapiFiles);
    const foundAsyncapiFiles = foundAsyncapiFilePaths.map((aa) => {
      const obj = extractObjectFromFile(aa);
      // only fields `tags`, `components`, `channels`
      return {
        tags: obj.tags || [],
        components: obj.components || {},
        channels: obj.channels || {},
      };
    });

    // parse and concat file
    const concatAsyncapiAPI = _.mergeWith({}, ...foundAsyncapiFiles, (objValue, srcValue) => {
      if (objValue === null) return srcValue;
      if (srcValue === null) return objValue;
      return objValue;
    });

    // merge resulted asyncapi file
    const resAsyncapi = _.merge({}, baseAsyncapiFile, concatAsyncapiAPI);
    if (!resAsyncapi.tags) resAsyncapi.tags = [];
    if (!resAsyncapi.channels) resAsyncapi.channels = {};
    if (!resAsyncapi.components) resAsyncapi.components = {};
    if (!resAsyncapi.components.securitySchemes) resAsyncapi.components.securitySchemes = {};
    if (!resAsyncapi.components.schemas) resAsyncapi.components.schemas = {};

    // validate asyncapi model
    let validAsyncapi = null;

    try {
      // optimization
      const parser = require('@asyncapi/parser');
      validAsyncapi = await parser.parse(resAsyncapi);
    } catch (error) {
      logger.error(error);
      return null;
    }

    // create new static file, save it in memory
    // optimization
    const Generator = require('@asyncapi/generator');
    const generator = new Generator('@asyncapi/html-template', config.tempFileFolder, {
      entrypoint: 'index.html',
    });

    fs.rmSync(config.tempFileFolder, { recursive: true, force: true });
    generator.asyncapi = validAsyncapi;
    await generator.generate(validAsyncapi);

    // add new styles
    const pathToAsyncapiResFile = path.join(config.tempFileFolder, 'index.html');
    let asyncapiHTML = fs.readFileSync(pathToAsyncapiResFile);

    asyncapiHTML = asyncapiHTML
      .toString()
      .replace(/( *)(<link href="css\/styles.min.css" rel="stylesheet">)/, (origin, shift) => {
        return `${origin}\n\n${shift}<style>\n${shift}  ${config.style}\n${shift}</style>\n`;
      });

    if (config.inMemory) {
      fs.rmSync(config.tempFileFolder, { recursive: true, force: true });
      return { file: asyncapiHTML };
    }

    fs.writeFileSync(pathToAsyncapiResFile, asyncapiHTML);
    return { path: pathToAsyncapiResFile };
  };
};

module.exports = asyncAPILoader;
