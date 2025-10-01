-- Create document management system for Claude-generated documents

-- Table for storing user-generated documents (Excel, PowerPoint, PDFs)
CREATE TABLE IF NOT EXISTS user_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    filename TEXT NOT NULL,
    file_path TEXT NOT NULL, -- Supabase Storage path
    file_type TEXT NOT NULL CHECK (file_type IN ('excel', 'powerpoint', 'pdf', 'word')),
    file_size INTEGER,
    content_type TEXT NOT NULL, -- MIME type
    document_category TEXT CHECK (document_category IN ('parts_catalog', 'maintenance_schedule', 'repair_procedure', 'training_module', 'inventory_tracker', 'repair_log', 'custom')),
    vehicle_model TEXT, -- Associated Unimog model
    procedure_id TEXT, -- Associated WIS procedure if applicable
    metadata JSONB DEFAULT '{}', -- Flexible metadata storage
    is_public BOOLEAN DEFAULT FALSE, -- Allow sharing with other users
    download_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table for document generation requests and history
CREATE TABLE IF NOT EXISTS document_generation_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    document_id UUID REFERENCES user_documents(id) ON DELETE CASCADE,
    generation_type TEXT NOT NULL CHECK (generation_type IN ('create_excel_spreadsheet', 'create_powerpoint_presentation', 'edit_pdf_document', 'convert_document_format')),
    input_parameters JSONB NOT NULL, -- Original request parameters
    generation_status TEXT DEFAULT 'pending' CHECK (generation_status IN ('pending', 'processing', 'completed', 'failed')),
    error_message TEXT,
    processing_time_ms INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE
);

-- Table for document sharing and collaboration
CREATE TABLE IF NOT EXISTS document_shares (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_id UUID REFERENCES user_documents(id) ON DELETE CASCADE,
    shared_by_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    shared_with_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    permission_level TEXT DEFAULT 'view' CHECK (permission_level IN ('view', 'download', 'edit')),
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(document_id, shared_with_user_id)
);

-- Table for document templates (pre-built templates for common tasks)
CREATE TABLE IF NOT EXISTS document_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    template_type TEXT NOT NULL CHECK (template_type IN ('excel', 'powerpoint', 'pdf')),
    category TEXT NOT NULL,
    vehicle_models TEXT[], -- Array of supported Unimog models
    template_data JSONB NOT NULL, -- Template structure and default data
    is_active BOOLEAN DEFAULT TRUE,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_documents_user_id ON user_documents(user_id);
CREATE INDEX IF NOT EXISTS idx_user_documents_file_type ON user_documents(file_type);
CREATE INDEX IF NOT EXISTS idx_user_documents_vehicle_model ON user_documents(vehicle_model);
CREATE INDEX IF NOT EXISTS idx_user_documents_created_at ON user_documents(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_document_generation_history_user_id ON document_generation_history(user_id);
CREATE INDEX IF NOT EXISTS idx_document_generation_history_status ON document_generation_history(generation_status);
CREATE INDEX IF NOT EXISTS idx_document_shares_document_id ON document_shares(document_id);
CREATE INDEX IF NOT EXISTS idx_document_templates_category ON document_templates(category);

-- Enable RLS
ALTER TABLE user_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_generation_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_shares ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_templates ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_documents
CREATE POLICY "Users can view their own documents" ON user_documents 
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can create their own documents" ON user_documents 
    FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own documents" ON user_documents 
    FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own documents" ON user_documents 
    FOR DELETE USING (user_id = auth.uid());

CREATE POLICY "Users can view public documents" ON user_documents 
    FOR SELECT USING (is_public = TRUE);

CREATE POLICY "Users can view shared documents" ON user_documents 
    FOR SELECT USING (
        id IN (
            SELECT document_id FROM document_shares 
            WHERE shared_with_user_id = auth.uid()
        )
    );

-- RLS Policies for document_generation_history
CREATE POLICY "Users can view their own generation history" ON document_generation_history 
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can create their own generation history" ON document_generation_history 
    FOR INSERT WITH CHECK (user_id = auth.uid());

-- RLS Policies for document_shares
CREATE POLICY "Users can view shares for their documents" ON document_shares 
    FOR SELECT USING (
        shared_by_user_id = auth.uid() OR shared_with_user_id = auth.uid()
    );

CREATE POLICY "Users can create shares for their documents" ON document_shares 
    FOR INSERT WITH CHECK (
        shared_by_user_id = auth.uid() AND 
        EXISTS (SELECT 1 FROM user_documents WHERE id = document_id AND user_id = auth.uid())
    );

CREATE POLICY "Users can delete shares for their documents" ON document_shares 
    FOR DELETE USING (shared_by_user_id = auth.uid());

-- RLS Policies for document_templates (read-only for regular users)
CREATE POLICY "Everyone can view active templates" ON document_templates 
    FOR SELECT USING (is_active = TRUE);

-- Function to update document download count
CREATE OR REPLACE FUNCTION increment_document_downloads(document_uuid UUID)
RETURNS void AS $$
BEGIN
    UPDATE user_documents 
    SET download_count = download_count + 1,
        updated_at = NOW()
    WHERE id = document_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to clean up expired shares
CREATE OR REPLACE FUNCTION cleanup_expired_document_shares()
RETURNS void AS $$
BEGIN
    DELETE FROM document_shares 
    WHERE expires_at IS NOT NULL AND expires_at < NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;