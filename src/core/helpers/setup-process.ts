import { HealthManager } from '@/libs/health-manager';

const errorHandler = (error: Error) => {
  HealthManager.report(`Uncaught Error:`, error);
  process.exit(1);
};

process.on('uncaughtException', errorHandler);
process.on('unhandledRejection', errorHandler);
