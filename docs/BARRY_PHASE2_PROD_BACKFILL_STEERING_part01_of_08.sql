BEGIN;

INSERT INTO public.barry_backfill_runs (
  id, run_key, semantic_version_id, mode, filters, status, stats, completed_at
) VALUES (
  'c91de1c8-2d28-56cc-827d-4c8f99152506',
  'prod-steering-phase2-1',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  'apply',
  '{"pages":null,"sources":"all","documentKey":null}'::jsonb,
  'completed',
  '{"cursor":"440","skipped":0,"documents":74,"reviewItems":199,"evidenceUnits":440,"annotationsApproved":252,"annotationsProposed":754}'::jsonb,
  now()
)
ON CONFLICT (run_key) DO NOTHING;
INSERT INTO public.barry_documents (
  id, document_key, title, document_role, storage_path, physical_page_count,
  checksum, model_tags, source_type, source_record_id, semantic_version_id, provenance
) VALUES (
  '82fd0905-f34b-5306-8d84-6f98d57eaa04',
  'barry_v2_manual:04648fb3-62b2-117f-d84f-b1834f56fd30',
  'u435-32-advanced-electrical',
  'workshop_manual',
  NULL,
  14,
  NULL,
  ARRAY[]::text[],
  'barry_v2_manual',
  '04648fb3-62b2-117f-d84f-b1834f56fd30',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '{"source":"phase2_backfill","role_reason":"verified barry_v2 manual_type workshop","role_confidence":0.9}'::jsonb
)
ON CONFLICT (semantic_version_id, document_key) DO UPDATE SET
  title = EXCLUDED.title,
  document_role = EXCLUDED.document_role,
  model_tags = EXCLUDED.model_tags,
  provenance = EXCLUDED.provenance,
  updated_at = now();
INSERT INTO public.barry_documents (
  id, document_key, title, document_role, storage_path, physical_page_count,
  checksum, model_tags, source_type, source_record_id, semantic_version_id, provenance
) VALUES (
  'f237038e-d757-57da-81c0-f442e46e5ad8',
  'barry_v2_manual:0ab686ec-f421-6b78-a26c-153785b4549e',
  'u435-maint-35-rear-axle',
  'maintenance_manual',
  NULL,
  1,
  NULL,
  ARRAY[]::text[],
  'barry_v2_manual',
  '0ab686ec-f421-6b78-a26c-153785b4549e',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '{"source":"phase2_backfill","role_reason":"verified u435 maintenance filename convention","role_confidence":0.95}'::jsonb
)
ON CONFLICT (semantic_version_id, document_key) DO UPDATE SET
  title = EXCLUDED.title,
  document_role = EXCLUDED.document_role,
  model_tags = EXCLUDED.model_tags,
  provenance = EXCLUDED.provenance,
  updated_at = now();
INSERT INTO public.barry_documents (
  id, document_key, title, document_role, storage_path, physical_page_count,
  checksum, model_tags, source_type, source_record_id, semantic_version_id, provenance
) VALUES (
  '4898d939-fdf4-5411-87c8-e89455cbac12',
  'barry_v2_manual:1894c477-0fc4-734f-12ec-9d76da4511fc',
  'u435-maint-43-brakes-pneumatic',
  'maintenance_manual',
  NULL,
  1,
  NULL,
  ARRAY[]::text[],
  'barry_v2_manual',
  '1894c477-0fc4-734f-12ec-9d76da4511fc',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '{"source":"phase2_backfill","role_reason":"verified u435 maintenance filename convention","role_confidence":0.95}'::jsonb
)
ON CONFLICT (semantic_version_id, document_key) DO UPDATE SET
  title = EXCLUDED.title,
  document_role = EXCLUDED.document_role,
  model_tags = EXCLUDED.model_tags,
  provenance = EXCLUDED.provenance,
  updated_at = now();
INSERT INTO public.barry_documents (
  id, document_key, title, document_role, storage_path, physical_page_count,
  checksum, model_tags, source_type, source_record_id, semantic_version_id, provenance
) VALUES (
  '8638ab22-43a6-571f-807c-4240d61da398',
  'barry_v2_manual:18d3cd0b-89e3-84bd-f665-53367b0b9085',
  'u435-maint-32-suspension',
  'maintenance_manual',
  NULL,
  2,
  NULL,
  ARRAY[]::text[],
  'barry_v2_manual',
  '18d3cd0b-89e3-84bd-f665-53367b0b9085',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '{"source":"phase2_backfill","role_reason":"verified u435 maintenance filename convention","role_confidence":0.95}'::jsonb
)
ON CONFLICT (semantic_version_id, document_key) DO UPDATE SET
  title = EXCLUDED.title,
  document_role = EXCLUDED.document_role,
  model_tags = EXCLUDED.model_tags,
  provenance = EXCLUDED.provenance,
  updated_at = now();
INSERT INTO public.barry_documents (
  id, document_key, title, document_role, storage_path, physical_page_count,
  checksum, model_tags, source_type, source_record_id, semantic_version_id, provenance
) VALUES (
  '8684ec5e-e76b-5603-8c06-7a16506f1e75',
  'barry_v2_manual:20460f6b-181d-baeb-37e5-1167e5b73618',
  'g619-25-partial-torque-tube-removal-misc-inst',
  'workshop_manual',
  NULL,
  19,
  NULL,
  ARRAY[]::text[],
  'barry_v2_manual',
  '20460f6b-181d-baeb-37e5-1167e5b73618',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '{"source":"phase2_backfill","role_reason":"verified barry_v2 manual_type workshop","role_confidence":0.9}'::jsonb
)
ON CONFLICT (semantic_version_id, document_key) DO UPDATE SET
  title = EXCLUDED.title,
  document_role = EXCLUDED.document_role,
  model_tags = EXCLUDED.model_tags,
  provenance = EXCLUDED.provenance,
  updated_at = now();
INSERT INTO public.barry_documents (
  id, document_key, title, document_role, storage_path, physical_page_count,
  checksum, model_tags, source_type, source_record_id, semantic_version_id, provenance
) VALUES (
  'd60732db-976f-5349-8fe9-06ab6ce04e7f',
  'barry_v2_manual:2a034f1d-129f-abda-d02f-944c34b84286',
  'u435-17-suspension',
  'workshop_manual',
  NULL,
  40,
  NULL,
  ARRAY[]::text[],
  'barry_v2_manual',
  '2a034f1d-129f-abda-d02f-944c34b84286',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '{"source":"phase2_backfill","role_reason":"verified barry_v2 manual_type workshop","role_confidence":0.9}'::jsonb
)
ON CONFLICT (semantic_version_id, document_key) DO UPDATE SET
  title = EXCLUDED.title,
  document_role = EXCLUDED.document_role,
  model_tags = EXCLUDED.model_tags,
  provenance = EXCLUDED.provenance,
  updated_at = now();
INSERT INTO public.barry_documents (
  id, document_key, title, document_role, storage_path, physical_page_count,
  checksum, model_tags, source_type, source_record_id, semantic_version_id, provenance
) VALUES (
  '20bff683-d471-5428-80ac-d3447c12b60a',
  'barry_v2_manual:2c2d5aab-1c40-8f43-7b2e-e4a3fa997fe0',
  '09-air-filter',
  'workshop_manual',
  NULL,
  13,
  NULL,
  ARRAY[]::text[],
  'barry_v2_manual',
  '2c2d5aab-1c40-8f43-7b2e-e4a3fa997fe0',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '{"source":"phase2_backfill","role_reason":"verified barry_v2 manual_type workshop","role_confidence":0.9}'::jsonb
)
ON CONFLICT (semantic_version_id, document_key) DO UPDATE SET
  title = EXCLUDED.title,
  document_role = EXCLUDED.document_role,
  model_tags = EXCLUDED.model_tags,
  provenance = EXCLUDED.provenance,
  updated_at = now();
INSERT INTO public.barry_documents (
  id, document_key, title, document_role, storage_path, physical_page_count,
  checksum, model_tags, source_type, source_record_id, semantic_version_id, provenance
) VALUES (
  '04fa8e21-7985-5c5f-8615-43b221a2e83c',
  'barry_v2_manual:2f226938-6026-7274-b10d-d429024dad26',
  'u435-maint-60-doors-windows',
  'maintenance_manual',
  NULL,
  4,
  NULL,
  ARRAY[]::text[],
  'barry_v2_manual',
  '2f226938-6026-7274-b10d-d429024dad26',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '{"source":"phase2_backfill","role_reason":"verified u435 maintenance filename convention","role_confidence":0.95}'::jsonb
)
ON CONFLICT (semantic_version_id, document_key) DO UPDATE SET
  title = EXCLUDED.title,
  document_role = EXCLUDED.document_role,
  model_tags = EXCLUDED.model_tags,
  provenance = EXCLUDED.provenance,
  updated_at = now();
INSERT INTO public.barry_documents (
  id, document_key, title, document_role, storage_path, physical_page_count,
  checksum, model_tags, source_type, source_record_id, semantic_version_id, provenance
) VALUES (
  '12732e0e-2a44-576f-8a1a-c00cb1f53d45',
  'barry_v2_manual:2f6a2830-e890-6964-7123-063679e577b3',
  'u435-maint-00-general-info',
  'maintenance_manual',
  NULL,
  10,
  NULL,
  ARRAY[]::text[],
  'barry_v2_manual',
  '2f6a2830-e890-6964-7123-063679e577b3',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '{"source":"phase2_backfill","role_reason":"verified u435 maintenance filename convention","role_confidence":0.95}'::jsonb
)
ON CONFLICT (semantic_version_id, document_key) DO UPDATE SET
  title = EXCLUDED.title,
  document_role = EXCLUDED.document_role,
  model_tags = EXCLUDED.model_tags,
  provenance = EXCLUDED.provenance,
  updated_at = now();
INSERT INTO public.barry_documents (
  id, document_key, title, document_role, storage_path, physical_page_count,
  checksum, model_tags, source_type, source_record_id, semantic_version_id, provenance
) VALUES (
  'e926f1be-c2af-5b3a-80e4-ef79bff22315',
  'barry_v2_manual:379a888b-eb3f-6efc-6b0b-390a1c70399d',
  'u435-maint-42-brakes-mechanical',
  'maintenance_manual',
  NULL,
  8,
  NULL,
  ARRAY[]::text[],
  'barry_v2_manual',
  '379a888b-eb3f-6efc-6b0b-390a1c70399d',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '{"source":"phase2_backfill","role_reason":"verified u435 maintenance filename convention","role_confidence":0.95}'::jsonb
)
ON CONFLICT (semantic_version_id, document_key) DO UPDATE SET
  title = EXCLUDED.title,
  document_role = EXCLUDED.document_role,
  model_tags = EXCLUDED.model_tags,
  provenance = EXCLUDED.provenance,
  updated_at = now();
INSERT INTO public.barry_documents (
  id, document_key, title, document_role, storage_path, physical_page_count,
  checksum, model_tags, source_type, source_record_id, semantic_version_id, provenance
) VALUES (
  '0999cc1d-f962-57f7-80ab-cb69f11e5ac8',
  'barry_v2_manual:37e3396c-4d70-bca3-648b-4fdb01d569e8',
  'u435-08-exhaust-system',
  'workshop_manual',
  NULL,
  9,
  NULL,
  ARRAY[]::text[],
  'barry_v2_manual',
  '37e3396c-4d70-bca3-648b-4fdb01d569e8',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '{"source":"phase2_backfill","role_reason":"verified barry_v2 manual_type workshop","role_confidence":0.9}'::jsonb
)
ON CONFLICT (semantic_version_id, document_key) DO UPDATE SET
  title = EXCLUDED.title,
  document_role = EXCLUDED.document_role,
  model_tags = EXCLUDED.model_tags,
  provenance = EXCLUDED.provenance,
  updated_at = now();
INSERT INTO public.barry_documents (
  id, document_key, title, document_role, storage_path, physical_page_count,
  checksum, model_tags, source_type, source_record_id, semantic_version_id, provenance
) VALUES (
  '07b82f1d-5342-5c2a-8ea9-b6c1d7526365',
  'barry_v2_manual:37eb31d2-063a-5351-a073-d00a9b1f97dd',
  'u435-maint-13-air-compressor',
  'maintenance_manual',
  NULL,
  5,
  NULL,
  ARRAY[]::text[],
  'barry_v2_manual',
  '37eb31d2-063a-5351-a073-d00a9b1f97dd',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '{"source":"phase2_backfill","role_reason":"verified u435 maintenance filename convention","role_confidence":0.95}'::jsonb
)
ON CONFLICT (semantic_version_id, document_key) DO UPDATE SET
  title = EXCLUDED.title,
  document_role = EXCLUDED.document_role,
  model_tags = EXCLUDED.model_tags,
  provenance = EXCLUDED.provenance,
  updated_at = now();
INSERT INTO public.barry_documents (
  id, document_key, title, document_role, storage_path, physical_page_count,
  checksum, model_tags, source_type, source_record_id, semantic_version_id, provenance
) VALUES (
  '58d3567b-3ae0-5379-8e5f-610c46b691c2',
  'barry_v2_manual:3b15a9e9-fb23-76f1-9e32-f18f6b140ec5',
  'u435-23-service-brakes',
  'workshop_manual',
  NULL,
  90,
  NULL,
  ARRAY[]::text[],
  'barry_v2_manual',
  '3b15a9e9-fb23-76f1-9e32-f18f6b140ec5',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '{"source":"phase2_backfill","role_reason":"verified barry_v2 manual_type workshop","role_confidence":0.9}'::jsonb
)
ON CONFLICT (semantic_version_id, document_key) DO UPDATE SET
  title = EXCLUDED.title,
  document_role = EXCLUDED.document_role,
  model_tags = EXCLUDED.model_tags,
  provenance = EXCLUDED.provenance,
  updated_at = now();
INSERT INTO public.barry_documents (
  id, document_key, title, document_role, storage_path, physical_page_count,
  checksum, model_tags, source_type, source_record_id, semantic_version_id, provenance
) VALUES (
  'b304afe4-aebb-5eb1-8685-68e137656f8b',
  'barry_v2_manual:3b74c6f1-3605-f33b-b33f-94ba14a86191',
  'u435-maint-00-safety',
  'maintenance_manual',
  NULL,
  15,
  NULL,
  ARRAY[]::text[],
  'barry_v2_manual',
  '3b74c6f1-3605-f33b-b33f-94ba14a86191',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '{"source":"phase2_backfill","role_reason":"verified u435 maintenance filename convention","role_confidence":0.95}'::jsonb
)
ON CONFLICT (semantic_version_id, document_key) DO UPDATE SET
  title = EXCLUDED.title,
  document_role = EXCLUDED.document_role,
  model_tags = EXCLUDED.model_tags,
  provenance = EXCLUDED.provenance,
  updated_at = now();
INSERT INTO public.barry_documents (
  id, document_key, title, document_role, storage_path, physical_page_count,
  checksum, model_tags, source_type, source_record_id, semantic_version_id, provenance
) VALUES (
  '8f341151-c486-5746-8bd6-820e5dff4726',
  'barry_v2_manual:3c9cbe85-d6c1-b58a-0ffe-d599a837400e',
  'u435-maint-50-cooling-system',
  'maintenance_manual',
  NULL,
  4,
  NULL,
  ARRAY[]::text[],
  'barry_v2_manual',
  '3c9cbe85-d6c1-b58a-0ffe-d599a837400e',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '{"source":"phase2_backfill","role_reason":"verified u435 maintenance filename convention","role_confidence":0.95}'::jsonb
)
ON CONFLICT (semantic_version_id, document_key) DO UPDATE SET
  title = EXCLUDED.title,
  document_role = EXCLUDED.document_role,
  model_tags = EXCLUDED.model_tags,
  provenance = EXCLUDED.provenance,
  updated_at = now();
INSERT INTO public.barry_documents (
  id, document_key, title, document_role, storage_path, physical_page_count,
  checksum, model_tags, source_type, source_record_id, semantic_version_id, provenance
) VALUES (
  'a42e04eb-8409-5d9b-8e78-99194c9b8bb7',
  'barry_v2_manual:40685936-39ea-9b1b-3129-16c10c0ed7de',
  'g618-1-unimog-all-types-technical-inspection',
  'workshop_manual',
  NULL,
  8,
  NULL,
  ARRAY[]::text[],
  'barry_v2_manual',
  '40685936-39ea-9b1b-3129-16c10c0ed7de',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '{"source":"phase2_backfill","role_reason":"verified barry_v2 manual_type workshop","role_confidence":0.9}'::jsonb
)
ON CONFLICT (semantic_version_id, document_key) DO UPDATE SET
  title = EXCLUDED.title,
  document_role = EXCLUDED.document_role,
  model_tags = EXCLUDED.model_tags,
  provenance = EXCLUDED.provenance,
  updated_at = now();
INSERT INTO public.barry_documents (
  id, document_key, title, document_role, storage_path, physical_page_count,
  checksum, model_tags, source_type, source_record_id, semantic_version_id, provenance
) VALUES (
  'f633323b-67f4-5ab3-830e-7ac25d96f0c0',
  'barry_v2_manual:43bf6191-6422-96c4-6e08-1d1bf43579d6',
  'u435-11-pto-systems',
  'workshop_manual',
  NULL,
  15,
  NULL,
  ARRAY[]::text[],
  'barry_v2_manual',
  '43bf6191-6422-96c4-6e08-1d1bf43579d6',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '{"source":"phase2_backfill","role_reason":"verified barry_v2 manual_type workshop","role_confidence":0.9}'::jsonb
)
ON CONFLICT (semantic_version_id, document_key) DO UPDATE SET
  title = EXCLUDED.title,
  document_role = EXCLUDED.document_role,
  model_tags = EXCLUDED.model_tags,
  provenance = EXCLUDED.provenance,
  updated_at = now();
