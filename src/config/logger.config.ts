import path from 'path';

import { environment, ENodeEnv } from '@/libs/config';
import { ELogLevel, ILoggerOptions } from '@/libs/logger/types';

const config: ILoggerOptions = {
  logPath: path.join(__dirname, '../../logs'),
  logFileLevel: environment.vars.LOGGING_FILE_LEVEL ?? ELogLevel.Info,
  logConsoleLevel: environment.vars.LOGGING_CONSOLE_LEVEL ?? ELogLevel.Info,
  console: {
    blackListModes: [ENodeEnv.TEST],
  },
  fileTransport: {
    datePattern: 'DD-MM-YYYY',
    maxFiles: '90d',
    maxSize: '20m',
    zippedArchive: true,
  },
};

export default config;
