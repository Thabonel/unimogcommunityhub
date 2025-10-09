-- Barry Learning Cache System
-- Stores Barry's learned responses from PDF content for instant reuse

-- Create the learning cache table
CREATE TABLE IF NOT EXISTS barry_learned_responses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  query_embedding vector(1536) NOT NULL,
  original_query text NOT NULL,
  similar_queries text[] DEFAULT '{}',
  extracted_pdf_content text,
  barry_response text NOT NULL,
  manual_references jsonb DEFAULT '[]'::jsonb,
  confidence_score float DEFAULT 0.8,
  usage_count integer DEFAULT 1,
  created_at timestamptz DEFAULT now(),
  last_used_at timestamptz DEFAULT now()
);

-- Create vector index for semantic search (cosine similarity)
CREATE INDEX IF NOT EXISTS barry_learned_responses_embedding_idx
ON barry_learned_responses
USING ivfflat (query_embedding vector_cosine_ops)
WITH (lists = 100);

-- Create index for usage tracking
CREATE INDEX IF NOT EXISTS barry_learned_responses_usage_idx
ON barry_learned_responses (usage_count DESC, last_used_at DESC);

-- Create index for query lookup
CREATE INDEX IF NOT EXISTS barry_learned_responses_query_idx
ON barry_learned_responses (original_query);

-- RLS Policies
ALTER TABLE barry_learned_responses ENABLE ROW LEVEL SECURITY;

-- Anyone can read cached responses (they're helpful to all users)
CREATE POLICY "Anyone can read barry_learned_responses"
  ON barry_learned_responses
  FOR SELECT
  USING (true);

-- Only Barry (Edge Function with service role) can insert/update
CREATE POLICY "Service role can insert barry_learned_responses"
  ON barry_learned_responses
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Service role can update barry_learned_responses"
  ON barry_learned_responses
  FOR UPDATE
  USING (true);

-- Function to search learning cache by semantic similarity
CREATE OR REPLACE FUNCTION search_barry_cache(
  query_embedding vector(1536),
  similarity_threshold float DEFAULT 0.85,
  max_results int DEFAULT 1
)
RETURNS TABLE (
  id uuid,
  original_query text,
  barry_response text,
  manual_references jsonb,
  similarity_score float,
  usage_count integer
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    blr.id,
    blr.original_query,
    blr.barry_response,
    blr.manual_references,
    (1 - (blr.query_embedding <=> query_embedding))::float as similarity_score,
    blr.usage_count
  FROM barry_learned_responses blr
  WHERE (1 - (blr.query_embedding <=> query_embedding)) >= similarity_threshold
  ORDER BY blr.query_embedding <=> query_embedding
  LIMIT max_results;
END;
$$ LANGUAGE plpgsql;

COMMENT ON TABLE barry_learned_responses IS 'Stores Barry AI learned responses from PDF content for instant reuse on similar queries';
COMMENT ON COLUMN barry_learned_responses.query_embedding IS 'Vector embedding of the query for semantic search';
COMMENT ON COLUMN barry_learned_responses.extracted_pdf_content IS 'Actual PDF text content Barry read to formulate the response';
COMMENT ON COLUMN barry_learned_responses.similar_queries IS 'Array of similar queries that have hit this cache entry';
COMMENT ON COLUMN barry_learned_responses.confidence_score IS 'How confident is this cached response (0.0 to 1.0)';
COMMENT ON COLUMN barry_learned_responses.usage_count IS 'Number of times this cached response has been reused';
