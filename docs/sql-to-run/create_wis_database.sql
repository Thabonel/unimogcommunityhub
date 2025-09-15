-- Workshop Information System (WIS) Database Schema
-- This SQL script creates all the necessary tables, RPC functions, and storage buckets for the WIS system

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
CREATE EXTENSION IF NOT EXISTS "fuzzystrmatch";

-- Create WIS Parts table
CREATE TABLE IF NOT EXISTS public.wis_parts (
    id SERIAL PRIMARY KEY,
    part_number VARCHAR(50) NOT NULL UNIQUE,
    part_name VARCHAR(255) NOT NULL,
    category VARCHAR(100),
    subcategory VARCHAR(100),
    description TEXT,
    notes TEXT,
    media JSONB DEFAULT '[]',
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create WIS Procedures table
CREATE TABLE IF NOT EXISTS public.wis_procedures (
    id SERIAL PRIMARY KEY,
    procedure_code VARCHAR(50) NOT NULL UNIQUE,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(100),
    subcategory VARCHAR(100),
    description TEXT,
    content TEXT,
    steps JSONB DEFAULT '[]',
    tools_required TEXT[] DEFAULT ARRAY[]::TEXT[],
    safety_warnings TEXT[] DEFAULT ARRAY[]::TEXT[],
    media JSONB DEFAULT '[]',
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create WIS Bulletins table
CREATE TABLE IF NOT EXISTS public.wis_bulletins (
    id SERIAL PRIMARY KEY,
    bulletin_number VARCHAR(50) NOT NULL UNIQUE,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(100),
    severity VARCHAR(50) DEFAULT 'medium',
    description TEXT,
    content TEXT,
    issue_date DATE,
    status VARCHAR(50) DEFAULT 'active',
    media JSONB DEFAULT '[]',
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create WIS Documents Unified View
CREATE OR REPLACE VIEW public.wis_documents_unified AS
SELECT 
    'part_' || id::text AS doc_id,
    'part' AS doc_type,
    part_number AS ref,
    part_name AS title,
    COALESCE(description, '') || ' ' || COALESCE(notes, '') AS content,
    media,
    updated_at
FROM public.wis_parts
UNION ALL
SELECT 
    'procedure_' || id::text AS doc_id,
    'procedure' AS doc_type,
    procedure_code AS ref,
    title,
    COALESCE(description, '') || ' ' || COALESCE(content, '') AS content,
    media,
    updated_at
FROM public.wis_procedures
UNION ALL
SELECT 
    'bulletin_' || id::text AS doc_id,
    'bulletin' AS doc_type,
    bulletin_number AS ref,
    title,
    COALESCE(description, '') || ' ' || COALESCE(content, '') AS content,
    media,
    updated_at
FROM public.wis_bulletins;

-- Create WIS Chunks table for RAG
CREATE TABLE IF NOT EXISTS public.wis_chunks (
    id SERIAL PRIMARY KEY,
    doc_id VARCHAR(50) NOT NULL,
    doc_type VARCHAR(20) NOT NULL,
    ref VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    chunk_index INTEGER DEFAULT 0,
    content TEXT NOT NULL,
    media JSONB DEFAULT '[]',
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_wis_parts_part_number ON public.wis_parts USING gin(part_number gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_wis_parts_name ON public.wis_parts USING gin(part_name gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_wis_procedures_code ON public.wis_procedures USING gin(procedure_code gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_wis_procedures_title ON public.wis_procedures USING gin(title gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_wis_bulletins_number ON public.wis_bulletins USING gin(bulletin_number gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_wis_bulletins_title ON public.wis_bulletins USING gin(title gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_wis_chunks_content ON public.wis_chunks USING gin(content gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_wis_chunks_doc_id ON public.wis_chunks(doc_id);
CREATE INDEX IF NOT EXISTS idx_wis_chunks_doc_type ON public.wis_chunks(doc_type);

-- Create WIS Search RPC function
CREATE OR REPLACE FUNCTION public.wis_search(
    q TEXT,
    limit_rows INTEGER DEFAULT 10
)
RETURNS TABLE (
    doc_id TEXT,
    doc_type TEXT,
    ref TEXT,
    title TEXT,
    chunk_index INTEGER,
    content TEXT,
    media JSONB,
    updated_at TIMESTAMPTZ
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        c.doc_id,
        c.doc_type,
        c.ref,
        c.title,
        c.chunk_index,
        c.content,
        c.media,
        c.updated_at
    FROM public.wis_chunks c
    WHERE 
        c.content ILIKE '%' || q || '%'
        OR c.title ILIKE '%' || q || '%'
        OR c.ref ILIKE '%' || q || '%'
    ORDER BY 
        -- Prioritize title matches
        CASE WHEN c.title ILIKE '%' || q || '%' THEN 1 ELSE 2 END,
        -- Then by similarity to search query
        similarity(c.content, q) DESC,
        c.updated_at DESC
    LIMIT limit_rows;
END;
$$;

-- Create WIS Media URL RPC function
CREATE OR REPLACE FUNCTION public.wis_media_url(
    bucket TEXT,
    file_name TEXT,
    expires_in INTEGER DEFAULT 3600
)
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
    signed_url TEXT;
BEGIN
    -- Generate a signed URL for the media file
    -- Note: This is a simplified version. In a real implementation, you'd use Supabase's storage.from() API
    -- For now, we'll return a placeholder URL structure
    signed_url := 'https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/sign/' || bucket || '/' || file_name;
    
    RETURN signed_url;
END;
$$;

-- Insert sample data for testing

-- Sample Parts
INSERT INTO public.wis_parts (part_number, part_name, category, subcategory, description, media) VALUES
('A000 010 07 20', 'Alternator - 12V 55A', 'Electrical', 'Charging System', 'Main alternator for U1700L with OM366 engine', '[{"type":"photo","bucket":"wis-photos","file_name":"A000_010_07_20.jpg","description":"Alternator assembly"}]'),
('A001 153 03 28', 'Oil Filter - OM366', 'Engine', 'Lubrication', 'Primary oil filter for OM366 diesel engines', '[{"type":"photo","bucket":"wis-photos","file_name":"oil_filter_om366.jpg","description":"Oil filter cartridge"}]'),
('A002 240 15 17', 'Brake Pad Set - Front', 'Brakes', 'Disc Brakes', 'Front brake pad set for U1700L', '[{"type":"photo","bucket":"wis-photos","file_name":"brake_pads_front.jpg","description":"Front brake pad set"}]')
ON CONFLICT (part_number) DO NOTHING;

-- Sample Procedures  
INSERT INTO public.wis_procedures (procedure_code, title, category, subcategory, description, content, steps, tools_required, safety_warnings, media) VALUES
('10-001-001', 'Engine Oil Change - OM366', 'Engine', 'Maintenance', 'Standard oil change procedure for OM366 diesel engine', 'This procedure covers the complete engine oil and filter change for the Mercedes OM366 diesel engine used in U1700L Unimogs.', '["Warm engine to operating temperature", "Position drain pan", "Remove drain plug", "Allow oil to drain completely", "Replace oil filter", "Install new drain plug with new gasket", "Add new oil through filler cap", "Check oil level", "Run engine and check for leaks"]', '["Socket set", "Oil filter wrench", "Drain pan", "Torque wrench"]', '["Engine oil is hot - risk of burns", "Ensure vehicle is on level ground", "Use proper lifting equipment"]', '[{"type":"diagram","bucket":"wis-diagrams","file_name":"oil_change_om366.pdf","description":"Oil change procedure diagram"}]'),
('20-002-001', 'Alternator Replacement', 'Electrical', 'Charging System', 'Complete alternator removal and installation procedure', 'This procedure covers the removal and installation of the 12V alternator on U1700L vehicles.', '["Disconnect battery negative terminal", "Remove alternator belt", "Disconnect electrical connections", "Remove mounting bolts", "Remove alternator", "Install new alternator in reverse order", "Adjust belt tension", "Test charging system"]', '["Socket set", "Belt tension gauge", "Multimeter"]', '["Disconnect battery before starting work", "Do not drop alternator", "Check belt alignment"]', '[{"type":"diagram","bucket":"wis-diagrams","file_name":"alternator_replacement.pdf","description":"Alternator removal procedure"}]')
ON CONFLICT (procedure_code) DO NOTHING;

-- Sample Bulletins
INSERT INTO public.wis_bulletins (bulletin_number, title, category, severity, description, content, issue_date, status, media) VALUES
('TSB-001-2023', 'Updated Oil Change Intervals', 'Engine', 'medium', 'Revised oil change intervals for OM366 engines', 'Due to improved oil technology, oil change intervals have been extended from 10,000 to 15,000 kilometers for highway use.', '2023-06-15', 'active', '[{"type":"chart","bucket":"wis-charts","file_name":"oil_intervals_chart.pdf","description":"Oil change interval chart"}]'),
('TSB-002-2023', 'Brake System Update', 'Brakes', 'high', 'Important brake system maintenance update', 'New brake pad specifications and torque values for improved braking performance.', '2023-08-20', 'active', '[{"type":"table","bucket":"wis-tables","file_name":"brake_torque_specs.pdf","description":"Updated brake torque specifications"}]')
ON CONFLICT (bulletin_number) DO NOTHING;

-- Create chunks from the sample data
INSERT INTO public.wis_chunks (doc_id, doc_type, ref, title, chunk_index, content, media) 
SELECT 
    'part_' || id::text,
    'part',
    part_number,
    part_name,
    0,
    part_name || ' ' || COALESCE(description, '') || ' ' || COALESCE(notes, ''),
    media
FROM public.wis_parts
ON CONFLICT DO NOTHING;

INSERT INTO public.wis_chunks (doc_id, doc_type, ref, title, chunk_index, content, media)
SELECT 
    'procedure_' || id::text,
    'procedure', 
    procedure_code,
    title,
    0,
    title || ' ' || COALESCE(description, '') || ' ' || COALESCE(content, ''),
    media
FROM public.wis_procedures
ON CONFLICT DO NOTHING;

INSERT INTO public.wis_chunks (doc_id, doc_type, ref, title, chunk_index, content, media)
SELECT 
    'bulletin_' || id::text,
    'bulletin',
    bulletin_number, 
    title,
    0,
    title || ' ' || COALESCE(description, '') || ' ' || COALESCE(content, ''),
    media
FROM public.wis_bulletins  
ON CONFLICT DO NOTHING;

-- Enable Row Level Security (RLS) but allow read access for authenticated users
ALTER TABLE public.wis_parts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wis_procedures ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wis_bulletins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wis_chunks ENABLE ROW LEVEL SECURITY;

-- Create policies for read access
CREATE POLICY "Allow read access to wis_parts" ON public.wis_parts FOR SELECT USING (true);
CREATE POLICY "Allow read access to wis_procedures" ON public.wis_procedures FOR SELECT USING (true);
CREATE POLICY "Allow read access to wis_bulletins" ON public.wis_bulletins FOR SELECT USING (true);
CREATE POLICY "Allow read access to wis_chunks" ON public.wis_chunks FOR SELECT USING (true);

-- Grant necessary permissions
GRANT SELECT ON public.wis_parts TO anon, authenticated;
GRANT SELECT ON public.wis_procedures TO anon, authenticated;
GRANT SELECT ON public.wis_bulletins TO anon, authenticated;
GRANT SELECT ON public.wis_chunks TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.wis_search(TEXT, INTEGER) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.wis_media_url(TEXT, TEXT, INTEGER) TO anon, authenticated;

-- Create storage buckets (Note: These need to be created via Supabase dashboard or API)
-- The buckets that need to be created are:
-- - wis-photos
-- - wis-diagrams  
-- - wis-schematics
-- - wis-tables
-- - wis-charts

COMMENT ON TABLE public.wis_parts IS 'Mercedes-Benz WIS parts catalog data';
COMMENT ON TABLE public.wis_procedures IS 'Mercedes-Benz WIS repair procedures';  
COMMENT ON TABLE public.wis_bulletins IS 'Mercedes-Benz WIS service bulletins';
COMMENT ON TABLE public.wis_chunks IS 'RAG chunks for WIS search functionality';
COMMENT ON FUNCTION public.wis_search IS 'Full-text search across WIS documents';
COMMENT ON FUNCTION public.wis_media_url IS 'Generate signed URLs for WIS media files';