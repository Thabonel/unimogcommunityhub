-- Create community_documents table for shared document library
CREATE TABLE IF NOT EXISTS community_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    -- Document metadata
    title TEXT NOT NULL,
    description TEXT,
    document_type TEXT NOT NULL CHECK (document_type IN ('powerpoint', 'excel', 'pdf', 'checklist', 'procedure')),
    file_name TEXT NOT NULL,
    file_path TEXT NOT NULL, -- Path in Supabase Storage
    file_size INTEGER,

    -- Community features
    created_by UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    is_public BOOLEAN DEFAULT true,
    download_count INTEGER DEFAULT 0,
    rating_sum INTEGER DEFAULT 0,
    rating_count INTEGER DEFAULT 0,
    rating_average DECIMAL(3,2) GENERATED ALWAYS AS (
        CASE
            WHEN rating_count = 0 THEN 0
            ELSE ROUND(rating_sum::DECIMAL / rating_count, 2)
        END
    ) STORED,

    -- Vehicle and categorization
    vehicle_models TEXT[] DEFAULT '{}', -- Array of vehicle models (U1700L, U1300L, etc.)
    categories TEXT[] DEFAULT '{}', -- Array of categories (hydraulics, engine, transmission, etc.)
    tags TEXT[] DEFAULT '{}', -- User-defined tags

    -- Original generation context
    original_query TEXT, -- The Barry query that generated this document
    generation_method TEXT DEFAULT 'barry_ai', -- How it was generated

    -- Search optimization
    search_vector tsvector GENERATED ALWAYS AS (
        to_tsvector('english',
            title || ' ' ||
            COALESCE(description, '') || ' ' ||
            array_to_string(vehicle_models, ' ') || ' ' ||
            array_to_string(categories, ' ') || ' ' ||
            array_to_string(tags, ' ')
        )
    ) STORED
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_community_documents_created_at ON community_documents(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_community_documents_public ON community_documents(is_public) WHERE is_public = true;
CREATE INDEX IF NOT EXISTS idx_community_documents_rating ON community_documents(rating_average DESC) WHERE is_public = true;
CREATE INDEX IF NOT EXISTS idx_community_documents_downloads ON community_documents(download_count DESC) WHERE is_public = true;
CREATE INDEX IF NOT EXISTS idx_community_documents_vehicle_models ON community_documents USING gin(vehicle_models);
CREATE INDEX IF NOT EXISTS idx_community_documents_categories ON community_documents USING gin(categories);
CREATE INDEX IF NOT EXISTS idx_community_documents_tags ON community_documents USING gin(tags);
CREATE INDEX IF NOT EXISTS idx_community_documents_search ON community_documents USING gin(search_vector);
CREATE INDEX IF NOT EXISTS idx_community_documents_user ON community_documents(created_by);
CREATE INDEX IF NOT EXISTS idx_community_documents_type ON community_documents(document_type);

-- Create document_ratings table for individual ratings
CREATE TABLE IF NOT EXISTS document_ratings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    document_id UUID REFERENCES community_documents(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
    review_text TEXT,

    -- Prevent duplicate ratings from same user
    UNIQUE(document_id, user_id)
);

-- Create indexes for ratings
CREATE INDEX IF NOT EXISTS idx_document_ratings_document ON document_ratings(document_id);
CREATE INDEX IF NOT EXISTS idx_document_ratings_user ON document_ratings(user_id);

-- Create trigger to update rating aggregates
CREATE OR REPLACE FUNCTION update_document_rating_aggregates()
RETURNS TRIGGER AS $$
BEGIN
    -- Update the community_documents table with new aggregates
    UPDATE community_documents
    SET
        rating_sum = (
            SELECT COALESCE(SUM(rating), 0)
            FROM document_ratings
            WHERE document_id = COALESCE(NEW.document_id, OLD.document_id)
        ),
        rating_count = (
            SELECT COUNT(*)
            FROM document_ratings
            WHERE document_id = COALESCE(NEW.document_id, OLD.document_id)
        ),
        updated_at = NOW()
    WHERE id = COALESCE(NEW.document_id, OLD.document_id);

    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Create trigger for rating updates
DROP TRIGGER IF EXISTS trigger_update_document_rating_aggregates ON document_ratings;
CREATE TRIGGER trigger_update_document_rating_aggregates
    AFTER INSERT OR UPDATE OR DELETE ON document_ratings
    FOR EACH ROW
    EXECUTE FUNCTION update_document_rating_aggregates();

-- Enable RLS
ALTER TABLE community_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_ratings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for community_documents
CREATE POLICY "Public documents are viewable by everyone" ON community_documents
    FOR SELECT USING (is_public = true);

CREATE POLICY "Users can view their own documents" ON community_documents
    FOR SELECT USING (auth.uid() = created_by);

CREATE POLICY "Authenticated users can create documents" ON community_documents
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update their own documents" ON community_documents
    FOR UPDATE USING (auth.uid() = created_by);

CREATE POLICY "Users can delete their own documents" ON community_documents
    FOR DELETE USING (auth.uid() = created_by);

-- RLS Policies for document_ratings
CREATE POLICY "Ratings are viewable by everyone" ON document_ratings
    FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create ratings" ON document_ratings
    FOR INSERT WITH CHECK (auth.role() = 'authenticated' AND auth.uid() = user_id);

CREATE POLICY "Users can update their own ratings" ON document_ratings
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own ratings" ON document_ratings
    FOR DELETE USING (auth.uid() = user_id);

-- Grant necessary permissions
GRANT ALL ON community_documents TO authenticated;
GRANT ALL ON document_ratings TO authenticated;
GRANT SELECT ON community_documents TO anon;