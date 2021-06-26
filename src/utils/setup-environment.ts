/* eslint-disable no-console */
/* eslint-disable no-param-reassign */

import 'colors';

import dotenv from 'dotenv';

import { list as envVariables } from '../data/env-variables.json';
import env from '../data/env.json';

const validateVariables = (configPath?: string): boolean => {
  if (configPath === undefined) {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    process.env.NODE_ENV ?? (process.env.NODE_ENV = env.DEVELOPMENT);

    switch (process.env.NODE_ENV) {
      case env.PRODUCTION:
        configPath = `.env.production`;
        break;

      case env.TEST:
        configPath = `.env.test`;
        break;

      case env.DEVELOPMENT:
      default:
        configPath = `.env.development`;
        break;
    }
  }

  dotenv.config({ path: `${configPath}.local` });
  dotenv.config({ path: configPath });
  dotenv.config({ path: '.env.local' });
  dotenv.config({ path: '.env' });

  const allVariables: Record<string, string> = {};
  const missedVariables: string[] = [];

  for (const variable of envVariables) {
    const pVariable = process.env[variable];

    if (pVariable === undefined) {
      missedVariables.push(variable);
    } else {
      allVariables[variable] = pVariable;
    }
  }

  process.initialEnvironmentConfig = { ...allVariables };
  if (missedVariables.length === 0) return true;

  const missingVariables = `'${missedVariables.join(`', '`)}'`;
  const errorMessage = `Wrong environment configuration, missing list of variables: ${missingVariables}.`;
  console.log();
  console.log(errorMessage);
  console.log();
  throw new Error(errorMessage);
};

export default validateVariables;
