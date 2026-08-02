BEGIN;

INSERT INTO public.barry_evidence_concepts (
  source_type, source_record_id, concept_id, annotation_role, confidence,
  method, review_status, semantic_version_id, evidence_unit_id, model_scope,
  backfill_run_id, provenance
)
SELECT
  'barry_v2_content_block',
  '4ce5dffc-f16f-1a55-f12a-d9c595ae6469',
  concept.id,
  'property',
  '0.700',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '94d53062-9e6c-583f-8ea4-8c12db24d940',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":false,"document_key":"barry_v2_manual:9ba1297a-2aa6-de38-b971-ad38336442ad","matched_name":"torque","document_role":"workshop_manual"}'::jsonb
FROM public.barry_semantic_concepts concept
WHERE concept.concept_key = 'property.torque'
ON CONFLICT (source_type, source_record_id, concept_id, annotation_role, semantic_version_id)
DO UPDATE SET
  confidence = EXCLUDED.confidence,
  review_status = EXCLUDED.review_status,
  evidence_unit_id = EXCLUDED.evidence_unit_id,
  model_scope = EXCLUDED.model_scope,
  provenance = EXCLUDED.provenance;
INSERT INTO public.barry_evidence_concepts (
  source_type, source_record_id, concept_id, annotation_role, confidence,
  method, review_status, semantic_version_id, evidence_unit_id, model_scope,
  backfill_run_id, provenance
)
SELECT
  'barry_v2_content_block',
  '4e518aec-c52c-dd35-d7da-1bad6fad4e26',
  concept.id,
  'mentioned_component',
  '0.700',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'e3cfb166-eb93-5033-81b1-d7f53061df64',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":false,"document_key":"barry_v2_manual:7147712a-37e0-b066-2067-672767b2b617","matched_name":"sealing ring","document_role":"workshop_manual"}'::jsonb
FROM public.barry_semantic_concepts concept
WHERE concept.concept_key = 'part.sealing_ring'
ON CONFLICT (source_type, source_record_id, concept_id, annotation_role, semantic_version_id)
DO UPDATE SET
  confidence = EXCLUDED.confidence,
  review_status = EXCLUDED.review_status,
  evidence_unit_id = EXCLUDED.evidence_unit_id,
  model_scope = EXCLUDED.model_scope,
  provenance = EXCLUDED.provenance;
INSERT INTO public.barry_evidence_concepts (
  source_type, source_record_id, concept_id, annotation_role, confidence,
  method, review_status, semantic_version_id, evidence_unit_id, model_scope,
  backfill_run_id, provenance
)
SELECT
  'barry_v2_content_block',
  '4f168050-af1d-0b21-b152-f07ee6df29d9',
  concept.id,
  'mentioned_component',
  '0.700',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'bfb8c522-a8b5-59a0-875a-b491d4ecc047',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":false,"document_key":"barry_v2_manual:7147712a-37e0-b066-2067-672767b2b617","matched_name":"sealing ring","document_role":"workshop_manual"}'::jsonb
FROM public.barry_semantic_concepts concept
WHERE concept.concept_key = 'part.sealing_ring'
ON CONFLICT (source_type, source_record_id, concept_id, annotation_role, semantic_version_id)
DO UPDATE SET
  confidence = EXCLUDED.confidence,
  review_status = EXCLUDED.review_status,
  evidence_unit_id = EXCLUDED.evidence_unit_id,
  model_scope = EXCLUDED.model_scope,
  provenance = EXCLUDED.provenance;
INSERT INTO public.barry_evidence_concepts (
  source_type, source_record_id, concept_id, annotation_role, confidence,
  method, review_status, semantic_version_id, evidence_unit_id, model_scope,
  backfill_run_id, provenance
)
SELECT
  'barry_v2_content_block',
  '4f8293f3-0853-ff6d-dc44-ee7e27ce09c1',
  concept.id,
  'operation',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '36d690c5-059e-5bbf-8a96-f36d933cb1d5',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":false,"document_key":"barry_v2_manual:f374ac43-7586-ef55-8672-0923339390bb","matched_name":"bleed","document_role":"maintenance_manual"}'::jsonb
FROM public.barry_semantic_concepts concept
WHERE concept.concept_key = 'operation.bleed'
ON CONFLICT (source_type, source_record_id, concept_id, annotation_role, semantic_version_id)
DO UPDATE SET
  confidence = EXCLUDED.confidence,
  review_status = EXCLUDED.review_status,
  evidence_unit_id = EXCLUDED.evidence_unit_id,
  model_scope = EXCLUDED.model_scope,
  provenance = EXCLUDED.provenance;
INSERT INTO public.barry_evidence_concepts (
  source_type, source_record_id, concept_id, annotation_role, confidence,
  method, review_status, semantic_version_id, evidence_unit_id, model_scope,
  backfill_run_id, provenance
)
SELECT
  'barry_v2_content_block',
  '4f8293f3-0853-ff6d-dc44-ee7e27ce09c1',
  concept.id,
  'mentioned_component',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '36d690c5-059e-5bbf-8a96-f36d933cb1d5',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"barry_v2_manual:f374ac43-7586-ef55-8672-0923339390bb","matched_name":"steering","document_role":"maintenance_manual"}'::jsonb
FROM public.barry_semantic_concepts concept
WHERE concept.concept_key = 'vehicle_system.steering'
ON CONFLICT (source_type, source_record_id, concept_id, annotation_role, semantic_version_id)
DO UPDATE SET
  confidence = EXCLUDED.confidence,
  review_status = EXCLUDED.review_status,
  evidence_unit_id = EXCLUDED.evidence_unit_id,
  model_scope = EXCLUDED.model_scope,
  provenance = EXCLUDED.provenance;
INSERT INTO public.barry_evidence_concepts (
  source_type, source_record_id, concept_id, annotation_role, confidence,
  method, review_status, semantic_version_id, evidence_unit_id, model_scope,
  backfill_run_id, provenance
)
SELECT
  'barry_v2_content_block',
  '4f8293f3-0853-ff6d-dc44-ee7e27ce09c1',
  concept.id,
  'mentioned_component',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '36d690c5-059e-5bbf-8a96-f36d933cb1d5',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":false,"document_key":"barry_v2_manual:f374ac43-7586-ef55-8672-0923339390bb","matched_name":"engine","document_role":"maintenance_manual"}'::jsonb
FROM public.barry_semantic_concepts concept
WHERE concept.concept_key = 'vehicle_system.engine'
ON CONFLICT (source_type, source_record_id, concept_id, annotation_role, semantic_version_id)
DO UPDATE SET
  confidence = EXCLUDED.confidence,
  review_status = EXCLUDED.review_status,
  evidence_unit_id = EXCLUDED.evidence_unit_id,
  model_scope = EXCLUDED.model_scope,
  provenance = EXCLUDED.provenance;
INSERT INTO public.barry_evidence_concepts (
  source_type, source_record_id, concept_id, annotation_role, confidence,
  method, review_status, semantic_version_id, evidence_unit_id, model_scope,
  backfill_run_id, provenance
)
SELECT
  'barry_v2_content_block',
  '4f8293f3-0853-ff6d-dc44-ee7e27ce09c1',
  concept.id,
  'operation',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '36d690c5-059e-5bbf-8a96-f36d933cb1d5',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":false,"document_key":"barry_v2_manual:f374ac43-7586-ef55-8672-0923339390bb","matched_name":"inspect","document_role":"maintenance_manual"}'::jsonb
FROM public.barry_semantic_concepts concept
WHERE concept.concept_key = 'operation.inspect'
ON CONFLICT (source_type, source_record_id, concept_id, annotation_role, semantic_version_id)
DO UPDATE SET
  confidence = EXCLUDED.confidence,
  review_status = EXCLUDED.review_status,
  evidence_unit_id = EXCLUDED.evidence_unit_id,
  model_scope = EXCLUDED.model_scope,
  provenance = EXCLUDED.provenance;
INSERT INTO public.barry_evidence_concepts (
  source_type, source_record_id, concept_id, annotation_role, confidence,
  method, review_status, semantic_version_id, evidence_unit_id, model_scope,
  backfill_run_id, provenance
)
SELECT
  'barry_v2_content_block',
  '4f8293f3-0853-ff6d-dc44-ee7e27ce09c1',
  concept.id,
  'operation',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '36d690c5-059e-5bbf-8a96-f36d933cb1d5',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":false,"document_key":"barry_v2_manual:f374ac43-7586-ef55-8672-0923339390bb","matched_name":"remove","document_role":"maintenance_manual"}'::jsonb
FROM public.barry_semantic_concepts concept
WHERE concept.concept_key = 'operation.remove'
ON CONFLICT (source_type, source_record_id, concept_id, annotation_role, semantic_version_id)
DO UPDATE SET
  confidence = EXCLUDED.confidence,
  review_status = EXCLUDED.review_status,
  evidence_unit_id = EXCLUDED.evidence_unit_id,
  model_scope = EXCLUDED.model_scope,
  provenance = EXCLUDED.provenance;
INSERT INTO public.barry_evidence_concepts (
  source_type, source_record_id, concept_id, annotation_role, confidence,
  method, review_status, semantic_version_id, evidence_unit_id, model_scope,
  backfill_run_id, provenance
)
SELECT
  'barry_v2_content_block',
  '4f8293f3-0853-ff6d-dc44-ee7e27ce09c1',
  concept.id,
  'operation',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '36d690c5-059e-5bbf-8a96-f36d933cb1d5',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":false,"document_key":"barry_v2_manual:f374ac43-7586-ef55-8672-0923339390bb","matched_name":"install","document_role":"maintenance_manual"}'::jsonb
FROM public.barry_semantic_concepts concept
WHERE concept.concept_key = 'operation.install'
ON CONFLICT (source_type, source_record_id, concept_id, annotation_role, semantic_version_id)
DO UPDATE SET
  confidence = EXCLUDED.confidence,
  review_status = EXCLUDED.review_status,
  evidence_unit_id = EXCLUDED.evidence_unit_id,
  model_scope = EXCLUDED.model_scope,
  provenance = EXCLUDED.provenance;
INSERT INTO public.barry_evidence_concepts (
  source_type, source_record_id, concept_id, annotation_role, confidence,
  method, review_status, semantic_version_id, evidence_unit_id, model_scope,
  backfill_run_id, provenance
)
SELECT
  'barry_v2_content_block',
  '4f8293f3-0853-ff6d-dc44-ee7e27ce09c1',
  concept.id,
  'operation',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '36d690c5-059e-5bbf-8a96-f36d933cb1d5',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":false,"document_key":"barry_v2_manual:f374ac43-7586-ef55-8672-0923339390bb","matched_name":"replace","document_role":"maintenance_manual"}'::jsonb
FROM public.barry_semantic_concepts concept
WHERE concept.concept_key = 'operation.replace'
ON CONFLICT (source_type, source_record_id, concept_id, annotation_role, semantic_version_id)
DO UPDATE SET
  confidence = EXCLUDED.confidence,
  review_status = EXCLUDED.review_status,
  evidence_unit_id = EXCLUDED.evidence_unit_id,
  model_scope = EXCLUDED.model_scope,
  provenance = EXCLUDED.provenance;
INSERT INTO public.barry_evidence_concepts (
  source_type, source_record_id, concept_id, annotation_role, confidence,
  method, review_status, semantic_version_id, evidence_unit_id, model_scope,
  backfill_run_id, provenance
)
SELECT
  'barry_v2_content_block',
  '4f8293f3-0853-ff6d-dc44-ee7e27ce09c1',
  concept.id,
  'value_context',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '36d690c5-059e-5bbf-8a96-f36d933cb1d5',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"barry_v2_manual:f374ac43-7586-ef55-8672-0923339390bb","matched_name":"hydraulic oil","document_role":"maintenance_manual"}'::jsonb
FROM public.barry_semantic_concepts concept
WHERE concept.concept_key = 'fluid.hydraulic_oil'
ON CONFLICT (source_type, source_record_id, concept_id, annotation_role, semantic_version_id)
DO UPDATE SET
  confidence = EXCLUDED.confidence,
  review_status = EXCLUDED.review_status,
  evidence_unit_id = EXCLUDED.evidence_unit_id,
  model_scope = EXCLUDED.model_scope,
  provenance = EXCLUDED.provenance;
INSERT INTO public.barry_evidence_concepts (
  source_type, source_record_id, concept_id, annotation_role, confidence,
  method, review_status, semantic_version_id, evidence_unit_id, model_scope,
  backfill_run_id, provenance
)
SELECT
  'barry_v2_content_block',
  '4f8293f3-0853-ff6d-dc44-ee7e27ce09c1',
  concept.id,
  'mentioned_component',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '36d690c5-059e-5bbf-8a96-f36d933cb1d5',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":false,"document_key":"barry_v2_manual:f374ac43-7586-ef55-8672-0923339390bb","matched_name":"steering gear","document_role":"maintenance_manual"}'::jsonb
FROM public.barry_semantic_concepts concept
WHERE concept.concept_key = 'component.steering_gear'
ON CONFLICT (source_type, source_record_id, concept_id, annotation_role, semantic_version_id)
DO UPDATE SET
  confidence = EXCLUDED.confidence,
  review_status = EXCLUDED.review_status,
  evidence_unit_id = EXCLUDED.evidence_unit_id,
  model_scope = EXCLUDED.model_scope,
  provenance = EXCLUDED.provenance;
INSERT INTO public.barry_evidence_concepts (
  source_type, source_record_id, concept_id, annotation_role, confidence,
  method, review_status, semantic_version_id, evidence_unit_id, model_scope,
  backfill_run_id, provenance
)
SELECT
  'barry_v2_content_block',
  '52707ebd-84fa-02ab-d5fe-9a278c3948b5',
  concept.id,
  'mentioned_component',
  '0.900',
  'deterministic',
  'approved',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'e7e64893-95fb-5d04-8424-068fd15bb50f',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"barry_v2_manual:9ba1297a-2aa6-de38-b971-ad38336442ad","matched_name":"steering","document_role":"workshop_manual"}'::jsonb
FROM public.barry_semantic_concepts concept
WHERE concept.concept_key = 'vehicle_system.steering'
ON CONFLICT (source_type, source_record_id, concept_id, annotation_role, semantic_version_id)
DO UPDATE SET
  confidence = EXCLUDED.confidence,
  review_status = EXCLUDED.review_status,
  evidence_unit_id = EXCLUDED.evidence_unit_id,
  model_scope = EXCLUDED.model_scope,
  provenance = EXCLUDED.provenance;
INSERT INTO public.barry_evidence_concepts (
  source_type, source_record_id, concept_id, annotation_role, confidence,
  method, review_status, semantic_version_id, evidence_unit_id, model_scope,
  backfill_run_id, provenance
)
SELECT
  'barry_v2_content_block',
  '531aa3bf-091a-22e5-07fc-26d1448fae8d',
  concept.id,
  'primary_subject',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '8c7f2723-8211-53c3-83ff-19d65d325758',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"barry_v2_manual:7147712a-37e0-b066-2067-672767b2b617","matched_name":"power steering pump","document_role":"workshop_manual"}'::jsonb
FROM public.barry_semantic_concepts concept
WHERE concept.concept_key = 'component.power_steering_pump'
ON CONFLICT (source_type, source_record_id, concept_id, annotation_role, semantic_version_id)
DO UPDATE SET
  confidence = EXCLUDED.confidence,
  review_status = EXCLUDED.review_status,
  evidence_unit_id = EXCLUDED.evidence_unit_id,
  model_scope = EXCLUDED.model_scope,
  provenance = EXCLUDED.provenance;
INSERT INTO public.barry_evidence_concepts (
  source_type, source_record_id, concept_id, annotation_role, confidence,
  method, review_status, semantic_version_id, evidence_unit_id, model_scope,
  backfill_run_id, provenance
)
SELECT
  'barry_v2_content_block',
  '531aa3bf-091a-22e5-07fc-26d1448fae8d',
  concept.id,
  'mentioned_component',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '8c7f2723-8211-53c3-83ff-19d65d325758',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"barry_v2_manual:7147712a-37e0-b066-2067-672767b2b617","matched_name":"steering","document_role":"workshop_manual"}'::jsonb
FROM public.barry_semantic_concepts concept
WHERE concept.concept_key = 'vehicle_system.steering'
ON CONFLICT (source_type, source_record_id, concept_id, annotation_role, semantic_version_id)
DO UPDATE SET
  confidence = EXCLUDED.confidence,
  review_status = EXCLUDED.review_status,
  evidence_unit_id = EXCLUDED.evidence_unit_id,
  model_scope = EXCLUDED.model_scope,
  provenance = EXCLUDED.provenance;
INSERT INTO public.barry_evidence_concepts (
  source_type, source_record_id, concept_id, annotation_role, confidence,
  method, review_status, semantic_version_id, evidence_unit_id, model_scope,
  backfill_run_id, provenance
)
SELECT
  'barry_v2_content_block',
  '5556de22-1a08-5013-56c5-1ba72b4075c1',
  concept.id,
  'operation',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '1882dbc5-b79d-5297-84da-ffc18a2426aa',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"barry_v2_manual:7147712a-37e0-b066-2067-672767b2b617","matched_name":"remove","document_role":"workshop_manual"}'::jsonb
FROM public.barry_semantic_concepts concept
WHERE concept.concept_key = 'operation.remove'
ON CONFLICT (source_type, source_record_id, concept_id, annotation_role, semantic_version_id)
DO UPDATE SET
  confidence = EXCLUDED.confidence,
  review_status = EXCLUDED.review_status,
  evidence_unit_id = EXCLUDED.evidence_unit_id,
  model_scope = EXCLUDED.model_scope,
  provenance = EXCLUDED.provenance;
INSERT INTO public.barry_evidence_concepts (
  source_type, source_record_id, concept_id, annotation_role, confidence,
  method, review_status, semantic_version_id, evidence_unit_id, model_scope,
  backfill_run_id, provenance
)
SELECT
  'barry_v2_content_block',
  '594af9ff-7ca5-b162-79b9-eff4f98f8b72',
  concept.id,
  'primary_subject',
  '0.850',
  'deterministic',
  'approved',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'e0b26a57-e4db-5f5c-8652-683304df563a',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"barry_v2_manual:af332a3b-25a2-3589-3a79-e73507003464","matched_name":"portal hub","document_role":"workshop_manual"}'::jsonb
FROM public.barry_semantic_concepts concept
WHERE concept.concept_key = 'component.portal_hub'
ON CONFLICT (source_type, source_record_id, concept_id, annotation_role, semantic_version_id)
DO UPDATE SET
  confidence = EXCLUDED.confidence,
  review_status = EXCLUDED.review_status,
  evidence_unit_id = EXCLUDED.evidence_unit_id,
  model_scope = EXCLUDED.model_scope,
  provenance = EXCLUDED.provenance;
INSERT INTO public.barry_evidence_concepts (
  source_type, source_record_id, concept_id, annotation_role, confidence,
  method, review_status, semantic_version_id, evidence_unit_id, model_scope,
  backfill_run_id, provenance
)
SELECT
  'barry_v2_content_block',
  '594af9ff-7ca5-b162-79b9-eff4f98f8b72',
  concept.id,
  'operation',
  '0.700',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'e0b26a57-e4db-5f5c-8652-683304df563a',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":false,"document_key":"barry_v2_manual:af332a3b-25a2-3589-3a79-e73507003464","matched_name":"bleed","document_role":"workshop_manual"}'::jsonb
FROM public.barry_semantic_concepts concept
WHERE concept.concept_key = 'operation.bleed'
ON CONFLICT (source_type, source_record_id, concept_id, annotation_role, semantic_version_id)
DO UPDATE SET
  confidence = EXCLUDED.confidence,
  review_status = EXCLUDED.review_status,
  evidence_unit_id = EXCLUDED.evidence_unit_id,
  model_scope = EXCLUDED.model_scope,
  provenance = EXCLUDED.provenance;
INSERT INTO public.barry_evidence_concepts (
  source_type, source_record_id, concept_id, annotation_role, confidence,
  method, review_status, semantic_version_id, evidence_unit_id, model_scope,
  backfill_run_id, provenance
)
SELECT
  'barry_v2_content_block',
  '594af9ff-7ca5-b162-79b9-eff4f98f8b72',
  concept.id,
  'operation',
  '0.700',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'e0b26a57-e4db-5f5c-8652-683304df563a',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":false,"document_key":"barry_v2_manual:af332a3b-25a2-3589-3a79-e73507003464","matched_name":"install","document_role":"workshop_manual"}'::jsonb
FROM public.barry_semantic_concepts concept
WHERE concept.concept_key = 'operation.install'
ON CONFLICT (source_type, source_record_id, concept_id, annotation_role, semantic_version_id)
DO UPDATE SET
  confidence = EXCLUDED.confidence,
  review_status = EXCLUDED.review_status,
  evidence_unit_id = EXCLUDED.evidence_unit_id,
  model_scope = EXCLUDED.model_scope,
  provenance = EXCLUDED.provenance;
INSERT INTO public.barry_evidence_concepts (
  source_type, source_record_id, concept_id, annotation_role, confidence,
  method, review_status, semantic_version_id, evidence_unit_id, model_scope,
  backfill_run_id, provenance
)
SELECT
  'barry_v2_content_block',
  '594af9ff-7ca5-b162-79b9-eff4f98f8b72',
  concept.id,
  'operation',
  '0.700',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'e0b26a57-e4db-5f5c-8652-683304df563a',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":false,"document_key":"barry_v2_manual:af332a3b-25a2-3589-3a79-e73507003464","matched_name":"inspect","document_role":"workshop_manual"}'::jsonb
FROM public.barry_semantic_concepts concept
WHERE concept.concept_key = 'operation.inspect'
ON CONFLICT (source_type, source_record_id, concept_id, annotation_role, semantic_version_id)
DO UPDATE SET
  confidence = EXCLUDED.confidence,
  review_status = EXCLUDED.review_status,
  evidence_unit_id = EXCLUDED.evidence_unit_id,
  model_scope = EXCLUDED.model_scope,
  provenance = EXCLUDED.provenance;
INSERT INTO public.barry_evidence_concepts (
  source_type, source_record_id, concept_id, annotation_role, confidence,
  method, review_status, semantic_version_id, evidence_unit_id, model_scope,
  backfill_run_id, provenance
)
SELECT
  'barry_v2_content_block',
  '59baf45c-cdd3-60a1-d271-250521cf4977',
  concept.id,
  'primary_subject',
  '0.850',
  'deterministic',
  'approved',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '6f7b0c39-2e19-580b-8306-e9736c2e3da2',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"barry_v2_manual:af332a3b-25a2-3589-3a79-e73507003464","matched_name":"portal hub","document_role":"workshop_manual"}'::jsonb
FROM public.barry_semantic_concepts concept
WHERE concept.concept_key = 'component.portal_hub'
ON CONFLICT (source_type, source_record_id, concept_id, annotation_role, semantic_version_id)
DO UPDATE SET
  confidence = EXCLUDED.confidence,
  review_status = EXCLUDED.review_status,
  evidence_unit_id = EXCLUDED.evidence_unit_id,
  model_scope = EXCLUDED.model_scope,
  provenance = EXCLUDED.provenance;
INSERT INTO public.barry_evidence_concepts (
  source_type, source_record_id, concept_id, annotation_role, confidence,
  method, review_status, semantic_version_id, evidence_unit_id, model_scope,
  backfill_run_id, provenance
)
SELECT
  'barry_v2_content_block',
  '59baf45c-cdd3-60a1-d271-250521cf4977',
  concept.id,
  'mentioned_component',
  '0.850',
  'deterministic',
  'approved',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '6f7b0c39-2e19-580b-8306-e9736c2e3da2',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"barry_v2_manual:af332a3b-25a2-3589-3a79-e73507003464","matched_name":"puller","document_role":"workshop_manual"}'::jsonb
FROM public.barry_semantic_concepts concept
WHERE concept.concept_key = 'tool.puller'
ON CONFLICT (source_type, source_record_id, concept_id, annotation_role, semantic_version_id)
DO UPDATE SET
  confidence = EXCLUDED.confidence,
  review_status = EXCLUDED.review_status,
  evidence_unit_id = EXCLUDED.evidence_unit_id,
  model_scope = EXCLUDED.model_scope,
  provenance = EXCLUDED.provenance;
INSERT INTO public.barry_evidence_concepts (
  source_type, source_record_id, concept_id, annotation_role, confidence,
  method, review_status, semantic_version_id, evidence_unit_id, model_scope,
  backfill_run_id, provenance
)
SELECT
  'barry_v2_content_block',
  '59baf45c-cdd3-60a1-d271-250521cf4977',
  concept.id,
  'mentioned_component',
  '0.700',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '6f7b0c39-2e19-580b-8306-e9736c2e3da2',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":false,"document_key":"barry_v2_manual:af332a3b-25a2-3589-3a79-e73507003464","matched_name":"sealing ring","document_role":"workshop_manual"}'::jsonb
FROM public.barry_semantic_concepts concept
WHERE concept.concept_key = 'part.sealing_ring'
ON CONFLICT (source_type, source_record_id, concept_id, annotation_role, semantic_version_id)
DO UPDATE SET
  confidence = EXCLUDED.confidence,
  review_status = EXCLUDED.review_status,
  evidence_unit_id = EXCLUDED.evidence_unit_id,
  model_scope = EXCLUDED.model_scope,
  provenance = EXCLUDED.provenance;
INSERT INTO public.barry_evidence_concepts (
  source_type, source_record_id, concept_id, annotation_role, confidence,
  method, review_status, semantic_version_id, evidence_unit_id, model_scope,
  backfill_run_id, provenance
)
SELECT
  'barry_v2_content_block',
  '59baf45c-cdd3-60a1-d271-250521cf4977',
  concept.id,
  'operation',
  '0.850',
  'deterministic',
  'approved',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '6f7b0c39-2e19-580b-8306-e9736c2e3da2',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"barry_v2_manual:af332a3b-25a2-3589-3a79-e73507003464","matched_name":"remove","document_role":"workshop_manual"}'::jsonb
FROM public.barry_semantic_concepts concept
WHERE concept.concept_key = 'operation.remove'
ON CONFLICT (source_type, source_record_id, concept_id, annotation_role, semantic_version_id)
DO UPDATE SET
  confidence = EXCLUDED.confidence,
  review_status = EXCLUDED.review_status,
  evidence_unit_id = EXCLUDED.evidence_unit_id,
  model_scope = EXCLUDED.model_scope,
  provenance = EXCLUDED.provenance;
INSERT INTO public.barry_evidence_concepts (
  source_type, source_record_id, concept_id, annotation_role, confidence,
  method, review_status, semantic_version_id, evidence_unit_id, model_scope,
  backfill_run_id, provenance
)
SELECT
  'barry_v2_content_block',
  '59baf45c-cdd3-60a1-d271-250521cf4977',
  concept.id,
  'operation',
  '0.850',
  'deterministic',
  'approved',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '6f7b0c39-2e19-580b-8306-e9736c2e3da2',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"barry_v2_manual:af332a3b-25a2-3589-3a79-e73507003464","matched_name":"inspect","document_role":"workshop_manual"}'::jsonb
FROM public.barry_semantic_concepts concept
WHERE concept.concept_key = 'operation.inspect'
ON CONFLICT (source_type, source_record_id, concept_id, annotation_role, semantic_version_id)
DO UPDATE SET
  confidence = EXCLUDED.confidence,
  review_status = EXCLUDED.review_status,
  evidence_unit_id = EXCLUDED.evidence_unit_id,
  model_scope = EXCLUDED.model_scope,
  provenance = EXCLUDED.provenance;
INSERT INTO public.barry_evidence_concepts (
  source_type, source_record_id, concept_id, annotation_role, confidence,
  method, review_status, semantic_version_id, evidence_unit_id, model_scope,
  backfill_run_id, provenance
)
SELECT
  'barry_v2_content_block',
  '59baf45c-cdd3-60a1-d271-250521cf4977',
  concept.id,
  'mentioned_component',
  '0.700',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '6f7b0c39-2e19-580b-8306-e9736c2e3da2',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":false,"document_key":"barry_v2_manual:af332a3b-25a2-3589-3a79-e73507003464","matched_name":"steering","document_role":"workshop_manual"}'::jsonb
FROM public.barry_semantic_concepts concept
WHERE concept.concept_key = 'vehicle_system.steering'
ON CONFLICT (source_type, source_record_id, concept_id, annotation_role, semantic_version_id)
DO UPDATE SET
  confidence = EXCLUDED.confidence,
  review_status = EXCLUDED.review_status,
  evidence_unit_id = EXCLUDED.evidence_unit_id,
  model_scope = EXCLUDED.model_scope,
  provenance = EXCLUDED.provenance;
INSERT INTO public.barry_evidence_concepts (
  source_type, source_record_id, concept_id, annotation_role, confidence,
  method, review_status, semantic_version_id, evidence_unit_id, model_scope,
  backfill_run_id, provenance
)
SELECT
  'barry_v2_content_block',
  '5ab3bfc0-968e-30f9-f3eb-9b6d1d943b9b',
  concept.id,
  'primary_subject',
  '0.850',
  'deterministic',
  'approved',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'c5761a5e-eda5-59bc-856d-92f46a842909',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"barry_v2_manual:7147712a-37e0-b066-2067-672767b2b617","matched_name":"steering gear","document_role":"workshop_manual"}'::jsonb
