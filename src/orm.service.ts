/**
 * @module typeorm-better-sqlite3
 */
import { Connection, createConnection, Driver, EntitySchema, ObjectType, Repository } from 'typeorm';
import { BetterSqliteDriver } from './better-sqlite-driver';

export class OrmService {

  private con: Connection;

  async initConnection() {
    let con = await createConnection();
    con = await this.updateDriver(con);
    this.con = con;
    return con;
  }

  getRepo<T>(v: ObjectType<T> | EntitySchema<T> | string): Repository<T> {
    const repo = this.con.getRepository(v);
    return repo;
  }

  getRaw<T>(query: string): Promise<T[]> {
    return this.con.query(query);
  }

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
