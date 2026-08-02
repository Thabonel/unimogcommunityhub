BEGIN;

INSERT INTO public.barry_evidence_concepts (
  source_type, source_record_id, concept_id, annotation_role, confidence,
  method, review_status, semantic_version_id, evidence_unit_id, model_scope,
  backfill_run_id, provenance
)
SELECT
  'rps_part',
  '07e2a359-159d-41e9-ab84-bfba28197dba',
  concept.id,
  'mentioned_component',
  '0.750',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'b1fb2d40-31f8-5ed6-8968-6e7fd328d054',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"rps_catalog:02155","matched_name":"steering gear","document_role":"parts_catalog"}'::jsonb
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
  'rps_part',
  '08bb93b7-3d05-4214-a233-dcf78b0187e1',
  concept.id,
  'mentioned_component',
  '0.750',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '08a25b36-a533-5776-8e60-fc27ecb94322',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"rps_catalog:02155","matched_name":"power steering pump","document_role":"parts_catalog"}'::jsonb
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
  'rps_part',
  '0911fc50-8f33-4369-96d5-68d9d7538c19',
  concept.id,
  'mentioned_component',
  '0.750',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '9a19a4ef-e7da-5ef2-8053-db833361f756',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"rps_catalog:02155","matched_name":"steering gear","document_role":"parts_catalog"}'::jsonb
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
  'rps_part',
  '0cf64c32-9071-42b2-859e-4c7040cf4cb4',
  concept.id,
  'mentioned_component',
  '0.750',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '1dd0b9e8-9587-5816-824a-715e37366b04',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"rps_catalog:02155","matched_name":"steering reservoir","document_role":"parts_catalog"}'::jsonb
FROM public.barry_semantic_concepts concept
WHERE concept.concept_key = 'component.steering_reservoir'
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
  'rps_part',
  '1026aba2-4f5b-43a0-8891-a2038aa5c1b1',
  concept.id,
  'mentioned_component',
  '0.700',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '0a20e3e4-d135-519f-8ad5-f701f1116e2e',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"rps_catalog:02155","matched_name":"steering","document_role":"parts_catalog"}'::jsonb
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
  'rps_part',
  '11fc0c50-fe24-46d1-a8ca-9dbf2ff00f20',
  concept.id,
  'mentioned_component',
  '0.750',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '2a336942-7027-5b79-8f0b-29ad4dcba283',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"rps_catalog:02155","matched_name":"steering gear","document_role":"parts_catalog"}'::jsonb
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
  'rps_part',
  '1520503e-7767-482e-b80b-5e2dff5af991',
  concept.id,
  'mentioned_component',
  '0.750',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '12295a78-5307-5b3b-8f46-b3b38f955626',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"rps_catalog:02155","matched_name":"power steering pump","document_role":"parts_catalog"}'::jsonb
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
  'rps_part',
  '161c6eb2-22b3-4d53-9de6-8cb6c7f3f076',
  concept.id,
  'mentioned_component',
  '0.750',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '8c72635c-9cf5-5360-864d-aead4f22c793',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"rps_catalog:02155","matched_name":"power steering pump","document_role":"parts_catalog"}'::jsonb
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
  'rps_part',
  '16c00afd-355d-4cd1-bb92-cc94e99663f3',
  concept.id,
  'mentioned_component',
  '0.700',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '34badd3a-342a-5f14-8e8b-dc500ca927c4',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"rps_catalog:02155","matched_name":"steering","document_role":"parts_catalog"}'::jsonb
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
  'rps_part',
  '191db005-e7d6-443c-8d67-1ff0e07e1cdd',
  concept.id,
  'mentioned_component',
  '0.750',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'ba2ddd6d-5098-522f-803c-e6639cb3771e',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"rps_catalog:02155","matched_name":"steering gear","document_role":"parts_catalog"}'::jsonb
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
  'rps_part',
  '19416e8e-1799-4f76-b137-f16cfd0ac49c',
  concept.id,
  'mentioned_component',
  '0.750',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '4e1d4372-d07a-575a-896d-cc4bc4a78bed',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"rps_catalog:02155","matched_name":"steering reservoir","document_role":"parts_catalog"}'::jsonb
FROM public.barry_semantic_concepts concept
WHERE concept.concept_key = 'component.steering_reservoir'
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
  'rps_part',
  '1a226838-2fd8-46eb-98c3-73d31d237e50',
  concept.id,
  'mentioned_component',
  '0.750',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '676e6979-f9de-5f7f-805f-90b2359b3720',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"rps_catalog:02155","matched_name":"steering reservoir","document_role":"parts_catalog"}'::jsonb
FROM public.barry_semantic_concepts concept
WHERE concept.concept_key = 'component.steering_reservoir'
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
  'rps_part',
  '1b9ce498-8528-451d-abec-fe65e45afa34',
  concept.id,
  'mentioned_component',
  '0.750',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'e3cf1eba-f168-50b8-874d-08bbf22baba7',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"rps_catalog:02155","matched_name":"power steering pump","document_role":"parts_catalog"}'::jsonb
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
  'rps_part',
  '22d77498-f645-4e5f-8991-ca3375d9eb3a',
  concept.id,
  'mentioned_component',
  '0.750',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '3474a05f-7d9a-5270-89e5-fdf3d88d83da',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"rps_catalog:02155","matched_name":"steering reservoir","document_role":"parts_catalog"}'::jsonb
FROM public.barry_semantic_concepts concept
WHERE concept.concept_key = 'component.steering_reservoir'
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
  'rps_part',
  '2559fa93-c03b-440f-a5dc-4c94f66ffefe',
  concept.id,
  'mentioned_component',
  '0.750',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '2d3944e4-5191-5062-8b2b-97575741cc3a',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"rps_catalog:02155","matched_name":"steering gear","document_role":"parts_catalog"}'::jsonb
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
  'rps_part',
  '27979a51-af12-4ee0-94eb-e833ccad85de',
  concept.id,
  'mentioned_component',
  '0.750',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '89fa64fc-999c-5505-8628-396868c5d794',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"rps_catalog:02155","matched_name":"steering reservoir","document_role":"parts_catalog"}'::jsonb
FROM public.barry_semantic_concepts concept
WHERE concept.concept_key = 'component.steering_reservoir'
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
  'rps_part',
  '28b7d053-85aa-4f4a-acc9-7273e16ee29d',
  concept.id,
  'mentioned_component',
  '0.750',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '8de860c8-7192-5e53-844d-2d2faa018f37',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"rps_catalog:02155","matched_name":"steering reservoir","document_role":"parts_catalog"}'::jsonb
FROM public.barry_semantic_concepts concept
WHERE concept.concept_key = 'component.steering_reservoir'
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
  'rps_part',
  '29335f1d-d664-4c08-b71e-bbad6076f826',
  concept.id,
  'mentioned_component',
  '0.750',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '3d5362b1-2776-503b-89a8-6e9442e1bde1',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"rps_catalog:02155","matched_name":"steering reservoir","document_role":"parts_catalog"}'::jsonb
FROM public.barry_semantic_concepts concept
WHERE concept.concept_key = 'component.steering_reservoir'
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
  'rps_part',
  '299f882f-67b7-4764-b292-5b370f98b27a',
  concept.id,
  'mentioned_component',
  '0.700',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '78a19b80-cdc8-5882-8f87-7879953879c8',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"rps_catalog:02155","matched_name":"steering","document_role":"parts_catalog"}'::jsonb
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
  'rps_part',
  '2a7389f6-9dba-4a4e-93e8-2fa3d383c0d6',
  concept.id,
  'mentioned_component',
  '0.700',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'b1e3c75d-c840-50bf-8f02-c29d5ddefa8b',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"rps_catalog:02155","matched_name":"steering","document_role":"parts_catalog"}'::jsonb
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
  'rps_part',
  '2b1887e5-78a8-4eae-8a15-66fc9de389a0',
  concept.id,
  'mentioned_component',
  '0.750',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '7396603f-3556-54ea-80b4-d74dce8c41cc',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"rps_catalog:02155","matched_name":"steering gear","document_role":"parts_catalog"}'::jsonb
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
  'rps_part',
  '2ce207ba-c1de-4b4b-89fd-7b2b9c40801d',
  concept.id,
  'primary_subject',
  '0.700',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '928e6dc3-7144-52b1-8087-eed1ea5b0180',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"rps_catalog:02155","matched_name":"sealing ring","document_role":"parts_catalog"}'::jsonb
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
  'rps_part',
  '2ce207ba-c1de-4b4b-89fd-7b2b9c40801d',
  concept.id,
  'mentioned_component',
  '0.750',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '928e6dc3-7144-52b1-8087-eed1ea5b0180',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"rps_catalog:02155","matched_name":"steering gear","document_role":"parts_catalog"}'::jsonb
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
  'rps_part',
  '2d35efa8-0bab-49bc-b183-cb1a9d0cf071',
  concept.id,
  'primary_subject',
  '0.700',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '1644220c-72c0-5f6c-8e89-ab155ef810b4',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"rps_catalog:02155","matched_name":"sealing ring","document_role":"parts_catalog"}'::jsonb
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
  'rps_part',
  '2d35efa8-0bab-49bc-b183-cb1a9d0cf071',
  concept.id,
  'mentioned_component',
  '0.750',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '1644220c-72c0-5f6c-8e89-ab155ef810b4',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"rps_catalog:02155","matched_name":"power steering pump","document_role":"parts_catalog"}'::jsonb
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
  'rps_part',
  '2f3c8b14-e3eb-43ec-bd63-f07ea89037e3',
  concept.id,
  'primary_subject',
  '0.700',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '9b261c72-6705-5729-8c2e-30e682c895a9',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"rps_catalog:02155","matched_name":"sealing ring","document_role":"parts_catalog"}'::jsonb
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
  'rps_part',
  '2f3c8b14-e3eb-43ec-bd63-f07ea89037e3',
  concept.id,
  'mentioned_component',
  '0.750',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '9b261c72-6705-5729-8c2e-30e682c895a9',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"rps_catalog:02155","matched_name":"steering gear","document_role":"parts_catalog"}'::jsonb
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
  'rps_part',
  '3027c78b-77de-4b94-ab3e-4d0570365d6b',
  concept.id,
  'mentioned_component',
  '0.700',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '46e268b4-bc25-510b-8cfa-25c95e41902e',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"rps_catalog:02155","matched_name":"steering","document_role":"parts_catalog"}'::jsonb
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
  'rps_part',
  '31ee1302-d044-4f49-b14c-00bef9dcd1d9',
  concept.id,
  'mentioned_component',
  '0.700',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '8ef64d81-0c98-5697-8b93-838f10513015',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"rps_catalog:02155","matched_name":"steering","document_role":"parts_catalog"}'::jsonb
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
  'rps_part',
  '32b10570-4de7-4d48-a67b-7fd23b33ac42',
  concept.id,
  'mentioned_component',
  '0.700',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'd06a0d7a-bb98-5981-825a-8ab812cb4490',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"rps_catalog:02155","matched_name":"steering","document_role":"parts_catalog"}'::jsonb
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
  'rps_part',
  '34559eab-e6de-4328-aa69-e620c9df22c0',
  concept.id,
  'mentioned_component',
  '0.700',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '0327d873-2fd1-50a0-8568-b08296bd705d',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"rps_catalog:02155","matched_name":"steering","document_role":"parts_catalog"}'::jsonb
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
  'rps_part',
  '3637aaac-80a0-4e60-aab3-80b5bf83be6b',
  concept.id,
  'mentioned_component',
  '0.700',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '0f166ac0-6dca-504e-8ad2-40af5075323a',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"rps_catalog:02155","matched_name":"steering","document_role":"parts_catalog"}'::jsonb
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
  'rps_part',
  '3768d75b-c1d7-4c09-bd2d-1317afb7530e',
  concept.id,
  'primary_subject',
  '0.700',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'c3a772bf-fe0f-5c8b-811b-56fcd62cfaa5',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"rps_catalog:02155","matched_name":"sealing ring","document_role":"parts_catalog"}'::jsonb
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
  'rps_part',
  '3768d75b-c1d7-4c09-bd2d-1317afb7530e',
  concept.id,
  'mentioned_component',
  '0.750',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'c3a772bf-fe0f-5c8b-811b-56fcd62cfaa5',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"rps_catalog:02155","matched_name":"steering gear","document_role":"parts_catalog"}'::jsonb
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
  'rps_part',
  '3889c58a-496f-4cb7-b1dc-6448efdcc877',
  concept.id,
  'mentioned_component',
  '0.700',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'e66aacdd-13af-5bf2-8a02-473ffcc54863',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"rps_catalog:02155","matched_name":"steering","document_role":"parts_catalog"}'::jsonb
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
  'rps_part',
  '3a8b3b0c-92b5-4b82-9789-492da19c6e2b',
  concept.id,
  'mentioned_component',
  '0.700',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '7c63af4c-5591-5310-8e0f-0ab883d823b7',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"rps_catalog:02155","matched_name":"steering","document_role":"parts_catalog"}'::jsonb
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
  'rps_part',
  '3a9ed4d4-33cd-4fcc-9a5b-5719ead844f8',
  concept.id,
  'mentioned_component',
  '0.750',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '2293fd86-86e8-56ef-8cec-810fa816601f',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"rps_catalog:02155","matched_name":"steering gear","document_role":"parts_catalog"}'::jsonb
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
  'rps_part',
  '3b129d25-a769-48fe-a28d-fc044a74382d',
  concept.id,
  'mentioned_component',
  '0.750',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '0134ef08-db3f-5378-86b2-489675b37e4a',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"rps_catalog:02155","matched_name":"steering gear","document_role":"parts_catalog"}'::jsonb
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
  'rps_part',
  '3bff4bfb-11ce-4e12-9c79-1ec3f0cf0c67',
  concept.id,
  'mentioned_component',
  '0.750',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'b4aba7c9-5531-53cc-88c0-2a4a8a2712b4',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"rps_catalog:02155","matched_name":"steering reservoir","document_role":"parts_catalog"}'::jsonb