INSERT INTO public.barry_documents (
  id, document_key, title, document_role, storage_path, physical_page_count,
  checksum, model_tags, source_type, source_record_id, semantic_version_id, provenance
) VALUES (
  'b6ad34f0-54eb-5f9b-806b-bab53f1038b5',
  'barry_v2_manual:4611d6b9-7318-a0d2-bf8c-f6d727782292',
  'u435-09-manual-trans',
  'workshop_manual',
  NULL,
  88,
  NULL,
  ARRAY[]::text[],
  'barry_v2_manual',
  '4611d6b9-7318-a0d2-bf8c-f6d727782292',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '{"source":"phase2_backfill","role_reason":"verified barry_v2 manual_type workshop","role_confidence":0.9}'::jsonb
)
ON CONFLICT (semantic_version_id, document_key) DO UPDATE SET
  title = EXCLUDED.title,
  document_role = EXCLUDED.document_role,
  model_tags = EXCLUDED.model_tags,
  provenance = EXCLUDED.provenance,
  updated_at = now();
INSERT INTO public.barry_documents (
  id, document_key, title, document_role, storage_path, physical_page_count,
  checksum, model_tags, source_type, source_record_id, semantic_version_id, provenance
) VALUES (
  '24a7d55d-801e-5408-845b-670cd8a5ad92',
  'barry_v2_manual:4a47cd0d-8aa6-aa4c-b100-8df6cc5fe5f6',
  'u435-14-wiring',
  'workshop_manual',
  NULL,
  33,
  NULL,
  ARRAY[]::text[],
  'barry_v2_manual',
  '4a47cd0d-8aa6-aa4c-b100-8df6cc5fe5f6',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '{"source":"phase2_backfill","role_reason":"verified barry_v2 manual_type workshop","role_confidence":0.9}'::jsonb
)
ON CONFLICT (semantic_version_id, document_key) DO UPDATE SET
  title = EXCLUDED.title,
  document_role = EXCLUDED.document_role,
  model_tags = EXCLUDED.model_tags,
  provenance = EXCLUDED.provenance,
  updated_at = now();
INSERT INTO public.barry_documents (
  id, document_key, title, document_role, storage_path, physical_page_count,
  checksum, model_tags, source_type, source_record_id, semantic_version_id, provenance
) VALUES (
  'f925a3a9-4715-5cfd-800c-ca82b478a189',
  'barry_v2_manual:535d075a-e019-ee5a-b917-52a22e4460ec',
  'u435-29-hvac-heating',
  'workshop_manual',
  NULL,
  25,
  NULL,
  ARRAY[]::text[],
  'barry_v2_manual',
  '535d075a-e019-ee5a-b917-52a22e4460ec',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '{"source":"phase2_backfill","role_reason":"verified barry_v2 manual_type workshop","role_confidence":0.9}'::jsonb
)
ON CONFLICT (semantic_version_id, document_key) DO UPDATE SET
  title = EXCLUDED.title,
  document_role = EXCLUDED.document_role,
  model_tags = EXCLUDED.model_tags,
  provenance = EXCLUDED.provenance,
  updated_at = now();
INSERT INTO public.barry_documents (
  id, document_key, title, document_role, storage_path, physical_page_count,
  checksum, model_tags, source_type, source_record_id, semantic_version_id, provenance
) VALUES (
  '647a9caa-998d-5c9e-8e7f-2a5f238b6e82',
  'barry_v2_manual:5515a627-b195-a760-c61d-6afb04683d5b',
  'u435-25-main-hydraulics',
  'workshop_manual',
  NULL,
  40,
  NULL,
  ARRAY[]::text[],
  'barry_v2_manual',
  '5515a627-b195-a760-c61d-6afb04683d5b',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '{"source":"phase2_backfill","role_reason":"verified barry_v2 manual_type workshop","role_confidence":0.9}'::jsonb
)
ON CONFLICT (semantic_version_id, document_key) DO UPDATE SET
  title = EXCLUDED.title,
  document_role = EXCLUDED.document_role,
  model_tags = EXCLUDED.model_tags,
  provenance = EXCLUDED.provenance,
  updated_at = now();
INSERT INTO public.barry_documents (
  id, document_key, title, document_role, storage_path, physical_page_count,
  checksum, model_tags, source_type, source_record_id, semantic_version_id, provenance
) VALUES (
  '55ddd5a2-3e89-5b97-85be-75b9233135b3',
  'barry_v2_manual:57a444c3-5579-b106-101f-d0ef355bb63c',
  'u435-maint-55-hydraulic-equipment',
  'maintenance_manual',
  NULL,
  3,
  NULL,
  ARRAY[]::text[],
  'barry_v2_manual',
  '57a444c3-5579-b106-101f-d0ef355bb63c',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '{"source":"phase2_backfill","role_reason":"verified u435 maintenance filename convention","role_confidence":0.95}'::jsonb
)
ON CONFLICT (semantic_version_id, document_key) DO UPDATE SET
  title = EXCLUDED.title,
  document_role = EXCLUDED.document_role,
  model_tags = EXCLUDED.model_tags,
  provenance = EXCLUDED.provenance,
  updated_at = now();
INSERT INTO public.barry_documents (
  id, document_key, title, document_role, storage_path, physical_page_count,
  checksum, model_tags, source_type, source_record_id, semantic_version_id, provenance
) VALUES (
  'bf035008-9055-5194-8a8a-9413d0cb5c25',
  'barry_v2_manual:5c259d33-46d1-a74a-ef88-a4fabb23376f',
  '46-steering',
  'workshop_manual',
  NULL,
  18,
  NULL,
  ARRAY[]::text[],
  'barry_v2_manual',
  '5c259d33-46d1-a74a-ef88-a4fabb23376f',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '{"source":"phase2_backfill","role_reason":"verified barry_v2 manual_type workshop","role_confidence":0.9}'::jsonb
)
ON CONFLICT (semantic_version_id, document_key) DO UPDATE SET
  title = EXCLUDED.title,
  document_role = EXCLUDED.document_role,
  model_tags = EXCLUDED.model_tags,
  provenance = EXCLUDED.provenance,
  updated_at = now();
INSERT INTO public.barry_documents (
  id, document_key, title, document_role, storage_path, physical_page_count,
  checksum, model_tags, source_type, source_record_id, semantic_version_id, provenance
) VALUES (
  '9a93c222-9a3d-57b4-8c24-63e6c1b71b09',
  'barry_v2_manual:60b099ef-d15b-81a8-c197-d58310bc23cf',
  'g609-10-overhaul-of-brake-caliper-assemblies',
  'workshop_manual',
  NULL,
  20,
  NULL,
  ARRAY[]::text[],
  'barry_v2_manual',
  '60b099ef-d15b-81a8-c197-d58310bc23cf',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '{"source":"phase2_backfill","role_reason":"verified barry_v2 manual_type workshop","role_confidence":0.9}'::jsonb
)
ON CONFLICT (semantic_version_id, document_key) DO UPDATE SET
  title = EXCLUDED.title,
  document_role = EXCLUDED.document_role,
  model_tags = EXCLUDED.model_tags,
  provenance = EXCLUDED.provenance,
  updated_at = now();
INSERT INTO public.barry_documents (
  id, document_key, title, document_role, storage_path, physical_page_count,
  checksum, model_tags, source_type, source_record_id, semantic_version_id, provenance
) VALUES (
  '3e9da3ce-01c2-5a1f-8c5c-4c4c7538fc53',
  'barry_v2_manual:62cb6721-dae7-e3f6-02a0-08de1ec7f519',
  'u435-maint-60-body-panels',
  'maintenance_manual',
  NULL,
  7,
  NULL,
  ARRAY[]::text[],
  'barry_v2_manual',
  '62cb6721-dae7-e3f6-02a0-08de1ec7f519',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '{"source":"phase2_backfill","role_reason":"verified u435 maintenance filename convention","role_confidence":0.95}'::jsonb
)
ON CONFLICT (semantic_version_id, document_key) DO UPDATE SET
  title = EXCLUDED.title,
  document_role = EXCLUDED.document_role,
  model_tags = EXCLUDED.model_tags,
  provenance = EXCLUDED.provenance,
  updated_at = now();
INSERT INTO public.barry_documents (
  id, document_key, title, document_role, storage_path, physical_page_count,
  checksum, model_tags, source_type, source_record_id, semantic_version_id, provenance
) VALUES (
  '5061d4f2-c6e7-5071-8758-f3f2443e87dc',
  'barry_v2_manual:7147712a-37e0-b066-2067-672767b2b617',
  'u435-18-steering',
  'workshop_manual',
  NULL,
  20,
  NULL,
  ARRAY[]::text[],
  'barry_v2_manual',
  '7147712a-37e0-b066-2067-672767b2b617',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '{"source":"phase2_backfill","role_reason":"verified barry_v2 manual_type workshop","role_confidence":0.9}'::jsonb
)
ON CONFLICT (semantic_version_id, document_key) DO UPDATE SET
  title = EXCLUDED.title,
  document_role = EXCLUDED.document_role,
  model_tags = EXCLUDED.model_tags,
  provenance = EXCLUDED.provenance,
  updated_at = now();
INSERT INTO public.barry_documents (
  id, document_key, title, document_role, storage_path, physical_page_count,
  checksum, model_tags, source_type, source_record_id, semantic_version_id, provenance
) VALUES (
  '4d114eb9-8233-5a9f-81cd-6f485b6c504c',
  'barry_v2_manual:74b276dd-18e7-6863-d16e-1bc5b93c5de3',
  'u435-02-engine-overview',
  'workshop_manual',
  NULL,
  66,
  NULL,
  ARRAY[]::text[],
  'barry_v2_manual',
  '74b276dd-18e7-6863-d16e-1bc5b93c5de3',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '{"source":"phase2_backfill","role_reason":"verified barry_v2 manual_type workshop","role_confidence":0.9}'::jsonb
)
ON CONFLICT (semantic_version_id, document_key) DO UPDATE SET
  title = EXCLUDED.title,
  document_role = EXCLUDED.document_role,
  model_tags = EXCLUDED.model_tags,
  provenance = EXCLUDED.provenance,
  updated_at = now();
INSERT INTO public.barry_documents (
  id, document_key, title, document_role, storage_path, physical_page_count,
  checksum, model_tags, source_type, source_record_id, semantic_version_id, provenance
) VALUES (
  '7b726d34-d8db-5921-8d1a-d91e44e71aa6',
  'barry_v2_manual:7642b198-b2ad-090e-91d6-5b464724bc7f',
  'u435-maint-00-general-maintenance',
  'maintenance_manual',
  NULL,
  34,
  NULL,
  ARRAY[]::text[],
  'barry_v2_manual',
  '7642b198-b2ad-090e-91d6-5b464724bc7f',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '{"source":"phase2_backfill","role_reason":"verified u435 maintenance filename convention","role_confidence":0.95}'::jsonb
)
ON CONFLICT (semantic_version_id, document_key) DO UPDATE SET
  title = EXCLUDED.title,
  document_role = EXCLUDED.document_role,
  model_tags = EXCLUDED.model_tags,
  provenance = EXCLUDED.provenance,
  updated_at = now();
INSERT INTO public.barry_documents (
  id, document_key, title, document_role, storage_path, physical_page_count,
  checksum, model_tags, source_type, source_record_id, semantic_version_id, provenance
) VALUES (
  '81108ab6-109f-5410-80c6-6fe41c47ac72',
  'barry_v2_manual:766cbddc-023b-1ba5-d15a-dda0de56375f',
  'u435-maint-49-exhaust',
  'maintenance_manual',
  NULL,
  2,
  NULL,
  ARRAY[]::text[],
  'barry_v2_manual',
  '766cbddc-023b-1ba5-d15a-dda0de56375f',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '{"source":"phase2_backfill","role_reason":"verified u435 maintenance filename convention","role_confidence":0.95}'::jsonb
)
ON CONFLICT (semantic_version_id, document_key) DO UPDATE SET
  title = EXCLUDED.title,
  document_role = EXCLUDED.document_role,
  model_tags = EXCLUDED.model_tags,
  provenance = EXCLUDED.provenance,
  updated_at = now();
INSERT INTO public.barry_documents (
  id, document_key, title, document_role, storage_path, physical_page_count,
  checksum, model_tags, source_type, source_record_id, semantic_version_id, provenance
) VALUES (
  '6b4cfcfc-1963-510a-862a-8b9ed5990e89',
  'barry_v2_manual:7df32808-5601-2478-0958-fb7b8180a42b',
  '25-clutch',
  'workshop_manual',
  NULL,
  20,
  NULL,
  ARRAY[]::text[],
  'barry_v2_manual',
  '7df32808-5601-2478-0958-fb7b8180a42b',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '{"source":"phase2_backfill","role_reason":"verified barry_v2 manual_type workshop","role_confidence":0.9}'::jsonb
)
ON CONFLICT (semantic_version_id, document_key) DO UPDATE SET
  title = EXCLUDED.title,
  document_role = EXCLUDED.document_role,
  model_tags = EXCLUDED.model_tags,
  provenance = EXCLUDED.provenance,
  updated_at = now();
INSERT INTO public.barry_documents (
  id, document_key, title, document_role, storage_path, physical_page_count,
  checksum, model_tags, source_type, source_record_id, semantic_version_id, provenance
) VALUES (
  'c0ad4753-d4ea-5191-8d92-84f0905264f2',
  'barry_v2_manual:7e326638-a636-89a9-bcf3-f277d1cb681c',
  'u435-maint-55-mechanical-equipment',
  'maintenance_manual',
  NULL,
  3,
  NULL,
  ARRAY[]::text[],
  'barry_v2_manual',
  '7e326638-a636-89a9-bcf3-f277d1cb681c',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '{"source":"phase2_backfill","role_reason":"verified u435 maintenance filename convention","role_confidence":0.95}'::jsonb
)
ON CONFLICT (semantic_version_id, document_key) DO UPDATE SET
  title = EXCLUDED.title,
  document_role = EXCLUDED.document_role,
  model_tags = EXCLUDED.model_tags,
  provenance = EXCLUDED.provenance,
  updated_at = now();
INSERT INTO public.barry_documents (
  id, document_key, title, document_role, storage_path, physical_page_count,
  checksum, model_tags, source_type, source_record_id, semantic_version_id, provenance
) VALUES (
  '66161869-d104-5bec-8b8a-147ac0bf56af',
  'barry_v2_manual:819f15c7-f911-d845-9fc4-4e5392574ee5',
  'u435-maint-07-fuel-injectors',
  'maintenance_manual',
  NULL,
  5,
  NULL,
  ARRAY[]::text[],
  'barry_v2_manual',
  '819f15c7-f911-d845-9fc4-4e5392574ee5',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '{"source":"phase2_backfill","role_reason":"verified u435 maintenance filename convention","role_confidence":0.95}'::jsonb
)
ON CONFLICT (semantic_version_id, document_key) DO UPDATE SET
  title = EXCLUDED.title,
  document_role = EXCLUDED.document_role,
  model_tags = EXCLUDED.model_tags,
  provenance = EXCLUDED.provenance,
  updated_at = now();
INSERT INTO public.barry_documents (
  id, document_key, title, document_role, storage_path, physical_page_count,
  checksum, model_tags, source_type, source_record_id, semantic_version_id, provenance
) VALUES (
  '46a7358b-83bb-5e3b-80c5-6fef83246632',
  'barry_v2_manual:86d34ca4-3b7c-536c-dbe3-adc9f036c703',
  'u435-01-general',
  'workshop_manual',
  NULL,
  12,
  NULL,
  ARRAY[]::text[],
  'barry_v2_manual',
  '86d34ca4-3b7c-536c-dbe3-adc9f036c703',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '{"source":"phase2_backfill","role_reason":"verified barry_v2 manual_type workshop","role_confidence":0.9}'::jsonb
)
ON CONFLICT (semantic_version_id, document_key) DO UPDATE SET
  title = EXCLUDED.title,
  document_role = EXCLUDED.document_role,
  model_tags = EXCLUDED.model_tags,
  provenance = EXCLUDED.provenance,
  updated_at = now();
INSERT INTO public.barry_documents (
  id, document_key, title, document_role, storage_path, physical_page_count,
  checksum, model_tags, source_type, source_record_id, semantic_version_id, provenance
) VALUES (
  '4efe209d-5fe0-51e4-83b1-97453a3b1238',
  'barry_v2_manual:875342cd-374c-b385-5d66-57c628fcf9eb',
  '33-front-axle',
  'workshop_manual',
  NULL,
  30,
  NULL,
  ARRAY[]::text[],
  'barry_v2_manual',
  '875342cd-374c-b385-5d66-57c628fcf9eb',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '{"source":"phase2_backfill","role_reason":"verified barry_v2 manual_type workshop","role_confidence":0.9}'::jsonb
)
ON CONFLICT (semantic_version_id, document_key) DO UPDATE SET
  title = EXCLUDED.title,
  document_role = EXCLUDED.document_role,
  model_tags = EXCLUDED.model_tags,
  provenance = EXCLUDED.provenance,
  updated_at = now();
