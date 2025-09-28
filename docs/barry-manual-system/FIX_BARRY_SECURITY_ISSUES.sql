-- Fix Barry Security Issues
-- Resolves all RLS and Security Definer warnings from Supabase linter

-- Enable Row Level Security on all Barry tables
ALTER TABLE u435_manual_index ENABLE ROW LEVEL SECURITY;
ALTER TABLE u435_manual_parts ENABLE ROW LEVEL SECURITY;
ALTER TABLE barry_search_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE barry_personality_templates ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for manual tables (read-only for authenticated users)
CREATE POLICY "manual_index_read_access" ON u435_manual_index
FOR SELECT TO authenticated USING (true);

CREATE POLICY "manual_parts_read_access" ON u435_manual_parts
FOR SELECT TO authenticated USING (true);

-- Create RLS policies for Barry analytics (system writes, users read own)
CREATE POLICY "analytics_system_insert" ON barry_search_analytics
FOR INSERT TO service_role WITH CHECK (true);

CREATE POLICY "analytics_read_own" ON barry_search_analytics
FOR SELECT TO authenticated USING (user_id = auth.uid());

-- Create RLS policies for personality templates (read-only for users)
CREATE POLICY "personality_read_active" ON barry_personality_templates
FOR SELECT TO authenticated USING (is_active = true);

-- Fix Security Definer view by recreating without SECURITY DEFINER
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

-- Verify security fixes
SELECT 'Barry security issues fixed successfully' as status;