# WIS ETL: Ready for Production Testing

**Date**: October 12, 2025
**Status**: 100% Complete - Ready for Testing

---

## Quick Summary

All infrastructure setup and code fixes are complete. The WIS ETL worker is ready for production testing.

**Setup Status**: ✅ 100% Complete
**Code Status**: ✅ 100% Complete
**Testing Status**: ⏳ Ready to Begin

---

## What Was Completed

### Infrastructure (100%)
- ✅ Database schema migrations (wis_procedures, plan items, jobs, errors)
- ✅ wis_samples table for quality gates
- ✅ Storage buckets (wis-docs, wis-archives, wis-media)
- ✅ RLS policies for all buckets
- ✅ All security issues fixed (0 warnings from Supabase linter)

### ETL Worker Code (100%)
- ✅ All RPC calls use correct signatures
- ✅ wis_update_ingest_job - Perfect
- ✅ wis_record_ingest_error - Perfect
- ✅ wis_upsert_plan_item - Fixed by Codex
- ✅ wis_create_samples - Migration applied
- ✅ Progress tracking implemented
- ✅ Work-done gating with sample creation
- ✅ Error handling with severity levels
- ✅ Code de-duplication complete

---

## Testing Commands

### Basic Test (Small Sample Dataset)

```bash
VITE_SUPABASE_URL=https://ydevatqwkoccxhtejdor.supabase.co \
SUPABASE_SERVICE_ROLE_KEY=<service-key> \
tsx scripts/run-wis-etl.ts \
  --model U435 \
  --scope all \
  --source /Volumes/UnimogManuals/wis-samples
```

### With Work-Done Gating

Pause after 25 files, create 12 samples for review:

```bash
VITE_SUPABASE_URL=https://ydevatqwkoccxhtejdor.supabase.co \
SUPABASE_SERVICE_ROLE_KEY=<service-key> \
tsx scripts/run-wis-etl.ts \
  --model U435 \
  --scope all \
  --source /Volumes/UnimogManuals/wis-samples \
  --gate-every 25 \
  --sample-count 12
```

When paused, review samples in Admin → WIS Management → Samples, then resume:

```bash
tsx scripts/run-wis-etl.ts \
  --model U435 \
  --scope all \
  --source /Volumes/UnimogManuals/wis-samples \
  --gate-every 25 \
  --sample-count 12 \
  --resume-job <JOB_ID>
```

### Full Production Ingest

Once testing passes:

```bash
VITE_SUPABASE_URL=https://ydevatqwkoccxhtejdor.supabase.co \
SUPABASE_SERVICE_ROLE_KEY=<service-key> \
tsx scripts/run-wis-etl.ts \
  --model U435 \
  --scope all \
  --source /Volumes/UnimogManuals/MERCEDES-FINAL-DATABASE
```

---

## Validation Queries

Run these queries to verify the ETL is working correctly:

```sql
-- Check plan item created with fingerprint
SELECT
  model_code,
  system_code,
  component_code,
  source_type,
  source_path,
  source_fingerprint,
  created_at
FROM wis_plan_items
ORDER BY created_at DESC
LIMIT 1;

-- Check job created and running
SELECT
  id,
  plan_item_id,
  job_type,
  status,
  progress_pct,
  checkpoint,
  created_at,
  updated_at
FROM wis_ingest_jobs
ORDER BY created_at DESC
LIMIT 1;

-- Check procedures inserted with source tracking
SELECT
  COUNT(*) as total_procedures,
  COUNT(source_fingerprint) as with_fingerprint,
  COUNT(DISTINCT source_path) as unique_sources
FROM wis_procedures;

-- Check samples created (if using gating)
SELECT
  ws.id,
  ws.status,
  ws.created_at,
  wp.title as procedure_title,
  wij.id as job_id
FROM wis_samples ws
JOIN wis_procedures wp ON ws.procedure_id = wp.id
JOIN wis_ingest_jobs wij ON ws.job_id = wij.id
ORDER BY ws.created_at DESC
LIMIT 10;

-- Check for errors
SELECT
  error_type,
  error_message,
  severity,
  error_context,
  created_at
FROM wis_ingest_errors
ORDER BY created_at DESC
LIMIT 10;
```

---

## Monitoring During Testing

### In Admin Dashboard
Navigate to: `/admin` → WIS Management

- **Jobs Tab**: Monitor job progress, status, checkpoint state
- **Samples Tab**: Review randomly selected procedures (if using gating)
- **Errors Tab**: Check for any processing errors

### In Database
Watch the `wis_ingest_jobs` table:

```sql
-- Live progress monitoring (run repeatedly)
SELECT
  id,
  status,
  progress_pct,
  (checkpoint->>'index')::int as files_processed,
  (checkpoint->>'sinceGate')::int as since_last_gate,
  updated_at
FROM wis_ingest_jobs
WHERE status IN ('running', 'paused')
ORDER BY updated_at DESC;
```

---

## Expected Behavior

### Successful Run
1. **Plan Item Created**: Single entry in `wis_plan_items` with fingerprint
2. **Job Started**: Entry in `wis_ingest_jobs` with `status = 'running'`
3. **Progress Updates**: `progress_pct` increases, checkpoint updates every 5 files
4. **Procedures Inserted**: Entries in `wis_procedures` with `source_fingerprint`
5. **Job Completed**: Final status `status = 'completed'`, `progress_pct = 100`

### With Work-Done Gating
1. After N files: Job pauses (`status = 'paused'`)
2. Samples created in `wis_samples` table
3. Review samples in Admin UI
4. Resume with `--resume-job <JOB_ID>`
5. Job continues from checkpoint

### Idempotent Behavior
- Re-running same files should skip duplicates (based on `source_fingerprint`)
- No duplicate procedures should be created
- Plan item should be reused if fingerprint matches

---

## Success Criteria

Before production ingest:

**Test Run**:
- [ ] Test run completes successfully on sample data
- [ ] No errors in `wis_ingest_errors` table
- [ ] All procedures have `source_fingerprint` populated
- [ ] Progress tracking shows accurate percentages

**Idempotency**:
- [ ] Re-running same files doesn't create duplicates
- [ ] Fingerprint-based deduplication works correctly

**Work-Done Gating** (if enabled):
- [ ] Job pauses after specified file count
- [ ] Samples are created successfully
- [ ] Resume functionality works correctly
- [ ] Checkpoint state is preserved

**Error Handling**:
- [ ] File-level errors don't stop entire job
- [ ] Errors are logged with proper severity
- [ ] Job continues processing remaining files

---

## Documentation

- **Full Setup**: `/docs/wis-project/SETUP_COMPLETE.md`
- **Codex Feedback**: `/docs/wis-project/CODEX_RESPONSE.md`
- **SQL Files**: `/docs/wis-project/sql/` (all 7 files applied)
- **ETL Worker**: `/scripts/run-wis-etl.ts`
- **Admin UI**: `/src/pages/admin/WISManagementPage.tsx`

---

## Contact

If issues arise during testing:
- Check `wis_ingest_errors` table first
- Review job checkpoint state in `wis_ingest_jobs`
- Consult documentation in `/docs/wis-project/`

**Ready to test!** 🚀
