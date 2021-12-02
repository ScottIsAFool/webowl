import type { MigrationInterface, QueryRunner } from 'typeorm'

export class MaxPlayersPerTeam1638433387441 implements MigrationInterface {
    name = 'MaxPlayersPerTeam1638433387441'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "league" ADD "maxPlayersPerTeam" integer NOT NULL DEFAULT '8'`,
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "league" DROP COLUMN "maxPlayersPerTeam"`)
    }
}
