# Storage RLS Manual Fix Guide

## Issue Summary
The Unimog Community Hub application is experiencing "profile bucket not found" popups and photo upload failures due to insufficient Row Level Security (RLS) policies on Supabase storage buckets.

## Buckets Verified ✅
- ✅ `Profile Photos` (with space and capitals - as expected by frontend)
- ✅ `vehicle_photos` (vehicle photos)  
- ✅ `user-photos` (user photos with dash)
- ✅ `avatars` (avatar photos)

## Manual Fix Instructions

Since automated script deployment failed (missing `exec_sql` RPC function), you need to apply these policies manually via the Supabase Dashboard.

### Step 1: Access Supabase Dashboard
1. Go to https://app.supabase.com/project/ydevatqwkoccxhtejdor
2. Navigate to **SQL Editor**
3. Create a new query

### Step 2: Execute the Complete Migration

Copy and paste the entire contents of the migration file into the SQL editor:

**File**: `/Users/thabonel/Documents/unimogcommunityhub/supabase/migrations/20250809_fix_storage_rls_policies.sql`

Or use this condensed version:

```sql
-- Fix Row Level Security policies for storage buckets
-- Enable RLS on storage.objects table
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- ====================================
-- DROP ALL EXISTING POLICIES
-- ====================================
DROP POLICY IF EXISTS "Allow public to view public bucket files" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated to upload files" ON storage.objects;
DROP POLICY IF EXISTS "Allow users to update own files" ON storage.objects;
DROP POLICY IF EXISTS "Allow users to delete own files" ON storage.objects;

-- Drop bucket-specific policies if they exist
DROP POLICY IF EXISTS "profile_photos_upload_policy" ON storage.objects;
DROP POLICY IF EXISTS "profile_photos_read_policy" ON storage.objects;
DROP POLICY IF EXISTS "profile_photos_update_policy" ON storage.objects;
DROP POLICY IF EXISTS "profile_photos_delete_policy" ON storage.objects;

DROP POLICY IF EXISTS "Profile Photos_upload_policy" ON storage.objects;
DROP POLICY IF EXISTS "Profile Photos_read_policy" ON storage.objects;
DROP POLICY IF EXISTS "Profile Photos_update_policy" ON storage.objects;
DROP POLICY IF EXISTS "Profile Photos_delete_policy" ON storage.objects;

DROP POLICY IF EXISTS "vehicle_photos_upload_policy" ON storage.objects;
DROP POLICY IF EXISTS "vehicle_photos_read_policy" ON storage.objects;
DROP POLICY IF EXISTS "vehicle_photos_update_policy" ON storage.objects;
DROP POLICY IF EXISTS "vehicle_photos_delete_policy" ON storage.objects;

DROP POLICY IF EXISTS "user-photos_upload_policy" ON storage.objects;
DROP POLICY IF EXISTS "user-photos_read_policy" ON storage.objects;
DROP POLICY IF EXISTS "user-photos_update_policy" ON storage.objects;
DROP POLICY IF EXISTS "user-photos_delete_policy" ON storage.objects;

DROP POLICY IF EXISTS "avatars_upload_policy" ON storage.objects;
DROP POLICY IF EXISTS "avatars_read_policy" ON storage.objects;
DROP POLICY IF EXISTS "avatars_update_policy" ON storage.objects;
DROP POLICY IF EXISTS "avatars_delete_policy" ON storage.objects;

-- ====================================
-- CREATE NEW POLICIES
-- ====================================

-- PROFILE PHOTOS BUCKET (with space and capitals)
CREATE POLICY "Profile Photos_upload_policy"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'Profile Photos' AND auth.uid() IS NOT NULL);

CREATE POLICY "Profile Photos_read_policy"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'Profile Photos');

CREATE POLICY "Profile Photos_update_policy"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'Profile Photos' AND owner = auth.uid()::text);

CREATE POLICY "Profile Photos_delete_policy"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'Profile Photos' AND owner = auth.uid()::text);

-- VEHICLE_PHOTOS BUCKET
CREATE POLICY "vehicle_photos_upload_policy"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'vehicle_photos' AND auth.uid() IS NOT NULL);

CREATE POLICY "vehicle_photos_read_policy"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'vehicle_photos');

CREATE POLICY "vehicle_photos_update_policy"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'vehicle_photos' AND owner = auth.uid()::text);

CREATE POLICY "vehicle_photos_delete_policy"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'vehicle_photos' AND owner = auth.uid()::text);

-- USER-PHOTOS BUCKET
CREATE POLICY "user-photos_upload_policy"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'user-photos' AND auth.uid() IS NOT NULL);

CREATE POLICY "user-photos_read_policy"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'user-photos');

CREATE POLICY "user-photos_update_policy"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'user-photos' AND owner = auth.uid()::text);

CREATE POLICY "user-photos_delete_policy"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'user-photos' AND owner = auth.uid()::text);

-- AVATARS BUCKET
CREATE POLICY "avatars_upload_policy"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'avatars' AND auth.uid() IS NOT NULL);

CREATE POLICY "avatars_read_policy"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'avatars');

CREATE POLICY "avatars_update_policy"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'avatars' AND owner = auth.uid()::text);

CREATE POLICY "avatars_delete_policy"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'avatars' AND owner = auth.uid()::text);

-- ====================================
-- GRANT PERMISSIONS
-- ====================================
GRANT USAGE ON SCHEMA storage TO anon;
GRANT USAGE ON SCHEMA storage TO authenticated;
GRANT SELECT ON storage.objects TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON storage.objects TO authenticated;
GRANT SELECT ON storage.buckets TO anon;
GRANT SELECT ON storage.buckets TO authenticated;

-- Refresh schema cache
NOTIFY pgrst, 'reload schema';

SELECT 'Storage RLS policies fixed successfully. All photo upload buckets now have proper permissions.' as message;
```

### Step 3: Execute the SQL

1. Paste the SQL into the SQL editor
2. Click "Run" to execute
3. Wait for the success message

### Step 4: Verify the Fix

#### Via Dashboard:
1. Go to **Storage** → **Policies** 
2. You should see policies for:
   - `Profile Photos` bucket
   - `vehicle_photos` bucket 
   - `user-photos` bucket
   - `avatars` bucket

#### Via Application:
1. Test photo upload functionality
2. The "profile bucket not found" popups should be resolved
3. Photos should now upload and display correctly

## What These Policies Do

### For Each Bucket:
- **Upload Policy**: Allows authenticated users to upload files
- **Read Policy**: Allows public read access to all photos
- **Update Policy**: Allows users to update their own files only
- **Delete Policy**: Allows users to delete their own files only

### Security Benefits:
- ✅ Prevents unauthorized uploads (must be logged in)
- ✅ Prevents users from modifying others' photos
- ✅ Allows public viewing of all photos (good for community features)
- ✅ Proper file ownership tracking

## Expected Results

After applying these policies:

1. ✅ Photo uploads will work in all parts of the application
2. ✅ "Profile bucket not found" popups will stop appearing  
3. ✅ Photos will display correctly across the application
4. ✅ Users can manage their own photos securely
5. ✅ Public photos are accessible for community features

## Troubleshooting

If issues persist after applying the policies:

1. **Check the SQL execution results** - ensure no errors occurred
2. **Verify bucket existence** - confirm all buckets are created
3. **Test with different user accounts** - ensure policies work for all users
4. **Check browser console** - look for any remaining API errors

## Automated Verification

You can run this script to test if the fix worked:

```bash
node scripts/fix-storage-rls-comprehensive.js
```

This will test upload functionality to verify the policies are working correctly.