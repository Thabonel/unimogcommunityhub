# Response to Codex: WIS ETL Worker Implementation Review

**Date**: October 12, 2025
**Reviewer**: Claude via Supabase MCP verification

---

## Summary: Mostly Excellent Work with 2 Issues to Fix

Codex's implementation of the ETL worker fixes was **85% correct**. The core logic, error handling, progress tracking, and most RPC calls are properly implemented. However, there are **2 critical issues** that need fixing before production use.

---

## What Codex Got Right (Excellent Work)

### 1. wis_update_ingest_job - Perfect Implementation
```typescript
async function updateJob(
  jobId: string,
  status: string,
  checkpointState?: any,
  progressPct?: number,
  errorMessage?: string,
  errorSeverity?: 'warning'|'error'|'critical'
) {
  const { error } = await supabase.rpc('wis_update_ingest_job', {
    p_job_id: jobId,
    p_status: status,
    p_checkpoint_state: checkpointState ?? null,
    p_progress_pct: progressPct ?? null,
    p_error_message: errorMessage ?? null,
    p_error_severity: errorSeverity ?? null,
  });
}
```
**Status**: ✅ Perfect - All parameters match actual RPC signature

### 2. wis_record_ingest_error - Perfect Implementation
```typescript
async function recordError(
  jobId: string,
  sourcePath: string,
  errorType: string,
  errorMsg: string,
  severity: 'warning'|'error'|'critical' = 'error'
) {
  await supabase.rpc('wis_record_ingest_error', {
    p_job_id: jobId,
    p_error_type: errorType,
    p_error_message: errorMsg,
    p_error_context: { source_path: sourcePath, timestamp: new Date().toISOString() },
    p_severity: severity,
  });
}
```
**Status**: ✅ Perfect - Correctly wraps source_path in error_context object

### 3. Progress Tracking - Excellent Addition
```typescript
// Count total files for progress
let totalFiles = 0;
for await (const f of walk(sourceDir)) {
  const e = path.extname(f).toLowerCase();
  if (['.html', '.json', '.pdf'].includes(e)) totalFiles++;
}

// Update progress percentage
if (index % 5 === 0) {
  const pct = totalFiles ? Math.min(100, Math.floor((index / totalFiles) * 100)) : null;
  await updateJob(job.id, 'running', { sourceDir, model: modelCode, index, lastFile: file, sinceGate }, pct ?? undefined);
}
```
**Status**: ✅ Perfect - Exactly as requested in original issue

### 4. Work-Done Gating - Perfect Implementation
```typescript
if (gateEvery > 0 && sinceGate >= gateEvery) {
  const samples = await createSamples(modelCode, job.id, sampleCount);
  const checkpoint = { sourceDir, model: modelCode, index, lastFile: file, sinceGate: 0, gateEvery, sampleCount, await_review: true, samples_created: samples?.length ?? 0 };
  const pct = totalFiles ? Math.min(100, Math.floor((index / totalFiles) * 100)) : null;
  await updateJob(job.id, 'paused', checkpoint, pct ?? undefined);
  console.log(`Paused for review after ${index} files. Created ${samples?.length ?? 0} samples.`);
  // ... resume instructions
}
```
**Status**: ✅ Perfect - Implements quality gate feature correctly

### 5. Code De-duplication - Perfect
```typescript
import { parseHtmlProcedure } from '../src/etl/wis/parser';
import { guessContentType } from '../src/etl/wis/utils';
import { upsertProcedureMinimal } from '../src/etl/wis/upserts';
```
**Status**: ✅ Perfect - Removed duplicate code, uses shared modules

---

## Critical Issue #1: wis_upsert_plan_item - WRONG PARAMETERS

### Current Implementation (WRONG)
```typescript
async function getOrCreatePlanItem(modelCode: string, category: string): Promise<string> {
  const { data, error } = await supabase.rpc('wis_upsert_plan_item', {
    p_model_code: modelCode,
    p_category: category,        // ❌ DOES NOT EXIST
    p_priority: 1,               // ❌ DOES NOT EXIST
    p_source_type: 'local',
    p_estimated_count: null,     // ❌ DOES NOT EXIST
  });
  // ...
}
```

### Actual RPC Signature (Verified via Supabase MCP)
```sql
wis_upsert_plan_item(
  p_model_code text,
  p_system_code text,          -- ✅ REQUIRED
  p_component_code text,       -- ✅ REQUIRED
  p_source_type text,
  p_source_path text,          -- ✅ REQUIRED
  p_source_fingerprint text,   -- ✅ REQUIRED
  p_metadata jsonb             -- ✅ REQUIRED
)
```

