-- Make user_id nullable in orders table to support guest checkout
ALTER TABLE orders ALTER COLUMN user_id DROP NOT NULL;
