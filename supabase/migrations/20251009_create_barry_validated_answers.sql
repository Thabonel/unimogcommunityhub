CREATE TABLE IF NOT EXISTS barry_validated_answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  manual_references JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),

  CONSTRAINT barry_validated_answers_question_check CHECK (LENGTH(question) > 0),
  CONSTRAINT barry_validated_answers_answer_check CHECK (LENGTH(answer) > 0)
);

CREATE INDEX idx_barry_validated_answers_user_id ON barry_validated_answers(user_id);
CREATE INDEX idx_barry_validated_answers_created_at ON barry_validated_answers(created_at DESC);

ALTER TABLE barry_validated_answers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert their own validated answers" ON barry_validated_answers
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own validated answers" ON barry_validated_answers
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all validated answers" ON barry_validated_answers
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid()
      AND role = 'admin'
    )
  );
