import type { MigrationInterface, QueryRunner } from 'typeorm'

export class ResetCode1637950061213 implements MigrationInterface {
    name = 'ResetCode1637950061213'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "password_reset" DROP COLUMN "resetCode"`)
        await queryRunner.query(
            `ALTER TABLE "password_reset" ADD "code" character varying NOT NULL`,
        )
        await queryRunner.query(
            `ALTER TABLE "email_verification" ADD CONSTRAINT "UQ_0df9e211122f289b5719438a562" UNIQUE ("emailAddress")`,
        )
        await queryRunner.query(
            `ALTER TABLE "password_reset" ADD CONSTRAINT "UQ_0629be574a38c6e77853f050114" UNIQUE ("emailAddress")`,
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "password_reset" DROP CONSTRAINT "UQ_0629be574a38c6e77853f050114"`,
        )
        await queryRunner.query(
            `ALTER TABLE "email_verification" DROP CONSTRAINT "UQ_0df9e211122f289b5719438a562"`,
        )
        await queryRunner.query(`ALTER TABLE "password_reset" DROP COLUMN "code"`)
        await queryRunner.query(
            `ALTER TABLE "password_reset" ADD "resetCode" character varying NOT NULL`,
        )
    }
}
