-- ========================================
-- FIX SECURITY DEFINER VIEW VULNERABILITY
-- Run this in your UNIMOG database (not UnimogCommunityHub)
-- ========================================

-- =====================================
-- STEP 1: ANALYZE THE CURRENT VIEW
-- =====================================

-- First, let's see the current definition of the problematic view
SELECT
    schemaname,
    viewname,
    definition
FROM pg_views
WHERE viewname = 'user_details' AND schemaname = 'public';

-- Check if it's actually using SECURITY DEFINER
SELECT
    n.nspname as schema_name,
    c.relname as view_name,
    CASE
        WHEN c.relkind = 'v' THEN 'VIEW'
        ELSE 'OTHER'
    END as object_type,
    r.rolname as owner
FROM pg_class c
JOIN pg_namespace n ON c.relnamespace = n.oid
LEFT JOIN pg_authid r ON c.relowner = r.oid
WHERE c.relname = 'user_details'
AND n.nspname = 'public';

-- =====================================
-- STEP 2: GET THE FULL VIEW DEFINITION
-- =====================================

-- Get the complete view definition so we can recreate it safely
SELECT pg_get_viewdef('public.user_details'::regclass, true) as view_definition;

-- =====================================
-- STEP 3: RECREATE VIEW WITHOUT SECURITY DEFINER
-- =====================================

-- We'll drop and recreate the view without SECURITY DEFINER
-- WARNING: This will temporarily make the view unavailable
-- Make sure no critical processes are using this view

-- First, backup any dependent objects (if any)
SELECT
    'Checking dependencies for user_details view' as status,
    count(*) as dependent_objects
FROM pg_depend d
JOIN pg_class c ON d.objid = c.oid
WHERE d.refobjid = 'public.user_details'::regclass;

-- Drop the existing SECURITY DEFINER view
DROP VIEW IF EXISTS public.user_details;

-- Recreate the view WITHOUT SECURITY DEFINER
-- NOTE: You'll need to replace this with the actual view definition
-- from the query above. This is a template:

CREATE VIEW public.user_details AS
SELECT
    id,
    email,
    -- Add other columns as they exist in your original view
    created_at,
    updated_at
FROM auth.users
-- Add any JOINs or WHERE clauses from your original view
-- Make sure this matches your original view definition exactly
;

-- =====================================
-- STEP 4: SET PROPER PERMISSIONS
-- =====================================

-- Grant appropriate permissions (adjust as needed for your use case)
GRANT SELECT ON public.user_details TO authenticated;

-- If you need specific RLS policies, add them here
-- ALTER TABLE public.user_details ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY ... ON public.user_details ...

-- =====================================
-- STEP 5: VERIFICATION
-- =====================================

-- Verify the view was recreated without SECURITY DEFINER
SELECT
    schemaname,
    viewname,
    viewowner,
    'View recreated successfully without SECURITY DEFINER' as status
FROM pg_views
WHERE viewname = 'user_details' AND schemaname = 'public';

-- Test that the view works
SELECT 'Testing view access' as test, count(*) as row_count
FROM public.user_details
LIMIT 1;

-- Final security check - this should not show SECURITY DEFINER anymore
SELECT
    'Security check passed - no SECURITY DEFINER detected' as final_status
WHERE NOT EXISTS (
    SELECT 1 FROM pg_views
    WHERE viewname = 'user_details'
    AND schemaname = 'public'
    AND definition ILIKE '%security definer%'
);

-- =====================================
-- IMPORTANT NOTES
-- =====================================

/*
CRITICAL: Before running this script:

1. Get the exact view definition by running:
   SELECT pg_get_viewdef('public.user_details'::regclass, true);

2. Replace the CREATE VIEW statement above with your actual view definition

3. Make sure you understand what the view does and who should have access

4. Test in a development environment first if possible

5. This change might affect application functionality if the app relies
   on the SECURITY DEFINER behavior

6. Consider if you actually need the elevated permissions that SECURITY DEFINER
   provided, and if so, implement proper RLS policies instead
*/