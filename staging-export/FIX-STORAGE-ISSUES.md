# Fix Storage Initialization Issues

## Problem
The app shows "Storage initialization failed. Image uploads might not work properly." This is because the storage buckets don't exist in Supabase and cannot be created due to RLS policies.

## Solution

### Step 1: Run SQL in Supabase Dashboard

1. Go to your Supabase Dashboard
2. Navigate to SQL Editor
3. Copy and paste the contents of `scripts/init-storage-buckets.sql`
4. Click "Run" to execute the SQL

This will:
- Temporarily disable RLS on the buckets table
- Create all required storage buckets
- Re-enable RLS with proper policies
- Set up proper permissions for file uploads

### Step 2: Verify Storage Setup

Run the test script to verify everything is working:

```bash
node scripts/test-storage-setup.js
```

You should see all buckets created successfully.

### Step 3: Clear Browser Cache

1. Open Developer Tools (F12)
2. Go to Application tab
3. Clear Local Storage for your app
4. Refresh the page

## Required Buckets

The app needs these storage buckets:
- `avatars` - User profile pictures
- `profile_photos` - Additional profile images
- `vehicle_photos` - Unimog vehicle images
- `manuals` - PDF manuals (private)
- `article_files` - Article attachments
- `site_assets` - General site assets

## Troubleshooting

If you still see errors:

1. **Check Supabase Dashboard**
   - Go to Storage section
   - Verify all buckets are listed
   - Check that policies are enabled

2. **Check Environment Variables**
   - Ensure `.env` has correct `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
   - Restart the dev server after changing `.env`

3. **Check Browser Console**
   - Look for specific error messages
   - Check Network tab for failed requests to Supabase

## Map Flashing Issue

The trip planner map flashing has been fixed by:
- Preventing re-initialization when dependencies change
- Using lazy initialization for state
- Excluding unstable dependencies from useEffect
- Properly checking if map already exists before creating new one