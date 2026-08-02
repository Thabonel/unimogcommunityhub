BEGIN;

INSERT INTO public.barry_semantic_review_queue (
  dedupe_key, review_type, proposed_payload, query_frequency, affected_systems,
  risk_level, status, semantic_version_id
) VALUES (
  'evidence_mapping:rps_part:1026aba2-4f5b-43a0-8891-a2038aa5c1b1:RPS_part_has_no_verified_model_applicability',
  'evidence_mapping',
  '{"reason":"RPS part has no verified model applicability","source_type":"rps_part","document_key":"rps_catalog:02155","source_record_id":"1026aba2-4f5b-43a0-8891-a2038aa5c1b1","physical_pdf_page":595,"candidate_concept_keys":[]}'::jsonb,
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
  'evidence_mapping:rps_part:11fc0c50-fe24-46d1-a8ca-9dbf2ff00f20:RPS_part_has_no_verified_model_applicability',
  'evidence_mapping',
  '{"reason":"RPS part has no verified model applicability","source_type":"rps_part","document_key":"rps_catalog:02155","source_record_id":"11fc0c50-fe24-46d1-a8ca-9dbf2ff00f20","physical_pdf_page":609,"candidate_concept_keys":[]}'::jsonb,
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
  'evidence_mapping:rps_part:1520503e-7767-482e-b80b-5e2dff5af991:RPS_part_has_no_verified_model_applicability',
  'evidence_mapping',
  '{"reason":"RPS part has no verified model applicability","source_type":"rps_part","document_key":"rps_catalog:02155","source_record_id":"1520503e-7767-482e-b80b-5e2dff5af991","physical_pdf_page":615,"candidate_concept_keys":[]}'::jsonb,
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
  'evidence_mapping:rps_part:161c6eb2-22b3-4d53-9de6-8cb6c7f3f076:RPS_part_has_no_verified_model_applicability',
  'evidence_mapping',
  '{"reason":"RPS part has no verified model applicability","source_type":"rps_part","document_key":"rps_catalog:02155","source_record_id":"161c6eb2-22b3-4d53-9de6-8cb6c7f3f076","physical_pdf_page":619,"candidate_concept_keys":[]}'::jsonb,
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
  'evidence_mapping:rps_part:16c00afd-355d-4cd1-bb92-cc94e99663f3:RPS_part_has_no_verified_model_applicability',
  'evidence_mapping',
  '{"reason":"RPS part has no verified model applicability","source_type":"rps_part","document_key":"rps_catalog:02155","source_record_id":"16c00afd-355d-4cd1-bb92-cc94e99663f3","physical_pdf_page":599,"candidate_concept_keys":[]}'::jsonb,
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
  'evidence_mapping:rps_part:191db005-e7d6-443c-8d67-1ff0e07e1cdd:RPS_part_has_no_verified_model_applicability',
  'evidence_mapping',
  '{"reason":"RPS part has no verified model applicability","source_type":"rps_part","document_key":"rps_catalog:02155","source_record_id":"191db005-e7d6-443c-8d67-1ff0e07e1cdd","physical_pdf_page":605,"candidate_concept_keys":[]}'::jsonb,
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
  'evidence_mapping:rps_part:19416e8e-1799-4f76-b137-f16cfd0ac49c:RPS_part_has_no_verified_model_applicability',
  'evidence_mapping',
  '{"reason":"RPS part has no verified model applicability","source_type":"rps_part","document_key":"rps_catalog:02155","source_record_id":"19416e8e-1799-4f76-b137-f16cfd0ac49c","physical_pdf_page":625,"candidate_concept_keys":[]}'::jsonb,
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
  'evidence_mapping:rps_part:1a226838-2fd8-46eb-98c3-73d31d237e50:RPS_part_has_no_verified_model_applicability',
  'evidence_mapping',
  '{"reason":"RPS part has no verified model applicability","source_type":"rps_part","document_key":"rps_catalog:02155","source_record_id":"1a226838-2fd8-46eb-98c3-73d31d237e50","physical_pdf_page":627,"candidate_concept_keys":[]}'::jsonb,
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
  'evidence_mapping:rps_part:1b9ce498-8528-451d-abec-fe65e45afa34:RPS_part_has_no_verified_model_applicability',
  'evidence_mapping',
  '{"reason":"RPS part has no verified model applicability","source_type":"rps_part","document_key":"rps_catalog:02155","source_record_id":"1b9ce498-8528-451d-abec-fe65e45afa34","physical_pdf_page":615,"candidate_concept_keys":[]}'::jsonb,
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
  'evidence_mapping:rps_part:22d77498-f645-4e5f-8991-ca3375d9eb3a:RPS_part_has_no_verified_model_applicability',
  'evidence_mapping',
  '{"reason":"RPS part has no verified model applicability","source_type":"rps_part","document_key":"rps_catalog:02155","source_record_id":"22d77498-f645-4e5f-8991-ca3375d9eb3a","physical_pdf_page":623,"candidate_concept_keys":[]}'::jsonb,
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
  'evidence_mapping:rps_part:2559fa93-c03b-440f-a5dc-4c94f66ffefe:RPS_part_has_no_verified_model_applicability',
  'evidence_mapping',
  '{"reason":"RPS part has no verified model applicability","source_type":"rps_part","document_key":"rps_catalog:02155","source_record_id":"2559fa93-c03b-440f-a5dc-4c94f66ffefe","physical_pdf_page":609,"candidate_concept_keys":[]}'::jsonb,
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
  'evidence_mapping:rps_part:27979a51-af12-4ee0-94eb-e833ccad85de:RPS_part_has_no_verified_model_applicability',
  'evidence_mapping',
  '{"reason":"RPS part has no verified model applicability","source_type":"rps_part","document_key":"rps_catalog:02155","source_record_id":"27979a51-af12-4ee0-94eb-e833ccad85de","physical_pdf_page":623,"candidate_concept_keys":[]}'::jsonb,
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
  'evidence_mapping:rps_part:28b7d053-85aa-4f4a-acc9-7273e16ee29d:RPS_part_has_no_verified_model_applicability',
  'evidence_mapping',
  '{"reason":"RPS part has no verified model applicability","source_type":"rps_part","document_key":"rps_catalog:02155","source_record_id":"28b7d053-85aa-4f4a-acc9-7273e16ee29d","physical_pdf_page":625,"candidate_concept_keys":[]}'::jsonb,
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
  'evidence_mapping:rps_part:29335f1d-d664-4c08-b71e-bbad6076f826:RPS_part_has_no_verified_model_applicability',
  'evidence_mapping',
  '{"reason":"RPS part has no verified model applicability","source_type":"rps_part","document_key":"rps_catalog:02155","source_record_id":"29335f1d-d664-4c08-b71e-bbad6076f826","physical_pdf_page":623,"candidate_concept_keys":[]}'::jsonb,
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
  'evidence_mapping:rps_part:299f882f-67b7-4764-b292-5b370f98b27a:RPS_part_has_no_verified_model_applicability',
  'evidence_mapping',
  '{"reason":"RPS part has no verified model applicability","source_type":"rps_part","document_key":"rps_catalog:02155","source_record_id":"299f882f-67b7-4764-b292-5b370f98b27a","physical_pdf_page":599,"candidate_concept_keys":[]}'::jsonb,
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
  'evidence_mapping:rps_part:2a7389f6-9dba-4a4e-93e8-2fa3d383c0d6:RPS_part_has_no_verified_model_applicability',
  'evidence_mapping',
  '{"reason":"RPS part has no verified model applicability","source_type":"rps_part","document_key":"rps_catalog:02155","source_record_id":"2a7389f6-9dba-4a4e-93e8-2fa3d383c0d6","physical_pdf_page":599,"candidate_concept_keys":[]}'::jsonb,
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
  'evidence_mapping:rps_part:2b1887e5-78a8-4eae-8a15-66fc9de389a0:RPS_part_has_no_verified_model_applicability',
  'evidence_mapping',
  '{"reason":"RPS part has no verified model applicability","source_type":"rps_part","document_key":"rps_catalog:02155","source_record_id":"2b1887e5-78a8-4eae-8a15-66fc9de389a0","physical_pdf_page":607,"candidate_concept_keys":[]}'::jsonb,
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
  'evidence_mapping:rps_part:2ce207ba-c1de-4b4b-89fd-7b2b9c40801d:RPS_part_has_no_verified_model_applicability',
  'evidence_mapping',
  '{"reason":"RPS part has no verified model applicability","source_type":"rps_part","document_key":"rps_catalog:02155","source_record_id":"2ce207ba-c1de-4b4b-89fd-7b2b9c40801d","physical_pdf_page":609,"candidate_concept_keys":[]}'::jsonb,
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
  'evidence_mapping:rps_part:2d35efa8-0bab-49bc-b183-cb1a9d0cf071:RPS_part_has_no_verified_model_applicability',
  'evidence_mapping',
  '{"reason":"RPS part has no verified model applicability","source_type":"rps_part","document_key":"rps_catalog:02155","source_record_id":"2d35efa8-0bab-49bc-b183-cb1a9d0cf071","physical_pdf_page":619,"candidate_concept_keys":[]}'::jsonb,
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
  'evidence_mapping:rps_part:2f3c8b14-e3eb-43ec-bd63-f07ea89037e3:RPS_part_has_no_verified_model_applicability',
  'evidence_mapping',
  '{"reason":"RPS part has no verified model applicability","source_type":"rps_part","document_key":"rps_catalog:02155","source_record_id":"2f3c8b14-e3eb-43ec-bd63-f07ea89037e3","physical_pdf_page":613,"candidate_concept_keys":[]}'::jsonb,
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
  'evidence_mapping:rps_part:3027c78b-77de-4b94-ab3e-4d0570365d6b:RPS_part_has_no_verified_model_applicability',
  'evidence_mapping',
  '{"reason":"RPS part has no verified model applicability","source_type":"rps_part","document_key":"rps_catalog:02155","source_record_id":"3027c78b-77de-4b94-ab3e-4d0570365d6b","physical_pdf_page":601,"candidate_concept_keys":[]}'::jsonb,
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
  'evidence_mapping:rps_part:31ee1302-d044-4f49-b14c-00bef9dcd1d9:RPS_part_has_no_verified_model_applicability',
  'evidence_mapping',
  '{"reason":"RPS part has no verified model applicability","source_type":"rps_part","document_key":"rps_catalog:02155","source_record_id":"31ee1302-d044-4f49-b14c-00bef9dcd1d9","physical_pdf_page":595,"candidate_concept_keys":[]}'::jsonb,
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
  'evidence_mapping:rps_part:32b10570-4de7-4d48-a67b-7fd23b33ac42:RPS_part_has_no_verified_model_applicability',
  'evidence_mapping',
  '{"reason":"RPS part has no verified model applicability","source_type":"rps_part","document_key":"rps_catalog:02155","source_record_id":"32b10570-4de7-4d48-a67b-7fd23b33ac42","physical_pdf_page":603,"candidate_concept_keys":[]}'::jsonb,
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
  'evidence_mapping:rps_part:34559eab-e6de-4328-aa69-e620c9df22c0:RPS_part_has_no_verified_model_applicability',
  'evidence_mapping',
  '{"reason":"RPS part has no verified model applicability","source_type":"rps_part","document_key":"rps_catalog:02155","source_record_id":"34559eab-e6de-4328-aa69-e620c9df22c0","physical_pdf_page":601,"candidate_concept_keys":[]}'::jsonb,
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
  'evidence_mapping:rps_part:3637aaac-80a0-4e60-aab3-80b5bf83be6b:RPS_part_has_no_verified_model_applicability',
  'evidence_mapping',
  '{"reason":"RPS part has no verified model applicability","source_type":"rps_part","document_key":"rps_catalog:02155","source_record_id":"3637aaac-80a0-4e60-aab3-80b5bf83be6b","physical_pdf_page":597,"candidate_concept_keys":[]}'::jsonb,
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
  'evidence_mapping:rps_part:3768d75b-c1d7-4c09-bd2d-1317afb7530e:RPS_part_has_no_verified_model_applicability',
  'evidence_mapping',
  '{"reason":"RPS part has no verified model applicability","source_type":"rps_part","document_key":"rps_catalog:02155","source_record_id":"3768d75b-c1d7-4c09-bd2d-1317afb7530e","physical_pdf_page":609,"candidate_concept_keys":[]}'::jsonb,
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
  'evidence_mapping:rps_part:3889c58a-496f-4cb7-b1dc-6448efdcc877:RPS_part_has_no_verified_model_applicability',
  'evidence_mapping',
  '{"reason":"RPS part has no verified model applicability","source_type":"rps_part","document_key":"rps_catalog:02155","source_record_id":"3889c58a-496f-4cb7-b1dc-6448efdcc877","physical_pdf_page":599,"candidate_concept_keys":[]}'::jsonb,
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
  'evidence_mapping:rps_part:3a8b3b0c-92b5-4b82-9789-492da19c6e2b:RPS_part_has_no_verified_model_applicability',
  'evidence_mapping',
  '{"reason":"RPS part has no verified model applicability","source_type":"rps_part","document_key":"rps_catalog:02155","source_record_id":"3a8b3b0c-92b5-4b82-9789-492da19c6e2b","physical_pdf_page":597,"candidate_concept_keys":[]}'::jsonb,
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
  'evidence_mapping:rps_part:3a9ed4d4-33cd-4fcc-9a5b-5719ead844f8:RPS_part_has_no_verified_model_applicability',
  'evidence_mapping',
  '{"reason":"RPS part has no verified model applicability","source_type":"rps_part","document_key":"rps_catalog:02155","source_record_id":"3a9ed4d4-33cd-4fcc-9a5b-5719ead844f8","physical_pdf_page":609,"candidate_concept_keys":[]}'::jsonb,
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
  'evidence_mapping:rps_part:3b129d25-a769-48fe-a28d-fc044a74382d:RPS_part_has_no_verified_model_applicability',
  'evidence_mapping',
  '{"reason":"RPS part has no verified model applicability","source_type":"rps_part","document_key":"rps_catalog:02155","source_record_id":"3b129d25-a769-48fe-a28d-fc044a74382d","physical_pdf_page":607,"candidate_concept_keys":[]}'::jsonb,
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
  'evidence_mapping:rps_part:3bff4bfb-11ce-4e12-9c79-1ec3f0cf0c67:RPS_part_has_no_verified_model_applicability',
  'evidence_mapping',
  '{"reason":"RPS part has no verified model applicability","source_type":"rps_part","document_key":"rps_catalog:02155","source_record_id":"3bff4bfb-11ce-4e12-9c79-1ec3f0cf0c67","physical_pdf_page":625,"candidate_concept_keys":[]}'::jsonb,
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
  'evidence_mapping:rps_part:3c9a5d5a-36ba-4ccf-b2d7-15562373dda3:RPS_part_has_no_verified_model_applicability',
  'evidence_mapping',
  '{"reason":"RPS part has no verified model applicability","source_type":"rps_part","document_key":"rps_catalog:02155","source_record_id":"3c9a5d5a-36ba-4ccf-b2d7-15562373dda3","physical_pdf_page":607,"candidate_concept_keys":[]}'::jsonb,
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
  'evidence_mapping:rps_part:3d3f29ae-feb3-4a13-9503-b156c44be3f8:RPS_part_has_no_verified_model_applicability',
  'evidence_mapping',
  '{"reason":"RPS part has no verified model applicability","source_type":"rps_part","document_key":"rps_catalog:02155","source_record_id":"3d3f29ae-feb3-4a13-9503-b156c44be3f8","physical_pdf_page":611,"candidate_concept_keys":[]}'::jsonb,
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
  'evidence_mapping:rps_part:3ffb2dd1-5205-4a21-8cdd-0114b05477e9:RPS_part_has_no_verified_model_applicability',
  'evidence_mapping',
  '{"reason":"RPS part has no verified model applicability","source_type":"rps_part","document_key":"rps_catalog:02155","source_record_id":"3ffb2dd1-5205-4a21-8cdd-0114b05477e9","physical_pdf_page":615,"candidate_concept_keys":[]}'::jsonb,
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
  'evidence_mapping:rps_part:41d3e322-9316-49e2-a7d1-afcfc0ee1ecc:RPS_part_has_no_verified_model_applicability',
  'evidence_mapping',
  '{"reason":"RPS part has no verified model applicability","source_type":"rps_part","document_key":"rps_catalog:02155","source_record_id":"41d3e322-9316-49e2-a7d1-afcfc0ee1ecc","physical_pdf_page":595,"candidate_concept_keys":[]}'::jsonb,
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
  'evidence_mapping:rps_part:42eddf93-0b56-404c-99ac-6869341e8ec9:RPS_part_has_no_verified_model_applicability',
  'evidence_mapping',
  '{"reason":"RPS part has no verified model applicability","source_type":"rps_part","document_key":"rps_catalog:02155","source_record_id":"42eddf93-0b56-404c-99ac-6869341e8ec9","physical_pdf_page":609,"candidate_concept_keys":[]}'::jsonb,
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
  'evidence_mapping:rps_part:433c8c10-553a-487c-bc1f-48de37c7b0ab:RPS_part_has_no_verified_model_applicability',
  'evidence_mapping',
  '{"reason":"RPS part has no verified model applicability","source_type":"rps_part","document_key":"rps_catalog:02155","source_record_id":"433c8c10-553a-487c-bc1f-48de37c7b0ab","physical_pdf_page":623,"candidate_concept_keys":[]}'::jsonb,
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
  'evidence_mapping:rps_part:4364604e-38a0-4340-a918-0fc977cb7cdf:RPS_part_has_no_verified_model_applicability',
  'evidence_mapping',
  '{"reason":"RPS part has no verified model applicability","source_type":"rps_part","document_key":"rps_catalog:02155","source_record_id":"4364604e-38a0-4340-a918-0fc977cb7cdf","physical_pdf_page":619,"candidate_concept_keys":[]}'::jsonb,
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
  'evidence_mapping:rps_part:44e494d3-7ae4-4d58-965d-048a9f612350:RPS_part_has_no_verified_model_applicability',
  'evidence_mapping',
  '{"reason":"RPS part has no verified model applicability","source_type":"rps_part","document_key":"rps_catalog:02155","source_record_id":"44e494d3-7ae4-4d58-965d-048a9f612350","physical_pdf_page":625,"candidate_concept_keys":[]}'::jsonb,
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
  'evidence_mapping:rps_part:46c6a779-0fb9-4565-98cb-c348281421b2:RPS_part_has_no_verified_model_applicability',
  'evidence_mapping',
  '{"reason":"RPS part has no verified model applicability","source_type":"rps_part","document_key":"rps_catalog:02155","source_record_id":"46c6a779-0fb9-4565-98cb-c348281421b2","physical_pdf_page":619,"candidate_concept_keys":[]}'::jsonb,
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
  'evidence_mapping:rps_part:47423140-3fd5-4c8c-982e-cd4e494264fe:RPS_part_has_no_verified_model_applicability',
  'evidence_mapping',
  '{"reason":"RPS part has no verified model applicability","source_type":"rps_part","document_key":"rps_catalog:02155","source_record_id":"47423140-3fd5-4c8c-982e-cd4e494264fe","physical_pdf_page":605,"candidate_concept_keys":[]}'::jsonb,
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
  'evidence_mapping:rps_part:489601d4-2f2d-48f2-a59a-61499b0f685b:RPS_part_has_no_verified_model_applicability',
  'evidence_mapping',
  '{"reason":"RPS part has no verified model applicability","source_type":"rps_part","document_key":"rps_catalog:02155","source_record_id":"489601d4-2f2d-48f2-a59a-61499b0f685b","physical_pdf_page":595,"candidate_concept_keys":[]}'::jsonb,
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
  'evidence_mapping:rps_part:48da7e28-869e-4be1-9cca-20c1ca394d2f:RPS_part_has_no_verified_model_applicability',
  'evidence_mapping',
  '{"reason":"RPS part has no verified model applicability","source_type":"rps_part","document_key":"rps_catalog:02155","source_record_id":"48da7e28-869e-4be1-9cca-20c1ca394d2f","physical_pdf_page":627,"candidate_concept_keys":[]}'::jsonb,
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
  'evidence_mapping:rps_part:494928ac-7f04-4dbf-8056-3e06220098fc:RPS_part_has_no_verified_model_applicability',
  'evidence_mapping',
  '{"reason":"RPS part has no verified model applicability","source_type":"rps_part","document_key":"rps_catalog:02155","source_record_id":"494928ac-7f04-4dbf-8056-3e06220098fc","physical_pdf_page":599,"candidate_concept_keys":[]}'::jsonb,
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
  'evidence_mapping:rps_part:4993726a-6140-4ba8-a30a-6e6330b980da:RPS_part_has_no_verified_model_applicability',
  'evidence_mapping',
  '{"reason":"RPS part has no verified model applicability","source_type":"rps_part","document_key":"rps_catalog:02155","source_record_id":"4993726a-6140-4ba8-a30a-6e6330b980da","physical_pdf_page":627,"candidate_concept_keys":[]}'::jsonb,
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
  'evidence_mapping:rps_part:4a847a85-5687-4d9d-bfe3-1f36bd25c9dd:RPS_part_has_no_verified_model_applicability',
  'evidence_mapping',
  '{"reason":"RPS part has no verified model applicability","source_type":"rps_part","document_key":"rps_catalog:02155","source_record_id":"4a847a85-5687-4d9d-bfe3-1f36bd25c9dd","physical_pdf_page":615,"candidate_concept_keys":[]}'::jsonb,
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
  'evidence_mapping:rps_part:4bbb74aa-6e33-42ff-90ab-8803b9b265c3:RPS_part_has_no_verified_model_applicability',
  'evidence_mapping',
  '{"reason":"RPS part has no verified model applicability","source_type":"rps_part","document_key":"rps_catalog:02155","source_record_id":"4bbb74aa-6e33-42ff-90ab-8803b9b265c3","physical_pdf_page":605,"candidate_concept_keys":[]}'::jsonb,
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
  'evidence_mapping:rps_part:4d5c7cf1-b524-4bf4-9a1c-7394a9f4145c:RPS_part_has_no_verified_model_applicability',
  'evidence_mapping',
  '{"reason":"RPS part has no verified model applicability","source_type":"rps_part","document_key":"rps_catalog:02155","source_record_id":"4d5c7cf1-b524-4bf4-9a1c-7394a9f4145c","physical_pdf_page":601,"candidate_concept_keys":[]}'::jsonb,
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
  'evidence_mapping:rps_part:50aaf62a-f7d8-42dc-8fd5-34f9bee57f67:RPS_part_has_no_verified_model_applicability',
  'evidence_mapping',
  '{"reason":"RPS part has no verified model applicability","source_type":"rps_part","document_key":"rps_catalog:02155","source_record_id":"50aaf62a-f7d8-42dc-8fd5-34f9bee57f67","physical_pdf_page":607,"candidate_concept_keys":[]}'::jsonb,
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
  'evidence_mapping:rps_part:5167d65f-05dc-4aa9-b729-a10bb21c6bf1:RPS_part_has_no_verified_model_applicability',
  'evidence_mapping',
  '{"reason":"RPS part has no verified model applicability","source_type":"rps_part","document_key":"rps_catalog:02155","source_record_id":"5167d65f-05dc-4aa9-b729-a10bb21c6bf1","physical_pdf_page":609,"candidate_concept_keys":[]}'::jsonb,
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
  'evidence_mapping:rps_part:51d317b1-4ab8-4574-8cca-05b2b6a750b6:RPS_part_has_no_verified_model_applicability',
  'evidence_mapping',
  '{"reason":"RPS part has no verified model applicability","source_type":"rps_part","document_key":"rps_catalog:02155","source_record_id":"51d317b1-4ab8-4574-8cca-05b2b6a750b6","physical_pdf_page":601,"candidate_concept_keys":[]}'::jsonb,
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
  'evidence_mapping:rps_part:52000300-2aef-40ac-ac19-daaebc8c55d3:RPS_part_has_no_verified_model_applicability',
  'evidence_mapping',
  '{"reason":"RPS part has no verified model applicability","source_type":"rps_part","document_key":"rps_catalog:02155","source_record_id":"52000300-2aef-40ac-ac19-daaebc8c55d3","physical_pdf_page":617,"candidate_concept_keys":[]}'::jsonb,
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
  'evidence_mapping:rps_part:521e40db-df53-4fb3-9752-3bb8a1acea29:RPS_part_has_no_verified_model_applicability',
  'evidence_mapping',
  '{"reason":"RPS part has no verified model applicability","source_type":"rps_part","document_key":"rps_catalog:02155","source_record_id":"521e40db-df53-4fb3-9752-3bb8a1acea29","physical_pdf_page":617,"candidate_concept_keys":[]}'::jsonb,
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
  'evidence_mapping:rps_part:52aa5ca3-1e41-4f6a-b9cf-917414d697fd:RPS_part_has_no_verified_model_applicability',
  'evidence_mapping',
  '{"reason":"RPS part has no verified model applicability","source_type":"rps_part","document_key":"rps_catalog:02155","source_record_id":"52aa5ca3-1e41-4f6a-b9cf-917414d697fd","physical_pdf_page":601,"candidate_concept_keys":[]}'::jsonb,
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
  'evidence_mapping:rps_part:53d3b9bd-ebc5-4df0-84c1-148781fef6a8:RPS_part_has_no_verified_model_applicability',
  'evidence_mapping',
  '{"reason":"RPS part has no verified model applicability","source_type":"rps_part","document_key":"rps_catalog:02155","source_record_id":"53d3b9bd-ebc5-4df0-84c1-148781fef6a8","physical_pdf_page":627,"candidate_concept_keys":[]}'::jsonb,
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
  'evidence_mapping:rps_part:53e99ba9-1db5-464c-8fbd-3d0e613ed378:RPS_part_has_no_verified_model_applicability',
  'evidence_mapping',
  '{"reason":"RPS part has no verified model applicability","source_type":"rps_part","document_key":"rps_catalog:02155","source_record_id":"53e99ba9-1db5-464c-8fbd-3d0e613ed378","physical_pdf_page":609,"candidate_concept_keys":[]}'::jsonb,
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
  'evidence_mapping:rps_part:5799fadd-4bbc-4397-a589-d93905ce9952:RPS_part_has_no_verified_model_applicability',
  'evidence_mapping',
  '{"reason":"RPS part has no verified model applicability","source_type":"rps_part","document_key":"rps_catalog:02155","source_record_id":"5799fadd-4bbc-4397-a589-d93905ce9952","physical_pdf_page":615,"candidate_concept_keys":[]}'::jsonb,
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
  'evidence_mapping:rps_part:57bdb68d-a9fc-452c-9619-614a676c8b08:RPS_part_has_no_verified_model_applicability',
  'evidence_mapping',
  '{"reason":"RPS part has no verified model applicability","source_type":"rps_part","document_key":"rps_catalog:02155","source_record_id":"57bdb68d-a9fc-452c-9619-614a676c8b08","physical_pdf_page":617,"candidate_concept_keys":[]}'::jsonb,
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
  'evidence_mapping:rps_part:58980a05-b90b-46f8-9d71-ebb337b11532:RPS_part_has_no_verified_model_applicability',
  'evidence_mapping',
  '{"reason":"RPS part has no verified model applicability","source_type":"rps_part","document_key":"rps_catalog:02155","source_record_id":"58980a05-b90b-46f8-9d71-ebb337b11532","physical_pdf_page":597,"candidate_concept_keys":[]}'::jsonb,
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
  'evidence_mapping:rps_part:592b8185-7707-46ef-b66f-57cefc9bb057:RPS_part_has_no_verified_model_applicability',
  'evidence_mapping',
  '{"reason":"RPS part has no verified model applicability","source_type":"rps_part","document_key":"rps_catalog:02155","source_record_id":"592b8185-7707-46ef-b66f-57cefc9bb057","physical_pdf_page":601,"candidate_concept_keys":[]}'::jsonb,
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
  'evidence_mapping:rps_part:5b02846c-d29f-4e1a-bba9-5e94aacb2423:RPS_part_has_no_verified_model_applicability',
  'evidence_mapping',
  '{"reason":"RPS part has no verified model applicability","source_type":"rps_part","document_key":"rps_catalog:02155","source_record_id":"5b02846c-d29f-4e1a-bba9-5e94aacb2423","physical_pdf_page":613,"candidate_concept_keys":[]}'::jsonb,
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
  'evidence_mapping:rps_part:5b22f046-b96d-4124-8b89-f4948d913683:RPS_part_has_no_verified_model_applicability',
  'evidence_mapping',
  '{"reason":"RPS part has no verified model applicability","source_type":"rps_part","document_key":"rps_catalog:02155","source_record_id":"5b22f046-b96d-4124-8b89-f4948d913683","physical_pdf_page":627,"candidate_concept_keys":[]}'::jsonb,
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
  'evidence_mapping:rps_part:5b277540-0e3c-4ccc-a6a7-ddacf3fe8d78:RPS_part_has_no_verified_model_applicability',
  'evidence_mapping',
  '{"reason":"RPS part has no verified model applicability","source_type":"rps_part","document_key":"rps_catalog:02155","source_record_id":"5b277540-0e3c-4ccc-a6a7-ddacf3fe8d78","physical_pdf_page":597,"candidate_concept_keys":[]}'::jsonb,
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
  'evidence_mapping:rps_part:5c19b4be-884e-48a3-9f19-c07c627b66d1:RPS_part_has_no_verified_model_applicability',
  'evidence_mapping',
  '{"reason":"RPS part has no verified model applicability","source_type":"rps_part","document_key":"rps_catalog:02155","source_record_id":"5c19b4be-884e-48a3-9f19-c07c627b66d1","physical_pdf_page":595,"candidate_concept_keys":[]}'::jsonb,
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
  'evidence_mapping:rps_part:5e76c201-8ad9-4fca-8031-26a25fc43e81:RPS_part_has_no_verified_model_applicability',
  'evidence_mapping',
  '{"reason":"RPS part has no verified model applicability","source_type":"rps_part","document_key":"rps_catalog:02155","source_record_id":"5e76c201-8ad9-4fca-8031-26a25fc43e81","physical_pdf_page":597,"candidate_concept_keys":[]}'::jsonb,
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
  'evidence_mapping:rps_part:5ef1a1db-baa2-4a04-9fc6-a3fde4181338:RPS_part_has_no_verified_model_applicability',
  'evidence_mapping',
  '{"reason":"RPS part has no verified model applicability","source_type":"rps_part","document_key":"rps_catalog:02155","source_record_id":"5ef1a1db-baa2-4a04-9fc6-a3fde4181338","physical_pdf_page":605,"candidate_concept_keys":[]}'::jsonb,
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
  'evidence_mapping:rps_part:5f00a3ea-f175-442f-a7dc-93b3fde15fa1:RPS_part_has_no_verified_model_applicability',
  'evidence_mapping',
  '{"reason":"RPS part has no verified model applicability","source_type":"rps_part","document_key":"rps_catalog:02155","source_record_id":"5f00a3ea-f175-442f-a7dc-93b3fde15fa1","physical_pdf_page":597,"candidate_concept_keys":[]}'::jsonb,
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
  'evidence_mapping:rps_part:601bf923-a25d-4870-90c2-25237553611e:RPS_part_has_no_verified_model_applicability',
  'evidence_mapping',
  '{"reason":"RPS part has no verified model applicability","source_type":"rps_part","document_key":"rps_catalog:02155","source_record_id":"601bf923-a25d-4870-90c2-25237553611e","physical_pdf_page":615,"candidate_concept_keys":[]}'::jsonb,
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
  'evidence_mapping:rps_part:60491aac-e50b-4894-b378-01dd25819799:RPS_part_has_no_verified_model_applicability',
  'evidence_mapping',
  '{"reason":"RPS part has no verified model applicability","source_type":"rps_part","document_key":"rps_catalog:02155","source_record_id":"60491aac-e50b-4894-b378-01dd25819799","physical_pdf_page":625,"candidate_concept_keys":[]}'::jsonb,
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
  'evidence_mapping:rps_part:60b300f7-cf54-4cf7-bdcf-ba16edad6d93:RPS_part_has_no_verified_model_applicability',
  'evidence_mapping',
  '{"reason":"RPS part has no verified model applicability","source_type":"rps_part","document_key":"rps_catalog:02155","source_record_id":"60b300f7-cf54-4cf7-bdcf-ba16edad6d93","physical_pdf_page":621,"candidate_concept_keys":[]}'::jsonb,
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
  'evidence_mapping:rps_part:61b51900-274f-4754-8246-800a2376c8dc:RPS_part_has_no_verified_model_applicability',
  'evidence_mapping',
  '{"reason":"RPS part has no verified model applicability","source_type":"rps_part","document_key":"rps_catalog:02155","source_record_id":"61b51900-274f-4754-8246-800a2376c8dc","physical_pdf_page":623,"candidate_concept_keys":[]}'::jsonb,
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
  'evidence_mapping:rps_part:6248a74d-3f3b-40f7-9d04-eb7d09c9133f:RPS_part_has_no_verified_model_applicability',
  'evidence_mapping',
  '{"reason":"RPS part has no verified model applicability","source_type":"rps_part","document_key":"rps_catalog:02155","source_record_id":"6248a74d-3f3b-40f7-9d04-eb7d09c9133f","physical_pdf_page":619,"candidate_concept_keys":[]}'::jsonb,
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
  'evidence_mapping:rps_part:626425fc-1fcb-4b95-bdf2-880664c52f6b:RPS_part_has_no_verified_model_applicability',
  'evidence_mapping',
  '{"reason":"RPS part has no verified model applicability","source_type":"rps_part","document_key":"rps_catalog:02155","source_record_id":"626425fc-1fcb-4b95-bdf2-880664c52f6b","physical_pdf_page":607,"candidate_concept_keys":[]}'::jsonb,
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
  'evidence_mapping:rps_part:6287f191-356d-4772-921a-bfacdb0540e1:RPS_part_has_no_verified_model_applicability',
  'evidence_mapping',
  '{"reason":"RPS part has no verified model applicability","source_type":"rps_part","document_key":"rps_catalog:02155","source_record_id":"6287f191-356d-4772-921a-bfacdb0540e1","physical_pdf_page":599,"candidate_concept_keys":[]}'::jsonb,
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
  'evidence_mapping:rps_part:62d0f87e-51d0-4e36-b26b-8e6519872119:RPS_part_has_no_verified_model_applicability',
  'evidence_mapping',
  '{"reason":"RPS part has no verified model applicability","source_type":"rps_part","document_key":"rps_catalog:02155","source_record_id":"62d0f87e-51d0-4e36-b26b-8e6519872119","physical_pdf_page":601,"candidate_concept_keys":[]}'::jsonb,
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
  'evidence_mapping:rps_part:647bb9f2-2c2f-4986-9fd7-8d206f40f6cf:RPS_part_has_no_verified_model_applicability',
  'evidence_mapping',
  '{"reason":"RPS part has no verified model applicability","source_type":"rps_part","document_key":"rps_catalog:02155","source_record_id":"647bb9f2-2c2f-4986-9fd7-8d206f40f6cf","physical_pdf_page":627,"candidate_concept_keys":[]}'::jsonb,
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
  'evidence_mapping:rps_part:666df385-e3ac-459b-a469-10a28511f164:RPS_part_has_no_verified_model_applicability',
  'evidence_mapping',
  '{"reason":"RPS part has no verified model applicability","source_type":"rps_part","document_key":"rps_catalog:02155","source_record_id":"666df385-e3ac-459b-a469-10a28511f164","physical_pdf_page":617,"candidate_concept_keys":[]}'::jsonb,
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
  'evidence_mapping:rps_part:6dc69471-a50e-4715-b7e5-c3f58f801387:RPS_part_has_no_verified_model_applicability',
  'evidence_mapping',
  '{"reason":"RPS part has no verified model applicability","source_type":"rps_part","document_key":"rps_catalog:02155","source_record_id":"6dc69471-a50e-4715-b7e5-c3f58f801387","physical_pdf_page":625,"candidate_concept_keys":[]}'::jsonb,
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
  'evidence_mapping:rps_part:6e07d22c-136d-47d8-896e-399404aa2958:RPS_part_has_no_verified_model_applicability',
  'evidence_mapping',
  '{"reason":"RPS part has no verified model applicability","source_type":"rps_part","document_key":"rps_catalog:02155","source_record_id":"6e07d22c-136d-47d8-896e-399404aa2958","physical_pdf_page":615,"candidate_concept_keys":[]}'::jsonb,
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
  'evidence_mapping:rps_part:6e63accb-c42a-44d0-b7ea-d08200f37bb6:RPS_part_has_no_verified_model_applicability',
  'evidence_mapping',
  '{"reason":"RPS part has no verified model applicability","source_type":"rps_part","document_key":"rps_catalog:02155","source_record_id":"6e63accb-c42a-44d0-b7ea-d08200f37bb6","physical_pdf_page":617,"candidate_concept_keys":[]}'::jsonb,
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
  'evidence_mapping:rps_part:6f959415-d29b-4da7-a01a-519378b53610:RPS_part_has_no_verified_model_applicability',
  'evidence_mapping',
  '{"reason":"RPS part has no verified model applicability","source_type":"rps_part","document_key":"rps_catalog:02155","source_record_id":"6f959415-d29b-4da7-a01a-519378b53610","physical_pdf_page":599,"candidate_concept_keys":[]}'::jsonb,
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
  'evidence_mapping:rps_part:7082a9c0-4f19-42ee-93d7-db186fece136:RPS_part_has_no_verified_model_applicability',
  'evidence_mapping',
  '{"reason":"RPS part has no verified model applicability","source_type":"rps_part","document_key":"rps_catalog:02155","source_record_id":"7082a9c0-4f19-42ee-93d7-db186fece136","physical_pdf_page":605,"candidate_concept_keys":[]}'::jsonb,
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
  'evidence_mapping:rps_part:72861940-e710-4d91-84d0-52cf9b07afbd:RPS_part_has_no_verified_model_applicability',
  'evidence_mapping',
  '{"reason":"RPS part has no verified model applicability","source_type":"rps_part","document_key":"rps_catalog:02155","source_record_id":"72861940-e710-4d91-84d0-52cf9b07afbd","physical_pdf_page":601,"candidate_concept_keys":[]}'::jsonb,
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
  'evidence_mapping:rps_part:7563034c-a299-4e25-9398-dbde023ddae5:RPS_part_has_no_verified_model_applicability',
  'evidence_mapping',
  '{"reason":"RPS part has no verified model applicability","source_type":"rps_part","document_key":"rps_catalog:02155","source_record_id":"7563034c-a299-4e25-9398-dbde023ddae5","physical_pdf_page":607,"candidate_concept_keys":[]}'::jsonb,
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
  'evidence_mapping:rps_part:766c0bc2-777a-43ae-8578-c1a86cdef5ed:RPS_part_has_no_verified_model_applicability',
  'evidence_mapping',
  '{"reason":"RPS part has no verified model applicability","source_type":"rps_part","document_key":"rps_catalog:02155","source_record_id":"766c0bc2-777a-43ae-8578-c1a86cdef5ed","physical_pdf_page":623,"candidate_concept_keys":[]}'::jsonb,
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
  'evidence_mapping:rps_part:77ee8029-e215-46e6-beb2-859cd9dea881:RPS_part_has_no_verified_model_applicability',
  'evidence_mapping',
  '{"reason":"RPS part has no verified model applicability","source_type":"rps_part","document_key":"rps_catalog:02155","source_record_id":"77ee8029-e215-46e6-beb2-859cd9dea881","physical_pdf_page":627,"candidate_concept_keys":[]}'::jsonb,
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
  'evidence_mapping:rps_part:7821d9f5-5630-4e2a-92fb-158732c96180:RPS_part_has_no_verified_model_applicability',
  'evidence_mapping',
  '{"reason":"RPS part has no verified model applicability","source_type":"rps_part","document_key":"rps_catalog:02155","source_record_id":"7821d9f5-5630-4e2a-92fb-158732c96180","physical_pdf_page":627,"candidate_concept_keys":[]}'::jsonb,
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
  'evidence_mapping:rps_part:79291067-89c1-439b-a580-90d9339d45b0:RPS_part_has_no_verified_model_applicability',
  'evidence_mapping',
  '{"reason":"RPS part has no verified model applicability","source_type":"rps_part","document_key":"rps_catalog:02155","source_record_id":"79291067-89c1-439b-a580-90d9339d45b0","physical_pdf_page":619,"candidate_concept_keys":[]}'::jsonb,
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
  'evidence_mapping:rps_part:81fa1b51-77e1-4595-b4ea-13432599631d:RPS_part_has_no_verified_model_applicability',
  'evidence_mapping',
  '{"reason":"RPS part has no verified model applicability","source_type":"rps_part","document_key":"rps_catalog:02155","source_record_id":"81fa1b51-77e1-4595-b4ea-13432599631d","physical_pdf_page":619,"candidate_concept_keys":[]}'::jsonb,
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
  'evidence_mapping:rps_part:82fb47b7-205e-4b43-a153-187a89abadf7:RPS_part_has_no_verified_model_applicability',
  'evidence_mapping',
  '{"reason":"RPS part has no verified model applicability","source_type":"rps_part","document_key":"rps_catalog:02155","source_record_id":"82fb47b7-205e-4b43-a153-187a89abadf7","physical_pdf_page":623,"candidate_concept_keys":[]}'::jsonb,
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
  'evidence_mapping:rps_part:84b360a9-c7ac-4e57-91a5-e9c71c57792e:RPS_part_has_no_verified_model_applicability',
  'evidence_mapping',
  '{"reason":"RPS part has no verified model applicability","source_type":"rps_part","document_key":"rps_catalog:02155","source_record_id":"84b360a9-c7ac-4e57-91a5-e9c71c57792e","physical_pdf_page":611,"candidate_concept_keys":[]}'::jsonb,
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
  'evidence_mapping:rps_part:84e64034-565b-41dd-b735-12ef07e5b45b:RPS_part_has_no_verified_model_applicability',
  'evidence_mapping',
  '{"reason":"RPS part has no verified model applicability","source_type":"rps_part","document_key":"rps_catalog:02155","source_record_id":"84e64034-565b-41dd-b735-12ef07e5b45b","physical_pdf_page":595,"candidate_concept_keys":[]}'::jsonb,
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
  'evidence_mapping:rps_part:86ebf58e-2885-43a8-aaae-9f43e5abff4f:RPS_part_has_no_verified_model_applicability',
  'evidence_mapping',
  '{"reason":"RPS part has no verified model applicability","source_type":"rps_part","document_key":"rps_catalog:02155","source_record_id":"86ebf58e-2885-43a8-aaae-9f43e5abff4f","physical_pdf_page":605,"candidate_concept_keys":[]}'::jsonb,
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
  'evidence_mapping:rps_part:88f5dac1-7b67-4b5e-8571-57d459107d17:RPS_part_has_no_verified_model_applicability',
  'evidence_mapping',
  '{"reason":"RPS part has no verified model applicability","source_type":"rps_part","document_key":"rps_catalog:02155","source_record_id":"88f5dac1-7b67-4b5e-8571-57d459107d17","physical_pdf_page":617,"candidate_concept_keys":[]}'::jsonb,
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
  'evidence_mapping:rps_part:89dda58d-ce2e-445c-a79b-25b6e004eff5:RPS_part_has_no_verified_model_applicability',
  'evidence_mapping',
  '{"reason":"RPS part has no verified model applicability","source_type":"rps_part","document_key":"rps_catalog:02155","source_record_id":"89dda58d-ce2e-445c-a79b-25b6e004eff5","physical_pdf_page":617,"candidate_concept_keys":[]}'::jsonb,
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
  'evidence_mapping:rps_part:8a55f9dd-4dff-450d-81e9-093f74005120:RPS_part_has_no_verified_model_applicability',
  'evidence_mapping',
  '{"reason":"RPS part has no verified model applicability","source_type":"rps_part","document_key":"rps_catalog:02155","source_record_id":"8a55f9dd-4dff-450d-81e9-093f74005120","physical_pdf_page":623,"candidate_concept_keys":[]}'::jsonb,
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
  'evidence_mapping:rps_part:8b6844ec-3f90-42da-99f9-853ffad96f5e:RPS_part_has_no_verified_model_applicability',
  'evidence_mapping',
  '{"reason":"RPS part has no verified model applicability","source_type":"rps_part","document_key":"rps_catalog:02155","source_record_id":"8b6844ec-3f90-42da-99f9-853ffad96f5e","physical_pdf_page":627,"candidate_concept_keys":[]}'::jsonb,
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
  'evidence_mapping:rps_part:8b840563-17c5-48f1-a7f7-95edb51cd5f9:RPS_part_has_no_verified_model_applicability',
  'evidence_mapping',
  '{"reason":"RPS part has no verified model applicability","source_type":"rps_part","document_key":"rps_catalog:02155","source_record_id":"8b840563-17c5-48f1-a7f7-95edb51cd5f9","physical_pdf_page":625,"candidate_concept_keys":[]}'::jsonb,
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
  'evidence_mapping:rps_part:90c2b1f6-0595-4747-8402-65dcd1b06002:RPS_part_has_no_verified_model_applicability',
  'evidence_mapping',
  '{"reason":"RPS part has no verified model applicability","source_type":"rps_part","document_key":"rps_catalog:02155","source_record_id":"90c2b1f6-0595-4747-8402-65dcd1b06002","physical_pdf_page":609,"candidate_concept_keys":[]}'::jsonb,
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
  'evidence_mapping:rps_part:920dbfe1-742c-489a-9ccb-790021376ff5:RPS_part_has_no_verified_model_applicability',
  'evidence_mapping',
  '{"reason":"RPS part has no verified model applicability","source_type":"rps_part","document_key":"rps_catalog:02155","source_record_id":"920dbfe1-742c-489a-9ccb-790021376ff5","physical_pdf_page":617,"candidate_concept_keys":[]}'::jsonb,
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
  'evidence_mapping:rps_part:93711b8c-d769-4690-a751-81d4a383dc8c:RPS_part_has_no_verified_model_applicability',
  'evidence_mapping',
  '{"reason":"RPS part has no verified model applicability","source_type":"rps_part","document_key":"rps_catalog:02155","source_record_id":"93711b8c-d769-4690-a751-81d4a383dc8c","physical_pdf_page":599,"candidate_concept_keys":[]}'::jsonb,
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
  'evidence_mapping:rps_part:940b9d7a-d197-48ce-91e6-ae8a70668b5d:RPS_part_has_no_verified_model_applicability',
  'evidence_mapping',
  '{"reason":"RPS part has no verified model applicability","source_type":"rps_part","document_key":"rps_catalog:02155","source_record_id":"940b9d7a-d197-48ce-91e6-ae8a70668b5d","physical_pdf_page":607,"candidate_concept_keys":[]}'::jsonb,
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
  'evidence_mapping:rps_part:944817a4-0ca2-4015-98c2-a3f6327b3f03:RPS_part_has_no_verified_model_applicability',
  'evidence_mapping',
  '{"reason":"RPS part has no verified model applicability","source_type":"rps_part","document_key":"rps_catalog:02155","source_record_id":"944817a4-0ca2-4015-98c2-a3f6327b3f03","physical_pdf_page":617,"candidate_concept_keys":[]}'::jsonb,
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
  'evidence_mapping:rps_part:95362a24-9a4b-4ada-a48e-6f073424c0df:RPS_part_has_no_verified_model_applicability',
  'evidence_mapping',
  '{"reason":"RPS part has no verified model applicability","source_type":"rps_part","document_key":"rps_catalog:02155","source_record_id":"95362a24-9a4b-4ada-a48e-6f073424c0df","physical_pdf_page":617,"candidate_concept_keys":[]}'::jsonb,
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
  'evidence_mapping:rps_part:96130aad-e50f-4942-9c3d-45fa2338c7db:RPS_part_has_no_verified_model_applicability',
  'evidence_mapping',
  '{"reason":"RPS part has no verified model applicability","source_type":"rps_part","document_key":"rps_catalog:02155","source_record_id":"96130aad-e50f-4942-9c3d-45fa2338c7db","physical_pdf_page":595,"candidate_concept_keys":[]}'::jsonb,
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
  'evidence_mapping:rps_part:967fa4ae-d4f8-4245-b25e-d44800e35502:RPS_part_has_no_verified_model_applicability',
  'evidence_mapping',
  '{"reason":"RPS part has no verified model applicability","source_type":"rps_part","document_key":"rps_catalog:02155","source_record_id":"967fa4ae-d4f8-4245-b25e-d44800e35502","physical_pdf_page":627,"candidate_concept_keys":[]}'::jsonb,
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
  'evidence_mapping:rps_part:991b3598-376a-498c-99a5-5ef56441264a:RPS_part_has_no_verified_model_applicability',
  'evidence_mapping',
  '{"reason":"RPS part has no verified model applicability","source_type":"rps_part","document_key":"rps_catalog:02155","source_record_id":"991b3598-376a-498c-99a5-5ef56441264a","physical_pdf_page":597,"candidate_concept_keys":[]}'::jsonb,
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
  'evidence_mapping:rps_part:997914a3-bbbf-4640-af43-a30fb1d6b7ff:RPS_part_has_no_verified_model_applicability',
  'evidence_mapping',
  '{"reason":"RPS part has no verified model applicability","source_type":"rps_part","document_key":"rps_catalog:02155","source_record_id":"997914a3-bbbf-4640-af43-a30fb1d6b7ff","physical_pdf_page":611,"candidate_concept_keys":[]}'::jsonb,
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
  'evidence_mapping:rps_part:99aa7473-fcb6-4c37-874c-7efa1e0d8e0a:RPS_part_has_no_verified_model_applicability',
  'evidence_mapping',
  '{"reason":"RPS part has no verified model applicability","source_type":"rps_part","document_key":"rps_catalog:02155","source_record_id":"99aa7473-fcb6-4c37-874c-7efa1e0d8e0a","physical_pdf_page":605,"candidate_concept_keys":[]}'::jsonb,
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
  'evidence_mapping:rps_part:9a0ec0d0-bb15-4f62-b143-caf6b9737cc5:RPS_part_has_no_verified_model_applicability',
  'evidence_mapping',
  '{"reason":"RPS part has no verified model applicability","source_type":"rps_part","document_key":"rps_catalog:02155","source_record_id":"9a0ec0d0-bb15-4f62-b143-caf6b9737cc5","physical_pdf_page":623,"candidate_concept_keys":[]}'::jsonb,
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
  'evidence_mapping:rps_part:9a96d30d-0dc5-400b-9a12-05c42437c561:RPS_part_has_no_verified_model_applicability',
  'evidence_mapping',
  '{"reason":"RPS part has no verified model applicability","source_type":"rps_part","document_key":"rps_catalog:02155","source_record_id":"9a96d30d-0dc5-400b-9a12-05c42437c561","physical_pdf_page":625,"candidate_concept_keys":[]}'::jsonb,
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
  'evidence_mapping:rps_part:9afb752c-2f7f-43f8-83ea-ebf3af607096:RPS_part_has_no_verified_model_applicability',
  'evidence_mapping',
  '{"reason":"RPS part has no verified model applicability","source_type":"rps_part","document_key":"rps_catalog:02155","source_record_id":"9afb752c-2f7f-43f8-83ea-ebf3af607096","physical_pdf_page":623,"candidate_concept_keys":[]}'::jsonb,
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
  'evidence_mapping:rps_part:9bb227b6-3026-4ead-be42-268e36185321:RPS_part_has_no_verified_model_applicability',
  'evidence_mapping',
  '{"reason":"RPS part has no verified model applicability","source_type":"rps_part","document_key":"rps_catalog:02155","source_record_id":"9bb227b6-3026-4ead-be42-268e36185321","physical_pdf_page":607,"candidate_concept_keys":[]}'::jsonb,
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
  'evidence_mapping:rps_part:9c0d396e-08e7-418f-87e2-7fdc64994d07:RPS_part_has_no_verified_model_applicability',
  'evidence_mapping',
  '{"reason":"RPS part has no verified model applicability","source_type":"rps_part","document_key":"rps_catalog:02155","source_record_id":"9c0d396e-08e7-418f-87e2-7fdc64994d07","physical_pdf_page":607,"candidate_concept_keys":[]}'::jsonb,
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
  'evidence_mapping:rps_part:9c5cc3be-8c29-4b56-a439-d8e41e78a62e:RPS_part_has_no_verified_model_applicability',
  'evidence_mapping',
  '{"reason":"RPS part has no verified model applicability","source_type":"rps_part","document_key":"rps_catalog:02155","source_record_id":"9c5cc3be-8c29-4b56-a439-d8e41e78a62e","physical_pdf_page":611,"candidate_concept_keys":[]}'::jsonb,
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
  'evidence_mapping:rps_part:9f7e8aec-ca05-4fc4-a225-5ae009b6ba56:RPS_part_has_no_verified_model_applicability',
  'evidence_mapping',
  '{"reason":"RPS part has no verified model applicability","source_type":"rps_part","document_key":"rps_catalog:02155","source_record_id":"9f7e8aec-ca05-4fc4-a225-5ae009b6ba56","physical_pdf_page":597,"candidate_concept_keys":[]}'::jsonb,
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
  'evidence_mapping:rps_part:a276b062-60a4-4e7f-8160-41d721c698d9:RPS_part_has_no_verified_model_applicability',
  'evidence_mapping',
  '{"reason":"RPS part has no verified model applicability","source_type":"rps_part","document_key":"rps_catalog:02155","source_record_id":"a276b062-60a4-4e7f-8160-41d721c698d9","physical_pdf_page":623,"candidate_concept_keys":[]}'::jsonb,
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
  'evidence_mapping:rps_part:a29b830b-33a8-4e9f-95e9-df9265ec0d5e:RPS_part_has_no_verified_model_applicability',
  'evidence_mapping',
  '{"reason":"RPS part has no verified model applicability","source_type":"rps_part","document_key":"rps_catalog:02155","source_record_id":"a29b830b-33a8-4e9f-95e9-df9265ec0d5e","physical_pdf_page":625,"candidate_concept_keys":[]}'::jsonb,
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
  'evidence_mapping:rps_part:a6413f99-1c63-414d-858c-724baac4c57b:RPS_part_has_no_verified_model_applicability',
  'evidence_mapping',
  '{"reason":"RPS part has no verified model applicability","source_type":"rps_part","document_key":"rps_catalog:02155","source_record_id":"a6413f99-1c63-414d-858c-724baac4c57b","physical_pdf_page":599,"candidate_concept_keys":[]}'::jsonb,
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
  'evidence_mapping:rps_part:a72b9390-d112-4901-8487-3d7a38e574ee:RPS_part_has_no_verified_model_applicability',
  'evidence_mapping',
  '{"reason":"RPS part has no verified model applicability","source_type":"rps_part","document_key":"rps_catalog:02155","source_record_id":"a72b9390-d112-4901-8487-3d7a38e574ee","physical_pdf_page":605,"candidate_concept_keys":[]}'::jsonb,
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
  'evidence_mapping:rps_part:a910d6b7-4af9-461a-98f5-1a04fd9b2404:RPS_part_has_no_verified_model_applicability',
  'evidence_mapping',
  '{"reason":"RPS part has no verified model applicability","source_type":"rps_part","document_key":"rps_catalog:02155","source_record_id":"a910d6b7-4af9-461a-98f5-1a04fd9b2404","physical_pdf_page":617,"candidate_concept_keys":[]}'::jsonb,
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
  'evidence_mapping:rps_part:a913bde7-38a8-40b2-8ac7-908e1342d133:RPS_part_has_no_verified_model_applicability',
  'evidence_mapping',
  '{"reason":"RPS part has no verified model applicability","source_type":"rps_part","document_key":"rps_catalog:02155","source_record_id":"a913bde7-38a8-40b2-8ac7-908e1342d133","physical_pdf_page":627,"candidate_concept_keys":[]}'::jsonb,
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
  'evidence_mapping:rps_part:a9aa5eb6-4f85-477e-91ea-9b8d250d994e:RPS_part_has_no_verified_model_applicability',
  'evidence_mapping',
  '{"reason":"RPS part has no verified model applicability","source_type":"rps_part","document_key":"rps_catalog:02155","source_record_id":"a9aa5eb6-4f85-477e-91ea-9b8d250d994e","physical_pdf_page":611,"candidate_concept_keys":[]}'::jsonb,
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
  'evidence_mapping:rps_part:aa1ce5fa-248a-43b8-8775-577819c2e69e:RPS_part_has_no_verified_model_applicability',
  'evidence_mapping',
  '{"reason":"RPS part has no verified model applicability","source_type":"rps_part","document_key":"rps_catalog:02155","source_record_id":"aa1ce5fa-248a-43b8-8775-577819c2e69e","physical_pdf_page":609,"candidate_concept_keys":[]}'::jsonb,
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
  'evidence_mapping:rps_part:ab88cf6c-dfc2-4fa4-8351-284396fd24dd:RPS_part_has_no_verified_model_applicability',
  'evidence_mapping',
  '{"reason":"RPS part has no verified model applicability","source_type":"rps_part","document_key":"rps_catalog:02155","source_record_id":"ab88cf6c-dfc2-4fa4-8351-284396fd24dd","physical_pdf_page":625,"candidate_concept_keys":[]}'::jsonb,
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
  'evidence_mapping:rps_part:ac89d181-e4c3-43af-b394-adc038cef4ea:RPS_part_has_no_verified_model_applicability',
  'evidence_mapping',
  '{"reason":"RPS part has no verified model applicability","source_type":"rps_part","document_key":"rps_catalog:02155","source_record_id":"ac89d181-e4c3-43af-b394-adc038cef4ea","physical_pdf_page":623,"candidate_concept_keys":[]}'::jsonb,
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
  'evidence_mapping:rps_part:ad68972b-f775-493b-a07a-d5d36917cbfd:RPS_part_has_no_verified_model_applicability',
  'evidence_mapping',
  '{"reason":"RPS part has no verified model applicability","source_type":"rps_part","document_key":"rps_catalog:02155","source_record_id":"ad68972b-f775-493b-a07a-d5d36917cbfd","physical_pdf_page":611,"candidate_concept_keys":[]}'::jsonb,
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
  'evidence_mapping:rps_part:ae7572bf-1ff1-409b-89a5-1589ccbb9a97:RPS_part_has_no_verified_model_applicability',
  'evidence_mapping',
  '{"reason":"RPS part has no verified model applicability","source_type":"rps_part","document_key":"rps_catalog:02155","source_record_id":"ae7572bf-1ff1-409b-89a5-1589ccbb9a97","physical_pdf_page":605,"candidate_concept_keys":[]}'::jsonb,
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
  'evidence_mapping:rps_part:b05a2284-489f-40df-8753-2df68495873c:RPS_part_has_no_verified_model_applicability',
  'evidence_mapping',
  '{"reason":"RPS part has no verified model applicability","source_type":"rps_part","document_key":"rps_catalog:02155","source_record_id":"b05a2284-489f-40df-8753-2df68495873c","physical_pdf_page":595,"candidate_concept_keys":[]}'::jsonb,
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
  'evidence_mapping:rps_part:b08fbf29-a6fd-4e0b-a127-3f8d3caf79fd:RPS_part_has_no_verified_model_applicability',
  'evidence_mapping',
  '{"reason":"RPS part has no verified model applicability","source_type":"rps_part","document_key":"rps_catalog:02155","source_record_id":"b08fbf29-a6fd-4e0b-a127-3f8d3caf79fd","physical_pdf_page":597,"candidate_concept_keys":[]}'::jsonb,
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
  'evidence_mapping:rps_part:b0ee78fa-0001-4106-a2d5-b93602f0e89e:RPS_part_has_no_verified_model_applicability',
  'evidence_mapping',
  '{"reason":"RPS part has no verified model applicability","source_type":"rps_part","document_key":"rps_catalog:02155","source_record_id":"b0ee78fa-0001-4106-a2d5-b93602f0e89e","physical_pdf_page":599,"candidate_concept_keys":[]}'::jsonb,
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
  'evidence_mapping:rps_part:b1c2b6df-d5ad-40cf-b0e1-2a0f20cbea06:RPS_part_has_no_verified_model_applicability',
  'evidence_mapping',
  '{"reason":"RPS part has no verified model applicability","source_type":"rps_part","document_key":"rps_catalog:02155","source_record_id":"b1c2b6df-d5ad-40cf-b0e1-2a0f20cbea06","physical_pdf_page":627,"candidate_concept_keys":[]}'::jsonb,
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
  'evidence_mapping:rps_part:b3c8cc0f-21f8-46f8-a452-aa4045e1ed16:RPS_part_has_no_verified_model_applicability',
  'evidence_mapping',
  '{"reason":"RPS part has no verified model applicability","source_type":"rps_part","document_key":"rps_catalog:02155","source_record_id":"b3c8cc0f-21f8-46f8-a452-aa4045e1ed16","physical_pdf_page":605,"candidate_concept_keys":[]}'::jsonb,
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
  'evidence_mapping:rps_part:b6547799-631d-4bbe-ae9f-9be554fb4968:RPS_part_has_no_verified_model_applicability',
  'evidence_mapping',
  '{"reason":"RPS part has no verified model applicability","source_type":"rps_part","document_key":"rps_catalog:02155","source_record_id":"b6547799-631d-4bbe-ae9f-9be554fb4968","physical_pdf_page":613,"candidate_concept_keys":[]}'::jsonb,
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
  'evidence_mapping:rps_part:ba4ef937-1964-4d96-a4a5-c93e8d7df83e:RPS_part_has_no_verified_model_applicability',
  'evidence_mapping',
  '{"reason":"RPS part has no verified model applicability","source_type":"rps_part","document_key":"rps_catalog:02155","source_record_id":"ba4ef937-1964-4d96-a4a5-c93e8d7df83e","physical_pdf_page":607,"candidate_concept_keys":[]}'::jsonb,
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
  'evidence_mapping:rps_part:ba98fa1f-cc6c-4ec3-8b55-6a70db1005d5:RPS_part_has_no_verified_model_applicability',
  'evidence_mapping',
  '{"reason":"RPS part has no verified model applicability","source_type":"rps_part","document_key":"rps_catalog:02155","source_record_id":"ba98fa1f-cc6c-4ec3-8b55-6a70db1005d5","physical_pdf_page":601,"candidate_concept_keys":[]}'::jsonb,
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
  'evidence_mapping:rps_part:babe515f-9382-4bee-bb5e-ed2772fc79eb:RPS_part_has_no_verified_model_applicability',
  'evidence_mapping',
  '{"reason":"RPS part has no verified model applicability","source_type":"rps_part","document_key":"rps_catalog:02155","source_record_id":"babe515f-9382-4bee-bb5e-ed2772fc79eb","physical_pdf_page":595,"candidate_concept_keys":[]}'::jsonb,
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
  'evidence_mapping:rps_part:bad123d7-aca4-41f5-9962-effb789d77a1:RPS_part_has_no_verified_model_applicability',
  'evidence_mapping',
  '{"reason":"RPS part has no verified model applicability","source_type":"rps_part","document_key":"rps_catalog:02155","source_record_id":"bad123d7-aca4-41f5-9962-effb789d77a1","physical_pdf_page":597,"candidate_concept_keys":[]}'::jsonb,
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
  'evidence_mapping:rps_part:bb5eeb66-5f44-4fe4-a3e4-70064b6f45a7:RPS_part_has_no_verified_model_applicability',
  'evidence_mapping',
  '{"reason":"RPS part has no verified model applicability","source_type":"rps_part","document_key":"rps_catalog:02155","source_record_id":"bb5eeb66-5f44-4fe4-a3e4-70064b6f45a7","physical_pdf_page":603,"candidate_concept_keys":[]}'::jsonb,
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
  'evidence_mapping:rps_part:bdd48364-44e8-4d7f-a78d-6837bab8374e:RPS_part_has_no_verified_model_applicability',
  'evidence_mapping',
  '{"reason":"RPS part has no verified model applicability","source_type":"rps_part","document_key":"rps_catalog:02155","source_record_id":"bdd48364-44e8-4d7f-a78d-6837bab8374e","physical_pdf_page":619,"candidate_concept_keys":[]}'::jsonb,
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
  'evidence_mapping:rps_part:be03e693-eae1-4642-9c42-d672d2c7f927:RPS_part_has_no_verified_model_applicability',
  'evidence_mapping',
  '{"reason":"RPS part has no verified model applicability","source_type":"rps_part","document_key":"rps_catalog:02155","source_record_id":"be03e693-eae1-4642-9c42-d672d2c7f927","physical_pdf_page":619,"candidate_concept_keys":[]}'::jsonb,
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
  'evidence_mapping:rps_part:bee4dac8-7acc-4beb-9c4b-56fa2a68b4f5:RPS_part_has_no_verified_model_applicability',
  'evidence_mapping',
  '{"reason":"RPS part has no verified model applicability","source_type":"rps_part","document_key":"rps_catalog:02155","source_record_id":"bee4dac8-7acc-4beb-9c4b-56fa2a68b4f5","physical_pdf_page":617,"candidate_concept_keys":[]}'::jsonb,
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
  'evidence_mapping:rps_part:c3cbd053-8a14-4bde-8365-15b61921a080:RPS_part_has_no_verified_model_applicability',
  'evidence_mapping',
  '{"reason":"RPS part has no verified model applicability","source_type":"rps_part","document_key":"rps_catalog:02155","source_record_id":"c3cbd053-8a14-4bde-8365-15b61921a080","physical_pdf_page":615,"candidate_concept_keys":[]}'::jsonb,
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
  'evidence_mapping:rps_part:c3d521a8-a5cd-4458-ade5-36da4df412e8:RPS_part_has_no_verified_model_applicability',
  'evidence_mapping',
  '{"reason":"RPS part has no verified model applicability","source_type":"rps_part","document_key":"rps_catalog:02155","source_record_id":"c3d521a8-a5cd-4458-ade5-36da4df412e8","physical_pdf_page":627,"candidate_concept_keys":[]}'::jsonb,
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
  'evidence_mapping:rps_part:c4c66026-8754-40ca-b92d-4e85c47170c9:RPS_part_has_no_verified_model_applicability',
  'evidence_mapping',
  '{"reason":"RPS part has no verified model applicability","source_type":"rps_part","document_key":"rps_catalog:02155","source_record_id":"c4c66026-8754-40ca-b92d-4e85c47170c9","physical_pdf_page":599,"candidate_concept_keys":[]}'::jsonb,
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
  'evidence_mapping:rps_part:c831d826-548e-4a69-9f8d-51e544478d5d:RPS_part_has_no_verified_model_applicability',
  'evidence_mapping',
  '{"reason":"RPS part has no verified model applicability","source_type":"rps_part","document_key":"rps_catalog:02155","source_record_id":"c831d826-548e-4a69-9f8d-51e544478d5d","physical_pdf_page":625,"candidate_concept_keys":[]}'::jsonb,
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
  'evidence_mapping:rps_part:c88fb785-83b9-4aca-94f9-7c33ecd33d3a:RPS_part_has_no_verified_model_applicability',
  'evidence_mapping',
  '{"reason":"RPS part has no verified model applicability","source_type":"rps_part","document_key":"rps_catalog:02155","source_record_id":"c88fb785-83b9-4aca-94f9-7c33ecd33d3a","physical_pdf_page":619,"candidate_concept_keys":[]}'::jsonb,
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
  'evidence_mapping:rps_part:c8ef96d7-5c18-4496-8a47-cf7c04242092:RPS_part_has_no_verified_model_applicability',
  'evidence_mapping',
  '{"reason":"RPS part has no verified model applicability","source_type":"rps_part","document_key":"rps_catalog:02155","source_record_id":"c8ef96d7-5c18-4496-8a47-cf7c04242092","physical_pdf_page":609,"candidate_concept_keys":[]}'::jsonb,
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
  'evidence_mapping:rps_part:c8fa0a0b-dbf1-44ab-b433-2b6b756ddf03:RPS_part_has_no_verified_model_applicability',
  'evidence_mapping',
  '{"reason":"RPS part has no verified model applicability","source_type":"rps_part","document_key":"rps_catalog:02155","source_record_id":"c8fa0a0b-dbf1-44ab-b433-2b6b756ddf03","physical_pdf_page":611,"candidate_concept_keys":[]}'::jsonb,
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
  'evidence_mapping:rps_part:c91408aa-e6f9-45d4-b580-8b272d7a2d79:RPS_part_has_no_verified_model_applicability',
  'evidence_mapping',
  '{"reason":"RPS part has no verified model applicability","source_type":"rps_part","document_key":"rps_catalog:02155","source_record_id":"c91408aa-e6f9-45d4-b580-8b272d7a2d79","physical_pdf_page":623,"candidate_concept_keys":[]}'::jsonb,
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
  'evidence_mapping:rps_part:ca299eee-92ae-4c94-8ecc-290186cff347:RPS_part_has_no_verified_model_applicability',
  'evidence_mapping',
  '{"reason":"RPS part has no verified model applicability","source_type":"rps_part","document_key":"rps_catalog:02155","source_record_id":"ca299eee-92ae-4c94-8ecc-290186cff347","physical_pdf_page":597,"candidate_concept_keys":[]}'::jsonb,
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
  'evidence_mapping:rps_part:cb2a4cac-c11b-40e6-a8fa-efaef7794c5e:RPS_part_has_no_verified_model_applicability',
  'evidence_mapping',
  '{"reason":"RPS part has no verified model applicability","source_type":"rps_part","document_key":"rps_catalog:02155","source_record_id":"cb2a4cac-c11b-40e6-a8fa-efaef7794c5e","physical_pdf_page":595,"candidate_concept_keys":[]}'::jsonb,
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
  'evidence_mapping:rps_part:cee00bc9-6841-4f65-a67b-cb93b7394259:RPS_part_has_no_verified_model_applicability',
  'evidence_mapping',
  '{"reason":"RPS part has no verified model applicability","source_type":"rps_part","document_key":"rps_catalog:02155","source_record_id":"cee00bc9-6841-4f65-a67b-cb93b7394259","physical_pdf_page":599,"candidate_concept_keys":[]}'::jsonb,
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
  'evidence_mapping:rps_part:cf90a26e-b178-4ff5-914b-1f4aee38d29c:RPS_part_has_no_verified_model_applicability',
  'evidence_mapping',
  '{"reason":"RPS part has no verified model applicability","source_type":"rps_part","document_key":"rps_catalog:02155","source_record_id":"cf90a26e-b178-4ff5-914b-1f4aee38d29c","physical_pdf_page":617,"candidate_concept_keys":[]}'::jsonb,
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
  'evidence_mapping:rps_part:d0c9dffb-a9cf-4ccb-82e1-9db9ca010510:RPS_part_has_no_verified_model_applicability',
  'evidence_mapping',
  '{"reason":"RPS part has no verified model applicability","source_type":"rps_part","document_key":"rps_catalog:02155","source_record_id":"d0c9dffb-a9cf-4ccb-82e1-9db9ca010510","physical_pdf_page":613,"candidate_concept_keys":[]}'::jsonb,
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
  'evidence_mapping:rps_part:d12ba4e8-a4d6-4e7c-812f-51d37159fea0:RPS_part_has_no_verified_model_applicability',
  'evidence_mapping',
  '{"reason":"RPS part has no verified model applicability","source_type":"rps_part","document_key":"rps_catalog:02155","source_record_id":"d12ba4e8-a4d6-4e7c-812f-51d37159fea0","physical_pdf_page":595,"candidate_concept_keys":[]}'::jsonb,
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
  'evidence_mapping:rps_part:d1d2a3ca-563e-429b-9131-d5ac26539f2e:RPS_part_has_no_verified_model_applicability',
  'evidence_mapping',
  '{"reason":"RPS part has no verified model applicability","source_type":"rps_part","document_key":"rps_catalog:02155","source_record_id":"d1d2a3ca-563e-429b-9131-d5ac26539f2e","physical_pdf_page":607,"candidate_concept_keys":[]}'::jsonb,
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
  'evidence_mapping:rps_part:d319f791-8c8f-455b-93ca-0a97e58bf0f3:RPS_part_has_no_verified_model_applicability',
  'evidence_mapping',
  '{"reason":"RPS part has no verified model applicability","source_type":"rps_part","document_key":"rps_catalog:02155","source_record_id":"d319f791-8c8f-455b-93ca-0a97e58bf0f3","physical_pdf_page":605,"candidate_concept_keys":[]}'::jsonb,
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
  'evidence_mapping:rps_part:d4caa148-e3be-409c-9882-32a0b91458bf:RPS_part_has_no_verified_model_applicability',
  'evidence_mapping',
  '{"reason":"RPS part has no verified model applicability","source_type":"rps_part","document_key":"rps_catalog:02155","source_record_id":"d4caa148-e3be-409c-9882-32a0b91458bf","physical_pdf_page":599,"candidate_concept_keys":[]}'::jsonb,
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
  'evidence_mapping:rps_part:d5c247af-a6cf-4577-a7ef-c7ba95336233:RPS_part_has_no_verified_model_applicability',
  'evidence_mapping',
  '{"reason":"RPS part has no verified model applicability","source_type":"rps_part","document_key":"rps_catalog:02155","source_record_id":"d5c247af-a6cf-4577-a7ef-c7ba95336233","physical_pdf_page":607,"candidate_concept_keys":[]}'::jsonb,
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
  'evidence_mapping:rps_part:d6d23d0c-8ec5-4ffd-8468-9cc9ce4418b9:RPS_part_has_no_verified_model_applicability',
  'evidence_mapping',
  '{"reason":"RPS part has no verified model applicability","source_type":"rps_part","document_key":"rps_catalog:02155","source_record_id":"d6d23d0c-8ec5-4ffd-8468-9cc9ce4418b9","physical_pdf_page":615,"candidate_concept_keys":[]}'::jsonb,
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
  'evidence_mapping:rps_part:d9c9780f-af8a-4d25-b73a-0e591c560142:RPS_part_has_no_verified_model_applicability',
  'evidence_mapping',
  '{"reason":"RPS part has no verified model applicability","source_type":"rps_part","document_key":"rps_catalog:02155","source_record_id":"d9c9780f-af8a-4d25-b73a-0e591c560142","physical_pdf_page":613,"candidate_concept_keys":[]}'::jsonb,
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
  'evidence_mapping:rps_part:da2a7e00-50f5-4f41-b7c4-e5258d1cc811:RPS_part_has_no_verified_model_applicability',
  'evidence_mapping',
  '{"reason":"RPS part has no verified model applicability","source_type":"rps_part","document_key":"rps_catalog:02155","source_record_id":"da2a7e00-50f5-4f41-b7c4-e5258d1cc811","physical_pdf_page":617,"candidate_concept_keys":[]}'::jsonb,
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
  'evidence_mapping:rps_part:daf42c91-8fa5-4631-aabf-1cf85cb5c636:RPS_part_has_no_verified_model_applicability',
  'evidence_mapping',
  '{"reason":"RPS part has no verified model applicability","source_type":"rps_part","document_key":"rps_catalog:02155","source_record_id":"daf42c91-8fa5-4631-aabf-1cf85cb5c636","physical_pdf_page":619,"candidate_concept_keys":[]}'::jsonb,
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
  'evidence_mapping:rps_part:db77e601-4daa-4641-82ac-c110f30a229e:RPS_part_has_no_verified_model_applicability',
  'evidence_mapping',
  '{"reason":"RPS part has no verified model applicability","source_type":"rps_part","document_key":"rps_catalog:02155","source_record_id":"db77e601-4daa-4641-82ac-c110f30a229e","physical_pdf_page":615,"candidate_concept_keys":[]}'::jsonb,
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
  'evidence_mapping:rps_part:dd1001b7-5b19-4878-850a-341c5ed07b1c:RPS_part_has_no_verified_model_applicability',
  'evidence_mapping',
  '{"reason":"RPS part has no verified model applicability","source_type":"rps_part","document_key":"rps_catalog:02155","source_record_id":"dd1001b7-5b19-4878-850a-341c5ed07b1c","physical_pdf_page":611,"candidate_concept_keys":[]}'::jsonb,
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
  'evidence_mapping:rps_part:e244d589-c952-4469-9fd1-345ca4fe85f8:RPS_part_has_no_verified_model_applicability',
  'evidence_mapping',
  '{"reason":"RPS part has no verified model applicability","source_type":"rps_part","document_key":"rps_catalog:02155","source_record_id":"e244d589-c952-4469-9fd1-345ca4fe85f8","physical_pdf_page":615,"candidate_concept_keys":[]}'::jsonb,
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
  'evidence_mapping:rps_part:e7deb578-84cd-4eeb-ba9f-a88d8ca3bad2:RPS_part_has_no_verified_model_applicability',
  'evidence_mapping',
  '{"reason":"RPS part has no verified model applicability","source_type":"rps_part","document_key":"rps_catalog:02155","source_record_id":"e7deb578-84cd-4eeb-ba9f-a88d8ca3bad2","physical_pdf_page":601,"candidate_concept_keys":[]}'::jsonb,
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
  'evidence_mapping:rps_part:eba1511b-468f-40a3-a307-b677c32b9613:RPS_part_has_no_verified_model_applicability',
  'evidence_mapping',
  '{"reason":"RPS part has no verified model applicability","source_type":"rps_part","document_key":"rps_catalog:02155","source_record_id":"eba1511b-468f-40a3-a307-b677c32b9613","physical_pdf_page":623,"candidate_concept_keys":[]}'::jsonb,
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
  'evidence_mapping:rps_part:ed4b9f49-6248-4c76-9f17-0494c91cac8a:RPS_part_has_no_verified_model_applicability',
  'evidence_mapping',
  '{"reason":"RPS part has no verified model applicability","source_type":"rps_part","document_key":"rps_catalog:02155","source_record_id":"ed4b9f49-6248-4c76-9f17-0494c91cac8a","physical_pdf_page":611,"candidate_concept_keys":[]}'::jsonb,
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
  'evidence_mapping:rps_part:f0b73b4a-b6d3-4140-8160-2af4b9ca0057:RPS_part_has_no_verified_model_applicability',
  'evidence_mapping',
  '{"reason":"RPS part has no verified model applicability","source_type":"rps_part","document_key":"rps_catalog:02155","source_record_id":"f0b73b4a-b6d3-4140-8160-2af4b9ca0057","physical_pdf_page":601,"candidate_concept_keys":[]}'::jsonb,
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
  'evidence_mapping:rps_part:f0e077ef-5228-4ee1-9742-3d9f59499e26:RPS_part_has_no_verified_model_applicability',
  'evidence_mapping',
  '{"reason":"RPS part has no verified model applicability","source_type":"rps_part","document_key":"rps_catalog:02155","source_record_id":"f0e077ef-5228-4ee1-9742-3d9f59499e26","physical_pdf_page":609,"candidate_concept_keys":[]}'::jsonb,
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
  'evidence_mapping:rps_part:f3acf451-3e85-4fe5-a14d-43218379ed8c:RPS_part_has_no_verified_model_applicability',
  'evidence_mapping',
  '{"reason":"RPS part has no verified model applicability","source_type":"rps_part","document_key":"rps_catalog:02155","source_record_id":"f3acf451-3e85-4fe5-a14d-43218379ed8c","physical_pdf_page":607,"candidate_concept_keys":[]}'::jsonb,
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
  'evidence_mapping:rps_part:f495cd9b-6bde-4b7e-b061-7bbd5ddd776e:RPS_part_has_no_verified_model_applicability',
  'evidence_mapping',
  '{"reason":"RPS part has no verified model applicability","source_type":"rps_part","document_key":"rps_catalog:02155","source_record_id":"f495cd9b-6bde-4b7e-b061-7bbd5ddd776e","physical_pdf_page":599,"candidate_concept_keys":[]}'::jsonb,
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
  'evidence_mapping:rps_part:f4afd9d6-6c7a-4f79-bb4e-29c9ff16f36b:RPS_part_has_no_verified_model_applicability',
  'evidence_mapping',
  '{"reason":"RPS part has no verified model applicability","source_type":"rps_part","document_key":"rps_catalog:02155","source_record_id":"f4afd9d6-6c7a-4f79-bb4e-29c9ff16f36b","physical_pdf_page":609,"candidate_concept_keys":[]}'::jsonb,
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
  'evidence_mapping:rps_part:f63788c4-bd3a-41c3-b957-5540cd718aab:RPS_part_has_no_verified_model_applicability',
  'evidence_mapping',
  '{"reason":"RPS part has no verified model applicability","source_type":"rps_part","document_key":"rps_catalog:02155","source_record_id":"f63788c4-bd3a-41c3-b957-5540cd718aab","physical_pdf_page":605,"candidate_concept_keys":[]}'::jsonb,
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
  'evidence_mapping:rps_part:f826a447-8646-410a-8db2-5a9a95f96d3d:RPS_part_has_no_verified_model_applicability',
  'evidence_mapping',
  '{"reason":"RPS part has no verified model applicability","source_type":"rps_part","document_key":"rps_catalog:02155","source_record_id":"f826a447-8646-410a-8db2-5a9a95f96d3d","physical_pdf_page":597,"candidate_concept_keys":[]}'::jsonb,
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
  'evidence_mapping:rps_part:f839db80-3b42-42e2-913c-1c51be82d77d:RPS_part_has_no_verified_model_applicability',
  'evidence_mapping',
  '{"reason":"RPS part has no verified model applicability","source_type":"rps_part","document_key":"rps_catalog:02155","source_record_id":"f839db80-3b42-42e2-913c-1c51be82d77d","physical_pdf_page":601,"candidate_concept_keys":[]}'::jsonb,
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
  'evidence_mapping:rps_part:f918c391-73c5-43e5-9fa7-d3eebb36f10a:RPS_part_has_no_verified_model_applicability',
  'evidence_mapping',
  '{"reason":"RPS part has no verified model applicability","source_type":"rps_part","document_key":"rps_catalog:02155","source_record_id":"f918c391-73c5-43e5-9fa7-d3eebb36f10a","physical_pdf_page":627,"candidate_concept_keys":[]}'::jsonb,
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
  'evidence_mapping:rps_part:fa39bb1e-ef77-4b03-b4c6-ee997fb94879:RPS_part_has_no_verified_model_applicability',
  'evidence_mapping',
  '{"reason":"RPS part has no verified model applicability","source_type":"rps_part","document_key":"rps_catalog:02155","source_record_id":"fa39bb1e-ef77-4b03-b4c6-ee997fb94879","physical_pdf_page":605,"candidate_concept_keys":[]}'::jsonb,
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
  'evidence_mapping:rps_part:fa916363-578c-42b5-b1fc-0eb35b2b4840:RPS_part_has_no_verified_model_applicability',
  'evidence_mapping',
  '{"reason":"RPS part has no verified model applicability","source_type":"rps_part","document_key":"rps_catalog:02155","source_record_id":"fa916363-578c-42b5-b1fc-0eb35b2b4840","physical_pdf_page":595,"candidate_concept_keys":[]}'::jsonb,
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
  'evidence_mapping:rps_part:fbf1a017-c703-4744-844c-52f178d5c3aa:RPS_part_has_no_verified_model_applicability',
  'evidence_mapping',
  '{"reason":"RPS part has no verified model applicability","source_type":"rps_part","document_key":"rps_catalog:02155","source_record_id":"fbf1a017-c703-4744-844c-52f178d5c3aa","physical_pdf_page":625,"candidate_concept_keys":[]}'::jsonb,
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
  'evidence_mapping:rps_part:fc641c08-8631-4019-bfc1-5ce8810150a4:RPS_part_has_no_verified_model_applicability',
  'evidence_mapping',
  '{"reason":"RPS part has no verified model applicability","source_type":"rps_part","document_key":"rps_catalog:02155","source_record_id":"fc641c08-8631-4019-bfc1-5ce8810150a4","physical_pdf_page":625,"candidate_concept_keys":[]}'::jsonb,
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
  'evidence_mapping:rps_part:fe61fa9d-0308-4e72-a7a2-e725c42de8fc:RPS_part_has_no_verified_model_applicability',
  'evidence_mapping',
  '{"reason":"RPS part has no verified model applicability","source_type":"rps_part","document_key":"rps_catalog:02155","source_record_id":"fe61fa9d-0308-4e72-a7a2-e725c42de8fc","physical_pdf_page":605,"candidate_concept_keys":[]}'::jsonb,
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
  'evidence_mapping:rps_part:fe7110cb-bfaf-4690-bca7-fce6cf6a9b06:RPS_part_has_no_verified_model_applicability',
  'evidence_mapping',
  '{"reason":"RPS part has no verified model applicability","source_type":"rps_part","document_key":"rps_catalog:02155","source_record_id":"fe7110cb-bfaf-4690-bca7-fce6cf6a9b06","physical_pdf_page":611,"candidate_concept_keys":[]}'::jsonb,
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
  'evidence_mapping:rps_part:febf300a-3ab9-4e33-97b6-46f4ced9ef17:RPS_part_has_no_verified_model_applicability',
  'evidence_mapping',
  '{"reason":"RPS part has no verified model applicability","source_type":"rps_part","document_key":"rps_catalog:02155","source_record_id":"febf300a-3ab9-4e33-97b6-46f4ced9ef17","physical_pdf_page":611,"candidate_concept_keys":[]}'::jsonb,
  0,
  ARRAY[]::text[],
  'controlled',
  'pending',
  (SELECT id FROM public.barry_semantic_versions WHERE version = '1.0.0-phase1')
)
ON CONFLICT (dedupe_key) DO UPDATE SET proposed_payload = EXCLUDED.proposed_payload;
COMMIT;
