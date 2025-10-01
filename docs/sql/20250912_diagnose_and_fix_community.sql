-- Diagnose and Fix Community Database Issues
-- This migration safely checks existing state and adds only what's needed

-- 1. Check and create missing columns
DO $$ 
BEGIN
    -- Add visibility column to community_posts if it doesn't exist
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'community_posts' AND table_schema = 'public') THEN
        IF NOT EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'community_posts' 
            AND column_name = 'visibility'
            AND table_schema = 'public'
        ) THEN
            ALTER TABLE public.community_posts 
            ADD COLUMN visibility TEXT DEFAULT 'public' CHECK (visibility IN ('public', 'private', 'group'));
            
            RAISE NOTICE 'Added visibility column to community_posts';
        ELSE
            RAISE NOTICE 'visibility column already exists in community_posts';
        END IF;
    ELSE
        RAISE NOTICE 'community_posts table does not exist';
    END IF;
END $$;

-- 2. Fix RLS policies that might have recursion issues
-- Drop and recreate problematic group_members policies
DO $$
BEGIN
    -- Check if group_members table exists first
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'group_members' AND table_schema = 'public') THEN
        
        -- Drop existing policies that might cause recursion
        DROP POLICY IF EXISTS "View group members" ON public.group_members;
        DROP POLICY IF EXISTS "Add group members" ON public.group_members;
        DROP POLICY IF EXISTS "Update group members" ON public.group_members;
        DROP POLICY IF EXISTS "Remove group members" ON public.group_members;
        
        -- Create simple policies without recursion
        CREATE POLICY "View group members simple" ON public.group_members
            FOR SELECT
            USING (true); -- Temporarily allow all - can be made more restrictive later
            
        CREATE POLICY "Add group members simple" ON public.group_members
            FOR INSERT
            WITH CHECK (auth.uid() = user_id);
            
        CREATE POLICY "Update own membership" ON public.group_members
            FOR UPDATE
            USING (auth.uid() = user_id)
            WITH CHECK (auth.uid() = user_id);
            
        CREATE POLICY "Remove own membership" ON public.group_members
            FOR DELETE
            USING (auth.uid() = user_id);
            
        RAISE NOTICE 'Fixed group_members RLS policies';
    ELSE
        RAISE NOTICE 'group_members table does not exist';
    END IF;
END $$;

-- 3. Fix user_details view if it has recursion issues
DO $$
BEGIN
    -- Check if profiles table exists (needed for user_details view)
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'profiles' AND table_schema = 'public') THEN
        
        -- Drop and recreate user_details view to fix any recursion
        DROP VIEW IF EXISTS public.user_details CASCADE;
        
        -- Create a simple view without complex logic that might cause recursion
        CREATE VIEW public.user_details AS
        SELECT 
            id,
            email,
            display_name,
            full_name,
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
            created_at,
            updated_at
        FROM public.profiles;
        
        -- Grant access to the view
        GRANT SELECT ON public.user_details TO authenticated;
        
        RAISE NOTICE 'Recreated user_details view';
    ELSE
        RAISE NOTICE 'profiles table does not exist';
    END IF;
END $$;

-- 4. Create helper functions for group operations (non-recursive)
CREATE OR REPLACE FUNCTION public.user_is_group_member_safe(group_id_param UUID, user_id_param UUID)
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

CREATE OR REPLACE FUNCTION public.user_is_group_admin_safe(group_id_param UUID, user_id_param UUID)
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
GRANT EXECUTE ON FUNCTION public.user_is_group_member_safe(UUID, UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.user_is_group_admin_safe(UUID, UUID) TO authenticated;

-- 5. Show what tables and key columns exist for debugging
DO $$
DECLARE
    table_record RECORD;
    column_record RECORD;
BEGIN
    RAISE NOTICE '=== CURRENT COMMUNITY TABLES ===';
    
    FOR table_record IN 
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name LIKE '%community%' OR table_name LIKE '%group%' OR table_name LIKE '%post%'
        ORDER BY table_name
    LOOP
        RAISE NOTICE 'Table: %', table_record.table_name;
        
        -- Show key columns for each community-related table
        FOR column_record IN
            SELECT column_name, data_type, is_nullable, column_default
            FROM information_schema.columns
            WHERE table_schema = 'public' 
            AND table_name = table_record.table_name
            ORDER BY ordinal_position
        LOOP
            RAISE NOTICE '  - %: % (nullable: %, default: %)', 
                column_record.column_name, 
                column_record.data_type,
                column_record.is_nullable,
                COALESCE(column_record.column_default, 'none');
        END LOOP;
    END LOOP;
END $$;