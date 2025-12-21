-- Run this SQL directly in pgAdmin to create cart tables
-- This bypasses the migration system

-- 1. Create carts table
CREATE TABLE IF NOT EXISTS "carts" (
    "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
    "user_id" uuid NOT NULL,
    "status" varchar NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMP NOT NULL DEFAULT now(),
    "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
    CONSTRAINT "PK_carts" PRIMARY KEY ("id")
);

-- 2. Create indexes for carts
CREATE INDEX IF NOT EXISTS "IDX_CARTS_USER_ID" ON "carts" ("user_id");

-- 3. Create cart_items table
CREATE TABLE IF NOT EXISTS "cart_items" (
    "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
    "cart_id" uuid NOT NULL,
    "product_id" uuid,
    "variant_id" uuid,
    "quantity" integer NOT NULL,
    "price_snapshot" decimal(10,2) NOT NULL,
    "currency" varchar(3) NOT NULL DEFAULT 'INR',
    "product_title" text,
    "product_image" text,
    "variant_label" text,
    "created_at" TIMESTAMP NOT NULL DEFAULT now(),
    CONSTRAINT "PK_cart_items" PRIMARY KEY ("id")
);

-- 4. Create indexes for cart_items
CREATE INDEX IF NOT EXISTS "IDX_CART_ITEMS_CART_ID" ON "cart_items" ("cart_id");
CREATE INDEX IF NOT EXISTS "IDX_CART_ITEMS_PRODUCT_ID" ON "cart_items" ("product_id");
CREATE INDEX IF NOT EXISTS "IDX_CART_ITEMS_VARIANT_ID" ON "cart_items" ("variant_id");

-- 5. Add foreign key constraints
ALTER TABLE "carts" 
ADD CONSTRAINT "FK_carts_user" 
FOREIGN KEY ("user_id") 
REFERENCES "auth_users"("id") 
ON DELETE CASCADE 
ON UPDATE NO ACTION;

ALTER TABLE "cart_items" 
ADD CONSTRAINT "FK_cart_items_cart" 
FOREIGN KEY ("cart_id") 
REFERENCES "carts"("id") 
ON DELETE CASCADE 
ON UPDATE NO ACTION;

ALTER TABLE "cart_items" 
ADD CONSTRAINT "FK_cart_items_product" 
FOREIGN KEY ("product_id") 
REFERENCES "products"("id") 
ON DELETE SET NULL 
ON UPDATE NO ACTION;

ALTER TABLE "cart_items" 
ADD CONSTRAINT "FK_cart_items_variant" 
FOREIGN KEY ("variant_id") 
REFERENCES "product_variants"("id") 
ON DELETE SET NULL 
ON UPDATE NO ACTION;

-- 6. Mark migration as complete (so TypeORM doesn't try to run it again)
INSERT INTO "migrations" ("timestamp", "name")
VALUES (1734567890122, 'CreateCartTables1734567890122')
ON CONFLICT DO NOTHING;

SELECT 'Cart tables created successfully!' as status;
