import type { MigrationInterface, QueryRunner } from 'typeorm'

export class League1638225561160 implements MigrationInterface {
    name = 'League1638225561160'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE "league" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "localAssociation" character varying, "sanctionNumber" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "teamNumbers" integer NOT NULL, "seriesGames" integer NOT NULL, "playersPerTeam" integer NOT NULL, "handicap" boolean NOT NULL, "scratch" boolean NOT NULL, "createdById" integer, CONSTRAINT "PK_0bd74b698f9e28875df738f7864" PRIMARY KEY ("id"))`,
        )
        await queryRunner.query(`ALTER TABLE "user" ADD "defaultLeagueId" integer`)
        await queryRunner.query(
            `ALTER TABLE "league" ADD CONSTRAINT "FK_74cd84ace2b446384717151fe53" FOREIGN KEY ("createdById") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "league" DROP CONSTRAINT "FK_74cd84ace2b446384717151fe53"`,
        )
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "defaultLeagueId"`)
        await queryRunner.query(`DROP TABLE "league"`)
    }
}
