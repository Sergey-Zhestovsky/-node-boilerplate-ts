import DailyRotateFile from 'winston-daily-rotate-file';
import { TNodeEnv } from '../config';

export enum ELogLevel {
  Debug = 'debug',
  Info = 'info',
  Warn = 'warn',
  Error = 'error',
}

export type TFileTransportOptions = Omit<
  DailyRotateFile.GeneralDailyRotateFileTransportOptions,
  'stream' | 'format' | 'filename' | 'level'
>;

export type TLogEntryType = string | number | boolean | object | Error;

export interface ILogEntry {
  level: ELogLevel;
  message: string;
  stack?: string;
}

export interface ILoggerOptions {
  logPath?: string;
  logFileLevel: ELogLevel;
  logConsoleLevel: ELogLevel;
  console: {
    blackListModes: TNodeEnv[];
  };
  fileTransport?: TFileTransportOptions;
}
