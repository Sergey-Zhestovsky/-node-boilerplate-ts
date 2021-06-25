require('colors');

const fs = require('fs');
const path = require('path');
const glob = require('glob');
const _ = require('lodash');
const { buildSchema, validateSchema, GraphQLError } = require('graphql');

const logger = require('../libs/Logger');

const DEFAULT_CONFIG = {
  /** relative folder path to file */
  pathPattern: './graphql',
  /** file name of graphql */
  graphqlFileName: 'types.graphql',
  /** file name of resolvers */
  resolverFileName: 'resolvers.js',
  /** all about directives */
  directives: {
    /** root path to directives folder */
    rootPath: './utils/graphql/directives',
    /** path or pattern to all gql files */
    graphqlPath: '*.@(gql|graphql)',
    /** path to file with directives code */
    index: '{directives,index}.js',
  },
  /** file path to loaders */
  loadersFilePath: './utils/graphql/loaders/index.js',
};

const getGraphqlError = (error, filePath) => {
  let errorString = `Graphql: ${error.message}`;
  if (filePath) errorString += `\n    File: '${filePath.cyan}'.`;
  if (error.source) errorString += `\n    ${JSON.stringify(error.source.locationOffset)}`;
  return errorString;
};

const getGraphqlFile = (pathToFile) => {
  let file;

  try {
    file = fs.readFileSync(pathToFile, 'utf-8');
    if (file !== '') buildSchema(file);
    return file;
  } catch (error) {
    if (error instanceof GraphQLError) {
      logger.error(getGraphqlError(error, pathToFile));
      process.exit(1);
    } else if (error.code === 'ENOENT') {
      throw error;
    } else {
      return file;
    }
  }
};

const graphqlAssembler = (
  relativePath = __dirname,
  loaders = () => ({}),
  config = DEFAULT_CONFIG
) => {
  const root = fs.readdirSync(path.resolve(relativePath, config.pathPattern));
  const result = {
    typeDefs: [],
    resolvers: {},
    schemaDirectives: {},
    loaders: loaders,
  };

  // load typeDefs & resolvers
  root.forEach((rootFolder) => {
    const relPath = path.join(config.pathPattern, rootFolder);
    const basePath = path.resolve(relativePath, relPath);
    let resolvers = null;
    let typeDefs = null;

    try {
      resolvers = require(path.join(basePath, config.resolverFileName));
    } catch (e) {
      logger.warn(`Cant find '${config.resolverFileName}' file in '${relPath}'`);
    }

    try {
      typeDefs = getGraphqlFile(path.join(basePath, config.graphqlFileName));
    } catch (error) {
      logger.warn(`Cant find '${config.graphqlFileName}' file in '${relPath}'`);
    }

    if (resolvers !== null && typeDefs !== null && typeDefs !== '') {
      result.typeDefs.push(typeDefs);
      result.resolvers = _.merge(result.resolvers, resolvers);
    }
  });

  // load directives
  const rootDirectives = path.resolve(relativePath, config.directives.rootPath);

  // load directives gql
  const gqlDirectiveFiles = glob.sync(path.join(rootDirectives, config.directives.graphqlPath));
  const gqlDirectives = gqlDirectiveFiles.map((filePath) => {
    return getGraphqlFile(filePath) || '';
  });

  try {
    const gqlDirectiveCodeFile = glob.sync(path.join(rootDirectives, config.directives.index));

    if (gqlDirectiveCodeFile.length) {
      const directives = require(gqlDirectiveCodeFile[0]);
      result.schemaDirectives = directives;
      result.typeDefs = result.typeDefs.concat(...gqlDirectives);
    }
  } catch (error) {
    // graphql setup without directives
  }

  result.typeDefs = result.typeDefs.join('\n').trim();

  try {
    const schema = buildSchema(result.typeDefs);
    const errors = validateSchema(schema);

    if (errors.length) {
      errors.forEach((error) => logger.error(getGraphqlError(error)));
      process.exit(1);
    }

    return result;
  } catch (error) {
    logger.error(getGraphqlError(error));
    process.exit(1);
  }
};

module.exports = graphqlAssembler;
