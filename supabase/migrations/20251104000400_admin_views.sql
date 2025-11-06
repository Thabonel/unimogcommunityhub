BEGIN;

CREATE OR REPLACE VIEW public.vw_recent_wis_properties AS
SELECT
  wp.id,
  wp.model_code,
  wp.engine_code,
  c.name AS component_name,
  a.name AS attribute_name,
  wp.value,
  wp.unit,
  wp.source_ref,
  wp.source_type,
  wp.confidence,
  wp.created_at,
  wp.updated_at
FROM public.wis_properties wp
LEFT JOIN public.components c ON c.id = wp.component_id
LEFT JOIN public.attributes a ON a.id = wp.attribute_id
ORDER BY wp.updated_at DESC
LIMIT 100;

CREATE OR REPLACE VIEW public.vw_pending_synonyms AS
SELECT
  'component' AS synonym_type,
  cs.id,
  cs.synonym,
  c.name AS canonical_name,
  cs.lang,
  cs.confidence,
  cs.approved_by,
  cs.created_at,
  cs.updated_at
FROM public.component_synonyms cs
JOIN public.components c ON c.id = cs.component_id
UNION ALL
SELECT
  'attribute' AS synonym_type,
  ats.id,
  ats.synonym,
  a.name AS canonical_name,
  ats.lang,
  ats.confidence,
  ats.approved_by,
  ats.created_at,
  ats.updated_at
FROM public.attribute_synonyms ats
JOIN public.attributes a ON a.id = ats.attribute_id
ORDER BY updated_at DESC;

COMMIT;
