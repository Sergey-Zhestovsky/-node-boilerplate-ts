/* eslint-disable @typescript-eslint/no-require-imports */

import 'colors';

import fs from 'fs';
import path from 'path';
import glob from 'glob';
import _ from 'lodash';
import { buildSchema, validateSchema, GraphQLError } from 'graphql';
import { SchemaDirectiveVisitor, IResolvers } from 'graphql-tools';

import logger from '../libs/Logger';

interface IGqlResult {
  typeDefs: string;
  resolvers: IResolvers;
  schemaDirectives: Record<string, typeof SchemaDirectiveVisitor>;
  loaders: () => object;
}

const DEFAULT_CONFIG = {
  /** relative folder path to file */
  pathPattern: './graphql',
  /** file name of graphql */
  graphqlFileName: 'types.graphql',
  /** file name of resolvers */
  resolverFileName: 'resolvers.ts',
  /** all about directives */
  directives: {
    /** root path to directives folder */
    rootPath: './utils/graphql/directives',
    /** path or pattern to all gql files */
    graphqlPath: '*.@(gql|graphql)',
    /** path to file with directives code */
    index: '{directives,index}.ts',
  },
  /** file path to loaders */
  loadersFilePath: './utils/graphql/loaders/index.ts',
};

const getGraphqlError = (error: GraphQLError, filePath?: string) => {
  let errorString = `Graphql: ${error.message}`;
  if (filePath) errorString += `\n    File: '${filePath.cyan}'.`;
  if (error.source) errorString += `\n    ${JSON.stringify(error.source.locationOffset)}`;
  return errorString;
};

const getGraphqlFile = (pathToFile: string) => {
  let file;

  try {
    file = fs.readFileSync(pathToFile, 'utf-8');
    if (file !== '') buildSchema(file);
    return file;
  } catch (error) {
    if (error instanceof GraphQLError) {
      logger.error(getGraphqlError(error, pathToFile));
      process.exit(1);
    } else if ((error as Record<string, string>).code === 'ENOENT') {
      throw error;
    } else {
      return file ?? null;
    }
  }
};

const graphqlAssembler = (
  relativePath = __dirname,
  loaders = () => ({}),
  config = DEFAULT_CONFIG
) => {
  const root = fs.readdirSync(path.resolve(relativePath, config.pathPattern));
  const typeDefsArr: string[] = [];
  const result: IGqlResult = {
    typeDefs: '',
    resolvers: {},
    schemaDirectives: {},
    loaders: loaders,
  };

  // load typeDefs & resolvers
  root.forEach((rootFolder) => {
    const relPath = path.join(config.pathPattern, rootFolder);
    const basePath = path.resolve(relativePath, relPath);
    let resolvers: object | null = null;
    let typeDefs: string | null = null;

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
      typeDefsArr.push(typeDefs);
      result.resolvers = _.merge(result.resolvers, resolvers);
    }
  });

  // load directives
  const rootDirectives = path.resolve(relativePath, config.directives.rootPath);

  // load directives gql
  const gqlDirectiveFiles = glob.sync(path.join(rootDirectives, config.directives.graphqlPath));
  const gqlDirectives = gqlDirectiveFiles.map((filePath) => {
    return getGraphqlFile(filePath) ?? '';
  });

  try {
    const gqlDirectiveCodeFile = glob.sync(path.join(rootDirectives, config.directives.index));

    if (gqlDirectiveCodeFile.length) {
      const directives = require(gqlDirectiveCodeFile[0]);
      result.schemaDirectives = directives;
      typeDefsArr.push(...gqlDirectives);
    }
  } catch (error) {
    // graphql setup without directives
  }

  result.typeDefs = typeDefsArr.join('\n').trim();

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

export default graphqlAssembler;
