#!/bin/bash

# Load environment variables
if [ -f .env ]; then
  export $(cat .env | grep -v '^#' | xargs)
fi

# Check required variables
if [ -z "$SUPABASE_SERVICE_ROLE_KEY" ]; then
  echo "Error: SUPABASE_SERVICE_ROLE_KEY not set"
  echo "Please set it manually or add to .env file"
  exit 1
fi

export VITE_SUPABASE_URL="https://ydevatqwkoccxhtejdor.supabase.co"

echo "Running illustration fix script..."
echo "URL: $VITE_SUPABASE_URL"
echo ""

npx tsx scripts/rps/fix-illustration-descriptions.ts
