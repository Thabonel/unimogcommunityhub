# ETL Worker Fixes Required

**Status**: Migrations ready, code fixes needed
**Related Linear Issues**: WHE-29, WHE-27
**Files to Fix**: `/scripts/run-wis-etl.ts`, `/src/etl/wis/upserts.ts`

## Overview

The ETL worker implementation has RPC signature mismatches that prevent it from working with our infrastructure. This document details the exact fixes needed.

## Prerequisites (COMPLETED)

✅ **Migration 3**: Schema fixes for `wis_procedures` - adds `source_path`, `source_url`, `source_fingerprint` columns
✅ **Migration 4**: Storage buckets created - `wis-docs`, `wis-archives`, `wis-media`

**Apply these migrations before running fixed ETL worker**:
```bash
# Apply to production via Supabase Dashboard
# Migration 3: 20251012000003_fix_wis_procedures_for_etl.sql
# Migration 4: 20251012000004_create_wis_storage_buckets.sql
```

## Problem 1: Job Start RPC Signature Mismatch

### Current Code (WRONG)
**File**: `/scripts/run-wis-etl.ts` lines 54-61

```typescript
async function startJob(): Promise<JobRow> {
  const { data, error } = await supabase.rpc('wis_start_ingest_job', {
    p_model_code: modelCode,  // ❌ Wrong parameter
    p_scope: scope,            // ❌ Wrong parameter
  });
  if (error) throw new Error(`wis_start_ingest_job failed: ${error.message}`);
  return data as JobRow;
}
```

### Correct Infrastructure RPC
**File**: `/supabase/migrations/20251012000002_create_wis_plan_ops.sql`

```sql
create or replace function public.wis_start_ingest_job(
  p_plan_item_id uuid,
  p_job_type text
)
```

### Required Fix

**Step 1**: Add function to create/get plan item first:

```typescript
async function getOrCreatePlanItem(modelCode: string, scope: string): Promise<string> {
  // Create plan item using wis_upsert_plan_item RPC
  const { data, error } = await supabase.rpc('wis_upsert_plan_item', {
    p_model_code: modelCode,
    p_category: scope, // 'procedures', 'bulletins', or 'all'
    p_priority: 1,
    p_source_type: 'local',
    p_estimated_count: null, // Will be updated as we discover files
  });

  if (error) throw new Error(`Failed to create plan item: ${error.message}`);
  return data.id;
}
```

**Step 2**: Update startJob to use plan item ID:

```typescript
async function startJob(planItemId: string): Promise<JobRow> {
  const { data, error } = await supabase.rpc('wis_start_ingest_job', {
    p_plan_item_id: planItemId,
    p_job_type: 'etl_import',
  });
  if (error) throw new Error(`wis_start_ingest_job failed: ${error.message}`);
  return data as JobRow;
}
```

**Step 3**: Update main() to use new flow:

```typescript
async function main() {
  // Create or get plan item
  const planItemId = await getOrCreatePlanItem(modelCode, scope);

  // Start job with plan item ID
  const job = await startJob(planItemId);

  // Rest of ETL logic...
}
```

## Problem 2: Job Update RPC Signature Mismatch

### Current Code (WRONG)
**File**: `/scripts/run-wis-etl.ts` lines 63-72

```typescript
async function updateJob(jobId: string, state: string, checkpoint?: any, lastError?: string) {
  const { error } = await supabase.rpc('wis_update_ingest_job', {
    p_job_id: jobId,
    p_state: state,                // ❌ Should be p_status
    p_checkpoint: checkpoint,      // ❌ Should be p_checkpoint_state
    p_last_error: lastError,       // ❌ Should be p_error_message
    p_mark_time: true,             // ❌ Should be p_error_severity
  });
  if (error) throw new Error(`wis_update_ingest_job failed: ${error.message}`);
}
```

### Correct Infrastructure RPC
**File**: `/supabase/migrations/20251012000002_create_wis_plan_ops.sql`

```sql
create or replace function public.wis_update_ingest_job(
  p_job_id uuid,
  p_status text,
  p_checkpoint_state jsonb default null,
  p_progress_pct integer default null,
  p_error_message text default null,
  p_error_severity text default null
)
```

### Required Fix

```typescript
async function updateJob(
  jobId: string,
  status: string,
  checkpointState?: any,
  progressPct?: number,
  errorMessage?: string,
  errorSeverity?: 'warning' | 'error' | 'critical'
) {
  const { error } = await supabase.rpc('wis_update_ingest_job', {
    p_job_id: jobId,
    p_status: status,                       // ✅ Correct
    p_checkpoint_state: checkpointState,    // ✅ Correct
    p_progress_pct: progressPct,            // ✅ New parameter
    p_error_message: errorMessage,          // ✅ Correct
    p_error_severity: errorSeverity,        // ✅ Correct
  });
  if (error) throw new Error(`wis_update_ingest_job failed: ${error.message}`);
}
```

**Update calls to include progress percentage**:

