import path from 'path';

import env from '../data/env.json';

const config = {
  logPath: path.join(__dirname, '../../logs'),
  console: {
    blackListModes: [env.TEST],
  },
  fileTransport: {
    datePattern: 'DD-MM-YYYY',
    maxFiles: '90d',
    maxSize: '20m',
    zippedArchive: true,
  },
};

export default config;
