import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPaymentIdempotencyConstraint1737369000000 implements MigrationInterface {
    name = 'AddPaymentIdempotencyConstraint1737369000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Add unique constraint on provider_payment_id to prevent duplicate payments
        // This ensures idempotency at the database level, even when Redis is unavailable
        await queryRunner.query(`
            ALTER TABLE "payments" 
            ADD CONSTRAINT "unique_provider_payment_id" 
            UNIQUE ("provider_payment_id")
        `);

        // Create index for faster lookups by provider_payment_id
        await queryRunner.query(`
            CREATE INDEX IF NOT EXISTS "idx_payments_provider_payment_id" 
            ON "payments"("provider_payment_id") 
            WHERE "provider_payment_id" IS NOT NULL
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Remove index
        await queryRunner.query(`
            DROP INDEX IF EXISTS "idx_payments_provider_payment_id"
        `);

        // Remove unique constraint
        await queryRunner.query(`
            ALTER TABLE "payments" 
            DROP CONSTRAINT IF EXISTS "unique_provider_payment_id"
        `);
    }
}
