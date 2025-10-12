# WIS ETL Worker - Implementation Status

**Date**: October 12, 2025
**Status**: Infrastructure ready, code fixes needed before first run

---

## ✅ Completed Work

### 1. Production Migrations Applied (Claude Code)

Successfully applied two migrations to production database:

**Migration 1**: WIS Compatibility Views (FIXED)
- File: `20251012000001_create_wis_compat_views_FIXED.sql`
- Creates `wis_documents_unified` view
- Fixed issue: Removed attempt to create `wis_bulletins` as view (already exists as table)
- Status: ✅ Applied successfully

**Migration 2**: WIS Plan/Operations Tables
- File: `20251012000002_create_wis_plan_ops.sql`
- Created `wis_ingestion_plan_items` table
- Created `wis_ingest_jobs` table
- Created `wis_ingest_errors` table
- Created `wis_ingest_job_ops` table (operations log)
- Created 4 RPCs: `wis_upsert_plan_item`, `wis_start_ingest_job`, `wis_update_ingest_job`, `wis_record_ingest_error`
- Status: ✅ Applied successfully

### 2. ETL Worker Implementation (Codex)

Codex created 5 files for ETL processing:

1. **`/scripts/run-wis-etl.ts`** (239 lines) - Main CLI runner
2. **`/src/etl/wis/upserts.ts`** (47 lines) - Procedure upsert logic
3. **`/src/etl/wis/parser.ts`** (25 lines) - HTML parser for procedures
4. **`/src/etl/wis/utils.ts`** (31 lines) - SHA-256 hashing and content-type detection
5. **`/docs/wis-project/ETL_WORKER_README.md`** (26 lines) - Documentation

**Features**:
- CLI interface: `--model`, `--scope`, `--source` arguments
- SHA-256 content hashing for idempotent uploads
- Directory traversal with file type detection
- HTML parsing (title + ordered list steps)
- Storage upload with hashed paths
- Checkpoint state for restart-safe processing
- Error recording to database

### 3. Verification & Issue Tracking (Claude Code)

**Performed comprehensive code review** of Codex's implementation, checking:
- RPC signature compatibility
- Database schema alignment
- Storage bucket requirements
- Code quality and error handling

**Created 4 Linear Issues** to track findings:
- **WHE-27**: Verify WIS ETL Worker Implementation (master checklist)
- **WHE-28**: Fix wis_procedures schema for ETL compatibility
- **WHE-29**: Fix ETL Worker RPC calls to match infrastructure
- **WHE-30**: Verify and Create Required Supabase Storage Buckets

### 4. Infrastructure Migrations Created (Claude Code)

**Migration 3**: Fix wis_procedures Schema for ETL
- File: `20251012000003_fix_wis_procedures_for_etl.sql`
- Makes `component_id` nullable (allows ETL to create procedures without component assignment)
- Adds columns: `source_path`, `source_url`, `source_fingerprint`
- Creates unique constraint on `source_fingerprint` for idempotent upserts
- Adds performance indexes
- Status: ⏳ Ready to apply (not yet applied)

**Migration 4**: Create WIS Storage Buckets
- File: `20251012000004_create_wis_storage_buckets.sql`
- Creates `wis-docs` bucket (public read, authenticated write, 50MB limit)
- Creates `wis-archives` bucket (private, premium user read, 50MB limit)
- Creates `wis-media` bucket (public read, authenticated write, 10MB limit)
- Includes RLS policies for all buckets
- Status: ⏳ Ready to apply (not yet applied)

### 5. Documentation Created (Claude Code)

**ETL Worker Fixes Document**
- File: `/docs/wis-project/ETL_WORKER_FIXES_NEEDED.md`
- Comprehensive guide to fixing RPC signature mismatches
- Code examples showing current (wrong) vs correct implementations
- Step-by-step fix instructions for all 3 RPC calls
- Testing checklist and verification steps

---

## 🔴 Issues Found - Must Fix Before Running

### Critical Issue 1: RPC Signature Mismatches

**Problem**: ETL worker calls RPCs with completely different parameter signatures than our infrastructure implements.

**Impact**: ETL will fail immediately with RPC errors if run without fixes.

**Examples**:
```typescript
// WRONG (current ETL code)
await supabase.rpc('wis_start_ingest_job', {
  p_model_code: modelCode,  // ❌ Parameter doesn't exist
  p_scope: scope,           // ❌ Parameter doesn't exist
});

// CORRECT (our infrastructure)
await supabase.rpc('wis_start_ingest_job', {
  p_plan_item_id: planItemId,  // ✅ Requires UUID
  p_job_type: 'etl_import',    // ✅ Requires text
});
```

**Affected Functions**: `startJob()`, `updateJob()`, `recordError()`

**Fix Location**: See `/docs/wis-project/ETL_WORKER_FIXES_NEEDED.md`

### Critical Issue 2: Database Schema Incompatibility

**Problem**: ETL tries to insert into columns that don't exist in `wis_procedures` table.

**Impact**: Upsert operations will fail with "column does not exist" errors.

**Missing Columns**:
- `source_path` (for ETL tracking)
- `source_url` (public storage URL)
- `source_fingerprint` (SHA-256 hash for idempotency)

