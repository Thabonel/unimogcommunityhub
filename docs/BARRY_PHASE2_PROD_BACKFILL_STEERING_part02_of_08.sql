BEGIN;

INSERT INTO public.barry_evidence_units (
  id, document_id, source_type, source_record_id, physical_pdf_page, page_type,
  content_hash, system_tags, model_tags, component_tags, extraction_quality,
  semantic_version_id, backfill_run_id, provenance
) VALUES (
  'a33ad8d2-940a-54c0-826c-4c5c5e6b42bb',
  '6e1cde1a-61c0-58ef-8f07-63f5a17654b2',
  'manual_chunk',
  '0a1f2c97-7e6a-4b31-9281-805bf80abc04',
  928,
  'specification',
  '483479ab81a151d34c8d1d0e92075d79',
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY['component.steering_gear']::text[],
  '0.900',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","page_type_reason":"technical data or specification heading","page_type_confidence":0.85}'::jsonb
)
ON CONFLICT (semantic_version_id, source_type, source_record_id) DO UPDATE SET
  page_type = EXCLUDED.page_type,
  content_hash = EXCLUDED.content_hash,
  model_tags = EXCLUDED.model_tags,
  component_tags = EXCLUDED.component_tags,
  provenance = EXCLUDED.provenance,
  updated_at = now();
INSERT INTO public.barry_evidence_units (
  id, document_id, source_type, source_record_id, physical_pdf_page, page_type,
  content_hash, system_tags, model_tags, component_tags, extraction_quality,
  semantic_version_id, backfill_run_id, provenance
) VALUES (
  'a797ef22-82e2-5753-874c-13e936e3e30e',
  '6e1cde1a-61c0-58ef-8f07-63f5a17654b2',
  'manual_chunk',
  '0b85a5b9-1c7d-49ee-8eb3-a81e8b5238c5',
  932,
  'diagram',
  'a5b807684cf3982beff1c0ec8a68236c',
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY['component.pitman_arm']::text[],
  '0.900',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","page_type_reason":"exploded-view or illustration heading","page_type_confidence":0.9}'::jsonb
)
ON CONFLICT (semantic_version_id, source_type, source_record_id) DO UPDATE SET
  page_type = EXCLUDED.page_type,
  content_hash = EXCLUDED.content_hash,
  model_tags = EXCLUDED.model_tags,
  component_tags = EXCLUDED.component_tags,
  provenance = EXCLUDED.provenance,
  updated_at = now();
INSERT INTO public.barry_evidence_units (
  id, document_id, source_type, source_record_id, physical_pdf_page, page_type,
  content_hash, system_tags, model_tags, component_tags, extraction_quality,
  semantic_version_id, backfill_run_id, provenance
) VALUES (
  '57fc1f4a-eaab-5c69-8666-06689ea3417d',
  '6e1cde1a-61c0-58ef-8f07-63f5a17654b2',
  'manual_chunk',
  '0fbe156a-df46-4ba2-a2e4-733575ea7629',
  610,
  'explanation',
  '4582989e025690e855179b7f41f5f9f7',
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY['component.portal_hub']::text[],
  '0.900',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","page_type_reason":"text content without a specific structural heading","page_type_confidence":0.6}'::jsonb
)
ON CONFLICT (semantic_version_id, source_type, source_record_id) DO UPDATE SET
  page_type = EXCLUDED.page_type,
  content_hash = EXCLUDED.content_hash,
  model_tags = EXCLUDED.model_tags,
  component_tags = EXCLUDED.component_tags,
  provenance = EXCLUDED.provenance,
  updated_at = now();
INSERT INTO public.barry_evidence_units (
  id, document_id, source_type, source_record_id, physical_pdf_page, page_type,
  content_hash, system_tags, model_tags, component_tags, extraction_quality,
  semantic_version_id, backfill_run_id, provenance
) VALUES (
  'd6dfb571-874e-5cb2-8593-4448bc1b1a2a',
  'd0c0d16a-b2df-540a-8ee1-c8661148b033',
  'manual_chunk',
  '1063185b-0705-40cd-90a4-f4bba447e718',
  620,
  'diagram',
  '156115c4ea0d4f8b7c671b9454b654ed',
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY['component.power_steering_pump']::text[],
  '1.000',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","page_type_reason":"exploded-view or illustration heading","page_type_confidence":0.9}'::jsonb
)
ON CONFLICT (semantic_version_id, source_type, source_record_id) DO UPDATE SET
  page_type = EXCLUDED.page_type,
  content_hash = EXCLUDED.content_hash,
  model_tags = EXCLUDED.model_tags,
  component_tags = EXCLUDED.component_tags,
  provenance = EXCLUDED.provenance,
  updated_at = now();
INSERT INTO public.barry_evidence_units (
  id, document_id, source_type, source_record_id, physical_pdf_page, page_type,
  content_hash, system_tags, model_tags, component_tags, extraction_quality,
  semantic_version_id, backfill_run_id, provenance
) VALUES (
  '8663fdb3-b740-5bfc-804a-253d861eff46',
  'd0c0d16a-b2df-540a-8ee1-c8661148b033',
  'manual_chunk',
  '1070bd5b-d316-44ec-a923-974482915e7a',
  628,
  'diagram',
  '0965e85453ce4bfaddc93e59d07685ac',
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY[]::text[],
  '1.000',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","page_type_reason":"exploded-view or illustration heading","page_type_confidence":0.9}'::jsonb
)
ON CONFLICT (semantic_version_id, source_type, source_record_id) DO UPDATE SET
  page_type = EXCLUDED.page_type,
  content_hash = EXCLUDED.content_hash,
  model_tags = EXCLUDED.model_tags,
  component_tags = EXCLUDED.component_tags,
  provenance = EXCLUDED.provenance,
  updated_at = now();
INSERT INTO public.barry_evidence_units (
  id, document_id, source_type, source_record_id, physical_pdf_page, page_type,
  content_hash, system_tags, model_tags, component_tags, extraction_quality,
  semantic_version_id, backfill_run_id, provenance
) VALUES (
  '58e882b9-92eb-5459-8804-973b06def895',
  'd0c0d16a-b2df-540a-8ee1-c8661148b033',
  'manual_chunk',
  '141c6d1a-8239-422f-8522-e0021130870f',
  599,
  'diagram',
  'e054fc83caa78a4cfc67b1b7c1b287cb',
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY[]::text[],
  '1.000',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","page_type_reason":"exploded-view or illustration heading","page_type_confidence":0.9}'::jsonb
)
ON CONFLICT (semantic_version_id, source_type, source_record_id) DO UPDATE SET
  page_type = EXCLUDED.page_type,
  content_hash = EXCLUDED.content_hash,
  model_tags = EXCLUDED.model_tags,
  component_tags = EXCLUDED.component_tags,
  provenance = EXCLUDED.provenance,
  updated_at = now();
INSERT INTO public.barry_evidence_units (
  id, document_id, source_type, source_record_id, physical_pdf_page, page_type,
  content_hash, system_tags, model_tags, component_tags, extraction_quality,
  semantic_version_id, backfill_run_id, provenance
) VALUES (
  '99413407-d775-5962-87ac-cc068cd29edf',
  '6e1cde1a-61c0-58ef-8f07-63f5a17654b2',
  'manual_chunk',
  '188ec67b-1dd1-4f49-89dc-f82330d735ae',
  930,
  'specification',
  'a39378953c9e2b1885ea4c60eae3d165',
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY['component.pitman_arm', 'component.steering_gear']::text[],
  '0.900',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","page_type_reason":"technical data or specification heading","page_type_confidence":0.85}'::jsonb
)
ON CONFLICT (semantic_version_id, source_type, source_record_id) DO UPDATE SET
  page_type = EXCLUDED.page_type,
  content_hash = EXCLUDED.content_hash,
  model_tags = EXCLUDED.model_tags,
  component_tags = EXCLUDED.component_tags,
  provenance = EXCLUDED.provenance,
  updated_at = now();
INSERT INTO public.barry_evidence_units (
  id, document_id, source_type, source_record_id, physical_pdf_page, page_type,
  content_hash, system_tags, model_tags, component_tags, extraction_quality,
  semantic_version_id, backfill_run_id, provenance
) VALUES (
  '9868d81e-20d7-50cd-8086-10ffab6b0769',
  'd0c0d16a-b2df-540a-8ee1-c8661148b033',
  'manual_chunk',
  '1e147827-3b52-44c4-bb86-782bf627f1e9',
  613,
  'diagram',
  '6222b8a026222fc10730e54c6f886bb2',
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY['component.steering_gear']::text[],
  '1.000',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","page_type_reason":"exploded-view or illustration heading","page_type_confidence":0.9}'::jsonb
)
ON CONFLICT (semantic_version_id, source_type, source_record_id) DO UPDATE SET
  page_type = EXCLUDED.page_type,
  content_hash = EXCLUDED.content_hash,
  model_tags = EXCLUDED.model_tags,
  component_tags = EXCLUDED.component_tags,
  provenance = EXCLUDED.provenance,
  updated_at = now();
INSERT INTO public.barry_evidence_units (
  id, document_id, source_type, source_record_id, physical_pdf_page, page_type,
  content_hash, system_tags, model_tags, component_tags, extraction_quality,
  semantic_version_id, backfill_run_id, provenance
) VALUES (
  '4d1d002a-e516-5d89-8f8d-dc20b92a2613',
  '6e1cde1a-61c0-58ef-8f07-63f5a17654b2',
  'manual_chunk',
  '20b2d5d7-dd8d-4b85-a8ff-10cb88a73f3f',
  942,
  'specification',
  '6873d9b4428f76e99a44d8cc8388da04',
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY['component.steering_gear']::text[],
  '0.900',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","page_type_reason":"technical data or specification heading","page_type_confidence":0.85}'::jsonb
)
ON CONFLICT (semantic_version_id, source_type, source_record_id) DO UPDATE SET
  page_type = EXCLUDED.page_type,
  content_hash = EXCLUDED.content_hash,
  model_tags = EXCLUDED.model_tags,
  component_tags = EXCLUDED.component_tags,
  provenance = EXCLUDED.provenance,
  updated_at = now();
INSERT INTO public.barry_evidence_units (
  id, document_id, source_type, source_record_id, physical_pdf_page, page_type,
  content_hash, system_tags, model_tags, component_tags, extraction_quality,
  semantic_version_id, backfill_run_id, provenance
) VALUES (
  '670f8f07-185b-5674-8407-8a2f4725e8e4',
  '6e1cde1a-61c0-58ef-8f07-63f5a17654b2',
  'manual_chunk',
  '24ab4e52-3fa4-4590-ba1e-90734c979859',
  939,
  'explanation',
  '5468a9ab0583f21de09dda91f37007b2',
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY['component.steering_gear']::text[],
  '0.900',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","page_type_reason":"text content without a specific structural heading","page_type_confidence":0.6}'::jsonb
)
ON CONFLICT (semantic_version_id, source_type, source_record_id) DO UPDATE SET
  page_type = EXCLUDED.page_type,
  content_hash = EXCLUDED.content_hash,
  model_tags = EXCLUDED.model_tags,
  component_tags = EXCLUDED.component_tags,
  provenance = EXCLUDED.provenance,
  updated_at = now();
INSERT INTO public.barry_evidence_units (
  id, document_id, source_type, source_record_id, physical_pdf_page, page_type,
  content_hash, system_tags, model_tags, component_tags, extraction_quality,
  semantic_version_id, backfill_run_id, provenance
) VALUES (
  'ceda671f-f13a-5a37-83a7-ad3f46b79d21',
  '6e1cde1a-61c0-58ef-8f07-63f5a17654b2',
  'manual_chunk',
  '2d48f4f6-3f19-4cc5-8cf2-e56ee27e1c6f',
  923,
  'explanation',
  'cb02762c804bc2d691e6238c3dd0d2b8',
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY['component.water_pump']::text[],
  '0.900',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","page_type_reason":"text content without a specific structural heading","page_type_confidence":0.6}'::jsonb
)
ON CONFLICT (semantic_version_id, source_type, source_record_id) DO UPDATE SET
  page_type = EXCLUDED.page_type,
  content_hash = EXCLUDED.content_hash,
  model_tags = EXCLUDED.model_tags,
  component_tags = EXCLUDED.component_tags,
  provenance = EXCLUDED.provenance,
  updated_at = now();
INSERT INTO public.barry_evidence_units (
  id, document_id, source_type, source_record_id, physical_pdf_page, page_type,
  content_hash, system_tags, model_tags, component_tags, extraction_quality,
  semantic_version_id, backfill_run_id, provenance
) VALUES (
  '3ad78842-e00a-5571-855d-d5d61e50086c',
  '6e1cde1a-61c0-58ef-8f07-63f5a17654b2',
  'manual_chunk',
  '2eacbd4f-2c8a-42ea-8b19-b2560acb1d58',
  936,
  'explanation',
  '51420ad093a0ef0a19d3e93fc5e4b3b0',
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY['component.pitman_arm', 'component.steering_gear']::text[],
  '0.900',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","page_type_reason":"text content without a specific structural heading","page_type_confidence":0.6}'::jsonb
)
ON CONFLICT (semantic_version_id, source_type, source_record_id) DO UPDATE SET
  page_type = EXCLUDED.page_type,
  content_hash = EXCLUDED.content_hash,
  model_tags = EXCLUDED.model_tags,
  component_tags = EXCLUDED.component_tags,
  provenance = EXCLUDED.provenance,
  updated_at = now();
INSERT INTO public.barry_evidence_units (
  id, document_id, source_type, source_record_id, physical_pdf_page, page_type,
  content_hash, system_tags, model_tags, component_tags, extraction_quality,
  semantic_version_id, backfill_run_id, provenance
) VALUES (
  'e039b126-a61b-5f64-87d7-567ee6c3510e',
  'd0c0d16a-b2df-540a-8ee1-c8661148b033',
  'manual_chunk',
  '34404c91-6aa7-4b59-a60c-f87781d0000d',
  590,
  'diagram',
  'b56d354bec14233d9e6a2b1b46545cec',
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY[]::text[],
  '1.000',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","page_type_reason":"exploded-view or illustration heading","page_type_confidence":0.9}'::jsonb
)
ON CONFLICT (semantic_version_id, source_type, source_record_id) DO UPDATE SET
  page_type = EXCLUDED.page_type,
  content_hash = EXCLUDED.content_hash,
  model_tags = EXCLUDED.model_tags,
  component_tags = EXCLUDED.component_tags,
  provenance = EXCLUDED.provenance,
  updated_at = now();
INSERT INTO public.barry_evidence_units (
  id, document_id, source_type, source_record_id, physical_pdf_page, page_type,
  content_hash, system_tags, model_tags, component_tags, extraction_quality,
  semantic_version_id, backfill_run_id, provenance
) VALUES (
  '38629a9a-03c3-5002-85e2-7e994c2a77c3',
  '6e1cde1a-61c0-58ef-8f07-63f5a17654b2',
  'manual_chunk',
  '3466d107-56b6-4eeb-9721-c69c15e5a7ab',
  940,
  'procedure',
  'a94da0834c7b106b9906c2d6acde1bb3',
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY['component.steering_gear']::text[],
  '0.900',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","page_type_reason":"procedure heading in procedural manual","page_type_confidence":0.85}'::jsonb
)
ON CONFLICT (semantic_version_id, source_type, source_record_id) DO UPDATE SET
  page_type = EXCLUDED.page_type,
  content_hash = EXCLUDED.content_hash,
  model_tags = EXCLUDED.model_tags,
  component_tags = EXCLUDED.component_tags,
  provenance = EXCLUDED.provenance,
  updated_at = now();
INSERT INTO public.barry_evidence_units (
  id, document_id, source_type, source_record_id, physical_pdf_page, page_type,
  content_hash, system_tags, model_tags, component_tags, extraction_quality,
  semantic_version_id, backfill_run_id, provenance
) VALUES (
  'ef983b3d-fe97-578f-8de7-a9cc718abc68',
  '6e1cde1a-61c0-58ef-8f07-63f5a17654b2',
  'manual_chunk',
  '3a040598-2a35-41f7-8a64-9a01310be9bc',
  959,
  'explanation',
  '2c459ea8bf38c1eeb6232516eb29a2ae',
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY['component.steering_gear']::text[],
  '0.900',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","page_type_reason":"text content without a specific structural heading","page_type_confidence":0.6}'::jsonb
)
ON CONFLICT (semantic_version_id, source_type, source_record_id) DO UPDATE SET
  page_type = EXCLUDED.page_type,
  content_hash = EXCLUDED.content_hash,
  model_tags = EXCLUDED.model_tags,
  component_tags = EXCLUDED.component_tags,
  provenance = EXCLUDED.provenance,
  updated_at = now();
INSERT INTO public.barry_evidence_units (
  id, document_id, source_type, source_record_id, physical_pdf_page, page_type,
  content_hash, system_tags, model_tags, component_tags, extraction_quality,
  semantic_version_id, backfill_run_id, provenance
) VALUES (
  '2726ef85-cd56-5599-8061-ea7de3f25185',
  'd0c0d16a-b2df-540a-8ee1-c8661148b033',
  'manual_chunk',
  '3be344a8-332b-498d-b09e-02effd4ee75e',
  605,
  'diagram',
  'ee3061640282c0c67faa3692591e6e87',
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY['component.steering_gear']::text[],
  '1.000',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","page_type_reason":"exploded-view or illustration heading","page_type_confidence":0.9}'::jsonb
)
ON CONFLICT (semantic_version_id, source_type, source_record_id) DO UPDATE SET
  page_type = EXCLUDED.page_type,
  content_hash = EXCLUDED.content_hash,
  model_tags = EXCLUDED.model_tags,
  component_tags = EXCLUDED.component_tags,
  provenance = EXCLUDED.provenance,
  updated_at = now();
INSERT INTO public.barry_evidence_units (
  id, document_id, source_type, source_record_id, physical_pdf_page, page_type,
  content_hash, system_tags, model_tags, component_tags, extraction_quality,
  semantic_version_id, backfill_run_id, provenance
) VALUES (
  'c2f14b21-c163-526e-8b27-13f296f36c79',
  '6e1cde1a-61c0-58ef-8f07-63f5a17654b2',
  'manual_chunk',
  '4398868d-7178-4b0a-bae2-7ed4f35c96c4',
  946,
  'procedure',
  '1dec6d747e7d8f87c8ec3307cbd8a6af',
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY['component.steering_gear']::text[],
  '0.900',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","page_type_reason":"procedure heading in procedural manual","page_type_confidence":0.85}'::jsonb
)
ON CONFLICT (semantic_version_id, source_type, source_record_id) DO UPDATE SET
  page_type = EXCLUDED.page_type,
  content_hash = EXCLUDED.content_hash,
  model_tags = EXCLUDED.model_tags,
  component_tags = EXCLUDED.component_tags,
  provenance = EXCLUDED.provenance,
  updated_at = now();
INSERT INTO public.barry_evidence_units (
  id, document_id, source_type, source_record_id, physical_pdf_page, page_type,
  content_hash, system_tags, model_tags, component_tags, extraction_quality,
  semantic_version_id, backfill_run_id, provenance
) VALUES (
  'a060ffeb-299a-5fe2-8822-ac7b5522b616',
  '6e1cde1a-61c0-58ef-8f07-63f5a17654b2',
  'manual_chunk',
  '4b8fc0c8-8381-4693-9348-d5a9e9dacdc8',
  611,
  'procedure',
  '46d62d3f37e31cfcbe3b092a1cad3432',
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY['component.portal_hub']::text[],
  '0.900',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","page_type_reason":"procedure heading in procedural manual","page_type_confidence":0.85}'::jsonb
)
ON CONFLICT (semantic_version_id, source_type, source_record_id) DO UPDATE SET
  page_type = EXCLUDED.page_type,
  content_hash = EXCLUDED.content_hash,
  model_tags = EXCLUDED.model_tags,
  component_tags = EXCLUDED.component_tags,
  provenance = EXCLUDED.provenance,
  updated_at = now();
INSERT INTO public.barry_evidence_units (
  id, document_id, source_type, source_record_id, physical_pdf_page, page_type,
  content_hash, system_tags, model_tags, component_tags, extraction_quality,
  semantic_version_id, backfill_run_id, provenance
) VALUES (
  'a3ee483d-60fb-53f3-870d-1ca9571e7975',
  'd0c0d16a-b2df-540a-8ee1-c8661148b033',
  'manual_chunk',
  '51734ea0-76f1-45af-a0d3-da23a2aa5a1d',
  601,
  'diagram',
  'f24aea719ced5c8e3d5e651563c7cf3d',
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY['component.pitman_arm']::text[],
  '1.000',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","page_type_reason":"exploded-view or illustration heading","page_type_confidence":0.9}'::jsonb
)
ON CONFLICT (semantic_version_id, source_type, source_record_id) DO UPDATE SET
  page_type = EXCLUDED.page_type,
  content_hash = EXCLUDED.content_hash,
  model_tags = EXCLUDED.model_tags,
  component_tags = EXCLUDED.component_tags,
  provenance = EXCLUDED.provenance,
  updated_at = now();
INSERT INTO public.barry_evidence_units (
  id, document_id, source_type, source_record_id, physical_pdf_page, page_type,
  content_hash, system_tags, model_tags, component_tags, extraction_quality,
  semantic_version_id, backfill_run_id, provenance
) VALUES (
  'a9970449-d906-567a-8576-9ef00f021b96',
  '6e1cde1a-61c0-58ef-8f07-63f5a17654b2',
  'manual_chunk',
  '543771de-8418-4b77-a6ae-685115b702b8',
  934,
  'diagram',
  '92ff8f557843ae281e00ef2248243a16',
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY['component.steering_gear']::text[],
  '0.900',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","page_type_reason":"exploded-view or illustration heading","page_type_confidence":0.9}'::jsonb
)
ON CONFLICT (semantic_version_id, source_type, source_record_id) DO UPDATE SET
  page_type = EXCLUDED.page_type,
  content_hash = EXCLUDED.content_hash,
  model_tags = EXCLUDED.model_tags,
  component_tags = EXCLUDED.component_tags,
  provenance = EXCLUDED.provenance,
  updated_at = now();
INSERT INTO public.barry_evidence_units (
  id, document_id, source_type, source_record_id, physical_pdf_page, page_type,
  content_hash, system_tags, model_tags, component_tags, extraction_quality,
  semantic_version_id, backfill_run_id, provenance
) VALUES (
  '14c5409e-7dc2-53d3-86bd-ffd8a7d1ae25',
  '6e1cde1a-61c0-58ef-8f07-63f5a17654b2',
  'manual_chunk',
  '5bc40ac6-5615-4ed5-a0af-924d7da91701',
  604,
  'explanation',
  'e8dae52ba6ce5646aaeb1291dcac4420',
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY['component.portal_hub']::text[],
  '0.900',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","page_type_reason":"text content without a specific structural heading","page_type_confidence":0.6}'::jsonb
)
ON CONFLICT (semantic_version_id, source_type, source_record_id) DO UPDATE SET
  page_type = EXCLUDED.page_type,
  content_hash = EXCLUDED.content_hash,
  model_tags = EXCLUDED.model_tags,
  component_tags = EXCLUDED.component_tags,
  provenance = EXCLUDED.provenance,
  updated_at = now();
INSERT INTO public.barry_evidence_units (
  id, document_id, source_type, source_record_id, physical_pdf_page, page_type,
  content_hash, system_tags, model_tags, component_tags, extraction_quality,
  semantic_version_id, backfill_run_id, provenance
) VALUES (
  '5e253d92-1c6d-566e-8628-17104c466f4a',
  '6e1cde1a-61c0-58ef-8f07-63f5a17654b2',
  'manual_chunk',
  '5d5e7fb6-4adb-431c-b2ec-cfa3fc7209b8',
  609,
  'procedure',
  'dcdd4581a49272dc35761d68589f951e',
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY['component.portal_hub']::text[],
  '0.900',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","page_type_reason":"procedure heading in procedural manual","page_type_confidence":0.85}'::jsonb
)
ON CONFLICT (semantic_version_id, source_type, source_record_id) DO UPDATE SET
  page_type = EXCLUDED.page_type,
  content_hash = EXCLUDED.content_hash,
  model_tags = EXCLUDED.model_tags,
  component_tags = EXCLUDED.component_tags,
  provenance = EXCLUDED.provenance,
  updated_at = now();
INSERT INTO public.barry_evidence_units (
  id, document_id, source_type, source_record_id, physical_pdf_page, page_type,
  content_hash, system_tags, model_tags, component_tags, extraction_quality,
  semantic_version_id, backfill_run_id, provenance
) VALUES (
  'd944b575-70f8-5a6e-8179-982073858ae8',
  '6e1cde1a-61c0-58ef-8f07-63f5a17654b2',
  'manual_chunk',
  '5f6fb3d6-8ede-4628-82fb-8688a86b5b3f',
  958,
  'specification',
  '0dd54f9ed378025bf1b5bb90f5e20cff',
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY['component.steering_gear']::text[],
  '0.900',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","page_type_reason":"technical data or specification heading","page_type_confidence":0.85}'::jsonb
)
ON CONFLICT (semantic_version_id, source_type, source_record_id) DO UPDATE SET
  page_type = EXCLUDED.page_type,
  content_hash = EXCLUDED.content_hash,
  model_tags = EXCLUDED.model_tags,
  component_tags = EXCLUDED.component_tags,
  provenance = EXCLUDED.provenance,
  updated_at = now();
INSERT INTO public.barry_evidence_units (
  id, document_id, source_type, source_record_id, physical_pdf_page, page_type,
  content_hash, system_tags, model_tags, component_tags, extraction_quality,
  semantic_version_id, backfill_run_id, provenance
) VALUES (
  'ebd689ae-e19f-5a6c-89b1-5a829934a21c',
  'd0c0d16a-b2df-540a-8ee1-c8661148b033',
  'manual_chunk',
  '60fc07ca-d0ed-4243-aa00-60f78e275c52',
  591,
  'diagram',
  '4324dc3f10ab7683c14c61b5aedac01a',
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY[]::text[],
  '1.000',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","page_type_reason":"exploded-view or illustration heading","page_type_confidence":0.9}'::jsonb
)
ON CONFLICT (semantic_version_id, source_type, source_record_id) DO UPDATE SET
  page_type = EXCLUDED.page_type,
  content_hash = EXCLUDED.content_hash,
  model_tags = EXCLUDED.model_tags,
  component_tags = EXCLUDED.component_tags,
  provenance = EXCLUDED.provenance,
  updated_at = now();
INSERT INTO public.barry_evidence_units (
  id, document_id, source_type, source_record_id, physical_pdf_page, page_type,
  content_hash, system_tags, model_tags, component_tags, extraction_quality,
  semantic_version_id, backfill_run_id, provenance
) VALUES (
  '3c06301d-c710-5370-8f7c-6e07d9136367',
  '6e1cde1a-61c0-58ef-8f07-63f5a17654b2',
  'manual_chunk',
  '644a3bd8-4c9c-447c-a280-fff39f982961',
  956,
  'explanation',
  'abcd3cf09b9e95ff3611f3f9f61b3dbe',
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY['component.pitman_arm', 'component.steering_gear']::text[],
  '0.900',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","page_type_reason":"text content without a specific structural heading","page_type_confidence":0.6}'::jsonb
)
ON CONFLICT (semantic_version_id, source_type, source_record_id) DO UPDATE SET
  page_type = EXCLUDED.page_type,
  content_hash = EXCLUDED.content_hash,
  model_tags = EXCLUDED.model_tags,
  component_tags = EXCLUDED.component_tags,
  provenance = EXCLUDED.provenance,
  updated_at = now();
INSERT INTO public.barry_evidence_units (
  id, document_id, source_type, source_record_id, physical_pdf_page, page_type,
  content_hash, system_tags, model_tags, component_tags, extraction_quality,
  semantic_version_id, backfill_run_id, provenance
) VALUES (
  '5f89f1a3-fa7c-55c0-8988-5e5559c53c26',
  'd0c0d16a-b2df-540a-8ee1-c8661148b033',
  'manual_chunk',
  '666b439d-a973-45d6-8247-827af113341c',
  612,
  'diagram',
  '079f7e7c9256d5ec87464d46ffa6e3b1',
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY['component.steering_gear']::text[],
  '1.000',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","page_type_reason":"exploded-view or illustration heading","page_type_confidence":0.9}'::jsonb
)
ON CONFLICT (semantic_version_id, source_type, source_record_id) DO UPDATE SET
  page_type = EXCLUDED.page_type,
  content_hash = EXCLUDED.content_hash,
  model_tags = EXCLUDED.model_tags,
  component_tags = EXCLUDED.component_tags,
  provenance = EXCLUDED.provenance,
  updated_at = now();
INSERT INTO public.barry_evidence_units (
  id, document_id, source_type, source_record_id, physical_pdf_page, page_type,
  content_hash, system_tags, model_tags, component_tags, extraction_quality,
  semantic_version_id, backfill_run_id, provenance
) VALUES (
  '3eb6e7ee-5109-5881-8621-f46a2fd2e586',
  'd0c0d16a-b2df-540a-8ee1-c8661148b033',
  'manual_chunk',
  '67a972e4-02df-4bd2-b26c-e1373f517b02',
  622,
  'explanation',
  '3470a1eb11ecb8e16751d10b39e54345',
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY['component.power_steering_pump']::text[],
  '0.750',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","page_type_reason":"text content without a specific structural heading","page_type_confidence":0.6}'::jsonb
)
ON CONFLICT (semantic_version_id, source_type, source_record_id) DO UPDATE SET
  page_type = EXCLUDED.page_type,
  content_hash = EXCLUDED.content_hash,
  model_tags = EXCLUDED.model_tags,
  component_tags = EXCLUDED.component_tags,
  provenance = EXCLUDED.provenance,
  updated_at = now();
INSERT INTO public.barry_evidence_units (
  id, document_id, source_type, source_record_id, physical_pdf_page, page_type,
  content_hash, system_tags, model_tags, component_tags, extraction_quality,
  semantic_version_id, backfill_run_id, provenance
) VALUES (
  '858e08c7-e2d7-5552-8cd6-af1c532c846c',
  'd0c0d16a-b2df-540a-8ee1-c8661148b033',
  'manual_chunk',
  '685eab65-d43c-4462-9199-bc8819fb6388',
  627,
  'diagram',
  'c380da31a0b24404d9526d8008e58f32',
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY['component.steering_reservoir']::text[],
  '1.000',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","page_type_reason":"exploded-view or illustration heading","page_type_confidence":0.9}'::jsonb
)
ON CONFLICT (semantic_version_id, source_type, source_record_id) DO UPDATE SET
  page_type = EXCLUDED.page_type,
  content_hash = EXCLUDED.content_hash,
  model_tags = EXCLUDED.model_tags,
  component_tags = EXCLUDED.component_tags,
  provenance = EXCLUDED.provenance,
  updated_at = now();