INSERT INTO public.barry_documents (
  id, document_key, title, document_role, storage_path, physical_page_count,
  checksum, model_tags, source_type, source_record_id, semantic_version_id, provenance
) VALUES (
  'a9bd8227-4758-5a8b-87b6-fe7bed93bbd6',
  'barry_v2_manual:97171890-2972-b2a4-645c-d925e1fdbd4c',
  'u435-maint-54-batteries',
  'maintenance_manual',
  NULL,
  3,
  NULL,
  ARRAY[]::text[],
  'barry_v2_manual',
  '97171890-2972-b2a4-645c-d925e1fdbd4c',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '{"source":"phase2_backfill","role_reason":"verified u435 maintenance filename convention","role_confidence":0.95}'::jsonb
)
ON CONFLICT (semantic_version_id, document_key) DO UPDATE SET
  title = EXCLUDED.title,
  document_role = EXCLUDED.document_role,
  model_tags = EXCLUDED.model_tags,
  provenance = EXCLUDED.provenance,
  updated_at = now();
INSERT INTO public.barry_documents (
  id, document_key, title, document_role, storage_path, physical_page_count,
  checksum, model_tags, source_type, source_record_id, semantic_version_id, provenance
) VALUES (
  'ba29d475-ac41-562d-883a-059f3262b536',
  'barry_v2_manual:9ba1297a-2aa6-de38-b971-ad38336442ad',
  'u1700lunimog435sm',
  'workshop_manual',
  NULL,
  1185,
  NULL,
  ARRAY[]::text[],
  'barry_v2_manual',
  '9ba1297a-2aa6-de38-b971-ad38336442ad',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '{"source":"phase2_backfill","role_reason":"verified barry_v2 manual_type workshop","role_confidence":0.9}'::jsonb
)
ON CONFLICT (semantic_version_id, document_key) DO UPDATE SET
  title = EXCLUDED.title,
  document_role = EXCLUDED.document_role,
  model_tags = EXCLUDED.model_tags,
  provenance = EXCLUDED.provenance,
  updated_at = now();
INSERT INTO public.barry_documents (
  id, document_key, title, document_role, storage_path, physical_page_count,
  checksum, model_tags, source_type, source_record_id, semantic_version_id, provenance
) VALUES (
  '37b31486-d909-5cb6-825c-4873f7556e54',
  'barry_v2_manual:9c574bb2-bfb3-6aec-7f68-618d64e501fb',
  'u435-05-lubrication',
  'workshop_manual',
  NULL,
  11,
  NULL,
  ARRAY[]::text[],
  'barry_v2_manual',
  '9c574bb2-bfb3-6aec-7f68-618d64e501fb',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '{"source":"phase2_backfill","role_reason":"verified barry_v2 manual_type workshop","role_confidence":0.9}'::jsonb
)
ON CONFLICT (semantic_version_id, document_key) DO UPDATE SET
  title = EXCLUDED.title,
  document_role = EXCLUDED.document_role,
  model_tags = EXCLUDED.model_tags,
  provenance = EXCLUDED.provenance,
  updated_at = now();
INSERT INTO public.barry_documents (
  id, document_key, title, document_role, storage_path, physical_page_count,
  checksum, model_tags, source_type, source_record_id, semantic_version_id, provenance
) VALUES (
  'fea2a3a2-8246-5de9-8024-426296cf31ac',
  'barry_v2_manual:9c637afc-833c-b321-5c0c-1af28e14e9c1',
  '32-suspension',
  'workshop_manual',
  NULL,
  27,
  NULL,
  ARRAY[]::text[],
  'barry_v2_manual',
  '9c637afc-833c-b321-5c0c-1af28e14e9c1',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '{"source":"phase2_backfill","role_reason":"verified barry_v2 manual_type workshop","role_confidence":0.9}'::jsonb
)
ON CONFLICT (semantic_version_id, document_key) DO UPDATE SET
  title = EXCLUDED.title,
  document_role = EXCLUDED.document_role,
  model_tags = EXCLUDED.model_tags,
  provenance = EXCLUDED.provenance,
  updated_at = now();
INSERT INTO public.barry_documents (
  id, document_key, title, document_role, storage_path, physical_page_count,
  checksum, model_tags, source_type, source_record_id, semantic_version_id, provenance
) VALUES (
  '27445743-0b8a-569c-8558-c6a3c3b87415',
  'barry_v2_manual:9ec241b0-84da-6c01-8375-bd9b19c9f9d0',
  'u435-maint-13-belt-system',
  'maintenance_manual',
  NULL,
  5,
  NULL,
  ARRAY[]::text[],
  'barry_v2_manual',
  '9ec241b0-84da-6c01-8375-bd9b19c9f9d0',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '{"source":"phase2_backfill","role_reason":"verified u435 maintenance filename convention","role_confidence":0.95}'::jsonb
)
ON CONFLICT (semantic_version_id, document_key) DO UPDATE SET
  title = EXCLUDED.title,
  document_role = EXCLUDED.document_role,
  model_tags = EXCLUDED.model_tags,
  provenance = EXCLUDED.provenance,
  updated_at = now();
INSERT INTO public.barry_documents (
  id, document_key, title, document_role, storage_path, physical_page_count,
  checksum, model_tags, source_type, source_record_id, semantic_version_id, provenance
) VALUES (
  '37961f5d-eed7-59fc-8c5f-a958b1edf8b1',
  'barry_v2_manual:9efc3c02-bf91-0aae-c72d-0dd708c0cfa0',
  '35-rear-axle',
  'workshop_manual',
  NULL,
  30,
  NULL,
  ARRAY[]::text[],
  'barry_v2_manual',
  '9efc3c02-bf91-0aae-c72d-0dd708c0cfa0',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '{"source":"phase2_backfill","role_reason":"verified barry_v2 manual_type workshop","role_confidence":0.9}'::jsonb
)
ON CONFLICT (semantic_version_id, document_key) DO UPDATE SET
  title = EXCLUDED.title,
  document_role = EXCLUDED.document_role,
  model_tags = EXCLUDED.model_tags,
  provenance = EXCLUDED.provenance,
  updated_at = now();
INSERT INTO public.barry_documents (
  id, document_key, title, document_role, storage_path, physical_page_count,
  checksum, model_tags, source_type, source_record_id, semantic_version_id, provenance
) VALUES (
  '81e92f16-9a0a-527c-8982-7ab0401eff79',
  'barry_v2_manual:a3f46e05-c705-70df-d45a-8a2407f31fe8',
  'u435-maint-26-transmission',
  'maintenance_manual',
  NULL,
  4,
  NULL,
  ARRAY[]::text[],
  'barry_v2_manual',
  'a3f46e05-c705-70df-d45a-8a2407f31fe8',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '{"source":"phase2_backfill","role_reason":"verified u435 maintenance filename convention","role_confidence":0.95}'::jsonb
)
ON CONFLICT (semantic_version_id, document_key) DO UPDATE SET
  title = EXCLUDED.title,
  document_role = EXCLUDED.document_role,
  model_tags = EXCLUDED.model_tags,
  provenance = EXCLUDED.provenance,
  updated_at = now();
INSERT INTO public.barry_documents (
  id, document_key, title, document_role, storage_path, physical_page_count,
  checksum, model_tags, source_type, source_record_id, semantic_version_id, provenance
) VALUES (
  'fd20bfd8-27ef-563c-8566-ace8c437a073',
  'barry_v2_manual:a5cf162d-c03f-1ef7-292c-a9899c19b33e',
  'rps-02202-unimog-gs-with-twist-locks',
  'parts_catalog',
  NULL,
  59,
  NULL,
  ARRAY[]::text[],
  'barry_v2_manual',
  'a5cf162d-c03f-1ef7-292c-a9899c19b33e',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '{"source":"phase2_backfill","role_reason":"verified RPS parts catalogue identity","role_confidence":0.95}'::jsonb
)
ON CONFLICT (semantic_version_id, document_key) DO UPDATE SET
  title = EXCLUDED.title,
  document_role = EXCLUDED.document_role,
  model_tags = EXCLUDED.model_tags,
  provenance = EXCLUDED.provenance,
  updated_at = now();
INSERT INTO public.barry_documents (
  id, document_key, title, document_role, storage_path, physical_page_count,
  checksum, model_tags, source_type, source_record_id, semantic_version_id, provenance
) VALUES (
  '597b486b-2047-5aba-847b-74696d0ce018',
  'barry_v2_manual:aa9b3abc-b872-a9cc-8630-da3fd38f394c',
  'u435-maint-55-electrical-equipment',
  'maintenance_manual',
  NULL,
  3,
  NULL,
  ARRAY[]::text[],
  'barry_v2_manual',
  'aa9b3abc-b872-a9cc-8630-da3fd38f394c',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '{"source":"phase2_backfill","role_reason":"verified u435 maintenance filename convention","role_confidence":0.95}'::jsonb
)
ON CONFLICT (semantic_version_id, document_key) DO UPDATE SET
  title = EXCLUDED.title,
  document_role = EXCLUDED.document_role,
  model_tags = EXCLUDED.model_tags,
  provenance = EXCLUDED.provenance,
  updated_at = now();
INSERT INTO public.barry_documents (
  id, document_key, title, document_role, storage_path, physical_page_count,
  checksum, model_tags, source_type, source_record_id, semantic_version_id, provenance
) VALUES (
  '140b7816-1bba-5cef-8d89-46a3657535a5',
  'barry_v2_manual:aec21e79-469a-f198-15d1-3e598630eb02',
  'u435-41-heater-eberspacher',
  'workshop_manual',
  NULL,
  32,
  NULL,
  ARRAY[]::text[],
  'barry_v2_manual',
  'aec21e79-469a-f198-15d1-3e598630eb02',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '{"source":"phase2_backfill","role_reason":"verified barry_v2 manual_type workshop","role_confidence":0.9}'::jsonb
)
ON CONFLICT (semantic_version_id, document_key) DO UPDATE SET
  title = EXCLUDED.title,
  document_role = EXCLUDED.document_role,
  model_tags = EXCLUDED.model_tags,
  provenance = EXCLUDED.provenance,
  updated_at = now();
INSERT INTO public.barry_documents (
  id, document_key, title, document_role, storage_path, physical_page_count,
  checksum, model_tags, source_type, source_record_id, semantic_version_id, provenance
) VALUES (
  '934f6f76-ec77-5743-805f-d639487b8efe',
  'barry_v2_manual:af332a3b-25a2-3589-3a79-e73507003464',
  'unimog435sm-u1700l',
  'workshop_manual',
  NULL,
  1185,
  NULL,
  ARRAY[]::text[],
  'barry_v2_manual',
  'af332a3b-25a2-3589-3a79-e73507003464',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '{"source":"phase2_backfill","role_reason":"verified barry_v2 manual_type workshop","role_confidence":0.9}'::jsonb
)
ON CONFLICT (semantic_version_id, document_key) DO UPDATE SET
  title = EXCLUDED.title,
  document_role = EXCLUDED.document_role,
  model_tags = EXCLUDED.model_tags,
  provenance = EXCLUDED.provenance,
  updated_at = now();
INSERT INTO public.barry_documents (
  id, document_key, title, document_role, storage_path, physical_page_count,
  checksum, model_tags, source_type, source_record_id, semantic_version_id, provenance
) VALUES (
  'b04e15e4-5be6-5e2a-8fd0-90d725033f5c',
  'barry_v2_manual:afa937e5-066a-3f05-31be-b2c9ae6a648d',
  '43-brakes-pneumatic',
  'workshop_manual',
  NULL,
  40,
  NULL,
  ARRAY[]::text[],
  'barry_v2_manual',
  'afa937e5-066a-3f05-31be-b2c9ae6a648d',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '{"source":"phase2_backfill","role_reason":"verified barry_v2 manual_type workshop","role_confidence":0.9}'::jsonb
)
ON CONFLICT (semantic_version_id, document_key) DO UPDATE SET
  title = EXCLUDED.title,
  document_role = EXCLUDED.document_role,
  model_tags = EXCLUDED.model_tags,
  provenance = EXCLUDED.provenance,
  updated_at = now();
INSERT INTO public.barry_documents (
  id, document_key, title, document_role, storage_path, physical_page_count,
  checksum, model_tags, source_type, source_record_id, semantic_version_id, provenance
) VALUES (
  '15644b9d-e531-5735-82d3-64d75c7ad518',
  'barry_v2_manual:b1db6ae4-c1cf-ae69-1399-0cd6ab217d1f',
  'u435-12-front-axle-drive',
  'workshop_manual',
  NULL,
  48,
  NULL,
  ARRAY[]::text[],
  'barry_v2_manual',
  'b1db6ae4-c1cf-ae69-1399-0cd6ab217d1f',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '{"source":"phase2_backfill","role_reason":"verified barry_v2 manual_type workshop","role_confidence":0.9}'::jsonb
)
ON CONFLICT (semantic_version_id, document_key) DO UPDATE SET
  title = EXCLUDED.title,
  document_role = EXCLUDED.document_role,
  model_tags = EXCLUDED.model_tags,
  provenance = EXCLUDED.provenance,
  updated_at = now();
INSERT INTO public.barry_documents (
  id, document_key, title, document_role, storage_path, physical_page_count,
  checksum, model_tags, source_type, source_record_id, semantic_version_id, provenance
) VALUES (
  '19556793-fcfa-5746-8add-d1492c572265',
  'barry_v2_manual:b456c37e-3ce4-99f6-2965-3e45699a8367',
  'unimog-compressor',
  'workshop_manual',
  NULL,
  3,
  NULL,
  ARRAY[]::text[],
  'barry_v2_manual',
  'b456c37e-3ce4-99f6-2965-3e45699a8367',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '{"source":"phase2_backfill","role_reason":"verified barry_v2 manual_type workshop","role_confidence":0.9}'::jsonb
)
ON CONFLICT (semantic_version_id, document_key) DO UPDATE SET
  title = EXCLUDED.title,
  document_role = EXCLUDED.document_role,
  model_tags = EXCLUDED.model_tags,
  provenance = EXCLUDED.provenance,
  updated_at = now();
INSERT INTO public.barry_documents (
  id, document_key, title, document_role, storage_path, physical_page_count,
  checksum, model_tags, source_type, source_record_id, semantic_version_id, provenance
) VALUES (
  '12769798-7cd6-5071-8fc0-c091fb844426',
  'barry_v2_manual:b8d0544d-0fea-38fe-e986-b0c291b7d84a',
  'u435-maint-18-engine-lubrication',
  'maintenance_manual',
  NULL,
  4,
  NULL,
  ARRAY[]::text[],
  'barry_v2_manual',
  'b8d0544d-0fea-38fe-e986-b0c291b7d84a',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '{"source":"phase2_backfill","role_reason":"verified u435 maintenance filename convention","role_confidence":0.95}'::jsonb
)
ON CONFLICT (semantic_version_id, document_key) DO UPDATE SET
  title = EXCLUDED.title,
  document_role = EXCLUDED.document_role,
  model_tags = EXCLUDED.model_tags,
  provenance = EXCLUDED.provenance,
  updated_at = now();
INSERT INTO public.barry_documents (
  id, document_key, title, document_role, storage_path, physical_page_count,
  checksum, model_tags, source_type, source_record_id, semantic_version_id, provenance
) VALUES (
  'a92b9bbb-8227-5d06-8ce1-bcaa2583751a',
  'barry_v2_manual:bc083a17-9129-1294-f2a3-aa636047c3ca',
  'u435-19-wheel-hub-front',
  'workshop_manual',
  NULL,
  14,
  NULL,
  ARRAY[]::text[],
  'barry_v2_manual',
  'bc083a17-9129-1294-f2a3-aa636047c3ca',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '{"source":"phase2_backfill","role_reason":"verified barry_v2 manual_type workshop","role_confidence":0.9}'::jsonb
)
ON CONFLICT (semantic_version_id, document_key) DO UPDATE SET
  title = EXCLUDED.title,
  document_role = EXCLUDED.document_role,
  model_tags = EXCLUDED.model_tags,
  provenance = EXCLUDED.provenance,
  updated_at = now();
INSERT INTO public.barry_documents (
  id, document_key, title, document_role, storage_path, physical_page_count,
  checksum, model_tags, source_type, source_record_id, semantic_version_id, provenance
) VALUES (
  '1c8bf315-1b6a-573a-8687-1dcc3f3ff907',
  'barry_v2_manual:bd6617c8-178e-b10b-0103-e9817b59559c',
  'u435-24-parking-brake',
  'workshop_manual',
  NULL,
  15,
  NULL,
  ARRAY[]::text[],
  'barry_v2_manual',
  'bd6617c8-178e-b10b-0103-e9817b59559c',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '{"source":"phase2_backfill","role_reason":"verified barry_v2 manual_type workshop","role_confidence":0.9}'::jsonb
)
ON CONFLICT (semantic_version_id, document_key) DO UPDATE SET
  title = EXCLUDED.title,
  document_role = EXCLUDED.document_role,
  model_tags = EXCLUDED.model_tags,
  provenance = EXCLUDED.provenance,
  updated_at = now();
