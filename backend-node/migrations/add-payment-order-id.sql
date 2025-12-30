-- Migration: Add payment_order_id column to orders table
-- Date: 2025-12-30
-- Description: Adds the missing payment_order_id column that was defined in the Order entity but not present in the database

ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS payment_order_id VARCHAR;

-- Optional: Add comment to document the column
COMMENT ON COLUMN orders.payment_order_id IS 'Payment gateway order ID (e.g., Razorpay order_id)';
