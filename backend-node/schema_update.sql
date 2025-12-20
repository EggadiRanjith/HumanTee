-- ============================================================================
-- STEP 1: Update products table
-- ============================================================================

-- Add new columns
ALTER TABLE products 
  ADD COLUMN IF NOT EXISTS inventory_mode VARCHAR(10) DEFAULT 'SINGLE',
  ADD COLUMN IF NOT EXISTS base_price DECIMAL(10,2) DEFAULT 0;

-- Update base_price from existing data
UPDATE products 
SET base_price = COALESCE(compare_at_price, 1299) 
WHERE base_price = 0;

-- Make base_price NOT NULL after data migration
ALTER TABLE products ALTER COLUMN base_price SET NOT NULL;

-- Rename title to name
ALTER TABLE products RENAME COLUMN title TO name;

-- Remove SEO columns (if they exist)
ALTER TABLE products DROP COLUMN IF EXISTS meta_title;
ALTER TABLE products DROP COLUMN IF EXISTS meta_description;
ALTER TABLE products DROP COLUMN IF EXISTS tags;

-- Remove collections column
ALTER TABLE products DROP COLUMN IF EXISTS collections;

-- Add performance indexes
CREATE INDEX IF NOT EXISTS idx_products_featured_active 
ON products (is_featured, status, created_at);

CREATE INDEX IF NOT EXISTS idx_products_low_stock 
ON products (track_inventory, stock_quantity, low_stock_threshold);

-- ============================================================================
-- STEP 2: Update product_variants table
-- ============================================================================

-- Add performance index
CREATE INDEX IF NOT EXISTS idx_variants_stock 
ON product_variants (product_id, is_active, stock_quantity);

-- ============================================================================
-- STEP 3: Create product_images table
-- ============================================================================

CREATE TABLE IF NOT EXISTS product_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL,
  url VARCHAR(500) NOT NULL,
  alt_text VARCHAR(255),
  status VARCHAR(10) DEFAULT 'TEMP',
  is_primary BOOLEAN DEFAULT FALSE,
  display_order INT DEFAULT 0,
  expires_at TIMESTAMP,
  uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS IDX_PRODUCT_IMAGES_PRODUCT_ID ON product_images (product_id);
CREATE INDEX IF NOT EXISTS idx_product_images_active ON product_images (product_id, status, is_primary, display_order);

-- ============================================================================
-- STEP 4: Create collections table
-- ============================================================================

CREATE TABLE IF NOT EXISTS collections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) UNIQUE NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  scheduled_start TIMESTAMP,
  scheduled_end TIMESTAMP,
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS IDX_COLLECTIONS_NAME ON collections (name);
CREATE INDEX IF NOT EXISTS IDX_COLLECTIONS_SLUG ON collections (slug);
CREATE INDEX IF NOT EXISTS idx_collections_active ON collections (is_active, scheduled_start, scheduled_end);

-- ============================================================================
-- STEP 5: Create product_collection_map table
-- ============================================================================

CREATE TABLE IF NOT EXISTS product_collection_map (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL,
  collection_id UUID NOT NULL,
  position INT DEFAULT 0,
  added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  FOREIGN KEY (collection_id) REFERENCES collections(id) ON DELETE CASCADE,
  UNIQUE (product_id, collection_id)
);

CREATE INDEX IF NOT EXISTS IDX_PCM_PRODUCT_ID ON product_collection_map (product_id);
CREATE INDEX IF NOT EXISTS IDX_PCM_COLLECTION_ID ON product_collection_map (collection_id);
CREATE INDEX IF NOT EXISTS idx_pcm_collection_position ON product_collection_map (collection_id, position);

-- ============================================================================
-- STEP 6: Insert default collections
-- ============================================================================

INSERT INTO collections (name, slug, display_order)
VALUES 
  ('Drop 1', 'drop-1', 1),
  ('Drop 2', 'drop-2', 2),
  ('Drop 3', 'drop-3', 3)
ON CONFLICT (slug) DO NOTHING;

-- ============================================================================
-- STEP 7: Create migrations table (for future migrations)
-- ============================================================================

CREATE TABLE IF NOT EXISTS migrations (
  id SERIAL PRIMARY KEY,
  timestamp BIGINT NOT NULL,
  name VARCHAR(255) NOT NULL
);

-- Mark this migration as run
INSERT INTO migrations (timestamp, name)
VALUES (1734714000000, 'ProductSchemaEnhancements1734714000000')
ON CONFLICT DO NOTHING;
