#!/bin/bash

# Quick Amazon Price Refresh Script
# Processes all 119 products in ~20 minutes

echo "🚀 Starting Amazon Price Refresh..."
echo "📦 Processing 119 products in batches of 8"
echo "⏱️  Estimated time: 20-25 minutes"
echo ""

# Your Supabase service role key (replace with actual key)
SERVICE_ROLE_KEY="your-service-role-key-here"

# Edge function URL
FUNCTION_URL="https://ydevatqwkoccxhtejdor.supabase.co/functions/v1/scrape-amazon-prices"

# Counter for progress tracking
BATCH=1
TOTAL_BATCHES=15

while [ $BATCH -le $TOTAL_BATCHES ]; do
  echo "📦 Batch $BATCH/$TOTAL_BATCHES - $(date '+%H:%M:%S')"

  # Call the edge function
  RESPONSE=$(curl -s -X POST "$FUNCTION_URL" \
    -H "Authorization: Bearer $SERVICE_ROLE_KEY" \
    -H "Content-Type: application/json" \
    -d '{}')

  # Parse response for status
  STATUS=$(echo "$RESPONSE" | grep -o '"status":"[^"]*"' | cut -d'"' -f4)
  UPDATED=$(echo "$RESPONSE" | grep -o '"updated":[0-9]*' | cut -d':' -f2)
  FAILED=$(echo "$RESPONSE" | grep -o '"failed":[0-9]*' | cut -d':' -f2)

  if [ "$STATUS" = "success" ]; then
    echo "   ✅ Updated: $UPDATED products, Failed: $FAILED"
  else
    echo "   ❌ Error in batch $BATCH"
    echo "   Response: $RESPONSE"
  fi

  # Wait 10 seconds between batches (rate limiting)
  if [ $BATCH -lt $TOTAL_BATCHES ]; then
    echo "   ⏳ Waiting 10 seconds..."
    sleep 10
  fi

  BATCH=$((BATCH + 1))
done

echo ""
echo "🎉 Price refresh complete!"
echo "📊 Check your shop for updated prices"