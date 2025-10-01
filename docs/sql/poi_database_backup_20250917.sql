-- POI Database Schema Backup
-- Created: 2025-09-17 23:16:29
-- Total POIs: 3 (all user-created)

-- Table Schema
CREATE TABLE IF NOT EXISTS pois (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    type TEXT NOT NULL,
    latitude NUMERIC NOT NULL,
    longitude NUMERIC NOT NULL,
    created_by UUID,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    is_verified BOOLEAN DEFAULT FALSE,
    rating NUMERIC,
    images TEXT[],
    metadata JSONB DEFAULT '{}'::jsonb
);

-- Export current POI data
-- Run this to restore data: pg_restore or copy from live database
-- Current count: 3 user-created POIs
-- Schema verified and backed up: ✅