INSERT INTO public.barry_evidence_units (
  id, document_id, source_type, source_record_id, physical_pdf_page, page_type,
  content_hash, system_tags, model_tags, component_tags, extraction_quality,
  semantic_version_id, backfill_run_id, provenance
) VALUES (
  '3e3e61d7-89a4-57f3-8d95-aa051859d8bf',
  '6e1cde1a-61c0-58ef-8f07-63f5a17654b2',
  'manual_chunk',
  '6d922fa0-b9ad-4f06-9cde-b2a923da3f38',
  943,
  'explanation',
  '1d18c4e7004a38e2560fb11569e0c263',
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY[]::text[],
  '0.900',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","page_type_reason":"text content without a specific structural heading","page_type_confidence":0.6}'::jsonb
)
ON CONFLICT (semantic_version_id, source_type, source_record_id) DO UPDATE SET
  page_type = EXCLUDED.page_type,
  content_hash = EXCLUDED.content_hash,
  model_tags = EXCLUDED.model_tags,
  component_tags = EXCLUDED.component_tags,
  provenance = EXCLUDED.provenance,
  updated_at = now();
INSERT INTO public.barry_evidence_units (
  id, document_id, source_type, source_record_id, physical_pdf_page, page_type,
  content_hash, system_tags, model_tags, component_tags, extraction_quality,
  semantic_version_id, backfill_run_id, provenance
) VALUES (
  '094ca5b1-4f89-5c37-836f-249139cd05c4',
  '6e1cde1a-61c0-58ef-8f07-63f5a17654b2',
  'manual_chunk',
  '6e65dded-f552-406d-b125-01c96b743047',
  953,
  'diagram',
  '9e478ea0e517242e8d6c8efc5d5ca14f',
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY[]::text[],
  '0.900',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","page_type_reason":"exploded-view or illustration heading","page_type_confidence":0.9}'::jsonb
)
ON CONFLICT (semantic_version_id, source_type, source_record_id) DO UPDATE SET
  page_type = EXCLUDED.page_type,
  content_hash = EXCLUDED.content_hash,
  model_tags = EXCLUDED.model_tags,
  component_tags = EXCLUDED.component_tags,
  provenance = EXCLUDED.provenance,
  updated_at = now();
INSERT INTO public.barry_evidence_units (
  id, document_id, source_type, source_record_id, physical_pdf_page, page_type,
  content_hash, system_tags, model_tags, component_tags, extraction_quality,
  semantic_version_id, backfill_run_id, provenance
) VALUES (
  '71591088-a5cd-5512-8779-8d46d4c7d908',
  'd0c0d16a-b2df-540a-8ee1-c8661148b033',
  'manual_chunk',
  '6eb29f3e-51b4-4eb3-85fa-515d0ce5bd50',
  595,
  'diagram',
  '36f54ba4610c3c12eb6b0d1422cad7e8',
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY['component.steering_gear', 'component.portal_hub']::text[],
  '1.000',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","page_type_reason":"exploded-view or illustration heading","page_type_confidence":0.9}'::jsonb
)
ON CONFLICT (semantic_version_id, source_type, source_record_id) DO UPDATE SET
  page_type = EXCLUDED.page_type,
  content_hash = EXCLUDED.content_hash,
  model_tags = EXCLUDED.model_tags,
  component_tags = EXCLUDED.component_tags,
  provenance = EXCLUDED.provenance,
  updated_at = now();
INSERT INTO public.barry_evidence_units (
  id, document_id, source_type, source_record_id, physical_pdf_page, page_type,
  content_hash, system_tags, model_tags, component_tags, extraction_quality,
  semantic_version_id, backfill_run_id, provenance
) VALUES (
  'bffc5e98-79b7-5191-83e3-93c57e739e28',
  '6e1cde1a-61c0-58ef-8f07-63f5a17654b2',
  'manual_chunk',
  '6fcc6e62-36ad-495d-bfa5-624a9e645468',
  954,
  'diagram',
  '85606360a6a64e621841cb30f9c5d3e1',
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY[]::text[],
  '0.900',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","page_type_reason":"exploded-view or illustration heading","page_type_confidence":0.9}'::jsonb
)
ON CONFLICT (semantic_version_id, source_type, source_record_id) DO UPDATE SET
  page_type = EXCLUDED.page_type,
  content_hash = EXCLUDED.content_hash,
  model_tags = EXCLUDED.model_tags,
  component_tags = EXCLUDED.component_tags,
  provenance = EXCLUDED.provenance,
  updated_at = now();
INSERT INTO public.barry_evidence_units (
  id, document_id, source_type, source_record_id, physical_pdf_page, page_type,
  content_hash, system_tags, model_tags, component_tags, extraction_quality,
  semantic_version_id, backfill_run_id, provenance
) VALUES (
  '9552f9f8-db11-51d9-80f5-e6c56a7bb40d',
  '6e1cde1a-61c0-58ef-8f07-63f5a17654b2',
  'manual_chunk',
  '71f978f7-bcfe-42f7-aa5f-73e356b186f5',
  950,
  'specification',
  'ef6171ecdb2b9ded46315263dec2de18',
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY['component.pitman_arm', 'component.steering_gear']::text[],
  '0.900',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","page_type_reason":"technical data or specification heading","page_type_confidence":0.85}'::jsonb
)
ON CONFLICT (semantic_version_id, source_type, source_record_id) DO UPDATE SET
  page_type = EXCLUDED.page_type,
  content_hash = EXCLUDED.content_hash,
  model_tags = EXCLUDED.model_tags,
  component_tags = EXCLUDED.component_tags,
  provenance = EXCLUDED.provenance,
  updated_at = now();
INSERT INTO public.barry_evidence_units (
  id, document_id, source_type, source_record_id, physical_pdf_page, page_type,
  content_hash, system_tags, model_tags, component_tags, extraction_quality,
  semantic_version_id, backfill_run_id, provenance
) VALUES (
  '5195f2bd-d097-5936-8973-de9c9be699c4',
  '6e1cde1a-61c0-58ef-8f07-63f5a17654b2',
  'manual_chunk',
  '75614c1b-9ea4-4e2a-9fd5-0cc2d6e3d6c9',
  613,
  'procedure',
  '148f9c70ea975974775f9c53af50c323',
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY['component.portal_hub']::text[],
  '0.900',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","page_type_reason":"procedure heading in procedural manual","page_type_confidence":0.85}'::jsonb
)
ON CONFLICT (semantic_version_id, source_type, source_record_id) DO UPDATE SET
  page_type = EXCLUDED.page_type,
  content_hash = EXCLUDED.content_hash,
  model_tags = EXCLUDED.model_tags,
  component_tags = EXCLUDED.component_tags,
  provenance = EXCLUDED.provenance,
  updated_at = now();
INSERT INTO public.barry_evidence_units (
  id, document_id, source_type, source_record_id, physical_pdf_page, page_type,
  content_hash, system_tags, model_tags, component_tags, extraction_quality,
  semantic_version_id, backfill_run_id, provenance
) VALUES (
  '8bfc2324-0e38-596f-805c-120cfb25d7cc',
  'd0c0d16a-b2df-540a-8ee1-c8661148b033',
  'manual_chunk',
  '773c91aa-c203-4688-bf84-e52b1b6ebee9',
  621,
  'diagram',
  'a1e6b814a5434bbe3f4321133b548db8',
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY['component.power_steering_pump']::text[],
  '1.000',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","page_type_reason":"exploded-view or illustration heading","page_type_confidence":0.9}'::jsonb
)
ON CONFLICT (semantic_version_id, source_type, source_record_id) DO UPDATE SET
  page_type = EXCLUDED.page_type,
  content_hash = EXCLUDED.content_hash,
  model_tags = EXCLUDED.model_tags,
  component_tags = EXCLUDED.component_tags,
  provenance = EXCLUDED.provenance,
  updated_at = now();
INSERT INTO public.barry_evidence_units (
  id, document_id, source_type, source_record_id, physical_pdf_page, page_type,
  content_hash, system_tags, model_tags, component_tags, extraction_quality,
  semantic_version_id, backfill_run_id, provenance
) VALUES (
  '92fcbe79-492e-5c4b-8eaf-2135be5e228d',
  '6e1cde1a-61c0-58ef-8f07-63f5a17654b2',
  'manual_chunk',
  '7b7e48f6-efaa-4c99-9133-4fa007dab613',
  600,
  'procedure',
  '73f537cdff40de87c250322964a6ddd7',
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY['component.differential']::text[],
  '0.900',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","page_type_reason":"procedure heading in procedural manual","page_type_confidence":0.85}'::jsonb
)
ON CONFLICT (semantic_version_id, source_type, source_record_id) DO UPDATE SET
  page_type = EXCLUDED.page_type,
  content_hash = EXCLUDED.content_hash,
  model_tags = EXCLUDED.model_tags,
  component_tags = EXCLUDED.component_tags,
  provenance = EXCLUDED.provenance,
  updated_at = now();
INSERT INTO public.barry_evidence_units (
  id, document_id, source_type, source_record_id, physical_pdf_page, page_type,
  content_hash, system_tags, model_tags, component_tags, extraction_quality,
  semantic_version_id, backfill_run_id, provenance
) VALUES (
  '3fc2e4a2-e7f3-532c-8ef9-12e429989896',
  '6e1cde1a-61c0-58ef-8f07-63f5a17654b2',
  'manual_chunk',
  '7bf1047d-b035-4860-ad83-d636672ac9ab',
  614,
  'specification',
  'db5dac2a49e62627ef3267b5563ce94a',
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY['component.portal_hub']::text[],
  '0.900',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","page_type_reason":"technical data or specification heading","page_type_confidence":0.85}'::jsonb
)
ON CONFLICT (semantic_version_id, source_type, source_record_id) DO UPDATE SET
  page_type = EXCLUDED.page_type,
  content_hash = EXCLUDED.content_hash,
  model_tags = EXCLUDED.model_tags,
  component_tags = EXCLUDED.component_tags,
  provenance = EXCLUDED.provenance,
  updated_at = now();
INSERT INTO public.barry_evidence_units (
  id, document_id, source_type, source_record_id, physical_pdf_page, page_type,
  content_hash, system_tags, model_tags, component_tags, extraction_quality,
  semantic_version_id, backfill_run_id, provenance
) VALUES (
  '5bdac943-f3eb-544e-8e44-0a46b5232abf',
  'd0c0d16a-b2df-540a-8ee1-c8661148b033',
  'manual_chunk',
  '7c6484e2-ad81-4a1f-bad6-56835c3e5f80',
  603,
  'diagram',
  '6ea18f14d0d5db64a91daf2ff28d1bb4',
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY[]::text[],
  '1.000',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","page_type_reason":"exploded-view or illustration heading","page_type_confidence":0.9}'::jsonb
)
ON CONFLICT (semantic_version_id, source_type, source_record_id) DO UPDATE SET
  page_type = EXCLUDED.page_type,
  content_hash = EXCLUDED.content_hash,
  model_tags = EXCLUDED.model_tags,
  component_tags = EXCLUDED.component_tags,
  provenance = EXCLUDED.provenance,
  updated_at = now();
INSERT INTO public.barry_evidence_units (
  id, document_id, source_type, source_record_id, physical_pdf_page, page_type,
  content_hash, system_tags, model_tags, component_tags, extraction_quality,
  semantic_version_id, backfill_run_id, provenance
) VALUES (
  '0008c84e-3d26-5776-8477-cb984c112c6a',
  'd0c0d16a-b2df-540a-8ee1-c8661148b033',
  'manual_chunk',
  '81ef3b59-2237-4252-a59e-8223ebf3d833',
  623,
  'diagram',
  'a43993e61d7954ee374d74af022c2d2b',
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY['component.steering_reservoir']::text[],
  '1.000',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","page_type_reason":"exploded-view or illustration heading","page_type_confidence":0.9}'::jsonb
)
ON CONFLICT (semantic_version_id, source_type, source_record_id) DO UPDATE SET
  page_type = EXCLUDED.page_type,
  content_hash = EXCLUDED.content_hash,
  model_tags = EXCLUDED.model_tags,
  component_tags = EXCLUDED.component_tags,
  provenance = EXCLUDED.provenance,
  updated_at = now();
INSERT INTO public.barry_evidence_units (
  id, document_id, source_type, source_record_id, physical_pdf_page, page_type,
  content_hash, system_tags, model_tags, component_tags, extraction_quality,
  semantic_version_id, backfill_run_id, provenance
) VALUES (
  '329ab37f-7098-5734-80c1-c853d11cd2bc',
  '6e1cde1a-61c0-58ef-8f07-63f5a17654b2',
  'manual_chunk',
  '838aea2d-6546-466c-b835-41483aaab6b9',
  607,
  'procedure',
  '91b34111cc59eac517ab72dfff90e2f3',
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY['component.portal_hub']::text[],
  '0.900',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","page_type_reason":"procedure heading in procedural manual","page_type_confidence":0.85}'::jsonb
)
ON CONFLICT (semantic_version_id, source_type, source_record_id) DO UPDATE SET
  page_type = EXCLUDED.page_type,
  content_hash = EXCLUDED.content_hash,
  model_tags = EXCLUDED.model_tags,
  component_tags = EXCLUDED.component_tags,
  provenance = EXCLUDED.provenance,
  updated_at = now();
INSERT INTO public.barry_evidence_units (
  id, document_id, source_type, source_record_id, physical_pdf_page, page_type,
  content_hash, system_tags, model_tags, component_tags, extraction_quality,
  semantic_version_id, backfill_run_id, provenance
) VALUES (
  '6a293679-4bfa-5a15-888e-8f6c1949a289',
  '6e1cde1a-61c0-58ef-8f07-63f5a17654b2',
  'manual_chunk',
  '84e3c380-b84b-4b46-9b6c-f55ded0e263e',
  603,
  'explanation',
  'd44e6ac7ae08873c45d38ef3ab0bbb2f',
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY['component.portal_hub']::text[],
  '0.900',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","page_type_reason":"text content without a specific structural heading","page_type_confidence":0.6}'::jsonb
)
ON CONFLICT (semantic_version_id, source_type, source_record_id) DO UPDATE SET
  page_type = EXCLUDED.page_type,
  content_hash = EXCLUDED.content_hash,
  model_tags = EXCLUDED.model_tags,
  component_tags = EXCLUDED.component_tags,
  provenance = EXCLUDED.provenance,
  updated_at = now();
INSERT INTO public.barry_evidence_units (
  id, document_id, source_type, source_record_id, physical_pdf_page, page_type,
  content_hash, system_tags, model_tags, component_tags, extraction_quality,
  semantic_version_id, backfill_run_id, provenance
) VALUES (
  'b99025ad-4b52-57fb-8058-1ddbf9d5dc1b',
  '6e1cde1a-61c0-58ef-8f07-63f5a17654b2',
  'manual_chunk',
  '882b864a-72a5-40eb-a2b6-737a1bb9192b',
  612,
  'explanation',
  'd0c695b4a51e0a3c5464adf47660805b',
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY['component.portal_hub']::text[],
  '0.900',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","page_type_reason":"text content without a specific structural heading","page_type_confidence":0.6}'::jsonb
)
ON CONFLICT (semantic_version_id, source_type, source_record_id) DO UPDATE SET
  page_type = EXCLUDED.page_type,
  content_hash = EXCLUDED.content_hash,
  model_tags = EXCLUDED.model_tags,
  component_tags = EXCLUDED.component_tags,
  provenance = EXCLUDED.provenance,
  updated_at = now();
INSERT INTO public.barry_evidence_units (
  id, document_id, source_type, source_record_id, physical_pdf_page, page_type,
  content_hash, system_tags, model_tags, component_tags, extraction_quality,
  semantic_version_id, backfill_run_id, provenance
) VALUES (
  'a74d0d15-1def-52b3-89d1-02664db82597',
  '6e1cde1a-61c0-58ef-8f07-63f5a17654b2',
  'manual_chunk',
  '8ece9320-d935-4fa2-b21b-4096d3a67837',
  947,
  'explanation',
  'e4a95ea6435fda4c60a0ebfe61d000cb',
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY['component.steering_gear']::text[],
  '0.900',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","page_type_reason":"text content without a specific structural heading","page_type_confidence":0.6}'::jsonb
)
ON CONFLICT (semantic_version_id, source_type, source_record_id) DO UPDATE SET
  page_type = EXCLUDED.page_type,
  content_hash = EXCLUDED.content_hash,
  model_tags = EXCLUDED.model_tags,
  component_tags = EXCLUDED.component_tags,
  provenance = EXCLUDED.provenance,
  updated_at = now();
INSERT INTO public.barry_evidence_units (
  id, document_id, source_type, source_record_id, physical_pdf_page, page_type,
  content_hash, system_tags, model_tags, component_tags, extraction_quality,
  semantic_version_id, backfill_run_id, provenance
) VALUES (
  'd2c96fe2-dbc8-51ae-80f8-04e03b7c6751',
  'd0c0d16a-b2df-540a-8ee1-c8661148b033',
  'manual_chunk',
  '91c9d422-025a-49db-a161-f1734780deb1',
  611,
  'diagram',
  'b90adec0e498dc91b1123fd1e46ee480',
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY['component.steering_gear']::text[],
  '1.000',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","page_type_reason":"exploded-view or illustration heading","page_type_confidence":0.9}'::jsonb
)
ON CONFLICT (semantic_version_id, source_type, source_record_id) DO UPDATE SET
  page_type = EXCLUDED.page_type,
  content_hash = EXCLUDED.content_hash,
  model_tags = EXCLUDED.model_tags,
  component_tags = EXCLUDED.component_tags,
  provenance = EXCLUDED.provenance,
  updated_at = now();
INSERT INTO public.barry_evidence_units (
  id, document_id, source_type, source_record_id, physical_pdf_page, page_type,
  content_hash, system_tags, model_tags, component_tags, extraction_quality,
  semantic_version_id, backfill_run_id, provenance
) VALUES (
  '117b44f8-3664-575c-829d-12bd6b31dbe0',
  '6e1cde1a-61c0-58ef-8f07-63f5a17654b2',
  'manual_chunk',
  '92dce396-66dc-4e2d-a609-5523ab1c8685',
  933,
  'diagram',
  '903721dfb66ef6ae2925fee0fd183195',
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY[]::text[],
  '0.900',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","page_type_reason":"exploded-view or illustration heading","page_type_confidence":0.9}'::jsonb
)
ON CONFLICT (semantic_version_id, source_type, source_record_id) DO UPDATE SET
  page_type = EXCLUDED.page_type,
  content_hash = EXCLUDED.content_hash,
  model_tags = EXCLUDED.model_tags,
  component_tags = EXCLUDED.component_tags,
  provenance = EXCLUDED.provenance,
  updated_at = now();
INSERT INTO public.barry_evidence_units (
  id, document_id, source_type, source_record_id, physical_pdf_page, page_type,
  content_hash, system_tags, model_tags, component_tags, extraction_quality,
  semantic_version_id, backfill_run_id, provenance
) VALUES (
  '955c0f2c-cb94-58b5-8935-3d27a7614530',
  '6e1cde1a-61c0-58ef-8f07-63f5a17654b2',
  'manual_chunk',
  '93e85951-7aaa-49bd-badf-1ad112b53972',
  922,
  'explanation',
  '419408c8e4f69d4588f93c1a2c39e824',
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY[]::text[],
  '0.900',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","page_type_reason":"text content without a specific structural heading","page_type_confidence":0.6}'::jsonb
)
ON CONFLICT (semantic_version_id, source_type, source_record_id) DO UPDATE SET
  page_type = EXCLUDED.page_type,
  content_hash = EXCLUDED.content_hash,
  model_tags = EXCLUDED.model_tags,
  component_tags = EXCLUDED.component_tags,
  provenance = EXCLUDED.provenance,
  updated_at = now();
INSERT INTO public.barry_evidence_units (
  id, document_id, source_type, source_record_id, physical_pdf_page, page_type,
  content_hash, system_tags, model_tags, component_tags, extraction_quality,
  semantic_version_id, backfill_run_id, provenance
) VALUES (
  'cded524c-0785-50c4-8775-8d22cb886e87',
  'd0c0d16a-b2df-540a-8ee1-c8661148b033',
  'manual_chunk',
  '93f096ce-5de4-4d33-bfb9-f632f8a122dd',
  602,
  'diagram',
  'ecbdae489d3942eba218374f9f5d8ccb',
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY[]::text[],
  '1.000',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","page_type_reason":"exploded-view or illustration heading","page_type_confidence":0.9}'::jsonb
)
ON CONFLICT (semantic_version_id, source_type, source_record_id) DO UPDATE SET
  page_type = EXCLUDED.page_type,
  content_hash = EXCLUDED.content_hash,
  model_tags = EXCLUDED.model_tags,
  component_tags = EXCLUDED.component_tags,
  provenance = EXCLUDED.provenance,
  updated_at = now();
INSERT INTO public.barry_evidence_units (
  id, document_id, source_type, source_record_id, physical_pdf_page, page_type,
  content_hash, system_tags, model_tags, component_tags, extraction_quality,
  semantic_version_id, backfill_run_id, provenance
) VALUES (
  '5913b425-3230-5b77-8c94-e5974460b64d',
  '6e1cde1a-61c0-58ef-8f07-63f5a17654b2',
  'manual_chunk',
  '9633903c-273a-4b90-9c75-3c71f8fe0ef2',
  949,
  'explanation',
  'cd68c726bf1ddf1fcbaccc5f5d32b6a8',
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY['component.steering_gear']::text[],
  '0.900',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","page_type_reason":"text content without a specific structural heading","page_type_confidence":0.6}'::jsonb
)
ON CONFLICT (semantic_version_id, source_type, source_record_id) DO UPDATE SET
  page_type = EXCLUDED.page_type,
  content_hash = EXCLUDED.content_hash,
  model_tags = EXCLUDED.model_tags,
  component_tags = EXCLUDED.component_tags,
  provenance = EXCLUDED.provenance,
  updated_at = now();
INSERT INTO public.barry_evidence_units (
  id, document_id, source_type, source_record_id, physical_pdf_page, page_type,
  content_hash, system_tags, model_tags, component_tags, extraction_quality,
  semantic_version_id, backfill_run_id, provenance
) VALUES (
  'e4f3f205-0cd5-5e1e-836a-af8ad5d1e667',
  '6e1cde1a-61c0-58ef-8f07-63f5a17654b2',
  'manual_chunk',
  '9909d56f-d711-497c-bb49-2747bce7b63f',
  924,
  'explanation',
  'f7bacfcc29ba4a92777a0fd549de1b91',
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY[]::text[],
  '0.900',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","page_type_reason":"text content without a specific structural heading","page_type_confidence":0.6}'::jsonb
)
ON CONFLICT (semantic_version_id, source_type, source_record_id) DO UPDATE SET
  page_type = EXCLUDED.page_type,
  content_hash = EXCLUDED.content_hash,
  model_tags = EXCLUDED.model_tags,
  component_tags = EXCLUDED.component_tags,
  provenance = EXCLUDED.provenance,
  updated_at = now();
INSERT INTO public.barry_evidence_units (
  id, document_id, source_type, source_record_id, physical_pdf_page, page_type,
  content_hash, system_tags, model_tags, component_tags, extraction_quality,
  semantic_version_id, backfill_run_id, provenance
) VALUES (
  'd7d38d60-3d81-582e-8e62-62e17e561dbe',
  '6e1cde1a-61c0-58ef-8f07-63f5a17654b2',
  'manual_chunk',
  '9cc02539-3a0a-46cf-9af4-563ebbc36b84',
  951,
  'explanation',
  'ac8b484d62640593126c82c51b1bfd7c',
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY['component.pitman_arm']::text[],
  '0.900',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","page_type_reason":"text content without a specific structural heading","page_type_confidence":0.6}'::jsonb
)
ON CONFLICT (semantic_version_id, source_type, source_record_id) DO UPDATE SET
  page_type = EXCLUDED.page_type,
  content_hash = EXCLUDED.content_hash,
  model_tags = EXCLUDED.model_tags,
  component_tags = EXCLUDED.component_tags,
  provenance = EXCLUDED.provenance,
  updated_at = now();
INSERT INTO public.barry_evidence_units (
  id, document_id, source_type, source_record_id, physical_pdf_page, page_type,
  content_hash, system_tags, model_tags, component_tags, extraction_quality,
  semantic_version_id, backfill_run_id, provenance
) VALUES (
  '46279377-db33-5268-8738-80c7ffd99811',
  '6e1cde1a-61c0-58ef-8f07-63f5a17654b2',
  'manual_chunk',
  'a23debcb-c33a-4951-a8c3-8418205f10ea',
  938,
  'specification',
  '4f6582a45de0c4823f8a10d346dfefcc',
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY['component.pitman_arm', 'component.steering_gear']::text[],
  '0.900',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","page_type_reason":"technical data or specification heading","page_type_confidence":0.85}'::jsonb
)
ON CONFLICT (semantic_version_id, source_type, source_record_id) DO UPDATE SET
  page_type = EXCLUDED.page_type,
  content_hash = EXCLUDED.content_hash,
  model_tags = EXCLUDED.model_tags,
  component_tags = EXCLUDED.component_tags,
  provenance = EXCLUDED.provenance,
  updated_at = now();
INSERT INTO public.barry_evidence_units (
  id, document_id, source_type, source_record_id, physical_pdf_page, page_type,
  content_hash, system_tags, model_tags, component_tags, extraction_quality,
  semantic_version_id, backfill_run_id, provenance
) VALUES (
  'fefb8c7f-51c9-5bc0-823a-94a1dc9e0461',
  '6e1cde1a-61c0-58ef-8f07-63f5a17654b2',
  'manual_chunk',
  'a800a6b7-fc60-4739-b292-76ab82a2937c',
  927,
  'explanation',
  'bd1c6dedde44711162cbf9bffd199f28',
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY['component.steering_gear']::text[],
  '0.900',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","page_type_reason":"text content without a specific structural heading","page_type_confidence":0.6}'::jsonb
)
ON CONFLICT (semantic_version_id, source_type, source_record_id) DO UPDATE SET
  page_type = EXCLUDED.page_type,
  content_hash = EXCLUDED.content_hash,
  model_tags = EXCLUDED.model_tags,
  component_tags = EXCLUDED.component_tags,
  provenance = EXCLUDED.provenance,
  updated_at = now();
INSERT INTO public.barry_evidence_units (
  id, document_id, source_type, source_record_id, physical_pdf_page, page_type,
  content_hash, system_tags, model_tags, component_tags, extraction_quality,
  semantic_version_id, backfill_run_id, provenance
) VALUES (
  'cbbe154d-e3dd-53b9-8d04-5cfe65026c70',
  'd0c0d16a-b2df-540a-8ee1-c8661148b033',
  'manual_chunk',
  'a9c8d9e9-0cc6-4e7a-a9a7-a3e05ca1800d',
  619,
  'diagram',
  '6f8185ef535e4605a245d80ea6fc33c2',
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY['component.power_steering_pump', 'component.steering_gear']::text[],
  '1.000',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","page_type_reason":"exploded-view or illustration heading","page_type_confidence":0.9}'::jsonb
)
ON CONFLICT (semantic_version_id, source_type, source_record_id) DO UPDATE SET
  page_type = EXCLUDED.page_type,
  content_hash = EXCLUDED.content_hash,
  model_tags = EXCLUDED.model_tags,
  component_tags = EXCLUDED.component_tags,
  provenance = EXCLUDED.provenance,
  updated_at = now();
INSERT INTO public.barry_evidence_units (
  id, document_id, source_type, source_record_id, physical_pdf_page, page_type,
  content_hash, system_tags, model_tags, component_tags, extraction_quality,
  semantic_version_id, backfill_run_id, provenance
) VALUES (
  '18a9664d-7764-57ea-8433-14954f55b61c',
  '6e1cde1a-61c0-58ef-8f07-63f5a17654b2',
  'manual_chunk',
  'aa0ddb90-faf1-4fa6-92b4-b3a7f9848d65',
  921,
  'diagram',
  'a157fc8ce1438f40d94b90f3782059f9',
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY[]::text[],
  '0.900',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","page_type_reason":"exploded-view or illustration heading","page_type_confidence":0.9}'::jsonb
)
ON CONFLICT (semantic_version_id, source_type, source_record_id) DO UPDATE SET
  page_type = EXCLUDED.page_type,
  content_hash = EXCLUDED.content_hash,
  model_tags = EXCLUDED.model_tags,
  component_tags = EXCLUDED.component_tags,
  provenance = EXCLUDED.provenance,
  updated_at = now();
INSERT INTO public.barry_evidence_units (
  id, document_id, source_type, source_record_id, physical_pdf_page, page_type,
  content_hash, system_tags, model_tags, component_tags, extraction_quality,
  semantic_version_id, backfill_run_id, provenance
) VALUES (
  'f359b33a-d730-593a-8fe3-08255158911f',
  '6e1cde1a-61c0-58ef-8f07-63f5a17654b2',
  'manual_chunk',
  'abc8923f-bd7a-4e5f-8ce7-8a9394b428dc',
  608,
  'explanation',
  '93355b8df53d1ba75fef6d110ca29543',
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY['component.portal_hub']::text[],
  '0.900',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","page_type_reason":"text content without a specific structural heading","page_type_confidence":0.6}'::jsonb
)
ON CONFLICT (semantic_version_id, source_type, source_record_id) DO UPDATE SET
  page_type = EXCLUDED.page_type,
  content_hash = EXCLUDED.content_hash,
  model_tags = EXCLUDED.model_tags,
  component_tags = EXCLUDED.component_tags,
  provenance = EXCLUDED.provenance,
  updated_at = now();
INSERT INTO public.barry_evidence_units (
  id, document_id, source_type, source_record_id, physical_pdf_page, page_type,
  content_hash, system_tags, model_tags, component_tags, extraction_quality,
  semantic_version_id, backfill_run_id, provenance
) VALUES (
  '2dafa4be-8468-52ba-8af6-8c5befad8e06',
  'd0c0d16a-b2df-540a-8ee1-c8661148b033',
  'manual_chunk',
  'b1a4f1ff-dc05-47ff-97cd-0976b51bae30',
  615,
  'diagram',
  'fec914c549c9790d0bdeb278561c22f6',
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY['component.power_steering_pump']::text[],
  '1.000',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","page_type_reason":"exploded-view or illustration heading","page_type_confidence":0.9}'::jsonb
)
ON CONFLICT (semantic_version_id, source_type, source_record_id) DO UPDATE SET
  page_type = EXCLUDED.page_type,
  content_hash = EXCLUDED.content_hash,
  model_tags = EXCLUDED.model_tags,
  component_tags = EXCLUDED.component_tags,
  provenance = EXCLUDED.provenance,
  updated_at = now();