FROM public.barry_semantic_concepts concept
WHERE concept.concept_key = 'component.steering_reservoir'
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
  'rps_part',
  '3c9a5d5a-36ba-4ccf-b2d7-15562373dda3',
  concept.id,
  'mentioned_component',
  '0.750',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '0d0eed69-4401-5f08-8189-0bd9e5dd7607',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"rps_catalog:02155","matched_name":"steering gear","document_role":"parts_catalog"}'::jsonb
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
  'rps_part',
  '3d3f29ae-feb3-4a13-9503-b156c44be3f8',
  concept.id,
  'mentioned_component',
  '0.750',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'c636cf05-fec9-543c-8d40-07893ce60cb3',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"rps_catalog:02155","matched_name":"steering gear","document_role":"parts_catalog"}'::jsonb
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
  'rps_part',
  '3ffb2dd1-5205-4a21-8cdd-0114b05477e9',
  concept.id,
  'mentioned_component',
  '0.750',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '14739c30-2e56-591e-8fd1-c9d03e1c8dbf',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"rps_catalog:02155","matched_name":"power steering pump","document_role":"parts_catalog"}'::jsonb
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
  'rps_part',
  '41d3e322-9316-49e2-a7d1-afcfc0ee1ecc',
  concept.id,
  'mentioned_component',
  '0.700',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '23425994-7ac8-593f-89f7-0cabdccf911d',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"rps_catalog:02155","matched_name":"steering","document_role":"parts_catalog"}'::jsonb
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
  'rps_part',
  '42eddf93-0b56-404c-99ac-6869341e8ec9',
  concept.id,
  'mentioned_component',
  '0.750',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '14916bb8-e9ae-55fb-83c7-f8037cfd319f',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"rps_catalog:02155","matched_name":"steering gear","document_role":"parts_catalog"}'::jsonb
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
  'rps_part',
  '433c8c10-553a-487c-bc1f-48de37c7b0ab',
  concept.id,
  'mentioned_component',
  '0.750',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'f0b1fab0-969b-565d-811f-4dd75f87dd72',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"rps_catalog:02155","matched_name":"steering reservoir","document_role":"parts_catalog"}'::jsonb
FROM public.barry_semantic_concepts concept
WHERE concept.concept_key = 'component.steering_reservoir'
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
  'rps_part',
  '4364604e-38a0-4340-a918-0fc977cb7cdf',
  concept.id,
  'mentioned_component',
  '0.750',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'd93b5da1-9712-55b5-81be-e3a1f1d47ac4',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"rps_catalog:02155","matched_name":"power steering pump","document_role":"parts_catalog"}'::jsonb
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
  'rps_part',
  '44e494d3-7ae4-4d58-965d-048a9f612350',
  concept.id,
  'mentioned_component',
  '0.750',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'eea5d8cf-a4ec-53c9-850a-c740bda74a3f',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"rps_catalog:02155","matched_name":"steering reservoir","document_role":"parts_catalog"}'::jsonb
FROM public.barry_semantic_concepts concept
WHERE concept.concept_key = 'component.steering_reservoir'
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
  'rps_part',
  '46c6a779-0fb9-4565-98cb-c348281421b2',
  concept.id,
  'mentioned_component',
  '0.750',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'a2399e18-fad4-57f5-8322-c9362f1f67b1',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"rps_catalog:02155","matched_name":"power steering pump","document_role":"parts_catalog"}'::jsonb
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
  'rps_part',
  '47423140-3fd5-4c8c-982e-cd4e494264fe',
  concept.id,
  'mentioned_component',
  '0.750',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'fe33bf72-5f40-5189-8040-3f41a5c0f25a',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"rps_catalog:02155","matched_name":"steering gear","document_role":"parts_catalog"}'::jsonb
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
  'rps_part',
  '489601d4-2f2d-48f2-a59a-61499b0f685b',
  concept.id,
  'mentioned_component',
  '0.700',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '7c0a7921-55ea-58c0-89ef-f576e966eb72',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"rps_catalog:02155","matched_name":"steering","document_role":"parts_catalog"}'::jsonb
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
  'rps_part',
  '48da7e28-869e-4be1-9cca-20c1ca394d2f',
  concept.id,
  'mentioned_component',
  '0.750',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '0c879209-3672-5b50-8b8a-1104ca70f011',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"rps_catalog:02155","matched_name":"steering reservoir","document_role":"parts_catalog"}'::jsonb
FROM public.barry_semantic_concepts concept
WHERE concept.concept_key = 'component.steering_reservoir'
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
  'rps_part',
  '494928ac-7f04-4dbf-8056-3e06220098fc',
  concept.id,
  'mentioned_component',
  '0.700',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'f7bc0b68-0fd3-5335-855a-75416b01feb8',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"rps_catalog:02155","matched_name":"steering","document_role":"parts_catalog"}'::jsonb
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
  'rps_part',
  '4993726a-6140-4ba8-a30a-6e6330b980da',
  concept.id,
  'mentioned_component',
  '0.750',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '3efdfcd9-8801-50d2-8540-404022e8b0a5',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"rps_catalog:02155","matched_name":"steering reservoir","document_role":"parts_catalog"}'::jsonb
FROM public.barry_semantic_concepts concept
WHERE concept.concept_key = 'component.steering_reservoir'
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
  'rps_part',
  '4a847a85-5687-4d9d-bfe3-1f36bd25c9dd',
  concept.id,
  'mentioned_component',
  '0.750',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '9a94a356-acf2-5265-87ed-107b65b3bad7',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"rps_catalog:02155","matched_name":"power steering pump","document_role":"parts_catalog"}'::jsonb
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
  'rps_part',
  '4bbb74aa-6e33-42ff-90ab-8803b9b265c3',
  concept.id,
  'primary_subject',
  '0.700',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'fd86adf0-31f2-504f-8c03-eed7f7a53500',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"rps_catalog:02155","matched_name":"sealing ring","document_role":"parts_catalog"}'::jsonb
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
  'rps_part',
  '4bbb74aa-6e33-42ff-90ab-8803b9b265c3',
  concept.id,
  'mentioned_component',
  '0.750',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'fd86adf0-31f2-504f-8c03-eed7f7a53500',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"rps_catalog:02155","matched_name":"steering gear","document_role":"parts_catalog"}'::jsonb
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
  'rps_part',
  '4d5c7cf1-b524-4bf4-9a1c-7394a9f4145c',
  concept.id,
  'mentioned_component',
  '0.700',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '8abd2410-d6d4-5423-8990-7e3e582e7780',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"rps_catalog:02155","matched_name":"steering","document_role":"parts_catalog"}'::jsonb
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
  'rps_part',
  '50aaf62a-f7d8-42dc-8fd5-34f9bee57f67',
  concept.id,
  'mentioned_component',
  '0.750',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '9045ca57-d1a0-560a-8b18-f09ad5d48882',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"rps_catalog:02155","matched_name":"steering gear","document_role":"parts_catalog"}'::jsonb
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
  'rps_part',
  '5167d65f-05dc-4aa9-b729-a10bb21c6bf1',
  concept.id,
  'mentioned_component',
  '0.750',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '20f3d061-5a02-5c67-8270-b19754cc8f6e',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"rps_catalog:02155","matched_name":"steering gear","document_role":"parts_catalog"}'::jsonb
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
  'rps_part',
  '51d317b1-4ab8-4574-8cca-05b2b6a750b6',
  concept.id,
  'mentioned_component',
  '0.700',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '5f445329-5864-578b-8512-bb815bb9fd1c',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"rps_catalog:02155","matched_name":"steering","document_role":"parts_catalog"}'::jsonb
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
  'rps_part',
  '52000300-2aef-40ac-ac19-daaebc8c55d3',
  concept.id,
  'mentioned_component',
  '0.750',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'd3b7cbbf-2b72-5a50-8181-fbbe93d6de9a',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"rps_catalog:02155","matched_name":"power steering pump","document_role":"parts_catalog"}'::jsonb
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
  'rps_part',
  '521e40db-df53-4fb3-9752-3bb8a1acea29',
  concept.id,
  'mentioned_component',
  '0.750',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '01bad3c3-1a92-530e-8688-825d1587f4f6',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"rps_catalog:02155","matched_name":"power steering pump","document_role":"parts_catalog"}'::jsonb
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
  'rps_part',
  '52aa5ca3-1e41-4f6a-b9cf-917414d697fd',
  concept.id,
  'mentioned_component',
  '0.700',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '06e7d969-842e-54cb-8583-eefa96a68cf0',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"rps_catalog:02155","matched_name":"steering","document_role":"parts_catalog"}'::jsonb
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
  'rps_part',
  '53d3b9bd-ebc5-4df0-84c1-148781fef6a8',
  concept.id,
  'mentioned_component',
  '0.750',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'bdf7541c-f03e-5a6e-85c0-e8478109105d',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"rps_catalog:02155","matched_name":"steering reservoir","document_role":"parts_catalog"}'::jsonb
