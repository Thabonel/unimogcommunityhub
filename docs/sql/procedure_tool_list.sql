-- Required tools for procedures
SELECT 
  mc.id,
  mc.title,
  mc.metadata->>'model_code' as model_code,
  mc.content
FROM manual_chunks mc
WHERE 
  mc.content ILIKE '%tool%'
  OR mc.content ILIKE '%equipment%'  
  OR mc.content ILIKE '%wrench%'
  OR mc.content ILIKE '%socket%'
  OR mc.content ILIKE '%special%'
ORDER BY 
  CASE 
    WHEN mc.title ILIKE '%tool%' THEN 1
    WHEN mc.content ILIKE '%special tool%' THEN 2
    ELSE 3
  END,
  mc.created_at DESC
LIMIT 200;