-- App-wide settings storage
CREATE TABLE IF NOT EXISTS app_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE app_settings ENABLE ROW LEVEL SECURITY;

-- Anyone can read settings
CREATE POLICY "Anyone can read app settings" ON app_settings
  FOR SELECT USING (true);

-- Only admins can modify settings
CREATE POLICY "Admins can manage app settings" ON app_settings
  FOR ALL USING (check_admin_access());

-- Seed default structured data flag (idempotent)
INSERT INTO app_settings (key, value)
VALUES ('enable_structured_data', '{"enabled": true}')
ON CONFLICT (key) DO NOTHING;

