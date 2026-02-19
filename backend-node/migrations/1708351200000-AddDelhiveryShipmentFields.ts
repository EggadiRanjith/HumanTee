import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddDelhiveryShipmentFields1708351200000 implements MigrationInterface {
    name = 'AddDelhiveryShipmentFields1708351200000';

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Extend shipment_status enum with new values
        // PostgreSQL requires ALTER TYPE to add enum values
        await queryRunner.query(`ALTER TYPE "public"."shipments_status_enum" ADD VALUE IF NOT EXISTS 'manifested'`);
        await queryRunner.query(`ALTER TYPE "public"."shipments_status_enum" ADD VALUE IF NOT EXISTS 'picked_up'`);
        await queryRunner.query(`ALTER TYPE "public"."shipments_status_enum" ADD VALUE IF NOT EXISTS 'in_transit'`);
        await queryRunner.query(`ALTER TYPE "public"."shipments_status_enum" ADD VALUE IF NOT EXISTS 'out_for_delivery'`);
        await queryRunner.query(`ALTER TYPE "public"."shipments_status_enum" ADD VALUE IF NOT EXISTS 'failed'`);
        await queryRunner.query(`ALTER TYPE "public"."shipments_status_enum" ADD VALUE IF NOT EXISTS 'rto'`);

        // Add Delhivery-specific columns
        await queryRunner.query(`ALTER TABLE "shipments" ADD COLUMN IF NOT EXISTS "delhivery_awb" varchar NULL`);
        await queryRunner.query(`ALTER TABLE "shipments" ADD COLUMN IF NOT EXISTS "delhivery_shipment_id" varchar NULL`);
        await queryRunner.query(`ALTER TABLE "shipments" ADD COLUMN IF NOT EXISTS "updated_at" TIMESTAMP NOT NULL DEFAULT now()`);

        // Index on delhivery_awb for tracking lookups
        await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_shipments_delhivery_awb" ON "shipments" ("delhivery_awb") WHERE "delhivery_awb" IS NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX IF EXISTS "IDX_shipments_delhivery_awb"`);
        await queryRunner.query(`ALTER TABLE "shipments" DROP COLUMN IF EXISTS "updated_at"`);
        await queryRunner.query(`ALTER TABLE "shipments" DROP COLUMN IF EXISTS "delhivery_shipment_id"`);
        await queryRunner.query(`ALTER TABLE "shipments" DROP COLUMN IF EXISTS "delhivery_awb"`);
        // Note: PostgreSQL does not support DROP VALUE from enums.
        // Enum values added in up() will remain. This is safe — old values don't break anything.
    }
}
