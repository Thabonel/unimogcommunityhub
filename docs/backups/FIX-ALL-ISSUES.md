# Complete Fix Guide for UnimogCommunityHub

## Issues Fixed in Code (Already Pushed)
✅ Multiple Supabase client instances - Removed unused connection pool
✅ Invalid UUID for system articles - Fixed to use auto-generated IDs  
✅ OpenAI API warning - Made silent when no key is configured
✅ Trip planner map flashing - Fixed dependencies and initialization

## Manual Fixes Required in Supabase Dashboard

### Step 1: Fix Database Schema
Run this SQL in your Supabase SQL Editor:

```sql
-- Fix missing columns and tables
-- Copy everything from: supabase/migrations/20240111_fix_missing_columns.sql

-- 1. Add missing columns to profiles table
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS country VARCHAR(2),
ADD COLUMN IF NOT EXISTS language VARCHAR(5) DEFAULT 'en';

-- 2. Create user_subscriptions table
CREATE TABLE IF NOT EXISTS user_subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  subscription_type VARCHAR(50) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'active',
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE,
  stripe_subscription_id TEXT,
  stripe_customer_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Enable RLS
ALTER TABLE user_subscriptions ENABLE ROW LEVEL SECURITY;

-- 4. Create policies
CREATE POLICY "Users can view own subscriptions" ON user_subscriptions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own subscriptions" ON user_subscriptions
  FOR UPDATE USING (auth.uid() = user_id);

-- 5. Fix community_articles
ALTER TABLE community_articles 
ALTER COLUMN author_id DROP NOT NULL;
```

### Step 2: Fix Storage Buckets
Run this SQL to create storage buckets:

```sql
-- Copy everything from: scripts/init-storage-buckets.sql

-- Disable RLS temporarily
ALTER TABLE storage.buckets DISABLE ROW LEVEL SECURITY;

-- Create buckets
INSERT INTO storage.buckets (id, name, public, file_size_limit)
VALUES 
  ('avatars', 'avatars', true, 52428800),
  ('profile_photos', 'profile_photos', true, 52428800),
  ('vehicle_photos', 'vehicle_photos', true, 52428800),
  ('manuals', 'manuals', false, 104857600),
  ('article_files', 'article_files', true, 52428800),
  ('site_assets', 'site_assets', true, 52428800)
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit;

-- Re-enable RLS
ALTER TABLE storage.buckets ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow public bucket listing" ON storage.buckets
  FOR SELECT USING (true);

CREATE POLICY IF NOT EXISTS "Allow public to view public bucket files" ON storage.objects
  FOR SELECT USING (bucket_id IN ('avatars', 'profile_photos', 'vehicle_photos', 'article_files', 'site_assets'));

CREATE POLICY IF NOT EXISTS "Allow authenticated to upload files" ON storage.objects
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY IF NOT EXISTS "Allow users to update own files" ON storage.objects
  FOR UPDATE USING (auth.uid()::text = owner);

CREATE POLICY IF NOT EXISTS "Allow users to delete own files" ON storage.objects
  FOR DELETE USING (auth.uid()::text = owner);
```

### Step 3: Fix Mapbox Token (Optional)
The Mapbox token in your .env might have limited permissions. If you see 403 errors:

1. Go to https://account.mapbox.com/
2. Create a new token with these scopes:
   - styles:read
   - fonts:read
   - datasets:read
   - vision:read
3. Update your .env file with the new token
4. Update in Netlify environment variables

## Verification Steps

1. **Test Storage**: Run `node scripts/test-storage-setup.js`
2. **Clear Browser Cache**: DevTools → Application → Clear Storage
3. **Check Console**: Should see no more RLS or 400/406 errors

## Summary of Changes

### Code Changes (Already Deployed)
- Removed duplicate Supabase client instances
- Fixed system article creation to use proper UUIDs
- Silenced expected OpenAI warnings
- Fixed map re-initialization issues

### Database Changes (Need Manual Run)
- Added missing columns to profiles table
- Created user_subscriptions table with RLS
- Fixed community_articles to allow null author_id
- Created storage buckets with proper permissions

## Common Issues After Fix

If you still see errors:
1. **Storage still failing**: The buckets might already exist. Check Storage tab in Supabase
2. **Map still flashing**: Clear browser localStorage completely
3. **Database errors**: Make sure you ran both SQL scripts completely

All code fixes are deployed. You just need to run the SQL scripts in Supabase Dashboard.