-- Check Embedding Dimensions in manual_chunks
-- Run this in Supabase SQL Editor to diagnose dimension issues

-- Count embeddings by dimension
SELECT
    array_length(embedding::real[], 1) as dimension,
    COUNT(*) as count
FROM manual_chunks
WHERE embedding IS NOT NULL
GROUP BY array_length(embedding::real[], 1)
ORDER BY count DESC;

-- Find chunks with non-standard dimensions (not 1536)
SELECT
    id,
    manual_title,
    page_number,
    array_length(embedding::real[], 1) as embedding_dimension,
    created_at
FROM manual_chunks
WHERE embedding IS NOT NULL
AND array_length(embedding::real[], 1) != 1536
LIMIT 100;

-- Count chunks needing re-embedding
SELECT
    CASE
        WHEN embedding IS NULL THEN 'no_embedding'
        WHEN array_length(embedding::real[], 1) = 1536 THEN 'correct_1536d'
        WHEN array_length(embedding::real[], 1) = 768 THEN 'old_768d'
        ELSE 'other_dimension'
    END as embedding_status,
    COUNT(*) as count
FROM manual_chunks
GROUP BY embedding_status
ORDER BY count DESC;

-- Total chunks by manual
SELECT
    manual_title,
    COUNT(*) as total_chunks,
    SUM(CASE WHEN embedding IS NULL THEN 1 ELSE 0 END) as missing_embeddings,
    SUM(CASE WHEN embedding IS NOT NULL AND array_length(embedding::real[], 1) = 1536 THEN 1 ELSE 0 END) as correct_embeddings,
    SUM(CASE WHEN embedding IS NOT NULL AND array_length(embedding::real[], 1) != 1536 THEN 1 ELSE 0 END) as wrong_dimension
FROM manual_chunks
GROUP BY manual_title
ORDER BY total_chunks DESC
LIMIT 20;
