import 'colors';

import path from 'path';
import debug from 'debug';
import winston, { Logform } from 'winston';
import moment, { Moment } from 'moment';
import DailyRotateFile from 'winston-daily-rotate-file';
import util from 'util';

import { config } from '@/libs/config';
import { cleanStack, stripAnsi } from '@/utils';
import {
  ELogLevel,
  ILogEntry,
  ILoggerOptions,
  TFileTransportOptions,
  TLogEntryType,
} from './types';

interface ILoggerInfo extends Logform.TransformableInfo {
  timestamp?: string;
  stack?: string;
}

type TTimeFormatter = (timestamp: number | string | Date | Moment) => string;

type TLogLevelSeverities = {
  [k in keyof typeof ELogLevel]: number;
};

class Logger {
  static get LogLevelSeverities(): TLogLevelSeverities {
    return {
      Debug: 0,
      Info: 1,
      Warn: 2,
      Error: 3,
    };
  }

  static getSeverityLevel(level: keyof typeof ELogLevel | ELogLevel) {
    let keyLevel: keyof typeof ELogLevel | undefined;

    Object.entries(ELogLevel).forEach(([key, val]) => {
      if (key === level || val === level) keyLevel = key as keyof typeof ELogLevel;
    });

    if (!keyLevel) return -1;
    return Logger.LogLevelSeverities[keyLevel];
  }

  private static getPrintf(timeFormatter: TTimeFormatter = (ts) => ts.toString()) {
    return (info: ILoggerInfo) => {
      const { level, message, stack, timestamp } = info;
      const formattedTs = timeFormatter(timestamp ?? Date.now());

      let output = message;
      if (stack) output += `\n${cleanStack(stack, { onlyFromProjectDir: true })}`;

      return `[${level.toUpperCase()}] :: ${formattedTs} :: ${output}`;
    };
  }

  private static getFileLogFormat() {
    const timeFormatter: TTimeFormatter = (timestamp) => {
      return moment.utc(timestamp).format('YYYY-MM-DD HH:mm:ss (Z)');
    };

    return winston.format.combine(
      winston.format.timestamp(),
      winston.format.printf(Logger.getPrintf(timeFormatter))
    );
  }

  private static getConsoleLogFormat() {
    const timeFormatter: TTimeFormatter = (timestamp) => {
      return moment(timestamp).format('HH:mm:ss').cyan;
    };

    return winston.format.combine(
      winston.format.timestamp(),
      winston.format.printf(Logger.getPrintf(timeFormatter)),
      winston.format.colorize({ all: true })
    );
  }

  private static getDailyRotateTransport(
    level: ELogLevel,
    logPath: string,
    options: TFileTransportOptions = {}
  ) {
    return new DailyRotateFile({
      ...options,
      level: level,
      format: Logger.getFileLogFormat(),
      filename: path.join(logPath, level, `${level}-%DATE%.log`),
    });
  }

  private static getFileTransport(logPath: string, options: ILoggerOptions) {
    const transports: DailyRotateFile[] = [];
    const currentSeverity = Logger.getSeverityLevel(options.logFileLevel);

    Object.entries(ELogLevel).forEach(([key, val]) => {
      const targetSeverity = Logger.getSeverityLevel(key as keyof typeof ELogLevel);

      if (targetSeverity >= currentSeverity) {
        transports.push(Logger.getDailyRotateTransport(val, logPath, options.fileTransport));
      }
    });

    return transports;
  }

  private static getConsoleTransport() {
    return new winston.transports.Console({
      format: Logger.getConsoleLogFormat(),
    });
  }

  private static buildLogger(options: ILoggerOptions) {
    const transports = [];

    if (options.logPath) {
      transports.push(...Logger.getFileTransport(options.logPath, options));
    }

    if (!options.console.blackListModes.includes(config.nodeEnv)) {
      transports.push(Logger.getConsoleTransport());
    }

    return winston.createLogger({
      level: options.logConsoleLevel,
      transports,
    });
  }

  private readonly winston: winston.Logger;
  private readonly debugger: debug.Debugger;
  public readonly logLevel: ELogLevel;

  constructor(options = config.global.logger) {
    this.winston = Logger.buildLogger(options);
    this.debugger = this.setupDebugger('app', options);
    this.logLevel = options.logConsoleLevel;
  }

  private setupDebugger(namespace: string, options: ILoggerOptions) {
    let winstonForDebug: winston.Logger | undefined;

    if (
      Logger.getSeverityLevel(options.logFileLevel) <= Logger.LogLevelSeverities.Debug &&
      options.logPath
    ) {
      winstonForDebug = winston.createLogger({
        level: options.logFileLevel,
        transports: [
          Logger.getDailyRotateTransport(ELogLevel.Debug, options.logPath, options.fileTransport),
        ],
      });
    }

    const debugInstance = debug(namespace);

    debugInstance.log = (...args: unknown[]) => {
      const res = args.map((v) => (typeof v === 'string' ? stripAnsi(v) : v));
      winstonForDebug?.debug(util.format(...res).trim());
      // eslint-disable-next-line no-console
      console.log(...args);
    };

    return debugInstance;
  }

  getDebug(namespace: string) {
    return this.debugger.extend(namespace);
  }

  private parseLogEntry(level: ELogLevel, entries: TLogEntryType[]): ILogEntry {
    const logEntry: ILogEntry = {
      level: level,
      message: '',
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

  canLog(logLevel: ELogLevel) {
    return Logger.getSeverityLevel(logLevel) >= Logger.getSeverityLevel(this.logLevel);
  }

  log(entry: ILogEntry) {
    return this.winston.log(entry);
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

export const logger = new Logger();
