import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

/**
 * PHASE 1: Variant Enhancements
 * Adds missing fields to product_variants for production-grade admin
 */
export class AddVariantEnhancements1734675100000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // SKU locking (prevents changes after publish)
        await queryRunner.addColumn(
            'product_variants',
            new TableColumn({
                name: 'sku_locked',
                type: 'boolean',
                default: false,
                isNullable: false,
            }),
        );

        // Color hex for color picker
        await queryRunner.addColumn(
            'product_variants',
            new TableColumn({
                name: 'color_hex',
                type: 'varchar',
                length: '7',
                isNullable: true,
                comment: 'Hex color code (e.g., #FF5733)',
            }),
        );

        // Price override (optional)
        await queryRunner.addColumn(
            'product_variants',
            new TableColumn({
                name: 'price_override',
                type: 'decimal',
                precision: 10,
                scale: 2,
                isNullable: true,
                comment: 'Optional price override',
            }),
        );

        // Weight for shipping calculations
        await queryRunner.addColumn(
            'product_variants',
            new TableColumn({
                name: 'weight',
                type: 'int',
                isNullable: true,
                comment: 'Weight in grams',
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn('product_variants', 'weight');
        await queryRunner.dropColumn('product_variants', 'price_override');
        await queryRunner.dropColumn('product_variants', 'color_hex');
        await queryRunner.dropColumn('product_variants', 'sku_locked');
    }
}
