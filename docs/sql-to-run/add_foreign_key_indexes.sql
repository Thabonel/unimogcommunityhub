-- Add indexes for unindexed foreign keys to improve join performance
-- These are the 13 foreign keys identified in INFO suggestions

-- aggregated_content table
CREATE INDEX IF NOT EXISTS idx_aggregated_content_feed_id
ON aggregated_content (feed_id);

-- manual_metadata table
CREATE INDEX IF NOT EXISTS idx_manual_metadata_approved_by
ON manual_metadata (approved_by);

CREATE INDEX IF NOT EXISTS idx_manual_metadata_uploaded_by
ON manual_metadata (uploaded_by);

-- manuals table
CREATE INDEX IF NOT EXISTS idx_manuals_approved_by
ON manuals (approved_by);

CREATE INDEX IF NOT EXISTS idx_manuals_uploaded_by
ON manuals (uploaded_by);

-- pending_manual_uploads table
CREATE INDEX IF NOT EXISTS idx_pending_manual_uploads_approved_by
ON pending_manual_uploads (approved_by);

-- posts table
CREATE INDEX IF NOT EXISTS idx_posts_user_id
ON posts (user_id);

-- processed_manuals table
CREATE INDEX IF NOT EXISTS idx_processed_manuals_approved_by
ON processed_manuals (approved_by);

CREATE INDEX IF NOT EXISTS idx_processed_manuals_uploaded_by
ON processed_manuals (uploaded_by);

-- profiles table
CREATE INDEX IF NOT EXISTS idx_profiles_granted_by
ON profiles (granted_by);

-- qa_issues table
CREATE INDEX IF NOT EXISTS idx_qa_issues_closed_by
ON qa_issues (closed_by);

-- saved_content table
CREATE INDEX IF NOT EXISTS idx_saved_content_content_id
ON saved_content (content_id);

-- trips table
CREATE INDEX IF NOT EXISTS idx_trips_user_id
ON trips (user_id);