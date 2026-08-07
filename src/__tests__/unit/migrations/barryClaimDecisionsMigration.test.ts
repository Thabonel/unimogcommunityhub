import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const migrationPath = resolve(
  process.cwd(),
  'supabase/migrations/20260808000000_barry_claim_decisions.sql',
);
const migration = readFileSync(migrationPath, 'utf8');

describe('Barry Phase 4 claim decisions migration', () => {
  it('creates the claim decisions table with row-level security', () => {
    expect(migration).toContain('CREATE TABLE IF NOT EXISTS public.barry_claim_decisions');
    expect(migration).toContain('ALTER TABLE public.barry_claim_decisions ENABLE ROW LEVEL SECURITY');
  });

  it('restricts writes to the service role and reads to admins', () => {
    expect(migration).toContain("USING (auth.role() = 'service_role')");
    expect(migration).toContain('USING (public.check_admin_access())');
    expect(migration).toContain('GRANT ALL ON public.barry_claim_decisions TO service_role');
    expect(migration).not.toMatch(/GRANT (INSERT|UPDATE|DELETE)[^;]*TO authenticated/);
  });

  it('constrains status and claim class to the controlled vocabularies', () => {
    expect(migration).toContain("'supported', 'narrowed', 'unsupported', 'conflicted'");
    expect(migration).toContain("'procedure_step', 'diagnostic_cause', 'diagnostic_test', 'specification'");
  });

  it('stores only redacted claim text', () => {
    expect(migration).toContain('claim_text_redacted text NOT NULL');
    expect(migration).not.toContain('claim_text text');
  });

  it('contains no destructive statements', () => {
    expect(migration).not.toMatch(/DROP TABLE/i);
    expect(migration).not.toMatch(/TRUNCATE/i);
    expect(migration).not.toMatch(/DELETE FROM/i);
  });
});