INSERT INTO public.barry_evidence_units (
  id, document_id, source_type, source_record_id, physical_pdf_page, page_type,
  content_hash, system_tags, model_tags, component_tags, extraction_quality,
  semantic_version_id, backfill_run_id, provenance
) VALUES (
  '2b6d922f-cf0b-55d7-81a6-7f32d294f91c',
  'd0c0d16a-b2df-540a-8ee1-c8661148b033',
  'manual_chunk',
  'b303a866-f209-4dd1-9da3-cf9e134f2a98',
  592,
  'diagram',
  'b0370becde36668cab33ad031b14aa43',
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY[]::text[],
  '1.000',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","page_type_reason":"exploded-view or illustration heading","page_type_confidence":0.9}'::jsonb
)
ON CONFLICT (semantic_version_id, source_type, source_record_id) DO UPDATE SET
  page_type = EXCLUDED.page_type,
  content_hash = EXCLUDED.content_hash,
  model_tags = EXCLUDED.model_tags,
  component_tags = EXCLUDED.component_tags,
  provenance = EXCLUDED.provenance,
  updated_at = now();
INSERT INTO public.barry_evidence_units (
  id, document_id, source_type, source_record_id, physical_pdf_page, page_type,
  content_hash, system_tags, model_tags, component_tags, extraction_quality,
  semantic_version_id, backfill_run_id, provenance
) VALUES (
  '42565e2b-4e40-58b1-866b-f25f2490e258',
  'd0c0d16a-b2df-540a-8ee1-c8661148b033',
  'manual_chunk',
  'b5953b49-4a1c-4f67-8702-775fef8615fa',
  629,
  'diagram',
  '98b8839bce424cb7260ad40a3356f5e8',
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY[]::text[],
  '1.000',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","page_type_reason":"exploded-view or illustration heading","page_type_confidence":0.9}'::jsonb
)
ON CONFLICT (semantic_version_id, source_type, source_record_id) DO UPDATE SET
  page_type = EXCLUDED.page_type,
  content_hash = EXCLUDED.content_hash,
  model_tags = EXCLUDED.model_tags,
  component_tags = EXCLUDED.component_tags,
  provenance = EXCLUDED.provenance,
  updated_at = now();
INSERT INTO public.barry_evidence_units (
  id, document_id, source_type, source_record_id, physical_pdf_page, page_type,
  content_hash, system_tags, model_tags, component_tags, extraction_quality,
  semantic_version_id, backfill_run_id, provenance
) VALUES (
  '909409c5-3c14-5cbf-8855-740350d0eb40',
  'd0c0d16a-b2df-540a-8ee1-c8661148b033',
  'manual_chunk',
  'b6575a08-549b-441c-b4ba-ee33e53663c0',
  617,
  'diagram',
  '6b60224007e58e491e0d6fe53be308be',
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY['component.power_steering_pump']::text[],
  '1.000',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","page_type_reason":"exploded-view or illustration heading","page_type_confidence":0.9}'::jsonb
)
ON CONFLICT (semantic_version_id, source_type, source_record_id) DO UPDATE SET
  page_type = EXCLUDED.page_type,
  content_hash = EXCLUDED.content_hash,
  model_tags = EXCLUDED.model_tags,
  component_tags = EXCLUDED.component_tags,
  provenance = EXCLUDED.provenance,
  updated_at = now();
INSERT INTO public.barry_evidence_units (
  id, document_id, source_type, source_record_id, physical_pdf_page, page_type,
  content_hash, system_tags, model_tags, component_tags, extraction_quality,
  semantic_version_id, backfill_run_id, provenance
) VALUES (
  'e221419b-02f4-516a-847e-e751c7b69f8e',
  '6e1cde1a-61c0-58ef-8f07-63f5a17654b2',
  'manual_chunk',
  'bbb3bece-70b1-4eda-88aa-09c07ffd9a2f',
  952,
  'diagram',
  '6f27cbff0591d1b1997e9ac83efbbef9',
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY['component.steering_gear']::text[],
  '0.900',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","page_type_reason":"exploded-view or illustration heading","page_type_confidence":0.9}'::jsonb
)
ON CONFLICT (semantic_version_id, source_type, source_record_id) DO UPDATE SET
  page_type = EXCLUDED.page_type,
  content_hash = EXCLUDED.content_hash,
  model_tags = EXCLUDED.model_tags,
  component_tags = EXCLUDED.component_tags,
  provenance = EXCLUDED.provenance,
  updated_at = now();
INSERT INTO public.barry_evidence_units (
  id, document_id, source_type, source_record_id, physical_pdf_page, page_type,
  content_hash, system_tags, model_tags, component_tags, extraction_quality,
  semantic_version_id, backfill_run_id, provenance
) VALUES (
  '8a0f0d39-bfc4-581e-8b5a-9207ac25eb46',
  '6e1cde1a-61c0-58ef-8f07-63f5a17654b2',
  'manual_chunk',
  'bcdba8c0-cc2a-4928-bd3c-5e859189f98e',
  605,
  'procedure',
  '1a5ea7486f5de533de7aa5c9f52f9832',
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY['component.portal_hub']::text[],
  '0.900',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","page_type_reason":"procedure heading in procedural manual","page_type_confidence":0.85}'::jsonb
)
ON CONFLICT (semantic_version_id, source_type, source_record_id) DO UPDATE SET
  page_type = EXCLUDED.page_type,
  content_hash = EXCLUDED.content_hash,
  model_tags = EXCLUDED.model_tags,
  component_tags = EXCLUDED.component_tags,
  provenance = EXCLUDED.provenance,
  updated_at = now();
INSERT INTO public.barry_evidence_units (
  id, document_id, source_type, source_record_id, physical_pdf_page, page_type,
  content_hash, system_tags, model_tags, component_tags, extraction_quality,
  semantic_version_id, backfill_run_id, provenance
) VALUES (
  '1e70c518-eada-59bd-8864-8ab5b69bb8d4',
  'd0c0d16a-b2df-540a-8ee1-c8661148b033',
  'manual_chunk',
  'bd37e8c3-bf84-4a3c-adb5-e9a20a5dc29b',
  593,
  'diagram',
  'a4e074659f22ed0a6cd945341cbc40d5',
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY[]::text[],
  '1.000',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","page_type_reason":"exploded-view or illustration heading","page_type_confidence":0.9}'::jsonb
)
ON CONFLICT (semantic_version_id, source_type, source_record_id) DO UPDATE SET
  page_type = EXCLUDED.page_type,
  content_hash = EXCLUDED.content_hash,
  model_tags = EXCLUDED.model_tags,
  component_tags = EXCLUDED.component_tags,
  provenance = EXCLUDED.provenance,
  updated_at = now();
INSERT INTO public.barry_evidence_units (
  id, document_id, source_type, source_record_id, physical_pdf_page, page_type,
  content_hash, system_tags, model_tags, component_tags, extraction_quality,
  semantic_version_id, backfill_run_id, provenance
) VALUES (
  'dce7e4bc-7898-5a7b-818a-506638b3d8b6',
  '6e1cde1a-61c0-58ef-8f07-63f5a17654b2',
  'manual_chunk',
  'bd8e2a21-039d-4937-abab-435e89d7d260',
  602,
  'explanation',
  '0ee760bc7f1c13f13fae84a6ae9bf2c6',
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY['component.differential']::text[],
  '0.900',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","page_type_reason":"text content without a specific structural heading","page_type_confidence":0.6}'::jsonb
)
ON CONFLICT (semantic_version_id, source_type, source_record_id) DO UPDATE SET
  page_type = EXCLUDED.page_type,
  content_hash = EXCLUDED.content_hash,
  model_tags = EXCLUDED.model_tags,
  component_tags = EXCLUDED.component_tags,
  provenance = EXCLUDED.provenance,
  updated_at = now();
INSERT INTO public.barry_evidence_units (
  id, document_id, source_type, source_record_id, physical_pdf_page, page_type,
  content_hash, system_tags, model_tags, component_tags, extraction_quality,
  semantic_version_id, backfill_run_id, provenance
) VALUES (
  'aa91bf24-5482-5b9c-8299-ed1979070193',
  '6e1cde1a-61c0-58ef-8f07-63f5a17654b2',
  'manual_chunk',
  'd2394cb5-6a4e-4db6-adc4-ec57cfd1c0d0',
  935,
  'diagram',
  '3e40ad74a60c0ae17d5ddd6597fd8321',
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY[]::text[],
  '0.900',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","page_type_reason":"exploded-view or illustration heading","page_type_confidence":0.9}'::jsonb
)
ON CONFLICT (semantic_version_id, source_type, source_record_id) DO UPDATE SET
  page_type = EXCLUDED.page_type,
  content_hash = EXCLUDED.content_hash,
  model_tags = EXCLUDED.model_tags,
  component_tags = EXCLUDED.component_tags,
  provenance = EXCLUDED.provenance,
  updated_at = now();
INSERT INTO public.barry_evidence_units (
  id, document_id, source_type, source_record_id, physical_pdf_page, page_type,
  content_hash, system_tags, model_tags, component_tags, extraction_quality,
  semantic_version_id, backfill_run_id, provenance
) VALUES (
  '786ab3ee-196b-5012-8df3-ea398250f7af',
  '6e1cde1a-61c0-58ef-8f07-63f5a17654b2',
  'manual_chunk',
  'd2ec1434-7ddb-4b96-9483-c11eeef37dc9',
  925,
  'explanation',
  'a97a70f0e1dfe6b93a9fe69fd697edc2',
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY['component.power_steering_pump']::text[],
  '0.900',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","page_type_reason":"text content without a specific structural heading","page_type_confidence":0.6}'::jsonb
)
ON CONFLICT (semantic_version_id, source_type, source_record_id) DO UPDATE SET
  page_type = EXCLUDED.page_type,
  content_hash = EXCLUDED.content_hash,
  model_tags = EXCLUDED.model_tags,
  component_tags = EXCLUDED.component_tags,
  provenance = EXCLUDED.provenance,
  updated_at = now();
INSERT INTO public.barry_evidence_units (
  id, document_id, source_type, source_record_id, physical_pdf_page, page_type,
  content_hash, system_tags, model_tags, component_tags, extraction_quality,
  semantic_version_id, backfill_run_id, provenance
) VALUES (
  '89c7a78b-4479-594f-8c16-2f4dbaa8a90b',
  '6e1cde1a-61c0-58ef-8f07-63f5a17654b2',
  'manual_chunk',
  'd9f68ff2-6825-49a1-9cce-55e41b6a0191',
  929,
  'explanation',
  '72888d6574c3eb34a46a4d07eab17424',
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY['component.pitman_arm']::text[],
  '0.900',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","page_type_reason":"text content without a specific structural heading","page_type_confidence":0.6}'::jsonb
)
ON CONFLICT (semantic_version_id, source_type, source_record_id) DO UPDATE SET
  page_type = EXCLUDED.page_type,
  content_hash = EXCLUDED.content_hash,
  model_tags = EXCLUDED.model_tags,
  component_tags = EXCLUDED.component_tags,
  provenance = EXCLUDED.provenance,
  updated_at = now();
INSERT INTO public.barry_evidence_units (
  id, document_id, source_type, source_record_id, physical_pdf_page, page_type,
  content_hash, system_tags, model_tags, component_tags, extraction_quality,
  semantic_version_id, backfill_run_id, provenance
) VALUES (
  '0d6f956d-c53d-5502-8d10-cc1b5c579b05',
  'd0c0d16a-b2df-540a-8ee1-c8661148b033',
  'manual_chunk',
  'dd4a0c88-c0b8-49a1-b007-a34c4b4192af',
  609,
  'diagram',
  '0459cc4a431d4203966d5e985b58ecfd',
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY['component.steering_gear']::text[],
  '1.000',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","page_type_reason":"exploded-view or illustration heading","page_type_confidence":0.9}'::jsonb
)
ON CONFLICT (semantic_version_id, source_type, source_record_id) DO UPDATE SET
  page_type = EXCLUDED.page_type,
  content_hash = EXCLUDED.content_hash,
  model_tags = EXCLUDED.model_tags,
  component_tags = EXCLUDED.component_tags,
  provenance = EXCLUDED.provenance,
  updated_at = now();
INSERT INTO public.barry_evidence_units (
  id, document_id, source_type, source_record_id, physical_pdf_page, page_type,
  content_hash, system_tags, model_tags, component_tags, extraction_quality,
  semantic_version_id, backfill_run_id, provenance
) VALUES (
  '28b8e078-33b2-5214-8842-e2a0dbc6cb83',
  '6e1cde1a-61c0-58ef-8f07-63f5a17654b2',
  'manual_chunk',
  'ddf27575-717c-4468-8b08-edec9a2d661c',
  615,
  'procedure',
  '7f9281337dfae166491753f39659ed38',
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY['component.differential']::text[],
  '0.900',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","page_type_reason":"procedure heading in procedural manual","page_type_confidence":0.85}'::jsonb
)
ON CONFLICT (semantic_version_id, source_type, source_record_id) DO UPDATE SET
  page_type = EXCLUDED.page_type,
  content_hash = EXCLUDED.content_hash,
  model_tags = EXCLUDED.model_tags,
  component_tags = EXCLUDED.component_tags,
  provenance = EXCLUDED.provenance,
  updated_at = now();
INSERT INTO public.barry_evidence_units (
  id, document_id, source_type, source_record_id, physical_pdf_page, page_type,
  content_hash, system_tags, model_tags, component_tags, extraction_quality,
  semantic_version_id, backfill_run_id, provenance
) VALUES (
  '943301b6-567e-566f-8403-4656b2e9415e',
  '6e1cde1a-61c0-58ef-8f07-63f5a17654b2',
  'manual_chunk',
  'df4fd78f-be12-4cd5-8a9c-1a5589e72f8b',
  944,
  'procedure',
  'b0a04c7a5ed46c6908e10a28f4483428',
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY[]::text[],
  '0.900',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","page_type_reason":"procedure heading in procedural manual","page_type_confidence":0.85}'::jsonb
)
ON CONFLICT (semantic_version_id, source_type, source_record_id) DO UPDATE SET
  page_type = EXCLUDED.page_type,
  content_hash = EXCLUDED.content_hash,
  model_tags = EXCLUDED.model_tags,
  component_tags = EXCLUDED.component_tags,
  provenance = EXCLUDED.provenance,
  updated_at = now();
INSERT INTO public.barry_evidence_units (
  id, document_id, source_type, source_record_id, physical_pdf_page, page_type,
  content_hash, system_tags, model_tags, component_tags, extraction_quality,
  semantic_version_id, backfill_run_id, provenance
) VALUES (
  '5f90ad36-1f70-5eb2-85a2-4fae3376e289',
  '6e1cde1a-61c0-58ef-8f07-63f5a17654b2',
  'manual_chunk',
  'df798df4-b14a-487e-b45a-bf08bc4b49b0',
  931,
  'explanation',
  'cbd7bac1607e75493d54db769fe4a62a',
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY['component.pitman_arm']::text[],
  '0.900',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","page_type_reason":"text content without a specific structural heading","page_type_confidence":0.6}'::jsonb
)
ON CONFLICT (semantic_version_id, source_type, source_record_id) DO UPDATE SET
  page_type = EXCLUDED.page_type,
  content_hash = EXCLUDED.content_hash,
  model_tags = EXCLUDED.model_tags,
  component_tags = EXCLUDED.component_tags,
  provenance = EXCLUDED.provenance,
  updated_at = now();
INSERT INTO public.barry_evidence_units (
  id, document_id, source_type, source_record_id, physical_pdf_page, page_type,
  content_hash, system_tags, model_tags, component_tags, extraction_quality,
  semantic_version_id, backfill_run_id, provenance
) VALUES (
  'cfd12153-c4e9-5f31-86dd-fd659a773219',
  '6e1cde1a-61c0-58ef-8f07-63f5a17654b2',
  'manual_chunk',
  'df863edc-7f53-4415-a7b6-5acebece145d',
  945,
  'explanation',
  '4db6ae2e6b90ad6db4a79d85f81000db',
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY[]::text[],
  '0.900',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","page_type_reason":"text content without a specific structural heading","page_type_confidence":0.6}'::jsonb
)
ON CONFLICT (semantic_version_id, source_type, source_record_id) DO UPDATE SET
  page_type = EXCLUDED.page_type,
  content_hash = EXCLUDED.content_hash,
  model_tags = EXCLUDED.model_tags,
  component_tags = EXCLUDED.component_tags,
  provenance = EXCLUDED.provenance,
  updated_at = now();
INSERT INTO public.barry_evidence_units (
  id, document_id, source_type, source_record_id, physical_pdf_page, page_type,
  content_hash, system_tags, model_tags, component_tags, extraction_quality,
  semantic_version_id, backfill_run_id, provenance
) VALUES (
  'a356bd40-e45c-5f0e-8288-e28fdb8952ee',
  '6e1cde1a-61c0-58ef-8f07-63f5a17654b2',
  'manual_chunk',
  'e434ab88-0302-42e1-92ec-fa0b16084025',
  926,
  'specification',
  '1cce3a896f8791882f91888d51fffe09',
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY['component.steering_gear', 'component.pitman_arm']::text[],
  '0.900',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","page_type_reason":"technical data or specification heading","page_type_confidence":0.85}'::jsonb
)
ON CONFLICT (semantic_version_id, source_type, source_record_id) DO UPDATE SET
  page_type = EXCLUDED.page_type,
  content_hash = EXCLUDED.content_hash,
  model_tags = EXCLUDED.model_tags,
  component_tags = EXCLUDED.component_tags,
  provenance = EXCLUDED.provenance,
  updated_at = now();
INSERT INTO public.barry_evidence_units (
  id, document_id, source_type, source_record_id, physical_pdf_page, page_type,
  content_hash, system_tags, model_tags, component_tags, extraction_quality,
  semantic_version_id, backfill_run_id, provenance
) VALUES (
  '99e6caab-0eee-56ed-848a-b7547286ea9a',
  '6e1cde1a-61c0-58ef-8f07-63f5a17654b2',
  'manual_chunk',
  'e6296b81-df26-4edf-bbf8-ce3c4ef3c1c1',
  960,
  'explanation',
  '7bf1e8d07a4644eb788d1b8088c60f96',
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY['component.steering_gear']::text[],
  '0.900',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","page_type_reason":"text content without a specific structural heading","page_type_confidence":0.6}'::jsonb
)
ON CONFLICT (semantic_version_id, source_type, source_record_id) DO UPDATE SET
  page_type = EXCLUDED.page_type,
  content_hash = EXCLUDED.content_hash,
  model_tags = EXCLUDED.model_tags,
  component_tags = EXCLUDED.component_tags,
  provenance = EXCLUDED.provenance,
  updated_at = now();
INSERT INTO public.barry_evidence_units (
  id, document_id, source_type, source_record_id, physical_pdf_page, page_type,
  content_hash, system_tags, model_tags, component_tags, extraction_quality,
  semantic_version_id, backfill_run_id, provenance
) VALUES (
  'dc5e5b34-fdcd-5e82-8376-9d851225aa16',
  '6e1cde1a-61c0-58ef-8f07-63f5a17654b2',
  'manual_chunk',
  'ecbc185b-e4a5-443b-88d8-df7c1cb6a97e',
  937,
  'explanation',
  'b322a47b01bdf9ed015aae4da4403b74',
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY['component.pitman_arm', 'component.steering_gear']::text[],
  '0.900',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","page_type_reason":"text content without a specific structural heading","page_type_confidence":0.6}'::jsonb
)
ON CONFLICT (semantic_version_id, source_type, source_record_id) DO UPDATE SET
  page_type = EXCLUDED.page_type,
  content_hash = EXCLUDED.content_hash,
  model_tags = EXCLUDED.model_tags,
  component_tags = EXCLUDED.component_tags,
  provenance = EXCLUDED.provenance,
  updated_at = now();
INSERT INTO public.barry_evidence_units (
  id, document_id, source_type, source_record_id, physical_pdf_page, page_type,
  content_hash, system_tags, model_tags, component_tags, extraction_quality,
  semantic_version_id, backfill_run_id, provenance
) VALUES (
  'a3d959fd-5b36-599f-872d-eb2fa289f111',
  '6e1cde1a-61c0-58ef-8f07-63f5a17654b2',
  'manual_chunk',
  'f224690c-cb7a-4cec-a7ee-c4dca40ecd10',
  955,
  'explanation',
  '57471f9c18d7ca5c87856b5dbe20a7da',
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY['component.pitman_arm', 'component.steering_gear']::text[],
  '0.900',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","page_type_reason":"text content without a specific structural heading","page_type_confidence":0.6}'::jsonb
)
ON CONFLICT (semantic_version_id, source_type, source_record_id) DO UPDATE SET
  page_type = EXCLUDED.page_type,
  content_hash = EXCLUDED.content_hash,
  model_tags = EXCLUDED.model_tags,
  component_tags = EXCLUDED.component_tags,
  provenance = EXCLUDED.provenance,
  updated_at = now();
INSERT INTO public.barry_evidence_units (
  id, document_id, source_type, source_record_id, physical_pdf_page, page_type,
  content_hash, system_tags, model_tags, component_tags, extraction_quality,
  semantic_version_id, backfill_run_id, provenance
) VALUES (
  'ad193401-5fc2-5520-8717-c46faad55952',
  '6e1cde1a-61c0-58ef-8f07-63f5a17654b2',
  'manual_chunk',
  'f4d8a211-4620-4987-a155-3319f08308a7',
  957,
  'explanation',
  'be8414f70c67d05a0de7cf61b85a167a',
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY['component.pitman_arm', 'component.steering_gear']::text[],
  '0.900',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","page_type_reason":"text content without a specific structural heading","page_type_confidence":0.6}'::jsonb
)
ON CONFLICT (semantic_version_id, source_type, source_record_id) DO UPDATE SET
  page_type = EXCLUDED.page_type,
  content_hash = EXCLUDED.content_hash,
  model_tags = EXCLUDED.model_tags,
  component_tags = EXCLUDED.component_tags,
  provenance = EXCLUDED.provenance,
  updated_at = now();
INSERT INTO public.barry_evidence_units (
  id, document_id, source_type, source_record_id, physical_pdf_page, page_type,
  content_hash, system_tags, model_tags, component_tags, extraction_quality,
  semantic_version_id, backfill_run_id, provenance
) VALUES (
  'a778a632-06c0-5448-835b-3c81fc787839',
  '6e1cde1a-61c0-58ef-8f07-63f5a17654b2',
  'manual_chunk',
  'f54ff615-9da5-4a84-90f9-cbdb14e26d2a',
  601,
  'explanation',
  '2740395fd1738b05f1d787bcf99b355f',
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY['component.differential']::text[],
  '0.900',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","page_type_reason":"text content without a specific structural heading","page_type_confidence":0.6}'::jsonb
)
ON CONFLICT (semantic_version_id, source_type, source_record_id) DO UPDATE SET
  page_type = EXCLUDED.page_type,
  content_hash = EXCLUDED.content_hash,
  model_tags = EXCLUDED.model_tags,
  component_tags = EXCLUDED.component_tags,
  provenance = EXCLUDED.provenance,
  updated_at = now();
INSERT INTO public.barry_evidence_units (
  id, document_id, source_type, source_record_id, physical_pdf_page, page_type,
  content_hash, system_tags, model_tags, component_tags, extraction_quality,
  semantic_version_id, backfill_run_id, provenance
) VALUES (
  '39941ee9-4d86-58e4-837b-fdb44610d89b',
  'd0c0d16a-b2df-540a-8ee1-c8661148b033',
  'manual_chunk',
  'f5974288-91c8-48ce-ba86-7b29ab316508',
  607,
  'diagram',
  '1a7e65d6adf90dc86c064899e382210f',
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY['component.steering_gear']::text[],
  '1.000',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","page_type_reason":"exploded-view or illustration heading","page_type_confidence":0.9}'::jsonb
)
ON CONFLICT (semantic_version_id, source_type, source_record_id) DO UPDATE SET
  page_type = EXCLUDED.page_type,
  content_hash = EXCLUDED.content_hash,
  model_tags = EXCLUDED.model_tags,
  component_tags = EXCLUDED.component_tags,
  provenance = EXCLUDED.provenance,
  updated_at = now();
INSERT INTO public.barry_evidence_units (
  id, document_id, source_type, source_record_id, physical_pdf_page, page_type,
  content_hash, system_tags, model_tags, component_tags, extraction_quality,
  semantic_version_id, backfill_run_id, provenance
) VALUES (
  'ebe496e9-e193-565e-87a9-bcf5beac03b6',
  'd0c0d16a-b2df-540a-8ee1-c8661148b033',
  'manual_chunk',
  'f70ebec1-f11f-4cff-a9bd-8b9f5326c921',
  597,
  'diagram',
  '8ea6bfe97e0fff66f17eaba9560919e4',
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY[]::text[],
  '1.000',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","page_type_reason":"exploded-view or illustration heading","page_type_confidence":0.9}'::jsonb
)
ON CONFLICT (semantic_version_id, source_type, source_record_id) DO UPDATE SET
  page_type = EXCLUDED.page_type,
  content_hash = EXCLUDED.content_hash,
  model_tags = EXCLUDED.model_tags,
  component_tags = EXCLUDED.component_tags,
  provenance = EXCLUDED.provenance,
  updated_at = now();
INSERT INTO public.barry_evidence_units (
  id, document_id, source_type, source_record_id, physical_pdf_page, page_type,
  content_hash, system_tags, model_tags, component_tags, extraction_quality,
  semantic_version_id, backfill_run_id, provenance
) VALUES (
  '4179a2b5-8e8b-55f6-8fd4-be7f8bd3722d',
  '6e1cde1a-61c0-58ef-8f07-63f5a17654b2',
  'manual_chunk',
  'f9137460-9154-4961-b4d6-dbafc6778785',
  948,
  'specification',
  'b1b98158f52027447d34c3bd719d3e72',
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY['component.pitman_arm', 'component.steering_gear']::text[],
  '0.900',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","page_type_reason":"technical data or specification heading","page_type_confidence":0.85}'::jsonb
)
ON CONFLICT (semantic_version_id, source_type, source_record_id) DO UPDATE SET
  page_type = EXCLUDED.page_type,
  content_hash = EXCLUDED.content_hash,
  model_tags = EXCLUDED.model_tags,
  component_tags = EXCLUDED.component_tags,
  provenance = EXCLUDED.provenance,
  updated_at = now();
INSERT INTO public.barry_evidence_units (
  id, document_id, source_type, source_record_id, physical_pdf_page, page_type,
  content_hash, system_tags, model_tags, component_tags, extraction_quality,
  semantic_version_id, backfill_run_id, provenance
) VALUES (
  '9bdc2c64-b683-553d-868a-28534929155b',
  'd0c0d16a-b2df-540a-8ee1-c8661148b033',
  'manual_chunk',
  'f9e16d39-db38-43dc-9d18-6b5f9c80db78',
  625,
  'diagram',
  'eb46e1a097ed52ebeea67759263c37b8',
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY['component.steering_reservoir']::text[],
  '1.000',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","page_type_reason":"exploded-view or illustration heading","page_type_confidence":0.9}'::jsonb
)
ON CONFLICT (semantic_version_id, source_type, source_record_id) DO UPDATE SET
  page_type = EXCLUDED.page_type,
  content_hash = EXCLUDED.content_hash,
  model_tags = EXCLUDED.model_tags,
  component_tags = EXCLUDED.component_tags,
  provenance = EXCLUDED.provenance,
  updated_at = now();
INSERT INTO public.barry_evidence_units (
  id, document_id, source_type, source_record_id, physical_pdf_page, page_type,
  content_hash, system_tags, model_tags, component_tags, extraction_quality,
  semantic_version_id, backfill_run_id, provenance
) VALUES (
  '14630c58-8819-5c34-8867-ca771f42ff50',
  'd0c0d16a-b2df-540a-8ee1-c8661148b033',
  'manual_chunk',
  'fe3df384-d994-4bb4-b413-1a67ad937d39',
  598,
  'diagram',
  'dee8940cb8e65042381f5aa4d6f1cde5',
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY[]::text[],
  '1.000',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","page_type_reason":"exploded-view or illustration heading","page_type_confidence":0.9}'::jsonb
)
ON CONFLICT (semantic_version_id, source_type, source_record_id) DO UPDATE SET
  page_type = EXCLUDED.page_type,
  content_hash = EXCLUDED.content_hash,
  model_tags = EXCLUDED.model_tags,
  component_tags = EXCLUDED.component_tags,
  provenance = EXCLUDED.provenance,
  updated_at = now();
INSERT INTO public.barry_evidence_units (
  id, document_id, source_type, source_record_id, physical_pdf_page, page_type,
  content_hash, system_tags, model_tags, component_tags, extraction_quality,
  semantic_version_id, backfill_run_id, provenance
) VALUES (
  '349fa9a3-ee20-5153-8b11-558c658f9c28',
  '6e1cde1a-61c0-58ef-8f07-63f5a17654b2',
  'manual_chunk',
  'ff3dcab4-abfe-4f45-97ae-2800dc818588',
  941,
  'explanation',
  '5c6b1fac1c3e0d12cf82f33c00bf5246',
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY['component.steering_gear']::text[],
  '0.900',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","page_type_reason":"text content without a specific structural heading","page_type_confidence":0.6}'::jsonb
)
ON CONFLICT (semantic_version_id, source_type, source_record_id) DO UPDATE SET
  page_type = EXCLUDED.page_type,
  content_hash = EXCLUDED.content_hash,
  model_tags = EXCLUDED.model_tags,
  component_tags = EXCLUDED.component_tags,
  provenance = EXCLUDED.provenance,
  updated_at = now();
INSERT INTO public.barry_evidence_units (
  id, document_id, source_type, source_record_id, physical_pdf_page, page_type,
  content_hash, system_tags, model_tags, component_tags, extraction_quality,
  semantic_version_id, backfill_run_id, provenance
) VALUES (
  '58b28977-4523-5ac4-8a16-5ad1c4976026',
  '2be70ccd-adb0-5a83-8adf-f26d571044e3',
  'rps_illustration',
  '4c6814a2-12e8-4877-9123-80d72c36cfef',
  620,
  'diagram',
  NULL,
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY['component.power_steering_pump']::text[],
  NULL,
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","group_code":"PBA","page_type_reason":"structured RPS illustration record"}'::jsonb
)
ON CONFLICT (semantic_version_id, source_type, source_record_id) DO UPDATE SET
  page_type = EXCLUDED.page_type,
  content_hash = EXCLUDED.content_hash,
  model_tags = EXCLUDED.model_tags,
  component_tags = EXCLUDED.component_tags,
  provenance = EXCLUDED.provenance,
  updated_at = now();
