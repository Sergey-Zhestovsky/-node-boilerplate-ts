/* eslint-disable @typescript-eslint/naming-convention */

declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: string;
  }

  interface Process {
    initialEnvironmentConfig: Record<string, string>;
  }
}

declare namespace Express {
  interface Response {
    return(val?: object | string | null, error?: object): void;
    throw(error?: object): void;
  }
}

type Writeable<T> = { -readonly [P in keyof T]: T[P] };
