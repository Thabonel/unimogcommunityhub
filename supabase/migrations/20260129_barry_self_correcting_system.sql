-- Barry Self-Correcting Feedback System - Migration
-- Date: January 29, 2026
-- Description: Add validation tracking, feedback system, and comprehensive search for Barry AI

BEGIN;

-- Add validation tracking columns to barry_knowledge_base
ALTER TABLE barry_knowledge_base
ADD COLUMN IF NOT EXISTS validated_by_user BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS validation_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS negative_feedback_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_validated_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS search_keywords TEXT[],
ADD COLUMN IF NOT EXISTS confidence_score NUMERIC DEFAULT 0.5;

-- Create index for faster validated answer lookup
CREATE INDEX IF NOT EXISTS idx_barry_kb_validated
ON barry_knowledge_base(validated_by_user, validation_count DESC)
WHERE validated_by_user = TRUE;

-- Create feedback tracking table
CREATE TABLE IF NOT EXISTS barry_answer_feedback (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  chat_log_id UUID REFERENCES chat_logs(id) ON DELETE CASCADE,
  user_query TEXT NOT NULL,
  barry_response TEXT NOT NULL,
  is_correct BOOLEAN,
  user_feedback TEXT,
  manual_references JSONB,
  search_method TEXT,
  response_time_ms INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for feedback analysis
CREATE INDEX IF NOT EXISTS idx_feedback_user
ON barry_answer_feedback(user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_feedback_correctness
ON barry_answer_feedback(is_correct, created_at DESC);

-- RLS policies for feedback table
ALTER TABLE barry_answer_feedback ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own feedback"
ON barry_answer_feedback FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own feedback"
ON barry_answer_feedback FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Admin can view all feedback
CREATE POLICY "Admins can view all feedback"
ON barry_answer_feedback FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

-- Function for comprehensive manual search
CREATE OR REPLACE FUNCTION search_all_manual_content(
  user_query TEXT,
  max_results INTEGER DEFAULT 50
)
RETURNS TABLE (
  chunk_id UUID,
  manual_title TEXT,
  page_number INTEGER,
  section_title TEXT,
  content TEXT,
  relevance_score NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    mc.id as chunk_id,
    mc.manual_title,
    mc.page_number,
    mc.section_title,
    mc.content,
    ts_rank(mc.content_tsv, plainto_tsquery('english', user_query)) as relevance_score
  FROM manual_chunks mc
  WHERE mc.content_tsv @@ plainto_tsquery('english', user_query)
     OR mc.content ILIKE '%' || user_query || '%'
  ORDER BY relevance_score DESC, mc.page_number ASC
  LIMIT max_results;
END;
$$ LANGUAGE plpgsql;

-- Create trigger function for auto-saving validated answers
CREATE OR REPLACE FUNCTION save_validated_answer()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.is_correct = TRUE THEN
    DECLARE
      keywords TEXT[];
    BEGIN
      keywords := string_to_array(
        regexp_replace(lower(NEW.user_query), '[^a-z0-9\\\\s]', '', 'g'),
        ' '
      );
      keywords := array_remove(keywords, '');
      keywords := keywords[1:10];

      INSERT INTO barry_knowledge_base (
        question_keywords,
        barry_response_template,
        manual_references,
        priority,
        validated_by_user,
        validation_count,
        last_validated_at,
        search_keywords,
        confidence_score
      ) VALUES (
        keywords,
        NEW.barry_response,
        NEW.manual_references,
        8,
        TRUE,
        1,
        NOW(),
        keywords,
        1.0
      )
      ON CONFLICT (question_keywords)
      DO UPDATE SET
        validation_count = barry_knowledge_base.validation_count + 1,
        last_validated_at = NOW(),
        confidence_score = LEAST(barry_knowledge_base.confidence_score + 0.1, 1.0);
    END;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger if it doesn't exist
DROP TRIGGER IF EXISTS trigger_save_validated_answer ON barry_answer_feedback;
CREATE TRIGGER trigger_save_validated_answer
AFTER INSERT ON barry_answer_feedback
FOR EACH ROW
EXECUTE FUNCTION save_validated_answer();

COMMIT;
