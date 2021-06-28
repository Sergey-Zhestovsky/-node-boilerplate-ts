import routerLoader from '../loaders/router.loader';
import graphqlLoader from '../loaders/graphql.loader';
import socketLoader from '../loaders/socket.loader';
import swaggerLoader from '../loaders/swagger.loader';
import asyncAPILoader from '../loaders/asyncapi.loader';

import gqlLoader from './utils/graphql/loaders';
import SocketHandlerFactory from './utils/socket/SocketHandlerFactory';

export const routes = routerLoader(__dirname);
export const swagger = swaggerLoader(__dirname);
export const graphql = graphqlLoader(__dirname, gqlLoader);
export const socket = socketLoader(__dirname, {
  socketHandlerFactory: SocketHandlerFactory,
});
export const asyncapi = asyncAPILoader(__dirname);