INSERT INTO public.barry_documents (
  id, document_key, title, document_role, storage_path, physical_page_count,
  checksum, model_tags, source_type, source_record_id, semantic_version_id, provenance
) VALUES (
  'a4b2db98-2939-5a0e-89a3-19b5c119888e',
  'barry_v2_manual:bd87c3e6-2141-eaa8-367a-27495d86eaec',
  'u435-maint-42-brakes-hydraulic',
  'maintenance_manual',
  NULL,
  8,
  NULL,
  ARRAY[]::text[],
  'barry_v2_manual',
  'bd87c3e6-2141-eaa8-367a-27495d86eaec',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '{"source":"phase2_backfill","role_reason":"verified u435 maintenance filename convention","role_confidence":0.95}'::jsonb
)
ON CONFLICT (semantic_version_id, document_key) DO UPDATE SET
  title = EXCLUDED.title,
  document_role = EXCLUDED.document_role,
  model_tags = EXCLUDED.model_tags,
  provenance = EXCLUDED.provenance,
  updated_at = now();
INSERT INTO public.barry_documents (
  id, document_key, title, document_role, storage_path, physical_page_count,
  checksum, model_tags, source_type, source_record_id, semantic_version_id, provenance
) VALUES (
  '431b6ffc-aaf5-5def-8228-233444204955',
  'barry_v2_manual:bedf1adb-421c-1d0b-7ad0-3b075e475a2c',
  'u435-maint-60-cab-structure',
  'maintenance_manual',
  NULL,
  4,
  NULL,
  ARRAY[]::text[],
  'barry_v2_manual',
  'bedf1adb-421c-1d0b-7ad0-3b075e475a2c',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '{"source":"phase2_backfill","role_reason":"verified u435 maintenance filename convention","role_confidence":0.95}'::jsonb
)
ON CONFLICT (semantic_version_id, document_key) DO UPDATE SET
  title = EXCLUDED.title,
  document_role = EXCLUDED.document_role,
  model_tags = EXCLUDED.model_tags,
  provenance = EXCLUDED.provenance,
  updated_at = now();
INSERT INTO public.barry_documents (
  id, document_key, title, document_role, storage_path, physical_page_count,
  checksum, model_tags, source_type, source_record_id, semantic_version_id, provenance
) VALUES (
  'a080c666-a1a6-5ba4-85f0-ddf11daa7cd8',
  'barry_v2_manual:bf6cb076-5bdc-648c-8713-fa23835717d2',
  'u435-13-rear-axle-drive',
  'workshop_manual',
  NULL,
  30,
  NULL,
  ARRAY[]::text[],
  'barry_v2_manual',
  'bf6cb076-5bdc-648c-8713-fa23835717d2',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '{"source":"phase2_backfill","role_reason":"verified barry_v2 manual_type workshop","role_confidence":0.9}'::jsonb
)
ON CONFLICT (semantic_version_id, document_key) DO UPDATE SET
  title = EXCLUDED.title,
  document_role = EXCLUDED.document_role,
  model_tags = EXCLUDED.model_tags,
  provenance = EXCLUDED.provenance,
  updated_at = now();
INSERT INTO public.barry_documents (
  id, document_key, title, document_role, storage_path, physical_page_count,
  checksum, model_tags, source_type, source_record_id, semantic_version_id, provenance
) VALUES (
  'b02db2af-9425-53a7-863f-a943fb41101f',
  'barry_v2_manual:c1bd0351-a608-90bd-350d-f595adf7c8f7',
  'u435-maint-24-engine-mounts',
  'maintenance_manual',
  NULL,
  3,
  NULL,
  ARRAY[]::text[],
  'barry_v2_manual',
  'c1bd0351-a608-90bd-350d-f595adf7c8f7',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '{"source":"phase2_backfill","role_reason":"verified u435 maintenance filename convention","role_confidence":0.95}'::jsonb
)
ON CONFLICT (semantic_version_id, document_key) DO UPDATE SET
  title = EXCLUDED.title,
  document_role = EXCLUDED.document_role,
  model_tags = EXCLUDED.model_tags,
  provenance = EXCLUDED.provenance,
  updated_at = now();
INSERT INTO public.barry_documents (
  id, document_key, title, document_role, storage_path, physical_page_count,
  checksum, model_tags, source_type, source_record_id, semantic_version_id, provenance
) VALUES (
  'df58c9e8-f2d2-565a-8876-cd3a1ab7d919',
  'barry_v2_manual:c2710e75-c5b1-24ab-abc4-fb48c0cf2a3f',
  '42-brakes-hydraulic-mechanical',
  'workshop_manual',
  NULL,
  27,
  NULL,
  ARRAY[]::text[],
  'barry_v2_manual',
  'c2710e75-c5b1-24ab-abc4-fb48c0cf2a3f',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '{"source":"phase2_backfill","role_reason":"verified barry_v2 manual_type workshop","role_confidence":0.9}'::jsonb
)
ON CONFLICT (semantic_version_id, document_key) DO UPDATE SET
  title = EXCLUDED.title,
  document_role = EXCLUDED.document_role,
  model_tags = EXCLUDED.model_tags,
  provenance = EXCLUDED.provenance,
  updated_at = now();
INSERT INTO public.barry_documents (
  id, document_key, title, document_role, storage_path, physical_page_count,
  checksum, model_tags, source_type, source_record_id, semantic_version_id, provenance
) VALUES (
  '69d20861-5855-5ecf-85db-8edcca07ec76',
  'barry_v2_manual:c3b92424-28a5-45cb-5daf-c3fe4a67b52d',
  '40-wheels-prop-shafts',
  'workshop_manual',
  NULL,
  15,
  NULL,
  ARRAY[]::text[],
  'barry_v2_manual',
  'c3b92424-28a5-45cb-5daf-c3fe4a67b52d',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '{"source":"phase2_backfill","role_reason":"verified barry_v2 manual_type workshop","role_confidence":0.9}'::jsonb
)
ON CONFLICT (semantic_version_id, document_key) DO UPDATE SET
  title = EXCLUDED.title,
  document_role = EXCLUDED.document_role,
  model_tags = EXCLUDED.model_tags,
  provenance = EXCLUDED.provenance,
  updated_at = now();
INSERT INTO public.barry_documents (
  id, document_key, title, document_role, storage_path, physical_page_count,
  checksum, model_tags, source_type, source_record_id, semantic_version_id, provenance
) VALUES (
  'eadc5378-3eb2-5f6b-88f3-da883d188f3e',
  'barry_v2_manual:c5350f3a-92be-72ef-ba72-980aa847e987',
  'u435-06-cooling-system',
  'workshop_manual',
  NULL,
  4,
  NULL,
  ARRAY[]::text[],
  'barry_v2_manual',
  'c5350f3a-92be-72ef-ba72-980aa847e987',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '{"source":"phase2_backfill","role_reason":"verified barry_v2 manual_type workshop","role_confidence":0.9}'::jsonb
)
ON CONFLICT (semantic_version_id, document_key) DO UPDATE SET
  title = EXCLUDED.title,
  document_role = EXCLUDED.document_role,
  model_tags = EXCLUDED.model_tags,
  provenance = EXCLUDED.provenance,
  updated_at = now();
INSERT INTO public.barry_documents (
  id, document_key, title, document_role, storage_path, physical_page_count,
  checksum, model_tags, source_type, source_record_id, semantic_version_id, provenance
) VALUES (
  '97caca23-e37a-5efd-8746-ffb8f41f4b79',
  'barry_v2_manual:c8c12409-81b8-6063-39d5-b098718ebdf6',
  'u435-22-wheel-hub-rear',
  'workshop_manual',
  NULL,
  10,
  NULL,
  ARRAY[]::text[],
  'barry_v2_manual',
  'c8c12409-81b8-6063-39d5-b098718ebdf6',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '{"source":"phase2_backfill","role_reason":"verified barry_v2 manual_type workshop","role_confidence":0.9}'::jsonb
)
ON CONFLICT (semantic_version_id, document_key) DO UPDATE SET
  title = EXCLUDED.title,
  document_role = EXCLUDED.document_role,
  model_tags = EXCLUDED.model_tags,
  provenance = EXCLUDED.provenance,
  updated_at = now();
INSERT INTO public.barry_documents (
  id, document_key, title, document_role, storage_path, physical_page_count,
  checksum, model_tags, source_type, source_record_id, semantic_version_id, provenance
) VALUES (
  'e21a9b83-ce1f-5e2d-88f5-d24e49e04ff1',
  'barry_v2_manual:ca331116-f04b-e916-d355-6779e2134d78',
  '29-pedal-linkage',
  'workshop_manual',
  NULL,
  15,
  NULL,
  ARRAY[]::text[],
  'barry_v2_manual',
  'ca331116-f04b-e916-d355-6779e2134d78',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '{"source":"phase2_backfill","role_reason":"verified barry_v2 manual_type workshop","role_confidence":0.9}'::jsonb
)
ON CONFLICT (semantic_version_id, document_key) DO UPDATE SET
  title = EXCLUDED.title,
  document_role = EXCLUDED.document_role,
  model_tags = EXCLUDED.model_tags,
  provenance = EXCLUDED.provenance,
  updated_at = now();
INSERT INTO public.barry_documents (
  id, document_key, title, document_role, storage_path, physical_page_count,
  checksum, model_tags, source_type, source_record_id, semantic_version_id, provenance
) VALUES (
  '74d7e0ca-f7be-5808-8c76-105bb47e5579',
  'barry_v2_manual:ce251911-254c-3f8e-92b7-4b9e1f43c07f',
  'u435-maint-0-foreward',
  'maintenance_manual',
  NULL,
  1,
  NULL,
  ARRAY[]::text[],
  'barry_v2_manual',
  'ce251911-254c-3f8e-92b7-4b9e1f43c07f',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '{"source":"phase2_backfill","role_reason":"verified u435 maintenance filename convention","role_confidence":0.95}'::jsonb
)
ON CONFLICT (semantic_version_id, document_key) DO UPDATE SET
  title = EXCLUDED.title,
  document_role = EXCLUDED.document_role,
  model_tags = EXCLUDED.model_tags,
  provenance = EXCLUDED.provenance,
  updated_at = now();
INSERT INTO public.barry_documents (
  id, document_key, title, document_role, storage_path, physical_page_count,
  checksum, model_tags, source_type, source_record_id, semantic_version_id, provenance
) VALUES (
  '9857111d-c5f7-5b5a-8dff-64673eb5ea68',
  'barry_v2_manual:d17395b8-2454-f688-2a2e-75a407d42d0b',
  'u435-10-transfer-case',
  'workshop_manual',
  NULL,
  50,
  NULL,
  ARRAY[]::text[],
  'barry_v2_manual',
  'd17395b8-2454-f688-2a2e-75a407d42d0b',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '{"source":"phase2_backfill","role_reason":"verified barry_v2 manual_type workshop","role_confidence":0.9}'::jsonb
)
ON CONFLICT (semantic_version_id, document_key) DO UPDATE SET
  title = EXCLUDED.title,
  document_role = EXCLUDED.document_role,
  model_tags = EXCLUDED.model_tags,
  provenance = EXCLUDED.provenance,
  updated_at = now();
INSERT INTO public.barry_documents (
  id, document_key, title, document_role, storage_path, physical_page_count,
  checksum, model_tags, source_type, source_record_id, semantic_version_id, provenance
) VALUES (
  '4f786536-f640-575e-85b5-e5866d6d657d',
  'barry_v2_manual:e211d412-e728-c764-92cd-4b285a41ef58',
  'u435-maint-60-seats-interior',
  'maintenance_manual',
  NULL,
  4,
  NULL,
  ARRAY[]::text[],
  'barry_v2_manual',
  'e211d412-e728-c764-92cd-4b285a41ef58',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '{"source":"phase2_backfill","role_reason":"verified u435 maintenance filename convention","role_confidence":0.95}'::jsonb
)
ON CONFLICT (semantic_version_id, document_key) DO UPDATE SET
  title = EXCLUDED.title,
  document_role = EXCLUDED.document_role,
  model_tags = EXCLUDED.model_tags,
  provenance = EXCLUDED.provenance,
  updated_at = now();
INSERT INTO public.barry_documents (
  id, document_key, title, document_role, storage_path, physical_page_count,
  checksum, model_tags, source_type, source_record_id, semantic_version_id, provenance
) VALUES (
  'de62ad9d-8a6c-5a60-8be1-b2dded8ce579',
  'barry_v2_manual:e771b790-1324-d251-4115-cf01032a210c',
  'u435-maint-29-pedal-linkage',
  'maintenance_manual',
  NULL,
  3,
  NULL,
  ARRAY[]::text[],
  'barry_v2_manual',
  'e771b790-1324-d251-4115-cf01032a210c',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '{"source":"phase2_backfill","role_reason":"verified u435 maintenance filename convention","role_confidence":0.95}'::jsonb
)
ON CONFLICT (semantic_version_id, document_key) DO UPDATE SET
  title = EXCLUDED.title,
  document_role = EXCLUDED.document_role,
  model_tags = EXCLUDED.model_tags,
  provenance = EXCLUDED.provenance,
  updated_at = now();
INSERT INTO public.barry_documents (
  id, document_key, title, document_role, storage_path, physical_page_count,
  checksum, model_tags, source_type, source_record_id, semantic_version_id, provenance
) VALUES (
  '8aa51e5b-83c4-53dc-8e3d-cb4b52f0eec6',
  'barry_v2_manual:eaea5f26-afe2-3a07-7900-4874991e1b97',
  'u435-maint-00-specifications',
  'maintenance_manual',
  NULL,
  15,
  NULL,
  ARRAY[]::text[],
  'barry_v2_manual',
  'eaea5f26-afe2-3a07-7900-4874991e1b97',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '{"source":"phase2_backfill","role_reason":"verified u435 maintenance filename convention","role_confidence":0.95}'::jsonb
)
ON CONFLICT (semantic_version_id, document_key) DO UPDATE SET
  title = EXCLUDED.title,
  document_role = EXCLUDED.document_role,
  model_tags = EXCLUDED.model_tags,
  provenance = EXCLUDED.provenance,
  updated_at = now();
INSERT INTO public.barry_documents (
  id, document_key, title, document_role, storage_path, physical_page_count,
  checksum, model_tags, source_type, source_record_id, semantic_version_id, provenance
) VALUES (
  '2cac76b8-fcdb-5e88-8158-65407c740196',
  'barry_v2_manual:ebc17ef3-492a-f03f-d726-91fc91d3e153',
  'u435-07-fuel-system',
  'workshop_manual',
  NULL,
  34,
  NULL,
  ARRAY[]::text[],
  'barry_v2_manual',
  'ebc17ef3-492a-f03f-d726-91fc91d3e153',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '{"source":"phase2_backfill","role_reason":"verified barry_v2 manual_type workshop","role_confidence":0.9}'::jsonb
)
ON CONFLICT (semantic_version_id, document_key) DO UPDATE SET
  title = EXCLUDED.title,
  document_role = EXCLUDED.document_role,
  model_tags = EXCLUDED.model_tags,
  provenance = EXCLUDED.provenance,
  updated_at = now();
INSERT INTO public.barry_documents (
  id, document_key, title, document_role, storage_path, physical_page_count,
  checksum, model_tags, source_type, source_record_id, semantic_version_id, provenance
) VALUES (
  '01214a71-fd97-59f4-8339-9fd6d9a29e50',
  'barry_v2_manual:f0103c54-6c1a-eb66-0984-a09f74d55e67',
  'u435-maint-33-front-axle',
  'maintenance_manual',
  NULL,
  6,
  NULL,
  ARRAY[]::text[],
  'barry_v2_manual',
  'f0103c54-6c1a-eb66-0984-a09f74d55e67',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '{"source":"phase2_backfill","role_reason":"verified u435 maintenance filename convention","role_confidence":0.95}'::jsonb
)
ON CONFLICT (semantic_version_id, document_key) DO UPDATE SET
  title = EXCLUDED.title,
  document_role = EXCLUDED.document_role,
  model_tags = EXCLUDED.model_tags,
  provenance = EXCLUDED.provenance,
  updated_at = now();
INSERT INTO public.barry_documents (
  id, document_key, title, document_role, storage_path, physical_page_count,
  checksum, model_tags, source_type, source_record_id, semantic_version_id, provenance
) VALUES (
  'fd32afad-a70b-5f51-8b59-81cf72c1a83d',
  'barry_v2_manual:f374ac43-7586-ef55-8672-0923339390bb',
  'u435-maint-46-steering',
  'maintenance_manual',
  NULL,
  6,
  NULL,
  ARRAY[]::text[],
  'barry_v2_manual',
  'f374ac43-7586-ef55-8672-0923339390bb',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '{"source":"phase2_backfill","role_reason":"verified u435 maintenance filename convention","role_confidence":0.95}'::jsonb
)
ON CONFLICT (semantic_version_id, document_key) DO UPDATE SET
  title = EXCLUDED.title,
  document_role = EXCLUDED.document_role,
  model_tags = EXCLUDED.model_tags,
  provenance = EXCLUDED.provenance,
  updated_at = now();
