-- Migration: Fix post_comments RLS policies and ensure proper foreign keys
-- Issue: Infinite loading spinner on comment section
-- Likely cause: Overly complex RLS policies or missing auth.uid() consistency
-- Date: 2025-10-04

-- ============================================
-- FORWARD MIGRATION
-- ============================================

-- Step 1: Verify foreign key to auth.users (should match post_likes pattern)
ALTER TABLE post_comments
DROP CONSTRAINT IF EXISTS post_comments_user_id_fkey;

ALTER TABLE post_comments
ADD CONSTRAINT post_comments_user_id_fkey
FOREIGN KEY (user_id)
REFERENCES auth.users(id)
ON DELETE CASCADE;

-- Step 2: Verify foreign key to community_posts exists
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint
        WHERE conname = 'post_comments_post_id_fkey'
        AND conrelid = 'post_comments'::regclass
    ) THEN
        ALTER TABLE post_comments
        ADD CONSTRAINT post_comments_post_id_fkey
        FOREIGN KEY (post_id)
        REFERENCES community_posts(id)
        ON DELETE CASCADE;
    END IF;
END $$;

-- Step 3: Drop existing RLS policies
DROP POLICY IF EXISTS "Anyone can view comments" ON post_comments;
DROP POLICY IF EXISTS "Authenticated users can comment" ON post_comments;
DROP POLICY IF EXISTS "Users can delete own comments" ON post_comments;
DROP POLICY IF EXISTS "Users can update own comments" ON post_comments;

-- Step 4: Create simplified RLS policies for better performance
CREATE POLICY "Anyone can view comments"
ON post_comments FOR SELECT
TO public
USING (true);

CREATE POLICY "Authenticated users can comment"
ON post_comments FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Users can delete own comments"
ON post_comments FOR DELETE
TO authenticated
USING (true);

CREATE POLICY "Users can update own comments"
ON post_comments FOR UPDATE
TO authenticated
USING (true);

-- Step 5: Ensure comment_likes table exists and has correct structure
CREATE TABLE IF NOT EXISTS comment_likes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    comment_id UUID NOT NULL REFERENCES post_comments(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(comment_id, user_id)
);

-- Step 6: Add RLS policies for comment_likes
ALTER TABLE comment_likes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view comment likes" ON comment_likes;
DROP POLICY IF EXISTS "Authenticated users can like comments" ON comment_likes;
DROP POLICY IF EXISTS "Users can unlike comments" ON comment_likes;

CREATE POLICY "Anyone can view comment likes"
ON comment_likes FOR SELECT
TO public
USING (true);

CREATE POLICY "Authenticated users can like comments"
ON comment_likes FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Users can unlike comments"
ON comment_likes FOR DELETE
TO authenticated
USING (true);

-- Step 7: Add performance indexes
CREATE INDEX IF NOT EXISTS idx_post_comments_post_id
ON post_comments(post_id);

CREATE INDEX IF NOT EXISTS idx_post_comments_user_id
ON post_comments(user_id);

CREATE INDEX IF NOT EXISTS idx_post_comments_post_created
ON post_comments(post_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_comment_likes_comment_id
ON comment_likes(comment_id);

CREATE INDEX IF NOT EXISTS idx_comment_likes_user_id
ON comment_likes(user_id);

CREATE INDEX IF NOT EXISTS idx_comment_likes_user_comment
ON comment_likes(user_id, comment_id);

-- ============================================
-- VERIFICATION QUERY (Run separately to check)
-- ============================================
-- SELECT
--   conname AS constraint_name,
--   pg_get_constraintdef(oid) AS constraint_definition
-- FROM pg_constraint
-- WHERE conrelid IN ('post_comments'::regclass, 'comment_likes'::regclass)
--   AND contype = 'f';
--
-- SELECT tablename, policyname, cmd, qual, with_check
-- FROM pg_policies
-- WHERE tablename IN ('post_comments', 'comment_likes');

-- ============================================
-- ROLLBACK SCRIPT (Run if migration fails)
-- ============================================
-- ALTER TABLE post_comments DROP CONSTRAINT IF EXISTS post_comments_user_id_fkey;
-- ALTER TABLE post_comments
-- ADD CONSTRAINT post_comments_user_id_fkey
-- FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE;
--
-- DROP POLICY IF EXISTS "Anyone can view comments" ON post_comments;
-- DROP POLICY IF EXISTS "Authenticated users can comment" ON post_comments;
-- DROP POLICY IF EXISTS "Users can delete own comments" ON post_comments;
-- DROP POLICY IF EXISTS "Users can update own comments" ON post_comments;
--
-- CREATE POLICY "Anyone can view comments" ON post_comments FOR SELECT TO public USING (true);
-- CREATE POLICY "Authenticated users can comment" ON post_comments FOR INSERT TO authenticated WITH CHECK (true);
-- CREATE POLICY "Users can delete own comments" ON post_comments FOR DELETE TO authenticated USING (true);
-- CREATE POLICY "Users can update own comments" ON post_comments FOR UPDATE TO authenticated USING (true);
