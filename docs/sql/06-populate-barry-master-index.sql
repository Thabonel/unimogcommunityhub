-- Populate Barry's Master Index from existing WIS data
-- This transforms Barry into an intelligent librarian who knows the entire catalog

-- 1. Populate master index with parts data
INSERT INTO wis_master_index (
    content_type,
    content_id,
    title,
    category,
    subcategory,
    description,
    keywords,
    media_count,
    has_photos,
    has_diagrams,
    has_schematics
)
SELECT
    'part' as content_type,
    part_number as content_id,
    part_name as title,
    category,
    subcategory,
    description,
    ARRAY[part_number, REPLACE(part_name, ' ', '_')] as keywords,
    CASE
        WHEN media IS NOT NULL AND jsonb_array_length(media) > 0
        THEN jsonb_array_length(media)
        ELSE 0
    END as media_count,
    CASE
        WHEN media IS NOT NULL AND EXISTS(
            SELECT 1 FROM jsonb_array_elements(media) elem
            WHERE elem->>'type' = 'photo'
        ) THEN TRUE ELSE FALSE
    END as has_photos,
    CASE
        WHEN media IS NOT NULL AND EXISTS(
            SELECT 1 FROM jsonb_array_elements(media) elem
            WHERE elem->>'type' = 'diagram'
        ) THEN TRUE ELSE FALSE
    END as has_diagrams,
    CASE
        WHEN media IS NOT NULL AND EXISTS(
            SELECT 1 FROM jsonb_array_elements(media) elem
            WHERE elem->>'type' = 'schematic'
        ) THEN TRUE ELSE FALSE
    END as has_schematics
FROM wis_parts
ON CONFLICT (content_type, content_id) DO UPDATE SET
    title = EXCLUDED.title,
    category = EXCLUDED.category,
    subcategory = EXCLUDED.subcategory,
    description = EXCLUDED.description,
    keywords = EXCLUDED.keywords,
    media_count = EXCLUDED.media_count,
    has_photos = EXCLUDED.has_photos,
    has_diagrams = EXCLUDED.has_diagrams,
    has_schematics = EXCLUDED.has_schematics,
    updated_at = NOW();

-- 2. Populate master index with procedures data
INSERT INTO wis_master_index (
    content_type,
    content_id,
    title,
    category,
    subcategory,
    description,
    keywords,
    media_count,
    has_photos,
    has_diagrams,
    has_schematics
)
SELECT
    'procedure' as content_type,
    procedure_code as content_id,
    title,
    category,
    subcategory,
    description,
    ARRAY[procedure_code] || COALESCE(tools_required, ARRAY[]::TEXT[]) as keywords,
    CASE
        WHEN media IS NOT NULL AND jsonb_array_length(media) > 0
        THEN jsonb_array_length(media)
        ELSE 0
    END as media_count,
    CASE
        WHEN media IS NOT NULL AND EXISTS(
            SELECT 1 FROM jsonb_array_elements(media) elem
            WHERE elem->>'type' = 'photo'
        ) THEN TRUE ELSE FALSE
    END as has_photos,
    CASE
        WHEN media IS NOT NULL AND EXISTS(
            SELECT 1 FROM jsonb_array_elements(media) elem
            WHERE elem->>'type' = 'diagram'
        ) THEN TRUE ELSE FALSE
    END as has_diagrams,
    CASE
        WHEN media IS NOT NULL AND EXISTS(
            SELECT 1 FROM jsonb_array_elements(media) elem
            WHERE elem->>'type' = 'schematic'
        ) THEN TRUE ELSE FALSE
    END as has_schematics
FROM wis_procedures
ON CONFLICT (content_type, content_id) DO UPDATE SET
    title = EXCLUDED.title,
    category = EXCLUDED.category,
    subcategory = EXCLUDED.subcategory,
    description = EXCLUDED.description,
    keywords = EXCLUDED.keywords,
    media_count = EXCLUDED.media_count,
    has_photos = EXCLUDED.has_photos,
    has_diagrams = EXCLUDED.has_diagrams,
    has_schematics = EXCLUDED.has_schematics,
    updated_at = NOW();

