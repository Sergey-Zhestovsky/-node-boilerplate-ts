import 'colors';

import path from 'path';
import debug from 'debug';
import winston, { Logform } from 'winston';
import moment, { Moment } from 'moment';
import DailyRotateFile from 'winston-daily-rotate-file';

import loggerConfig from '../config/logger.config';

export interface ILoggerInfo extends Logform.TransformableInfo {
  code?: string;
  stack?: string;
  timestamp: string;
}

export type TFileTransportConfig = Omit<
  DailyRotateFile.GeneralDailyRotateFileTransportOptions,
  'stream'
>;

class Logger {
  static get Info() {
    return {
      message: Symbol.for('message'),
      level: Symbol.for('level'),
    };
  }

  static assembleLogOutput(
    info: ILoggerInfo,
    parseArgs = true,
    getTime = (timestamp: string, logInfo: ILoggerInfo): string => timestamp
  ) {
    const { timestamp, level, message, code, stack, ...args } = info;
    const ts = getTime(timestamp, info);
    let output = message;

    if (code) output += `\ncode: ${code}`;
    if (stack) output += `\n${stack}`;
    if (parseArgs && Object.keys(args).length) output += `\n ${JSON.stringify(args, null, 2)}`;

    return `[${level}] :: ${ts} :: ${output}`;
  }

  static getFormat(parseArgs = true) {
    const timeFormatter = (timestamp: string | Date | Moment) => {
      return moment(timestamp).format('YYYY-MM-DD HH:mm:ss (Z)');
    };

    const printf = (info: Logform.TransformableInfo) => {
      const content = info[Logger.Info.message as unknown as string]
        ? info[Logger.Info.message as unknown as string]
        : info;

      return Logger.assembleLogOutput(content, parseArgs, timeFormatter);
    };

    return winston.format.combine(winston.format.timestamp(), winston.format.printf(printf));
  }

  static getFileTransport(
    logPath: string,
    level: string,
    config: TFileTransportConfig = loggerConfig.fileTransport
  ) {
    return new DailyRotateFile({
      level: level,
      format: Logger.getFormat(),
      ...config,
      filename: path.join(logPath, level, `${level}-%DATE%.log`),
    });
  }

  static getDebugTransport(logPath: string) {
    return Logger.getFileTransport(logPath, 'debug');
  }

  static getInfoTransport(logPath: string) {
    return Logger.getFileTransport(logPath, 'info');
  }

  static getWarnTransport(logPath: string) {
    return Logger.getFileTransport(logPath, 'warn');
  }

  static getErrorTransport(logPath: string) {
    return Logger.getFileTransport(logPath, 'error');
  }

  static getConsoleTransport(parseArgs = true) {
    const timeFormatter = (timestamp: string | Date | Moment) => {
      return moment(timestamp).format('MM.DD.YYYY, HH:mm:ss').cyan;
    };

    const printf = (info: Logform.TransformableInfo) => {
      const content = info[Logger.Info.message as unknown as string]
        ? info[Logger.Info.message as unknown as string]
        : info;

      return Logger.assembleLogOutput(content, parseArgs, timeFormatter);
    };

    return new winston.transports.Console({
      format: winston.format.combine(
        winston.format.printf(printf),
        winston.format.colorize({ all: true })
      ),
    });
  }

  static buildLogger(logPath: string, logInConsole = true) {
    const transports = [];

    if (logPath) {
      transports.push(Logger.getDebugTransport(logPath));
      transports.push(Logger.getInfoTransport(logPath));
      transports.push(Logger.getWarnTransport(logPath));
      transports.push(Logger.getErrorTransport(logPath));
    }

    if (logInConsole && !loggerConfig.console.blackListModes.includes(process.env.NODE_ENV)) {
      transports.push(Logger.getConsoleTransport());
    }

    return winston.createLogger({
      format: winston.format.printf((info) => info as unknown as string),
      transports,
    });
  }

  private readonly winston: winston.Logger;
  private readonly debug: debug.Debugger;

  constructor(logPath = loggerConfig.logPath) {
    this.winston = Logger.buildLogger(logPath);
    this.debug = debug('app');
  }

  get middlewareOutput() {
    return 'PATH::url [:method] :: status::status :: size::res[content-length] :: :response-time ms';
  }

  getDebug(namespace: string) {
    return this.debug.extend(namespace);
  }

  stream() {
    return {
      write: (message: string, encoding?: string) => {
        this.info(message.replace(/\n/g, ''));
      },
    };
  }

  log(level: string, message: string, ...args: any[]) {
    this.winston.log(level, message, ...args);
  }

  error(message: string | Error, ...args: any[]) {
    this.winston.error(message as string, ...args);
  }

  warn(message: string, ...args: any[]) {
    this.winston.warn(message, ...args);
  }

  info(message: string, ...args: any[]) {
    this.winston.info(message, ...args);
  }
}

export default new Logger();
