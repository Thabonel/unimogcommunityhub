-- Notice Board System - Admin posting and user submission with approval workflow

-- Notice Board table for published notices
CREATE TABLE IF NOT EXISTS notice_board (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'general',
  priority TEXT NOT NULL DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
  category TEXT DEFAULT 'general',
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'archived', 'scheduled')),
  author_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  author_type TEXT NOT NULL DEFAULT 'admin' CHECK (author_type IN ('admin', 'user')),

  -- Visibility and targeting
  is_pinned BOOLEAN DEFAULT false,
  is_featured BOOLEAN DEFAULT false,
  target_audience TEXT DEFAULT 'all', -- 'all', 'premium', 'admins', 'specific_users'
  target_users UUID[] DEFAULT NULL, -- For specific user targeting

  -- Scheduling
  published_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ DEFAULT NULL,

  -- Media and formatting
  media JSONB DEFAULT NULL, -- For images, videos, files
  formatting JSONB DEFAULT NULL, -- For rich text formatting, colors, etc.
  tags TEXT[] DEFAULT NULL,

  -- Interaction settings
  allow_comments BOOLEAN DEFAULT true,
  allow_reactions BOOLEAN DEFAULT true,

  -- Metadata
  view_count INTEGER DEFAULT 0,
  comment_count INTEGER DEFAULT 0,
  reaction_count INTEGER DEFAULT 0,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- User notice submissions table (before approval)
CREATE TABLE IF NOT EXISTS notice_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'general',
  category TEXT DEFAULT 'general',
  submitter_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,

  -- Submission status
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'reviewing', 'approved', 'rejected', 'revision_requested')),

  -- Admin review
  reviewed_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  reviewed_at TIMESTAMPTZ DEFAULT NULL,
  admin_notes TEXT DEFAULT NULL,
  rejection_reason TEXT DEFAULT NULL,

  -- If approved, reference to published notice
  published_notice_id UUID REFERENCES notice_board(id) ON DELETE SET NULL,

  -- Original submission data
  requested_priority TEXT DEFAULT 'normal',
  requested_tags TEXT[] DEFAULT NULL,
  media JSONB DEFAULT NULL,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Notice reactions/interactions
CREATE TABLE IF NOT EXISTS notice_reactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  notice_id UUID NOT NULL REFERENCES notice_board(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  reaction_type TEXT NOT NULL DEFAULT 'like' CHECK (reaction_type IN ('like', 'helpful', 'important', 'urgent', 'bookmark')),
  created_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(notice_id, user_id, reaction_type)
);

-- Notice comments
CREATE TABLE IF NOT EXISTS notice_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  notice_id UUID NOT NULL REFERENCES notice_board(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  parent_comment_id UUID REFERENCES notice_comments(id) ON DELETE CASCADE,

  -- Moderation
  is_edited BOOLEAN DEFAULT false,
  is_deleted BOOLEAN DEFAULT false,
  deleted_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  deleted_reason TEXT DEFAULT NULL,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Notice views tracking
CREATE TABLE IF NOT EXISTS notice_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  notice_id UUID NOT NULL REFERENCES notice_board(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE, -- NULL for anonymous views
  ip_address INET DEFAULT NULL,
  user_agent TEXT DEFAULT NULL,
  viewed_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(notice_id, user_id) -- One view per user per notice
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_notice_board_status_published ON notice_board(status, published_at DESC);
CREATE INDEX IF NOT EXISTS idx_notice_board_author ON notice_board(author_id);
CREATE INDEX IF NOT EXISTS idx_notice_board_category ON notice_board(category);
CREATE INDEX IF NOT EXISTS idx_notice_board_priority ON notice_board(priority);
CREATE INDEX IF NOT EXISTS idx_notice_board_expires ON notice_board(expires_at) WHERE expires_at IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_notice_board_pinned ON notice_board(is_pinned) WHERE is_pinned = true;

CREATE INDEX IF NOT EXISTS idx_notice_submissions_status ON notice_submissions(status);
CREATE INDEX IF NOT EXISTS idx_notice_submissions_submitter ON notice_submissions(submitter_id);
CREATE INDEX IF NOT EXISTS idx_notice_submissions_reviewer ON notice_submissions(reviewed_by);

CREATE INDEX IF NOT EXISTS idx_notice_reactions_notice ON notice_reactions(notice_id);
CREATE INDEX IF NOT EXISTS idx_notice_reactions_user ON notice_reactions(user_id);

CREATE INDEX IF NOT EXISTS idx_notice_comments_notice ON notice_comments(notice_id);
CREATE INDEX IF NOT EXISTS idx_notice_comments_user ON notice_comments(user_id);
CREATE INDEX IF NOT EXISTS idx_notice_comments_parent ON notice_comments(parent_comment_id);

CREATE INDEX IF NOT EXISTS idx_notice_views_notice ON notice_views(notice_id);
CREATE INDEX IF NOT EXISTS idx_notice_views_user ON notice_views(user_id);

-- RLS Policies

-- Notice Board policies
ALTER TABLE notice_board ENABLE ROW LEVEL SECURITY;

-- Everyone can read active notices
CREATE POLICY "Anyone can read active notices" ON notice_board
  FOR SELECT USING (
    status = 'active' AND
    (expires_at IS NULL OR expires_at > NOW()) AND
    published_at <= NOW()
  );

-- Admins can manage all notices
CREATE POLICY "Admins can manage notices" ON notice_board
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Users can see their own authored notices
CREATE POLICY "Users can see own notices" ON notice_board
  FOR SELECT USING (author_id = auth.uid());

-- Notice Submissions policies
ALTER TABLE notice_submissions ENABLE ROW LEVEL SECURITY;

-- Users can submit notices
CREATE POLICY "Users can submit notices" ON notice_submissions
  FOR INSERT WITH CHECK (submitter_id = auth.uid());

-- Users can view their own submissions
CREATE POLICY "Users can view own submissions" ON notice_submissions
  FOR SELECT USING (submitter_id = auth.uid());

-- Users can update their pending submissions
CREATE POLICY "Users can update pending submissions" ON notice_submissions
  FOR UPDATE USING (
    submitter_id = auth.uid() AND
    status IN ('pending', 'revision_requested')
  );

-- Admins can manage all submissions
CREATE POLICY "Admins can manage submissions" ON notice_submissions
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Notice Reactions policies
ALTER TABLE notice_reactions ENABLE ROW LEVEL SECURITY;

-- Users can manage their own reactions
CREATE POLICY "Users can manage own reactions" ON notice_reactions
  FOR ALL USING (user_id = auth.uid());

-- Notice Comments policies
ALTER TABLE notice_comments ENABLE ROW LEVEL SECURITY;

-- Authenticated users can comment
CREATE POLICY "Users can comment on notices" ON notice_comments
  FOR INSERT WITH CHECK (
    user_id = auth.uid() AND
    EXISTS (SELECT 1 FROM notice_board WHERE id = notice_id AND allow_comments = true)
  );

-- Users can read comments on active notices
CREATE POLICY "Users can read notice comments" ON notice_comments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM notice_board
      WHERE id = notice_id AND status = 'active'
    ) AND NOT is_deleted
  );

