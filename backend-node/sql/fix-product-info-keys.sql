-- Fix product info settings keys
-- The admin panel and storefront expect 'product-info.' prefix, but some initial data might use 'product.'
INSERT INTO settings (key, value, environment) VALUES
('product-info.material_care', '["100% Premium Cotton", "Pre-shrunk fabric", "Machine wash cold with like colors", "Do not bleach • Tumble dry low", "Iron inside out if needed"]', 'production'),
('product-info.shipping_returns', '["Free shipping on orders over ₹2,000", "Standard delivery: 3-4 business days", "Express delivery available", "30-day return policy", "Easy exchanges available"]', 'production'),
('product-info.size_fit', '["Unisex relaxed fit", "True to size", "Premium build quality"]', 'production'),
('product-info.size_guide_images', '[]', 'production')
ON CONFLICT (key, environment) DO UPDATE SET value = EXCLUDED.value;

-- Optional: Cleanup old keys if they exist
DELETE FROM settings WHERE key LIKE 'product.%' AND environment = 'production';
