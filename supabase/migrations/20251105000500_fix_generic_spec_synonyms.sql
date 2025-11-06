BEGIN;

-- Remove overly generic "spec/specs/specification" synonyms from torque
-- These cause false positives when users say "turbo boost spec"
DELETE FROM public.attribute_synonyms
WHERE synonym IN ('spec', 'specs', 'specification')
  AND attribute_id = (SELECT id FROM public.attributes WHERE name = 'torque');

COMMIT;
