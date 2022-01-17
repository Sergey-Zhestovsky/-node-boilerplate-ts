import routerLoader from '@/core/loaders/router.loader';
import graphqlLoader from '@/core/loaders/graphql.loader';
import socketLoader from '@/core/loaders/socket.loader';
import asyncAPILoader from '@/core/loaders/asyncapi.loader';

import gqlLoader from './graphql/_misc/loaders';
import SocketHandlerFactory from './socket/utils/SocketHandlerFactory';

export const routes = routerLoader(__dirname);
export const graphql = graphqlLoader(__dirname, gqlLoader);
export const socket = socketLoader(__dirname, {
  socketHandlerFactory: SocketHandlerFactory,
});
export const asyncapi = asyncAPILoader(__dirname);
