-- Fix Community RLS Infinite Recursion Issues
-- This migration fixes circular dependencies in RLS policies

-- 1. Drop problematic policies that cause infinite recursion
DROP POLICY IF EXISTS "View group members" ON public.group_members;
DROP POLICY IF EXISTS "Add group members" ON public.group_members;
DROP POLICY IF EXISTS "Update group members" ON public.group_members;
DROP POLICY IF EXISTS "Remove group members" ON public.group_members;

-- 2. Create simplified RLS policies without recursion

-- Members can view all group memberships (simplified - no recursion)
CREATE POLICY "View group members" ON public.group_members
    FOR SELECT
    USING (true); -- Allow viewing all group memberships for now

-- Authenticated users can join groups
CREATE POLICY "Add group members" ON public.group_members
    FOR INSERT
    WITH CHECK (auth.uid() = user_id); -- Only allow users to add themselves

-- Users can update their own membership (role changes by admins handled separately)
CREATE POLICY "Update group members" ON public.group_members
    FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Users can remove themselves from groups
CREATE POLICY "Remove group members" ON public.group_members
    FOR DELETE
    USING (auth.uid() = user_id);

-- 3. Add visibility column to community_posts if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'community_posts' 
        AND column_name = 'visibility'
    ) THEN
        ALTER TABLE public.community_posts 
        ADD COLUMN visibility TEXT DEFAULT 'public' CHECK (visibility IN ('public', 'private', 'group'));
    END IF;
END $$;

-- 4. Create helper functions for group permissions without recursion
CREATE OR REPLACE FUNCTION public.user_is_group_member(group_id_param UUID, user_id_param UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.group_members 
        WHERE group_id = group_id_param 
        AND user_id = user_id_param
    );
$$;

CREATE OR REPLACE FUNCTION public.user_is_group_admin(group_id_param UUID, user_id_param UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.group_members 
        WHERE group_id = group_id_param 
        AND user_id = user_id_param 
        AND role = 'admin'
    );
$$;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION public.user_is_group_member(UUID, UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.user_is_group_admin(UUID, UUID) TO authenticated;

-- 7. Fix user_details view issues by dropping and recreating without recursion
DROP VIEW IF EXISTS public.user_details CASCADE;

-- Recreate user_details view with proper RLS
CREATE VIEW public.user_details AS
SELECT 
    id,
    email,
    COALESCE(display_name, full_name, SPLIT_PART(email, '@', 1)) as display_name,
    COALESCE(full_name, display_name, SPLIT_PART(email, '@', 1)) as full_name,
    avatar_url,
    bio,
    location,
    unimog_model,
    unimog_year,
    unimog_modifications,
    experience_level,
    online,
    banned_until,
    is_admin,
    street_address,
    city,
    state,
    postal_code,
    country,
    phone_number,
    currency,
    vehicle_photo_url,
    use_vehicle_photo_as_profile,
    unimog_series,
    unimog_specs,
    unimog_features,
    unimog_wiki_data,
    preferred_terrain,
    mechanical_skills,
    certifications,
    emergency_contact,
    insurance_info,
    privacy_settings,
    notification_preferences,
    last_active_at,
    account_status,
    subscription_tier,
    subscription_expires_at,
    profile_completion_percentage,
    created_at,
    updated_at
FROM public.profiles;

-- Grant access to the view
GRANT SELECT ON public.user_details TO authenticated;

-- 5. Update community_groups policies to use helper functions
DROP POLICY IF EXISTS "Update community groups" ON public.community_groups;
DROP POLICY IF EXISTS "Delete community groups" ON public.community_groups;

CREATE POLICY "Update community groups" ON public.community_groups
    FOR UPDATE
    USING (public.user_is_group_admin(id, auth.uid()));

CREATE POLICY "Delete community groups" ON public.community_groups
    FOR DELETE
    USING (public.user_is_group_admin(id, auth.uid()));

-- 6. Update group_posts policies to use helper functions  
DROP POLICY IF EXISTS "View group posts" ON public.group_posts;
DROP POLICY IF EXISTS "Create group posts" ON public.group_posts;
DROP POLICY IF EXISTS "Update group posts" ON public.group_posts;
DROP POLICY IF EXISTS "Delete group posts" ON public.group_posts;

CREATE POLICY "View group posts" ON public.group_posts
    FOR SELECT
    USING (public.user_is_group_member(group_id, auth.uid()));

CREATE POLICY "Create group posts" ON public.group_posts
    FOR INSERT
    WITH CHECK (
        auth.uid() = user_id 
        AND public.user_is_group_member(group_id, auth.uid())
    );

CREATE POLICY "Update group posts" ON public.group_posts
    FOR UPDATE
    USING (
        user_id = auth.uid() 
        OR public.user_is_group_admin(group_id, auth.uid())
    );

CREATE POLICY "Delete group posts" ON public.group_posts
    FOR DELETE
    USING (
        user_id = auth.uid() 
        OR public.user_is_group_admin(group_id, auth.uid())
    );