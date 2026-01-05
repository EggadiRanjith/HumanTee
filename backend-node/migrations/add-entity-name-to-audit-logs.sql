-- Add entity_name column to admin_audit_logs table
-- This stores human-readable identifiers like product SKU, ticket number, etc.

ALTER TABLE admin_audit_logs 
ADD COLUMN entity_name VARCHAR(255);

-- Add comment
COMMENT ON COLUMN admin_audit_logs.entity_name IS 'Human-readable identifier (SKU, name, ticket number, etc.)';
