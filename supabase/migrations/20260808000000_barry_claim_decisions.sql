BEGIN;

CREATE TABLE IF NOT EXISTS public.barry_claim_decisions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  grounding_run_request_id text NOT NULL,
  claim_class text NOT NULL CHECK (claim_class IN (
    'procedure_step', 'diagnostic_cause', 'diagnostic_test', 'specification',
    'fluid', 'capacity', 'torque', 'part_number', 'compatibility',
    'component_identity', 'safety_warning', 'general_description'
  )),
  claim_text text NOT NULL,
  status text NOT NULL CHECK (status IN ('supported', 'narrowed', 'unsupported', 'conflicted')),
  reason_code text NOT NULL,
  confidence numeric NOT NULL DEFAULT 0,
  evidence_keys text[] NOT NULL DEFAULT '{}',
  pipeline_version text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_barry_claim_decisions_run
  ON public.barry_claim_decisions(grounding_run_request_id);
CREATE INDEX IF NOT EXISTS idx_barry_claim_decisions_created
  ON public.barry_claim_decisions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_barry_claim_decisions_status
  ON public.barry_claim_decisions(status, claim_class);

ALTER TABLE public.barry_claim_decisions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Service role manages claim decisions" ON public.barry_claim_decisions;
CREATE POLICY "Service role manages claim decisions"
  ON public.barry_claim_decisions FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

DROP POLICY IF EXISTS "Admins read claim decisions" ON public.barry_claim_decisions;
CREATE POLICY "Admins read claim decisions"
  ON public.barry_claim_decisions FOR SELECT
  USING (public.check_admin_access());

GRANT SELECT ON public.barry_claim_decisions TO authenticated;
GRANT ALL ON public.barry_claim_decisions TO service_role;

COMMIT;