-- Users can update their own comments
CREATE POLICY "Users can update own comments" ON notice_comments
  FOR UPDATE USING (user_id = auth.uid());

-- Admins can moderate all comments
CREATE POLICY "Admins can moderate comments" ON notice_comments
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Notice Views policies
ALTER TABLE notice_views ENABLE ROW LEVEL SECURITY;

-- Users can create view records
CREATE POLICY "Users can record notice views" ON notice_views
  FOR INSERT WITH CHECK (
    user_id = auth.uid() OR user_id IS NULL
  );

-- Only notice authors and admins can see view data
CREATE POLICY "Authors and admins can see view data" ON notice_views
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM notice_board
      WHERE id = notice_id AND author_id = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Functions for notice management

-- Function to update notice statistics
CREATE OR REPLACE FUNCTION update_notice_stats()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF TG_TABLE_NAME = 'notice_reactions' THEN
    IF TG_OP = 'INSERT' THEN
      UPDATE notice_board
      SET reaction_count = reaction_count + 1
      WHERE id = NEW.notice_id;
    ELSIF TG_OP = 'DELETE' THEN
      UPDATE notice_board
      SET reaction_count = reaction_count - 1
      WHERE id = OLD.notice_id;
    END IF;
  ELSIF TG_TABLE_NAME = 'notice_comments' THEN
    IF TG_OP = 'INSERT' AND NOT NEW.is_deleted THEN
      UPDATE notice_board
      SET comment_count = comment_count + 1
      WHERE id = NEW.notice_id;
    ELSIF TG_OP = 'UPDATE' THEN
      IF OLD.is_deleted = false AND NEW.is_deleted = true THEN
        UPDATE notice_board
        SET comment_count = comment_count - 1
        WHERE id = NEW.notice_id;
      ELSIF OLD.is_deleted = true AND NEW.is_deleted = false THEN
        UPDATE notice_board
        SET comment_count = comment_count + 1
        WHERE id = NEW.notice_id;
      END IF;
    END IF;
  ELSIF TG_TABLE_NAME = 'notice_views' THEN
    IF TG_OP = 'INSERT' THEN
      UPDATE notice_board
      SET view_count = view_count + 1
      WHERE id = NEW.notice_id;
    END IF;
  END IF;

  RETURN COALESCE(NEW, OLD);
END;
$$;

-- Create triggers
DROP TRIGGER IF EXISTS trigger_update_notice_reactions_stats ON notice_reactions;
CREATE TRIGGER trigger_update_notice_reactions_stats
  AFTER INSERT OR DELETE ON notice_reactions
  FOR EACH ROW EXECUTE FUNCTION update_notice_stats();