FROM public.barry_semantic_concepts concept
WHERE concept.concept_key = 'component.steering_gear'
ON CONFLICT (source_type, source_record_id, concept_id, annotation_role, semantic_version_id)
DO UPDATE SET
  confidence = EXCLUDED.confidence,
  review_status = EXCLUDED.review_status,
  evidence_unit_id = EXCLUDED.evidence_unit_id,
  model_scope = EXCLUDED.model_scope,
  provenance = EXCLUDED.provenance;
INSERT INTO public.barry_evidence_concepts (
  source_type, source_record_id, concept_id, annotation_role, confidence,
  method, review_status, semantic_version_id, evidence_unit_id, model_scope,
  backfill_run_id, provenance
)
SELECT
  'barry_v2_content_block',
  '5ab3bfc0-968e-30f9-f3eb-9b6d1d943b9b',
  concept.id,
  'value_context',
  '0.700',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'c5761a5e-eda5-59bc-856d-92f46a842909',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":false,"document_key":"barry_v2_manual:7147712a-37e0-b066-2067-672767b2b617","matched_name":"automatic transmission fluid","document_role":"workshop_manual"}'::jsonb
FROM public.barry_semantic_concepts concept
WHERE concept.concept_key = 'fluid.atf'
ON CONFLICT (source_type, source_record_id, concept_id, annotation_role, semantic_version_id)
DO UPDATE SET
  confidence = EXCLUDED.confidence,
  review_status = EXCLUDED.review_status,
  evidence_unit_id = EXCLUDED.evidence_unit_id,
  model_scope = EXCLUDED.model_scope,
  provenance = EXCLUDED.provenance;
INSERT INTO public.barry_evidence_concepts (
  source_type, source_record_id, concept_id, annotation_role, confidence,
  method, review_status, semantic_version_id, evidence_unit_id, model_scope,
  backfill_run_id, provenance
)
SELECT
  'barry_v2_content_block',
  '5ab3bfc0-968e-30f9-f3eb-9b6d1d943b9b',
  concept.id,
  'property',
  '0.700',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'c5761a5e-eda5-59bc-856d-92f46a842909',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":false,"document_key":"barry_v2_manual:7147712a-37e0-b066-2067-672767b2b617","matched_name":"torque","document_role":"workshop_manual"}'::jsonb
FROM public.barry_semantic_concepts concept
WHERE concept.concept_key = 'property.torque'
ON CONFLICT (source_type, source_record_id, concept_id, annotation_role, semantic_version_id)
DO UPDATE SET
  confidence = EXCLUDED.confidence,
  review_status = EXCLUDED.review_status,
  evidence_unit_id = EXCLUDED.evidence_unit_id,
  model_scope = EXCLUDED.model_scope,
  provenance = EXCLUDED.provenance;
INSERT INTO public.barry_evidence_concepts (
  source_type, source_record_id, concept_id, annotation_role, confidence,
  method, review_status, semantic_version_id, evidence_unit_id, model_scope,
  backfill_run_id, provenance
)
SELECT
  'barry_v2_content_block',
  '5ab3bfc0-968e-30f9-f3eb-9b6d1d943b9b',
  concept.id,
  'mentioned_component',
  '0.700',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'c5761a5e-eda5-59bc-856d-92f46a842909',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":false,"document_key":"barry_v2_manual:7147712a-37e0-b066-2067-672767b2b617","matched_name":"engine","document_role":"workshop_manual"}'::jsonb
FROM public.barry_semantic_concepts concept
WHERE concept.concept_key = 'vehicle_system.engine'
ON CONFLICT (source_type, source_record_id, concept_id, annotation_role, semantic_version_id)
DO UPDATE SET
  confidence = EXCLUDED.confidence,
  review_status = EXCLUDED.review_status,
  evidence_unit_id = EXCLUDED.evidence_unit_id,
  model_scope = EXCLUDED.model_scope,
  provenance = EXCLUDED.provenance;
INSERT INTO public.barry_evidence_concepts (
  source_type, source_record_id, concept_id, annotation_role, confidence,
  method, review_status, semantic_version_id, evidence_unit_id, model_scope,
  backfill_run_id, provenance
)
SELECT
  'barry_v2_content_block',
  '5ab3bfc0-968e-30f9-f3eb-9b6d1d943b9b',
  concept.id,
  'mentioned_component',
  '0.850',
  'deterministic',
  'approved',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'c5761a5e-eda5-59bc-856d-92f46a842909',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"barry_v2_manual:7147712a-37e0-b066-2067-672767b2b617","matched_name":"steering","document_role":"workshop_manual"}'::jsonb
FROM public.barry_semantic_concepts concept
WHERE concept.concept_key = 'vehicle_system.steering'
ON CONFLICT (source_type, source_record_id, concept_id, annotation_role, semantic_version_id)
DO UPDATE SET
  confidence = EXCLUDED.confidence,
  review_status = EXCLUDED.review_status,
  evidence_unit_id = EXCLUDED.evidence_unit_id,
  model_scope = EXCLUDED.model_scope,
  provenance = EXCLUDED.provenance;
INSERT INTO public.barry_evidence_concepts (
  source_type, source_record_id, concept_id, annotation_role, confidence,
  method, review_status, semantic_version_id, evidence_unit_id, model_scope,
  backfill_run_id, provenance
)
SELECT
  'barry_v2_content_block',
  '5b21a41b-4397-b1d8-d86d-9b4c2820691b',
  concept.id,
  'mentioned_component',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '3ba976d7-3397-5c41-87b6-eafac5c90b50',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":false,"document_key":"barry_v2_manual:7147712a-37e0-b066-2067-672767b2b617","matched_name":"repair kit","document_role":"workshop_manual"}'::jsonb
FROM public.barry_semantic_concepts concept
WHERE concept.concept_key = 'part.repair_kit'
ON CONFLICT (source_type, source_record_id, concept_id, annotation_role, semantic_version_id)
DO UPDATE SET
  confidence = EXCLUDED.confidence,
  review_status = EXCLUDED.review_status,
  evidence_unit_id = EXCLUDED.evidence_unit_id,
  model_scope = EXCLUDED.model_scope,
  provenance = EXCLUDED.provenance;
INSERT INTO public.barry_evidence_concepts (
  source_type, source_record_id, concept_id, annotation_role, confidence,
  method, review_status, semantic_version_id, evidence_unit_id, model_scope,
  backfill_run_id, provenance
)
SELECT
  'barry_v2_content_block',
  '5b21a41b-4397-b1d8-d86d-9b4c2820691b',
  concept.id,
  'mentioned_component',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '3ba976d7-3397-5c41-87b6-eafac5c90b50',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":false,"document_key":"barry_v2_manual:7147712a-37e0-b066-2067-672767b2b617","matched_name":"sealing ring","document_role":"workshop_manual"}'::jsonb
FROM public.barry_semantic_concepts concept
WHERE concept.concept_key = 'part.sealing_ring'
ON CONFLICT (source_type, source_record_id, concept_id, annotation_role, semantic_version_id)
DO UPDATE SET
  confidence = EXCLUDED.confidence,
  review_status = EXCLUDED.review_status,
  evidence_unit_id = EXCLUDED.evidence_unit_id,
  model_scope = EXCLUDED.model_scope,
  provenance = EXCLUDED.provenance;
INSERT INTO public.barry_evidence_concepts (
  source_type, source_record_id, concept_id, annotation_role, confidence,
  method, review_status, semantic_version_id, evidence_unit_id, model_scope,
  backfill_run_id, provenance
)
SELECT
  'barry_v2_content_block',
  '5b21a41b-4397-b1d8-d86d-9b4c2820691b',
  concept.id,
  'property',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '3ba976d7-3397-5c41-87b6-eafac5c90b50',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"barry_v2_manual:7147712a-37e0-b066-2067-672767b2b617","matched_name":"operating pressure","document_role":"workshop_manual"}'::jsonb
FROM public.barry_semantic_concepts concept
WHERE concept.concept_key = 'property.operating_pressure'
ON CONFLICT (source_type, source_record_id, concept_id, annotation_role, semantic_version_id)
DO UPDATE SET
  confidence = EXCLUDED.confidence,
  review_status = EXCLUDED.review_status,
  evidence_unit_id = EXCLUDED.evidence_unit_id,
  model_scope = EXCLUDED.model_scope,
  provenance = EXCLUDED.provenance;
INSERT INTO public.barry_evidence_concepts (
  source_type, source_record_id, concept_id, annotation_role, confidence,
  method, review_status, semantic_version_id, evidence_unit_id, model_scope,
  backfill_run_id, provenance
)
SELECT
  'barry_v2_content_block',
  '5c856f1c-e901-8676-4766-7529753d5a08',
  concept.id,
  'primary_subject',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '7256f02d-9987-5d04-8bc1-2057cab9d10f',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"barry_v2_manual:af332a3b-25a2-3589-3a79-e73507003464","matched_name":"steering gear","document_role":"workshop_manual"}'::jsonb
FROM public.barry_semantic_concepts concept
WHERE concept.concept_key = 'component.steering_gear'
ON CONFLICT (source_type, source_record_id, concept_id, annotation_role, semantic_version_id)
DO UPDATE SET
  confidence = EXCLUDED.confidence,
  review_status = EXCLUDED.review_status,
  evidence_unit_id = EXCLUDED.evidence_unit_id,
  model_scope = EXCLUDED.model_scope,
  provenance = EXCLUDED.provenance;
INSERT INTO public.barry_evidence_concepts (
  source_type, source_record_id, concept_id, annotation_role, confidence,
  method, review_status, semantic_version_id, evidence_unit_id, model_scope,
  backfill_run_id, provenance
)
SELECT
  'barry_v2_content_block',
  '5c856f1c-e901-8676-4766-7529753d5a08',
  concept.id,
  'operation',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '7256f02d-9987-5d04-8bc1-2057cab9d10f',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":false,"document_key":"barry_v2_manual:af332a3b-25a2-3589-3a79-e73507003464","matched_name":"inspect","document_role":"workshop_manual"}'::jsonb
FROM public.barry_semantic_concepts concept
WHERE concept.concept_key = 'operation.inspect'
ON CONFLICT (source_type, source_record_id, concept_id, annotation_role, semantic_version_id)
DO UPDATE SET
  confidence = EXCLUDED.confidence,
  review_status = EXCLUDED.review_status,
  evidence_unit_id = EXCLUDED.evidence_unit_id,
  model_scope = EXCLUDED.model_scope,
  provenance = EXCLUDED.provenance;
INSERT INTO public.barry_evidence_concepts (
  source_type, source_record_id, concept_id, annotation_role, confidence,
  method, review_status, semantic_version_id, evidence_unit_id, model_scope,
  backfill_run_id, provenance
)
SELECT
  'barry_v2_content_block',
  '5c856f1c-e901-8676-4766-7529753d5a08',
  concept.id,
  'mentioned_component',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '7256f02d-9987-5d04-8bc1-2057cab9d10f',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"barry_v2_manual:af332a3b-25a2-3589-3a79-e73507003464","matched_name":"steering","document_role":"workshop_manual"}'::jsonb
FROM public.barry_semantic_concepts concept
WHERE concept.concept_key = 'vehicle_system.steering'
ON CONFLICT (source_type, source_record_id, concept_id, annotation_role, semantic_version_id)
DO UPDATE SET
  confidence = EXCLUDED.confidence,
  review_status = EXCLUDED.review_status,
  evidence_unit_id = EXCLUDED.evidence_unit_id,
  model_scope = EXCLUDED.model_scope,
  provenance = EXCLUDED.provenance;
INSERT INTO public.barry_evidence_concepts (
  source_type, source_record_id, concept_id, annotation_role, confidence,
  method, review_status, semantic_version_id, evidence_unit_id, model_scope,
  backfill_run_id, provenance
)
SELECT
  'barry_v2_content_block',
  '6123d953-e7e6-903f-2744-b64dae55e852',
  concept.id,
  'primary_subject',
  '0.850',
  'deterministic',
  'approved',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '2385af7d-921c-581d-81c6-aa839d964553',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"barry_v2_manual:af332a3b-25a2-3589-3a79-e73507003464","matched_name":"steering gear","document_role":"workshop_manual"}'::jsonb
FROM public.barry_semantic_concepts concept
WHERE concept.concept_key = 'component.steering_gear'
ON CONFLICT (source_type, source_record_id, concept_id, annotation_role, semantic_version_id)
DO UPDATE SET
  confidence = EXCLUDED.confidence,
  review_status = EXCLUDED.review_status,
  evidence_unit_id = EXCLUDED.evidence_unit_id,
  model_scope = EXCLUDED.model_scope,
  provenance = EXCLUDED.provenance;
INSERT INTO public.barry_evidence_concepts (
  source_type, source_record_id, concept_id, annotation_role, confidence,
  method, review_status, semantic_version_id, evidence_unit_id, model_scope,
  backfill_run_id, provenance
)
SELECT
  'barry_v2_content_block',
  '6123d953-e7e6-903f-2744-b64dae55e852',
  concept.id,
  'mentioned_component',
  '0.700',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '2385af7d-921c-581d-81c6-aa839d964553',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":false,"document_key":"barry_v2_manual:af332a3b-25a2-3589-3a79-e73507003464","matched_name":"pitman arm","document_role":"workshop_manual"}'::jsonb
FROM public.barry_semantic_concepts concept
WHERE concept.concept_key = 'component.pitman_arm'
ON CONFLICT (source_type, source_record_id, concept_id, annotation_role, semantic_version_id)
DO UPDATE SET
  confidence = EXCLUDED.confidence,
  review_status = EXCLUDED.review_status,
  evidence_unit_id = EXCLUDED.evidence_unit_id,
  model_scope = EXCLUDED.model_scope,
  provenance = EXCLUDED.provenance;
INSERT INTO public.barry_evidence_concepts (
  source_type, source_record_id, concept_id, annotation_role, confidence,
  method, review_status, semantic_version_id, evidence_unit_id, model_scope,
  backfill_run_id, provenance
)
SELECT
  'barry_v2_content_block',
  '6123d953-e7e6-903f-2744-b64dae55e852',
  concept.id,
  'property',
  '0.700',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '2385af7d-921c-581d-81c6-aa839d964553',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":false,"document_key":"barry_v2_manual:af332a3b-25a2-3589-3a79-e73507003464","matched_name":"torque","document_role":"workshop_manual"}'::jsonb
FROM public.barry_semantic_concepts concept
WHERE concept.concept_key = 'property.torque'
ON CONFLICT (source_type, source_record_id, concept_id, annotation_role, semantic_version_id)
DO UPDATE SET
  confidence = EXCLUDED.confidence,
  review_status = EXCLUDED.review_status,
  evidence_unit_id = EXCLUDED.evidence_unit_id,
  model_scope = EXCLUDED.model_scope,
  provenance = EXCLUDED.provenance;
INSERT INTO public.barry_evidence_concepts (
  source_type, source_record_id, concept_id, annotation_role, confidence,
  method, review_status, semantic_version_id, evidence_unit_id, model_scope,
  backfill_run_id, provenance
)
SELECT
  'barry_v2_content_block',
  '6123d953-e7e6-903f-2744-b64dae55e852',
  concept.id,
  'mentioned_component',
  '0.850',
  'deterministic',
  'approved',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '2385af7d-921c-581d-81c6-aa839d964553',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"barry_v2_manual:af332a3b-25a2-3589-3a79-e73507003464","matched_name":"steering","document_role":"workshop_manual"}'::jsonb
FROM public.barry_semantic_concepts concept
WHERE concept.concept_key = 'vehicle_system.steering'
ON CONFLICT (source_type, source_record_id, concept_id, annotation_role, semantic_version_id)
DO UPDATE SET
  confidence = EXCLUDED.confidence,
  review_status = EXCLUDED.review_status,
  evidence_unit_id = EXCLUDED.evidence_unit_id,
  model_scope = EXCLUDED.model_scope,
  provenance = EXCLUDED.provenance;
INSERT INTO public.barry_evidence_concepts (
  source_type, source_record_id, concept_id, annotation_role, confidence,
  method, review_status, semantic_version_id, evidence_unit_id, model_scope,
  backfill_run_id, provenance
)
SELECT
  'barry_v2_content_block',
  '614e1bee-4e32-dc2d-5c20-7ac4bda8e50f',
  concept.id,
  'primary_subject',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '227a5616-58fe-548f-8335-93dee30c9fc5',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"barry_v2_manual:9ba1297a-2aa6-de38-b971-ad38336442ad","matched_name":"portal hub","document_role":"workshop_manual"}'::jsonb
FROM public.barry_semantic_concepts concept
WHERE concept.concept_key = 'component.portal_hub'
ON CONFLICT (source_type, source_record_id, concept_id, annotation_role, semantic_version_id)
DO UPDATE SET
  confidence = EXCLUDED.confidence,
  review_status = EXCLUDED.review_status,
  evidence_unit_id = EXCLUDED.evidence_unit_id,
  model_scope = EXCLUDED.model_scope,
  provenance = EXCLUDED.provenance;
INSERT INTO public.barry_evidence_concepts (
  source_type, source_record_id, concept_id, annotation_role, confidence,
  method, review_status, semantic_version_id, evidence_unit_id, model_scope,
  backfill_run_id, provenance
)
SELECT
  'barry_v2_content_block',
  '614e1bee-4e32-dc2d-5c20-7ac4bda8e50f',
  concept.id,
  'primary_subject',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '227a5616-58fe-548f-8335-93dee30c9fc5',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"barry_v2_manual:9ba1297a-2aa6-de38-b971-ad38336442ad","matched_name":"sealing ring","document_role":"workshop_manual"}'::jsonb
FROM public.barry_semantic_concepts concept
WHERE concept.concept_key = 'part.sealing_ring'
ON CONFLICT (source_type, source_record_id, concept_id, annotation_role, semantic_version_id)
DO UPDATE SET
  confidence = EXCLUDED.confidence,
  review_status = EXCLUDED.review_status,
  evidence_unit_id = EXCLUDED.evidence_unit_id,
  model_scope = EXCLUDED.model_scope,
  provenance = EXCLUDED.provenance;
INSERT INTO public.barry_evidence_concepts (
  source_type, source_record_id, concept_id, annotation_role, confidence,
  method, review_status, semantic_version_id, evidence_unit_id, model_scope,
  backfill_run_id, provenance
)
SELECT
  'barry_v2_content_block',
  '614e1bee-4e32-dc2d-5c20-7ac4bda8e50f',
  concept.id,
  'mentioned_component',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '227a5616-58fe-548f-8335-93dee30c9fc5',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":false,"document_key":"barry_v2_manual:9ba1297a-2aa6-de38-b971-ad38336442ad","matched_name":"steering","document_role":"workshop_manual"}'::jsonb
FROM public.barry_semantic_concepts concept
WHERE concept.concept_key = 'vehicle_system.steering'
ON CONFLICT (source_type, source_record_id, concept_id, annotation_role, semantic_version_id)
DO UPDATE SET
  confidence = EXCLUDED.confidence,
  review_status = EXCLUDED.review_status,
  evidence_unit_id = EXCLUDED.evidence_unit_id,
  model_scope = EXCLUDED.model_scope,
  provenance = EXCLUDED.provenance;
INSERT INTO public.barry_evidence_concepts (
  source_type, source_record_id, concept_id, annotation_role, confidence,
  method, review_status, semantic_version_id, evidence_unit_id, model_scope,
  backfill_run_id, provenance
)
SELECT
  'barry_v2_content_block',
  '615dc272-7c34-555a-e93b-a52bfcb27ef4',
  concept.id,
  'operation',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '96847993-b3bc-5ded-82e7-d3c0418c5a44',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"barry_v2_manual:af332a3b-25a2-3589-3a79-e73507003464","matched_name":"remove","document_role":"workshop_manual"}'::jsonb
FROM public.barry_semantic_concepts concept
WHERE concept.concept_key = 'operation.remove'
ON CONFLICT (source_type, source_record_id, concept_id, annotation_role, semantic_version_id)
DO UPDATE SET
  confidence = EXCLUDED.confidence,
  review_status = EXCLUDED.review_status,
  evidence_unit_id = EXCLUDED.evidence_unit_id,
  model_scope = EXCLUDED.model_scope,
  provenance = EXCLUDED.provenance;
INSERT INTO public.barry_evidence_concepts (
  source_type, source_record_id, concept_id, annotation_role, confidence,
  method, review_status, semantic_version_id, evidence_unit_id, model_scope,
  backfill_run_id, provenance
)
SELECT
  'barry_v2_content_block',
  '62fd4f4d-c159-a51d-4c41-a48b7d0af414',
  concept.id,
  'primary_subject',
  '0.850',
  'deterministic',
  'approved',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'ae504c30-64a3-575e-86d9-8ce8b2657bfa',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"barry_v2_manual:9ba1297a-2aa6-de38-b971-ad38336442ad","matched_name":"steering gear","document_role":"workshop_manual"}'::jsonb
FROM public.barry_semantic_concepts concept
WHERE concept.concept_key = 'component.steering_gear'
ON CONFLICT (source_type, source_record_id, concept_id, annotation_role, semantic_version_id)
DO UPDATE SET
  confidence = EXCLUDED.confidence,
  review_status = EXCLUDED.review_status,
  evidence_unit_id = EXCLUDED.evidence_unit_id,
  model_scope = EXCLUDED.model_scope,
  provenance = EXCLUDED.provenance;
INSERT INTO public.barry_evidence_concepts (
  source_type, source_record_id, concept_id, annotation_role, confidence,
  method, review_status, semantic_version_id, evidence_unit_id, model_scope,
  backfill_run_id, provenance
)
SELECT
  'barry_v2_content_block',
  '62fd4f4d-c159-a51d-4c41-a48b7d0af414',
  concept.id,
  'mentioned_component',
  '0.700',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'ae504c30-64a3-575e-86d9-8ce8b2657bfa',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":false,"document_key":"barry_v2_manual:9ba1297a-2aa6-de38-b971-ad38336442ad","matched_name":"pitman arm","document_role":"workshop_manual"}'::jsonb
FROM public.barry_semantic_concepts concept
WHERE concept.concept_key = 'component.pitman_arm'
ON CONFLICT (source_type, source_record_id, concept_id, annotation_role, semantic_version_id)
DO UPDATE SET
  confidence = EXCLUDED.confidence,
  review_status = EXCLUDED.review_status,
  evidence_unit_id = EXCLUDED.evidence_unit_id,
  model_scope = EXCLUDED.model_scope,
  provenance = EXCLUDED.provenance;
INSERT INTO public.barry_evidence_concepts (
  source_type, source_record_id, concept_id, annotation_role, confidence,
  method, review_status, semantic_version_id, evidence_unit_id, model_scope,
  backfill_run_id, provenance
)
SELECT
  'barry_v2_content_block',
  '62fd4f4d-c159-a51d-4c41-a48b7d0af414',
  concept.id,
  'property',
  '0.700',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'ae504c30-64a3-575e-86d9-8ce8b2657bfa',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":false,"document_key":"barry_v2_manual:9ba1297a-2aa6-de38-b971-ad38336442ad","matched_name":"torque","document_role":"workshop_manual"}'::jsonb
FROM public.barry_semantic_concepts concept
WHERE concept.concept_key = 'property.torque'
ON CONFLICT (source_type, source_record_id, concept_id, annotation_role, semantic_version_id)
DO UPDATE SET
  confidence = EXCLUDED.confidence,
  review_status = EXCLUDED.review_status,
  evidence_unit_id = EXCLUDED.evidence_unit_id,
  model_scope = EXCLUDED.model_scope,
  provenance = EXCLUDED.provenance;
INSERT INTO public.barry_evidence_concepts (
  source_type, source_record_id, concept_id, annotation_role, confidence,
  method, review_status, semantic_version_id, evidence_unit_id, model_scope,
  backfill_run_id, provenance
)
SELECT
  'barry_v2_content_block',
  '62fd4f4d-c159-a51d-4c41-a48b7d0af414',
  concept.id,
  'operation',
  '0.850',
  'deterministic',
  'approved',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'ae504c30-64a3-575e-86d9-8ce8b2657bfa',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"barry_v2_manual:9ba1297a-2aa6-de38-b971-ad38336442ad","matched_name":"remove","document_role":"workshop_manual"}'::jsonb
FROM public.barry_semantic_concepts concept
WHERE concept.concept_key = 'operation.remove'
ON CONFLICT (source_type, source_record_id, concept_id, annotation_role, semantic_version_id)
DO UPDATE SET
  confidence = EXCLUDED.confidence,
  review_status = EXCLUDED.review_status,
  evidence_unit_id = EXCLUDED.evidence_unit_id,
  model_scope = EXCLUDED.model_scope,
  provenance = EXCLUDED.provenance;
INSERT INTO public.barry_evidence_concepts (
  source_type, source_record_id, concept_id, annotation_role, confidence,
  method, review_status, semantic_version_id, evidence_unit_id, model_scope,
  backfill_run_id, provenance
)
SELECT
  'barry_v2_content_block',
  '62fd4f4d-c159-a51d-4c41-a48b7d0af414',
  concept.id,
  'mentioned_component',
  '0.850',
  'deterministic',
  'approved',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'ae504c30-64a3-575e-86d9-8ce8b2657bfa',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"barry_v2_manual:9ba1297a-2aa6-de38-b971-ad38336442ad","matched_name":"steering","document_role":"workshop_manual"}'::jsonb
FROM public.barry_semantic_concepts concept
WHERE concept.concept_key = 'vehicle_system.steering'
ON CONFLICT (source_type, source_record_id, concept_id, annotation_role, semantic_version_id)
DO UPDATE SET
  confidence = EXCLUDED.confidence,
  review_status = EXCLUDED.review_status,
  evidence_unit_id = EXCLUDED.evidence_unit_id,
  model_scope = EXCLUDED.model_scope,
  provenance = EXCLUDED.provenance;
INSERT INTO public.barry_evidence_concepts (
  source_type, source_record_id, concept_id, annotation_role, confidence,
  method, review_status, semantic_version_id, evidence_unit_id, model_scope,
  backfill_run_id, provenance
)
SELECT
  'barry_v2_content_block',
  '678c2361-02fb-91c9-811a-19c3f87d924c',
  concept.id,
  'operation',
  '0.850',
  'deterministic',
  'approved',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '4935a8d0-be81-551a-8596-6a4fba6c1db3',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"barry_v2_manual:f374ac43-7586-ef55-8672-0923339390bb","matched_name":"inspect","document_role":"maintenance_manual"}'::jsonb
FROM public.barry_semantic_concepts concept
WHERE concept.concept_key = 'operation.inspect'
ON CONFLICT (source_type, source_record_id, concept_id, annotation_role, semantic_version_id)
DO UPDATE SET
  confidence = EXCLUDED.confidence,
  review_status = EXCLUDED.review_status,
  evidence_unit_id = EXCLUDED.evidence_unit_id,
  model_scope = EXCLUDED.model_scope,
  provenance = EXCLUDED.provenance;
INSERT INTO public.barry_evidence_concepts (
  source_type, source_record_id, concept_id, annotation_role, confidence,
  method, review_status, semantic_version_id, evidence_unit_id, model_scope,
  backfill_run_id, provenance
)
SELECT
  'barry_v2_content_block',
  '678c2361-02fb-91c9-811a-19c3f87d924c',
  concept.id,
  'mentioned_component',
  '0.850',
  'deterministic',
  'approved',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '4935a8d0-be81-551a-8596-6a4fba6c1db3',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"barry_v2_manual:f374ac43-7586-ef55-8672-0923339390bb","matched_name":"steering","document_role":"maintenance_manual"}'::jsonb
FROM public.barry_semantic_concepts concept
WHERE concept.concept_key = 'vehicle_system.steering'
ON CONFLICT (source_type, source_record_id, concept_id, annotation_role, semantic_version_id)
DO UPDATE SET
  confidence = EXCLUDED.confidence,
  review_status = EXCLUDED.review_status,
  evidence_unit_id = EXCLUDED.evidence_unit_id,
  model_scope = EXCLUDED.model_scope,
  provenance = EXCLUDED.provenance;
INSERT INTO public.barry_evidence_concepts (
  source_type, source_record_id, concept_id, annotation_role, confidence,
  method, review_status, semantic_version_id, evidence_unit_id, model_scope,
  backfill_run_id, provenance
)
SELECT
  'barry_v2_content_block',
  '6a672a83-231f-c20b-1689-796ff59c7674',
  concept.id,
  'mentioned_component',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'c0cee789-3892-523c-8bde-d504f61c687b',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":false,"document_key":"barry_v2_manual:9ba1297a-2aa6-de38-b971-ad38336442ad","matched_name":"steering gear","document_role":"workshop_manual"}'::jsonb
FROM public.barry_semantic_concepts concept
WHERE concept.concept_key = 'component.steering_gear'
ON CONFLICT (source_type, source_record_id, concept_id, annotation_role, semantic_version_id)
DO UPDATE SET
  confidence = EXCLUDED.confidence,
  review_status = EXCLUDED.review_status,
  evidence_unit_id = EXCLUDED.evidence_unit_id,
  model_scope = EXCLUDED.model_scope,
  provenance = EXCLUDED.provenance;
