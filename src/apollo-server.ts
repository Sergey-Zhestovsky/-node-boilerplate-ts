import { ApolloServer } from 'apollo-server-express';

import { graphql } from './app';
import corsConfig from './config/cors.config';

const { loaders, ...serverConfig } = graphql;

const server = new ApolloServer({
  ...serverConfig,
  context: async ({ req, res }) => {
    return {
      loaders: loaders(),
    };
  },
  playground: {
    settings: {
      'request.credentials': 'same-origin',
    },
  },
});

const middleware = server.getMiddleware({
  path: '/api/v1/graphql',
  cors: corsConfig.withCors ? corsConfig.config : false,
});

export { server, middleware };
