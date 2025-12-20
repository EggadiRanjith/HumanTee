-- Complete schema update - run ALL at once
-- This ensures the database matches the TypeORM entities

-- First, check what exists
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'products' 
ORDER BY ordinal_position;

-- Add ALL missing columns at once
ALTER TABLE products 
  ADD COLUMN IF NOT EXISTS version INT DEFAULT 1,
  ADD COLUMN IF NOT EXISTS compare_at_price DECIMAL(10,2),
  ADD COLUMN IF NOT EXISTS cost_per_item DECIMAL(10,2),
  ADD COLUMN IF NOT EXISTS currency VARCHAR(3) DEFAULT 'INR',
  ADD COLUMN IF NOT EXISTS taxable BOOLEAN DEFAULT true,
  ADD COLUMN IF NOT EXISTS inventory_mode VARCHAR(10) DEFAULT 'SINGLE',
  ADD COLUMN IF NOT EXISTS track_inventory BOOLEAN DEFAULT true,
  ADD COLUMN IF NOT EXISTS sku VARCHAR(100),
  ADD COLUMN IF NOT EXISTS stock_quantity INT DEFAULT 0,
  ADD COLUMN IF NOT EXISTS continue_selling_when_out_of_stock BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS low_stock_threshold INT,
  ADD COLUMN IF NOT EXISTS product_type VARCHAR(50),
  ADD COLUMN IF NOT EXISTS category VARCHAR(50);

-- Verify all columns exist
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'products' 
ORDER BY ordinal_position;
