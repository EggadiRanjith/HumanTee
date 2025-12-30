import { MigrationInterface, QueryRunner } from "typeorm";

export class AddOrderIdempotency1735473000000 implements MigrationInterface {
    name = 'AddOrderIdempotency1735473000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Add idempotency_key column to orders table
        await queryRunner.query(`
            ALTER TABLE "orders"
            ADD COLUMN "idempotency_key" VARCHAR(36)
        `);

        // Create unique partial index (allows NULL values, enforces uniqueness when NOT NULL)
        await queryRunner.query(`
            CREATE UNIQUE INDEX "idx_orders_user_idempotency"
            ON "orders"("user_id", "idempotency_key")
            WHERE "idempotency_key" IS NOT NULL
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Drop index first
        await queryRunner.query(`DROP INDEX IF EXISTS "idx_orders_user_idempotency"`);

        // Drop column
        await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN IF EXISTS "idempotency_key"`);
    }
}
