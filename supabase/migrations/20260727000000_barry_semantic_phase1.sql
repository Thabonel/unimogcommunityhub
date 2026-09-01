BEGIN;

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS public.barry_semantic_versions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  version text NOT NULL UNIQUE,
  status text NOT NULL CHECK (status IN ('draft', 'active', 'retired')),
  change_summary text NOT NULL,
  approved_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  activated_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_barry_semantic_one_active_version
  ON public.barry_semantic_versions(status)
  WHERE status = 'active';

CREATE TABLE IF NOT EXISTS public.barry_semantic_concepts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  concept_key text NOT NULL UNIQUE,
  concept_type text NOT NULL CHECK (concept_type IN (
    'vehicle_model', 'vehicle_variant', 'vehicle_system', 'component', 'symptom',
    'operation', 'claim_class', 'property', 'fluid', 'unit', 'part', 'tool',
    'document_role', 'page_type', 'hazard'
  )),
  canonical_name text NOT NULL,
  description text NOT NULL,
  system_concept_id uuid REFERENCES public.barry_semantic_concepts(id) ON DELETE SET NULL,
  language text NOT NULL DEFAULT 'en',
  model_scope text[] NOT NULL DEFAULT '{}',
  configuration_scope text[] NOT NULL DEFAULT '{}',
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'approved', 'deprecated')),
  semantic_version_id uuid NOT NULL REFERENCES public.barry_semantic_versions(id),
  provenance jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.barry_semantic_aliases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  alias_text text NOT NULL,
  alias_text_normalized text NOT NULL,
  concept_id uuid NOT NULL REFERENCES public.barry_semantic_concepts(id) ON DELETE CASCADE,
  alias_type text NOT NULL CHECK (alias_type IN (
    'workshop_term', 'owner_term', 'abbreviation', 'translation',
    'spelling_variant', 'common_misspelling'
  )),
  language text NOT NULL DEFAULT 'en',
  model_scope text[] NOT NULL DEFAULT '{}',
  context_concept_ids uuid[] NOT NULL DEFAULT '{}',
  confidence numeric(4,3) NOT NULL CHECK (confidence >= 0 AND confidence <= 1),
  status text NOT NULL DEFAULT 'proposed' CHECK (status IN ('proposed', 'approved', 'rejected')),
  semantic_version_id uuid NOT NULL REFERENCES public.barry_semantic_versions(id),
  provenance jsonb NOT NULL DEFAULT '{}'::jsonb,
  reviewed_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (semantic_version_id, alias_text_normalized, concept_id)
);

CREATE TABLE IF NOT EXISTS public.barry_semantic_relationships (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  source_concept_id uuid NOT NULL REFERENCES public.barry_semantic_concepts(id) ON DELETE CASCADE,
  relationship_type text NOT NULL CHECK (relationship_type IN (
    'part_of', 'connected_to', 'has_property', 'uses_fluid', 'has_part',
    'has_symptom', 'checked_by', 'serviced_by', 'specified_by', 'illustrated_by',
    'applies_to', 'supersedes', 'alias_of', 'broader_than', 'requires',
    'creates_hazard'
  )),
  target_concept_id uuid NOT NULL REFERENCES public.barry_semantic_concepts(id) ON DELETE CASCADE,
  model_scope text[] NOT NULL DEFAULT '{}',
  configuration_scope text[] NOT NULL DEFAULT '{}',
  confidence numeric(4,3) NOT NULL CHECK (confidence >= 0 AND confidence <= 1),
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'approved', 'rejected', 'deprecated')),
  semantic_version_id uuid NOT NULL REFERENCES public.barry_semantic_versions(id),
  provenance jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  CHECK (source_concept_id <> target_concept_id),
  UNIQUE (semantic_version_id, source_concept_id, relationship_type, target_concept_id)
);

