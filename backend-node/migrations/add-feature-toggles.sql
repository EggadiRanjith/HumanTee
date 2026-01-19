-- Feature Toggle Settings
-- Add feature flags to enable/disable discounts and tickets functionality

-- Insert feature toggle settings (section is auto-generated from key)
INSERT INTO settings (key, value, environment, is_active, is_published, version, description)
VALUES
  -- Discounts toggle (saves 30-50 API calls per user when disabled)
  ('features.discounts_enabled', 'true', 'production', true, true, 1, 'Enable or disable discount functionality to save API calls'),
  
  -- Support tickets toggle (saves 5-10 API calls per user when disabled)
  ('features.tickets_enabled', 'true', 'production', true, true, 1, 'Enable or disable support ticket functionality to save API calls')

ON CONFLICT (key, environment) 
DO UPDATE SET
  value = EXCLUDED.value,
  version = settings.version + 1;

-- Verify insertion
SELECT section, key, value, environment
FROM settings
WHERE key LIKE 'features.%'
ORDER BY key;