INSERT INTO public.barry_evidence_units (
  id, document_id, source_type, source_record_id, physical_pdf_page, page_type,
  content_hash, system_tags, model_tags, component_tags, extraction_quality,
  semantic_version_id, backfill_run_id, provenance
) VALUES (
  'bd85c7ea-0734-5de9-8114-0c207cd43f4c',
  '2be70ccd-adb0-5a83-8adf-f26d571044e3',
  'rps_part',
  '005b35a8-b9f0-4e96-a3a0-2022667757c8',
  615,
  'parts_list',
  NULL,
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY['component.power_steering_pump']::text[],
  NULL,
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","group_code":"PBA","group_name":"POWER STEERING PUMP AND DRIVE","page_type_reason":"structured RPS parts record"}'::jsonb
)
ON CONFLICT (semantic_version_id, source_type, source_record_id) DO UPDATE SET
  page_type = EXCLUDED.page_type,
  content_hash = EXCLUDED.content_hash,
  model_tags = EXCLUDED.model_tags,
  component_tags = EXCLUDED.component_tags,
  provenance = EXCLUDED.provenance,
  updated_at = now();
INSERT INTO public.barry_evidence_units (
  id, document_id, source_type, source_record_id, physical_pdf_page, page_type,
  content_hash, system_tags, model_tags, component_tags, extraction_quality,
  semantic_version_id, backfill_run_id, provenance
) VALUES (
  '19911b3d-20b9-5212-87e3-0053172bbc99',
  '2be70ccd-adb0-5a83-8adf-f26d571044e3',
  'rps_part',
  '040ac58b-c25f-483a-989d-8dfbf81ec92a',
  597,
  'parts_list',
  NULL,
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY[]::text[],
  NULL,
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","group_code":"PA","group_name":"STEERING WHEEL, COLUMN DRIVE SHAFTS AND DRAG LINK","page_type_reason":"structured RPS parts record"}'::jsonb
)
ON CONFLICT (semantic_version_id, source_type, source_record_id) DO UPDATE SET
  page_type = EXCLUDED.page_type,
  content_hash = EXCLUDED.content_hash,
  model_tags = EXCLUDED.model_tags,
  component_tags = EXCLUDED.component_tags,
  provenance = EXCLUDED.provenance,
  updated_at = now();
INSERT INTO public.barry_evidence_units (
  id, document_id, source_type, source_record_id, physical_pdf_page, page_type,
  content_hash, system_tags, model_tags, component_tags, extraction_quality,
  semantic_version_id, backfill_run_id, provenance
) VALUES (
  '6d074e49-2eae-50be-81a2-9e5af50cb9b3',
  '2be70ccd-adb0-5a83-8adf-f26d571044e3',
  'rps_part',
  '05112454-7b84-4331-bee1-2e01e7208cc9',
  601,
  'parts_list',
  NULL,
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY[]::text[],
  NULL,
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","group_code":"PA","group_name":"STEERING WHEEL, COLUMN DRIVE SHAFTS AND DRAG LINK","page_type_reason":"structured RPS parts record"}'::jsonb
)
ON CONFLICT (semantic_version_id, source_type, source_record_id) DO UPDATE SET
  page_type = EXCLUDED.page_type,
  content_hash = EXCLUDED.content_hash,
  model_tags = EXCLUDED.model_tags,
  component_tags = EXCLUDED.component_tags,
  provenance = EXCLUDED.provenance,
  updated_at = now();
INSERT INTO public.barry_evidence_units (
  id, document_id, source_type, source_record_id, physical_pdf_page, page_type,
  content_hash, system_tags, model_tags, component_tags, extraction_quality,
  semantic_version_id, backfill_run_id, provenance
) VALUES (
  '24446e21-b4dc-5bad-8264-e8b871eea1bf',
  '2be70ccd-adb0-5a83-8adf-f26d571044e3',
  'rps_part',
  '05d081d2-99ef-47e0-bb18-4a150325d727',
  619,
  'parts_list',
  NULL,
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY['component.power_steering_pump']::text[],
  NULL,
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","group_code":"PBA","group_name":"POWER STEERING PUMP AND DRIVE","page_type_reason":"structured RPS parts record"}'::jsonb
)
ON CONFLICT (semantic_version_id, source_type, source_record_id) DO UPDATE SET
  page_type = EXCLUDED.page_type,
  content_hash = EXCLUDED.content_hash,
  model_tags = EXCLUDED.model_tags,
  component_tags = EXCLUDED.component_tags,
  provenance = EXCLUDED.provenance,
  updated_at = now();
INSERT INTO public.barry_evidence_units (
  id, document_id, source_type, source_record_id, physical_pdf_page, page_type,
  content_hash, system_tags, model_tags, component_tags, extraction_quality,
  semantic_version_id, backfill_run_id, provenance
) VALUES (
  '4fc911b3-c67d-5f7e-8040-660554981f7e',
  '2be70ccd-adb0-5a83-8adf-f26d571044e3',
  'rps_part',
  '060f37c2-f74d-4aca-b35f-8bd495af6abb',
  607,
  'parts_list',
  NULL,
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY['component.steering_gear']::text[],
  NULL,
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","group_code":"PB","group_name":"STEERING BOX ASSEMBLY","page_type_reason":"structured RPS parts record"}'::jsonb
)
ON CONFLICT (semantic_version_id, source_type, source_record_id) DO UPDATE SET
  page_type = EXCLUDED.page_type,
  content_hash = EXCLUDED.content_hash,
  model_tags = EXCLUDED.model_tags,
  component_tags = EXCLUDED.component_tags,
  provenance = EXCLUDED.provenance,
  updated_at = now();
INSERT INTO public.barry_evidence_units (
  id, document_id, source_type, source_record_id, physical_pdf_page, page_type,
  content_hash, system_tags, model_tags, component_tags, extraction_quality,
  semantic_version_id, backfill_run_id, provenance
) VALUES (
  '7fd324b5-1f92-5737-8b3e-6df918e32a0a',
  '2be70ccd-adb0-5a83-8adf-f26d571044e3',
  'rps_part',
  '061474b4-edd1-4a21-898a-d0318ff2b70b',
  611,
  'parts_list',
  NULL,
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY['component.steering_gear']::text[],
  NULL,
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","group_code":"PB","group_name":"STEERING BOX ASSEMBLY","page_type_reason":"structured RPS parts record"}'::jsonb
)
ON CONFLICT (semantic_version_id, source_type, source_record_id) DO UPDATE SET
  page_type = EXCLUDED.page_type,
  content_hash = EXCLUDED.content_hash,
  model_tags = EXCLUDED.model_tags,
  component_tags = EXCLUDED.component_tags,
  provenance = EXCLUDED.provenance,
  updated_at = now();
INSERT INTO public.barry_evidence_units (
  id, document_id, source_type, source_record_id, physical_pdf_page, page_type,
  content_hash, system_tags, model_tags, component_tags, extraction_quality,
  semantic_version_id, backfill_run_id, provenance
) VALUES (
  'b1fb2d40-31f8-5ed6-8968-6e7fd328d054',
  '2be70ccd-adb0-5a83-8adf-f26d571044e3',
  'rps_part',
  '07e2a359-159d-41e9-ab84-bfba28197dba',
  611,
  'parts_list',
  NULL,
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY['component.steering_gear']::text[],
  NULL,
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","group_code":"PB","group_name":"STEERING BOX ASSEMBLY","page_type_reason":"structured RPS parts record"}'::jsonb
)
ON CONFLICT (semantic_version_id, source_type, source_record_id) DO UPDATE SET
  page_type = EXCLUDED.page_type,
  content_hash = EXCLUDED.content_hash,
  model_tags = EXCLUDED.model_tags,
  component_tags = EXCLUDED.component_tags,
  provenance = EXCLUDED.provenance,
  updated_at = now();
INSERT INTO public.barry_evidence_units (
  id, document_id, source_type, source_record_id, physical_pdf_page, page_type,
  content_hash, system_tags, model_tags, component_tags, extraction_quality,
  semantic_version_id, backfill_run_id, provenance
) VALUES (
  '08a25b36-a533-5776-8e60-fc27ecb94322',
  '2be70ccd-adb0-5a83-8adf-f26d571044e3',
  'rps_part',
  '08bb93b7-3d05-4214-a233-dcf78b0187e1',
  619,
  'parts_list',
  NULL,
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY['component.power_steering_pump']::text[],
  NULL,
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","group_code":"PBA","group_name":"POWER STEERING PUMP AND DRIVE","page_type_reason":"structured RPS parts record"}'::jsonb
)
ON CONFLICT (semantic_version_id, source_type, source_record_id) DO UPDATE SET
  page_type = EXCLUDED.page_type,
  content_hash = EXCLUDED.content_hash,
  model_tags = EXCLUDED.model_tags,
  component_tags = EXCLUDED.component_tags,
  provenance = EXCLUDED.provenance,
  updated_at = now();
INSERT INTO public.barry_evidence_units (
  id, document_id, source_type, source_record_id, physical_pdf_page, page_type,
  content_hash, system_tags, model_tags, component_tags, extraction_quality,
  semantic_version_id, backfill_run_id, provenance
) VALUES (
  '9a19a4ef-e7da-5ef2-8053-db833361f756',
  '2be70ccd-adb0-5a83-8adf-f26d571044e3',
  'rps_part',
  '0911fc50-8f33-4369-96d5-68d9d7538c19',
  611,
  'parts_list',
  NULL,
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY['component.steering_gear']::text[],
  NULL,
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","group_code":"PB","group_name":"STEERING BOX ASSEMBLY","page_type_reason":"structured RPS parts record"}'::jsonb
)
ON CONFLICT (semantic_version_id, source_type, source_record_id) DO UPDATE SET
  page_type = EXCLUDED.page_type,
  content_hash = EXCLUDED.content_hash,
  model_tags = EXCLUDED.model_tags,
  component_tags = EXCLUDED.component_tags,
  provenance = EXCLUDED.provenance,
  updated_at = now();
INSERT INTO public.barry_evidence_units (
  id, document_id, source_type, source_record_id, physical_pdf_page, page_type,
  content_hash, system_tags, model_tags, component_tags, extraction_quality,
  semantic_version_id, backfill_run_id, provenance
) VALUES (
  '1dd0b9e8-9587-5816-824a-715e37366b04',
  '2be70ccd-adb0-5a83-8adf-f26d571044e3',
  'rps_part',
  '0cf64c32-9071-42b2-859e-4c7040cf4cb4',
  625,
  'parts_list',
  NULL,
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY['component.steering_reservoir']::text[],
  NULL,
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","group_code":"PBB","group_name":"POWER STEERING RESERVOIR AND PIPING","page_type_reason":"structured RPS parts record"}'::jsonb
)
ON CONFLICT (semantic_version_id, source_type, source_record_id) DO UPDATE SET
  page_type = EXCLUDED.page_type,
  content_hash = EXCLUDED.content_hash,
  model_tags = EXCLUDED.model_tags,
  component_tags = EXCLUDED.component_tags,
  provenance = EXCLUDED.provenance,
  updated_at = now();
INSERT INTO public.barry_evidence_units (
  id, document_id, source_type, source_record_id, physical_pdf_page, page_type,
  content_hash, system_tags, model_tags, component_tags, extraction_quality,
  semantic_version_id, backfill_run_id, provenance
) VALUES (
  '0a20e3e4-d135-519f-8ad5-f701f1116e2e',
  '2be70ccd-adb0-5a83-8adf-f26d571044e3',
  'rps_part',
  '1026aba2-4f5b-43a0-8891-a2038aa5c1b1',
  595,
  'parts_list',
  NULL,
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY[]::text[],
  NULL,
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","group_code":"PA","group_name":"STEERING WHEEL, COLUMN DRIVE SHAFTS AND DRAG LINK","page_type_reason":"structured RPS parts record"}'::jsonb
)
ON CONFLICT (semantic_version_id, source_type, source_record_id) DO UPDATE SET
  page_type = EXCLUDED.page_type,
  content_hash = EXCLUDED.content_hash,
  model_tags = EXCLUDED.model_tags,
  component_tags = EXCLUDED.component_tags,
  provenance = EXCLUDED.provenance,
  updated_at = now();
INSERT INTO public.barry_evidence_units (
  id, document_id, source_type, source_record_id, physical_pdf_page, page_type,
  content_hash, system_tags, model_tags, component_tags, extraction_quality,
  semantic_version_id, backfill_run_id, provenance
) VALUES (
  '2a336942-7027-5b79-8f0b-29ad4dcba283',
  '2be70ccd-adb0-5a83-8adf-f26d571044e3',
  'rps_part',
  '11fc0c50-fe24-46d1-a8ca-9dbf2ff00f20',
  609,
  'parts_list',
  NULL,
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY['component.steering_gear']::text[],
  NULL,
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","group_code":"PB","group_name":"STEERING BOX ASSEMBLY","page_type_reason":"structured RPS parts record"}'::jsonb
)
ON CONFLICT (semantic_version_id, source_type, source_record_id) DO UPDATE SET
  page_type = EXCLUDED.page_type,
  content_hash = EXCLUDED.content_hash,
  model_tags = EXCLUDED.model_tags,
  component_tags = EXCLUDED.component_tags,
  provenance = EXCLUDED.provenance,
  updated_at = now();
INSERT INTO public.barry_evidence_units (
  id, document_id, source_type, source_record_id, physical_pdf_page, page_type,
  content_hash, system_tags, model_tags, component_tags, extraction_quality,
  semantic_version_id, backfill_run_id, provenance
) VALUES (
  '12295a78-5307-5b3b-8f46-b3b38f955626',
  '2be70ccd-adb0-5a83-8adf-f26d571044e3',
  'rps_part',
  '1520503e-7767-482e-b80b-5e2dff5af991',
  615,
  'parts_list',
  NULL,
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY['component.power_steering_pump']::text[],
  NULL,
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","group_code":"PBA","group_name":"POWER STEERING PUMP AND DRIVE","page_type_reason":"structured RPS parts record"}'::jsonb
)
ON CONFLICT (semantic_version_id, source_type, source_record_id) DO UPDATE SET
  page_type = EXCLUDED.page_type,
  content_hash = EXCLUDED.content_hash,
  model_tags = EXCLUDED.model_tags,
  component_tags = EXCLUDED.component_tags,
  provenance = EXCLUDED.provenance,
  updated_at = now();
INSERT INTO public.barry_evidence_units (
  id, document_id, source_type, source_record_id, physical_pdf_page, page_type,
  content_hash, system_tags, model_tags, component_tags, extraction_quality,
  semantic_version_id, backfill_run_id, provenance
) VALUES (
  '8c72635c-9cf5-5360-864d-aead4f22c793',
  '2be70ccd-adb0-5a83-8adf-f26d571044e3',
  'rps_part',
  '161c6eb2-22b3-4d53-9de6-8cb6c7f3f076',
  619,
  'parts_list',
  NULL,
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY['component.power_steering_pump']::text[],
  NULL,
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","group_code":"PBA","group_name":"POWER STEERING PUMP AND DRIVE","page_type_reason":"structured RPS parts record"}'::jsonb
)
ON CONFLICT (semantic_version_id, source_type, source_record_id) DO UPDATE SET
  page_type = EXCLUDED.page_type,
  content_hash = EXCLUDED.content_hash,
  model_tags = EXCLUDED.model_tags,
  component_tags = EXCLUDED.component_tags,
  provenance = EXCLUDED.provenance,
  updated_at = now();
INSERT INTO public.barry_evidence_units (
  id, document_id, source_type, source_record_id, physical_pdf_page, page_type,
  content_hash, system_tags, model_tags, component_tags, extraction_quality,
  semantic_version_id, backfill_run_id, provenance
) VALUES (
  '34badd3a-342a-5f14-8e8b-dc500ca927c4',
  '2be70ccd-adb0-5a83-8adf-f26d571044e3',
  'rps_part',
  '16c00afd-355d-4cd1-bb92-cc94e99663f3',
  599,
  'parts_list',
  NULL,
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY[]::text[],
  NULL,
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","group_code":"PA","group_name":"STEERING WHEEL, COLUMN DRIVE SHAFTS AND DRAG LINK","page_type_reason":"structured RPS parts record"}'::jsonb
)
ON CONFLICT (semantic_version_id, source_type, source_record_id) DO UPDATE SET
  page_type = EXCLUDED.page_type,
  content_hash = EXCLUDED.content_hash,
  model_tags = EXCLUDED.model_tags,
  component_tags = EXCLUDED.component_tags,
  provenance = EXCLUDED.provenance,
  updated_at = now();
INSERT INTO public.barry_evidence_units (
  id, document_id, source_type, source_record_id, physical_pdf_page, page_type,
  content_hash, system_tags, model_tags, component_tags, extraction_quality,
  semantic_version_id, backfill_run_id, provenance
) VALUES (
  'ba2ddd6d-5098-522f-803c-e6639cb3771e',
  '2be70ccd-adb0-5a83-8adf-f26d571044e3',
  'rps_part',
  '191db005-e7d6-443c-8d67-1ff0e07e1cdd',
  605,
  'parts_list',
  NULL,
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY['component.steering_gear']::text[],
  NULL,
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","group_code":"PB","group_name":"STEERING BOX ASSEMBLY","page_type_reason":"structured RPS parts record"}'::jsonb
)
ON CONFLICT (semantic_version_id, source_type, source_record_id) DO UPDATE SET
  page_type = EXCLUDED.page_type,
  content_hash = EXCLUDED.content_hash,
  model_tags = EXCLUDED.model_tags,
  component_tags = EXCLUDED.component_tags,
  provenance = EXCLUDED.provenance,
  updated_at = now();
INSERT INTO public.barry_evidence_units (
  id, document_id, source_type, source_record_id, physical_pdf_page, page_type,
  content_hash, system_tags, model_tags, component_tags, extraction_quality,
  semantic_version_id, backfill_run_id, provenance
) VALUES (
  '4e1d4372-d07a-575a-896d-cc4bc4a78bed',
  '2be70ccd-adb0-5a83-8adf-f26d571044e3',
  'rps_part',
  '19416e8e-1799-4f76-b137-f16cfd0ac49c',
  625,
  'parts_list',
  NULL,
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY['component.steering_reservoir']::text[],
  NULL,
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","group_code":"PBB","group_name":"POWER STEERING RESERVOIR AND PIPING","page_type_reason":"structured RPS parts record"}'::jsonb
)
ON CONFLICT (semantic_version_id, source_type, source_record_id) DO UPDATE SET
  page_type = EXCLUDED.page_type,
  content_hash = EXCLUDED.content_hash,
  model_tags = EXCLUDED.model_tags,
  component_tags = EXCLUDED.component_tags,
  provenance = EXCLUDED.provenance,
  updated_at = now();
INSERT INTO public.barry_evidence_units (
  id, document_id, source_type, source_record_id, physical_pdf_page, page_type,
  content_hash, system_tags, model_tags, component_tags, extraction_quality,
  semantic_version_id, backfill_run_id, provenance
) VALUES (
  '676e6979-f9de-5f7f-805f-90b2359b3720',
  '2be70ccd-adb0-5a83-8adf-f26d571044e3',
  'rps_part',
  '1a226838-2fd8-46eb-98c3-73d31d237e50',
  627,
  'parts_list',
  NULL,
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY['component.steering_reservoir']::text[],
  NULL,
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","group_code":"PBB","group_name":"POWER STEERING RESERVOIR AND PIPING","page_type_reason":"structured RPS parts record"}'::jsonb
)
ON CONFLICT (semantic_version_id, source_type, source_record_id) DO UPDATE SET
  page_type = EXCLUDED.page_type,
  content_hash = EXCLUDED.content_hash,
  model_tags = EXCLUDED.model_tags,
  component_tags = EXCLUDED.component_tags,
  provenance = EXCLUDED.provenance,
  updated_at = now();
INSERT INTO public.barry_evidence_units (
  id, document_id, source_type, source_record_id, physical_pdf_page, page_type,
  content_hash, system_tags, model_tags, component_tags, extraction_quality,
  semantic_version_id, backfill_run_id, provenance
) VALUES (
  'e3cf1eba-f168-50b8-874d-08bbf22baba7',
  '2be70ccd-adb0-5a83-8adf-f26d571044e3',
  'rps_part',
  '1b9ce498-8528-451d-abec-fe65e45afa34',
  615,
  'parts_list',
  NULL,
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY['component.power_steering_pump']::text[],
  NULL,
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","group_code":"PBA","group_name":"POWER STEERING PUMP AND DRIVE","page_type_reason":"structured RPS parts record"}'::jsonb
)
ON CONFLICT (semantic_version_id, source_type, source_record_id) DO UPDATE SET
  page_type = EXCLUDED.page_type,
  content_hash = EXCLUDED.content_hash,
  model_tags = EXCLUDED.model_tags,
  component_tags = EXCLUDED.component_tags,
  provenance = EXCLUDED.provenance,
  updated_at = now();
INSERT INTO public.barry_evidence_units (
  id, document_id, source_type, source_record_id, physical_pdf_page, page_type,
  content_hash, system_tags, model_tags, component_tags, extraction_quality,
  semantic_version_id, backfill_run_id, provenance
) VALUES (
  '3474a05f-7d9a-5270-89e5-fdf3d88d83da',
  '2be70ccd-adb0-5a83-8adf-f26d571044e3',
  'rps_part',
  '22d77498-f645-4e5f-8991-ca3375d9eb3a',
  623,
  'parts_list',
  NULL,
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY['component.steering_reservoir']::text[],
  NULL,
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","group_code":"PBB","group_name":"POWER STEERING RESERVOIR AND PIPING","page_type_reason":"structured RPS parts record"}'::jsonb
)
ON CONFLICT (semantic_version_id, source_type, source_record_id) DO UPDATE SET
  page_type = EXCLUDED.page_type,
  content_hash = EXCLUDED.content_hash,
  model_tags = EXCLUDED.model_tags,
  component_tags = EXCLUDED.component_tags,
  provenance = EXCLUDED.provenance,
  updated_at = now();
INSERT INTO public.barry_evidence_units (
  id, document_id, source_type, source_record_id, physical_pdf_page, page_type,
  content_hash, system_tags, model_tags, component_tags, extraction_quality,
  semantic_version_id, backfill_run_id, provenance
) VALUES (
  '2d3944e4-5191-5062-8b2b-97575741cc3a',
  '2be70ccd-adb0-5a83-8adf-f26d571044e3',
  'rps_part',
  '2559fa93-c03b-440f-a5dc-4c94f66ffefe',
  609,
  'parts_list',
  NULL,
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY['component.steering_gear']::text[],
  NULL,
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","group_code":"PB","group_name":"STEERING BOX ASSEMBLY","page_type_reason":"structured RPS parts record"}'::jsonb
)
ON CONFLICT (semantic_version_id, source_type, source_record_id) DO UPDATE SET
  page_type = EXCLUDED.page_type,
  content_hash = EXCLUDED.content_hash,
  model_tags = EXCLUDED.model_tags,
  component_tags = EXCLUDED.component_tags,
  provenance = EXCLUDED.provenance,
  updated_at = now();
INSERT INTO public.barry_evidence_units (
  id, document_id, source_type, source_record_id, physical_pdf_page, page_type,
  content_hash, system_tags, model_tags, component_tags, extraction_quality,
  semantic_version_id, backfill_run_id, provenance
) VALUES (
  '89fa64fc-999c-5505-8628-396868c5d794',
  '2be70ccd-adb0-5a83-8adf-f26d571044e3',
  'rps_part',
  '27979a51-af12-4ee0-94eb-e833ccad85de',
  623,
  'parts_list',
  NULL,
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY['component.steering_reservoir']::text[],
  NULL,
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","group_code":"PBB","group_name":"POWER STEERING RESERVOIR AND PIPING","page_type_reason":"structured RPS parts record"}'::jsonb
)
ON CONFLICT (semantic_version_id, source_type, source_record_id) DO UPDATE SET
  page_type = EXCLUDED.page_type,
  content_hash = EXCLUDED.content_hash,
  model_tags = EXCLUDED.model_tags,
  component_tags = EXCLUDED.component_tags,
  provenance = EXCLUDED.provenance,
  updated_at = now();
INSERT INTO public.barry_evidence_units (
  id, document_id, source_type, source_record_id, physical_pdf_page, page_type,
  content_hash, system_tags, model_tags, component_tags, extraction_quality,
  semantic_version_id, backfill_run_id, provenance
) VALUES (
  '8de860c8-7192-5e53-844d-2d2faa018f37',
  '2be70ccd-adb0-5a83-8adf-f26d571044e3',
  'rps_part',
  '28b7d053-85aa-4f4a-acc9-7273e16ee29d',
  625,
  'parts_list',
  NULL,
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY['component.steering_reservoir']::text[],
  NULL,
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","group_code":"PBB","group_name":"POWER STEERING RESERVOIR AND PIPING","page_type_reason":"structured RPS parts record"}'::jsonb
)
ON CONFLICT (semantic_version_id, source_type, source_record_id) DO UPDATE SET
  page_type = EXCLUDED.page_type,
  content_hash = EXCLUDED.content_hash,
  model_tags = EXCLUDED.model_tags,
  component_tags = EXCLUDED.component_tags,
  provenance = EXCLUDED.provenance,
  updated_at = now();
INSERT INTO public.barry_evidence_units (
  id, document_id, source_type, source_record_id, physical_pdf_page, page_type,
  content_hash, system_tags, model_tags, component_tags, extraction_quality,
  semantic_version_id, backfill_run_id, provenance
) VALUES (
  '3d5362b1-2776-503b-89a8-6e9442e1bde1',
  '2be70ccd-adb0-5a83-8adf-f26d571044e3',
  'rps_part',
  '29335f1d-d664-4c08-b71e-bbad6076f826',
  623,
  'parts_list',
  NULL,
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY['component.steering_reservoir']::text[],
  NULL,
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","group_code":"PBB","group_name":"POWER STEERING RESERVOIR AND PIPING","page_type_reason":"structured RPS parts record"}'::jsonb
)
ON CONFLICT (semantic_version_id, source_type, source_record_id) DO UPDATE SET
  page_type = EXCLUDED.page_type,
  content_hash = EXCLUDED.content_hash,
  model_tags = EXCLUDED.model_tags,
  component_tags = EXCLUDED.component_tags,
  provenance = EXCLUDED.provenance,
  updated_at = now();
INSERT INTO public.barry_evidence_units (
  id, document_id, source_type, source_record_id, physical_pdf_page, page_type,
  content_hash, system_tags, model_tags, component_tags, extraction_quality,
  semantic_version_id, backfill_run_id, provenance
) VALUES (
  '78a19b80-cdc8-5882-8f87-7879953879c8',
  '2be70ccd-adb0-5a83-8adf-f26d571044e3',
  'rps_part',
  '299f882f-67b7-4764-b292-5b370f98b27a',
  599,
  'parts_list',
  NULL,
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY[]::text[],
  NULL,
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","group_code":"PA","group_name":"STEERING WHEEL, COLUMN DRIVE SHAFTS AND DRAG LINK","page_type_reason":"structured RPS parts record"}'::jsonb
)
ON CONFLICT (semantic_version_id, source_type, source_record_id) DO UPDATE SET
  page_type = EXCLUDED.page_type,
  content_hash = EXCLUDED.content_hash,
  model_tags = EXCLUDED.model_tags,
  component_tags = EXCLUDED.component_tags,
  provenance = EXCLUDED.provenance,
  updated_at = now();
INSERT INTO public.barry_evidence_units (
  id, document_id, source_type, source_record_id, physical_pdf_page, page_type,
  content_hash, system_tags, model_tags, component_tags, extraction_quality,
  semantic_version_id, backfill_run_id, provenance
) VALUES (
  'b1e3c75d-c840-50bf-8f02-c29d5ddefa8b',
  '2be70ccd-adb0-5a83-8adf-f26d571044e3',
  'rps_part',
  '2a7389f6-9dba-4a4e-93e8-2fa3d383c0d6',
  599,
  'parts_list',
  NULL,
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY[]::text[],
  NULL,
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","group_code":"PA","group_name":"STEERING WHEEL, COLUMN DRIVE SHAFTS AND DRAG LINK","page_type_reason":"structured RPS parts record"}'::jsonb
)
ON CONFLICT (semantic_version_id, source_type, source_record_id) DO UPDATE SET
  page_type = EXCLUDED.page_type,
  content_hash = EXCLUDED.content_hash,
  model_tags = EXCLUDED.model_tags,
  component_tags = EXCLUDED.component_tags,
  provenance = EXCLUDED.provenance,
  updated_at = now();
INSERT INTO public.barry_evidence_units (
  id, document_id, source_type, source_record_id, physical_pdf_page, page_type,
  content_hash, system_tags, model_tags, component_tags, extraction_quality,
  semantic_version_id, backfill_run_id, provenance
) VALUES (
  '7396603f-3556-54ea-80b4-d74dce8c41cc',
  '2be70ccd-adb0-5a83-8adf-f26d571044e3',
  'rps_part',
  '2b1887e5-78a8-4eae-8a15-66fc9de389a0',
  607,
  'parts_list',
  NULL,
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY['component.steering_gear']::text[],
  NULL,
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","group_code":"PB","group_name":"STEERING BOX ASSEMBLY","page_type_reason":"structured RPS parts record"}'::jsonb
)
ON CONFLICT (semantic_version_id, source_type, source_record_id) DO UPDATE SET
  page_type = EXCLUDED.page_type,
  content_hash = EXCLUDED.content_hash,
  model_tags = EXCLUDED.model_tags,
  component_tags = EXCLUDED.component_tags,
  provenance = EXCLUDED.provenance,
  updated_at = now();
INSERT INTO public.barry_evidence_units (
  id, document_id, source_type, source_record_id, physical_pdf_page, page_type,
  content_hash, system_tags, model_tags, component_tags, extraction_quality,
  semantic_version_id, backfill_run_id, provenance
) VALUES (
  '928e6dc3-7144-52b1-8087-eed1ea5b0180',
  '2be70ccd-adb0-5a83-8adf-f26d571044e3',
  'rps_part',
  '2ce207ba-c1de-4b4b-89fd-7b2b9c40801d',
  609,
  'parts_list',
  NULL,
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY['component.steering_gear']::text[],
  NULL,
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","group_code":"PB","group_name":"STEERING BOX ASSEMBLY","page_type_reason":"structured RPS parts record"}'::jsonb
)
ON CONFLICT (semantic_version_id, source_type, source_record_id) DO UPDATE SET
  page_type = EXCLUDED.page_type,
  content_hash = EXCLUDED.content_hash,
  model_tags = EXCLUDED.model_tags,
  component_tags = EXCLUDED.component_tags,
  provenance = EXCLUDED.provenance,
  updated_at = now();
