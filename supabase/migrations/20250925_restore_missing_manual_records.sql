-- Restore missing manual records from processed chunks
-- This fixes the database architecture damaged in yesterday's disaster

-- First, get a user ID to use as uploaded_by
DO $$
DECLARE
    user_id uuid;
BEGIN
    -- Get the first available user ID
    SELECT id INTO user_id FROM auth.users LIMIT 1;

    -- If no users exist, create a system placeholder
    IF user_id IS NULL THEN
        user_id := '00000000-0000-0000-0000-000000000000';
    END IF;

    -- Insert missing manual records based on existing chunks
    INSERT INTO manuals (
        id,
        filename,
        original_filename,
        title,
        description,
        category,
        file_size,
        page_count,
        chunk_count,
        processing_status,
        processing_started_at,
        processing_completed_at,
        uploaded_by,
        created_at,
        updated_at
    )
    SELECT
        manual_id,
        CASE
            WHEN manual_title LIKE '%.pdf' THEN manual_title
            ELSE manual_title || '.pdf'
        END as filename,
        CASE
            WHEN manual_title LIKE '%.pdf' THEN manual_title
            ELSE manual_title || '.pdf'
        END as original_filename,
        manual_title as title,
        'Restored from processed chunks after database recovery on ' || CURRENT_DATE::text as description,
        CASE
            WHEN manual_title ILIKE '%workshop%' OR manual_title ILIKE '%manual%' THEN 'Workshop Manual'
            WHEN manual_title ILIKE '%repair%' THEN 'Repair Guide'
            WHEN manual_title ILIKE '%modification%' THEN 'Modification Guide'
            WHEN manual_title ILIKE '%servicing%' OR manual_title ILIKE '%instruction%' THEN 'Service Manual'
            WHEN manual_title ILIKE '%data%summary%' THEN 'Technical Data'
            ELSE 'Technical Manual'
        END as category,
        (chunk_count * 50000)::bigint as file_size, -- Estimate 50KB per chunk
        GREATEST(estimated_page_count, 1) as page_count,
        chunk_count,
        'completed' as processing_status,
        processing_started_at,
        processing_completed_at,
        user_id as uploaded_by,
        processing_started_at as created_at,
        processing_completed_at as updated_at
    FROM (
        SELECT
            manual_id,
            manual_title,
            COUNT(*) as chunk_count,
            MIN(created_at) as processing_started_at,
            MAX(created_at) as processing_completed_at,
            COALESCE(MAX(page_number), 1) as estimated_page_count
        FROM manual_chunks
        GROUP BY manual_id, manual_title
    ) chunk_summary
    ON CONFLICT (id) DO NOTHING; -- In case some records were already restored

    -- Report the results
    RAISE NOTICE 'Restored % manual records from existing chunks',
        (SELECT COUNT(*) FROM manuals WHERE processing_status = 'completed');

END $$;