import type { MigrationInterface, QueryRunner } from 'typeorm'

export class UserChanges1638276615167 implements MigrationInterface {
    name = 'UserChanges1638276615167'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "googleAccessToken"`)
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "microsoftAccessToken"`)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "microsoftAccessToken" character varying`)
        await queryRunner.query(`ALTER TABLE "user" ADD "googleAccessToken" character varying`)
    }
}
