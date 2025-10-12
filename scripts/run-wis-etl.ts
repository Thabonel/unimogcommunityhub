#!/usr/bin/env tsx
/**
 * WIS ETL Runner (local CLI)
 * - Processes local source files (HTML manuals, JSON parts)
 * - Uploads originals to Supabase storage with SHA-256 content hashing
 * - Upserts procedures + steps and updates ingest job checkpoints via RPCs
 *
 * Usage examples:
 *   VITE_SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=<SUPABASE_SERVICE_ROLE_KEY> \
 *   tsx scripts/run-wis-etl.ts --model U435 --scope all --source \
 *     /Volumes/UnimogManuals/wis-samples
 */

import { createClient } from '@supabase/supabase-js';
import { promises as fs } from 'fs';
import * as path from 'path';
import { parseHtmlProcedure } from '../src/etl/wis/parser';
import { guessContentType } from '../src/etl/wis/utils';
import { upsertProcedureMinimal } from '../src/etl/wis/upserts';

// Simple arg parsing
const args = process.argv.slice(2);
function getArg(name: string, def?: string) {
  const idx = args.findIndex(a => a === `--${name}`);
  if (idx >= 0 && args[idx + 1]) return args[idx + 1];
  const kv = args.find(a => a.startsWith(`--${name}=`));
  if (kv) return kv.split('=')[1];
  return def;
}

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error('Missing env: VITE_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_KEY, { auth: { persistSession: false } });

const modelCode = getArg('model', 'U435');
const scope = getArg('scope', 'all');
const sourceDir = getArg('source');
const gateEveryStr = getArg('gate-every');
const sampleCountStr = getArg('sample-count');
const resumeJobId = getArg('resume-job');
const gateEvery = gateEveryStr ? parseInt(gateEveryStr, 10) : 0; // 0 = disabled
const sampleCount = sampleCountStr ? parseInt(sampleCountStr, 10) : 12;
if (!sourceDir) {
  console.error('Missing --source <dir>');
  process.exit(1);
}

type JobRow = {
  id: string;
  model_code: string | null;
  scope: string;
  state: string;
  checkpoint: any | null;
};

async function getOrCreatePlanItem(modelCode: string, category: string): Promise<string> {
  const { data, error } = await supabase.rpc('wis_upsert_plan_item', {
    p_model_code: modelCode,
    p_category: category,
    p_priority: 1,
    p_source_type: 'local',
    p_estimated_count: null,
  });
  if (error) throw new Error(`wis_upsert_plan_item failed: ${error.message}`);
  const row: any = Array.isArray(data) ? data[0] : data;
  return row.id;
}

async function startJob(planItemId: string): Promise<JobRow> {
  const { data, error } = await supabase.rpc('wis_start_ingest_job', {
    p_plan_item_id: planItemId,
    p_job_type: 'etl_import',
  });
  if (error) throw new Error(`wis_start_ingest_job failed: ${error.message}`);
  return data as JobRow;
}

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
  if (error) throw new Error(`wis_update_ingest_job failed: ${error.message}`);
}

async function createSamples(model: string | null, jobId: string | null, count: number) {
  const { data, error } = await supabase.rpc('wis_create_samples', {
    p_count: count,
    p_model_code: model,
    p_job_id: jobId,
  });
  if (error) throw new Error(`wis_create_samples failed: ${error.message}`);
  return data as any[];
}

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

async function* walk(dir: string): AsyncGenerator<string> {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      yield* walk(full);
    } else {
      yield full;
    }
  }
}

// guessContentType imported from utils

