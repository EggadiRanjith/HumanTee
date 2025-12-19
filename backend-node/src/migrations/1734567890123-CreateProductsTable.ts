import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

export class CreateProductsTable1734567890123 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // Create ENUM type for product status
        await queryRunner.query(`
      CREATE TYPE "product_status_enum" AS ENUM ('DRAFT', 'ACTIVE', 'ARCHIVED')
    `);

        // Create products table
        await queryRunner.createTable(
            new Table({
                name: 'products',
                columns: [
                    {
                        name: 'id',
                        type: 'uuid',
                        isPrimary: true,
                        generationStrategy: 'uuid',
                        default: 'uuid_generate_v4()',
                    },
                    {
                        name: 'title',
                        type: 'varchar',
                        length: '255',
                        isNullable: false,
                    },
                    {
                        name: 'slug',
                        type: 'varchar',
                        length: '255',
                        isUnique: true,
                        isNullable: false,
                    },
                    {
                        name: 'description',
                        type: 'text',
                        isNullable: true,
                    },
                    {
                        name: 'status',
                        type: 'product_status_enum',
                        default: "'DRAFT'",
                    },
                    {
                        name: 'created_at',
                        type: 'timestamp',
                        default: 'CURRENT_TIMESTAMP',
                    },
                    {
                        name: 'updated_at',
                        type: 'timestamp',
                        default: 'CURRENT_TIMESTAMP',
                    },
                ],
            }),
            true,
        );

        // Create index on slug for fast lookups
        await queryRunner.createIndex(
            'products',
            new TableIndex({
                name: 'IDX_PRODUCTS_SLUG',
                columnNames: ['slug'],
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Drop index
        await queryRunner.dropIndex('products', 'IDX_PRODUCTS_SLUG');

        // Drop table
        await queryRunner.dropTable('products');

        // FIX 2: Explicitly drop ENUM type to prevent orphaned types
        await queryRunner.query(`DROP TYPE IF EXISTS "product_status_enum"`);
    }
}
