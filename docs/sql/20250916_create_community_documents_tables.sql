-- Community Document Library Tables
-- Run this in Supabase Dashboard > SQL Editor

-- Create community_documents table
CREATE TABLE IF NOT EXISTS community_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    document_type TEXT NOT NULL CHECK (document_type IN ('powerpoint', 'excel', 'pdf', 'checklist', 'procedure')),
    file_path TEXT NOT NULL,
    file_name TEXT NOT NULL,
    file_size BIGINT,
    created_by UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    creator_name TEXT NOT NULL,
    download_count INTEGER DEFAULT 0,
    rating_sum INTEGER DEFAULT 0,
    rating_count INTEGER DEFAULT 0,
    rating_average DECIMAL(3,2) GENERATED ALWAYS AS (
        CASE WHEN rating_count = 0 THEN 0
        ELSE ROUND(rating_sum::DECIMAL / rating_count, 2) END
    ) STORED,
    vehicle_models TEXT[] DEFAULT '{}',
    categories TEXT[] DEFAULT '{}',
    tags TEXT[] DEFAULT '{}',
    is_featured BOOLEAN DEFAULT false,
    is_public BOOLEAN DEFAULT true,
    search_vector tsvector GENERATED ALWAYS AS (
        setweight(to_tsvector('english', COALESCE(title, '')), 'A') ||
        setweight(to_tsvector('english', COALESCE(description, '')), 'B') ||
        setweight(to_tsvector('english', COALESCE(array_to_string(tags, ' '), '')), 'C') ||
        setweight(to_tsvector('english', COALESCE(array_to_string(categories, ' '), '')), 'D')
    ) STORED
);

-- Create document_ratings table
CREATE TABLE IF NOT EXISTS document_ratings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    document_id UUID REFERENCES community_documents(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    review_text TEXT,
    UNIQUE(document_id, user_id)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_community_documents_search ON community_documents USING gin(search_vector);
CREATE INDEX IF NOT EXISTS idx_community_documents_created_at ON community_documents(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_community_documents_rating ON community_documents(rating_average DESC);
CREATE INDEX IF NOT EXISTS idx_community_documents_downloads ON community_documents(download_count DESC);
CREATE INDEX IF NOT EXISTS idx_community_documents_creator ON community_documents(created_by);
CREATE INDEX IF NOT EXISTS idx_community_documents_type ON community_documents(document_type);
CREATE INDEX IF NOT EXISTS idx_community_documents_public ON community_documents(is_public) WHERE is_public = true;
CREATE INDEX IF NOT EXISTS idx_document_ratings_document ON document_ratings(document_id);
CREATE INDEX IF NOT EXISTS idx_document_ratings_user ON document_ratings(user_id);

-- Create rating aggregate update function
CREATE OR REPLACE FUNCTION update_document_rating_aggregate()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE community_documents
        SET
            rating_sum = rating_sum + NEW.rating,
            rating_count = rating_count + 1
        WHERE id = NEW.document_id;
        RETURN NEW;
    ELSIF TG_OP = 'UPDATE' THEN
        UPDATE community_documents
        SET
            rating_sum = rating_sum - OLD.rating + NEW.rating
        WHERE id = NEW.document_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE community_documents
        SET
            rating_sum = rating_sum - OLD.rating,
            rating_count = rating_count - 1
        WHERE id = OLD.document_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for rating aggregation
CREATE OR REPLACE TRIGGER trigger_update_rating_aggregate
    AFTER INSERT OR UPDATE OR DELETE ON document_ratings
    FOR EACH ROW EXECUTE FUNCTION update_document_rating_aggregate();

-- Create download count increment function
CREATE OR REPLACE FUNCTION increment_download_count(doc_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    UPDATE community_documents
    SET download_count = download_count + 1
    WHERE id = doc_id;
    RETURN FOUND;
END;
$$ LANGUAGE plpgsql;

-- Enable RLS
ALTER TABLE community_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_ratings ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for community_documents
CREATE POLICY "Community documents are viewable by everyone" ON community_documents
    FOR SELECT USING (is_public = true);

CREATE POLICY "Users can insert their own documents" ON community_documents
    FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update their own documents" ON community_documents
    FOR UPDATE USING (auth.uid() = created_by);

CREATE POLICY "Users can delete their own documents" ON community_documents
    FOR DELETE USING (auth.uid() = created_by);

-- Create RLS policies for document_ratings
CREATE POLICY "Users can view all ratings" ON document_ratings
    FOR SELECT USING (true);

CREATE POLICY "Users can insert their own ratings" ON document_ratings
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own ratings" ON document_ratings
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own ratings" ON document_ratings
    FOR DELETE USING (auth.uid() = user_id);