-- Create Community Groups Tables
-- These tables were missing and causing group creation to fail

-- 1. Create community_groups table
CREATE TABLE IF NOT EXISTS public.community_groups (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    is_private BOOLEAN DEFAULT false,
    created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create group_members table
CREATE TABLE IF NOT EXISTS public.group_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    group_id UUID NOT NULL REFERENCES public.community_groups(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('admin', 'moderator', 'member')),
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(group_id, user_id)
);

-- 3. Create group_posts table (for posts within groups)
CREATE TABLE IF NOT EXISTS public.group_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    group_id UUID NOT NULL REFERENCES public.community_groups(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_community_groups_created_by ON public.community_groups(created_by);
CREATE INDEX IF NOT EXISTS idx_community_groups_created_at ON public.community_groups(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_community_groups_is_private ON public.community_groups(is_private);

CREATE INDEX IF NOT EXISTS idx_group_members_group_id ON public.group_members(group_id);
CREATE INDEX IF NOT EXISTS idx_group_members_user_id ON public.group_members(user_id);
CREATE INDEX IF NOT EXISTS idx_group_members_role ON public.group_members(role);

CREATE INDEX IF NOT EXISTS idx_group_posts_group_id ON public.group_posts(group_id);
CREATE INDEX IF NOT EXISTS idx_group_posts_user_id ON public.group_posts(user_id);
CREATE INDEX IF NOT EXISTS idx_group_posts_created_at ON public.group_posts(created_at DESC);

-- 5. Enable Row Level Security
ALTER TABLE public.community_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_posts ENABLE ROW LEVEL SECURITY;

-- 6. RLS Policies for community_groups

-- Anyone can view public groups, only members can view private groups
CREATE POLICY "View community groups" ON public.community_groups
    FOR SELECT
    USING (
        NOT is_private 
        OR EXISTS (
            SELECT 1 FROM public.group_members 
            WHERE group_id = community_groups.id AND user_id = auth.uid()
        )
    );

-- Authenticated users can create groups
CREATE POLICY "Create community groups" ON public.community_groups
    FOR INSERT
    WITH CHECK (auth.uid() = created_by AND auth.uid() IS NOT NULL);

-- Only group admins can update groups
CREATE POLICY "Update community groups" ON public.community_groups
    FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.group_members 
            WHERE group_id = community_groups.id 
            AND user_id = auth.uid() 
            AND role = 'admin'
        )
    );

-- Only group admins can delete groups
CREATE POLICY "Delete community groups" ON public.community_groups
    FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM public.group_members 
            WHERE group_id = community_groups.id 
            AND user_id = auth.uid() 
            AND role = 'admin'
        )
    );

-- 7. RLS Policies for group_members

-- Members can view other members in their groups
CREATE POLICY "View group members" ON public.group_members
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.group_members gm2
            WHERE gm2.group_id = group_members.group_id 
            AND gm2.user_id = auth.uid()
        )
    );

-- Group admins can add members
CREATE POLICY "Add group members" ON public.group_members
    FOR INSERT
    WITH CHECK (
        auth.uid() IS NOT NULL AND (
            -- Self-joining (will be approved later if needed)
            user_id = auth.uid()
            -- Or admin adding someone
            OR EXISTS (
                SELECT 1 FROM public.group_members 
                WHERE group_id = group_members.group_id 
                AND user_id = auth.uid() 
                AND role = 'admin'
            )
        )
    );

-- Admins can update member roles, members can leave
CREATE POLICY "Update group members" ON public.group_members
    FOR UPDATE
    USING (
        -- Admin updating roles
        EXISTS (
            SELECT 1 FROM public.group_members gm2
            WHERE gm2.group_id = group_members.group_id 
            AND gm2.user_id = auth.uid() 
            AND gm2.role = 'admin'
        )
        -- Or member updating their own record (e.g., leaving)
        OR user_id = auth.uid()
    );

-- Members can remove themselves, admins can remove others
CREATE POLICY "Remove group members" ON public.group_members
    FOR DELETE
    USING (
        user_id = auth.uid() -- Remove self
        OR EXISTS (
            SELECT 1 FROM public.group_members gm2
            WHERE gm2.group_id = group_members.group_id 
            AND gm2.user_id = auth.uid() 
            AND gm2.role = 'admin'
        )
    );

-- 8. RLS Policies for group_posts

-- Group members can view posts in their groups
CREATE POLICY "View group posts" ON public.group_posts
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.group_members 
            WHERE group_id = group_posts.group_id 
            AND user_id = auth.uid()
        )
    );

-- Group members can create posts
CREATE POLICY "Create group posts" ON public.group_posts
    FOR INSERT
    WITH CHECK (
        auth.uid() = user_id 
        AND EXISTS (
            SELECT 1 FROM public.group_members 
            WHERE group_id = group_posts.group_id 
            AND user_id = auth.uid()
        )
    );

-- Post authors and group admins can update posts
CREATE POLICY "Update group posts" ON public.group_posts
    FOR UPDATE
    USING (
        user_id = auth.uid() -- Post author
        OR EXISTS (
            SELECT 1 FROM public.group_members 
            WHERE group_id = group_posts.group_id 
            AND user_id = auth.uid() 
            AND role IN ('admin', 'moderator')
        )
    );

-- Post authors and group admins can delete posts
CREATE POLICY "Delete group posts" ON public.group_posts
    FOR DELETE
    USING (
        user_id = auth.uid() -- Post author
        OR EXISTS (
            SELECT 1 FROM public.group_members 
            WHERE group_id = group_posts.group_id 
            AND user_id = auth.uid() 
            AND role IN ('admin', 'moderator')
        )
    );

-- 9. Helper functions

-- Function to get group member count
CREATE OR REPLACE FUNCTION get_group_member_count(group_id_param UUID)
RETURNS INTEGER AS $$
BEGIN
    RETURN (SELECT COUNT(*) FROM public.group_members WHERE group_id = group_id_param);
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

-- Function to check if user is group admin
CREATE OR REPLACE FUNCTION is_group_admin(group_id_param UUID, user_id_param UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.group_members 
        WHERE group_id = group_id_param 
        AND user_id = user_id_param 
        AND role = 'admin'
    );
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

-- Function to check if user is group member
CREATE OR REPLACE FUNCTION is_group_member(group_id_param UUID, user_id_param UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.group_members 
        WHERE group_id = group_id_param 
        AND user_id = user_id_param
    );
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

-- Grant permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON public.community_groups TO authenticated;
GRANT ALL ON public.group_members TO authenticated; 
GRANT ALL ON public.group_posts TO authenticated;

GRANT EXECUTE ON FUNCTION get_group_member_count(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION is_group_admin(UUID, UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION is_group_member(UUID, UUID) TO authenticated;