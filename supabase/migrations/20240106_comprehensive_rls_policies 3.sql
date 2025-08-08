-- Comprehensive Row Level Security (RLS) Policies

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_shares ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.emergency_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_attendees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.manual_contributions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marketplace_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- =============================================================================
-- PROFILES POLICIES
-- =============================================================================

-- Users can view all profiles (public information)
CREATE POLICY "Profiles are viewable by authenticated users"
ON public.profiles FOR SELECT
TO authenticated
USING (true);

-- Users can only update their own profile
CREATE POLICY "Users can update own profile"
ON public.profiles FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Users can insert their own profile
CREATE POLICY "Users can insert own profile"
ON public.profiles FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

-- =============================================================================
-- POSTS POLICIES
-- =============================================================================

-- Public posts are viewable by all authenticated users
CREATE POLICY "Public posts are viewable"
ON public.posts FOR SELECT
TO authenticated
USING (visibility = 'public' OR user_id = auth.uid());

-- Users can create their own posts
CREATE POLICY "Users can create posts"
ON public.posts FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Users can update their own posts
CREATE POLICY "Users can update own posts"
ON public.posts FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Users can delete their own posts
CREATE POLICY "Users can delete own posts"
ON public.posts FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- =============================================================================
-- COMMENTS POLICIES
-- =============================================================================

-- Comments are viewable by all authenticated users
CREATE POLICY "Comments are viewable"
ON public.comments FOR SELECT
TO authenticated
USING (true);

-- Users can create comments
CREATE POLICY "Users can create comments"
ON public.comments FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Users can update their own comments
CREATE POLICY "Users can update own comments"
ON public.comments FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Users can delete their own comments
CREATE POLICY "Users can delete own comments"
ON public.comments FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- =============================================================================
-- POST LIKES POLICIES
-- =============================================================================

-- Likes are viewable by all authenticated users
CREATE POLICY "Likes are viewable"
ON public.post_likes FOR SELECT
TO authenticated
USING (true);

-- Users can create their own likes
CREATE POLICY "Users can like posts"
ON public.post_likes FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Users can remove their own likes
CREATE POLICY "Users can unlike posts"
ON public.post_likes FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- =============================================================================
-- POST SHARES POLICIES
-- =============================================================================

-- Shares are viewable by all authenticated users
CREATE POLICY "Shares are viewable"
ON public.post_shares FOR SELECT
TO authenticated
USING (true);

-- Users can create their own shares
CREATE POLICY "Users can share posts"
ON public.post_shares FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- =============================================================================
-- EMERGENCY CONTACTS POLICIES
-- =============================================================================

-- Users can only view their own emergency contacts
CREATE POLICY "Users can view own emergency contacts"
ON public.emergency_contacts FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Users can create their own emergency contacts
CREATE POLICY "Users can create emergency contacts"
ON public.emergency_contacts FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Users can update their own emergency contacts
CREATE POLICY "Users can update own emergency contacts"
ON public.emergency_contacts FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Users can delete their own emergency contacts
CREATE POLICY "Users can delete own emergency contacts"
ON public.emergency_contacts FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- =============================================================================
-- MESSAGES POLICIES
-- =============================================================================

-- Users can view messages where they are sender or recipient
CREATE POLICY "Users can view own messages"
ON public.messages FOR SELECT
TO authenticated
USING (
  auth.uid() = sender_id OR 
  auth.uid() = recipient_id OR
  -- Group messages: user is member of the group
  EXISTS (
    SELECT 1 FROM public.group_members
    WHERE group_members.group_id = messages.group_id
    AND group_members.user_id = auth.uid()
  )
);

-- Users can send messages
CREATE POLICY "Users can send messages"
ON public.messages FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = sender_id);

-- Users can update their own messages
CREATE POLICY "Users can update own messages"
ON public.messages FOR UPDATE
TO authenticated
USING (auth.uid() = sender_id)
WITH CHECK (auth.uid() = sender_id);

-- =============================================================================
-- COMMUNITY GROUPS POLICIES
-- =============================================================================

