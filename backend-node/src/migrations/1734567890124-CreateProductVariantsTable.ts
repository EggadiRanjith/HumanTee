import {
    MigrationInterface,
    QueryRunner,
    Table,
    TableIndex,
    TableForeignKey,
} from 'typeorm';

export class CreateProductVariantsTable1734567890124
    implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // Create product_variants table
        await queryRunner.createTable(
            new Table({
                name: 'product_variants',
                columns: [
                    {
                        name: 'id',
                        type: 'uuid',
                        isPrimary: true,
                        generationStrategy: 'uuid',
                        default: 'uuid_generate_v4()',
                    },
                    {
                        name: 'product_id',
                        type: 'uuid',
                        isNullable: false,
                    },
                    {
                        name: 'sku',
                        type: 'varchar',
                        length: '100',
                        isUnique: true,
                        isNullable: false,
                    },
                    {
                        name: 'size',
                        type: 'varchar',
                        length: '50',
                        isNullable: false,
                    },
                    {
                        name: 'color',
                        type: 'varchar',
                        length: '50',
                        isNullable: true,
                    },
                    {
                        name: 'price',
                        type: 'decimal',
                        precision: 10,
                        scale: 2,
                        isNullable: false,
                    },
                    {
                        name: 'stock_quantity',
                        type: 'int',
                        default: 0,
                    },
                    {
                        name: 'is_active',
                        type: 'boolean',
                        default: true,
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

        // Create index on product_id for fast joins
        await queryRunner.createIndex(
            'product_variants',
            new TableIndex({
                name: 'IDX_PRODUCT_VARIANTS_PRODUCT_ID',
                columnNames: ['product_id'],
            }),
        );

        // Create index on SKU for fast lookups
        await queryRunner.createIndex(
            'product_variants',
            new TableIndex({
                name: 'IDX_PRODUCT_VARIANTS_SKU',
                columnNames: ['sku'],
            }),
        );

        // Create foreign key with CASCADE delete
        await queryRunner.createForeignKey(
            'product_variants',
            new TableForeignKey({
                columnNames: ['product_id'],
                referencedColumnNames: ['id'],
                referencedTableName: 'products',
                onDelete: 'CASCADE',
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Get table to find foreign key
        const table = await queryRunner.getTable('product_variants');

        if (table) {
            const foreignKey = table.foreignKeys.find(
                (fk) => fk.columnNames.indexOf('product_id') !== -1,
            );

            // Drop foreign key
            if (foreignKey) {
                await queryRunner.dropForeignKey('product_variants', foreignKey);
            }
        }

        // Drop indexes
        await queryRunner.dropIndex('product_variants', 'IDX_PRODUCT_VARIANTS_SKU');
        await queryRunner.dropIndex(
            'product_variants',
            'IDX_PRODUCT_VARIANTS_PRODUCT_ID',
        );

        // Drop table
        await queryRunner.dropTable('product_variants');
    }
}
