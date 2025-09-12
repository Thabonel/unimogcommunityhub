-- Torque specifications by model
SELECT 
  mc.title,
  mc.content,
  mc.metadata->>'model_code' as model_code,
  mc.metadata->>'series' as series,
  mc.created_at
FROM manual_chunks mc
WHERE 
  (mc.metadata->>'model_code' = :model_code OR :model_code IS NULL)
  AND (
    mc.title ILIKE '%torque%' 
    OR mc.content ILIKE '%torque%'
    OR mc.content ILIKE '%nm%'
    OR mc.content ILIKE '%ft-lb%'
    OR mc.content ILIKE '%tightening%'
  )
ORDER BY mc.created_at DESC
LIMIT 100;