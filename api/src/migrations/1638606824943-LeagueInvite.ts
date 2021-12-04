import type { MigrationInterface, QueryRunner } from 'typeorm'

export class LeagueInvite1638606824943 implements MigrationInterface {
    name = 'LeagueInvite1638606824943'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE "league_invite" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "inviteCode" character varying NOT NULL, "inviteEmail" character varying NOT NULL, "inviteeId" integer, "leagueId" integer, CONSTRAINT "PK_53612f35c540415e0659cdc7236" PRIMARY KEY ("id"))`,
        )
        await queryRunner.query(
            `ALTER TABLE "league_invite" ADD CONSTRAINT "FK_8f484cb5383a510166d113523b3" FOREIGN KEY ("inviteeId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        )
        await queryRunner.query(
            `ALTER TABLE "league_invite" ADD CONSTRAINT "FK_096e8659065d44a57d7b12434d6" FOREIGN KEY ("leagueId") REFERENCES "league"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "league_invite" DROP CONSTRAINT "FK_096e8659065d44a57d7b12434d6"`,
        )
        await queryRunner.query(
            `ALTER TABLE "league_invite" DROP CONSTRAINT "FK_8f484cb5383a510166d113523b3"`,
        )
        await queryRunner.query(`DROP TABLE "league_invite"`)
    }
}
