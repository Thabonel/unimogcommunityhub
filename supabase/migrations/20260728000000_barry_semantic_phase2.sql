BEGIN;

CREATE TABLE IF NOT EXISTS public.barry_backfill_runs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  run_key text NOT NULL UNIQUE,
  semantic_version_id uuid NOT NULL REFERENCES public.barry_semantic_versions(id),
  mode text NOT NULL CHECK (mode IN ('dry_run', 'apply')),
  filters jsonb NOT NULL DEFAULT '{}'::jsonb,
  status text NOT NULL DEFAULT 'running' CHECK (status IN (
    'running', 'completed', 'rolled_back', 'failed'
  )),
  stats jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  completed_at timestamptz
);

CREATE TABLE IF NOT EXISTS public.barry_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  document_key text NOT NULL,
  title text NOT NULL,
  document_role text NOT NULL CHECK (document_role IN (
    'workshop_manual', 'maintenance_manual', 'owners_manual', 'parts_catalog',
    'service_bulletin', 'validated_knowledge', 'community_content', 'unknown'
  )),
  storage_path text,
  physical_page_count integer CHECK (physical_page_count IS NULL OR physical_page_count > 0),
  checksum text,
  model_tags text[] NOT NULL DEFAULT '{}',
  source_type text NOT NULL CHECK (source_type IN (
    'barry_v2_manual', 'manual_chunks_document', 'rps_catalog'
  )),
  source_record_id uuid,
  semantic_version_id uuid NOT NULL REFERENCES public.barry_semantic_versions(id),
  provenance jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (semantic_version_id, source_type, source_record_id),
  UNIQUE (semantic_version_id, document_key)
);

CREATE TABLE IF NOT EXISTS public.barry_evidence_units (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id uuid NOT NULL REFERENCES public.barry_documents(id) ON DELETE CASCADE,
  source_type text NOT NULL CHECK (source_type IN (
    'manual_chunk', 'barry_v2_content_block', 'barry_v2_specification',
    'rps_part', 'rps_illustration', 'rps_group', 'validated_answer'
  )),
  source_record_id uuid NOT NULL,
  physical_pdf_page integer CHECK (physical_pdf_page IS NULL OR physical_pdf_page > 0),
  page_type text NOT NULL DEFAULT 'unknown' CHECK (page_type IN (
    'procedure', 'diagnostic', 'specification', 'warning', 'diagram',
    'parts_list', 'explanation', 'index', 'unknown'
  )),
  content_hash text,
  system_tags text[] NOT NULL DEFAULT '{}',
  model_tags text[] NOT NULL DEFAULT '{}',
  component_tags text[] NOT NULL DEFAULT '{}',
  extraction_quality numeric(4,3) CHECK (extraction_quality IS NULL OR (extraction_quality >= 0 AND extraction_quality <= 1)),
  semantic_version_id uuid NOT NULL REFERENCES public.barry_semantic_versions(id),
  backfill_run_id uuid REFERENCES public.barry_backfill_runs(id) ON DELETE SET NULL,
  provenance jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (semantic_version_id, source_type, source_record_id)
);

ALTER TABLE public.barry_evidence_concepts
  ADD COLUMN IF NOT EXISTS evidence_unit_id uuid REFERENCES public.barry_evidence_units(id) ON DELETE CASCADE,
  ADD COLUMN IF NOT EXISTS model_scope text[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS backfill_run_id uuid REFERENCES public.barry_backfill_runs(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS provenance jsonb NOT NULL DEFAULT '{}'::jsonb;

CREATE INDEX IF NOT EXISTS idx_barry_evidence_units_document
  ON public.barry_evidence_units(document_id, page_type);
CREATE INDEX IF NOT EXISTS idx_barry_evidence_units_source
  ON public.barry_evidence_units(source_type, source_record_id);
CREATE INDEX IF NOT EXISTS idx_barry_evidence_units_run
  ON public.barry_evidence_units(backfill_run_id);
CREATE INDEX IF NOT EXISTS idx_barry_evidence_concepts_unit
  ON public.barry_evidence_concepts(evidence_unit_id);
CREATE INDEX IF NOT EXISTS idx_barry_evidence_concepts_run
  ON public.barry_evidence_concepts(backfill_run_id);
CREATE INDEX IF NOT EXISTS idx_barry_documents_role
  ON public.barry_documents(document_role, source_type);

CREATE OR REPLACE FUNCTION public.rollback_barry_backfill_run(target_run_key text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  target_run public.barry_backfill_runs%ROWTYPE;
  removed_annotations integer;
  removed_units integer;
BEGIN
  SELECT * INTO target_run
  FROM public.barry_backfill_runs
  WHERE run_key = target_run_key
  FOR UPDATE;

  IF target_run.id IS NULL THEN
    RAISE EXCEPTION 'Unknown Barry backfill run: %', target_run_key;
  END IF;

  IF target_run.status = 'rolled_back' THEN
    RETURN jsonb_build_object(
      'run_key', target_run_key,
      'status', 'already_rolled_back',
      'removed_annotations', 0,
      'removed_units', 0
    );
  END IF;

  DELETE FROM public.barry_evidence_concepts
  WHERE backfill_run_id = target_run.id;
  GET DIAGNOSTICS removed_annotations = ROW_COUNT;

  DELETE FROM public.barry_evidence_units
  WHERE backfill_run_id = target_run.id;
  GET DIAGNOSTICS removed_units = ROW_COUNT;

  UPDATE public.barry_backfill_runs
  SET status = 'rolled_back', completed_at = now()
  WHERE id = target_run.id;

  RETURN jsonb_build_object(
    'run_key', target_run_key,
    'status', 'rolled_back',
    'removed_annotations', removed_annotations,
    'removed_units', removed_units
  );
END;
$$;

REVOKE ALL ON FUNCTION public.rollback_barry_backfill_run(text)
  FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.rollback_barry_backfill_run(text)
  TO service_role;

ALTER TABLE public.barry_backfill_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.barry_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.barry_evidence_units ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Service role manages backfill runs" ON public.barry_backfill_runs;
CREATE POLICY "Service role manages backfill runs"
  ON public.barry_backfill_runs FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');
DROP POLICY IF EXISTS "Admins read backfill runs" ON public.barry_backfill_runs;
CREATE POLICY "Admins read backfill runs"
  ON public.barry_backfill_runs FOR SELECT
  USING (public.check_admin_access());

DROP POLICY IF EXISTS "Service role manages barry documents" ON public.barry_documents;
CREATE POLICY "Service role manages barry documents"
  ON public.barry_documents FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');
DROP POLICY IF EXISTS "Admins read barry documents" ON public.barry_documents;
CREATE POLICY "Admins read barry documents"
  ON public.barry_documents FOR SELECT
  USING (public.check_admin_access());

DROP POLICY IF EXISTS "Service role manages evidence units" ON public.barry_evidence_units;
CREATE POLICY "Service role manages evidence units"
  ON public.barry_evidence_units FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');
DROP POLICY IF EXISTS "Admins read evidence units" ON public.barry_evidence_units;
CREATE POLICY "Admins read evidence units"
  ON public.barry_evidence_units FOR SELECT
  USING (public.check_admin_access());

GRANT SELECT ON public.barry_backfill_runs TO authenticated;
GRANT SELECT ON public.barry_documents TO authenticated;
GRANT SELECT ON public.barry_evidence_units TO authenticated;

GRANT ALL ON public.barry_backfill_runs TO service_role;
GRANT ALL ON public.barry_documents TO service_role;
GRANT ALL ON public.barry_evidence_units TO service_role;

COMMIT;
