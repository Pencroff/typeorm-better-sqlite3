/**
 * @module typeorm-better-sqlite3
 */

import { AbstractSqliteQueryRunner } from 'typeorm/driver/sqlite-abstract/AbstractSqliteQueryRunner';
import { BetterSqliteDriver } from './better-sqlite-driver';
import { Broadcaster } from 'typeorm/subscriber/Broadcaster';
import { QueryRunnerAlreadyReleasedError } from 'typeorm/error/QueryRunnerAlreadyReleasedError';
import { QueryFailedError } from 'typeorm';

/**
 * Runs queries on a single sqlite database connection.
 *
 * Does not support compose primary keys with autoincrement field.
 * todo: need to throw exception for this case.
 */

export class BetterSqliteQueryRunner extends AbstractSqliteQueryRunner {

  /**
   * Database driver used by connection.
   */
  driver: BetterSqliteDriver;

  // -------------------------------------------------------------------------
  // Constructor
  // -------------------------------------------------------------------------

  constructor(driver: BetterSqliteDriver) {
    super();
    this.driver = driver;
    this.connection = driver.connection;
    this.broadcaster = new Broadcaster(this);
  }

  /**
   * Executes a given SQL query.
   */
  query(query: string, parameters?: any[]): Promise<any> {
    if (this.isReleased) {
      throw new QueryRunnerAlreadyReleasedError();
    }

    const connection = this.driver.connection;

    return new Promise<any[]>(async (ok, fail) => {
      const databaseConnection = await this.connect();
      this.driver.connection.logger.logQuery(query, parameters, this);
      const queryStartTime = +new Date();
      let result;
      let isRunStatement;
      try {
        const statement = databaseConnection.prepare(query);
        isRunStatement = !statement.reader;
        const method = isRunStatement ? 'run' : 'all';
        if (parameters) {
          result = statement[method](parameters);
        } else {
          result = statement[method]();
        }
      } catch (err) {
        connection.logger.logQueryError(err, query, parameters, this);
        fail(new QueryFailedError(query, parameters, err));
      }
      const maxQueryExecutionTime = connection.options.maxQueryExecutionTime;
      const queryEndTime = +new Date();
      const queryExecutionTime = queryEndTime - queryStartTime;
      if (maxQueryExecutionTime && queryExecutionTime > maxQueryExecutionTime) {
        connection.logger.logQuerySlow(queryExecutionTime, query, parameters, this);
      }
      ok(isRunStatement && result ? result.lastInsertRowid : result);
    });
  }
}
