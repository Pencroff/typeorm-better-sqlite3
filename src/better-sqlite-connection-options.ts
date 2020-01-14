/**
 * @module typeorm-better-sqlite3
 */

import { BaseConnectionOptions } from 'typeorm/connection/BaseConnectionOptions';

export interface BetterSqliteOptions {
  memory?: boolean;
  readonly?: boolean;
  fileMustExist?: boolean;
  timeout?: number;
  verbose?: (message?: any, ...additionalArgs: any[]) => void;
}

/**
 * BetterSqlite-specific connection options.
 */
export interface BetterSqliteConnectionOptions extends BaseConnectionOptions {

  /**
   * Database type.
   */
  readonly type: 'sqlite';

  /**
   * Storage type or path to the storage.
   */
  readonly database: string;

  /**
   * Pragma directives
   */
  readonly pragma?: string[];

  /**
   * Log function
   */
  readonly customOptions?: BetterSqliteOptions;

}
