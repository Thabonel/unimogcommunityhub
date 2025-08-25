-- Fix Community Page Database Issues
-- This migration creates missing tables and fixes table references

-- 1. Create community_posts table (main posts table for community)
CREATE TABLE IF NOT EXISTS community_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    author_id UUID NOT NULL,
    tags TEXT[],
    image_url TEXT,
    category TEXT DEFAULT 'general',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT fk_community_posts_author FOREIGN KEY (author_id) 
        REFERENCES profiles(id) ON DELETE CASCADE
);

-- Enable RLS on community_posts
ALTER TABLE community_posts ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for community_posts
CREATE POLICY "community_posts_select_policy" ON community_posts
    FOR SELECT
    USING (true);

CREATE POLICY "community_posts_insert_policy" ON community_posts
    FOR INSERT
    WITH CHECK (auth.uid() = author_id);

CREATE POLICY "community_posts_update_policy" ON community_posts
    FOR UPDATE
    USING (auth.uid() = author_id)
    WITH CHECK (auth.uid() = author_id);

CREATE POLICY "community_posts_delete_policy" ON community_posts
    FOR DELETE
    USING (auth.uid() = author_id);

-- 2. Create post_likes table for like functionality
CREATE TABLE IF NOT EXISTS post_likes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID NOT NULL,
    user_id UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT fk_post_likes_post FOREIGN KEY (post_id) 
        REFERENCES community_posts(id) ON DELETE CASCADE,
    CONSTRAINT fk_post_likes_user FOREIGN KEY (user_id) 
        REFERENCES profiles(id) ON DELETE CASCADE,
    CONSTRAINT unique_post_like UNIQUE(post_id, user_id)
);

-- 2. Create post_comments table for comment functionality
CREATE TABLE IF NOT EXISTS post_comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID NOT NULL,
    user_id UUID NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT fk_post_comments_post FOREIGN KEY (post_id) 
        REFERENCES community_posts(id) ON DELETE CASCADE,
    CONSTRAINT fk_post_comments_user FOREIGN KEY (user_id) 
        REFERENCES profiles(id) ON DELETE CASCADE
);

-- 3. Add performance indexes
CREATE INDEX IF NOT EXISTS idx_post_likes_post_id ON post_likes(post_id);
CREATE INDEX IF NOT EXISTS idx_post_likes_user_id ON post_likes(user_id);
CREATE INDEX IF NOT EXISTS idx_post_likes_created_at ON post_likes(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_post_comments_post_id ON post_comments(post_id);
CREATE INDEX IF NOT EXISTS idx_post_comments_user_id ON post_comments(user_id);
CREATE INDEX IF NOT EXISTS idx_post_comments_created_at ON post_comments(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_community_posts_author_id ON community_posts(author_id);
CREATE INDEX IF NOT EXISTS idx_community_posts_created_at ON community_posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_community_posts_tags ON community_posts USING gin(tags) WHERE tags IS NOT NULL;

-- 4. Enable Row Level Security
ALTER TABLE post_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_comments ENABLE ROW LEVEL SECURITY;

-- 5. Create RLS Policies for post_likes

-- Anyone can view likes
CREATE POLICY "post_likes_select_policy" ON post_likes
    FOR SELECT
    USING (true);

-- Authenticated users can create likes
CREATE POLICY "post_likes_insert_policy" ON post_likes
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Users can delete their own likes
CREATE POLICY "post_likes_delete_policy" ON post_likes
    FOR DELETE
    USING (auth.uid() = user_id);

-- 6. Create RLS Policies for post_comments

-- Anyone can view comments
CREATE POLICY "post_comments_select_policy" ON post_comments
    FOR SELECT
    USING (true);

-- Authenticated users can create comments
CREATE POLICY "post_comments_insert_policy" ON post_comments
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Users can update their own comments
CREATE POLICY "post_comments_update_policy" ON post_comments
    FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Users can delete their own comments
CREATE POLICY "post_comments_delete_policy" ON post_comments
    FOR DELETE
    USING (auth.uid() = user_id);

-- 7. Create helper functions for post statistics

-- Function to get like count for a post
CREATE OR REPLACE FUNCTION get_post_like_count(post_id_param UUID)
RETURNS INTEGER AS $$
BEGIN
    RETURN (SELECT COUNT(*) FROM post_likes WHERE post_id = post_id_param);
END;
$$ LANGUAGE plpgsql;

-- Function to get comment count for a post
CREATE OR REPLACE FUNCTION get_post_comment_count(post_id_param UUID)
RETURNS INTEGER AS $$
BEGIN
    RETURN (SELECT COUNT(*) FROM post_comments WHERE post_id = post_id_param);
END;
$$ LANGUAGE plpgsql;

-- Function to check if user has liked a post
CREATE OR REPLACE FUNCTION user_has_liked_post(post_id_param UUID, user_id_param UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM post_likes 
        WHERE post_id = post_id_param AND user_id = user_id_param
    );
END;
$$ LANGUAGE plpgsql;

-- 8. Add comments to document the tables
COMMENT ON TABLE post_likes IS 'Stores user likes for community posts';
COMMENT ON TABLE post_comments IS 'Stores user comments on community posts';

COMMENT ON COLUMN post_likes.post_id IS 'Reference to the liked post';
COMMENT ON COLUMN post_likes.user_id IS 'Reference to the user who liked';
COMMENT ON COLUMN post_likes.created_at IS 'Timestamp when the like was created';

COMMENT ON COLUMN post_comments.post_id IS 'Reference to the commented post';
COMMENT ON COLUMN post_comments.user_id IS 'Reference to the comment author';
COMMENT ON COLUMN post_comments.content IS 'The comment text content';
COMMENT ON COLUMN post_comments.created_at IS 'Timestamp when comment was created';
COMMENT ON COLUMN post_comments.updated_at IS 'Timestamp when comment was last updated';

-- 9. Create trigger to update the updated_at timestamp for comments
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_post_comments_updated_at
    BEFORE UPDATE ON post_comments
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();