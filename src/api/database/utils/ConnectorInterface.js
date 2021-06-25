class ConnectorInterface {
  constructor(config) {
    this.config = config;
    this.connection = null;
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

module.exports = ConnectorInterface;
