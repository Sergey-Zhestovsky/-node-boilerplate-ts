export abstract class ConnectionInterface<
  O,
  C,
  M extends Record<string, unknown>,
  A extends Record<string, unknown>
> {
  constructor(
    public readonly options: O,
    public readonly connection: C,
    public readonly models: M,
    public readonly actions: A
  ) {}

  abstract isConnected(): MaybePromise<boolean>;

  /**
   * Create connection instance for db.
   */
  abstract connect(): Promise<void>;

  /**
   * Clear db. Also seeds it if needed.
   */
  abstract flushDatabase(): Promise<void>;

  /**
   *  Disconnect from db.
   */
  abstract disconnect(): Promise<void>;
}