INSERT INTO public.barry_evidence_concepts (
  source_type, source_record_id, concept_id, annotation_role, confidence,
  method, review_status, semantic_version_id, evidence_unit_id, model_scope,
  backfill_run_id, provenance
)
SELECT
  'barry_v2_content_block',
  '6a672a83-231f-c20b-1689-796ff59c7674',
  concept.id,
  'property',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'c0cee789-3892-523c-8bde-d504f61c687b',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":false,"document_key":"barry_v2_manual:9ba1297a-2aa6-de38-b971-ad38336442ad","matched_name":"torque","document_role":"workshop_manual"}'::jsonb
FROM public.barry_semantic_concepts concept
WHERE concept.concept_key = 'property.torque'
ON CONFLICT (source_type, source_record_id, concept_id, annotation_role, semantic_version_id)
DO UPDATE SET
  confidence = EXCLUDED.confidence,
  review_status = EXCLUDED.review_status,
  evidence_unit_id = EXCLUDED.evidence_unit_id,
  model_scope = EXCLUDED.model_scope,
  provenance = EXCLUDED.provenance;
INSERT INTO public.barry_evidence_concepts (
  source_type, source_record_id, concept_id, annotation_role, confidence,
  method, review_status, semantic_version_id, evidence_unit_id, model_scope,
  backfill_run_id, provenance
)
SELECT
  'barry_v2_content_block',
  '6a672a83-231f-c20b-1689-796ff59c7674',
  concept.id,
  'operation',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'c0cee789-3892-523c-8bde-d504f61c687b',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":false,"document_key":"barry_v2_manual:9ba1297a-2aa6-de38-b971-ad38336442ad","matched_name":"remove","document_role":"workshop_manual"}'::jsonb
FROM public.barry_semantic_concepts concept
WHERE concept.concept_key = 'operation.remove'
ON CONFLICT (source_type, source_record_id, concept_id, annotation_role, semantic_version_id)
DO UPDATE SET
  confidence = EXCLUDED.confidence,
  review_status = EXCLUDED.review_status,
  evidence_unit_id = EXCLUDED.evidence_unit_id,
  model_scope = EXCLUDED.model_scope,
  provenance = EXCLUDED.provenance;
INSERT INTO public.barry_evidence_concepts (
  source_type, source_record_id, concept_id, annotation_role, confidence,
  method, review_status, semantic_version_id, evidence_unit_id, model_scope,
  backfill_run_id, provenance
)
SELECT
  'barry_v2_content_block',
  '6a672a83-231f-c20b-1689-796ff59c7674',
  concept.id,
  'mentioned_component',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'c0cee789-3892-523c-8bde-d504f61c687b',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"barry_v2_manual:9ba1297a-2aa6-de38-b971-ad38336442ad","matched_name":"engine","document_role":"workshop_manual"}'::jsonb
FROM public.barry_semantic_concepts concept
WHERE concept.concept_key = 'vehicle_system.engine'
ON CONFLICT (source_type, source_record_id, concept_id, annotation_role, semantic_version_id)
DO UPDATE SET
  confidence = EXCLUDED.confidence,
  review_status = EXCLUDED.review_status,
  evidence_unit_id = EXCLUDED.evidence_unit_id,
  model_scope = EXCLUDED.model_scope,
  provenance = EXCLUDED.provenance;
INSERT INTO public.barry_evidence_concepts (
  source_type, source_record_id, concept_id, annotation_role, confidence,
  method, review_status, semantic_version_id, evidence_unit_id, model_scope,
  backfill_run_id, provenance
)
SELECT
  'barry_v2_content_block',
  '6a672a83-231f-c20b-1689-796ff59c7674',
  concept.id,
  'mentioned_component',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'c0cee789-3892-523c-8bde-d504f61c687b',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"barry_v2_manual:9ba1297a-2aa6-de38-b971-ad38336442ad","matched_name":"steering","document_role":"workshop_manual"}'::jsonb
FROM public.barry_semantic_concepts concept
WHERE concept.concept_key = 'vehicle_system.steering'
ON CONFLICT (source_type, source_record_id, concept_id, annotation_role, semantic_version_id)
DO UPDATE SET
  confidence = EXCLUDED.confidence,
  review_status = EXCLUDED.review_status,
  evidence_unit_id = EXCLUDED.evidence_unit_id,
  model_scope = EXCLUDED.model_scope,
  provenance = EXCLUDED.provenance;
INSERT INTO public.barry_evidence_concepts (
  source_type, source_record_id, concept_id, annotation_role, confidence,
  method, review_status, semantic_version_id, evidence_unit_id, model_scope,
  backfill_run_id, provenance
)
SELECT
  'barry_v2_content_block',
  '6aaa70d6-c527-2a55-3539-2fd838a85dca',
  concept.id,
  'operation',
  '0.700',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '3b378002-ba2d-553d-86ef-89000b7abcbd',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":false,"document_key":"barry_v2_manual:f374ac43-7586-ef55-8672-0923339390bb","matched_name":"remove","document_role":"maintenance_manual"}'::jsonb
FROM public.barry_semantic_concepts concept
WHERE concept.concept_key = 'operation.remove'
ON CONFLICT (source_type, source_record_id, concept_id, annotation_role, semantic_version_id)
DO UPDATE SET
  confidence = EXCLUDED.confidence,
  review_status = EXCLUDED.review_status,
  evidence_unit_id = EXCLUDED.evidence_unit_id,
  model_scope = EXCLUDED.model_scope,
  provenance = EXCLUDED.provenance;
INSERT INTO public.barry_evidence_concepts (
  source_type, source_record_id, concept_id, annotation_role, confidence,
  method, review_status, semantic_version_id, evidence_unit_id, model_scope,
  backfill_run_id, provenance
)
SELECT
  'barry_v2_content_block',
  '6aaa70d6-c527-2a55-3539-2fd838a85dca',
  concept.id,
  'operation',
  '0.850',
  'deterministic',
  'approved',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '3b378002-ba2d-553d-86ef-89000b7abcbd',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"barry_v2_manual:f374ac43-7586-ef55-8672-0923339390bb","matched_name":"inspect","document_role":"maintenance_manual"}'::jsonb
FROM public.barry_semantic_concepts concept
WHERE concept.concept_key = 'operation.inspect'
ON CONFLICT (source_type, source_record_id, concept_id, annotation_role, semantic_version_id)
DO UPDATE SET
  confidence = EXCLUDED.confidence,
  review_status = EXCLUDED.review_status,
  evidence_unit_id = EXCLUDED.evidence_unit_id,
  model_scope = EXCLUDED.model_scope,
  provenance = EXCLUDED.provenance;
INSERT INTO public.barry_evidence_concepts (
  source_type, source_record_id, concept_id, annotation_role, confidence,
  method, review_status, semantic_version_id, evidence_unit_id, model_scope,
  backfill_run_id, provenance
)
SELECT
  'barry_v2_content_block',
  '6aaa70d6-c527-2a55-3539-2fd838a85dca',
  concept.id,
  'mentioned_component',
  '0.850',
  'deterministic',
  'approved',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '3b378002-ba2d-553d-86ef-89000b7abcbd',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"barry_v2_manual:f374ac43-7586-ef55-8672-0923339390bb","matched_name":"steering","document_role":"maintenance_manual"}'::jsonb
FROM public.barry_semantic_concepts concept
WHERE concept.concept_key = 'vehicle_system.steering'
ON CONFLICT (source_type, source_record_id, concept_id, annotation_role, semantic_version_id)
DO UPDATE SET
  confidence = EXCLUDED.confidence,
  review_status = EXCLUDED.review_status,
  evidence_unit_id = EXCLUDED.evidence_unit_id,
  model_scope = EXCLUDED.model_scope,
  provenance = EXCLUDED.provenance;
INSERT INTO public.barry_evidence_concepts (
  source_type, source_record_id, concept_id, annotation_role, confidence,
  method, review_status, semantic_version_id, evidence_unit_id, model_scope,
  backfill_run_id, provenance
)
SELECT
  'barry_v2_content_block',
  '6bcfbcec-4057-c7fa-3c20-39c5290f052f',
  concept.id,
  'primary_subject',
  '0.900',
  'deterministic',
  'approved',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'eecd4b59-e38c-5408-8633-67d64c8ebd6a',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"barry_v2_manual:af332a3b-25a2-3589-3a79-e73507003464","matched_name":"sealing ring","document_role":"workshop_manual"}'::jsonb
FROM public.barry_semantic_concepts concept
WHERE concept.concept_key = 'part.sealing_ring'
ON CONFLICT (source_type, source_record_id, concept_id, annotation_role, semantic_version_id)
DO UPDATE SET
  confidence = EXCLUDED.confidence,
  review_status = EXCLUDED.review_status,
  evidence_unit_id = EXCLUDED.evidence_unit_id,
  model_scope = EXCLUDED.model_scope,
  provenance = EXCLUDED.provenance;
INSERT INTO public.barry_evidence_concepts (
  source_type, source_record_id, concept_id, annotation_role, confidence,
  method, review_status, semantic_version_id, evidence_unit_id, model_scope,
  backfill_run_id, provenance
)
SELECT
  'barry_v2_content_block',
  '6da85488-3edc-60ed-c1ac-0874191f32a2',
  concept.id,
  'primary_subject',
  '0.850',
  'deterministic',
  'approved',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '9b76b568-def0-5aaa-8205-a75768537bf7',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"barry_v2_manual:9ba1297a-2aa6-de38-b971-ad38336442ad","matched_name":"differential","document_role":"workshop_manual"}'::jsonb
FROM public.barry_semantic_concepts concept
WHERE concept.concept_key = 'component.differential'
ON CONFLICT (source_type, source_record_id, concept_id, annotation_role, semantic_version_id)
DO UPDATE SET
  confidence = EXCLUDED.confidence,
  review_status = EXCLUDED.review_status,
  evidence_unit_id = EXCLUDED.evidence_unit_id,
  model_scope = EXCLUDED.model_scope,
  provenance = EXCLUDED.provenance;
INSERT INTO public.barry_evidence_concepts (
  source_type, source_record_id, concept_id, annotation_role, confidence,
  method, review_status, semantic_version_id, evidence_unit_id, model_scope,
  backfill_run_id, provenance
)
SELECT
  'barry_v2_content_block',
  '6da85488-3edc-60ed-c1ac-0874191f32a2',
  concept.id,
  'operation',
  '0.700',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '9b76b568-def0-5aaa-8205-a75768537bf7',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":false,"document_key":"barry_v2_manual:9ba1297a-2aa6-de38-b971-ad38336442ad","matched_name":"inspect","document_role":"workshop_manual"}'::jsonb
FROM public.barry_semantic_concepts concept
WHERE concept.concept_key = 'operation.inspect'
ON CONFLICT (source_type, source_record_id, concept_id, annotation_role, semantic_version_id)
DO UPDATE SET
  confidence = EXCLUDED.confidence,
  review_status = EXCLUDED.review_status,
  evidence_unit_id = EXCLUDED.evidence_unit_id,
  model_scope = EXCLUDED.model_scope,
  provenance = EXCLUDED.provenance;
INSERT INTO public.barry_evidence_concepts (
  source_type, source_record_id, concept_id, annotation_role, confidence,
  method, review_status, semantic_version_id, evidence_unit_id, model_scope,
  backfill_run_id, provenance
)
SELECT
  'barry_v2_content_block',
  '727401f3-e19e-d7a4-0ef7-989d844927fb',
  concept.id,
  'mentioned_component',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '179e11cc-f1d5-5b9f-85f7-d4f298fa6da9',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":false,"document_key":"barry_v2_manual:9ba1297a-2aa6-de38-b971-ad38336442ad","matched_name":"pitman arm","document_role":"workshop_manual"}'::jsonb
FROM public.barry_semantic_concepts concept
WHERE concept.concept_key = 'component.pitman_arm'
ON CONFLICT (source_type, source_record_id, concept_id, annotation_role, semantic_version_id)
DO UPDATE SET
  confidence = EXCLUDED.confidence,
  review_status = EXCLUDED.review_status,
  evidence_unit_id = EXCLUDED.evidence_unit_id,
  model_scope = EXCLUDED.model_scope,
  provenance = EXCLUDED.provenance;
INSERT INTO public.barry_evidence_concepts (
  source_type, source_record_id, concept_id, annotation_role, confidence,
  method, review_status, semantic_version_id, evidence_unit_id, model_scope,
  backfill_run_id, provenance
)
SELECT
  'barry_v2_content_block',
  '727401f3-e19e-d7a4-0ef7-989d844927fb',
  concept.id,
  'mentioned_component',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '179e11cc-f1d5-5b9f-85f7-d4f298fa6da9',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":false,"document_key":"barry_v2_manual:9ba1297a-2aa6-de38-b971-ad38336442ad","matched_name":"transmission","document_role":"workshop_manual"}'::jsonb
FROM public.barry_semantic_concepts concept
WHERE concept.concept_key = 'vehicle_system.transmission'
ON CONFLICT (source_type, source_record_id, concept_id, annotation_role, semantic_version_id)
DO UPDATE SET
  confidence = EXCLUDED.confidence,
  review_status = EXCLUDED.review_status,
  evidence_unit_id = EXCLUDED.evidence_unit_id,
  model_scope = EXCLUDED.model_scope,
  provenance = EXCLUDED.provenance;
INSERT INTO public.barry_evidence_concepts (
  source_type, source_record_id, concept_id, annotation_role, confidence,
  method, review_status, semantic_version_id, evidence_unit_id, model_scope,
  backfill_run_id, provenance
)
SELECT
  'barry_v2_content_block',
  '727401f3-e19e-d7a4-0ef7-989d844927fb',
  concept.id,
  'mentioned_component',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '179e11cc-f1d5-5b9f-85f7-d4f298fa6da9',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"barry_v2_manual:9ba1297a-2aa6-de38-b971-ad38336442ad","matched_name":"steering","document_role":"workshop_manual"}'::jsonb
FROM public.barry_semantic_concepts concept
WHERE concept.concept_key = 'vehicle_system.steering'
ON CONFLICT (source_type, source_record_id, concept_id, annotation_role, semantic_version_id)
DO UPDATE SET
  confidence = EXCLUDED.confidence,
  review_status = EXCLUDED.review_status,
  evidence_unit_id = EXCLUDED.evidence_unit_id,
  model_scope = EXCLUDED.model_scope,
  provenance = EXCLUDED.provenance;
INSERT INTO public.barry_evidence_concepts (
  source_type, source_record_id, concept_id, annotation_role, confidence,
  method, review_status, semantic_version_id, evidence_unit_id, model_scope,
  backfill_run_id, provenance
)
SELECT
  'barry_v2_content_block',
  '727a3191-e7f1-69c4-5457-87bd86291007',
  concept.id,
  'primary_subject',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '037f7602-3e50-5666-870e-558f6f505a4a',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"barry_v2_manual:9ba1297a-2aa6-de38-b971-ad38336442ad","matched_name":"portal hub","document_role":"workshop_manual"}'::jsonb
FROM public.barry_semantic_concepts concept
WHERE concept.concept_key = 'component.portal_hub'
ON CONFLICT (source_type, source_record_id, concept_id, annotation_role, semantic_version_id)
DO UPDATE SET
  confidence = EXCLUDED.confidence,
  review_status = EXCLUDED.review_status,
  evidence_unit_id = EXCLUDED.evidence_unit_id,
  model_scope = EXCLUDED.model_scope,
  provenance = EXCLUDED.provenance;
INSERT INTO public.barry_evidence_concepts (
  source_type, source_record_id, concept_id, annotation_role, confidence,
  method, review_status, semantic_version_id, evidence_unit_id, model_scope,
  backfill_run_id, provenance
)
SELECT
  'barry_v2_content_block',
  '727a3191-e7f1-69c4-5457-87bd86291007',
  concept.id,
  'operation',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '037f7602-3e50-5666-870e-558f6f505a4a',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":false,"document_key":"barry_v2_manual:9ba1297a-2aa6-de38-b971-ad38336442ad","matched_name":"install","document_role":"workshop_manual"}'::jsonb
FROM public.barry_semantic_concepts concept
WHERE concept.concept_key = 'operation.install'
ON CONFLICT (source_type, source_record_id, concept_id, annotation_role, semantic_version_id)
DO UPDATE SET
  confidence = EXCLUDED.confidence,
  review_status = EXCLUDED.review_status,
  evidence_unit_id = EXCLUDED.evidence_unit_id,
  model_scope = EXCLUDED.model_scope,
  provenance = EXCLUDED.provenance;
INSERT INTO public.barry_evidence_concepts (
  source_type, source_record_id, concept_id, annotation_role, confidence,
  method, review_status, semantic_version_id, evidence_unit_id, model_scope,
  backfill_run_id, provenance
)
SELECT
  'barry_v2_content_block',
  '7300df75-0d83-5bac-a583-b652b9bcdef4',
  concept.id,
  'property',
  '0.700',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'c8d502e7-d896-5098-8fe5-62ce5eaffe44',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":false,"document_key":"barry_v2_manual:5c259d33-46d1-a74a-ef88-a4fabb23376f","matched_name":"torque","document_role":"workshop_manual"}'::jsonb
FROM public.barry_semantic_concepts concept
WHERE concept.concept_key = 'property.torque'
ON CONFLICT (source_type, source_record_id, concept_id, annotation_role, semantic_version_id)
DO UPDATE SET
  confidence = EXCLUDED.confidence,
  review_status = EXCLUDED.review_status,
  evidence_unit_id = EXCLUDED.evidence_unit_id,
  model_scope = EXCLUDED.model_scope,
  provenance = EXCLUDED.provenance;
INSERT INTO public.barry_evidence_concepts (
  source_type, source_record_id, concept_id, annotation_role, confidence,
  method, review_status, semantic_version_id, evidence_unit_id, model_scope,
  backfill_run_id, provenance
)
SELECT
  'barry_v2_content_block',
  '7300df75-0d83-5bac-a583-b652b9bcdef4',
  concept.id,
  'operation',
  '0.850',
  'deterministic',
  'approved',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'c8d502e7-d896-5098-8fe5-62ce5eaffe44',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"barry_v2_manual:5c259d33-46d1-a74a-ef88-a4fabb23376f","matched_name":"adjust","document_role":"workshop_manual"}'::jsonb
FROM public.barry_semantic_concepts concept
WHERE concept.concept_key = 'operation.adjust'
ON CONFLICT (source_type, source_record_id, concept_id, annotation_role, semantic_version_id)
DO UPDATE SET
  confidence = EXCLUDED.confidence,
  review_status = EXCLUDED.review_status,
  evidence_unit_id = EXCLUDED.evidence_unit_id,
  model_scope = EXCLUDED.model_scope,
  provenance = EXCLUDED.provenance;
INSERT INTO public.barry_evidence_concepts (
  source_type, source_record_id, concept_id, annotation_role, confidence,
  method, review_status, semantic_version_id, evidence_unit_id, model_scope,
  backfill_run_id, provenance
)
SELECT
  'barry_v2_content_block',
  '7300df75-0d83-5bac-a583-b652b9bcdef4',
  concept.id,
  'operation',
  '0.850',
  'deterministic',
  'approved',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'c8d502e7-d896-5098-8fe5-62ce5eaffe44',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"barry_v2_manual:5c259d33-46d1-a74a-ef88-a4fabb23376f","matched_name":"remove","document_role":"workshop_manual"}'::jsonb
FROM public.barry_semantic_concepts concept
WHERE concept.concept_key = 'operation.remove'
ON CONFLICT (source_type, source_record_id, concept_id, annotation_role, semantic_version_id)
DO UPDATE SET
  confidence = EXCLUDED.confidence,
  review_status = EXCLUDED.review_status,
  evidence_unit_id = EXCLUDED.evidence_unit_id,
  model_scope = EXCLUDED.model_scope,
  provenance = EXCLUDED.provenance;
INSERT INTO public.barry_evidence_concepts (
  source_type, source_record_id, concept_id, annotation_role, confidence,
  method, review_status, semantic_version_id, evidence_unit_id, model_scope,
  backfill_run_id, provenance
)
SELECT
  'barry_v2_content_block',
  '749256ec-c9b7-5385-06a0-1ac280ef4355',
  concept.id,
  'operation',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '9e5ec9fe-2132-5792-89c4-c4be0bb5233e',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"barry_v2_manual:af332a3b-25a2-3589-3a79-e73507003464","matched_name":"adjust","document_role":"workshop_manual"}'::jsonb
FROM public.barry_semantic_concepts concept
WHERE concept.concept_key = 'operation.adjust'
ON CONFLICT (source_type, source_record_id, concept_id, annotation_role, semantic_version_id)
DO UPDATE SET
  confidence = EXCLUDED.confidence,
  review_status = EXCLUDED.review_status,
  evidence_unit_id = EXCLUDED.evidence_unit_id,
  model_scope = EXCLUDED.model_scope,
  provenance = EXCLUDED.provenance;
INSERT INTO public.barry_evidence_concepts (
  source_type, source_record_id, concept_id, annotation_role, confidence,
  method, review_status, semantic_version_id, evidence_unit_id, model_scope,
  backfill_run_id, provenance
)
SELECT
  'barry_v2_content_block',
  '749256ec-c9b7-5385-06a0-1ac280ef4355',
  concept.id,
  'operation',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '9e5ec9fe-2132-5792-89c4-c4be0bb5233e',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":false,"document_key":"barry_v2_manual:af332a3b-25a2-3589-3a79-e73507003464","matched_name":"install","document_role":"workshop_manual"}'::jsonb
FROM public.barry_semantic_concepts concept
WHERE concept.concept_key = 'operation.install'
ON CONFLICT (source_type, source_record_id, concept_id, annotation_role, semantic_version_id)
DO UPDATE SET
  confidence = EXCLUDED.confidence,
  review_status = EXCLUDED.review_status,
  evidence_unit_id = EXCLUDED.evidence_unit_id,
  model_scope = EXCLUDED.model_scope,
  provenance = EXCLUDED.provenance;
INSERT INTO public.barry_evidence_concepts (
  source_type, source_record_id, concept_id, annotation_role, confidence,
  method, review_status, semantic_version_id, evidence_unit_id, model_scope,
  backfill_run_id, provenance
)
SELECT
  'barry_v2_content_block',
  '7581d825-9bca-e197-2153-defb3bd9b8a7',
  concept.id,
  'primary_subject',
  '0.900',
  'deterministic',
  'approved',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '43d18f81-50a7-54f3-80c2-981e80c279c7',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"barry_v2_manual:7147712a-37e0-b066-2067-672767b2b617","matched_name":"repair kit","document_role":"workshop_manual"}'::jsonb
FROM public.barry_semantic_concepts concept
WHERE concept.concept_key = 'part.repair_kit'
ON CONFLICT (source_type, source_record_id, concept_id, annotation_role, semantic_version_id)
DO UPDATE SET
  confidence = EXCLUDED.confidence,
  review_status = EXCLUDED.review_status,
  evidence_unit_id = EXCLUDED.evidence_unit_id,
  model_scope = EXCLUDED.model_scope,
  provenance = EXCLUDED.provenance;
INSERT INTO public.barry_evidence_concepts (
  source_type, source_record_id, concept_id, annotation_role, confidence,
  method, review_status, semantic_version_id, evidence_unit_id, model_scope,
  backfill_run_id, provenance
)
SELECT
  'barry_v2_content_block',
  '7581d825-9bca-e197-2153-defb3bd9b8a7',
  concept.id,
  'mentioned_component',
  '0.700',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '43d18f81-50a7-54f3-80c2-981e80c279c7',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":false,"document_key":"barry_v2_manual:7147712a-37e0-b066-2067-672767b2b617","matched_name":"sealing ring","document_role":"workshop_manual"}'::jsonb
FROM public.barry_semantic_concepts concept
WHERE concept.concept_key = 'part.sealing_ring'
ON CONFLICT (source_type, source_record_id, concept_id, annotation_role, semantic_version_id)
DO UPDATE SET
  confidence = EXCLUDED.confidence,
  review_status = EXCLUDED.review_status,
  evidence_unit_id = EXCLUDED.evidence_unit_id,
  model_scope = EXCLUDED.model_scope,
  provenance = EXCLUDED.provenance;
INSERT INTO public.barry_evidence_concepts (
  source_type, source_record_id, concept_id, annotation_role, confidence,
  method, review_status, semantic_version_id, evidence_unit_id, model_scope,
  backfill_run_id, provenance
)
SELECT
  'barry_v2_content_block',
  '761eaaf8-67db-283f-e587-1d481d0adb1e',
  concept.id,
  'mentioned_component',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '69658ace-d1de-5dc3-85c3-51f13fa58e6b',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":false,"document_key":"barry_v2_manual:af332a3b-25a2-3589-3a79-e73507003464","matched_name":"steering gear","document_role":"workshop_manual"}'::jsonb
FROM public.barry_semantic_concepts concept
WHERE concept.concept_key = 'component.steering_gear'
ON CONFLICT (source_type, source_record_id, concept_id, annotation_role, semantic_version_id)
DO UPDATE SET
  confidence = EXCLUDED.confidence,
  review_status = EXCLUDED.review_status,
  evidence_unit_id = EXCLUDED.evidence_unit_id,
  model_scope = EXCLUDED.model_scope,
  provenance = EXCLUDED.provenance;
INSERT INTO public.barry_evidence_concepts (
  source_type, source_record_id, concept_id, annotation_role, confidence,
  method, review_status, semantic_version_id, evidence_unit_id, model_scope,
  backfill_run_id, provenance
)
SELECT
  'barry_v2_content_block',
  '761eaaf8-67db-283f-e587-1d481d0adb1e',
  concept.id,
  'mentioned_component',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '69658ace-d1de-5dc3-85c3-51f13fa58e6b',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"barry_v2_manual:af332a3b-25a2-3589-3a79-e73507003464","matched_name":"steering","document_role":"workshop_manual"}'::jsonb
FROM public.barry_semantic_concepts concept
WHERE concept.concept_key = 'vehicle_system.steering'
ON CONFLICT (source_type, source_record_id, concept_id, annotation_role, semantic_version_id)
DO UPDATE SET
  confidence = EXCLUDED.confidence,
  review_status = EXCLUDED.review_status,
  evidence_unit_id = EXCLUDED.evidence_unit_id,
  model_scope = EXCLUDED.model_scope,
  provenance = EXCLUDED.provenance;
INSERT INTO public.barry_evidence_concepts (
  source_type, source_record_id, concept_id, annotation_role, confidence,
  method, review_status, semantic_version_id, evidence_unit_id, model_scope,
  backfill_run_id, provenance
)
SELECT
  'barry_v2_content_block',
  '761eaaf8-67db-283f-e587-1d481d0adb1e',
  concept.id,
  'applicability',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '69658ace-d1de-5dc3-85c3-51f13fa58e6b',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":false,"document_key":"barry_v2_manual:af332a3b-25a2-3589-3a79-e73507003464","matched_name":"U1700L","document_role":"workshop_manual"}'::jsonb
FROM public.barry_semantic_concepts concept
WHERE concept.concept_key = 'vehicle_model.u1700l'
ON CONFLICT (source_type, source_record_id, concept_id, annotation_role, semantic_version_id)
DO UPDATE SET
  confidence = EXCLUDED.confidence,
  review_status = EXCLUDED.review_status,
  evidence_unit_id = EXCLUDED.evidence_unit_id,
  model_scope = EXCLUDED.model_scope,
  provenance = EXCLUDED.provenance;
INSERT INTO public.barry_evidence_concepts (
  source_type, source_record_id, concept_id, annotation_role, confidence,
  method, review_status, semantic_version_id, evidence_unit_id, model_scope,
  backfill_run_id, provenance
)
SELECT
  'barry_v2_content_block',
  '761eaaf8-67db-283f-e587-1d481d0adb1e',
  concept.id,
  'applicability',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '69658ace-d1de-5dc3-85c3-51f13fa58e6b',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":false,"document_key":"barry_v2_manual:af332a3b-25a2-3589-3a79-e73507003464","matched_name":"U435","document_role":"workshop_manual"}'::jsonb
FROM public.barry_semantic_concepts concept
WHERE concept.concept_key = 'vehicle_model.u435'
ON CONFLICT (source_type, source_record_id, concept_id, annotation_role, semantic_version_id)
DO UPDATE SET
  confidence = EXCLUDED.confidence,
  review_status = EXCLUDED.review_status,
  evidence_unit_id = EXCLUDED.evidence_unit_id,
  model_scope = EXCLUDED.model_scope,
  provenance = EXCLUDED.provenance;
INSERT INTO public.barry_evidence_concepts (
  source_type, source_record_id, concept_id, annotation_role, confidence,
  method, review_status, semantic_version_id, evidence_unit_id, model_scope,
  backfill_run_id, provenance
)
SELECT
  'barry_v2_content_block',
  '76a28e1a-b0c5-34d6-afc3-d008e9ac89e9',
  concept.id,
  'mentioned_component',
  '0.700',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'cdf727f3-d841-5be7-8c91-4b8d405d24b7',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":false,"document_key":"barry_v2_manual:af332a3b-25a2-3589-3a79-e73507003464","matched_name":"pitman arm","document_role":"workshop_manual"}'::jsonb
