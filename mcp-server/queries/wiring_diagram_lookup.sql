-- Wiring diagrams and electrical procedures
SELECT 
  mc.id,
  mc.title,
  mc.metadata->>'model_code' as model_code,
  mc.metadata->>'series' as series,
  mc.metadata->>'document_type' as document_type,
  mc.content,
  mc.created_at
FROM manual_chunks mc
WHERE 
  (
    mc.title ILIKE '%wiring%'
    OR mc.title ILIKE '%electrical%'
    OR mc.title ILIKE '%circuit%'
    OR mc.title ILIKE '%diagram%'
    OR mc.content ILIKE '%wiring%'
    OR mc.content ILIKE '%electrical%'
    OR mc.content ILIKE '%voltage%'
    OR mc.content ILIKE '%ampere%'
    OR mc.content ILIKE '%fuse%'
    OR mc.content ILIKE '%relay%'
  )
  AND (mc.metadata->>'model_code' = :model_code OR :model_code IS NULL)
ORDER BY 
  CASE 
    WHEN mc.title ILIKE '%wiring diagram%' THEN 1
    WHEN mc.title ILIKE '%electrical%' THEN 2
    WHEN mc.title ILIKE '%circuit%' THEN 3
    ELSE 4
  END,
  mc.created_at DESC
LIMIT 150;