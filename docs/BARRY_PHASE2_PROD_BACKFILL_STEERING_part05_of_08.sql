BEGIN;

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
  '0.850',
  'deterministic',
  'approved',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'b3c3f54b-c314-51aa-86b8-838be61bc088',
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
  'c2e19b60-ba06-7f81-640b-0cd32c6fc4b9',
  concept.id,
  'operation',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'c7f53a82-e377-5fb0-8f46-c6a0f7a7d9c3',
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
  'c2e19b60-ba06-7f81-640b-0cd32c6fc4b9',
  concept.id,
  'operation',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'c7f53a82-e377-5fb0-8f46-c6a0f7a7d9c3',
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
  'c65ad742-b5aa-81e1-c141-4a095f0a154d',
  concept.id,
  'primary_subject',
  '0.900',
  'deterministic',
  'approved',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '40344bad-8d27-55c6-83e3-d7c3dcfc269a',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"barry_v2_manual:7147712a-37e0-b066-2067-672767b2b617","matched_name":"sealing ring","document_role":"workshop_manual"}'::jsonb
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
  'c65ad742-b5aa-81e1-c141-4a095f0a154d',
  concept.id,
  'mentioned_component',
  '0.700',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '40344bad-8d27-55c6-83e3-d7c3dcfc269a',
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
  'c65c76b1-36f4-5833-ee82-27cfae115505',
  concept.id,
  'mentioned_component',
  '0.900',
  'deterministic',
  'approved',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'bc2ca87c-a115-59cc-80c4-be3decada5ae',
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
  'c7b11c9f-a278-df38-b37c-845e503bd15f',
  concept.id,
  'operation',
  '0.700',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'c87717dc-edb7-5aba-8a13-360f02bb75f6',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":false,"document_key":"barry_v2_manual:9ba1297a-2aa6-de38-b971-ad38336442ad","matched_name":"adjust","document_role":"workshop_manual"}'::jsonb
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
  'c7b11c9f-a278-df38-b37c-845e503bd15f',
  concept.id,
  'primary_subject',
  '0.850',
  'deterministic',
  'approved',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'c87717dc-edb7-5aba-8a13-360f02bb75f6',
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
  'c7b11c9f-a278-df38-b37c-845e503bd15f',
  concept.id,
  'mentioned_component',
  '0.700',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'c87717dc-edb7-5aba-8a13-360f02bb75f6',
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
  'c7b11c9f-a278-df38-b37c-845e503bd15f',
  concept.id,
  'property',
  '0.850',
  'deterministic',
  'approved',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'c87717dc-edb7-5aba-8a13-360f02bb75f6',
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
  'c7b11c9f-a278-df38-b37c-845e503bd15f',
  concept.id,
  'mentioned_component',
  '0.850',
  'deterministic',
  'approved',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'c87717dc-edb7-5aba-8a13-360f02bb75f6',
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
  'c819ab5d-36ad-5047-a816-73e41e9637f0',
  concept.id,
  'mentioned_component',
  '0.700',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '05d2a6cf-fa6b-5d69-8a6a-68ec561ae3d0',
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
  'c819ab5d-36ad-5047-a816-73e41e9637f0',
  concept.id,
  'primary_subject',
  '0.850',
  'deterministic',
  'approved',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '05d2a6cf-fa6b-5d69-8a6a-68ec561ae3d0',
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
  'c819ab5d-36ad-5047-a816-73e41e9637f0',
  concept.id,
  'mentioned_component',
  '0.850',
  'deterministic',
  'approved',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '05d2a6cf-fa6b-5d69-8a6a-68ec561ae3d0',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"barry_v2_manual:9ba1297a-2aa6-de38-b971-ad38336442ad","matched_name":"puller","document_role":"workshop_manual"}'::jsonb
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
  'c819ab5d-36ad-5047-a816-73e41e9637f0',
  concept.id,
  'mentioned_component',
  '0.700',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '05d2a6cf-fa6b-5d69-8a6a-68ec561ae3d0',
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
  'c819ab5d-36ad-5047-a816-73e41e9637f0',
  concept.id,
  'operation',
  '0.850',
  'deterministic',
  'approved',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '05d2a6cf-fa6b-5d69-8a6a-68ec561ae3d0',
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
  'c819ab5d-36ad-5047-a816-73e41e9637f0',
  concept.id,
  'operation',
  '0.850',
  'deterministic',
  'approved',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '05d2a6cf-fa6b-5d69-8a6a-68ec561ae3d0',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"barry_v2_manual:9ba1297a-2aa6-de38-b971-ad38336442ad","matched_name":"inspect","document_role":"workshop_manual"}'::jsonb
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
  'c8a7dc3b-e72a-3e64-3930-8ba4a97fe6d4',
  concept.id,
  'mentioned_component',
  '0.850',
  'deterministic',
  'approved',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '9079aea4-40c7-58f1-80d8-a8900b17ee78',
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
  'c8a7dc3b-e72a-3e64-3930-8ba4a97fe6d4',
  concept.id,
  'mentioned_component',
  '0.700',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '9079aea4-40c7-58f1-80d8-a8900b17ee78',
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
  'c8a7dc3b-e72a-3e64-3930-8ba4a97fe6d4',
  concept.id,
  'primary_subject',
  '0.850',
  'deterministic',
  'approved',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '9079aea4-40c7-58f1-80d8-a8900b17ee78',
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
  'ccc37d38-8272-10a9-87b1-d8fba8f835a3',
  concept.id,
  'mentioned_component',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '37ddb2fb-3a08-5833-8a6a-17aac4bdb6b9',
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
  'ccc37d38-8272-10a9-87b1-d8fba8f835a3',
  concept.id,
  'mentioned_component',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '37ddb2fb-3a08-5833-8a6a-17aac4bdb6b9',
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
  'ccc37d38-8272-10a9-87b1-d8fba8f835a3',
  concept.id,
  'mentioned_component',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '37ddb2fb-3a08-5833-8a6a-17aac4bdb6b9',
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
  'ccc37d38-8272-10a9-87b1-d8fba8f835a3',
  concept.id,
  'mentioned_component',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '37ddb2fb-3a08-5833-8a6a-17aac4bdb6b9',
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
  'ccc37d38-8272-10a9-87b1-d8fba8f835a3',
  concept.id,
  'operation',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '37ddb2fb-3a08-5833-8a6a-17aac4bdb6b9',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"barry_v2_manual:9ba1297a-2aa6-de38-b971-ad38336442ad","matched_name":"inspect","document_role":"workshop_manual"}'::jsonb
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
  'ccc37d38-8272-10a9-87b1-d8fba8f835a3',
  concept.id,
  'operation',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '37ddb2fb-3a08-5833-8a6a-17aac4bdb6b9',
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
  'ccce02af-fe96-df45-4f63-f9d71a842ea2',
  concept.id,
  'operation',
  '0.700',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'bf79a2fe-df5d-503b-8e43-5b24df1138c0',
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
  'ccce02af-fe96-df45-4f63-f9d71a842ea2',
  concept.id,
  'primary_subject',
  '0.850',
  'deterministic',
  'approved',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'bf79a2fe-df5d-503b-8e43-5b24df1138c0',
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
  'ccce02af-fe96-df45-4f63-f9d71a842ea2',
  concept.id,
  'mentioned_component',
  '0.700',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'bf79a2fe-df5d-503b-8e43-5b24df1138c0',
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
  'ccce02af-fe96-df45-4f63-f9d71a842ea2',
  concept.id,
  'property',
  '0.850',
  'deterministic',
  'approved',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'bf79a2fe-df5d-503b-8e43-5b24df1138c0',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"barry_v2_manual:af332a3b-25a2-3589-3a79-e73507003464","matched_name":"torque","document_role":"workshop_manual"}'::jsonb
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
  'ccce02af-fe96-df45-4f63-f9d71a842ea2',
  concept.id,
  'mentioned_component',
  '0.850',
  'deterministic',
  'approved',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'bf79a2fe-df5d-503b-8e43-5b24df1138c0',
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
  'cd9d0375-9e6c-024d-7699-5afb2fd6114e',
  concept.id,
  'mentioned_component',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'dce075ec-814b-5000-8469-74a01ab1e530',
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
  'cd9d0375-9e6c-024d-7699-5afb2fd6114e',
  concept.id,
  'mentioned_component',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'dce075ec-814b-5000-8469-74a01ab1e530',
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
  'cd9d0375-9e6c-024d-7699-5afb2fd6114e',
  concept.id,
  'property',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'dce075ec-814b-5000-8469-74a01ab1e530',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"barry_v2_manual:af332a3b-25a2-3589-3a79-e73507003464","matched_name":"part number","document_role":"workshop_manual"}'::jsonb
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
  'cd9d0375-9e6c-024d-7699-5afb2fd6114e',
  concept.id,
  'property',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'dce075ec-814b-5000-8469-74a01ab1e530',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":false,"document_key":"barry_v2_manual:af332a3b-25a2-3589-3a79-e73507003464","matched_name":"clearance","document_role":"workshop_manual"}'::jsonb
FROM public.barry_semantic_concepts concept
WHERE concept.concept_key = 'property.clearance'
ON CONFLICT (source_type, source_record_id, concept_id, annotation_role, semantic_version_id)
DO UPDATE SET
  confidence = EXCLUDED.confidence,
  review_status = EXCLUDED.review_status,
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
  'cd9d0375-9e6c-024d-7699-5afb2fd6114e',
  concept.id,
  'applicability',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'dce075ec-814b-5000-8469-74a01ab1e530',
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
  'cd9d0375-9e6c-024d-7699-5afb2fd6114e',
  concept.id,
  'applicability',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'dce075ec-814b-5000-8469-74a01ab1e530',
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
  'cdc46cd2-97a5-98d6-49e9-2fd5845a12f2',
  concept.id,
  'mentioned_component',
  '0.700',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '2506108e-e6db-500c-857d-ded2b79165ef',
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
  'ce8bd0d8-82c5-c1ae-82bb-b70ce53a8ecf',
  concept.id,
  'mentioned_component',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '92b68932-00f7-5918-896e-fee8c18434f8',
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
  'ce8bd0d8-82c5-c1ae-82bb-b70ce53a8ecf',
  concept.id,
  'primary_subject',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '92b68932-00f7-5918-896e-fee8c18434f8',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"barry_v2_manual:9ba1297a-2aa6-de38-b971-ad38336442ad","matched_name":"power steering pump","document_role":"workshop_manual"}'::jsonb
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
  'd04485f9-35d8-1c03-aca4-b27960aaa72b',
  concept.id,
  'mentioned_component',
  '0.700',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '83a85f65-082f-59d2-83c7-a66050927d6e',
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
  'd04485f9-35d8-1c03-aca4-b27960aaa72b',
  concept.id,
  'mentioned_component',
  '0.850',
  'deterministic',
  'approved',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '83a85f65-082f-59d2-83c7-a66050927d6e',
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
  'd04485f9-35d8-1c03-aca4-b27960aaa72b',
  concept.id,
  'operation',
  '0.700',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '83a85f65-082f-59d2-83c7-a66050927d6e',
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
  'd04485f9-35d8-1c03-aca4-b27960aaa72b',
  concept.id,
  'property',
  '0.850',
  'deterministic',
  'approved',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '83a85f65-082f-59d2-83c7-a66050927d6e',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"barry_v2_manual:af332a3b-25a2-3589-3a79-e73507003464","matched_name":"torque","document_role":"workshop_manual"}'::jsonb
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
  'd2205373-3d19-56fa-350d-15d5dba343cc',
  concept.id,
  'operation',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'c775189c-5a9f-5759-857d-cbf39042b04a',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":false,"document_key":"barry_v2_manual:9ba1297a-2aa6-de38-b971-ad38336442ad","matched_name":"adjust","document_role":"workshop_manual"}'::jsonb
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
  'd2205373-3d19-56fa-350d-15d5dba343cc',
  concept.id,
  'mentioned_component',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'c775189c-5a9f-5759-857d-cbf39042b04a',
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
  'd2205373-3d19-56fa-350d-15d5dba343cc',
  concept.id,
  'property',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'c775189c-5a9f-5759-857d-cbf39042b04a',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":false,"document_key":"barry_v2_manual:9ba1297a-2aa6-de38-b971-ad38336442ad","matched_name":"part number","document_role":"workshop_manual"}'::jsonb
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
  'd2205373-3d19-56fa-350d-15d5dba343cc',
  concept.id,
  'mentioned_component',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'c775189c-5a9f-5759-857d-cbf39042b04a',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":false,"document_key":"barry_v2_manual:9ba1297a-2aa6-de38-b971-ad38336442ad","matched_name":"puller","document_role":"workshop_manual"}'::jsonb
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
  'd2205373-3d19-56fa-350d-15d5dba343cc',
  concept.id,
  'property',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'c775189c-5a9f-5759-857d-cbf39042b04a',
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
  'd2205373-3d19-56fa-350d-15d5dba343cc',
  concept.id,
  'mentioned_component',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'c775189c-5a9f-5759-857d-cbf39042b04a',
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
  'd2f8b01a-d108-ec26-a41c-81cd262df743',
  concept.id,
  'mentioned_component',
  '0.700',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'a9769f6b-d08e-510a-823d-8276672a17fb',
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
  'd2f8b01a-d108-ec26-a41c-81cd262df743',
  concept.id,
  'mentioned_component',
  '0.850',
  'deterministic',
  'approved',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'a9769f6b-d08e-510a-823d-8276672a17fb',
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
  'd2f8b01a-d108-ec26-a41c-81cd262df743',
  concept.id,
  'primary_subject',
  '0.850',
  'deterministic',
  'approved',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'a9769f6b-d08e-510a-823d-8276672a17fb',
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
  'd48bf265-b096-f335-8775-277706995b25',
  concept.id,
  'operation',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '09332112-331d-5450-8285-ec1647ca5edd',
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
  'd48bf265-b096-f335-8775-277706995b25',
  concept.id,
  'mentioned_component',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '09332112-331d-5450-8285-ec1647ca5edd',
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
  'd48bf265-b096-f335-8775-277706995b25',
  concept.id,
  'mentioned_component',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '09332112-331d-5450-8285-ec1647ca5edd',
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
  'd48bf265-b096-f335-8775-277706995b25',
  concept.id,
  'mentioned_component',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '09332112-331d-5450-8285-ec1647ca5edd',
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
  'd48bf265-b096-f335-8775-277706995b25',
  concept.id,
  'operation',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '09332112-331d-5450-8285-ec1647ca5edd',
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
  'd84dcd42-d7ab-968d-3701-4dba0fa2295b',
  concept.id,
  'primary_subject',
  '0.850',
  'deterministic',
  'approved',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '9963fc61-fa99-5480-86c2-1ae2a76768b7',
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
  'd84dcd42-d7ab-968d-3701-4dba0fa2295b',
  concept.id,
  'mentioned_component',
  '0.850',
  'deterministic',
  'approved',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '9963fc61-fa99-5480-86c2-1ae2a76768b7',
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
  'd84dcd42-d7ab-968d-3701-4dba0fa2295b',
  concept.id,
  'mentioned_component',
  '0.700',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '9963fc61-fa99-5480-86c2-1ae2a76768b7',
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
  'd99b056e-4a86-818b-4070-e4ab80c47873',
  concept.id,
  'property',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'b24130b7-73c4-5ad4-8036-beb26fe59982',
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
  'd99b056e-4a86-818b-4070-e4ab80c47873',
  concept.id,
  'primary_subject',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'b24130b7-73c4-5ad4-8036-beb26fe59982',
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
  'd99b056e-4a86-818b-4070-e4ab80c47873',
  concept.id,
  'applicability',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'b24130b7-73c4-5ad4-8036-beb26fe59982',
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
  'd99b056e-4a86-818b-4070-e4ab80c47873',
  concept.id,
  'operation',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'b24130b7-73c4-5ad4-8036-beb26fe59982',
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
  'dc2814f2-6790-8db9-8f3e-6c82a683ee64',
  concept.id,
  'operation',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'f548a3d2-d849-5792-8b0c-ae2d2cae3e32',
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
  'dc2814f2-6790-8db9-8f3e-6c82a683ee64',
  concept.id,
  'operation',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'f548a3d2-d849-5792-8b0c-ae2d2cae3e32',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"barry_v2_manual:9ba1297a-2aa6-de38-b971-ad38336442ad","matched_name":"inspect","document_role":"workshop_manual"}'::jsonb
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
  'dc2814f2-6790-8db9-8f3e-6c82a683ee64',
  concept.id,
  'mentioned_component',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'f548a3d2-d849-5792-8b0c-ae2d2cae3e32',
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
  'dc2814f2-6790-8db9-8f3e-6c82a683ee64',
  concept.id,
  'mentioned_component',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'f548a3d2-d849-5792-8b0c-ae2d2cae3e32',
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
  'dc2814f2-6790-8db9-8f3e-6c82a683ee64',
  concept.id,
  'mentioned_component',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'f548a3d2-d849-5792-8b0c-ae2d2cae3e32',
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
  'ddc3d800-ac81-60ab-1478-27503ad064ec',
  concept.id,
  'mentioned_component',
  '0.700',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'e90bd847-eea5-5b42-8b0d-68fdd1d848f9',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":false,"document_key":"barry_v2_manual:9ba1297a-2aa6-de38-b971-ad38336442ad","matched_name":"repair kit","document_role":"workshop_manual"}'::jsonb
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
  'df617ab5-88cd-2509-3892-fcab5e7a282f',
  concept.id,
  'operation',
  '0.850',
  'deterministic',
  'approved',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '3d8d4b32-41ac-56dc-8ada-bd8f684efcdb',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"barry_v2_manual:9ba1297a-2aa6-de38-b971-ad38336442ad","matched_name":"inspect","document_role":"workshop_manual"}'::jsonb
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
  'df617ab5-88cd-2509-3892-fcab5e7a282f',
  concept.id,
  'property',
  '0.850',
  'deterministic',
  'approved',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '3d8d4b32-41ac-56dc-8ada-bd8f684efcdb',
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
  'e1104286-f19e-b335-da17-a9185c2153b4',
  concept.id,
  'property',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '19f587a5-466a-5a39-80e2-3696885c6e7c',
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
  'e1104286-f19e-b335-da17-a9185c2153b4',
  concept.id,
  'mentioned_component',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '19f587a5-466a-5a39-80e2-3696885c6e7c',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":false,"document_key":"barry_v2_manual:af332a3b-25a2-3589-3a79-e73507003464","matched_name":"puller","document_role":"workshop_manual"}'::jsonb
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
  'e1104286-f19e-b335-da17-a9185c2153b4',
  concept.id,
  'mentioned_component',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '19f587a5-466a-5a39-80e2-3696885c6e7c',
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
  'e1104286-f19e-b335-da17-a9185c2153b4',
  concept.id,
  'mentioned_component',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '19f587a5-466a-5a39-80e2-3696885c6e7c',
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
  'e1104286-f19e-b335-da17-a9185c2153b4',
  concept.id,
  'operation',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '19f587a5-466a-5a39-80e2-3696885c6e7c',
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
  'e1104286-f19e-b335-da17-a9185c2153b4',
  concept.id,
  'property',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '19f587a5-466a-5a39-80e2-3696885c6e7c',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":false,"document_key":"barry_v2_manual:af332a3b-25a2-3589-3a79-e73507003464","matched_name":"part number","document_role":"workshop_manual"}'::jsonb
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
  'e645c700-f4d9-9b14-3562-c1f1eecbab85',
  concept.id,
  'operation',
  '0.850',
  'deterministic',
  'approved',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '7ac36720-4406-5787-86e5-0a67bb01544a',
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
  'e645c700-f4d9-9b14-3562-c1f1eecbab85',
  concept.id,
  'mentioned_component',
  '0.700',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '7ac36720-4406-5787-86e5-0a67bb01544a',
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
  'e645c700-f4d9-9b14-3562-c1f1eecbab85',
  concept.id,
  'property',
  '0.700',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '7ac36720-4406-5787-86e5-0a67bb01544a',
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
  'e645c700-f4d9-9b14-3562-c1f1eecbab85',
  concept.id,
  'primary_subject',
  '0.850',
  'deterministic',
  'approved',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '7ac36720-4406-5787-86e5-0a67bb01544a',
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
  'e645c700-f4d9-9b14-3562-c1f1eecbab85',
  concept.id,
  'mentioned_component',
  '0.850',
  'deterministic',
  'approved',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '7ac36720-4406-5787-86e5-0a67bb01544a',
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
  'e6fe6a96-66e8-f4e5-2d5d-b594ae234a23',
  concept.id,
  'applicability',
  '0.700',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '3577a844-efd5-5890-8d8b-ab8a86c4c74d',
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
  'e6fe6a96-66e8-f4e5-2d5d-b594ae234a23',
  concept.id,
  'mentioned_component',
  '0.700',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '3577a844-efd5-5890-8d8b-ab8a86c4c74d',
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
  'e86f033c-3d00-7bdf-a733-f14cb174058b',
  concept.id,
  'primary_subject',
  '0.850',
  'deterministic',
  'approved',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'c73c0509-7428-57d3-8e3c-9ffc4f8ebc59',
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
  'e86f033c-3d00-7bdf-a733-f14cb174058b',
  concept.id,
  'mentioned_component',
  '0.700',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'c73c0509-7428-57d3-8e3c-9ffc4f8ebc59',
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
  'e87c76ea-2d88-b72d-7774-68e2caec4733',
  concept.id,
  'primary_subject',
  '0.850',
  'deterministic',
  'approved',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '44557dc6-4677-562e-8e67-57e9a6bbec21',
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
  'e87c76ea-2d88-b72d-7774-68e2caec4733',
  concept.id,
  'mentioned_component',
  '0.700',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '44557dc6-4677-562e-8e67-57e9a6bbec21',
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
  'e87c76ea-2d88-b72d-7774-68e2caec4733',
  concept.id,
  'property',
  '0.700',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '44557dc6-4677-562e-8e67-57e9a6bbec21',
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
  'e87c76ea-2d88-b72d-7774-68e2caec4733',
  concept.id,
  'operation',
  '0.850',
  'deterministic',
  'approved',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '44557dc6-4677-562e-8e67-57e9a6bbec21',
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
  'e87c76ea-2d88-b72d-7774-68e2caec4733',
  concept.id,
  'mentioned_component',
  '0.850',
  'deterministic',
  'approved',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '44557dc6-4677-562e-8e67-57e9a6bbec21',
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
  'e9c092c4-bf6a-a54f-07f7-819a0512fbd3',
  concept.id,
  'primary_subject',
  '0.900',
  'deterministic',
  'approved',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'f895603e-b10d-5fb5-8f5e-581f402ecd32',
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
  'ebd228a9-5a76-bac6-6289-354d3d1a5962',
  concept.id,
  'mentioned_component',
  '0.700',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '3c29bee5-89fc-5d8b-8a60-290c7c55311d',
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
  'ebd228a9-5a76-bac6-6289-354d3d1a5962',
  concept.id,
  'applicability',
  '0.700',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '3c29bee5-89fc-5d8b-8a60-290c7c55311d',
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
  'ec9d10e0-0890-1857-25c4-7b2a37fc856d',
  concept.id,
  'applicability',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '698d23c5-e603-53bc-8db2-c45ebc2d29ce',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":false,"document_key":"barry_v2_manual:5c259d33-46d1-a74a-ef88-a4fabb23376f","matched_name":"U1700L","document_role":"workshop_manual"}'::jsonb
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
  'ec9d10e0-0890-1857-25c4-7b2a37fc856d',
  concept.id,
  'mentioned_component',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '698d23c5-e603-53bc-8db2-c45ebc2d29ce',
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
  'ec9d10e0-0890-1857-25c4-7b2a37fc856d',
  concept.id,
  'mentioned_component',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '698d23c5-e603-53bc-8db2-c45ebc2d29ce',
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
  'ec9d10e0-0890-1857-25c4-7b2a37fc856d',
  concept.id,
  'mentioned_component',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '698d23c5-e603-53bc-8db2-c45ebc2d29ce',
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
  'ec9d10e0-0890-1857-25c4-7b2a37fc856d',
  concept.id,
  'applicability',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '698d23c5-e603-53bc-8db2-c45ebc2d29ce',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"barry_v2_manual:5c259d33-46d1-a74a-ef88-a4fabb23376f","matched_name":"U435","document_role":"workshop_manual"}'::jsonb
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
  'ed646683-05b6-a60a-7acd-8c9c29fba524',
  concept.id,
  'mentioned_component',
  '0.700',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '8d32d18a-51a5-5e75-89bd-08063a688558',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":false,"document_key":"barry_v2_manual:9ba1297a-2aa6-de38-b971-ad38336442ad","matched_name":"engine","document_role":"workshop_manual"}'::jsonb
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
  'ed646683-05b6-a60a-7acd-8c9c29fba524',
  concept.id,
  'primary_subject',
  '0.850',
  'deterministic',
  'approved',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '8d32d18a-51a5-5e75-89bd-08063a688558',
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
  'ed646683-05b6-a60a-7acd-8c9c29fba524',
  concept.id,
  'property',
  '0.700',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '8d32d18a-51a5-5e75-89bd-08063a688558',
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
  'ed646683-05b6-a60a-7acd-8c9c29fba524',
  concept.id,
  'operation',
  '0.700',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '8d32d18a-51a5-5e75-89bd-08063a688558',
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
  'ed646683-05b6-a60a-7acd-8c9c29fba524',
  concept.id,
  'operation',
  '0.700',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '8d32d18a-51a5-5e75-89bd-08063a688558',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":false,"document_key":"barry_v2_manual:9ba1297a-2aa6-de38-b971-ad38336442ad","matched_name":"check fluid level","document_role":"workshop_manual"}'::jsonb
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
  'ed646683-05b6-a60a-7acd-8c9c29fba524',
  concept.id,
  'operation',
  '0.700',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '8d32d18a-51a5-5e75-89bd-08063a688558',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":false,"document_key":"barry_v2_manual:9ba1297a-2aa6-de38-b971-ad38336442ad","matched_name":"adjust","document_role":"workshop_manual"}'::jsonb
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
  'ed646683-05b6-a60a-7acd-8c9c29fba524',
  concept.id,
  'operation',
  '0.700',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '8d32d18a-51a5-5e75-89bd-08063a688558',
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
  'ed646683-05b6-a60a-7acd-8c9c29fba524',
  concept.id,
  'mentioned_component',
  '0.850',
  'deterministic',
  'approved',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '8d32d18a-51a5-5e75-89bd-08063a688558',
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
  'edbd955f-8c15-9f55-eab2-0416d9551186',
  concept.id,
  'primary_subject',
  '0.850',
  'deterministic',
  'approved',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'dbe4acfa-88e6-5cde-8682-13c692bf5319',
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
  'edbd955f-8c15-9f55-eab2-0416d9551186',
  concept.id,
  'property',
  '0.700',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'dbe4acfa-88e6-5cde-8682-13c692bf5319',
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
  'edbd955f-8c15-9f55-eab2-0416d9551186',
  concept.id,
  'operation',
  '0.700',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'dbe4acfa-88e6-5cde-8682-13c692bf5319',
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
  'edbd955f-8c15-9f55-eab2-0416d9551186',
  concept.id,
  'operation',
  '0.700',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'dbe4acfa-88e6-5cde-8682-13c692bf5319',
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
  'edbd955f-8c15-9f55-eab2-0416d9551186',
  concept.id,
  'mentioned_component',
  '0.850',
  'deterministic',
  'approved',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'dbe4acfa-88e6-5cde-8682-13c692bf5319',
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
  'eec1df55-af8e-b895-dbde-139100290ae2',
  concept.id,
  'primary_subject',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '91130252-1aaa-55b6-89bd-ab5659612980',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"barry_v2_manual:af332a3b-25a2-3589-3a79-e73507003464","matched_name":"pitman arm","document_role":"workshop_manual"}'::jsonb
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
  'eec1df55-af8e-b895-dbde-139100290ae2',
  concept.id,
  'property',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '91130252-1aaa-55b6-89bd-ab5659612980',
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
  'eec1df55-af8e-b895-dbde-139100290ae2',
  concept.id,
  'operation',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '91130252-1aaa-55b6-89bd-ab5659612980',
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
  'eec1df55-af8e-b895-dbde-139100290ae2',
  concept.id,
  'mentioned_component',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '91130252-1aaa-55b6-89bd-ab5659612980',
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
  'eec1df55-af8e-b895-dbde-139100290ae2',
  concept.id,
  'mentioned_component',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '91130252-1aaa-55b6-89bd-ab5659612980',
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
  'f0406c4b-82c0-eb1c-5a0f-5a73fc4c0974',
  concept.id,
  'operation',
  '0.700',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '9bdf843f-5ac1-516d-8bd6-f0221b9166fb',
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
  'f0406c4b-82c0-eb1c-5a0f-5a73fc4c0974',
  concept.id,
  'mentioned_component',
  '0.850',
  'deterministic',
  'approved',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '9bdf843f-5ac1-516d-8bd6-f0221b9166fb',
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
  'f0406c4b-82c0-eb1c-5a0f-5a73fc4c0974',
  concept.id,
  'mentioned_component',
  '0.700',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '9bdf843f-5ac1-516d-8bd6-f0221b9166fb',
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
  'f0406c4b-82c0-eb1c-5a0f-5a73fc4c0974',
  concept.id,
  'primary_subject',
  '0.850',
  'deterministic',
  'approved',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '9bdf843f-5ac1-516d-8bd6-f0221b9166fb',
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
  'f0406c4b-82c0-eb1c-5a0f-5a73fc4c0974',
  concept.id,
  'property',
  '0.850',
  'deterministic',
  'approved',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '9bdf843f-5ac1-516d-8bd6-f0221b9166fb',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"barry_v2_manual:af332a3b-25a2-3589-3a79-e73507003464","matched_name":"torque","document_role":"workshop_manual"}'::jsonb
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
  'f0406c4b-82c0-eb1c-5a0f-5a73fc4c0974',
  concept.id,
  'operation',
  '0.700',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '9bdf843f-5ac1-516d-8bd6-f0221b9166fb',
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
  'f0406c4b-82c0-eb1c-5a0f-5a73fc4c0974',
  concept.id,
  'operation',
  '0.700',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '9bdf843f-5ac1-516d-8bd6-f0221b9166fb',
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
  'f063da85-cb63-0b78-d4c8-8451e976be27',
  concept.id,
  'operation',
  '0.700',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '636f5774-f1b1-5271-82b2-3f8b00580802',
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
  'f063da85-cb63-0b78-d4c8-8451e976be27',
  concept.id,
  'primary_subject',
  '0.850',
  'deterministic',
  'approved',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '636f5774-f1b1-5271-82b2-3f8b00580802',
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
  'f063da85-cb63-0b78-d4c8-8451e976be27',
  concept.id,
  'mentioned_component',
  '0.700',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '636f5774-f1b1-5271-82b2-3f8b00580802',
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
  'f063da85-cb63-0b78-d4c8-8451e976be27',
  concept.id,
  'mentioned_component',
  '0.700',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '636f5774-f1b1-5271-82b2-3f8b00580802',
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
  'f063da85-cb63-0b78-d4c8-8451e976be27',
  concept.id,
  'property',
  '0.700',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '636f5774-f1b1-5271-82b2-3f8b00580802',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":false,"document_key":"barry_v2_manual:9ba1297a-2aa6-de38-b971-ad38336442ad","matched_name":"part number","document_role":"workshop_manual"}'::jsonb
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
  'f063da85-cb63-0b78-d4c8-8451e976be27',
  concept.id,
  'operation',
  '0.700',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '636f5774-f1b1-5271-82b2-3f8b00580802',
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
  'f063da85-cb63-0b78-d4c8-8451e976be27',
  concept.id,
  'operation',
  '0.700',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '636f5774-f1b1-5271-82b2-3f8b00580802',
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
  'f19bfa6f-204a-8883-b3fd-b392aa33ef8a',
  concept.id,
  'mentioned_component',
  '0.700',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '1f921ecf-fb73-57c5-8ada-8cf15ed901c1',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":false,"document_key":"barry_v2_manual:9ba1297a-2aa6-de38-b971-ad38336442ad","matched_name":"engine","document_role":"workshop_manual"}'::jsonb
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
  'f19bfa6f-204a-8883-b3fd-b392aa33ef8a',
  concept.id,
  'primary_subject',
  '0.850',
  'deterministic',
  'approved',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '1f921ecf-fb73-57c5-8ada-8cf15ed901c1',
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
  'f19bfa6f-204a-8883-b3fd-b392aa33ef8a',
  concept.id,
  'value_context',
  '0.700',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '1f921ecf-fb73-57c5-8ada-8cf15ed901c1',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":false,"document_key":"barry_v2_manual:9ba1297a-2aa6-de38-b971-ad38336442ad","matched_name":"automatic transmission fluid","document_role":"workshop_manual"}'::jsonb
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
  'f19bfa6f-204a-8883-b3fd-b392aa33ef8a',
  concept.id,
  'property',
  '0.700',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '1f921ecf-fb73-57c5-8ada-8cf15ed901c1',
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
  'f19bfa6f-204a-8883-b3fd-b392aa33ef8a',
  concept.id,
  'mentioned_component',
  '0.850',
  'deterministic',
  'approved',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '1f921ecf-fb73-57c5-8ada-8cf15ed901c1',
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
  'f24c2cbf-72f3-1ebf-debb-cd30f3b013d7',
  concept.id,
  'mentioned_component',
  '0.850',
  'deterministic',
  'approved',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '40de26f5-d816-5fa2-8634-a39c74e022c4',
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
  'f24c2cbf-72f3-1ebf-debb-cd30f3b013d7',
  concept.id,
  'primary_subject',
  '0.850',
  'deterministic',
  'approved',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '40de26f5-d816-5fa2-8634-a39c74e022c4',
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
  'f24c2cbf-72f3-1ebf-debb-cd30f3b013d7',
  concept.id,
  'mentioned_component',
  '0.700',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '40de26f5-d816-5fa2-8634-a39c74e022c4',
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
  'f24c2cbf-72f3-1ebf-debb-cd30f3b013d7',
  concept.id,
  'value_context',
  '0.700',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '40de26f5-d816-5fa2-8634-a39c74e022c4',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":false,"document_key":"barry_v2_manual:af332a3b-25a2-3589-3a79-e73507003464","matched_name":"engine oil","document_role":"workshop_manual"}'::jsonb
FROM public.barry_semantic_concepts concept
WHERE concept.concept_key = 'fluid.engine_oil'
ON CONFLICT (source_type, source_record_id, concept_id, annotation_role, semantic_version_id)
DO UPDATE SET
  confidence = EXCLUDED.confidence,
  review_status = EXCLUDED.review_status,
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
  'f24c2cbf-72f3-1ebf-debb-cd30f3b013d7',
  concept.id,
  'property',
  '0.700',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '40de26f5-d816-5fa2-8634-a39c74e022c4',
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
  'f24c2cbf-72f3-1ebf-debb-cd30f3b013d7',
  concept.id,
  'mentioned_component',
  '0.700',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '40de26f5-d816-5fa2-8634-a39c74e022c4',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":false,"document_key":"barry_v2_manual:af332a3b-25a2-3589-3a79-e73507003464","matched_name":"transmission","document_role":"workshop_manual"}'::jsonb
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
  'f24c2cbf-72f3-1ebf-debb-cd30f3b013d7',
  concept.id,
  'mentioned_component',
  '0.700',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '40de26f5-d816-5fa2-8634-a39c74e022c4',
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
  'f87d01b6-a53b-74dc-0dcf-c9dec0c3ba3e',
  concept.id,
  'primary_subject',
  '0.850',
  'deterministic',
  'approved',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '29433b2a-542f-5bc2-8e1d-224b6f4d5e9a',
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
  'f87d01b6-a53b-74dc-0dcf-c9dec0c3ba3e',
  concept.id,
  'operation',
  '0.700',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '29433b2a-542f-5bc2-8e1d-224b6f4d5e9a',
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
  'f9c2ac39-d7f1-8ced-637c-9c6a0b685164',
  concept.id,
  'mentioned_component',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'faa6d5f1-cc37-5b9f-80c3-c29b950c92e9',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":false,"document_key":"barry_v2_manual:5c259d33-46d1-a74a-ef88-a4fabb23376f","matched_name":"engine","document_role":"workshop_manual"}'::jsonb
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
  'f9c2ac39-d7f1-8ced-637c-9c6a0b685164',
  concept.id,
  'primary_subject',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'faa6d5f1-cc37-5b9f-80c3-c29b950c92e9',
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
  'f9c2ac39-d7f1-8ced-637c-9c6a0b685164',
  concept.id,
  'property',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'faa6d5f1-cc37-5b9f-80c3-c29b950c92e9',
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
  'f9c2ac39-d7f1-8ced-637c-9c6a0b685164',
  concept.id,
  'operation',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'faa6d5f1-cc37-5b9f-80c3-c29b950c92e9',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":false,"document_key":"barry_v2_manual:5c259d33-46d1-a74a-ef88-a4fabb23376f","matched_name":"remove","document_role":"workshop_manual"}'::jsonb
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
  'f9c2ac39-d7f1-8ced-637c-9c6a0b685164',
  concept.id,
  'mentioned_component',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'faa6d5f1-cc37-5b9f-80c3-c29b950c92e9',
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
  'fe09344f-4fec-fdef-6ebf-73188b0dc48d',
  concept.id,
  'applicability',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '54e8e58a-60cb-509b-8aec-0532ede056fe',
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
  'fe09344f-4fec-fdef-6ebf-73188b0dc48d',
  concept.id,
  'mentioned_component',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '54e8e58a-60cb-509b-8aec-0532ede056fe',
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
  'fe09344f-4fec-fdef-6ebf-73188b0dc48d',
  concept.id,
  'property',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '54e8e58a-60cb-509b-8aec-0532ede056fe',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"barry_v2_manual:9ba1297a-2aa6-de38-b971-ad38336442ad","matched_name":"part number","document_role":"workshop_manual"}'::jsonb
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
  'fe09344f-4fec-fdef-6ebf-73188b0dc48d',
  concept.id,
  'property',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '54e8e58a-60cb-509b-8aec-0532ede056fe',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":false,"document_key":"barry_v2_manual:9ba1297a-2aa6-de38-b971-ad38336442ad","matched_name":"clearance","document_role":"workshop_manual"}'::jsonb
FROM public.barry_semantic_concepts concept
WHERE concept.concept_key = 'property.clearance'
ON CONFLICT (source_type, source_record_id, concept_id, annotation_role, semantic_version_id)
DO UPDATE SET
  confidence = EXCLUDED.confidence,
  review_status = EXCLUDED.review_status,
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
  'fe09344f-4fec-fdef-6ebf-73188b0dc48d',
  concept.id,
  'mentioned_component',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '54e8e58a-60cb-509b-8aec-0532ede056fe',
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
  'fe09344f-4fec-fdef-6ebf-73188b0dc48d',
  concept.id,
  'applicability',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '54e8e58a-60cb-509b-8aec-0532ede056fe',
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
  'fe3540f4-acef-4ff7-ce7e-407e301f913c',
  concept.id,
  'operation',
  '0.700',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '576f0fbb-7249-558c-8212-5bb8b834f51c',
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
  'fe3540f4-acef-4ff7-ce7e-407e301f913c',
  concept.id,
  'primary_subject',
  '0.850',
  'deterministic',
  'approved',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '576f0fbb-7249-558c-8212-5bb8b834f51c',
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
  'fe3540f4-acef-4ff7-ce7e-407e301f913c',
  concept.id,
  'mentioned_component',
  '0.700',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '576f0fbb-7249-558c-8212-5bb8b834f51c',
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
  'fe3540f4-acef-4ff7-ce7e-407e301f913c',
  concept.id,
  'property',
  '0.700',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '576f0fbb-7249-558c-8212-5bb8b834f51c',
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
  'fe3540f4-acef-4ff7-ce7e-407e301f913c',
  concept.id,
  'mentioned_component',
  '0.700',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '576f0fbb-7249-558c-8212-5bb8b834f51c',
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
  'ff422e69-06d4-3ad7-551e-4e8e32e6bc63',
  concept.id,
  'primary_subject',
  '0.900',
  'deterministic',
  'approved',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '40a55640-6896-55a9-8b01-521ac5b5ba55',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"barry_v2_manual:5c259d33-46d1-a74a-ef88-a4fabb23376f","matched_name":"sealing ring","document_role":"workshop_manual"}'::jsonb
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
  'ffac1d48-5a57-1906-8cab-f57b0ceb6b39',
  concept.id,
  'property',
  '0.700',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '87b46688-ed61-5169-8ff9-aa8366a04435',
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
  'ffac1d48-5a57-1906-8cab-f57b0ceb6b39',
  concept.id,
  'operation',
  '0.850',
  'deterministic',
  'approved',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '87b46688-ed61-5169-8ff9-aa8366a04435',
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
  'ffac1d48-5a57-1906-8cab-f57b0ceb6b39',
  concept.id,
  'operation',
  '0.850',
  'deterministic',
  'approved',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '87b46688-ed61-5169-8ff9-aa8366a04435',
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
  'manual_chunk',
  '08033247-8c1c-40e9-9872-e5a751061f2e',
  concept.id,
  'primary_subject',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '2d90e614-1651-5c09-8a0e-9cc35379e1d3',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"manual_chunks_document:406397b8-3fe4-4e9a-8dd5-f9677c61a3ae","matched_name":"portal hub","document_role":"workshop_manual"}'::jsonb
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
  'manual_chunk',
  '08033247-8c1c-40e9-9872-e5a751061f2e',
  concept.id,
  'operation',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '2d90e614-1651-5c09-8a0e-9cc35379e1d3',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":false,"document_key":"manual_chunks_document:406397b8-3fe4-4e9a-8dd5-f9677c61a3ae","matched_name":"remove","document_role":"workshop_manual"}'::jsonb
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
  'manual_chunk',
  '08033247-8c1c-40e9-9872-e5a751061f2e',
  concept.id,
  'mentioned_component',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '2d90e614-1651-5c09-8a0e-9cc35379e1d3',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":false,"document_key":"manual_chunks_document:406397b8-3fe4-4e9a-8dd5-f9677c61a3ae","matched_name":"steering","document_role":"workshop_manual"}'::jsonb
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
  'manual_chunk',
  '0a1f2c97-7e6a-4b31-9281-805bf80abc04',
  concept.id,
  'mentioned_component',
  '0.700',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'a33ad8d2-940a-54c0-826c-4c5c5e6b42bb',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":false,"document_key":"manual_chunks_document:406397b8-3fe4-4e9a-8dd5-f9677c61a3ae","matched_name":"engine","document_role":"workshop_manual"}'::jsonb
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
  'manual_chunk',
  '0a1f2c97-7e6a-4b31-9281-805bf80abc04',
  concept.id,
  'primary_subject',
  '0.850',
  'deterministic',
  'approved',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'a33ad8d2-940a-54c0-826c-4c5c5e6b42bb',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"manual_chunks_document:406397b8-3fe4-4e9a-8dd5-f9677c61a3ae","matched_name":"steering gear","document_role":"workshop_manual"}'::jsonb
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
  'manual_chunk',
  '0a1f2c97-7e6a-4b31-9281-805bf80abc04',
  concept.id,
  'value_context',
  '0.700',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'a33ad8d2-940a-54c0-826c-4c5c5e6b42bb',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":false,"document_key":"manual_chunks_document:406397b8-3fe4-4e9a-8dd5-f9677c61a3ae","matched_name":"automatic transmission fluid","document_role":"workshop_manual"}'::jsonb
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
  'manual_chunk',
  '0a1f2c97-7e6a-4b31-9281-805bf80abc04',
  concept.id,
  'property',
  '0.700',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'a33ad8d2-940a-54c0-826c-4c5c5e6b42bb',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":false,"document_key":"manual_chunks_document:406397b8-3fe4-4e9a-8dd5-f9677c61a3ae","matched_name":"torque","document_role":"workshop_manual"}'::jsonb
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
  'manual_chunk',
  '0a1f2c97-7e6a-4b31-9281-805bf80abc04',
  concept.id,
  'mentioned_component',
  '0.850',
  'deterministic',
  'approved',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'a33ad8d2-940a-54c0-826c-4c5c5e6b42bb',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"manual_chunks_document:406397b8-3fe4-4e9a-8dd5-f9677c61a3ae","matched_name":"steering","document_role":"workshop_manual"}'::jsonb
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
  'manual_chunk',
  '0b85a5b9-1c7d-49ee-8eb3-a81e8b5238c5',
  concept.id,
  'mentioned_component',
  '0.700',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'a797ef22-82e2-5753-874c-13e936e3e30e',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":false,"document_key":"manual_chunks_document:406397b8-3fe4-4e9a-8dd5-f9677c61a3ae","matched_name":"pitman arm","document_role":"workshop_manual"}'::jsonb
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
  'manual_chunk',
  '0b85a5b9-1c7d-49ee-8eb3-a81e8b5238c5',
  concept.id,
  'mentioned_component',
  '0.900',
  'deterministic',
  'approved',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'a797ef22-82e2-5753-874c-13e936e3e30e',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"manual_chunks_document:406397b8-3fe4-4e9a-8dd5-f9677c61a3ae","matched_name":"steering","document_role":"workshop_manual"}'::jsonb
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
  'manual_chunk',
  '0fbe156a-df46-4ba2-a2e4-733575ea7629',
  concept.id,
  'primary_subject',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '57fc1f4a-eaab-5c69-8666-06689ea3417d',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"manual_chunks_document:406397b8-3fe4-4e9a-8dd5-f9677c61a3ae","matched_name":"sealing ring","document_role":"workshop_manual"}'::jsonb
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
  'manual_chunk',
  '0fbe156a-df46-4ba2-a2e4-733575ea7629',
  concept.id,
  'primary_subject',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '57fc1f4a-eaab-5c69-8666-06689ea3417d',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"manual_chunks_document:406397b8-3fe4-4e9a-8dd5-f9677c61a3ae","matched_name":"portal hub","document_role":"workshop_manual"}'::jsonb
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
  'manual_chunk',
  '0fbe156a-df46-4ba2-a2e4-733575ea7629',
  concept.id,
  'mentioned_component',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '57fc1f4a-eaab-5c69-8666-06689ea3417d',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":false,"document_key":"manual_chunks_document:406397b8-3fe4-4e9a-8dd5-f9677c61a3ae","matched_name":"steering","document_role":"workshop_manual"}'::jsonb
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
  'manual_chunk',
  '1063185b-0705-40cd-90a4-f4bba447e718',
  concept.id,
  'mentioned_component',
  '0.900',
  'deterministic',
  'approved',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'd6dfb571-874e-5cb2-8593-4448bc1b1a2a',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"manual_chunks_document:57ae9d6c-64b7-45e7-92f0-799c4ff6caf2","matched_name":"steering","document_role":"parts_catalog"}'::jsonb
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
  'manual_chunk',
  '1063185b-0705-40cd-90a4-f4bba447e718',
  concept.id,
  'primary_subject',
  '0.900',
  'deterministic',
  'approved',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'd6dfb571-874e-5cb2-8593-4448bc1b1a2a',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"manual_chunks_document:57ae9d6c-64b7-45e7-92f0-799c4ff6caf2","matched_name":"power steering pump","document_role":"parts_catalog"}'::jsonb
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
  'manual_chunk',
  '141c6d1a-8239-422f-8522-e0021130870f',
  concept.id,
  'mentioned_component',
  '0.900',
  'deterministic',
  'approved',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '58e882b9-92eb-5459-8804-973b06def895',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"manual_chunks_document:57ae9d6c-64b7-45e7-92f0-799c4ff6caf2","matched_name":"steering","document_role":"parts_catalog"}'::jsonb
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
  'manual_chunk',
  '188ec67b-1dd1-4f49-89dc-f82330d735ae',
  concept.id,
  'mentioned_component',
  '0.700',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '99413407-d775-5962-87ac-cc068cd29edf',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":false,"document_key":"manual_chunks_document:406397b8-3fe4-4e9a-8dd5-f9677c61a3ae","matched_name":"pitman arm","document_role":"workshop_manual"}'::jsonb
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
  'manual_chunk',
  '188ec67b-1dd1-4f49-89dc-f82330d735ae',
  concept.id,
  'primary_subject',
  '0.850',
  'deterministic',
  'approved',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '99413407-d775-5962-87ac-cc068cd29edf',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"manual_chunks_document:406397b8-3fe4-4e9a-8dd5-f9677c61a3ae","matched_name":"steering gear","document_role":"workshop_manual"}'::jsonb
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
  'manual_chunk',
  '188ec67b-1dd1-4f49-89dc-f82330d735ae',
  concept.id,
  'mentioned_component',
  '0.850',
  'deterministic',
  'approved',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '99413407-d775-5962-87ac-cc068cd29edf',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"manual_chunks_document:406397b8-3fe4-4e9a-8dd5-f9677c61a3ae","matched_name":"steering","document_role":"workshop_manual"}'::jsonb
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
  'manual_chunk',
  '1e147827-3b52-44c4-bb86-782bf627f1e9',
  concept.id,
  'primary_subject',
  '0.900',
  'deterministic',
  'approved',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '9868d81e-20d7-50cd-8086-10ffab6b0769',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"manual_chunks_document:57ae9d6c-64b7-45e7-92f0-799c4ff6caf2","matched_name":"steering gear","document_role":"parts_catalog"}'::jsonb
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
  'manual_chunk',
  '1e147827-3b52-44c4-bb86-782bf627f1e9',
  concept.id,
  'mentioned_component',
  '0.900',
  'deterministic',
  'approved',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '9868d81e-20d7-50cd-8086-10ffab6b0769',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"manual_chunks_document:57ae9d6c-64b7-45e7-92f0-799c4ff6caf2","matched_name":"steering","document_role":"parts_catalog"}'::jsonb
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
  'manual_chunk',
  '1e147827-3b52-44c4-bb86-782bf627f1e9',
  concept.id,
  'mentioned_component',
  '0.700',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '9868d81e-20d7-50cd-8086-10ffab6b0769',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":false,"document_key":"manual_chunks_document:57ae9d6c-64b7-45e7-92f0-799c4ff6caf2","matched_name":"sealing ring","document_role":"parts_catalog"}'::jsonb
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
  'manual_chunk',
  '1e147827-3b52-44c4-bb86-782bf627f1e9',
  concept.id,
  'primary_subject',
  '0.900',
  'deterministic',
  'approved',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '9868d81e-20d7-50cd-8086-10ffab6b0769',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"manual_chunks_document:57ae9d6c-64b7-45e7-92f0-799c4ff6caf2","matched_name":"repair kit","document_role":"parts_catalog"}'::jsonb
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
  'manual_chunk',
  '20b2d5d7-dd8d-4b85-a8ff-10cb88a73f3f',
  concept.id,
  'mentioned_component',
  '0.850',
  'deterministic',
  'approved',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '4d1d002a-e516-5d89-8f8d-dc20b92a2613',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"manual_chunks_document:406397b8-3fe4-4e9a-8dd5-f9677c61a3ae","matched_name":"steering","document_role":"workshop_manual"}'::jsonb
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
  'manual_chunk',
  '20b2d5d7-dd8d-4b85-a8ff-10cb88a73f3f',
  concept.id,
  'primary_subject',
  '0.850',
  'deterministic',
  'approved',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '4d1d002a-e516-5d89-8f8d-dc20b92a2613',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"manual_chunks_document:406397b8-3fe4-4e9a-8dd5-f9677c61a3ae","matched_name":"steering gear","document_role":"workshop_manual"}'::jsonb
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
  'manual_chunk',
  '20b2d5d7-dd8d-4b85-a8ff-10cb88a73f3f',
  concept.id,
  'property',
  '0.850',
  'deterministic',
  'approved',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '4d1d002a-e516-5d89-8f8d-dc20b92a2613',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"manual_chunks_document:406397b8-3fe4-4e9a-8dd5-f9677c61a3ae","matched_name":"torque","document_role":"workshop_manual"}'::jsonb
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
  'manual_chunk',
  '20b2d5d7-dd8d-4b85-a8ff-10cb88a73f3f',
  concept.id,
  'operation',
  '0.700',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '4d1d002a-e516-5d89-8f8d-dc20b92a2613',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":false,"document_key":"manual_chunks_document:406397b8-3fe4-4e9a-8dd5-f9677c61a3ae","matched_name":"inspect","document_role":"workshop_manual"}'::jsonb
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
  'manual_chunk',
  '24ab4e52-3fa4-4590-ba1e-90734c979859',
  concept.id,
  'operation',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '670f8f07-185b-5674-8407-8a2f4725e8e4',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":false,"document_key":"manual_chunks_document:406397b8-3fe4-4e9a-8dd5-f9677c61a3ae","matched_name":"check fluid level","document_role":"workshop_manual"}'::jsonb
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
  'manual_chunk',
  '24ab4e52-3fa4-4590-ba1e-90734c979859',
  concept.id,
  'operation',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '670f8f07-185b-5674-8407-8a2f4725e8e4',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":false,"document_key":"manual_chunks_document:406397b8-3fe4-4e9a-8dd5-f9677c61a3ae","matched_name":"adjust","document_role":"workshop_manual"}'::jsonb
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
  'manual_chunk',
  '24ab4e52-3fa4-4590-ba1e-90734c979859',
  concept.id,
  'operation',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '670f8f07-185b-5674-8407-8a2f4725e8e4',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":false,"document_key":"manual_chunks_document:406397b8-3fe4-4e9a-8dd5-f9677c61a3ae","matched_name":"inspect","document_role":"workshop_manual"}'::jsonb
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
  'manual_chunk',
  '24ab4e52-3fa4-4590-ba1e-90734c979859',
  concept.id,
  'mentioned_component',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '670f8f07-185b-5674-8407-8a2f4725e8e4',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":false,"document_key":"manual_chunks_document:406397b8-3fe4-4e9a-8dd5-f9677c61a3ae","matched_name":"engine","document_role":"workshop_manual"}'::jsonb
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
  'manual_chunk',
  '24ab4e52-3fa4-4590-ba1e-90734c979859',
  concept.id,
  'mentioned_component',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '670f8f07-185b-5674-8407-8a2f4725e8e4',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"manual_chunks_document:406397b8-3fe4-4e9a-8dd5-f9677c61a3ae","matched_name":"steering","document_role":"workshop_manual"}'::jsonb
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
  'manual_chunk',
  '24ab4e52-3fa4-4590-ba1e-90734c979859',
  concept.id,
  'primary_subject',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '670f8f07-185b-5674-8407-8a2f4725e8e4',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"manual_chunks_document:406397b8-3fe4-4e9a-8dd5-f9677c61a3ae","matched_name":"steering gear","document_role":"workshop_manual"}'::jsonb
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
  'manual_chunk',
  '24ab4e52-3fa4-4590-ba1e-90734c979859',
  concept.id,
  'property',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '670f8f07-185b-5674-8407-8a2f4725e8e4',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":false,"document_key":"manual_chunks_document:406397b8-3fe4-4e9a-8dd5-f9677c61a3ae","matched_name":"torque","document_role":"workshop_manual"}'::jsonb
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
  'manual_chunk',
  '24ab4e52-3fa4-4590-ba1e-90734c979859',
  concept.id,
  'operation',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '670f8f07-185b-5674-8407-8a2f4725e8e4',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":false,"document_key":"manual_chunks_document:406397b8-3fe4-4e9a-8dd5-f9677c61a3ae","matched_name":"bleed","document_role":"workshop_manual"}'::jsonb
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
  'manual_chunk',
  '2d48f4f6-3f19-4cc5-8cf2-e56ee27e1c6f',
  concept.id,
  'mentioned_component',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'ceda671f-f13a-5a37-83a7-ad3f46b79d21',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":false,"document_key":"manual_chunks_document:406397b8-3fe4-4e9a-8dd5-f9677c61a3ae","matched_name":"water pump","document_role":"workshop_manual"}'::jsonb
FROM public.barry_semantic_concepts concept
WHERE concept.concept_key = 'component.water_pump'
ON CONFLICT (source_type, source_record_id, concept_id, annotation_role, semantic_version_id)
DO UPDATE SET
  confidence = EXCLUDED.confidence,
  review_status = EXCLUDED.review_status,
  evidence_unit_id = EXCLUDED.evidence_unit_id,
  model_scope = EXCLUDED.model_scope,
  provenance = EXCLUDED.provenance;
INSERT INTO public.barry_evidence_concepts (
  source_type, source_record_id, concept_id, annotation_role, confidence,
  method, review_status, semantic_version_id, evidence_unit_id, model_scope,
  backfill_run_id, provenance
)
SELECT
  'manual_chunk',
  '2eacbd4f-2c8a-42ea-8b19-b2560acb1d58',
  concept.id,
  'mentioned_component',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '3ad78842-e00a-5571-855d-d5d61e50086c',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":false,"document_key":"manual_chunks_document:406397b8-3fe4-4e9a-8dd5-f9677c61a3ae","matched_name":"steering","document_role":"workshop_manual"}'::jsonb
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
  'manual_chunk',
  '2eacbd4f-2c8a-42ea-8b19-b2560acb1d58',
  concept.id,
  'mentioned_component',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '3ad78842-e00a-5571-855d-d5d61e50086c',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":false,"document_key":"manual_chunks_document:406397b8-3fe4-4e9a-8dd5-f9677c61a3ae","matched_name":"steering gear","document_role":"workshop_manual"}'::jsonb
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
  'manual_chunk',
  '2eacbd4f-2c8a-42ea-8b19-b2560acb1d58',
  concept.id,
  'mentioned_component',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '3ad78842-e00a-5571-855d-d5d61e50086c',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":false,"document_key":"manual_chunks_document:406397b8-3fe4-4e9a-8dd5-f9677c61a3ae","matched_name":"pitman arm","document_role":"workshop_manual"}'::jsonb
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
  'manual_chunk',
  '2eacbd4f-2c8a-42ea-8b19-b2560acb1d58',
  concept.id,
  'operation',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '3ad78842-e00a-5571-855d-d5d61e50086c',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"manual_chunks_document:406397b8-3fe4-4e9a-8dd5-f9677c61a3ae","matched_name":"remove","document_role":"workshop_manual"}'::jsonb
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
  'manual_chunk',
  '2eacbd4f-2c8a-42ea-8b19-b2560acb1d58',
  concept.id,
  'operation',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '3ad78842-e00a-5571-855d-d5d61e50086c',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"manual_chunks_document:406397b8-3fe4-4e9a-8dd5-f9677c61a3ae","matched_name":"inspect","document_role":"workshop_manual"}'::jsonb
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
  'manual_chunk',
  '3466d107-56b6-4eeb-9721-c69c15e5a7ab',
  concept.id,
  'mentioned_component',
  '0.850',
  'deterministic',
  'approved',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '38629a9a-03c3-5002-85e2-7e994c2a77c3',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"manual_chunks_document:406397b8-3fe4-4e9a-8dd5-f9677c61a3ae","matched_name":"steering","document_role":"workshop_manual"}'::jsonb
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
  'manual_chunk',
  '3466d107-56b6-4eeb-9721-c69c15e5a7ab',
  concept.id,
  'operation',
  '0.700',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '38629a9a-03c3-5002-85e2-7e994c2a77c3',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":false,"document_key":"manual_chunks_document:406397b8-3fe4-4e9a-8dd5-f9677c61a3ae","matched_name":"inspect","document_role":"workshop_manual"}'::jsonb
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
  'manual_chunk',
  '3466d107-56b6-4eeb-9721-c69c15e5a7ab',
  concept.id,
  'property',
  '0.850',
  'deterministic',
  'approved',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '38629a9a-03c3-5002-85e2-7e994c2a77c3',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"manual_chunks_document:406397b8-3fe4-4e9a-8dd5-f9677c61a3ae","matched_name":"torque","document_role":"workshop_manual"}'::jsonb
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
  'manual_chunk',
  '3466d107-56b6-4eeb-9721-c69c15e5a7ab',
  concept.id,
  'mentioned_component',
  '0.700',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '38629a9a-03c3-5002-85e2-7e994c2a77c3',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":false,"document_key":"manual_chunks_document:406397b8-3fe4-4e9a-8dd5-f9677c61a3ae","matched_name":"steering gear","document_role":"workshop_manual"}'::jsonb
FROM public.barry_semantic_concepts concept
WHERE concept.concept_key = 'component.steering_gear'
ON CONFLICT (source_type, source_record_id, concept_id, annotation_role, semantic_version_id)
DO UPDATE SET
  confidence = EXCLUDED.confidence,
  review_status = EXCLUDED.review_status,
  evidence_unit_id = EXCLUDED.evidence_unit_id,
  model_scope = EXCLUDED.model_scope,
  provenance = EXCLUDED.provenance;
COMMIT;
