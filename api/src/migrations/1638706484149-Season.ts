import type { MigrationInterface, QueryRunner } from 'typeorm'

export class Season1638706484149 implements MigrationInterface {
    name = 'Season1638706484149'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE "season" ("id" SERIAL NOT NULL, "name" character varying, "rounds" integer NOT NULL, "frequency" integer NOT NULL, "time" character varying NOT NULL, "startDate" TIMESTAMP WITH TIME ZONE NOT NULL, "teamNumbers" integer NOT NULL, "roundsPerDate" integer NOT NULL DEFAULT '1', "startLane" integer NOT NULL, "finished" boolean NOT NULL DEFAULT false, "leagueId" integer, CONSTRAINT "PK_8ac0d081dbdb7ab02d166bcda9f" PRIMARY KEY ("id"))`,
        )
        await queryRunner.query(
            `ALTER TABLE "season" ADD CONSTRAINT "FK_35d66d938909b5d6a089f03d8d8" FOREIGN KEY ("leagueId") REFERENCES "league"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "season" DROP CONSTRAINT "FK_35d66d938909b5d6a089f03d8d8"`,
        )
        await queryRunner.query(`DROP TABLE "season"`)
    }
}
