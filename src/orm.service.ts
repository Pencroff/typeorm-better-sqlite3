/**
 * @module typeorm-better-sqlite3
 */
import { Connection, Driver, EntitySchema, ObjectType, Repository } from 'typeorm';
import { BetterSqliteDriver } from './better-sqlite-driver';
import deprecated from 'deprecated-decorator';

/**
 * High level abstraction as ORM service around Typeorm better-sqlite3 driver.
 */
export class OrmService {

  private con: Connection;

  /**
   * Initialize connection and replace default SQLite driver (sqlite3) to better-sqlite3
   */
  async useConnection(con: Connection) {
    con = await this.updateDriver(con);
    this.con = con;
    return con;
  }

  /**
   * Get Typeorm repository by type
   * @param v
   */
  getRepo<T>(v: ObjectType<T> | EntitySchema<T> | string): Repository<T> {
    const repo = this.con.getRepository(v);
    return repo;
  }

  /**
   * [DEPRECATED] Execute raw sql query and get list of objects with type T
   * @param query
   */
  @deprecated('execute', '1.1.3')
  getRaw<T>(query: string): Promise<T[]> {
    return this.con.query(query);
  }

  /**
   * Execute raw sql query and get list of objects with type T
   * @param query
   */
  execute<T>(query: string): Promise<T[]> {
    return this.con.query(query);
  }

  /**
   * Make DB WAL mode checkpoint - [link](https://github.com/JoshuaWise/better-sqlite3/blob/master/docs/performance.md#checkpoint-starvation)
   */
  dbCheckpoint() {
    const db = (this.con.driver as BetterSqliteDriver).databaseConnection;
    if (db.pragma) {
      db.pragma('wal_checkpoint(RESTART)');
    }
  }

  private async updateDriver(con: Connection) {
    const originDriver = con.driver;
    const betterSqliteDriver = new BetterSqliteDriver(con);
    await betterSqliteDriver.customCreateDatabaseConnection();
    (con as any).driver = betterSqliteDriver as Driver;
    await originDriver.disconnect();
    return con;
  }
}
