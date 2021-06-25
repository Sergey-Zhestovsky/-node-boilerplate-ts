/* eslint-disable no-console */
/* eslint-disable no-param-reassign */

require('colors');

const dotenv = require('dotenv');

const { list: envVariables } = require('../data/env-variables.json');
const env = require('../data/env.json');

const validateVariables = (configPath) => {
  if (configPath === undefined) {
    if (process.env.NODE_ENV === undefined || process.env.NODE_ENV === null) {
      process.env.NODE_ENV = env.DEVELOPMENT;
    }

    if (process.env.NODE_ENV === env.DEVELOPMENT) configPath = `.env.development`;
    if (process.env.NODE_ENV === env.PRODUCTION) configPath = `.env.production`;
    if (process.env.NODE_ENV === env.TEST) configPath = `.env.test`;
  }

  dotenv.config({ path: `${configPath}.local` });
  dotenv.config({ path: configPath });
  dotenv.config({ path: '.env.local' });
  dotenv.config({ path: '.env' });

  const allVariables = {};
  const missedVariables = [];

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

module.exports = validateVariables;