FROM public.barry_semantic_concepts concept
WHERE concept.concept_key = 'component.steering_reservoir'
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
  'rps_part',
  '53e99ba9-1db5-464c-8fbd-3d0e613ed378',
  concept.id,
  'mentioned_component',
  '0.750',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'c8cc8113-f417-5a87-879a-646c26f4db02',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"rps_catalog:02155","matched_name":"steering gear","document_role":"parts_catalog"}'::jsonb
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
  'rps_part',
  '5799fadd-4bbc-4397-a589-d93905ce9952',
  concept.id,
  'mentioned_component',
  '0.750',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'e3c01c15-85ef-51a0-89e9-06ed856b547a',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"rps_catalog:02155","matched_name":"power steering pump","document_role":"parts_catalog"}'::jsonb
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
  'rps_part',
  '57bdb68d-a9fc-452c-9619-614a676c8b08',
  concept.id,
  'mentioned_component',
  '0.750',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'b9775473-5665-5373-8c58-fb08fa3f6d29',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"rps_catalog:02155","matched_name":"power steering pump","document_role":"parts_catalog"}'::jsonb
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
  'rps_part',
  '58980a05-b90b-46f8-9d71-ebb337b11532',
  concept.id,
  'mentioned_component',
  '0.700',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'ea0da941-6398-51b8-8cc6-9192a2b1d330',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"rps_catalog:02155","matched_name":"steering","document_role":"parts_catalog"}'::jsonb
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
  'rps_part',
  '592b8185-7707-46ef-b66f-57cefc9bb057',
  concept.id,
  'mentioned_component',
  '0.700',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'f47d0bcb-9da4-54e6-8c48-6c9794eddda7',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"rps_catalog:02155","matched_name":"steering","document_role":"parts_catalog"}'::jsonb
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
  'rps_part',
  '5b02846c-d29f-4e1a-bba9-5e94aacb2423',
  concept.id,
  'mentioned_component',
  '0.750',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'e18dfe5c-6e4d-5fd2-8994-7379cd11c6a9',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"rps_catalog:02155","matched_name":"steering gear","document_role":"parts_catalog"}'::jsonb
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
  'rps_part',
  '5b22f046-b96d-4124-8b89-f4948d913683',
  concept.id,
  'mentioned_component',
  '0.750',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '14f9dd9e-35b1-5f5a-8611-cd525aed2c69',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"rps_catalog:02155","matched_name":"steering reservoir","document_role":"parts_catalog"}'::jsonb
FROM public.barry_semantic_concepts concept
WHERE concept.concept_key = 'component.steering_reservoir'
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
  'rps_part',
  '5b277540-0e3c-4ccc-a6a7-ddacf3fe8d78',
  concept.id,
  'mentioned_component',
  '0.700',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '6f58d595-461a-54d6-8962-b113051cd878',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"rps_catalog:02155","matched_name":"steering","document_role":"parts_catalog"}'::jsonb
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
  'rps_part',
  '5c19b4be-884e-48a3-9f19-c07c627b66d1',
  concept.id,
  'mentioned_component',
  '0.700',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '617c4afd-4ee5-54fc-85c1-d8c070e564d2',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"rps_catalog:02155","matched_name":"steering","document_role":"parts_catalog"}'::jsonb
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
  'rps_part',
  '5e76c201-8ad9-4fca-8031-26a25fc43e81',
  concept.id,
  'mentioned_component',
  '0.700',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'fd3c5942-ba39-55d0-8727-12b1f8ef64cd',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"rps_catalog:02155","matched_name":"steering","document_role":"parts_catalog"}'::jsonb
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
  'rps_part',
  '5ef1a1db-baa2-4a04-9fc6-a3fde4181338',
  concept.id,
  'mentioned_component',
  '0.750',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '1f08f049-e5c8-5c6f-83ff-ef444dafdfb0',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"rps_catalog:02155","matched_name":"steering gear","document_role":"parts_catalog"}'::jsonb
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
  'rps_part',
  '5f00a3ea-f175-442f-a7dc-93b3fde15fa1',
  concept.id,
  'mentioned_component',
  '0.700',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '80d02125-74cd-53a7-8e3f-cf1c2203d04f',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"rps_catalog:02155","matched_name":"steering","document_role":"parts_catalog"}'::jsonb
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
  'rps_part',
  '601bf923-a25d-4870-90c2-25237553611e',
  concept.id,
  'mentioned_component',
  '0.750',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '1d3c1cef-19e9-5dc3-8c2f-062d9d3a8270',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"rps_catalog:02155","matched_name":"power steering pump","document_role":"parts_catalog"}'::jsonb
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
  'rps_part',
  '60491aac-e50b-4894-b378-01dd25819799',
  concept.id,
  'mentioned_component',
  '0.750',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'ae790cec-5787-5f8e-8c38-a1ecbdff0d9d',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"rps_catalog:02155","matched_name":"steering reservoir","document_role":"parts_catalog"}'::jsonb
FROM public.barry_semantic_concepts concept
WHERE concept.concept_key = 'component.steering_reservoir'
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
  'rps_part',
  '60b300f7-cf54-4cf7-bdcf-ba16edad6d93',
  concept.id,
  'mentioned_component',
  '0.750',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '116b4176-4b0c-5e41-84be-fd047514dad7',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"rps_catalog:02155","matched_name":"power steering pump","document_role":"parts_catalog"}'::jsonb
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
  'rps_part',
  '61b51900-274f-4754-8246-800a2376c8dc',
  concept.id,
  'mentioned_component',
  '0.750',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '5dd25fa0-f902-5f1c-8041-86ff26e67ee9',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"rps_catalog:02155","matched_name":"steering reservoir","document_role":"parts_catalog"}'::jsonb
FROM public.barry_semantic_concepts concept
WHERE concept.concept_key = 'component.steering_reservoir'
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
  'rps_part',
  '6248a74d-3f3b-40f7-9d04-eb7d09c9133f',
  concept.id,
  'mentioned_component',
  '0.750',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '699e7c5c-7286-5c5f-8cd4-8f28c86cbac6',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"rps_catalog:02155","matched_name":"power steering pump","document_role":"parts_catalog"}'::jsonb
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
  'rps_part',
  '626425fc-1fcb-4b95-bdf2-880664c52f6b',
  concept.id,
  'mentioned_component',
  '0.750',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'b03eaa5f-b981-52b1-8a6a-f42c47ed8512',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"rps_catalog:02155","matched_name":"steering gear","document_role":"parts_catalog"}'::jsonb
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
  'rps_part',
  '6287f191-356d-4772-921a-bfacdb0540e1',
  concept.id,
  'mentioned_component',
  '0.700',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '15d8ddae-a2ff-5688-88f5-5a131b31a418',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"rps_catalog:02155","matched_name":"steering","document_role":"parts_catalog"}'::jsonb
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
  'rps_part',
  '62d0f87e-51d0-4e36-b26b-8e6519872119',
  concept.id,
  'mentioned_component',
  '0.700',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '273a8f2d-7275-5d0b-8e83-0c127445dd4d',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"rps_catalog:02155","matched_name":"steering","document_role":"parts_catalog"}'::jsonb
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
  'rps_part',
  '647bb9f2-2c2f-4986-9fd7-8d206f40f6cf',
  concept.id,
  'mentioned_component',
  '0.750',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '8ba7c0d9-b6bd-53fb-8e5a-8b3657f568ef',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"rps_catalog:02155","matched_name":"steering reservoir","document_role":"parts_catalog"}'::jsonb
FROM public.barry_semantic_concepts concept
WHERE concept.concept_key = 'component.steering_reservoir'
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
  'rps_part',
  '666df385-e3ac-459b-a469-10a28511f164',
  concept.id,
  'mentioned_component',
  '0.750',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '889d8fd2-c18f-53e9-8658-dad978b5f545',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"rps_catalog:02155","matched_name":"power steering pump","document_role":"parts_catalog"}'::jsonb
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
  'rps_part',
  '6dc69471-a50e-4715-b7e5-c3f58f801387',
  concept.id,
  'mentioned_component',
  '0.750',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '908cbc9c-49d9-5ea4-8b49-8a16651e72fc',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"rps_catalog:02155","matched_name":"steering reservoir","document_role":"parts_catalog"}'::jsonb
FROM public.barry_semantic_concepts concept
WHERE concept.concept_key = 'component.steering_reservoir'
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
  'rps_part',
  '6e07d22c-136d-47d8-896e-399404aa2958',
  concept.id,
  'mentioned_component',
  '0.750',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '76d5e5ae-3161-5ef7-8ac2-d1a9ee641b42',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"rps_catalog:02155","matched_name":"power steering pump","document_role":"parts_catalog"}'::jsonb
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
  'rps_part',
  '6e63accb-c42a-44d0-b7ea-d08200f37bb6',
  concept.id,
  'mentioned_component',
  '0.750',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '15ae4081-85d5-5c91-8a59-ba0611633dc4',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"rps_catalog:02155","matched_name":"power steering pump","document_role":"parts_catalog"}'::jsonb
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
  'rps_part',
  '6f959415-d29b-4da7-a01a-519378b53610',
  concept.id,
  'mentioned_component',
  '0.700',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '77c4029d-4cae-5686-8804-9025e056cd58',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"rps_catalog:02155","matched_name":"steering","document_role":"parts_catalog"}'::jsonb
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
  'rps_part',
  '7082a9c0-4f19-42ee-93d7-db186fece136',
  concept.id,
  'mentioned_component',
  '0.750',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '62452c9e-9efb-5e11-8ee2-4d2a2a93a77c',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"rps_catalog:02155","matched_name":"steering gear","document_role":"parts_catalog"}'::jsonb
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
  'rps_part',
  '72861940-e710-4d91-84d0-52cf9b07afbd',
  concept.id,
  'mentioned_component',
  '0.700',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'c3dbb3ec-17a6-5940-87fc-05cd0faad860',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"rps_catalog:02155","matched_name":"steering","document_role":"parts_catalog"}'::jsonb
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
  'rps_part',
  '7563034c-a299-4e25-9398-dbde023ddae5',
  concept.id,
  'mentioned_component',
  '0.750',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '6e8ac71d-7b68-5cfb-8cb7-b8365e6317e6',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"rps_catalog:02155","matched_name":"steering gear","document_role":"parts_catalog"}'::jsonb
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
  'rps_part',
  '766c0bc2-777a-43ae-8578-c1a86cdef5ed',
  concept.id,
  'mentioned_component',
  '0.750',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'e3014c20-b480-5f33-88c5-4ada2eabc0ea',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"rps_catalog:02155","matched_name":"steering reservoir","document_role":"parts_catalog"}'::jsonb
