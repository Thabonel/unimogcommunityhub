-- Migration: Create Hierarchical WIS Schema
-- This migration creates the new hierarchical database structure for the WIS system
-- based on the original Mercedes WIS architecture analysis

-- Drop existing WIS tables to start fresh
DROP TABLE IF EXISTS wis_user_bookmarks CASCADE;
DROP TABLE IF EXISTS wis_bulletin_procedures CASCADE;
DROP TABLE IF EXISTS wis_service_bulletins CASCADE;
DROP TABLE IF EXISTS wis_procedure_relationships CASCADE;
DROP TABLE IF EXISTS wis_procedure_tools CASCADE;
DROP TABLE IF EXISTS wis_tools CASCADE;
DROP TABLE IF EXISTS wis_procedure_parts CASCADE;
DROP TABLE IF EXISTS wis_parts CASCADE;
DROP TABLE IF EXISTS wis_procedure_steps CASCADE;
DROP TABLE IF EXISTS wis_procedures CASCADE;
DROP TABLE IF EXISTS wis_components CASCADE;
DROP TABLE IF EXISTS wis_systems CASCADE;
DROP TABLE IF EXISTS wis_models CASCADE;

-- Drop existing enum if exists
DROP TYPE IF EXISTS procedure_relationship_type CASCADE;

-- Create relationship types enum
CREATE TYPE procedure_relationship_type AS ENUM (
    'prerequisite',        -- Must be done before
    'follow_up',          -- Should be done after
    'alternative',        -- Alternative approach
    'related',           -- General relationship
    'part_of_series',    -- Part of multi-procedure series
    'references',        -- References for additional info
    'supersedes',        -- This procedure replaces the other
    'see_also'           -- Additional relevant procedures
);

-- 1. VEHICLE MODELS TABLE
CREATE TABLE wis_models (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    model_code VARCHAR(10) NOT NULL UNIQUE, -- 'U435', 'U400', etc.
    model_name VARCHAR(100) NOT NULL,       -- 'Unimog U435'
    description TEXT,
    year_range VARCHAR(20),                 -- '1975-1991'
    image_url TEXT,
    active BOOLEAN DEFAULT true,
    sort_order INTEGER,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. SYSTEM CATEGORIES TABLE (Engine, Axles, etc.)
CREATE TABLE wis_systems (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    model_id UUID REFERENCES wis_models(id) ON DELETE CASCADE,
    system_code VARCHAR(10) NOT NULL,       -- '01', '25', '60'
    system_name VARCHAR(100) NOT NULL,      -- 'Engine', 'Axles/Portal Hubs'
    description TEXT,
    icon_name VARCHAR(50),                  -- 'engine', 'gear', 'electric'
    sort_order INTEGER,
    estimated_procedures INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),

    UNIQUE(model_id, system_code)
);

-- 3. COMPONENT GROUPS TABLE (Portal Hub, Differential)
CREATE TABLE wis_components (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    system_id UUID REFERENCES wis_systems(id) ON DELETE CASCADE,
    component_code VARCHAR(10) NOT NULL,    -- '10', '20', '30'
    component_name VARCHAR(100) NOT NULL,   -- 'Portal Hub Assembly'
    description TEXT,
    sort_order INTEGER,
    estimated_procedures INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),

    UNIQUE(system_id, component_code)
);

-- 4. PROCEDURES TABLE (Redesigned)
CREATE TABLE wis_procedures (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    component_id UUID REFERENCES wis_components(id) ON DELETE CASCADE,

    -- Identification
    procedure_code VARCHAR(20) NOT NULL,    -- '25.20.02'
    title VARCHAR(200) NOT NULL,           -- 'Replace Portal Hub Seals'
    description TEXT,

    -- Metadata
    estimated_time_hours DECIMAL(4,2),     -- 2.50
    difficulty_level INTEGER CHECK (difficulty_level BETWEEN 1 AND 5),
    labor_category VARCHAR(50),            -- 'maintenance', 'repair', 'overhaul'

    -- Content
    overview TEXT,                          -- Brief procedure overview
    safety_warnings TEXT[],                 -- Array of safety warnings
    special_notes TEXT[],                   -- Special considerations

    -- Versioning
    version VARCHAR(10) DEFAULT '1.0',
    supersedes_procedure_id UUID REFERENCES wis_procedures(id),
    status VARCHAR(20) DEFAULT 'active',    -- 'active', 'superseded', 'deprecated'

    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),

    UNIQUE(component_id, procedure_code)
);

-- Add search vector column separately to avoid syntax issues
ALTER TABLE wis_procedures ADD COLUMN search_vector TSVECTOR
    GENERATED ALWAYS AS (
        to_tsvector('english',
            procedure_code || ' ' ||
            title || ' ' ||
            COALESCE(description, '') || ' ' ||
            COALESCE(overview, '')
        )
    ) STORED;

