-- Barry Architecture Master Plan - Phase 1: Database Schema Migration
-- Created: 2025-11-06
-- Purpose: Create new tables with referential integrity and hybrid search support

BEGIN;

-- 0. Enable pgvector extension for hybrid search
CREATE EXTENSION IF NOT EXISTS vector;

-- 1. Documents - Single source of truth
CREATE TABLE documents (
    id SERIAL PRIMARY KEY,
    document_hash VARCHAR(64) UNIQUE NOT NULL,
    filename VARCHAR(255) NOT NULL,
    document_type VARCHAR(50) NOT NULL,
    storage_path TEXT NOT NULL,
    total_pages INTEGER NOT NULL,
    page_offset INTEGER DEFAULT 0,
    ingestion_status VARCHAR(20) DEFAULT 'pending'
        CHECK (ingestion_status IN ('pending', 'processing', 'complete', 'failed', 'missing')),
    ingestion_attempts INTEGER DEFAULT 0,
    last_ingestion_attempt TIMESTAMP,
    last_error TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_documents_filename ON documents(filename);
CREATE INDEX idx_documents_status ON documents(ingestion_status);
CREATE INDEX idx_documents_hash ON documents(document_hash);
CREATE INDEX idx_documents_type ON documents(document_type);

-- 2. Document Content - Page content with FK and hybrid search support
CREATE TABLE document_content (
    id SERIAL PRIMARY KEY,
    document_id INTEGER NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
    page_number INTEGER NOT NULL,
    display_page_number INTEGER NOT NULL,
    content TEXT,
    content_vector tsvector,
    content_embedding vector(1536),
    page_image_url TEXT,
    extraction_method VARCHAR(50),
    confidence_score DECIMAL(3,2),
    has_visual_elements BOOLEAN DEFAULT false,
    visual_content_type TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(document_id, page_number),
    CHECK (confidence_score IS NULL OR (confidence_score >= 0 AND confidence_score <= 1))
);

CREATE INDEX idx_content_document_page ON document_content(document_id, page_number);
CREATE INDEX idx_content_display_page ON document_content(document_id, display_page_number);
CREATE INDEX idx_content_vector ON document_content USING gin(content_vector);
CREATE INDEX idx_content_embedding ON document_content USING hnsw (content_embedding vector_cosine_ops) WITH (m = 16, ef_construction = 64);

-- 3. Document Index - Search terms with FK
CREATE TABLE document_index (
    id SERIAL PRIMARY KEY,
    document_id INTEGER NOT NULL,
    page_number INTEGER NOT NULL,
    term VARCHAR(255) NOT NULL,
    term_type VARCHAR(50),
    context TEXT,
    confidence DECIMAL(3,2),
    created_at TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY (document_id, page_number)
        REFERENCES document_content(document_id, page_number)
        ON DELETE CASCADE,
    CHECK (confidence IS NULL OR (confidence >= 0 AND confidence <= 1))
);

CREATE INDEX idx_index_term ON document_index(term);
CREATE INDEX idx_index_term_type ON document_index(term_type);
CREATE INDEX idx_index_document_page ON document_index(document_id, page_number);

-- 4. Reference Requests - Audit trail
CREATE TABLE reference_requests (
    id SERIAL PRIMARY KEY,
    query TEXT NOT NULL,
    document_id INTEGER REFERENCES documents(id),
    page_number INTEGER,
    resolution_method VARCHAR(50) NOT NULL
        CHECK (resolution_method IN ('content', 'pdf_fallback', 'processing', 'not_found', 'error')),
    user_id UUID REFERENCES auth.users(id),
    response_time_ms INTEGER,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_requests_resolution ON reference_requests(resolution_method);
CREATE INDEX idx_requests_created ON reference_requests(created_at);
CREATE INDEX idx_requests_document ON reference_requests(document_id);

-- 5. Validation Reports - Track daily validation
CREATE TABLE validation_reports (
    id SERIAL PRIMARY KEY,
    report_date DATE NOT NULL UNIQUE,
    checks_run INTEGER NOT NULL,
    checks_passed INTEGER NOT NULL,
    issues_found INTEGER NOT NULL,
    issues_fixed INTEGER NOT NULL,
    report_data JSONB NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_validation_date ON validation_reports(report_date DESC);

-- 6. Triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_documents_updated_at BEFORE UPDATE ON documents
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

COMMIT;