-- 3. Populate master index with bulletins data
INSERT INTO wis_master_index (
    content_type,
    content_id,
    title,
    category,
    subcategory,
    description,
    keywords,
    media_count,
    has_photos,
    has_diagrams,
    has_schematics
)
SELECT
    'bulletin' as content_type,
    bulletin_number as content_id,
    title,
    category,
    NULL as subcategory,
    description,
    ARRAY[bulletin_number, severity] as keywords,
    CASE
        WHEN media IS NOT NULL AND jsonb_array_length(media) > 0
        THEN jsonb_array_length(media)
        ELSE 0
    END as media_count,
    CASE
        WHEN media IS NOT NULL AND EXISTS(
            SELECT 1 FROM jsonb_array_elements(media) elem
            WHERE elem->>'type' = 'photo'
        ) THEN TRUE ELSE FALSE
    END as has_photos,
    CASE
        WHEN media IS NOT NULL AND EXISTS(
            SELECT 1 FROM jsonb_array_elements(media) elem
            WHERE elem->>'type' = 'diagram'
        ) THEN TRUE ELSE FALSE
    END as has_diagrams,
    CASE
        WHEN media IS NOT NULL AND EXISTS(
            SELECT 1 FROM jsonb_array_elements(media) elem
            WHERE elem->>'type' = 'schematic'
        ) THEN TRUE ELSE FALSE
    END as has_schematics
FROM wis_bulletins
ON CONFLICT (content_type, content_id) DO UPDATE SET
    title = EXCLUDED.title,
    category = EXCLUDED.category,
    description = EXCLUDED.description,
    keywords = EXCLUDED.keywords,
    media_count = EXCLUDED.media_count,
    has_photos = EXCLUDED.has_photos,
    has_diagrams = EXCLUDED.has_diagrams,
    has_schematics = EXCLUDED.has_schematics,
    updated_at = NOW();

-- 4. Populate master index with chunks (searchable content)
INSERT INTO wis_master_index (
    content_type,
    content_id,
    title,
    category,
    subcategory,
    description,
    keywords,
    media_count,
    has_photos,
    has_diagrams,
    has_schematics
)
SELECT
    'chunk' as content_type,
    doc_id as content_id,
    title,
    doc_type as category,
    NULL as subcategory,
    LEFT(content, 500) as description,
    ARRAY[doc_id, ref] as keywords,
    CASE
        WHEN media IS NOT NULL AND jsonb_array_length(media) > 0
        THEN jsonb_array_length(media)
        ELSE 0
    END as media_count,
    CASE
        WHEN media IS NOT NULL AND EXISTS(
            SELECT 1 FROM jsonb_array_elements(media) elem
            WHERE elem->>'type' = 'photo'
        ) THEN TRUE ELSE FALSE
    END as has_photos,
    CASE
        WHEN media IS NOT NULL AND EXISTS(
            SELECT 1 FROM jsonb_array_elements(media) elem
            WHERE elem->>'type' = 'diagram'
        ) THEN TRUE ELSE FALSE
    END as has_diagrams,
    CASE
        WHEN media IS NOT NULL AND EXISTS(
            SELECT 1 FROM jsonb_array_elements(media) elem
            WHERE elem->>'type' = 'schematic'
        ) THEN TRUE ELSE FALSE
    END as has_schematics
FROM wis_chunks
WHERE doc_id IS NOT NULL
GROUP BY doc_id, title, doc_type, content, ref, media
ON CONFLICT (content_type, content_id) DO UPDATE SET
    title = EXCLUDED.title,
    category = EXCLUDED.category,
    description = EXCLUDED.description,
    keywords = EXCLUDED.keywords,
    media_count = EXCLUDED.media_count,
    has_photos = EXCLUDED.has_photos,
    has_diagrams = EXCLUDED.has_diagrams,
    has_schematics = EXCLUDED.has_schematics,
    updated_at = NOW();

-- 5. Populate media index from parts
INSERT INTO wis_media_index (
    content_type,
    content_id,
    media_type,
    bucket_name,
    file_path,
    file_name,
    description,
    context_tags,
    categories,
    view_priority
)
SELECT
    'part' as content_type,
    p.part_number as content_id,
    elem->>'type' as media_type,
    elem->>'bucket' as bucket_name,
    elem->>'file_name' as file_path,
    elem->>'file_name' as file_name,
    elem->>'description' as description,
    ARRAY[p.category, p.subcategory, p.part_number] as context_tags,
    ARRAY[p.category] as categories,
    CASE elem->>'type'
        WHEN 'photo' THEN 3
        WHEN 'diagram' THEN 2
        WHEN 'schematic' THEN 1
        ELSE 0
    END as view_priority
FROM wis_parts p,
     jsonb_array_elements(p.media) as elem
WHERE p.media IS NOT NULL AND jsonb_array_length(p.media) > 0
ON CONFLICT (bucket_name, file_path) DO UPDATE SET
    description = EXCLUDED.description,
    context_tags = EXCLUDED.context_tags,
    categories = EXCLUDED.categories,
    view_priority = EXCLUDED.view_priority;

