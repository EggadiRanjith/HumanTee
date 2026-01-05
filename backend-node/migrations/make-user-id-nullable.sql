-- Make user_id nullable to support guest checkout
ALTER TABLE orders ALTER COLUMN user_id DROP NOT NULL;
