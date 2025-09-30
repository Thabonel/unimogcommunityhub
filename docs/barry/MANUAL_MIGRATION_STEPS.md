# Manual Storage Migration Execution Guide

## Current Status
- ✅ **Storage buckets exist**: `Profile Photos`, `vehicle_photos`, `user-photos`, `avatars`
- ❌ **Missing bucket**: `profile_photos` (fallback bucket)
- ❌ **RLS policies**: Need to be applied manually (API limitations)

## Required Manual Steps

### Step 1: Execute SQL via Supabase Dashboard (REQUIRED)

**This is the only reliable method to apply RLS policies and bucket configurations.**

1. **Navigate to Supabase Dashboard**:
   ```
   https://supabase.com/dashboard/project/ydevatqwkoccxhtejdor
   ```

2. **Go to SQL Editor**:
   - Click "SQL Editor" in the left sidebar
   - Click "New query"

3. **Copy and Execute Migration**:
   - Copy the ENTIRE content from: `execute_storage_migration.sql`
   - Paste into the SQL Editor
   - Click "Run" button

### Step 2: Verify Execution

After running the migration, verify these components:

#### A. Check Storage Buckets
Navigate to **Storage** → **Buckets** and verify:
- ✅ `Profile Photos` (public, 50MB limit, image types)
- ✅ `profile_photos` (fallback, public, 50MB limit, image types) 
- ✅ `vehicle_photos` (public, 50MB limit, image types)
- ✅ `user-photos` (public, 50MB limit, image types)
- ✅ `avatars` (public, 50MB limit, image types)

#### B. Check RLS Policies
Navigate to **Authentication** → **Policies** and verify policies exist for:

**storage.objects table policies:**
- `Profile Photos_upload_policy` - Allow authenticated users to upload
- `Profile Photos_read_policy` - Allow public read access
- `Profile Photos_update_policy` - Allow users to update own files
- `Profile Photos_delete_policy` - Allow users to delete own files
- (Similar policies for all other buckets)

### Step 3: Test Photo Upload

Run this test script to verify functionality:

```bash
node scripts/test-upload-after-policies.js
```

## Alternative Methods (if Dashboard not available)

### Method A: Supabase CLI
```bash
# Install Supabase CLI (if not installed)
npm install -g supabase

# Login to Supabase
supabase login

# Link project (if not linked)
supabase link --project-ref ydevatqwkoccxhtejdor

# Execute migration
supabase db query --file execute_storage_migration.sql
```

### Method B: Direct Database Connection
If you have direct PostgreSQL access:
```bash
psql "postgresql://postgres:[password]@db.ydevatqwkoccxhtejdor.supabase.co:5432/postgres" \
     -f execute_storage_migration.sql
```

## What the Migration Does

The `execute_storage_migration.sql` file will:

1. **Enable RLS** on storage.objects table
2. **Create/Update Buckets** with proper MIME types and size limits:
   - Profile Photos (with space, capitals)
   - profile_photos (lowercase fallback)  
   - vehicle_photos
   - user-photos
   - avatars

3. **Drop Conflicting Policies** (clean slate)
4. **Create Comprehensive Policies** for each bucket:
   - Upload: Authenticated users only
   - Read: Public access
   - Update/Delete: Owner only

5. **Grant Permissions**:
   - Storage schema access for anon/authenticated
   - Table permissions for storage operations

6. **Refresh Schema Cache** for immediate effect

## Troubleshooting

### If Migration Fails Partially:
1. Check error messages in SQL Editor
2. Run individual sections of the migration
3. Verify service role key has admin privileges

### If Upload Still Fails After Migration:
1. Check bucket exists: `supabase storage ls`
2. Verify policies: Authentication → Policies 
3. Test with different bucket names
4. Check browser console for specific errors

### Environment Variables Required:
```bash
VITE_SUPABASE_URL=https://ydevatqwkoccxhtejdor.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key  # For admin operations
```

## After Migration Checklist

- [ ] All 5 storage buckets exist with correct settings
- [ ] RLS is enabled on storage.objects
- [ ] 20+ policies created for storage access
- [ ] Photo upload works in application
- [ ] No console errors during upload
- [ ] Files are publicly accessible via URL

## Support Files Created:
- ✅ `scripts/execute-storage-migration.js` - Automated attempt (API limited)
- ✅ `execute_migration_via_cli.sh` - CLI execution method  
- ✅ `MANUAL_MIGRATION_STEPS.md` - This guide
- ✅ `execute_storage_migration.sql` - Complete migration SQL

**Next Action Required**: Execute the SQL migration via Supabase Dashboard SQL Editor as described in Step 1 above.