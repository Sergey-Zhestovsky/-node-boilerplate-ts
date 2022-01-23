import { ApolloServer } from 'apollo-server-express';
import { Express } from 'express';

import { graphql } from './app';
import { Config } from './libs/config';

const { loaders, ...serverConfig } = graphql;

const server = new ApolloServer({
  ...serverConfig,
  context: async ({ req, res }) => {
    return {
      loaders: loaders(),
    };
  },
});

export const applyGraphql = async (expressApp: Express) => {
  await server.start();

  const middleware = server.getMiddleware({
    path: '/api/v1/graphql',
    cors: Config.global.cors.withCors ? Config.global.cors.config : false,
  });

  expressApp.use(middleware);
};
