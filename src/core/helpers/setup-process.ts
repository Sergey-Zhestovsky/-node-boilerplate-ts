import { logger } from '@/libs/Logger';

const errorHandler = (error: Error) => {
  logger.error(`Uncaught Error:`, error);
  process.exit(1);
};

process.on('uncaughtException', errorHandler);
process.on('unhandledRejection', errorHandler);
