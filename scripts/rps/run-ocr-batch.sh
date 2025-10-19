#!/bin/bash

# RPS OCR Batch Runner
# This script sets up environment and runs the OCR processing

echo "=========================================="
echo "RPS OCR Batch Processing"
echo "=========================================="
echo ""

# Set Supabase service role key from unimog-import
export SUPABASE_SERVICE_ROLE_KEY=<SUPABASE_SERVICE_ROLE_KEY>

# Check for OpenAI key
if [ -z "$OPENAI_API_KEY" ]; then
  echo "⚠️  OPENAI_API_KEY not set in environment"
  echo ""
  echo "Please set it by running:"
  echo "  export OPENAI_API_KEY=<OPENAI_API_KEY>
  echo ""
  echo "Then run this script again."
  exit 1
fi

echo "✓ Supabase key: SET"
echo "✓ OpenAI key: SET"
echo ""

# Run the resilient OCR script
node scripts/rps/resilient-batch-ocr.js
