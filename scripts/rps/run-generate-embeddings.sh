#!/bin/bash

# Batch embedding generation script for Phase 8 chunks

cd "$(dirname "$0")"

# Check environment variables
if [ -z "$SUPABASE_SERVICE_ROLE_KEY" ]; then
  echo "Error: SUPABASE_SERVICE_ROLE_KEY not set"
  exit 1
fi

# Set VITE_SUPABASE_URL if not already set
export VITE_SUPABASE_URL="${VITE_SUPABASE_URL:-https://ydevatqwkoccxhtejdor.supabase.co}"

echo "Starting batch embedding generation..."
echo "SUPABASE_URL: $VITE_SUPABASE_URL"
echo ""

npx tsx generate-embeddings-batch.ts

echo ""
echo "Script completed."
