import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateShippingAddressesTable1734813000000 implements MigrationInterface {
    name = 'CreateShippingAddressesTable1734813000000';

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Create shipping_addresses table
        await queryRunner.query(`
            CREATE TABLE "shipping_addresses" (
                "id" uuid NOT NULL DEFAULT gen_random_uuid(),
                "user_id" uuid NOT NULL,
                "full_name" character varying(255) NOT NULL,
                "phone" character varying(20) NOT NULL,
                "email" character varying(255) NOT NULL,
                "house_number" character varying(100) NOT NULL,
                "address" character varying(500) NOT NULL,
                "landmark" character varying(255),
                "city" character varying(100) NOT NULL,
                "state" character varying(100) NOT NULL,
                "postal_code" character varying(20) NOT NULL,
                "country" character varying(100) NOT NULL DEFAULT 'India',
                "address_type" character varying(20) NOT NULL DEFAULT 'home',
                "is_default" boolean NOT NULL DEFAULT false,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "deleted_at" TIMESTAMP,
                CONSTRAINT "PK_shipping_addresses" PRIMARY KEY ("id")
            )
        `);

        // Add foreign key constraint
        await queryRunner.query(`
            ALTER TABLE "shipping_addresses"
            ADD CONSTRAINT "fk_user_shipping_address"
            FOREIGN KEY ("user_id")
            REFERENCES "auth_users"("id")
            ON DELETE CASCADE
        `);

        // Create index for user_id lookups
        await queryRunner.query(`
            CREATE INDEX "idx_shipping_user_id"
            ON "shipping_addresses"("user_id")
            WHERE "deleted_at" IS NULL
        `);

        // Create index for postal_code lookups
        await queryRunner.query(`
            CREATE INDEX "idx_shipping_postal_code"
            ON "shipping_addresses"("postal_code")
            WHERE "deleted_at" IS NULL
        `);

        // Create unique index for default address per user
        await queryRunner.query(`
            CREATE UNIQUE INDEX "unique_default_address_per_user"
            ON "shipping_addresses"("user_id")
            WHERE "is_default" = true AND "deleted_at" IS NULL
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Drop indexes
        await queryRunner.query(`DROP INDEX IF EXISTS "unique_default_address_per_user"`);
        await queryRunner.query(`DROP INDEX IF EXISTS "idx_shipping_postal_code"`);
        await queryRunner.query(`DROP INDEX IF EXISTS "idx_shipping_user_id"`);

        // Drop foreign key
        await queryRunner.query(`
            ALTER TABLE "shipping_addresses"
            DROP CONSTRAINT IF EXISTS "fk_user_shipping_address"
        `);

        // Drop table
        await queryRunner.query(`DROP TABLE IF EXISTS "shipping_addresses"`);
    }
}
