-- Enable pgvector extension for similarity search
CREATE EXTENSION IF NOT EXISTS vector;

-- Create table for manual metadata
CREATE TABLE IF NOT EXISTS manual_metadata (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  filename TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  model_codes TEXT[],
  year_range TEXT,
  category TEXT,
  page_count INTEGER,
  file_size BIGINT,
  uploaded_by UUID REFERENCES auth.users(id),
  processed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create table for manual chunks with vector embeddings
CREATE TABLE IF NOT EXISTS manual_chunks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  manual_id UUID REFERENCES manual_metadata(id) ON DELETE CASCADE,
  chunk_index INTEGER NOT NULL,
  content TEXT NOT NULL,
  content_type TEXT DEFAULT 'text', -- 'text', 'table', 'diagram_caption', 'procedure'
  page_number INTEGER,
  section_title TEXT,
  embedding vector(1536), -- OpenAI embeddings dimension
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT unique_manual_chunk UNIQUE (manual_id, chunk_index)
);

-- Create indexes for efficient searching
CREATE INDEX idx_manual_chunks_embedding ON manual_chunks 
  USING ivfflat (embedding vector_cosine_ops)
  WITH (lists = 100);

CREATE INDEX idx_manual_chunks_manual_id ON manual_chunks(manual_id);
CREATE INDEX idx_manual_chunks_page ON manual_chunks(page_number);
CREATE INDEX idx_manual_metadata_model ON manual_metadata USING GIN(model_codes);
CREATE INDEX idx_manual_metadata_category ON manual_metadata(category);

-- Create a function to search manual chunks by similarity
CREATE OR REPLACE FUNCTION search_manual_chunks(
  query_embedding vector(1536),
  match_count INT DEFAULT 5,
  match_threshold FLOAT DEFAULT 0.7
)
RETURNS TABLE (
  id UUID,
  manual_id UUID,
  manual_title TEXT,
  content TEXT,
  content_type TEXT,
  page_number INT,
  section_title TEXT,
  similarity FLOAT
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    mc.id,
    mc.manual_id,
    mm.title as manual_title,
    mc.content,
    mc.content_type,
    mc.page_number,
    mc.section_title,
    1 - (mc.embedding <=> query_embedding) as similarity
  FROM manual_chunks mc
  JOIN manual_metadata mm ON mm.id = mc.manual_id
  WHERE 1 - (mc.embedding <=> query_embedding) > match_threshold
  ORDER BY mc.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;

-- Create RLS policies
ALTER TABLE manual_metadata ENABLE ROW LEVEL SECURITY;
ALTER TABLE manual_chunks ENABLE ROW LEVEL SECURITY;

-- Anyone authenticated can read manuals
CREATE POLICY "Authenticated users can read manual metadata"
  ON manual_metadata FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can read manual chunks"
  ON manual_chunks FOR SELECT
  USING (auth.uid() IS NOT NULL);

-- Only admins can insert/update/delete
CREATE POLICY "Admins can manage manual metadata"
  ON manual_metadata FOR ALL
  USING (
    auth.uid() IN (
      SELECT id FROM auth.users 
      WHERE raw_user_meta_data->>'role' = 'admin'
    )
  );

CREATE POLICY "Admins can manage manual chunks"
  ON manual_chunks FOR ALL
  USING (
    auth.uid() IN (
      SELECT id FROM auth.users 
      WHERE raw_user_meta_data->>'role' = 'admin'
    )
  );

-- Add updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_manual_metadata_updated_at
  BEFORE UPDATE ON manual_metadata
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();