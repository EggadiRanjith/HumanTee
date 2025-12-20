import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

/**
 * PHASE 1: HARD BLOCKERS
 * Adds critical fields for production-grade admin
 * 
 * CRITICAL: Optimistic locking + core product fields
 * - version (for concurrent edit protection)
 * - pricing fields (compare_at_price, cost_per_item, currency, taxable)
 * - inventory fields (track_inventory, sku, continue_selling, low_stock_threshold)
 * - SEO fields (meta_title, meta_description)
 * - organization fields (is_featured, product_type, category)
 * 
 * All fields are NULLABLE or have DEFAULTS for backwards compatibility
 */
export class AddProductionFields1734675000000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // ========================================================================
        // CRITICAL: VERSION FIELD (Optimistic Locking)
        // ========================================================================
        await queryRunner.addColumn(
            'products',
            new TableColumn({
                name: 'version',
                type: 'int',
                default: 1,
                isNullable: false,
            }),
        );

        // ========================================================================
        // PRICING FIELDS
        // ========================================================================
        await queryRunner.addColumn(
            'products',
            new TableColumn({
                name: 'compare_at_price',
                type: 'decimal',
                precision: 10,
                scale: 2,
                isNullable: true,
                comment: 'Original price for showing discounts',
            }),
        );

        await queryRunner.addColumn(
            'products',
            new TableColumn({
                name: 'cost_per_item',
                type: 'decimal',
                precision: 10,
                scale: 2,
                isNullable: true,
                comment: 'Cost for profit margin calculation',
            }),
        );

        await queryRunner.addColumn(
            'products',
            new TableColumn({
                name: 'currency',
                type: 'varchar',
                length: '3',
                default: "'INR'",
                isNullable: false,
            }),
        );

        await queryRunner.addColumn(
            'products',
            new TableColumn({
                name: 'taxable',
                type: 'boolean',
                default: true,
                isNullable: false,
            }),
        );

        // ========================================================================
        // INVENTORY FIELDS
        // ========================================================================
        await queryRunner.addColumn(
            'products',
            new TableColumn({
                name: 'track_inventory',
                type: 'boolean',
                default: true,
                isNullable: false,
            }),
        );

        await queryRunner.addColumn(
            'products',
            new TableColumn({
                name: 'sku',
                type: 'varchar',
                length: '100',
                isNullable: true,
                comment: 'SKU for non-variant products',
            }),
        );

        await queryRunner.addColumn(
            'products',
            new TableColumn({
                name: 'stock_quantity',
                type: 'int',
                default: 0,
                isNullable: false,
                comment: 'Stock for non-variant products',
            }),
        );

        await queryRunner.addColumn(
            'products',
            new TableColumn({
                name: 'continue_selling_when_out_of_stock',
                type: 'boolean',
                default: false,
                isNullable: false,
            }),
        );

        await queryRunner.addColumn(
            'products',
            new TableColumn({
                name: 'low_stock_threshold',
                type: 'int',
                isNullable: true,
                comment: 'Alert when stock falls below this',
            }),
        );

        // ========================================================================
        // SEO FIELDS
        // ========================================================================
        await queryRunner.addColumn(
            'products',
            new TableColumn({
                name: 'meta_title',
                type: 'varchar',
                length: '60',
                isNullable: true,
                comment: 'SEO meta title (max 60 chars)',
            }),
        );

        await queryRunner.addColumn(
            'products',
            new TableColumn({
                name: 'meta_description',
                type: 'varchar',
                length: '160',
                isNullable: true,
                comment: 'SEO meta description (max 160 chars)',
            }),
        );

        await queryRunner.addColumn(
            'products',
            new TableColumn({
                name: 'tags',
                type: 'text',
                isNullable: true,
                comment: 'Comma-separated tags for search',
            }),
        );

        // ========================================================================
        // ORGANIZATION FIELDS
        // ========================================================================
        await queryRunner.addColumn(
            'products',
            new TableColumn({
                name: 'is_featured',
                type: 'boolean',
                default: false,
                isNullable: false,
                comment: 'Show on homepage',
            }),
        );

        await queryRunner.addColumn(
            'products',
            new TableColumn({
                name: 'product_type',
                type: 'varchar',
                length: '50',
                default: "'T-Shirt'",
                isNullable: false,
                comment: 'T-Shirt, Hoodie, Shirt, etc.',
            }),
        );

        await queryRunner.addColumn(
            'products',
            new TableColumn({
                name: 'category',
                type: 'varchar',
                length: '50',
                default: "'Drop 1'",
                isNullable: false,
                comment: 'Drop 1-5',
            }),
        );

        await queryRunner.addColumn(
            'products',
            new TableColumn({
                name: 'collections',
                type: 'text',
                isNullable: true,
                comment: 'Comma-separated collection names',
            }),
        );

        // ========================================================================
        // CREATE INDEX ON VERSION (for optimistic locking queries)
        // ========================================================================
        await queryRunner.query(`
            CREATE INDEX "IDX_PRODUCTS_VERSION" ON "products" ("version")
        `);

        // ========================================================================
        // CREATE INDEX ON IS_FEATURED (for homepage queries)
        // ========================================================================
        await queryRunner.query(`
            CREATE INDEX "IDX_PRODUCTS_IS_FEATURED" ON "products" ("is_featured")
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Drop indexes
        await queryRunner.query(`DROP INDEX IF EXISTS "IDX_PRODUCTS_IS_FEATURED"`);
        await queryRunner.query(`DROP INDEX IF EXISTS "IDX_PRODUCTS_VERSION"`);

        // Drop columns in reverse order
        await queryRunner.dropColumn('products', 'collections');
        await queryRunner.dropColumn('products', 'category');
        await queryRunner.dropColumn('products', 'product_type');
        await queryRunner.dropColumn('products', 'is_featured');
        await queryRunner.dropColumn('products', 'tags');
        await queryRunner.dropColumn('products', 'meta_description');
        await queryRunner.dropColumn('products', 'meta_title');
        await queryRunner.dropColumn('products', 'low_stock_threshold');
        await queryRunner.dropColumn('products', 'continue_selling_when_out_of_stock');
        await queryRunner.dropColumn('products', 'stock_quantity');
        await queryRunner.dropColumn('products', 'sku');
        await queryRunner.dropColumn('products', 'track_inventory');
        await queryRunner.dropColumn('products', 'taxable');
        await queryRunner.dropColumn('products', 'currency');
        await queryRunner.dropColumn('products', 'cost_per_item');
        await queryRunner.dropColumn('products', 'compare_at_price');
        await queryRunner.dropColumn('products', 'version');
    }
}