INSERT INTO public.barry_evidence_units (
  id, document_id, source_type, source_record_id, physical_pdf_page, page_type,
  content_hash, system_tags, model_tags, component_tags, extraction_quality,
  semantic_version_id, backfill_run_id, provenance
) VALUES (
  '1644220c-72c0-5f6c-8e89-ab155ef810b4',
  '2be70ccd-adb0-5a83-8adf-f26d571044e3',
  'rps_part',
  '2d35efa8-0bab-49bc-b183-cb1a9d0cf071',
  619,
  'parts_list',
  NULL,
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY['component.power_steering_pump']::text[],
  NULL,
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","group_code":"PBA","group_name":"POWER STEERING PUMP AND DRIVE","page_type_reason":"structured RPS parts record"}'::jsonb
)
ON CONFLICT (semantic_version_id, source_type, source_record_id) DO UPDATE SET
  page_type = EXCLUDED.page_type,
  content_hash = EXCLUDED.content_hash,
  model_tags = EXCLUDED.model_tags,
  component_tags = EXCLUDED.component_tags,
  provenance = EXCLUDED.provenance,
  updated_at = now();
INSERT INTO public.barry_evidence_units (
  id, document_id, source_type, source_record_id, physical_pdf_page, page_type,
  content_hash, system_tags, model_tags, component_tags, extraction_quality,
  semantic_version_id, backfill_run_id, provenance
) VALUES (
  '9b261c72-6705-5729-8c2e-30e682c895a9',
  '2be70ccd-adb0-5a83-8adf-f26d571044e3',
  'rps_part',
  '2f3c8b14-e3eb-43ec-bd63-f07ea89037e3',
  613,
  'parts_list',
  NULL,
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY['component.steering_gear']::text[],
  NULL,
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","group_code":"PB","group_name":"STEERING BOX ASSEMBLY","page_type_reason":"structured RPS parts record"}'::jsonb
)
ON CONFLICT (semantic_version_id, source_type, source_record_id) DO UPDATE SET
  page_type = EXCLUDED.page_type,
  content_hash = EXCLUDED.content_hash,
  model_tags = EXCLUDED.model_tags,
  component_tags = EXCLUDED.component_tags,
  provenance = EXCLUDED.provenance,
  updated_at = now();
INSERT INTO public.barry_evidence_units (
  id, document_id, source_type, source_record_id, physical_pdf_page, page_type,
  content_hash, system_tags, model_tags, component_tags, extraction_quality,
  semantic_version_id, backfill_run_id, provenance
) VALUES (
  '46e268b4-bc25-510b-8cfa-25c95e41902e',
  '2be70ccd-adb0-5a83-8adf-f26d571044e3',
  'rps_part',
  '3027c78b-77de-4b94-ab3e-4d0570365d6b',
  601,
  'parts_list',
  NULL,
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY[]::text[],
  NULL,
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","group_code":"PA","group_name":"STEERING WHEEL, COLUMN DRIVE SHAFTS AND DRAG LINK","page_type_reason":"structured RPS parts record"}'::jsonb
)
ON CONFLICT (semantic_version_id, source_type, source_record_id) DO UPDATE SET
  page_type = EXCLUDED.page_type,
  content_hash = EXCLUDED.content_hash,
  model_tags = EXCLUDED.model_tags,
  component_tags = EXCLUDED.component_tags,
  provenance = EXCLUDED.provenance,
  updated_at = now();
INSERT INTO public.barry_evidence_units (
  id, document_id, source_type, source_record_id, physical_pdf_page, page_type,
  content_hash, system_tags, model_tags, component_tags, extraction_quality,
  semantic_version_id, backfill_run_id, provenance
) VALUES (
  '8ef64d81-0c98-5697-8b93-838f10513015',
  '2be70ccd-adb0-5a83-8adf-f26d571044e3',
  'rps_part',
  '31ee1302-d044-4f49-b14c-00bef9dcd1d9',
  595,
  'parts_list',
  NULL,
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY[]::text[],
  NULL,
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","group_code":"PA","group_name":"STEERING WHEEL, COLUMN DRIVE SHAFTS AND DRAG LINK","page_type_reason":"structured RPS parts record"}'::jsonb
)
ON CONFLICT (semantic_version_id, source_type, source_record_id) DO UPDATE SET
  page_type = EXCLUDED.page_type,
  content_hash = EXCLUDED.content_hash,
  model_tags = EXCLUDED.model_tags,
  component_tags = EXCLUDED.component_tags,
  provenance = EXCLUDED.provenance,
  updated_at = now();
INSERT INTO public.barry_evidence_units (
  id, document_id, source_type, source_record_id, physical_pdf_page, page_type,
  content_hash, system_tags, model_tags, component_tags, extraction_quality,
  semantic_version_id, backfill_run_id, provenance
) VALUES (
  'd06a0d7a-bb98-5981-825a-8ab812cb4490',
  '2be70ccd-adb0-5a83-8adf-f26d571044e3',
  'rps_part',
  '32b10570-4de7-4d48-a67b-7fd23b33ac42',
  603,
  'parts_list',
  NULL,
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY[]::text[],
  NULL,
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","group_code":"PA","group_name":"STEERING WHEEL, COLUMN DRIVE SHAFTS AND DRAG LINK","page_type_reason":"structured RPS parts record"}'::jsonb
)
ON CONFLICT (semantic_version_id, source_type, source_record_id) DO UPDATE SET
  page_type = EXCLUDED.page_type,
  content_hash = EXCLUDED.content_hash,
  model_tags = EXCLUDED.model_tags,
  component_tags = EXCLUDED.component_tags,
  provenance = EXCLUDED.provenance,
  updated_at = now();
INSERT INTO public.barry_evidence_units (
  id, document_id, source_type, source_record_id, physical_pdf_page, page_type,
  content_hash, system_tags, model_tags, component_tags, extraction_quality,
  semantic_version_id, backfill_run_id, provenance
) VALUES (
  '0327d873-2fd1-50a0-8568-b08296bd705d',
  '2be70ccd-adb0-5a83-8adf-f26d571044e3',
  'rps_part',
  '34559eab-e6de-4328-aa69-e620c9df22c0',
  601,
  'parts_list',
  NULL,
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY[]::text[],
  NULL,
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","group_code":"PA","group_name":"STEERING WHEEL, COLUMN DRIVE SHAFTS AND DRAG LINK","page_type_reason":"structured RPS parts record"}'::jsonb
)
ON CONFLICT (semantic_version_id, source_type, source_record_id) DO UPDATE SET
  page_type = EXCLUDED.page_type,
  content_hash = EXCLUDED.content_hash,
  model_tags = EXCLUDED.model_tags,
  component_tags = EXCLUDED.component_tags,
  provenance = EXCLUDED.provenance,
  updated_at = now();
INSERT INTO public.barry_evidence_units (
  id, document_id, source_type, source_record_id, physical_pdf_page, page_type,
  content_hash, system_tags, model_tags, component_tags, extraction_quality,
  semantic_version_id, backfill_run_id, provenance
) VALUES (
  '0f166ac0-6dca-504e-8ad2-40af5075323a',
  '2be70ccd-adb0-5a83-8adf-f26d571044e3',
  'rps_part',
  '3637aaac-80a0-4e60-aab3-80b5bf83be6b',
  597,
  'parts_list',
  NULL,
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY[]::text[],
  NULL,
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","group_code":"PA","group_name":"STEERING WHEEL, COLUMN DRIVE SHAFTS AND DRAG LINK","page_type_reason":"structured RPS parts record"}'::jsonb
)
ON CONFLICT (semantic_version_id, source_type, source_record_id) DO UPDATE SET
  page_type = EXCLUDED.page_type,
  content_hash = EXCLUDED.content_hash,
  model_tags = EXCLUDED.model_tags,
  component_tags = EXCLUDED.component_tags,
  provenance = EXCLUDED.provenance,
  updated_at = now();
INSERT INTO public.barry_evidence_units (
  id, document_id, source_type, source_record_id, physical_pdf_page, page_type,
  content_hash, system_tags, model_tags, component_tags, extraction_quality,
  semantic_version_id, backfill_run_id, provenance
) VALUES (
  'c3a772bf-fe0f-5c8b-811b-56fcd62cfaa5',
  '2be70ccd-adb0-5a83-8adf-f26d571044e3',
  'rps_part',
  '3768d75b-c1d7-4c09-bd2d-1317afb7530e',
  609,
  'parts_list',
  NULL,
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY['component.steering_gear']::text[],
  NULL,
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","group_code":"PB","group_name":"STEERING BOX ASSEMBLY","page_type_reason":"structured RPS parts record"}'::jsonb
)
ON CONFLICT (semantic_version_id, source_type, source_record_id) DO UPDATE SET
  page_type = EXCLUDED.page_type,
  content_hash = EXCLUDED.content_hash,
  model_tags = EXCLUDED.model_tags,
  component_tags = EXCLUDED.component_tags,
  provenance = EXCLUDED.provenance,
  updated_at = now();
INSERT INTO public.barry_evidence_units (
  id, document_id, source_type, source_record_id, physical_pdf_page, page_type,
  content_hash, system_tags, model_tags, component_tags, extraction_quality,
  semantic_version_id, backfill_run_id, provenance
) VALUES (
  'e66aacdd-13af-5bf2-8a02-473ffcc54863',
  '2be70ccd-adb0-5a83-8adf-f26d571044e3',
  'rps_part',
  '3889c58a-496f-4cb7-b1dc-6448efdcc877',
  599,
  'parts_list',
  NULL,
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY[]::text[],
  NULL,
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","group_code":"PA","group_name":"STEERING WHEEL, COLUMN DRIVE SHAFTS AND DRAG LINK","page_type_reason":"structured RPS parts record"}'::jsonb
)
ON CONFLICT (semantic_version_id, source_type, source_record_id) DO UPDATE SET
  page_type = EXCLUDED.page_type,
  content_hash = EXCLUDED.content_hash,
  model_tags = EXCLUDED.model_tags,
  component_tags = EXCLUDED.component_tags,
  provenance = EXCLUDED.provenance,
  updated_at = now();
INSERT INTO public.barry_evidence_units (
  id, document_id, source_type, source_record_id, physical_pdf_page, page_type,
  content_hash, system_tags, model_tags, component_tags, extraction_quality,
  semantic_version_id, backfill_run_id, provenance
) VALUES (
  '7c63af4c-5591-5310-8e0f-0ab883d823b7',
  '2be70ccd-adb0-5a83-8adf-f26d571044e3',
  'rps_part',
  '3a8b3b0c-92b5-4b82-9789-492da19c6e2b',
  597,
  'parts_list',
  NULL,
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY[]::text[],
  NULL,
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","group_code":"PA","group_name":"STEERING WHEEL, COLUMN DRIVE SHAFTS AND DRAG LINK","page_type_reason":"structured RPS parts record"}'::jsonb
)
ON CONFLICT (semantic_version_id, source_type, source_record_id) DO UPDATE SET
  page_type = EXCLUDED.page_type,
  content_hash = EXCLUDED.content_hash,
  model_tags = EXCLUDED.model_tags,
  component_tags = EXCLUDED.component_tags,
  provenance = EXCLUDED.provenance,
  updated_at = now();
INSERT INTO public.barry_evidence_units (
  id, document_id, source_type, source_record_id, physical_pdf_page, page_type,
  content_hash, system_tags, model_tags, component_tags, extraction_quality,
  semantic_version_id, backfill_run_id, provenance
) VALUES (
  '2293fd86-86e8-56ef-8cec-810fa816601f',
  '2be70ccd-adb0-5a83-8adf-f26d571044e3',
  'rps_part',
  '3a9ed4d4-33cd-4fcc-9a5b-5719ead844f8',
  609,
  'parts_list',
  NULL,
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY['component.steering_gear']::text[],
  NULL,
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","group_code":"PB","group_name":"STEERING BOX ASSEMBLY","page_type_reason":"structured RPS parts record"}'::jsonb
)
ON CONFLICT (semantic_version_id, source_type, source_record_id) DO UPDATE SET
  page_type = EXCLUDED.page_type,
  content_hash = EXCLUDED.content_hash,
  model_tags = EXCLUDED.model_tags,
  component_tags = EXCLUDED.component_tags,
  provenance = EXCLUDED.provenance,
  updated_at = now();
INSERT INTO public.barry_evidence_units (
  id, document_id, source_type, source_record_id, physical_pdf_page, page_type,
  content_hash, system_tags, model_tags, component_tags, extraction_quality,
  semantic_version_id, backfill_run_id, provenance
) VALUES (
  '0134ef08-db3f-5378-86b2-489675b37e4a',
  '2be70ccd-adb0-5a83-8adf-f26d571044e3',
  'rps_part',
  '3b129d25-a769-48fe-a28d-fc044a74382d',
  607,
  'parts_list',
  NULL,
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY['component.steering_gear']::text[],
  NULL,
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","group_code":"PB","group_name":"STEERING BOX ASSEMBLY","page_type_reason":"structured RPS parts record"}'::jsonb
)
ON CONFLICT (semantic_version_id, source_type, source_record_id) DO UPDATE SET
  page_type = EXCLUDED.page_type,
  content_hash = EXCLUDED.content_hash,
  model_tags = EXCLUDED.model_tags,
  component_tags = EXCLUDED.component_tags,
  provenance = EXCLUDED.provenance,
  updated_at = now();
INSERT INTO public.barry_evidence_units (
  id, document_id, source_type, source_record_id, physical_pdf_page, page_type,
  content_hash, system_tags, model_tags, component_tags, extraction_quality,
  semantic_version_id, backfill_run_id, provenance
) VALUES (
  'b4aba7c9-5531-53cc-88c0-2a4a8a2712b4',
  '2be70ccd-adb0-5a83-8adf-f26d571044e3',
  'rps_part',
  '3bff4bfb-11ce-4e12-9c79-1ec3f0cf0c67',
  625,
  'parts_list',
  NULL,
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY['component.steering_reservoir']::text[],
  NULL,
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","group_code":"PBB","group_name":"POWER STEERING RESERVOIR AND PIPING","page_type_reason":"structured RPS parts record"}'::jsonb
)
ON CONFLICT (semantic_version_id, source_type, source_record_id) DO UPDATE SET
  page_type = EXCLUDED.page_type,
  content_hash = EXCLUDED.content_hash,
  model_tags = EXCLUDED.model_tags,
  component_tags = EXCLUDED.component_tags,
  provenance = EXCLUDED.provenance,
  updated_at = now();
INSERT INTO public.barry_evidence_units (
  id, document_id, source_type, source_record_id, physical_pdf_page, page_type,
  content_hash, system_tags, model_tags, component_tags, extraction_quality,
  semantic_version_id, backfill_run_id, provenance
) VALUES (
  '0d0eed69-4401-5f08-8189-0bd9e5dd7607',
  '2be70ccd-adb0-5a83-8adf-f26d571044e3',
  'rps_part',
  '3c9a5d5a-36ba-4ccf-b2d7-15562373dda3',
  607,
  'parts_list',
  NULL,
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY['component.steering_gear']::text[],
  NULL,
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","group_code":"PB","group_name":"STEERING BOX ASSEMBLY","page_type_reason":"structured RPS parts record"}'::jsonb
)
ON CONFLICT (semantic_version_id, source_type, source_record_id) DO UPDATE SET
  page_type = EXCLUDED.page_type,
  content_hash = EXCLUDED.content_hash,
  model_tags = EXCLUDED.model_tags,
  component_tags = EXCLUDED.component_tags,
  provenance = EXCLUDED.provenance,
  updated_at = now();
INSERT INTO public.barry_evidence_units (
  id, document_id, source_type, source_record_id, physical_pdf_page, page_type,
  content_hash, system_tags, model_tags, component_tags, extraction_quality,
  semantic_version_id, backfill_run_id, provenance
) VALUES (
  'c636cf05-fec9-543c-8d40-07893ce60cb3',
  '2be70ccd-adb0-5a83-8adf-f26d571044e3',
  'rps_part',
  '3d3f29ae-feb3-4a13-9503-b156c44be3f8',
  611,
  'parts_list',
  NULL,
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY['component.steering_gear']::text[],
  NULL,
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","group_code":"PB","group_name":"STEERING BOX ASSEMBLY","page_type_reason":"structured RPS parts record"}'::jsonb
)
ON CONFLICT (semantic_version_id, source_type, source_record_id) DO UPDATE SET
  page_type = EXCLUDED.page_type,
  content_hash = EXCLUDED.content_hash,
  model_tags = EXCLUDED.model_tags,
  component_tags = EXCLUDED.component_tags,
  provenance = EXCLUDED.provenance,
  updated_at = now();
INSERT INTO public.barry_evidence_units (
  id, document_id, source_type, source_record_id, physical_pdf_page, page_type,
  content_hash, system_tags, model_tags, component_tags, extraction_quality,
  semantic_version_id, backfill_run_id, provenance
) VALUES (
  '14739c30-2e56-591e-8fd1-c9d03e1c8dbf',
  '2be70ccd-adb0-5a83-8adf-f26d571044e3',
  'rps_part',
  '3ffb2dd1-5205-4a21-8cdd-0114b05477e9',
  615,
  'parts_list',
  NULL,
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY['component.power_steering_pump']::text[],
  NULL,
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","group_code":"PBA","group_name":"POWER STEERING PUMP AND DRIVE","page_type_reason":"structured RPS parts record"}'::jsonb
)
ON CONFLICT (semantic_version_id, source_type, source_record_id) DO UPDATE SET
  page_type = EXCLUDED.page_type,
  content_hash = EXCLUDED.content_hash,
  model_tags = EXCLUDED.model_tags,
  component_tags = EXCLUDED.component_tags,
  provenance = EXCLUDED.provenance,
  updated_at = now();
INSERT INTO public.barry_evidence_units (
  id, document_id, source_type, source_record_id, physical_pdf_page, page_type,
  content_hash, system_tags, model_tags, component_tags, extraction_quality,
  semantic_version_id, backfill_run_id, provenance
) VALUES (
  '23425994-7ac8-593f-89f7-0cabdccf911d',
  '2be70ccd-adb0-5a83-8adf-f26d571044e3',
  'rps_part',
  '41d3e322-9316-49e2-a7d1-afcfc0ee1ecc',
  595,
  'parts_list',
  NULL,
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY[]::text[],
  NULL,
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","group_code":"PA","group_name":"STEERING WHEEL, COLUMN DRIVE SHAFTS AND DRAG LINK","page_type_reason":"structured RPS parts record"}'::jsonb
)
ON CONFLICT (semantic_version_id, source_type, source_record_id) DO UPDATE SET
  page_type = EXCLUDED.page_type,
  content_hash = EXCLUDED.content_hash,
  model_tags = EXCLUDED.model_tags,
  component_tags = EXCLUDED.component_tags,
  provenance = EXCLUDED.provenance,
  updated_at = now();
INSERT INTO public.barry_evidence_units (
  id, document_id, source_type, source_record_id, physical_pdf_page, page_type,
  content_hash, system_tags, model_tags, component_tags, extraction_quality,
  semantic_version_id, backfill_run_id, provenance
) VALUES (
  '14916bb8-e9ae-55fb-83c7-f8037cfd319f',
  '2be70ccd-adb0-5a83-8adf-f26d571044e3',
  'rps_part',
  '42eddf93-0b56-404c-99ac-6869341e8ec9',
  609,
  'parts_list',
  NULL,
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY['component.steering_gear']::text[],
  NULL,
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","group_code":"PB","group_name":"STEERING BOX ASSEMBLY","page_type_reason":"structured RPS parts record"}'::jsonb
)
ON CONFLICT (semantic_version_id, source_type, source_record_id) DO UPDATE SET
  page_type = EXCLUDED.page_type,
  content_hash = EXCLUDED.content_hash,
  model_tags = EXCLUDED.model_tags,
  component_tags = EXCLUDED.component_tags,
  provenance = EXCLUDED.provenance,
  updated_at = now();
INSERT INTO public.barry_evidence_units (
  id, document_id, source_type, source_record_id, physical_pdf_page, page_type,
  content_hash, system_tags, model_tags, component_tags, extraction_quality,
  semantic_version_id, backfill_run_id, provenance
) VALUES (
  'f0b1fab0-969b-565d-811f-4dd75f87dd72',
  '2be70ccd-adb0-5a83-8adf-f26d571044e3',
  'rps_part',
  '433c8c10-553a-487c-bc1f-48de37c7b0ab',
  623,
  'parts_list',
  NULL,
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY['component.steering_reservoir']::text[],
  NULL,
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","group_code":"PBB","group_name":"POWER STEERING RESERVOIR AND PIPING","page_type_reason":"structured RPS parts record"}'::jsonb
)
ON CONFLICT (semantic_version_id, source_type, source_record_id) DO UPDATE SET
  page_type = EXCLUDED.page_type,
  content_hash = EXCLUDED.content_hash,
  model_tags = EXCLUDED.model_tags,
  component_tags = EXCLUDED.component_tags,
  provenance = EXCLUDED.provenance,
  updated_at = now();
INSERT INTO public.barry_evidence_units (
  id, document_id, source_type, source_record_id, physical_pdf_page, page_type,
  content_hash, system_tags, model_tags, component_tags, extraction_quality,
  semantic_version_id, backfill_run_id, provenance
) VALUES (
  'd93b5da1-9712-55b5-81be-e3a1f1d47ac4',
  '2be70ccd-adb0-5a83-8adf-f26d571044e3',
  'rps_part',
  '4364604e-38a0-4340-a918-0fc977cb7cdf',
  619,
  'parts_list',
  NULL,
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY['component.power_steering_pump']::text[],
  NULL,
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","group_code":"PBA","group_name":"POWER STEERING PUMP AND DRIVE","page_type_reason":"structured RPS parts record"}'::jsonb
)
ON CONFLICT (semantic_version_id, source_type, source_record_id) DO UPDATE SET
  page_type = EXCLUDED.page_type,
  content_hash = EXCLUDED.content_hash,
  model_tags = EXCLUDED.model_tags,
  component_tags = EXCLUDED.component_tags,
  provenance = EXCLUDED.provenance,
  updated_at = now();
INSERT INTO public.barry_evidence_units (
  id, document_id, source_type, source_record_id, physical_pdf_page, page_type,
  content_hash, system_tags, model_tags, component_tags, extraction_quality,
  semantic_version_id, backfill_run_id, provenance
) VALUES (
  'eea5d8cf-a4ec-53c9-850a-c740bda74a3f',
  '2be70ccd-adb0-5a83-8adf-f26d571044e3',
  'rps_part',
  '44e494d3-7ae4-4d58-965d-048a9f612350',
  625,
  'parts_list',
  NULL,
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY['component.steering_reservoir']::text[],
  NULL,
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","group_code":"PBB","group_name":"POWER STEERING RESERVOIR AND PIPING","page_type_reason":"structured RPS parts record"}'::jsonb
)
ON CONFLICT (semantic_version_id, source_type, source_record_id) DO UPDATE SET
  page_type = EXCLUDED.page_type,
  content_hash = EXCLUDED.content_hash,
  model_tags = EXCLUDED.model_tags,
  component_tags = EXCLUDED.component_tags,
  provenance = EXCLUDED.provenance,
  updated_at = now();
INSERT INTO public.barry_evidence_units (
  id, document_id, source_type, source_record_id, physical_pdf_page, page_type,
  content_hash, system_tags, model_tags, component_tags, extraction_quality,
  semantic_version_id, backfill_run_id, provenance
) VALUES (
  'a2399e18-fad4-57f5-8322-c9362f1f67b1',
  '2be70ccd-adb0-5a83-8adf-f26d571044e3',
  'rps_part',
  '46c6a779-0fb9-4565-98cb-c348281421b2',
  619,
  'parts_list',
  NULL,
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY['component.power_steering_pump']::text[],
  NULL,
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","group_code":"PBA","group_name":"POWER STEERING PUMP AND DRIVE","page_type_reason":"structured RPS parts record"}'::jsonb
)
ON CONFLICT (semantic_version_id, source_type, source_record_id) DO UPDATE SET
  page_type = EXCLUDED.page_type,
  content_hash = EXCLUDED.content_hash,
  model_tags = EXCLUDED.model_tags,
  component_tags = EXCLUDED.component_tags,
  provenance = EXCLUDED.provenance,
  updated_at = now();
INSERT INTO public.barry_evidence_units (
  id, document_id, source_type, source_record_id, physical_pdf_page, page_type,
  content_hash, system_tags, model_tags, component_tags, extraction_quality,
  semantic_version_id, backfill_run_id, provenance
) VALUES (
  'fe33bf72-5f40-5189-8040-3f41a5c0f25a',
  '2be70ccd-adb0-5a83-8adf-f26d571044e3',
  'rps_part',
  '47423140-3fd5-4c8c-982e-cd4e494264fe',
  605,
  'parts_list',
  NULL,
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY['component.steering_gear']::text[],
  NULL,
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","group_code":"PB","group_name":"STEERING BOX ASSEMBLY","page_type_reason":"structured RPS parts record"}'::jsonb
)
ON CONFLICT (semantic_version_id, source_type, source_record_id) DO UPDATE SET
  page_type = EXCLUDED.page_type,
  content_hash = EXCLUDED.content_hash,
  model_tags = EXCLUDED.model_tags,
  component_tags = EXCLUDED.component_tags,
  provenance = EXCLUDED.provenance,
  updated_at = now();
INSERT INTO public.barry_evidence_units (
  id, document_id, source_type, source_record_id, physical_pdf_page, page_type,
  content_hash, system_tags, model_tags, component_tags, extraction_quality,
  semantic_version_id, backfill_run_id, provenance
) VALUES (
  '7c0a7921-55ea-58c0-89ef-f576e966eb72',
  '2be70ccd-adb0-5a83-8adf-f26d571044e3',
  'rps_part',
  '489601d4-2f2d-48f2-a59a-61499b0f685b',
  595,
  'parts_list',
  NULL,
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY[]::text[],
  NULL,
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","group_code":"PA","group_name":"STEERING WHEEL, COLUMN DRIVE SHAFTS AND DRAG LINK","page_type_reason":"structured RPS parts record"}'::jsonb
)
ON CONFLICT (semantic_version_id, source_type, source_record_id) DO UPDATE SET
  page_type = EXCLUDED.page_type,
  content_hash = EXCLUDED.content_hash,
  model_tags = EXCLUDED.model_tags,
  component_tags = EXCLUDED.component_tags,
  provenance = EXCLUDED.provenance,
  updated_at = now();
INSERT INTO public.barry_evidence_units (
  id, document_id, source_type, source_record_id, physical_pdf_page, page_type,
  content_hash, system_tags, model_tags, component_tags, extraction_quality,
  semantic_version_id, backfill_run_id, provenance
) VALUES (
  '0c879209-3672-5b50-8b8a-1104ca70f011',
  '2be70ccd-adb0-5a83-8adf-f26d571044e3',
  'rps_part',
  '48da7e28-869e-4be1-9cca-20c1ca394d2f',
  627,
  'parts_list',
  NULL,
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY['component.steering_reservoir']::text[],
  NULL,
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","group_code":"PBB","group_name":"POWER STEERING RESERVOIR AND PIPING","page_type_reason":"structured RPS parts record"}'::jsonb
)
ON CONFLICT (semantic_version_id, source_type, source_record_id) DO UPDATE SET
  page_type = EXCLUDED.page_type,
  content_hash = EXCLUDED.content_hash,
  model_tags = EXCLUDED.model_tags,
  component_tags = EXCLUDED.component_tags,
  provenance = EXCLUDED.provenance,
  updated_at = now();
INSERT INTO public.barry_evidence_units (
  id, document_id, source_type, source_record_id, physical_pdf_page, page_type,
  content_hash, system_tags, model_tags, component_tags, extraction_quality,
  semantic_version_id, backfill_run_id, provenance
) VALUES (
  'f7bc0b68-0fd3-5335-855a-75416b01feb8',
  '2be70ccd-adb0-5a83-8adf-f26d571044e3',
  'rps_part',
  '494928ac-7f04-4dbf-8056-3e06220098fc',
  599,
  'parts_list',
  NULL,
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY[]::text[],
  NULL,
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","group_code":"PA","group_name":"STEERING WHEEL, COLUMN DRIVE SHAFTS AND DRAG LINK","page_type_reason":"structured RPS parts record"}'::jsonb
)
ON CONFLICT (semantic_version_id, source_type, source_record_id) DO UPDATE SET
  page_type = EXCLUDED.page_type,
  content_hash = EXCLUDED.content_hash,
  model_tags = EXCLUDED.model_tags,
  component_tags = EXCLUDED.component_tags,
  provenance = EXCLUDED.provenance,
  updated_at = now();
INSERT INTO public.barry_evidence_units (
  id, document_id, source_type, source_record_id, physical_pdf_page, page_type,
  content_hash, system_tags, model_tags, component_tags, extraction_quality,
  semantic_version_id, backfill_run_id, provenance
) VALUES (
  '3efdfcd9-8801-50d2-8540-404022e8b0a5',
  '2be70ccd-adb0-5a83-8adf-f26d571044e3',
  'rps_part',
  '4993726a-6140-4ba8-a30a-6e6330b980da',
  627,
  'parts_list',
  NULL,
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY['component.steering_reservoir']::text[],
  NULL,
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","group_code":"PBB","group_name":"POWER STEERING RESERVOIR AND PIPING","page_type_reason":"structured RPS parts record"}'::jsonb
)
ON CONFLICT (semantic_version_id, source_type, source_record_id) DO UPDATE SET
  page_type = EXCLUDED.page_type,
  content_hash = EXCLUDED.content_hash,
  model_tags = EXCLUDED.model_tags,
  component_tags = EXCLUDED.component_tags,
  provenance = EXCLUDED.provenance,
  updated_at = now();
INSERT INTO public.barry_evidence_units (
  id, document_id, source_type, source_record_id, physical_pdf_page, page_type,
  content_hash, system_tags, model_tags, component_tags, extraction_quality,
  semantic_version_id, backfill_run_id, provenance
) VALUES (
  '9a94a356-acf2-5265-87ed-107b65b3bad7',
  '2be70ccd-adb0-5a83-8adf-f26d571044e3',
  'rps_part',
  '4a847a85-5687-4d9d-bfe3-1f36bd25c9dd',
  615,
  'parts_list',
  NULL,
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY['component.power_steering_pump']::text[],
  NULL,
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","group_code":"PBA","group_name":"POWER STEERING PUMP AND DRIVE","page_type_reason":"structured RPS parts record"}'::jsonb
)
ON CONFLICT (semantic_version_id, source_type, source_record_id) DO UPDATE SET
  page_type = EXCLUDED.page_type,
  content_hash = EXCLUDED.content_hash,
  model_tags = EXCLUDED.model_tags,
  component_tags = EXCLUDED.component_tags,
  provenance = EXCLUDED.provenance,
  updated_at = now();
