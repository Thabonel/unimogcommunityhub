DROP POLICY IF EXISTS "Users can delete own posts" ON community_posts;
DROP POLICY IF EXISTS "Users can update own posts" ON community_posts;
DROP POLICY IF EXISTS "Authenticated users can create posts" ON community_posts;

CREATE POLICY "Users can delete own posts" ON community_posts
  FOR DELETE
  USING (auth.uid() = author_id);

CREATE POLICY "Users can update own posts" ON community_posts
  FOR UPDATE
  USING (auth.uid() = author_id);

CREATE POLICY "Authenticated users can create posts" ON community_posts
  FOR INSERT
  WITH CHECK (auth.uid() = author_id);

DROP POLICY IF EXISTS "Users can delete own comments" ON post_comments;
DROP POLICY IF EXISTS "Users can update own comments" ON post_comments;
DROP POLICY IF EXISTS "Authenticated users can comment" ON post_comments;

CREATE POLICY "Users can delete own comments" ON post_comments
  FOR DELETE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own comments" ON post_comments
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Authenticated users can comment" ON post_comments
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can unlike" ON post_likes;
DROP POLICY IF EXISTS "Authenticated users can like" ON post_likes;

CREATE POLICY "Users can unlike" ON post_likes
  FOR DELETE
  USING (auth.uid() = user_id);

CREATE POLICY "Authenticated users can like" ON post_likes
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);
