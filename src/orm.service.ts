/**
 * @module typeorm-better-sqlite3
 */
import { Connection, createConnection, Driver, EntitySchema, ObjectType, Repository } from 'typeorm';
import { BetterSqliteDriver } from './better-sqlite-driver';

/**
 * High level abstraction as ORM service around Typeorm better-sqlite3 driver.
 */
export class OrmService {

  private con: Connection;

  /**
   * Initialize connection and replace default SQLite driver (sqlite3) to better-sqlite3
   */
  async initConnection() {
    let con = await createConnection();
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
   * Exequite raw sql query and get list of objects with type T
   * @param query
   */
  getRaw<T>(query: string): Promise<T[]> {
    return this.con.query(query);
  }

  /**
   * Make DB WAL mode checkpoint - [link](https://github.com/JoshuaWise/better-sqlite3/blob/master/docs/api.md#checkpointdatabasename---this)
   */
  dbCheckpoint() {
    const db = (this.con.driver as BetterSqliteDriver).databaseConnection;
    if (db.checkpoint) {
      db.checkpoint();
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
