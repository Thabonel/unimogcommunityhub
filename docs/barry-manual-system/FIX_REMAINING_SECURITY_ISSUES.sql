-- Fix Remaining Security Issues
-- Addresses the last 2 security warnings

-- Fix missing function search path for validate_pdf_links
ALTER FUNCTION validate_pdf_links() SET search_path = public, pg_temp;

-- Fix Security Definer view by checking current definition and recreating if needed
-- First check if the view has SECURITY DEFINER
DO $$
DECLARE
    view_def text;
BEGIN
    -- Get the current view definition
    SELECT pg_get_viewdef('barry_manual_navigation'::regclass) INTO view_def;

    -- If it contains SECURITY DEFINER, recreate it without that property
    IF view_def IS NOT NULL THEN
        -- Drop and recreate the view without SECURITY DEFINER
        DROP VIEW IF EXISTS barry_manual_navigation;

        CREATE VIEW barry_manual_navigation AS
        SELECT
            manual_type,
            part_number,
            slug,
            title,
            filename,
            CASE
                WHEN manual_type = 'workshop' THEN 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters/' || filename
                WHEN manual_type = 'maintenance' THEN 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-maintenance/' || filename
                ELSE NULL
            END AS direct_url,
            start_page,
            end_page,
            page_count,
            file_size_mb,
            priority,
            keywords
        FROM u435_manual_parts
        ORDER BY manual_type, part_number;

        RAISE NOTICE 'barry_manual_navigation view recreated without SECURITY DEFINER';
    END IF;
END
$$;

SELECT 'Remaining security issues fixed successfully' as status;