require('colors');

const path = require('path');
const debug = require('debug');
const winston = require('winston');
const moment = require('moment');
const DailyRotateFile = require('winston-daily-rotate-file');

const loggerConfig = require('../config/logger.config');

class Logger {
  static get Info() {
    return {
      message: Symbol.for('message'),
      level: Symbol.for('level'),
    };
  }

  static assembleLogOutput(info, parseArgs = true, getTime = (timestamp) => timestamp) {
    const { timestamp, level, message, code, stack, ...args } = info;
    const ts = getTime(timestamp, info);
    let output = message;

    if (code) output += `\ncode: ${code}`;
    if (stack) output += `\n${stack}`;
    if (parseArgs && Object.keys(args).length) output += `\n ${JSON.stringify(args, null, 2)}`;

    return `[${level}] :: ${ts} :: ${output}`;
  }

  static getFormat(parseArgs = true) {
    const timeFormatter = (timestamp) => {
      return moment(timestamp).format('YYYY-MM-DD HH:mm:ss (Z)');
    };

    const printf = (info) => {
      const content = info[Logger.Info.message] ? info[Logger.Info.message] : info;
      return Logger.assembleLogOutput(content, parseArgs, timeFormatter);
    };

    return winston.format.combine(winston.format.timestamp(), winston.format.printf(printf));
  }

  static getFileTransport(logPath, level, config = loggerConfig.fileTransport) {
    return new DailyRotateFile({
      filename: path.join(logPath, level, `${level}-%DATE%.log`),
      level,
      format: Logger.getFormat(),
      ...config,
    });
  }

  static getDebugTransport(logPath) {
    return Logger.getFileTransport(logPath, 'debug');
  }

  static getInfoTransport(logPath) {
    return Logger.getFileTransport(logPath, 'info');
  }

  static getWarnTransport(logPath) {
    return Logger.getFileTransport(logPath, 'warn');
  }

  static getErrorTransport(logPath) {
    return Logger.getFileTransport(logPath, 'error');
  }

  static getConsoleTransport(parseArgs = true) {
    const timeFormatter = (timestamp) => {
      return moment(timestamp).format('MM.DD.YYYY, HH:mm:ss').cyan;
    };

    const printf = (info) => {
      const content = info[Logger.Info.message] ? info[Logger.Info.message] : info;
      return Logger.assembleLogOutput(content, parseArgs, timeFormatter);
    };

    return new winston.transports.Console({
      format: winston.format.combine(
        winston.format.printf(printf),
        winston.format.colorize({ all: true })
      ),
    });
  }

  static buildLogger({ logPath, parseArgs = true, logInConsole = true } = {}) {
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
      format: winston.format.printf((info) => info),
      transports,
    });
  }

  constructor(logPath = loggerConfig.logPath) {
    this.winston = Logger.buildLogger({ logPath });
    this.debug = debug('app');
  }

  get middlewareOutput() {
    return 'PATH::url [:method] :: status::status :: size::res[content-length] :: :response-time ms';
  }

  getDebug(namespace) {
    return this.debug.extend(namespace);
  }

  stream() {
    return {
      write: (message, encoding) => {
        this.info(message.replace(/\n/g, ''));
      },
    };
  }

  log(level, message, ...args) {
    this.winston.log(level, message, ...args);
  }

  error(message, ...args) {
    this.winston.error(message, ...args);
  }

  warn(message, ...args) {
    this.winston.warn(message, ...args);
  }

  info(message, ...args) {
    this.winston.info(message, ...args);
  }
}

module.exports = new Logger();
