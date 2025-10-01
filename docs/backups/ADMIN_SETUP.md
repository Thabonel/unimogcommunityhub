# Admin Setup Guide

## 🚨 CRITICAL: Admin User Loading Fix

The admin user loading functionality requires proper database setup and admin role assignment. No mock data is used - this is a real authentication system.

## Prerequisites

1. ✅ Supabase project configured with environment variables
2. ✅ User account created and authenticated in the app
3. ❌ Admin role assigned to your user (THIS IS MISSING)

## Step 1: Database Setup

### 1.1 Create user_roles table

In your Supabase SQL Editor, run:

```sql
-- Create user_roles table if it doesn't exist
CREATE TABLE IF NOT EXISTS user_roles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, role)
);

-- Enable RLS
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
```

### 1.2 Set up Row Level Security policies

```sql
-- Users can view their own roles
CREATE POLICY "Users can view their own roles" ON user_roles
  FOR SELECT USING (auth.uid() = user_id);

-- Admins can manage all roles
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
```

## Step 2: Assign Admin Role

### 2.1 Find your user ID

In Supabase SQL Editor:

```sql
-- Find your user ID (replace with your email)
SELECT id, email FROM auth.users WHERE email = 'your-email@example.com';
```

### 2.2 Grant admin role

```sql
-- Replace 'your-user-id-here' with the actual UUID from step 2.1
INSERT INTO user_roles (user_id, role)
VALUES ('your-user-id-here', 'admin')
ON CONFLICT (user_id, role) DO NOTHING;
```

## Step 3: Configure Edge Functions

### 3.1 Required Supabase secrets

In your Supabase project settings → Edge Functions → Environment Variables:

```
SUPABASE_URL=https://your-project.supabase.co  
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### 3.2 Deploy Edge Function

```bash
# If using Supabase CLI
supabase functions deploy admin-users
```

## Step 4: Test Admin Access

1. **Log in** to your app with the user account you granted admin role to
2. **Navigate** to the admin section  
3. **Click "Load User Data"** - should now work without errors
4. **Verify** you can see all users in the system

## Troubleshooting

### Error: "Forbidden. Admin access required"
- ✅ Check that your user has admin role in user_roles table
- ✅ Verify you're logged in with the correct account
- ✅ Confirm RLS policies are set up correctly

### Error: "Edge function error: Edge Function return non-2xx status code"
- ✅ Check Edge Function environment variables are set
- ✅ Verify Edge Function is deployed  
- ✅ Check Supabase logs for detailed error messages

### Error: "Not authenticated"
- ✅ Ensure you're logged into the app
- ✅ Check that session token is being passed correctly
- ✅ Verify authentication context is working

## Verification Query

Run this in Supabase SQL Editor to confirm setup:

```sql
-- Check if everything is set up correctly
SELECT 
  u.email,
  ur.role,
  ur.created_at as role_granted_at
FROM auth.users u
LEFT JOIN user_roles ur ON u.id = ur.user_id
WHERE ur.role = 'admin';
```

This should show your email address with 'admin' role.

## Security Notes

- ✅ No mock data used - all data comes from real database
- ✅ Authentication required for all admin operations  
- ✅ RLS policies protect sensitive operations
- ✅ Service role key used only in Edge Functions
- ✅ Admin role verification on every request