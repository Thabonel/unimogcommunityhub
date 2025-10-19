#!/bin/bash

# RPS Parts Lists OCR - Environment Wrapper
# This script sets up environment variables and runs the OCR processor

echo "=========================================="
echo "RPS Parts Lists OCR - Setup"
echo "=========================================="
echo ""

# Check if environment variables are already set
if [ -z "$SUPABASE_SERVICE_ROLE_KEY" ]; then
  echo "Environment variables not found."
  echo "You need to provide:"
  echo "1. SUPABASE_SERVICE_ROLE_KEY (from Supabase dashboard)"
  echo "2. VITE_UNSTRUCTURED_API_KEY (from Netlify environment variables)"
  echo ""
  echo "Get these from:"
  echo "- Supabase: https://supabase.com/dashboard/project/ydevatqwkoccxhtejdor/settings/api"
  echo "- Unstructured: https://app.netlify.com/sites/unimogcommunity-staging/settings/env (copy VITE_UNSTRUCTURED_API_KEY)"
  echo ""
  read -p "Press ENTER to continue, or Ctrl+C to cancel..."
  echo ""
fi

# Set Supabase URL (we know this one)
export VITE_SUPABASE_URL="https://ydevatqwkoccxhtejdor.supabase.co"

# Prompt for service role key if not set
if [ -z "$SUPABASE_SERVICE_ROLE_KEY" ]; then
  echo "Enter SUPABASE_SERVICE_ROLE_KEY:"
  read -s SUPABASE_SERVICE_ROLE_KEY
  export SUPABASE_SERVICE_ROLE_KEY
  echo "✓ Supabase service role key set"
  echo ""
fi

# Prompt for Unstructured API key if not set
if [ -z "$VITE_UNSTRUCTURED_API_KEY" ]; then
  echo "Enter VITE_UNSTRUCTURED_API_KEY:"
  read -s VITE_UNSTRUCTURED_API_KEY
  export VITE_UNSTRUCTURED_API_KEY
  echo "✓ Unstructured.io API key set"
  echo ""
fi

echo "=========================================="
echo "Starting OCR batch processing..."
echo "=========================================="
echo ""

# Run the OCR script
npx tsx scripts/rps/ocr-parts-lists.ts

echo ""
echo "=========================================="
echo "OCR processing complete!"
echo "=========================================="