INSERT INTO public.barry_evidence_units (
  id, document_id, source_type, source_record_id, physical_pdf_page, page_type,
  content_hash, system_tags, model_tags, component_tags, extraction_quality,
  semantic_version_id, backfill_run_id, provenance
) VALUES (
  'fd86adf0-31f2-504f-8c03-eed7f7a53500',
  '2be70ccd-adb0-5a83-8adf-f26d571044e3',
  'rps_part',
  '4bbb74aa-6e33-42ff-90ab-8803b9b265c3',
  605,
  'parts_list',
  NULL,
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY['component.steering_gear']::text[],
  NULL,
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","group_code":"PB","group_name":"STEERING BOX ASSEMBLY","page_type_reason":"structured RPS parts record"}'::jsonb
)
ON CONFLICT (semantic_version_id, source_type, source_record_id) DO UPDATE SET
  page_type = EXCLUDED.page_type,
  content_hash = EXCLUDED.content_hash,
  model_tags = EXCLUDED.model_tags,
  component_tags = EXCLUDED.component_tags,
  provenance = EXCLUDED.provenance,
  updated_at = now();
INSERT INTO public.barry_evidence_units (
  id, document_id, source_type, source_record_id, physical_pdf_page, page_type,
  content_hash, system_tags, model_tags, component_tags, extraction_quality,
  semantic_version_id, backfill_run_id, provenance
) VALUES (
  '8abd2410-d6d4-5423-8990-7e3e582e7780',
  '2be70ccd-adb0-5a83-8adf-f26d571044e3',
  'rps_part',
  '4d5c7cf1-b524-4bf4-9a1c-7394a9f4145c',
  601,
  'parts_list',
  NULL,
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY[]::text[],
  NULL,
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","group_code":"PA","group_name":"STEERING WHEEL, COLUMN DRIVE SHAFTS AND DRAG LINK","page_type_reason":"structured RPS parts record"}'::jsonb
)
ON CONFLICT (semantic_version_id, source_type, source_record_id) DO UPDATE SET
  page_type = EXCLUDED.page_type,
  content_hash = EXCLUDED.content_hash,
  model_tags = EXCLUDED.model_tags,
  component_tags = EXCLUDED.component_tags,
  provenance = EXCLUDED.provenance,
  updated_at = now();
INSERT INTO public.barry_evidence_units (
  id, document_id, source_type, source_record_id, physical_pdf_page, page_type,
  content_hash, system_tags, model_tags, component_tags, extraction_quality,
  semantic_version_id, backfill_run_id, provenance
) VALUES (
  '9045ca57-d1a0-560a-8b18-f09ad5d48882',
  '2be70ccd-adb0-5a83-8adf-f26d571044e3',
  'rps_part',
  '50aaf62a-f7d8-42dc-8fd5-34f9bee57f67',
  607,
  'parts_list',
  NULL,
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY['component.steering_gear']::text[],
  NULL,
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","group_code":"PB","group_name":"STEERING BOX ASSEMBLY","page_type_reason":"structured RPS parts record"}'::jsonb
)
ON CONFLICT (semantic_version_id, source_type, source_record_id) DO UPDATE SET
  page_type = EXCLUDED.page_type,
  content_hash = EXCLUDED.content_hash,
  model_tags = EXCLUDED.model_tags,
  component_tags = EXCLUDED.component_tags,
  provenance = EXCLUDED.provenance,
  updated_at = now();
INSERT INTO public.barry_evidence_units (
  id, document_id, source_type, source_record_id, physical_pdf_page, page_type,
  content_hash, system_tags, model_tags, component_tags, extraction_quality,
  semantic_version_id, backfill_run_id, provenance
) VALUES (
  '20f3d061-5a02-5c67-8270-b19754cc8f6e',
  '2be70ccd-adb0-5a83-8adf-f26d571044e3',
  'rps_part',
  '5167d65f-05dc-4aa9-b729-a10bb21c6bf1',
  609,
  'parts_list',
  NULL,
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY['component.steering_gear']::text[],
  NULL,
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","group_code":"PB","group_name":"STEERING BOX ASSEMBLY","page_type_reason":"structured RPS parts record"}'::jsonb
)
ON CONFLICT (semantic_version_id, source_type, source_record_id) DO UPDATE SET
  page_type = EXCLUDED.page_type,
  content_hash = EXCLUDED.content_hash,
  model_tags = EXCLUDED.model_tags,
  component_tags = EXCLUDED.component_tags,
  provenance = EXCLUDED.provenance,
  updated_at = now();
INSERT INTO public.barry_evidence_units (
  id, document_id, source_type, source_record_id, physical_pdf_page, page_type,
  content_hash, system_tags, model_tags, component_tags, extraction_quality,
  semantic_version_id, backfill_run_id, provenance
) VALUES (
  '5f445329-5864-578b-8512-bb815bb9fd1c',
  '2be70ccd-adb0-5a83-8adf-f26d571044e3',
  'rps_part',
  '51d317b1-4ab8-4574-8cca-05b2b6a750b6',
  601,
  'parts_list',
  NULL,
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY[]::text[],
  NULL,
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","group_code":"PA","group_name":"STEERING WHEEL, COLUMN DRIVE SHAFTS AND DRAG LINK","page_type_reason":"structured RPS parts record"}'::jsonb
)
ON CONFLICT (semantic_version_id, source_type, source_record_id) DO UPDATE SET
  page_type = EXCLUDED.page_type,
  content_hash = EXCLUDED.content_hash,
  model_tags = EXCLUDED.model_tags,
  component_tags = EXCLUDED.component_tags,
  provenance = EXCLUDED.provenance,
  updated_at = now();
INSERT INTO public.barry_evidence_units (
  id, document_id, source_type, source_record_id, physical_pdf_page, page_type,
  content_hash, system_tags, model_tags, component_tags, extraction_quality,
  semantic_version_id, backfill_run_id, provenance
) VALUES (
  'd3b7cbbf-2b72-5a50-8181-fbbe93d6de9a',
  '2be70ccd-adb0-5a83-8adf-f26d571044e3',
  'rps_part',
  '52000300-2aef-40ac-ac19-daaebc8c55d3',
  617,
  'parts_list',
  NULL,
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY['component.power_steering_pump']::text[],
  NULL,
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","group_code":"PBA","group_name":"POWER STEERING PUMP AND DRIVE","page_type_reason":"structured RPS parts record"}'::jsonb
)
ON CONFLICT (semantic_version_id, source_type, source_record_id) DO UPDATE SET
  page_type = EXCLUDED.page_type,
  content_hash = EXCLUDED.content_hash,
  model_tags = EXCLUDED.model_tags,
  component_tags = EXCLUDED.component_tags,
  provenance = EXCLUDED.provenance,
  updated_at = now();
INSERT INTO public.barry_evidence_units (
  id, document_id, source_type, source_record_id, physical_pdf_page, page_type,
  content_hash, system_tags, model_tags, component_tags, extraction_quality,
  semantic_version_id, backfill_run_id, provenance
) VALUES (
  '01bad3c3-1a92-530e-8688-825d1587f4f6',
  '2be70ccd-adb0-5a83-8adf-f26d571044e3',
  'rps_part',
  '521e40db-df53-4fb3-9752-3bb8a1acea29',
  617,
  'parts_list',
  NULL,
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY['component.power_steering_pump']::text[],
  NULL,
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","group_code":"PBA","group_name":"POWER STEERING PUMP AND DRIVE","page_type_reason":"structured RPS parts record"}'::jsonb
)
ON CONFLICT (semantic_version_id, source_type, source_record_id) DO UPDATE SET
  page_type = EXCLUDED.page_type,
  content_hash = EXCLUDED.content_hash,
  model_tags = EXCLUDED.model_tags,
  component_tags = EXCLUDED.component_tags,
  provenance = EXCLUDED.provenance,
  updated_at = now();
INSERT INTO public.barry_evidence_units (
  id, document_id, source_type, source_record_id, physical_pdf_page, page_type,
  content_hash, system_tags, model_tags, component_tags, extraction_quality,
  semantic_version_id, backfill_run_id, provenance
) VALUES (
  '06e7d969-842e-54cb-8583-eefa96a68cf0',
  '2be70ccd-adb0-5a83-8adf-f26d571044e3',
  'rps_part',
  '52aa5ca3-1e41-4f6a-b9cf-917414d697fd',
  601,
  'parts_list',
  NULL,
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY[]::text[],
  NULL,
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","group_code":"PA","group_name":"STEERING WHEEL, COLUMN DRIVE SHAFTS AND DRAG LINK","page_type_reason":"structured RPS parts record"}'::jsonb
)
ON CONFLICT (semantic_version_id, source_type, source_record_id) DO UPDATE SET
  page_type = EXCLUDED.page_type,
  content_hash = EXCLUDED.content_hash,
  model_tags = EXCLUDED.model_tags,
  component_tags = EXCLUDED.component_tags,
  provenance = EXCLUDED.provenance,
  updated_at = now();
INSERT INTO public.barry_evidence_units (
  id, document_id, source_type, source_record_id, physical_pdf_page, page_type,
  content_hash, system_tags, model_tags, component_tags, extraction_quality,
  semantic_version_id, backfill_run_id, provenance
) VALUES (
  'bdf7541c-f03e-5a6e-85c0-e8478109105d',
  '2be70ccd-adb0-5a83-8adf-f26d571044e3',
  'rps_part',
  '53d3b9bd-ebc5-4df0-84c1-148781fef6a8',
  627,
  'parts_list',
  NULL,
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY['component.steering_reservoir']::text[],
  NULL,
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","group_code":"PBB","group_name":"POWER STEERING RESERVOIR AND PIPING","page_type_reason":"structured RPS parts record"}'::jsonb
)
ON CONFLICT (semantic_version_id, source_type, source_record_id) DO UPDATE SET
  page_type = EXCLUDED.page_type,
  content_hash = EXCLUDED.content_hash,
  model_tags = EXCLUDED.model_tags,
  component_tags = EXCLUDED.component_tags,
  provenance = EXCLUDED.provenance,
  updated_at = now();
INSERT INTO public.barry_evidence_units (
  id, document_id, source_type, source_record_id, physical_pdf_page, page_type,
  content_hash, system_tags, model_tags, component_tags, extraction_quality,
  semantic_version_id, backfill_run_id, provenance
) VALUES (
  'c8cc8113-f417-5a87-879a-646c26f4db02',
  '2be70ccd-adb0-5a83-8adf-f26d571044e3',
  'rps_part',
  '53e99ba9-1db5-464c-8fbd-3d0e613ed378',
  609,
  'parts_list',
  NULL,
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY['component.steering_gear']::text[],
  NULL,
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","group_code":"PB","group_name":"STEERING BOX ASSEMBLY","page_type_reason":"structured RPS parts record"}'::jsonb
)
ON CONFLICT (semantic_version_id, source_type, source_record_id) DO UPDATE SET
  page_type = EXCLUDED.page_type,
  content_hash = EXCLUDED.content_hash,
  model_tags = EXCLUDED.model_tags,
  component_tags = EXCLUDED.component_tags,
  provenance = EXCLUDED.provenance,
  updated_at = now();
INSERT INTO public.barry_evidence_units (
  id, document_id, source_type, source_record_id, physical_pdf_page, page_type,
  content_hash, system_tags, model_tags, component_tags, extraction_quality,
  semantic_version_id, backfill_run_id, provenance
) VALUES (
  'e3c01c15-85ef-51a0-89e9-06ed856b547a',
  '2be70ccd-adb0-5a83-8adf-f26d571044e3',
  'rps_part',
  '5799fadd-4bbc-4397-a589-d93905ce9952',
  615,
  'parts_list',
  NULL,
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY['component.power_steering_pump']::text[],
  NULL,
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","group_code":"PBA","group_name":"POWER STEERING PUMP AND DRIVE","page_type_reason":"structured RPS parts record"}'::jsonb
)
ON CONFLICT (semantic_version_id, source_type, source_record_id) DO UPDATE SET
  page_type = EXCLUDED.page_type,
  content_hash = EXCLUDED.content_hash,
  model_tags = EXCLUDED.model_tags,
  component_tags = EXCLUDED.component_tags,
  provenance = EXCLUDED.provenance,
  updated_at = now();
INSERT INTO public.barry_evidence_units (
  id, document_id, source_type, source_record_id, physical_pdf_page, page_type,
  content_hash, system_tags, model_tags, component_tags, extraction_quality,
  semantic_version_id, backfill_run_id, provenance
) VALUES (
  'b9775473-5665-5373-8c58-fb08fa3f6d29',
  '2be70ccd-adb0-5a83-8adf-f26d571044e3',
  'rps_part',
  '57bdb68d-a9fc-452c-9619-614a676c8b08',
  617,
  'parts_list',
  NULL,
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY['component.power_steering_pump']::text[],
  NULL,
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","group_code":"PBA","group_name":"POWER STEERING PUMP AND DRIVE","page_type_reason":"structured RPS parts record"}'::jsonb
)
ON CONFLICT (semantic_version_id, source_type, source_record_id) DO UPDATE SET
  page_type = EXCLUDED.page_type,
  content_hash = EXCLUDED.content_hash,
  model_tags = EXCLUDED.model_tags,
  component_tags = EXCLUDED.component_tags,
  provenance = EXCLUDED.provenance,
  updated_at = now();
INSERT INTO public.barry_evidence_units (
  id, document_id, source_type, source_record_id, physical_pdf_page, page_type,
  content_hash, system_tags, model_tags, component_tags, extraction_quality,
  semantic_version_id, backfill_run_id, provenance
) VALUES (
  'ea0da941-6398-51b8-8cc6-9192a2b1d330',
  '2be70ccd-adb0-5a83-8adf-f26d571044e3',
  'rps_part',
  '58980a05-b90b-46f8-9d71-ebb337b11532',
  597,
  'parts_list',
  NULL,
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY[]::text[],
  NULL,
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","group_code":"PA","group_name":"STEERING WHEEL, COLUMN DRIVE SHAFTS AND DRAG LINK","page_type_reason":"structured RPS parts record"}'::jsonb
)
ON CONFLICT (semantic_version_id, source_type, source_record_id) DO UPDATE SET
  page_type = EXCLUDED.page_type,
  content_hash = EXCLUDED.content_hash,
  model_tags = EXCLUDED.model_tags,
  component_tags = EXCLUDED.component_tags,
  provenance = EXCLUDED.provenance,
  updated_at = now();
INSERT INTO public.barry_evidence_units (
  id, document_id, source_type, source_record_id, physical_pdf_page, page_type,
  content_hash, system_tags, model_tags, component_tags, extraction_quality,
  semantic_version_id, backfill_run_id, provenance
) VALUES (
  'f47d0bcb-9da4-54e6-8c48-6c9794eddda7',
  '2be70ccd-adb0-5a83-8adf-f26d571044e3',
  'rps_part',
  '592b8185-7707-46ef-b66f-57cefc9bb057',
  601,
  'parts_list',
  NULL,
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY[]::text[],
  NULL,
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","group_code":"PA","group_name":"STEERING WHEEL, COLUMN DRIVE SHAFTS AND DRAG LINK","page_type_reason":"structured RPS parts record"}'::jsonb
)
ON CONFLICT (semantic_version_id, source_type, source_record_id) DO UPDATE SET
  page_type = EXCLUDED.page_type,
  content_hash = EXCLUDED.content_hash,
  model_tags = EXCLUDED.model_tags,
  component_tags = EXCLUDED.component_tags,
  provenance = EXCLUDED.provenance,
  updated_at = now();
INSERT INTO public.barry_evidence_units (
  id, document_id, source_type, source_record_id, physical_pdf_page, page_type,
  content_hash, system_tags, model_tags, component_tags, extraction_quality,
  semantic_version_id, backfill_run_id, provenance
) VALUES (
  'e18dfe5c-6e4d-5fd2-8994-7379cd11c6a9',
  '2be70ccd-adb0-5a83-8adf-f26d571044e3',
  'rps_part',
  '5b02846c-d29f-4e1a-bba9-5e94aacb2423',
  613,
  'parts_list',
  NULL,
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY['component.steering_gear']::text[],
  NULL,
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","group_code":"PB","group_name":"STEERING BOX ASSEMBLY","page_type_reason":"structured RPS parts record"}'::jsonb
)
ON CONFLICT (semantic_version_id, source_type, source_record_id) DO UPDATE SET
  page_type = EXCLUDED.page_type,
  content_hash = EXCLUDED.content_hash,
  model_tags = EXCLUDED.model_tags,
  component_tags = EXCLUDED.component_tags,
  provenance = EXCLUDED.provenance,
  updated_at = now();
INSERT INTO public.barry_evidence_units (
  id, document_id, source_type, source_record_id, physical_pdf_page, page_type,
  content_hash, system_tags, model_tags, component_tags, extraction_quality,
  semantic_version_id, backfill_run_id, provenance
) VALUES (
  '14f9dd9e-35b1-5f5a-8611-cd525aed2c69',
  '2be70ccd-adb0-5a83-8adf-f26d571044e3',
  'rps_part',
  '5b22f046-b96d-4124-8b89-f4948d913683',
  627,
  'parts_list',
  NULL,
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY['component.steering_reservoir']::text[],
  NULL,
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","group_code":"PBB","group_name":"POWER STEERING RESERVOIR AND PIPING","page_type_reason":"structured RPS parts record"}'::jsonb
)
ON CONFLICT (semantic_version_id, source_type, source_record_id) DO UPDATE SET
  page_type = EXCLUDED.page_type,
  content_hash = EXCLUDED.content_hash,
  model_tags = EXCLUDED.model_tags,
  component_tags = EXCLUDED.component_tags,
  provenance = EXCLUDED.provenance,
  updated_at = now();
INSERT INTO public.barry_evidence_units (
  id, document_id, source_type, source_record_id, physical_pdf_page, page_type,
  content_hash, system_tags, model_tags, component_tags, extraction_quality,
  semantic_version_id, backfill_run_id, provenance
) VALUES (
  '6f58d595-461a-54d6-8962-b113051cd878',
  '2be70ccd-adb0-5a83-8adf-f26d571044e3',
  'rps_part',
  '5b277540-0e3c-4ccc-a6a7-ddacf3fe8d78',
  597,
  'parts_list',
  NULL,
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY[]::text[],
  NULL,
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","group_code":"PA","group_name":"STEERING WHEEL, COLUMN DRIVE SHAFTS AND DRAG LINK","page_type_reason":"structured RPS parts record"}'::jsonb
)
ON CONFLICT (semantic_version_id, source_type, source_record_id) DO UPDATE SET
  page_type = EXCLUDED.page_type,
  content_hash = EXCLUDED.content_hash,
  model_tags = EXCLUDED.model_tags,
  component_tags = EXCLUDED.component_tags,
  provenance = EXCLUDED.provenance,
  updated_at = now();
INSERT INTO public.barry_evidence_units (
  id, document_id, source_type, source_record_id, physical_pdf_page, page_type,
  content_hash, system_tags, model_tags, component_tags, extraction_quality,
  semantic_version_id, backfill_run_id, provenance
) VALUES (
  '617c4afd-4ee5-54fc-85c1-d8c070e564d2',
  '2be70ccd-adb0-5a83-8adf-f26d571044e3',
  'rps_part',
  '5c19b4be-884e-48a3-9f19-c07c627b66d1',
  595,
  'parts_list',
  NULL,
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY[]::text[],
  NULL,
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","group_code":"PA","group_name":"STEERING WHEEL, COLUMN DRIVE SHAFTS AND DRAG LINK","page_type_reason":"structured RPS parts record"}'::jsonb
)
ON CONFLICT (semantic_version_id, source_type, source_record_id) DO UPDATE SET
  page_type = EXCLUDED.page_type,
  content_hash = EXCLUDED.content_hash,
  model_tags = EXCLUDED.model_tags,
  component_tags = EXCLUDED.component_tags,
  provenance = EXCLUDED.provenance,
  updated_at = now();
INSERT INTO public.barry_evidence_units (
  id, document_id, source_type, source_record_id, physical_pdf_page, page_type,
  content_hash, system_tags, model_tags, component_tags, extraction_quality,
  semantic_version_id, backfill_run_id, provenance
) VALUES (
  'fd3c5942-ba39-55d0-8727-12b1f8ef64cd',
  '2be70ccd-adb0-5a83-8adf-f26d571044e3',
  'rps_part',
  '5e76c201-8ad9-4fca-8031-26a25fc43e81',
  597,
  'parts_list',
  NULL,
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY[]::text[],
  NULL,
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","group_code":"PA","group_name":"STEERING WHEEL, COLUMN DRIVE SHAFTS AND DRAG LINK","page_type_reason":"structured RPS parts record"}'::jsonb
)
ON CONFLICT (semantic_version_id, source_type, source_record_id) DO UPDATE SET
  page_type = EXCLUDED.page_type,
  content_hash = EXCLUDED.content_hash,
  model_tags = EXCLUDED.model_tags,
  component_tags = EXCLUDED.component_tags,
  provenance = EXCLUDED.provenance,
  updated_at = now();
INSERT INTO public.barry_evidence_units (
  id, document_id, source_type, source_record_id, physical_pdf_page, page_type,
  content_hash, system_tags, model_tags, component_tags, extraction_quality,
  semantic_version_id, backfill_run_id, provenance
) VALUES (
  '1f08f049-e5c8-5c6f-83ff-ef444dafdfb0',
  '2be70ccd-adb0-5a83-8adf-f26d571044e3',
  'rps_part',
  '5ef1a1db-baa2-4a04-9fc6-a3fde4181338',
  605,
  'parts_list',
  NULL,
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY['component.steering_gear']::text[],
  NULL,
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","group_code":"PB","group_name":"STEERING BOX ASSEMBLY","page_type_reason":"structured RPS parts record"}'::jsonb
)
ON CONFLICT (semantic_version_id, source_type, source_record_id) DO UPDATE SET
  page_type = EXCLUDED.page_type,
  content_hash = EXCLUDED.content_hash,
  model_tags = EXCLUDED.model_tags,
  component_tags = EXCLUDED.component_tags,
  provenance = EXCLUDED.provenance,
  updated_at = now();
INSERT INTO public.barry_evidence_units (
  id, document_id, source_type, source_record_id, physical_pdf_page, page_type,
  content_hash, system_tags, model_tags, component_tags, extraction_quality,
  semantic_version_id, backfill_run_id, provenance
) VALUES (
  '80d02125-74cd-53a7-8e3f-cf1c2203d04f',
  '2be70ccd-adb0-5a83-8adf-f26d571044e3',
  'rps_part',
  '5f00a3ea-f175-442f-a7dc-93b3fde15fa1',
  597,
  'parts_list',
  NULL,
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY[]::text[],
  NULL,
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","group_code":"PA","group_name":"STEERING WHEEL, COLUMN DRIVE SHAFTS AND DRAG LINK","page_type_reason":"structured RPS parts record"}'::jsonb
)
ON CONFLICT (semantic_version_id, source_type, source_record_id) DO UPDATE SET
  page_type = EXCLUDED.page_type,
  content_hash = EXCLUDED.content_hash,
  model_tags = EXCLUDED.model_tags,
  component_tags = EXCLUDED.component_tags,
  provenance = EXCLUDED.provenance,
  updated_at = now();
INSERT INTO public.barry_evidence_units (
  id, document_id, source_type, source_record_id, physical_pdf_page, page_type,
  content_hash, system_tags, model_tags, component_tags, extraction_quality,
  semantic_version_id, backfill_run_id, provenance
) VALUES (
  '1d3c1cef-19e9-5dc3-8c2f-062d9d3a8270',
  '2be70ccd-adb0-5a83-8adf-f26d571044e3',
  'rps_part',
  '601bf923-a25d-4870-90c2-25237553611e',
  615,
  'parts_list',
  NULL,
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY['component.power_steering_pump']::text[],
  NULL,
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","group_code":"PBA","group_name":"POWER STEERING PUMP AND DRIVE","page_type_reason":"structured RPS parts record"}'::jsonb
)
ON CONFLICT (semantic_version_id, source_type, source_record_id) DO UPDATE SET
  page_type = EXCLUDED.page_type,
  content_hash = EXCLUDED.content_hash,
  model_tags = EXCLUDED.model_tags,
  component_tags = EXCLUDED.component_tags,
  provenance = EXCLUDED.provenance,
  updated_at = now();
INSERT INTO public.barry_evidence_units (
  id, document_id, source_type, source_record_id, physical_pdf_page, page_type,
  content_hash, system_tags, model_tags, component_tags, extraction_quality,
  semantic_version_id, backfill_run_id, provenance
) VALUES (
  'ae790cec-5787-5f8e-8c38-a1ecbdff0d9d',
  '2be70ccd-adb0-5a83-8adf-f26d571044e3',
  'rps_part',
  '60491aac-e50b-4894-b378-01dd25819799',
  625,
  'parts_list',
  NULL,
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY['component.steering_reservoir']::text[],
  NULL,
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","group_code":"PBB","group_name":"POWER STEERING RESERVOIR AND PIPING","page_type_reason":"structured RPS parts record"}'::jsonb
)
ON CONFLICT (semantic_version_id, source_type, source_record_id) DO UPDATE SET
  page_type = EXCLUDED.page_type,
  content_hash = EXCLUDED.content_hash,
  model_tags = EXCLUDED.model_tags,
  component_tags = EXCLUDED.component_tags,
  provenance = EXCLUDED.provenance,
  updated_at = now();
INSERT INTO public.barry_evidence_units (
  id, document_id, source_type, source_record_id, physical_pdf_page, page_type,
  content_hash, system_tags, model_tags, component_tags, extraction_quality,
  semantic_version_id, backfill_run_id, provenance
) VALUES (
  '116b4176-4b0c-5e41-84be-fd047514dad7',
  '2be70ccd-adb0-5a83-8adf-f26d571044e3',
  'rps_part',
  '60b300f7-cf54-4cf7-bdcf-ba16edad6d93',
  621,
  'parts_list',
  NULL,
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY['component.power_steering_pump']::text[],
  NULL,
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","group_code":"PBA","group_name":"POWER STEERING PUMP AND DRIVE","page_type_reason":"structured RPS parts record"}'::jsonb
)
ON CONFLICT (semantic_version_id, source_type, source_record_id) DO UPDATE SET
  page_type = EXCLUDED.page_type,
  content_hash = EXCLUDED.content_hash,
  model_tags = EXCLUDED.model_tags,
  component_tags = EXCLUDED.component_tags,
  provenance = EXCLUDED.provenance,
  updated_at = now();
INSERT INTO public.barry_evidence_units (
  id, document_id, source_type, source_record_id, physical_pdf_page, page_type,
  content_hash, system_tags, model_tags, component_tags, extraction_quality,
  semantic_version_id, backfill_run_id, provenance
) VALUES (
  '5dd25fa0-f902-5f1c-8041-86ff26e67ee9',
  '2be70ccd-adb0-5a83-8adf-f26d571044e3',
  'rps_part',
  '61b51900-274f-4754-8246-800a2376c8dc',
  623,
  'parts_list',
  NULL,
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY['component.steering_reservoir']::text[],
  NULL,
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","group_code":"PBB","group_name":"POWER STEERING RESERVOIR AND PIPING","page_type_reason":"structured RPS parts record"}'::jsonb
)
ON CONFLICT (semantic_version_id, source_type, source_record_id) DO UPDATE SET
  page_type = EXCLUDED.page_type,
  content_hash = EXCLUDED.content_hash,
  model_tags = EXCLUDED.model_tags,
  component_tags = EXCLUDED.component_tags,
  provenance = EXCLUDED.provenance,
  updated_at = now();
INSERT INTO public.barry_evidence_units (
  id, document_id, source_type, source_record_id, physical_pdf_page, page_type,
  content_hash, system_tags, model_tags, component_tags, extraction_quality,
  semantic_version_id, backfill_run_id, provenance
) VALUES (
  '699e7c5c-7286-5c5f-8cd4-8f28c86cbac6',
  '2be70ccd-adb0-5a83-8adf-f26d571044e3',
  'rps_part',
  '6248a74d-3f3b-40f7-9d04-eb7d09c9133f',
  619,
  'parts_list',
  NULL,
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY['component.power_steering_pump']::text[],
  NULL,
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","group_code":"PBA","group_name":"POWER STEERING PUMP AND DRIVE","page_type_reason":"structured RPS parts record"}'::jsonb
)
ON CONFLICT (semantic_version_id, source_type, source_record_id) DO UPDATE SET
  page_type = EXCLUDED.page_type,
  content_hash = EXCLUDED.content_hash,
  model_tags = EXCLUDED.model_tags,
  component_tags = EXCLUDED.component_tags,
  provenance = EXCLUDED.provenance,
  updated_at = now();
INSERT INTO public.barry_evidence_units (
  id, document_id, source_type, source_record_id, physical_pdf_page, page_type,
  content_hash, system_tags, model_tags, component_tags, extraction_quality,
  semantic_version_id, backfill_run_id, provenance
) VALUES (
  'b03eaa5f-b981-52b1-8a6a-f42c47ed8512',
  '2be70ccd-adb0-5a83-8adf-f26d571044e3',
  'rps_part',
  '626425fc-1fcb-4b95-bdf2-880664c52f6b',
  607,
  'parts_list',
  NULL,
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY['component.steering_gear']::text[],
  NULL,
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","group_code":"PB","group_name":"STEERING BOX ASSEMBLY","page_type_reason":"structured RPS parts record"}'::jsonb
)
ON CONFLICT (semantic_version_id, source_type, source_record_id) DO UPDATE SET
  page_type = EXCLUDED.page_type,
  content_hash = EXCLUDED.content_hash,
  model_tags = EXCLUDED.model_tags,
  component_tags = EXCLUDED.component_tags,
  provenance = EXCLUDED.provenance,
  updated_at = now();
INSERT INTO public.barry_evidence_units (
  id, document_id, source_type, source_record_id, physical_pdf_page, page_type,
  content_hash, system_tags, model_tags, component_tags, extraction_quality,
  semantic_version_id, backfill_run_id, provenance
) VALUES (
  '15d8ddae-a2ff-5688-88f5-5a131b31a418',
  '2be70ccd-adb0-5a83-8adf-f26d571044e3',
  'rps_part',
  '6287f191-356d-4772-921a-bfacdb0540e1',
  599,
  'parts_list',
  NULL,
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY[]::text[],
  NULL,
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","group_code":"PA","group_name":"STEERING WHEEL, COLUMN DRIVE SHAFTS AND DRAG LINK","page_type_reason":"structured RPS parts record"}'::jsonb
)
ON CONFLICT (semantic_version_id, source_type, source_record_id) DO UPDATE SET
  page_type = EXCLUDED.page_type,
  content_hash = EXCLUDED.content_hash,
  model_tags = EXCLUDED.model_tags,
  component_tags = EXCLUDED.component_tags,
  provenance = EXCLUDED.provenance,
  updated_at = now();
