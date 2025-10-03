-- Migration: Fix post_shares foreign key constraint
-- Issue: Foreign key references non-existent 'posts' table, should reference 'community_posts'
-- Error: "Key is not present in table 'posts'" (code: 23503)
-- Date: 2025-10-04

-- ============================================
-- FORWARD MIGRATION
-- ============================================

-- Step 1: Drop the incorrect foreign key constraint
ALTER TABLE post_shares
DROP CONSTRAINT IF EXISTS post_shares_post_id_fkey;

-- Step 2: Add the correct foreign key constraint pointing to community_posts
ALTER TABLE post_shares
ADD CONSTRAINT post_shares_post_id_fkey
FOREIGN KEY (post_id)
REFERENCES community_posts(id)
ON DELETE CASCADE;

-- Step 3: Add missing unique constraint to prevent duplicate shares (optional but recommended)
CREATE UNIQUE INDEX IF NOT EXISTS unique_post_share
ON post_shares(post_id, user_id);

-- Step 4: Add performance index for share counts
CREATE INDEX IF NOT EXISTS idx_post_shares_post_id_count
ON post_shares(post_id);

-- Step 5: Add performance index for user shares
CREATE INDEX IF NOT EXISTS idx_post_shares_user_id_created
ON post_shares(user_id, created_at DESC);

-- ============================================
-- VERIFICATION QUERY (Run separately to check)
-- ============================================
-- SELECT
--   conname AS constraint_name,
--   conrelid::regclass AS table_name,
--   pg_get_constraintdef(oid) AS constraint_definition
-- FROM pg_constraint
-- WHERE conrelid = 'post_shares'::regclass
--   AND contype = 'f';

-- ============================================
-- ROLLBACK SCRIPT (Run if migration fails)
-- ============================================
-- ALTER TABLE post_shares DROP CONSTRAINT IF EXISTS post_shares_post_id_fkey;
-- ALTER TABLE post_shares
-- ADD CONSTRAINT post_shares_post_id_fkey
-- FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE;
-- DROP INDEX IF EXISTS unique_post_share;
-- DROP INDEX IF EXISTS idx_post_shares_post_id_count;
-- DROP INDEX IF EXISTS idx_post_shares_user_id_created;
