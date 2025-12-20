-- Migration: Increase product_images.url column size to support base64 images
-- This is a temporary solution until proper cloud storage (S3/Cloudinary) is implemented

ALTER TABLE product_images 
ALTER COLUMN url TYPE TEXT;

-- Verify the change
SELECT column_name, data_type, character_maximum_length 
FROM information_schema.columns 
WHERE table_name = 'product_images' 
AND column_name = 'url';
