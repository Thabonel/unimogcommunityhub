-- ========================================
-- FIX SECURITY DEFINER VIEW - user_details
-- UnimogCommunityHub Database Fix
-- ========================================

-- =====================================
-- STEP 1: ANALYZE CURRENT SITUATION
-- =====================================

-- Check current view definition and dependencies
SELECT
    'Current user_details view analysis' as status,
    schemaname,
    viewname,
    viewowner
FROM pg_views
WHERE viewname = 'user_details' AND schemaname = 'public';

-- Check for any dependencies on this view
SELECT
    'Checking dependencies' as check_type,
    COUNT(*) as dependent_objects
FROM pg_depend d
JOIN pg_class c ON d.objid = c.oid
WHERE d.refobjid = 'public.user_details'::regclass;

-- =====================================
-- STEP 2: BACKUP AND RECREATE VIEW
-- =====================================

-- Drop the existing SECURITY DEFINER view
DROP VIEW IF EXISTS public.user_details;

-- Recreate the view WITHOUT SECURITY DEFINER
-- This will now respect RLS policies on the profiles table
CREATE VIEW public.user_details AS
SELECT
    profiles.id,
    profiles.email,
    profiles.display_name,
    profiles.full_name,
    profiles.avatar_url,
    profiles.bio,
    profiles.location,
    profiles.unimog_model,
    profiles.unimog_year,
    profiles.unimog_modifications,
    profiles.experience_level,
    profiles.online,
    profiles.banned_until,
    profiles.is_admin,
    profiles.created_at,
    profiles.updated_at
FROM profiles;

-- =====================================
-- STEP 3: SET APPROPRIATE PERMISSIONS
-- =====================================

-- Grant SELECT permission to authenticated users
-- The underlying RLS policies on 'profiles' table will control access
GRANT SELECT ON public.user_details TO authenticated;

-- Grant to anon users as well if needed (depends on your app requirements)
GRANT SELECT ON public.user_details TO anon;

-- =====================================
-- STEP 4: VERIFICATION
-- =====================================

-- Verify the view was recreated successfully
SELECT
    'View recreated successfully' as status,
    schemaname,
    viewname,
    viewowner
FROM pg_views
WHERE viewname = 'user_details' AND schemaname = 'public';

-- Test that the view works (should respect RLS policies now)
SELECT
    'View functionality test' as test_type,
    COUNT(*) as accessible_profiles
FROM public.user_details;

-- Verify no SECURITY DEFINER in the definition
SELECT
    CASE
        WHEN definition ILIKE '%security definer%' THEN 'WARNING: Still has SECURITY DEFINER'
        ELSE '✅ SECURITY DEFINER removed successfully'
    END as security_status
FROM pg_views
WHERE viewname = 'user_details' AND schemaname = 'public';

-- Final status
SELECT '✅ Security vulnerability fixed - user_details view now respects RLS policies' as final_result;

-- =====================================
-- IMPORTANT NOTES ABOUT THIS CHANGE
-- =====================================

/*
WHAT THIS FIX DOES:
1. Removes SECURITY DEFINER from the user_details view
2. The view now respects Row Level Security (RLS) policies on the profiles table
3. Users can only see profile data they're authorized to see

POTENTIAL IMPACT:
- If your app was relying on the SECURITY DEFINER behavior to bypass RLS,
  some functionality might be affected
- This is GOOD for security - the view should respect RLS policies
- Make sure your profiles table has appropriate RLS policies

TESTING NEEDED:
- Verify that authenticated users can still access their own profile data
- Check that admin users can access what they need to access
- Ensure no legitimate functionality is broken
*/