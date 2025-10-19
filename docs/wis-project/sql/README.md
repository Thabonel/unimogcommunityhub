# WIS ETL Setup - SQL Scripts

Clean SQL files to run in Supabase Dashboard SQL Editor.

## Prerequisites

✅ Storage buckets created: `wis-docs`, `wis-archives`, `wis-media`

## Run in Order

### Step 1: Schema Fixes
**File**: `01_fix_wis_procedures_schema.sql`

Adds columns to `wis_procedures` table for ETL tracking:
- `source_path` - Local file path
- `source_url` - Storage URL
- `source_fingerprint` - SHA-256 hash for idempotency

### Step 2: RLS Policies

Run these in any order (they're independent):

**File**: `02_wis_docs_bucket_policies.sql`
- Public read access
- Authenticated users can upload
- Service role full access

**File**: `03_wis_archives_bucket_policies.sql`
- Premium users can read
- Service role full access

**File**: `04_wis_media_bucket_policies.sql`
- Public read access
- Authenticated users can upload
- Service role full access

## Verification

After running all scripts:

```sql
-- Check schema changes
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'wis_procedures'
  AND column_name IN ('source_path', 'source_url', 'source_fingerprint');

-- Should return 3 rows

-- Check policies created
SELECT policyname
FROM pg_policies
WHERE schemaname = 'storage'
  AND tablename = 'objects'
  AND policyname LIKE 'wis-%'
ORDER BY policyname;

-- Should return 8 rows
```

### Step 3: Security Fixes (Views)

**File**: `05_fix_security_issues.sql`

Fixes Supabase linter security errors for views:
- Removes anon access to `signup_health_check` (was exposing auth.users)
- Recreates views with `SECURITY INVOKER` instead of `SECURITY DEFINER`
- Restricts `signup_health_check` to service_role only (admin monitoring)

### Step 4: Security Fixes (Functions)

**File**: `06_fix_function_search_paths.sql`

Fixes search_path security warnings for 20 functions:
- Sets `search_path = ''` on all flagged functions
- Prevents search_path hijacking attacks
- Applies to: WIS functions, notification functions, utility functions

### Step 5: WIS Samples Infrastructure ✅

**File**: `07_create_wis_samples.sql` - **APPLIED**

Creates quality gate infrastructure for ETL work-done gating:
- `wis_samples` table - stores random procedure samples for review
- `wis_create_samples(p_count, p_model_code, p_job_id)` RPC
- RLS policies for authenticated users
- Indexes on job_id, status, procedure_id

**Purpose**: Enables pausing ETL jobs after N files to review random samples before continuing.

## Verification

After running Step 5:

```sql
-- Check wis_samples table created
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'wis_samples'
ORDER BY ordinal_position;

-- Should return 8 columns

-- Check wis_create_samples RPC exists
SELECT routine_name, routine_type
FROM information_schema.routines
WHERE routine_schema = 'public'
  AND routine_name = 'wis_create_samples';

-- Should return 1 row (function)
```

## Next Steps

After migrations:
1. Verify no security issues: Run Supabase linter again
2. Give Codex the ETL worker fixes: `/docs/wis-project/CODEX_RESPONSE.md`
3. Apply Codex fixes to `/scripts/run-wis-etl.ts`
4. Test ETL worker on sample data
5. Run full production ingest