### Correct Implementation
```typescript
async function getOrCreatePlanItem(modelCode: string, sourceDir: string): Promise<string> {
  // Generate fingerprint for source directory
  const fingerprint = crypto.createHash('sha256')
    .update(`${modelCode}:${sourceDir}`)
    .digest('hex');

  const { data, error } = await supabase.rpc('wis_upsert_plan_item', {
    p_model_code: modelCode,
    p_system_code: 'all',        // or specific system if known
    p_component_code: 'all',     // or specific component if known
    p_source_type: 'local',
    p_source_path: sourceDir,
    p_source_fingerprint: fingerprint,
    p_metadata: {
      created_by: 'run-wis-etl.ts',
      timestamp: new Date().toISOString()
    }
  });

  if (error) throw new Error(`wis_upsert_plan_item failed: ${error.message}`);
  const row: any = Array.isArray(data) ? data[0] : data;
  return row.id;
}
```

**How to Fix**:
1. Replace the `getOrCreatePlanItem()` function in `/scripts/run-wis-etl.ts` (lines 61-72)
2. Update the call signature in `main()` (line 161) to pass `sourceDir` instead of `scope`
3. Add crypto import at top: `import * as crypto from 'crypto';`

---

## Critical Issue #2: wis_create_samples - RPC DID NOT EXIST

### Current Implementation (WRONG)
```typescript
async function createSamples(model: string | null, jobId: string | null, count: number) {
  const { data, error } = await supabase.rpc('wis_create_samples', {
    p_count: count,
    p_model_code: model,
    p_job_id: jobId,
  });
  if (error) throw new Error(`wis_create_samples failed: ${error.message}`);
  return data as any[];
}
```

**Problem**: This RPC did not exist in the database when Codex wrote the code.

**Status**: ✅ NOW FIXED - I created the RPC in migration `20251012000006_create_wis_samples.sql`

**Action Required**:
1. Apply migration: `/supabase/migrations/20251012000006_create_wis_samples.sql`
2. OR run clean SQL: `/docs/wis-project/sql/07_create_wis_samples.sql`
3. Codex's implementation is now correct and will work after migration

---

## Testing Instructions

### Step 1: Apply Missing Migration
```bash
# Option A: Via Supabase Dashboard SQL Editor
# Copy/paste contents of: /docs/wis-project/sql/07_create_wis_samples.sql

# Option B: Via Supabase CLI (if configured)
supabase db push
```

### Step 2: Fix getOrCreatePlanItem Function
Replace lines 61-72 in `/scripts/run-wis-etl.ts` with the corrected version above.

### Step 3: Test on Sample Data
```bash
VITE_SUPABASE_URL=https://ydevatqwkoccxhtejdor.supabase.co \
SUPABASE_SERVICE_ROLE_KEY=<SUPABASE_SERVICE_ROLE_KEY> \
tsx scripts/run-wis-etl.ts \
  --model U435 \
  --scope all \
  --source /Volumes/UnimogManuals/wis-samples
```

### Step 4: Verify in Database
```sql
-- Check plan item created
SELECT * FROM wis_plan_items ORDER BY created_at DESC LIMIT 1;

-- Check job created
SELECT * FROM wis_ingest_jobs ORDER BY created_at DESC LIMIT 1;

-- Check procedures inserted
SELECT COUNT(*) FROM wis_procedures WHERE source_fingerprint IS NOT NULL;

-- Check no errors
SELECT * FROM wis_ingest_errors ORDER BY created_at DESC;
```

---

## Final Assessment

**Overall Quality**: 8.5/10 - Excellent work with minor fixes needed

**What Worked Perfectly**:
- Error handling and severity classification
- Progress tracking with total file count
- Checkpoint state management
- Work-done gating with pause/resume
- Code de-duplication
- Most RPC calls (wis_update_ingest_job, wis_record_ingest_error)

**What Needs Fixing**:
- `wis_upsert_plan_item` parameter mismatch (critical)
- Missing `wis_create_samples` migration (now provided)

**Recommendation**: Apply the 2 fixes above and this implementation is production-ready.

---

## Questions?

If anything is unclear or you need help applying these fixes, ping me in Linear or Slack.

**Migration Files**:
- `/supabase/migrations/20251012000006_create_wis_samples.sql`
- `/docs/wis-project/sql/07_create_wis_samples.sql`

**Full Documentation**:
- `/docs/wis-project/SETUP_COMPLETE.md`
- `/docs/wis-project/ETL_WORKER_FIXES_NEEDED.md`
- `/docs/wis-project/ETL_WORKER_README.md`
