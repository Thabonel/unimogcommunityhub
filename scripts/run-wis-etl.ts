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
import { createHash } from 'crypto';

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

async function startJob(): Promise<JobRow> {
  const { data, error } = await supabase.rpc('wis_start_ingest_job', {
    p_model_code: modelCode,
    p_scope: scope,
  });
  if (error) throw new Error(`wis_start_ingest_job failed: ${error.message}`);
  return data as JobRow;
}

async function updateJob(jobId: string, state: string, checkpoint?: any, lastError?: string) {
  const { error } = await supabase.rpc('wis_update_ingest_job', {
    p_job_id: jobId,
    p_state: state,
    p_checkpoint: checkpoint ?? null,
    p_last_error: lastError ?? null,
    p_mark_time: true,
  });
  if (error) throw new Error(`wis_update_ingest_job failed: ${error.message}`);
}

async function recordError(jobId: string, sourcePath: string, errorType: string, errorMsg: string) {
  await supabase.rpc('wis_record_ingest_error', {
    p_job_id: jobId,
    p_source_path: sourcePath,
    p_error_type: errorType,
    p_error_msg: errorMsg,
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

async function sha256File(filePath: string): Promise<string> {
  const h = createHash('sha256');
  const buf = await fs.readFile(filePath);
  h.update(buf);
  return h.digest('hex');
}

function guessContentType(p: string): string {
  const ext = path.extname(p).toLowerCase();
  switch (ext) {
    case '.html':
      return 'text/html';
    case '.pdf':
      return 'application/pdf';
    case '.png':
      return 'image/png';
    case '.jpg':
    case '.jpeg':
      return 'image/jpeg';
    case '.json':
      return 'application/json';
    default:
      return 'application/octet-stream';
  }
}

async function uploadOriginal(filePath: string, model: string, category: 'procedures' | 'bulletins' | 'parts'): Promise<string> {
  const contentHash = await sha256File(filePath);
  const ext = path.extname(filePath).toLowerCase().replace('.', '') || 'bin';
  const code = path.basename(filePath, path.extname(filePath)).replace(/\s+/g, '-').toLowerCase();
  const key = `model/${model}/${category}/${code}-${contentHash}.${ext}`;

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

// Very simple HTML extraction: title + ordered list as steps
async function parseHtmlProcedure(filePath: string) {
  const html = await fs.readFile(filePath, 'utf8');
  const titleMatch = html.match(/<h1[^>]*>(.*?)<\/h1>/i) || html.match(/<title[^>]*>(.*?)<\/title>/i);
  const title = titleMatch ? titleMatch[1].replace(/<[^>]+>/g, '').trim() : path.basename(filePath);
  const steps: { step_number: number; instruction: string }[] = [];
  const olMatch = html.match(/<ol[\s\S]*?<\/ol>/i);
  if (olMatch) {
    const items = Array.from(olMatch[0].matchAll(/<li[^>]*>([\s\S]*?)<\/li>/gi));
    items.forEach((m, i) => {
      const text = m[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
      if (text) steps.push({ step_number: i + 1, instruction: text });
    });
  }
  return { title, steps };
}

async function upsertProcedureMinimal(
  model: string,
  sourceUrl: string,
  filePath: string,
  parsed: { title: string; steps: { step_number: number; instruction: string }[] }
) {
  const procedure_code = path.basename(filePath, path.extname(filePath)).slice(0, 40);
  const source_fingerprint = await sha256File(filePath);
  // Insert procedure
  const { data: proc, error: pErr } = await supabase
    .from('wis_procedures')
    .upsert(
      [
        {
          procedure_code,
          title: parsed.title,
          description: null,
          overview: null,
          estimated_time_hours: null,
          difficulty_level: 2,
          labor_category: 'maintenance',
          safety_warnings: [],
          special_notes: null,
          status: 'active',
          source_path: filePath,
          source_url: sourceUrl,
          source_fingerprint,
        },
      ],
      { onConflict: 'source_fingerprint' }
    )
    .select()
    .single();
  if (pErr) throw pErr;
  // Insert steps
  const stepsPayload = parsed.steps.map(s => ({ procedure_id: proc.id, step_number: s.step_number, instruction: s.instruction }));
  if (stepsPayload.length) {
    const { error: sErr } = await supabase.from('wis_procedure_steps').upsert(stepsPayload, { onConflict: 'procedure_id,step_number' });
    if (sErr) throw sErr;
  }
  return proc.id as string;
}

async function main() {
  const job = await startJob();
  await updateJob(job.id, 'running', { sourceDir, model: modelCode, index: 0 });

  let index = 0;
  try {
    for await (const file of walk(sourceDir)) {
      index++;
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
          await updateJob(job.id, 'running', { sourceDir, model: modelCode, index, lastFile: file });
        }
      } catch (e: any) {
        console.error('Process error:', file, e?.message || e);
        await recordError(job.id, file, 'process_error', String(e?.message || e));
      }
    }
    await updateJob(job.id, 'completed', { sourceDir, model: modelCode, index });
    console.log('ETL completed');
  } catch (e: any) {
    await updateJob(job.id, 'failed', { sourceDir, model: modelCode, index }, String(e?.message || e));
    console.error('ETL failed:', e?.message || e);
    process.exit(2);
  }
}

main();

