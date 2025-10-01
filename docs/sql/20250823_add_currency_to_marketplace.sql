-- Add currency field to marketplace_listings to store original listing currency
ALTER TABLE marketplace_listings 
ADD COLUMN IF NOT EXISTS currency VARCHAR(3) DEFAULT 'USD';

-- Update existing listings to use seller's currency from their profile
UPDATE marketplace_listings ml
SET currency = COALESCE(p.currency, 'USD')
FROM profiles p
WHERE ml.seller_id = p.id
AND ml.currency IS NULL;

-- Add comment for documentation
COMMENT ON COLUMN marketplace_listings.currency IS 'The original currency the item was listed in (seller''s currency)';

-- Create an index for performance when filtering by currency
CREATE INDEX IF NOT EXISTS idx_marketplace_listings_currency ON marketplace_listings(currency);