/* eslint-disable no-console */

require('colors');

const env = require('../data/env.json');

/**
 * Function that running scripts from src/scripts folder
 * @param {any[]} args - console arguments, last argument should be Node environment name.
 */
const run = async (args) => {
  const passedArgs = args.slice(2);
  const scriptName = passedArgs.splice(0, 1);
  let environment = passedArgs[passedArgs.length - 1];

  if (!scriptName) return console.log('Script name is required.');

  if (!environment || !Object.values(env).includes(environment)) {
    console.log(`Node environment is not passed. Assumes '${env.DEVELOPMENT}' as default environment.\n`.yellow);
    environment = env.DEVELOPMENT;
  }

  require('./setup-environment')(`.env.${environment}`);
  const script = await require(`../scripts/${scriptName}`);

  if (!script) {
    return console.log(`Script with name: '${scriptName}' not found in src/scripts/ dir.`);
  }

  const result = await script();
  if (result !== undefined) console.log(`${`Script result:`.cyan}\n${result}`);
  console.log();
  process.exit(0);
};

run(process.argv);