FROM public.barry_semantic_concepts concept
WHERE concept.concept_key = 'component.pitman_arm'
ON CONFLICT (source_type, source_record_id, concept_id, annotation_role, semantic_version_id)
DO UPDATE SET
  confidence = EXCLUDED.confidence,
  review_status = EXCLUDED.review_status,
  evidence_unit_id = EXCLUDED.evidence_unit_id,
  model_scope = EXCLUDED.model_scope,
  provenance = EXCLUDED.provenance;
INSERT INTO public.barry_evidence_concepts (
  source_type, source_record_id, concept_id, annotation_role, confidence,
  method, review_status, semantic_version_id, evidence_unit_id, model_scope,
  backfill_run_id, provenance
)
SELECT
  'barry_v2_content_block',
  '76a28e1a-b0c5-34d6-afc3-d008e9ac89e9',
  concept.id,
  'mentioned_component',
  '0.900',
  'deterministic',
  'approved',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'cdf727f3-d841-5be7-8c91-4b8d405d24b7',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"barry_v2_manual:af332a3b-25a2-3589-3a79-e73507003464","matched_name":"steering","document_role":"workshop_manual"}'::jsonb
FROM public.barry_semantic_concepts concept
WHERE concept.concept_key = 'vehicle_system.steering'
ON CONFLICT (source_type, source_record_id, concept_id, annotation_role, semantic_version_id)
DO UPDATE SET
  confidence = EXCLUDED.confidence,
  review_status = EXCLUDED.review_status,
  evidence_unit_id = EXCLUDED.evidence_unit_id,
  model_scope = EXCLUDED.model_scope,
  provenance = EXCLUDED.provenance;
INSERT INTO public.barry_evidence_concepts (
  source_type, source_record_id, concept_id, annotation_role, confidence,
  method, review_status, semantic_version_id, evidence_unit_id, model_scope,
  backfill_run_id, provenance
)
SELECT
  'barry_v2_content_block',
  '77657f78-9bac-baab-2ef5-9bf979892023',
  concept.id,
  'primary_subject',
  '0.900',
  'deterministic',
  'approved',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '6b35d68b-d135-569a-8bda-dd5035507252',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"barry_v2_manual:5c259d33-46d1-a74a-ef88-a4fabb23376f","matched_name":"steering gear","document_role":"workshop_manual"}'::jsonb
FROM public.barry_semantic_concepts concept
WHERE concept.concept_key = 'component.steering_gear'
ON CONFLICT (source_type, source_record_id, concept_id, annotation_role, semantic_version_id)
DO UPDATE SET
  confidence = EXCLUDED.confidence,
  review_status = EXCLUDED.review_status,
  evidence_unit_id = EXCLUDED.evidence_unit_id,
  model_scope = EXCLUDED.model_scope,
  provenance = EXCLUDED.provenance;
INSERT INTO public.barry_evidence_concepts (
  source_type, source_record_id, concept_id, annotation_role, confidence,
  method, review_status, semantic_version_id, evidence_unit_id, model_scope,
  backfill_run_id, provenance
)
SELECT
  'barry_v2_content_block',
  '77657f78-9bac-baab-2ef5-9bf979892023',
  concept.id,
  'mentioned_component',
  '0.700',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '6b35d68b-d135-569a-8bda-dd5035507252',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":false,"document_key":"barry_v2_manual:5c259d33-46d1-a74a-ef88-a4fabb23376f","matched_name":"sealing ring","document_role":"workshop_manual"}'::jsonb
FROM public.barry_semantic_concepts concept
WHERE concept.concept_key = 'part.sealing_ring'
ON CONFLICT (source_type, source_record_id, concept_id, annotation_role, semantic_version_id)
DO UPDATE SET
  confidence = EXCLUDED.confidence,
  review_status = EXCLUDED.review_status,
  evidence_unit_id = EXCLUDED.evidence_unit_id,
  model_scope = EXCLUDED.model_scope,
  provenance = EXCLUDED.provenance;
INSERT INTO public.barry_evidence_concepts (
  source_type, source_record_id, concept_id, annotation_role, confidence,
  method, review_status, semantic_version_id, evidence_unit_id, model_scope,
  backfill_run_id, provenance
)
SELECT
  'barry_v2_content_block',
  '77657f78-9bac-baab-2ef5-9bf979892023',
  concept.id,
  'mentioned_component',
  '0.900',
  'deterministic',
  'approved',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '6b35d68b-d135-569a-8bda-dd5035507252',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"barry_v2_manual:5c259d33-46d1-a74a-ef88-a4fabb23376f","matched_name":"steering","document_role":"workshop_manual"}'::jsonb
FROM public.barry_semantic_concepts concept
WHERE concept.concept_key = 'vehicle_system.steering'
ON CONFLICT (source_type, source_record_id, concept_id, annotation_role, semantic_version_id)
DO UPDATE SET
  confidence = EXCLUDED.confidence,
  review_status = EXCLUDED.review_status,
  evidence_unit_id = EXCLUDED.evidence_unit_id,
  model_scope = EXCLUDED.model_scope,
  provenance = EXCLUDED.provenance;
INSERT INTO public.barry_evidence_concepts (
  source_type, source_record_id, concept_id, annotation_role, confidence,
  method, review_status, semantic_version_id, evidence_unit_id, model_scope,
  backfill_run_id, provenance
)
SELECT
  'barry_v2_content_block',
  '7b44259d-cca5-e93e-9e29-956ae353c8ae',
  concept.id,
  'operation',
  '0.850',
  'deterministic',
  'approved',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'dbfd357f-7ced-5eda-8d6a-dd1926fd7e4e',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"barry_v2_manual:5c259d33-46d1-a74a-ef88-a4fabb23376f","matched_name":"remove","document_role":"workshop_manual"}'::jsonb
FROM public.barry_semantic_concepts concept
WHERE concept.concept_key = 'operation.remove'
ON CONFLICT (source_type, source_record_id, concept_id, annotation_role, semantic_version_id)
DO UPDATE SET
  confidence = EXCLUDED.confidence,
  review_status = EXCLUDED.review_status,
  evidence_unit_id = EXCLUDED.evidence_unit_id,
  model_scope = EXCLUDED.model_scope,
  provenance = EXCLUDED.provenance;
INSERT INTO public.barry_evidence_concepts (
  source_type, source_record_id, concept_id, annotation_role, confidence,
  method, review_status, semantic_version_id, evidence_unit_id, model_scope,
  backfill_run_id, provenance
)
SELECT
  'barry_v2_content_block',
  '7b44259d-cca5-e93e-9e29-956ae353c8ae',
  concept.id,
  'mentioned_component',
  '0.850',
  'deterministic',
  'approved',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'dbfd357f-7ced-5eda-8d6a-dd1926fd7e4e',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"barry_v2_manual:5c259d33-46d1-a74a-ef88-a4fabb23376f","matched_name":"steering","document_role":"workshop_manual"}'::jsonb
FROM public.barry_semantic_concepts concept
WHERE concept.concept_key = 'vehicle_system.steering'
ON CONFLICT (source_type, source_record_id, concept_id, annotation_role, semantic_version_id)
DO UPDATE SET
  confidence = EXCLUDED.confidence,
  review_status = EXCLUDED.review_status,
  evidence_unit_id = EXCLUDED.evidence_unit_id,
  model_scope = EXCLUDED.model_scope,
  provenance = EXCLUDED.provenance;
INSERT INTO public.barry_evidence_concepts (
  source_type, source_record_id, concept_id, annotation_role, confidence,
  method, review_status, semantic_version_id, evidence_unit_id, model_scope,
  backfill_run_id, provenance
)
SELECT
  'barry_v2_content_block',
  '7c329175-6478-05c5-745e-d90ea8781bf5',
  concept.id,
  'mentioned_component',
  '0.900',
  'deterministic',
  'approved',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '32544133-d72b-5842-8bb4-ef13d59ff896',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"barry_v2_manual:9ba1297a-2aa6-de38-b971-ad38336442ad","matched_name":"steering","document_role":"workshop_manual"}'::jsonb
FROM public.barry_semantic_concepts concept
WHERE concept.concept_key = 'vehicle_system.steering'
ON CONFLICT (source_type, source_record_id, concept_id, annotation_role, semantic_version_id)
DO UPDATE SET
  confidence = EXCLUDED.confidence,
  review_status = EXCLUDED.review_status,
  evidence_unit_id = EXCLUDED.evidence_unit_id,
  model_scope = EXCLUDED.model_scope,
  provenance = EXCLUDED.provenance;
INSERT INTO public.barry_evidence_concepts (
  source_type, source_record_id, concept_id, annotation_role, confidence,
  method, review_status, semantic_version_id, evidence_unit_id, model_scope,
  backfill_run_id, provenance
)
SELECT
  'barry_v2_content_block',
  '7f054b31-3bcb-4984-30ab-f438e8c02707',
  concept.id,
  'primary_subject',
  '0.900',
  'deterministic',
  'approved',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '5f0630a4-6e90-59ef-8426-94c066f6b3e3',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"barry_v2_manual:af332a3b-25a2-3589-3a79-e73507003464","matched_name":"steering gear","document_role":"workshop_manual"}'::jsonb
FROM public.barry_semantic_concepts concept
WHERE concept.concept_key = 'component.steering_gear'
ON CONFLICT (source_type, source_record_id, concept_id, annotation_role, semantic_version_id)
DO UPDATE SET
  confidence = EXCLUDED.confidence,
  review_status = EXCLUDED.review_status,
  evidence_unit_id = EXCLUDED.evidence_unit_id,
  model_scope = EXCLUDED.model_scope,
  provenance = EXCLUDED.provenance;
INSERT INTO public.barry_evidence_concepts (
  source_type, source_record_id, concept_id, annotation_role, confidence,
  method, review_status, semantic_version_id, evidence_unit_id, model_scope,
  backfill_run_id, provenance
)
SELECT
  'barry_v2_content_block',
  '7f054b31-3bcb-4984-30ab-f438e8c02707',
  concept.id,
  'mentioned_component',
  '0.700',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '5f0630a4-6e90-59ef-8426-94c066f6b3e3',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":false,"document_key":"barry_v2_manual:af332a3b-25a2-3589-3a79-e73507003464","matched_name":"sealing ring","document_role":"workshop_manual"}'::jsonb
FROM public.barry_semantic_concepts concept
WHERE concept.concept_key = 'part.sealing_ring'
ON CONFLICT (source_type, source_record_id, concept_id, annotation_role, semantic_version_id)
DO UPDATE SET
  confidence = EXCLUDED.confidence,
  review_status = EXCLUDED.review_status,
  evidence_unit_id = EXCLUDED.evidence_unit_id,
  model_scope = EXCLUDED.model_scope,
  provenance = EXCLUDED.provenance;
INSERT INTO public.barry_evidence_concepts (
  source_type, source_record_id, concept_id, annotation_role, confidence,
  method, review_status, semantic_version_id, evidence_unit_id, model_scope,
  backfill_run_id, provenance
)
SELECT
  'barry_v2_content_block',
  '7f054b31-3bcb-4984-30ab-f438e8c02707',
  concept.id,
  'mentioned_component',
  '0.900',
  'deterministic',
  'approved',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '5f0630a4-6e90-59ef-8426-94c066f6b3e3',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"barry_v2_manual:af332a3b-25a2-3589-3a79-e73507003464","matched_name":"steering","document_role":"workshop_manual"}'::jsonb
FROM public.barry_semantic_concepts concept
WHERE concept.concept_key = 'vehicle_system.steering'
ON CONFLICT (source_type, source_record_id, concept_id, annotation_role, semantic_version_id)
DO UPDATE SET
  confidence = EXCLUDED.confidence,
  review_status = EXCLUDED.review_status,
  evidence_unit_id = EXCLUDED.evidence_unit_id,
  model_scope = EXCLUDED.model_scope,
  provenance = EXCLUDED.provenance;
INSERT INTO public.barry_evidence_concepts (
  source_type, source_record_id, concept_id, annotation_role, confidence,
  method, review_status, semantic_version_id, evidence_unit_id, model_scope,
  backfill_run_id, provenance
)
SELECT
  'barry_v2_content_block',
  '8679fd21-6af3-35b5-7140-5d713e616914',
  concept.id,
  'operation',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '18dae729-d90e-51c1-8ed5-f7c441d102cc',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"barry_v2_manual:9ba1297a-2aa6-de38-b971-ad38336442ad","matched_name":"remove","document_role":"workshop_manual"}'::jsonb
FROM public.barry_semantic_concepts concept
WHERE concept.concept_key = 'operation.remove'
ON CONFLICT (source_type, source_record_id, concept_id, annotation_role, semantic_version_id)
DO UPDATE SET
  confidence = EXCLUDED.confidence,
  review_status = EXCLUDED.review_status,
  evidence_unit_id = EXCLUDED.evidence_unit_id,
  model_scope = EXCLUDED.model_scope,
  provenance = EXCLUDED.provenance;
INSERT INTO public.barry_evidence_concepts (
  source_type, source_record_id, concept_id, annotation_role, confidence,
  method, review_status, semantic_version_id, evidence_unit_id, model_scope,
  backfill_run_id, provenance
)
SELECT
  'barry_v2_content_block',
  '86fa1836-c1df-a08c-603b-1213ccf636fa',
  concept.id,
  'primary_subject',
  '0.850',
  'deterministic',
  'approved',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'a0b28a04-812d-5353-81cc-4fe60109247c',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"barry_v2_manual:af332a3b-25a2-3589-3a79-e73507003464","matched_name":"differential","document_role":"workshop_manual"}'::jsonb
FROM public.barry_semantic_concepts concept
WHERE concept.concept_key = 'component.differential'
ON CONFLICT (source_type, source_record_id, concept_id, annotation_role, semantic_version_id)
DO UPDATE SET
  confidence = EXCLUDED.confidence,
  review_status = EXCLUDED.review_status,
  evidence_unit_id = EXCLUDED.evidence_unit_id,
  model_scope = EXCLUDED.model_scope,
  provenance = EXCLUDED.provenance;
INSERT INTO public.barry_evidence_concepts (
  source_type, source_record_id, concept_id, annotation_role, confidence,
  method, review_status, semantic_version_id, evidence_unit_id, model_scope,
  backfill_run_id, provenance
)
SELECT
  'barry_v2_content_block',
  '86fa1836-c1df-a08c-603b-1213ccf636fa',
  concept.id,
  'operation',
  '0.700',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'a0b28a04-812d-5353-81cc-4fe60109247c',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":false,"document_key":"barry_v2_manual:af332a3b-25a2-3589-3a79-e73507003464","matched_name":"inspect","document_role":"workshop_manual"}'::jsonb
FROM public.barry_semantic_concepts concept
WHERE concept.concept_key = 'operation.inspect'
ON CONFLICT (source_type, source_record_id, concept_id, annotation_role, semantic_version_id)
DO UPDATE SET
  confidence = EXCLUDED.confidence,
  review_status = EXCLUDED.review_status,
  evidence_unit_id = EXCLUDED.evidence_unit_id,
  model_scope = EXCLUDED.model_scope,
  provenance = EXCLUDED.provenance;
INSERT INTO public.barry_evidence_concepts (
  source_type, source_record_id, concept_id, annotation_role, confidence,
  method, review_status, semantic_version_id, evidence_unit_id, model_scope,
  backfill_run_id, provenance
)
SELECT
  'barry_v2_content_block',
  '8763d8b9-f1c8-7af8-8e8a-e94f97947a88',
  concept.id,
  'operation',
  '0.700',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'f8aa07cb-3d31-5bde-8c66-7d379ab85f48',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":false,"document_key":"barry_v2_manual:5c259d33-46d1-a74a-ef88-a4fabb23376f","matched_name":"install","document_role":"workshop_manual"}'::jsonb
FROM public.barry_semantic_concepts concept
WHERE concept.concept_key = 'operation.install'
ON CONFLICT (source_type, source_record_id, concept_id, annotation_role, semantic_version_id)
DO UPDATE SET
  confidence = EXCLUDED.confidence,
  review_status = EXCLUDED.review_status,
  evidence_unit_id = EXCLUDED.evidence_unit_id,
  model_scope = EXCLUDED.model_scope,
  provenance = EXCLUDED.provenance;
INSERT INTO public.barry_evidence_concepts (
  source_type, source_record_id, concept_id, annotation_role, confidence,
  method, review_status, semantic_version_id, evidence_unit_id, model_scope,
  backfill_run_id, provenance
)
SELECT
  'barry_v2_content_block',
  '8763d8b9-f1c8-7af8-8e8a-e94f97947a88',
  concept.id,
  'operation',
  '0.850',
  'deterministic',
  'approved',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'f8aa07cb-3d31-5bde-8c66-7d379ab85f48',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"barry_v2_manual:5c259d33-46d1-a74a-ef88-a4fabb23376f","matched_name":"remove","document_role":"workshop_manual"}'::jsonb
FROM public.barry_semantic_concepts concept
WHERE concept.concept_key = 'operation.remove'
ON CONFLICT (source_type, source_record_id, concept_id, annotation_role, semantic_version_id)
DO UPDATE SET
  confidence = EXCLUDED.confidence,
  review_status = EXCLUDED.review_status,
  evidence_unit_id = EXCLUDED.evidence_unit_id,
  model_scope = EXCLUDED.model_scope,
  provenance = EXCLUDED.provenance;
INSERT INTO public.barry_evidence_concepts (
  source_type, source_record_id, concept_id, annotation_role, confidence,
  method, review_status, semantic_version_id, evidence_unit_id, model_scope,
  backfill_run_id, provenance
)
SELECT
  'barry_v2_content_block',
  '8763d8b9-f1c8-7af8-8e8a-e94f97947a88',
  concept.id,
  'mentioned_component',
  '0.850',
  'deterministic',
  'approved',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'f8aa07cb-3d31-5bde-8c66-7d379ab85f48',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"barry_v2_manual:5c259d33-46d1-a74a-ef88-a4fabb23376f","matched_name":"steering","document_role":"workshop_manual"}'::jsonb
FROM public.barry_semantic_concepts concept
WHERE concept.concept_key = 'vehicle_system.steering'
ON CONFLICT (source_type, source_record_id, concept_id, annotation_role, semantic_version_id)
DO UPDATE SET
  confidence = EXCLUDED.confidence,
  review_status = EXCLUDED.review_status,
  evidence_unit_id = EXCLUDED.evidence_unit_id,
  model_scope = EXCLUDED.model_scope,
  provenance = EXCLUDED.provenance;
INSERT INTO public.barry_evidence_concepts (
  source_type, source_record_id, concept_id, annotation_role, confidence,
  method, review_status, semantic_version_id, evidence_unit_id, model_scope,
  backfill_run_id, provenance
)
SELECT
  'barry_v2_content_block',
  '87e3409e-5aab-b492-b150-4b0592d85d6e',
  concept.id,
  'primary_subject',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'e316abc0-2f43-5488-8c87-f85c2ab423bd',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"barry_v2_manual:af332a3b-25a2-3589-3a79-e73507003464","matched_name":"steering gear","document_role":"workshop_manual"}'::jsonb
FROM public.barry_semantic_concepts concept
WHERE concept.concept_key = 'component.steering_gear'
ON CONFLICT (source_type, source_record_id, concept_id, annotation_role, semantic_version_id)
DO UPDATE SET
  confidence = EXCLUDED.confidence,
  review_status = EXCLUDED.review_status,
  evidence_unit_id = EXCLUDED.evidence_unit_id,
  model_scope = EXCLUDED.model_scope,
  provenance = EXCLUDED.provenance;
INSERT INTO public.barry_evidence_concepts (
  source_type, source_record_id, concept_id, annotation_role, confidence,
  method, review_status, semantic_version_id, evidence_unit_id, model_scope,
  backfill_run_id, provenance
)
SELECT
  'barry_v2_content_block',
  '87e3409e-5aab-b492-b150-4b0592d85d6e',
  concept.id,
  'property',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'e316abc0-2f43-5488-8c87-f85c2ab423bd',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":false,"document_key":"barry_v2_manual:af332a3b-25a2-3589-3a79-e73507003464","matched_name":"torque","document_role":"workshop_manual"}'::jsonb
FROM public.barry_semantic_concepts concept
WHERE concept.concept_key = 'property.torque'
ON CONFLICT (source_type, source_record_id, concept_id, annotation_role, semantic_version_id)
DO UPDATE SET
  confidence = EXCLUDED.confidence,
  review_status = EXCLUDED.review_status,
  evidence_unit_id = EXCLUDED.evidence_unit_id,
  model_scope = EXCLUDED.model_scope,
  provenance = EXCLUDED.provenance;
INSERT INTO public.barry_evidence_concepts (
  source_type, source_record_id, concept_id, annotation_role, confidence,
  method, review_status, semantic_version_id, evidence_unit_id, model_scope,
  backfill_run_id, provenance
)
SELECT
  'barry_v2_content_block',
  '87e3409e-5aab-b492-b150-4b0592d85d6e',
  concept.id,
  'operation',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'e316abc0-2f43-5488-8c87-f85c2ab423bd',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":false,"document_key":"barry_v2_manual:af332a3b-25a2-3589-3a79-e73507003464","matched_name":"remove","document_role":"workshop_manual"}'::jsonb
FROM public.barry_semantic_concepts concept
WHERE concept.concept_key = 'operation.remove'
ON CONFLICT (source_type, source_record_id, concept_id, annotation_role, semantic_version_id)
DO UPDATE SET
  confidence = EXCLUDED.confidence,
  review_status = EXCLUDED.review_status,
  evidence_unit_id = EXCLUDED.evidence_unit_id,
  model_scope = EXCLUDED.model_scope,
  provenance = EXCLUDED.provenance;
INSERT INTO public.barry_evidence_concepts (
  source_type, source_record_id, concept_id, annotation_role, confidence,
  method, review_status, semantic_version_id, evidence_unit_id, model_scope,
  backfill_run_id, provenance
)
SELECT
  'barry_v2_content_block',
  '87e3409e-5aab-b492-b150-4b0592d85d6e',
  concept.id,
  'mentioned_component',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'e316abc0-2f43-5488-8c87-f85c2ab423bd',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":false,"document_key":"barry_v2_manual:af332a3b-25a2-3589-3a79-e73507003464","matched_name":"engine","document_role":"workshop_manual"}'::jsonb
FROM public.barry_semantic_concepts concept
WHERE concept.concept_key = 'vehicle_system.engine'
ON CONFLICT (source_type, source_record_id, concept_id, annotation_role, semantic_version_id)
DO UPDATE SET
  confidence = EXCLUDED.confidence,
  review_status = EXCLUDED.review_status,
  evidence_unit_id = EXCLUDED.evidence_unit_id,
  model_scope = EXCLUDED.model_scope,
  provenance = EXCLUDED.provenance;
INSERT INTO public.barry_evidence_concepts (
  source_type, source_record_id, concept_id, annotation_role, confidence,
  method, review_status, semantic_version_id, evidence_unit_id, model_scope,
  backfill_run_id, provenance
)
SELECT
  'barry_v2_content_block',
  '87e3409e-5aab-b492-b150-4b0592d85d6e',
  concept.id,
  'mentioned_component',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'e316abc0-2f43-5488-8c87-f85c2ab423bd',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"barry_v2_manual:af332a3b-25a2-3589-3a79-e73507003464","matched_name":"steering","document_role":"workshop_manual"}'::jsonb
FROM public.barry_semantic_concepts concept
WHERE concept.concept_key = 'vehicle_system.steering'
ON CONFLICT (source_type, source_record_id, concept_id, annotation_role, semantic_version_id)
DO UPDATE SET
  confidence = EXCLUDED.confidence,
  review_status = EXCLUDED.review_status,
  evidence_unit_id = EXCLUDED.evidence_unit_id,
  model_scope = EXCLUDED.model_scope,
  provenance = EXCLUDED.provenance;
INSERT INTO public.barry_evidence_concepts (
  source_type, source_record_id, concept_id, annotation_role, confidence,
  method, review_status, semantic_version_id, evidence_unit_id, model_scope,
  backfill_run_id, provenance
)
SELECT
  'barry_v2_content_block',
  '88efae78-c00e-9ce9-82a7-caf6ce994f0e',
  concept.id,
  'primary_subject',
  '0.850',
  'deterministic',
  'approved',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'bde45396-608c-5a46-8841-947d374f26a9',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"barry_v2_manual:af332a3b-25a2-3589-3a79-e73507003464","matched_name":"portal hub","document_role":"workshop_manual"}'::jsonb
FROM public.barry_semantic_concepts concept
WHERE concept.concept_key = 'component.portal_hub'
ON CONFLICT (source_type, source_record_id, concept_id, annotation_role, semantic_version_id)
DO UPDATE SET
  confidence = EXCLUDED.confidence,
  review_status = EXCLUDED.review_status,
  evidence_unit_id = EXCLUDED.evidence_unit_id,
  model_scope = EXCLUDED.model_scope,
  provenance = EXCLUDED.provenance;
INSERT INTO public.barry_evidence_concepts (
  source_type, source_record_id, concept_id, annotation_role, confidence,
  method, review_status, semantic_version_id, evidence_unit_id, model_scope,
  backfill_run_id, provenance
)
SELECT
  'barry_v2_content_block',
  '88efae78-c00e-9ce9-82a7-caf6ce994f0e',
  concept.id,
  'operation',
  '0.700',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'bde45396-608c-5a46-8841-947d374f26a9',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":false,"document_key":"barry_v2_manual:af332a3b-25a2-3589-3a79-e73507003464","matched_name":"remove","document_role":"workshop_manual"}'::jsonb
FROM public.barry_semantic_concepts concept
WHERE concept.concept_key = 'operation.remove'
ON CONFLICT (source_type, source_record_id, concept_id, annotation_role, semantic_version_id)
DO UPDATE SET
  confidence = EXCLUDED.confidence,
  review_status = EXCLUDED.review_status,
  evidence_unit_id = EXCLUDED.evidence_unit_id,
  model_scope = EXCLUDED.model_scope,
  provenance = EXCLUDED.provenance;
INSERT INTO public.barry_evidence_concepts (
  source_type, source_record_id, concept_id, annotation_role, confidence,
  method, review_status, semantic_version_id, evidence_unit_id, model_scope,
  backfill_run_id, provenance
)
SELECT
  'barry_v2_content_block',
  '8a430dad-fe9e-1d8c-229f-d58d75136dcf',
  concept.id,
  'property',
  '0.700',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'e393c76d-c92b-5f72-81bf-7e19c841723f',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":false,"document_key":"barry_v2_manual:9ba1297a-2aa6-de38-b971-ad38336442ad","matched_name":"torque","document_role":"workshop_manual"}'::jsonb
FROM public.barry_semantic_concepts concept
WHERE concept.concept_key = 'property.torque'
ON CONFLICT (source_type, source_record_id, concept_id, annotation_role, semantic_version_id)
DO UPDATE SET
  confidence = EXCLUDED.confidence,
  review_status = EXCLUDED.review_status,
  evidence_unit_id = EXCLUDED.evidence_unit_id,
  model_scope = EXCLUDED.model_scope,
  provenance = EXCLUDED.provenance;
INSERT INTO public.barry_evidence_concepts (
  source_type, source_record_id, concept_id, annotation_role, confidence,
  method, review_status, semantic_version_id, evidence_unit_id, model_scope,
  backfill_run_id, provenance
)
SELECT
  'barry_v2_content_block',
  '8a430dad-fe9e-1d8c-229f-d58d75136dcf',
  concept.id,
  'operation',
  '0.850',
  'deterministic',
  'approved',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'e393c76d-c92b-5f72-81bf-7e19c841723f',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"barry_v2_manual:9ba1297a-2aa6-de38-b971-ad38336442ad","matched_name":"adjust","document_role":"workshop_manual"}'::jsonb
FROM public.barry_semantic_concepts concept
WHERE concept.concept_key = 'operation.adjust'
ON CONFLICT (source_type, source_record_id, concept_id, annotation_role, semantic_version_id)
DO UPDATE SET
  confidence = EXCLUDED.confidence,
  review_status = EXCLUDED.review_status,
  evidence_unit_id = EXCLUDED.evidence_unit_id,
  model_scope = EXCLUDED.model_scope,
  provenance = EXCLUDED.provenance;
INSERT INTO public.barry_evidence_concepts (
  source_type, source_record_id, concept_id, annotation_role, confidence,
  method, review_status, semantic_version_id, evidence_unit_id, model_scope,
  backfill_run_id, provenance
)
SELECT
  'barry_v2_content_block',
  '8a430dad-fe9e-1d8c-229f-d58d75136dcf',
  concept.id,
  'operation',
  '0.850',
  'deterministic',
  'approved',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'e393c76d-c92b-5f72-81bf-7e19c841723f',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"barry_v2_manual:9ba1297a-2aa6-de38-b971-ad38336442ad","matched_name":"remove","document_role":"workshop_manual"}'::jsonb
FROM public.barry_semantic_concepts concept
WHERE concept.concept_key = 'operation.remove'
ON CONFLICT (source_type, source_record_id, concept_id, annotation_role, semantic_version_id)
DO UPDATE SET
  confidence = EXCLUDED.confidence,
  review_status = EXCLUDED.review_status,
  evidence_unit_id = EXCLUDED.evidence_unit_id,
  model_scope = EXCLUDED.model_scope,
  provenance = EXCLUDED.provenance;