DROP TRIGGER IF EXISTS trigger_update_notice_comments_stats ON notice_comments;
CREATE TRIGGER trigger_update_notice_comments_stats
  AFTER INSERT OR UPDATE ON notice_comments
  FOR EACH ROW EXECUTE FUNCTION update_notice_stats();

DROP TRIGGER IF EXISTS trigger_update_notice_views_stats ON notice_views;
CREATE TRIGGER trigger_update_notice_views_stats
  AFTER INSERT ON notice_views
  FOR EACH ROW EXECUTE FUNCTION update_notice_stats();

-- Function to approve a notice submission
CREATE OR REPLACE FUNCTION approve_notice_submission(
  submission_id UUID,
  reviewer_id UUID,
  admin_notes TEXT DEFAULT NULL
) RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  submission_record notice_submissions%ROWTYPE;
  new_notice_id UUID;
BEGIN
  -- Check admin permission
  IF NOT EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = reviewer_id AND role = 'admin'
  ) THEN
    RAISE EXCEPTION 'Only admins can approve submissions';
  END IF;

  -- Get submission details
  SELECT * INTO submission_record
  FROM notice_submissions
  WHERE id = submission_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Submission not found';
  END IF;

  -- Create published notice
  INSERT INTO notice_board (
    title,
    content,
    type,
    category,
    priority,
    author_id,
    author_type,
    tags,
    media,
    published_at
  ) VALUES (
    submission_record.title,
    submission_record.content,
    submission_record.type,
    submission_record.category,
    submission_record.requested_priority,
    submission_record.submitter_id,
    'user',
    submission_record.requested_tags,
    submission_record.media,
    NOW()
  ) RETURNING id INTO new_notice_id;

  -- Update submission status
  UPDATE notice_submissions
  SET
    status = 'approved',
    reviewed_by = reviewer_id,
    reviewed_at = NOW(),
    admin_notes = COALESCE(approve_notice_submission.admin_notes, admin_notes),
    published_notice_id = new_notice_id
  WHERE id = submission_id;

  -- Create notification for submitter
  INSERT INTO notifications (
    user_id,
    type,
    content,
    reference_id,
    reference_type
  ) VALUES (
    submission_record.submitter_id,
    'notice',
    jsonb_build_object(
      'title', 'Your notice has been approved!',
      'message', 'Your submitted notice "' || submission_record.title || '" has been approved and published.',
      'link', '/notices/' || new_notice_id
    ),
    new_notice_id,
    'notice'
  );

  RETURN new_notice_id;
END;
$$;

-- Function to reject a notice submission
CREATE OR REPLACE FUNCTION reject_notice_submission(
  submission_id UUID,
  reviewer_id UUID,
  rejection_reason TEXT,
  admin_notes TEXT DEFAULT NULL
) RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  submission_record notice_submissions%ROWTYPE;
BEGIN
  -- Check admin permission
  IF NOT EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = reviewer_id AND role = 'admin'
  ) THEN
    RAISE EXCEPTION 'Only admins can reject submissions';
  END IF;

  -- Get submission details
  SELECT * INTO submission_record
  FROM notice_submissions
  WHERE id = submission_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Submission not found';
  END IF;

  -- Update submission status
  UPDATE notice_submissions
  SET
    status = 'rejected',
    reviewed_by = reviewer_id,
    reviewed_at = NOW(),
    rejection_reason = reject_notice_submission.rejection_reason,
    admin_notes = COALESCE(reject_notice_submission.admin_notes, admin_notes)
  WHERE id = submission_id;

  -- Create notification for submitter
  INSERT INTO notifications (
    user_id,
    type,
    content,
    reference_id,
    reference_type
  ) VALUES (
    submission_record.submitter_id,
    'notice',
    jsonb_build_object(
      'title', 'Notice submission update',
      'message', 'Your submitted notice "' || submission_record.title || '" needs revision. Reason: ' || rejection_reason,
      'link', '/notice-submissions/' || submission_id
    ),
    submission_id,
    'notice_submission'
  );

  RETURN true;
END;
$$;

-- Grant permissions
GRANT EXECUTE ON FUNCTION approve_notice_submission TO authenticated;
GRANT EXECUTE ON FUNCTION reject_notice_submission TO authenticated;
GRANT EXECUTE ON FUNCTION update_notice_stats TO authenticated;

-- Insert some sample data for demonstration
INSERT INTO notice_board (title, content, type, priority, author_id, author_type, is_pinned)
SELECT
  'Welcome to the Notice Board!',
  'This is where important community announcements and notices will be posted. Admin can post directly, and community members can submit notices for approval.',
  'announcement',
  'high',
  id,
  'admin',
  true
FROM profiles
WHERE EXISTS (
  SELECT 1 FROM user_roles
  WHERE user_roles.user_id = profiles.id AND role = 'admin'
)
LIMIT 1;