FROM public.barry_semantic_concepts concept
WHERE concept.concept_key = 'component.steering_reservoir'
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
  'rps_part',
  '77ee8029-e215-46e6-beb2-859cd9dea881',
  concept.id,
  'mentioned_component',
  '0.750',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '9f8fd9c6-4fb9-5752-891e-2c290c89614a',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"rps_catalog:02155","matched_name":"steering reservoir","document_role":"parts_catalog"}'::jsonb
FROM public.barry_semantic_concepts concept
WHERE concept.concept_key = 'component.steering_reservoir'
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
  'rps_part',
  '7821d9f5-5630-4e2a-92fb-158732c96180',
  concept.id,
  'mentioned_component',
  '0.750',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '30ddce64-23fe-5e7a-8e64-362afb2e201f',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"rps_catalog:02155","matched_name":"steering reservoir","document_role":"parts_catalog"}'::jsonb
FROM public.barry_semantic_concepts concept
WHERE concept.concept_key = 'component.steering_reservoir'
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
  'rps_part',
  '79291067-89c1-439b-a580-90d9339d45b0',
  concept.id,
  'mentioned_component',
  '0.750',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '1dd1525f-7711-5daa-893e-44f2a2197672',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"rps_catalog:02155","matched_name":"power steering pump","document_role":"parts_catalog"}'::jsonb
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
  'rps_part',
  '81fa1b51-77e1-4595-b4ea-13432599631d',
  concept.id,
  'primary_subject',
  '0.700',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '76c188a3-e825-572e-8ce6-0d14c247e4bf',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"rps_catalog:02155","matched_name":"sealing ring","document_role":"parts_catalog"}'::jsonb
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
  'rps_part',
  '81fa1b51-77e1-4595-b4ea-13432599631d',
  concept.id,
  'mentioned_component',
  '0.750',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '76c188a3-e825-572e-8ce6-0d14c247e4bf',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"rps_catalog:02155","matched_name":"power steering pump","document_role":"parts_catalog"}'::jsonb
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
  'rps_part',
  '82fb47b7-205e-4b43-a153-187a89abadf7',
  concept.id,
  'mentioned_component',
  '0.750',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'bd73c005-9963-5928-8e40-a03df6e35133',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"rps_catalog:02155","matched_name":"steering reservoir","document_role":"parts_catalog"}'::jsonb
FROM public.barry_semantic_concepts concept
WHERE concept.concept_key = 'component.steering_reservoir'
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
  'rps_part',
  '84b360a9-c7ac-4e57-91a5-e9c71c57792e',
  concept.id,
  'mentioned_component',
  '0.750',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'fabf387e-fb8d-5141-84ef-6d576cb78f55',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"rps_catalog:02155","matched_name":"steering gear","document_role":"parts_catalog"}'::jsonb
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
  'rps_part',
  '84e64034-565b-41dd-b735-12ef07e5b45b',
  concept.id,
  'mentioned_component',
  '0.700',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '29fadce4-cfb5-5d67-87f5-9c88c4d32acd',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"rps_catalog:02155","matched_name":"steering","document_role":"parts_catalog"}'::jsonb
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
  'rps_part',
  '86ebf58e-2885-43a8-aaae-9f43e5abff4f',
  concept.id,
  'mentioned_component',
  '0.750',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'defca7d9-eac0-53fb-8e8a-a524957d853a',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"rps_catalog:02155","matched_name":"steering gear","document_role":"parts_catalog"}'::jsonb
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
  'rps_part',
  '88f5dac1-7b67-4b5e-8571-57d459107d17',
  concept.id,
  'mentioned_component',
  '0.750',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'fa4a3dd0-7b25-59a0-849e-4ef1f62de2a1',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"rps_catalog:02155","matched_name":"power steering pump","document_role":"parts_catalog"}'::jsonb
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
  'rps_part',
  '89dda58d-ce2e-445c-a79b-25b6e004eff5',
  concept.id,
  'primary_subject',
  '0.700',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '3eacd621-ddc3-53a5-8ca2-17a1d4ef3ea8',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"rps_catalog:02155","matched_name":"repair kit","document_role":"parts_catalog"}'::jsonb
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
  'rps_part',
  '89dda58d-ce2e-445c-a79b-25b6e004eff5',
  concept.id,
  'mentioned_component',
  '0.750',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '3eacd621-ddc3-53a5-8ca2-17a1d4ef3ea8',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"rps_catalog:02155","matched_name":"power steering pump","document_role":"parts_catalog"}'::jsonb
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
  'rps_part',
  '8a55f9dd-4dff-450d-81e9-093f74005120',
  concept.id,
  'mentioned_component',
  '0.750',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '55c58428-a3e8-565e-8e6c-c220257f7b75',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"rps_catalog:02155","matched_name":"steering reservoir","document_role":"parts_catalog"}'::jsonb
FROM public.barry_semantic_concepts concept
WHERE concept.concept_key = 'component.steering_reservoir'
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
  'rps_part',
  '8b6844ec-3f90-42da-99f9-853ffad96f5e',
  concept.id,
  'mentioned_component',
  '0.750',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '5a499e01-9529-5491-802a-3e33c4fa2156',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"rps_catalog:02155","matched_name":"steering reservoir","document_role":"parts_catalog"}'::jsonb
FROM public.barry_semantic_concepts concept
WHERE concept.concept_key = 'component.steering_reservoir'
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
  'rps_part',
  '8b840563-17c5-48f1-a7f7-95edb51cd5f9',
  concept.id,
  'mentioned_component',
  '0.750',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'df0507b8-0420-5b80-8560-c215d5dccb18',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"rps_catalog:02155","matched_name":"steering reservoir","document_role":"parts_catalog"}'::jsonb
FROM public.barry_semantic_concepts concept
WHERE concept.concept_key = 'component.steering_reservoir'
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
  'rps_part',
  '90c2b1f6-0595-4747-8402-65dcd1b06002',
  concept.id,
  'primary_subject',
  '0.700',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '6c09782a-cb0e-5adc-8608-a9a058a62adf',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"rps_catalog:02155","matched_name":"sealing ring","document_role":"parts_catalog"}'::jsonb
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
  'rps_part',
  '90c2b1f6-0595-4747-8402-65dcd1b06002',
  concept.id,
  'mentioned_component',
  '0.750',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '6c09782a-cb0e-5adc-8608-a9a058a62adf',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"rps_catalog:02155","matched_name":"steering gear","document_role":"parts_catalog"}'::jsonb
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
  'rps_part',
  '920dbfe1-742c-489a-9ccb-790021376ff5',
  concept.id,
  'mentioned_component',
  '0.750',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '0bda3bcc-27cf-5079-8d43-9b14f78ce446',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"rps_catalog:02155","matched_name":"power steering pump","document_role":"parts_catalog"}'::jsonb
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
  'rps_part',
  '93711b8c-d769-4690-a751-81d4a383dc8c',
  concept.id,
  'mentioned_component',
  '0.700',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '6f5a2308-7bc9-5816-89d0-753f9ae73f13',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"rps_catalog:02155","matched_name":"steering","document_role":"parts_catalog"}'::jsonb
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
  'rps_part',
  '940b9d7a-d197-48ce-91e6-ae8a70668b5d',
  concept.id,
  'mentioned_component',
  '0.750',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '915ae417-382d-5747-81b2-575404a3ab9d',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"rps_catalog:02155","matched_name":"steering gear","document_role":"parts_catalog"}'::jsonb
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
  'rps_part',
  '944817a4-0ca2-4015-98c2-a3f6327b3f03',
  concept.id,
  'mentioned_component',
  '0.750',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '06157d22-b8bc-596b-86dc-f2992bdba241',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"rps_catalog:02155","matched_name":"power steering pump","document_role":"parts_catalog"}'::jsonb
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
  'rps_part',
  '95362a24-9a4b-4ada-a48e-6f073424c0df',
  concept.id,
  'primary_subject',
  '0.700',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '16f750e3-270a-58c6-8111-030ab3b79bbd',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"rps_catalog:02155","matched_name":"repair kit","document_role":"parts_catalog"}'::jsonb
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
  'rps_part',
  '95362a24-9a4b-4ada-a48e-6f073424c0df',
  concept.id,
  'mentioned_component',
  '0.750',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '16f750e3-270a-58c6-8111-030ab3b79bbd',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"rps_catalog:02155","matched_name":"power steering pump","document_role":"parts_catalog"}'::jsonb
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
  'rps_part',
  '96130aad-e50f-4942-9c3d-45fa2338c7db',
  concept.id,
  'mentioned_component',
  '0.700',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '74d8e7ee-8c40-5419-8aa0-01db772024d9',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"rps_catalog:02155","matched_name":"steering","document_role":"parts_catalog"}'::jsonb
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
  'rps_part',
  '967fa4ae-d4f8-4245-b25e-d44800e35502',
  concept.id,
  'mentioned_component',
  '0.750',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '76e10893-7703-5663-842e-81373c71b778',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"rps_catalog:02155","matched_name":"steering reservoir","document_role":"parts_catalog"}'::jsonb
FROM public.barry_semantic_concepts concept
WHERE concept.concept_key = 'component.steering_reservoir'
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
  'rps_part',
  '991b3598-376a-498c-99a5-5ef56441264a',
  concept.id,
  'mentioned_component',
  '0.700',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'ae8a18ee-d217-571b-8aee-da670da9b85b',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"rps_catalog:02155","matched_name":"steering","document_role":"parts_catalog"}'::jsonb
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
  'rps_part',
  '997914a3-bbbf-4640-af43-a30fb1d6b7ff',
  concept.id,
  'mentioned_component',
  '0.750',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'd1044a2f-51c1-5373-8bd4-5affcb01a9c1',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"rps_catalog:02155","matched_name":"steering gear","document_role":"parts_catalog"}'::jsonb
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
  'rps_part',
  '99aa7473-fcb6-4c37-874c-7efa1e0d8e0a',
  concept.id,
  'mentioned_component',
  '0.750',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '774bf22a-64a5-5140-85f1-70df927103fb',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"rps_catalog:02155","matched_name":"steering gear","document_role":"parts_catalog"}'::jsonb
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
  'rps_part',
  '9a0ec0d0-bb15-4f62-b143-caf6b9737cc5',
  concept.id,
  'mentioned_component',
  '0.750',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'a334c615-8c83-5eaa-8b9a-970923809403',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"rps_catalog:02155","matched_name":"steering reservoir","document_role":"parts_catalog"}'::jsonb