INSERT INTO public.barry_evidence_concepts (
  source_type, source_record_id, concept_id, annotation_role, confidence,
  method, review_status, semantic_version_id, evidence_unit_id, model_scope,
  backfill_run_id, provenance
)
SELECT
  'barry_v2_content_block',
  '8b106795-7864-7d0a-a383-273da8a9750d',
  concept.id,
  'mentioned_component',
  '0.900',
  'deterministic',
  'approved',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '4790d5b6-ff52-599c-8e96-c74819829c3a',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"barry_v2_manual:af332a3b-25a2-3589-3a79-e73507003464","matched_name":"steering","document_role":"workshop_manual"}'::jsonb
FROM public.barry_semantic_concepts concept
WHERE concept.concept_key = 'vehicle_system.steering'
ON CONFLICT (source_type, source_record_id, concept_id, annotation_role, semantic_version_id)
DO UPDATE SET
  confidence = EXCLUDED.confidence,
  review_status = EXCLUDED.review_status,
  evidence_unit_id = EXCLUDED.evidence_unit_id,
  model_scope = EXCLUDED.model_scope,
  provenance = EXCLUDED.provenance;
INSERT INTO public.barry_evidence_concepts (
  source_type, source_record_id, concept_id, annotation_role, confidence,
  method, review_status, semantic_version_id, evidence_unit_id, model_scope,
  backfill_run_id, provenance
)
SELECT
  'barry_v2_content_block',
  '8bf20927-2982-bff5-32b8-3c30651a68c3',
  concept.id,
  'primary_subject',
  '0.850',
  'deterministic',
  'approved',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'f9a9b243-1ba5-57ce-8f15-8f7d8910d1d2',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"barry_v2_manual:af332a3b-25a2-3589-3a79-e73507003464","matched_name":"differential","document_role":"workshop_manual"}'::jsonb
FROM public.barry_semantic_concepts concept
WHERE concept.concept_key = 'component.differential'
ON CONFLICT (source_type, source_record_id, concept_id, annotation_role, semantic_version_id)
DO UPDATE SET
  confidence = EXCLUDED.confidence,
  review_status = EXCLUDED.review_status,
  evidence_unit_id = EXCLUDED.evidence_unit_id,
  model_scope = EXCLUDED.model_scope,
  provenance = EXCLUDED.provenance;
INSERT INTO public.barry_evidence_concepts (
  source_type, source_record_id, concept_id, annotation_role, confidence,
  method, review_status, semantic_version_id, evidence_unit_id, model_scope,
  backfill_run_id, provenance
)
SELECT
  'barry_v2_content_block',
  '8bf20927-2982-bff5-32b8-3c30651a68c3',
  concept.id,
  'property',
  '0.850',
  'deterministic',
  'approved',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'f9a9b243-1ba5-57ce-8f15-8f7d8910d1d2',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"barry_v2_manual:af332a3b-25a2-3589-3a79-e73507003464","matched_name":"operating pressure","document_role":"workshop_manual"}'::jsonb
FROM public.barry_semantic_concepts concept
WHERE concept.concept_key = 'property.operating_pressure'
ON CONFLICT (source_type, source_record_id, concept_id, annotation_role, semantic_version_id)
DO UPDATE SET
  confidence = EXCLUDED.confidence,
  review_status = EXCLUDED.review_status,
  evidence_unit_id = EXCLUDED.evidence_unit_id,
  model_scope = EXCLUDED.model_scope,
  provenance = EXCLUDED.provenance;
INSERT INTO public.barry_evidence_concepts (
  source_type, source_record_id, concept_id, annotation_role, confidence,
  method, review_status, semantic_version_id, evidence_unit_id, model_scope,
  backfill_run_id, provenance
)
SELECT
  'barry_v2_content_block',
  '8c0b7525-ed96-4bb5-ce22-0a49f7233318',
  concept.id,
  'mentioned_component',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'd0c51365-19b8-5e25-86da-77bf997e6e3d',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":false,"document_key":"barry_v2_manual:9ba1297a-2aa6-de38-b971-ad38336442ad","matched_name":"steering gear","document_role":"workshop_manual"}'::jsonb
FROM public.barry_semantic_concepts concept
WHERE concept.concept_key = 'component.steering_gear'
ON CONFLICT (source_type, source_record_id, concept_id, annotation_role, semantic_version_id)
DO UPDATE SET
  confidence = EXCLUDED.confidence,
  review_status = EXCLUDED.review_status,
  evidence_unit_id = EXCLUDED.evidence_unit_id,
  model_scope = EXCLUDED.model_scope,
  provenance = EXCLUDED.provenance;
INSERT INTO public.barry_evidence_concepts (
  source_type, source_record_id, concept_id, annotation_role, confidence,
  method, review_status, semantic_version_id, evidence_unit_id, model_scope,
  backfill_run_id, provenance
)
SELECT
  'barry_v2_content_block',
  '8c0b7525-ed96-4bb5-ce22-0a49f7233318',
  concept.id,
  'mentioned_component',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'd0c51365-19b8-5e25-86da-77bf997e6e3d',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"barry_v2_manual:9ba1297a-2aa6-de38-b971-ad38336442ad","matched_name":"steering","document_role":"workshop_manual"}'::jsonb
FROM public.barry_semantic_concepts concept
WHERE concept.concept_key = 'vehicle_system.steering'
ON CONFLICT (source_type, source_record_id, concept_id, annotation_role, semantic_version_id)
DO UPDATE SET
  confidence = EXCLUDED.confidence,
  review_status = EXCLUDED.review_status,
  evidence_unit_id = EXCLUDED.evidence_unit_id,
  model_scope = EXCLUDED.model_scope,
  provenance = EXCLUDED.provenance;
INSERT INTO public.barry_evidence_concepts (
  source_type, source_record_id, concept_id, annotation_role, confidence,
  method, review_status, semantic_version_id, evidence_unit_id, model_scope,
  backfill_run_id, provenance
)
SELECT
  'barry_v2_content_block',
  '8c0b7525-ed96-4bb5-ce22-0a49f7233318',
  concept.id,
  'applicability',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'd0c51365-19b8-5e25-86da-77bf997e6e3d',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":false,"document_key":"barry_v2_manual:9ba1297a-2aa6-de38-b971-ad38336442ad","matched_name":"U1700L","document_role":"workshop_manual"}'::jsonb
FROM public.barry_semantic_concepts concept
WHERE concept.concept_key = 'vehicle_model.u1700l'
ON CONFLICT (source_type, source_record_id, concept_id, annotation_role, semantic_version_id)
DO UPDATE SET
  confidence = EXCLUDED.confidence,
  review_status = EXCLUDED.review_status,
  evidence_unit_id = EXCLUDED.evidence_unit_id,
  model_scope = EXCLUDED.model_scope,
  provenance = EXCLUDED.provenance;
INSERT INTO public.barry_evidence_concepts (
  source_type, source_record_id, concept_id, annotation_role, confidence,
  method, review_status, semantic_version_id, evidence_unit_id, model_scope,
  backfill_run_id, provenance
)
SELECT
  'barry_v2_content_block',
  '8c0b7525-ed96-4bb5-ce22-0a49f7233318',
  concept.id,
  'applicability',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'd0c51365-19b8-5e25-86da-77bf997e6e3d',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":false,"document_key":"barry_v2_manual:9ba1297a-2aa6-de38-b971-ad38336442ad","matched_name":"U435","document_role":"workshop_manual"}'::jsonb
FROM public.barry_semantic_concepts concept
WHERE concept.concept_key = 'vehicle_model.u435'
ON CONFLICT (source_type, source_record_id, concept_id, annotation_role, semantic_version_id)
DO UPDATE SET
  confidence = EXCLUDED.confidence,
  review_status = EXCLUDED.review_status,
  evidence_unit_id = EXCLUDED.evidence_unit_id,
  model_scope = EXCLUDED.model_scope,
  provenance = EXCLUDED.provenance;
INSERT INTO public.barry_evidence_concepts (
  source_type, source_record_id, concept_id, annotation_role, confidence,
  method, review_status, semantic_version_id, evidence_unit_id, model_scope,
  backfill_run_id, provenance
)
SELECT
  'barry_v2_content_block',
  '8c3bdec0-0162-72ca-e178-11638663a119',
  concept.id,
  'primary_subject',
  '0.850',
  'deterministic',
  'approved',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'dc7d48e8-4fa7-5bd6-85cd-d5da49f7ff14',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"barry_v2_manual:9ba1297a-2aa6-de38-b971-ad38336442ad","matched_name":"differential","document_role":"workshop_manual"}'::jsonb
FROM public.barry_semantic_concepts concept
WHERE concept.concept_key = 'component.differential'
ON CONFLICT (source_type, source_record_id, concept_id, annotation_role, semantic_version_id)
DO UPDATE SET
  confidence = EXCLUDED.confidence,
  review_status = EXCLUDED.review_status,
  evidence_unit_id = EXCLUDED.evidence_unit_id,
  model_scope = EXCLUDED.model_scope,
  provenance = EXCLUDED.provenance;
INSERT INTO public.barry_evidence_concepts (
  source_type, source_record_id, concept_id, annotation_role, confidence,
  method, review_status, semantic_version_id, evidence_unit_id, model_scope,
  backfill_run_id, provenance
)
SELECT
  'barry_v2_content_block',
  '8c3bdec0-0162-72ca-e178-11638663a119',
  concept.id,
  'operation',
  '0.850',
  'deterministic',
  'approved',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'dc7d48e8-4fa7-5bd6-85cd-d5da49f7ff14',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"barry_v2_manual:9ba1297a-2aa6-de38-b971-ad38336442ad","matched_name":"remove","document_role":"workshop_manual"}'::jsonb
FROM public.barry_semantic_concepts concept
WHERE concept.concept_key = 'operation.remove'
ON CONFLICT (source_type, source_record_id, concept_id, annotation_role, semantic_version_id)
DO UPDATE SET
  confidence = EXCLUDED.confidence,
  review_status = EXCLUDED.review_status,
  evidence_unit_id = EXCLUDED.evidence_unit_id,
  model_scope = EXCLUDED.model_scope,
  provenance = EXCLUDED.provenance;
INSERT INTO public.barry_evidence_concepts (
  source_type, source_record_id, concept_id, annotation_role, confidence,
  method, review_status, semantic_version_id, evidence_unit_id, model_scope,
  backfill_run_id, provenance
)
SELECT
  'barry_v2_content_block',
  '8e1e1df5-3076-256a-cf54-2e5f2ba67a70',
  concept.id,
  'primary_subject',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '882c3e08-3867-5786-8a42-a0c8a23e3abd',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"barry_v2_manual:5c259d33-46d1-a74a-ef88-a4fabb23376f","matched_name":"steering gear","document_role":"workshop_manual"}'::jsonb
FROM public.barry_semantic_concepts concept
WHERE concept.concept_key = 'component.steering_gear'
ON CONFLICT (source_type, source_record_id, concept_id, annotation_role, semantic_version_id)
DO UPDATE SET
  confidence = EXCLUDED.confidence,
  review_status = EXCLUDED.review_status,
  evidence_unit_id = EXCLUDED.evidence_unit_id,
  model_scope = EXCLUDED.model_scope,
  provenance = EXCLUDED.provenance;
INSERT INTO public.barry_evidence_concepts (
  source_type, source_record_id, concept_id, annotation_role, confidence,
  method, review_status, semantic_version_id, evidence_unit_id, model_scope,
  backfill_run_id, provenance
)
SELECT
  'barry_v2_content_block',
  '8e1e1df5-3076-256a-cf54-2e5f2ba67a70',
  concept.id,
  'operation',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '882c3e08-3867-5786-8a42-a0c8a23e3abd',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":false,"document_key":"barry_v2_manual:5c259d33-46d1-a74a-ef88-a4fabb23376f","matched_name":"inspect","document_role":"workshop_manual"}'::jsonb
FROM public.barry_semantic_concepts concept
WHERE concept.concept_key = 'operation.inspect'
ON CONFLICT (source_type, source_record_id, concept_id, annotation_role, semantic_version_id)
DO UPDATE SET
  confidence = EXCLUDED.confidence,
  review_status = EXCLUDED.review_status,
  evidence_unit_id = EXCLUDED.evidence_unit_id,
  model_scope = EXCLUDED.model_scope,
  provenance = EXCLUDED.provenance;
INSERT INTO public.barry_evidence_concepts (
  source_type, source_record_id, concept_id, annotation_role, confidence,
  method, review_status, semantic_version_id, evidence_unit_id, model_scope,
  backfill_run_id, provenance
)
SELECT
  'barry_v2_content_block',
  '8e1e1df5-3076-256a-cf54-2e5f2ba67a70',
  concept.id,
  'mentioned_component',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '882c3e08-3867-5786-8a42-a0c8a23e3abd',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"barry_v2_manual:5c259d33-46d1-a74a-ef88-a4fabb23376f","matched_name":"steering","document_role":"workshop_manual"}'::jsonb
FROM public.barry_semantic_concepts concept
WHERE concept.concept_key = 'vehicle_system.steering'
ON CONFLICT (source_type, source_record_id, concept_id, annotation_role, semantic_version_id)
DO UPDATE SET
  confidence = EXCLUDED.confidence,
  review_status = EXCLUDED.review_status,
  evidence_unit_id = EXCLUDED.evidence_unit_id,
  model_scope = EXCLUDED.model_scope,
  provenance = EXCLUDED.provenance;
INSERT INTO public.barry_evidence_concepts (
  source_type, source_record_id, concept_id, annotation_role, confidence,
  method, review_status, semantic_version_id, evidence_unit_id, model_scope,
  backfill_run_id, provenance
)
SELECT
  'barry_v2_content_block',
  '9269f295-04a4-e90d-3f50-77cfb6d405af',
  concept.id,
  'primary_subject',
  '0.850',
  'deterministic',
  'approved',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '0870fa72-d19e-5f93-86ff-1d73b2f3c102',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"barry_v2_manual:9ba1297a-2aa6-de38-b971-ad38336442ad","matched_name":"steering gear","document_role":"workshop_manual"}'::jsonb
FROM public.barry_semantic_concepts concept
WHERE concept.concept_key = 'component.steering_gear'
ON CONFLICT (source_type, source_record_id, concept_id, annotation_role, semantic_version_id)
DO UPDATE SET
  confidence = EXCLUDED.confidence,
  review_status = EXCLUDED.review_status,
  evidence_unit_id = EXCLUDED.evidence_unit_id,
  model_scope = EXCLUDED.model_scope,
  provenance = EXCLUDED.provenance;
INSERT INTO public.barry_evidence_concepts (
  source_type, source_record_id, concept_id, annotation_role, confidence,
  method, review_status, semantic_version_id, evidence_unit_id, model_scope,
  backfill_run_id, provenance
)
SELECT
  'barry_v2_content_block',
  '9269f295-04a4-e90d-3f50-77cfb6d405af',
  concept.id,
  'mentioned_component',
  '0.700',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '0870fa72-d19e-5f93-86ff-1d73b2f3c102',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":false,"document_key":"barry_v2_manual:9ba1297a-2aa6-de38-b971-ad38336442ad","matched_name":"pitman arm","document_role":"workshop_manual"}'::jsonb
FROM public.barry_semantic_concepts concept
WHERE concept.concept_key = 'component.pitman_arm'
ON CONFLICT (source_type, source_record_id, concept_id, annotation_role, semantic_version_id)
DO UPDATE SET
  confidence = EXCLUDED.confidence,
  review_status = EXCLUDED.review_status,
  evidence_unit_id = EXCLUDED.evidence_unit_id,
  model_scope = EXCLUDED.model_scope,
  provenance = EXCLUDED.provenance;
INSERT INTO public.barry_evidence_concepts (
  source_type, source_record_id, concept_id, annotation_role, confidence,
  method, review_status, semantic_version_id, evidence_unit_id, model_scope,
  backfill_run_id, provenance
)
SELECT
  'barry_v2_content_block',
  '9269f295-04a4-e90d-3f50-77cfb6d405af',
  concept.id,
  'mentioned_component',
  '0.850',
  'deterministic',
  'approved',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '0870fa72-d19e-5f93-86ff-1d73b2f3c102',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"barry_v2_manual:9ba1297a-2aa6-de38-b971-ad38336442ad","matched_name":"steering","document_role":"workshop_manual"}'::jsonb
FROM public.barry_semantic_concepts concept
WHERE concept.concept_key = 'vehicle_system.steering'
ON CONFLICT (source_type, source_record_id, concept_id, annotation_role, semantic_version_id)
DO UPDATE SET
  confidence = EXCLUDED.confidence,
  review_status = EXCLUDED.review_status,
  evidence_unit_id = EXCLUDED.evidence_unit_id,
  model_scope = EXCLUDED.model_scope,
  provenance = EXCLUDED.provenance;
INSERT INTO public.barry_evidence_concepts (
  source_type, source_record_id, concept_id, annotation_role, confidence,
  method, review_status, semantic_version_id, evidence_unit_id, model_scope,
  backfill_run_id, provenance
)
SELECT
  'barry_v2_content_block',
  '94153eef-aa96-50f0-952b-5c86ab1695b4',
  concept.id,
  'operation',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '76826cca-4b31-510f-8b75-67f11e19755b',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"barry_v2_manual:7147712a-37e0-b066-2067-672767b2b617","matched_name":"adjust","document_role":"workshop_manual"}'::jsonb
FROM public.barry_semantic_concepts concept
WHERE concept.concept_key = 'operation.adjust'
ON CONFLICT (source_type, source_record_id, concept_id, annotation_role, semantic_version_id)
DO UPDATE SET
  confidence = EXCLUDED.confidence,
  review_status = EXCLUDED.review_status,
  evidence_unit_id = EXCLUDED.evidence_unit_id,
  model_scope = EXCLUDED.model_scope,
  provenance = EXCLUDED.provenance;
INSERT INTO public.barry_evidence_concepts (
  source_type, source_record_id, concept_id, annotation_role, confidence,
  method, review_status, semantic_version_id, evidence_unit_id, model_scope,
  backfill_run_id, provenance
)
SELECT
  'barry_v2_content_block',
  '94153eef-aa96-50f0-952b-5c86ab1695b4',
  concept.id,
  'operation',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '76826cca-4b31-510f-8b75-67f11e19755b',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":false,"document_key":"barry_v2_manual:7147712a-37e0-b066-2067-672767b2b617","matched_name":"install","document_role":"workshop_manual"}'::jsonb
FROM public.barry_semantic_concepts concept
WHERE concept.concept_key = 'operation.install'
ON CONFLICT (source_type, source_record_id, concept_id, annotation_role, semantic_version_id)
DO UPDATE SET
  confidence = EXCLUDED.confidence,
  review_status = EXCLUDED.review_status,
  evidence_unit_id = EXCLUDED.evidence_unit_id,
  model_scope = EXCLUDED.model_scope,
  provenance = EXCLUDED.provenance;
INSERT INTO public.barry_evidence_concepts (
  source_type, source_record_id, concept_id, annotation_role, confidence,
  method, review_status, semantic_version_id, evidence_unit_id, model_scope,
  backfill_run_id, provenance
)
SELECT
  'barry_v2_content_block',
  '95353a92-2efc-b377-230a-e77b0bcaaeb8',
  concept.id,
  'primary_subject',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '192cbb82-3e83-59a1-802e-d18a46bbae5b',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"barry_v2_manual:af332a3b-25a2-3589-3a79-e73507003464","matched_name":"power steering pump","document_role":"workshop_manual"}'::jsonb
FROM public.barry_semantic_concepts concept
WHERE concept.concept_key = 'component.power_steering_pump'
ON CONFLICT (source_type, source_record_id, concept_id, annotation_role, semantic_version_id)
DO UPDATE SET
  confidence = EXCLUDED.confidence,
  review_status = EXCLUDED.review_status,
  evidence_unit_id = EXCLUDED.evidence_unit_id,
  model_scope = EXCLUDED.model_scope,
  provenance = EXCLUDED.provenance;
INSERT INTO public.barry_evidence_concepts (
  source_type, source_record_id, concept_id, annotation_role, confidence,
  method, review_status, semantic_version_id, evidence_unit_id, model_scope,
  backfill_run_id, provenance
)
SELECT
  'barry_v2_content_block',
  '95353a92-2efc-b377-230a-e77b0bcaaeb8',
  concept.id,
  'mentioned_component',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '192cbb82-3e83-59a1-802e-d18a46bbae5b',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"barry_v2_manual:af332a3b-25a2-3589-3a79-e73507003464","matched_name":"steering","document_role":"workshop_manual"}'::jsonb
FROM public.barry_semantic_concepts concept
WHERE concept.concept_key = 'vehicle_system.steering'
ON CONFLICT (source_type, source_record_id, concept_id, annotation_role, semantic_version_id)
DO UPDATE SET
  confidence = EXCLUDED.confidence,
  review_status = EXCLUDED.review_status,
  evidence_unit_id = EXCLUDED.evidence_unit_id,
  model_scope = EXCLUDED.model_scope,
  provenance = EXCLUDED.provenance;
INSERT INTO public.barry_evidence_concepts (
  source_type, source_record_id, concept_id, annotation_role, confidence,
  method, review_status, semantic_version_id, evidence_unit_id, model_scope,
  backfill_run_id, provenance
)
SELECT
  'barry_v2_content_block',
  '99630a0c-1096-48d2-4eae-30bd3b33da55',
  concept.id,
  'primary_subject',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'a33dd61c-1e46-5968-88f3-7904f739416f',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"barry_v2_manual:9ba1297a-2aa6-de38-b971-ad38336442ad","matched_name":"steering gear","document_role":"workshop_manual"}'::jsonb
FROM public.barry_semantic_concepts concept
WHERE concept.concept_key = 'component.steering_gear'
ON CONFLICT (source_type, source_record_id, concept_id, annotation_role, semantic_version_id)
DO UPDATE SET
  confidence = EXCLUDED.confidence,
  review_status = EXCLUDED.review_status,
  evidence_unit_id = EXCLUDED.evidence_unit_id,
  model_scope = EXCLUDED.model_scope,
  provenance = EXCLUDED.provenance;
INSERT INTO public.barry_evidence_concepts (
  source_type, source_record_id, concept_id, annotation_role, confidence,
  method, review_status, semantic_version_id, evidence_unit_id, model_scope,
  backfill_run_id, provenance
)
SELECT
  'barry_v2_content_block',
  '99630a0c-1096-48d2-4eae-30bd3b33da55',
  concept.id,
  'operation',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'a33dd61c-1e46-5968-88f3-7904f739416f',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":false,"document_key":"barry_v2_manual:9ba1297a-2aa6-de38-b971-ad38336442ad","matched_name":"inspect","document_role":"workshop_manual"}'::jsonb
FROM public.barry_semantic_concepts concept
WHERE concept.concept_key = 'operation.inspect'
ON CONFLICT (source_type, source_record_id, concept_id, annotation_role, semantic_version_id)
DO UPDATE SET
  confidence = EXCLUDED.confidence,
  review_status = EXCLUDED.review_status,
  evidence_unit_id = EXCLUDED.evidence_unit_id,
  model_scope = EXCLUDED.model_scope,
  provenance = EXCLUDED.provenance;
INSERT INTO public.barry_evidence_concepts (
  source_type, source_record_id, concept_id, annotation_role, confidence,
  method, review_status, semantic_version_id, evidence_unit_id, model_scope,
  backfill_run_id, provenance
)
SELECT
  'barry_v2_content_block',
  '99630a0c-1096-48d2-4eae-30bd3b33da55',
  concept.id,
  'mentioned_component',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'a33dd61c-1e46-5968-88f3-7904f739416f',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"barry_v2_manual:9ba1297a-2aa6-de38-b971-ad38336442ad","matched_name":"steering","document_role":"workshop_manual"}'::jsonb
FROM public.barry_semantic_concepts concept
WHERE concept.concept_key = 'vehicle_system.steering'
ON CONFLICT (source_type, source_record_id, concept_id, annotation_role, semantic_version_id)
DO UPDATE SET
  confidence = EXCLUDED.confidence,
  review_status = EXCLUDED.review_status,
  evidence_unit_id = EXCLUDED.evidence_unit_id,
  model_scope = EXCLUDED.model_scope,
  provenance = EXCLUDED.provenance;
INSERT INTO public.barry_evidence_concepts (
  source_type, source_record_id, concept_id, annotation_role, confidence,
  method, review_status, semantic_version_id, evidence_unit_id, model_scope,
  backfill_run_id, provenance
)
SELECT
  'barry_v2_content_block',
  '9b3c6cf3-bd5c-c9a6-1de1-e43bff9dcad4',
  concept.id,
  'primary_subject',
  '0.850',
  'deterministic',
  'approved',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '5e1d9f66-7af9-5853-87e5-8861485d7796',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"barry_v2_manual:af332a3b-25a2-3589-3a79-e73507003464","matched_name":"steering gear","document_role":"workshop_manual"}'::jsonb
FROM public.barry_semantic_concepts concept
WHERE concept.concept_key = 'component.steering_gear'
ON CONFLICT (source_type, source_record_id, concept_id, annotation_role, semantic_version_id)
DO UPDATE SET
  confidence = EXCLUDED.confidence,
  review_status = EXCLUDED.review_status,
  evidence_unit_id = EXCLUDED.evidence_unit_id,
  model_scope = EXCLUDED.model_scope,
  provenance = EXCLUDED.provenance;
INSERT INTO public.barry_evidence_concepts (
  source_type, source_record_id, concept_id, annotation_role, confidence,
  method, review_status, semantic_version_id, evidence_unit_id, model_scope,
  backfill_run_id, provenance
)
SELECT
  'barry_v2_content_block',
  '9b3c6cf3-bd5c-c9a6-1de1-e43bff9dcad4',
  concept.id,
  'property',
  '0.700',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '5e1d9f66-7af9-5853-87e5-8861485d7796',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":false,"document_key":"barry_v2_manual:af332a3b-25a2-3589-3a79-e73507003464","matched_name":"torque","document_role":"workshop_manual"}'::jsonb
FROM public.barry_semantic_concepts concept
WHERE concept.concept_key = 'property.torque'
ON CONFLICT (source_type, source_record_id, concept_id, annotation_role, semantic_version_id)
DO UPDATE SET
  confidence = EXCLUDED.confidence,
  review_status = EXCLUDED.review_status,
  evidence_unit_id = EXCLUDED.evidence_unit_id,
  model_scope = EXCLUDED.model_scope,
  provenance = EXCLUDED.provenance;
INSERT INTO public.barry_evidence_concepts (
  source_type, source_record_id, concept_id, annotation_role, confidence,
  method, review_status, semantic_version_id, evidence_unit_id, model_scope,
  backfill_run_id, provenance
)
SELECT
  'barry_v2_content_block',
  '9b3c6cf3-bd5c-c9a6-1de1-e43bff9dcad4',
  concept.id,
  'operation',
  '0.700',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '5e1d9f66-7af9-5853-87e5-8861485d7796',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":false,"document_key":"barry_v2_manual:af332a3b-25a2-3589-3a79-e73507003464","matched_name":"bleed","document_role":"workshop_manual"}'::jsonb
FROM public.barry_semantic_concepts concept
WHERE concept.concept_key = 'operation.bleed'
ON CONFLICT (source_type, source_record_id, concept_id, annotation_role, semantic_version_id)
DO UPDATE SET
  confidence = EXCLUDED.confidence,
  review_status = EXCLUDED.review_status,
  evidence_unit_id = EXCLUDED.evidence_unit_id,
  model_scope = EXCLUDED.model_scope,
  provenance = EXCLUDED.provenance;
INSERT INTO public.barry_evidence_concepts (
  source_type, source_record_id, concept_id, annotation_role, confidence,
  method, review_status, semantic_version_id, evidence_unit_id, model_scope,
  backfill_run_id, provenance
)
SELECT
  'barry_v2_content_block',
  '9b3c6cf3-bd5c-c9a6-1de1-e43bff9dcad4',
  concept.id,
  'operation',
  '0.700',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '5e1d9f66-7af9-5853-87e5-8861485d7796',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":false,"document_key":"barry_v2_manual:af332a3b-25a2-3589-3a79-e73507003464","matched_name":"check fluid level","document_role":"workshop_manual"}'::jsonb
FROM public.barry_semantic_concepts concept
WHERE concept.concept_key = 'operation.check_fluid_level'
ON CONFLICT (source_type, source_record_id, concept_id, annotation_role, semantic_version_id)
DO UPDATE SET
  confidence = EXCLUDED.confidence,
  review_status = EXCLUDED.review_status,
  evidence_unit_id = EXCLUDED.evidence_unit_id,
  model_scope = EXCLUDED.model_scope,
  provenance = EXCLUDED.provenance;
INSERT INTO public.barry_evidence_concepts (
  source_type, source_record_id, concept_id, annotation_role, confidence,
  method, review_status, semantic_version_id, evidence_unit_id, model_scope,
  backfill_run_id, provenance
)
SELECT
  'barry_v2_content_block',
  '9b3c6cf3-bd5c-c9a6-1de1-e43bff9dcad4',
  concept.id,
  'operation',
  '0.700',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '5e1d9f66-7af9-5853-87e5-8861485d7796',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":false,"document_key":"barry_v2_manual:af332a3b-25a2-3589-3a79-e73507003464","matched_name":"adjust","document_role":"workshop_manual"}'::jsonb