-- 6. Populate media index from procedures
INSERT INTO wis_media_index (
    content_type,
    content_id,
    media_type,
    bucket_name,
    file_path,
    file_name,
    description,
    context_tags,
    categories,
    view_priority
)
SELECT
    'procedure' as content_type,
    p.procedure_code as content_id,
    elem->>'type' as media_type,
    elem->>'bucket' as bucket_name,
    elem->>'file_name' as file_path,
    elem->>'file_name' as file_name,
    elem->>'description' as description,
    ARRAY[p.category, p.subcategory, p.procedure_code] as context_tags,
    ARRAY[p.category] as categories,
    CASE elem->>'type'
        WHEN 'photo' THEN 3
        WHEN 'diagram' THEN 2
        WHEN 'schematic' THEN 1
        ELSE 0
    END as view_priority
FROM wis_procedures p,
     jsonb_array_elements(p.media) as elem
WHERE p.media IS NOT NULL AND jsonb_array_length(p.media) > 0
ON CONFLICT (bucket_name, file_path) DO UPDATE SET
    description = EXCLUDED.description,
    context_tags = EXCLUDED.context_tags,
    categories = EXCLUDED.categories,
    view_priority = EXCLUDED.view_priority;

-- 7. Populate media index from bulletins
INSERT INTO wis_media_index (
    content_type,
    content_id,
    media_type,
    bucket_name,
    file_path,
    file_name,
    description,
    context_tags,
    categories,
    view_priority
)
SELECT
    'bulletin' as content_type,
    b.bulletin_number as content_id,
    elem->>'type' as media_type,
    elem->>'bucket' as bucket_name,
    elem->>'file_name' as file_path,
    elem->>'file_name' as file_name,
    elem->>'description' as description,
    ARRAY[b.category, b.bulletin_number, b.severity] as context_tags,
    ARRAY[b.category] as categories,
    CASE elem->>'type'
        WHEN 'photo' THEN 3
        WHEN 'diagram' THEN 2
        WHEN 'schematic' THEN 1
        ELSE 0
    END as view_priority
FROM wis_bulletins b,
     jsonb_array_elements(b.media) as elem
WHERE b.media IS NOT NULL AND jsonb_array_length(b.media) > 0
ON CONFLICT (bucket_name, file_path) DO UPDATE SET
    description = EXCLUDED.description,
    context_tags = EXCLUDED.context_tags,
    categories = EXCLUDED.categories,
    view_priority = EXCLUDED.view_priority;

-- 8. Build basic content relationships
INSERT INTO wis_content_relationships (
    source_type,
    source_id,
    target_type,
    target_id,
    relationship_type,
    strength,
    notes
)
-- Parts used in procedures (from parts_required array)
SELECT
    'procedure' as source_type,
    p.procedure_code as source_id,
    'part' as target_type,
    part_num as target_id,
    'procedure_references_part' as relationship_type,
    0.8 as strength,
    'Part required for this procedure' as notes
FROM wis_procedures p,
     unnest(COALESCE(p.parts_required, ARRAY[]::TEXT[])) as part_num
WHERE part_num IS NOT NULL
ON CONFLICT (source_type, source_id, target_type, target_id, relationship_type) DO NOTHING;

-- Same category relationships (weaker connection)
INSERT INTO wis_content_relationships (
    source_type,
    source_id,
    target_type,
    target_id,
    relationship_type,
    strength,
    notes
)
SELECT DISTINCT
    p1.content_type as source_type,
    p1.content_id as source_id,
    p2.content_type as target_type,
    p2.content_id as target_id,
    'related_parts' as relationship_type,
    0.3 as strength,
    'Same category/subcategory' as notes
FROM wis_master_index p1
JOIN wis_master_index p2 ON p1.category = p2.category
    AND COALESCE(p1.subcategory, '') = COALESCE(p2.subcategory, '')
    AND p1.id != p2.id
    AND p1.content_type = 'part'
    AND p2.content_type = 'part'
LIMIT 1000
ON CONFLICT (source_type, source_id, target_type, target_id, relationship_type) DO NOTHING;

-- Summary of Barry's new catalog knowledge
SELECT
    'Barry Master Index Summary' as summary,
    (SELECT COUNT(*) FROM wis_master_index WHERE content_type = 'part') as parts_cataloged,
    (SELECT COUNT(*) FROM wis_master_index WHERE content_type = 'procedure') as procedures_cataloged,
    (SELECT COUNT(*) FROM wis_master_index WHERE content_type = 'bulletin') as bulletins_cataloged,
    (SELECT COUNT(*) FROM wis_master_index WHERE content_type = 'chunk') as chunks_cataloged,
    (SELECT COUNT(*) FROM wis_media_index) as media_items_indexed,
    (SELECT COUNT(*) FROM wis_content_relationships) as relationships_mapped,
    (SELECT COUNT(DISTINCT category) FROM wis_master_index) as total_categories;