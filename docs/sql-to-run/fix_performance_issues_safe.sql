-- Fix Performance Advisor Warnings (Safe Version)
-- Run this in Supabase Dashboard SQL Editor

-- PART 1: Fix Auth RLS Initialization Plan Issues
-- Replace auth.uid() with (select auth.uid()) to avoid re-evaluation for each row

-- Fix notice_board policies
DROP POLICY IF EXISTS "Admins can manage notices" ON public.notice_board;
CREATE POLICY "Admins can manage notices" ON public.notice_board
FOR ALL TO public
USING (EXISTS (
  SELECT 1
  FROM user_roles
  WHERE user_roles.user_id = (select auth.uid())
  AND user_roles.role = 'admin'::app_role
));

DROP POLICY IF EXISTS "Users can see own notices" ON public.notice_board;
CREATE POLICY "Users can see own notices" ON public.notice_board
FOR SELECT TO public
USING (author_id = (select auth.uid()));

-- Fix notice_submissions policies
DROP POLICY IF EXISTS "Admins can manage submissions" ON public.notice_submissions;
CREATE POLICY "Admins can manage submissions" ON public.notice_submissions
FOR ALL TO public
USING (EXISTS (
  SELECT 1
  FROM user_roles
  WHERE user_roles.user_id = (select auth.uid())
  AND user_roles.role = 'admin'::app_role
));

DROP POLICY IF EXISTS "Users can update pending submissions" ON public.notice_submissions;
CREATE POLICY "Users can update pending submissions" ON public.notice_submissions
FOR UPDATE TO public
USING (
  submitter_id = (select auth.uid())
  AND status = ANY (ARRAY['pending'::text, 'revision_requested'::text])
);

DROP POLICY IF EXISTS "Users can view own submissions" ON public.notice_submissions;
CREATE POLICY "Users can view own submissions" ON public.notice_submissions
FOR SELECT TO public
USING (submitter_id = (select auth.uid()));

-- PART 2: Fix Multiple Permissive Policies Issues
-- Only modify active_sessions if needed (skip if Sessions access policy already exists and is correct)

-- Check and update active_sessions policy only if it needs the auth.uid() fix
DO $$
BEGIN
  -- Update the existing policy to use (select auth.uid()) instead of auth.uid()
  IF EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'active_sessions'
    AND policyname = 'Sessions access policy'
    AND qual LIKE '%auth.uid()%'
  ) THEN
    DROP POLICY "Sessions access policy" ON public.active_sessions;
    CREATE POLICY "Sessions access policy" ON public.active_sessions
    FOR ALL TO public
    USING (
      -- Service role can manage all sessions OR users can view own sessions
      is_super_admin()
      OR user_id = (select auth.uid())
    );
  END IF;
END $$;

-- Fix marketplace_listings (consolidate multiple policies if they exist)
DROP POLICY IF EXISTS "Users can view active listings" ON public.marketplace_listings;
DROP POLICY IF EXISTS "Users can view own listings" ON public.marketplace_listings;
DROP POLICY IF EXISTS "Marketplace listings access" ON public.marketplace_listings;

CREATE POLICY "Marketplace listings access" ON public.marketplace_listings
FOR SELECT TO public
USING (
  -- Users can view active listings OR own listings
  status = 'active'
  OR seller_id = (select auth.uid())
  OR is_super_admin()
);

-- PART 3: Fix other Auth RLS issues for community_groups
DROP POLICY IF EXISTS "Anyone can view public groups" ON public.community_groups;
DROP POLICY IF EXISTS "View community groups" ON public.community_groups;
DROP POLICY IF EXISTS "Community groups view policy" ON public.community_groups;

CREATE POLICY "Community groups view policy" ON public.community_groups
FOR SELECT TO public
USING (
  -- Public groups OR user is member OR user is authenticated for public groups
  (NOT is_private)
  OR (EXISTS (
    SELECT 1
    FROM group_members
    WHERE group_members.group_id = community_groups.id
    AND group_members.user_id = (select auth.uid())
  ))
);

DROP POLICY IF EXISTS "Group creators can update their groups" ON public.community_groups;
DROP POLICY IF EXISTS "Update community groups" ON public.community_groups;
DROP POLICY IF EXISTS "Community groups update policy" ON public.community_groups;

CREATE POLICY "Community groups update policy" ON public.community_groups
FOR UPDATE TO public
USING (
  -- Creator can update OR admin member can update
  (select auth.uid()) = created_by
  OR EXISTS (
    SELECT 1
    FROM group_members
    WHERE group_members.group_id = community_groups.id
    AND group_members.user_id = (select auth.uid())
    AND group_members.role = 'admin'::text
  )
);

DROP POLICY IF EXISTS "Delete community groups" ON public.community_groups;
DROP POLICY IF EXISTS "Community groups delete policy" ON public.community_groups;

CREATE POLICY "Community groups delete policy" ON public.community_groups
FOR DELETE TO public
USING (
  EXISTS (
    SELECT 1
    FROM group_members
    WHERE group_members.group_id = community_groups.id
    AND group_members.user_id = (select auth.uid())
    AND group_members.role = 'admin'::text
  )
);

-- Note: After running this script, verify the policies work as expected