FROM public.barry_semantic_concepts concept
WHERE concept.concept_key = 'operation.adjust'
ON CONFLICT (source_type, source_record_id, concept_id, annotation_role, semantic_version_id)
DO UPDATE SET
  confidence = EXCLUDED.confidence,
  review_status = EXCLUDED.review_status,
  evidence_unit_id = EXCLUDED.evidence_unit_id,
  model_scope = EXCLUDED.model_scope,
  provenance = EXCLUDED.provenance;
INSERT INTO public.barry_evidence_concepts (
  source_type, source_record_id, concept_id, annotation_role, confidence,
  method, review_status, semantic_version_id, evidence_unit_id, model_scope,
  backfill_run_id, provenance
)
SELECT
  'barry_v2_content_block',
  '9b3c6cf3-bd5c-c9a6-1de1-e43bff9dcad4',
  concept.id,
  'operation',
  '0.700',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '5e1d9f66-7af9-5853-87e5-8861485d7796',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":false,"document_key":"barry_v2_manual:af332a3b-25a2-3589-3a79-e73507003464","matched_name":"inspect","document_role":"workshop_manual"}'::jsonb
FROM public.barry_semantic_concepts concept
WHERE concept.concept_key = 'operation.inspect'
ON CONFLICT (source_type, source_record_id, concept_id, annotation_role, semantic_version_id)
DO UPDATE SET
  confidence = EXCLUDED.confidence,
  review_status = EXCLUDED.review_status,
  evidence_unit_id = EXCLUDED.evidence_unit_id,
  model_scope = EXCLUDED.model_scope,
  provenance = EXCLUDED.provenance;
INSERT INTO public.barry_evidence_concepts (
  source_type, source_record_id, concept_id, annotation_role, confidence,
  method, review_status, semantic_version_id, evidence_unit_id, model_scope,
  backfill_run_id, provenance
)
SELECT
  'barry_v2_content_block',
  '9b3c6cf3-bd5c-c9a6-1de1-e43bff9dcad4',
  concept.id,
  'mentioned_component',
  '0.700',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '5e1d9f66-7af9-5853-87e5-8861485d7796',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":false,"document_key":"barry_v2_manual:af332a3b-25a2-3589-3a79-e73507003464","matched_name":"engine","document_role":"workshop_manual"}'::jsonb
FROM public.barry_semantic_concepts concept
WHERE concept.concept_key = 'vehicle_system.engine'
ON CONFLICT (source_type, source_record_id, concept_id, annotation_role, semantic_version_id)
DO UPDATE SET
  confidence = EXCLUDED.confidence,
  review_status = EXCLUDED.review_status,
  evidence_unit_id = EXCLUDED.evidence_unit_id,
  model_scope = EXCLUDED.model_scope,
  provenance = EXCLUDED.provenance;
INSERT INTO public.barry_evidence_concepts (
  source_type, source_record_id, concept_id, annotation_role, confidence,
  method, review_status, semantic_version_id, evidence_unit_id, model_scope,
  backfill_run_id, provenance
)
SELECT
  'barry_v2_content_block',
  '9b3c6cf3-bd5c-c9a6-1de1-e43bff9dcad4',
  concept.id,
  'mentioned_component',
  '0.850',
  'deterministic',
  'approved',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '5e1d9f66-7af9-5853-87e5-8861485d7796',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"barry_v2_manual:af332a3b-25a2-3589-3a79-e73507003464","matched_name":"steering","document_role":"workshop_manual"}'::jsonb
FROM public.barry_semantic_concepts concept
WHERE concept.concept_key = 'vehicle_system.steering'
ON CONFLICT (source_type, source_record_id, concept_id, annotation_role, semantic_version_id)
DO UPDATE SET
  confidence = EXCLUDED.confidence,
  review_status = EXCLUDED.review_status,
  evidence_unit_id = EXCLUDED.evidence_unit_id,
  model_scope = EXCLUDED.model_scope,
  provenance = EXCLUDED.provenance;
INSERT INTO public.barry_evidence_concepts (
  source_type, source_record_id, concept_id, annotation_role, confidence,
  method, review_status, semantic_version_id, evidence_unit_id, model_scope,
  backfill_run_id, provenance
)
SELECT
  'barry_v2_content_block',
  '9c8652fc-028d-ecd6-be18-2f1e43b33124',
  concept.id,
  'primary_subject',
  '0.850',
  'deterministic',
  'approved',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'c6860f01-1911-5bfe-84e5-6c9ac55fa570',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"barry_v2_manual:af332a3b-25a2-3589-3a79-e73507003464","matched_name":"portal hub","document_role":"workshop_manual"}'::jsonb
FROM public.barry_semantic_concepts concept
WHERE concept.concept_key = 'component.portal_hub'
ON CONFLICT (source_type, source_record_id, concept_id, annotation_role, semantic_version_id)
DO UPDATE SET
  confidence = EXCLUDED.confidence,
  review_status = EXCLUDED.review_status,
  evidence_unit_id = EXCLUDED.evidence_unit_id,
  model_scope = EXCLUDED.model_scope,
  provenance = EXCLUDED.provenance;
INSERT INTO public.barry_evidence_concepts (
  source_type, source_record_id, concept_id, annotation_role, confidence,
  method, review_status, semantic_version_id, evidence_unit_id, model_scope,
  backfill_run_id, provenance
)
SELECT
  'barry_v2_content_block',
  '9c8652fc-028d-ecd6-be18-2f1e43b33124',
  concept.id,
  'operation',
  '0.700',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'c6860f01-1911-5bfe-84e5-6c9ac55fa570',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":false,"document_key":"barry_v2_manual:af332a3b-25a2-3589-3a79-e73507003464","matched_name":"remove","document_role":"workshop_manual"}'::jsonb
FROM public.barry_semantic_concepts concept
WHERE concept.concept_key = 'operation.remove'
ON CONFLICT (source_type, source_record_id, concept_id, annotation_role, semantic_version_id)
DO UPDATE SET
  confidence = EXCLUDED.confidence,
  review_status = EXCLUDED.review_status,
  evidence_unit_id = EXCLUDED.evidence_unit_id,
  model_scope = EXCLUDED.model_scope,
  provenance = EXCLUDED.provenance;
INSERT INTO public.barry_evidence_concepts (
  source_type, source_record_id, concept_id, annotation_role, confidence,
  method, review_status, semantic_version_id, evidence_unit_id, model_scope,
  backfill_run_id, provenance
)
SELECT
  'barry_v2_content_block',
  '9c8652fc-028d-ecd6-be18-2f1e43b33124',
  concept.id,
  'mentioned_component',
  '0.700',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'c6860f01-1911-5bfe-84e5-6c9ac55fa570',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":false,"document_key":"barry_v2_manual:af332a3b-25a2-3589-3a79-e73507003464","matched_name":"steering","document_role":"workshop_manual"}'::jsonb
FROM public.barry_semantic_concepts concept
WHERE concept.concept_key = 'vehicle_system.steering'
ON CONFLICT (source_type, source_record_id, concept_id, annotation_role, semantic_version_id)
DO UPDATE SET
  confidence = EXCLUDED.confidence,
  review_status = EXCLUDED.review_status,
  evidence_unit_id = EXCLUDED.evidence_unit_id,
  model_scope = EXCLUDED.model_scope,
  provenance = EXCLUDED.provenance;
INSERT INTO public.barry_evidence_concepts (
  source_type, source_record_id, concept_id, annotation_role, confidence,
  method, review_status, semantic_version_id, evidence_unit_id, model_scope,
  backfill_run_id, provenance
)
SELECT
  'barry_v2_content_block',
  '9d3ae11e-c026-0ba2-9742-deb22d00fe69',
  concept.id,
  'primary_subject',
  '0.850',
  'deterministic',
  'approved',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '524f7066-e3a0-5843-85cc-ccd41a2edc77',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"barry_v2_manual:9ba1297a-2aa6-de38-b971-ad38336442ad","matched_name":"portal hub","document_role":"workshop_manual"}'::jsonb
FROM public.barry_semantic_concepts concept
WHERE concept.concept_key = 'component.portal_hub'
ON CONFLICT (source_type, source_record_id, concept_id, annotation_role, semantic_version_id)
DO UPDATE SET
  confidence = EXCLUDED.confidence,
  review_status = EXCLUDED.review_status,
  evidence_unit_id = EXCLUDED.evidence_unit_id,
  model_scope = EXCLUDED.model_scope,
  provenance = EXCLUDED.provenance;
INSERT INTO public.barry_evidence_concepts (
  source_type, source_record_id, concept_id, annotation_role, confidence,
  method, review_status, semantic_version_id, evidence_unit_id, model_scope,
  backfill_run_id, provenance
)
SELECT
  'barry_v2_content_block',
  '9d3ae11e-c026-0ba2-9742-deb22d00fe69',
  concept.id,
  'operation',
  '0.700',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '524f7066-e3a0-5843-85cc-ccd41a2edc77',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":false,"document_key":"barry_v2_manual:9ba1297a-2aa6-de38-b971-ad38336442ad","matched_name":"remove","document_role":"workshop_manual"}'::jsonb
FROM public.barry_semantic_concepts concept
WHERE concept.concept_key = 'operation.remove'
ON CONFLICT (source_type, source_record_id, concept_id, annotation_role, semantic_version_id)
DO UPDATE SET
  confidence = EXCLUDED.confidence,
  review_status = EXCLUDED.review_status,
  evidence_unit_id = EXCLUDED.evidence_unit_id,
  model_scope = EXCLUDED.model_scope,
  provenance = EXCLUDED.provenance;
INSERT INTO public.barry_evidence_concepts (
  source_type, source_record_id, concept_id, annotation_role, confidence,
  method, review_status, semantic_version_id, evidence_unit_id, model_scope,
  backfill_run_id, provenance
)
SELECT
  'barry_v2_content_block',
  '9da6d0c4-63c5-2de5-8032-9fa2cd4ba7dd',
  concept.id,
  'mentioned_component',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '8fa2bcd1-7170-5801-8de0-68d065065151',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":false,"document_key":"barry_v2_manual:7147712a-37e0-b066-2067-672767b2b617","matched_name":"pitman arm","document_role":"workshop_manual"}'::jsonb
FROM public.barry_semantic_concepts concept
WHERE concept.concept_key = 'component.pitman_arm'
ON CONFLICT (source_type, source_record_id, concept_id, annotation_role, semantic_version_id)
DO UPDATE SET
  confidence = EXCLUDED.confidence,
  review_status = EXCLUDED.review_status,
  evidence_unit_id = EXCLUDED.evidence_unit_id,
  model_scope = EXCLUDED.model_scope,
  provenance = EXCLUDED.provenance;
INSERT INTO public.barry_evidence_concepts (
  source_type, source_record_id, concept_id, annotation_role, confidence,
  method, review_status, semantic_version_id, evidence_unit_id, model_scope,
  backfill_run_id, provenance
)
SELECT
  'barry_v2_content_block',
  '9da6d0c4-63c5-2de5-8032-9fa2cd4ba7dd',
  concept.id,
  'mentioned_component',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '8fa2bcd1-7170-5801-8de0-68d065065151',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":false,"document_key":"barry_v2_manual:7147712a-37e0-b066-2067-672767b2b617","matched_name":"puller","document_role":"workshop_manual"}'::jsonb
FROM public.barry_semantic_concepts concept
WHERE concept.concept_key = 'tool.puller'
ON CONFLICT (source_type, source_record_id, concept_id, annotation_role, semantic_version_id)
DO UPDATE SET
  confidence = EXCLUDED.confidence,
  review_status = EXCLUDED.review_status,
  evidence_unit_id = EXCLUDED.evidence_unit_id,
  model_scope = EXCLUDED.model_scope,
  provenance = EXCLUDED.provenance;
INSERT INTO public.barry_evidence_concepts (
  source_type, source_record_id, concept_id, annotation_role, confidence,
  method, review_status, semantic_version_id, evidence_unit_id, model_scope,
  backfill_run_id, provenance
)
SELECT
  'barry_v2_content_block',
  '9da6d0c4-63c5-2de5-8032-9fa2cd4ba7dd',
  concept.id,
  'property',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '8fa2bcd1-7170-5801-8de0-68d065065151',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":false,"document_key":"barry_v2_manual:7147712a-37e0-b066-2067-672767b2b617","matched_name":"part number","document_role":"workshop_manual"}'::jsonb
FROM public.barry_semantic_concepts concept
WHERE concept.concept_key = 'property.part_number'
ON CONFLICT (source_type, source_record_id, concept_id, annotation_role, semantic_version_id)
DO UPDATE SET
  confidence = EXCLUDED.confidence,
  review_status = EXCLUDED.review_status,
  evidence_unit_id = EXCLUDED.evidence_unit_id,
  model_scope = EXCLUDED.model_scope,
  provenance = EXCLUDED.provenance;
INSERT INTO public.barry_evidence_concepts (
  source_type, source_record_id, concept_id, annotation_role, confidence,
  method, review_status, semantic_version_id, evidence_unit_id, model_scope,
  backfill_run_id, provenance
)
SELECT
  'barry_v2_content_block',
  '9da6d0c4-63c5-2de5-8032-9fa2cd4ba7dd',
  concept.id,
  'property',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '8fa2bcd1-7170-5801-8de0-68d065065151',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":false,"document_key":"barry_v2_manual:7147712a-37e0-b066-2067-672767b2b617","matched_name":"torque","document_role":"workshop_manual"}'::jsonb
FROM public.barry_semantic_concepts concept
WHERE concept.concept_key = 'property.torque'
ON CONFLICT (source_type, source_record_id, concept_id, annotation_role, semantic_version_id)
DO UPDATE SET
  confidence = EXCLUDED.confidence,
  review_status = EXCLUDED.review_status,
  evidence_unit_id = EXCLUDED.evidence_unit_id,
  model_scope = EXCLUDED.model_scope,
  provenance = EXCLUDED.provenance;
INSERT INTO public.barry_evidence_concepts (
  source_type, source_record_id, concept_id, annotation_role, confidence,
  method, review_status, semantic_version_id, evidence_unit_id, model_scope,
  backfill_run_id, provenance
)
SELECT
  'barry_v2_content_block',
  '9da6d0c4-63c5-2de5-8032-9fa2cd4ba7dd',
  concept.id,
  'operation',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '8fa2bcd1-7170-5801-8de0-68d065065151',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":false,"document_key":"barry_v2_manual:7147712a-37e0-b066-2067-672767b2b617","matched_name":"adjust","document_role":"workshop_manual"}'::jsonb
FROM public.barry_semantic_concepts concept
WHERE concept.concept_key = 'operation.adjust'
ON CONFLICT (source_type, source_record_id, concept_id, annotation_role, semantic_version_id)
DO UPDATE SET
  confidence = EXCLUDED.confidence,
  review_status = EXCLUDED.review_status,
  evidence_unit_id = EXCLUDED.evidence_unit_id,
  model_scope = EXCLUDED.model_scope,
  provenance = EXCLUDED.provenance;
INSERT INTO public.barry_evidence_concepts (
  source_type, source_record_id, concept_id, annotation_role, confidence,
  method, review_status, semantic_version_id, evidence_unit_id, model_scope,
  backfill_run_id, provenance
)
SELECT
  'barry_v2_content_block',
  '9da6d0c4-63c5-2de5-8032-9fa2cd4ba7dd',
  concept.id,
  'mentioned_component',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '8fa2bcd1-7170-5801-8de0-68d065065151',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"barry_v2_manual:7147712a-37e0-b066-2067-672767b2b617","matched_name":"steering","document_role":"workshop_manual"}'::jsonb
FROM public.barry_semantic_concepts concept
WHERE concept.concept_key = 'vehicle_system.steering'
ON CONFLICT (source_type, source_record_id, concept_id, annotation_role, semantic_version_id)
DO UPDATE SET
  confidence = EXCLUDED.confidence,
  review_status = EXCLUDED.review_status,
  evidence_unit_id = EXCLUDED.evidence_unit_id,
  model_scope = EXCLUDED.model_scope,
  provenance = EXCLUDED.provenance;
INSERT INTO public.barry_evidence_concepts (
  source_type, source_record_id, concept_id, annotation_role, confidence,
  method, review_status, semantic_version_id, evidence_unit_id, model_scope,
  backfill_run_id, provenance
)
SELECT
  'barry_v2_content_block',
  '9e187cd1-a68e-6760-1f3a-15514a5789c5',
  concept.id,
  'primary_subject',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '8c8fa3c7-705d-5824-863d-f517e23eea46',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"barry_v2_manual:af332a3b-25a2-3589-3a79-e73507003464","matched_name":"differential","document_role":"workshop_manual"}'::jsonb
FROM public.barry_semantic_concepts concept
WHERE concept.concept_key = 'component.differential'
ON CONFLICT (source_type, source_record_id, concept_id, annotation_role, semantic_version_id)
DO UPDATE SET
  confidence = EXCLUDED.confidence,
  review_status = EXCLUDED.review_status,
  evidence_unit_id = EXCLUDED.evidence_unit_id,
  model_scope = EXCLUDED.model_scope,
  provenance = EXCLUDED.provenance;
INSERT INTO public.barry_evidence_concepts (
  source_type, source_record_id, concept_id, annotation_role, confidence,
  method, review_status, semantic_version_id, evidence_unit_id, model_scope,
  backfill_run_id, provenance
)
SELECT
  'barry_v2_content_block',
  '9e187cd1-a68e-6760-1f3a-15514a5789c5',
  concept.id,
  'property',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '8c8fa3c7-705d-5824-863d-f517e23eea46',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":false,"document_key":"barry_v2_manual:af332a3b-25a2-3589-3a79-e73507003464","matched_name":"torque","document_role":"workshop_manual"}'::jsonb
FROM public.barry_semantic_concepts concept
WHERE concept.concept_key = 'property.torque'
ON CONFLICT (source_type, source_record_id, concept_id, annotation_role, semantic_version_id)
DO UPDATE SET
  confidence = EXCLUDED.confidence,
  review_status = EXCLUDED.review_status,
  evidence_unit_id = EXCLUDED.evidence_unit_id,
  model_scope = EXCLUDED.model_scope,
  provenance = EXCLUDED.provenance;
INSERT INTO public.barry_evidence_concepts (
  source_type, source_record_id, concept_id, annotation_role, confidence,
  method, review_status, semantic_version_id, evidence_unit_id, model_scope,
  backfill_run_id, provenance
)
SELECT
  'barry_v2_content_block',
  '9e187cd1-a68e-6760-1f3a-15514a5789c5',
  concept.id,
  'operation',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '8c8fa3c7-705d-5824-863d-f517e23eea46',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":false,"document_key":"barry_v2_manual:af332a3b-25a2-3589-3a79-e73507003464","matched_name":"install","document_role":"workshop_manual"}'::jsonb
FROM public.barry_semantic_concepts concept
WHERE concept.concept_key = 'operation.install'
ON CONFLICT (source_type, source_record_id, concept_id, annotation_role, semantic_version_id)
DO UPDATE SET
  confidence = EXCLUDED.confidence,
  review_status = EXCLUDED.review_status,
  evidence_unit_id = EXCLUDED.evidence_unit_id,
  model_scope = EXCLUDED.model_scope,
  provenance = EXCLUDED.provenance;
INSERT INTO public.barry_evidence_concepts (
  source_type, source_record_id, concept_id, annotation_role, confidence,
  method, review_status, semantic_version_id, evidence_unit_id, model_scope,
  backfill_run_id, provenance
)
SELECT
  'barry_v2_content_block',
  '9e187cd1-a68e-6760-1f3a-15514a5789c5',
  concept.id,
  'applicability',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '8c8fa3c7-705d-5824-863d-f517e23eea46',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":false,"document_key":"barry_v2_manual:af332a3b-25a2-3589-3a79-e73507003464","matched_name":"U435","document_role":"workshop_manual"}'::jsonb
FROM public.barry_semantic_concepts concept
WHERE concept.concept_key = 'vehicle_model.u435'
ON CONFLICT (source_type, source_record_id, concept_id, annotation_role, semantic_version_id)
DO UPDATE SET
  confidence = EXCLUDED.confidence,
  review_status = EXCLUDED.review_status,
  evidence_unit_id = EXCLUDED.evidence_unit_id,
  model_scope = EXCLUDED.model_scope,
  provenance = EXCLUDED.provenance;
INSERT INTO public.barry_evidence_concepts (
  source_type, source_record_id, concept_id, annotation_role, confidence,
  method, review_status, semantic_version_id, evidence_unit_id, model_scope,
  backfill_run_id, provenance
)
SELECT
  'barry_v2_content_block',
  '9ec0d719-fbf5-d41c-ded6-3ec7388c4bca',
  concept.id,
  'operation',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '43bc52e0-4047-5a6c-8f42-b356559e3f7c',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":false,"document_key":"barry_v2_manual:af332a3b-25a2-3589-3a79-e73507003464","matched_name":"remove","document_role":"workshop_manual"}'::jsonb
FROM public.barry_semantic_concepts concept
WHERE concept.concept_key = 'operation.remove'
ON CONFLICT (source_type, source_record_id, concept_id, annotation_role, semantic_version_id)
DO UPDATE SET
  confidence = EXCLUDED.confidence,
  review_status = EXCLUDED.review_status,
  evidence_unit_id = EXCLUDED.evidence_unit_id,
  model_scope = EXCLUDED.model_scope,
  provenance = EXCLUDED.provenance;
INSERT INTO public.barry_evidence_concepts (
  source_type, source_record_id, concept_id, annotation_role, confidence,
  method, review_status, semantic_version_id, evidence_unit_id, model_scope,
  backfill_run_id, provenance
)
SELECT
  'barry_v2_content_block',
  '9ec0d719-fbf5-d41c-ded6-3ec7388c4bca',
  concept.id,
  'operation',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '43bc52e0-4047-5a6c-8f42-b356559e3f7c',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":false,"document_key":"barry_v2_manual:af332a3b-25a2-3589-3a79-e73507003464","matched_name":"inspect","document_role":"workshop_manual"}'::jsonb
FROM public.barry_semantic_concepts concept
WHERE concept.concept_key = 'operation.inspect'
ON CONFLICT (source_type, source_record_id, concept_id, annotation_role, semantic_version_id)
DO UPDATE SET
  confidence = EXCLUDED.confidence,
  review_status = EXCLUDED.review_status,
  evidence_unit_id = EXCLUDED.evidence_unit_id,
  model_scope = EXCLUDED.model_scope,
  provenance = EXCLUDED.provenance;
INSERT INTO public.barry_evidence_concepts (
  source_type, source_record_id, concept_id, annotation_role, confidence,
  method, review_status, semantic_version_id, evidence_unit_id, model_scope,
  backfill_run_id, provenance
)
SELECT
  'barry_v2_content_block',
  '9ec0d719-fbf5-d41c-ded6-3ec7388c4bca',
  concept.id,
  'mentioned_component',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '43bc52e0-4047-5a6c-8f42-b356559e3f7c',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"barry_v2_manual:af332a3b-25a2-3589-3a79-e73507003464","matched_name":"steering","document_role":"workshop_manual"}'::jsonb
FROM public.barry_semantic_concepts concept
WHERE concept.concept_key = 'vehicle_system.steering'
ON CONFLICT (source_type, source_record_id, concept_id, annotation_role, semantic_version_id)
DO UPDATE SET
  confidence = EXCLUDED.confidence,
  review_status = EXCLUDED.review_status,
  evidence_unit_id = EXCLUDED.evidence_unit_id,
  model_scope = EXCLUDED.model_scope,
  provenance = EXCLUDED.provenance;
INSERT INTO public.barry_evidence_concepts (
  source_type, source_record_id, concept_id, annotation_role, confidence,
  method, review_status, semantic_version_id, evidence_unit_id, model_scope,
  backfill_run_id, provenance
)
SELECT
  'barry_v2_content_block',
  'a0cc68b1-1a8d-97c9-c870-bdde5ea73666',
  concept.id,
  'mentioned_component',
  '0.700',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '347080e4-f6bf-5f6c-83c0-4c2f7a516b36',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":false,"document_key":"barry_v2_manual:af332a3b-25a2-3589-3a79-e73507003464","matched_name":"repair kit","document_role":"workshop_manual"}'::jsonb
FROM public.barry_semantic_concepts concept
WHERE concept.concept_key = 'part.repair_kit'
ON CONFLICT (source_type, source_record_id, concept_id, annotation_role, semantic_version_id)
DO UPDATE SET
  confidence = EXCLUDED.confidence,
  review_status = EXCLUDED.review_status,
  evidence_unit_id = EXCLUDED.evidence_unit_id,
  model_scope = EXCLUDED.model_scope,
  provenance = EXCLUDED.provenance;
INSERT INTO public.barry_evidence_concepts (
  source_type, source_record_id, concept_id, annotation_role, confidence,
  method, review_status, semantic_version_id, evidence_unit_id, model_scope,
  backfill_run_id, provenance
)
SELECT
  'barry_v2_content_block',
  'a28c434f-e11e-19c2-b714-213560aa8830',
  concept.id,
  'primary_subject',
  '0.900',
  'deterministic',
  'approved',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '24fcf9c9-4de9-58e3-8cd9-d2a0d5861993',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"barry_v2_manual:9ba1297a-2aa6-de38-b971-ad38336442ad","matched_name":"steering gear","document_role":"workshop_manual"}'::jsonb
FROM public.barry_semantic_concepts concept
WHERE concept.concept_key = 'component.steering_gear'
ON CONFLICT (source_type, source_record_id, concept_id, annotation_role, semantic_version_id)
DO UPDATE SET
  confidence = EXCLUDED.confidence,
  review_status = EXCLUDED.review_status,
  evidence_unit_id = EXCLUDED.evidence_unit_id,
  model_scope = EXCLUDED.model_scope,
  provenance = EXCLUDED.provenance;
INSERT INTO public.barry_evidence_concepts (
  source_type, source_record_id, concept_id, annotation_role, confidence,
  method, review_status, semantic_version_id, evidence_unit_id, model_scope,
  backfill_run_id, provenance
)
SELECT
  'barry_v2_content_block',
  'a28c434f-e11e-19c2-b714-213560aa8830',
  concept.id,
  'mentioned_component',
  '0.700',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '24fcf9c9-4de9-58e3-8cd9-d2a0d5861993',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":false,"document_key":"barry_v2_manual:9ba1297a-2aa6-de38-b971-ad38336442ad","matched_name":"sealing ring","document_role":"workshop_manual"}'::jsonb
FROM public.barry_semantic_concepts concept
WHERE concept.concept_key = 'part.sealing_ring'
ON CONFLICT (source_type, source_record_id, concept_id, annotation_role, semantic_version_id)
DO UPDATE SET
  confidence = EXCLUDED.confidence,
  review_status = EXCLUDED.review_status,
  evidence_unit_id = EXCLUDED.evidence_unit_id,
  model_scope = EXCLUDED.model_scope,
  provenance = EXCLUDED.provenance;
INSERT INTO public.barry_evidence_concepts (
  source_type, source_record_id, concept_id, annotation_role, confidence,
  method, review_status, semantic_version_id, evidence_unit_id, model_scope,
  backfill_run_id, provenance
)
SELECT
  'barry_v2_content_block',
  'a28c434f-e11e-19c2-b714-213560aa8830',
  concept.id,
  'mentioned_component',
  '0.900',
  'deterministic',
  'approved',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '24fcf9c9-4de9-58e3-8cd9-d2a0d5861993',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"barry_v2_manual:9ba1297a-2aa6-de38-b971-ad38336442ad","matched_name":"steering","document_role":"workshop_manual"}'::jsonb
FROM public.barry_semantic_concepts concept
WHERE concept.concept_key = 'vehicle_system.steering'
ON CONFLICT (source_type, source_record_id, concept_id, annotation_role, semantic_version_id)
DO UPDATE SET
  confidence = EXCLUDED.confidence,
  review_status = EXCLUDED.review_status,
  evidence_unit_id = EXCLUDED.evidence_unit_id,
  model_scope = EXCLUDED.model_scope,
  provenance = EXCLUDED.provenance;
INSERT INTO public.barry_evidence_concepts (
  source_type, source_record_id, concept_id, annotation_role, confidence,
  method, review_status, semantic_version_id, evidence_unit_id, model_scope,
  backfill_run_id, provenance
)
SELECT
  'barry_v2_content_block',
  'a3de9eee-1415-975d-25bc-c1dd053c5b4b',
  concept.id,
  'property',
  '0.850',
  'deterministic',
  'approved',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '384f13e1-7722-565e-881c-c6b2e8d6f3f3',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"barry_v2_manual:af332a3b-25a2-3589-3a79-e73507003464","matched_name":"operating pressure","document_role":"workshop_manual"}'::jsonb
FROM public.barry_semantic_concepts concept
WHERE concept.concept_key = 'property.operating_pressure'
ON CONFLICT (source_type, source_record_id, concept_id, annotation_role, semantic_version_id)
DO UPDATE SET
  confidence = EXCLUDED.confidence,
  review_status = EXCLUDED.review_status,
  evidence_unit_id = EXCLUDED.evidence_unit_id,
  model_scope = EXCLUDED.model_scope,
  provenance = EXCLUDED.provenance;
