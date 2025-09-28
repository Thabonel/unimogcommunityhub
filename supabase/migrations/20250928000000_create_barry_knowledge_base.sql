CREATE TABLE barry_knowledge_base (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  question_keywords TEXT[] NOT NULL,
  manual_references JSONB NOT NULL DEFAULT '{}',
  barry_response_template TEXT,
  priority INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_barry_knowledge_keywords ON barry_knowledge_base USING GIN (question_keywords);
CREATE INDEX idx_barry_knowledge_priority ON barry_knowledge_base (priority DESC);

CREATE OR REPLACE FUNCTION update_barry_knowledge_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_barry_knowledge_updated_at
  BEFORE UPDATE ON barry_knowledge_base
  FOR EACH ROW
  EXECUTE FUNCTION update_barry_knowledge_updated_at();

INSERT INTO barry_knowledge_base (question_keywords, manual_references, barry_response_template, priority) VALUES
  (ARRAY['portal', 'hub', 'front', 'wheel'],
   '{"manual": "U435", "pages": [555], "section": "19. Front Portal Hub"}',
   'Based on your U435 manual section 19, front portal hub procedures are located on page 555...',
   10),
  (ARRAY['portal', 'hub', 'rear', 'wheel'],
   '{"manual": "U435", "pages": [651], "section": "22. Rear Portal Hub"}',
   'For rear portal hub procedures, refer to U435 manual section 22, page 651...',
   10),
  (ARRAY['brake', 'hydraulic', 'system'],
   '{"manual": "U435", "pages": [710, 755], "section": "23-24. Brake Systems"}',
   'Hydraulic brake system information is found in U435 manual sections 23-24...',
   8);

ALTER TABLE barry_knowledge_base ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin can view barry knowledge" ON barry_knowledge_base
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role = 'admin'
    )
  );

CREATE POLICY "Admin can manage barry knowledge" ON barry_knowledge_base
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role = 'admin'
    )
  );