FROM public.barry_semantic_concepts concept
WHERE concept.concept_key = 'component.steering_reservoir'
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
  'rps_part',
  '9a96d30d-0dc5-400b-9a12-05c42437c561',
  concept.id,
  'mentioned_component',
  '0.750',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '609e0d83-e117-56eb-8f1b-2a6b86fb2e1c',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"rps_catalog:02155","matched_name":"steering reservoir","document_role":"parts_catalog"}'::jsonb
FROM public.barry_semantic_concepts concept
WHERE concept.concept_key = 'component.steering_reservoir'
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
  'rps_part',
  '9afb752c-2f7f-43f8-83ea-ebf3af607096',
  concept.id,
  'mentioned_component',
  '0.750',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '91272aff-ce87-55fa-8d87-4584bcfdb646',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"rps_catalog:02155","matched_name":"steering reservoir","document_role":"parts_catalog"}'::jsonb
FROM public.barry_semantic_concepts concept
WHERE concept.concept_key = 'component.steering_reservoir'
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
  'rps_part',
  '9bb227b6-3026-4ead-be42-268e36185321',
  concept.id,
  'mentioned_component',
  '0.750',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '9b83657e-53be-5ef3-84f1-57b882c227aa',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"rps_catalog:02155","matched_name":"steering gear","document_role":"parts_catalog"}'::jsonb
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
  'rps_part',
  '9c0d396e-08e7-418f-87e2-7fdc64994d07',
  concept.id,
  'mentioned_component',
  '0.750',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'f97b79e7-d7d4-5fc4-8c43-0f08521bf761',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"rps_catalog:02155","matched_name":"steering gear","document_role":"parts_catalog"}'::jsonb
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
  'rps_part',
  '9c5cc3be-8c29-4b56-a439-d8e41e78a62e',
  concept.id,
  'mentioned_component',
  '0.750',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '96d9777f-ca7e-5193-8b7d-2001c3da938a',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"rps_catalog:02155","matched_name":"steering gear","document_role":"parts_catalog"}'::jsonb
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
  'rps_part',
  '9f7e8aec-ca05-4fc4-a225-5ae009b6ba56',
  concept.id,
  'mentioned_component',
  '0.700',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '9ff0d9d8-6445-5efc-8cf6-deb131c219a0',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"rps_catalog:02155","matched_name":"steering","document_role":"parts_catalog"}'::jsonb
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
  'rps_part',
  'a276b062-60a4-4e7f-8160-41d721c698d9',
  concept.id,
  'mentioned_component',
  '0.750',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'fe4a2058-aefb-5288-8ca8-38974ed29af8',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"rps_catalog:02155","matched_name":"steering reservoir","document_role":"parts_catalog"}'::jsonb
FROM public.barry_semantic_concepts concept
WHERE concept.concept_key = 'component.steering_reservoir'
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
  'rps_part',
  'a29b830b-33a8-4e9f-95e9-df9265ec0d5e',
  concept.id,
  'primary_subject',
  '0.700',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'cf48199f-4cca-514a-819c-140b4a24c76a',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"rps_catalog:02155","matched_name":"sealing ring","document_role":"parts_catalog"}'::jsonb
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
  'rps_part',
  'a29b830b-33a8-4e9f-95e9-df9265ec0d5e',
  concept.id,
  'mentioned_component',
  '0.750',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'cf48199f-4cca-514a-819c-140b4a24c76a',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"rps_catalog:02155","matched_name":"steering reservoir","document_role":"parts_catalog"}'::jsonb
FROM public.barry_semantic_concepts concept
WHERE concept.concept_key = 'component.steering_reservoir'
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
  'rps_part',
  'a6413f99-1c63-414d-858c-724baac4c57b',
  concept.id,
  'mentioned_component',
  '0.700',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '1e932548-f65b-5c28-83aa-ce2bbaca3c2d',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"rps_catalog:02155","matched_name":"steering","document_role":"parts_catalog"}'::jsonb
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
  'rps_part',
  'a72b9390-d112-4901-8487-3d7a38e574ee',
  concept.id,
  'primary_subject',
  '0.700',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'aeedf9f6-fac8-5d30-89ac-d75d83283942',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"rps_catalog:02155","matched_name":"sealing ring","document_role":"parts_catalog"}'::jsonb
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
  'rps_part',
  'a72b9390-d112-4901-8487-3d7a38e574ee',
  concept.id,
  'mentioned_component',
  '0.750',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'aeedf9f6-fac8-5d30-89ac-d75d83283942',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"rps_catalog:02155","matched_name":"steering gear","document_role":"parts_catalog"}'::jsonb
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
  'rps_part',
  'a910d6b7-4af9-461a-98f5-1a04fd9b2404',
  concept.id,
  'mentioned_component',
  '0.750',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'e6248bc7-3dac-5d20-87e5-8bab1f08ec56',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"rps_catalog:02155","matched_name":"power steering pump","document_role":"parts_catalog"}'::jsonb
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
  'rps_part',
  'a913bde7-38a8-40b2-8ac7-908e1342d133',
  concept.id,
  'mentioned_component',
  '0.750',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '454fbbef-3497-58e4-873f-6b8a0cd159c9',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"rps_catalog:02155","matched_name":"steering reservoir","document_role":"parts_catalog"}'::jsonb
FROM public.barry_semantic_concepts concept
WHERE concept.concept_key = 'component.steering_reservoir'
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
  'rps_part',
  'a9aa5eb6-4f85-477e-91ea-9b8d250d994e',
  concept.id,
  'mentioned_component',
  '0.750',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'a2ca11e0-531d-5a96-8fd5-f15812a4ea3c',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"rps_catalog:02155","matched_name":"steering gear","document_role":"parts_catalog"}'::jsonb
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
  'rps_part',
  'aa1ce5fa-248a-43b8-8775-577819c2e69e',
  concept.id,
  'mentioned_component',
  '0.750',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '72da9931-58d7-5188-8039-36716d769b1c',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"rps_catalog:02155","matched_name":"steering gear","document_role":"parts_catalog"}'::jsonb
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
  'rps_part',
  'ab88cf6c-dfc2-4fa4-8351-284396fd24dd',
  concept.id,
  'mentioned_component',
  '0.750',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'fe5282a5-58eb-543c-815b-af6e60dd5127',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"rps_catalog:02155","matched_name":"steering reservoir","document_role":"parts_catalog"}'::jsonb
FROM public.barry_semantic_concepts concept
WHERE concept.concept_key = 'component.steering_reservoir'
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
  'rps_part',
  'ac89d181-e4c3-43af-b394-adc038cef4ea',
  concept.id,
  'mentioned_component',
  '0.750',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '79218820-cf52-59a3-8f9a-60e5408ecae2',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"rps_catalog:02155","matched_name":"steering reservoir","document_role":"parts_catalog"}'::jsonb
FROM public.barry_semantic_concepts concept
WHERE concept.concept_key = 'component.steering_reservoir'
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
  'rps_part',
  'ad68972b-f775-493b-a07a-d5d36917cbfd',
  concept.id,
  'mentioned_component',
  '0.750',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '7ab6aec4-4df0-5225-83a6-47d3453a8645',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"rps_catalog:02155","matched_name":"steering gear","document_role":"parts_catalog"}'::jsonb
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
  'rps_part',
  'ae7572bf-1ff1-409b-89a5-1589ccbb9a97',
  concept.id,
  'mentioned_component',
  '0.750',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '76bdab43-4c29-572b-84fb-6e02a7ca14de',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"rps_catalog:02155","matched_name":"steering gear","document_role":"parts_catalog"}'::jsonb
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
  'rps_part',
  'b05a2284-489f-40df-8753-2df68495873c',
  concept.id,
  'mentioned_component',
  '0.700',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '16fc532d-540c-5cae-8ec2-cc0558545d9d',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"rps_catalog:02155","matched_name":"steering","document_role":"parts_catalog"}'::jsonb
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
  'rps_part',
  'b08fbf29-a6fd-4e0b-a127-3f8d3caf79fd',
  concept.id,
  'mentioned_component',
  '0.700',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'bdc5063a-e63a-57ab-8d8d-8c52da823d58',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"rps_catalog:02155","matched_name":"steering","document_role":"parts_catalog"}'::jsonb
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
  'rps_part',
  'b0ee78fa-0001-4106-a2d5-b93602f0e89e',
  concept.id,
  'mentioned_component',
  '0.700',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'c542035f-57cd-5b0c-83c0-7a7ef7bc5759',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"rps_catalog:02155","matched_name":"steering","document_role":"parts_catalog"}'::jsonb
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
  'rps_part',
  'b1c2b6df-d5ad-40cf-b0e1-2a0f20cbea06',
  concept.id,
  'mentioned_component',
  '0.750',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '2beb82a5-5a94-5aa0-83d3-71108636ef19',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"rps_catalog:02155","matched_name":"steering reservoir","document_role":"parts_catalog"}'::jsonb
