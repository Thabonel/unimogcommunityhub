-- Add missing address and currency fields to profiles table
-- These fields are needed for the address tab in user profiles

DO $$ 
BEGIN
  -- Add street_address column if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_schema = 'public' 
                 AND table_name = 'profiles' 
                 AND column_name = 'street_address') THEN
    ALTER TABLE profiles ADD COLUMN street_address TEXT;
  END IF;

  -- Add city column if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_schema = 'public' 
                 AND table_name = 'profiles' 
                 AND column_name = 'city') THEN
    ALTER TABLE profiles ADD COLUMN city TEXT;
  END IF;

  -- Add state column if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_schema = 'public' 
                 AND table_name = 'profiles' 
                 AND column_name = 'state') THEN
    ALTER TABLE profiles ADD COLUMN state TEXT;
  END IF;

  -- Add postal_code column if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_schema = 'public' 
                 AND table_name = 'profiles' 
                 AND column_name = 'postal_code') THEN
    ALTER TABLE profiles ADD COLUMN postal_code TEXT;
  END IF;

  -- Add phone_number column if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_schema = 'public' 
                 AND table_name = 'profiles' 
                 AND column_name = 'phone_number') THEN
    ALTER TABLE profiles ADD COLUMN phone_number TEXT;
  END IF;

  -- Add currency column if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_schema = 'public' 
                 AND table_name = 'profiles' 
                 AND column_name = 'currency') THEN
    ALTER TABLE profiles ADD COLUMN currency VARCHAR(3) DEFAULT 'USD';
  END IF;
END $$;

-- Add comments to document the columns
COMMENT ON COLUMN profiles.street_address IS 'User street address for shipping and billing';
COMMENT ON COLUMN profiles.city IS 'User city for shipping and billing';
COMMENT ON COLUMN profiles.state IS 'User state or province for shipping and billing';
COMMENT ON COLUMN profiles.postal_code IS 'User postal or ZIP code for shipping and billing';
COMMENT ON COLUMN profiles.phone_number IS 'User phone number for contact';
COMMENT ON COLUMN profiles.currency IS 'User preferred currency for pricing display (ISO 4217 code)';

-- Create indexes for commonly queried fields
CREATE INDEX IF NOT EXISTS idx_profiles_country ON profiles(country);
CREATE INDEX IF NOT EXISTS idx_profiles_currency ON profiles(currency);