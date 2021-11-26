import type { MigrationInterface, QueryRunner } from 'typeorm'

export class AccessToken1637963694715 implements MigrationInterface {
    name = 'AccessToken1637963694715'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE "access_token" ("id" SERIAL NOT NULL, "userId" integer NOT NULL, "accessToken" character varying NOT NULL, "refreshToken" character varying NOT NULL, "expiresAt" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_f20f028607b2603deabd8182d12" PRIMARY KEY ("id"))`,
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "access_token"`)
    }
}
