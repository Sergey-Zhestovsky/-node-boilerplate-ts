import 'colors';

import debug from 'debug';
import util from 'util';

import { BaseLogger } from './BaseLogger';
import { ELogLevel, ILogEntry, TLogEntryType } from './types';

export class Logger {
  private static readonly baseLogger = new BaseLogger();

  private static applyNamespaceColor(namespace: string) {
    const c = debug.selectColor(namespace);
    const colorCode = `\u001B[3${c < 8 ? c : `8;5;${c}`}`;
    return `${colorCode};1m${namespace}\u001B[39m\u001B[22m`;
  }

  private static getNamespace(namespace?: string, withColor?: boolean): string | undefined {
    if (!namespace) return;
    return withColor ? Logger.applyNamespaceColor(namespace) : namespace;
  }

  static canLog(logLevel: ELogLevel) {
    return Logger.baseLogger.canLog(logLevel);
  }

  static getDebug(namespace: string) {
    return Logger.baseLogger.debugger.extend(namespace);
  }

  public readonly namespace;

  constructor(namespace?: string, withColor = true) {
    this.namespace = Logger.getNamespace(namespace, withColor);
  }

  private parseLogEntry(level: ELogLevel, entries: TLogEntryType[]): ILogEntry {
    const logEntry: ILogEntry = {
      level: level,
      message: '',
      namespace: this.namespace,
    };

    const rowMessage: Array<Exclude<TLogEntryType, Error>> = [];

    for (const data of entries) {
      if (data instanceof Error) {
        rowMessage.push(data.message);
        logEntry.stack = data.stack;
      } else {
        rowMessage.push(data);
      }
    }

    return { ...logEntry, message: util.format(...rowMessage) };
  }

  log(entry: ILogEntry) {
    return Logger.baseLogger.winston.log(entry);
  }

  debug(...args: TLogEntryType[]) {
    return this.log(this.parseLogEntry(ELogLevel.Debug, args));
  }

  info(...args: TLogEntryType[]) {
    return this.log(this.parseLogEntry(ELogLevel.Info, args));
  }

  warn(...args: TLogEntryType[]) {
    return this.log(this.parseLogEntry(ELogLevel.Warn, args));
  }

  error(...args: TLogEntryType[]) {
    return this.log(this.parseLogEntry(ELogLevel.Error, args));
  }
}
