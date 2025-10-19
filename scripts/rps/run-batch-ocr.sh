#!/bin/bash

# RPS Batch OCR - Wrapper Script
# This script runs the local OCR processing with proper environment setup

echo "=========================================="
echo "RPS Parts Lists OCR - Batch Processing"
echo "=========================================="
echo ""
echo "This will process approximately 298 remaining RPS parts list pages"
echo "Estimated time: ~30 minutes (6 seconds per page)"
echo ""

# Check if we're in the right directory
if [ ! -f "scripts/rps/batch-ocr-local.ts" ]; then
  echo "Error: Must run from project root directory"
  exit 1
fi

# Check for required environment variables
if [ -z "$OPENAI_API_KEY" ]; then
  echo "Error: OPENAI_API_KEY environment variable not set"
  echo "Please set it and try again:"
  echo "  export OPENAI_API_KEY=<OPENAI_API_KEY>
  exit 1
fi

# Set known values
export VITE_SUPABASE_URL="https://ydevatqwkoccxhtejdor.supabase.co"

# Prompt for service role key if not set
if [ -z "$SUPABASE_SERVICE_ROLE_KEY" ]; then
  echo "Enter SUPABASE_SERVICE_ROLE_KEY (will be hidden):"
  read -s SUPABASE_SERVICE_ROLE_KEY
  export SUPABASE_SERVICE_ROLE_KEY
  echo ""
fi

echo "=========================================="
echo "Starting OCR processing..."
echo "=========================================="
echo ""

# Run the script
npx tsx scripts/rps/batch-ocr-local.ts

exit_code=$?

echo ""
echo "=========================================="
if [ $exit_code -eq 0 ]; then
  echo "OCR processing complete!"
  echo "SQL file saved to: scripts/rps/output/rps_ocr_updates.sql"
else
  echo "OCR processing failed with exit code: $exit_code"
fi
echo "=========================================="

exit $exit_code
