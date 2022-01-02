import path from 'path';

import { ENodeEnv, TNodeEnv } from '@/libs/config';

const config = {
  logPath: path.join(__dirname, '../../logs'),
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
