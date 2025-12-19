import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateCartItemsForVariants1734567890125 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // 1. Add variant_label column
        await queryRunner.query(`
            ALTER TABLE cart_items 
            ADD COLUMN variant_label TEXT
        `);

        // 2. Migrate size → variant_label (if data exists)
        await queryRunner.query(`
            UPDATE cart_items 
            SET variant_label = size 
            WHERE size IS NOT NULL
        `);

        // 3. Change product_id to uuid type (if not already)
        await queryRunner.query(`
            ALTER TABLE cart_items 
            ALTER COLUMN product_id TYPE uuid USING product_id::uuid
        `);

        // 4. Change variant_id to uuid type (if not already)
        await queryRunner.query(`
            ALTER TABLE cart_items 
            ALTER COLUMN variant_id TYPE uuid USING variant_id::uuid
        `);

        // 5. Add FK constraint for product_id with ON DELETE SET NULL
        await queryRunner.query(`
            ALTER TABLE cart_items 
            ADD CONSTRAINT fk_cart_items_product 
            FOREIGN KEY (product_id) 
            REFERENCES products(id) 
            ON DELETE SET NULL
        `);

        // 6. Add FK constraint for variant_id with ON DELETE SET NULL
        await queryRunner.query(`
            ALTER TABLE cart_items 
            ADD CONSTRAINT fk_cart_items_variant 
            FOREIGN KEY (variant_id) 
            REFERENCES product_variants(id) 
            ON DELETE SET NULL
        `);

        // 7. Drop size column
        await queryRunner.query(`
            ALTER TABLE cart_items 
            DROP COLUMN IF EXISTS size
        `);

        // Note: variant_id remains nullable for defensive modeling
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Reverse migration
        await queryRunner.query(`
            ALTER TABLE cart_items 
            ADD COLUMN size VARCHAR
        `);

        await queryRunner.query(`
            UPDATE cart_items 
            SET size = variant_label 
            WHERE variant_label IS NOT NULL
        `);

        await queryRunner.query(`
            ALTER TABLE cart_items 
            DROP CONSTRAINT IF EXISTS fk_cart_items_variant
        `);

        await queryRunner.query(`
            ALTER TABLE cart_items 
            DROP CONSTRAINT IF EXISTS fk_cart_items_product
        `);

        await queryRunner.query(`
            ALTER TABLE cart_items 
            DROP COLUMN IF EXISTS variant_label
        `);
    }
}
