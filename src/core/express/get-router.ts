import express from 'express';
import core from 'express-serve-static-core';

import { IRouterMatcher } from './types';

interface IRouter extends core.Router {
  all: IRouterMatcher<this>;
  get: IRouterMatcher<this>;
  post: IRouterMatcher<this>;
  put: IRouterMatcher<this>;
  delete: IRouterMatcher<this>;
  patch: IRouterMatcher<this>;
  options: IRouterMatcher<this>;
  head: IRouterMatcher<this>;

  build: () => core.Router;
}

export const getRouter = (basePath: string) => {
  const router = express.Router() as IRouter;
  router.build = () => express.Router().use(basePath, router);
  return router;
};
