-- ============================================
-- SETTINGS SYSTEM - PostgreSQL Setup Script
-- Run this in pgAdmin to create all tables
-- ============================================

-- 1. SETTINGS TABLE (Main storage)
CREATE TABLE settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key VARCHAR(255) NOT NULL,
    value JSONB NOT NULL,
    environment VARCHAR(20) NOT NULL DEFAULT 'production',
    section VARCHAR(50) GENERATED ALWAYS AS (split_part(key, '.', 1)) STORED,
    is_active BOOLEAN DEFAULT true,
    is_published BOOLEAN DEFAULT true,
    version INTEGER DEFAULT 1,
    description TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    
    -- Composite unique: key + environment
    CONSTRAINT unique_key_env UNIQUE (key, environment)
);

-- Indexes for performance
CREATE INDEX idx_settings_section_env ON settings(section, environment);
CREATE INDEX idx_settings_key_active ON settings(key, environment, is_active, is_published);
CREATE INDEX idx_settings_version ON settings(version);

-- 2. HISTORY TABLE (Audit trail)
CREATE TABLE settings_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    setting_id UUID NOT NULL,
    key VARCHAR(255) NOT NULL,
    value JSONB NOT NULL,
    environment VARCHAR(20) NOT NULL,
    changed_by UUID,
    change_reason TEXT,
    previous_version INTEGER NOT NULL,
    changed_at TIMESTAMP DEFAULT NOW(),
    
    -- Foreign key with cascade
    CONSTRAINT fk_setting
        FOREIGN KEY (setting_id)
        REFERENCES settings(id)
        ON DELETE CASCADE
);

-- History indexes
CREATE INDEX idx_history_setting ON settings_history(setting_id);
CREATE INDEX idx_history_key_env ON settings_history(key, environment);
CREATE INDEX idx_history_changed_at ON settings_history(changed_at DESC);

-- 3. VERSION COUNTER (Cache invalidation)
CREATE TABLE settings_version (
    id INTEGER PRIMARY KEY DEFAULT 1,
    version BIGINT DEFAULT 1,
    updated_at TIMESTAMP DEFAULT NOW(),
    
    -- Only allow one row
    CONSTRAINT only_one_row CHECK (id = 1)
);

-- Insert version counter
INSERT INTO settings_version (id, version) VALUES (1, 1);

-- 4. AUTO-INCREMENT TRIGGER (Automatic cache invalidation)
CREATE OR REPLACE FUNCTION increment_settings_version()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE settings_version SET version = version + 1, updated_at = NOW() WHERE id = 1;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER settings_version_trigger
AFTER INSERT OR UPDATE OR DELETE ON settings
FOR EACH STATEMENT
EXECUTE FUNCTION increment_settings_version();

-- 5. TABLES READY (No default data - add via admin panel)
-- Settings will be empty until you add them through the admin interface

-- ============================================
-- Verification Queries (Run to check)
-- ============================================

-- Check settings table
SELECT * FROM settings;

-- Check version counter
SELECT * FROM settings_version;

-- Check if trigger works (should increment version)
UPDATE settings SET value = '"Updated"' WHERE key = 'header-footer.brand_name';
SELECT * FROM settings_version; -- Version should be 2

-- ============================================
-- DONE! Tables created successfully
-- ============================================
