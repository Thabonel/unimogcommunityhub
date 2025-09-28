-- Force Fix Security Definer View Issue
-- Completely recreates the view with explicit security settings

-- Drop the existing view completely
DROP VIEW IF EXISTS barry_manual_navigation CASCADE;

-- Recreate the view with explicit SECURITY INVOKER (opposite of SECURITY DEFINER)
CREATE VIEW barry_manual_navigation
WITH (security_invoker = true)
AS
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

-- Grant appropriate permissions
GRANT SELECT ON barry_manual_navigation TO authenticated;
GRANT SELECT ON barry_manual_navigation TO anon;

SELECT 'Security definer view issue forcefully resolved' as status;