-- 5. PROCEDURE STEPS TABLE
CREATE TABLE wis_procedure_steps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    procedure_id UUID REFERENCES wis_procedures(id) ON DELETE CASCADE,

    -- Step identification
    step_number INTEGER NOT NULL,
    step_title VARCHAR(200),               -- Optional step title

    -- Content
    instruction TEXT NOT NULL,             -- Main instruction text
    detailed_notes TEXT,                   -- Additional technical notes
    safety_warnings TEXT[],                -- Step-specific warnings

    -- Technical specifications
    torque_specs JSONB,                    -- {"M12_bolt": "85 Nm", "M8_bolt": "25 Nm"}
    measurements JSONB,                    -- {"clearance": "0.2mm", "gap": "1.5mm"}

    -- Media references
    primary_image_url TEXT,                -- Main step image
    additional_image_urls TEXT[],          -- Additional images
    video_url TEXT,                        -- Step video if available
    diagram_urls TEXT[],                   -- Technical diagrams

    -- Quality control
    verification_points TEXT[],            -- How to verify step completion
    common_mistakes TEXT[],                -- Known pitfalls

    created_at TIMESTAMPTZ DEFAULT NOW(),

    UNIQUE(procedure_id, step_number)
);

-- 6. PARTS CATALOG TABLE
CREATE TABLE wis_parts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Part identification
    mercedes_part_number VARCHAR(50) NOT NULL UNIQUE,
    description VARCHAR(200) NOT NULL,
    category VARCHAR(100),                 -- 'seal', 'gasket', 'bolt', 'fluid'

    -- Specifications
    specifications JSONB,                  -- Technical specs
    supersedes_part_number VARCHAR(50),    -- If part is updated
    superseded_by_part_number VARCHAR(50), -- If part is obsolete

    -- Availability
    status VARCHAR(20) DEFAULT 'available', -- 'available', 'obsolete', 'limited'
    alternative_parts TEXT[],              -- Alternative part numbers

    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. PROCEDURE PARTS RELATIONSHIP
CREATE TABLE wis_procedure_parts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    procedure_id UUID REFERENCES wis_procedures(id) ON DELETE CASCADE,
    part_id UUID REFERENCES wis_parts(id),

    -- Usage details
    quantity INTEGER NOT NULL DEFAULT 1,
    usage_note TEXT,                       -- "Per side", "If damaged", etc.
    required BOOLEAN DEFAULT true,         -- true/false for optional parts
    step_numbers INTEGER[],                -- Which steps use this part

    created_at TIMESTAMPTZ DEFAULT NOW(),

    UNIQUE(procedure_id, part_id)
);

-- 8. TOOLS CATALOG TABLE
CREATE TABLE wis_tools (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Tool identification
    tool_name VARCHAR(200) NOT NULL,
    tool_type VARCHAR(50),                 -- 'standard', 'special', 'safety'
    mercedes_tool_number VARCHAR(50),      -- Official Mercedes tool number

    -- Details
    description TEXT,
    specifications JSONB,                  -- Technical specs
    alternative_tools TEXT[],              -- Alternative tool options

    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. PROCEDURE TOOLS RELATIONSHIP
CREATE TABLE wis_procedure_tools (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    procedure_id UUID REFERENCES wis_procedures(id) ON DELETE CASCADE,
    tool_id UUID REFERENCES wis_tools(id),

    -- Usage details
    required BOOLEAN DEFAULT true,
    usage_note TEXT,
    step_numbers INTEGER[],                -- Which steps use this tool

    created_at TIMESTAMPTZ DEFAULT NOW(),

    UNIQUE(procedure_id, tool_id)
);

-- 10. PROCEDURE RELATIONSHIPS (Cross-References)
CREATE TABLE wis_procedure_relationships (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    source_procedure_id UUID REFERENCES wis_procedures(id) ON DELETE CASCADE,
    target_procedure_id UUID REFERENCES wis_procedures(id) ON DELETE CASCADE,

    -- Relationship type
    relationship_type procedure_relationship_type NOT NULL,
    relationship_description TEXT,
    sequence_order INTEGER,                 -- For ordered relationships

    created_at TIMESTAMPTZ DEFAULT NOW(),

    UNIQUE(source_procedure_id, target_procedure_id, relationship_type)
);

-- 11. SERVICE BULLETINS TABLE
CREATE TABLE wis_service_bulletins (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Identification
    bulletin_number VARCHAR(50) NOT NULL UNIQUE, -- 'TB-2019-001'
    title VARCHAR(200) NOT NULL,

    -- Content
    description TEXT,
    content TEXT,
    pdf_url TEXT,

    -- Applicability
    applicable_models VARCHAR(20)[], -- ['U435', 'U400']
    applicable_systems VARCHAR(20)[], -- ['25', '01']
    effective_date DATE,

    -- Classification
    severity VARCHAR(20) DEFAULT 'info', -- 'info', 'important', 'critical', 'recall'
    category VARCHAR(50),               -- 'update', 'modification', 'recall', 'notice'

    -- Status
    status VARCHAR(20) DEFAULT 'active', -- 'active', 'superseded', 'withdrawn'
    supersedes_bulletin VARCHAR(50),

    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add search vector for bulletins
ALTER TABLE wis_service_bulletins ADD COLUMN search_vector TSVECTOR
    GENERATED ALWAYS AS (
        to_tsvector('english',
            bulletin_number || ' ' ||
            title || ' ' ||
            COALESCE(description, '')
        )
    ) STORED;

-- 12. BULLETIN-PROCEDURE RELATIONSHIPS
CREATE TABLE wis_bulletin_procedures (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    bulletin_id UUID REFERENCES wis_service_bulletins(id) ON DELETE CASCADE,
    procedure_id UUID REFERENCES wis_procedures(id) ON DELETE CASCADE,

    relationship_type VARCHAR(50) NOT NULL, -- 'updates', 'modifies', 'supersedes', 'affects'
    notes TEXT,

    created_at TIMESTAMPTZ DEFAULT NOW(),

    UNIQUE(bulletin_id, procedure_id)
);

-- 13. USER INTERACTIONS TABLE
CREATE TABLE wis_user_bookmarks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    procedure_id UUID REFERENCES wis_procedures(id) ON DELETE CASCADE,

    -- User data
    personal_notes TEXT,
    completion_notes TEXT,
    rating INTEGER CHECK (rating BETWEEN 1 AND 5),
    completed_at TIMESTAMPTZ,

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),

    UNIQUE(user_id, procedure_id)
);

