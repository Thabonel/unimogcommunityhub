BEGIN;

INSERT INTO public.barry_evidence_units (
  id, document_id, source_type, source_record_id, physical_pdf_page, page_type,
  content_hash, system_tags, model_tags, component_tags, extraction_quality,
  semantic_version_id, backfill_run_id, provenance
) VALUES (
  'c542035f-57cd-5b0c-83c0-7a7ef7bc5759',
  '2be70ccd-adb0-5a83-8adf-f26d571044e3',
  'rps_part',
  'b0ee78fa-0001-4106-a2d5-b93602f0e89e',
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
  '2beb82a5-5a94-5aa0-83d3-71108636ef19',
  '2be70ccd-adb0-5a83-8adf-f26d571044e3',
  'rps_part',
  'b1c2b6df-d5ad-40cf-b0e1-2a0f20cbea06',
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
  '3ff1a292-702f-5be0-857c-f7d58baa7bd4',
  '2be70ccd-adb0-5a83-8adf-f26d571044e3',
  'rps_part',
  'b3c8cc0f-21f8-46f8-a452-aa4045e1ed16',
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
  'e800ddc7-41ba-5ae1-8a0d-f27bd8fce37a',
  '2be70ccd-adb0-5a83-8adf-f26d571044e3',
  'rps_part',
  'b6547799-631d-4bbe-ae9f-9be554fb4968',
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
  '9d6426be-f3e8-5d80-8222-aa730c0370fb',
  '2be70ccd-adb0-5a83-8adf-f26d571044e3',
  'rps_part',
  'ba4ef937-1964-4d96-a4a5-c93e8d7df83e',
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
  'ffdfefc1-6daa-5d88-8145-a02dbd024e5e',
  '2be70ccd-adb0-5a83-8adf-f26d571044e3',
  'rps_part',
  'ba98fa1f-cc6c-4ec3-8b55-6a70db1005d5',
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
  '2a2bb554-7ec2-5ebe-8c45-bd1f77490bb8',
  '2be70ccd-adb0-5a83-8adf-f26d571044e3',
  'rps_part',
  'babe515f-9382-4bee-bb5e-ed2772fc79eb',
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
  '9decbb23-05e1-5952-8f32-83e43a99a874',
  '2be70ccd-adb0-5a83-8adf-f26d571044e3',
  'rps_part',
  'bad123d7-aca4-41f5-9962-effb789d77a1',
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
  'acaf6117-534d-5b40-8ab6-91fe33890031',
  '2be70ccd-adb0-5a83-8adf-f26d571044e3',
  'rps_part',
  'bb5eeb66-5f44-4fe4-a3e4-70064b6f45a7',
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
  '94ca1d70-9e3d-5b19-8ebc-9da540f0a8cb',
  '2be70ccd-adb0-5a83-8adf-f26d571044e3',
  'rps_part',
  'bdd48364-44e8-4d7f-a78d-6837bab8374e',
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
  'd3b18abc-ac82-58f0-8f44-66f2bfe9947e',
  '2be70ccd-adb0-5a83-8adf-f26d571044e3',
  'rps_part',
  'be03e693-eae1-4642-9c42-d672d2c7f927',
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
  '696ade0b-9089-59eb-87c7-4d43d5cac49b',
  '2be70ccd-adb0-5a83-8adf-f26d571044e3',
  'rps_part',
  'bee4dac8-7acc-4beb-9c4b-56fa2a68b4f5',
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
  'bd2e02f6-5bf4-5d75-8a74-001da026a4f9',
  '2be70ccd-adb0-5a83-8adf-f26d571044e3',
  'rps_part',
  'c3cbd053-8a14-4bde-8365-15b61921a080',
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
  'be9ad4ab-c875-5f56-8821-61aaf571b041',
  '2be70ccd-adb0-5a83-8adf-f26d571044e3',
  'rps_part',
  'c3d521a8-a5cd-4458-ade5-36da4df412e8',
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
  'aa52d86a-cf77-59b4-802d-e3919a1470ef',
  '2be70ccd-adb0-5a83-8adf-f26d571044e3',
  'rps_part',
  'c4c66026-8754-40ca-b92d-4e85c47170c9',
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
  'ee61cea0-37c5-5ddb-8ed8-3a4fc120d2a5',
  '2be70ccd-adb0-5a83-8adf-f26d571044e3',
  'rps_part',
  'c831d826-548e-4a69-9f8d-51e544478d5d',
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
  'b83918de-518c-538c-81b7-fa6067a2f60c',
  '2be70ccd-adb0-5a83-8adf-f26d571044e3',
  'rps_part',
  'c88fb785-83b9-4aca-94f9-7c33ecd33d3a',
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
  'db02b80f-15bc-5473-8833-e456c8376a72',
  '2be70ccd-adb0-5a83-8adf-f26d571044e3',
  'rps_part',
  'c8ef96d7-5c18-4496-8a47-cf7c04242092',
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
  '24788aaa-46e1-5866-81b6-79e106faa8c4',
  '2be70ccd-adb0-5a83-8adf-f26d571044e3',
  'rps_part',
  'c8fa0a0b-dbf1-44ab-b433-2b6b756ddf03',
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
  'aa36462d-fe94-553a-820d-60ad227d0140',
  '2be70ccd-adb0-5a83-8adf-f26d571044e3',
  'rps_part',
  'c91408aa-e6f9-45d4-b580-8b272d7a2d79',
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
  '4a988b3b-6da0-5123-89dc-c87793cb6cbe',
  '2be70ccd-adb0-5a83-8adf-f26d571044e3',
  'rps_part',
  'ca299eee-92ae-4c94-8ecc-290186cff347',
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
  'e1e4b8d1-b591-53a5-8764-fd6b11a86f56',
  '2be70ccd-adb0-5a83-8adf-f26d571044e3',
  'rps_part',
  'cb2a4cac-c11b-40e6-a8fa-efaef7794c5e',
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
  '6ba6b762-7620-5595-8501-df0781b9c1d4',
  '2be70ccd-adb0-5a83-8adf-f26d571044e3',
  'rps_part',
  'cee00bc9-6841-4f65-a67b-cb93b7394259',
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
  'c58d1732-4ee1-500d-8334-3d9abdeef16b',
  '2be70ccd-adb0-5a83-8adf-f26d571044e3',
  'rps_part',
  'cf90a26e-b178-4ff5-914b-1f4aee38d29c',
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
  '9de299cd-99cd-56d5-8599-e52d619630ff',
  '2be70ccd-adb0-5a83-8adf-f26d571044e3',
  'rps_part',
  'd0c9dffb-a9cf-4ccb-82e1-9db9ca010510',
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
  '0833c2b5-e829-5b9e-8456-9cef25ca1d43',
  '2be70ccd-adb0-5a83-8adf-f26d571044e3',
  'rps_part',
  'd12ba4e8-a4d6-4e7c-812f-51d37159fea0',
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
  'df5f3d2c-9ea0-53ee-8cb5-8ffdf1d77f0d',
  '2be70ccd-adb0-5a83-8adf-f26d571044e3',
  'rps_part',
  'd1d2a3ca-563e-429b-9131-d5ac26539f2e',
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
  '75b2eeb4-1580-561e-8fbc-e8c53382d667',
  '2be70ccd-adb0-5a83-8adf-f26d571044e3',
  'rps_part',
  'd319f791-8c8f-455b-93ca-0a97e58bf0f3',
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
  '6fe07f03-204c-5eba-8c16-33519f6d5abe',
  '2be70ccd-adb0-5a83-8adf-f26d571044e3',
  'rps_part',
  'd4caa148-e3be-409c-9882-32a0b91458bf',
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
  '5e12b213-41b6-515f-86a5-f55b990accae',
  '2be70ccd-adb0-5a83-8adf-f26d571044e3',
  'rps_part',
  'd5c247af-a6cf-4577-a7ef-c7ba95336233',
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
  '4df1a2f4-049e-5c83-816b-2cada3584456',
  '2be70ccd-adb0-5a83-8adf-f26d571044e3',
  'rps_part',
  'd6d23d0c-8ec5-4ffd-8468-9cc9ce4418b9',
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
  'cc1b2a06-b488-5c3b-8c1e-6c4775aec50f',
  '2be70ccd-adb0-5a83-8adf-f26d571044e3',
  'rps_part',
  'd9c9780f-af8a-4d25-b73a-0e591c560142',
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
  'dd6569bc-cda4-5fe3-848f-7261052e3939',
  '2be70ccd-adb0-5a83-8adf-f26d571044e3',
  'rps_part',
  'da2a7e00-50f5-4f41-b7c4-e5258d1cc811',
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
  '0656e808-cd2d-5a1a-818d-7c33e0d4afa4',
  '2be70ccd-adb0-5a83-8adf-f26d571044e3',
  'rps_part',
  'daf42c91-8fa5-4631-aabf-1cf85cb5c636',
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
  'ea39d370-d1ab-503a-81c3-820d2d71e5d3',
  '2be70ccd-adb0-5a83-8adf-f26d571044e3',
  'rps_part',
  'db77e601-4daa-4641-82ac-c110f30a229e',
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
  'e7c3ebff-c8f4-5fb7-8703-b1ee7d6d7fa3',
  '2be70ccd-adb0-5a83-8adf-f26d571044e3',
  'rps_part',
  'dd1001b7-5b19-4878-850a-341c5ed07b1c',
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
  '8cc86bb6-37b9-5c5f-87bd-9e33583bf5c9',
  '2be70ccd-adb0-5a83-8adf-f26d571044e3',
  'rps_part',
  'e244d589-c952-4469-9fd1-345ca4fe85f8',
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
  '0e761753-e70d-5c37-8ad3-98f270efcc62',
  '2be70ccd-adb0-5a83-8adf-f26d571044e3',
  'rps_part',
  'e7deb578-84cd-4eeb-ba9f-a88d8ca3bad2',
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
  '212f7f38-6a90-5112-801b-9e668630320f',
  '2be70ccd-adb0-5a83-8adf-f26d571044e3',
  'rps_part',
  'eba1511b-468f-40a3-a307-b677c32b9613',
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
  '37225b8a-9040-5913-8be7-2674c72e2070',
  '2be70ccd-adb0-5a83-8adf-f26d571044e3',
  'rps_part',
  'ed4b9f49-6248-4c76-9f17-0494c91cac8a',
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
  'aede2cc7-8c01-5a0d-8d7d-c1fbccd7a9e3',
  '2be70ccd-adb0-5a83-8adf-f26d571044e3',
  'rps_part',
  'f0b73b4a-b6d3-4140-8160-2af4b9ca0057',
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
  '8c91f7e8-1939-5a67-88db-464f958ee9a1',
  '2be70ccd-adb0-5a83-8adf-f26d571044e3',
  'rps_part',
  'f0e077ef-5228-4ee1-9742-3d9f59499e26',
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
  'bc23138c-9ed4-5d88-8f06-1453eb93fded',
  '2be70ccd-adb0-5a83-8adf-f26d571044e3',
  'rps_part',
  'f3acf451-3e85-4fe5-a14d-43218379ed8c',
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
  '273352b4-54fc-57f8-8e44-00849cbf6408',
  '2be70ccd-adb0-5a83-8adf-f26d571044e3',
  'rps_part',
  'f495cd9b-6bde-4b7e-b061-7bbd5ddd776e',
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
  '1581bf86-0d6f-5d94-8bc2-adc178ae8ac6',
  '2be70ccd-adb0-5a83-8adf-f26d571044e3',
  'rps_part',
  'f4afd9d6-6c7a-4f79-bb4e-29c9ff16f36b',
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
  'd8fe115a-1abf-542c-88da-cb9e528fb26e',
  '2be70ccd-adb0-5a83-8adf-f26d571044e3',
  'rps_part',
  'f63788c4-bd3a-41c3-b957-5540cd718aab',
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
  '8b6130dd-25d2-50f7-8e53-59c9ef376dfc',
  '2be70ccd-adb0-5a83-8adf-f26d571044e3',
  'rps_part',
  'f826a447-8646-410a-8db2-5a9a95f96d3d',
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
  'f3c9ae45-3fb9-52ec-8079-60c913ec8d2b',
  '2be70ccd-adb0-5a83-8adf-f26d571044e3',
  'rps_part',
  'f839db80-3b42-42e2-913c-1c51be82d77d',
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
  '2c68a4af-fa97-5011-8fdd-85badce0403e',
  '2be70ccd-adb0-5a83-8adf-f26d571044e3',
  'rps_part',
  'f918c391-73c5-43e5-9fa7-d3eebb36f10a',
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
  '12a32e5c-0b8c-529e-8bc1-1df57651e2b4',
  '2be70ccd-adb0-5a83-8adf-f26d571044e3',
  'rps_part',
  'fa39bb1e-ef77-4b03-b4c6-ee997fb94879',
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
  'e9d81431-ca2a-59af-8ad7-d2d0c15da3cd',
  '2be70ccd-adb0-5a83-8adf-f26d571044e3',
  'rps_part',
  'fa916363-578c-42b5-b1fc-0eb35b2b4840',
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
  '320ad7cd-6b0c-5dde-8049-9b8cfa9fbad8',
  '2be70ccd-adb0-5a83-8adf-f26d571044e3',
  'rps_part',
  'fbf1a017-c703-4744-844c-52f178d5c3aa',
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
  '9059e2f6-8178-50b0-8065-52289ea4c934',
  '2be70ccd-adb0-5a83-8adf-f26d571044e3',
  'rps_part',
  'fc641c08-8631-4019-bfc1-5ce8810150a4',
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
  '5f2620f1-02e3-5138-876c-ed86758194f9',
  '2be70ccd-adb0-5a83-8adf-f26d571044e3',
  'rps_part',
  'fe61fa9d-0308-4e72-a7a2-e725c42de8fc',
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
  '2c50bdaf-efd0-5662-8f14-b6bb48be0716',
  '2be70ccd-adb0-5a83-8adf-f26d571044e3',
  'rps_part',
  'fe7110cb-bfaf-4690-bca7-fce6cf6a9b06',
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
  'ac268f06-b425-5ce1-8f89-2bca49b4b216',
  '2be70ccd-adb0-5a83-8adf-f26d571044e3',
  'rps_part',
  'febf300a-3ab9-4e33-97b6-46f4ced9ef17',
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
INSERT INTO public.barry_evidence_concepts (
  source_type, source_record_id, concept_id, annotation_role, confidence,
  method, review_status, semantic_version_id, evidence_unit_id, model_scope,
  backfill_run_id, provenance
)
SELECT
  'barry_v2_content_block',
  '015479b4-ac76-4299-dacb-77fbe956876a',
  concept.id,
  'mentioned_component',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '5256ccd9-727e-5818-8cc3-b9cfd340474b',
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
  '015479b4-ac76-4299-dacb-77fbe956876a',
  concept.id,
  'mentioned_component',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '5256ccd9-727e-5818-8cc3-b9cfd340474b',
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
  '015479b4-ac76-4299-dacb-77fbe956876a',
  concept.id,
  'mentioned_component',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '5256ccd9-727e-5818-8cc3-b9cfd340474b',
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
  '015479b4-ac76-4299-dacb-77fbe956876a',
  concept.id,
  'applicability',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '5256ccd9-727e-5818-8cc3-b9cfd340474b',
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
  '015479b4-ac76-4299-dacb-77fbe956876a',
  concept.id,
  'applicability',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '5256ccd9-727e-5818-8cc3-b9cfd340474b',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"barry_v2_manual:9ba1297a-2aa6-de38-b971-ad38336442ad","matched_name":"U435","document_role":"workshop_manual"}'::jsonb
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
  '0174ff24-7e99-95a1-23d6-7b626a425a11',
  concept.id,
  'mentioned_component',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '02352df7-cad3-5b24-8b12-ae8d2b79912b',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":false,"document_key":"barry_v2_manual:7147712a-37e0-b066-2067-672767b2b617","matched_name":"water pump","document_role":"workshop_manual"}'::jsonb
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
  'barry_v2_content_block',
  '03c4d937-cc93-a2e4-b2c8-4e6d830b8890',
  concept.id,
  'applicability',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '1135029e-f0d8-5e9b-8b42-b2d590a8540b',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"barry_v2_manual:af332a3b-25a2-3589-3a79-e73507003464","matched_name":"U435","document_role":"workshop_manual"}'::jsonb
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
  '03c4d937-cc93-a2e4-b2c8-4e6d830b8890',
  concept.id,
  'mentioned_component',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '1135029e-f0d8-5e9b-8b42-b2d590a8540b',
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
  '03c4d937-cc93-a2e4-b2c8-4e6d830b8890',
  concept.id,
  'mentioned_component',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '1135029e-f0d8-5e9b-8b42-b2d590a8540b',
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
  '03c4d937-cc93-a2e4-b2c8-4e6d830b8890',
  concept.id,
  'mentioned_component',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '1135029e-f0d8-5e9b-8b42-b2d590a8540b',
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
  '03c4d937-cc93-a2e4-b2c8-4e6d830b8890',
  concept.id,
  'applicability',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '1135029e-f0d8-5e9b-8b42-b2d590a8540b',
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
  '04fb3285-565d-a06f-eceb-75e2244dbece',
  concept.id,
  'mentioned_component',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '55d5e9e2-ad4e-5539-88c0-3f9f23db9e56',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":false,"document_key":"barry_v2_manual:9ba1297a-2aa6-de38-b971-ad38336442ad","matched_name":"water pump","document_role":"workshop_manual"}'::jsonb
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
  'barry_v2_content_block',
  '053462cf-7fb0-7540-11a0-89688e51970e',
  concept.id,
  'operation',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '5bc093da-a71f-51a7-8c99-3f05948b6164',
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
  '053462cf-7fb0-7540-11a0-89688e51970e',
  concept.id,
  'mentioned_component',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '5bc093da-a71f-51a7-8c99-3f05948b6164',
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
  '053462cf-7fb0-7540-11a0-89688e51970e',
  concept.id,
  'primary_subject',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '5bc093da-a71f-51a7-8c99-3f05948b6164',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"barry_v2_manual:5c259d33-46d1-a74a-ef88-a4fabb23376f","matched_name":"pitman arm","document_role":"workshop_manual"}'::jsonb
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
  '053462cf-7fb0-7540-11a0-89688e51970e',
  concept.id,
  'property',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '5bc093da-a71f-51a7-8c99-3f05948b6164',
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
  '053462cf-7fb0-7540-11a0-89688e51970e',
  concept.id,
  'mentioned_component',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '5bc093da-a71f-51a7-8c99-3f05948b6164',
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
  '06f0930e-41ae-5d42-a55a-8b8331908367',
  concept.id,
  'operation',
  '0.700',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '546e7c3c-00ae-5fd4-872b-fc62c7405707',
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
  '06f0930e-41ae-5d42-a55a-8b8331908367',
  concept.id,
  'primary_subject',
  '0.850',
  'deterministic',
  'approved',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '546e7c3c-00ae-5fd4-872b-fc62c7405707',
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
  '06f0930e-41ae-5d42-a55a-8b8331908367',
  concept.id,
  'mentioned_component',
  '0.700',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '546e7c3c-00ae-5fd4-872b-fc62c7405707',
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
  '06f0930e-41ae-5d42-a55a-8b8331908367',
  concept.id,
  'property',
  '0.700',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '546e7c3c-00ae-5fd4-872b-fc62c7405707',
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
  '06f0930e-41ae-5d42-a55a-8b8331908367',
  concept.id,
  'mentioned_component',
  '0.850',
  'deterministic',
  'approved',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '546e7c3c-00ae-5fd4-872b-fc62c7405707',
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
  '07f2dd32-2d47-d601-b83e-426eb3266b5e',
  concept.id,
  'mentioned_component',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '0409c2c6-9d40-5893-87e8-fc4a2d2a21ad',
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
  '07f2dd32-2d47-d601-b83e-426eb3266b5e',
  concept.id,
  'mentioned_component',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '0409c2c6-9d40-5893-87e8-fc4a2d2a21ad',
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
  '07f2dd32-2d47-d601-b83e-426eb3266b5e',
  concept.id,
  'mentioned_component',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '0409c2c6-9d40-5893-87e8-fc4a2d2a21ad',
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
  '0894be3f-222c-c369-b429-9ececbae0017',
  concept.id,
  'property',
  '0.700',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'e1b13420-ee47-556f-81ec-8f1b0a9f1595',
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
  '0894be3f-222c-c369-b429-9ececbae0017',
  concept.id,
  'primary_subject',
  '0.850',
  'deterministic',
  'approved',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'e1b13420-ee47-556f-81ec-8f1b0a9f1595',
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
  '0894be3f-222c-c369-b429-9ececbae0017',
  concept.id,
  'mentioned_component',
  '0.700',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'e1b13420-ee47-556f-81ec-8f1b0a9f1595',
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
  '0894be3f-222c-c369-b429-9ececbae0017',
  concept.id,
  'mentioned_component',
  '0.850',
  'deterministic',
  'approved',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'e1b13420-ee47-556f-81ec-8f1b0a9f1595',
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
  '08dd761a-9c11-efea-cdc8-e1324e5386d6',
  concept.id,
  'primary_subject',
  '0.850',
  'deterministic',
  'approved',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '5fba5861-78d7-5346-8198-e4bf6eeef2c3',
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
  '08dd761a-9c11-efea-cdc8-e1324e5386d6',
  concept.id,
  'operation',
  '0.700',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '5fba5861-78d7-5346-8198-e4bf6eeef2c3',
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
  '08f30d26-dd50-09c6-01c1-72b79dbd1c9a',
  concept.id,
  'operation',
  '0.850',
  'deterministic',
  'approved',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '4d66c71c-d855-58c8-8bcd-3a58d22be851',
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
  '08f30d26-dd50-09c6-01c1-72b79dbd1c9a',
  concept.id,
  'property',
  '0.700',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '4d66c71c-d855-58c8-8bcd-3a58d22be851',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":false,"document_key":"barry_v2_manual:f374ac43-7586-ef55-8672-0923339390bb","matched_name":"torque","document_role":"maintenance_manual"}'::jsonb
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
  '08f30d26-dd50-09c6-01c1-72b79dbd1c9a',
  concept.id,
  'operation',
  '0.850',
  'deterministic',
  'approved',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '4d66c71c-d855-58c8-8bcd-3a58d22be851',
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
  '0c2125df-3199-f862-ba5f-7449c3d7264d',
  concept.id,
  'mentioned_component',
  '0.700',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'bae9236e-1c95-518b-84a8-836f2d2d31ad',
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
  '0c2125df-3199-f862-ba5f-7449c3d7264d',
  concept.id,
  'mentioned_component',
  '0.850',
  'deterministic',
  'approved',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'bae9236e-1c95-518b-84a8-836f2d2d31ad',
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
  '0c2125df-3199-f862-ba5f-7449c3d7264d',
  concept.id,
  'property',
  '0.700',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'bae9236e-1c95-518b-84a8-836f2d2d31ad',
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
  '0c2125df-3199-f862-ba5f-7449c3d7264d',
  concept.id,
  'value_context',
  '0.700',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'bae9236e-1c95-518b-84a8-836f2d2d31ad',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":false,"document_key":"barry_v2_manual:af332a3b-25a2-3589-3a79-e73507003464","matched_name":"automatic transmission fluid","document_role":"workshop_manual"}'::jsonb
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
  '0c2125df-3199-f862-ba5f-7449c3d7264d',
  concept.id,
  'primary_subject',
  '0.850',
  'deterministic',
  'approved',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'bae9236e-1c95-518b-84a8-836f2d2d31ad',
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
  '0c685851-68be-1865-f65f-3d12562614f4',
  concept.id,
  'primary_subject',
  '0.850',
  'deterministic',
  'approved',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '9499bd01-38d4-5044-8158-55aa50ae5be3',
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
  '0c685851-68be-1865-f65f-3d12562614f4',
  concept.id,
  'property',
  '0.700',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '9499bd01-38d4-5044-8158-55aa50ae5be3',
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
  '0f2d1fe0-dbde-ddfd-f674-e8d0b3798847',
  concept.id,
  'mentioned_component',
  '0.700',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'c7583637-613e-5baf-8b8f-648af87edf2c',
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
  '0f2d1fe0-dbde-ddfd-f674-e8d0b3798847',
  concept.id,
  'property',
  '0.700',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'c7583637-613e-5baf-8b8f-648af87edf2c',
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
  '0f2d1fe0-dbde-ddfd-f674-e8d0b3798847',
  concept.id,
  'operation',
  '0.700',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'c7583637-613e-5baf-8b8f-648af87edf2c',
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
  '0f2d1fe0-dbde-ddfd-f674-e8d0b3798847',
  concept.id,
  'primary_subject',
  '0.850',
  'deterministic',
  'approved',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'c7583637-613e-5baf-8b8f-648af87edf2c',
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
  '0f2d1fe0-dbde-ddfd-f674-e8d0b3798847',
  concept.id,
  'mentioned_component',
  '0.700',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'c7583637-613e-5baf-8b8f-648af87edf2c',
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
  '1028ce6d-fdde-27eb-c47e-a6291b1bd929',
  concept.id,
  'operation',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '1070f69c-7d08-5c24-8a15-aa02e7c1bd85',
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
  '1028ce6d-fdde-27eb-c47e-a6291b1bd929',
  concept.id,
  'operation',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '1070f69c-7d08-5c24-8a15-aa02e7c1bd85',
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
  '1028ce6d-fdde-27eb-c47e-a6291b1bd929',
  concept.id,
  'mentioned_component',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '1070f69c-7d08-5c24-8a15-aa02e7c1bd85',
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
  '1197e847-c75c-e835-fbb2-f863e06d0ff2',
  concept.id,
  'mentioned_component',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '2464f2a1-5278-5ad3-8735-22c73f9c8044',
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
  '1197e847-c75c-e835-fbb2-f863e06d0ff2',
  concept.id,
  'mentioned_component',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '2464f2a1-5278-5ad3-8735-22c73f9c8044',
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
  '1201d9af-79e9-d822-570c-42f83a38a4d6',
  concept.id,
  'mentioned_component',
  '0.700',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '1f9dfe8e-3f36-549b-8a39-5376b6e0bfd2',
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
  '1201d9af-79e9-d822-570c-42f83a38a4d6',
  concept.id,
  'primary_subject',
  '0.850',
  'deterministic',
  'approved',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '1f9dfe8e-3f36-549b-8a39-5376b6e0bfd2',
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
  '1201d9af-79e9-d822-570c-42f83a38a4d6',
  concept.id,
  'mentioned_component',
  '0.700',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '1f9dfe8e-3f36-549b-8a39-5376b6e0bfd2',
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
  '1201d9af-79e9-d822-570c-42f83a38a4d6',
  concept.id,
  'value_context',
  '0.700',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '1f9dfe8e-3f36-549b-8a39-5376b6e0bfd2',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":false,"document_key":"barry_v2_manual:5c259d33-46d1-a74a-ef88-a4fabb23376f","matched_name":"engine oil","document_role":"workshop_manual"}'::jsonb
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
  '1201d9af-79e9-d822-570c-42f83a38a4d6',
  concept.id,
  'property',
  '0.700',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '1f9dfe8e-3f36-549b-8a39-5376b6e0bfd2',
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
  '1201d9af-79e9-d822-570c-42f83a38a4d6',
  concept.id,
  'mentioned_component',
  '0.700',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '1f9dfe8e-3f36-549b-8a39-5376b6e0bfd2',
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
  '1201d9af-79e9-d822-570c-42f83a38a4d6',
  concept.id,
  'mentioned_component',
  '0.850',
  'deterministic',
  'approved',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '1f9dfe8e-3f36-549b-8a39-5376b6e0bfd2',
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
  '13984ee3-5c11-7cf2-d25b-fa7a10f501c9',
  concept.id,
  'primary_subject',
  '0.850',
  'deterministic',
  'approved',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'b82cb97c-3e0b-5495-840f-e8e9550ef239',
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
  '13984ee3-5c11-7cf2-d25b-fa7a10f501c9',
  concept.id,
  'mentioned_component',
  '0.700',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'b82cb97c-3e0b-5495-840f-e8e9550ef239',
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
  '13984ee3-5c11-7cf2-d25b-fa7a10f501c9',
  concept.id,
  'property',
  '0.700',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'b82cb97c-3e0b-5495-840f-e8e9550ef239',
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
  '13984ee3-5c11-7cf2-d25b-fa7a10f501c9',
  concept.id,
  'operation',
  '0.700',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'b82cb97c-3e0b-5495-840f-e8e9550ef239',
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
  '13984ee3-5c11-7cf2-d25b-fa7a10f501c9',
  concept.id,
  'mentioned_component',
  '0.850',
  'deterministic',
  'approved',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'b82cb97c-3e0b-5495-840f-e8e9550ef239',
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
  '145e2fb9-33c2-3031-303f-9425a66b5555',
  concept.id,
  'primary_subject',
  '0.850',
  'deterministic',
  'approved',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'd445b584-cb7f-58a4-8d9a-09aabdef1cda',
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
  '145e2fb9-33c2-3031-303f-9425a66b5555',
  concept.id,
  'property',
  '0.850',
  'deterministic',
  'approved',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'd445b584-cb7f-58a4-8d9a-09aabdef1cda',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"barry_v2_manual:5c259d33-46d1-a74a-ef88-a4fabb23376f","matched_name":"torque","document_role":"workshop_manual"}'::jsonb
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
  '145e2fb9-33c2-3031-303f-9425a66b5555',
  concept.id,
  'mentioned_component',
  '0.850',
  'deterministic',
  'approved',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'd445b584-cb7f-58a4-8d9a-09aabdef1cda',
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
  '145e2fb9-33c2-3031-303f-9425a66b5555',
  concept.id,
  'operation',
  '0.700',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'd445b584-cb7f-58a4-8d9a-09aabdef1cda',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":false,"document_key":"barry_v2_manual:5c259d33-46d1-a74a-ef88-a4fabb23376f","matched_name":"bleed","document_role":"workshop_manual"}'::jsonb
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
  '145e2fb9-33c2-3031-303f-9425a66b5555',
  concept.id,
  'operation',
  '0.700',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'd445b584-cb7f-58a4-8d9a-09aabdef1cda',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":false,"document_key":"barry_v2_manual:5c259d33-46d1-a74a-ef88-a4fabb23376f","matched_name":"adjust","document_role":"workshop_manual"}'::jsonb
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
  '145e2fb9-33c2-3031-303f-9425a66b5555',
  concept.id,
  'operation',
  '0.700',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'd445b584-cb7f-58a4-8d9a-09aabdef1cda',
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
  '145e2fb9-33c2-3031-303f-9425a66b5555',
  concept.id,
  'mentioned_component',
  '0.700',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'd445b584-cb7f-58a4-8d9a-09aabdef1cda',
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
  '15911b60-2cc0-760b-0421-7ffb4a738af1',
  concept.id,
  'operation',
  '0.850',
  'deterministic',
  'approved',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '1e445dda-2682-5a7d-88be-8c517d924bc4',
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
  '15911b60-2cc0-760b-0421-7ffb4a738af1',
  concept.id,
  'property',
  '0.850',
  'deterministic',
  'approved',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '1e445dda-2682-5a7d-88be-8c517d924bc4',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"barry_v2_manual:5c259d33-46d1-a74a-ef88-a4fabb23376f","matched_name":"operating pressure","document_role":"workshop_manual"}'::jsonb
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
  '1687db43-86ee-e76e-cab8-e4a2a39c9de6',
  concept.id,
  'primary_subject',
  '0.850',
  'deterministic',
  'approved',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '3ea80052-1425-5b29-8ab8-d9aa3be724f9',
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
  '1687db43-86ee-e76e-cab8-e4a2a39c9de6',
  concept.id,
  'mentioned_component',
  '0.850',
  'deterministic',
  'approved',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '3ea80052-1425-5b29-8ab8-d9aa3be724f9',
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
  '1687db43-86ee-e76e-cab8-e4a2a39c9de6',
  concept.id,
  'mentioned_component',
  '0.700',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '3ea80052-1425-5b29-8ab8-d9aa3be724f9',
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
  '19a067b0-21b4-1691-0579-2084471223f7',
  concept.id,
  'primary_subject',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '3641d5bc-c36e-5bda-8419-a8c7299825b5',
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
  '19a067b0-21b4-1691-0579-2084471223f7',
  concept.id,
  'operation',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '3641d5bc-c36e-5bda-8419-a8c7299825b5',
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
  '1edeb80d-2b68-73a8-1c5d-73250ac9da14',
  concept.id,
  'mentioned_component',
  '0.900',
  'deterministic',
  'approved',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'b21e78f6-0e59-5eca-8c3b-35b394fac6b6',
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
  '1edfcce4-8318-6839-8eac-08c1df4c66dd',
  concept.id,
  'operation',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '50d96989-e437-5a49-8f0d-de452e8f1eae',
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
  '1edfcce4-8318-6839-8eac-08c1df4c66dd',
  concept.id,
  'primary_subject',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '50d96989-e437-5a49-8f0d-de452e8f1eae',
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
  '200c6b27-75dd-4fbb-c9cf-8b197338cc0e',
  concept.id,
  'primary_subject',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'b64b13b8-ca3e-586b-847a-fc9a109c70e6',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"barry_v2_manual:9ba1297a-2aa6-de38-b971-ad38336442ad","matched_name":"pitman arm","document_role":"workshop_manual"}'::jsonb
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
  '200c6b27-75dd-4fbb-c9cf-8b197338cc0e',
  concept.id,
  'mentioned_component',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'b64b13b8-ca3e-586b-847a-fc9a109c70e6',
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
  '200c6b27-75dd-4fbb-c9cf-8b197338cc0e',
  concept.id,
  'property',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'b64b13b8-ca3e-586b-847a-fc9a109c70e6',
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
  '200c6b27-75dd-4fbb-c9cf-8b197338cc0e',
  concept.id,
  'operation',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'b64b13b8-ca3e-586b-847a-fc9a109c70e6',
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
  '200c6b27-75dd-4fbb-c9cf-8b197338cc0e',
  concept.id,
  'mentioned_component',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'b64b13b8-ca3e-586b-847a-fc9a109c70e6',
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
  '2138e848-7fd9-4f91-b7ed-d40e4a1891ca',
  concept.id,
  'primary_subject',
  '0.850',
  'deterministic',
  'approved',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'f08184d1-f58f-5ed8-8dfc-a17e62615a9e',
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
  '2138e848-7fd9-4f91-b7ed-d40e4a1891ca',
  concept.id,
  'property',
  '0.700',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'f08184d1-f58f-5ed8-8dfc-a17e62615a9e',
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
  '2138e848-7fd9-4f91-b7ed-d40e4a1891ca',
  concept.id,
  'operation',
  '0.700',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'f08184d1-f58f-5ed8-8dfc-a17e62615a9e',
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
  '2138e848-7fd9-4f91-b7ed-d40e4a1891ca',
  concept.id,
  'operation',
  '0.700',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'f08184d1-f58f-5ed8-8dfc-a17e62615a9e',
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
  '2138e848-7fd9-4f91-b7ed-d40e4a1891ca',
  concept.id,
  'mentioned_component',
  '0.850',
  'deterministic',
  'approved',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'f08184d1-f58f-5ed8-8dfc-a17e62615a9e',
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
  '25380eea-f769-1345-dc3e-dea076b20669',
  concept.id,
  'primary_subject',
  '0.850',
  'deterministic',
  'approved',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'f9fd92e8-5f1c-5281-8849-7a505be92362',
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
  '25380eea-f769-1345-dc3e-dea076b20669',
  concept.id,
  'property',
  '0.850',
  'deterministic',
  'approved',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'f9fd92e8-5f1c-5281-8849-7a505be92362',
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
  '25380eea-f769-1345-dc3e-dea076b20669',
  concept.id,
  'operation',
  '0.700',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'f9fd92e8-5f1c-5281-8849-7a505be92362',
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
  '25380eea-f769-1345-dc3e-dea076b20669',
  concept.id,
  'mentioned_component',
  '0.850',
  'deterministic',
  'approved',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'f9fd92e8-5f1c-5281-8849-7a505be92362',
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
  '25f750bd-d811-bc09-0e8d-81f2b47e47c1',
  concept.id,
  'primary_subject',
  '0.900',
  'deterministic',
  'approved',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '17d5a333-30d1-5db6-82f4-f3cf959cab2a',
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
  '25f750bd-d811-bc09-0e8d-81f2b47e47c1',
  concept.id,
  'mentioned_component',
  '0.700',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '17d5a333-30d1-5db6-82f4-f3cf959cab2a',
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
  '25f750bd-d811-bc09-0e8d-81f2b47e47c1',
  concept.id,
  'mentioned_component',
  '0.900',
  'deterministic',
  'approved',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '17d5a333-30d1-5db6-82f4-f3cf959cab2a',
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
  '287e675f-811c-1d06-0589-4245ed50173d',
  concept.id,
  'primary_subject',
  '0.850',
  'deterministic',
  'approved',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '1d733900-069e-5fe0-8fd4-e7419b99655c',
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
  '287e675f-811c-1d06-0589-4245ed50173d',
  concept.id,
  'mentioned_component',
  '0.700',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '1d733900-069e-5fe0-8fd4-e7419b99655c',
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
  '287e675f-811c-1d06-0589-4245ed50173d',
  concept.id,
  'property',
  '0.700',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '1d733900-069e-5fe0-8fd4-e7419b99655c',
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
  '287e675f-811c-1d06-0589-4245ed50173d',
  concept.id,
  'operation',
  '0.700',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '1d733900-069e-5fe0-8fd4-e7419b99655c',
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
  '287e675f-811c-1d06-0589-4245ed50173d',
  concept.id,
  'operation',
  '0.700',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '1d733900-069e-5fe0-8fd4-e7419b99655c',
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
  '287e675f-811c-1d06-0589-4245ed50173d',
  concept.id,
  'operation',
  '0.700',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '1d733900-069e-5fe0-8fd4-e7419b99655c',
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
  '287e675f-811c-1d06-0589-4245ed50173d',
  concept.id,
  'mentioned_component',
  '0.700',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '1d733900-069e-5fe0-8fd4-e7419b99655c',
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
  '29f58f0e-44d4-0c52-849a-578963cf5560',
  concept.id,
  'operation',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'ffc495cb-8d06-5190-8521-11a03491b7f2',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"barry_v2_manual:f374ac43-7586-ef55-8672-0923339390bb","matched_name":"bleed","document_role":"maintenance_manual"}'::jsonb
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
  '29f58f0e-44d4-0c52-849a-578963cf5560',
  concept.id,
  'operation',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'ffc495cb-8d06-5190-8521-11a03491b7f2',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"barry_v2_manual:f374ac43-7586-ef55-8672-0923339390bb","matched_name":"replace","document_role":"maintenance_manual"}'::jsonb
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
  '29f58f0e-44d4-0c52-849a-578963cf5560',
  concept.id,
  'operation',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'ffc495cb-8d06-5190-8521-11a03491b7f2',
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
  '29f58f0e-44d4-0c52-849a-578963cf5560',
  concept.id,
  'operation',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'ffc495cb-8d06-5190-8521-11a03491b7f2',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"barry_v2_manual:f374ac43-7586-ef55-8672-0923339390bb","matched_name":"remove","document_role":"maintenance_manual"}'::jsonb
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
  '29f58f0e-44d4-0c52-849a-578963cf5560',
  concept.id,
  'mentioned_component',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'ffc495cb-8d06-5190-8521-11a03491b7f2',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"barry_v2_manual:f374ac43-7586-ef55-8672-0923339390bb","matched_name":"engine","document_role":"maintenance_manual"}'::jsonb
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
  '29f58f0e-44d4-0c52-849a-578963cf5560',
  concept.id,
  'mentioned_component',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'ffc495cb-8d06-5190-8521-11a03491b7f2',
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
  '2ee1d330-0691-ddc4-db61-1d51c45d48c9',
  concept.id,
  'mentioned_component',
  '0.700',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '0908b3f1-4b16-5cb2-8b9a-3a0a8cb727b5',
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
  '2ee1d330-0691-ddc4-db61-1d51c45d48c9',
  concept.id,
  'mentioned_component',
  '0.900',
  'deterministic',
  'approved',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '0908b3f1-4b16-5cb2-8b9a-3a0a8cb727b5',
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
  '31506113-3494-8c28-b55d-7bb6a639847c',
  concept.id,
  'primary_subject',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '2e0d7ef3-903f-5059-8efe-6e3ac48bc081',
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
  '31506113-3494-8c28-b55d-7bb6a639847c',
  concept.id,
  'primary_subject',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '2e0d7ef3-903f-5059-8efe-6e3ac48bc081',
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
  '31506113-3494-8c28-b55d-7bb6a639847c',
  concept.id,
  'mentioned_component',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '2e0d7ef3-903f-5059-8efe-6e3ac48bc081',
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
  '358e732d-830b-9209-d43e-b3d660655e5e',
  concept.id,
  'primary_subject',
  '0.850',
  'deterministic',
  'approved',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '27c5a8ab-d062-5485-833e-67548011f481',
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
  '358e732d-830b-9209-d43e-b3d660655e5e',
  concept.id,
  'operation',
  '0.700',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '27c5a8ab-d062-5485-833e-67548011f481',
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
  '358e732d-830b-9209-d43e-b3d660655e5e',
  concept.id,
  'mentioned_component',
  '0.700',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '27c5a8ab-d062-5485-833e-67548011f481',
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
  '37289306-9c52-87a4-52b3-959840a0c67e',
  concept.id,
  'primary_subject',
  '0.850',
  'deterministic',
  'approved',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '0df4cc20-41d3-5168-8660-f1b8f83b66a7',
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
  '37289306-9c52-87a4-52b3-959840a0c67e',
  concept.id,
  'property',
  '0.850',
  'deterministic',
  'approved',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '0df4cc20-41d3-5168-8660-f1b8f83b66a7',
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
  '37289306-9c52-87a4-52b3-959840a0c67e',
  concept.id,
  'operation',
  '0.700',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '0df4cc20-41d3-5168-8660-f1b8f83b66a7',
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
  '37289306-9c52-87a4-52b3-959840a0c67e',
  concept.id,
  'operation',
  '0.700',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '0df4cc20-41d3-5168-8660-f1b8f83b66a7',
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
  '37289306-9c52-87a4-52b3-959840a0c67e',
  concept.id,
  'operation',
  '0.700',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '0df4cc20-41d3-5168-8660-f1b8f83b66a7',
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
  '37289306-9c52-87a4-52b3-959840a0c67e',
  concept.id,
  'mentioned_component',
  '0.700',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '0df4cc20-41d3-5168-8660-f1b8f83b66a7',
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
  '37289306-9c52-87a4-52b3-959840a0c67e',
  concept.id,
  'mentioned_component',
  '0.850',
  'deterministic',
  'approved',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '0df4cc20-41d3-5168-8660-f1b8f83b66a7',
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
  '37866dec-f3b8-248d-b81d-1cf17da091f3',
  concept.id,
  'mentioned_component',
  '0.700',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'af077008-2572-59b4-89a7-cad673c7179f',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":false,"document_key":"barry_v2_manual:7147712a-37e0-b066-2067-672767b2b617","matched_name":"differential","document_role":"workshop_manual"}'::jsonb
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
  '37866dec-f3b8-248d-b81d-1cf17da091f3',
  concept.id,
  'mentioned_component',
  '0.700',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'af077008-2572-59b4-89a7-cad673c7179f',
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
  '37866dec-f3b8-248d-b81d-1cf17da091f3',
  concept.id,
  'mentioned_component',
  '0.700',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'af077008-2572-59b4-89a7-cad673c7179f',
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
  '37866dec-f3b8-248d-b81d-1cf17da091f3',
  concept.id,
  'mentioned_component',
  '0.700',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'af077008-2572-59b4-89a7-cad673c7179f',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":false,"document_key":"barry_v2_manual:7147712a-37e0-b066-2067-672767b2b617","matched_name":"compressed air","document_role":"workshop_manual"}'::jsonb
