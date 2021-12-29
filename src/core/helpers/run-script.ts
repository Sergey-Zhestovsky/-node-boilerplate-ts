/* eslint-disable no-console */

import 'colors';

import envLoader from '../loaders/environment.loader';
import env from '@/data/env.json';

type TScript = (args: string[]) => Promise<string | void> | string | void;

/**
 * Function that running scripts from src/scripts folder
 * @param args - console arguments, last argument should be Node environment name.
 */
const run = async (args: string[]) => {
  const passedArgs = args.slice(2);
  const scriptName = passedArgs[0];
  let environment = passedArgs[1];
  const scriptArgs = passedArgs.slice(2);

  if (!scriptName) return console.log('Script name is required.');

  if (!environment || !Object.values(env).includes(environment)) {
    console.log(
      `Node environment is not passed. Assumes '${env.DEVELOPMENT}' as default environment.\n`
        .yellow
    );
    environment = env.DEVELOPMENT;
  }

  envLoader(`.env.${environment}`);

  let script;

  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    script = (require(`../../scripts/${scriptName}`) as RequireDefaultModule<TScript>).default;
  } catch (error) {
    return console.log(`Script with name: '${scriptName}' not found in src/scripts/ dir.`);
  }

  const result = await script(scriptArgs);
  if (result) console.log(`${`Script result:`.cyan}\n${result}`);
  console.log();
};

void run(process.argv);