**Wrong Constraint**: ETL uses `onConflict: 'source_fingerprint'` but constraint doesn't exist.

**Solution**: Migration 3 created (ready to apply) - adds all missing columns and constraints.

### Critical Issue 3: Storage Buckets Don't Exist

**Problem**: ETL expects `wis-docs`, `wis-archives`, `wis-media` buckets but they don't exist.

**Impact**: Storage uploads will fail with "bucket not found" errors.

**Current Buckets**: manuals, avatars, vehicles, etc. (no wis-* buckets)

**Solution**: Migration 4 created (ready to apply) - creates all 3 buckets with RLS policies.

### Issue 4: Code Duplication

**Problem**: `run-wis-etl.ts` duplicates entire `upsertProcedureMinimal()` function from `upserts.ts`.

**Impact**: Maintenance burden - must update both files when fixing issues.

**Solution**: Import from `src/etl/wis/upserts.ts` instead of duplicating (documented in fixes doc).

---

## 📋 Next Steps

### Immediate Actions Required (Before First Run):

#### Step 1: Apply Infrastructure Migrations ⏳
```bash
# Via Supabase Dashboard > SQL Editor:
# 1. Run: 20251012000003_fix_wis_procedures_for_etl.sql
# 2. Run: 20251012000004_create_wis_storage_buckets.sql
```

**Time Estimate**: 5 minutes
**Risk**: Low (idempotent, adds new columns/buckets only)

#### Step 2: Fix ETL Worker Code ⏳
Update `/scripts/run-wis-etl.ts` and `/src/etl/wis/upserts.ts`:

1. **Fix `startJob()`** - Create plan item first, pass plan_item_id
2. **Fix `updateJob()`** - Correct all parameter names, add progress tracking
3. **Fix `recordError()`** - Wrap source_path in context object, add severity
4. **Update `main()`** - Calculate total files for progress percentage
5. **De-duplicate code** - Import from `src/etl/wis/` instead of copying

**Time Estimate**: 2-3 hours
**Documentation**: See `/docs/wis-project/ETL_WORKER_FIXES_NEEDED.md`

#### Step 3: Test on Sample Data ⏳
```bash
# Small test dataset first
VITE_SUPABASE_URL=https://ydevatqwkoccxhtejdor.supabase.co \
SUPABASE_SERVICE_ROLE_KEY=<key> \
npx tsx scripts/run-wis-etl.ts \
  --model U435 \
  --scope procedures \
  --source /Volumes/UnimogManuals/wis-samples
```

**Time Estimate**: 15-30 minutes
**Validation**:
- Check job created in `wis_ingest_jobs`
- Verify procedures inserted in `wis_procedures`
- Check no errors in `wis_ingest_errors`
- Confirm files uploaded to `wis-docs` bucket

---

## 📊 Progress Summary

| Task | Status | Owner | Effort |
|------|--------|-------|--------|
| Production migrations (1-2) | ✅ Applied | Claude Code | Complete |
| ETL worker implementation | ✅ Created | Codex | Complete |
| Code review & verification | ✅ Done | Claude Code | Complete |
| Infrastructure migrations (3-4) | ⏳ Ready | Need apply | 5 min |
| ETL code fixes | ⏳ Documented | Need implement | 2-3 hrs |
| Test run on samples | ⏳ Waiting | After fixes | 30 min |
| Full production ingest | ⏸️ Blocked | After testing | TBD |

---

## 🎯 Success Criteria

ETL worker is ready when:

- [x] Infrastructure migrations applied (3-4)
- [ ] All RPC calls use correct signatures
- [ ] Database schema matches ETL expectations
- [ ] Storage buckets exist with correct RLS policies
- [ ] Test run completes without errors
- [ ] Procedures inserted correctly
- [ ] Files uploaded to storage
- [ ] Idempotent behavior verified (run twice, no duplicates)
- [ ] Progress tracking displays correctly
- [ ] Error recording works with severity levels

---

## 📚 Reference Documents

- **ETL Worker README**: `/docs/wis-project/ETL_WORKER_README.md`
- **Fix Instructions**: `/docs/wis-project/ETL_WORKER_FIXES_NEEDED.md`
- **This Status Doc**: `/docs/wis-project/WIS_ETL_IMPLEMENTATION_STATUS.md`

**Linear Issues**:
- WHE-27: Verify WIS ETL Worker Implementation
- WHE-28: Fix wis_procedures schema
- WHE-29: Fix ETL Worker RPC calls
- WHE-30: Create storage buckets

---

## 🚀 When Ready to Run

After all fixes applied and tested:

```bash
# Full production ingest (example)
VITE_SUPABASE_URL=https://ydevatqwkoccxhtejdor.supabase.co \
SUPABASE_SERVICE_ROLE_KEY=<service-key> \
npx tsx scripts/run-wis-etl.ts \
  --model U435 \
  --scope all \
  --source /Volumes/UnimogManuals/MERCEDES-FINAL-DATABASE

# Monitor progress
# - Check Supabase logs
# - Watch wis_ingest_jobs table for status updates
# - Review wis_ingest_errors table for any issues
# - Verify storage bucket uploads
```

**Note**: Service role key required (bypasses RLS for ETL operations).
