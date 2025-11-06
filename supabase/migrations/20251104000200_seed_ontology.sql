-- Seed initial components, attributes, and synonyms for capability-driven routing
-- Date: 2025-11-04

BEGIN;

-- Seed inside a guarded block to avoid errors if base tables are missing
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='components')
     OR NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='attributes') THEN
    RAISE NOTICE 'Ontology tables not found; run 20251104000100_add_ontology_and_properties.sql first. Seed skipped.';
  ELSE

-- Components
-- Only proceed if guard passed
    INSERT INTO public.components (name, system)
VALUES
  ('turbocharger', 'engine'),
  ('portal hub', 'chassis'),
  ('portal axle', 'chassis'),
  ('differential', 'chassis'),
  ('pto driveline', 'transmission'),
  ('clutch', 'transmission'),
  ('brake', 'brake system'),
  ('steering gearbox', 'steering'),
  ('air filter housing', 'engine'),
  ('fuel injection pump', 'engine'),
  ('wastegate', 'engine'),
  ('compressor housing', 'engine'),
  ('intake manifold', 'engine'),
  ('exhaust manifold', 'engine'),
  ('oil cooler', 'cooling'),
  ('radiator', 'cooling'),
  ('water pump', 'cooling')
    ON CONFLICT (name) DO NOTHING;

-- Component synonyms
    WITH c AS (
      SELECT id, name FROM public.components
    )
    INSERT INTO public.component_synonyms (component_id, synonym, confidence)
    VALUES
      ((SELECT id FROM c WHERE name='turbocharger'), 'turbo', 0.9),
      ((SELECT id FROM c WHERE name='turbocharger'), 'turbo charger', 0.9),
      ((SELECT id FROM c WHERE name='turbocharger'), 'turbolader', 0.9),
      ((SELECT id FROM c WHERE name='portal hub'), 'wheel hub', 0.8),
      ((SELECT id FROM c WHERE name='portal hub'), 'hub', 0.8),
      ((SELECT id FROM c WHERE name='portal axle'), 'portalachse', 0.8),
      ((SELECT id FROM c WHERE name='portal axle'), 'portal', 0.7),
      ((SELECT id FROM c WHERE name='differential'), 'diff', 0.9),
      ((SELECT id FROM c WHERE name='differential'), 'rear axle', 0.6),
      ((SELECT id FROM c WHERE name='differential'), 'front axle', 0.6),
      ((SELECT id FROM c WHERE name='pto driveline'), 'pto', 0.9),
      ((SELECT id FROM c WHERE name='pto driveline'), 'power take off', 0.8),
      ((SELECT id FROM c WHERE name='steering gearbox'), 'steering box', 0.8),
      ((SELECT id FROM c WHERE name='steering gearbox'), 'steering', 0.7),
      ((SELECT id FROM c WHERE name='air filter housing'), 'air filter', 0.9),
      ((SELECT id FROM c WHERE name='air filter housing'), 'filter housing', 0.8),
      ((SELECT id FROM c WHERE name='fuel injection pump'), 'injection pump', 0.9),
      ((SELECT id FROM c WHERE name='fuel injection pump'), 'fuel pump', 0.8),
      ((SELECT id FROM c WHERE name='wastegate'), 'waste gate', 0.9),
      ((SELECT id FROM c WHERE name='compressor housing'), 'compressor', 0.8),
      ((SELECT id FROM c WHERE name='intake manifold'), 'intake', 0.7),
      ((SELECT id FROM c WHERE name='exhaust manifold'), 'exhaust', 0.7),
      ((SELECT id FROM c WHERE name='oil cooler'), 'cooler', 0.6),
      ((SELECT id FROM c WHERE name='radiator'), 'kühler', 0.9),
      ((SELECT id FROM c WHERE name='water pump'), 'coolant pump', 0.8)
    ON CONFLICT DO NOTHING;

-- Attributes
    INSERT INTO public.attributes (name, unit_hint)
