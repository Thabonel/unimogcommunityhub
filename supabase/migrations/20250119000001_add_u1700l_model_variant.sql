-- Add U1700L model variant for Australian military Unimog
-- This model is very similar to U435 and will use the same systems data

INSERT INTO wis_models (id, model_code, model_name, description, year_range, active, sort_order)
VALUES (
  gen_random_uuid(),
  'U1700L',
  'Unimog U1700L (Australian Military)',
  'Australian military variant of U435, very similar specifications and uses the same technical systems',
  '1975-1991',
  true,
  2
);

-- Get the U435 model ID for reference
DO $$
DECLARE
    u435_model_id uuid;
    u1700l_model_id uuid;
    system_record RECORD;
    component_record RECORD;
    procedure_record RECORD;
BEGIN
    -- Get U435 model ID
    SELECT id INTO u435_model_id FROM wis_models WHERE model_code = 'U435';

    -- Get U1700L model ID
    SELECT id INTO u1700l_model_id FROM wis_models WHERE model_code = 'U1700L';

    -- Copy all systems from U435 to U1700L
    FOR system_record IN
        SELECT * FROM wis_systems WHERE model_id = u435_model_id
    LOOP
        INSERT INTO wis_systems (id, model_id, system_code, system_name, description, sort_order, active)
        VALUES (
            gen_random_uuid(),
            u1700l_model_id,
            system_record.system_code,
            system_record.system_name,
            system_record.description,
            system_record.sort_order,
            system_record.active
        );

        -- For each system, copy components
        FOR component_record IN
            SELECT * FROM wis_components WHERE system_id = system_record.id
        LOOP
            INSERT INTO wis_components (id, system_id, component_code, component_name, description, sort_order, active)
            SELECT
                gen_random_uuid(),
                (SELECT id FROM wis_systems WHERE model_id = u1700l_model_id AND system_code = system_record.system_code),
                component_record.component_code,
                component_record.component_name,
                component_record.description,
                component_record.sort_order,
                component_record.active;

            -- For each component, copy procedures
            FOR procedure_record IN
                SELECT * FROM wis_procedures WHERE component_id = component_record.id
            LOOP
                INSERT INTO wis_procedures (id, component_id, procedure_code, procedure_title, procedure_number, difficulty_level, estimated_time, description, sort_order, active)
                SELECT
                    gen_random_uuid(),
                    (SELECT c.id FROM wis_components c
                     JOIN wis_systems s ON c.system_id = s.id
                     WHERE s.model_id = u1700l_model_id
                     AND s.system_code = system_record.system_code
                     AND c.component_code = component_record.component_code),
                    procedure_record.procedure_code,
                    procedure_record.procedure_title,
                    procedure_record.procedure_number,
                    procedure_record.difficulty_level,
                    procedure_record.estimated_time,
                    procedure_record.description,
                    procedure_record.sort_order,
                    procedure_record.active;
            END LOOP;
        END LOOP;
    END LOOP;

    RAISE NOTICE 'Successfully created U1700L model variant with copied systems data from U435';
END $$;