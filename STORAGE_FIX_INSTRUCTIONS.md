# Storage Upload Fix - Profile Photos Not Displaying

## 🔍 Problem Identified

The "profile bucket not found" popup and photos not displaying issue is caused by **Row Level Security (RLS) policies** blocking photo uploads. 

**Current Status:**
- ✅ Buckets exist: `Profile Photos`, `vehicle_photos`, `user-photos`, `avatars`
- ❌ All photo buckets are empty (uploads being blocked)
- ❌ RLS policies preventing authenticated users from uploading

## 🛠️ IMMEDIATE SOLUTION

You need to apply storage policies via **Supabase Dashboard**:

### Step 1: Access Supabase Dashboard
1. Go to https://supabase.com/dashboard
2. Select your project: `ydevatqwkoccxhtejdor`
3. Navigate to **Storage** → **Policies**

### Step 2: Apply These Policies

Copy and run this SQL in the **SQL Editor**:

```sql
-- Enable RLS on storage.objects if not already enabled
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- PROFILE PHOTOS BUCKET POLICIES
DROP POLICY IF EXISTS "Profile photos upload policy" ON storage.objects;
CREATE POLICY "Profile photos upload policy"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'Profile Photos' AND auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Profile photos read policy" ON storage.objects;
CREATE POLICY "Profile photos read policy"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'Profile Photos');

DROP POLICY IF EXISTS "Profile photos update policy" ON storage.objects;
CREATE POLICY "Profile photos update policy"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'Profile Photos' AND auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Profile photos delete policy" ON storage.objects;
CREATE POLICY "Profile photos delete policy"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'Profile Photos' AND auth.uid() IS NOT NULL);

-- VEHICLE PHOTOS BUCKET POLICIES  
DROP POLICY IF EXISTS "Vehicle photos upload policy" ON storage.objects;
CREATE POLICY "Vehicle photos upload policy"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'vehicle_photos' AND auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Vehicle photos read policy" ON storage.objects;
CREATE POLICY "Vehicle photos read policy"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'vehicle_photos');

DROP POLICY IF EXISTS "Vehicle photos update policy" ON storage.objects;
CREATE POLICY "Vehicle photos update policy"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'vehicle_photos' AND auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Vehicle photos delete policy" ON storage.objects;
CREATE POLICY "Vehicle photos delete policy"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'vehicle_photos' AND auth.uid() IS NOT NULL);

-- USER PHOTOS BUCKET POLICIES
DROP POLICY IF EXISTS "User photos upload policy" ON storage.objects;
CREATE POLICY "User photos upload policy"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'user-photos' AND auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "User photos read policy" ON storage.objects;
CREATE POLICY "User photos read policy"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'user-photos');

-- Grant necessary permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON storage.objects TO authenticated;
GRANT SELECT ON storage.objects TO anon;
```

### Step 3: Update Bucket Settings (Optional)
In **Storage** → **Settings**, ensure these buckets allow:
- **MIME types**: `image/jpeg`, `image/png`, `image/gif`, `image/webp`
- **File size limit**: `50MB` (52428800 bytes)
- **Public access**: ✅ Enabled

## 🧪 AFTER APPLYING POLICIES - TEST

Once policies are applied, test the upload:

1. Go to profile page
2. Try uploading a profile photo
3. The "profile bucket not found" popup should disappear
4. Photos should upload and display correctly

## 🔍 VERIFICATION SCRIPT

Run this to verify the fix worked:

```bash
node scripts/test-upload-after-policies.js
```

## 📊 CURRENT BUCKET STATUS

From our investigation:
- `Profile Photos`: 0 files (empty due to blocked uploads)
- `vehicle_photos`: 0 files (empty due to blocked uploads)  
- `user-photos`: 0 files (empty due to blocked uploads)
- `avatars`: 1 file (Barry.png - working because has correct policies)

## 🎯 EXPECTED RESULT

After applying policies:
- ✅ Photos upload successfully
- ✅ Photos display in profile page
- ✅ No more "profile bucket not found" popup
- ✅ Vehicle photos work correctly
- ✅ Profile photo switching works