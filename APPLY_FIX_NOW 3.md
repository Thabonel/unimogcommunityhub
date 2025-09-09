# 🚨 IMMEDIATE FIX REQUIRED

## The Problem
You're experiencing "Invalid API key" errors because your Supabase database is missing required tables and storage buckets.

## Quick Fix (Do This Now!)

### Step 1: Apply Database Fix
1. Open your Supabase Dashboard: https://supabase.com/dashboard
2. Select your project (ydevatqwkoccxhtejdor)
3. Go to **SQL Editor** (left sidebar)
4. Click **New Query**
5. Copy ALL contents from: `supabase/migrations/20250109_fix_auth_and_storage_safe.sql` (USE THE SAFE VERSION!)
6. Paste into the query editor
7. Click **Run** button
8. You should see "Migration completed successfully!" message

### Step 2: Clear Browser Data
1. Open Chrome DevTools (F12)
2. Go to **Application** tab
3. Click **Clear Storage** on the left
4. Check all boxes
5. Click **Clear site data**

### Step 3: Restart Development Server
```bash
# Stop the server (Ctrl+C)
# Start fresh
npm run dev
```

### Step 4: Test Login
Try logging in again. The "Invalid API key" error should be gone.

## What Was Fixed
✅ Removed 50+ duplicate Supabase client files
✅ Standardized all imports to use single Supabase client
✅ Added session clearing for corrupted auth
✅ Fixed infinite re-render loops in profile hooks
✅ Fixed memory leak in vehicle dashboard
✅ Created SQL migration for missing database tables

## If Still Having Issues
The migration script fixes:
- Missing storage buckets (profile_photos, avatars, etc.)
- Missing user_activities table
- Missing user_subscriptions table
- Row Level Security policies
- Profile table missing columns

## Files Changed
- `src/contexts/AuthContext.tsx` - Added session clearing
- `src/hooks/profile/use-profile-fetcher.ts` - Fixed imports
- `src/hooks/vehicle-maintenance/useFetchVehicles.ts` - Fixed memory leak
- All 162 files with incorrect imports - Fixed to use @/lib/supabase-client

## Next Steps
After applying the SQL migration, your app should work properly. The profile page will load, and you can log in without errors.