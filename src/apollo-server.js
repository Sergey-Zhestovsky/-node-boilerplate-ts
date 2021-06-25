const { ApolloServer } = require('apollo-server-express');

const { graphql } = require('./app');
const corsConfig = require('./config/cors.config');

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

module.exports = { server, middleware };
