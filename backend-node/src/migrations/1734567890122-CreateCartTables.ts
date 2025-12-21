import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateCartTables1734567890122 implements MigrationInterface {
    name = 'CreateCartTables1734567890122'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Create carts table
        await queryRunner.query(`
            CREATE TABLE "carts" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "user_id" uuid NOT NULL,
                "status" varchar NOT NULL DEFAULT 'ACTIVE',
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_carts" PRIMARY KEY ("id")
            )
        `);

        // Create index on user_id
        await queryRunner.query(`
            CREATE INDEX "IDX_CARTS_USER_ID" ON "carts" ("user_id")
        `);

        // Create cart_items table (basic structure, will be enhanced by UpdateCartItemsForVariants)
        await queryRunner.query(`
            CREATE TABLE "cart_items" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "cart_id" uuid NOT NULL,
                "product_id" varchar,
                "variant_id" varchar,
                "quantity" integer NOT NULL,
                "price_snapshot" decimal(10,2) NOT NULL,
                "currency" varchar(3) NOT NULL DEFAULT 'INR',
                "product_title" text,
                "product_image" text,
                "size" varchar,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_cart_items" PRIMARY KEY ("id")
            )
        `);

        // Create indexes
        await queryRunner.query(`
            CREATE INDEX "IDX_CART_ITEMS_CART_ID" ON "cart_items" ("cart_id")
        `);

        // Add foreign key constraint for carts
        await queryRunner.query(`
            ALTER TABLE "carts" 
            ADD CONSTRAINT "FK_carts_user" 
            FOREIGN KEY ("user_id") 
            REFERENCES "auth_users"("id") 
            ON DELETE CASCADE 
            ON UPDATE NO ACTION
        `);

        // Add foreign key constraint for cart_items -> carts
        await queryRunner.query(`
            ALTER TABLE "cart_items" 
            ADD CONSTRAINT "FK_cart_items_cart" 
            FOREIGN KEY ("cart_id") 
            REFERENCES "carts"("id") 
            ON DELETE CASCADE 
            ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Drop foreign key constraints
        await queryRunner.query(`ALTER TABLE "cart_items" DROP CONSTRAINT "FK_cart_items_cart"`);
        await queryRunner.query(`ALTER TABLE "carts" DROP CONSTRAINT "FK_carts_user"`);

        // Drop indexes
        await queryRunner.query(`DROP INDEX "IDX_CART_ITEMS_CART_ID"`);
        await queryRunner.query(`DROP INDEX "IDX_CARTS_USER_ID"`);

        // Drop tables
        await queryRunner.query(`DROP TABLE "cart_items"`);
        await queryRunner.query(`DROP TABLE "carts"`);
    }
}
