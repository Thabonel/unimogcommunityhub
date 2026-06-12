BEGIN;

CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE IF NOT EXISTS barry_v2_source_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  canonical_id text UNIQUE NOT NULL,
  normalized_title text NOT NULL,
  filename text NOT NULL,
  local_path text,
  storage_path text,
  sha256 text NOT NULL,
  document_type text NOT NULL,
  source_group text,
  file_size_mb numeric(10,2),
  page_count integer,
  quality_status text NOT NULL CHECK (quality_status IN ('good', 'usable', 'suspect', 'corrupt', 'derivative', 'suspect_derivative')),
  quality_score integer CHECK (quality_score IS NULL OR (quality_score >= 0 AND quality_score <= 110)),
  duplicate_count integer NOT NULL DEFAULT 0,
  use_for_extraction boolean NOT NULL DEFAULT false,
  registry_payload jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS barry_v2_vehicle_systems (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  parent_id uuid REFERENCES barry_v2_vehicle_systems(id),
  slug text UNIQUE NOT NULL,
  sort_order integer,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS barry_v2_vehicle_models (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  display_name text,
  variants text[] NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS barry_v2_vehicle_model_aliases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_model_id uuid NOT NULL REFERENCES barry_v2_vehicle_models(id) ON DELETE CASCADE,
  alias text NOT NULL,
  UNIQUE(vehicle_model_id, alias)
);

CREATE TABLE IF NOT EXISTS barry_v2_manuals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  source_document_id uuid REFERENCES barry_v2_source_documents(id) ON DELETE SET NULL,
  title text NOT NULL,
  filename text NOT NULL,
  storage_path text,
  manual_type text NOT NULL,
  language text NOT NULL DEFAULT 'en',
  total_pages integer,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS barry_v2_manual_applicable_models (
  manual_id uuid NOT NULL REFERENCES barry_v2_manuals(id) ON DELETE CASCADE,
  vehicle_model_id uuid NOT NULL REFERENCES barry_v2_vehicle_models(id) ON DELETE CASCADE,
  PRIMARY KEY (manual_id, vehicle_model_id)
);

CREATE TABLE IF NOT EXISTS barry_v2_manual_chapters (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  manual_id uuid NOT NULL REFERENCES barry_v2_manuals(id) ON DELETE CASCADE,
  parent_id uuid REFERENCES barry_v2_manual_chapters(id) ON DELETE CASCADE,
  title text NOT NULL,
  slug text NOT NULL,
  page_start integer NOT NULL CHECK (page_start > 0),
  page_end integer NOT NULL CHECK (page_end >= page_start),
  system_id uuid REFERENCES barry_v2_vehicle_systems(id),
  sort_order integer,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(manual_id, slug)
);

CREATE TABLE IF NOT EXISTS barry_v2_content_blocks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  chapter_id uuid NOT NULL REFERENCES barry_v2_manual_chapters(id) ON DELETE CASCADE,
  block_type text NOT NULL CHECK (block_type IN (
    'procedure',
    'diagnostic',
    'specification',
    'explanation',
    'parts_list',
    'diagram',
    'photo',
    'warning',
    'cross_reference'
  )),
  title text,
  page_number integer CHECK (page_number IS NULL OR page_number > 0),
  page_start integer CHECK (page_start IS NULL OR page_start > 0),
  page_end integer CHECK (page_end IS NULL OR page_end >= COALESCE(page_start, page_end)),
  content_text text NOT NULL,
  content_json jsonb NOT NULL DEFAULT '{}'::jsonb,
  embedding vector(1536),
  system_tags text[] NOT NULL DEFAULT '{}',
  model_tags text[] NOT NULL DEFAULT '{}',
  part_numbers text[] NOT NULL DEFAULT '{}',
  is_primary boolean NOT NULL DEFAULT false,
  extraction_quality numeric(3,2) CHECK (extraction_quality IS NULL OR (extraction_quality >= 0 AND extraction_quality <= 1)),
  source_page_reference text,
  source_chunk_id uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS barry_v2_content_media (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  block_id uuid NOT NULL REFERENCES barry_v2_content_blocks(id) ON DELETE CASCADE,
  media_type text NOT NULL CHECK (media_type IN ('diagram', 'photo', 'exploded_view', 'page_render', 'graph')),
  storage_path text NOT NULL,
  filename text,
  mime_type text,
  caption text,
  page_number integer CHECK (page_number IS NULL OR page_number > 0),
  callout_data jsonb NOT NULL DEFAULT '[]'::jsonb,
  width integer,
  height integer,
  file_size_bytes integer,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS barry_v2_specifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  block_id uuid REFERENCES barry_v2_content_blocks(id) ON DELETE CASCADE,
  chapter_id uuid REFERENCES barry_v2_manual_chapters(id) ON DELETE CASCADE,
  category text NOT NULL,
  name text NOT NULL,
  value numeric,
  unit text,
  range_min numeric,
  range_max numeric,
  component text,
  system_tag text,
  model_tags text[] NOT NULL DEFAULT '{}',
  condition text,
  source_page integer CHECK (source_page IS NULL OR source_page > 0),
  embedding vector(1536),
  created_at timestamptz NOT NULL DEFAULT now(),
  CHECK (block_id IS NOT NULL OR chapter_id IS NOT NULL)
);

CREATE TABLE IF NOT EXISTS barry_v2_diagnostic_symptoms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  symptom text NOT NULL,
  aliases text[] NOT NULL DEFAULT '{}',
  system_id uuid REFERENCES barry_v2_vehicle_systems(id),
  severity text NOT NULL DEFAULT 'medium' CHECK (severity IN ('critical', 'high', 'medium', 'low')),
  common_causes text[] NOT NULL DEFAULT '{}',
  initial_checks text[] NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS barry_v2_diagnostic_paths (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  symptom_id uuid NOT NULL REFERENCES barry_v2_diagnostic_symptoms(id) ON DELETE CASCADE,
  step_order integer NOT NULL,
  cause text NOT NULL,
  probability text NOT NULL DEFAULT 'medium' CHECK (probability IN ('high', 'medium', 'low')),
  test_procedure text NOT NULL,
  expected_result text,
  fix_instructions text NOT NULL,
  tools_required text[] NOT NULL DEFAULT '{}',
  safety_warnings text[] NOT NULL DEFAULT '{}',
  is_ai_generated boolean NOT NULL DEFAULT false,
  verified boolean NOT NULL DEFAULT false,
  source_manual text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS barry_v2_diagnostic_path_blocks (
  diagnostic_path_id uuid NOT NULL REFERENCES barry_v2_diagnostic_paths(id) ON DELETE CASCADE,
  block_id uuid NOT NULL REFERENCES barry_v2_content_blocks(id) ON DELETE CASCADE,
  relationship text NOT NULL,
  PRIMARY KEY (diagnostic_path_id, block_id, relationship)
);

CREATE TABLE IF NOT EXISTS barry_v2_diagnostic_path_specs (
  diagnostic_path_id uuid NOT NULL REFERENCES barry_v2_diagnostic_paths(id) ON DELETE CASCADE,
  specification_id uuid NOT NULL REFERENCES barry_v2_specifications(id) ON DELETE CASCADE,
  PRIMARY KEY (diagnostic_path_id, specification_id)
);

CREATE TABLE IF NOT EXISTS barry_v2_diagnostic_path_rps_parts (
  diagnostic_path_id uuid NOT NULL REFERENCES barry_v2_diagnostic_paths(id) ON DELETE CASCADE,
  rps_part_id uuid NOT NULL REFERENCES rps_parts(id) ON DELETE CASCADE,
  PRIMARY KEY (diagnostic_path_id, rps_part_id)
);

CREATE TABLE IF NOT EXISTS barry_v2_content_block_rps_parts (
  block_id uuid NOT NULL REFERENCES barry_v2_content_blocks(id) ON DELETE CASCADE,
  rps_part_id uuid NOT NULL REFERENCES rps_parts(id) ON DELETE CASCADE,
  relationship text NOT NULL DEFAULT 'mentions',
  PRIMARY KEY (block_id, rps_part_id)
);

CREATE TABLE IF NOT EXISTS barry_v2_content_block_rps_illustrations (
  block_id uuid NOT NULL REFERENCES barry_v2_content_blocks(id) ON DELETE CASCADE,
  rps_illustration_id uuid NOT NULL REFERENCES rps_illustrations(id) ON DELETE CASCADE,
  relationship text NOT NULL DEFAULT 'illustrates',
  PRIMARY KEY (block_id, rps_illustration_id)
);

CREATE TABLE IF NOT EXISTS barry_v2_query_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  query text NOT NULL,
  query_type text,
  system_tags text[] NOT NULL DEFAULT '{}',
  blocks_retrieved uuid[] NOT NULL DEFAULT '{}',
  blocks_shown uuid[] NOT NULL DEFAULT '{}',
  diagnostic_paths_used uuid[] NOT NULL DEFAULT '{}',
  user_feedback text CHECK (user_feedback IS NULL OR user_feedback IN ('helpful', 'partial', 'wrong', 'irrelevant')),
  feedback_comment text,
  response_time_ms integer,
  tokens_used integer,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_barry_v2_source_documents_sha ON barry_v2_source_documents(sha256);
CREATE INDEX IF NOT EXISTS idx_barry_v2_source_documents_extraction ON barry_v2_source_documents(use_for_extraction, quality_status);
CREATE INDEX IF NOT EXISTS idx_barry_v2_vehicle_systems_parent ON barry_v2_vehicle_systems(parent_id);
CREATE INDEX IF NOT EXISTS idx_barry_v2_vehicle_model_aliases_alias ON barry_v2_vehicle_model_aliases(alias);
CREATE INDEX IF NOT EXISTS idx_barry_v2_manuals_source ON barry_v2_manuals(source_document_id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_barry_v2_manuals_filename_storage
  ON barry_v2_manuals(filename, COALESCE(storage_path, ''));
CREATE INDEX IF NOT EXISTS idx_barry_v2_manual_chapters_manual ON barry_v2_manual_chapters(manual_id);
CREATE INDEX IF NOT EXISTS idx_barry_v2_manual_chapters_system ON barry_v2_manual_chapters(system_id);
CREATE INDEX IF NOT EXISTS idx_barry_v2_blocks_type ON barry_v2_content_blocks(block_type);
CREATE INDEX IF NOT EXISTS idx_barry_v2_blocks_chapter ON barry_v2_content_blocks(chapter_id);
CREATE INDEX IF NOT EXISTS idx_barry_v2_blocks_system_tags ON barry_v2_content_blocks USING gin(system_tags);
CREATE INDEX IF NOT EXISTS idx_barry_v2_blocks_model_tags ON barry_v2_content_blocks USING gin(model_tags);
CREATE INDEX IF NOT EXISTS idx_barry_v2_blocks_part_numbers ON barry_v2_content_blocks USING gin(part_numbers);
CREATE INDEX IF NOT EXISTS idx_barry_v2_blocks_fts ON barry_v2_content_blocks USING gin(to_tsvector('english', content_text));
CREATE INDEX IF NOT EXISTS idx_barry_v2_media_block ON barry_v2_content_media(block_id);
CREATE INDEX IF NOT EXISTS idx_barry_v2_media_type ON barry_v2_content_media(media_type);
CREATE INDEX IF NOT EXISTS idx_barry_v2_specs_category ON barry_v2_specifications(category);
CREATE INDEX IF NOT EXISTS idx_barry_v2_specs_component ON barry_v2_specifications(component);
CREATE INDEX IF NOT EXISTS idx_barry_v2_specs_value ON barry_v2_specifications(value);
CREATE INDEX IF NOT EXISTS idx_barry_v2_specs_system ON barry_v2_specifications(system_tag);
CREATE INDEX IF NOT EXISTS idx_barry_v2_diag_symptoms_system ON barry_v2_diagnostic_symptoms(system_id);
CREATE INDEX IF NOT EXISTS idx_barry_v2_diag_paths_symptom ON barry_v2_diagnostic_paths(symptom_id);
CREATE INDEX IF NOT EXISTS idx_barry_v2_diag_paths_verified ON barry_v2_diagnostic_paths(verified, probability);
CREATE INDEX IF NOT EXISTS idx_barry_v2_query_log_user ON barry_v2_query_log(user_id);
CREATE INDEX IF NOT EXISTS idx_barry_v2_query_log_created ON barry_v2_query_log(created_at DESC);

CREATE OR REPLACE FUNCTION update_barry_v2_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS barry_v2_source_documents_updated_at ON barry_v2_source_documents;
CREATE TRIGGER barry_v2_source_documents_updated_at
  BEFORE UPDATE ON barry_v2_source_documents
  FOR EACH ROW
  EXECUTE FUNCTION update_barry_v2_updated_at();

DROP TRIGGER IF EXISTS barry_v2_manuals_updated_at ON barry_v2_manuals;
CREATE TRIGGER barry_v2_manuals_updated_at
  BEFORE UPDATE ON barry_v2_manuals
  FOR EACH ROW
  EXECUTE FUNCTION update_barry_v2_updated_at();

DROP TRIGGER IF EXISTS barry_v2_content_blocks_updated_at ON barry_v2_content_blocks;
CREATE TRIGGER barry_v2_content_blocks_updated_at
  BEFORE UPDATE ON barry_v2_content_blocks
  FOR EACH ROW
  EXECUTE FUNCTION update_barry_v2_updated_at();

CREATE OR REPLACE FUNCTION barry_v2_search_content(
  query_text text,
  match_count integer DEFAULT 5,
  block_types text[] DEFAULT NULL
)
RETURNS TABLE (
  block_id uuid,
  block_type text,
  title text,
  content_text text,
  page_number integer,
  source_page_reference text,
  manual_title text,
  chapter_title text,
  rank real
)
LANGUAGE sql
STABLE
AS $$
  WITH q AS (
    SELECT websearch_to_tsquery('english', query_text) AS query
  )
  SELECT
    b.id AS block_id,
    b.block_type,
    b.title,
    b.content_text,
    b.page_number,
    b.source_page_reference,
    m.title AS manual_title,
    c.title AS chapter_title,
    ts_rank(to_tsvector('english', b.content_text), q.query) AS rank
  FROM barry_v2_content_blocks b
  JOIN barry_v2_manual_chapters c ON c.id = b.chapter_id
  JOIN barry_v2_manuals m ON m.id = c.manual_id
  CROSS JOIN q
  WHERE q.query @@ to_tsvector('english', b.content_text)
    AND (block_types IS NULL OR b.block_type = ANY(block_types))
  ORDER BY rank DESC, b.is_primary DESC, b.page_number NULLS LAST
  LIMIT LEAST(GREATEST(match_count, 1), 20);
$$;

INSERT INTO barry_v2_vehicle_models (name, display_name, variants)
VALUES
  ('u1700l', 'Unimog U1700L', ARRAY['U1700L', 'U435', '435']),
  ('u435', 'Unimog U435', ARRAY['U435', 'U1700L', '435'])
ON CONFLICT (name) DO NOTHING;

INSERT INTO barry_v2_vehicle_systems (name, slug, sort_order)
VALUES
  ('Powertrain', 'powertrain', 10),
  ('Chassis', 'chassis', 20),
  ('Electrical', 'electrical', 30),
  ('Brakes', 'brakes', 40),
  ('Hydraulics', 'hydraulics', 50),
  ('Body and Cab', 'body-cab', 60)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO barry_v2_vehicle_systems (name, slug, parent_id, sort_order)
SELECT child.name, child.slug, parent.id, child.sort_order
FROM (
  VALUES
    ('Engine', 'engine', 'powertrain', 10),
    ('Transmission', 'transmission', 'powertrain', 20),
    ('Transfer Case', 'transfer-case', 'powertrain', 30),
    ('PTO Systems', 'pto-systems', 'powertrain', 40),
    ('Front Axle', 'front-axle', 'chassis', 10),
    ('Rear Axle', 'rear-axle', 'chassis', 20),
    ('Steering', 'steering', 'chassis', 30),
    ('Suspension', 'suspension', 'chassis', 40),
    ('Cooling System', 'cooling-system', 'engine', 10),
    ('Fuel System', 'fuel-system', 'engine', 20),
    ('Lubrication', 'lubrication', 'engine', 30)
) AS child(name, slug, parent_slug, sort_order)
JOIN barry_v2_vehicle_systems parent ON parent.slug = child.parent_slug
ON CONFLICT (slug) DO NOTHING;

ALTER TABLE barry_v2_source_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE barry_v2_vehicle_systems ENABLE ROW LEVEL SECURITY;
ALTER TABLE barry_v2_vehicle_models ENABLE ROW LEVEL SECURITY;
ALTER TABLE barry_v2_vehicle_model_aliases ENABLE ROW LEVEL SECURITY;
ALTER TABLE barry_v2_manuals ENABLE ROW LEVEL SECURITY;
ALTER TABLE barry_v2_manual_applicable_models ENABLE ROW LEVEL SECURITY;
ALTER TABLE barry_v2_manual_chapters ENABLE ROW LEVEL SECURITY;
ALTER TABLE barry_v2_content_blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE barry_v2_content_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE barry_v2_specifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE barry_v2_diagnostic_symptoms ENABLE ROW LEVEL SECURITY;
ALTER TABLE barry_v2_diagnostic_paths ENABLE ROW LEVEL SECURITY;
ALTER TABLE barry_v2_diagnostic_path_blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE barry_v2_diagnostic_path_specs ENABLE ROW LEVEL SECURITY;
ALTER TABLE barry_v2_diagnostic_path_rps_parts ENABLE ROW LEVEL SECURITY;
ALTER TABLE barry_v2_content_block_rps_parts ENABLE ROW LEVEL SECURITY;
ALTER TABLE barry_v2_content_block_rps_illustrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE barry_v2_query_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY barry_v2_source_documents_service ON barry_v2_source_documents FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY barry_v2_source_documents_admin ON barry_v2_source_documents FOR SELECT USING (check_admin_access());
CREATE POLICY barry_v2_vehicle_systems_service ON barry_v2_vehicle_systems FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY barry_v2_vehicle_systems_admin ON barry_v2_vehicle_systems FOR SELECT USING (check_admin_access());
CREATE POLICY barry_v2_vehicle_models_service ON barry_v2_vehicle_models FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY barry_v2_vehicle_models_admin ON barry_v2_vehicle_models FOR SELECT USING (check_admin_access());
CREATE POLICY barry_v2_vehicle_model_aliases_service ON barry_v2_vehicle_model_aliases FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY barry_v2_vehicle_model_aliases_admin ON barry_v2_vehicle_model_aliases FOR SELECT USING (check_admin_access());
CREATE POLICY barry_v2_manuals_service ON barry_v2_manuals FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY barry_v2_manuals_admin ON barry_v2_manuals FOR SELECT USING (check_admin_access());
CREATE POLICY barry_v2_manual_applicable_models_service ON barry_v2_manual_applicable_models FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY barry_v2_manual_applicable_models_admin ON barry_v2_manual_applicable_models FOR SELECT USING (check_admin_access());
CREATE POLICY barry_v2_manual_chapters_service ON barry_v2_manual_chapters FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY barry_v2_manual_chapters_admin ON barry_v2_manual_chapters FOR SELECT USING (check_admin_access());
CREATE POLICY barry_v2_content_blocks_service ON barry_v2_content_blocks FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY barry_v2_content_blocks_admin ON barry_v2_content_blocks FOR SELECT USING (check_admin_access());
CREATE POLICY barry_v2_content_media_service ON barry_v2_content_media FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY barry_v2_content_media_admin ON barry_v2_content_media FOR SELECT USING (check_admin_access());
CREATE POLICY barry_v2_specifications_service ON barry_v2_specifications FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY barry_v2_specifications_admin ON barry_v2_specifications FOR SELECT USING (check_admin_access());
CREATE POLICY barry_v2_diagnostic_symptoms_service ON barry_v2_diagnostic_symptoms FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY barry_v2_diagnostic_symptoms_admin ON barry_v2_diagnostic_symptoms FOR SELECT USING (check_admin_access());
CREATE POLICY barry_v2_diagnostic_paths_service ON barry_v2_diagnostic_paths FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY barry_v2_diagnostic_paths_admin ON barry_v2_diagnostic_paths FOR SELECT USING (check_admin_access());
CREATE POLICY barry_v2_diagnostic_path_blocks_service ON barry_v2_diagnostic_path_blocks FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY barry_v2_diagnostic_path_blocks_admin ON barry_v2_diagnostic_path_blocks FOR SELECT USING (check_admin_access());
CREATE POLICY barry_v2_diagnostic_path_specs_service ON barry_v2_diagnostic_path_specs FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY barry_v2_diagnostic_path_specs_admin ON barry_v2_diagnostic_path_specs FOR SELECT USING (check_admin_access());
CREATE POLICY barry_v2_diagnostic_path_rps_parts_service ON barry_v2_diagnostic_path_rps_parts FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY barry_v2_diagnostic_path_rps_parts_admin ON barry_v2_diagnostic_path_rps_parts FOR SELECT USING (check_admin_access());
CREATE POLICY barry_v2_content_block_rps_parts_service ON barry_v2_content_block_rps_parts FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY barry_v2_content_block_rps_parts_admin ON barry_v2_content_block_rps_parts FOR SELECT USING (check_admin_access());
CREATE POLICY barry_v2_content_block_rps_illustrations_service ON barry_v2_content_block_rps_illustrations FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY barry_v2_content_block_rps_illustrations_admin ON barry_v2_content_block_rps_illustrations FOR SELECT USING (check_admin_access());
CREATE POLICY barry_v2_query_log_service ON barry_v2_query_log FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY barry_v2_query_log_admin ON barry_v2_query_log FOR SELECT USING (check_admin_access());

COMMIT;
