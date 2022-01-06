import path from 'path';

import { environment, ENodeEnv, TNodeEnv } from '@/libs/config';
import { ELogLevel } from '@/types/logger';

const config = {
  logPath: path.join(__dirname, '../../logs'),
  logFileLevel: environment.vars.LOGGING_FILE_LEVEL ?? ELogLevel.Info,
  logConsoleLevel: environment.vars.LOGGING_CONSOLE_LEVEL ?? ELogLevel.Info,
  console: {
    blackListModes: [ENodeEnv.TEST] as TNodeEnv[],
  },
  fileTransport: {
    datePattern: 'DD-MM-YYYY',
    maxFiles: '90d',
    maxSize: '20m',
    zippedArchive: true,
  },
};

export default config;