CREATE TABLE IF NOT EXISTS public.barry_evidence_concepts (
  source_type text NOT NULL CHECK (source_type IN (
    'manual_chunk', 'barry_v2_content_block', 'rps_part', 'rps_illustration',
    'validated_answer'
  )),
  source_record_id uuid NOT NULL,
  concept_id uuid NOT NULL REFERENCES public.barry_semantic_concepts(id) ON DELETE CASCADE,
  annotation_role text NOT NULL CHECK (annotation_role IN (
    'primary_subject', 'mentioned_component', 'operation', 'property',
    'value_context', 'applicability', 'hazard'
  )),
  confidence numeric(4,3) NOT NULL CHECK (confidence >= 0 AND confidence <= 1),
  method text NOT NULL CHECK (method IN (
    'deterministic', 'structured_extraction', 'model_assisted', 'human_reviewed'
  )),
  review_status text NOT NULL DEFAULT 'proposed' CHECK (review_status IN (
    'proposed', 'approved', 'rejected'
  )),
  semantic_version_id uuid NOT NULL REFERENCES public.barry_semantic_versions(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (
    source_type, source_record_id, concept_id, annotation_role, semantic_version_id
  )
);

CREATE TABLE IF NOT EXISTS public.barry_semantic_review_queue (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  dedupe_key text NOT NULL UNIQUE,
  review_type text NOT NULL CHECK (review_type IN (
    'concept', 'alias', 'relationship', 'evidence_mapping', 'ambiguity'
  )),
  proposed_payload jsonb NOT NULL,
  query_frequency integer NOT NULL DEFAULT 0 CHECK (query_frequency >= 0),
  affected_systems text[] NOT NULL DEFAULT '{}',
  risk_level text NOT NULL DEFAULT 'standard' CHECK (risk_level IN (
    'standard', 'controlled', 'safety_critical'
  )),
  status text NOT NULL DEFAULT 'pending' CHECK (status IN (
    'pending', 'approved', 'rejected', 'superseded'
  )),
  semantic_version_id uuid NOT NULL REFERENCES public.barry_semantic_versions(id),
  reviewed_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  reviewed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.barry_grounding_runs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id text NOT NULL UNIQUE,
  query_hash text,
  semantic_version text NOT NULL,
  semantic_frame_redacted jsonb NOT NULL DEFAULT '{}'::jsonb,
  resolved_concept_count integer NOT NULL DEFAULT 0 CHECK (resolved_concept_count >= 0),
  unresolved_term_count integer NOT NULL DEFAULT 0 CHECK (unresolved_term_count >= 0),
  ambiguous_concept_count integer NOT NULL DEFAULT 0 CHECK (ambiguous_concept_count >= 0),
  requested_claim_classes text[] NOT NULL DEFAULT '{}',
  latency_ms integer CHECK (latency_ms IS NULL OR latency_ms >= 0),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_barry_semantic_concepts_type
  ON public.barry_semantic_concepts(concept_type, status);
CREATE INDEX IF NOT EXISTS idx_barry_semantic_concepts_system
  ON public.barry_semantic_concepts(system_concept_id);
CREATE INDEX IF NOT EXISTS idx_barry_semantic_aliases_lookup
  ON public.barry_semantic_aliases(alias_text_normalized, status);
CREATE INDEX IF NOT EXISTS idx_barry_semantic_aliases_context
  ON public.barry_semantic_aliases USING gin(context_concept_ids);
CREATE INDEX IF NOT EXISTS idx_barry_semantic_relationships_source
  ON public.barry_semantic_relationships(source_concept_id, relationship_type, status);
CREATE INDEX IF NOT EXISTS idx_barry_semantic_relationships_target
  ON public.barry_semantic_relationships(target_concept_id, relationship_type, status);
CREATE INDEX IF NOT EXISTS idx_barry_evidence_concepts_source
  ON public.barry_evidence_concepts(source_type, source_record_id);
CREATE INDEX IF NOT EXISTS idx_barry_evidence_concepts_concept
  ON public.barry_evidence_concepts(concept_id, review_status);
CREATE INDEX IF NOT EXISTS idx_barry_semantic_review_queue_status
  ON public.barry_semantic_review_queue(status, risk_level, created_at);
CREATE INDEX IF NOT EXISTS idx_barry_grounding_runs_created
  ON public.barry_grounding_runs(created_at DESC);

CREATE OR REPLACE FUNCTION public.barry_normalize_semantic_text(value text)
RETURNS text
LANGUAGE sql
IMMUTABLE
STRICT
SET search_path = public
AS $$
  SELECT btrim(regexp_replace(
    regexp_replace(
      regexp_replace(lower(value), '[''’]', '', 'g'),
      '[^a-z0-9]+', ' ', 'g'
    ),
    '\s+', ' ', 'g'
  ));
$$;

CREATE OR REPLACE FUNCTION public.barry_set_semantic_alias_normalized()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.alias_text_normalized := public.barry_normalize_semantic_text(NEW.alias_text);
  NEW.updated_at := now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_barry_semantic_alias_normalized
  ON public.barry_semantic_aliases;
CREATE TRIGGER trg_barry_semantic_alias_normalized
BEFORE INSERT OR UPDATE OF alias_text
ON public.barry_semantic_aliases
FOR EACH ROW
EXECUTE FUNCTION public.barry_set_semantic_alias_normalized();

CREATE OR REPLACE FUNCTION public.barry_prevent_semantic_identity_change()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF NEW.concept_key <> OLD.concept_key OR NEW.concept_type <> OLD.concept_type THEN
    RAISE EXCEPTION 'Semantic concept identity is immutable';
  END IF;
  NEW.updated_at := now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_barry_semantic_concept_identity
  ON public.barry_semantic_concepts;
CREATE TRIGGER trg_barry_semantic_concept_identity
BEFORE UPDATE ON public.barry_semantic_concepts
FOR EACH ROW
EXECUTE FUNCTION public.barry_prevent_semantic_identity_change();

CREATE OR REPLACE FUNCTION public.activate_barry_semantic_version(target_version text)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
DECLARE
  target_id uuid;
BEGIN
  SELECT id INTO target_id
  FROM public.barry_semantic_versions
  WHERE version = target_version
  FOR UPDATE;

  IF target_id IS NULL THEN
    RAISE EXCEPTION 'Unknown Barry semantic version: %', target_version;
  END IF;

  UPDATE public.barry_semantic_versions
  SET status = 'retired'
  WHERE status = 'active' AND id <> target_id;

  UPDATE public.barry_semantic_versions
  SET status = 'active', activated_at = now()
  WHERE id = target_id;

  RETURN target_id;
END;
$$;

REVOKE ALL ON FUNCTION public.activate_barry_semantic_version(text)
  FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.activate_barry_semantic_version(text)
  TO service_role;

INSERT INTO public.barry_semantic_versions (
  version, status, change_summary, activated_at
)
VALUES (
  '1.0.0-phase1',
  'active',
  'Initial U435 and U1700L semantic foundation',
  now()
)
ON CONFLICT (version) DO NOTHING;

WITH active_version AS (
  SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'
)
INSERT INTO public.barry_semantic_concepts (
  concept_key, concept_type, canonical_name, description, status,
  semantic_version_id, provenance
)
SELECT seed.concept_key, seed.concept_type, seed.canonical_name,
       seed.description, 'approved', active_version.id, seed.provenance
FROM active_version
CROSS JOIN (VALUES
  ('vehicle_model.u435', 'vehicle_model', 'U435', 'Mercedes-Benz Unimog 435 series', '{"source":"barry_v2_vehicle_models"}'::jsonb),
  ('vehicle_model.u1700l', 'vehicle_model', 'U1700L', 'Mercedes-Benz Unimog U1700L', '{"source":"barry_v2_vehicle_models"}'::jsonb),
  ('vehicle_variant.u1700l_38', 'vehicle_variant', 'U1700L/38', 'U1700L long-wheelbase 3.85 metre variant', '{}'::jsonb),
  ('component.load_platform', 'component', 'load platform', 'Cargo tray, platform body, or fitted load bed', '{}'::jsonb),
  ('vehicle_system.steering', 'vehicle_system', 'steering', 'Mechanical and hydraulic steering system', '{}'::jsonb),
  ('vehicle_system.hydraulics', 'vehicle_system', 'hydraulics', 'Vehicle hydraulic systems', '{}'::jsonb),
  ('vehicle_system.brakes', 'vehicle_system', 'brakes', 'Service and parking brake systems', '{}'::jsonb),
  ('vehicle_system.compressed_air', 'vehicle_system', 'compressed air', 'Compressed-air generation and control', '{}'::jsonb),
  ('vehicle_system.axles', 'vehicle_system', 'axles', 'Axles, differentials, wheel ends, and portal drives', '{}'::jsonb),
  ('vehicle_system.engine', 'vehicle_system', 'engine', 'Engine and fuel system', '{}'::jsonb),
  ('vehicle_system.cooling', 'vehicle_system', 'cooling', 'Engine cooling system', '{}'::jsonb),
  ('vehicle_system.transmission', 'vehicle_system', 'transmission', 'Clutch, gearbox, transfer case, and driveline', '{}'::jsonb),
  ('vehicle_system.electrical', 'vehicle_system', 'electrical', 'Electrical generation, storage, wiring, and starting', '{}'::jsonb),
  ('vehicle_system.suspension', 'vehicle_system', 'suspension', 'Springs, dampers, and suspension links', '{}'::jsonb),
  ('component.steering_gear', 'component', 'steering gear', 'Steering gear assembly', '{"legacy_component_name":"steering gearbox"}'::jsonb),
  ('component.sector_shaft', 'component', 'sector shaft', 'Steering gear output shaft', '{}'::jsonb),
  ('component.steering_column_coupling', 'component', 'steering column coupling', 'Steering column coupling or universal joint', '{}'::jsonb),
  ('component.pitman_arm', 'component', 'pitman arm', 'Steering arm fitted to the steering gear output', '{}'::jsonb),
  ('component.power_steering_pump', 'component', 'power steering pump', 'Hydraulic pump supplying steering assistance', '{}'::jsonb),
  ('component.steering_reservoir', 'component', 'steering reservoir', 'Power-steering fluid reservoir', '{}'::jsonb),
  ('component.portal_hub', 'component', 'portal hub', 'Portal wheel hub and reduction drive assembly', '{"legacy_component_name":"portal hub"}'::jsonb),
  ('component.differential', 'component', 'differential', 'Axle differential assembly', '{"legacy_component_name":"differential"}'::jsonb),
  ('component.brake_caliper', 'component', 'brake caliper', 'Service brake caliper', '{}'::jsonb),
  ('component.air_compressor', 'component', 'air compressor', 'Compressed-air supply compressor', '{}'::jsonb),
  ('component.water_pump', 'component', 'water pump', 'Engine coolant circulation pump', '{"legacy_component_name":"water pump"}'::jsonb),
  ('component.radiator', 'component', 'radiator', 'Engine coolant radiator', '{"legacy_component_name":"radiator"}'::jsonb),
  ('component.fuel_injection_pump', 'component', 'fuel injection pump', 'Diesel fuel injection pump', '{"legacy_component_name":"fuel injection pump"}'::jsonb),
  ('component.transfer_case', 'component', 'transfer case', 'Transfer gearbox assembly', '{}'::jsonb),
  ('component.clutch', 'component', 'clutch', 'Main drivetrain clutch', '{"legacy_component_name":"clutch"}'::jsonb),
  ('component.alternator', 'component', 'alternator', 'Electrical charging generator', '{}'::jsonb),
  ('symptom.external_fluid_leak', 'symptom', 'external fluid leak', 'Visible escape of oil or fluid', '{}'::jsonb),
  ('symptom.overheating', 'symptom', 'overheating', 'Temperature exceeding normal operating range', '{}'::jsonb),
  ('symptom.no_start', 'symptom', 'no start', 'Engine does not start', '{}'::jsonb),
  ('symptom.low_pressure', 'symptom', 'low pressure', 'System pressure below specification', '{}'::jsonb),
  ('symptom.noise', 'symptom', 'noise', 'Unexpected mechanical or pneumatic noise', '{}'::jsonb),
  ('symptom.vibration', 'symptom', 'vibration', 'Unexpected or excessive vibration', '{}'::jsonb),
  ('operation.inspect', 'operation', 'inspect', 'Observe or examine without dismantling', '{}'::jsonb),
  ('operation.diagnose', 'operation', 'diagnose', 'Identify a fault using documented evidence', '{}'::jsonb),
  ('operation.remove', 'operation', 'remove', 'Remove a component using a documented procedure', '{}'::jsonb),
  ('operation.install', 'operation', 'install', 'Install a component using a documented procedure', '{}'::jsonb),
  ('operation.adjust', 'operation', 'adjust', 'Change a controlled setting', '{}'::jsonb),
  ('operation.refill', 'operation', 'refill', 'Add an approved fluid to a specified level or capacity', '{}'::jsonb),
  ('operation.replace', 'operation', 'replace', 'Remove and install a service part', '{}'::jsonb),
  ('operation.check_fluid_level', 'operation', 'check fluid level', 'Verify fluid level by the documented method', '{}'::jsonb),
  ('operation.bleed', 'operation', 'bleed', 'Remove air from a fluid or brake circuit', '{}'::jsonb),
  ('claim_class.procedure_step', 'claim_class', 'procedure step', 'An ordered maintenance or repair action', '{}'::jsonb),
  ('claim_class.diagnostic_cause', 'claim_class', 'diagnostic cause', 'A proposed cause of a symptom', '{}'::jsonb),
  ('claim_class.diagnostic_test', 'claim_class', 'diagnostic test', 'A check used to distinguish possible causes', '{}'::jsonb),
  ('claim_class.specification', 'claim_class', 'specification claim', 'A stated technical property or limit', '{}'::jsonb),
  ('claim_class.fluid', 'claim_class', 'fluid claim', 'A statement identifying an approved fluid', '{}'::jsonb),
  ('claim_class.capacity', 'claim_class', 'capacity claim', 'A stated fluid or system quantity', '{}'::jsonb),
  ('claim_class.torque', 'claim_class', 'torque claim', 'A stated tightening torque', '{}'::jsonb),
  ('claim_class.part_number', 'claim_class', 'part number claim', 'A stated manufacturer or catalogue identifier', '{}'::jsonb),
  ('claim_class.compatibility', 'claim_class', 'compatibility claim', 'A statement of model, variant, or component applicability', '{}'::jsonb),
  ('claim_class.component_identity', 'claim_class', 'component identity', 'A statement identifying a component or diagram item', '{}'::jsonb),
  ('claim_class.safety_warning', 'claim_class', 'safety warning', 'A warning about a documented hazard or precaution', '{}'::jsonb),
  ('claim_class.general_description', 'claim_class', 'general description', 'A non-procedural technical explanation', '{}'::jsonb),
  ('property.fluid_capacity', 'property', 'fluid capacity', 'Specified fluid quantity', '{}'::jsonb),
  ('property.torque', 'property', 'torque', 'Specified tightening torque', '{}'::jsonb),
  ('property.operating_pressure', 'property', 'operating pressure', 'Specified operating or test pressure', '{}'::jsonb),
  ('property.clearance', 'property', 'clearance', 'Specified gap, play, or clearance', '{}'::jsonb),
  ('property.fluid_specification', 'property', 'fluid specification', 'Approved fluid type or standard', '{}'::jsonb),
  ('property.part_number', 'property', 'part number', 'Catalogue or manufacturer part identifier', '{}'::jsonb),
  ('property.dimension', 'property', 'dimension', 'Physical length, width, height, or wheelbase measurement', '{}'::jsonb),
  ('fluid.atf', 'fluid', 'automatic transmission fluid', 'ATF fluid class', '{}'::jsonb),
  ('fluid.hydraulic_oil', 'fluid', 'hydraulic oil', 'Hydraulic oil fluid class', '{}'::jsonb),
  ('fluid.engine_oil', 'fluid', 'engine oil', 'Engine lubricating oil fluid class', '{}'::jsonb),
  ('unit.litre', 'unit', 'litre', 'Metric volume unit', '{}'::jsonb),
  ('unit.newton_metre', 'unit', 'newton metre', 'Metric torque unit', '{}'::jsonb),
  ('unit.bar', 'unit', 'bar', 'Pressure unit', '{}'::jsonb),
  ('part.sealing_ring', 'part', 'sealing ring', 'Generic sealing ring pending exact catalogue identification', '{}'::jsonb),
  ('part.repair_kit', 'part', 'repair kit', 'Generic repair kit pending exact catalogue identification', '{}'::jsonb),
  ('tool.puller', 'tool', 'puller', 'General or special-purpose component puller', '{}'::jsonb),
  ('tool.pressure_gauge', 'tool', 'pressure gauge', 'Gauge used for a documented pressure test', '{}'::jsonb),
  ('document_role.workshop_manual', 'document_role', 'workshop manual', 'Procedure and specification authority', '{}'::jsonb),
  ('document_role.maintenance_manual', 'document_role', 'maintenance manual', 'Routine maintenance authority', '{}'::jsonb),
  ('document_role.owners_manual', 'document_role', 'owners manual', 'Operation and owner-maintenance authority', '{}'::jsonb),
  ('document_role.parts_catalog', 'document_role', 'parts catalogue', 'Component and part identification authority', '{}'::jsonb),
  ('document_role.validated_knowledge', 'document_role', 'validated knowledge', 'Reviewed technical knowledge', '{}'::jsonb),
  ('page_type.procedure', 'page_type', 'procedure', 'Step-by-step technical procedure', '{}'::jsonb),
  ('page_type.diagnostic', 'page_type', 'diagnostic', 'Fault diagnosis or test content', '{}'::jsonb),
  ('page_type.specification', 'page_type', 'specification', 'Technical values and conditions', '{}'::jsonb),
  ('page_type.warning', 'page_type', 'warning', 'Hazard and precaution content', '{}'::jsonb),
  ('page_type.diagram', 'page_type', 'diagram', 'Technical illustration or exploded view', '{}'::jsonb),
  ('page_type.parts_list', 'page_type', 'parts list', 'Catalogue part list', '{}'::jsonb),
  ('page_type.explanation', 'page_type', 'explanation', 'Descriptive technical content', '{}'::jsonb),
  ('page_type.index', 'page_type', 'index', 'Document navigation content', '{}'::jsonb),
  ('hazard.loss_of_steering_assist', 'hazard', 'loss of steering assist', 'Reduced or absent hydraulic steering assistance', '{}'::jsonb)
) AS seed(concept_key, concept_type, canonical_name, description, provenance)
ON CONFLICT (concept_key) DO NOTHING;

WITH mappings(component_key, system_key) AS (VALUES
  ('component.steering_gear', 'vehicle_system.steering'),
  ('component.sector_shaft', 'vehicle_system.steering'),
  ('component.steering_column_coupling', 'vehicle_system.steering'),
  ('component.pitman_arm', 'vehicle_system.steering'),
  ('component.power_steering_pump', 'vehicle_system.steering'),
  ('component.steering_reservoir', 'vehicle_system.steering'),
  ('component.portal_hub', 'vehicle_system.axles'),
  ('component.differential', 'vehicle_system.axles'),
  ('component.brake_caliper', 'vehicle_system.brakes'),
  ('component.air_compressor', 'vehicle_system.compressed_air'),
  ('component.water_pump', 'vehicle_system.cooling'),
  ('component.radiator', 'vehicle_system.cooling'),
  ('component.fuel_injection_pump', 'vehicle_system.engine'),
  ('component.transfer_case', 'vehicle_system.transmission'),
  ('component.clutch', 'vehicle_system.transmission'),
  ('component.alternator', 'vehicle_system.electrical')
)
UPDATE public.barry_semantic_concepts component
SET system_concept_id = system.id
FROM mappings
JOIN public.barry_semantic_concepts system
  ON system.concept_key = mappings.system_key
WHERE component.concept_key = mappings.component_key;

UPDATE public.barry_semantic_concepts
SET model_scope = ARRAY['vehicle_model.u1700l']
WHERE concept_key = 'vehicle_variant.u1700l_38';

WITH active_version AS (
  SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'
),
seed(alias_text, concept_key, alias_type, confidence, context_key) AS (VALUES
  ('435', 'vehicle_model.u435', 'abbreviation', 0.900, NULL),
  ('u 435', 'vehicle_model.u435', 'spelling_variant', 0.950, NULL),
  ('1700l', 'vehicle_model.u1700l', 'abbreviation', 0.950, NULL),
  ('u1700', 'vehicle_model.u1700l', 'abbreviation', 0.900, NULL),
  ('u 1700 l', 'vehicle_model.u1700l', 'spelling_variant', 0.950, NULL),
  ('tray', 'component.load_platform', 'owner_term', 0.950, NULL),
  ('truck bed', 'component.load_platform', 'owner_term', 0.900, NULL),
  ('platform body', 'component.load_platform', 'workshop_term', 0.950, NULL),
  ('cargo body', 'component.load_platform', 'workshop_term', 0.900, NULL),
  ('steering box', 'component.steering_gear', 'owner_term', 0.950, NULL),
  ('steeringbox', 'component.steering_gear', 'spelling_variant', 0.950, NULL),
  ('steering gearbox', 'component.steering_gear', 'workshop_term', 0.950, NULL),
  ('output shaft', 'component.sector_shaft', 'owner_term', 0.750, 'vehicle_system.steering'),
  ('column joint', 'component.steering_column_coupling', 'owner_term', 0.800, NULL),
  ('steering universal joint', 'component.steering_column_coupling', 'workshop_term', 0.900, NULL),
  ('drop arm', 'component.pitman_arm', 'workshop_term', 0.800, NULL),
  ('steering pump', 'component.power_steering_pump', 'owner_term', 0.900, NULL),
  ('pump', 'component.power_steering_pump', 'owner_term', 0.650, 'vehicle_system.steering'),
  ('fluid reservoir', 'component.steering_reservoir', 'owner_term', 0.700, 'vehicle_system.steering'),
  ('wheel hub', 'component.portal_hub', 'owner_term', 0.850, NULL),
  ('hub', 'component.portal_hub', 'owner_term', 0.700, 'vehicle_system.axles'),
  ('diff', 'component.differential', 'abbreviation', 0.950, NULL),
  ('caliper', 'component.brake_caliper', 'owner_term', 0.850, 'vehicle_system.brakes'),
  ('compressor', 'component.air_compressor', 'owner_term', 0.750, 'vehicle_system.compressed_air'),
  ('coolant pump', 'component.water_pump', 'workshop_term', 0.950, NULL),
  ('pump', 'component.water_pump', 'owner_term', 0.650, 'vehicle_system.cooling'),
  ('injection pump', 'component.fuel_injection_pump', 'owner_term', 0.950, NULL),
  ('gearbox', 'vehicle_system.transmission', 'owner_term', 0.800, NULL),
  ('transfer box', 'component.transfer_case', 'owner_term', 0.900, NULL),
  ('generator', 'component.alternator', 'workshop_term', 0.800, NULL),
  ('leak', 'symptom.external_fluid_leak', 'owner_term', 0.900, NULL),
  ('leaking', 'symptom.external_fluid_leak', 'owner_term', 0.950, NULL),
  ('oil leak', 'symptom.external_fluid_leak', 'owner_term', 0.950, NULL),
  ('running hot', 'symptom.overheating', 'owner_term', 0.900, NULL),
  ('wont start', 'symptom.no_start', 'spelling_variant', 0.950, NULL),
  ('low pressure', 'symptom.low_pressure', 'owner_term', 0.950, NULL),
  ('rattle', 'symptom.noise', 'owner_term', 0.800, NULL),
  ('shaking', 'symptom.vibration', 'owner_term', 0.850, NULL),
  ('check', 'operation.inspect', 'owner_term', 0.750, NULL),
  ('look at', 'operation.inspect', 'owner_term', 0.700, NULL),
  ('troubleshoot', 'operation.diagnose', 'owner_term', 0.900, NULL),
  ('take out', 'operation.remove', 'owner_term', 0.850, NULL),
  ('fit', 'operation.install', 'owner_term', 0.800, NULL),
  ('top up', 'operation.refill', 'owner_term', 0.850, NULL),
  ('change', 'operation.replace', 'owner_term', 0.700, NULL),
  ('fill quantity', 'property.fluid_capacity', 'workshop_term', 0.900, NULL),
  ('how much oil', 'property.fluid_capacity', 'owner_term', 0.900, NULL),
  ('how much fluid', 'property.fluid_capacity', 'owner_term', 0.900, NULL),
  ('oil capacity', 'property.fluid_capacity', 'owner_term', 0.950, NULL),
  ('tightening torque', 'property.torque', 'workshop_term', 0.950, NULL),
  ('pressure', 'property.operating_pressure', 'owner_term', 0.750, NULL),
  ('gap', 'property.clearance', 'owner_term', 0.800, NULL),
  ('fluid type', 'property.fluid_specification', 'owner_term', 0.900, NULL),
  ('part no', 'property.part_number', 'abbreviation', 0.900, NULL),
  ('length', 'property.dimension', 'owner_term', 0.950, NULL),
  ('lenth', 'property.dimension', 'common_misspelling', 0.950, NULL),
  ('width', 'property.dimension', 'owner_term', 0.950, NULL),
  ('height', 'property.dimension', 'owner_term', 0.900, NULL),
  ('dimensions', 'property.dimension', 'owner_term', 0.950, NULL),
  ('measurement', 'property.dimension', 'owner_term', 0.850, NULL),
  ('wheelbase', 'property.dimension', 'workshop_term', 0.950, NULL),
  ('seal ring', 'part.sealing_ring', 'workshop_term', 0.900, NULL),
  ('atf', 'fluid.atf', 'abbreviation', 1.000, NULL)
)
INSERT INTO public.barry_semantic_aliases (
  alias_text, alias_text_normalized, concept_id, alias_type, confidence,
  context_concept_ids, status, semantic_version_id, provenance
)
SELECT seed.alias_text, public.barry_normalize_semantic_text(seed.alias_text),
       concept.id, seed.alias_type, seed.confidence,
       CASE
         WHEN context_concept.id IS NULL THEN '{}'::uuid[]
         ELSE ARRAY[context_concept.id]
       END,
       'approved',
       active_version.id, '{"source":"phase1_seed"}'::jsonb
FROM seed
CROSS JOIN active_version
JOIN public.barry_semantic_concepts concept
  ON concept.concept_key = seed.concept_key
LEFT JOIN public.barry_semantic_concepts context_concept
  ON context_concept.concept_key = seed.context_key
ON CONFLICT (semantic_version_id, alias_text_normalized, concept_id) DO NOTHING;

WITH active_version AS (
  SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'
)
INSERT INTO public.barry_semantic_aliases (
  alias_text, alias_text_normalized, concept_id, alias_type, language,
  confidence, status, semantic_version_id, provenance
)
SELECT synonyms.synonym::text,
       public.barry_normalize_semantic_text(synonyms.synonym::text),
       semantic_concept.id,
       'workshop_term',
       COALESCE(synonyms.lang, 'en'),
       LEAST(GREATEST(COALESCE(synonyms.confidence, 0.8), 0), 1),
       'approved',
       active_version.id,
       jsonb_build_object('source', 'component_synonyms', 'source_id', synonyms.id)
FROM public.component_synonyms synonyms
JOIN public.components legacy_component ON legacy_component.id = synonyms.component_id
JOIN public.barry_semantic_concepts semantic_concept
  ON semantic_concept.provenance->>'legacy_component_name' = legacy_component.name::text
CROSS JOIN active_version
ON CONFLICT (semantic_version_id, alias_text_normalized, concept_id) DO NOTHING;

WITH active_version AS (
  SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'
)
INSERT INTO public.barry_semantic_review_queue (
  dedupe_key, review_type, proposed_payload, risk_level, semantic_version_id
)
SELECT 'rps_component_synonym:' || synonym.id,
       'alias',
       jsonb_build_object(
         'alias_text', COALESCE(synonym.payload->>'phrase', synonym.payload->>'user_term'),
         'normalized_phrase', COALESCE(
           synonym.payload->>'normalized_phrase',
           public.barry_normalize_semantic_text(
             COALESCE(synonym.payload->>'phrase', synonym.payload->>'user_term')
           )
         ),
         'group_hint', COALESCE(synonym.payload->>'group_hint', synonym.payload->>'group_code'),
         'weight', COALESCE(synonym.payload->'weight', synonym.payload->'confidence'),
         'source', 'rps_component_synonyms',
         'source_id', synonym.id
       ),
       'controlled',
       active_version.id
FROM (
  SELECT source.id, to_jsonb(source) AS payload
  FROM public.rps_component_synonyms source
) synonym
CROSS JOIN active_version
ON CONFLICT (dedupe_key) DO NOTHING;

WITH active_version AS (
  SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'
),
seed(source_key, relationship_type, target_key) AS (VALUES
  ('component.sector_shaft', 'part_of', 'component.steering_gear'),
  ('component.steering_column_coupling', 'connected_to', 'component.steering_gear'),
  ('component.pitman_arm', 'connected_to', 'component.steering_gear'),
  ('component.steering_gear', 'has_part', 'component.sector_shaft'),
  ('component.steering_gear', 'has_part', 'part.sealing_ring'),
  ('vehicle_system.steering', 'has_property', 'property.fluid_capacity'),
  ('vehicle_system.steering', 'has_property', 'property.fluid_specification'),
  ('component.portal_hub', 'has_property', 'property.torque'),
  ('component.differential', 'has_property', 'property.fluid_capacity'),
  ('component.air_compressor', 'has_property', 'property.operating_pressure')
)
INSERT INTO public.barry_semantic_relationships (
  source_concept_id, relationship_type, target_concept_id, confidence,
  status, semantic_version_id, provenance
)
SELECT source.id, seed.relationship_type, target.id, 1.000, 'approved',
       active_version.id, '{"source":"phase1_seed"}'::jsonb
FROM seed
CROSS JOIN active_version
JOIN public.barry_semantic_concepts source ON source.concept_key = seed.source_key
JOIN public.barry_semantic_concepts target ON target.concept_key = seed.target_key
ON CONFLICT (
  semantic_version_id, source_concept_id, relationship_type, target_concept_id
) DO NOTHING;

ALTER TABLE public.barry_semantic_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.barry_semantic_concepts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.barry_semantic_aliases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.barry_semantic_relationships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.barry_evidence_concepts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.barry_semantic_review_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.barry_grounding_runs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Service role manages semantic versions" ON public.barry_semantic_versions;
CREATE POLICY "Service role manages semantic versions"
  ON public.barry_semantic_versions FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');
DROP POLICY IF EXISTS "Admins read semantic versions" ON public.barry_semantic_versions;
CREATE POLICY "Admins read semantic versions"
  ON public.barry_semantic_versions FOR SELECT
  USING (public.check_admin_access());

DROP POLICY IF EXISTS "Service role manages semantic concepts" ON public.barry_semantic_concepts;
CREATE POLICY "Service role manages semantic concepts"
  ON public.barry_semantic_concepts FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');
DROP POLICY IF EXISTS "Admins read semantic concepts" ON public.barry_semantic_concepts;
CREATE POLICY "Admins read semantic concepts"
  ON public.barry_semantic_concepts FOR SELECT
  USING (public.check_admin_access());

DROP POLICY IF EXISTS "Service role manages semantic aliases" ON public.barry_semantic_aliases;
CREATE POLICY "Service role manages semantic aliases"
  ON public.barry_semantic_aliases FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');
DROP POLICY IF EXISTS "Admins read semantic aliases" ON public.barry_semantic_aliases;
CREATE POLICY "Admins read semantic aliases"
  ON public.barry_semantic_aliases FOR SELECT
  USING (public.check_admin_access());

DROP POLICY IF EXISTS "Service role manages semantic relationships" ON public.barry_semantic_relationships;
CREATE POLICY "Service role manages semantic relationships"
  ON public.barry_semantic_relationships FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');
DROP POLICY IF EXISTS "Admins read semantic relationships" ON public.barry_semantic_relationships;
CREATE POLICY "Admins read semantic relationships"
  ON public.barry_semantic_relationships FOR SELECT
  USING (public.check_admin_access());

DROP POLICY IF EXISTS "Service role manages evidence concepts" ON public.barry_evidence_concepts;
CREATE POLICY "Service role manages evidence concepts"
  ON public.barry_evidence_concepts FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');
DROP POLICY IF EXISTS "Admins read evidence concepts" ON public.barry_evidence_concepts;
CREATE POLICY "Admins read evidence concepts"
  ON public.barry_evidence_concepts FOR SELECT
  USING (public.check_admin_access());

DROP POLICY IF EXISTS "Service role manages semantic review queue" ON public.barry_semantic_review_queue;
CREATE POLICY "Service role manages semantic review queue"
  ON public.barry_semantic_review_queue FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');
DROP POLICY IF EXISTS "Admins read semantic review queue" ON public.barry_semantic_review_queue;
CREATE POLICY "Admins read semantic review queue"
  ON public.barry_semantic_review_queue FOR SELECT
  USING (public.check_admin_access());

DROP POLICY IF EXISTS "Service role manages grounding runs" ON public.barry_grounding_runs;
CREATE POLICY "Service role manages grounding runs"
  ON public.barry_grounding_runs FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');
DROP POLICY IF EXISTS "Admins read grounding runs" ON public.barry_grounding_runs;
CREATE POLICY "Admins read grounding runs"
  ON public.barry_grounding_runs FOR SELECT
  USING (public.check_admin_access());

GRANT SELECT ON public.barry_semantic_versions TO authenticated;
GRANT SELECT ON public.barry_semantic_concepts TO authenticated;
GRANT SELECT ON public.barry_semantic_aliases TO authenticated;
GRANT SELECT ON public.barry_semantic_relationships TO authenticated;
GRANT SELECT ON public.barry_evidence_concepts TO authenticated;
GRANT SELECT ON public.barry_semantic_review_queue TO authenticated;
GRANT SELECT ON public.barry_grounding_runs TO authenticated;

GRANT ALL ON public.barry_semantic_versions TO service_role;
GRANT ALL ON public.barry_semantic_concepts TO service_role;
GRANT ALL ON public.barry_semantic_aliases TO service_role;
GRANT ALL ON public.barry_semantic_relationships TO service_role;
GRANT ALL ON public.barry_evidence_concepts TO service_role;
GRANT ALL ON public.barry_semantic_review_queue TO service_role;
GRANT ALL ON public.barry_grounding_runs TO service_role;

COMMIT;
