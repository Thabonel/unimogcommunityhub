BEGIN;

ALTER TABLE donations ADD COLUMN IF NOT EXISTS donor_email TEXT;

COMMENT ON COLUMN donations.donor_email IS 'Email address for receipt, collected during checkout for anonymous donors';

COMMIT;
