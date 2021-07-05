export interface IDataBaseConnector<T, R = Record<string, object>> {
  connection: T | null;
  actions: R;

  isInitiated(): boolean;
  isConnected(): Promise<boolean> | boolean;
  connect(): Promise<void>;
  flushDatabase(): Promise<void>;
  disconnect(): Promise<void>;
}