INSERT INTO public.barry_documents (
  id, document_key, title, document_role, storage_path, physical_page_count,
  checksum, model_tags, source_type, source_record_id, semantic_version_id, provenance
) VALUES (
  'e95c39b3-b48a-59ac-8f73-433bd159f655',
  'barry_v2_manual:f859c26d-edb2-d64f-ed01-df5b82322418',
  'u435-maint-31-frame',
  'maintenance_manual',
  NULL,
  3,
  NULL,
  ARRAY[]::text[],
  'barry_v2_manual',
  'f859c26d-edb2-d64f-ed01-df5b82322418',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '{"source":"phase2_backfill","role_reason":"verified u435 maintenance filename convention","role_confidence":0.95}'::jsonb
)
ON CONFLICT (semantic_version_id, document_key) DO UPDATE SET
  title = EXCLUDED.title,
  document_role = EXCLUDED.document_role,
  model_tags = EXCLUDED.model_tags,
  provenance = EXCLUDED.provenance,
  updated_at = now();
INSERT INTO public.barry_documents (
  id, document_key, title, document_role, storage_path, physical_page_count,
  checksum, model_tags, source_type, source_record_id, semantic_version_id, provenance
) VALUES (
  'cf6061f0-c90c-59cc-8ef7-d259e888b18f',
  'barry_v2_manual:fd2d3878-db4e-6809-8623-6db285305580',
  'u435-maint-40-wheels-prop-shafts',
  'maintenance_manual',
  NULL,
  5,
  NULL,
  ARRAY[]::text[],
  'barry_v2_manual',
  'fd2d3878-db4e-6809-8623-6db285305580',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '{"source":"phase2_backfill","role_reason":"verified u435 maintenance filename convention","role_confidence":0.95}'::jsonb
)
ON CONFLICT (semantic_version_id, document_key) DO UPDATE SET
  title = EXCLUDED.title,
  document_role = EXCLUDED.document_role,
  model_tags = EXCLUDED.model_tags,
  provenance = EXCLUDED.provenance,
  updated_at = now();
INSERT INTO public.barry_documents (
  id, document_key, title, document_role, storage_path, physical_page_count,
  checksum, model_tags, source_type, source_record_id, semantic_version_id, provenance
) VALUES (
  '223a7a83-fdcc-5760-814f-035432a6feb5',
  'barry_v2_manual:fe2ec741-c9af-cae6-a928-180a8ae0dd98',
  'u435-27-cab-structure',
  'workshop_manual',
  NULL,
  28,
  NULL,
  ARRAY[]::text[],
  'barry_v2_manual',
  'fe2ec741-c9af-cae6-a928-180a8ae0dd98',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '{"source":"phase2_backfill","role_reason":"verified barry_v2 manual_type workshop","role_confidence":0.9}'::jsonb
)
ON CONFLICT (semantic_version_id, document_key) DO UPDATE SET
  title = EXCLUDED.title,
  document_role = EXCLUDED.document_role,
  model_tags = EXCLUDED.model_tags,
  provenance = EXCLUDED.provenance,
  updated_at = now();
INSERT INTO public.barry_documents (
  id, document_key, title, document_role, storage_path, physical_page_count,
  checksum, model_tags, source_type, source_record_id, semantic_version_id, provenance
) VALUES (
  '6e1cde1a-61c0-58ef-8f07-63f5a17654b2',
  'manual_chunks_document:406397b8-3fe4-4e9a-8dd5-f9677c61a3ae',
  'U1700L U435 Workshop Manual Volume 1',
  'workshop_manual',
  NULL,
  960,
  NULL,
  ARRAY[]::text[],
  'manual_chunks_document',
  '406397b8-3fe4-4e9a-8dd5-f9677c61a3ae',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '{"source":"phase2_backfill","role_reason":"verified workshop manual title","role_confidence":0.9}'::jsonb
)
ON CONFLICT (semantic_version_id, document_key) DO UPDATE SET
  title = EXCLUDED.title,
  document_role = EXCLUDED.document_role,
  model_tags = EXCLUDED.model_tags,
  provenance = EXCLUDED.provenance,
  updated_at = now();
INSERT INTO public.barry_documents (
  id, document_key, title, document_role, storage_path, physical_page_count,
  checksum, model_tags, source_type, source_record_id, semantic_version_id, provenance
) VALUES (
  'd0c0d16a-b2df-540a-8ee1-c8661148b033',
  'manual_chunks_document:57ae9d6c-64b7-45e7-92f0-799c4ff6caf2',
  'RPS Catalog',
  'parts_catalog',
  NULL,
  629,
  NULL,
  ARRAY[]::text[],
  'manual_chunks_document',
  '57ae9d6c-64b7-45e7-92f0-799c4ff6caf2',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '{"source":"phase2_backfill","role_reason":"verified RPS parts catalogue identity","role_confidence":0.95}'::jsonb
)
ON CONFLICT (semantic_version_id, document_key) DO UPDATE SET
  title = EXCLUDED.title,
  document_role = EXCLUDED.document_role,
  model_tags = EXCLUDED.model_tags,
  provenance = EXCLUDED.provenance,
  updated_at = now();
INSERT INTO public.barry_documents (
  id, document_key, title, document_role, storage_path, physical_page_count,
  checksum, model_tags, source_type, source_record_id, semantic_version_id, provenance
) VALUES (
  '2be70ccd-adb0-5a83-8adf-f26d571044e3',
  'rps_catalog:02155',
  'RPS 02155',
  'parts_catalog',
  NULL,
  NULL,
  NULL,
  ARRAY[]::text[],
  'rps_catalog',
  NULL,
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1'),
  '{"source":"phase2_backfill","role_reason":"verified RPS catalogue identity","role_confidence":0.95}'::jsonb
)
ON CONFLICT (semantic_version_id, document_key) DO UPDATE SET
  title = EXCLUDED.title,
  document_role = EXCLUDED.document_role,
  model_tags = EXCLUDED.model_tags,
  provenance = EXCLUDED.provenance,
  updated_at = now();
