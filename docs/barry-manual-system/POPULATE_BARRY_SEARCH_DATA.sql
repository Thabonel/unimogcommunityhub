-- Barry Search Data Population
-- Populates normalized search columns and aliases
-- Run this after ENHANCE_BARRY_SEARCH_SCHEMA.sql

-- Populate u435_manual_index with normalized data and aliases
UPDATE u435_manual_index
SET
    norm_term = normalize_search_text(term),
    search_fts = to_tsvector('english', term || ' ' || COALESCE(chapter_filename, '')),
    system_category = CASE
        WHEN term ILIKE '%engine%' OR term ILIKE '%motor%' OR term ILIKE '%om366%' THEN 'engine'
        WHEN term ILIKE '%transmission%' OR term ILIKE '%gearbox%' OR term ILIKE '%clutch%' THEN 'transmission'
        WHEN term ILIKE '%brake%' OR term ILIKE '%pneumatic%' OR term ILIKE '%hydraulic%' THEN 'brakes'
        WHEN term ILIKE '%steering%' OR term ILIKE '%power steering%' OR term ILIKE '%wheel%' THEN 'steering'
        WHEN term ILIKE '%suspension%' OR term ILIKE '%shock%' OR term ILIKE '%spring%' THEN 'suspension'
        WHEN term ILIKE '%axle%' OR term ILIKE '%differential%' OR term ILIKE '%portal%' THEN 'axles'
        WHEN term ILIKE '%electrical%' OR term ILIKE '%wiring%' OR term ILIKE '%battery%' THEN 'electrical'
        WHEN term ILIKE '%cooling%' OR term ILIKE '%radiator%' OR term ILIKE '%coolant%' THEN 'cooling'
        WHEN term ILIKE '%fuel%' OR term ILIKE '%injector%' OR term ILIKE '%filter%' THEN 'fuel'
        WHEN term ILIKE '%lubrication%' OR term ILIKE '%oil%' OR term ILIKE '%grease%' THEN 'lubrication'
        WHEN term ILIKE '%pto%' OR term ILIKE '%power take%' OR term ILIKE '%implement%' THEN 'pto'
        WHEN term ILIKE '%frame%' OR term ILIKE '%body%' OR term ILIKE '%cab%' THEN 'body'
        ELSE 'general'
    END,
    search_priority = CASE
        WHEN term ILIKE '%compressor%' OR term ILIKE '%brake%' OR term ILIKE '%steering%' THEN 90
        WHEN term ILIKE '%engine%' OR term ILIKE '%transmission%' OR term ILIKE '%axle%' THEN 80
        WHEN term ILIKE '%electrical%' OR term ILIKE '%cooling%' OR term ILIKE '%fuel%' THEN 70
        ELSE 50
    END,
    has_safety_warning = CASE
        WHEN term ILIKE '%brake%' OR term ILIKE '%steering%' OR term ILIKE '%pressure%'
             OR term ILIKE '%electrical%' OR term ILIKE '%fuel%' OR term ILIKE '%hydraulic%' THEN true
        ELSE false
    END;

-- Add comprehensive aliases for key terms
UPDATE u435_manual_index
SET aliases = CASE term
    -- Air compressor aliases
    WHEN 'air compressor' THEN ARRAY['compressor', 'air pump', 'pneumatic compressor', 'brake compressor']
    WHEN 'air brake compressor' THEN ARRAY['brake compressor', 'air compressor', 'pneumatic compressor']

    -- Engine aliases
    WHEN 'engine lubrication' THEN ARRAY['oil system', 'lubrication system', 'engine oil', 'oil pump']
    WHEN 'cooling system' THEN ARRAY['radiator', 'coolant', 'cooling', 'thermostat', 'water pump']
    WHEN 'fuel system' THEN ARRAY['fuel pump', 'fuel filter', 'injectors', 'fuel lines']

    -- Transmission aliases
    WHEN 'transmission' THEN ARRAY['gearbox', 'gear box', 'manual transmission', 'trans']
    WHEN 'clutch' THEN ARRAY['clutch system', 'clutch disc', 'clutch plate', 'clutch adjustment']

    -- Axle and differential aliases
    WHEN 'front differential' THEN ARRAY['front diff', 'front axle differential', 'diff lock front']
    WHEN 'rear differential' THEN ARRAY['rear diff', 'rear axle differential', 'diff lock rear']
    WHEN 'portal axle' THEN ARRAY['portal hub', 'wheel hub', 'hub drive', 'portal drive']

    -- Brake system aliases
    WHEN 'service brakes' THEN ARRAY['foot brakes', 'main brakes', 'brake system', 'hydraulic brakes']
    WHEN 'parking brake' THEN ARRAY['hand brake', 'emergency brake', 'park brake']
    WHEN 'brake pedal' THEN ARRAY['brake pedal linkage', 'pedal', 'brake control']

    -- Steering aliases
    WHEN 'power steering' THEN ARRAY['steering', 'steering pump', 'steering box', 'hydraulic steering']
    WHEN 'steering' THEN ARRAY['steering wheel', 'steering column', 'steering linkage']

    -- Suspension aliases
    WHEN 'front suspension' THEN ARRAY['front springs', 'front shocks', 'suspension front']
    WHEN 'rear suspension' THEN ARRAY['rear springs', 'rear shocks', 'suspension rear']

    -- Electrical aliases
    WHEN 'electrical system' THEN ARRAY['wiring', 'electrical', 'harness', 'electrical harness']
    WHEN 'battery' THEN ARRAY['batteries', 'electrical power', 'charging system']

    -- General maintenance aliases
    WHEN 'oil filter' THEN ARRAY['filter', 'oil change', 'lubrication filter']
    WHEN 'air filter' THEN ARRAY['filter', 'air cleaner', 'intake filter']
    WHEN 'fuel filter' THEN ARRAY['filter', 'fuel system filter']

    ELSE ARRAY[]::text[]
