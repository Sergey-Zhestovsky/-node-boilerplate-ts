import { logger } from '@/libs/Logger';

const errorHandler = (error: Error) => {
  logger.error(`Uncaught Error: '${error.message}'`, error);
  process.exit(1);
};

process.on('uncaughtException', errorHandler);
process.on('unhandledRejection', errorHandler);
