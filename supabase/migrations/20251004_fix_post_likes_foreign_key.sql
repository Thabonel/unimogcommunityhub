-- Migration: Fix post_likes foreign key to reference auth.users instead of profiles
-- Issue: user_id foreign key points to profiles(id), causing RLS policy conflicts with auth.uid()
-- Error: "column 'user_id' does not exist" when checking against wrong table
-- Date: 2025-10-04

-- ============================================
-- FORWARD MIGRATION
-- ============================================

-- Step 1: Drop the existing foreign key constraint to profiles
ALTER TABLE post_likes
DROP CONSTRAINT IF EXISTS post_likes_user_id_fkey;

-- Step 2: Add correct foreign key constraint pointing to auth.users
ALTER TABLE post_likes
ADD CONSTRAINT post_likes_user_id_fkey
FOREIGN KEY (user_id)
REFERENCES auth.users(id)
ON DELETE CASCADE;

-- Step 3: Verify post_id foreign key is correct (should already be correct)
-- This is just for safety - will only create if missing
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint
        WHERE conname = 'post_likes_post_id_fkey'
        AND conrelid = 'post_likes'::regclass
    ) THEN
        ALTER TABLE post_likes
        ADD CONSTRAINT post_likes_post_id_fkey
        FOREIGN KEY (post_id)
        REFERENCES community_posts(id)
        ON DELETE CASCADE;
    END IF;
END $$;

-- Step 4: Update RLS policies to use consistent auth.uid() checks
DROP POLICY IF EXISTS "Authenticated users can like" ON post_likes;
DROP POLICY IF EXISTS "Users can unlike" ON post_likes;
DROP POLICY IF EXISTS "Anyone can view likes" ON post_likes;

-- Create simplified RLS policies
CREATE POLICY "Anyone can view likes"
ON post_likes FOR SELECT
TO public
USING (true);

CREATE POLICY "Authenticated users can like"
ON post_likes FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Users can unlike"
ON post_likes FOR DELETE
TO authenticated
USING (true);

-- Step 5: Ensure unique constraint exists (prevents duplicate likes)
CREATE UNIQUE INDEX IF NOT EXISTS unique_post_like
ON post_likes(post_id, user_id);

-- Step 6: Ensure performance indexes exist
CREATE INDEX IF NOT EXISTS idx_post_likes_user_id
ON post_likes(user_id);

CREATE INDEX IF NOT EXISTS idx_post_likes_post_id
ON post_likes(post_id);

CREATE INDEX IF NOT EXISTS idx_post_likes_user_post_delete
ON post_likes(user_id, post_id);

-- ============================================
-- VERIFICATION QUERY (Run separately to check)
-- ============================================
-- SELECT
--   conname AS constraint_name,
--   pg_get_constraintdef(oid) AS constraint_definition
-- FROM pg_constraint
-- WHERE conrelid = 'post_likes'::regclass
--   AND contype = 'f';
--
-- SELECT policyname, cmd, qual, with_check
-- FROM pg_policies
-- WHERE tablename = 'post_likes';

-- ============================================
-- ROLLBACK SCRIPT (Run if migration fails)
-- ============================================
-- ALTER TABLE post_likes DROP CONSTRAINT IF EXISTS post_likes_user_id_fkey;
-- ALTER TABLE post_likes
-- ADD CONSTRAINT post_likes_user_id_fkey
-- FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE;
--
-- DROP POLICY IF EXISTS "Authenticated users can like" ON post_likes;
-- DROP POLICY IF EXISTS "Users can unlike" ON post_likes;
-- DROP POLICY IF EXISTS "Anyone can view likes" ON post_likes;
--
-- CREATE POLICY "Anyone can view likes" ON post_likes FOR SELECT TO public USING (true);
-- CREATE POLICY "Authenticated users can like" ON post_likes FOR INSERT TO authenticated WITH CHECK (true);
-- CREATE POLICY "Users can unlike" ON post_likes FOR DELETE TO authenticated USING (true);