```typescript
// In main() function
let processedCount = 0;
let totalFiles = 0;

// First pass: count total files
for await (const file of walk(sourceDir)) {
  const ext = path.extname(file).toLowerCase();
  if (['.html', '.json', '.pdf'].includes(ext)) totalFiles++;
}

// Second pass: process files with progress tracking
for await (const file of walk(sourceDir)) {
  // ... process file ...

  processedCount++;
  const progressPct = Math.floor((processedCount / totalFiles) * 100);

  if (processedCount % 5 === 0) {
    await updateJob(
      job.id,
      'running',
      { sourceDir, model: modelCode, index: processedCount, lastFile: file },
      progressPct  // ✅ Include progress percentage
    );
  }
}
```

## Problem 3: Error Recording RPC Signature Mismatch

### Current Code (WRONG)
**File**: `/scripts/run-wis-etl.ts` lines 74-81

```typescript
async function recordError(jobId: string, sourcePath: string, errorType: string, errorMsg: string) {
  await supabase.rpc('wis_record_ingest_error', {
    p_job_id: jobId,
    p_source_path: sourcePath,  // ❌ Should be p_error_context
    p_error_type: errorType,
    p_error_msg: errorMsg,      // ❌ Should be p_error_message
  });
}
```

### Correct Infrastructure RPC
**File**: `/supabase/migrations/20251012000002_create_wis_plan_ops.sql`

```sql
create or replace function public.wis_record_ingest_error(
  p_job_id uuid,
  p_error_type text,
  p_error_message text,
  p_error_context jsonb default null,
  p_severity text default 'error'
)
```

### Required Fix

```typescript
async function recordError(
  jobId: string,
  sourcePath: string,
  errorType: string,
  errorMsg: string,
  severity: 'warning' | 'error' | 'critical' = 'error'
) {
  await supabase.rpc('wis_record_ingest_error', {
    p_job_id: jobId,
    p_error_type: errorType,
    p_error_message: errorMsg,
    p_error_context: {                    // ✅ Wrap source_path in context object
      source_path: sourcePath,
      timestamp: new Date().toISOString(),
    },
    p_severity: severity,                 // ✅ Include severity
  });
}
```

**Update error calls to include appropriate severity**:

```typescript
try {
  // ... process file ...
} catch (e: any) {
  console.error('Process error:', file, e?.message || e);

  // Determine severity based on error type
  const severity = e?.message?.includes('FATAL') ? 'critical' :
                   e?.message?.includes('WARNING') ? 'warning' : 'error';

  await recordError(job.id, file, 'process_error', String(e?.message || e), severity);
}
```

## Problem 4: Same Fixes Needed in `/src/etl/wis/upserts.ts`

The `upserts.ts` file has the same procedure upsert logic duplicated. After fixing `/scripts/run-wis-etl.ts`, update `/src/etl/wis/upserts.ts` to match.

**Or better**: Have `run-wis-etl.ts` import from `upserts.ts` instead of duplicating:

```typescript
// In /scripts/run-wis-etl.ts
import { upsertProcedureMinimal } from '../src/etl/wis/upserts';
import { parseHtmlProcedure } from '../src/etl/wis/parser';
import { sha256File, guessContentType } from '../src/etl/wis/utils';

// Remove duplicate implementations, use imports
```

## Verification Checklist (WHE-27)

After applying fixes:

- [ ] Apply Migration 3 (schema fixes)
- [ ] Apply Migration 4 (storage buckets)
- [ ] Update `startJob()` to use plan item ID
- [ ] Update `updateJob()` to use correct parameters + progress tracking
- [ ] Update `recordError()` to use correct parameters + severity
- [ ] Update `main()` to create plan item first
- [ ] Update `main()` to calculate and report progress percentage
- [ ] De-duplicate code between `run-wis-etl.ts` and `upserts.ts`
- [ ] Test compilation: `npx tsx --check scripts/run-wis-etl.ts`
- [ ] Test dry run on small sample dataset
- [ ] Verify idempotent behavior (run twice, check no duplicates)
- [ ] Check job status and errors in Supabase tables

## Testing Command

After fixes are applied:

```bash
# Test on sample data (Unix/Mac)
VITE_SUPABASE_URL=https://ydevatqwkoccxhtejdor.supabase.co \
SUPABASE_SERVICE_ROLE_KEY=<SUPABASE_SERVICE_ROLE_KEY> \
npx tsx scripts/run-wis-etl.ts \
  --model U435 \
  --scope procedures \
  --source /Volumes/UnimogManuals/wis-samples

# Check results
# 1. Verify job created: SELECT * FROM wis_ingest_jobs ORDER BY created_at DESC LIMIT 1;
# 2. Check procedures: SELECT COUNT(*) FROM wis_procedures WHERE source_fingerprint IS NOT NULL;
# 3. Check errors: SELECT * FROM wis_ingest_errors ORDER BY created_at DESC;
# 4. Verify storage uploads: Check wis-docs bucket in Supabase dashboard
```

## Summary

**Migrations Created** (apply these first):
- ✅ Migration 3: Schema fixes for ETL compatibility
- ✅ Migration 4: Storage buckets with RLS policies

**Code Fixes Required** (Linear WHE-29):
- Fix `startJob()` - create plan item first, pass plan_item_id
- Fix `updateJob()` - correct all 6 parameter names, add progress tracking
- Fix `recordError()` - wrap source_path in context object, add severity
- Update `main()` - calculate total files for progress percentage
- De-duplicate code - import from `src/etl/wis/` files instead of copying

**Estimated Time**: 2-3 hours for code fixes + testing
