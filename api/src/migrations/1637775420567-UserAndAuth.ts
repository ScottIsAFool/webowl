import type { MigrationInterface, QueryRunner } from 'typeorm'

export class UserAndAuth1637775420567 implements MigrationInterface {
    name = 'UserAndAuth1637775420567'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE "email_verification" ("emailAddress" character varying NOT NULL, "verificationCode" character varying NOT NULL, "userId" integer NOT NULL, CONSTRAINT "UQ_0df9e211122f289b5719438a562" UNIQUE ("emailAddress"), CONSTRAINT "PK_0df9e211122f289b5719438a562" PRIMARY KEY ("emailAddress"))`,
        )
        await queryRunner.query(
            `CREATE TABLE "password_reset" ("emailAddress" character varying NOT NULL, "resetCode" character varying NOT NULL, CONSTRAINT "UQ_0629be574a38c6e77853f050114" UNIQUE ("emailAddress"), CONSTRAINT "PK_0629be574a38c6e77853f050114" PRIMARY KEY ("emailAddress"))`,
        )
        await queryRunner.query(
            `CREATE TABLE "user" ("id" integer GENERATED BY DEFAULT AS IDENTITY NOT NULL, "emailAddress" character varying NOT NULL, "password" character varying, "firstName" character varying NOT NULL, "lastName" character varying NOT NULL, "created" TIMESTAMP NOT NULL DEFAULT now(), "updated" TIMESTAMP NOT NULL DEFAULT now(), "isVerified" boolean, "isFacebookAuth" boolean, "facebookId" character varying, "googleId" character varying, "isGoogleAuth" boolean, "googleAccessToken" character varying, "microsoftId" character varying, "microsoftAccessToken" character varying, "isMicrosoftAuth" boolean, CONSTRAINT "UQ_eea9ba2f6e1bb8cb89c4e672f62" UNIQUE ("emailAddress"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`,
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "user"`)
        await queryRunner.query(`DROP TABLE "password_reset"`)
        await queryRunner.query(`DROP TABLE "email_verification"`)
    }
}
