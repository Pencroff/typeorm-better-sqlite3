/**
 * @module typeorm-better-sqlite3
 */

import { AbstractSqliteDriver } from 'typeorm/driver/sqlite-abstract/AbstractSqliteDriver';
import { BetterSqliteConnectionOptions } from './better-sqlite-connection-options';
import { ColumnType, Connection, QueryRunner } from 'typeorm';
import { DriverOptionNotSetError } from 'typeorm/error/DriverOptionNotSetError';
import { BetterSqliteQueryRunner } from './better-sqlite-query-runner';
import { PlatformTools } from 'typeorm/platform/PlatformTools';
import { DriverPackageNotInstalledError } from 'typeorm/error/DriverPackageNotInstalledError';

/**
 * Organizes communication with sqlite DBMS.
 */
export class BetterSqliteDriver extends AbstractSqliteDriver {

  // -------------------------------------------------------------------------
  // Public Properties
  // -------------------------------------------------------------------------

  /**
   * Connection options.
   */
  options: BetterSqliteConnectionOptions;

  /**
   * SQLite underlying library.
   */
  sqlite: any;

  /**
   * Default pragma statements for data consistency
   */
  private defaultPragma: string[] = [
    'cache_size = -4096',
    'journal_mode = WAL',
    'synchronous = NORMAL',
  ];

  // -------------------------------------------------------------------------
  // Constructor
  // -------------------------------------------------------------------------

  constructor(connection: Connection) {
    super(connection);

    this.connection = connection;
    this.options = connection.options as BetterSqliteConnectionOptions;
    this.database = this.options.database;

    // validate options to make sure everything is set
    if (!this.options.database) {
      throw new DriverOptionNotSetError('database');
    }

    // load sqlite package
    this.loadDependencies();
  }

  // -------------------------------------------------------------------------
  // Public Methods
  // -------------------------------------------------------------------------

  async customCreateDatabaseConnection() {
    this.databaseConnection = await this.createDatabaseConnection();
    this.databaseConnection['better-sqlite'] = true;
  }

  /**
   * Closes connection with database.
   */
  async disconnect(): Promise<void> {
    return new Promise<void>((ok, fail) => {
      this.queryRunner = undefined;
      this.databaseConnection.close();
      ok();
    });
  }

  /**
   * Creates a query runner used to execute database queries.
   */
  createQueryRunner(mode: 'master' | 'slave' = 'master'): QueryRunner {
    if (!this.queryRunner) {
      this.queryRunner = new BetterSqliteQueryRunner(this);
    }

    return this.queryRunner;
  }

  normalizeType(column: {
    type?: ColumnType, length?: number | string,
    precision?: number | null, scale?: number,
  }): string {
    if ((column.type as any) === Buffer) {
      return 'blob';
    }

    return super.normalizeType(column);
  }

  // -------------------------------------------------------------------------
  // Protected Methods
  // -------------------------------------------------------------------------

  /**
   * Creates connection with the database.
   */
  protected async createDatabaseConnection() {
    const { options, defaultPragma } = this;
    await this.createDatabaseDirectory(options.database);

    const dbCon: any = new this.sqlite(options.database, options.customOptions);

    if (options.pragma) {
      defaultPragma.push.apply(defaultPragma, options.pragma);
    }
    defaultPragma.forEach((cmd) => {
      dbCon.pragma(cmd);
    });

    process.on('exit', () => dbCon.close());
    process.on('SIGHUP', () => process.exit(128 + 1));
    process.on('SIGINT', () => process.exit(128 + 2));
    process.on('SIGTERM', () => process.exit(128 + 15));
    return dbCon;
  }

  /**
   * If driver dependency is not given explicitly, then try to load it via "require".
   */
  protected loadDependencies(): void {
    try {
      this.sqlite = PlatformTools.load('better-sqlite3');
    } catch (e) {
      throw new DriverPackageNotInstalledError('SQLite', 'better-sqlite3');
    }
  }

  /**
   * Auto creates database directory if it does not exist.
   */
  protected createDatabaseDirectory(fullPath: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const mkdirp = PlatformTools.load('mkdirp');
      const path = PlatformTools.load('path');
      mkdirp(path.dirname(fullPath), (err: any) => err ? reject(err) : resolve());
    });
  }

}
