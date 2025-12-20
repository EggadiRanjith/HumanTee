-- ============================================================================
-- COMPLETE DATABASE SCHEMA FIX
-- Run this ONCE to ensure everything is correct
-- ============================================================================

-- Step 1: Ensure all columns exist in products table
DO $$ 
BEGIN
    -- Add version if missing
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='products' AND column_name='version') THEN
        ALTER TABLE products ADD COLUMN version INT DEFAULT 1;
    END IF;
    
    -- Add compare_at_price if missing
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='products' AND column_name='compare_at_price') THEN
        ALTER TABLE products ADD COLUMN compare_at_price DECIMAL(10,2);
    END IF;
    
    -- Add cost_per_item if missing
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='products' AND column_name='cost_per_item') THEN
        ALTER TABLE products ADD COLUMN cost_per_item DECIMAL(10,2);
    END IF;
    
    -- Add currency if missing
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='products' AND column_name='currency') THEN
        ALTER TABLE products ADD COLUMN currency VARCHAR(3) DEFAULT 'INR';
    END IF;
    
    -- Add taxable if missing
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='products' AND column_name='taxable') THEN
        ALTER TABLE products ADD COLUMN taxable BOOLEAN DEFAULT true;
    END IF;
    
    -- Add inventory_mode if missing
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='products' AND column_name='inventory_mode') THEN
        ALTER TABLE products ADD COLUMN inventory_mode VARCHAR(10) DEFAULT 'SINGLE';
    END IF;
    
    -- Add track_inventory if missing
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='products' AND column_name='track_inventory') THEN
        ALTER TABLE products ADD COLUMN track_inventory BOOLEAN DEFAULT true;
    END IF;
    
    -- Add sku if missing
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='products' AND column_name='sku') THEN
        ALTER TABLE products ADD COLUMN sku VARCHAR(100);
    END IF;
    
    -- Add stock_quantity if missing
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='products' AND column_name='stock_quantity') THEN
        ALTER TABLE products ADD COLUMN stock_quantity INT DEFAULT 0;
    END IF;
    
    -- Add continue_selling_when_out_of_stock if missing
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='products' AND column_name='continue_selling_when_out_of_stock') THEN
        ALTER TABLE products ADD COLUMN continue_selling_when_out_of_stock BOOLEAN DEFAULT false;
    END IF;
    
    -- Add low_stock_threshold if missing
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='products' AND column_name='low_stock_threshold') THEN
        ALTER TABLE products ADD COLUMN low_stock_threshold INT;
    END IF;
    
    -- Add product_type if missing
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='products' AND column_name='product_type') THEN
        ALTER TABLE products ADD COLUMN product_type VARCHAR(50);
    END IF;
    
    -- Add category if missing
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='products' AND column_name='category') THEN
        ALTER TABLE products ADD COLUMN category VARCHAR(50);
    END IF;
END $$;

-- Step 2: Show final schema
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'products' 
ORDER BY ordinal_position;