INSERT INTO public.barry_evidence_concepts (
  source_type, source_record_id, concept_id, annotation_role, confidence,
  method, review_status, semantic_version_id, evidence_unit_id, model_scope,
  backfill_run_id, provenance
)
SELECT
  'barry_v2_content_block',
  'a3de9eee-1415-975d-25bc-c1dd053c5b4b',
  concept.id,
  'operation',
  '0.850',
  'deterministic',
  'approved',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '384f13e1-7722-565e-881c-c6b2e8d6f3f3',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"barry_v2_manual:af332a3b-25a2-3589-3a79-e73507003464","matched_name":"inspect","document_role":"workshop_manual"}'::jsonb
FROM public.barry_semantic_concepts concept
WHERE concept.concept_key = 'operation.inspect'
ON CONFLICT (source_type, source_record_id, concept_id, annotation_role, semantic_version_id)
DO UPDATE SET
  confidence = EXCLUDED.confidence,
  review_status = EXCLUDED.review_status,
  evidence_unit_id = EXCLUDED.evidence_unit_id,
  model_scope = EXCLUDED.model_scope,
  provenance = EXCLUDED.provenance;
INSERT INTO public.barry_evidence_concepts (
  source_type, source_record_id, concept_id, annotation_role, confidence,
  method, review_status, semantic_version_id, evidence_unit_id, model_scope,
  backfill_run_id, provenance
)
SELECT
  'barry_v2_content_block',
  'a5dba17a-8d62-0ff9-831e-aa0fc2b75226',
  concept.id,
  'primary_subject',
  '0.850',
  'deterministic',
  'approved',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '14acbd3a-4d77-559e-849c-babcef6666c5',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"barry_v2_manual:9ba1297a-2aa6-de38-b971-ad38336442ad","matched_name":"portal hub","document_role":"workshop_manual"}'::jsonb
FROM public.barry_semantic_concepts concept
WHERE concept.concept_key = 'component.portal_hub'
ON CONFLICT (source_type, source_record_id, concept_id, annotation_role, semantic_version_id)
DO UPDATE SET
  confidence = EXCLUDED.confidence,
  review_status = EXCLUDED.review_status,
  evidence_unit_id = EXCLUDED.evidence_unit_id,
  model_scope = EXCLUDED.model_scope,
  provenance = EXCLUDED.provenance;
INSERT INTO public.barry_evidence_concepts (
  source_type, source_record_id, concept_id, annotation_role, confidence,
  method, review_status, semantic_version_id, evidence_unit_id, model_scope,
  backfill_run_id, provenance
)
SELECT
  'barry_v2_content_block',
  'a5dba17a-8d62-0ff9-831e-aa0fc2b75226',
  concept.id,
  'operation',
  '0.700',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '14acbd3a-4d77-559e-849c-babcef6666c5',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":false,"document_key":"barry_v2_manual:9ba1297a-2aa6-de38-b971-ad38336442ad","matched_name":"bleed","document_role":"workshop_manual"}'::jsonb
FROM public.barry_semantic_concepts concept
WHERE concept.concept_key = 'operation.bleed'
ON CONFLICT (source_type, source_record_id, concept_id, annotation_role, semantic_version_id)
DO UPDATE SET
  confidence = EXCLUDED.confidence,
  review_status = EXCLUDED.review_status,
  evidence_unit_id = EXCLUDED.evidence_unit_id,
  model_scope = EXCLUDED.model_scope,
  provenance = EXCLUDED.provenance;
INSERT INTO public.barry_evidence_concepts (
  source_type, source_record_id, concept_id, annotation_role, confidence,
  method, review_status, semantic_version_id, evidence_unit_id, model_scope,
  backfill_run_id, provenance
)
SELECT
  'barry_v2_content_block',
  'a5dba17a-8d62-0ff9-831e-aa0fc2b75226',
  concept.id,
  'operation',
  '0.700',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '14acbd3a-4d77-559e-849c-babcef6666c5',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":false,"document_key":"barry_v2_manual:9ba1297a-2aa6-de38-b971-ad38336442ad","matched_name":"install","document_role":"workshop_manual"}'::jsonb
FROM public.barry_semantic_concepts concept
WHERE concept.concept_key = 'operation.install'
ON CONFLICT (source_type, source_record_id, concept_id, annotation_role, semantic_version_id)
DO UPDATE SET
  confidence = EXCLUDED.confidence,
  review_status = EXCLUDED.review_status,
  evidence_unit_id = EXCLUDED.evidence_unit_id,
  model_scope = EXCLUDED.model_scope,
  provenance = EXCLUDED.provenance;
INSERT INTO public.barry_evidence_concepts (
  source_type, source_record_id, concept_id, annotation_role, confidence,
  method, review_status, semantic_version_id, evidence_unit_id, model_scope,
  backfill_run_id, provenance
)
SELECT
  'barry_v2_content_block',
  'a5dba17a-8d62-0ff9-831e-aa0fc2b75226',
  concept.id,
  'operation',
  '0.700',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '14acbd3a-4d77-559e-849c-babcef6666c5',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":false,"document_key":"barry_v2_manual:9ba1297a-2aa6-de38-b971-ad38336442ad","matched_name":"inspect","document_role":"workshop_manual"}'::jsonb
FROM public.barry_semantic_concepts concept
WHERE concept.concept_key = 'operation.inspect'
ON CONFLICT (source_type, source_record_id, concept_id, annotation_role, semantic_version_id)
DO UPDATE SET
  confidence = EXCLUDED.confidence,
  review_status = EXCLUDED.review_status,
  evidence_unit_id = EXCLUDED.evidence_unit_id,
  model_scope = EXCLUDED.model_scope,
  provenance = EXCLUDED.provenance;
INSERT INTO public.barry_evidence_concepts (
  source_type, source_record_id, concept_id, annotation_role, confidence,
  method, review_status, semantic_version_id, evidence_unit_id, model_scope,
  backfill_run_id, provenance
)
SELECT
  'barry_v2_content_block',
  'aa4205f7-8539-bb15-6668-27fe4012d1f5',
  concept.id,
  'primary_subject',
  '0.850',
  'deterministic',
  'approved',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'f21fba83-2d18-5f5c-844f-1d0c7845704d',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"barry_v2_manual:9ba1297a-2aa6-de38-b971-ad38336442ad","matched_name":"differential","document_role":"workshop_manual"}'::jsonb
FROM public.barry_semantic_concepts concept
WHERE concept.concept_key = 'component.differential'
ON CONFLICT (source_type, source_record_id, concept_id, annotation_role, semantic_version_id)
DO UPDATE SET
  confidence = EXCLUDED.confidence,
  review_status = EXCLUDED.review_status,
  evidence_unit_id = EXCLUDED.evidence_unit_id,
  model_scope = EXCLUDED.model_scope,
  provenance = EXCLUDED.provenance;
INSERT INTO public.barry_evidence_concepts (
  source_type, source_record_id, concept_id, annotation_role, confidence,
  method, review_status, semantic_version_id, evidence_unit_id, model_scope,
  backfill_run_id, provenance
)
SELECT
  'barry_v2_content_block',
  'aa4205f7-8539-bb15-6668-27fe4012d1f5',
  concept.id,
  'property',
  '0.850',
  'deterministic',
  'approved',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'f21fba83-2d18-5f5c-844f-1d0c7845704d',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"barry_v2_manual:9ba1297a-2aa6-de38-b971-ad38336442ad","matched_name":"operating pressure","document_role":"workshop_manual"}'::jsonb
FROM public.barry_semantic_concepts concept
WHERE concept.concept_key = 'property.operating_pressure'
ON CONFLICT (source_type, source_record_id, concept_id, annotation_role, semantic_version_id)
DO UPDATE SET
  confidence = EXCLUDED.confidence,
  review_status = EXCLUDED.review_status,
  evidence_unit_id = EXCLUDED.evidence_unit_id,
  model_scope = EXCLUDED.model_scope,
  provenance = EXCLUDED.provenance;
INSERT INTO public.barry_evidence_concepts (
  source_type, source_record_id, concept_id, annotation_role, confidence,
  method, review_status, semantic_version_id, evidence_unit_id, model_scope,
  backfill_run_id, provenance
)
SELECT
  'barry_v2_content_block',
  'ab2fde5f-0e3b-a121-ca5c-4f6ae6b78642',
  concept.id,
  'primary_subject',
  '0.850',
  'deterministic',
  'approved',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '0809ab47-675e-573a-8119-9a7ae9d28708',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"barry_v2_manual:af332a3b-25a2-3589-3a79-e73507003464","matched_name":"steering gear","document_role":"workshop_manual"}'::jsonb
FROM public.barry_semantic_concepts concept
WHERE concept.concept_key = 'component.steering_gear'
ON CONFLICT (source_type, source_record_id, concept_id, annotation_role, semantic_version_id)
DO UPDATE SET
  confidence = EXCLUDED.confidence,
  review_status = EXCLUDED.review_status,
  evidence_unit_id = EXCLUDED.evidence_unit_id,
  model_scope = EXCLUDED.model_scope,
  provenance = EXCLUDED.provenance;
INSERT INTO public.barry_evidence_concepts (
  source_type, source_record_id, concept_id, annotation_role, confidence,
  method, review_status, semantic_version_id, evidence_unit_id, model_scope,
  backfill_run_id, provenance
)
SELECT
  'barry_v2_content_block',
  'ab2fde5f-0e3b-a121-ca5c-4f6ae6b78642',
  concept.id,
  'mentioned_component',
  '0.700',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '0809ab47-675e-573a-8119-9a7ae9d28708',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":false,"document_key":"barry_v2_manual:af332a3b-25a2-3589-3a79-e73507003464","matched_name":"pitman arm","document_role":"workshop_manual"}'::jsonb
FROM public.barry_semantic_concepts concept
WHERE concept.concept_key = 'component.pitman_arm'
ON CONFLICT (source_type, source_record_id, concept_id, annotation_role, semantic_version_id)
DO UPDATE SET
  confidence = EXCLUDED.confidence,
  review_status = EXCLUDED.review_status,
  evidence_unit_id = EXCLUDED.evidence_unit_id,
  model_scope = EXCLUDED.model_scope,
  provenance = EXCLUDED.provenance;
INSERT INTO public.barry_evidence_concepts (
  source_type, source_record_id, concept_id, annotation_role, confidence,
  method, review_status, semantic_version_id, evidence_unit_id, model_scope,
  backfill_run_id, provenance
)
SELECT
  'barry_v2_content_block',
  'ab2fde5f-0e3b-a121-ca5c-4f6ae6b78642',
  concept.id,
  'mentioned_component',
  '0.850',
  'deterministic',
  'approved',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '0809ab47-675e-573a-8119-9a7ae9d28708',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"barry_v2_manual:af332a3b-25a2-3589-3a79-e73507003464","matched_name":"steering","document_role":"workshop_manual"}'::jsonb
FROM public.barry_semantic_concepts concept
WHERE concept.concept_key = 'vehicle_system.steering'
ON CONFLICT (source_type, source_record_id, concept_id, annotation_role, semantic_version_id)
DO UPDATE SET
  confidence = EXCLUDED.confidence,
  review_status = EXCLUDED.review_status,
  evidence_unit_id = EXCLUDED.evidence_unit_id,
  model_scope = EXCLUDED.model_scope,
  provenance = EXCLUDED.provenance;
INSERT INTO public.barry_evidence_concepts (
  source_type, source_record_id, concept_id, annotation_role, confidence,
  method, review_status, semantic_version_id, evidence_unit_id, model_scope,
  backfill_run_id, provenance
)
SELECT
  'barry_v2_content_block',
  'ac1c46f0-3659-87d4-e771-6757d6588cd8',
  concept.id,
  'operation',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'cf267826-1d0e-5b39-8534-5517df2a23de',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":false,"document_key":"barry_v2_manual:9ba1297a-2aa6-de38-b971-ad38336442ad","matched_name":"remove","document_role":"workshop_manual"}'::jsonb
FROM public.barry_semantic_concepts concept
WHERE concept.concept_key = 'operation.remove'
ON CONFLICT (source_type, source_record_id, concept_id, annotation_role, semantic_version_id)
DO UPDATE SET
  confidence = EXCLUDED.confidence,
  review_status = EXCLUDED.review_status,
  evidence_unit_id = EXCLUDED.evidence_unit_id,
  model_scope = EXCLUDED.model_scope,
  provenance = EXCLUDED.provenance;
INSERT INTO public.barry_evidence_concepts (
  source_type, source_record_id, concept_id, annotation_role, confidence,
  method, review_status, semantic_version_id, evidence_unit_id, model_scope,
  backfill_run_id, provenance
)
SELECT
  'barry_v2_content_block',
  'ac1c46f0-3659-87d4-e771-6757d6588cd8',
  concept.id,
  'operation',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'cf267826-1d0e-5b39-8534-5517df2a23de',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":false,"document_key":"barry_v2_manual:9ba1297a-2aa6-de38-b971-ad38336442ad","matched_name":"inspect","document_role":"workshop_manual"}'::jsonb
FROM public.barry_semantic_concepts concept
WHERE concept.concept_key = 'operation.inspect'
ON CONFLICT (source_type, source_record_id, concept_id, annotation_role, semantic_version_id)
DO UPDATE SET
  confidence = EXCLUDED.confidence,
  review_status = EXCLUDED.review_status,
  evidence_unit_id = EXCLUDED.evidence_unit_id,
  model_scope = EXCLUDED.model_scope,
  provenance = EXCLUDED.provenance;
INSERT INTO public.barry_evidence_concepts (
  source_type, source_record_id, concept_id, annotation_role, confidence,
  method, review_status, semantic_version_id, evidence_unit_id, model_scope,
  backfill_run_id, provenance
)
SELECT
  'barry_v2_content_block',
  'ac1c46f0-3659-87d4-e771-6757d6588cd8',
  concept.id,
  'mentioned_component',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'cf267826-1d0e-5b39-8534-5517df2a23de',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"barry_v2_manual:9ba1297a-2aa6-de38-b971-ad38336442ad","matched_name":"steering","document_role":"workshop_manual"}'::jsonb
FROM public.barry_semantic_concepts concept
WHERE concept.concept_key = 'vehicle_system.steering'
ON CONFLICT (source_type, source_record_id, concept_id, annotation_role, semantic_version_id)
DO UPDATE SET
  confidence = EXCLUDED.confidence,
  review_status = EXCLUDED.review_status,
  evidence_unit_id = EXCLUDED.evidence_unit_id,
  model_scope = EXCLUDED.model_scope,
  provenance = EXCLUDED.provenance;
INSERT INTO public.barry_evidence_concepts (
  source_type, source_record_id, concept_id, annotation_role, confidence,
  method, review_status, semantic_version_id, evidence_unit_id, model_scope,
  backfill_run_id, provenance
)
SELECT
  'barry_v2_content_block',
  'ad22b667-881d-1629-e6c7-c20eab4a75ad',
  concept.id,
  'operation',
  '0.850',
  'deterministic',
  'approved',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '75b30bb5-36f1-54ea-8cbb-eee694f15f00',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"barry_v2_manual:f374ac43-7586-ef55-8672-0923339390bb","matched_name":"inspect","document_role":"maintenance_manual"}'::jsonb
FROM public.barry_semantic_concepts concept
WHERE concept.concept_key = 'operation.inspect'
ON CONFLICT (source_type, source_record_id, concept_id, annotation_role, semantic_version_id)
DO UPDATE SET
  confidence = EXCLUDED.confidence,
  review_status = EXCLUDED.review_status,
  evidence_unit_id = EXCLUDED.evidence_unit_id,
  model_scope = EXCLUDED.model_scope,
  provenance = EXCLUDED.provenance;
INSERT INTO public.barry_evidence_concepts (
  source_type, source_record_id, concept_id, annotation_role, confidence,
  method, review_status, semantic_version_id, evidence_unit_id, model_scope,
  backfill_run_id, provenance
)
SELECT
  'barry_v2_content_block',
  'ad22b667-881d-1629-e6c7-c20eab4a75ad',
  concept.id,
  'mentioned_component',
  '0.850',
  'deterministic',
  'approved',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '75b30bb5-36f1-54ea-8cbb-eee694f15f00',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"barry_v2_manual:f374ac43-7586-ef55-8672-0923339390bb","matched_name":"puller","document_role":"maintenance_manual"}'::jsonb
FROM public.barry_semantic_concepts concept
WHERE concept.concept_key = 'tool.puller'
ON CONFLICT (source_type, source_record_id, concept_id, annotation_role, semantic_version_id)
DO UPDATE SET
  confidence = EXCLUDED.confidence,
  review_status = EXCLUDED.review_status,
  evidence_unit_id = EXCLUDED.evidence_unit_id,
  model_scope = EXCLUDED.model_scope,
  provenance = EXCLUDED.provenance;
INSERT INTO public.barry_evidence_concepts (
  source_type, source_record_id, concept_id, annotation_role, confidence,
  method, review_status, semantic_version_id, evidence_unit_id, model_scope,
  backfill_run_id, provenance
)
SELECT
  'barry_v2_content_block',
  'ad22b667-881d-1629-e6c7-c20eab4a75ad',
  concept.id,
  'property',
  '0.700',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '75b30bb5-36f1-54ea-8cbb-eee694f15f00',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":false,"document_key":"barry_v2_manual:f374ac43-7586-ef55-8672-0923339390bb","matched_name":"operating pressure","document_role":"maintenance_manual"}'::jsonb
FROM public.barry_semantic_concepts concept
WHERE concept.concept_key = 'property.operating_pressure'
ON CONFLICT (source_type, source_record_id, concept_id, annotation_role, semantic_version_id)
DO UPDATE SET
  confidence = EXCLUDED.confidence,
  review_status = EXCLUDED.review_status,
  evidence_unit_id = EXCLUDED.evidence_unit_id,
  model_scope = EXCLUDED.model_scope,
  provenance = EXCLUDED.provenance;
INSERT INTO public.barry_evidence_concepts (
  source_type, source_record_id, concept_id, annotation_role, confidence,
  method, review_status, semantic_version_id, evidence_unit_id, model_scope,
  backfill_run_id, provenance
)
SELECT
  'barry_v2_content_block',
  'ad22b667-881d-1629-e6c7-c20eab4a75ad',
  concept.id,
  'property',
  '0.850',
  'deterministic',
  'approved',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '75b30bb5-36f1-54ea-8cbb-eee694f15f00',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"barry_v2_manual:f374ac43-7586-ef55-8672-0923339390bb","matched_name":"torque","document_role":"maintenance_manual"}'::jsonb
FROM public.barry_semantic_concepts concept
WHERE concept.concept_key = 'property.torque'
ON CONFLICT (source_type, source_record_id, concept_id, annotation_role, semantic_version_id)
DO UPDATE SET
  confidence = EXCLUDED.confidence,
  review_status = EXCLUDED.review_status,
  evidence_unit_id = EXCLUDED.evidence_unit_id,
  model_scope = EXCLUDED.model_scope,
  provenance = EXCLUDED.provenance;
INSERT INTO public.barry_evidence_concepts (
  source_type, source_record_id, concept_id, annotation_role, confidence,
  method, review_status, semantic_version_id, evidence_unit_id, model_scope,
  backfill_run_id, provenance
)
SELECT
  'barry_v2_content_block',
  'ad22b667-881d-1629-e6c7-c20eab4a75ad',
  concept.id,
  'operation',
  '0.850',
  'deterministic',
  'approved',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '75b30bb5-36f1-54ea-8cbb-eee694f15f00',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"barry_v2_manual:f374ac43-7586-ef55-8672-0923339390bb","matched_name":"adjust","document_role":"maintenance_manual"}'::jsonb
FROM public.barry_semantic_concepts concept
WHERE concept.concept_key = 'operation.adjust'
ON CONFLICT (source_type, source_record_id, concept_id, annotation_role, semantic_version_id)
DO UPDATE SET
  confidence = EXCLUDED.confidence,
  review_status = EXCLUDED.review_status,
  evidence_unit_id = EXCLUDED.evidence_unit_id,
  model_scope = EXCLUDED.model_scope,
  provenance = EXCLUDED.provenance;
INSERT INTO public.barry_evidence_concepts (
  source_type, source_record_id, concept_id, annotation_role, confidence,
  method, review_status, semantic_version_id, evidence_unit_id, model_scope,
  backfill_run_id, provenance
)
SELECT
  'barry_v2_content_block',
  'af2680be-2062-68b4-3031-20833e44c87a',
  concept.id,
  'mentioned_component',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '9d1a53fe-0b94-502c-8836-0d5dd56b0b8a',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"barry_v2_manual:af332a3b-25a2-3589-3a79-e73507003464","matched_name":"steering","document_role":"workshop_manual"}'::jsonb
FROM public.barry_semantic_concepts concept
WHERE concept.concept_key = 'vehicle_system.steering'
ON CONFLICT (source_type, source_record_id, concept_id, annotation_role, semantic_version_id)
DO UPDATE SET
  confidence = EXCLUDED.confidence,
  review_status = EXCLUDED.review_status,
  evidence_unit_id = EXCLUDED.evidence_unit_id,
  model_scope = EXCLUDED.model_scope,
  provenance = EXCLUDED.provenance;
INSERT INTO public.barry_evidence_concepts (
  source_type, source_record_id, concept_id, annotation_role, confidence,
  method, review_status, semantic_version_id, evidence_unit_id, model_scope,
  backfill_run_id, provenance
)
SELECT
  'barry_v2_content_block',
  'af2680be-2062-68b4-3031-20833e44c87a',
  concept.id,
  'mentioned_component',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '9d1a53fe-0b94-502c-8836-0d5dd56b0b8a',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":false,"document_key":"barry_v2_manual:af332a3b-25a2-3589-3a79-e73507003464","matched_name":"steering gear","document_role":"workshop_manual"}'::jsonb
FROM public.barry_semantic_concepts concept
WHERE concept.concept_key = 'component.steering_gear'
ON CONFLICT (source_type, source_record_id, concept_id, annotation_role, semantic_version_id)
DO UPDATE SET
  confidence = EXCLUDED.confidence,
  review_status = EXCLUDED.review_status,
  evidence_unit_id = EXCLUDED.evidence_unit_id,
  model_scope = EXCLUDED.model_scope,
  provenance = EXCLUDED.provenance;
INSERT INTO public.barry_evidence_concepts (
  source_type, source_record_id, concept_id, annotation_role, confidence,
  method, review_status, semantic_version_id, evidence_unit_id, model_scope,
  backfill_run_id, provenance
)
SELECT
  'barry_v2_content_block',
  'af2680be-2062-68b4-3031-20833e44c87a',
  concept.id,
  'property',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '9d1a53fe-0b94-502c-8836-0d5dd56b0b8a',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":false,"document_key":"barry_v2_manual:af332a3b-25a2-3589-3a79-e73507003464","matched_name":"torque","document_role":"workshop_manual"}'::jsonb
FROM public.barry_semantic_concepts concept
WHERE concept.concept_key = 'property.torque'
ON CONFLICT (source_type, source_record_id, concept_id, annotation_role, semantic_version_id)
DO UPDATE SET
  confidence = EXCLUDED.confidence,
  review_status = EXCLUDED.review_status,
  evidence_unit_id = EXCLUDED.evidence_unit_id,
  model_scope = EXCLUDED.model_scope,
  provenance = EXCLUDED.provenance;
INSERT INTO public.barry_evidence_concepts (
  source_type, source_record_id, concept_id, annotation_role, confidence,
  method, review_status, semantic_version_id, evidence_unit_id, model_scope,
  backfill_run_id, provenance
)
SELECT
  'barry_v2_content_block',
  'af2680be-2062-68b4-3031-20833e44c87a',
  concept.id,
  'operation',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '9d1a53fe-0b94-502c-8836-0d5dd56b0b8a',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":false,"document_key":"barry_v2_manual:af332a3b-25a2-3589-3a79-e73507003464","matched_name":"remove","document_role":"workshop_manual"}'::jsonb
FROM public.barry_semantic_concepts concept
WHERE concept.concept_key = 'operation.remove'
ON CONFLICT (source_type, source_record_id, concept_id, annotation_role, semantic_version_id)
DO UPDATE SET
  confidence = EXCLUDED.confidence,
  review_status = EXCLUDED.review_status,
  evidence_unit_id = EXCLUDED.evidence_unit_id,
  model_scope = EXCLUDED.model_scope,
  provenance = EXCLUDED.provenance;
INSERT INTO public.barry_evidence_concepts (
  source_type, source_record_id, concept_id, annotation_role, confidence,
  method, review_status, semantic_version_id, evidence_unit_id, model_scope,
  backfill_run_id, provenance
)
SELECT
  'barry_v2_content_block',
  'af2680be-2062-68b4-3031-20833e44c87a',
  concept.id,
  'mentioned_component',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '9d1a53fe-0b94-502c-8836-0d5dd56b0b8a',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"barry_v2_manual:af332a3b-25a2-3589-3a79-e73507003464","matched_name":"engine","document_role":"workshop_manual"}'::jsonb
FROM public.barry_semantic_concepts concept
WHERE concept.concept_key = 'vehicle_system.engine'
ON CONFLICT (source_type, source_record_id, concept_id, annotation_role, semantic_version_id)
DO UPDATE SET
  confidence = EXCLUDED.confidence,
  review_status = EXCLUDED.review_status,
  evidence_unit_id = EXCLUDED.evidence_unit_id,
  model_scope = EXCLUDED.model_scope,
  provenance = EXCLUDED.provenance;
INSERT INTO public.barry_evidence_concepts (
  source_type, source_record_id, concept_id, annotation_role, confidence,
  method, review_status, semantic_version_id, evidence_unit_id, model_scope,
  backfill_run_id, provenance
)
SELECT
  'barry_v2_content_block',
  'b17a9120-d53e-dccf-b140-ea0a6d29d868',
  concept.id,
  'primary_subject',
  '0.900',
  'deterministic',
  'approved',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '943e7b71-0488-55d2-8cca-2c756bf83ec3',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"barry_v2_manual:9ba1297a-2aa6-de38-b971-ad38336442ad","matched_name":"sealing ring","document_role":"workshop_manual"}'::jsonb
FROM public.barry_semantic_concepts concept
WHERE concept.concept_key = 'part.sealing_ring'
ON CONFLICT (source_type, source_record_id, concept_id, annotation_role, semantic_version_id)
DO UPDATE SET
  confidence = EXCLUDED.confidence,
  review_status = EXCLUDED.review_status,
  evidence_unit_id = EXCLUDED.evidence_unit_id,
  model_scope = EXCLUDED.model_scope,
  provenance = EXCLUDED.provenance;
INSERT INTO public.barry_evidence_concepts (
  source_type, source_record_id, concept_id, annotation_role, confidence,
  method, review_status, semantic_version_id, evidence_unit_id, model_scope,
  backfill_run_id, provenance
)
SELECT
  'barry_v2_content_block',
  'b3728535-8d15-1e06-3127-54a0fcafbd86',
  concept.id,
  'operation',
  '0.700',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'cdf09730-3820-543f-8c46-fb204a4929d3',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":false,"document_key":"barry_v2_manual:9ba1297a-2aa6-de38-b971-ad38336442ad","matched_name":"inspect","document_role":"workshop_manual"}'::jsonb
FROM public.barry_semantic_concepts concept
WHERE concept.concept_key = 'operation.inspect'
ON CONFLICT (source_type, source_record_id, concept_id, annotation_role, semantic_version_id)
DO UPDATE SET
  confidence = EXCLUDED.confidence,
  review_status = EXCLUDED.review_status,
  evidence_unit_id = EXCLUDED.evidence_unit_id,
  model_scope = EXCLUDED.model_scope,
  provenance = EXCLUDED.provenance;
INSERT INTO public.barry_evidence_concepts (
  source_type, source_record_id, concept_id, annotation_role, confidence,
  method, review_status, semantic_version_id, evidence_unit_id, model_scope,
  backfill_run_id, provenance
)
SELECT
  'barry_v2_content_block',
  'b3728535-8d15-1e06-3127-54a0fcafbd86',
  concept.id,
  'mentioned_component',
  '0.700',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'cdf09730-3820-543f-8c46-fb204a4929d3',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":false,"document_key":"barry_v2_manual:9ba1297a-2aa6-de38-b971-ad38336442ad","matched_name":"steering gear","document_role":"workshop_manual"}'::jsonb
FROM public.barry_semantic_concepts concept
WHERE concept.concept_key = 'component.steering_gear'
ON CONFLICT (source_type, source_record_id, concept_id, annotation_role, semantic_version_id)
DO UPDATE SET
  confidence = EXCLUDED.confidence,
  review_status = EXCLUDED.review_status,
  evidence_unit_id = EXCLUDED.evidence_unit_id,
  model_scope = EXCLUDED.model_scope,
  provenance = EXCLUDED.provenance;
INSERT INTO public.barry_evidence_concepts (
  source_type, source_record_id, concept_id, annotation_role, confidence,
  method, review_status, semantic_version_id, evidence_unit_id, model_scope,
  backfill_run_id, provenance
)
SELECT
  'barry_v2_content_block',
  'b3728535-8d15-1e06-3127-54a0fcafbd86',
  concept.id,
  'property',
  '0.850',
  'deterministic',
  'approved',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'cdf09730-3820-543f-8c46-fb204a4929d3',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"barry_v2_manual:9ba1297a-2aa6-de38-b971-ad38336442ad","matched_name":"torque","document_role":"workshop_manual"}'::jsonb
