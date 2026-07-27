import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import {
  BARRY_SEMANTIC_VERSION,
  PHASE1_SEMANTIC_REGISTRY,
} from '../../../../supabase/functions/_shared/barry-semantic';

const migrationPath = resolve(
  process.cwd(),
  'supabase/migrations/20260727000000_barry_semantic_phase1.sql',
);
const migration = readFileSync(migrationPath, 'utf8');

const semanticTables = [
  'barry_semantic_versions',
  'barry_semantic_concepts',
  'barry_semantic_aliases',
  'barry_semantic_relationships',
  'barry_evidence_concepts',
  'barry_semantic_review_queue',
  'barry_grounding_runs',
];

describe('Barry Phase 1 semantic migration', () => {
  it('creates each required table and enables row-level security', () => {
    for (const table of semanticTables) {
      expect(migration).toContain(`CREATE TABLE IF NOT EXISTS public.${table}`);
      expect(migration).toContain(`ALTER TABLE public.${table} ENABLE ROW LEVEL SECURITY`);
    }
  });

  it('seeds every runtime ontology concept and relationship', () => {
    for (const concept of PHASE1_SEMANTIC_REGISTRY.concepts) {
      expect(migration).toContain(`'${concept.conceptKey}'`);
    }
    for (const relationship of PHASE1_SEMANTIC_REGISTRY.relationships) {
      expect(migration).toContain(
        `('${relationship.sourceConceptKey}', '${relationship.relationshipType}', '${relationship.targetConceptKey}')`,
      );
    }
  });

  it('keeps RPS synonyms proposed until reviewed', () => {
    const rpsSourceIndex = migration.indexOf('FROM public.rps_component_synonyms source');
    const rpsImport = migration.slice(Math.max(0, rpsSourceIndex - 1200), rpsSourceIndex + 200);

    expect(rpsSourceIndex).toBeGreaterThan(0);
    expect(migration).toContain('FROM public.rps_component_synonyms source');
    expect(migration).toContain("'source', 'rps_component_synonyms'");
    expect(migration).toContain("'alias'");
    expect(migration).toContain("'controlled'");
    expect(rpsImport).toContain('INSERT INTO public.barry_semantic_review_queue');
    expect(rpsImport).not.toContain('INSERT INTO public.barry_semantic_aliases');
  });

  it('activates the version through a service-role-only control', () => {
    expect(migration).toContain(`'${BARRY_SEMANTIC_VERSION}'`);
    expect(migration).toContain(
      'CREATE OR REPLACE FUNCTION public.activate_barry_semantic_version(target_version text)',
    );
    expect(migration).toContain(
      'REVOKE ALL ON FUNCTION public.activate_barry_semantic_version(text)',
    );
    expect(migration).toContain('TO service_role');
  });

  it('does not contain destructive table or data operations', () => {
    expect(migration).not.toMatch(/\bDROP\s+TABLE\b/i);
    expect(migration).not.toMatch(/\bTRUNCATE\b/i);
    expect(migration).not.toMatch(/\bDELETE\s+FROM\b/i);
  });
});
