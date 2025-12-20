-- ============================================================================
-- STEP 1: ANALYZE CURRENT DATABASE STRUCTURE
-- ============================================================================

-- Check what columns exist in products table
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'products' 
ORDER BY ordinal_position;

-- Check what columns exist in product_variants table
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'product_variants' 
ORDER BY ordinal_position;

-- Check what tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('products', 'product_variants', 'product_images', 'collections', 'product_collection_map')
ORDER BY table_name;
