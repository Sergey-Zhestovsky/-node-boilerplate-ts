import DailyRotateFile from 'winston-daily-rotate-file';

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
