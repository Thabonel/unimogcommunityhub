# WIS ETL - Quick Next Steps

## ✅ Completed So Far
- [x] Production migrations 1-2 applied (plan/ops tables)
- [x] Storage buckets created (wis-docs, wis-archives, wis-media)

---

## 📋 Immediate Next Steps

### Step 1: Apply Schema Migration (2 minutes)
Via Supabase Dashboard → SQL Editor:

**Migration 3**: `/supabase/migrations/20251012000003_fix_wis_procedures_for_etl.sql`

This adds the missing columns to `wis_procedures`:
- `source_path` (file path tracking)
- `source_url` (storage URL)
- `source_fingerprint` (SHA-256 hash for idempotency)

### Step 2: Apply RLS Policies Migration (1 minute)
Via Supabase Dashboard → SQL Editor:

**Migration 5**: `/supabase/migrations/20251012000005_create_wis_storage_policies.sql`

This creates all RLS policies for the 3 buckets:
- **wis-docs**: Public read, authenticated write, service role all
- **wis-archives**: Premium users read, service role all
- **wis-media**: Public read, authenticated write, service role all

### Step 3: Verify Setup (30 seconds)
Run this SQL to verify everything is ready:

```sql
-- Check wis_procedures schema
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'wis_procedures'
  AND column_name IN ('source_path', 'source_url', 'source_fingerprint')
ORDER BY column_name;

-- Should return 3 rows: source_fingerprint, source_path, source_url

-- Check storage buckets exist
SELECT name, public, file_size_limit
FROM storage.buckets
WHERE name IN ('wis-docs', 'wis-archives', 'wis-media')
ORDER BY name;

-- Should return 3 rows

-- Check RLS policies created
SELECT policyname, cmd
FROM pg_policies
WHERE schemaname = 'storage'
  AND tablename = 'objects'
  AND policyname LIKE 'wis-%'
ORDER BY policyname;

-- Should return 8 rows (8 policies total)
```

---

## 🔄 After Migrations Applied

### Give to Codex:
**Status Document**: `/docs/wis-project/WIS_ETL_IMPLEMENTATION_STATUS.md`
**Fix Instructions**: `/docs/wis-project/ETL_WORKER_FIXES_NEEDED.md`

Codex needs to fix the ETL worker code:
1. Fix `startJob()` - create plan item first, pass `plan_item_id`
2. Fix `updateJob()` - correct all parameter names, add progress tracking
3. Fix `recordError()` - wrap source_path in context object, add severity
4. Update `main()` - calculate total files for progress percentage
5. De-duplicate code - import from `src/etl/wis/` instead of copying

**Time Estimate**: 2-3 hours for Codex

---

## 🧪 Testing After Code Fixes

### Test Command:
```bash
# Small test dataset first
VITE_SUPABASE_URL=https://ydevatqwkoccxhtejdor.supabase.co \
SUPABASE_SERVICE_ROLE_KEY=<SUPABASE_SERVICE_ROLE_KEY> \
npx tsx scripts/run-wis-etl.ts \
  --model U435 \
  --scope procedures \
  --source /Volumes/UnimogManuals/wis-samples
```

### Validation:
```sql
-- Check job created
SELECT * FROM wis_ingest_jobs ORDER BY created_at DESC LIMIT 1;

-- Check procedures inserted
SELECT COUNT(*) FROM wis_procedures WHERE source_fingerprint IS NOT NULL;

-- Check for errors
SELECT * FROM wis_ingest_errors ORDER BY created_at DESC;

-- Verify storage uploads
-- Go to: https://supabase.com/dashboard/project/ydevatqwkoccxhtejdor/storage/buckets/wis-docs
```

---

## 🎯 Success Criteria

Ready when:
- [x] Buckets created
- [ ] Migration 3 applied (schema fixes)
- [ ] Migration 5 applied (RLS policies)
- [ ] All RPC calls use correct signatures (Codex)
- [ ] Test run completes without errors
- [ ] Procedures inserted correctly
- [ ] Files uploaded to storage
- [ ] Idempotent behavior verified (run twice, no duplicates)

---

## 📚 Reference

- **ETL Worker Fixes**: `/docs/wis-project/ETL_WORKER_FIXES_NEEDED.md`
- **Full Status**: `/docs/wis-project/WIS_ETL_IMPLEMENTATION_STATUS.md`
- **Linear Issues**: WHE-27, WHE-28, WHE-29, WHE-30
