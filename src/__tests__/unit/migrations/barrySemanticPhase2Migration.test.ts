import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const migrationPath = resolve(
  process.cwd(),
  'supabase/migrations/20260728000000_barry_semantic_phase2.sql',
);
const migration = readFileSync(migrationPath, 'utf8');

const phase2Tables = [
  'barry_backfill_runs',
  'barry_documents',
  'barry_evidence_units',
];

const legacyTables = [
  'manual_chunks',
  'barry_v2_content_blocks',
  'barry_v2_manuals',
  'barry_v2_manual_chapters',
  'barry_v2_specifications',
  'rps_parts',
  'rps_illustrations',
  'rps_groups',
  'component_synonyms',
  'rps_component_synonyms',
];

describe('Barry Phase 2 semantic migration', () => {
  it('creates each required table and enables row-level security', () => {
    for (const table of phase2Tables) {
      expect(migration).toContain(`CREATE TABLE IF NOT EXISTS public.${table}`);
      expect(migration).toContain(`ALTER TABLE public.${table} ENABLE ROW LEVEL SECURITY`);
    }
  });

  it('extends evidence annotations with applicability, provenance, unit, and run linkage', () => {
    expect(migration).toContain('ALTER TABLE public.barry_evidence_concepts');
    expect(migration).toContain('ADD COLUMN IF NOT EXISTS evidence_unit_id');
    expect(migration).toContain('ADD COLUMN IF NOT EXISTS model_scope');
    expect(migration).toContain('ADD COLUMN IF NOT EXISTS backfill_run_id');
    expect(migration).toContain('ADD COLUMN IF NOT EXISTS provenance');
  });

  it('scopes rollback to a single backfill run through a service-role-only function', () => {
    expect(migration).toContain(
      'CREATE OR REPLACE FUNCTION public.rollback_barry_backfill_run(target_run_key text)',
    );
    expect(migration).toContain('WHERE backfill_run_id = target_run.id');
    expect(migration).toContain('SECURITY DEFINER');
    expect(migration).toContain('SET search_path = public');
    expect(migration).toContain(
      'REVOKE ALL ON FUNCTION public.rollback_barry_backfill_run(text)',
    );
    expect(migration).toContain('TO service_role');
  });

  it('does not mutate legacy evidence tables', () => {
    for (const table of legacyTables) {
      expect(migration).not.toMatch(new RegExp(`ALTER TABLE public\\.${table}\\b`));
      expect(migration).not.toMatch(new RegExp(`INSERT INTO public\\.${table}\\b`));
      expect(migration).not.toMatch(new RegExp(`UPDATE public\\.${table}\\b`));
      expect(migration).not.toMatch(new RegExp(`DELETE FROM public\\.${table}\\b`));
    }
  });

  it('does not contain destructive table or data operations', () => {
    expect(migration).not.toMatch(/\bDROP\s+TABLE\b/i);
    expect(migration).not.toMatch(/\bTRUNCATE\b/i);
  });

  it('keeps DELETE scoped to rollback of semantic rows created by a run', () => {
    const deleteStatements = migration.match(/DELETE FROM public\.[a-z_]+/g) ?? [];
    expect(deleteStatements.sort()).toEqual([
      'DELETE FROM public.barry_evidence_concepts',
      'DELETE FROM public.barry_evidence_units',
    ]);
  });

  it('uses idempotent policy guards', () => {
    const creates = migration.match(/CREATE POLICY "[^"]+"/g) ?? [];
    const drops = migration.match(/DROP POLICY IF EXISTS "[^"]+"/g) ?? [];
    expect(creates.length).toBeGreaterThan(0);
    expect(drops.length).toBe(creates.length);
  });
});
