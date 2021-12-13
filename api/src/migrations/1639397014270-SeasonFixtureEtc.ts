import type { MigrationInterface, QueryRunner } from 'typeorm'

export class SeasonFixtureEtc1639397014270 implements MigrationInterface {
    name = 'SeasonFixtureEtc1639397014270'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE "player" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "isFloatingSub" boolean NOT NULL, "gender" character varying NOT NULL, "ageType" character varying NOT NULL, "dob" TIMESTAMP WITH TIME ZONE, "teamId" integer, CONSTRAINT "PK_65edadc946a7faf4b638d5e8885" PRIMARY KEY ("id"))`,
        )
        await queryRunner.query(
            `CREATE TABLE "team" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "isBYETeam" boolean NOT NULL, CONSTRAINT "PK_f57d8293406df4af348402e4b74" PRIMARY KEY ("id"))`,
        )
        await queryRunner.query(
            `CREATE TABLE "round" ("id" SERIAL NOT NULL, "date" TIMESTAMP WITH TIME ZONE NOT NULL, "isEmpty" boolean NOT NULL, "emptyReason" character varying, "seasonId" integer, CONSTRAINT "PK_34bd959f3f4a90eb86e4ae24d2d" PRIMARY KEY ("id"))`,
        )
        await queryRunner.query(
            `CREATE TABLE "fixture" ("id" SERIAL NOT NULL, "startLane" integer NOT NULL, "roundId" integer, CONSTRAINT "PK_d9634ba06480dc240af97ad548c" PRIMARY KEY ("id"))`,
        )
        await queryRunner.query(
            `CREATE TABLE "season_teams_team" ("seasonId" integer NOT NULL, "teamId" integer NOT NULL, CONSTRAINT "PK_5d825b2517240a448d655524b3e" PRIMARY KEY ("seasonId", "teamId"))`,
        )
        await queryRunner.query(
            `CREATE INDEX "IDX_9cacb8573dd3420d358ac90fa9" ON "season_teams_team" ("seasonId") `,
        )
        await queryRunner.query(
            `CREATE INDEX "IDX_4333ab741eb1a4fb5e1a2c2a1a" ON "season_teams_team" ("teamId") `,
        )
        await queryRunner.query(
            `CREATE TABLE "fixture_teams_team" ("fixtureId" integer NOT NULL, "teamId" integer NOT NULL, CONSTRAINT "PK_63aa692bbe43097c8769a36854b" PRIMARY KEY ("fixtureId", "teamId"))`,
        )
        await queryRunner.query(
            `CREATE INDEX "IDX_a1fae14d2deb4d0126d513f423" ON "fixture_teams_team" ("fixtureId") `,
        )
        await queryRunner.query(
            `CREATE INDEX "IDX_c85184de815a892a8be880ed4f" ON "fixture_teams_team" ("teamId") `,
        )
        await queryRunner.query(
            `ALTER TABLE "player" ADD CONSTRAINT "FK_e85150e7e8a80bee7f2be3adab0" FOREIGN KEY ("teamId") REFERENCES "team"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        )
        await queryRunner.query(
            `ALTER TABLE "round" ADD CONSTRAINT "FK_29f76a05056c99fceb49477724a" FOREIGN KEY ("seasonId") REFERENCES "season"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
        )
        await queryRunner.query(
            `ALTER TABLE "fixture" ADD CONSTRAINT "FK_aade9c813b1249e054c636b03d4" FOREIGN KEY ("roundId") REFERENCES "round"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
        )
        await queryRunner.query(
            `ALTER TABLE "season_teams_team" ADD CONSTRAINT "FK_9cacb8573dd3420d358ac90fa98" FOREIGN KEY ("seasonId") REFERENCES "season"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
        )
        await queryRunner.query(
            `ALTER TABLE "season_teams_team" ADD CONSTRAINT "FK_4333ab741eb1a4fb5e1a2c2a1a0" FOREIGN KEY ("teamId") REFERENCES "team"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        )
        await queryRunner.query(
            `ALTER TABLE "fixture_teams_team" ADD CONSTRAINT "FK_a1fae14d2deb4d0126d513f4236" FOREIGN KEY ("fixtureId") REFERENCES "fixture"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
        )
        await queryRunner.query(
            `ALTER TABLE "fixture_teams_team" ADD CONSTRAINT "FK_c85184de815a892a8be880ed4f2" FOREIGN KEY ("teamId") REFERENCES "team"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "fixture_teams_team" DROP CONSTRAINT "FK_c85184de815a892a8be880ed4f2"`,
        )
        await queryRunner.query(
            `ALTER TABLE "fixture_teams_team" DROP CONSTRAINT "FK_a1fae14d2deb4d0126d513f4236"`,
        )
        await queryRunner.query(
            `ALTER TABLE "season_teams_team" DROP CONSTRAINT "FK_4333ab741eb1a4fb5e1a2c2a1a0"`,
        )
        await queryRunner.query(
            `ALTER TABLE "season_teams_team" DROP CONSTRAINT "FK_9cacb8573dd3420d358ac90fa98"`,
        )
        await queryRunner.query(
            `ALTER TABLE "fixture" DROP CONSTRAINT "FK_aade9c813b1249e054c636b03d4"`,
        )
        await queryRunner.query(
            `ALTER TABLE "round" DROP CONSTRAINT "FK_29f76a05056c99fceb49477724a"`,
        )
        await queryRunner.query(
            `ALTER TABLE "player" DROP CONSTRAINT "FK_e85150e7e8a80bee7f2be3adab0"`,
        )
        await queryRunner.query(`DROP INDEX "public"."IDX_c85184de815a892a8be880ed4f"`)
        await queryRunner.query(`DROP INDEX "public"."IDX_a1fae14d2deb4d0126d513f423"`)
        await queryRunner.query(`DROP TABLE "fixture_teams_team"`)
        await queryRunner.query(`DROP INDEX "public"."IDX_4333ab741eb1a4fb5e1a2c2a1a"`)
        await queryRunner.query(`DROP INDEX "public"."IDX_9cacb8573dd3420d358ac90fa9"`)
        await queryRunner.query(`DROP TABLE "season_teams_team"`)
        await queryRunner.query(`DROP TABLE "fixture"`)
        await queryRunner.query(`DROP TABLE "round"`)
        await queryRunner.query(`DROP TABLE "team"`)
        await queryRunner.query(`DROP TABLE "player"`)
    }
}
