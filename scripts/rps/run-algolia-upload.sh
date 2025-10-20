#!/bin/bash

# Upload RPS Catalog to Algolia

cd "$(dirname "$0")"

# Check environment variables
if [ -z "$SUPABASE_SERVICE_ROLE_KEY" ]; then
  echo "Error: SUPABASE_SERVICE_ROLE_KEY not set"
  exit 1
fi

if [ -z "$ALGOLIA_WRITE_KEY" ]; then
  echo "Error: ALGOLIA_WRITE_KEY not set"
  echo "Get it from: https://www.algolia.com/account/api-keys"
  echo "Then run: export ALGOLIA_WRITE_KEY='your_write_key'"
  exit 1
fi

# Set VITE_SUPABASE_URL if not already set
export VITE_SUPABASE_URL="${VITE_SUPABASE_URL:-https://ydevatqwkoccxhtejdor.supabase.co}"

echo "Starting Algolia upload..."
echo "SUPABASE_URL: $VITE_SUPABASE_URL"
echo "ALGOLIA_APP_ID: FQ6PXP6GXO"
echo ""

npx tsx algolia-upload-rps.ts

echo ""
echo "Script completed."
