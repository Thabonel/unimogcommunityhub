-- Barry Personality Templates
-- Implements gruff mechanic personality system
-- Run this after BARRY_SEARCH_FUNCTIONS.sql

-- Populate Barry personality templates for consistent character
INSERT INTO barry_personality_templates (template_type, system_category, template_text, usage_weight, is_active)
VALUES
    -- Assessment Templates (Gruff Technical Analysis)
    ('assessment', 'engine', 'Listen here - that''s a classic OM366 issue I''ve seen a hundred times. In my 40 years under the hood, this always traces back to...', 100, true),
    ('assessment', 'transmission', 'Right, transmission trouble. Been working on these gearboxes since before you were born. Nine times out of ten, it''s...', 100, true),
    ('assessment', 'brakes', 'Brake problems, eh? Don''t mess around with stopping power - learned that the hard way back in ''85. What you''ve got here is...', 100, true),
    ('assessment', 'steering', 'Power steering acting up? Classic U435 hydraulic issue. I''ve rebuilt more steering boxes than I care to count...', 100, true),
    ('assessment', 'axles', 'Portal axle problems - welcome to Unimog ownership, kid. These things are bulletproof but when they go wrong...', 100, true),
    ('assessment', 'electrical', 'Electrical gremlins, the bane of every mechanic''s existence. 40 years and I still hate chasing wires...', 100, true),
    ('assessment', 'cooling', 'Overheating issues? In a Unimog? Must be something serious because these things run cool even in Death Valley...', 100, true),
    ('assessment', 'fuel', 'Fuel system problems are usually simple - dirty filter, clogged line, or that injection pump acting up again...', 100, true),
    ('assessment', 'general', 'Alright, let me guess what''s going on here. In four decades of Unimog work, I''ve seen this pattern before...', 100, true),

    -- Pointer Templates (Manual References)
    ('pointer', 'engine', 'Check Section 21 in your manual - that''s where Mercedes hid all the good engine diagnostics. Page numbers are in your canvas.', 90, true),
    ('pointer', 'transmission', 'Your transmission manual is Section 23. Don''t skip the preliminary checks or you''ll be back here next week.', 90, true),
    ('pointer', 'brakes', 'Brake procedures are in Section 43 - and for the love of all that''s holy, follow the bleeding sequence exactly.', 90, true),
    ('pointer', 'steering', 'Steering system''s covered in Section 46. Pay attention to the torque specs - these aren''t suggestions.', 90, true),
    ('pointer', 'axles', 'Portal axle work is serious business - check Sections 33 and 35. Take your time and do it right.', 90, true),
    ('pointer', 'electrical', 'Wiring diagrams are scattered through Section 32. Good luck - even Mercedes engineers get lost in there.', 90, true),
    ('pointer', 'general', 'Manual''s got what you need - check the canvas for exact pages. Don''t wing it on a machine worth more than most cars.', 90, true),

    -- Safety Templates (Critical Warnings)
    ('safety', 'brakes', 'STOP. Before you touch anything brake-related, depressurize the system completely. I''ve seen too many accidents.', 100, true),
    ('safety', 'steering', 'Warning: Never work on steering with the engine running. Hydraulic pressure will take your finger off.', 100, true),
    ('safety', 'axles', 'Portal hub work requires proper support - these axles weigh more than a small car. Don''t trust a floor jack.', 100, true),
    ('safety', 'electrical', 'Disconnect the battery first, both terminals. 24-volt systems bite harder than 12-volt ones.', 100, true),
    ('safety', 'engine', 'Engine work means hot parts and pressurized systems. Let it cool down and depressurize before starting.', 100, true),
    ('safety', 'fuel', 'Fuel system work is fire hazard work. No smoking, no sparks, proper ventilation. Period.', 100, true),
    ('safety', 'general', 'Safety first, kid. These machines don''t forgive mistakes and I''ve got the scars to prove it.', 95, true),

    -- Barry-isms (Character Phrases)
    ('barryism', NULL, 'That''s what 40 years of busted knuckles teaches you.', 80, true),
    ('barryism', NULL, 'Back in my day, we didn''t have all these fancy diagnostic tools - just good sense and dirty hands.', 80, true),
    ('barryism', NULL, 'Mercedes built these things like tanks. When something breaks, it''s usually because someone didn''t follow the manual.', 80, true),
    ('barryism', NULL, 'I''ve seen this problem more times than I''ve had hot dinners.', 70, true),
    ('barryism', NULL, 'Trust me, I''ve made every mistake in the book so you don''t have to.', 75, true),
    ('barryism', NULL, 'These Unimogs will outlast us all if you treat them right.', 70, true),
    ('barryism', NULL, 'Don''t take shortcuts - I learned that lesson the expensive way.', 85, true),
    ('barryism', NULL, 'When in doubt, check the manual. When still in doubt, check it again.', 75, true),
    ('barryism', NULL, 'German engineering at its finest - complicated but bulletproof when done right.', 70, true),
    ('barryism', NULL, 'Measure twice, wrench once. Saved me more comebacks than I can count.', 80, true);

-- Create helper function to get random Barry personality element
CREATE OR REPLACE FUNCTION get_barry_personality(
    template_type_param text,
    system_category_param text DEFAULT NULL
)
RETURNS text AS $$
DECLARE
    selected_template text;
