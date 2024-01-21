import { MigrationInterface, QueryRunner } from "typeorm"

export class OrderChanged1704951362169 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order" ADD "store_id" character varying`);
        await queryRunner.query(`CREATE INDEX "OrderStoreId" ON "order" ("store_id")`);
      }
    
      public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."OrderStoreId"`);
        await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "store_id"`);
      }
}
