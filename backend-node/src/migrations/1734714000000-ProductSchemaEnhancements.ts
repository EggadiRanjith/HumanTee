import { MigrationInterface, QueryRunner } from 'typeorm';

export class ProductSchemaEnhancements1734714000000 implements MigrationInterface {
    name = 'ProductSchemaEnhancements1734714000000';

    public async up(queryRunner: QueryRunner): Promise<void> {
        // ====================================================================
        // STEP 1: Update products table
        // ====================================================================

        // Add new columns
        await queryRunner.query(`
            ALTER TABLE \`products\` 
            ADD COLUMN \`inventory_mode\` ENUM('SINGLE', 'VARIANT') DEFAULT 'SINGLE',
            ADD COLUMN \`base_price\` DECIMAL(10,2) NOT NULL DEFAULT 0
        `);

        // Migrate existing data
        await queryRunner.query(`
            UPDATE \`products\` 
            SET \`base_price\` = COALESCE(\`compare_at_price\`, 1299) 
            WHERE \`base_price\` = 0
        `);

        // Rename title to name
        await queryRunner.query(`
            ALTER TABLE \`products\` 
            CHANGE COLUMN \`title\` \`name\` VARCHAR(255) NOT NULL
        `);

        // Remove SEO columns
        await queryRunner.query(`
            ALTER TABLE \`products\`
            DROP COLUMN \`meta_title\`,
            DROP COLUMN \`meta_description\`,
            DROP COLUMN \`tags\`
        `);

        // Remove collections column (will be normalized)
        await queryRunner.query(`
            ALTER TABLE \`products\` 
            DROP COLUMN \`collections\`
        `);

        // Add performance indexes
        await queryRunner.query(`
            CREATE INDEX \`idx_products_featured_active\` 
            ON \`products\` (\`is_featured\`, \`status\`, \`created_at\`)
        `);

        await queryRunner.query(`
            CREATE INDEX \`idx_products_low_stock\` 
            ON \`products\` (\`track_inventory\`, \`stock_quantity\`, \`low_stock_threshold\`)
        `);

        // ====================================================================
        // STEP 2: Update product_variants table
        // ====================================================================

        // Add performance index
        await queryRunner.query(`
            CREATE INDEX \`idx_variants_stock\` 
            ON \`product_variants\` (\`product_id\`, \`is_active\`, \`stock_quantity\`)
        `);

        // ====================================================================
        // STEP 3: Create product_images table
        // ====================================================================

        await queryRunner.query(`
            CREATE TABLE \`product_images\` (
                \`id\` VARCHAR(36) PRIMARY KEY,
                \`product_id\` VARCHAR(36) NOT NULL,
                \`url\` VARCHAR(500) NOT NULL,
                \`alt_text\` VARCHAR(255) NULL,
                \`status\` ENUM('TEMP', 'ACTIVE') DEFAULT 'TEMP',
                \`is_primary\` BOOLEAN DEFAULT FALSE,
                \`display_order\` INT DEFAULT 0,
                \`expires_at\` TIMESTAMP NULL,
                \`uploaded_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (\`product_id\`) REFERENCES \`products\`(\`id\`) ON DELETE CASCADE,
                INDEX \`IDX_PRODUCT_IMAGES_PRODUCT_ID\` (\`product_id\`),
                INDEX \`idx_product_images_active\` (\`product_id\`, \`status\`, \`is_primary\`, \`display_order\`)
            )
        `);

        // ====================================================================
        // STEP 4: Create collections table
        // ====================================================================

        await queryRunner.query(`
            CREATE TABLE \`collections\` (
                \`id\` VARCHAR(36) PRIMARY KEY,
                \`name\` VARCHAR(100) UNIQUE NOT NULL,
                \`slug\` VARCHAR(100) UNIQUE NOT NULL,
                \`description\` TEXT NULL,
                \`scheduled_start\` TIMESTAMP NULL,
                \`scheduled_end\` TIMESTAMP NULL,
                \`display_order\` INT DEFAULT 0,
                \`is_active\` BOOLEAN DEFAULT TRUE,
                \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                \`updated_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                INDEX \`IDX_COLLECTIONS_NAME\` (\`name\`),
                INDEX \`IDX_COLLECTIONS_SLUG\` (\`slug\`),
                INDEX \`idx_collections_active\` (\`is_active\`, \`scheduled_start\`, \`scheduled_end\`)
            )
        `);

        // ====================================================================
        // STEP 5: Create product_collection_map table
        // ====================================================================

        await queryRunner.query(`
            CREATE TABLE \`product_collection_map\` (
                \`id\` VARCHAR(36) PRIMARY KEY,
                \`product_id\` VARCHAR(36) NOT NULL,
                \`collection_id\` VARCHAR(36) NOT NULL,
                \`position\` INT DEFAULT 0,
                \`added_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (\`product_id\`) REFERENCES \`products\`(\`id\`) ON DELETE CASCADE,
                FOREIGN KEY (\`collection_id\`) REFERENCES \`collections\`(\`id\`) ON DELETE CASCADE,
                UNIQUE INDEX \`unique_product_collection\` (\`product_id\`, \`collection_id\`),
                INDEX \`IDX_PCM_PRODUCT_ID\` (\`product_id\`),
                INDEX \`IDX_PCM_COLLECTION_ID\` (\`collection_id\`),
                INDEX \`idx_pcm_collection_position\` (\`collection_id\`, \`position\`)
            )
        `);

        // ====================================================================
        // STEP 6: Insert default collections
        // ====================================================================

        await queryRunner.query(`
            INSERT INTO \`collections\` (\`id\`, \`name\`, \`slug\`, \`display_order\`) VALUES
            (UUID(), 'Drop 1', 'drop-1', 1),
            (UUID(), 'Drop 2', 'drop-2', 2),
            (UUID(), 'Drop 3', 'drop-3', 3)
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Drop new tables
        await queryRunner.query(`DROP TABLE IF EXISTS \`product_collection_map\``);
        await queryRunner.query(`DROP TABLE IF EXISTS \`collections\``);
        await queryRunner.query(`DROP TABLE IF EXISTS \`product_images\``);

        // Drop new indexes
        await queryRunner.query(`DROP INDEX \`idx_variants_stock\` ON \`product_variants\``);
        await queryRunner.query(`DROP INDEX \`idx_products_low_stock\` ON \`products\``);
        await queryRunner.query(`DROP INDEX \`idx_products_featured_active\` ON \`products\``);

        // Restore collections column
        await queryRunner.query(`ALTER TABLE \`products\` ADD COLUMN \`collections\` TEXT NULL`);

        // Restore SEO columns
        await queryRunner.query(`
            ALTER TABLE \`products\`
            ADD COLUMN \`meta_title\` VARCHAR(60) NULL,
            ADD COLUMN \`meta_description\` VARCHAR(160) NULL,
            ADD COLUMN \`tags\` TEXT NULL
        `);

        // Rename name back to title
        await queryRunner.query(`ALTER TABLE \`products\` CHANGE COLUMN \`name\` \`title\` VARCHAR(255) NOT NULL`);

        // Remove new columns
        await queryRunner.query(`
            ALTER TABLE \`products\` 
            DROP COLUMN \`base_price\`,
            DROP COLUMN \`inventory_mode\`
        `);
    }
}