VALUES
  ('boost pressure', 'bar'),
  ('torque', 'Nm'),
  ('clearance', 'mm'),
  ('capacity', 'L'),
  ('preload', 'Nm'),
  ('idle speed', 'rpm'),
  ('fuel pressure', 'bar'),
  ('charging pressure', 'bar'),
  ('oil pressure', 'bar'),
  ('temperature', '°C'),
  ('voltage', 'V'),
  ('current', 'A'),
  ('resistance', 'Ω'),
  ('weight', 'kg'),
  ('length', 'mm'),
  ('width', 'mm'),
  ('height', 'mm'),
  ('diameter', 'mm')
    ON CONFLICT (name) DO NOTHING;

-- Attribute synonyms
    WITH a AS (
      SELECT id, name FROM public.attributes
    )
    INSERT INTO public.attribute_synonyms (attribute_id, synonym, confidence)
    VALUES
      ((SELECT id FROM a WHERE name='boost pressure'), 'boost', 0.9),
      ((SELECT id FROM a WHERE name='boost pressure'), 'pressure', 0.8),
      ((SELECT id FROM a WHERE name='boost pressure'), 'ladedruck', 0.9),
      ((SELECT id FROM a WHERE name='torque'), 'tightening torque', 0.9),
      ((SELECT id FROM a WHERE name='torque'), 'spec', 0.5),
      ((SELECT id FROM a WHERE name='torque'), 'specs', 0.5),
      ((SELECT id FROM a WHERE name='torque'), 'specification', 0.5),
      ((SELECT id FROM a WHERE name='torque'), 'anzugsdrehmoment', 0.9),
      ((SELECT id FROM a WHERE name='clearance'), 'gap', 0.7),
      ((SELECT id FROM a WHERE name='clearance'), 'play', 0.7),
      ((SELECT id FROM a WHERE name='clearance'), 'spiel', 0.8),
      ((SELECT id FROM a WHERE name='capacity'), 'oil capacity', 0.9),
      ((SELECT id FROM a WHERE name='capacity'), 'fill quantity', 0.8),
      ((SELECT id FROM a WHERE name='capacity'), 'volume', 0.7),
      ((SELECT id FROM a WHERE name='capacity'), 'füllmenge', 0.8),
      ((SELECT id FROM a WHERE name='preload'), 'bearing preload', 0.9),
      ((SELECT id FROM a WHERE name='preload'), 'axial play', 0.7),
      ((SELECT id FROM a WHERE name='idle speed'), 'rpm', 0.7),
      ((SELECT id FROM a WHERE name='idle speed'), 'leerlaufdrehzahl', 0.9),
      ((SELECT id FROM a WHERE name='fuel pressure'), 'injection pressure', 0.8),
      ((SELECT id FROM a WHERE name='charging pressure'), 'charge pressure', 0.9),
      ((SELECT id FROM a WHERE name='charging pressure'), 'ladedruck', 0.9),
      ((SELECT id FROM a WHERE name='oil pressure'), 'öldruck', 0.9),
      ((SELECT id FROM a WHERE name='temperature'), 'temp', 0.8),
      ((SELECT id FROM a WHERE name='temperature'), 'temperatur', 0.9),
      ((SELECT id FROM a WHERE name='voltage'), 'spannung', 0.9),
      ((SELECT id FROM a WHERE name='current'), 'amperage', 0.8),
      ((SELECT id FROM a WHERE name='current'), 'strom', 0.9),
      ((SELECT id FROM a WHERE name='resistance'), 'widerstand', 0.9),
      ((SELECT id FROM a WHERE name='weight'), 'mass', 0.8),
      ((SELECT id FROM a WHERE name='weight'), 'gewicht', 0.9),
      ((SELECT id FROM a WHERE name='diameter'), 'durchmesser', 0.9)
    ON CONFLICT DO NOTHING;

  END IF;
END$$;

COMMIT;
