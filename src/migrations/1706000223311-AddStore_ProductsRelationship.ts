import { MigrationInterface, QueryRunner, Table } from "typeorm"

export class AddStoreProductsRelationship1706000223311 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: 'store_products',
            columns: [
                {
                    name: 'store_id',
                    type: 'varchar',
                    isPrimary: true
                },
                {
                    name: 'product_id',
                    type: 'varchar',
                    isPrimary: true
                }
            ],
            foreignKeys: [
                {
                    columnNames: ['store_id'],
                    referencedTableName: 'store',
                    referencedColumnNames: ['id'],
                    onDelete: 'CASCADE'
                },
                {
                    columnNames: ['product_id'],
                    referencedTableName: 'product',
                    referencedColumnNames: ['id'],
                    onDelete: 'CASCADE'
                }
            ]
        }));
    }


    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('store_products');
    }

}
