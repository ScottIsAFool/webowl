import type { MigrationInterface, QueryRunner } from 'typeorm'

export class LeagueRoles1638453240536 implements MigrationInterface {
    name = 'LeagueRoles1638453240536'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE "league_role" ("id" SERIAL NOT NULL, "role" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" integer, "leagueId" integer, CONSTRAINT "PK_17e660d24fcf4938658a4b8055b" PRIMARY KEY ("id"))`,
        )
        await queryRunner.query(
            `ALTER TABLE "league_role" ADD CONSTRAINT "FK_c4da4da9928b4d97e914ebeb767" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        )
        await queryRunner.query(
            `ALTER TABLE "league_role" ADD CONSTRAINT "FK_25696626fc46a9c8d7a509ae256" FOREIGN KEY ("leagueId") REFERENCES "league"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "league_role" DROP CONSTRAINT "FK_25696626fc46a9c8d7a509ae256"`,
        )
        await queryRunner.query(
            `ALTER TABLE "league_role" DROP CONSTRAINT "FK_c4da4da9928b4d97e914ebeb767"`,
        )
        await queryRunner.query(`DROP TABLE "league_role"`)
    }
}
