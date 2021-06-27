/* eslint-disable @typescript-eslint/no-explicit-any */

export interface IDataBaseConnector<T = any, R = any> {
  connection: T | null;
  actions: Record<string, R>;

  isConnected(): boolean;
  connect(): Promise<void>;
  flushDatabase(): Promise<void>;
  disconnect(): Promise<void>;
}
