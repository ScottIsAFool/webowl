import type { MigrationInterface, QueryRunner } from 'typeorm'

export class StandingRules1638813432520 implements MigrationInterface {
    name = 'StandingRules1638813432520'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "season" ADD "handicapStandingRule1" character varying NOT NULL DEFAULT 'points-scored'`,
        )
        await queryRunner.query(
            `ALTER TABLE "season" ADD "handicapStandingRule2" character varying NOT NULL DEFAULT 'percentage-wins'`,
        )
        await queryRunner.query(
            `ALTER TABLE "season" ADD "handicapStandingRule3" character varying NOT NULL DEFAULT 'scratch-pinfall'`,
        )
        await queryRunner.query(
            `ALTER TABLE "season" ADD "scratchStandingRule1" character varying NOT NULL DEFAULT 'points-scored'`,
        )
        await queryRunner.query(
            `ALTER TABLE "season" ADD "scratchStandingRule2" character varying NOT NULL DEFAULT 'percentage-wins'`,
        )
        await queryRunner.query(
            `ALTER TABLE "season" ADD "scratchStandingRule3" character varying NOT NULL DEFAULT 'scratch-pinfall'`,
        )
        await queryRunner.query(`ALTER TABLE "season" ADD "handicapPointsPerGame" integer NOT NULL`)
        await queryRunner.query(`ALTER TABLE "season" ADD "scratchPointsPerGame" integer NOT NULL`)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "season" DROP COLUMN "scratchPointsPerGame"`)
        await queryRunner.query(`ALTER TABLE "season" DROP COLUMN "handicapPointsPerGame"`)
        await queryRunner.query(`ALTER TABLE "season" DROP COLUMN "scratchStandingRule3"`)
        await queryRunner.query(`ALTER TABLE "season" DROP COLUMN "scratchStandingRule2"`)
        await queryRunner.query(`ALTER TABLE "season" DROP COLUMN "scratchStandingRule1"`)
        await queryRunner.query(`ALTER TABLE "season" DROP COLUMN "handicapStandingRule3"`)
        await queryRunner.query(`ALTER TABLE "season" DROP COLUMN "handicapStandingRule2"`)
        await queryRunner.query(`ALTER TABLE "season" DROP COLUMN "handicapStandingRule1"`)
    }
}
