import { RequestHandler } from 'express';
import morgan from 'morgan';

import { Logger, ELogLevel } from '@/libs/logger';

export const queryLogger = (): RequestHandler => {
  if (Logger.canLog(ELogLevel.Debug)) {
    const logger = new Logger('Query');

    return morgan(
      'PATH::url [:method] :: status::status :: size::res[content-length] :: :response-time ms',
      {
        stream: {
          write: (message: string) => {
            logger.debug(message.replace(/\n/g, ''));
          },
        },
      }
    );
  }

  return (req, res, next) => next();
};