-- INDEXES FOR PERFORMANCE
CREATE INDEX idx_wis_procedures_search ON wis_procedures USING GIN(search_vector);
CREATE INDEX idx_wis_bulletins_search ON wis_service_bulletins USING GIN(search_vector);
CREATE INDEX idx_wis_procedures_component ON wis_procedures(component_id);
CREATE INDEX idx_wis_procedure_steps_procedure ON wis_procedure_steps(procedure_id, step_number);
CREATE INDEX idx_wis_procedure_relationships_source ON wis_procedure_relationships(source_procedure_id);
CREATE INDEX idx_wis_procedure_relationships_target ON wis_procedure_relationships(target_procedure_id);
CREATE INDEX idx_wis_models_active ON wis_models(active, sort_order);
CREATE INDEX idx_wis_systems_model ON wis_systems(model_id, sort_order);
CREATE INDEX idx_wis_components_system ON wis_components(system_id, sort_order);

-- ROW LEVEL SECURITY
ALTER TABLE wis_models ENABLE ROW LEVEL SECURITY;
ALTER TABLE wis_systems ENABLE ROW LEVEL SECURITY;
ALTER TABLE wis_components ENABLE ROW LEVEL SECURITY;
ALTER TABLE wis_procedures ENABLE ROW LEVEL SECURITY;
ALTER TABLE wis_procedure_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE wis_parts ENABLE ROW LEVEL SECURITY;
ALTER TABLE wis_procedure_parts ENABLE ROW LEVEL SECURITY;
ALTER TABLE wis_tools ENABLE ROW LEVEL SECURITY;
ALTER TABLE wis_procedure_tools ENABLE ROW LEVEL SECURITY;
ALTER TABLE wis_procedure_relationships ENABLE ROW LEVEL SECURITY;
ALTER TABLE wis_service_bulletins ENABLE ROW LEVEL SECURITY;
ALTER TABLE wis_bulletin_procedures ENABLE ROW LEVEL SECURITY;
ALTER TABLE wis_user_bookmarks ENABLE ROW LEVEL SECURITY;

-- Basic read policies (can be refined based on subscription tiers)
CREATE POLICY "WIS content is viewable by authenticated users" ON wis_models FOR SELECT TO authenticated USING (active = true);
CREATE POLICY "WIS systems viewable by authenticated users" ON wis_systems FOR SELECT TO authenticated USING (true);
CREATE POLICY "WIS components viewable by authenticated users" ON wis_components FOR SELECT TO authenticated USING (true);
CREATE POLICY "WIS procedures viewable by authenticated users" ON wis_procedures FOR SELECT TO authenticated USING (status = 'active');
CREATE POLICY "WIS steps viewable by authenticated users" ON wis_procedure_steps FOR SELECT TO authenticated USING (true);
CREATE POLICY "WIS parts viewable by authenticated users" ON wis_parts FOR SELECT TO authenticated USING (true);
CREATE POLICY "WIS procedure parts viewable by authenticated users" ON wis_procedure_parts FOR SELECT TO authenticated USING (true);
CREATE POLICY "WIS tools viewable by authenticated users" ON wis_tools FOR SELECT TO authenticated USING (true);
CREATE POLICY "WIS procedure tools viewable by authenticated users" ON wis_procedure_tools FOR SELECT TO authenticated USING (true);
CREATE POLICY "WIS relationships viewable by authenticated users" ON wis_procedure_relationships FOR SELECT TO authenticated USING (true);
CREATE POLICY "WIS bulletins viewable by authenticated users" ON wis_service_bulletins FOR SELECT TO authenticated USING (status = 'active');
CREATE POLICY "WIS bulletin procedures viewable by authenticated users" ON wis_bulletin_procedures FOR SELECT TO authenticated USING (true);

-- User bookmarks policies
CREATE POLICY "Users can manage their own bookmarks" ON wis_user_bookmarks FOR ALL TO authenticated USING (auth.uid() = user_id);