async function uploadOriginal(filePath: string, model: string, category: 'procedures' | 'bulletins' | 'parts'): Promise<string> {
  const ext = path.extname(filePath).toLowerCase().replace('.', '') || 'bin';
  const code = path.basename(filePath, path.extname(filePath)).replace(/\s+/g, '-').toLowerCase();
  const key = `model/${model}/${category}/${code}.${ext}`;

  const bucket = category === 'procedures' || category === 'bulletins' ? 'wis-docs' : 'wis-archives';
  const body = await fs.readFile(filePath);
  const { data, error } = await supabase.storage.from(bucket).upload(key, body, {
    contentType: guessContentType(filePath),
    upsert: false,
  });
  if (error && !String(error.message).includes('already exists')) throw error;
  const { data: pubUrl } = supabase.storage.from(bucket).getPublicUrl(key);
  return pubUrl.publicUrl;
}

// Using imported parseHtmlProcedure and upsertProcedureMinimal

async function main() {
  const planItemId = await getOrCreatePlanItem(modelCode, scope);
  const job: JobRow = resumeJobId
    ? ({ id: resumeJobId, model_code: modelCode, scope, state: 'running', checkpoint: null } as JobRow)
    : await startJob(planItemId);

  await updateJob(job.id, 'running', { sourceDir, model: modelCode, index: 0, gateEvery, sampleCount, resumed: !!resumeJobId }, 0);

  // Count total files for progress
  let totalFiles = 0;
  for await (const f of walk(sourceDir)) {
    const e = path.extname(f).toLowerCase();
    if (['.html', '.json', '.pdf'].includes(e)) totalFiles++;
  }

  let index = 0;
  let sinceGate = 0;
  try {
    for await (const file of walk(sourceDir)) {
      index++;
      sinceGate++;
      const ext = path.extname(file).toLowerCase();
      try {
        if (ext === '.html') {
          const url = await uploadOriginal(file, modelCode, 'procedures');
          const parsed = await parseHtmlProcedure(file);
          await upsertProcedureMinimal(modelCode, url, file, parsed);
        } else if (ext === '.json') {
          // Parts JSON stub: store original for provenance (archives bucket)
          await uploadOriginal(file, modelCode, 'parts');
          // TODO: parse and upsert wis_parts and wis_procedure_parts if format known
        } else if (ext === '.pdf') {
          await uploadOriginal(file, modelCode, 'procedures');
          // PDF parsing not implemented in minimal runner (handled by later OCR pipeline)
        }
        if (index % 5 === 0) {
          const pct = totalFiles ? Math.min(100, Math.floor((index / totalFiles) * 100)) : null;
          await updateJob(job.id, 'running', { sourceDir, model: modelCode, index, lastFile: file, sinceGate }, pct ?? undefined);
        }
        if (gateEvery > 0 && sinceGate >= gateEvery) {
          const samples = await createSamples(modelCode, job.id, sampleCount);
          const checkpoint = { sourceDir, model: modelCode, index, lastFile: file, sinceGate: 0, gateEvery, sampleCount, await_review: true, samples_created: samples?.length ?? 0 };
          const pct = totalFiles ? Math.min(100, Math.floor((index / totalFiles) * 100)) : null;
          await updateJob(job.id, 'paused', checkpoint, pct ?? undefined);
          console.log(`Paused for review after ${index} files. Created ${samples?.length ?? 0} samples.`);
          console.log(`Review samples in Admin → WIS Management → Samples, then resume job with:\n  tsx scripts/run-wis-etl.ts --model ${modelCode} --scope ${scope} --source ${sourceDir} --gate-every ${gateEvery} --sample-count ${sampleCount} --resume-job ${job.id}`);
          return;
        }
      } catch (e: any) {
        console.error('Process error:', file, e?.message || e);
        const sev = String(e?.message || '').includes('FATAL') ? 'critical' : (String(e?.message || '').includes('WARN') ? 'warning' : 'error');
        await recordError(job.id, file, 'process_error', String(e?.message || e), sev as any);
      }
    }
    await updateJob(job.id, 'completed', { sourceDir, model: modelCode, index }, 100);
    console.log('ETL completed');
  } catch (e: any) {
    await updateJob(job.id, 'failed', { sourceDir, model: modelCode, index }, undefined, String(e?.message || e), 'critical');
    console.error('ETL failed:', e?.message || e);
    process.exit(2);
  }
}

main();