-- Public groups are viewable by all
CREATE POLICY "Public groups are viewable"
ON public.community_groups FOR SELECT
TO authenticated
USING (
  is_private = false OR
  EXISTS (
    SELECT 1 FROM public.group_members
    WHERE group_members.group_id = community_groups.id
    AND group_members.user_id = auth.uid()
  )
);

-- Users can create groups
CREATE POLICY "Users can create groups"
ON public.community_groups FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = created_by);

-- Group admins can update groups
CREATE POLICY "Group admins can update groups"
ON public.community_groups FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.group_members
    WHERE group_members.group_id = community_groups.id
    AND group_members.user_id = auth.uid()
    AND group_members.role = 'admin'
  )
);

-- =============================================================================
-- GROUP MEMBERS POLICIES
-- =============================================================================

-- Members can view group membership
CREATE POLICY "Members can view group membership"
ON public.group_members FOR SELECT
TO authenticated
USING (
  -- User is member of the group OR group is public
  user_id = auth.uid() OR
  EXISTS (
    SELECT 1 FROM public.community_groups
    WHERE community_groups.id = group_members.group_id
    AND community_groups.is_private = false
  ) OR
  EXISTS (
    SELECT 1 FROM public.group_members gm
    WHERE gm.group_id = group_members.group_id
    AND gm.user_id = auth.uid()
  )
);

-- Admins can add members (or users can join public groups)
CREATE POLICY "Join groups or admins add members"
ON public.group_members FOR INSERT
TO authenticated
WITH CHECK (
  -- User joining themselves to public group
  (auth.uid() = user_id AND EXISTS (
    SELECT 1 FROM public.community_groups
    WHERE community_groups.id = group_id
    AND community_groups.is_private = false
  )) OR
  -- Admin adding member
  EXISTS (
    SELECT 1 FROM public.group_members
    WHERE group_members.group_id = group_members.group_id
    AND group_members.user_id = auth.uid()
    AND group_members.role = 'admin'
  )
);

-- =============================================================================
-- VEHICLES POLICIES
-- =============================================================================

-- Users can view their own vehicles
CREATE POLICY "Users can view own vehicles"
ON public.vehicles FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Users can create their own vehicles
CREATE POLICY "Users can create vehicles"
ON public.vehicles FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Users can update their own vehicles
CREATE POLICY "Users can update own vehicles"
ON public.vehicles FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Users can delete their own vehicles
CREATE POLICY "Users can delete own vehicles"
ON public.vehicles FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- =============================================================================
-- FEEDBACK POLICIES
-- =============================================================================

-- Users can view their own feedback
CREATE POLICY "Users can view own feedback"
ON public.feedback FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Admins can view all feedback
CREATE POLICY "Admins can view all feedback"
ON public.feedback FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

-- Users can create feedback
CREATE POLICY "Users can create feedback"
ON public.feedback FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- =============================================================================
-- USER SUBSCRIPTIONS POLICIES
-- =============================================================================

-- Users can view their own subscriptions
CREATE POLICY "Users can view own subscriptions"
ON public.user_subscriptions FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- System can create subscriptions (handled by backend)
-- No direct user insert policy for security

-- =============================================================================
-- AUDIT LOGS POLICIES
-- =============================================================================

-- Only admins can view audit logs
CREATE POLICY "Only admins can view audit logs"
ON public.audit_logs FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

-- Audit logs are immutable (no update/delete policies)

-- =============================================================================
-- HELPER FUNCTIONS FOR COMPLEX POLICIES
-- =============================================================================

-- Check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin(user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_roles.user_id = $1 AND role = 'admin'
  );
$$;

-- Check if user is group admin
CREATE OR REPLACE FUNCTION public.is_group_admin(user_id uuid, group_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.group_members
    WHERE group_members.user_id = $1 
    AND group_members.group_id = $2
    AND group_members.role = 'admin'
  );
$$;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION public.is_admin TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_group_admin TO authenticated;

-- Add comment explaining RLS setup
COMMENT ON SCHEMA public IS 
'Row Level Security (RLS) is enabled on all tables. Each table has specific policies that control access based on user authentication and authorization. Admin users have elevated privileges through the user_roles table.';