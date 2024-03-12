import { MigrationInterface, QueryRunner } from "typeorm"

export class AddOrderParentChildRelationship1704951460729 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
          `ALTER TABLE "order" ADD "order_parent_id" character varying`
        );
        await queryRunner.query(
          `ALTER TABLE "order" ADD CONSTRAINT "FK_ParentOrder" FOREIGN KEY ("order_parent_id") REFERENCES "order"("id") ON DELETE CASCADE ON UPDATE CASCADE`
        );
        await queryRunner.query(
          `CREATE INDEX "OrderParentId" ON "order" ("order_parent_id")`
        );
      }
    
      public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
          `ALTER TABLE "order" DROP CONSTRAINT "FK_ParentOrder"`
        );
        await queryRunner.query(`DROP INDEX "public"."OrderParentId"`);
        await queryRunner.query(
          `ALTER TABLE "order" DROP COLUMN "order_parent_id"`
        );
      }

}