FROM public.barry_semantic_concepts concept
WHERE concept.concept_key = 'vehicle_system.compressed_air'
ON CONFLICT (source_type, source_record_id, concept_id, annotation_role, semantic_version_id)
DO UPDATE SET
  confidence = EXCLUDED.confidence,
  review_status = EXCLUDED.review_status,
  evidence_unit_id = EXCLUDED.evidence_unit_id,
  model_scope = EXCLUDED.model_scope,
  provenance = EXCLUDED.provenance;
INSERT INTO public.barry_evidence_concepts (
  source_type, source_record_id, concept_id, annotation_role, confidence,
  method, review_status, semantic_version_id, evidence_unit_id, model_scope,
  backfill_run_id, provenance
)
SELECT
  'barry_v2_content_block',
  '3bd342c7-39aa-f8e2-ad4a-8fce4ab59af1',
  concept.id,
  'primary_subject',
  '0.850',
  'deterministic',
  'approved',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '885e7104-cce2-5cf3-8d96-1791d973375a',
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
  '3bd342c7-39aa-f8e2-ad4a-8fce4ab59af1',
  concept.id,
  'property',
  '0.850',
  'deterministic',
  'approved',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '885e7104-cce2-5cf3-8d96-1791d973375a',
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
  '3bd342c7-39aa-f8e2-ad4a-8fce4ab59af1',
  concept.id,
  'operation',
  '0.700',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '885e7104-cce2-5cf3-8d96-1791d973375a',
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
  '3bd342c7-39aa-f8e2-ad4a-8fce4ab59af1',
  concept.id,
  'mentioned_component',
  '0.850',
  'deterministic',
  'approved',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '885e7104-cce2-5cf3-8d96-1791d973375a',
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
  '3cafb1c3-20e2-8ac8-6a8d-9b677aeb1fec',
  concept.id,
  'mentioned_component',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'd7bfbdd4-f71a-5b7d-8e2c-b094ffa45425',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":false,"document_key":"barry_v2_manual:7147712a-37e0-b066-2067-672767b2b617","matched_name":"steering gear","document_role":"workshop_manual"}'::jsonb
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
  '3cafb1c3-20e2-8ac8-6a8d-9b677aeb1fec',
  concept.id,
  'mentioned_component',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'd7bfbdd4-f71a-5b7d-8e2c-b094ffa45425',
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
  '3cafb1c3-20e2-8ac8-6a8d-9b677aeb1fec',
  concept.id,
  'applicability',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'd7bfbdd4-f71a-5b7d-8e2c-b094ffa45425',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":false,"document_key":"barry_v2_manual:7147712a-37e0-b066-2067-672767b2b617","matched_name":"U1700L","document_role":"workshop_manual"}'::jsonb
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
  '3cafb1c3-20e2-8ac8-6a8d-9b677aeb1fec',
  concept.id,
  'applicability',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'd7bfbdd4-f71a-5b7d-8e2c-b094ffa45425',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":false,"document_key":"barry_v2_manual:7147712a-37e0-b066-2067-672767b2b617","matched_name":"U435","document_role":"workshop_manual"}'::jsonb
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
  '3ecb3797-b79f-300e-e77f-8c56176c745c',
  concept.id,
  'primary_subject',
  '0.900',
  'deterministic',
  'approved',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '9ccf2772-272b-52e1-85c9-603126752aee',
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
  '3ecb3797-b79f-300e-e77f-8c56176c745c',
  concept.id,
  'mentioned_component',
  '0.700',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '9ccf2772-272b-52e1-85c9-603126752aee',
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
  '3ecb3797-b79f-300e-e77f-8c56176c745c',
  concept.id,
  'mentioned_component',
  '0.900',
  'deterministic',
  'approved',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '9ccf2772-272b-52e1-85c9-603126752aee',
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
  '3f87adcf-a8e8-8796-86ac-58322afe7097',
  concept.id,
  'primary_subject',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '3be0b111-2bec-560c-8d40-d46cd85dc38b',
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
  '3f87adcf-a8e8-8796-86ac-58322afe7097',
  concept.id,
  'operation',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '3be0b111-2bec-560c-8d40-d46cd85dc38b',
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
  '447619c7-3be1-bc67-519c-68d1d25964f7',
  concept.id,
  'mentioned_component',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '7e6274a0-4d49-5317-83f0-87334768f604',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":false,"document_key":"barry_v2_manual:af332a3b-25a2-3589-3a79-e73507003464","matched_name":"water pump","document_role":"workshop_manual"}'::jsonb
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
  'barry_v2_content_block',
  '461a5f4a-61d2-9235-1584-4ba08ceafb31',
  concept.id,
  'primary_subject',
  '0.850',
  'deterministic',
  'approved',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '7657a5f6-77ff-57f6-8422-f6eb545510c9',
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
  '461a5f4a-61d2-9235-1584-4ba08ceafb31',
  concept.id,
  'operation',
  '0.850',
  'deterministic',
  'approved',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '7657a5f6-77ff-57f6-8422-f6eb545510c9',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":true,"document_key":"barry_v2_manual:9ba1297a-2aa6-de38-b971-ad38336442ad","matched_name":"install","document_role":"workshop_manual"}'::jsonb
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
  '461a5f4a-61d2-9235-1584-4ba08ceafb31',
  concept.id,
  'mentioned_component',
  '0.850',
  'deterministic',
  'approved',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '7657a5f6-77ff-57f6-8422-f6eb545510c9',
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
  '4793f041-b98e-39b1-c8dc-dd4e6a65c8c3',
  concept.id,
  'primary_subject',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '272b26ca-5474-5af9-8c6d-f8e0f892d1dd',
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
  '4793f041-b98e-39b1-c8dc-dd4e6a65c8c3',
  concept.id,
  'property',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '272b26ca-5474-5af9-8c6d-f8e0f892d1dd',
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
  '4793f041-b98e-39b1-c8dc-dd4e6a65c8c3',
  concept.id,
  'operation',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '272b26ca-5474-5af9-8c6d-f8e0f892d1dd',
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
  '4793f041-b98e-39b1-c8dc-dd4e6a65c8c3',
  concept.id,
  'mentioned_component',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '272b26ca-5474-5af9-8c6d-f8e0f892d1dd',
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
  '4793f041-b98e-39b1-c8dc-dd4e6a65c8c3',
  concept.id,
  'mentioned_component',
  '0.600',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '272b26ca-5474-5af9-8c6d-f8e0f892d1dd',
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
  '4bf6973f-4d81-7506-312d-912007792574',
  concept.id,
  'primary_subject',
  '0.850',
  'deterministic',
  'approved',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'f23cb851-8e03-5316-8574-917ad24caa51',
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
  '4bf6973f-4d81-7506-312d-912007792574',
  concept.id,
  'mentioned_component',
  '0.700',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'f23cb851-8e03-5316-8574-917ad24caa51',
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
  '4bf6973f-4d81-7506-312d-912007792574',
  concept.id,
  'value_context',
  '0.700',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'f23cb851-8e03-5316-8574-917ad24caa51',
  ARRAY[]::text[],
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  '{"source":"phase2_backfill","primary":false,"document_key":"barry_v2_manual:9ba1297a-2aa6-de38-b971-ad38336442ad","matched_name":"engine oil","document_role":"workshop_manual"}'::jsonb
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
  '4bf6973f-4d81-7506-312d-912007792574',
  concept.id,
  'property',
  '0.700',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'f23cb851-8e03-5316-8574-917ad24caa51',
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
  '4bf6973f-4d81-7506-312d-912007792574',
  concept.id,
  'mentioned_component',
  '0.700',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'f23cb851-8e03-5316-8574-917ad24caa51',
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
  '4bf6973f-4d81-7506-312d-912007792574',
  concept.id,
  'mentioned_component',
  '0.700',
  'deterministic',
  'proposed',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'f23cb851-8e03-5316-8574-917ad24caa51',
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
  '4bf6973f-4d81-7506-312d-912007792574',
  concept.id,
  'mentioned_component',
  '0.850',
  'deterministic',
  'approved',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'f23cb851-8e03-5316-8574-917ad24caa51',
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
  '4ce5dffc-f16f-1a55-f12a-d9c595ae6469',
  concept.id,
  'primary_subject',
  '0.850',
  'deterministic',
  'approved',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '94d53062-9e6c-583f-8ea4-8c12db24d940',
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
COMMIT;
