-- System Configuration Tables

-- Create system_settings table for storing application configuration
CREATE TABLE IF NOT EXISTS public.system_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  description TEXT,
  category TEXT NOT NULL DEFAULT 'general',
  is_public BOOLEAN DEFAULT false,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  updated_by UUID REFERENCES auth.users(id)
);

-- Create indexes
CREATE INDEX idx_system_settings_category ON public.system_settings(category);
CREATE INDEX idx_system_settings_is_public ON public.system_settings(is_public);

-- Insert default settings
INSERT INTO public.system_settings (key, value, description, category, is_public) VALUES
  -- General settings
  ('site_name', '"Unimog Community Hub"', 'The name of the website', 'general', true),
  ('site_description', '"Connect with Unimog enthusiasts worldwide"', 'Site description for SEO', 'general', true),
  ('maintenance_mode', 'false', 'Enable maintenance mode', 'general', false),
  
  -- Trial settings
  ('trial_enabled', 'true', 'Enable free trial for new users', 'trial', false),
  ('trial_duration_days', '30', 'Duration of free trial in days', 'trial', false),
  ('trial_features', '["basic_access", "community", "knowledge_base"]', 'Features available during trial', 'trial', false),
  
  -- Email settings
  ('email_notifications_enabled', 'true', 'Enable email notifications', 'email', false),
  ('admin_email', '"admin@unimogcommunityhub.com"', 'Admin email for notifications', 'email', false),
  
  -- Security settings
  ('require_email_verification', 'true', 'Require email verification for new users', 'security', false),
  ('max_login_attempts', '5', 'Maximum login attempts before lockout', 'security', false),
  ('lockout_duration_minutes', '30', 'Account lockout duration in minutes', 'security', false),
  
  -- Payment settings
  ('payment_providers', '["stripe"]', 'Enabled payment providers', 'payment', false),
  ('currency', '"USD"', 'Default currency', 'payment', false),
  ('subscription_plans', '[
    {"id": "free", "name": "Free", "price": 0, "features": ["basic_access"]},
    {"id": "premium", "name": "Premium", "price": 9.99, "features": ["all_access", "priority_support"]},
    {"id": "lifetime", "name": "Lifetime", "price": 299, "features": ["all_access", "priority_support", "lifetime_updates"]}
  ]', 'Available subscription plans', 'payment', true)
ON CONFLICT (key) DO NOTHING;

-- RLS policies
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;

-- Public settings can be read by anyone
CREATE POLICY "Public settings are readable" ON public.system_settings
  FOR SELECT
  USING (is_public = true);

-- Only admins can read private settings
CREATE POLICY "Admins can read all settings" ON public.system_settings
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Only admins can modify settings
CREATE POLICY "Only admins can modify settings" ON public.system_settings
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Function to get a system setting
CREATE OR REPLACE FUNCTION public.get_system_setting(p_key TEXT)
RETURNS JSONB
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
AS $$
DECLARE
  v_value JSONB;
  v_is_public BOOLEAN;
BEGIN
  -- Get the setting
  SELECT value, is_public 
  INTO v_value, v_is_public
  FROM public.system_settings 
  WHERE key = p_key;
  
  -- If not found, return null
  IF NOT FOUND THEN
    RETURN NULL;
  END IF;
  
  -- Check permissions for private settings
  IF NOT v_is_public AND NOT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  ) THEN
    RAISE EXCEPTION 'Unauthorized: This setting is not public';
  END IF;
  
  RETURN v_value;
END;
$$;

-- Function to update a system setting
CREATE OR REPLACE FUNCTION public.update_system_setting(
  p_key TEXT,
  p_value JSONB,
  p_description TEXT DEFAULT NULL
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Check admin permission
  IF NOT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  ) THEN
    RAISE EXCEPTION 'Unauthorized: Only admins can update settings';
  END IF;
  
  -- Update the setting
  UPDATE public.system_settings
  SET 
    value = p_value,
    description = COALESCE(p_description, description),
    updated_at = NOW(),
    updated_by = auth.uid()
  WHERE key = p_key;
  
  -- Log the action
  PERFORM public.log_admin_action(
    'update_setting',
    'system_settings',
    p_key,
    NULL,
    jsonb_build_object('key', p_key, 'value', p_value)
  );
  
  RETURN FOUND;
END;
$$;

-- Grant permissions
GRANT EXECUTE ON FUNCTION public.get_system_setting TO authenticated;
GRANT EXECUTE ON FUNCTION public.update_system_setting TO authenticated;

-- Email templates table
CREATE TABLE IF NOT EXISTS public.email_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  subject TEXT NOT NULL,
  body_html TEXT NOT NULL,
  body_text TEXT NOT NULL,
  variables JSONB DEFAULT '[]',
  category TEXT NOT NULL DEFAULT 'general',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_email_templates_name ON public.email_templates(name);
CREATE INDEX idx_email_templates_category ON public.email_templates(category);

-- Insert default email templates
INSERT INTO public.email_templates (name, subject, body_html, body_text, variables, category) VALUES
  ('welcome', 'Welcome to Unimog Community Hub!', 
   '<h1>Welcome {{name}}!</h1><p>We''re excited to have you join our community.</p>', 
   'Welcome {{name}}! We''re excited to have you join our community.',
   '["name"]', 'user'),
  ('trial_expiring', 'Your trial is expiring soon', 
   '<p>Hi {{name}},</p><p>Your trial expires in {{days}} days.</p>', 
   'Hi {{name}}, Your trial expires in {{days}} days.',
   '["name", "days"]', 'trial')
ON CONFLICT (name) DO NOTHING;

-- RLS policies for email templates
ALTER TABLE public.email_templates ENABLE ROW LEVEL SECURITY;

-- Only admins can manage email templates
CREATE POLICY "Admins can manage email templates" ON public.email_templates
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );