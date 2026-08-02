BEGIN;

INSERT INTO public.barry_evidence_concepts (
  source_type, source_record_id, concept_id, annotation_role, confidence,
  method, review_status, semantic_version_id, evidence_unit_id, model_scope,
  backfill_run_id, provenance
)
SELECT
  'manual_chunk',
  '3a040598-2a35-41f7-8a64-9a01310be9bc',
  concept.id,
  'operation',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'ef983b3d-fe97-578f-8de7-a9cc718abc68',
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
  '3a040598-2a35-41f7-8a64-9a01310be9bc',
  concept.id,
  'primary_subject',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'ef983b3d-fe97-578f-8de7-a9cc718abc68',
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
  '3a040598-2a35-41f7-8a64-9a01310be9bc',
  concept.id,
  'property',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'ef983b3d-fe97-578f-8de7-a9cc718abc68',
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
  '3a040598-2a35-41f7-8a64-9a01310be9bc',
  concept.id,
  'mentioned_component',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'ef983b3d-fe97-578f-8de7-a9cc718abc68',
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
  '3a040598-2a35-41f7-8a64-9a01310be9bc',
  concept.id,
  'mentioned_component',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'ef983b3d-fe97-578f-8de7-a9cc718abc68',
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
  '3be344a8-332b-498d-b09e-02effd4ee75e',
  concept.id,
  'mentioned_component',
  '0.700',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '2726ef85-cd56-5599-8061-ea7de3f25185',
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
  '3be344a8-332b-498d-b09e-02effd4ee75e',
  concept.id,
  'mentioned_component',
  '0.900',
  'deterministic',
  'approved',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '2726ef85-cd56-5599-8061-ea7de3f25185',
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
  '3be344a8-332b-498d-b09e-02effd4ee75e',
  concept.id,
  'mentioned_component',
  '0.700',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '2726ef85-cd56-5599-8061-ea7de3f25185',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":false,"document_key":"manual_chunks_document:57ae9d6c-64b7-45e7-92f0-799c4ff6caf2","matched_name":"steering gear","document_role":"parts_catalog"}'::jsonb
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
  '4398868d-7178-4b0a-bae2-7ed4f35c96c4',
  concept.id,
  'operation',
  '0.850',
  'deterministic',
  'approved',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'c2f14b21-c163-526e-8b27-13f296f36c79',
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
  '4398868d-7178-4b0a-bae2-7ed4f35c96c4',
  concept.id,
  'property',
  '0.700',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'c2f14b21-c163-526e-8b27-13f296f36c79',
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
  '4398868d-7178-4b0a-bae2-7ed4f35c96c4',
  concept.id,
  'primary_subject',
  '0.850',
  'deterministic',
  'approved',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'c2f14b21-c163-526e-8b27-13f296f36c79',
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
  '4398868d-7178-4b0a-bae2-7ed4f35c96c4',
  concept.id,
  'mentioned_component',
  '0.850',
  'deterministic',
  'approved',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'c2f14b21-c163-526e-8b27-13f296f36c79',
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
  '4398868d-7178-4b0a-bae2-7ed4f35c96c4',
  concept.id,
  'operation',
  '0.700',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'c2f14b21-c163-526e-8b27-13f296f36c79',
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
  '4b8fc0c8-8381-4693-9348-d5a9e9dacdc8',
  concept.id,
  'mentioned_component',
  '0.700',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'a060ffeb-299a-5fe2-8822-ac7b5522b616',
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
  '4b8fc0c8-8381-4693-9348-d5a9e9dacdc8',
  concept.id,
  'primary_subject',
  '0.850',
  'deterministic',
  'approved',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'a060ffeb-299a-5fe2-8822-ac7b5522b616',
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
  '4b8fc0c8-8381-4693-9348-d5a9e9dacdc8',
  concept.id,
  'mentioned_component',
  '0.700',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'a060ffeb-299a-5fe2-8822-ac7b5522b616',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":false,"document_key":"manual_chunks_document:406397b8-3fe4-4e9a-8dd5-f9677c61a3ae","matched_name":"sealing ring","document_role":"workshop_manual"}'::jsonb
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
  '4b8fc0c8-8381-4693-9348-d5a9e9dacdc8',
  concept.id,
  'property',
  '0.700',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'a060ffeb-299a-5fe2-8822-ac7b5522b616',
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
  '4b8fc0c8-8381-4693-9348-d5a9e9dacdc8',
  concept.id,
  'operation',
  '0.700',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'a060ffeb-299a-5fe2-8822-ac7b5522b616',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":false,"document_key":"manual_chunks_document:406397b8-3fe4-4e9a-8dd5-f9677c61a3ae","matched_name":"install","document_role":"workshop_manual"}'::jsonb
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
  'manual_chunk',
  '51734ea0-76f1-45af-a0d3-da23a2aa5a1d',
  concept.id,
  'mentioned_component',
  '0.700',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'a3ee483d-60fb-53f3-870d-1ca9571e7975',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":false,"document_key":"manual_chunks_document:57ae9d6c-64b7-45e7-92f0-799c4ff6caf2","matched_name":"pitman arm","document_role":"parts_catalog"}'::jsonb
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
  '51734ea0-76f1-45af-a0d3-da23a2aa5a1d',
  concept.id,
  'mentioned_component',
  '0.900',
  'deterministic',
  'approved',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'a3ee483d-60fb-53f3-870d-1ca9571e7975',
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
  '543771de-8418-4b77-a6ae-685115b702b8',
  concept.id,
  'primary_subject',
  '0.900',
  'deterministic',
  'approved',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'a9970449-d906-567a-8576-9ef00f021b96',
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
  '543771de-8418-4b77-a6ae-685115b702b8',
  concept.id,
  'primary_subject',
  '0.900',
  'deterministic',
  'approved',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'a9970449-d906-567a-8576-9ef00f021b96',
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
  '543771de-8418-4b77-a6ae-685115b702b8',
  concept.id,
  'mentioned_component',
  '0.900',
  'deterministic',
  'approved',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'a9970449-d906-567a-8576-9ef00f021b96',
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
  '5bc40ac6-5615-4ed5-a0af-924d7da91701',
  concept.id,
  'primary_subject',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '14c5409e-7dc2-53d3-86bd-ffd8a7d1ae25',
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
  '5bc40ac6-5615-4ed5-a0af-924d7da91701',
  concept.id,
  'operation',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '14c5409e-7dc2-53d3-86bd-ffd8a7d1ae25',
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
  '5d5e7fb6-4adb-431c-b2ec-cfa3fc7209b8',
  concept.id,
  'primary_subject',
  '0.850',
  'deterministic',
  'approved',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '5e253d92-1c6d-566e-8628-17104c466f4a',
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
  '5d5e7fb6-4adb-431c-b2ec-cfa3fc7209b8',
  concept.id,
  'mentioned_component',
  '0.700',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '5e253d92-1c6d-566e-8628-17104c466f4a',
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
  '5f6fb3d6-8ede-4628-82fb-8688a86b5b3f',
  concept.id,
  'operation',
  '0.700',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'd944b575-70f8-5a6e-8179-982073858ae8',
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
  '5f6fb3d6-8ede-4628-82fb-8688a86b5b3f',
  concept.id,
  'mentioned_component',
  '0.700',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'd944b575-70f8-5a6e-8179-982073858ae8',
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
  '5f6fb3d6-8ede-4628-82fb-8688a86b5b3f',
  concept.id,
  'mentioned_component',
  '0.850',
  'deterministic',
  'approved',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'd944b575-70f8-5a6e-8179-982073858ae8',
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
  '5f6fb3d6-8ede-4628-82fb-8688a86b5b3f',
  concept.id,
  'operation',
  '0.700',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'd944b575-70f8-5a6e-8179-982073858ae8',
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
  '5f6fb3d6-8ede-4628-82fb-8688a86b5b3f',
  concept.id,
  'primary_subject',
  '0.850',
  'deterministic',
  'approved',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'd944b575-70f8-5a6e-8179-982073858ae8',
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
  '5f6fb3d6-8ede-4628-82fb-8688a86b5b3f',
  concept.id,
  'property',
  '0.850',
  'deterministic',
  'approved',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'd944b575-70f8-5a6e-8179-982073858ae8',
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
  '5f6fb3d6-8ede-4628-82fb-8688a86b5b3f',
  concept.id,
  'operation',
  '0.700',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'd944b575-70f8-5a6e-8179-982073858ae8',
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
  '60fc07ca-d0ed-4243-aa00-60f78e275c52',
  concept.id,
  'mentioned_component',
  '0.700',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'ebd689ae-e19f-5a6c-89b1-5a829934a21c',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":false,"document_key":"manual_chunks_document:57ae9d6c-64b7-45e7-92f0-799c4ff6caf2","matched_name":"axles","document_role":"parts_catalog"}'::jsonb
FROM public.barry_semantic_concepts concept
WHERE concept.concept_key = 'vehicle_system.axles'
ON CONFLICT (source_type, source_record_id, concept_id, annotation_role, semantic_version_id)
DO UPDATE SET
  confidence = EXCLUDED.confidence,
  review_status = EXCLUDED.review_status,
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
  '644a3bd8-4c9c-447c-a280-fff39f982961',
  concept.id,
  'primary_subject',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '3c06301d-c710-5370-8f7c-6e07d9136367',
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
  '644a3bd8-4c9c-447c-a280-fff39f982961',
  concept.id,
  'mentioned_component',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '3c06301d-c710-5370-8f7c-6e07d9136367',
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
  '644a3bd8-4c9c-447c-a280-fff39f982961',
  concept.id,
  'operation',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '3c06301d-c710-5370-8f7c-6e07d9136367',
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
  '644a3bd8-4c9c-447c-a280-fff39f982961',
  concept.id,
  'property',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '3c06301d-c710-5370-8f7c-6e07d9136367',
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
  '644a3bd8-4c9c-447c-a280-fff39f982961',
  concept.id,
  'mentioned_component',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '3c06301d-c710-5370-8f7c-6e07d9136367',
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
  '666b439d-a973-45d6-8247-827af113341c',
  concept.id,
  'mentioned_component',
  '0.900',
  'deterministic',
  'approved',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '5f89f1a3-fa7c-55c0-8988-5e5559c53c26',
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
  '666b439d-a973-45d6-8247-827af113341c',
  concept.id,
  'primary_subject',
  '0.900',
  'deterministic',
  'approved',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '5f89f1a3-fa7c-55c0-8988-5e5559c53c26',
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
  '67a972e4-02df-4bd2-b26c-e1373f517b02',
  concept.id,
  'primary_subject',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '3eb6e7ee-5109-5881-8621-f46a2fd2e586',
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
  '67a972e4-02df-4bd2-b26c-e1373f517b02',
  concept.id,
  'mentioned_component',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '3eb6e7ee-5109-5881-8621-f46a2fd2e586',
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
  '685eab65-d43c-4462-9199-bc8819fb6388',
  concept.id,
  'primary_subject',
  '0.900',
  'deterministic',
  'approved',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '858e08c7-e2d7-5552-8cd6-af1c532c846c',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"manual_chunks_document:57ae9d6c-64b7-45e7-92f0-799c4ff6caf2","matched_name":"steering reservoir","document_role":"parts_catalog"}'::jsonb
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
  'manual_chunk',
  '685eab65-d43c-4462-9199-bc8819fb6388',
  concept.id,
  'mentioned_component',
  '0.900',
  'deterministic',
  'approved',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '858e08c7-e2d7-5552-8cd6-af1c532c846c',
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
  '6d922fa0-b9ad-4f06-9cde-b2a923da3f38',
  concept.id,
  'mentioned_component',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '3e3e61d7-89a4-57f3-8d95-aa051859d8bf',
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
  '6d922fa0-b9ad-4f06-9cde-b2a923da3f38',
  concept.id,
  'operation',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '3e3e61d7-89a4-57f3-8d95-aa051859d8bf',
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
  '6d922fa0-b9ad-4f06-9cde-b2a923da3f38',
  concept.id,
  'operation',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '3e3e61d7-89a4-57f3-8d95-aa051859d8bf',
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
  '6e65dded-f552-406d-b125-01c96b743047',
  concept.id,
  'primary_subject',
  '0.900',
  'deterministic',
  'approved',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '094ca5b1-4f89-5c37-836f-249139cd05c4',
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
  '6eb29f3e-51b4-4eb3-85fa-515d0ce5bd50',
  concept.id,
  'mentioned_component',
  '0.700',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '71591088-a5cd-5512-8779-8d46d4c7d908',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":false,"document_key":"manual_chunks_document:57ae9d6c-64b7-45e7-92f0-799c4ff6caf2","matched_name":"steering gear","document_role":"parts_catalog"}'::jsonb
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
  '6eb29f3e-51b4-4eb3-85fa-515d0ce5bd50',
  concept.id,
  'mentioned_component',
  '0.900',
  'deterministic',
  'approved',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '71591088-a5cd-5512-8779-8d46d4c7d908',
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
  '6eb29f3e-51b4-4eb3-85fa-515d0ce5bd50',
  concept.id,
  'primary_subject',
  '0.900',
  'deterministic',
  'approved',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '71591088-a5cd-5512-8779-8d46d4c7d908',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"manual_chunks_document:57ae9d6c-64b7-45e7-92f0-799c4ff6caf2","matched_name":"portal hub","document_role":"parts_catalog"}'::jsonb
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
  '6fcc6e62-36ad-495d-bfa5-624a9e645468',
  concept.id,
  'mentioned_component',
  '0.900',
  'deterministic',
  'approved',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'bffc5e98-79b7-5191-83e3-93c57e739e28',
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
  '71f978f7-bcfe-42f7-aa5f-73e356b186f5',
  concept.id,
  'primary_subject',
  '0.850',
  'deterministic',
  'approved',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '9552f9f8-db11-51d9-80f5-e6c56a7bb40d',
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
  '71f978f7-bcfe-42f7-aa5f-73e356b186f5',
  concept.id,
  'value_context',
  '0.700',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '9552f9f8-db11-51d9-80f5-e6c56a7bb40d',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":false,"document_key":"manual_chunks_document:406397b8-3fe4-4e9a-8dd5-f9677c61a3ae","matched_name":"engine oil","document_role":"workshop_manual"}'::jsonb
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
  'manual_chunk',
  '71f978f7-bcfe-42f7-aa5f-73e356b186f5',
  concept.id,
  'mentioned_component',
  '0.700',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '9552f9f8-db11-51d9-80f5-e6c56a7bb40d',
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
  '71f978f7-bcfe-42f7-aa5f-73e356b186f5',
  concept.id,
  'mentioned_component',
  '0.850',
  'deterministic',
  'approved',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '9552f9f8-db11-51d9-80f5-e6c56a7bb40d',
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
  '71f978f7-bcfe-42f7-aa5f-73e356b186f5',
  concept.id,
  'mentioned_component',
  '0.700',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '9552f9f8-db11-51d9-80f5-e6c56a7bb40d',
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
  '71f978f7-bcfe-42f7-aa5f-73e356b186f5',
  concept.id,
  'mentioned_component',
  '0.700',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '9552f9f8-db11-51d9-80f5-e6c56a7bb40d',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":false,"document_key":"manual_chunks_document:406397b8-3fe4-4e9a-8dd5-f9677c61a3ae","matched_name":"transmission","document_role":"workshop_manual"}'::jsonb
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
  'manual_chunk',
  '71f978f7-bcfe-42f7-aa5f-73e356b186f5',
  concept.id,
  'property',
  '0.700',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '9552f9f8-db11-51d9-80f5-e6c56a7bb40d',
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
  '75614c1b-9ea4-4e2a-9fd5-0cc2d6e3d6c9',
  concept.id,
  'primary_subject',
  '0.850',
  'deterministic',
  'approved',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '5195f2bd-d097-5936-8973-de9c9be699c4',
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
  '75614c1b-9ea4-4e2a-9fd5-0cc2d6e3d6c9',
  concept.id,
  'property',
  '0.700',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '5195f2bd-d097-5936-8973-de9c9be699c4',
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
  '773c91aa-c203-4688-bf84-e52b1b6ebee9',
  concept.id,
  'primary_subject',
  '0.900',
  'deterministic',
  'approved',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '8bfc2324-0e38-596f-805c-120cfb25d7cc',
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
  '773c91aa-c203-4688-bf84-e52b1b6ebee9',
  concept.id,
  'mentioned_component',
  '0.900',
  'deterministic',
  'approved',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '8bfc2324-0e38-596f-805c-120cfb25d7cc',
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
  '7b7e48f6-efaa-4c99-9133-4fa007dab613',
  concept.id,
  'primary_subject',
  '0.850',
  'deterministic',
  'approved',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '92fcbe79-492e-5c4b-8eaf-2135be5e228d',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"manual_chunks_document:406397b8-3fe4-4e9a-8dd5-f9677c61a3ae","matched_name":"differential","document_role":"workshop_manual"}'::jsonb
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
  'manual_chunk',
  '7b7e48f6-efaa-4c99-9133-4fa007dab613',
  concept.id,
  'operation',
  '0.850',
  'deterministic',
  'approved',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '92fcbe79-492e-5c4b-8eaf-2135be5e228d',
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
  '7bf1047d-b035-4860-ad83-d636672ac9ab',
  concept.id,
  'operation',
  '0.700',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '3fc2e4a2-e7f3-532c-8ef9-12e429989896',
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
  '7bf1047d-b035-4860-ad83-d636672ac9ab',
  concept.id,
  'operation',
  '0.700',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '3fc2e4a2-e7f3-532c-8ef9-12e429989896',
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
  '7bf1047d-b035-4860-ad83-d636672ac9ab',
  concept.id,
  'primary_subject',
  '0.850',
  'deterministic',
  'approved',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '3fc2e4a2-e7f3-532c-8ef9-12e429989896',
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
  '7bf1047d-b035-4860-ad83-d636672ac9ab',
  concept.id,
  'operation',
  '0.700',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '3fc2e4a2-e7f3-532c-8ef9-12e429989896',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":false,"document_key":"manual_chunks_document:406397b8-3fe4-4e9a-8dd5-f9677c61a3ae","matched_name":"install","document_role":"workshop_manual"}'::jsonb
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
  'manual_chunk',
  '7c6484e2-ad81-4a1f-bad6-56835c3e5f80',
  concept.id,
  'mentioned_component',
  '0.900',
  'deterministic',
  'approved',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '5bdac943-f3eb-544e-8e44-0a46b5232abf',
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
  '81ef3b59-2237-4252-a59e-8223ebf3d833',
  concept.id,
  'mentioned_component',
  '0.900',
  'deterministic',
  'approved',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '0008c84e-3d26-5776-8477-cb984c112c6a',
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
  '81ef3b59-2237-4252-a59e-8223ebf3d833',
  concept.id,
  'primary_subject',
  '0.900',
  'deterministic',
  'approved',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '0008c84e-3d26-5776-8477-cb984c112c6a',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"manual_chunks_document:57ae9d6c-64b7-45e7-92f0-799c4ff6caf2","matched_name":"steering reservoir","document_role":"parts_catalog"}'::jsonb
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
  'manual_chunk',
  '838aea2d-6546-466c-b835-41483aaab6b9',
  concept.id,
  'mentioned_component',
  '0.700',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '329ab37f-7098-5734-80c1-c853d11cd2bc',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":false,"document_key":"manual_chunks_document:406397b8-3fe4-4e9a-8dd5-f9677c61a3ae","matched_name":"sealing ring","document_role":"workshop_manual"}'::jsonb
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
  '838aea2d-6546-466c-b835-41483aaab6b9',
  concept.id,
  'operation',
  '0.850',
  'deterministic',
  'approved',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '329ab37f-7098-5734-80c1-c853d11cd2bc',
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
  '838aea2d-6546-466c-b835-41483aaab6b9',
  concept.id,
  'mentioned_component',
  '0.700',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '329ab37f-7098-5734-80c1-c853d11cd2bc',
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
  '838aea2d-6546-466c-b835-41483aaab6b9',
  concept.id,
  'operation',
  '0.850',
  'deterministic',
  'approved',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '329ab37f-7098-5734-80c1-c853d11cd2bc',
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
  '838aea2d-6546-466c-b835-41483aaab6b9',
  concept.id,
  'primary_subject',
  '0.850',
  'deterministic',
  'approved',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '329ab37f-7098-5734-80c1-c853d11cd2bc',
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
  '838aea2d-6546-466c-b835-41483aaab6b9',
  concept.id,
  'mentioned_component',
  '0.850',
  'deterministic',
  'approved',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '329ab37f-7098-5734-80c1-c853d11cd2bc',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"manual_chunks_document:406397b8-3fe4-4e9a-8dd5-f9677c61a3ae","matched_name":"puller","document_role":"workshop_manual"}'::jsonb
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
  'manual_chunk',
  '84e3c380-b84b-4b46-9b6c-f55ded0e263e',
  concept.id,
  'primary_subject',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '6a293679-4bfa-5a15-888e-8f6c1949a289',
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
  '84e3c380-b84b-4b46-9b6c-f55ded0e263e',
  concept.id,
  'operation',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '6a293679-4bfa-5a15-888e-8f6c1949a289',
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
  '882b864a-72a5-40eb-a2b6-737a1bb9192b',
  concept.id,
  'primary_subject',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'b99025ad-4b52-57fb-8058-1ddbf9d5dc1b',
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
  '882b864a-72a5-40eb-a2b6-737a1bb9192b',
  concept.id,
  'operation',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'b99025ad-4b52-57fb-8058-1ddbf9d5dc1b',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":false,"document_key":"manual_chunks_document:406397b8-3fe4-4e9a-8dd5-f9677c61a3ae","matched_name":"install","document_role":"workshop_manual"}'::jsonb
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
  'manual_chunk',
  '8ece9320-d935-4fa2-b21b-4096d3a67837',
  concept.id,
  'mentioned_component',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'a74d0d15-1def-52b3-89d1-02664db82597',
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
  '8ece9320-d935-4fa2-b21b-4096d3a67837',
  concept.id,
  'primary_subject',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'a74d0d15-1def-52b3-89d1-02664db82597',
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
  '8ece9320-d935-4fa2-b21b-4096d3a67837',
  concept.id,
  'operation',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'a74d0d15-1def-52b3-89d1-02664db82597',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"manual_chunks_document:406397b8-3fe4-4e9a-8dd5-f9677c61a3ae","matched_name":"install","document_role":"workshop_manual"}'::jsonb
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
  'manual_chunk',
  '91c9d422-025a-49db-a161-f1734780deb1',
  concept.id,
  'mentioned_component',
  '0.700',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'd2c96fe2-dbc8-51ae-80f8-04e03b7c6751',
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
  '91c9d422-025a-49db-a161-f1734780deb1',
  concept.id,
  'primary_subject',
  '0.900',
  'deterministic',
  'approved',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'd2c96fe2-dbc8-51ae-80f8-04e03b7c6751',
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
  '91c9d422-025a-49db-a161-f1734780deb1',
  concept.id,
  'mentioned_component',
  '0.900',
  'deterministic',
  'approved',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'd2c96fe2-dbc8-51ae-80f8-04e03b7c6751',
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
  '92dce396-66dc-4e2d-a609-5523ab1c8685',
  concept.id,
  'mentioned_component',
  '0.700',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '117b44f8-3664-575c-829d-12bd6b31dbe0',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":false,"document_key":"manual_chunks_document:406397b8-3fe4-4e9a-8dd5-f9677c61a3ae","matched_name":"sealing ring","document_role":"workshop_manual"}'::jsonb
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
  '92dce396-66dc-4e2d-a609-5523ab1c8685',
  concept.id,
  'applicability',
  '0.700',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '117b44f8-3664-575c-829d-12bd6b31dbe0',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":false,"document_key":"manual_chunks_document:406397b8-3fe4-4e9a-8dd5-f9677c61a3ae","matched_name":"U435","document_role":"workshop_manual"}'::jsonb
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
  'manual_chunk',
  '93e85951-7aaa-49bd-badf-1ad112b53972',
  concept.id,
  'operation',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '955c0f2c-cb94-58b5-8935-3d27a7614530',
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
  '93f096ce-5de4-4d33-bfb9-f632f8a122dd',
  concept.id,
  'mentioned_component',
  '0.900',
  'deterministic',
  'approved',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'cded524c-0785-50c4-8775-8d22cb886e87',
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
  '9633903c-273a-4b90-9c75-3c71f8fe0ef2',
  concept.id,
  'applicability',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '5913b425-3230-5b77-8c94-e5974460b64d',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"manual_chunks_document:406397b8-3fe4-4e9a-8dd5-f9677c61a3ae","matched_name":"U435","document_role":"workshop_manual"}'::jsonb
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
  'manual_chunk',
  '9633903c-273a-4b90-9c75-3c71f8fe0ef2',
  concept.id,
  'mentioned_component',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '5913b425-3230-5b77-8c94-e5974460b64d',
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
  '9633903c-273a-4b90-9c75-3c71f8fe0ef2',
  concept.id,
  'mentioned_component',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '5913b425-3230-5b77-8c94-e5974460b64d',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":false,"document_key":"manual_chunks_document:406397b8-3fe4-4e9a-8dd5-f9677c61a3ae","matched_name":"transmission","document_role":"workshop_manual"}'::jsonb
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
  'manual_chunk',
  '9633903c-273a-4b90-9c75-3c71f8fe0ef2',
  concept.id,
  'mentioned_component',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '5913b425-3230-5b77-8c94-e5974460b64d',
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
  '9633903c-273a-4b90-9c75-3c71f8fe0ef2',
  concept.id,
  'applicability',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '5913b425-3230-5b77-8c94-e5974460b64d',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":false,"document_key":"manual_chunks_document:406397b8-3fe4-4e9a-8dd5-f9677c61a3ae","matched_name":"U1700L","document_role":"workshop_manual"}'::jsonb
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
  'manual_chunk',
  '9909d56f-d711-497c-bb49-2747bce7b63f',
  concept.id,
  'operation',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'e4f3f205-0cd5-5e1e-836a-af8ad5d1e667',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"manual_chunks_document:406397b8-3fe4-4e9a-8dd5-f9677c61a3ae","matched_name":"adjust","document_role":"workshop_manual"}'::jsonb
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
  '9909d56f-d711-497c-bb49-2747bce7b63f',
  concept.id,
  'operation',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'e4f3f205-0cd5-5e1e-836a-af8ad5d1e667',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":false,"document_key":"manual_chunks_document:406397b8-3fe4-4e9a-8dd5-f9677c61a3ae","matched_name":"install","document_role":"workshop_manual"}'::jsonb
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
  'manual_chunk',
  '9cc02539-3a0a-46cf-9af4-563ebbc36b84',
  concept.id,
  'mentioned_component',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'd7d38d60-3d81-582e-8e62-62e17e561dbe',
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
  '9cc02539-3a0a-46cf-9af4-563ebbc36b84',
  concept.id,
  'mentioned_component',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'd7d38d60-3d81-582e-8e62-62e17e561dbe',
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
  '9cc02539-3a0a-46cf-9af4-563ebbc36b84',
  concept.id,
  'mentioned_component',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'd7d38d60-3d81-582e-8e62-62e17e561dbe',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":false,"document_key":"manual_chunks_document:406397b8-3fe4-4e9a-8dd5-f9677c61a3ae","matched_name":"transmission","document_role":"workshop_manual"}'::jsonb
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
  'manual_chunk',
  'a23debcb-c33a-4951-a8c3-8418205f10ea',
  concept.id,
  'property',
  '0.850',
  'deterministic',
  'approved',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '46279377-db33-5268-8738-80c7ffd99811',
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
  'a23debcb-c33a-4951-a8c3-8418205f10ea',
  concept.id,
  'mentioned_component',
  '0.700',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '46279377-db33-5268-8738-80c7ffd99811',
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
  'a23debcb-c33a-4951-a8c3-8418205f10ea',
  concept.id,
  'primary_subject',
  '0.850',
  'deterministic',
  'approved',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '46279377-db33-5268-8738-80c7ffd99811',
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
  'a23debcb-c33a-4951-a8c3-8418205f10ea',
  concept.id,
  'operation',
  '0.700',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '46279377-db33-5268-8738-80c7ffd99811',
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
  'a23debcb-c33a-4951-a8c3-8418205f10ea',
  concept.id,
  'mentioned_component',
  '0.850',
  'deterministic',
  'approved',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '46279377-db33-5268-8738-80c7ffd99811',
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
  'a800a6b7-fc60-4739-b292-76ab82a2937c',
  concept.id,
  'mentioned_component',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'fefb8c7f-51c9-5bc0-823a-94a1dc9e0461',
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
  'a800a6b7-fc60-4739-b292-76ab82a2937c',
  concept.id,
  'mentioned_component',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'fefb8c7f-51c9-5bc0-823a-94a1dc9e0461',
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
  'a800a6b7-fc60-4739-b292-76ab82a2937c',
  concept.id,
  'applicability',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'fefb8c7f-51c9-5bc0-823a-94a1dc9e0461',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":false,"document_key":"manual_chunks_document:406397b8-3fe4-4e9a-8dd5-f9677c61a3ae","matched_name":"U1700L","document_role":"workshop_manual"}'::jsonb
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
  'manual_chunk',
  'a800a6b7-fc60-4739-b292-76ab82a2937c',
  concept.id,
  'applicability',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'fefb8c7f-51c9-5bc0-823a-94a1dc9e0461',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"manual_chunks_document:406397b8-3fe4-4e9a-8dd5-f9677c61a3ae","matched_name":"U435","document_role":"workshop_manual"}'::jsonb
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
  'manual_chunk',
  'a9c8d9e9-0cc6-4e7a-a9a7-a3e05ca1800d',
  concept.id,
  'mentioned_component',
  '0.700',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'cbbe154d-e3dd-53b9-8d04-5cfe65026c70',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":false,"document_key":"manual_chunks_document:57ae9d6c-64b7-45e7-92f0-799c4ff6caf2","matched_name":"steering gear","document_role":"parts_catalog"}'::jsonb
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
  'a9c8d9e9-0cc6-4e7a-a9a7-a3e05ca1800d',
  concept.id,
  'primary_subject',
  '0.900',
  'deterministic',
  'approved',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'cbbe154d-e3dd-53b9-8d04-5cfe65026c70',
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
  'a9c8d9e9-0cc6-4e7a-a9a7-a3e05ca1800d',
  concept.id,
  'mentioned_component',
  '0.700',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'cbbe154d-e3dd-53b9-8d04-5cfe65026c70',
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
  'a9c8d9e9-0cc6-4e7a-a9a7-a3e05ca1800d',
  concept.id,
  'mentioned_component',
  '0.900',
  'deterministic',
  'approved',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'cbbe154d-e3dd-53b9-8d04-5cfe65026c70',
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
  'aa0ddb90-faf1-4fa6-92b4-b3a7f9848d65',
  concept.id,
  'primary_subject',
  '0.900',
  'deterministic',
  'approved',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '18a9664d-7764-57ea-8433-14954f55b61c',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"manual_chunks_document:406397b8-3fe4-4e9a-8dd5-f9677c61a3ae","matched_name":"repair kit","document_role":"workshop_manual"}'::jsonb
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
  'abc8923f-bd7a-4e5f-8ce7-8a9394b428dc',
  concept.id,
  'mentioned_component',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'f359b33a-d730-593a-8fe3-08255158911f',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":false,"document_key":"manual_chunks_document:406397b8-3fe4-4e9a-8dd5-f9677c61a3ae","matched_name":"sealing ring","document_role":"workshop_manual"}'::jsonb
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
  'abc8923f-bd7a-4e5f-8ce7-8a9394b428dc',
  concept.id,
  'mentioned_component',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'f359b33a-d730-593a-8fe3-08255158911f',
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
  'abc8923f-bd7a-4e5f-8ce7-8a9394b428dc',
  concept.id,
  'operation',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'f359b33a-d730-593a-8fe3-08255158911f',
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
  'abc8923f-bd7a-4e5f-8ce7-8a9394b428dc',
  concept.id,
  'operation',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'f359b33a-d730-593a-8fe3-08255158911f',
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
  'abc8923f-bd7a-4e5f-8ce7-8a9394b428dc',
  concept.id,
  'operation',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'f359b33a-d730-593a-8fe3-08255158911f',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":false,"document_key":"manual_chunks_document:406397b8-3fe4-4e9a-8dd5-f9677c61a3ae","matched_name":"install","document_role":"workshop_manual"}'::jsonb
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
  'manual_chunk',
  'abc8923f-bd7a-4e5f-8ce7-8a9394b428dc',
  concept.id,
  'property',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'f359b33a-d730-593a-8fe3-08255158911f',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":false,"document_key":"manual_chunks_document:406397b8-3fe4-4e9a-8dd5-f9677c61a3ae","matched_name":"part number","document_role":"workshop_manual"}'::jsonb
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
  'manual_chunk',
  'abc8923f-bd7a-4e5f-8ce7-8a9394b428dc',
  concept.id,
  'primary_subject',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'f359b33a-d730-593a-8fe3-08255158911f',
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
  'b1a4f1ff-dc05-47ff-97cd-0976b51bae30',
  concept.id,
  'mentioned_component',
  '0.900',
  'deterministic',
  'approved',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '2dafa4be-8468-52ba-8af6-8c5befad8e06',
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
  'b1a4f1ff-dc05-47ff-97cd-0976b51bae30',
  concept.id,
  'primary_subject',
  '0.900',
  'deterministic',
  'approved',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '2dafa4be-8468-52ba-8af6-8c5befad8e06',
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
  'b6575a08-549b-441c-b4ba-ee33e53663c0',
  concept.id,
  'primary_subject',
  '0.900',
  'deterministic',
  'approved',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '909409c5-3c14-5cbf-8855-740350d0eb40',
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
  'b6575a08-549b-441c-b4ba-ee33e53663c0',
  concept.id,
  'mentioned_component',
  '0.900',
  'deterministic',
  'approved',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '909409c5-3c14-5cbf-8855-740350d0eb40',
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
  'b6575a08-549b-441c-b4ba-ee33e53663c0',
  concept.id,
  'mentioned_component',
  '0.700',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '909409c5-3c14-5cbf-8855-740350d0eb40',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":false,"document_key":"manual_chunks_document:57ae9d6c-64b7-45e7-92f0-799c4ff6caf2","matched_name":"repair kit","document_role":"parts_catalog"}'::jsonb
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
  'bbb3bece-70b1-4eda-88aa-09c07ffd9a2f',
  concept.id,
  'mentioned_component',
  '0.900',
  'deterministic',
  'approved',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'e221419b-02f4-516a-847e-e751c7b69f8e',
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
  'bbb3bece-70b1-4eda-88aa-09c07ffd9a2f',
  concept.id,
  'primary_subject',
  '0.900',
  'deterministic',
  'approved',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'e221419b-02f4-516a-847e-e751c7b69f8e',
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
  'bbb3bece-70b1-4eda-88aa-09c07ffd9a2f',
  concept.id,
  'primary_subject',
  '0.900',
  'deterministic',
  'approved',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'e221419b-02f4-516a-847e-e751c7b69f8e',
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
  'bcdba8c0-cc2a-4928-bd3c-5e859189f98e',
  concept.id,
  'primary_subject',
  '0.850',
  'deterministic',
  'approved',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '8a0f0d39-bfc4-581e-8b5a-9207ac25eb46',
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
  'bcdba8c0-cc2a-4928-bd3c-5e859189f98e',
  concept.id,
  'operation',
  '0.700',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '8a0f0d39-bfc4-581e-8b5a-9207ac25eb46',
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
  'bd8e2a21-039d-4937-abab-435e89d7d260',
  concept.id,
  'primary_subject',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'dce7e4bc-7898-5a7b-818a-506638b3d8b6',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"manual_chunks_document:406397b8-3fe4-4e9a-8dd5-f9677c61a3ae","matched_name":"differential","document_role":"workshop_manual"}'::jsonb
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
  'manual_chunk',
  'bd8e2a21-039d-4937-abab-435e89d7d260',
  concept.id,
  'applicability',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'dce7e4bc-7898-5a7b-818a-506638b3d8b6',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":false,"document_key":"manual_chunks_document:406397b8-3fe4-4e9a-8dd5-f9677c61a3ae","matched_name":"U435","document_role":"workshop_manual"}'::jsonb
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
  'manual_chunk',
  'bd8e2a21-039d-4937-abab-435e89d7d260',
  concept.id,
  'operation',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'dce7e4bc-7898-5a7b-818a-506638b3d8b6',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":false,"document_key":"manual_chunks_document:406397b8-3fe4-4e9a-8dd5-f9677c61a3ae","matched_name":"install","document_role":"workshop_manual"}'::jsonb
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
  'manual_chunk',
  'bd8e2a21-039d-4937-abab-435e89d7d260',
  concept.id,
  'property',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'dce7e4bc-7898-5a7b-818a-506638b3d8b6',
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
  'd2394cb5-6a4e-4db6-adc4-ec57cfd1c0d0',
  concept.id,
  'mentioned_component',
  '0.900',
  'deterministic',
  'approved',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'aa91bf24-5482-5b9c-8299-ed1979070193',
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
  'd2ec1434-7ddb-4b96-9483-c11eeef37dc9',
  concept.id,
  'primary_subject',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '786ab3ee-196b-5012-8df3-ea398250f7af',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"manual_chunks_document:406397b8-3fe4-4e9a-8dd5-f9677c61a3ae","matched_name":"power steering pump","document_role":"workshop_manual"}'::jsonb
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
  'd2ec1434-7ddb-4b96-9483-c11eeef37dc9',
  concept.id,
  'mentioned_component',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '786ab3ee-196b-5012-8df3-ea398250f7af',
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
  'd9f68ff2-6825-49a1-9cce-55e41b6a0191',
  concept.id,
  'operation',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '89c7a78b-4479-594f-8c16-2f4dbaa8a90b',
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
  'd9f68ff2-6825-49a1-9cce-55e41b6a0191',
  concept.id,
  'property',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '89c7a78b-4479-594f-8c16-2f4dbaa8a90b',
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
  'd9f68ff2-6825-49a1-9cce-55e41b6a0191',
  concept.id,
  'property',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '89c7a78b-4479-594f-8c16-2f4dbaa8a90b',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":false,"document_key":"manual_chunks_document:406397b8-3fe4-4e9a-8dd5-f9677c61a3ae","matched_name":"part number","document_role":"workshop_manual"}'::jsonb
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
  'manual_chunk',
  'd9f68ff2-6825-49a1-9cce-55e41b6a0191',
  concept.id,
  'mentioned_component',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '89c7a78b-4479-594f-8c16-2f4dbaa8a90b',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":false,"document_key":"manual_chunks_document:406397b8-3fe4-4e9a-8dd5-f9677c61a3ae","matched_name":"puller","document_role":"workshop_manual"}'::jsonb
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
  'manual_chunk',
  'd9f68ff2-6825-49a1-9cce-55e41b6a0191',
  concept.id,
  'mentioned_component',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '89c7a78b-4479-594f-8c16-2f4dbaa8a90b',
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
  'd9f68ff2-6825-49a1-9cce-55e41b6a0191',
  concept.id,
  'mentioned_component',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '89c7a78b-4479-594f-8c16-2f4dbaa8a90b',
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
  'dd4a0c88-c0b8-49a1-b007-a34c4b4192af',
  concept.id,
  'mentioned_component',
  '0.900',
  'deterministic',
  'approved',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '0d6f956d-c53d-5502-8d10-cc1b5c579b05',
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
  'dd4a0c88-c0b8-49a1-b007-a34c4b4192af',
  concept.id,
  'primary_subject',
  '0.900',
  'deterministic',
  'approved',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '0d6f956d-c53d-5502-8d10-cc1b5c579b05',
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
  'dd4a0c88-c0b8-49a1-b007-a34c4b4192af',
  concept.id,
  'mentioned_component',
  '0.700',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '0d6f956d-c53d-5502-8d10-cc1b5c579b05',
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
  'ddf27575-717c-4468-8b08-edec9a2d661c',
  concept.id,
  'primary_subject',
  '0.850',
  'deterministic',
  'approved',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '28b8e078-33b2-5214-8842-e2a0dbc6cb83',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"manual_chunks_document:406397b8-3fe4-4e9a-8dd5-f9677c61a3ae","matched_name":"differential","document_role":"workshop_manual"}'::jsonb
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
  'manual_chunk',
  'ddf27575-717c-4468-8b08-edec9a2d661c',
  concept.id,
  'property',
  '0.850',
  'deterministic',
  'approved',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '28b8e078-33b2-5214-8842-e2a0dbc6cb83',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"manual_chunks_document:406397b8-3fe4-4e9a-8dd5-f9677c61a3ae","matched_name":"operating pressure","document_role":"workshop_manual"}'::jsonb
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
  'manual_chunk',
  'df4fd78f-be12-4cd5-8a9c-1a5589e72f8b',
  concept.id,
  'operation',
  '0.850',
  'deterministic',
  'approved',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '943301b6-567e-566f-8403-4656b2e9415e',
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
  'df4fd78f-be12-4cd5-8a9c-1a5589e72f8b',
  concept.id,
  'property',
  '0.850',
  'deterministic',
  'approved',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '943301b6-567e-566f-8403-4656b2e9415e',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"manual_chunks_document:406397b8-3fe4-4e9a-8dd5-f9677c61a3ae","matched_name":"operating pressure","document_role":"workshop_manual"}'::jsonb
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
  'manual_chunk',
  'df798df4-b14a-487e-b45a-bf08bc4b49b0',
  concept.id,
  'property',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '5f90ad36-1f70-5eb2-85a2-4fae3376e289',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"manual_chunks_document:406397b8-3fe4-4e9a-8dd5-f9677c61a3ae","matched_name":"part number","document_role":"workshop_manual"}'::jsonb
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
  'manual_chunk',
  'df798df4-b14a-487e-b45a-bf08bc4b49b0',
  concept.id,
  'applicability',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '5f90ad36-1f70-5eb2-85a2-4fae3376e289',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"manual_chunks_document:406397b8-3fe4-4e9a-8dd5-f9677c61a3ae","matched_name":"U435","document_role":"workshop_manual"}'::jsonb
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
  'manual_chunk',
  'df798df4-b14a-487e-b45a-bf08bc4b49b0',
  concept.id,
  'applicability',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '5f90ad36-1f70-5eb2-85a2-4fae3376e289',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":false,"document_key":"manual_chunks_document:406397b8-3fe4-4e9a-8dd5-f9677c61a3ae","matched_name":"U1700L","document_role":"workshop_manual"}'::jsonb
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
  'manual_chunk',
  'df798df4-b14a-487e-b45a-bf08bc4b49b0',
  concept.id,
  'mentioned_component',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '5f90ad36-1f70-5eb2-85a2-4fae3376e289',
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
  'df798df4-b14a-487e-b45a-bf08bc4b49b0',
  concept.id,
  'property',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '5f90ad36-1f70-5eb2-85a2-4fae3376e289',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":false,"document_key":"manual_chunks_document:406397b8-3fe4-4e9a-8dd5-f9677c61a3ae","matched_name":"clearance","document_role":"workshop_manual"}'::jsonb
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
  'manual_chunk',
  'df798df4-b14a-487e-b45a-bf08bc4b49b0',
  concept.id,
  'mentioned_component',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '5f90ad36-1f70-5eb2-85a2-4fae3376e289',
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
  'df863edc-7f53-4415-a7b6-5acebece145d',
  concept.id,
  'operation',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'cfd12153-c4e9-5f31-86dd-fd659a773219',
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
  'df863edc-7f53-4415-a7b6-5acebece145d',
  concept.id,
  'property',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'cfd12153-c4e9-5f31-86dd-fd659a773219',
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
  'df863edc-7f53-4415-a7b6-5acebece145d',
  concept.id,
  'operation',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'cfd12153-c4e9-5f31-86dd-fd659a773219',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"manual_chunks_document:406397b8-3fe4-4e9a-8dd5-f9677c61a3ae","matched_name":"adjust","document_role":"workshop_manual"}'::jsonb
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
  'e434ab88-0302-42e1-92ec-fa0b16084025',
  concept.id,
  'primary_subject',
  '0.850',
  'deterministic',
  'approved',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'a356bd40-e45c-5f0e-8288-e28fdb8952ee',
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
  'e434ab88-0302-42e1-92ec-fa0b16084025',
  concept.id,
  'mentioned_component',
  '0.850',
  'deterministic',
  'approved',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'a356bd40-e45c-5f0e-8288-e28fdb8952ee',
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
  'e434ab88-0302-42e1-92ec-fa0b16084025',
  concept.id,
  'property',
  '0.700',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'a356bd40-e45c-5f0e-8288-e28fdb8952ee',
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
  'e434ab88-0302-42e1-92ec-fa0b16084025',
  concept.id,
  'mentioned_component',
  '0.700',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'a356bd40-e45c-5f0e-8288-e28fdb8952ee',
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
  'e6296b81-df26-4edf-bbf8-ce3c4ef3c1c1',
  concept.id,
  'operation',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '99e6caab-0eee-56ed-848a-b7547286ea9a',
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
  'e6296b81-df26-4edf-bbf8-ce3c4ef3c1c1',
  concept.id,
  'primary_subject',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '99e6caab-0eee-56ed-848a-b7547286ea9a',
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
  'e6296b81-df26-4edf-bbf8-ce3c4ef3c1c1',
  concept.id,
  'mentioned_component',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '99e6caab-0eee-56ed-848a-b7547286ea9a',
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
  'ecbc185b-e4a5-443b-88d8-df7c1cb6a97e',
  concept.id,
  'primary_subject',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'dc5e5b34-fdcd-5e82-8376-9d851225aa16',
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
  'ecbc185b-e4a5-443b-88d8-df7c1cb6a97e',
  concept.id,
  'mentioned_component',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'dc5e5b34-fdcd-5e82-8376-9d851225aa16',
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
  'ecbc185b-e4a5-443b-88d8-df7c1cb6a97e',
  concept.id,
  'property',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'dc5e5b34-fdcd-5e82-8376-9d851225aa16',
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
  'ecbc185b-e4a5-443b-88d8-df7c1cb6a97e',
  concept.id,
  'operation',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'dc5e5b34-fdcd-5e82-8376-9d851225aa16',
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
  'ecbc185b-e4a5-443b-88d8-df7c1cb6a97e',
  concept.id,
  'mentioned_component',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'dc5e5b34-fdcd-5e82-8376-9d851225aa16',
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
  'f224690c-cb7a-4cec-a7ee-c4dca40ecd10',
  concept.id,
  'operation',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'a3d959fd-5b36-599f-872d-eb2fa289f111',
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
  'f224690c-cb7a-4cec-a7ee-c4dca40ecd10',
  concept.id,
  'mentioned_component',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'a3d959fd-5b36-599f-872d-eb2fa289f111',
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
  'f224690c-cb7a-4cec-a7ee-c4dca40ecd10',
  concept.id,
  'mentioned_component',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'a3d959fd-5b36-599f-872d-eb2fa289f111',
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
  'f224690c-cb7a-4cec-a7ee-c4dca40ecd10',
  concept.id,
  'mentioned_component',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'a3d959fd-5b36-599f-872d-eb2fa289f111',
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
  'f224690c-cb7a-4cec-a7ee-c4dca40ecd10',
  concept.id,
  'operation',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'a3d959fd-5b36-599f-872d-eb2fa289f111',
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
  'f224690c-cb7a-4cec-a7ee-c4dca40ecd10',
  concept.id,
  'mentioned_component',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'a3d959fd-5b36-599f-872d-eb2fa289f111',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"manual_chunks_document:406397b8-3fe4-4e9a-8dd5-f9677c61a3ae","matched_name":"engine","document_role":"workshop_manual"}'::jsonb
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
  'f4d8a211-4620-4987-a155-3319f08308a7',
  concept.id,
  'operation',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'ad193401-5fc2-5520-8717-c46faad55952',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"manual_chunks_document:406397b8-3fe4-4e9a-8dd5-f9677c61a3ae","matched_name":"adjust","document_role":"workshop_manual"}'::jsonb
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
  'f4d8a211-4620-4987-a155-3319f08308a7',
  concept.id,
  'mentioned_component',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'ad193401-5fc2-5520-8717-c46faad55952',
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
  'f4d8a211-4620-4987-a155-3319f08308a7',
  concept.id,
  'property',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'ad193401-5fc2-5520-8717-c46faad55952',
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
  'f4d8a211-4620-4987-a155-3319f08308a7',
  concept.id,
  'primary_subject',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'ad193401-5fc2-5520-8717-c46faad55952',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"manual_chunks_document:406397b8-3fe4-4e9a-8dd5-f9677c61a3ae","matched_name":"pitman arm","document_role":"workshop_manual"}'::jsonb
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
  'f4d8a211-4620-4987-a155-3319f08308a7',
  concept.id,
  'mentioned_component',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'ad193401-5fc2-5520-8717-c46faad55952',
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
  'f54ff615-9da5-4a84-90f9-cbdb14e26d2a',
  concept.id,
  'operation',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'a778a632-06c0-5448-835b-3c81fc787839',
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
  'f54ff615-9da5-4a84-90f9-cbdb14e26d2a',
  concept.id,
  'primary_subject',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'a778a632-06c0-5448-835b-3c81fc787839',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"manual_chunks_document:406397b8-3fe4-4e9a-8dd5-f9677c61a3ae","matched_name":"differential","document_role":"workshop_manual"}'::jsonb
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
  'manual_chunk',
  'f5974288-91c8-48ce-ba86-7b29ab316508',
  concept.id,
  'primary_subject',
  '0.900',
  'deterministic',
  'approved',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '39941ee9-4d86-58e4-837b-fdb44610d89b',
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
  'f5974288-91c8-48ce-ba86-7b29ab316508',
  concept.id,
  'mentioned_component',
  '0.700',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '39941ee9-4d86-58e4-837b-fdb44610d89b',
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
  'f5974288-91c8-48ce-ba86-7b29ab316508',
  concept.id,
  'mentioned_component',
  '0.900',
  'deterministic',
  'approved',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '39941ee9-4d86-58e4-837b-fdb44610d89b',
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
  'f70ebec1-f11f-4cff-a9bd-8b9f5326c921',
  concept.id,
  'mentioned_component',
  '0.900',
  'deterministic',
  'approved',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'ebe496e9-e193-565e-87a9-bcf5beac03b6',
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
  'f70ebec1-f11f-4cff-a9bd-8b9f5326c921',
  concept.id,
  'mentioned_component',
  '0.700',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'ebe496e9-e193-565e-87a9-bcf5beac03b6',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":false,"document_key":"manual_chunks_document:57ae9d6c-64b7-45e7-92f0-799c4ff6caf2","matched_name":"transmission","document_role":"parts_catalog"}'::jsonb
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
  'manual_chunk',
  'f9137460-9154-4961-b4d6-dbafc6778785',
  concept.id,
  'mentioned_component',
  '0.700',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '4179a2b5-8e8b-55f6-8fd4-be7f8bd3722d',
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
  'f9137460-9154-4961-b4d6-dbafc6778785',
  concept.id,
  'primary_subject',
  '0.850',
  'deterministic',
  'approved',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '4179a2b5-8e8b-55f6-8fd4-be7f8bd3722d',
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
  'f9137460-9154-4961-b4d6-dbafc6778785',
  concept.id,
  'mentioned_component',
  '0.850',
  'deterministic',
  'approved',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '4179a2b5-8e8b-55f6-8fd4-be7f8bd3722d',
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
  'f9e16d39-db38-43dc-9d18-6b5f9c80db78',
  concept.id,
  'mentioned_component',
  '0.900',
  'deterministic',
  'approved',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '9bdc2c64-b683-553d-868a-28534929155b',
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
  'f9e16d39-db38-43dc-9d18-6b5f9c80db78',
  concept.id,
  'primary_subject',
  '0.900',
  'deterministic',
  'approved',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '9bdc2c64-b683-553d-868a-28534929155b',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"manual_chunks_document:57ae9d6c-64b7-45e7-92f0-799c4ff6caf2","matched_name":"steering reservoir","document_role":"parts_catalog"}'::jsonb
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
  'manual_chunk',
  'f9e16d39-db38-43dc-9d18-6b5f9c80db78',
  concept.id,
  'mentioned_component',
  '0.700',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '9bdc2c64-b683-553d-868a-28534929155b',
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
  'fe3df384-d994-4bb4-b413-1a67ad937d39',
  concept.id,
  'mentioned_component',
  '0.900',
  'deterministic',
  'approved',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '14630c58-8819-5c34-8867-ca771f42ff50',
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
  'ff3dcab4-abfe-4f45-97ae-2800dc818588',
  concept.id,
  'mentioned_component',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '349fa9a3-ee20-5153-8b11-558c658f9c28',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"manual_chunks_document:406397b8-3fe4-4e9a-8dd5-f9677c61a3ae","matched_name":"engine","document_role":"workshop_manual"}'::jsonb
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
  'ff3dcab4-abfe-4f45-97ae-2800dc818588',
  concept.id,
  'primary_subject',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '349fa9a3-ee20-5153-8b11-558c658f9c28',
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
  'ff3dcab4-abfe-4f45-97ae-2800dc818588',
  concept.id,
  'property',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '349fa9a3-ee20-5153-8b11-558c658f9c28',
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
  'ff3dcab4-abfe-4f45-97ae-2800dc818588',
  concept.id,
  'operation',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '349fa9a3-ee20-5153-8b11-558c658f9c28',
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
  'ff3dcab4-abfe-4f45-97ae-2800dc818588',
  concept.id,
  'mentioned_component',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '349fa9a3-ee20-5153-8b11-558c658f9c28',
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
  'rps_illustration',
  '4c6814a2-12e8-4877-9123-80d72c36cfef',
  concept.id,
  'primary_subject',
  '0.900',
  'deterministic',
  'approved',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '58b28977-4523-5ac4-8a16-5ad1c4976026',
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
  '005b35a8-b9f0-4e96-a3a0-2022667757c8',
  concept.id,
  'mentioned_component',
  '0.750',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'bd85c7ea-0734-5de9-8114-0c207cd43f4c',
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
  '040ac58b-c25f-483a-989d-8dfbf81ec92a',
  concept.id,
  'mentioned_component',
  '0.700',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '19911b3d-20b9-5212-87e3-0053172bbc99',
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
  '05112454-7b84-4331-bee1-2e01e7208cc9',
  concept.id,
  'mentioned_component',
  '0.700',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '6d074e49-2eae-50be-81a2-9e5af50cb9b3',
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
  '05d081d2-99ef-47e0-bb18-4a150325d727',
  concept.id,
  'mentioned_component',
  '0.750',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '24446e21-b4dc-5bad-8264-e8b871eea1bf',
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
  '060f37c2-f74d-4aca-b35f-8bd495af6abb',
  concept.id,
  'mentioned_component',
  '0.750',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '4fc911b3-c67d-5f7e-8040-660554981f7e',
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
  '061474b4-edd1-4a21-898a-d0318ff2b70b',
  concept.id,
  'mentioned_component',
  '0.750',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '7fd324b5-1f92-5737-8b3e-6df918e32a0a',
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
COMMIT;