FROM public.barry_semantic_concepts concept
WHERE concept.concept_key = 'component.steering_reservoir'
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
  'rps_part',
  'b3c8cc0f-21f8-46f8-a452-aa4045e1ed16',
  concept.id,
  'mentioned_component',
  '0.750',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '3ff1a292-702f-5be0-857c-f7d58baa7bd4',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"rps_catalog:02155","matched_name":"steering gear","document_role":"parts_catalog"}'::jsonb
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
  'rps_part',
  'b3c8cc0f-21f8-46f8-a452-aa4045e1ed16',
  concept.id,
  'primary_subject',
  '0.700',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '3ff1a292-702f-5be0-857c-f7d58baa7bd4',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"rps_catalog:02155","matched_name":"sealing ring","document_role":"parts_catalog"}'::jsonb
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
  'rps_part',
  'b6547799-631d-4bbe-ae9f-9be554fb4968',
  concept.id,
  'mentioned_component',
  '0.750',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'e800ddc7-41ba-5ae1-8a0d-f27bd8fce37a',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"rps_catalog:02155","matched_name":"steering gear","document_role":"parts_catalog"}'::jsonb
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
  'rps_part',
  'b6547799-631d-4bbe-ae9f-9be554fb4968',
  concept.id,
  'primary_subject',
  '0.700',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'e800ddc7-41ba-5ae1-8a0d-f27bd8fce37a',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"rps_catalog:02155","matched_name":"repair kit","document_role":"parts_catalog"}'::jsonb
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
  'rps_part',
  'ba4ef937-1964-4d96-a4a5-c93e8d7df83e',
  concept.id,
  'primary_subject',
  '0.700',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '9d6426be-f3e8-5d80-8222-aa730c0370fb',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"rps_catalog:02155","matched_name":"sealing ring","document_role":"parts_catalog"}'::jsonb
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
  'rps_part',
  'ba4ef937-1964-4d96-a4a5-c93e8d7df83e',
  concept.id,
  'mentioned_component',
  '0.750',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '9d6426be-f3e8-5d80-8222-aa730c0370fb',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"rps_catalog:02155","matched_name":"steering gear","document_role":"parts_catalog"}'::jsonb
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
  'rps_part',
  'ba98fa1f-cc6c-4ec3-8b55-6a70db1005d5',
  concept.id,
  'mentioned_component',
  '0.700',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'ffdfefc1-6daa-5d88-8145-a02dbd024e5e',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"rps_catalog:02155","matched_name":"steering","document_role":"parts_catalog"}'::jsonb
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
  'rps_part',
  'babe515f-9382-4bee-bb5e-ed2772fc79eb',
  concept.id,
  'mentioned_component',
  '0.700',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '2a2bb554-7ec2-5ebe-8c45-bd1f77490bb8',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"rps_catalog:02155","matched_name":"steering","document_role":"parts_catalog"}'::jsonb
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
  'rps_part',
  'bad123d7-aca4-41f5-9962-effb789d77a1',
  concept.id,
  'mentioned_component',
  '0.700',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '9decbb23-05e1-5952-8f32-83e43a99a874',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"rps_catalog:02155","matched_name":"steering","document_role":"parts_catalog"}'::jsonb
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
  'rps_part',
  'bb5eeb66-5f44-4fe4-a3e4-70064b6f45a7',
  concept.id,
  'mentioned_component',
  '0.700',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'acaf6117-534d-5b40-8ab6-91fe33890031',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"rps_catalog:02155","matched_name":"steering","document_role":"parts_catalog"}'::jsonb
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
  'rps_part',
  'bdd48364-44e8-4d7f-a78d-6837bab8374e',
  concept.id,
  'mentioned_component',
  '0.750',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '94ca1d70-9e3d-5b19-8ebc-9da540f0a8cb',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"rps_catalog:02155","matched_name":"power steering pump","document_role":"parts_catalog"}'::jsonb
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
  'rps_part',
  'be03e693-eae1-4642-9c42-d672d2c7f927',
  concept.id,
  'mentioned_component',
  '0.750',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'd3b18abc-ac82-58f0-8f44-66f2bfe9947e',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"rps_catalog:02155","matched_name":"power steering pump","document_role":"parts_catalog"}'::jsonb
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
  'rps_part',
  'bee4dac8-7acc-4beb-9c4b-56fa2a68b4f5',
  concept.id,
  'mentioned_component',
  '0.750',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '696ade0b-9089-59eb-87c7-4d43d5cac49b',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"rps_catalog:02155","matched_name":"power steering pump","document_role":"parts_catalog"}'::jsonb
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
  'rps_part',
  'c3cbd053-8a14-4bde-8365-15b61921a080',
  concept.id,
  'mentioned_component',
  '0.750',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'bd2e02f6-5bf4-5d75-8a74-001da026a4f9',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"rps_catalog:02155","matched_name":"power steering pump","document_role":"parts_catalog"}'::jsonb
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
  'rps_part',
  'c3d521a8-a5cd-4458-ade5-36da4df412e8',
  concept.id,
  'mentioned_component',
  '0.750',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'be9ad4ab-c875-5f56-8821-61aaf571b041',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"rps_catalog:02155","matched_name":"steering reservoir","document_role":"parts_catalog"}'::jsonb
FROM public.barry_semantic_concepts concept
WHERE concept.concept_key = 'component.steering_reservoir'
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
  'rps_part',
  'c4c66026-8754-40ca-b92d-4e85c47170c9',
  concept.id,
  'mentioned_component',
  '0.700',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'aa52d86a-cf77-59b4-802d-e3919a1470ef',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"rps_catalog:02155","matched_name":"steering","document_role":"parts_catalog"}'::jsonb
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
  'rps_part',
  'c831d826-548e-4a69-9f8d-51e544478d5d',
  concept.id,
  'mentioned_component',
  '0.750',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'ee61cea0-37c5-5ddb-8ed8-3a4fc120d2a5',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"rps_catalog:02155","matched_name":"steering reservoir","document_role":"parts_catalog"}'::jsonb
FROM public.barry_semantic_concepts concept
WHERE concept.concept_key = 'component.steering_reservoir'
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
  'rps_part',
  'c88fb785-83b9-4aca-94f9-7c33ecd33d3a',
  concept.id,
  'mentioned_component',
  '0.750',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'b83918de-518c-538c-81b7-fa6067a2f60c',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"rps_catalog:02155","matched_name":"power steering pump","document_role":"parts_catalog"}'::jsonb
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
  'rps_part',
  'c8ef96d7-5c18-4496-8a47-cf7c04242092',
  concept.id,
  'mentioned_component',
  '0.750',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'db02b80f-15bc-5473-8833-e456c8376a72',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"rps_catalog:02155","matched_name":"steering gear","document_role":"parts_catalog"}'::jsonb
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
  'rps_part',
  'c8fa0a0b-dbf1-44ab-b433-2b6b756ddf03',
  concept.id,
  'mentioned_component',
  '0.750',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '24788aaa-46e1-5866-81b6-79e106faa8c4',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"rps_catalog:02155","matched_name":"steering gear","document_role":"parts_catalog"}'::jsonb
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
  'rps_part',
  'c91408aa-e6f9-45d4-b580-8b272d7a2d79',
  concept.id,
  'mentioned_component',
  '0.750',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'aa36462d-fe94-553a-820d-60ad227d0140',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"rps_catalog:02155","matched_name":"steering reservoir","document_role":"parts_catalog"}'::jsonb
FROM public.barry_semantic_concepts concept
WHERE concept.concept_key = 'component.steering_reservoir'
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
  'rps_part',
  'ca299eee-92ae-4c94-8ecc-290186cff347',
  concept.id,
  'mentioned_component',
  '0.700',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '4a988b3b-6da0-5123-89dc-c87793cb6cbe',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"rps_catalog:02155","matched_name":"steering","document_role":"parts_catalog"}'::jsonb
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
  'rps_part',
  'cb2a4cac-c11b-40e6-a8fa-efaef7794c5e',
  concept.id,
  'mentioned_component',
  '0.700',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'e1e4b8d1-b591-53a5-8764-fd6b11a86f56',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"rps_catalog:02155","matched_name":"steering","document_role":"parts_catalog"}'::jsonb
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
  'rps_part',
  'cee00bc9-6841-4f65-a67b-cb93b7394259',
  concept.id,
  'mentioned_component',
  '0.700',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '6ba6b762-7620-5595-8501-df0781b9c1d4',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"rps_catalog:02155","matched_name":"steering","document_role":"parts_catalog"}'::jsonb
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
  'rps_part',
  'cf90a26e-b178-4ff5-914b-1f4aee38d29c',
  concept.id,
  'mentioned_component',
  '0.750',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'c58d1732-4ee1-500d-8334-3d9abdeef16b',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"rps_catalog:02155","matched_name":"power steering pump","document_role":"parts_catalog"}'::jsonb
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
  'rps_part',
  'd0c9dffb-a9cf-4ccb-82e1-9db9ca010510',
  concept.id,
  'mentioned_component',
  '0.750',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '9de299cd-99cd-56d5-8599-e52d619630ff',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"rps_catalog:02155","matched_name":"steering gear","document_role":"parts_catalog"}'::jsonb
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
  'rps_part',
  'd12ba4e8-a4d6-4e7c-812f-51d37159fea0',
  concept.id,
  'mentioned_component',
  '0.700',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '0833c2b5-e829-5b9e-8456-9cef25ca1d43',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"rps_catalog:02155","matched_name":"steering","document_role":"parts_catalog"}'::jsonb
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
  'rps_part',
  'd1d2a3ca-563e-429b-9131-d5ac26539f2e',
  concept.id,
  'primary_subject',
  '0.700',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'df5f3d2c-9ea0-53ee-8cb5-8ffdf1d77f0d',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"rps_catalog:02155","matched_name":"sealing ring","document_role":"parts_catalog"}'::jsonb
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
  'rps_part',
  'd1d2a3ca-563e-429b-9131-d5ac26539f2e',
  concept.id,
  'mentioned_component',
  '0.750',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'df5f3d2c-9ea0-53ee-8cb5-8ffdf1d77f0d',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"rps_catalog:02155","matched_name":"steering gear","document_role":"parts_catalog"}'::jsonb
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
  'rps_part',
  'd319f791-8c8f-455b-93ca-0a97e58bf0f3',
  concept.id,
  'mentioned_component',
  '0.750',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '75b2eeb4-1580-561e-8fbc-e8c53382d667',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"rps_catalog:02155","matched_name":"steering gear","document_role":"parts_catalog"}'::jsonb
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
  'rps_part',
  'd4caa148-e3be-409c-9882-32a0b91458bf',
  concept.id,
  'mentioned_component',
  '0.700',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '6fe07f03-204c-5eba-8c16-33519f6d5abe',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"rps_catalog:02155","matched_name":"steering","document_role":"parts_catalog"}'::jsonb
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
  'rps_part',
  'd5c247af-a6cf-4577-a7ef-c7ba95336233',
  concept.id,
  'primary_subject',
  '0.700',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '5e12b213-41b6-515f-86a5-f55b990accae',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"rps_catalog:02155","matched_name":"sealing ring","document_role":"parts_catalog"}'::jsonb
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
  'rps_part',
  'd5c247af-a6cf-4577-a7ef-c7ba95336233',
  concept.id,
  'mentioned_component',
  '0.750',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '5e12b213-41b6-515f-86a5-f55b990accae',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"rps_catalog:02155","matched_name":"steering gear","document_role":"parts_catalog"}'::jsonb
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
  'rps_part',
  'd6d23d0c-8ec5-4ffd-8468-9cc9ce4418b9',
  concept.id,
  'mentioned_component',
  '0.750',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '4df1a2f4-049e-5c83-816b-2cada3584456',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"rps_catalog:02155","matched_name":"power steering pump","document_role":"parts_catalog"}'::jsonb
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
  'rps_part',
  'd9c9780f-af8a-4d25-b73a-0e591c560142',
  concept.id,
  'mentioned_component',
  '0.750',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'cc1b2a06-b488-5c3b-8c1e-6c4775aec50f',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"rps_catalog:02155","matched_name":"steering gear","document_role":"parts_catalog"}'::jsonb
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
  'rps_part',
  'da2a7e00-50f5-4f41-b7c4-e5258d1cc811',
  concept.id,
  'mentioned_component',
  '0.750',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'dd6569bc-cda4-5fe3-848f-7261052e3939',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"rps_catalog:02155","matched_name":"power steering pump","document_role":"parts_catalog"}'::jsonb
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
  'rps_part',
  'daf42c91-8fa5-4631-aabf-1cf85cb5c636',
  concept.id,
  'mentioned_component',
  '0.750',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '0656e808-cd2d-5a1a-818d-7c33e0d4afa4',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"rps_catalog:02155","matched_name":"power steering pump","document_role":"parts_catalog"}'::jsonb
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
  'rps_part',
  'db77e601-4daa-4641-82ac-c110f30a229e',
  concept.id,
  'mentioned_component',
  '0.750',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'ea39d370-d1ab-503a-81c3-820d2d71e5d3',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"rps_catalog:02155","matched_name":"power steering pump","document_role":"parts_catalog"}'::jsonb
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
  'rps_part',
  'dd1001b7-5b19-4878-850a-341c5ed07b1c',
  concept.id,
  'mentioned_component',
  '0.750',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'e7c3ebff-c8f4-5fb7-8703-b1ee7d6d7fa3',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"rps_catalog:02155","matched_name":"steering gear","document_role":"parts_catalog"}'::jsonb
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
  'rps_part',
  'e244d589-c952-4469-9fd1-345ca4fe85f8',
  concept.id,
  'mentioned_component',
  '0.750',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '8cc86bb6-37b9-5c5f-87bd-9e33583bf5c9',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"rps_catalog:02155","matched_name":"power steering pump","document_role":"parts_catalog"}'::jsonb
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
  'rps_part',
  'e7deb578-84cd-4eeb-ba9f-a88d8ca3bad2',
  concept.id,
  'mentioned_component',
  '0.700',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '0e761753-e70d-5c37-8ad3-98f270efcc62',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"rps_catalog:02155","matched_name":"steering","document_role":"parts_catalog"}'::jsonb
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
  'rps_part',
  'eba1511b-468f-40a3-a307-b677c32b9613',
  concept.id,
  'mentioned_component',
  '0.750',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '212f7f38-6a90-5112-801b-9e668630320f',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"rps_catalog:02155","matched_name":"steering reservoir","document_role":"parts_catalog"}'::jsonb
