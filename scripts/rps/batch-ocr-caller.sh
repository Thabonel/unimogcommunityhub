#!/bin/bash

# RPS OCR Batch Processor - Edge Function Caller
# Calls the Supabase Edge Function repeatedly to process all pages

EDGE_FUNCTION_URL="https://ydevatqwkoccxhtejdor.supabase.co/functions/v1/process-rps-ocr"
SUPABASE_ANON_KEY=$(grep VITE_SUPABASE_ANON_KEY .env.example | cut -d'=' -f2)

# Check if we can get the anon key
if [ -z "$SUPABASE_ANON_KEY" ] || [ "$SUPABASE_ANON_KEY" = "your_anon_key_here" ]; then
  echo "❌ Could not find Supabase anon key"
  echo "Please set SUPABASE_ANON_KEY environment variable"
  exit 1
fi

echo "=========================================="
echo "RPS OCR Batch Processing via Edge Function"
echo "=========================================="
echo ""

# Get initial count
echo "📊 Checking initial status..."
INITIAL_UNPROCESSED=$(node -e "
const https = require('https');
const options = {
  hostname: 'ydevatqwkoccxhtejdor.supabase.co',
  path: '/rest/v1/manual_chunks?manual_title=eq.RPS%20Catalog&ocr_processed=eq.false&select=count',
  headers: {
    'apikey': '$SUPABASE_ANON_KEY',
    'Authorization': 'Bearer $SUPABASE_ANON_KEY'
  }
};
https.get(options, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const count = JSON.parse(data)[0].count;
    console.log(count);
  });
});
" 2>/dev/null)

echo "Unprocessed pages: $INITIAL_UNPROCESSED"
echo ""

# Calculate batches needed (10 pages per batch)
BATCHES_NEEDED=$(( (INITIAL_UNPROCESSED + 9) / 10 ))
echo "Will run $BATCHES_NEEDED batches (10 pages each)"
echo ""

TOTAL_PROCESSED=0
TOTAL_FAILED=0
BATCH_NUM=1

# Process batches
while [ $BATCH_NUM -le $BATCHES_NEEDED ]; do
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo "Batch $BATCH_NUM of $BATCHES_NEEDED"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

  # Call Edge Function
  RESPONSE=$(curl -s -X POST "$EDGE_FUNCTION_URL" \
    -H "Authorization: Bearer $SUPABASE_ANON_KEY" \
    -H "Content-Type: application/json")

  # Parse response
  PROCESSED=$(echo "$RESPONSE" | grep -o '"processed":[0-9]*' | cut -d':' -f2)
  FAILED=$(echo "$RESPONSE" | grep -o '"failed":[0-9]*' | cut -d':' -f2)

  if [ -z "$PROCESSED" ]; then
    PROCESSED=0
  fi

  if [ -z "$FAILED" ]; then
    FAILED=0
  fi

  TOTAL_PROCESSED=$((TOTAL_PROCESSED + PROCESSED))
  TOTAL_FAILED=$((TOTAL_FAILED + FAILED))

  echo "✓ Processed: $PROCESSED pages"
  echo "✗ Failed: $FAILED pages"
  echo "📊 Total so far: $TOTAL_PROCESSED processed, $TOTAL_FAILED failed"
  echo ""

  # Check if we're done
  if [ "$PROCESSED" -eq 0 ] && [ "$FAILED" -eq 0 ]; then
    echo "✓ All pages processed!"
    break
  fi

  # Rate limiting between batches
  echo "⏳ Waiting 5 seconds before next batch..."
  sleep 5

  BATCH_NUM=$((BATCH_NUM + 1))
done

echo ""
echo "=========================================="
echo "Processing Complete!"
echo "=========================================="
echo "Total Processed: $TOTAL_PROCESSED"
echo "Total Failed: $TOTAL_FAILED"
echo ""
echo "To verify, run in Supabase SQL Editor:"
echo "SELECT COUNT(*) FILTER (WHERE ocr_processed = true) as done,"
echo "       COUNT(*) FILTER (WHERE ocr_processed = false) as remaining"
echo "FROM manual_chunks"
echo "WHERE manual_title = 'RPS Catalog'"
echo "  AND metadata->>'is_parts_list' = 'true';"
