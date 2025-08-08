-- Setup admin user roles
-- This script should be run in the Supabase SQL editor

-- First, ensure the user_roles table exists
CREATE TABLE IF NOT EXISTS user_roles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, role)
);

-- Enable RLS
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

-- Create policies for user_roles table
CREATE POLICY "Users can view their own roles" ON user_roles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all roles" ON user_roles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_roles ur 
      WHERE ur.user_id = auth.uid() 
      AND ur.role = 'admin'
    )
  );

CREATE POLICY "Admins can insert roles" ON user_roles
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_roles ur 
      WHERE ur.user_id = auth.uid() 
      AND ur.role = 'admin'
    )
  );

CREATE POLICY "Admins can update roles" ON user_roles
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM user_roles ur 
      WHERE ur.user_id = auth.uid() 
      AND ur.role = 'admin'
    )
  );

CREATE POLICY "Admins can delete roles" ON user_roles
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM user_roles ur 
      WHERE ur.user_id = auth.uid() 
      AND ur.role = 'admin'
    )
  );

-- TODO: Replace 'YOUR_USER_EMAIL_HERE' with your actual email address
-- Get the user ID for your email and make them admin
DO $$
DECLARE
  user_id_var UUID;
BEGIN
  -- Replace this email with your actual admin email
  SELECT id INTO user_id_var 
  FROM auth.users 
  WHERE email = 'YOUR_USER_EMAIL_HERE'  -- CHANGE THIS TO YOUR EMAIL
  LIMIT 1;
  
  IF user_id_var IS NOT NULL THEN
    -- Insert admin role (ON CONFLICT DO NOTHING prevents duplicates)
    INSERT INTO user_roles (user_id, role)
    VALUES (user_id_var, 'admin')
    ON CONFLICT (user_id, role) DO NOTHING;
    
    RAISE NOTICE 'Admin role granted to user: %', user_id_var;
  ELSE
    RAISE NOTICE 'User not found. Please update the email in this script.';
  END IF;
END $$;