/* eslint-disable no-console */

import 'colors';

import './setup-modules';
import { envLoader, environment, ENodeEnv } from '@/libs/config/Environment';

type TScript = (args: string[]) => Promise<string | void> | string | void;

/**
 * Function that running scripts from src/scripts folder
 * @param args - console arguments, last argument should be Node environment name.
 */
const run = async (args: string[]) => {
  const passedArgs = args.slice(2);
  const scriptName = passedArgs[0];
  const envFromArgs = passedArgs[1];
  const scriptArgs = passedArgs.slice(2);

  if (!scriptName) {
    return console.log('Script name is required.'.red);
  }

  let chosenEnv = envFromArgs ? environment.getNodeEnv(envFromArgs) : undefined;

  if (!chosenEnv) {
    const warn = `Node environment is not passed. Assumes '${ENodeEnv.DEVELOPMENT}' as default environment.\n`;
    console.log(warn.yellow);
    chosenEnv = ENodeEnv.DEVELOPMENT;
  }

  envLoader(chosenEnv);

  let script;

  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    script = (require(`@/scripts/${scriptName}`) as RequireDefaultModule<TScript>).default;
  } catch (error) {
    return console.log(`Script with name: '${scriptName}' not found in src/scripts/ dir.`);
  }

  const result = await script(scriptArgs);
  if (result) console.log(`${`Script result:`.cyan}\n${result}`);
  console.log();
};

void run(process.argv);
