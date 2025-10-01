# Deploy Community Page Fix

## Issue Summary
The Community page is completely broken due to:
1. Missing `community_posts` table
2. Missing `post_likes` table  
3. Missing `post_comments` table
4. Missing address fields in profiles table
5. Wrong table references in code (using `posts` instead of `community_posts`)

## What's Been Fixed
1. ✅ Created migration file: `20250125_fix_community_tables.sql`
   - Creates `community_posts` table with proper structure
   - Creates `post_likes` table for like functionality
   - Creates `post_comments` table for comments
   - Adds necessary indexes for performance
   - Sets up RLS policies for security

2. ✅ Created migration file: `20250125_add_address_fields_to_profiles.sql`
   - Adds missing address fields to profiles table
   - Adds currency field for user preferences

3. ✅ Updated all code references from `posts` to `community_posts` in:
   - `/src/services/post/postQueryService.ts`
   - `/src/services/post/postCreationService.ts`
   - `/src/hooks/use-search-results.ts`
   - `/src/services/analytics/engagementMetricsService.ts`
   - `/src/services/analytics/metrics/contentMetrics.ts`
   - `/src/services/offline/offlineSync.ts`

## Deployment Steps

### Step 1: Deploy Database Migrations

#### Option A: Using Supabase CLI
```bash
# Deploy both migrations
npx supabase db push
# Enter your database password when prompted
```

#### Option B: Using Supabase Dashboard
1. Go to: https://supabase.com/dashboard/project/ydevatqwkoccxhtejdor
2. Navigate to SQL Editor
3. Run each migration file in order:
   - First: `20250125_fix_community_tables.sql`
   - Second: `20250125_add_address_fields_to_profiles.sql`

### Step 2: Verify Database Changes
1. Go to Table Editor in Supabase Dashboard
2. Verify these tables exist:
   - `community_posts` (with columns: id, title, content, author_id, tags, image_url, category, created_at, updated_at)
   - `post_likes` (with columns: id, post_id, user_id, created_at)
   - `post_comments` (with columns: id, post_id, user_id, content, created_at, updated_at)
3. Verify `profiles` table has new columns:
   - street_address, city, state, postal_code, phone_number, currency

### Step 3: Test the Application
1. Navigate to the Community page
2. Test creating a new post
3. Test liking posts
4. Test commenting on posts (when UI is implemented)
5. Test saving address/currency in profile settings

## Expected Results
After deployment:
- ✅ Community feed will load properly
- ✅ Users can create posts
- ✅ Like functionality will work
- ✅ Comment system will be ready (needs UI implementation)
- ✅ Profile address/currency fields will save

## Rollback Plan
If issues occur, you can rollback by:
```sql
-- Drop the new tables (careful - this will delete data!)
DROP TABLE IF EXISTS post_comments CASCADE;
DROP TABLE IF EXISTS post_likes CASCADE;
DROP TABLE IF EXISTS community_posts CASCADE;

-- Remove address fields from profiles
ALTER TABLE profiles 
DROP COLUMN IF EXISTS street_address,
DROP COLUMN IF EXISTS city,
DROP COLUMN IF EXISTS state,
DROP COLUMN IF EXISTS postal_code,
DROP COLUMN IF EXISTS phone_number,
DROP COLUMN IF EXISTS currency;
```

## Notes
- The code is already updated to use the correct table names
- All necessary indexes and RLS policies are included
- The migration is idempotent (can be run multiple times safely)