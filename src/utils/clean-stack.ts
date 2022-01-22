import os from 'os';

interface IOptions {
  pretty?: boolean;
  basePath?: string;
  whiteListPath?: string | string[];
  onlyFromProjectDir?: boolean;
}

// prettier-ignore
// eslint-disable-next-line unicorn/no-unsafe-regex
const pathRegex = /^(?:(?:(?:node|node:[\w/]+|(?:(?:node:)?internal\/[\w/]*|.*node_modules\/(?:babel-polyfill|pirates)\/.*)?\w+)(?:\.js)?:\d+:\d+)|native)/;
const extractPathRegex = /\s+at.*[(\s](.*)\)?/;
const projectDir = process.cwd().replaceAll('\\', '/');
const homeDir = os.homedir().replaceAll('\\', '/');

const normalizeOptions = (options: IOptions) => {
  const { pretty = false, whiteListPath, onlyFromProjectDir, ...rest } = options;
  let wlp = typeof whiteListPath === 'string' ? [whiteListPath] : whiteListPath;
  if (onlyFromProjectDir) wlp = [projectDir];

  return {
    pretty,
    whiteListPath: wlp,
    ...rest,
  };
};

const escapeStringRegexp = (str: string) => {
  return str.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&').replaceAll('-', '\\x2d');
};

export const cleanStack = <T extends string | undefined>(stack: T, options: IOptions = {}): T => {
  const { pretty, whiteListPath, basePath } = normalizeOptions(options);

  let basePathRegex: RegExp | undefined;

  if (typeof basePath === 'string') {
    basePathRegex = new RegExp(
      `(at | \\()${escapeStringRegexp(basePath.replaceAll('\\', '/'))}`,
      'g'
    );
  }

  if (stack === undefined) {
    return undefined as T;
  }

  return stack
    .replaceAll('\\', '/')
    .split('\n')
    .filter((line) => {
      const pathMatches = line.match(extractPathRegex);
      if (pathMatches === null || !pathMatches[1]) return true;

      const match = pathMatches[1];
      const basicFilter = pathRegex.test(match);
      if (basicFilter) return false;

      if (whiteListPath) {
        return whiteListPath.some((wlp) => line.includes(wlp));
      }

      return true;
    })
    .filter((line) => line.trim() !== '')
    .map((line) => {
      let result = line;

      if (basePathRegex) {
        result = result.replace(basePathRegex, '$1');
      }

      if (pretty) {
        result = result.replace(extractPathRegex, (m, p1: string) => {
          return m.replace(p1, p1.replace(homeDir, '~'));
        });
      }

      return result;
    })
    .join('\n') as T;
};