FROM public.barry_semantic_concepts concept
WHERE concept.concept_key = 'component.steering_reservoir'
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
  'rps_part',
  'ed4b9f49-6248-4c76-9f17-0494c91cac8a',
  concept.id,
  'primary_subject',
  '0.700',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '37225b8a-9040-5913-8be7-2674c72e2070',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"rps_catalog:02155","matched_name":"sealing ring","document_role":"parts_catalog"}'::jsonb
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
  'rps_part',
  'ed4b9f49-6248-4c76-9f17-0494c91cac8a',
  concept.id,
  'mentioned_component',
  '0.750',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '37225b8a-9040-5913-8be7-2674c72e2070',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"rps_catalog:02155","matched_name":"steering gear","document_role":"parts_catalog"}'::jsonb
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
  'rps_part',
  'f0b73b4a-b6d3-4140-8160-2af4b9ca0057',
  concept.id,
  'mentioned_component',
  '0.700',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'aede2cc7-8c01-5a0d-8d7d-c1fbccd7a9e3',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"rps_catalog:02155","matched_name":"steering","document_role":"parts_catalog"}'::jsonb
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
  'rps_part',
  'f0e077ef-5228-4ee1-9742-3d9f59499e26',
  concept.id,
  'mentioned_component',
  '0.750',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '8c91f7e8-1939-5a67-88db-464f958ee9a1',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"rps_catalog:02155","matched_name":"steering gear","document_role":"parts_catalog"}'::jsonb
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
  'rps_part',
  'f3acf451-3e85-4fe5-a14d-43218379ed8c',
  concept.id,
  'mentioned_component',
  '0.750',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'bc23138c-9ed4-5d88-8f06-1453eb93fded',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"rps_catalog:02155","matched_name":"steering gear","document_role":"parts_catalog"}'::jsonb
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
  'rps_part',
  'f495cd9b-6bde-4b7e-b061-7bbd5ddd776e',
  concept.id,
  'mentioned_component',
  '0.700',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '273352b4-54fc-57f8-8e44-00849cbf6408',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"rps_catalog:02155","matched_name":"steering","document_role":"parts_catalog"}'::jsonb
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
  'rps_part',
  'f4afd9d6-6c7a-4f79-bb4e-29c9ff16f36b',
  concept.id,
  'mentioned_component',
  '0.750',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '1581bf86-0d6f-5d94-8bc2-adc178ae8ac6',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"rps_catalog:02155","matched_name":"steering gear","document_role":"parts_catalog"}'::jsonb
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
  'rps_part',
  'f63788c4-bd3a-41c3-b957-5540cd718aab',
  concept.id,
  'mentioned_component',
  '0.750',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'd8fe115a-1abf-542c-88da-cb9e528fb26e',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"rps_catalog:02155","matched_name":"steering gear","document_role":"parts_catalog"}'::jsonb
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
  'rps_part',
  'f826a447-8646-410a-8db2-5a9a95f96d3d',
  concept.id,
  'mentioned_component',
  '0.700',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '8b6130dd-25d2-50f7-8e53-59c9ef376dfc',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"rps_catalog:02155","matched_name":"steering","document_role":"parts_catalog"}'::jsonb
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
  'rps_part',
  'f839db80-3b42-42e2-913c-1c51be82d77d',
  concept.id,
  'mentioned_component',
  '0.700',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'f3c9ae45-3fb9-52ec-8079-60c913ec8d2b',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"rps_catalog:02155","matched_name":"steering","document_role":"parts_catalog"}'::jsonb
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
  'rps_part',
  'f918c391-73c5-43e5-9fa7-d3eebb36f10a',
  concept.id,
  'mentioned_component',
  '0.750',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '2c68a4af-fa97-5011-8fdd-85badce0403e',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"rps_catalog:02155","matched_name":"steering reservoir","document_role":"parts_catalog"}'::jsonb
FROM public.barry_semantic_concepts concept
WHERE concept.concept_key = 'component.steering_reservoir'
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
  'rps_part',
  'fa39bb1e-ef77-4b03-b4c6-ee997fb94879',
  concept.id,
  'primary_subject',
  '0.700',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '12a32e5c-0b8c-529e-8bc1-1df57651e2b4',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"rps_catalog:02155","matched_name":"sealing ring","document_role":"parts_catalog"}'::jsonb
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
  'rps_part',
  'fa39bb1e-ef77-4b03-b4c6-ee997fb94879',
  concept.id,
  'mentioned_component',
  '0.750',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '12a32e5c-0b8c-529e-8bc1-1df57651e2b4',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"rps_catalog:02155","matched_name":"steering gear","document_role":"parts_catalog"}'::jsonb
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
  'rps_part',
  'fa916363-578c-42b5-b1fc-0eb35b2b4840',
  concept.id,
  'mentioned_component',
  '0.700',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'e9d81431-ca2a-59af-8ad7-d2d0c15da3cd',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"rps_catalog:02155","matched_name":"steering","document_role":"parts_catalog"}'::jsonb
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
  'rps_part',
  'fbf1a017-c703-4744-844c-52f178d5c3aa',
  concept.id,
  'mentioned_component',
  '0.750',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '320ad7cd-6b0c-5dde-8049-9b8cfa9fbad8',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"rps_catalog:02155","matched_name":"steering reservoir","document_role":"parts_catalog"}'::jsonb
FROM public.barry_semantic_concepts concept
WHERE concept.concept_key = 'component.steering_reservoir'
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
  'rps_part',
  'fc641c08-8631-4019-bfc1-5ce8810150a4',
  concept.id,
  'mentioned_component',
  '0.750',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '9059e2f6-8178-50b0-8065-52289ea4c934',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"rps_catalog:02155","matched_name":"steering reservoir","document_role":"parts_catalog"}'::jsonb
FROM public.barry_semantic_concepts concept
WHERE concept.concept_key = 'component.steering_reservoir'
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
  'rps_part',
  'fe61fa9d-0308-4e72-a7a2-e725c42de8fc',
  concept.id,
  'mentioned_component',
  '0.750',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '5f2620f1-02e3-5138-876c-ed86758194f9',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"rps_catalog:02155","matched_name":"steering gear","document_role":"parts_catalog"}'::jsonb
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
  'rps_part',
  'fe61fa9d-0308-4e72-a7a2-e725c42de8fc',
  concept.id,
  'primary_subject',
  '0.700',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '5f2620f1-02e3-5138-876c-ed86758194f9',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"rps_catalog:02155","matched_name":"sealing ring","document_role":"parts_catalog"}'::jsonb
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
  'rps_part',
  'fe7110cb-bfaf-4690-bca7-fce6cf6a9b06',
  concept.id,
  'mentioned_component',
  '0.750',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '2c50bdaf-efd0-5662-8f14-b6bb48be0716',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"rps_catalog:02155","matched_name":"steering gear","document_role":"parts_catalog"}'::jsonb
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
  'rps_part',
  'fe7110cb-bfaf-4690-bca7-fce6cf6a9b06',
  concept.id,
  'primary_subject',
  '0.700',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '2c50bdaf-efd0-5662-8f14-b6bb48be0716',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"rps_catalog:02155","matched_name":"sealing ring","document_role":"parts_catalog"}'::jsonb
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
  'rps_part',
  'febf300a-3ab9-4e33-97b6-46f4ced9ef17',
  concept.id,
  'mentioned_component',
  '0.750',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'ac268f06-b425-5ce1-8f89-2bca49b4b216',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"rps_catalog:02155","matched_name":"steering gear","document_role":"parts_catalog"}'::jsonb
FROM public.barry_semantic_concepts concept
WHERE concept.concept_key = 'component.steering_gear'
ON CONFLICT (source_type, source_record_id, concept_id, annotation_role, semantic_version_id)
DO UPDATE SET
  confidence = EXCLUDED.confidence,
  review_status = EXCLUDED.review_status,
  evidence_unit_id = EXCLUDED.evidence_unit_id,
  model_scope = EXCLUDED.model_scope,
  provenance = EXCLUDED.provenance;
