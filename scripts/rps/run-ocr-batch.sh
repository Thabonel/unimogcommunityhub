#!/bin/bash

# RPS OCR Batch Runner
# This script sets up environment and runs the OCR processing

echo "=========================================="
echo "RPS OCR Batch Processing"
echo "=========================================="
echo ""

# Set Supabase service role key from unimog-import
export SUPABASE_SERVICE_ROLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlkZXZhdHF3a29jY3hodGVqZG9yIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MzIyMDE2MSwiZXhwIjoyMDU4Nzk2MTYxfQ.qUYRgNaX0s8UIjaaZm0RyjBhNyG5oxDY3Oc8wDz-nu8"

# Check for OpenAI key
if [ -z "$OPENAI_API_KEY" ]; then
  echo "⚠️  OPENAI_API_KEY not set in environment"
  echo ""
  echo "Please set it by running:"
  echo "  export OPENAI_API_KEY='your-openai-key-here'"
  echo ""
  echo "Then run this script again."
  exit 1
fi

echo "✓ Supabase key: SET"
echo "✓ OpenAI key: SET"
echo ""

# Run the resilient OCR script
node scripts/rps/resilient-batch-ocr.js