INSERT INTO public.barry_evidence_units (
  id, document_id, source_type, source_record_id, physical_pdf_page, page_type,
  content_hash, system_tags, model_tags, component_tags, extraction_quality,
  semantic_version_id, backfill_run_id, provenance
) VALUES (
  '273a8f2d-7275-5d0b-8e83-0c127445dd4d',
  '2be70ccd-adb0-5a83-8adf-f26d571044e3',
  'rps_part',
  '62d0f87e-51d0-4e36-b26b-8e6519872119',
  601,
  'parts_list',
  NULL,
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY[]::text[],
  NULL,
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","group_code":"PA","group_name":"STEERING WHEEL, COLUMN DRIVE SHAFTS AND DRAG LINK","page_type_reason":"structured RPS parts record"}'::jsonb
)
ON CONFLICT (semantic_version_id, source_type, source_record_id) DO UPDATE SET
  page_type = EXCLUDED.page_type,
  content_hash = EXCLUDED.content_hash,
  model_tags = EXCLUDED.model_tags,
  component_tags = EXCLUDED.component_tags,
  provenance = EXCLUDED.provenance,
  updated_at = now();
INSERT INTO public.barry_evidence_units (
  id, document_id, source_type, source_record_id, physical_pdf_page, page_type,
  content_hash, system_tags, model_tags, component_tags, extraction_quality,
  semantic_version_id, backfill_run_id, provenance
) VALUES (
  '8ba7c0d9-b6bd-53fb-8e5a-8b3657f568ef',
  '2be70ccd-adb0-5a83-8adf-f26d571044e3',
  'rps_part',
  '647bb9f2-2c2f-4986-9fd7-8d206f40f6cf',
  627,
  'parts_list',
  NULL,
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY['component.steering_reservoir']::text[],
  NULL,
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","group_code":"PBB","group_name":"POWER STEERING RESERVOIR AND PIPING","page_type_reason":"structured RPS parts record"}'::jsonb
)
ON CONFLICT (semantic_version_id, source_type, source_record_id) DO UPDATE SET
  page_type = EXCLUDED.page_type,
  content_hash = EXCLUDED.content_hash,
  model_tags = EXCLUDED.model_tags,
  component_tags = EXCLUDED.component_tags,
  provenance = EXCLUDED.provenance,
  updated_at = now();
INSERT INTO public.barry_evidence_units (
  id, document_id, source_type, source_record_id, physical_pdf_page, page_type,
  content_hash, system_tags, model_tags, component_tags, extraction_quality,
  semantic_version_id, backfill_run_id, provenance
) VALUES (
  '889d8fd2-c18f-53e9-8658-dad978b5f545',
  '2be70ccd-adb0-5a83-8adf-f26d571044e3',
  'rps_part',
  '666df385-e3ac-459b-a469-10a28511f164',
  617,
  'parts_list',
  NULL,
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY['component.power_steering_pump']::text[],
  NULL,
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","group_code":"PBA","group_name":"POWER STEERING PUMP AND DRIVE","page_type_reason":"structured RPS parts record"}'::jsonb
)
ON CONFLICT (semantic_version_id, source_type, source_record_id) DO UPDATE SET
  page_type = EXCLUDED.page_type,
  content_hash = EXCLUDED.content_hash,
  model_tags = EXCLUDED.model_tags,
  component_tags = EXCLUDED.component_tags,
  provenance = EXCLUDED.provenance,
  updated_at = now();
INSERT INTO public.barry_evidence_units (
  id, document_id, source_type, source_record_id, physical_pdf_page, page_type,
  content_hash, system_tags, model_tags, component_tags, extraction_quality,
  semantic_version_id, backfill_run_id, provenance
) VALUES (
  '908cbc9c-49d9-5ea4-8b49-8a16651e72fc',
  '2be70ccd-adb0-5a83-8adf-f26d571044e3',
  'rps_part',
  '6dc69471-a50e-4715-b7e5-c3f58f801387',
  625,
  'parts_list',
  NULL,
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY['component.steering_reservoir']::text[],
  NULL,
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","group_code":"PBB","group_name":"POWER STEERING RESERVOIR AND PIPING","page_type_reason":"structured RPS parts record"}'::jsonb
)
ON CONFLICT (semantic_version_id, source_type, source_record_id) DO UPDATE SET
  page_type = EXCLUDED.page_type,
  content_hash = EXCLUDED.content_hash,
  model_tags = EXCLUDED.model_tags,
  component_tags = EXCLUDED.component_tags,
  provenance = EXCLUDED.provenance,
  updated_at = now();
INSERT INTO public.barry_evidence_units (
  id, document_id, source_type, source_record_id, physical_pdf_page, page_type,
  content_hash, system_tags, model_tags, component_tags, extraction_quality,
  semantic_version_id, backfill_run_id, provenance
) VALUES (
  '76d5e5ae-3161-5ef7-8ac2-d1a9ee641b42',
  '2be70ccd-adb0-5a83-8adf-f26d571044e3',
  'rps_part',
  '6e07d22c-136d-47d8-896e-399404aa2958',
  615,
  'parts_list',
  NULL,
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY['component.power_steering_pump']::text[],
  NULL,
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","group_code":"PBA","group_name":"POWER STEERING PUMP AND DRIVE","page_type_reason":"structured RPS parts record"}'::jsonb
)
ON CONFLICT (semantic_version_id, source_type, source_record_id) DO UPDATE SET
  page_type = EXCLUDED.page_type,
  content_hash = EXCLUDED.content_hash,
  model_tags = EXCLUDED.model_tags,
  component_tags = EXCLUDED.component_tags,
  provenance = EXCLUDED.provenance,
  updated_at = now();
INSERT INTO public.barry_evidence_units (
  id, document_id, source_type, source_record_id, physical_pdf_page, page_type,
  content_hash, system_tags, model_tags, component_tags, extraction_quality,
  semantic_version_id, backfill_run_id, provenance
) VALUES (
  '15ae4081-85d5-5c91-8a59-ba0611633dc4',
  '2be70ccd-adb0-5a83-8adf-f26d571044e3',
  'rps_part',
  '6e63accb-c42a-44d0-b7ea-d08200f37bb6',
  617,
  'parts_list',
  NULL,
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY['component.power_steering_pump']::text[],
  NULL,
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","group_code":"PBA","group_name":"POWER STEERING PUMP AND DRIVE","page_type_reason":"structured RPS parts record"}'::jsonb
)
ON CONFLICT (semantic_version_id, source_type, source_record_id) DO UPDATE SET
  page_type = EXCLUDED.page_type,
  content_hash = EXCLUDED.content_hash,
  model_tags = EXCLUDED.model_tags,
  component_tags = EXCLUDED.component_tags,
  provenance = EXCLUDED.provenance,
  updated_at = now();
INSERT INTO public.barry_evidence_units (
  id, document_id, source_type, source_record_id, physical_pdf_page, page_type,
  content_hash, system_tags, model_tags, component_tags, extraction_quality,
  semantic_version_id, backfill_run_id, provenance
) VALUES (
  '77c4029d-4cae-5686-8804-9025e056cd58',
  '2be70ccd-adb0-5a83-8adf-f26d571044e3',
  'rps_part',
  '6f959415-d29b-4da7-a01a-519378b53610',
  599,
  'parts_list',
  NULL,
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY[]::text[],
  NULL,
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","group_code":"PA","group_name":"STEERING WHEEL, COLUMN DRIVE SHAFTS AND DRAG LINK","page_type_reason":"structured RPS parts record"}'::jsonb
)
ON CONFLICT (semantic_version_id, source_type, source_record_id) DO UPDATE SET
  page_type = EXCLUDED.page_type,
  content_hash = EXCLUDED.content_hash,
  model_tags = EXCLUDED.model_tags,
  component_tags = EXCLUDED.component_tags,
  provenance = EXCLUDED.provenance,
  updated_at = now();
INSERT INTO public.barry_evidence_units (
  id, document_id, source_type, source_record_id, physical_pdf_page, page_type,
  content_hash, system_tags, model_tags, component_tags, extraction_quality,
  semantic_version_id, backfill_run_id, provenance
) VALUES (
  '62452c9e-9efb-5e11-8ee2-4d2a2a93a77c',
  '2be70ccd-adb0-5a83-8adf-f26d571044e3',
  'rps_part',
  '7082a9c0-4f19-42ee-93d7-db186fece136',
  605,
  'parts_list',
  NULL,
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY['component.steering_gear']::text[],
  NULL,
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","group_code":"PB","group_name":"STEERING BOX ASSEMBLY","page_type_reason":"structured RPS parts record"}'::jsonb
)
ON CONFLICT (semantic_version_id, source_type, source_record_id) DO UPDATE SET
  page_type = EXCLUDED.page_type,
  content_hash = EXCLUDED.content_hash,
  model_tags = EXCLUDED.model_tags,
  component_tags = EXCLUDED.component_tags,
  provenance = EXCLUDED.provenance,
  updated_at = now();
INSERT INTO public.barry_evidence_units (
  id, document_id, source_type, source_record_id, physical_pdf_page, page_type,
  content_hash, system_tags, model_tags, component_tags, extraction_quality,
  semantic_version_id, backfill_run_id, provenance
) VALUES (
  'c3dbb3ec-17a6-5940-87fc-05cd0faad860',
  '2be70ccd-adb0-5a83-8adf-f26d571044e3',
  'rps_part',
  '72861940-e710-4d91-84d0-52cf9b07afbd',
  601,
  'parts_list',
  NULL,
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY[]::text[],
  NULL,
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","group_code":"PA","group_name":"STEERING WHEEL, COLUMN DRIVE SHAFTS AND DRAG LINK","page_type_reason":"structured RPS parts record"}'::jsonb
)
ON CONFLICT (semantic_version_id, source_type, source_record_id) DO UPDATE SET
  page_type = EXCLUDED.page_type,
  content_hash = EXCLUDED.content_hash,
  model_tags = EXCLUDED.model_tags,
  component_tags = EXCLUDED.component_tags,
  provenance = EXCLUDED.provenance,
  updated_at = now();
INSERT INTO public.barry_evidence_units (
  id, document_id, source_type, source_record_id, physical_pdf_page, page_type,
  content_hash, system_tags, model_tags, component_tags, extraction_quality,
  semantic_version_id, backfill_run_id, provenance
) VALUES (
  '6e8ac71d-7b68-5cfb-8cb7-b8365e6317e6',
  '2be70ccd-adb0-5a83-8adf-f26d571044e3',
  'rps_part',
  '7563034c-a299-4e25-9398-dbde023ddae5',
  607,
  'parts_list',
  NULL,
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY['component.steering_gear']::text[],
  NULL,
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","group_code":"PB","group_name":"STEERING BOX ASSEMBLY","page_type_reason":"structured RPS parts record"}'::jsonb
)
ON CONFLICT (semantic_version_id, source_type, source_record_id) DO UPDATE SET
  page_type = EXCLUDED.page_type,
  content_hash = EXCLUDED.content_hash,
  model_tags = EXCLUDED.model_tags,
  component_tags = EXCLUDED.component_tags,
  provenance = EXCLUDED.provenance,
  updated_at = now();
INSERT INTO public.barry_evidence_units (
  id, document_id, source_type, source_record_id, physical_pdf_page, page_type,
  content_hash, system_tags, model_tags, component_tags, extraction_quality,
  semantic_version_id, backfill_run_id, provenance
) VALUES (
  'e3014c20-b480-5f33-88c5-4ada2eabc0ea',
  '2be70ccd-adb0-5a83-8adf-f26d571044e3',
  'rps_part',
  '766c0bc2-777a-43ae-8578-c1a86cdef5ed',
  623,
  'parts_list',
  NULL,
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY['component.steering_reservoir']::text[],
  NULL,
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","group_code":"PBB","group_name":"POWER STEERING RESERVOIR AND PIPING","page_type_reason":"structured RPS parts record"}'::jsonb
)
ON CONFLICT (semantic_version_id, source_type, source_record_id) DO UPDATE SET
  page_type = EXCLUDED.page_type,
  content_hash = EXCLUDED.content_hash,
  model_tags = EXCLUDED.model_tags,
  component_tags = EXCLUDED.component_tags,
  provenance = EXCLUDED.provenance,
  updated_at = now();
INSERT INTO public.barry_evidence_units (
  id, document_id, source_type, source_record_id, physical_pdf_page, page_type,
  content_hash, system_tags, model_tags, component_tags, extraction_quality,
  semantic_version_id, backfill_run_id, provenance
) VALUES (
  '9f8fd9c6-4fb9-5752-891e-2c290c89614a',
  '2be70ccd-adb0-5a83-8adf-f26d571044e3',
  'rps_part',
  '77ee8029-e215-46e6-beb2-859cd9dea881',
  627,
  'parts_list',
  NULL,
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY['component.steering_reservoir']::text[],
  NULL,
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","group_code":"PBB","group_name":"POWER STEERING RESERVOIR AND PIPING","page_type_reason":"structured RPS parts record"}'::jsonb
)
ON CONFLICT (semantic_version_id, source_type, source_record_id) DO UPDATE SET
  page_type = EXCLUDED.page_type,
  content_hash = EXCLUDED.content_hash,
  model_tags = EXCLUDED.model_tags,
  component_tags = EXCLUDED.component_tags,
  provenance = EXCLUDED.provenance,
  updated_at = now();
INSERT INTO public.barry_evidence_units (
  id, document_id, source_type, source_record_id, physical_pdf_page, page_type,
  content_hash, system_tags, model_tags, component_tags, extraction_quality,
  semantic_version_id, backfill_run_id, provenance
) VALUES (
  '30ddce64-23fe-5e7a-8e64-362afb2e201f',
  '2be70ccd-adb0-5a83-8adf-f26d571044e3',
  'rps_part',
  '7821d9f5-5630-4e2a-92fb-158732c96180',
  627,
  'parts_list',
  NULL,
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY['component.steering_reservoir']::text[],
  NULL,
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","group_code":"PBB","group_name":"POWER STEERING RESERVOIR AND PIPING","page_type_reason":"structured RPS parts record"}'::jsonb
)
ON CONFLICT (semantic_version_id, source_type, source_record_id) DO UPDATE SET
  page_type = EXCLUDED.page_type,
  content_hash = EXCLUDED.content_hash,
  model_tags = EXCLUDED.model_tags,
  component_tags = EXCLUDED.component_tags,
  provenance = EXCLUDED.provenance,
  updated_at = now();
INSERT INTO public.barry_evidence_units (
  id, document_id, source_type, source_record_id, physical_pdf_page, page_type,
  content_hash, system_tags, model_tags, component_tags, extraction_quality,
  semantic_version_id, backfill_run_id, provenance
) VALUES (
  '1dd1525f-7711-5daa-893e-44f2a2197672',
  '2be70ccd-adb0-5a83-8adf-f26d571044e3',
  'rps_part',
  '79291067-89c1-439b-a580-90d9339d45b0',
  619,
  'parts_list',
  NULL,
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY['component.power_steering_pump']::text[],
  NULL,
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","group_code":"PBA","group_name":"POWER STEERING PUMP AND DRIVE","page_type_reason":"structured RPS parts record"}'::jsonb
)
ON CONFLICT (semantic_version_id, source_type, source_record_id) DO UPDATE SET
  page_type = EXCLUDED.page_type,
  content_hash = EXCLUDED.content_hash,
  model_tags = EXCLUDED.model_tags,
  component_tags = EXCLUDED.component_tags,
  provenance = EXCLUDED.provenance,
  updated_at = now();
INSERT INTO public.barry_evidence_units (
  id, document_id, source_type, source_record_id, physical_pdf_page, page_type,
  content_hash, system_tags, model_tags, component_tags, extraction_quality,
  semantic_version_id, backfill_run_id, provenance
) VALUES (
  '76c188a3-e825-572e-8ce6-0d14c247e4bf',
  '2be70ccd-adb0-5a83-8adf-f26d571044e3',
  'rps_part',
  '81fa1b51-77e1-4595-b4ea-13432599631d',
  619,
  'parts_list',
  NULL,
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY['component.power_steering_pump']::text[],
  NULL,
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","group_code":"PBA","group_name":"POWER STEERING PUMP AND DRIVE","page_type_reason":"structured RPS parts record"}'::jsonb
)
ON CONFLICT (semantic_version_id, source_type, source_record_id) DO UPDATE SET
  page_type = EXCLUDED.page_type,
  content_hash = EXCLUDED.content_hash,
  model_tags = EXCLUDED.model_tags,
  component_tags = EXCLUDED.component_tags,
  provenance = EXCLUDED.provenance,
  updated_at = now();
INSERT INTO public.barry_evidence_units (
  id, document_id, source_type, source_record_id, physical_pdf_page, page_type,
  content_hash, system_tags, model_tags, component_tags, extraction_quality,
  semantic_version_id, backfill_run_id, provenance
) VALUES (
  'bd73c005-9963-5928-8e40-a03df6e35133',
  '2be70ccd-adb0-5a83-8adf-f26d571044e3',
  'rps_part',
  '82fb47b7-205e-4b43-a153-187a89abadf7',
  623,
  'parts_list',
  NULL,
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY['component.steering_reservoir']::text[],
  NULL,
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","group_code":"PBB","group_name":"POWER STEERING RESERVOIR AND PIPING","page_type_reason":"structured RPS parts record"}'::jsonb
)
ON CONFLICT (semantic_version_id, source_type, source_record_id) DO UPDATE SET
  page_type = EXCLUDED.page_type,
  content_hash = EXCLUDED.content_hash,
  model_tags = EXCLUDED.model_tags,
  component_tags = EXCLUDED.component_tags,
  provenance = EXCLUDED.provenance,
  updated_at = now();
INSERT INTO public.barry_evidence_units (
  id, document_id, source_type, source_record_id, physical_pdf_page, page_type,
  content_hash, system_tags, model_tags, component_tags, extraction_quality,
  semantic_version_id, backfill_run_id, provenance
) VALUES (
  'fabf387e-fb8d-5141-84ef-6d576cb78f55',
  '2be70ccd-adb0-5a83-8adf-f26d571044e3',
  'rps_part',
  '84b360a9-c7ac-4e57-91a5-e9c71c57792e',
  611,
  'parts_list',
  NULL,
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY['component.steering_gear']::text[],
  NULL,
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","group_code":"PB","group_name":"STEERING BOX ASSEMBLY","page_type_reason":"structured RPS parts record"}'::jsonb
)
ON CONFLICT (semantic_version_id, source_type, source_record_id) DO UPDATE SET
  page_type = EXCLUDED.page_type,
  content_hash = EXCLUDED.content_hash,
  model_tags = EXCLUDED.model_tags,
  component_tags = EXCLUDED.component_tags,
  provenance = EXCLUDED.provenance,
  updated_at = now();
INSERT INTO public.barry_evidence_units (
  id, document_id, source_type, source_record_id, physical_pdf_page, page_type,
  content_hash, system_tags, model_tags, component_tags, extraction_quality,
  semantic_version_id, backfill_run_id, provenance
) VALUES (
  '29fadce4-cfb5-5d67-87f5-9c88c4d32acd',
  '2be70ccd-adb0-5a83-8adf-f26d571044e3',
  'rps_part',
  '84e64034-565b-41dd-b735-12ef07e5b45b',
  595,
  'parts_list',
  NULL,
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY[]::text[],
  NULL,
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","group_code":"PA","group_name":"STEERING WHEEL, COLUMN DRIVE SHAFTS AND DRAG LINK","page_type_reason":"structured RPS parts record"}'::jsonb
)
ON CONFLICT (semantic_version_id, source_type, source_record_id) DO UPDATE SET
  page_type = EXCLUDED.page_type,
  content_hash = EXCLUDED.content_hash,
  model_tags = EXCLUDED.model_tags,
  component_tags = EXCLUDED.component_tags,
  provenance = EXCLUDED.provenance,
  updated_at = now();
INSERT INTO public.barry_evidence_units (
  id, document_id, source_type, source_record_id, physical_pdf_page, page_type,
  content_hash, system_tags, model_tags, component_tags, extraction_quality,
  semantic_version_id, backfill_run_id, provenance
) VALUES (
  'defca7d9-eac0-53fb-8e8a-a524957d853a',
  '2be70ccd-adb0-5a83-8adf-f26d571044e3',
  'rps_part',
  '86ebf58e-2885-43a8-aaae-9f43e5abff4f',
  605,
  'parts_list',
  NULL,
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY['component.steering_gear']::text[],
  NULL,
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","group_code":"PB","group_name":"STEERING BOX ASSEMBLY","page_type_reason":"structured RPS parts record"}'::jsonb
)
ON CONFLICT (semantic_version_id, source_type, source_record_id) DO UPDATE SET
  page_type = EXCLUDED.page_type,
  content_hash = EXCLUDED.content_hash,
  model_tags = EXCLUDED.model_tags,
  component_tags = EXCLUDED.component_tags,
  provenance = EXCLUDED.provenance,
  updated_at = now();
INSERT INTO public.barry_evidence_units (
  id, document_id, source_type, source_record_id, physical_pdf_page, page_type,
  content_hash, system_tags, model_tags, component_tags, extraction_quality,
  semantic_version_id, backfill_run_id, provenance
) VALUES (
  'fa4a3dd0-7b25-59a0-849e-4ef1f62de2a1',
  '2be70ccd-adb0-5a83-8adf-f26d571044e3',
  'rps_part',
  '88f5dac1-7b67-4b5e-8571-57d459107d17',
  617,
  'parts_list',
  NULL,
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY['component.power_steering_pump']::text[],
  NULL,
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","group_code":"PBA","group_name":"POWER STEERING PUMP AND DRIVE","page_type_reason":"structured RPS parts record"}'::jsonb
)
ON CONFLICT (semantic_version_id, source_type, source_record_id) DO UPDATE SET
  page_type = EXCLUDED.page_type,
  content_hash = EXCLUDED.content_hash,
  model_tags = EXCLUDED.model_tags,
  component_tags = EXCLUDED.component_tags,
  provenance = EXCLUDED.provenance,
  updated_at = now();
INSERT INTO public.barry_evidence_units (
  id, document_id, source_type, source_record_id, physical_pdf_page, page_type,
  content_hash, system_tags, model_tags, component_tags, extraction_quality,
  semantic_version_id, backfill_run_id, provenance
) VALUES (
  '3eacd621-ddc3-53a5-8ca2-17a1d4ef3ea8',
  '2be70ccd-adb0-5a83-8adf-f26d571044e3',
  'rps_part',
  '89dda58d-ce2e-445c-a79b-25b6e004eff5',
  617,
  'parts_list',
  NULL,
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY['component.power_steering_pump']::text[],
  NULL,
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","group_code":"PBA","group_name":"POWER STEERING PUMP AND DRIVE","page_type_reason":"structured RPS parts record"}'::jsonb
)
ON CONFLICT (semantic_version_id, source_type, source_record_id) DO UPDATE SET
  page_type = EXCLUDED.page_type,
  content_hash = EXCLUDED.content_hash,
  model_tags = EXCLUDED.model_tags,
  component_tags = EXCLUDED.component_tags,
  provenance = EXCLUDED.provenance,
  updated_at = now();
INSERT INTO public.barry_evidence_units (
  id, document_id, source_type, source_record_id, physical_pdf_page, page_type,
  content_hash, system_tags, model_tags, component_tags, extraction_quality,
  semantic_version_id, backfill_run_id, provenance
) VALUES (
  '55c58428-a3e8-565e-8e6c-c220257f7b75',
  '2be70ccd-adb0-5a83-8adf-f26d571044e3',
  'rps_part',
  '8a55f9dd-4dff-450d-81e9-093f74005120',
  623,
  'parts_list',
  NULL,
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY['component.steering_reservoir']::text[],
  NULL,
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","group_code":"PBB","group_name":"POWER STEERING RESERVOIR AND PIPING","page_type_reason":"structured RPS parts record"}'::jsonb
)
ON CONFLICT (semantic_version_id, source_type, source_record_id) DO UPDATE SET
  page_type = EXCLUDED.page_type,
  content_hash = EXCLUDED.content_hash,
  model_tags = EXCLUDED.model_tags,
  component_tags = EXCLUDED.component_tags,
  provenance = EXCLUDED.provenance,
  updated_at = now();
INSERT INTO public.barry_evidence_units (
  id, document_id, source_type, source_record_id, physical_pdf_page, page_type,
  content_hash, system_tags, model_tags, component_tags, extraction_quality,
  semantic_version_id, backfill_run_id, provenance
) VALUES (
  '5a499e01-9529-5491-802a-3e33c4fa2156',
  '2be70ccd-adb0-5a83-8adf-f26d571044e3',
  'rps_part',
  '8b6844ec-3f90-42da-99f9-853ffad96f5e',
  627,
  'parts_list',
  NULL,
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY['component.steering_reservoir']::text[],
  NULL,
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","group_code":"PBB","group_name":"POWER STEERING RESERVOIR AND PIPING","page_type_reason":"structured RPS parts record"}'::jsonb
)
ON CONFLICT (semantic_version_id, source_type, source_record_id) DO UPDATE SET
  page_type = EXCLUDED.page_type,
  content_hash = EXCLUDED.content_hash,
  model_tags = EXCLUDED.model_tags,
  component_tags = EXCLUDED.component_tags,
  provenance = EXCLUDED.provenance,
  updated_at = now();
INSERT INTO public.barry_evidence_units (
  id, document_id, source_type, source_record_id, physical_pdf_page, page_type,
  content_hash, system_tags, model_tags, component_tags, extraction_quality,
  semantic_version_id, backfill_run_id, provenance
) VALUES (
  'df0507b8-0420-5b80-8560-c215d5dccb18',
  '2be70ccd-adb0-5a83-8adf-f26d571044e3',
  'rps_part',
  '8b840563-17c5-48f1-a7f7-95edb51cd5f9',
  625,
  'parts_list',
  NULL,
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY['component.steering_reservoir']::text[],
  NULL,
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","group_code":"PBB","group_name":"POWER STEERING RESERVOIR AND PIPING","page_type_reason":"structured RPS parts record"}'::jsonb
)
ON CONFLICT (semantic_version_id, source_type, source_record_id) DO UPDATE SET
  page_type = EXCLUDED.page_type,
  content_hash = EXCLUDED.content_hash,
  model_tags = EXCLUDED.model_tags,
  component_tags = EXCLUDED.component_tags,
  provenance = EXCLUDED.provenance,
  updated_at = now();
INSERT INTO public.barry_evidence_units (
  id, document_id, source_type, source_record_id, physical_pdf_page, page_type,
  content_hash, system_tags, model_tags, component_tags, extraction_quality,
  semantic_version_id, backfill_run_id, provenance
) VALUES (
  '6c09782a-cb0e-5adc-8608-a9a058a62adf',
  '2be70ccd-adb0-5a83-8adf-f26d571044e3',
  'rps_part',
  '90c2b1f6-0595-4747-8402-65dcd1b06002',
  609,
  'parts_list',
  NULL,
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY['component.steering_gear']::text[],
  NULL,
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","group_code":"PB","group_name":"STEERING BOX ASSEMBLY","page_type_reason":"structured RPS parts record"}'::jsonb
)
ON CONFLICT (semantic_version_id, source_type, source_record_id) DO UPDATE SET
  page_type = EXCLUDED.page_type,
  content_hash = EXCLUDED.content_hash,
  model_tags = EXCLUDED.model_tags,
  component_tags = EXCLUDED.component_tags,
  provenance = EXCLUDED.provenance,
  updated_at = now();
INSERT INTO public.barry_evidence_units (
  id, document_id, source_type, source_record_id, physical_pdf_page, page_type,
  content_hash, system_tags, model_tags, component_tags, extraction_quality,
  semantic_version_id, backfill_run_id, provenance
) VALUES (
  '0bda3bcc-27cf-5079-8d43-9b14f78ce446',
  '2be70ccd-adb0-5a83-8adf-f26d571044e3',
  'rps_part',
  '920dbfe1-742c-489a-9ccb-790021376ff5',
  617,
  'parts_list',
  NULL,
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY['component.power_steering_pump']::text[],
  NULL,
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","group_code":"PBA","group_name":"POWER STEERING PUMP AND DRIVE","page_type_reason":"structured RPS parts record"}'::jsonb
)
ON CONFLICT (semantic_version_id, source_type, source_record_id) DO UPDATE SET
  page_type = EXCLUDED.page_type,
  content_hash = EXCLUDED.content_hash,
  model_tags = EXCLUDED.model_tags,
  component_tags = EXCLUDED.component_tags,
  provenance = EXCLUDED.provenance,
  updated_at = now();
INSERT INTO public.barry_evidence_units (
  id, document_id, source_type, source_record_id, physical_pdf_page, page_type,
  content_hash, system_tags, model_tags, component_tags, extraction_quality,
  semantic_version_id, backfill_run_id, provenance
) VALUES (
  '6f5a2308-7bc9-5816-89d0-753f9ae73f13',
  '2be70ccd-adb0-5a83-8adf-f26d571044e3',
  'rps_part',
  '93711b8c-d769-4690-a751-81d4a383dc8c',
  599,
  'parts_list',
  NULL,
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY[]::text[],
  NULL,
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","group_code":"PA","group_name":"STEERING WHEEL, COLUMN DRIVE SHAFTS AND DRAG LINK","page_type_reason":"structured RPS parts record"}'::jsonb
)
ON CONFLICT (semantic_version_id, source_type, source_record_id) DO UPDATE SET
  page_type = EXCLUDED.page_type,
  content_hash = EXCLUDED.content_hash,
  model_tags = EXCLUDED.model_tags,
  component_tags = EXCLUDED.component_tags,
  provenance = EXCLUDED.provenance,
  updated_at = now();
INSERT INTO public.barry_evidence_units (
  id, document_id, source_type, source_record_id, physical_pdf_page, page_type,
  content_hash, system_tags, model_tags, component_tags, extraction_quality,
  semantic_version_id, backfill_run_id, provenance
) VALUES (
  '915ae417-382d-5747-81b2-575404a3ab9d',
  '2be70ccd-adb0-5a83-8adf-f26d571044e3',
  'rps_part',
  '940b9d7a-d197-48ce-91e6-ae8a70668b5d',
  607,
  'parts_list',
  NULL,
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY['component.steering_gear']::text[],
  NULL,
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","group_code":"PB","group_name":"STEERING BOX ASSEMBLY","page_type_reason":"structured RPS parts record"}'::jsonb
)
ON CONFLICT (semantic_version_id, source_type, source_record_id) DO UPDATE SET
  page_type = EXCLUDED.page_type,
  content_hash = EXCLUDED.content_hash,
  model_tags = EXCLUDED.model_tags,
  component_tags = EXCLUDED.component_tags,
  provenance = EXCLUDED.provenance,
  updated_at = now();