END
WHERE aliases IS NULL;

-- Populate barry_knowledge_base normalized data (if any entries exist)
UPDATE barry_knowledge_base
SET
    norm_keywords = ARRAY(
        SELECT DISTINCT normalize_search_text(unnest(question_keywords))
        WHERE question_keywords IS NOT NULL
    ),
    search_fts = to_tsvector('english',
        COALESCE(barry_response_template, '') || ' ' ||
        array_to_string(COALESCE(question_keywords, ARRAY[]::text[]), ' ')
    ),
    search_priority = CASE
        WHEN 'air compressor' = ANY(question_keywords) OR 'compressor' = ANY(question_keywords) THEN 100
        WHEN 'brake' = ANY(question_keywords) OR 'steering' = ANY(question_keywords) THEN 95
        WHEN 'engine' = ANY(question_keywords) OR 'transmission' = ANY(question_keywords) THEN 90
        ELSE 80
    END
WHERE barry_response_template IS NOT NULL;

-- Create sample curated knowledge entries for testing
INSERT INTO barry_knowledge_base (question_keywords, barry_response_template, manual_references, search_priority, aliases)
VALUES
    (
        ARRAY['air compressor', 'compressor replacement', 'pneumatic system'],
        'Classic pneumatic system maintenance. The air compressor is the heart of your brake system—when it goes, you know it.',
        '{"section": "Pneumatic Brakes", "pdf": "43_Brakes_Pneumatic.pdf", "pages": [10, 11, 12]}',
        100,
        ARRAY['air pump', 'brake compressor', 'pneumatic compressor']
    ),
    (
        ARRAY['differential lock', 'diff lock', 'differential'],
        'Diff lock issues usually trace back to the control valve or air lines. Don''t force it—diagnose first.',
        '{"section": "Axle Systems", "pdf": "33_Front_Axle.pdf", "pages": [15, 16]}',
        95,
        ARRAY['diff', 'locking differential', 'front diff', 'rear diff']
    ),
    (
        ARRAY['portal hub', 'hub seal', 'wheel hub'],
        'Portal hub maintenance is critical—these take a beating. Seal replacement is routine but precision work.',
        '{"section": "Wheel Hubs", "pdf": "U435_19_Wheel_Hub_Front.pdf", "pages": [8, 9, 10]}',
        90,
        ARRAY['portal axle', 'wheel hub drive', 'hub seals', 'hub assembly']
    );

-- Verify data population
SELECT
    'Data population complete' as status,
    COUNT(*) as total_manual_entries,
    COUNT(*) FILTER (WHERE norm_term IS NOT NULL) as normalized_entries,
    COUNT(*) FILTER (WHERE aliases IS NOT NULL AND array_length(aliases, 1) > 0) as entries_with_aliases,
    COUNT(DISTINCT system_category) as system_categories
FROM u435_manual_index;

-- Show sample of populated data
SELECT
    term,
    norm_term,
    system_category,
    search_priority,
    aliases[1:3] as sample_aliases,
    has_safety_warning
FROM u435_manual_index
WHERE term ILIKE '%compressor%' OR term ILIKE '%brake%' OR term ILIKE '%steering%'
ORDER BY search_priority DESC, term
LIMIT 10;