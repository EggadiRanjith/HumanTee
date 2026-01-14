import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPerformanceIndexes1737000000000 implements MigrationInterface {
    name = 'AddPerformanceIndexes1737000000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Orders table - User order queries
        await queryRunner.query(`
            CREATE INDEX IF NOT EXISTS "idx_orders_user_id_created" 
            ON "orders" ("user_id", "created_at" DESC)
        `);

        await queryRunner.query(`
            CREATE INDEX IF NOT EXISTS "idx_orders_status" 
            ON "orders" ("status")
        `);

        // Products table - Shop page queries
        await queryRunner.query(`
            CREATE INDEX IF NOT EXISTS "idx_products_status" 
            ON "products" ("status") 
            WHERE "status" = 'active'
        `);

        await queryRunner.query(`
            CREATE INDEX IF NOT EXISTS "idx_products_collection" 
            ON "products" ("collection")
        `);

        // Cart table - User cart lookups
        await queryRunner.query(`
            CREATE INDEX IF NOT EXISTS "idx_carts_user_id" 
            ON "carts" ("user_id")
        `);

        // Tickets table - User ticket lookups  
        await queryRunner.query(`
            CREATE INDEX IF NOT EXISTS "idx_tickets_user_id_status" 
            ON "tickets" ("user_id", "status")
        `);

        // Auth Users - Email lookups (already has index likely, but ensuring)
        await queryRunner.query(`
            CREATE INDEX IF NOT EXISTS "idx_auth_users_email" 
            ON "auth_users" ("email")
        `);

        // Product Variants - Product lookups
        await queryRunner.query(`
            CREATE INDEX IF NOT EXISTS "idx_product_variants_product_id" 
            ON "product_variants" ("product_id")
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Drop all indexes in reverse order
        await queryRunner.query(`DROP INDEX IF EXISTS "idx_product_variants_product_id"`);
        await queryRunner.query(`DROP INDEX IF EXISTS "idx_auth_users_email"`);
        await queryRunner.query(`DROP INDEX IF EXISTS "idx_tickets_user_id_status"`);
        await queryRunner.query(`DROP INDEX IF EXISTS "idx_carts_user_id"`);
        await queryRunner.query(`DROP INDEX IF EXISTS "idx_products_collection"`);
        await queryRunner.query(`DROP INDEX IF EXISTS "idx_products_status"`);
        await queryRunner.query(`DROP INDEX IF EXISTS "idx_orders_status"`);
        await queryRunner.query(`DROP INDEX IF EXISTS "idx_orders_user_id_created"`);
    }
}
