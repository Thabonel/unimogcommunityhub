-- Create Barry Knowledge Base for manual curation
CREATE TABLE IF NOT EXISTS barry_knowledge_base (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  question_keywords TEXT[] NOT NULL,
  manual_references JSONB NOT NULL,
  barry_response_template TEXT,
  priority INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_barry_knowledge_base_updated_at
    BEFORE UPDATE ON barry_knowledge_base
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Add index for keyword search
CREATE INDEX IF NOT EXISTS idx_barry_knowledge_keywords
ON barry_knowledge_base USING GIN (question_keywords);

-- Add RLS policies
ALTER TABLE barry_knowledge_base ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to read
CREATE POLICY "Allow authenticated users to read barry knowledge"
ON barry_knowledge_base FOR SELECT
TO authenticated
USING (true);

-- Only admins can modify
CREATE POLICY "Only admins can modify barry knowledge"
ON barry_knowledge_base FOR ALL
TO authenticated
USING (check_admin_access());

-- Add comment
COMMENT ON TABLE barry_knowledge_base IS 'Manual knowledge curation for Barry AI responses';