INSERT INTO public.barry_evidence_units (
  id, document_id, source_type, source_record_id, physical_pdf_page, page_type,
  content_hash, system_tags, model_tags, component_tags, extraction_quality,
  semantic_version_id, backfill_run_id, provenance
) VALUES (
  '06157d22-b8bc-596b-86dc-f2992bdba241',
  '2be70ccd-adb0-5a83-8adf-f26d571044e3',
  'rps_part',
  '944817a4-0ca2-4015-98c2-a3f6327b3f03',
  617,
  'parts_list',
  NULL,
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY['component.power_steering_pump']::text[],
  NULL,
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","group_code":"PBA","group_name":"POWER STEERING PUMP AND DRIVE","page_type_reason":"structured RPS parts record"}'::jsonb
)
ON CONFLICT (semantic_version_id, source_type, source_record_id) DO UPDATE SET
  page_type = EXCLUDED.page_type,
  content_hash = EXCLUDED.content_hash,
  model_tags = EXCLUDED.model_tags,
  component_tags = EXCLUDED.component_tags,
  provenance = EXCLUDED.provenance,
  updated_at = now();
INSERT INTO public.barry_evidence_units (
  id, document_id, source_type, source_record_id, physical_pdf_page, page_type,
  content_hash, system_tags, model_tags, component_tags, extraction_quality,
  semantic_version_id, backfill_run_id, provenance
) VALUES (
  '16f750e3-270a-58c6-8111-030ab3b79bbd',
  '2be70ccd-adb0-5a83-8adf-f26d571044e3',
  'rps_part',
  '95362a24-9a4b-4ada-a48e-6f073424c0df',
  617,
  'parts_list',
  NULL,
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY['component.power_steering_pump']::text[],
  NULL,
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","group_code":"PBA","group_name":"POWER STEERING PUMP AND DRIVE","page_type_reason":"structured RPS parts record"}'::jsonb
)
ON CONFLICT (semantic_version_id, source_type, source_record_id) DO UPDATE SET
  page_type = EXCLUDED.page_type,
  content_hash = EXCLUDED.content_hash,
  model_tags = EXCLUDED.model_tags,
  component_tags = EXCLUDED.component_tags,
  provenance = EXCLUDED.provenance,
  updated_at = now();
INSERT INTO public.barry_evidence_units (
  id, document_id, source_type, source_record_id, physical_pdf_page, page_type,
  content_hash, system_tags, model_tags, component_tags, extraction_quality,
  semantic_version_id, backfill_run_id, provenance
) VALUES (
  '74d8e7ee-8c40-5419-8aa0-01db772024d9',
  '2be70ccd-adb0-5a83-8adf-f26d571044e3',
  'rps_part',
  '96130aad-e50f-4942-9c3d-45fa2338c7db',
  595,
  'parts_list',
  NULL,
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY[]::text[],
  NULL,
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","group_code":"PA","group_name":"STEERING WHEEL, COLUMN DRIVE SHAFTS AND DRAG LINK","page_type_reason":"structured RPS parts record"}'::jsonb
)
ON CONFLICT (semantic_version_id, source_type, source_record_id) DO UPDATE SET
  page_type = EXCLUDED.page_type,
  content_hash = EXCLUDED.content_hash,
  model_tags = EXCLUDED.model_tags,
  component_tags = EXCLUDED.component_tags,
  provenance = EXCLUDED.provenance,
  updated_at = now();
INSERT INTO public.barry_evidence_units (
  id, document_id, source_type, source_record_id, physical_pdf_page, page_type,
  content_hash, system_tags, model_tags, component_tags, extraction_quality,
  semantic_version_id, backfill_run_id, provenance
) VALUES (
  '76e10893-7703-5663-842e-81373c71b778',
  '2be70ccd-adb0-5a83-8adf-f26d571044e3',
  'rps_part',
  '967fa4ae-d4f8-4245-b25e-d44800e35502',
  627,
  'parts_list',
  NULL,
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY['component.steering_reservoir']::text[],
  NULL,
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","group_code":"PBB","group_name":"POWER STEERING RESERVOIR AND PIPING","page_type_reason":"structured RPS parts record"}'::jsonb
)
ON CONFLICT (semantic_version_id, source_type, source_record_id) DO UPDATE SET
  page_type = EXCLUDED.page_type,
  content_hash = EXCLUDED.content_hash,
  model_tags = EXCLUDED.model_tags,
  component_tags = EXCLUDED.component_tags,
  provenance = EXCLUDED.provenance,
  updated_at = now();
INSERT INTO public.barry_evidence_units (
  id, document_id, source_type, source_record_id, physical_pdf_page, page_type,
  content_hash, system_tags, model_tags, component_tags, extraction_quality,
  semantic_version_id, backfill_run_id, provenance
) VALUES (
  'ae8a18ee-d217-571b-8aee-da670da9b85b',
  '2be70ccd-adb0-5a83-8adf-f26d571044e3',
  'rps_part',
  '991b3598-376a-498c-99a5-5ef56441264a',
  597,
  'parts_list',
  NULL,
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY[]::text[],
  NULL,
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","group_code":"PA","group_name":"STEERING WHEEL, COLUMN DRIVE SHAFTS AND DRAG LINK","page_type_reason":"structured RPS parts record"}'::jsonb
)
ON CONFLICT (semantic_version_id, source_type, source_record_id) DO UPDATE SET
  page_type = EXCLUDED.page_type,
  content_hash = EXCLUDED.content_hash,
  model_tags = EXCLUDED.model_tags,
  component_tags = EXCLUDED.component_tags,
  provenance = EXCLUDED.provenance,
  updated_at = now();
INSERT INTO public.barry_evidence_units (
  id, document_id, source_type, source_record_id, physical_pdf_page, page_type,
  content_hash, system_tags, model_tags, component_tags, extraction_quality,
  semantic_version_id, backfill_run_id, provenance
) VALUES (
  'd1044a2f-51c1-5373-8bd4-5affcb01a9c1',
  '2be70ccd-adb0-5a83-8adf-f26d571044e3',
  'rps_part',
  '997914a3-bbbf-4640-af43-a30fb1d6b7ff',
  611,
  'parts_list',
  NULL,
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY['component.steering_gear']::text[],
  NULL,
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","group_code":"PB","group_name":"STEERING BOX ASSEMBLY","page_type_reason":"structured RPS parts record"}'::jsonb
)
ON CONFLICT (semantic_version_id, source_type, source_record_id) DO UPDATE SET
  page_type = EXCLUDED.page_type,
  content_hash = EXCLUDED.content_hash,
  model_tags = EXCLUDED.model_tags,
  component_tags = EXCLUDED.component_tags,
  provenance = EXCLUDED.provenance,
  updated_at = now();
INSERT INTO public.barry_evidence_units (
  id, document_id, source_type, source_record_id, physical_pdf_page, page_type,
  content_hash, system_tags, model_tags, component_tags, extraction_quality,
  semantic_version_id, backfill_run_id, provenance
) VALUES (
  '774bf22a-64a5-5140-85f1-70df927103fb',
  '2be70ccd-adb0-5a83-8adf-f26d571044e3',
  'rps_part',
  '99aa7473-fcb6-4c37-874c-7efa1e0d8e0a',
  605,
  'parts_list',
  NULL,
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY['component.steering_gear']::text[],
  NULL,
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","group_code":"PB","group_name":"STEERING BOX ASSEMBLY","page_type_reason":"structured RPS parts record"}'::jsonb
)
ON CONFLICT (semantic_version_id, source_type, source_record_id) DO UPDATE SET
  page_type = EXCLUDED.page_type,
  content_hash = EXCLUDED.content_hash,
  model_tags = EXCLUDED.model_tags,
  component_tags = EXCLUDED.component_tags,
  provenance = EXCLUDED.provenance,
  updated_at = now();
INSERT INTO public.barry_evidence_units (
  id, document_id, source_type, source_record_id, physical_pdf_page, page_type,
  content_hash, system_tags, model_tags, component_tags, extraction_quality,
  semantic_version_id, backfill_run_id, provenance
) VALUES (
  'a334c615-8c83-5eaa-8b9a-970923809403',
  '2be70ccd-adb0-5a83-8adf-f26d571044e3',
  'rps_part',
  '9a0ec0d0-bb15-4f62-b143-caf6b9737cc5',
  623,
  'parts_list',
  NULL,
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY['component.steering_reservoir']::text[],
  NULL,
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","group_code":"PBB","group_name":"POWER STEERING RESERVOIR AND PIPING","page_type_reason":"structured RPS parts record"}'::jsonb
)
ON CONFLICT (semantic_version_id, source_type, source_record_id) DO UPDATE SET
  page_type = EXCLUDED.page_type,
  content_hash = EXCLUDED.content_hash,
  model_tags = EXCLUDED.model_tags,
  component_tags = EXCLUDED.component_tags,
  provenance = EXCLUDED.provenance,
  updated_at = now();
INSERT INTO public.barry_evidence_units (
  id, document_id, source_type, source_record_id, physical_pdf_page, page_type,
  content_hash, system_tags, model_tags, component_tags, extraction_quality,
  semantic_version_id, backfill_run_id, provenance
) VALUES (
  '609e0d83-e117-56eb-8f1b-2a6b86fb2e1c',
  '2be70ccd-adb0-5a83-8adf-f26d571044e3',
  'rps_part',
  '9a96d30d-0dc5-400b-9a12-05c42437c561',
  625,
  'parts_list',
  NULL,
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY['component.steering_reservoir']::text[],
  NULL,
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","group_code":"PBB","group_name":"POWER STEERING RESERVOIR AND PIPING","page_type_reason":"structured RPS parts record"}'::jsonb
)
ON CONFLICT (semantic_version_id, source_type, source_record_id) DO UPDATE SET
  page_type = EXCLUDED.page_type,
  content_hash = EXCLUDED.content_hash,
  model_tags = EXCLUDED.model_tags,
  component_tags = EXCLUDED.component_tags,
  provenance = EXCLUDED.provenance,
  updated_at = now();
INSERT INTO public.barry_evidence_units (
  id, document_id, source_type, source_record_id, physical_pdf_page, page_type,
  content_hash, system_tags, model_tags, component_tags, extraction_quality,
  semantic_version_id, backfill_run_id, provenance
) VALUES (
  '91272aff-ce87-55fa-8d87-4584bcfdb646',
  '2be70ccd-adb0-5a83-8adf-f26d571044e3',
  'rps_part',
  '9afb752c-2f7f-43f8-83ea-ebf3af607096',
  623,
  'parts_list',
  NULL,
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY['component.steering_reservoir']::text[],
  NULL,
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","group_code":"PBB","group_name":"POWER STEERING RESERVOIR AND PIPING","page_type_reason":"structured RPS parts record"}'::jsonb
)
ON CONFLICT (semantic_version_id, source_type, source_record_id) DO UPDATE SET
  page_type = EXCLUDED.page_type,
  content_hash = EXCLUDED.content_hash,
  model_tags = EXCLUDED.model_tags,
  component_tags = EXCLUDED.component_tags,
  provenance = EXCLUDED.provenance,
  updated_at = now();
INSERT INTO public.barry_evidence_units (
  id, document_id, source_type, source_record_id, physical_pdf_page, page_type,
  content_hash, system_tags, model_tags, component_tags, extraction_quality,
  semantic_version_id, backfill_run_id, provenance
) VALUES (
  '9b83657e-53be-5ef3-84f1-57b882c227aa',
  '2be70ccd-adb0-5a83-8adf-f26d571044e3',
  'rps_part',
  '9bb227b6-3026-4ead-be42-268e36185321',
  607,
  'parts_list',
  NULL,
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY['component.steering_gear']::text[],
  NULL,
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","group_code":"PB","group_name":"STEERING BOX ASSEMBLY","page_type_reason":"structured RPS parts record"}'::jsonb
)
ON CONFLICT (semantic_version_id, source_type, source_record_id) DO UPDATE SET
  page_type = EXCLUDED.page_type,
  content_hash = EXCLUDED.content_hash,
  model_tags = EXCLUDED.model_tags,
  component_tags = EXCLUDED.component_tags,
  provenance = EXCLUDED.provenance,
  updated_at = now();
INSERT INTO public.barry_evidence_units (
  id, document_id, source_type, source_record_id, physical_pdf_page, page_type,
  content_hash, system_tags, model_tags, component_tags, extraction_quality,
  semantic_version_id, backfill_run_id, provenance
) VALUES (
  'f97b79e7-d7d4-5fc4-8c43-0f08521bf761',
  '2be70ccd-adb0-5a83-8adf-f26d571044e3',
  'rps_part',
  '9c0d396e-08e7-418f-87e2-7fdc64994d07',
  607,
  'parts_list',
  NULL,
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY['component.steering_gear']::text[],
  NULL,
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","group_code":"PB","group_name":"STEERING BOX ASSEMBLY","page_type_reason":"structured RPS parts record"}'::jsonb
)
ON CONFLICT (semantic_version_id, source_type, source_record_id) DO UPDATE SET
  page_type = EXCLUDED.page_type,
  content_hash = EXCLUDED.content_hash,
  model_tags = EXCLUDED.model_tags,
  component_tags = EXCLUDED.component_tags,
  provenance = EXCLUDED.provenance,
  updated_at = now();
INSERT INTO public.barry_evidence_units (
  id, document_id, source_type, source_record_id, physical_pdf_page, page_type,
  content_hash, system_tags, model_tags, component_tags, extraction_quality,
  semantic_version_id, backfill_run_id, provenance
) VALUES (
  '96d9777f-ca7e-5193-8b7d-2001c3da938a',
  '2be70ccd-adb0-5a83-8adf-f26d571044e3',
  'rps_part',
  '9c5cc3be-8c29-4b56-a439-d8e41e78a62e',
  611,
  'parts_list',
  NULL,
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY['component.steering_gear']::text[],
  NULL,
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","group_code":"PB","group_name":"STEERING BOX ASSEMBLY","page_type_reason":"structured RPS parts record"}'::jsonb
)
ON CONFLICT (semantic_version_id, source_type, source_record_id) DO UPDATE SET
  page_type = EXCLUDED.page_type,
  content_hash = EXCLUDED.content_hash,
  model_tags = EXCLUDED.model_tags,
  component_tags = EXCLUDED.component_tags,
  provenance = EXCLUDED.provenance,
  updated_at = now();
INSERT INTO public.barry_evidence_units (
  id, document_id, source_type, source_record_id, physical_pdf_page, page_type,
  content_hash, system_tags, model_tags, component_tags, extraction_quality,
  semantic_version_id, backfill_run_id, provenance
) VALUES (
  '9ff0d9d8-6445-5efc-8cf6-deb131c219a0',
  '2be70ccd-adb0-5a83-8adf-f26d571044e3',
  'rps_part',
  '9f7e8aec-ca05-4fc4-a225-5ae009b6ba56',
  597,
  'parts_list',
  NULL,
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY[]::text[],
  NULL,
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","group_code":"PA","group_name":"STEERING WHEEL, COLUMN DRIVE SHAFTS AND DRAG LINK","page_type_reason":"structured RPS parts record"}'::jsonb
)
ON CONFLICT (semantic_version_id, source_type, source_record_id) DO UPDATE SET
  page_type = EXCLUDED.page_type,
  content_hash = EXCLUDED.content_hash,
  model_tags = EXCLUDED.model_tags,
  component_tags = EXCLUDED.component_tags,
  provenance = EXCLUDED.provenance,
  updated_at = now();
INSERT INTO public.barry_evidence_units (
  id, document_id, source_type, source_record_id, physical_pdf_page, page_type,
  content_hash, system_tags, model_tags, component_tags, extraction_quality,
  semantic_version_id, backfill_run_id, provenance
) VALUES (
  'fe4a2058-aefb-5288-8ca8-38974ed29af8',
  '2be70ccd-adb0-5a83-8adf-f26d571044e3',
  'rps_part',
  'a276b062-60a4-4e7f-8160-41d721c698d9',
  623,
  'parts_list',
  NULL,
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY['component.steering_reservoir']::text[],
  NULL,
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","group_code":"PBB","group_name":"POWER STEERING RESERVOIR AND PIPING","page_type_reason":"structured RPS parts record"}'::jsonb
)
ON CONFLICT (semantic_version_id, source_type, source_record_id) DO UPDATE SET
  page_type = EXCLUDED.page_type,
  content_hash = EXCLUDED.content_hash,
  model_tags = EXCLUDED.model_tags,
  component_tags = EXCLUDED.component_tags,
  provenance = EXCLUDED.provenance,
  updated_at = now();
INSERT INTO public.barry_evidence_units (
  id, document_id, source_type, source_record_id, physical_pdf_page, page_type,
  content_hash, system_tags, model_tags, component_tags, extraction_quality,
  semantic_version_id, backfill_run_id, provenance
) VALUES (
  'cf48199f-4cca-514a-819c-140b4a24c76a',
  '2be70ccd-adb0-5a83-8adf-f26d571044e3',
  'rps_part',
  'a29b830b-33a8-4e9f-95e9-df9265ec0d5e',
  625,
  'parts_list',
  NULL,
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY['component.steering_reservoir']::text[],
  NULL,
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","group_code":"PBB","group_name":"POWER STEERING RESERVOIR AND PIPING","page_type_reason":"structured RPS parts record"}'::jsonb
)
ON CONFLICT (semantic_version_id, source_type, source_record_id) DO UPDATE SET
  page_type = EXCLUDED.page_type,
  content_hash = EXCLUDED.content_hash,
  model_tags = EXCLUDED.model_tags,
  component_tags = EXCLUDED.component_tags,
  provenance = EXCLUDED.provenance,
  updated_at = now();
INSERT INTO public.barry_evidence_units (
  id, document_id, source_type, source_record_id, physical_pdf_page, page_type,
  content_hash, system_tags, model_tags, component_tags, extraction_quality,
  semantic_version_id, backfill_run_id, provenance
) VALUES (
  '1e932548-f65b-5c28-83aa-ce2bbaca3c2d',
  '2be70ccd-adb0-5a83-8adf-f26d571044e3',
  'rps_part',
  'a6413f99-1c63-414d-858c-724baac4c57b',
  599,
  'parts_list',
  NULL,
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY[]::text[],
  NULL,
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","group_code":"PA","group_name":"STEERING WHEEL, COLUMN DRIVE SHAFTS AND DRAG LINK","page_type_reason":"structured RPS parts record"}'::jsonb
)
ON CONFLICT (semantic_version_id, source_type, source_record_id) DO UPDATE SET
  page_type = EXCLUDED.page_type,
  content_hash = EXCLUDED.content_hash,
  model_tags = EXCLUDED.model_tags,
  component_tags = EXCLUDED.component_tags,
  provenance = EXCLUDED.provenance,
  updated_at = now();
INSERT INTO public.barry_evidence_units (
  id, document_id, source_type, source_record_id, physical_pdf_page, page_type,
  content_hash, system_tags, model_tags, component_tags, extraction_quality,
  semantic_version_id, backfill_run_id, provenance
) VALUES (
  'aeedf9f6-fac8-5d30-89ac-d75d83283942',
  '2be70ccd-adb0-5a83-8adf-f26d571044e3',
  'rps_part',
  'a72b9390-d112-4901-8487-3d7a38e574ee',
  605,
  'parts_list',
  NULL,
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY['component.steering_gear']::text[],
  NULL,
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","group_code":"PB","group_name":"STEERING BOX ASSEMBLY","page_type_reason":"structured RPS parts record"}'::jsonb
)
ON CONFLICT (semantic_version_id, source_type, source_record_id) DO UPDATE SET
  page_type = EXCLUDED.page_type,
  content_hash = EXCLUDED.content_hash,
  model_tags = EXCLUDED.model_tags,
  component_tags = EXCLUDED.component_tags,
  provenance = EXCLUDED.provenance,
  updated_at = now();
INSERT INTO public.barry_evidence_units (
  id, document_id, source_type, source_record_id, physical_pdf_page, page_type,
  content_hash, system_tags, model_tags, component_tags, extraction_quality,
  semantic_version_id, backfill_run_id, provenance
) VALUES (
  'e6248bc7-3dac-5d20-87e5-8bab1f08ec56',
  '2be70ccd-adb0-5a83-8adf-f26d571044e3',
  'rps_part',
  'a910d6b7-4af9-461a-98f5-1a04fd9b2404',
  617,
  'parts_list',
  NULL,
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY['component.power_steering_pump']::text[],
  NULL,
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","group_code":"PBA","group_name":"POWER STEERING PUMP AND DRIVE","page_type_reason":"structured RPS parts record"}'::jsonb
)
ON CONFLICT (semantic_version_id, source_type, source_record_id) DO UPDATE SET
  page_type = EXCLUDED.page_type,
  content_hash = EXCLUDED.content_hash,
  model_tags = EXCLUDED.model_tags,
  component_tags = EXCLUDED.component_tags,
  provenance = EXCLUDED.provenance,
  updated_at = now();
INSERT INTO public.barry_evidence_units (
  id, document_id, source_type, source_record_id, physical_pdf_page, page_type,
  content_hash, system_tags, model_tags, component_tags, extraction_quality,
  semantic_version_id, backfill_run_id, provenance
) VALUES (
  '454fbbef-3497-58e4-873f-6b8a0cd159c9',
  '2be70ccd-adb0-5a83-8adf-f26d571044e3',
  'rps_part',
  'a913bde7-38a8-40b2-8ac7-908e1342d133',
  627,
  'parts_list',
  NULL,
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY['component.steering_reservoir']::text[],
  NULL,
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","group_code":"PBB","group_name":"POWER STEERING RESERVOIR AND PIPING","page_type_reason":"structured RPS parts record"}'::jsonb
)
ON CONFLICT (semantic_version_id, source_type, source_record_id) DO UPDATE SET
  page_type = EXCLUDED.page_type,
  content_hash = EXCLUDED.content_hash,
  model_tags = EXCLUDED.model_tags,
  component_tags = EXCLUDED.component_tags,
  provenance = EXCLUDED.provenance,
  updated_at = now();
INSERT INTO public.barry_evidence_units (
  id, document_id, source_type, source_record_id, physical_pdf_page, page_type,
  content_hash, system_tags, model_tags, component_tags, extraction_quality,
  semantic_version_id, backfill_run_id, provenance
) VALUES (
  'a2ca11e0-531d-5a96-8fd5-f15812a4ea3c',
  '2be70ccd-adb0-5a83-8adf-f26d571044e3',
  'rps_part',
  'a9aa5eb6-4f85-477e-91ea-9b8d250d994e',
  611,
  'parts_list',
  NULL,
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY['component.steering_gear']::text[],
  NULL,
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","group_code":"PB","group_name":"STEERING BOX ASSEMBLY","page_type_reason":"structured RPS parts record"}'::jsonb
)
ON CONFLICT (semantic_version_id, source_type, source_record_id) DO UPDATE SET
  page_type = EXCLUDED.page_type,
  content_hash = EXCLUDED.content_hash,
  model_tags = EXCLUDED.model_tags,
  component_tags = EXCLUDED.component_tags,
  provenance = EXCLUDED.provenance,
  updated_at = now();
INSERT INTO public.barry_evidence_units (
  id, document_id, source_type, source_record_id, physical_pdf_page, page_type,
  content_hash, system_tags, model_tags, component_tags, extraction_quality,
  semantic_version_id, backfill_run_id, provenance
) VALUES (
  '72da9931-58d7-5188-8039-36716d769b1c',
  '2be70ccd-adb0-5a83-8adf-f26d571044e3',
  'rps_part',
  'aa1ce5fa-248a-43b8-8775-577819c2e69e',
  609,
  'parts_list',
  NULL,
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY['component.steering_gear']::text[],
  NULL,
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","group_code":"PB","group_name":"STEERING BOX ASSEMBLY","page_type_reason":"structured RPS parts record"}'::jsonb
)
ON CONFLICT (semantic_version_id, source_type, source_record_id) DO UPDATE SET
  page_type = EXCLUDED.page_type,
  content_hash = EXCLUDED.content_hash,
  model_tags = EXCLUDED.model_tags,
  component_tags = EXCLUDED.component_tags,
  provenance = EXCLUDED.provenance,
  updated_at = now();
INSERT INTO public.barry_evidence_units (
  id, document_id, source_type, source_record_id, physical_pdf_page, page_type,
  content_hash, system_tags, model_tags, component_tags, extraction_quality,
  semantic_version_id, backfill_run_id, provenance
) VALUES (
  'fe5282a5-58eb-543c-815b-af6e60dd5127',
  '2be70ccd-adb0-5a83-8adf-f26d571044e3',
  'rps_part',
  'ab88cf6c-dfc2-4fa4-8351-284396fd24dd',
  625,
  'parts_list',
  NULL,
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY['component.steering_reservoir']::text[],
  NULL,
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","group_code":"PBB","group_name":"POWER STEERING RESERVOIR AND PIPING","page_type_reason":"structured RPS parts record"}'::jsonb
)
ON CONFLICT (semantic_version_id, source_type, source_record_id) DO UPDATE SET
  page_type = EXCLUDED.page_type,
  content_hash = EXCLUDED.content_hash,
  model_tags = EXCLUDED.model_tags,
  component_tags = EXCLUDED.component_tags,
  provenance = EXCLUDED.provenance,
  updated_at = now();
INSERT INTO public.barry_evidence_units (
  id, document_id, source_type, source_record_id, physical_pdf_page, page_type,
  content_hash, system_tags, model_tags, component_tags, extraction_quality,
  semantic_version_id, backfill_run_id, provenance
) VALUES (
  '79218820-cf52-59a3-8f9a-60e5408ecae2',
  '2be70ccd-adb0-5a83-8adf-f26d571044e3',
  'rps_part',
  'ac89d181-e4c3-43af-b394-adc038cef4ea',
  623,
  'parts_list',
  NULL,
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY['component.steering_reservoir']::text[],
  NULL,
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","group_code":"PBB","group_name":"POWER STEERING RESERVOIR AND PIPING","page_type_reason":"structured RPS parts record"}'::jsonb
)
ON CONFLICT (semantic_version_id, source_type, source_record_id) DO UPDATE SET
  page_type = EXCLUDED.page_type,
  content_hash = EXCLUDED.content_hash,
  model_tags = EXCLUDED.model_tags,
  component_tags = EXCLUDED.component_tags,
  provenance = EXCLUDED.provenance,
  updated_at = now();
INSERT INTO public.barry_evidence_units (
  id, document_id, source_type, source_record_id, physical_pdf_page, page_type,
  content_hash, system_tags, model_tags, component_tags, extraction_quality,
  semantic_version_id, backfill_run_id, provenance
) VALUES (
  '7ab6aec4-4df0-5225-83a6-47d3453a8645',
  '2be70ccd-adb0-5a83-8adf-f26d571044e3',
  'rps_part',
  'ad68972b-f775-493b-a07a-d5d36917cbfd',
  611,
  'parts_list',
  NULL,
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY['component.steering_gear']::text[],
  NULL,
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","group_code":"PB","group_name":"STEERING BOX ASSEMBLY","page_type_reason":"structured RPS parts record"}'::jsonb
)
ON CONFLICT (semantic_version_id, source_type, source_record_id) DO UPDATE SET
  page_type = EXCLUDED.page_type,
  content_hash = EXCLUDED.content_hash,
  model_tags = EXCLUDED.model_tags,
  component_tags = EXCLUDED.component_tags,
  provenance = EXCLUDED.provenance,
  updated_at = now();
INSERT INTO public.barry_evidence_units (
  id, document_id, source_type, source_record_id, physical_pdf_page, page_type,
  content_hash, system_tags, model_tags, component_tags, extraction_quality,
  semantic_version_id, backfill_run_id, provenance
) VALUES (
  '76bdab43-4c29-572b-84fb-6e02a7ca14de',
  '2be70ccd-adb0-5a83-8adf-f26d571044e3',
  'rps_part',
  'ae7572bf-1ff1-409b-89a5-1589ccbb9a97',
  605,
  'parts_list',
  NULL,
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY['component.steering_gear']::text[],
  NULL,
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","group_code":"PB","group_name":"STEERING BOX ASSEMBLY","page_type_reason":"structured RPS parts record"}'::jsonb
)
ON CONFLICT (semantic_version_id, source_type, source_record_id) DO UPDATE SET
  page_type = EXCLUDED.page_type,
  content_hash = EXCLUDED.content_hash,
  model_tags = EXCLUDED.model_tags,
  component_tags = EXCLUDED.component_tags,
  provenance = EXCLUDED.provenance,
  updated_at = now();
INSERT INTO public.barry_evidence_units (
  id, document_id, source_type, source_record_id, physical_pdf_page, page_type,
  content_hash, system_tags, model_tags, component_tags, extraction_quality,
  semantic_version_id, backfill_run_id, provenance
) VALUES (
  '16fc532d-540c-5cae-8ec2-cc0558545d9d',
  '2be70ccd-adb0-5a83-8adf-f26d571044e3',
  'rps_part',
  'b05a2284-489f-40df-8753-2df68495873c',
  595,
  'parts_list',
  NULL,
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY[]::text[],
  NULL,
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","group_code":"PA","group_name":"STEERING WHEEL, COLUMN DRIVE SHAFTS AND DRAG LINK","page_type_reason":"structured RPS parts record"}'::jsonb
)
ON CONFLICT (semantic_version_id, source_type, source_record_id) DO UPDATE SET
  page_type = EXCLUDED.page_type,
  content_hash = EXCLUDED.content_hash,
  model_tags = EXCLUDED.model_tags,
  component_tags = EXCLUDED.component_tags,
  provenance = EXCLUDED.provenance,
  updated_at = now();
INSERT INTO public.barry_evidence_units (
  id, document_id, source_type, source_record_id, physical_pdf_page, page_type,
  content_hash, system_tags, model_tags, component_tags, extraction_quality,
  semantic_version_id, backfill_run_id, provenance
) VALUES (
  'bdc5063a-e63a-57ab-8d8d-8c52da823d58',
  '2be70ccd-adb0-5a83-8adf-f26d571044e3',
  'rps_part',
  'b08fbf29-a6fd-4e0b-a127-3f8d3caf79fd',
  597,
  'parts_list',
  NULL,
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY[]::text[],
  NULL,
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","group_code":"PA","group_name":"STEERING WHEEL, COLUMN DRIVE SHAFTS AND DRAG LINK","page_type_reason":"structured RPS parts record"}'::jsonb
)
ON CONFLICT (semantic_version_id, source_type, source_record_id) DO UPDATE SET
  page_type = EXCLUDED.page_type,
  content_hash = EXCLUDED.content_hash,
  model_tags = EXCLUDED.model_tags,
  component_tags = EXCLUDED.component_tags,
  provenance = EXCLUDED.provenance,
  updated_at = now();
COMMIT;
