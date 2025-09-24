-- Create monitoring table for embedding generation
CREATE TABLE IF NOT EXISTS embedding_generation_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    batch_size INTEGER NOT NULL,
    chunks_processed INTEGER NOT NULL,
    chunks_failed INTEGER NOT NULL,
    total_chunks_attempted INTEGER NOT NULL,
    processing_log JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create feedback table for continuous improvement
CREATE TABLE IF NOT EXISTS vector_search_feedback (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id),
    query TEXT NOT NULL,
    search_results JSONB,
    user_rating INTEGER CHECK (user_rating >= 1 AND user_rating <= 5),
    feedback_text TEXT,
    confidence_score FLOAT,
    manual_references JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create search analytics table for performance monitoring
CREATE TABLE IF NOT EXISTS vector_search_analytics (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id),
    query TEXT NOT NULL,
    embedding_similarity_scores JSONB,
    results_returned INTEGER,
    response_time_ms INTEGER,
    search_method TEXT CHECK (search_method IN ('vector', 'hybrid', 'fallback')),
    confidence_threshold FLOAT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_embedding_logs_created_at ON embedding_generation_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_vector_feedback_created_at ON vector_search_feedback(created_at);
CREATE INDEX IF NOT EXISTS idx_vector_feedback_rating ON vector_search_feedback(user_rating);
CREATE INDEX IF NOT EXISTS idx_vector_analytics_created_at ON vector_search_analytics(created_at);
CREATE INDEX IF NOT EXISTS idx_vector_analytics_method ON vector_search_analytics(search_method);

-- Add RLS policies
ALTER TABLE embedding_generation_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE vector_search_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE vector_search_analytics ENABLE ROW LEVEL SECURITY;

-- Admin can see all logs
CREATE POLICY "Admin can view all embedding logs" ON embedding_generation_logs
    FOR SELECT USING (EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin'));

-- Users can view their own feedback
CREATE POLICY "Users can view own feedback" ON vector_search_feedback
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own feedback" ON vector_search_feedback
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Analytics - users can view their own, admins can view all
CREATE POLICY "Users can view own analytics" ON vector_search_analytics
    FOR SELECT USING (auth.uid() = user_id OR EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin'));

CREATE POLICY "System can insert analytics" ON vector_search_analytics
    FOR INSERT WITH CHECK (true);