# URGENT: Fix Profile and Community Issues

## Problems Identified

1. **Profile photos disappearing** - Storage bucket permissions issue
2. **Profile details not saving** - Missing columns in database
3. **"Storage service unavailable" error** - Bucket configuration problem
4. **Community posts not working** - Wrong foreign key references to profiles table
5. **Duplicate UI elements** - Multiple post creation forms showing

## Root Causes

1. The previous migration used incorrect foreign keys (referencing `profiles(id)` instead of `auth.users(id)`)
2. Storage bucket policies are not configured correctly
3. Missing or incorrect RLS policies on profiles table

## Fix Instructions

### Step 1: Run the Corrected Migrations

**IMPORTANT**: Run these migrations IN THIS ORDER:

1. First, fix the profile storage issues:
```bash
# Option A: Using Supabase CLI
npx supabase db push --file supabase/migrations/20250125_fix_profile_storage.sql

# Option B: In Supabase Dashboard SQL Editor
# Copy and paste the contents of 20250125_fix_profile_storage.sql
```

2. Then fix the community tables:
```bash
# Option A: Using Supabase CLI
npx supabase db push --file supabase/migrations/20250125_fix_community_tables_corrected.sql

# Option B: In Supabase Dashboard SQL Editor
# Copy and paste the contents of 20250125_fix_community_tables_corrected.sql
```

### Step 2: Verify Storage Buckets

1. Go to Supabase Dashboard > Storage
2. Check that the `avatars` bucket exists and is PUBLIC
3. If not, create it:
   - Name: `avatars`
   - Public: Yes
   - File size limit: 5MB
   - Allowed MIME types: image/jpeg, image/png, image/gif, image/webp

### Step 3: Clear Browser Cache

After running migrations:
1. Open browser DevTools (F12)
2. Go to Application/Storage tab
3. Clear Site Data
4. Refresh the page

### Step 4: Test Everything

1. **Profile Photo**: 
   - Upload a new profile photo
   - Refresh page - photo should persist

2. **Profile Details**:
   - Add address, city, state, postal code, phone, currency
   - Save changes
   - Refresh page - all data should persist

3. **Community Page**:
   - Create a new post
   - Like a post
   - All features should work

## What These Migrations Fix

### `20250125_fix_profile_storage.sql`:
- Ensures profiles table exists with all needed columns
- Fixes RLS policies for profile updates
- Creates proper storage bucket policies for avatars
- Ensures all users have profile records
- Adds proper indexes for performance

### `20250125_fix_community_tables_corrected.sql`:
- Drops incorrectly created tables (if they exist)
- Recreates tables with correct foreign keys to `auth.users`
- Sets up proper RLS policies
- Creates helper functions for post statistics

## If Issues Persist

1. Check Supabase logs for specific errors:
   - Dashboard > Logs > Postgres Logs

2. Verify user authentication:
   ```sql
   -- Check if your user has a profile
   SELECT * FROM profiles WHERE user_id = 'YOUR_USER_ID';
   ```

3. Test storage directly:
   ```sql
   -- Check storage buckets
   SELECT * FROM storage.buckets;
   ```

## Emergency Rollback

If something goes wrong:
```sql
-- Rollback community tables
DROP TABLE IF EXISTS post_comments CASCADE;
DROP TABLE IF EXISTS post_likes CASCADE;
DROP TABLE IF EXISTS community_posts CASCADE;

-- Note: Don't rollback profile changes as they fix critical issues
```

## Expected Results

After running these migrations:
- ✅ Profile photos will persist
- ✅ All profile fields will save correctly
- ✅ No more "Storage service unavailable" errors
- ✅ Community page will work completely
- ✅ No duplicate UI elements

## Next Steps

1. Run the migrations NOW (they fix critical issues)
2. Test all functionality
3. If any issues remain, check the Supabase logs for specific errors