import type { MigrationInterface, QueryRunner } from 'typeorm'

export class Finished1638867892515 implements MigrationInterface {
    name = 'Finished1638867892515'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "season" ALTER COLUMN "finished" DROP NOT NULL`)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "season" ALTER COLUMN "finished" SET NOT NULL`)
    }
}