INSERT INTO public.barry_evidence_units (
  id, document_id, source_type, source_record_id, physical_pdf_page, page_type,
  content_hash, system_tags, model_tags, component_tags, extraction_quality,
  semantic_version_id, backfill_run_id, provenance
) VALUES (
  '5256ccd9-727e-5818-8cc3-b9cfd340474b',
  'ba29d475-ac41-562d-883a-059f3262b536',
  'barry_v2_content_block',
  '015479b4-ac76-4299-dacb-77fbe956876a',
  949,
  'explanation',
  'b1f389ec19da216294a7d01f83919909',
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY['component.steering_gear']::text[],
  '0.700',
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
  '02352df7-cad3-5b24-8b12-ae8d2b79912b',
  '5061d4f2-c6e7-5071-8758-f3f2443e87dc',
  'barry_v2_content_block',
  '0174ff24-7e99-95a1-23d6-7b626a425a11',
  13,
  'explanation',
  '5b1a70e854f0639a2b8adf201cf032c9',
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY['component.water_pump']::text[],
  '0.700',
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
  '1135029e-f0d8-5e9b-8b42-b2d590a8540b',
  '934f6f76-ec77-5743-805f-d639487b8efe',
  'barry_v2_content_block',
  '03c4d937-cc93-a2e4-b2c8-4e6d830b8890',
  949,
  'explanation',
  'b1f389ec19da216294a7d01f83919909',
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY['component.steering_gear']::text[],
  '0.700',
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
  '55d5e9e2-ad4e-5539-88c0-3f9f23db9e56',
  'ba29d475-ac41-562d-883a-059f3262b536',
  'barry_v2_content_block',
  '04fb3285-565d-a06f-eceb-75e2244dbece',
  923,
  'explanation',
  '5b1a70e854f0639a2b8adf201cf032c9',
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY['component.water_pump']::text[],
  '0.700',
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
  '5bc093da-a71f-51a7-8c99-3f05948b6164',
  'bf035008-9055-5194-8a8a-9413d0cb5c25',
  'barry_v2_content_block',
  '053462cf-7fb0-7540-11a0-89688e51970e',
  10,
  'explanation',
  'be8414f70c67d05a0de7cf61b85a167a',
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY['component.pitman_arm', 'component.steering_gear']::text[],
  '0.700',
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
  '546e7c3c-00ae-5fd4-872b-fc62c7405707',
  'ba29d475-ac41-562d-883a-059f3262b536',
  'barry_v2_content_block',
  '06f0930e-41ae-5d42-a55a-8b8331908367',
  937,
  'procedure',
  'b322a47b01bdf9ed015aae4da4403b74',
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY['component.pitman_arm', 'component.steering_gear']::text[],
  '0.700',
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
  '0409c2c6-9d40-5893-87e8-fc4a2d2a21ad',
  '934f6f76-ec77-5743-805f-d639487b8efe',
  'barry_v2_content_block',
  '07f2dd32-2d47-d601-b83e-426eb3266b5e',
  951,
  'explanation',
  'ac8b484d62640593126c82c51b1bfd7c',
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY['component.pitman_arm']::text[],
  '0.700',
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
  'e1b13420-ee47-556f-81ec-8f1b0a9f1595',
  'ba29d475-ac41-562d-883a-059f3262b536',
  'barry_v2_content_block',
  '0894be3f-222c-c369-b429-9ececbae0017',
  926,
  'specification',
  '1cce3a896f8791882f91888d51fffe09',
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY['component.steering_gear', 'component.pitman_arm']::text[],
  '0.700',
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
  '5fba5861-78d7-5346-8198-e4bf6eeef2c3',
  '934f6f76-ec77-5743-805f-d639487b8efe',
  'barry_v2_content_block',
  '08dd761a-9c11-efea-cdc8-e1324e5386d6',
  604,
  'procedure',
  'e8dae52ba6ce5646aaeb1291dcac4420',
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY['component.portal_hub']::text[],
  '0.700',
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
  '4d66c71c-d855-58c8-8bcd-3a58d22be851',
  'fd32afad-a70b-5f51-8b59-81cf72c1a83d',
  'barry_v2_content_block',
  '08f30d26-dd50-09c6-01c1-72b79dbd1c9a',
  6,
  'procedure',
  '73b4314b3a4100a9e05609c2a7c0689d',
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY[]::text[],
  '0.700',
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
  'bae9236e-1c95-518b-84a8-836f2d2d31ad',
  '934f6f76-ec77-5743-805f-d639487b8efe',
  'barry_v2_content_block',
  '0c2125df-3199-f862-ba5f-7449c3d7264d',
  928,
  'specification',
  '9a37101eff1ea3b5b511ea22f3dd90bd',
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY['component.steering_gear']::text[],
  '0.700',
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
  '9499bd01-38d4-5044-8158-55aa50ae5be3',
  '934f6f76-ec77-5743-805f-d639487b8efe',
  'barry_v2_content_block',
  '0c685851-68be-1865-f65f-3d12562614f4',
  613,
  'procedure',
  '148f9c70ea975974775f9c53af50c323',
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY['component.portal_hub']::text[],
  '0.700',
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
  'c7583637-613e-5baf-8b8f-648af87edf2c',
  '934f6f76-ec77-5743-805f-d639487b8efe',
  'barry_v2_content_block',
  '0f2d1fe0-dbde-ddfd-f674-e8d0b3798847',
  611,
  'procedure',
  '54c6c9604b5749d31a900812741b9eaf',
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY['component.portal_hub']::text[],
  '0.700',
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
  '1070f69c-7d08-5c24-8a15-aa02e7c1bd85',
  'bf035008-9055-5194-8a8a-9413d0cb5c25',
  'barry_v2_content_block',
  '1028ce6d-fdde-27eb-c47e-a6291b1bd929',
  14,
  'explanation',
  'a62f7a3233f0b8df20bffd476aed7698',
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY[]::text[],
  '0.700',
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
  '2464f2a1-5278-5ad3-8735-22c73f9c8044',
  '5061d4f2-c6e7-5071-8758-f3f2443e87dc',
  'barry_v2_content_block',
  '1197e847-c75c-e835-fbb2-f863e06d0ff2',
  8,
  'explanation',
  'a704b88c5a26dee55b155646080f4912',
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY[]::text[],
  '0.700',
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
  '1f9dfe8e-3f36-549b-8a39-5376b6e0bfd2',
  'bf035008-9055-5194-8a8a-9413d0cb5c25',
  'barry_v2_content_block',
  '1201d9af-79e9-d822-570c-42f83a38a4d6',
  3,
  'specification',
  'ef6171ecdb2b9ded46315263dec2de18',
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY['component.pitman_arm', 'component.steering_gear']::text[],
  '0.700',
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
  'b82cb97c-3e0b-5495-840f-e8e9550ef239',
  '934f6f76-ec77-5743-805f-d639487b8efe',
  'barry_v2_content_block',
  '13984ee3-5c11-7cf2-d25b-fa7a10f501c9',
  937,
  'procedure',
  'b322a47b01bdf9ed015aae4da4403b74',
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY['component.pitman_arm', 'component.steering_gear']::text[],
  '0.700',
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
  'd445b584-cb7f-58a4-8d9a-09aabdef1cda',
  'bf035008-9055-5194-8a8a-9413d0cb5c25',
  'barry_v2_content_block',
  '145e2fb9-33c2-3031-303f-9425a66b5555',
  11,
  'specification',
  '0dd54f9ed378025bf1b5bb90f5e20cff',
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY['component.steering_gear']::text[],
  '0.700',
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
  '1e445dda-2682-5a7d-88be-8c517d924bc4',
  'bf035008-9055-5194-8a8a-9413d0cb5c25',
  'barry_v2_content_block',
  '15911b60-2cc0-760b-0421-7ffb4a738af1',
  15,
  'procedure',
  '527cae19e4b0d9c89f9cd9c4447d58e2',
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY[]::text[],
  '0.700',
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
  '3ea80052-1425-5b29-8ab8-d9aa3be724f9',
  'ba29d475-ac41-562d-883a-059f3262b536',
  'barry_v2_content_block',
  '1687db43-86ee-e76e-cab8-e4a2a39c9de6',
  948,
  'specification',
  'b1b98158f52027447d34c3bd719d3e72',
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY['component.pitman_arm', 'component.steering_gear']::text[],
  '0.700',
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
  '3641d5bc-c36e-5bda-8419-a8c7299825b5',
  '934f6f76-ec77-5743-805f-d639487b8efe',
  'barry_v2_content_block',
  '19a067b0-21b4-1691-0579-2084471223f7',
  603,
  'explanation',
  'bbf11d6fd2387e7c21ef952618e521bd',
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY['component.portal_hub']::text[],
  '0.700',
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
  'b21e78f6-0e59-5eca-8c3b-35b394fac6b6',
  'bf035008-9055-5194-8a8a-9413d0cb5c25',
  'barry_v2_content_block',
  '1edeb80d-2b68-73a8-1c5d-73250ac9da14',
  7,
  'diagram',
  '85606360a6a64e621841cb30f9c5d3e1',
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY[]::text[],
  '0.700',
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
  '50d96989-e437-5a49-8f0d-de452e8f1eae',
  '934f6f76-ec77-5743-805f-d639487b8efe',
  'barry_v2_content_block',
  '1edfcce4-8318-6839-8eac-08c1df4c66dd',
  612,
  'explanation',
  'd0c695b4a51e0a3c5464adf47660805b',
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY['component.portal_hub']::text[],
  '0.700',
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
  'b64b13b8-ca3e-586b-847a-fc9a109c70e6',
  'ba29d475-ac41-562d-883a-059f3262b536',
  'barry_v2_content_block',
  '200c6b27-75dd-4fbb-c9cf-8b197338cc0e',
  957,
  'explanation',
  'be8414f70c67d05a0de7cf61b85a167a',
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY['component.pitman_arm', 'component.steering_gear']::text[],
  '0.700',
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
  'f08184d1-f58f-5ed8-8dfc-a17e62615a9e',
  'ba29d475-ac41-562d-883a-059f3262b536',
  'barry_v2_content_block',
  '2138e848-7fd9-4f91-b7ed-d40e4a1891ca',
  946,
  'procedure',
  '1dec6d747e7d8f87c8ec3307cbd8a6af',
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY['component.steering_gear']::text[],
  '0.700',
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
  'f9fd92e8-5f1c-5281-8849-7a505be92362',
  'ba29d475-ac41-562d-883a-059f3262b536',
  'barry_v2_content_block',
  '25380eea-f769-1345-dc3e-dea076b20669',
  942,
  'specification',
  '9f694bf332e2818e47185d41c13dbae8',
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY['component.steering_gear']::text[],
  '0.700',
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
  '17d5a333-30d1-5db6-82f4-f3cf959cab2a',
  '934f6f76-ec77-5743-805f-d639487b8efe',
  'barry_v2_content_block',
  '25f750bd-d811-bc09-0e8d-81f2b47e47c1',
  934,
  'diagram',
  'ca9201066761525a859966e480f4f6a3',
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY['component.steering_gear']::text[],
  '0.700',
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
  '1d733900-069e-5fe0-8fd4-e7419b99655c',
  '934f6f76-ec77-5743-805f-d639487b8efe',
  'barry_v2_content_block',
  '287e675f-811c-1d06-0589-4245ed50173d',
  608,
  'procedure',
  '300b6459cc57f83b36963c4ca10c5475',
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY['component.portal_hub']::text[],
  '0.700',
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
  'ffc495cb-8d06-5190-8521-11a03491b7f2',
  'fd32afad-a70b-5f51-8b59-81cf72c1a83d',
  'barry_v2_content_block',
  '29f58f0e-44d4-0c52-849a-578963cf5560',
  3,
  'explanation',
  'f450061846eb222c553907d1b67b8d7c',
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY[]::text[],
  '0.700',
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
  '0908b3f1-4b16-5cb2-8b9a-3a0a8cb727b5',
  'ba29d475-ac41-562d-883a-059f3262b536',
  'barry_v2_content_block',
  '2ee1d330-0691-ddc4-db61-1d51c45d48c9',
  932,
  'diagram',
  'a5b807684cf3982beff1c0ec8a68236c',
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY['component.pitman_arm']::text[],
  '0.700',
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
  '2e0d7ef3-903f-5059-8efe-6e3ac48bc081',
  '934f6f76-ec77-5743-805f-d639487b8efe',
  'barry_v2_content_block',
  '31506113-3494-8c28-b55d-7bb6a639847c',
  610,
  'explanation',
  '4582989e025690e855179b7f41f5f9f7',
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY['component.portal_hub']::text[],
  '0.700',
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
  '27c5a8ab-d062-5485-833e-67548011f481',
  'ba29d475-ac41-562d-883a-059f3262b536',
  'barry_v2_content_block',
  '358e732d-830b-9209-d43e-b3d660655e5e',
  606,
  'procedure',
  'f5dc582a84981bf654c52dfcbe0cfccb',
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY['component.portal_hub']::text[],
  '0.700',
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
  '0df4cc20-41d3-5168-8660-f1b8f83b66a7',
  'ba29d475-ac41-562d-883a-059f3262b536',
  'barry_v2_content_block',
  '37289306-9c52-87a4-52b3-959840a0c67e',
  958,
  'specification',
  '0dd54f9ed378025bf1b5bb90f5e20cff',
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY['component.steering_gear']::text[],
  '0.700',
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
  'af077008-2572-59b4-89a7-cad673c7179f',
  '5061d4f2-c6e7-5071-8758-f3f2443e87dc',
  'barry_v2_content_block',
  '37866dec-f3b8-248d-b81d-1cf17da091f3',
  5,
  'diagram',
  '7ded2f3c9656df4d0664bfa6796b8333',
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY['component.differential']::text[],
  '0.700',
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
  '885e7104-cce2-5cf3-8d96-1791d973375a',
  '934f6f76-ec77-5743-805f-d639487b8efe',
  'barry_v2_content_block',
  '3bd342c7-39aa-f8e2-ad4a-8fce4ab59af1',
  942,
  'specification',
  '9f694bf332e2818e47185d41c13dbae8',
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY['component.steering_gear']::text[],
  '0.700',
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
  'd7bfbdd4-f71a-5b7d-8e2c-b094ffa45425',
  '5061d4f2-c6e7-5071-8758-f3f2443e87dc',
  'barry_v2_content_block',
  '3cafb1c3-20e2-8ac8-6a8d-9b677aeb1fec',
  17,
  'explanation',
  'ebd8683d496600734b62309ce5c4d538',
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY['component.steering_gear']::text[],
  '0.700',
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
  '9ccf2772-272b-52e1-85c9-603126752aee',
  'ba29d475-ac41-562d-883a-059f3262b536',
  'barry_v2_content_block',
  '3ecb3797-b79f-300e-e77f-8c56176c745c',
  952,
  'diagram',
  '2bd1b25fd3729336521b8c8f1e0fbfac',
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY['component.steering_gear']::text[],
  '0.700',
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
  '3be0b111-2bec-560c-8d40-d46cd85dc38b',
  'ba29d475-ac41-562d-883a-059f3262b536',
  'barry_v2_content_block',
  '3f87adcf-a8e8-8796-86ac-58322afe7097',
  603,
  'explanation',
  'bbf11d6fd2387e7c21ef952618e521bd',
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY['component.portal_hub']::text[],
  '0.700',
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
  '7e6274a0-4d49-5317-83f0-87334768f604',
  '934f6f76-ec77-5743-805f-d639487b8efe',
  'barry_v2_content_block',
  '447619c7-3be1-bc67-519c-68d1d25964f7',
  923,
  'explanation',
  '5b1a70e854f0639a2b8adf201cf032c9',
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY['component.water_pump']::text[],
  '0.700',
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
  '7657a5f6-77ff-57f6-8422-f6eb545510c9',
  'ba29d475-ac41-562d-883a-059f3262b536',
  'barry_v2_content_block',
  '461a5f4a-61d2-9235-1584-4ba08ceafb31',
  947,
  'procedure',
  'e4a95ea6435fda4c60a0ebfe61d000cb',
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY['component.steering_gear']::text[],
  '0.700',
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
  '272b26ca-5474-5af9-8c6d-f8e0f892d1dd',
  'ba29d475-ac41-562d-883a-059f3262b536',
  'barry_v2_content_block',
  '4793f041-b98e-39b1-c8dc-dd4e6a65c8c3',
  959,
  'explanation',
  'bccef766b5df891e13a5ebc628961daf',
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY['component.steering_gear']::text[],
  '0.700',
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
  'f23cb851-8e03-5316-8574-917ad24caa51',
  'ba29d475-ac41-562d-883a-059f3262b536',
  'barry_v2_content_block',
  '4bf6973f-4d81-7506-312d-912007792574',
  950,
  'specification',
  'ef6171ecdb2b9ded46315263dec2de18',
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY['component.pitman_arm', 'component.steering_gear']::text[],
  '0.700',
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
  '94d53062-9e6c-583f-8ea4-8c12db24d940',
  'ba29d475-ac41-562d-883a-059f3262b536',
  'barry_v2_content_block',
  '4ce5dffc-f16f-1a55-f12a-d9c595ae6469',
  613,
  'procedure',
  '148f9c70ea975974775f9c53af50c323',
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY['component.portal_hub']::text[],
  '0.700',
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
  'e3cfb166-eb93-5033-81b1-d7f53061df64',
  '5061d4f2-c6e7-5071-8758-f3f2443e87dc',
  'barry_v2_content_block',
  '4e518aec-c52c-dd35-d7da-1bad6fad4e26',
  6,
  'diagram',
  '5ea5a5c8f10a499a676a4ef40fa18d62',
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY[]::text[],
  '0.700',
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
  'bfb8c522-a8b5-59a0-875a-b491d4ecc047',
  '5061d4f2-c6e7-5071-8758-f3f2443e87dc',
  'barry_v2_content_block',
  '4f168050-af1d-0b21-b152-f07ee6df29d9',
  3,
  'diagram',
  '65e2955e08a225c0e673b893cd7133c6',
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY[]::text[],
  '0.700',
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
  '36d690c5-059e-5bbf-8a96-f36d933cb1d5',
  'fd32afad-a70b-5f51-8b59-81cf72c1a83d',
  'barry_v2_content_block',
  '4f8293f3-0853-ff6d-dc44-ee7e27ce09c1',
  2,
  'explanation',
  '4ca613fabb48efe4c8e0df6ec4259001',
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY['component.steering_gear']::text[],
  '0.700',
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
  'e7e64893-95fb-5d04-8424-068fd15bb50f',
  'ba29d475-ac41-562d-883a-059f3262b536',
  'barry_v2_content_block',
  '52707ebd-84fa-02ab-d5fe-9a278c3948b5',
  954,
  'diagram',
  '85606360a6a64e621841cb30f9c5d3e1',
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY[]::text[],
  '0.700',
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
  '8c7f2723-8211-53c3-83ff-19d65d325758',
  '5061d4f2-c6e7-5071-8758-f3f2443e87dc',
  'barry_v2_content_block',
  '531aa3bf-091a-22e5-07fc-26d1448fae8d',
  15,
  'explanation',
  'a97a70f0e1dfe6b93a9fe69fd697edc2',
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY['component.power_steering_pump']::text[],
  '0.700',
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
  '1882dbc5-b79d-5297-84da-ffc18a2426aa',
  '5061d4f2-c6e7-5071-8758-f3f2443e87dc',
  'barry_v2_content_block',
  '5556de22-1a08-5013-56c5-1ba72b4075c1',
  12,
  'explanation',
  '49476a57fc6f43aece9c857df88b1f0f',
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY[]::text[],
  '0.700',
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
  'e0b26a57-e4db-5f5c-8652-683304df563a',
  '934f6f76-ec77-5743-805f-d639487b8efe',
  'barry_v2_content_block',
  '594af9ff-7ca5-b162-79b9-eff4f98f8b72',
  614,
  'specification',
  'db5dac2a49e62627ef3267b5563ce94a',
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY['component.portal_hub']::text[],
  '0.700',
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
  '6f7b0c39-2e19-580b-8306-e9736c2e3da2',
  '934f6f76-ec77-5743-805f-d639487b8efe',
  'barry_v2_content_block',
  '59baf45c-cdd3-60a1-d271-250521cf4977',
  607,
  'procedure',
  '1e41285add093d0ec94e14d2bb6f0640',
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY['component.portal_hub']::text[],
  '0.700',
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
  'c5761a5e-eda5-59bc-856d-92f46a842909',
  '5061d4f2-c6e7-5071-8758-f3f2443e87dc',
  'barry_v2_content_block',
  '5ab3bfc0-968e-30f9-f3eb-9b6d1d943b9b',
  18,
  'specification',
  '9a37101eff1ea3b5b511ea22f3dd90bd',
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY['component.steering_gear']::text[],
  '0.700',
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
  '3ba976d7-3397-5c41-87b6-eafac5c90b50',
  '5061d4f2-c6e7-5071-8758-f3f2443e87dc',
  'barry_v2_content_block',
  '5b21a41b-4397-b1d8-d86d-9b4c2820691b',
  2,
  'explanation',
  '71f7348beb41327eb953596d87af16f0',
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY[]::text[],
  '0.700',
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
  '7256f02d-9987-5d04-8bc1-2057cab9d10f',
  '934f6f76-ec77-5743-805f-d639487b8efe',
  'barry_v2_content_block',
  '5c856f1c-e901-8676-4766-7529753d5a08',
  960,
  'explanation',
  '7bf1e8d07a4644eb788d1b8088c60f96',
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY['component.steering_gear']::text[],
  '0.700',
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
  '2385af7d-921c-581d-81c6-aa839d964553',
  '934f6f76-ec77-5743-805f-d639487b8efe',
  'barry_v2_content_block',
  '6123d953-e7e6-903f-2744-b64dae55e852',
  926,
  'specification',
  '1cce3a896f8791882f91888d51fffe09',
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY['component.steering_gear', 'component.pitman_arm']::text[],
  '0.700',
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
  '227a5616-58fe-548f-8335-93dee30c9fc5',
  'ba29d475-ac41-562d-883a-059f3262b536',
  'barry_v2_content_block',
  '614e1bee-4e32-dc2d-5c20-7ac4bda8e50f',
  610,
  'explanation',
  '4582989e025690e855179b7f41f5f9f7',
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY['component.portal_hub']::text[],
  '0.700',
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
  '96847993-b3bc-5ded-82e7-d3c0418c5a44',
  '934f6f76-ec77-5743-805f-d639487b8efe',
  'barry_v2_content_block',
  '615dc272-7c34-555a-e93b-a52bfcb27ef4',
  922,
  'explanation',
  '49476a57fc6f43aece9c857df88b1f0f',
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY[]::text[],
  '0.700',
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
  'ae504c30-64a3-575e-86d9-8ce8b2657bfa',
  'ba29d475-ac41-562d-883a-059f3262b536',
  'barry_v2_content_block',
  '62fd4f4d-c159-a51d-4c41-a48b7d0af414',
  956,
  'procedure',
  'abcd3cf09b9e95ff3611f3f9f61b3dbe',
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY['component.pitman_arm', 'component.steering_gear']::text[],
  '0.700',
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
  '4935a8d0-be81-551a-8596-6a4fba6c1db3',
  'fd32afad-a70b-5f51-8b59-81cf72c1a83d',
  'barry_v2_content_block',
  '678c2361-02fb-91c9-811a-19c3f87d924c',
  4,
  'procedure',
  '6a81a8fb108cb278993be890679375a6',
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY[]::text[],
  '0.700',
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
  'c0cee789-3892-523c-8bde-d504f61c687b',
  'ba29d475-ac41-562d-883a-059f3262b536',
  'barry_v2_content_block',
  '6a672a83-231f-c20b-1689-796ff59c7674',
  941,
  'explanation',
  '5c6b1fac1c3e0d12cf82f33c00bf5246',
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY['component.steering_gear']::text[],
  '0.700',
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
  '3b378002-ba2d-553d-86ef-89000b7abcbd',
  'fd32afad-a70b-5f51-8b59-81cf72c1a83d',
  'barry_v2_content_block',
  '6aaa70d6-c527-2a55-3539-2fd838a85dca',
  1,
  'procedure',
  '490c1edd46222a659a2182c0c097b05a',
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY[]::text[],
  '0.700',
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
  'eecd4b59-e38c-5408-8633-67d64c8ebd6a',
  '934f6f76-ec77-5743-805f-d639487b8efe',
  'barry_v2_content_block',
  '6bcfbcec-4057-c7fa-3c20-39c5290f052f',
  953,
  'diagram',
  '54e2e91ce4ee884520d804c034e55057',
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY[]::text[],
  '0.700',
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
  '9b76b568-def0-5aaa-8205-a75768537bf7',
  'ba29d475-ac41-562d-883a-059f3262b536',
  'barry_v2_content_block',
  '6da85488-3edc-60ed-c1ac-0874191f32a2',
  601,
  'procedure',
  'b0fec4e19396eae2d3d34a88fb5d600d',
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY['component.differential']::text[],
  '0.700',
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
  '179e11cc-f1d5-5b9f-85f7-d4f298fa6da9',
  'ba29d475-ac41-562d-883a-059f3262b536',
  'barry_v2_content_block',
  '727401f3-e19e-d7a4-0ef7-989d844927fb',
  951,
  'explanation',
  'ac8b484d62640593126c82c51b1bfd7c',
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY['component.pitman_arm']::text[],
  '0.700',
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
  '037f7602-3e50-5666-870e-558f6f505a4a',
  'ba29d475-ac41-562d-883a-059f3262b536',
  'barry_v2_content_block',
  '727a3191-e7f1-69c4-5457-87bd86291007',
  612,
  'explanation',
  'd0c695b4a51e0a3c5464adf47660805b',
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY['component.portal_hub']::text[],
  '0.700',
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
  'c8d502e7-d896-5098-8fe5-62ce5eaffe44',
  'bf035008-9055-5194-8a8a-9413d0cb5c25',
  'barry_v2_content_block',
  '7300df75-0d83-5bac-a583-b652b9bcdef4',
  16,
  'procedure',
  '559354ac3ac0a5263cc2c67f97bc36d9',
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY[]::text[],
  '0.700',
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
  '9e5ec9fe-2132-5792-89c4-c4be0bb5233e',
  '934f6f76-ec77-5743-805f-d639487b8efe',
  'barry_v2_content_block',
  '749256ec-c9b7-5385-06a0-1ac280ef4355',
  924,
  'explanation',
  'f7bacfcc29ba4a92777a0fd549de1b91',
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY[]::text[],
  '0.700',
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
  '43d18f81-50a7-54f3-80c2-981e80c279c7',
  '5061d4f2-c6e7-5071-8758-f3f2443e87dc',
  'barry_v2_content_block',
  '7581d825-9bca-e197-2153-defb3bd9b8a7',
  1,
  'diagram',
  'be9cc12b97dd1242a0dda3af3ca15753',
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY[]::text[],
  '0.700',
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
  '69658ace-d1de-5dc3-85c3-51f13fa58e6b',
  '934f6f76-ec77-5743-805f-d639487b8efe',
  'barry_v2_content_block',
  '761eaaf8-67db-283f-e587-1d481d0adb1e',
  927,
  'explanation',
  'ebd8683d496600734b62309ce5c4d538',
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY['component.steering_gear']::text[],
  '0.700',
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
  'cdf727f3-d841-5be7-8c91-4b8d405d24b7',
  '934f6f76-ec77-5743-805f-d639487b8efe',
  'barry_v2_content_block',
  '76a28e1a-b0c5-34d6-afc3-d008e9ac89e9',
  932,
  'diagram',
  'a5b807684cf3982beff1c0ec8a68236c',
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY['component.pitman_arm']::text[],
  '0.700',
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
  '6b35d68b-d135-569a-8bda-dd5035507252',
  'bf035008-9055-5194-8a8a-9413d0cb5c25',
  'barry_v2_content_block',
  '77657f78-9bac-baab-2ef5-9bf979892023',
  5,
  'diagram',
  '2bd1b25fd3729336521b8c8f1e0fbfac',
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY['component.steering_gear']::text[],
  '0.700',
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
  'dbfd357f-7ced-5eda-8d6a-dd1926fd7e4e',
  'bf035008-9055-5194-8a8a-9413d0cb5c25',
  'barry_v2_content_block',
  '7b44259d-cca5-e93e-9e29-956ae353c8ae',
  17,
  'procedure',
  'e4fba5962b227a5ae38e5149fd260be6',
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY[]::text[],
  '0.700',
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
  '32544133-d72b-5842-8bb4-ef13d59ff896',
  'ba29d475-ac41-562d-883a-059f3262b536',
  'barry_v2_content_block',
  '7c329175-6478-05c5-745e-d90ea8781bf5',
  935,
  'diagram',
  '3e40ad74a60c0ae17d5ddd6597fd8321',
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY[]::text[],
  '0.700',
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
  '5f0630a4-6e90-59ef-8426-94c066f6b3e3',
  '934f6f76-ec77-5743-805f-d639487b8efe',
  'barry_v2_content_block',
  '7f054b31-3bcb-4984-30ab-f438e8c02707',
  952,
  'diagram',
  '2bd1b25fd3729336521b8c8f1e0fbfac',
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY['component.steering_gear']::text[],
  '0.700',
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
  '18dae729-d90e-51c1-8ed5-f7c441d102cc',
  'ba29d475-ac41-562d-883a-059f3262b536',
  'barry_v2_content_block',
  '8679fd21-6af3-35b5-7140-5d713e616914',
  922,
  'explanation',
  '49476a57fc6f43aece9c857df88b1f0f',
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY[]::text[],
  '0.700',
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
  'a0b28a04-812d-5353-81cc-4fe60109247c',
  '934f6f76-ec77-5743-805f-d639487b8efe',
  'barry_v2_content_block',
  '86fa1836-c1df-a08c-603b-1213ccf636fa',
  601,
  'procedure',
  'b0fec4e19396eae2d3d34a88fb5d600d',
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY['component.differential']::text[],
  '0.700',
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
  'f8aa07cb-3d31-5bde-8c66-7d379ab85f48',
  'bf035008-9055-5194-8a8a-9413d0cb5c25',
  'barry_v2_content_block',
  '8763d8b9-f1c8-7af8-8e8a-e94f97947a88',
  18,
  'procedure',
  '30e64bb67b1478b92ac4193f94850384',
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY[]::text[],
  '0.700',
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
  'e316abc0-2f43-5488-8c87-f85c2ab423bd',
  '934f6f76-ec77-5743-805f-d639487b8efe',
  'barry_v2_content_block',
  '87e3409e-5aab-b492-b150-4b0592d85d6e',
  959,
  'explanation',
  'bccef766b5df891e13a5ebc628961daf',
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY['component.steering_gear']::text[],
  '0.700',
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
  'bde45396-608c-5a46-8841-947d374f26a9',
  '934f6f76-ec77-5743-805f-d639487b8efe',
  'barry_v2_content_block',
  '88efae78-c00e-9ce9-82a7-caf6ce994f0e',
  605,
  'procedure',
  'a21e52115833bcc9484ba1ddf18c2ae9',
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY['component.portal_hub']::text[],
  '0.700',
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
  'e393c76d-c92b-5f72-81bf-7e19c841723f',
  'ba29d475-ac41-562d-883a-059f3262b536',
  'barry_v2_content_block',
  '8a430dad-fe9e-1d8c-229f-d58d75136dcf',
  945,
  'procedure',
  '4db6ae2e6b90ad6db4a79d85f81000db',
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY[]::text[],
  '0.700',
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
  '4790d5b6-ff52-599c-8e96-c74819829c3a',
  '934f6f76-ec77-5743-805f-d639487b8efe',
  'barry_v2_content_block',
  '8b106795-7864-7d0a-a383-273da8a9750d',
  935,
  'diagram',
  '3e40ad74a60c0ae17d5ddd6597fd8321',
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY[]::text[],
  '0.700',
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
  'f9a9b243-1ba5-57ce-8f15-8f7d8910d1d2',
  '934f6f76-ec77-5743-805f-d639487b8efe',
  'barry_v2_content_block',
  '8bf20927-2982-bff5-32b8-3c30651a68c3',
  615,
  'procedure',
  '7f9281337dfae166491753f39659ed38',
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY['component.differential']::text[],
  '0.700',
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
  'd0c51365-19b8-5e25-86da-77bf997e6e3d',
  'ba29d475-ac41-562d-883a-059f3262b536',
  'barry_v2_content_block',
  '8c0b7525-ed96-4bb5-ce22-0a49f7233318',
  927,
  'explanation',
  'ebd8683d496600734b62309ce5c4d538',
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY['component.steering_gear']::text[],
  '0.700',
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
  'dc7d48e8-4fa7-5bd6-85cd-d5da49f7ff14',
  'ba29d475-ac41-562d-883a-059f3262b536',
  'barry_v2_content_block',
  '8c3bdec0-0162-72ca-e178-11638663a119',
  600,
  'procedure',
  '73f537cdff40de87c250322964a6ddd7',
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY['component.differential']::text[],
  '0.700',
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
  '882c3e08-3867-5786-8a42-a0c8a23e3abd',
  'bf035008-9055-5194-8a8a-9413d0cb5c25',
  'barry_v2_content_block',
  '8e1e1df5-3076-256a-cf54-2e5f2ba67a70',
  13,
  'explanation',
  '7bf1e8d07a4644eb788d1b8088c60f96',
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY['component.steering_gear']::text[],
  '0.700',
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
  '3e4981e1-4960-5609-8064-b2d456017ebb',
  '5061d4f2-c6e7-5071-8758-f3f2443e87dc',
  'barry_v2_content_block',
  '9062c58c-0e31-c8e6-3ec6-c1b46ed4e9f0',
  7,
  'diagram',
  '4acbf34ec0ff818064c017711cc34bd3',
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY[]::text[],
  '0.700',
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
  '0870fa72-d19e-5f93-86ff-1d73b2f3c102',
  'ba29d475-ac41-562d-883a-059f3262b536',
  'barry_v2_content_block',
  '9269f295-04a4-e90d-3f50-77cfb6d405af',
  930,
  'specification',
  'a39378953c9e2b1885ea4c60eae3d165',
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY['component.pitman_arm', 'component.steering_gear']::text[],
  '0.700',
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
  '76826cca-4b31-510f-8b75-67f11e19755b',
  '5061d4f2-c6e7-5071-8758-f3f2443e87dc',
  'barry_v2_content_block',
  '94153eef-aa96-50f0-952b-5c86ab1695b4',
  14,
  'explanation',
  'f7bacfcc29ba4a92777a0fd549de1b91',
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY[]::text[],
  '0.700',
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
  '192cbb82-3e83-59a1-802e-d18a46bbae5b',
  '934f6f76-ec77-5743-805f-d639487b8efe',
  'barry_v2_content_block',
  '95353a92-2efc-b377-230a-e77b0bcaaeb8',
  925,
  'explanation',
  'a97a70f0e1dfe6b93a9fe69fd697edc2',
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY['component.power_steering_pump']::text[],
  '0.700',
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
  'a33dd61c-1e46-5968-88f3-7904f739416f',
  'ba29d475-ac41-562d-883a-059f3262b536',
  'barry_v2_content_block',
  '99630a0c-1096-48d2-4eae-30bd3b33da55',
  960,
  'explanation',
  '7bf1e8d07a4644eb788d1b8088c60f96',
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY['component.steering_gear']::text[],
  '0.700',
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
  '5e1d9f66-7af9-5853-87e5-8861485d7796',
  '934f6f76-ec77-5743-805f-d639487b8efe',
  'barry_v2_content_block',
  '9b3c6cf3-bd5c-c9a6-1de1-e43bff9dcad4',
  939,
  'procedure',
  '5468a9ab0583f21de09dda91f37007b2',
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY['component.steering_gear']::text[],
  '0.700',
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
  'c6860f01-1911-5bfe-84e5-6c9ac55fa570',
  '934f6f76-ec77-5743-805f-d639487b8efe',
  'barry_v2_content_block',
  '9c8652fc-028d-ecd6-be18-2f1e43b33124',
  606,
  'procedure',
  'f5dc582a84981bf654c52dfcbe0cfccb',
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY['component.portal_hub']::text[],
  '0.700',
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
  '524f7066-e3a0-5843-85cc-ccd41a2edc77',
  'ba29d475-ac41-562d-883a-059f3262b536',
  'barry_v2_content_block',
  '9d3ae11e-c026-0ba2-9742-deb22d00fe69',
  605,
  'procedure',
  'a21e52115833bcc9484ba1ddf18c2ae9',
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY['component.portal_hub']::text[],
  '0.700',
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
  '8fa2bcd1-7170-5801-8de0-68d065065151',
  '5061d4f2-c6e7-5071-8758-f3f2443e87dc',
  'barry_v2_content_block',
  '9da6d0c4-63c5-2de5-8032-9fa2cd4ba7dd',
  19,
  'explanation',
  '72888d6574c3eb34a46a4d07eab17424',
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY['component.pitman_arm']::text[],
  '0.700',
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
  '8c8fa3c7-705d-5824-863d-f517e23eea46',
  '934f6f76-ec77-5743-805f-d639487b8efe',
  'barry_v2_content_block',
  '9e187cd1-a68e-6760-1f3a-15514a5789c5',
  602,
  'explanation',
  'b9cfabd657f49ff2da306531fbf60cb6',
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY['component.differential']::text[],
  '0.700',
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
  '43bc52e0-4047-5a6c-8f42-b356559e3f7c',
  '934f6f76-ec77-5743-805f-d639487b8efe',
  'barry_v2_content_block',
  '9ec0d719-fbf5-d41c-ded6-3ec7388c4bca',
  943,
  'explanation',
  '1d18c4e7004a38e2560fb11569e0c263',
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY[]::text[],
  '0.700',
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
  '347080e4-f6bf-5f6c-83c0-4c2f7a516b36',
  '934f6f76-ec77-5743-805f-d639487b8efe',
  'barry_v2_content_block',
  'a0cc68b1-1a8d-97c9-c870-bdde5ea73666',
  921,
  'diagram',
  'a157fc8ce1438f40d94b90f3782059f9',
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY[]::text[],
  '0.700',
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
  '24fcf9c9-4de9-58e3-8cd9-d2a0d5861993',
  'ba29d475-ac41-562d-883a-059f3262b536',
  'barry_v2_content_block',
  'a28c434f-e11e-19c2-b714-213560aa8830',
  934,
  'diagram',
  'ca9201066761525a859966e480f4f6a3',
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY['component.steering_gear']::text[],
  '0.700',
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
  'a2cc0909-6c5d-569f-8eb9-791693529600',
  'ba29d475-ac41-562d-883a-059f3262b536',
  'barry_v2_content_block',
  'a3570013-9c6d-ae62-cd6b-2835af6d9d2c',
  920,
  'diagram',
  '08b142f70f8318709fb347a476cd6a9d',
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY[]::text[],
  '0.700',
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
  '384f13e1-7722-565e-881c-c6b2e8d6f3f3',
  '934f6f76-ec77-5743-805f-d639487b8efe',
  'barry_v2_content_block',
  'a3de9eee-1415-975d-25bc-c1dd053c5b4b',
  944,
  'procedure',
  'b0a04c7a5ed46c6908e10a28f4483428',
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY[]::text[],
  '0.700',
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
  '14acbd3a-4d77-559e-849c-babcef6666c5',
  'ba29d475-ac41-562d-883a-059f3262b536',
  'barry_v2_content_block',
  'a5dba17a-8d62-0ff9-831e-aa0fc2b75226',
  614,
  'specification',
  'db5dac2a49e62627ef3267b5563ce94a',
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY['component.portal_hub']::text[],
  '0.700',
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
  'f21fba83-2d18-5f5c-844f-1d0c7845704d',
  'ba29d475-ac41-562d-883a-059f3262b536',
  'barry_v2_content_block',
  'aa4205f7-8539-bb15-6668-27fe4012d1f5',
  615,
  'procedure',
  '7f9281337dfae166491753f39659ed38',
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY['component.differential']::text[],
  '0.700',
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
  '0809ab47-675e-573a-8119-9a7ae9d28708',
  '934f6f76-ec77-5743-805f-d639487b8efe',
  'barry_v2_content_block',
  'ab2fde5f-0e3b-a121-ca5c-4f6ae6b78642',
  930,
  'specification',
  'a39378953c9e2b1885ea4c60eae3d165',
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY['component.pitman_arm', 'component.steering_gear']::text[],
  '0.700',
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
  'cf267826-1d0e-5b39-8534-5517df2a23de',
  'ba29d475-ac41-562d-883a-059f3262b536',
  'barry_v2_content_block',
  'ac1c46f0-3659-87d4-e771-6757d6588cd8',
  943,
  'explanation',
  '1d18c4e7004a38e2560fb11569e0c263',
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY[]::text[],
  '0.700',
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
  '75b30bb5-36f1-54ea-8cbb-eee694f15f00',
  'fd32afad-a70b-5f51-8b59-81cf72c1a83d',
  'barry_v2_content_block',
  'ad22b667-881d-1629-e6c7-c20eab4a75ad',
  5,
  'specification',
  '013492c4c8a2d5efa7b9ba093f7efc78',
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY[]::text[],
  '0.700',
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
  '9d1a53fe-0b94-502c-8836-0d5dd56b0b8a',
  '934f6f76-ec77-5743-805f-d639487b8efe',
  'barry_v2_content_block',
  'af2680be-2062-68b4-3031-20833e44c87a',
  941,
  'explanation',
  '5c6b1fac1c3e0d12cf82f33c00bf5246',
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY['component.steering_gear']::text[],
  '0.700',
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
  '943e7b71-0488-55d2-8cca-2c756bf83ec3',
  'ba29d475-ac41-562d-883a-059f3262b536',
  'barry_v2_content_block',
  'b17a9120-d53e-dccf-b140-ea0a6d29d868',
  953,
  'diagram',
  '54e2e91ce4ee884520d804c034e55057',
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY[]::text[],
  '0.700',
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
  'cdf09730-3820-543f-8c46-fb204a4929d3',
  'ba29d475-ac41-562d-883a-059f3262b536',
  'barry_v2_content_block',
  'b3728535-8d15-1e06-3127-54a0fcafbd86',
  940,
  'procedure',
  'd020c5ba1b7218a35a40b4f8a6be40c8',
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY['component.steering_gear']::text[],
  '0.700',
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
  '79522096-83e4-5ae8-8f2b-b99e31e9b662',
  'bf035008-9055-5194-8a8a-9413d0cb5c25',
  'barry_v2_content_block',
  'b55a3f19-3bcd-ab6c-9ef8-28b8526d51c1',
  4,
  'explanation',
  'ac8b484d62640593126c82c51b1bfd7c',
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY['component.pitman_arm']::text[],
  '0.700',
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
  '06af3e42-2b54-5da7-83ff-2d54a41197be',
  'ba29d475-ac41-562d-883a-059f3262b536',
  'barry_v2_content_block',
  'b74351a0-4995-76d1-bf3c-b059844ade72',
  609,
  'procedure',
  'd44be7f6832568c1535f477ea0e2a2f0',
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY['component.portal_hub']::text[],
  '0.700',
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
  'caf236bd-3dd0-5aa0-81de-32cf9f38ac04',
  '934f6f76-ec77-5743-805f-d639487b8efe',
  'barry_v2_content_block',
  'b8c332ad-cbf8-5045-6590-5df5402ebf89',
  955,
  'explanation',
  '45b6011d169152f0acd4d7daae766b54',
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY['component.pitman_arm', 'component.steering_gear']::text[],
  '0.700',
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
  '6bb51b71-f377-5875-83e9-8b4baafd1283',
  '934f6f76-ec77-5743-805f-d639487b8efe',
  'barry_v2_content_block',
  'b9ebb33f-7775-cddf-034a-7a515f2817d6',
  947,
  'procedure',
  'e4a95ea6435fda4c60a0ebfe61d000cb',
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY['component.steering_gear']::text[],
  '0.700',
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
  '6f71c9d9-2f6e-5dcb-8833-1e7ba8796675',
  'bf035008-9055-5194-8a8a-9413d0cb5c25',
  'barry_v2_content_block',
  'bb231106-c2c5-3cbb-af97-e9aefa5a2722',
  8,
  'explanation',
  '45b6011d169152f0acd4d7daae766b54',
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY['component.pitman_arm', 'component.steering_gear']::text[],
  '0.700',
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
  'ef790f5c-5f5a-5065-8b05-540ff3f24c7e',
  '934f6f76-ec77-5743-805f-d639487b8efe',
  'barry_v2_content_block',
  'bdfc3e81-fbac-57bb-e204-a69dd96c7d79',
  600,
  'procedure',
  '73f537cdff40de87c250322964a6ddd7',
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY['component.differential']::text[],
  '0.700',
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
  'b3c3f54b-c314-51aa-86b8-838be61bc088',
  '5061d4f2-c6e7-5071-8758-f3f2443e87dc',
  'barry_v2_content_block',
  'bec1b073-203a-63ec-c847-1db8d2f16e24',
  16,
  'specification',
  '1cce3a896f8791882f91888d51fffe09',
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY['component.steering_gear', 'component.pitman_arm']::text[],
  '0.700',
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
  'c7f53a82-e377-5fb0-8f46-c6a0f7a7d9c3',
  'ba29d475-ac41-562d-883a-059f3262b536',
  'barry_v2_content_block',
  'c2e19b60-ba06-7f81-640b-0cd32c6fc4b9',
  924,
  'explanation',
  'f7bacfcc29ba4a92777a0fd549de1b91',
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY[]::text[],
  '0.700',
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
  '40344bad-8d27-55c6-83e3-d7c3dcfc269a',
  '5061d4f2-c6e7-5071-8758-f3f2443e87dc',
  'barry_v2_content_block',
  'c65ad742-b5aa-81e1-c141-4a095f0a154d',
  4,
  'diagram',
  '378ebb119e3add4ec489cd87ee7cfec9',
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY[]::text[],
  '0.700',
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
  'bc2ca87c-a115-59cc-80c4-be3decada5ae',
  '934f6f76-ec77-5743-805f-d639487b8efe',
  'barry_v2_content_block',
  'c65c76b1-36f4-5833-ee82-27cfae115505',
  954,
  'diagram',
  '85606360a6a64e621841cb30f9c5d3e1',
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY[]::text[],
  '0.700',
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
  'c87717dc-edb7-5aba-8a13-360f02bb75f6',
  'ba29d475-ac41-562d-883a-059f3262b536',
  'barry_v2_content_block',
  'c7b11c9f-a278-df38-b37c-845e503bd15f',
  938,
  'specification',
  '4f6582a45de0c4823f8a10d346dfefcc',
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY['component.pitman_arm', 'component.steering_gear']::text[],
  '0.700',
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
  '05d2a6cf-fa6b-5d69-8a6a-68ec561ae3d0',
  'ba29d475-ac41-562d-883a-059f3262b536',
  'barry_v2_content_block',
  'c819ab5d-36ad-5047-a816-73e41e9637f0',
  607,
  'procedure',
  '1e41285add093d0ec94e14d2bb6f0640',
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY['component.portal_hub']::text[],
  '0.700',
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
  '9079aea4-40c7-58f1-80d8-a8900b17ee78',
  'bf035008-9055-5194-8a8a-9413d0cb5c25',
  'barry_v2_content_block',
  'c8a7dc3b-e72a-3e64-3930-8ba4a97fe6d4',
  1,
  'specification',
  'b1b98158f52027447d34c3bd719d3e72',
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY['component.pitman_arm', 'component.steering_gear']::text[],
  '0.700',
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
  '37ddb2fb-3a08-5833-8a6a-17aac4bdb6b9',
  'ba29d475-ac41-562d-883a-059f3262b536',
  'barry_v2_content_block',
  'ccc37d38-8272-10a9-87b1-d8fba8f835a3',
  955,
  'explanation',
  '45b6011d169152f0acd4d7daae766b54',
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY['component.pitman_arm', 'component.steering_gear']::text[],
  '0.700',
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
  'bf79a2fe-df5d-503b-8e43-5b24df1138c0',
  '934f6f76-ec77-5743-805f-d639487b8efe',
  'barry_v2_content_block',
  'ccce02af-fe96-df45-4f63-f9d71a842ea2',
  938,
  'specification',
  '4f6582a45de0c4823f8a10d346dfefcc',
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY['component.pitman_arm', 'component.steering_gear']::text[],
  '0.700',
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
  'dce075ec-814b-5000-8469-74a01ab1e530',
  '934f6f76-ec77-5743-805f-d639487b8efe',
  'barry_v2_content_block',
  'cd9d0375-9e6c-024d-7699-5afb2fd6114e',
  931,
  'explanation',
  'd32d8a50c82ec7e18b91c7ca0f718100',
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY['component.pitman_arm']::text[],
  '0.700',
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
  '2506108e-e6db-500c-857d-ded2b79165ef',
  '5061d4f2-c6e7-5071-8758-f3f2443e87dc',
  'barry_v2_content_block',
  'cdc46cd2-97a5-98d6-49e9-2fd5845a12f2',
  11,
  'diagram',
  'a157fc8ce1438f40d94b90f3782059f9',
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY[]::text[],
  '0.700',
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
  '92b68932-00f7-5918-896e-fee8c18434f8',
  'ba29d475-ac41-562d-883a-059f3262b536',
  'barry_v2_content_block',
  'ce8bd0d8-82c5-c1ae-82bb-b70ce53a8ecf',
  925,
  'explanation',
  'a97a70f0e1dfe6b93a9fe69fd697edc2',
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY['component.power_steering_pump']::text[],
  '0.700',
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
  '83a85f65-082f-59d2-83c7-a66050927d6e',
  '934f6f76-ec77-5743-805f-d639487b8efe',
  'barry_v2_content_block',
  'd04485f9-35d8-1c03-aca4-b27960aaa72b',
  940,
  'procedure',
  'd020c5ba1b7218a35a40b4f8a6be40c8',
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY['component.steering_gear']::text[],
  '0.700',
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
  'c775189c-5a9f-5759-857d-cbf39042b04a',
  'ba29d475-ac41-562d-883a-059f3262b536',
  'barry_v2_content_block',
  'd2205373-3d19-56fa-350d-15d5dba343cc',
  929,
  'explanation',
  '72888d6574c3eb34a46a4d07eab17424',
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY['component.pitman_arm']::text[],
  '0.700',
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
  'a9769f6b-d08e-510a-823d-8276672a17fb',
  '934f6f76-ec77-5743-805f-d639487b8efe',
  'barry_v2_content_block',
  'd2f8b01a-d108-ec26-a41c-81cd262df743',
  948,
  'specification',
  'b1b98158f52027447d34c3bd719d3e72',
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY['component.pitman_arm', 'component.steering_gear']::text[],
  '0.700',
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
  '09332112-331d-5450-8285-ec1647ca5edd',
  '934f6f76-ec77-5743-805f-d639487b8efe',
  'barry_v2_content_block',
  'd48bf265-b096-f335-8775-277706995b25',
  936,
  'explanation',
  '51420ad093a0ef0a19d3e93fc5e4b3b0',
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY['component.pitman_arm', 'component.steering_gear']::text[],
  '0.700',
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
  '9963fc61-fa99-5480-86c2-1ae2a76768b7',
  '5061d4f2-c6e7-5071-8758-f3f2443e87dc',
  'barry_v2_content_block',
  'd84dcd42-d7ab-968d-3701-4dba0fa2295b',
  20,
  'specification',
  'a39378953c9e2b1885ea4c60eae3d165',
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY['component.pitman_arm', 'component.steering_gear']::text[],
  '0.700',
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
  'b24130b7-73c4-5ad4-8036-beb26fe59982',
  'ba29d475-ac41-562d-883a-059f3262b536',
  'barry_v2_content_block',
  'd99b056e-4a86-818b-4070-e4ab80c47873',
  602,
  'explanation',
  'b9cfabd657f49ff2da306531fbf60cb6',
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY['component.differential']::text[],
  '0.700',
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
  'f548a3d2-d849-5792-8b0c-ae2d2cae3e32',
  'ba29d475-ac41-562d-883a-059f3262b536',
  'barry_v2_content_block',
  'dc2814f2-6790-8db9-8f3e-6c82a683ee64',
  936,
  'explanation',
  '51420ad093a0ef0a19d3e93fc5e4b3b0',
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY['component.pitman_arm', 'component.steering_gear']::text[],
  '0.700',
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
  'e90bd847-eea5-5b42-8b0d-68fdd1d848f9',
  'ba29d475-ac41-562d-883a-059f3262b536',
  'barry_v2_content_block',
  'ddc3d800-ac81-60ab-1478-27503ad064ec',
  921,
  'diagram',
  'a157fc8ce1438f40d94b90f3782059f9',
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY[]::text[],
  '0.700',
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
  '3d8d4b32-41ac-56dc-8ada-bd8f684efcdb',
  'ba29d475-ac41-562d-883a-059f3262b536',
  'barry_v2_content_block',
  'df617ab5-88cd-2509-3892-fcab5e7a282f',
  944,
  'procedure',
  'b0a04c7a5ed46c6908e10a28f4483428',
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY[]::text[],
  '0.700',
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
  '19f587a5-466a-5a39-80e2-3696885c6e7c',
  '934f6f76-ec77-5743-805f-d639487b8efe',
  'barry_v2_content_block',
  'e1104286-f19e-b335-da17-a9185c2153b4',
  929,
  'explanation',
  '72888d6574c3eb34a46a4d07eab17424',
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY['component.pitman_arm']::text[],
  '0.700',
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
  '7ac36720-4406-5787-86e5-0a67bb01544a',
  'bf035008-9055-5194-8a8a-9413d0cb5c25',
  'barry_v2_content_block',
  'e645c700-f4d9-9b14-3562-c1f1eecbab85',
  9,
  'procedure',
  'abcd3cf09b9e95ff3611f3f9f61b3dbe',
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY['component.pitman_arm', 'component.steering_gear']::text[],
  '0.700',
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
  '3577a844-efd5-5890-8d8b-ab8a86c4c74d',
  'ba29d475-ac41-562d-883a-059f3262b536',
  'barry_v2_content_block',
  'e6fe6a96-66e8-f4e5-2d5d-b594ae234a23',
  933,
  'diagram',
  'f167979a9c35f9d28d629072e965cb2a',
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY[]::text[],
  '0.700',
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
  'c73c0509-7428-57d3-8e3c-9ffc4f8ebc59',
  '934f6f76-ec77-5743-805f-d639487b8efe',
  'barry_v2_content_block',
  'e86f033c-3d00-7bdf-a733-f14cb174058b',
  609,
  'procedure',
  'd44be7f6832568c1535f477ea0e2a2f0',
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY['component.portal_hub']::text[],
  '0.700',
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
  '44557dc6-4677-562e-8e67-57e9a6bbec21',
  '934f6f76-ec77-5743-805f-d639487b8efe',
  'barry_v2_content_block',
  'e87c76ea-2d88-b72d-7774-68e2caec4733',
  956,
  'procedure',
  'abcd3cf09b9e95ff3611f3f9f61b3dbe',
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY['component.pitman_arm', 'component.steering_gear']::text[],
  '0.700',
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
  'f895603e-b10d-5fb5-8f5e-581f402ecd32',
  '5061d4f2-c6e7-5071-8758-f3f2443e87dc',
  'barry_v2_content_block',
  'e9c092c4-bf6a-a54f-07f7-819a0512fbd3',
  9,
  'diagram',
  '2dd008562b4b234169a06fbf49363bab',
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY[]::text[],
  '0.700',
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
  '3c29bee5-89fc-5d8b-8a60-290c7c55311d',
  '934f6f76-ec77-5743-805f-d639487b8efe',
  'barry_v2_content_block',
  'ebd228a9-5a76-bac6-6289-354d3d1a5962',
  933,
  'diagram',
  'f167979a9c35f9d28d629072e965cb2a',
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY[]::text[],
  '0.700',
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
  '698d23c5-e603-53bc-8db2-c45ebc2d29ce',
  'bf035008-9055-5194-8a8a-9413d0cb5c25',
  'barry_v2_content_block',
  'ec9d10e0-0890-1857-25c4-7b2a37fc856d',
  2,
  'explanation',
  'b1f389ec19da216294a7d01f83919909',
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY['component.steering_gear']::text[],
  '0.700',
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
  '8d32d18a-51a5-5e75-89bd-08063a688558',
  'ba29d475-ac41-562d-883a-059f3262b536',
  'barry_v2_content_block',
  'ed646683-05b6-a60a-7acd-8c9c29fba524',
  939,
  'procedure',
  '5468a9ab0583f21de09dda91f37007b2',
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY['component.steering_gear']::text[],
  '0.700',
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
  'dbe4acfa-88e6-5cde-8682-13c692bf5319',
  '934f6f76-ec77-5743-805f-d639487b8efe',
  'barry_v2_content_block',
  'edbd955f-8c15-9f55-eab2-0416d9551186',
  946,
  'procedure',
  '1dec6d747e7d8f87c8ec3307cbd8a6af',
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY['component.steering_gear']::text[],
  '0.700',
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
  '91130252-1aaa-55b6-89bd-ab5659612980',
  '934f6f76-ec77-5743-805f-d639487b8efe',
  'barry_v2_content_block',
  'eec1df55-af8e-b895-dbde-139100290ae2',
  957,
  'explanation',
  'be8414f70c67d05a0de7cf61b85a167a',
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY['component.pitman_arm', 'component.steering_gear']::text[],
  '0.700',
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
  '9bdf843f-5ac1-516d-8bd6-f0221b9166fb',
  '934f6f76-ec77-5743-805f-d639487b8efe',
  'barry_v2_content_block',
  'f0406c4b-82c0-eb1c-5a0f-5a73fc4c0974',
  958,
  'specification',
  '0dd54f9ed378025bf1b5bb90f5e20cff',
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY['component.steering_gear']::text[],
  '0.700',
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
  '636f5774-f1b1-5271-82b2-3f8b00580802',
  'ba29d475-ac41-562d-883a-059f3262b536',
  'barry_v2_content_block',
  'f063da85-cb63-0b78-d4c8-8451e976be27',
  608,
  'procedure',
  '300b6459cc57f83b36963c4ca10c5475',
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY['component.portal_hub']::text[],
  '0.700',
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
  '1f921ecf-fb73-57c5-8ada-8cf15ed901c1',
  'ba29d475-ac41-562d-883a-059f3262b536',
  'barry_v2_content_block',
  'f19bfa6f-204a-8883-b3fd-b392aa33ef8a',
  928,
  'specification',
  '9a37101eff1ea3b5b511ea22f3dd90bd',
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY['component.steering_gear']::text[],
  '0.700',
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
  '40de26f5-d816-5fa2-8634-a39c74e022c4',
  '934f6f76-ec77-5743-805f-d639487b8efe',
  'barry_v2_content_block',
  'f24c2cbf-72f3-1ebf-debb-cd30f3b013d7',
  950,
  'specification',
  'ef6171ecdb2b9ded46315263dec2de18',
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY['component.pitman_arm', 'component.steering_gear']::text[],
  '0.700',
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
  '7c894925-3f5c-5513-897d-37da36c3d8c7',
  '934f6f76-ec77-5743-805f-d639487b8efe',
  'barry_v2_content_block',
  'f6b46107-22d5-88b0-f1af-27ff45a517ed',
  920,
  'diagram',
  '08b142f70f8318709fb347a476cd6a9d',
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY[]::text[],
  '0.700',
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
  '29433b2a-542f-5bc2-8e1d-224b6f4d5e9a',
  'ba29d475-ac41-562d-883a-059f3262b536',
  'barry_v2_content_block',
  'f87d01b6-a53b-74dc-0dcf-c9dec0c3ba3e',
  604,
  'procedure',
  'e8dae52ba6ce5646aaeb1291dcac4420',
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY['component.portal_hub']::text[],
  '0.700',
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
  'faa6d5f1-cc37-5b9f-80c3-c29b950c92e9',
  'bf035008-9055-5194-8a8a-9413d0cb5c25',
  'barry_v2_content_block',
  'f9c2ac39-d7f1-8ced-637c-9c6a0b685164',
  12,
  'explanation',
  'bccef766b5df891e13a5ebc628961daf',
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY['component.steering_gear']::text[],
  '0.700',
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
  '3e6f124d-367e-5379-8eba-2c5a78b96a06',
  '5061d4f2-c6e7-5071-8758-f3f2443e87dc',
  'barry_v2_content_block',
  'fad97140-ff2f-3beb-5960-45f40bbad569',
  10,
  'diagram',
  '08b142f70f8318709fb347a476cd6a9d',
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY[]::text[],
  '0.700',
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
  '54e8e58a-60cb-509b-8aec-0532ede056fe',
  'ba29d475-ac41-562d-883a-059f3262b536',
  'barry_v2_content_block',
  'fe09344f-4fec-fdef-6ebf-73188b0dc48d',
  931,
  'explanation',
  'd32d8a50c82ec7e18b91c7ca0f718100',
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY['component.pitman_arm']::text[],
  '0.700',
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
  '576f0fbb-7249-558c-8212-5bb8b834f51c',
  'ba29d475-ac41-562d-883a-059f3262b536',
  'barry_v2_content_block',
  'fe3540f4-acef-4ff7-ce7e-407e301f913c',
  611,
  'procedure',
  '54c6c9604b5749d31a900812741b9eaf',
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY['component.portal_hub']::text[],
  '0.700',
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
  '40a55640-6896-55a9-8b01-521ac5b5ba55',
  'bf035008-9055-5194-8a8a-9413d0cb5c25',
  'barry_v2_content_block',
  'ff422e69-06d4-3ad7-551e-4e8e32e6bc63',
  6,
  'diagram',
  '54e2e91ce4ee884520d804c034e55057',
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY[]::text[],
  '0.700',
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
  '87b46688-ed61-5169-8ff9-aa8366a04435',
  '934f6f76-ec77-5743-805f-d639487b8efe',
  'barry_v2_content_block',
  'ffac1d48-5a57-1906-8cab-f57b0ceb6b39',
  945,
  'procedure',
  '4db6ae2e6b90ad6db4a79d85f81000db',
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY[]::text[],
  '0.700',
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
  'ff14aada-045e-59d0-8f0b-539f2fe910e4',
  '6e1cde1a-61c0-58ef-8f07-63f5a17654b2',
  'manual_chunk',
  '07231209-7f71-40fb-88ce-5b84b6b9f909',
  920,
  'diagram',
  '08b142f70f8318709fb347a476cd6a9d',
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
  '2d90e614-1651-5c09-8a0e-9cc35379e1d3',
  '6e1cde1a-61c0-58ef-8f07-63f5a17654b2',
  'manual_chunk',
  '08033247-8c1c-40e9-9872-e5a751061f2e',
  606,
  'explanation',
  'fd546fcb8c68c4e3afc2fa52a24c96aa',
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
COMMIT;
