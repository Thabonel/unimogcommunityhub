-- Add vector embedding support to all WIS tables
-- Migration: 20250112_add_vector_embeddings_to_wis_tables

-- Add embedding columns to wis_procedures
ALTER TABLE wis_procedures 
ADD COLUMN IF NOT EXISTS embedding vector(1536),
ADD COLUMN IF NOT EXISTS embedding_model varchar(50) DEFAULT 'anthropic-v1',
ADD COLUMN IF NOT EXISTS embedding_updated_at timestamptz;

-- Add embedding columns to wis_parts  
ALTER TABLE wis_parts
ADD COLUMN IF NOT EXISTS embedding vector(1536),
ADD COLUMN IF NOT EXISTS embedding_model varchar(50) DEFAULT 'anthropic-v1', 
ADD COLUMN IF NOT EXISTS embedding_updated_at timestamptz;

-- Add embedding columns to wis_bulletins
ALTER TABLE wis_bulletins
ADD COLUMN IF NOT EXISTS embedding vector(1536),
ADD COLUMN IF NOT EXISTS embedding_model varchar(50) DEFAULT 'anthropic-v1',
ADD COLUMN IF NOT EXISTS embedding_updated_at timestamptz;

-- Create vector indexes for fast similarity search
-- Using HNSW for best query performance
CREATE INDEX IF NOT EXISTS idx_wis_procedures_embedding 
ON wis_procedures USING hnsw (embedding vector_cosine_ops);

CREATE INDEX IF NOT EXISTS idx_wis_parts_embedding
ON wis_parts USING hnsw (embedding vector_cosine_ops);

CREATE INDEX IF NOT EXISTS idx_wis_bulletins_embedding  
ON wis_bulletins USING hnsw (embedding vector_cosine_ops);

-- Improve existing wis_chunks embedding index
DROP INDEX IF EXISTS idx_wis_chunks_embedding;
CREATE INDEX idx_wis_chunks_embedding
ON wis_chunks USING hnsw (embedding vector_cosine_ops);

-- Create composite indexes for filtered vector search
CREATE INDEX IF NOT EXISTS idx_wis_procedures_embedding_vehicle
ON wis_procedures USING btree (vehicle_id) WHERE embedding IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_wis_parts_embedding_vehicle  
ON wis_parts USING btree (vehicle_id) WHERE embedding IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_wis_bulletins_embedding_vehicle
ON wis_bulletins USING btree (vehicle_id) WHERE embedding IS NOT NULL;

-- Create function to update embedding timestamps
CREATE OR REPLACE FUNCTION update_embedding_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.embedding_updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers to automatically update embedding timestamps
CREATE TRIGGER trigger_wis_procedures_embedding_timestamp
    BEFORE UPDATE OF embedding ON wis_procedures
    FOR EACH ROW
    EXECUTE FUNCTION update_embedding_timestamp();

CREATE TRIGGER trigger_wis_parts_embedding_timestamp  
    BEFORE UPDATE OF embedding ON wis_parts
    FOR EACH ROW
    EXECUTE FUNCTION update_embedding_timestamp();

CREATE TRIGGER trigger_wis_bulletins_embedding_timestamp
    BEFORE UPDATE OF embedding ON wis_bulletins  
    FOR EACH ROW
    EXECUTE FUNCTION update_embedding_timestamp();

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT SELECT, UPDATE (embedding, embedding_model, embedding_updated_at) ON wis_procedures TO authenticated;
GRANT SELECT, UPDATE (embedding, embedding_model, embedding_updated_at) ON wis_parts TO authenticated;
GRANT SELECT, UPDATE (embedding, embedding_model, embedding_updated_at) ON wis_bulletins TO authenticated;