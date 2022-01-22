import { QueryInterface, Sequelize } from 'sequelize';
import { SequelizeStorage, Umzug } from 'umzug';

import { ConnectionInterface } from './utils/ConnectionInterface';
import { ISequelizeOptions, TActionBuilder, TActionList, TModelBuilder, TModelList } from './types';

export class PostgresConnectionInterface<
  M extends TModelList = TModelList,
  A extends TActionList<M> = TActionList<M>
> extends ConnectionInterface<ISequelizeOptions, Sequelize, M, A> {
  private static retrieveEntities<T extends object, R extends unknown[]>(
    data: ((...args: R) => T) | T,
    ...args: R
  ): T {
    if (typeof data === 'function') {
      return data(...args);
    }

    return data;
  }

  private readonly umzug: Umzug<QueryInterface>;

  constructor(
    options: ISequelizeOptions,
    models: TModelBuilder<M>,
    actions: TActionBuilder<M, A>,
    pathToMigrations: string
  ) {
    const sequelize = new Sequelize(options.url, options);
    const modelList = PostgresConnectionInterface.retrieveEntities(models, sequelize);

    super(
      options,
      sequelize,
      modelList,
      PostgresConnectionInterface.retrieveEntities(actions, sequelize, modelList)
    );

    this.umzug = new Umzug({
      migrations: { glob: pathToMigrations },
      context: this.connection.getQueryInterface(),
      storage: new SequelizeStorage({ sequelize: this.connection }),
      logger: undefined,
    });
  }

  async isConnected() {
    try {
      await this.connection.authenticate();
      return true;
    } catch {
      return false;
    }
  }

  async connect() {
    await this.connection.authenticate();
  }

  async migrateUp() {
    return this.umzug.up();
  }

  async migrateDown() {
    return this.umzug.down({ to: 0 });
  }

  async flushDatabase() {
    await this.migrateDown();
    await this.migrateUp();
  }

  async disconnect() {
    return this.connection.close();
  }
}