INSERT INTO public.barry_semantic_review_queue (
  dedupe_key, review_type, proposed_payload, query_frequency, affected_systems,
  risk_level, status, semantic_version_id
) VALUES (
  'evidence_mapping:barry_v2_content_block:7581d825-9bca-e197-2153-defb3bd9b8a7:diagram_page_cannot_carry_property_annotation_for_property.o',
  'evidence_mapping',
  '{"reason":"diagram page cannot carry property annotation for property.operating_pressure","source_type":"barry_v2_content_block","document_key":"barry_v2_manual:7147712a-37e0-b066-2067-672767b2b617","source_record_id":"7581d825-9bca-e197-2153-defb3bd9b8a7","physical_pdf_page":1,"candidate_concept_keys":["property.operating_pressure"]}'::jsonb,
  0,
  ARRAY[]::text[],
  'controlled',
  'pending',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1')
)
ON CONFLICT (dedupe_key) DO UPDATE SET proposed_payload = EXCLUDED.proposed_payload;
INSERT INTO public.barry_semantic_review_queue (
  dedupe_key, review_type, proposed_payload, query_frequency, affected_systems,
  risk_level, status, semantic_version_id
) VALUES (
  'evidence_mapping:barry_v2_content_block:e9c092c4-bf6a-a54f-07f7-819a0512fbd3:diagram_page_cannot_carry_property_annotation_for_property.o',
  'evidence_mapping',
  '{"reason":"diagram page cannot carry property annotation for property.operating_pressure","source_type":"barry_v2_content_block","document_key":"barry_v2_manual:7147712a-37e0-b066-2067-672767b2b617","source_record_id":"e9c092c4-bf6a-a54f-07f7-819a0512fbd3","physical_pdf_page":9,"candidate_concept_keys":["property.operating_pressure"]}'::jsonb,
  0,
  ARRAY[]::text[],
  'controlled',
  'pending',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1')
)
ON CONFLICT (dedupe_key) DO UPDATE SET proposed_payload = EXCLUDED.proposed_payload;
INSERT INTO public.barry_semantic_review_queue (
  dedupe_key, review_type, proposed_payload, query_frequency, affected_systems,
  risk_level, status, semantic_version_id
) VALUES (
  'evidence_mapping:manual_chunk:a9c8d9e9-0cc6-4e7a-a9a7-a3e05ca1800d:diagram_page_cannot_carry_property_annotation_for_property.o',
  'evidence_mapping',
  '{"reason":"diagram page cannot carry property annotation for property.operating_pressure","source_type":"manual_chunk","document_key":"manual_chunks_document:57ae9d6c-64b7-45e7-92f0-799c4ff6caf2","source_record_id":"a9c8d9e9-0cc6-4e7a-a9a7-a3e05ca1800d","physical_pdf_page":619,"candidate_concept_keys":["property.operating_pressure"]}'::jsonb,
  0,
  ARRAY[]::text[],
  'controlled',
  'pending',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1')
)
ON CONFLICT (dedupe_key) DO UPDATE SET proposed_payload = EXCLUDED.proposed_payload;
INSERT INTO public.barry_semantic_review_queue (
  dedupe_key, review_type, proposed_payload, query_frequency, affected_systems,
  risk_level, status, semantic_version_id
) VALUES (
  'evidence_mapping:rps_part:005b35a8-b9f0-4e96-a3a0-2022667757c8:RPS_part_has_no_verified_model_applicability',
  'evidence_mapping',
  '{"reason":"RPS part has no verified model applicability","source_type":"rps_part","document_key":"rps_catalog:02155","source_record_id":"005b35a8-b9f0-4e96-a3a0-2022667757c8","physical_pdf_page":615,"candidate_concept_keys":[]}'::jsonb,
  0,
  ARRAY[]::text[],
  'controlled',
  'pending',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1')
)
ON CONFLICT (dedupe_key) DO UPDATE SET proposed_payload = EXCLUDED.proposed_payload;
INSERT INTO public.barry_semantic_review_queue (
  dedupe_key, review_type, proposed_payload, query_frequency, affected_systems,
  risk_level, status, semantic_version_id
) VALUES (
  'evidence_mapping:rps_part:040ac58b-c25f-483a-989d-8dfbf81ec92a:RPS_part_has_no_verified_model_applicability',
  'evidence_mapping',
  '{"reason":"RPS part has no verified model applicability","source_type":"rps_part","document_key":"rps_catalog:02155","source_record_id":"040ac58b-c25f-483a-989d-8dfbf81ec92a","physical_pdf_page":597,"candidate_concept_keys":[]}'::jsonb,
  0,
  ARRAY[]::text[],
  'controlled',
  'pending',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1')
)
ON CONFLICT (dedupe_key) DO UPDATE SET proposed_payload = EXCLUDED.proposed_payload;
INSERT INTO public.barry_semantic_review_queue (
  dedupe_key, review_type, proposed_payload, query_frequency, affected_systems,
  risk_level, status, semantic_version_id
) VALUES (
  'evidence_mapping:rps_part:05112454-7b84-4331-bee1-2e01e7208cc9:RPS_part_has_no_verified_model_applicability',
  'evidence_mapping',
  '{"reason":"RPS part has no verified model applicability","source_type":"rps_part","document_key":"rps_catalog:02155","source_record_id":"05112454-7b84-4331-bee1-2e01e7208cc9","physical_pdf_page":601,"candidate_concept_keys":[]}'::jsonb,
  0,
  ARRAY[]::text[],
  'controlled',
  'pending',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1')
)
ON CONFLICT (dedupe_key) DO UPDATE SET proposed_payload = EXCLUDED.proposed_payload;
INSERT INTO public.barry_semantic_review_queue (
  dedupe_key, review_type, proposed_payload, query_frequency, affected_systems,
  risk_level, status, semantic_version_id
) VALUES (
  'evidence_mapping:rps_part:05d081d2-99ef-47e0-bb18-4a150325d727:RPS_part_has_no_verified_model_applicability',
  'evidence_mapping',
  '{"reason":"RPS part has no verified model applicability","source_type":"rps_part","document_key":"rps_catalog:02155","source_record_id":"05d081d2-99ef-47e0-bb18-4a150325d727","physical_pdf_page":619,"candidate_concept_keys":[]}'::jsonb,
  0,
  ARRAY[]::text[],
  'controlled',
  'pending',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1')
)
ON CONFLICT (dedupe_key) DO UPDATE SET proposed_payload = EXCLUDED.proposed_payload;
INSERT INTO public.barry_semantic_review_queue (
  dedupe_key, review_type, proposed_payload, query_frequency, affected_systems,
  risk_level, status, semantic_version_id
) VALUES (
  'evidence_mapping:rps_part:060f37c2-f74d-4aca-b35f-8bd495af6abb:RPS_part_has_no_verified_model_applicability',
  'evidence_mapping',
  '{"reason":"RPS part has no verified model applicability","source_type":"rps_part","document_key":"rps_catalog:02155","source_record_id":"060f37c2-f74d-4aca-b35f-8bd495af6abb","physical_pdf_page":607,"candidate_concept_keys":[]}'::jsonb,
  0,
  ARRAY[]::text[],
  'controlled',
  'pending',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1')
)
ON CONFLICT (dedupe_key) DO UPDATE SET proposed_payload = EXCLUDED.proposed_payload;
INSERT INTO public.barry_semantic_review_queue (
  dedupe_key, review_type, proposed_payload, query_frequency, affected_systems,
  risk_level, status, semantic_version_id
) VALUES (
  'evidence_mapping:rps_part:061474b4-edd1-4a21-898a-d0318ff2b70b:RPS_part_has_no_verified_model_applicability',
  'evidence_mapping',
  '{"reason":"RPS part has no verified model applicability","source_type":"rps_part","document_key":"rps_catalog:02155","source_record_id":"061474b4-edd1-4a21-898a-d0318ff2b70b","physical_pdf_page":611,"candidate_concept_keys":[]}'::jsonb,
  0,
  ARRAY[]::text[],
  'controlled',
  'pending',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1')
)
ON CONFLICT (dedupe_key) DO UPDATE SET proposed_payload = EXCLUDED.proposed_payload;
INSERT INTO public.barry_semantic_review_queue (
  dedupe_key, review_type, proposed_payload, query_frequency, affected_systems,
  risk_level, status, semantic_version_id
) VALUES (
  'evidence_mapping:rps_part:07e2a359-159d-41e9-ab84-bfba28197dba:RPS_part_has_no_verified_model_applicability',
  'evidence_mapping',
  '{"reason":"RPS part has no verified model applicability","source_type":"rps_part","document_key":"rps_catalog:02155","source_record_id":"07e2a359-159d-41e9-ab84-bfba28197dba","physical_pdf_page":611,"candidate_concept_keys":[]}'::jsonb,
  0,
  ARRAY[]::text[],
  'controlled',
  'pending',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1')
)
ON CONFLICT (dedupe_key) DO UPDATE SET proposed_payload = EXCLUDED.proposed_payload;
INSERT INTO public.barry_semantic_review_queue (
  dedupe_key, review_type, proposed_payload, query_frequency, affected_systems,
  risk_level, status, semantic_version_id
) VALUES (
  'evidence_mapping:rps_part:08bb93b7-3d05-4214-a233-dcf78b0187e1:RPS_part_has_no_verified_model_applicability',
  'evidence_mapping',
  '{"reason":"RPS part has no verified model applicability","source_type":"rps_part","document_key":"rps_catalog:02155","source_record_id":"08bb93b7-3d05-4214-a233-dcf78b0187e1","physical_pdf_page":619,"candidate_concept_keys":[]}'::jsonb,
  0,
  ARRAY[]::text[],
  'controlled',
  'pending',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1')
)
ON CONFLICT (dedupe_key) DO UPDATE SET proposed_payload = EXCLUDED.proposed_payload;
INSERT INTO public.barry_semantic_review_queue (
  dedupe_key, review_type, proposed_payload, query_frequency, affected_systems,
  risk_level, status, semantic_version_id
) VALUES (
  'evidence_mapping:rps_part:0911fc50-8f33-4369-96d5-68d9d7538c19:RPS_part_has_no_verified_model_applicability',
  'evidence_mapping',
  '{"reason":"RPS part has no verified model applicability","source_type":"rps_part","document_key":"rps_catalog:02155","source_record_id":"0911fc50-8f33-4369-96d5-68d9d7538c19","physical_pdf_page":611,"candidate_concept_keys":[]}'::jsonb,
  0,
  ARRAY[]::text[],
  'controlled',
  'pending',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1')
)
ON CONFLICT (dedupe_key) DO UPDATE SET proposed_payload = EXCLUDED.proposed_payload;
INSERT INTO public.barry_semantic_review_queue (
  dedupe_key, review_type, proposed_payload, query_frequency, affected_systems,
  risk_level, status, semantic_version_id
) VALUES (
  'evidence_mapping:rps_part:0cf64c32-9071-42b2-859e-4c7040cf4cb4:RPS_part_has_no_verified_model_applicability',
  'evidence_mapping',
  '{"reason":"RPS part has no verified model applicability","source_type":"rps_part","document_key":"rps_catalog:02155","source_record_id":"0cf64c32-9071-42b2-859e-4c7040cf4cb4","physical_pdf_page":625,"candidate_concept_keys":[]}'::jsonb,
  0,
  ARRAY[]::text[],
  'controlled',
  'pending',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1')
)
ON CONFLICT (dedupe_key) DO UPDATE SET proposed_payload = EXCLUDED.proposed_payload;
COMMIT;
