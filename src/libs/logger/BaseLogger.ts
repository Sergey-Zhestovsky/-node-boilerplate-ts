import 'colors';

import debug from 'debug';
import moment, { Moment } from 'moment';
import path from 'path';
import util from 'util';
import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

import { Config } from '@/libs/config';
import { cleanStack, stripAnsi } from '@/utils';

import { ELogLevel, ILoggerOptions, ITransformableEntry, TFileTransportOptions } from './types';

type TTimeFormatter = (timestamp: number | string | Date | Moment) => string;

type TLogLevelSeverities = {
  [k in keyof typeof ELogLevel]: number;
};

export class BaseLogger {
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

    for (const [key, val] of Object.entries(ELogLevel)) {
      if (key === level || val === level) keyLevel = key as keyof typeof ELogLevel;
    }

    if (!keyLevel) return -1;
    return BaseLogger.LogLevelSeverities[keyLevel];
  }

  private static getPrintf(timeFormatter: TTimeFormatter = (ts) => ts.toString()) {
    return (info: ITransformableEntry) => {
      const { level, message, stack, namespace, timestamp } = info;
      const formattedTs = timeFormatter(timestamp ?? Date.now());

      const ns = namespace ? ` ${namespace} :: ` : ' ';

      let output = message;
      if (stack) output += `\n${cleanStack(stack, { onlyFromProjectDir: true })}`;

      return `[${level.toUpperCase()}] :: ${formattedTs} ::${ns}${output}`;
    };
  }

  private static getFileLogFormat() {
    const timeFormatter: TTimeFormatter = (timestamp) => {
      return moment.utc(timestamp).format('YYYY-MM-DD HH:mm:ss (Z)');
    };

    const stripNamespaceColor = winston.format((info: ITransformableEntry) => {
      return { ...info, namespace: info.namespace ? stripAnsi(info.namespace) : undefined };
    });

    return winston.format.combine(
      winston.format.timestamp(),
      stripNamespaceColor(),
      winston.format.printf(BaseLogger.getPrintf(timeFormatter))
    );
  }

  private static getConsoleLogFormat() {
    const timeFormatter: TTimeFormatter = (timestamp) => {
      return moment(timestamp).format('HH:mm:ss').cyan;
    };

    return winston.format.combine(
      winston.format.timestamp(),
      winston.format.printf(BaseLogger.getPrintf(timeFormatter)),
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
      format: BaseLogger.getFileLogFormat(),
      filename: path.join(logPath, level, `${level}-%DATE%.log`),
    });
  }

  private static getFileTransport(logPath: string, options: ILoggerOptions) {
    const transports: DailyRotateFile[] = [];
    const currentSeverity = BaseLogger.getSeverityLevel(options.logFileLevel);

    for (const [key, val] of Object.entries(ELogLevel)) {
      const targetSeverity = BaseLogger.getSeverityLevel(key as keyof typeof ELogLevel);

      if (targetSeverity >= currentSeverity) {
        transports.push(BaseLogger.getDailyRotateTransport(val, logPath, options.fileTransport));
      }
    }

    return transports;
  }

  private static getConsoleTransport() {
    return new winston.transports.Console({
      format: BaseLogger.getConsoleLogFormat(),
    });
  }

  private static buildLogger(options: ILoggerOptions) {
    const transports = [];

    if (options.logPath) {
      transports.push(...BaseLogger.getFileTransport(options.logPath, options));
    }

    if (!options.console.blackListModes.includes(Config.nodeEnv)) {
      transports.push(BaseLogger.getConsoleTransport());
    }

    return winston.createLogger({
      level: options.logConsoleLevel,
      transports,
    });
  }

  private static buildDebugger(namespace: string, options: ILoggerOptions) {
    let winstonForDebug: winston.Logger | undefined;

    if (
      BaseLogger.getSeverityLevel(options.logFileLevel) <= BaseLogger.LogLevelSeverities.Debug &&
      options.logPath
    ) {
      winstonForDebug = winston.createLogger({
        level: options.logFileLevel,
        transports: [
          BaseLogger.getDailyRotateTransport(
            ELogLevel.Debug,
            options.logPath,
            options.fileTransport
          ),
        ],
      });
    }

    const debugInstance = debug(namespace);

    debugInstance.log = (...args: unknown[]) => {
      if (winstonForDebug) {
        const res = args.map((v) => (typeof v === 'string' ? stripAnsi(v) : v));
        winstonForDebug.debug(util.format(...res).trim());
      }

      // eslint-disable-next-line no-console
      console.log(...args);
    };

    return debugInstance;
  }

  public readonly winston: winston.Logger;
  public readonly debugger: debug.Debugger;
  public readonly logLevel: ELogLevel;

  constructor(options = Config.global.logger) {
    this.winston = BaseLogger.buildLogger(options);
    this.debugger = BaseLogger.buildDebugger('app', options);
    this.logLevel = options.logConsoleLevel;
  }

  canLog(logLevel: ELogLevel) {
    return BaseLogger.getSeverityLevel(logLevel) >= BaseLogger.getSeverityLevel(this.logLevel);
  }

  getDebug(namespace: string) {
    return this.debugger.extend(namespace);
  }
}
