/* eslint-disable @typescript-eslint/naming-convention */

declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: string;
  }

  interface Process {
    initialEnvironmentConfig: Record<string, string>;
  }
}