FROM public.barry_semantic_concepts concept
WHERE concept.concept_key = 'property.torque'
ON CONFLICT (source_type, source_record_id, concept_id, annotation_role, semantic_version_id)
DO UPDATE SET
  confidence = EXCLUDED.confidence,
  review_status = EXCLUDED.review_status,
  evidence_unit_id = EXCLUDED.evidence_unit_id,
  model_scope = EXCLUDED.model_scope,
  provenance = EXCLUDED.provenance;
INSERT INTO public.barry_evidence_concepts (
  source_type, source_record_id, concept_id, annotation_role, confidence,
  method, review_status, semantic_version_id, evidence_unit_id, model_scope,
  backfill_run_id, provenance
)
SELECT
  'barry_v2_content_block',
  'b3728535-8d15-1e06-3127-54a0fcafbd86',
  concept.id,
  'mentioned_component',
  '0.850',
  'deterministic',
  'approved',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'cdf09730-3820-543f-8c46-fb204a4929d3',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"barry_v2_manual:9ba1297a-2aa6-de38-b971-ad38336442ad","matched_name":"steering","document_role":"workshop_manual"}'::jsonb
FROM public.barry_semantic_concepts concept
WHERE concept.concept_key = 'vehicle_system.steering'
ON CONFLICT (source_type, source_record_id, concept_id, annotation_role, semantic_version_id)
DO UPDATE SET
  confidence = EXCLUDED.confidence,
  review_status = EXCLUDED.review_status,
  evidence_unit_id = EXCLUDED.evidence_unit_id,
  model_scope = EXCLUDED.model_scope,
  provenance = EXCLUDED.provenance;
INSERT INTO public.barry_evidence_concepts (
  source_type, source_record_id, concept_id, annotation_role, confidence,
  method, review_status, semantic_version_id, evidence_unit_id, model_scope,
  backfill_run_id, provenance
)
SELECT
  'barry_v2_content_block',
  'b55a3f19-3bcd-ab6c-9ef8-28b8526d51c1',
  concept.id,
  'mentioned_component',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '79522096-83e4-5ae8-8f2b-b99e31e9b662',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":false,"document_key":"barry_v2_manual:5c259d33-46d1-a74a-ef88-a4fabb23376f","matched_name":"transmission","document_role":"workshop_manual"}'::jsonb
FROM public.barry_semantic_concepts concept
WHERE concept.concept_key = 'vehicle_system.transmission'
ON CONFLICT (source_type, source_record_id, concept_id, annotation_role, semantic_version_id)
DO UPDATE SET
  confidence = EXCLUDED.confidence,
  review_status = EXCLUDED.review_status,
  evidence_unit_id = EXCLUDED.evidence_unit_id,
  model_scope = EXCLUDED.model_scope,
  provenance = EXCLUDED.provenance;
INSERT INTO public.barry_evidence_concepts (
  source_type, source_record_id, concept_id, annotation_role, confidence,
  method, review_status, semantic_version_id, evidence_unit_id, model_scope,
  backfill_run_id, provenance
)
SELECT
  'barry_v2_content_block',
  'b55a3f19-3bcd-ab6c-9ef8-28b8526d51c1',
  concept.id,
  'mentioned_component',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '79522096-83e4-5ae8-8f2b-b99e31e9b662',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":false,"document_key":"barry_v2_manual:5c259d33-46d1-a74a-ef88-a4fabb23376f","matched_name":"pitman arm","document_role":"workshop_manual"}'::jsonb
FROM public.barry_semantic_concepts concept
WHERE concept.concept_key = 'component.pitman_arm'
ON CONFLICT (source_type, source_record_id, concept_id, annotation_role, semantic_version_id)
DO UPDATE SET
  confidence = EXCLUDED.confidence,
  review_status = EXCLUDED.review_status,
  evidence_unit_id = EXCLUDED.evidence_unit_id,
  model_scope = EXCLUDED.model_scope,
  provenance = EXCLUDED.provenance;
INSERT INTO public.barry_evidence_concepts (
  source_type, source_record_id, concept_id, annotation_role, confidence,
  method, review_status, semantic_version_id, evidence_unit_id, model_scope,
  backfill_run_id, provenance
)
SELECT
  'barry_v2_content_block',
  'b55a3f19-3bcd-ab6c-9ef8-28b8526d51c1',
  concept.id,
  'mentioned_component',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '79522096-83e4-5ae8-8f2b-b99e31e9b662',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"barry_v2_manual:5c259d33-46d1-a74a-ef88-a4fabb23376f","matched_name":"steering","document_role":"workshop_manual"}'::jsonb
FROM public.barry_semantic_concepts concept
WHERE concept.concept_key = 'vehicle_system.steering'
ON CONFLICT (source_type, source_record_id, concept_id, annotation_role, semantic_version_id)
DO UPDATE SET
  confidence = EXCLUDED.confidence,
  review_status = EXCLUDED.review_status,
  evidence_unit_id = EXCLUDED.evidence_unit_id,
  model_scope = EXCLUDED.model_scope,
  provenance = EXCLUDED.provenance;
INSERT INTO public.barry_evidence_concepts (
  source_type, source_record_id, concept_id, annotation_role, confidence,
  method, review_status, semantic_version_id, evidence_unit_id, model_scope,
  backfill_run_id, provenance
)
SELECT
  'barry_v2_content_block',
  'b74351a0-4995-76d1-bf3c-b059844ade72',
  concept.id,
  'primary_subject',
  '0.850',
  'deterministic',
  'approved',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '06af3e42-2b54-5da7-83ff-2d54a41197be',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"barry_v2_manual:9ba1297a-2aa6-de38-b971-ad38336442ad","matched_name":"portal hub","document_role":"workshop_manual"}'::jsonb
FROM public.barry_semantic_concepts concept
WHERE concept.concept_key = 'component.portal_hub'
ON CONFLICT (source_type, source_record_id, concept_id, annotation_role, semantic_version_id)
DO UPDATE SET
  confidence = EXCLUDED.confidence,
  review_status = EXCLUDED.review_status,
  evidence_unit_id = EXCLUDED.evidence_unit_id,
  model_scope = EXCLUDED.model_scope,
  provenance = EXCLUDED.provenance;
INSERT INTO public.barry_evidence_concepts (
  source_type, source_record_id, concept_id, annotation_role, confidence,
  method, review_status, semantic_version_id, evidence_unit_id, model_scope,
  backfill_run_id, provenance
)
SELECT
  'barry_v2_content_block',
  'b74351a0-4995-76d1-bf3c-b059844ade72',
  concept.id,
  'mentioned_component',
  '0.700',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '06af3e42-2b54-5da7-83ff-2d54a41197be',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":false,"document_key":"barry_v2_manual:9ba1297a-2aa6-de38-b971-ad38336442ad","matched_name":"steering","document_role":"workshop_manual"}'::jsonb
FROM public.barry_semantic_concepts concept
WHERE concept.concept_key = 'vehicle_system.steering'
ON CONFLICT (source_type, source_record_id, concept_id, annotation_role, semantic_version_id)
DO UPDATE SET
  confidence = EXCLUDED.confidence,
  review_status = EXCLUDED.review_status,
  evidence_unit_id = EXCLUDED.evidence_unit_id,
  model_scope = EXCLUDED.model_scope,
  provenance = EXCLUDED.provenance;
INSERT INTO public.barry_evidence_concepts (
  source_type, source_record_id, concept_id, annotation_role, confidence,
  method, review_status, semantic_version_id, evidence_unit_id, model_scope,
  backfill_run_id, provenance
)
SELECT
  'barry_v2_content_block',
  'b8c332ad-cbf8-5045-6590-5df5402ebf89',
  concept.id,
  'mentioned_component',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'caf236bd-3dd0-5aa0-81de-32cf9f38ac04',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"barry_v2_manual:af332a3b-25a2-3589-3a79-e73507003464","matched_name":"engine","document_role":"workshop_manual"}'::jsonb
FROM public.barry_semantic_concepts concept
WHERE concept.concept_key = 'vehicle_system.engine'
ON CONFLICT (source_type, source_record_id, concept_id, annotation_role, semantic_version_id)
DO UPDATE SET
  confidence = EXCLUDED.confidence,
  review_status = EXCLUDED.review_status,
  evidence_unit_id = EXCLUDED.evidence_unit_id,
  model_scope = EXCLUDED.model_scope,
  provenance = EXCLUDED.provenance;
INSERT INTO public.barry_evidence_concepts (
  source_type, source_record_id, concept_id, annotation_role, confidence,
  method, review_status, semantic_version_id, evidence_unit_id, model_scope,
  backfill_run_id, provenance
)
SELECT
  'barry_v2_content_block',
  'b8c332ad-cbf8-5045-6590-5df5402ebf89',
  concept.id,
  'mentioned_component',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'caf236bd-3dd0-5aa0-81de-32cf9f38ac04',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":false,"document_key":"barry_v2_manual:af332a3b-25a2-3589-3a79-e73507003464","matched_name":"steering gear","document_role":"workshop_manual"}'::jsonb
FROM public.barry_semantic_concepts concept
WHERE concept.concept_key = 'component.steering_gear'
ON CONFLICT (source_type, source_record_id, concept_id, annotation_role, semantic_version_id)
DO UPDATE SET
  confidence = EXCLUDED.confidence,
  review_status = EXCLUDED.review_status,
  evidence_unit_id = EXCLUDED.evidence_unit_id,
  model_scope = EXCLUDED.model_scope,
  provenance = EXCLUDED.provenance;
INSERT INTO public.barry_evidence_concepts (
  source_type, source_record_id, concept_id, annotation_role, confidence,
  method, review_status, semantic_version_id, evidence_unit_id, model_scope,
  backfill_run_id, provenance
)
SELECT
  'barry_v2_content_block',
  'b8c332ad-cbf8-5045-6590-5df5402ebf89',
  concept.id,
  'mentioned_component',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'caf236bd-3dd0-5aa0-81de-32cf9f38ac04',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":false,"document_key":"barry_v2_manual:af332a3b-25a2-3589-3a79-e73507003464","matched_name":"pitman arm","document_role":"workshop_manual"}'::jsonb
FROM public.barry_semantic_concepts concept
WHERE concept.concept_key = 'component.pitman_arm'
ON CONFLICT (source_type, source_record_id, concept_id, annotation_role, semantic_version_id)
DO UPDATE SET
  confidence = EXCLUDED.confidence,
  review_status = EXCLUDED.review_status,
  evidence_unit_id = EXCLUDED.evidence_unit_id,
  model_scope = EXCLUDED.model_scope,
  provenance = EXCLUDED.provenance;
INSERT INTO public.barry_evidence_concepts (
  source_type, source_record_id, concept_id, annotation_role, confidence,
  method, review_status, semantic_version_id, evidence_unit_id, model_scope,
  backfill_run_id, provenance
)
SELECT
  'barry_v2_content_block',
  'b8c332ad-cbf8-5045-6590-5df5402ebf89',
  concept.id,
  'operation',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'caf236bd-3dd0-5aa0-81de-32cf9f38ac04',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"barry_v2_manual:af332a3b-25a2-3589-3a79-e73507003464","matched_name":"remove","document_role":"workshop_manual"}'::jsonb
FROM public.barry_semantic_concepts concept
WHERE concept.concept_key = 'operation.remove'
ON CONFLICT (source_type, source_record_id, concept_id, annotation_role, semantic_version_id)
DO UPDATE SET
  confidence = EXCLUDED.confidence,
  review_status = EXCLUDED.review_status,
  evidence_unit_id = EXCLUDED.evidence_unit_id,
  model_scope = EXCLUDED.model_scope,
  provenance = EXCLUDED.provenance;
INSERT INTO public.barry_evidence_concepts (
  source_type, source_record_id, concept_id, annotation_role, confidence,
  method, review_status, semantic_version_id, evidence_unit_id, model_scope,
  backfill_run_id, provenance
)
SELECT
  'barry_v2_content_block',
  'b8c332ad-cbf8-5045-6590-5df5402ebf89',
  concept.id,
  'operation',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'caf236bd-3dd0-5aa0-81de-32cf9f38ac04',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"barry_v2_manual:af332a3b-25a2-3589-3a79-e73507003464","matched_name":"inspect","document_role":"workshop_manual"}'::jsonb
FROM public.barry_semantic_concepts concept
WHERE concept.concept_key = 'operation.inspect'
ON CONFLICT (source_type, source_record_id, concept_id, annotation_role, semantic_version_id)
DO UPDATE SET
  confidence = EXCLUDED.confidence,
  review_status = EXCLUDED.review_status,
  evidence_unit_id = EXCLUDED.evidence_unit_id,
  model_scope = EXCLUDED.model_scope,
  provenance = EXCLUDED.provenance;
INSERT INTO public.barry_evidence_concepts (
  source_type, source_record_id, concept_id, annotation_role, confidence,
  method, review_status, semantic_version_id, evidence_unit_id, model_scope,
  backfill_run_id, provenance
)
SELECT
  'barry_v2_content_block',
  'b8c332ad-cbf8-5045-6590-5df5402ebf89',
  concept.id,
  'mentioned_component',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'caf236bd-3dd0-5aa0-81de-32cf9f38ac04',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":false,"document_key":"barry_v2_manual:af332a3b-25a2-3589-3a79-e73507003464","matched_name":"steering","document_role":"workshop_manual"}'::jsonb
FROM public.barry_semantic_concepts concept
WHERE concept.concept_key = 'vehicle_system.steering'
ON CONFLICT (source_type, source_record_id, concept_id, annotation_role, semantic_version_id)
DO UPDATE SET
  confidence = EXCLUDED.confidence,
  review_status = EXCLUDED.review_status,
  evidence_unit_id = EXCLUDED.evidence_unit_id,
  model_scope = EXCLUDED.model_scope,
  provenance = EXCLUDED.provenance;
INSERT INTO public.barry_evidence_concepts (
  source_type, source_record_id, concept_id, annotation_role, confidence,
  method, review_status, semantic_version_id, evidence_unit_id, model_scope,
  backfill_run_id, provenance
)
SELECT
  'barry_v2_content_block',
  'b9ebb33f-7775-cddf-034a-7a515f2817d6',
  concept.id,
  'operation',
  '0.850',
  'deterministic',
  'approved',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '6bb51b71-f377-5875-83e9-8b4baafd1283',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"barry_v2_manual:af332a3b-25a2-3589-3a79-e73507003464","matched_name":"install","document_role":"workshop_manual"}'::jsonb
FROM public.barry_semantic_concepts concept
WHERE concept.concept_key = 'operation.install'
ON CONFLICT (source_type, source_record_id, concept_id, annotation_role, semantic_version_id)
DO UPDATE SET
  confidence = EXCLUDED.confidence,
  review_status = EXCLUDED.review_status,
  evidence_unit_id = EXCLUDED.evidence_unit_id,
  model_scope = EXCLUDED.model_scope,
  provenance = EXCLUDED.provenance;
INSERT INTO public.barry_evidence_concepts (
  source_type, source_record_id, concept_id, annotation_role, confidence,
  method, review_status, semantic_version_id, evidence_unit_id, model_scope,
  backfill_run_id, provenance
)
SELECT
  'barry_v2_content_block',
  'b9ebb33f-7775-cddf-034a-7a515f2817d6',
  concept.id,
  'primary_subject',
  '0.850',
  'deterministic',
  'approved',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '6bb51b71-f377-5875-83e9-8b4baafd1283',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"barry_v2_manual:af332a3b-25a2-3589-3a79-e73507003464","matched_name":"steering gear","document_role":"workshop_manual"}'::jsonb
FROM public.barry_semantic_concepts concept
WHERE concept.concept_key = 'component.steering_gear'
ON CONFLICT (source_type, source_record_id, concept_id, annotation_role, semantic_version_id)
DO UPDATE SET
  confidence = EXCLUDED.confidence,
  review_status = EXCLUDED.review_status,
  evidence_unit_id = EXCLUDED.evidence_unit_id,
  model_scope = EXCLUDED.model_scope,
  provenance = EXCLUDED.provenance;
INSERT INTO public.barry_evidence_concepts (
  source_type, source_record_id, concept_id, annotation_role, confidence,
  method, review_status, semantic_version_id, evidence_unit_id, model_scope,
  backfill_run_id, provenance
)
SELECT
  'barry_v2_content_block',
  'b9ebb33f-7775-cddf-034a-7a515f2817d6',
  concept.id,
  'mentioned_component',
  '0.850',
  'deterministic',
  'approved',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '6bb51b71-f377-5875-83e9-8b4baafd1283',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"barry_v2_manual:af332a3b-25a2-3589-3a79-e73507003464","matched_name":"steering","document_role":"workshop_manual"}'::jsonb
FROM public.barry_semantic_concepts concept
WHERE concept.concept_key = 'vehicle_system.steering'
ON CONFLICT (source_type, source_record_id, concept_id, annotation_role, semantic_version_id)
DO UPDATE SET
  confidence = EXCLUDED.confidence,
  review_status = EXCLUDED.review_status,
  evidence_unit_id = EXCLUDED.evidence_unit_id,
  model_scope = EXCLUDED.model_scope,
  provenance = EXCLUDED.provenance;
INSERT INTO public.barry_evidence_concepts (
  source_type, source_record_id, concept_id, annotation_role, confidence,
  method, review_status, semantic_version_id, evidence_unit_id, model_scope,
  backfill_run_id, provenance
)
SELECT
  'barry_v2_content_block',
  'bb231106-c2c5-3cbb-af97-e9aefa5a2722',
  concept.id,
  'mentioned_component',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '6f71c9d9-2f6e-5dcb-8833-1e7ba8796675',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":false,"document_key":"barry_v2_manual:5c259d33-46d1-a74a-ef88-a4fabb23376f","matched_name":"steering","document_role":"workshop_manual"}'::jsonb
FROM public.barry_semantic_concepts concept
WHERE concept.concept_key = 'vehicle_system.steering'
ON CONFLICT (source_type, source_record_id, concept_id, annotation_role, semantic_version_id)
DO UPDATE SET
  confidence = EXCLUDED.confidence,
  review_status = EXCLUDED.review_status,
  evidence_unit_id = EXCLUDED.evidence_unit_id,
  model_scope = EXCLUDED.model_scope,
  provenance = EXCLUDED.provenance;
INSERT INTO public.barry_evidence_concepts (
  source_type, source_record_id, concept_id, annotation_role, confidence,
  method, review_status, semantic_version_id, evidence_unit_id, model_scope,
  backfill_run_id, provenance
)
SELECT
  'barry_v2_content_block',
  'bb231106-c2c5-3cbb-af97-e9aefa5a2722',
  concept.id,
  'mentioned_component',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '6f71c9d9-2f6e-5dcb-8833-1e7ba8796675',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":false,"document_key":"barry_v2_manual:5c259d33-46d1-a74a-ef88-a4fabb23376f","matched_name":"steering gear","document_role":"workshop_manual"}'::jsonb
FROM public.barry_semantic_concepts concept
WHERE concept.concept_key = 'component.steering_gear'
ON CONFLICT (source_type, source_record_id, concept_id, annotation_role, semantic_version_id)
DO UPDATE SET
  confidence = EXCLUDED.confidence,
  review_status = EXCLUDED.review_status,
  evidence_unit_id = EXCLUDED.evidence_unit_id,
  model_scope = EXCLUDED.model_scope,
  provenance = EXCLUDED.provenance;
INSERT INTO public.barry_evidence_concepts (
  source_type, source_record_id, concept_id, annotation_role, confidence,
  method, review_status, semantic_version_id, evidence_unit_id, model_scope,
  backfill_run_id, provenance
)
SELECT
  'barry_v2_content_block',
  'bb231106-c2c5-3cbb-af97-e9aefa5a2722',
  concept.id,
  'mentioned_component',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '6f71c9d9-2f6e-5dcb-8833-1e7ba8796675',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":false,"document_key":"barry_v2_manual:5c259d33-46d1-a74a-ef88-a4fabb23376f","matched_name":"pitman arm","document_role":"workshop_manual"}'::jsonb
FROM public.barry_semantic_concepts concept
WHERE concept.concept_key = 'component.pitman_arm'
ON CONFLICT (source_type, source_record_id, concept_id, annotation_role, semantic_version_id)
DO UPDATE SET
  confidence = EXCLUDED.confidence,
  review_status = EXCLUDED.review_status,
  evidence_unit_id = EXCLUDED.evidence_unit_id,
  model_scope = EXCLUDED.model_scope,
  provenance = EXCLUDED.provenance;
INSERT INTO public.barry_evidence_concepts (
  source_type, source_record_id, concept_id, annotation_role, confidence,
  method, review_status, semantic_version_id, evidence_unit_id, model_scope,
  backfill_run_id, provenance
)
SELECT
  'barry_v2_content_block',
  'bb231106-c2c5-3cbb-af97-e9aefa5a2722',
  concept.id,
  'operation',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '6f71c9d9-2f6e-5dcb-8833-1e7ba8796675',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"barry_v2_manual:5c259d33-46d1-a74a-ef88-a4fabb23376f","matched_name":"remove","document_role":"workshop_manual"}'::jsonb
FROM public.barry_semantic_concepts concept
WHERE concept.concept_key = 'operation.remove'
ON CONFLICT (source_type, source_record_id, concept_id, annotation_role, semantic_version_id)
DO UPDATE SET
  confidence = EXCLUDED.confidence,
  review_status = EXCLUDED.review_status,
  evidence_unit_id = EXCLUDED.evidence_unit_id,
  model_scope = EXCLUDED.model_scope,
  provenance = EXCLUDED.provenance;
INSERT INTO public.barry_evidence_concepts (
  source_type, source_record_id, concept_id, annotation_role, confidence,
  method, review_status, semantic_version_id, evidence_unit_id, model_scope,
  backfill_run_id, provenance
)
SELECT
  'barry_v2_content_block',
  'bb231106-c2c5-3cbb-af97-e9aefa5a2722',
  concept.id,
  'operation',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '6f71c9d9-2f6e-5dcb-8833-1e7ba8796675',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"barry_v2_manual:5c259d33-46d1-a74a-ef88-a4fabb23376f","matched_name":"inspect","document_role":"workshop_manual"}'::jsonb
FROM public.barry_semantic_concepts concept
WHERE concept.concept_key = 'operation.inspect'
ON CONFLICT (source_type, source_record_id, concept_id, annotation_role, semantic_version_id)
DO UPDATE SET
  confidence = EXCLUDED.confidence,
  review_status = EXCLUDED.review_status,
  evidence_unit_id = EXCLUDED.evidence_unit_id,
  model_scope = EXCLUDED.model_scope,
  provenance = EXCLUDED.provenance;
INSERT INTO public.barry_evidence_concepts (
  source_type, source_record_id, concept_id, annotation_role, confidence,
  method, review_status, semantic_version_id, evidence_unit_id, model_scope,
  backfill_run_id, provenance
)
SELECT
  'barry_v2_content_block',
  'bb231106-c2c5-3cbb-af97-e9aefa5a2722',
  concept.id,
  'mentioned_component',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '6f71c9d9-2f6e-5dcb-8833-1e7ba8796675',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"barry_v2_manual:5c259d33-46d1-a74a-ef88-a4fabb23376f","matched_name":"engine","document_role":"workshop_manual"}'::jsonb
FROM public.barry_semantic_concepts concept
WHERE concept.concept_key = 'vehicle_system.engine'
ON CONFLICT (source_type, source_record_id, concept_id, annotation_role, semantic_version_id)
DO UPDATE SET
  confidence = EXCLUDED.confidence,
  review_status = EXCLUDED.review_status,
  evidence_unit_id = EXCLUDED.evidence_unit_id,
  model_scope = EXCLUDED.model_scope,
  provenance = EXCLUDED.provenance;
INSERT INTO public.barry_evidence_concepts (
  source_type, source_record_id, concept_id, annotation_role, confidence,
  method, review_status, semantic_version_id, evidence_unit_id, model_scope,
  backfill_run_id, provenance
)
SELECT
  'barry_v2_content_block',
  'bdfc3e81-fbac-57bb-e204-a69dd96c7d79',
  concept.id,
  'primary_subject',
  '0.850',
  'deterministic',
  'approved',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'ef790f5c-5f5a-5065-8b05-540ff3f24c7e',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"barry_v2_manual:af332a3b-25a2-3589-3a79-e73507003464","matched_name":"differential","document_role":"workshop_manual"}'::jsonb
FROM public.barry_semantic_concepts concept
WHERE concept.concept_key = 'component.differential'
ON CONFLICT (source_type, source_record_id, concept_id, annotation_role, semantic_version_id)
DO UPDATE SET
  confidence = EXCLUDED.confidence,
  review_status = EXCLUDED.review_status,
  evidence_unit_id = EXCLUDED.evidence_unit_id,
  model_scope = EXCLUDED.model_scope,
  provenance = EXCLUDED.provenance;
INSERT INTO public.barry_evidence_concepts (
  source_type, source_record_id, concept_id, annotation_role, confidence,
  method, review_status, semantic_version_id, evidence_unit_id, model_scope,
  backfill_run_id, provenance
)
SELECT
  'barry_v2_content_block',
  'bdfc3e81-fbac-57bb-e204-a69dd96c7d79',
  concept.id,
  'operation',
  '0.850',
  'deterministic',
  'approved',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'ef790f5c-5f5a-5065-8b05-540ff3f24c7e',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"barry_v2_manual:af332a3b-25a2-3589-3a79-e73507003464","matched_name":"remove","document_role":"workshop_manual"}'::jsonb
FROM public.barry_semantic_concepts concept
WHERE concept.concept_key = 'operation.remove'
ON CONFLICT (source_type, source_record_id, concept_id, annotation_role, semantic_version_id)
DO UPDATE SET
  confidence = EXCLUDED.confidence,
  review_status = EXCLUDED.review_status,
  evidence_unit_id = EXCLUDED.evidence_unit_id,
  model_scope = EXCLUDED.model_scope,
  provenance = EXCLUDED.provenance;
INSERT INTO public.barry_evidence_concepts (
  source_type, source_record_id, concept_id, annotation_role, confidence,
  method, review_status, semantic_version_id, evidence_unit_id, model_scope,
  backfill_run_id, provenance
)
SELECT
  'barry_v2_content_block',
  'bec1b073-203a-63ec-c847-1db8d2f16e24',
  concept.id,
  'property',
  '0.700',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'b3c3f54b-c314-51aa-86b8-838be61bc088',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":false,"document_key":"barry_v2_manual:7147712a-37e0-b066-2067-672767b2b617","matched_name":"torque","document_role":"workshop_manual"}'::jsonb
FROM public.barry_semantic_concepts concept
WHERE concept.concept_key = 'property.torque'
ON CONFLICT (source_type, source_record_id, concept_id, annotation_role, semantic_version_id)
DO UPDATE SET
  confidence = EXCLUDED.confidence,
  review_status = EXCLUDED.review_status,
  evidence_unit_id = EXCLUDED.evidence_unit_id,
  model_scope = EXCLUDED.model_scope,
  provenance = EXCLUDED.provenance;
INSERT INTO public.barry_evidence_concepts (
  source_type, source_record_id, concept_id, annotation_role, confidence,
  method, review_status, semantic_version_id, evidence_unit_id, model_scope,
  backfill_run_id, provenance
)
SELECT
  'barry_v2_content_block',
  'bec1b073-203a-63ec-c847-1db8d2f16e24',
  concept.id,
  'primary_subject',
  '0.850',
  'deterministic',
  'approved',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'b3c3f54b-c314-51aa-86b8-838be61bc088',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"barry_v2_manual:7147712a-37e0-b066-2067-672767b2b617","matched_name":"steering gear","document_role":"workshop_manual"}'::jsonb
FROM public.barry_semantic_concepts concept
WHERE concept.concept_key = 'component.steering_gear'
ON CONFLICT (source_type, source_record_id, concept_id, annotation_role, semantic_version_id)
DO UPDATE SET
  confidence = EXCLUDED.confidence,
  review_status = EXCLUDED.review_status,
  evidence_unit_id = EXCLUDED.evidence_unit_id,
  model_scope = EXCLUDED.model_scope,
  provenance = EXCLUDED.provenance;
INSERT INTO public.barry_evidence_concepts (
  source_type, source_record_id, concept_id, annotation_role, confidence,
  method, review_status, semantic_version_id, evidence_unit_id, model_scope,
  backfill_run_id, provenance
)
SELECT
  'barry_v2_content_block',
  'bec1b073-203a-63ec-c847-1db8d2f16e24',
  concept.id,
  'mentioned_component',
  '0.700',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'b3c3f54b-c314-51aa-86b8-838be61bc088',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":false,"document_key":"barry_v2_manual:7147712a-37e0-b066-2067-672767b2b617","matched_name":"pitman arm","document_role":"workshop_manual"}'::jsonb
FROM public.barry_semantic_concepts concept
WHERE concept.concept_key = 'component.pitman_arm'
ON CONFLICT (source_type, source_record_id, concept_id, annotation_role, semantic_version_id)
DO UPDATE SET
  confidence = EXCLUDED.confidence,
  review_status = EXCLUDED.review_status,
  evidence_unit_id = EXCLUDED.evidence_unit_id,
  model_scope = EXCLUDED.model_scope,
  provenance = EXCLUDED.provenance;
COMMIT;
