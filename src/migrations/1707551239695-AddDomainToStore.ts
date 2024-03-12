import { MigrationInterface, QueryRunner } from "typeorm"

export class AddDomainToStore1707551239695 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "store" ADD "domain" varchar UNIQUE`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "store" DROP COLUMN "domain"`
        );
    }
}