BEGIN
    SELECT template_text
    INTO selected_template
    FROM barry_personality_templates
    WHERE template_type = template_type_param
    AND (system_category_param IS NULL OR system_category = system_category_param OR system_category IS NULL)
    AND is_active = true
    ORDER BY
        CASE WHEN system_category = system_category_param THEN usage_weight ELSE usage_weight * 0.8 END DESC,
        random()
    LIMIT 1;

    RETURN COALESCE(selected_template, 'Been working on these machines for 40 years - let me see what I can find for you.');
END;
$$ LANGUAGE plpgsql;

-- Create Barry response builder function
CREATE OR REPLACE FUNCTION build_barry_response(
    user_query text,
    system_category_param text DEFAULT 'general',
    manual_reference jsonb DEFAULT NULL,
    include_safety boolean DEFAULT false
)
RETURNS text AS $$
DECLARE
    assessment_text text;
    pointer_text text;
    safety_text text;
    barryism_text text;
    full_response text;
BEGIN
    -- Get assessment based on system category
    assessment_text := get_barry_personality('assessment', system_category_param);

    -- Get pointer if manual reference exists
    IF manual_reference IS NOT NULL THEN
        pointer_text := get_barry_personality('pointer', system_category_param);
    END IF;

    -- Get safety warning for critical systems
    IF include_safety OR system_category_param IN ('brakes', 'steering', 'axles', 'electrical', 'fuel') THEN
        safety_text := get_barry_personality('safety', system_category_param);
    END IF;

    -- Get random Barry-ism for character
    barryism_text := get_barry_personality('barryism');

    -- Build response
    full_response := assessment_text;

    IF pointer_text IS NOT NULL THEN
        full_response := full_response || E'\n\n' || pointer_text;
    END IF;

    IF safety_text IS NOT NULL THEN
        full_response := full_response || E'\n\n⚠️ ' || safety_text;
    END IF;

    IF barryism_text IS NOT NULL THEN
        full_response := full_response || E'\n\n' || barryism_text;
    END IF;

    RETURN full_response;
END;
$$ LANGUAGE plpgsql;

-- Enhanced search pipeline with Barry personality
CREATE OR REPLACE FUNCTION barry_search_with_personality(
    user_query text,
    user_id_param uuid DEFAULT NULL
)
RETURNS TABLE (
    search_stage text,
    result_count int,
    results jsonb,
    suggestions jsonb,
    barry_response text,
    response_time_ms int
) AS $$
DECLARE
    start_time timestamp;
    end_time timestamp;
    pipeline_results RECORD;
    system_category_detected text;
    include_safety boolean;
    barry_personality_response text;
BEGIN
    start_time := clock_timestamp();

    -- Get search results from main pipeline
    SELECT * INTO pipeline_results
    FROM barry_search_pipeline(user_query, user_id_param);

    -- Detect system category from query
    system_category_detected := CASE
        WHEN user_query ILIKE '%engine%' OR user_query ILIKE '%motor%' OR user_query ILIKE '%om366%' THEN 'engine'
        WHEN user_query ILIKE '%transmission%' OR user_query ILIKE '%gearbox%' OR user_query ILIKE '%clutch%' THEN 'transmission'
        WHEN user_query ILIKE '%brake%' OR user_query ILIKE '%pneumatic%' OR user_query ILIKE '%hydraulic%' THEN 'brakes'
        WHEN user_query ILIKE '%steering%' OR user_query ILIKE '%power steering%' THEN 'steering'
        WHEN user_query ILIKE '%axle%' OR user_query ILIKE '%differential%' OR user_query ILIKE '%portal%' THEN 'axles'
        WHEN user_query ILIKE '%electrical%' OR user_query ILIKE '%wiring%' OR user_query ILIKE '%battery%' THEN 'electrical'
        WHEN user_query ILIKE '%cooling%' OR user_query ILIKE '%radiator%' OR user_query ILIKE '%coolant%' THEN 'cooling'
        WHEN user_query ILIKE '%fuel%' OR user_query ILIKE '%injector%' OR user_query ILIKE '%filter%' THEN 'fuel'
        ELSE 'general'
    END;

    -- Check if safety warning needed
    include_safety := user_query ILIKE '%replace%' OR user_query ILIKE '%repair%' OR user_query ILIKE '%fix%'
                     OR user_query ILIKE '%install%' OR user_query ILIKE '%remove%';

    -- Build Barry personality response
    barry_personality_response := build_barry_response(
        user_query,
        system_category_detected,
        pipeline_results.results,
        include_safety
    );

    end_time := clock_timestamp();

    -- Return enhanced results with personality
    RETURN QUERY
    SELECT
        pipeline_results.search_stage,
        pipeline_results.result_count,
        pipeline_results.results,
        pipeline_results.suggestions,
        barry_personality_response,
        EXTRACT(milliseconds FROM (end_time - start_time))::int as response_time_ms;
END;
$$ LANGUAGE plpgsql;

-- Verify personality system
SELECT 'Barry personality system created successfully' as status;

-- Test personality system with air compressor query
SELECT
    search_stage,
    result_count,
    length(barry_response) as response_length,
    response_time_ms
FROM barry_search_with_personality('air compressor replacement');

-- Test personality elements
SELECT
    template_type,
    system_category,
    substr(template_text, 1, 50) || '...' as sample_text,
    usage_weight
FROM barry_personality_templates
WHERE template_type IN ('assessment', 'safety')
ORDER BY template_type, system_category NULLS LAST, usage_weight DESC
LIMIT 10;