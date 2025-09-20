ALTER TABLE wis_models ADD COLUMN alias_of UUID REFERENCES wis_models(id);

UPDATE wis_models
SET alias_of = (SELECT id FROM wis_models WHERE model_code = 'U435')
WHERE model_code = 'U1700L';