const routerLoader = require('../loaders/router.loader');
const graphqlLoader = require('../loaders/graphql.loader');
const socketLoader = require('../loaders/socket.loader');
const swaggerLoader = require('../loaders/swagger.loader');
const asyncAPILoader = require('../loaders/asyncapi.loader');

module.exports = {
  routes: routerLoader(__dirname),
  swagger: swaggerLoader(__dirname),
  graphql: graphqlLoader(__dirname, require('./utils/graphql/loaders')),
  socket: socketLoader(__dirname, {
    socketHandlerFactory: require('./utils/socket/SocketHandlerFactory'),
  }),
  asyncapi: asyncAPILoader(__dirname),
};
