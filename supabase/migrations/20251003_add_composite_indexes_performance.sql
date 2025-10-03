CREATE INDEX IF NOT EXISTS idx_community_posts_author_delete ON community_posts(author_id, id);

CREATE INDEX IF NOT EXISTS idx_post_comments_user_delete ON post_comments(user_id, id);

CREATE INDEX IF NOT EXISTS idx_post_likes_user_post_delete ON post_likes(user_id, post_id);
