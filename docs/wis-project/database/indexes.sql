-- WIS Performance Indexes
-- Run this after schema.sql to ensure optimal performance

-- Full-text search indexes (GIN indexes for fast search)
CREATE INDEX IF NOT EXISTS idx_wis_procedures_search ON wis_procedures USING GIN(search_vector);
CREATE INDEX IF NOT EXISTS idx_wis_bulletins_search ON wis_service_bulletins USING GIN(search_vector);

-- Hierarchical navigation indexes
CREATE INDEX IF NOT EXISTS idx_wis_procedures_component ON wis_procedures(component_id);
CREATE INDEX IF NOT EXISTS idx_wis_procedure_steps_procedure ON wis_procedure_steps(procedure_id, step_number);
CREATE INDEX IF NOT EXISTS idx_wis_models_active ON wis_models(active, sort_order);
CREATE INDEX IF NOT EXISTS idx_wis_systems_model ON wis_systems(model_id, sort_order);
CREATE INDEX IF NOT EXISTS idx_wis_components_system ON wis_components(system_id, sort_order);

-- Relationship indexes for cross-references
CREATE INDEX IF NOT EXISTS idx_wis_procedure_relationships_source ON wis_procedure_relationships(source_procedure_id);
CREATE INDEX IF NOT EXISTS idx_wis_procedure_relationships_target ON wis_procedure_relationships(target_procedure_id);

-- Parts and tools lookup indexes
CREATE INDEX IF NOT EXISTS idx_wis_procedure_parts_procedure ON wis_procedure_parts(procedure_id);
CREATE INDEX IF NOT EXISTS idx_wis_procedure_parts_part ON wis_procedure_parts(part_id);
CREATE INDEX IF NOT EXISTS idx_wis_procedure_tools_procedure ON wis_procedure_tools(procedure_id);
CREATE INDEX IF NOT EXISTS idx_wis_procedure_tools_tool ON wis_procedure_tools(tool_id);

-- User interaction indexes
CREATE INDEX IF NOT EXISTS idx_wis_user_bookmarks_user ON wis_user_bookmarks(user_id);
CREATE INDEX IF NOT EXISTS idx_wis_user_bookmarks_procedure ON wis_user_bookmarks(procedure_id);

-- Bulletin relationship indexes
CREATE INDEX IF NOT EXISTS idx_wis_bulletin_procedures_bulletin ON wis_bulletin_procedures(bulletin_id);
CREATE INDEX IF NOT EXISTS idx_wis_bulletin_procedures_procedure ON wis_bulletin_procedures(procedure_id);

-- Composite indexes for common queries
CREATE INDEX IF NOT EXISTS idx_wis_procedures_status_active ON wis_procedures(status) WHERE status = 'active';
CREATE INDEX IF NOT EXISTS idx_wis_parts_status_available ON wis_parts(status) WHERE status = 'available';

-- Performance monitoring
-- Check index usage with: SELECT * FROM pg_stat_user_indexes WHERE schemaname = 'public' AND relname LIKE 'wis_%';