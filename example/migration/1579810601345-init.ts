import {MigrationInterface, QueryRunner} from "typeorm";

export class init1579810601345 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TABLE "User" ("id" text PRIMARY KEY NOT NULL, "name" text NOT NULL, "age" numeric NOT NULL)`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`DROP TABLE "User"`, undefined);
    }

}
