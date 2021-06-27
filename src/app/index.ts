import routerLoader from '../loaders/router.loader';
import graphqlLoader from '../loaders/graphql.loader';
import socketLoader from '../loaders/socket.loader';
import swaggerLoader from '../loaders/swagger.loader';
import asyncAPILoader from '../loaders/asyncapi.loader';

export const routes = routerLoader(__dirname);
export const swagger = swaggerLoader(__dirname);
export const graphql = graphqlLoader(__dirname, require('./utils/graphql/loaders'));
export const socket = socketLoader(__dirname, {
  socketHandlerFactory: require('./utils/socket/SocketHandlerFactory'),
});
export const asyncapi = asyncAPILoader(__dirname);
