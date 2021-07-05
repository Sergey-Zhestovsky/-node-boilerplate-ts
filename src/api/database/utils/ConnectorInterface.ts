import { IDataBaseConnector } from '../types';

class ConnectorInterface implements IDataBaseConnector<unknown, unknown> {
  private readonly config: Record<string, unknown>;
  public connection: unknown | null;
  public actions: Record<string, unknown>;

  constructor(config: Record<string, unknown>, actions: Record<string, unknown>) {
    this.config = config;
    this.connection = null;
    this.actions = actions;
  }

  isInitiated() {
    return this.connection !== null;
  }

  async isConnected() {
    if (!this.isInitiated()) return false;
    return true;
  }

  /**
   * Create connection instance for db.
   */
  async connect() {
    this.connection = {};
  }

  /**
   * Clear db. Also seeds it if needed.
   */
  async flushDatabase() {}

  /**
   *  Disconnect from db.
   */
  async disconnect() {}
}

export default ConnectorInterface;
