#!/bin/bash

# Improved Amazon Price Refresh Script
# Slower pace, better success rate

echo "🐌 IMPROVED Price Refresh (Slower but Better Success Rate)"
echo "============================================"
echo "This version uses longer delays to reduce rate limiting"
echo "Estimated time: 40-50 minutes (slower but more reliable)"
echo ""

# Prompt for service role key
echo "🔑 Enter your Supabase service role key:"
read -s -p "Service Role Key: " SERVICE_ROLE_KEY
echo ""

if [ -z "$SERVICE_ROLE_KEY" ]; then
  echo "❌ No key provided. Exiting."
  exit 1
fi

echo "✅ Starting improved price refresh..."
echo ""

FUNCTION_URL="https://ydevatqwkoccxhtejdor.supabase.co/functions/v1/scrape-amazon-prices"

# SLOWER APPROACH: Smaller batches, longer delays
BATCH=1
TOTAL_BATCHES=24  # More batches, fewer products each
TOTAL_UPDATED=0
TOTAL_FAILED=0

echo "📦 Processing in 24 batches of 5 products each"
echo "⏳ 20-second delays between batches"
echo "🎯 Goal: Higher success rate with slower pace"
echo ""

while [ $BATCH -le $TOTAL_BATCHES ]; do
  echo "📦 Batch $BATCH/$TOTAL_BATCHES - $(date '+%H:%M:%S')"

  # Call edge function
  RESPONSE=$(curl -s -X POST "$FUNCTION_URL" \
    -H "Authorization: Bearer $SERVICE_ROLE_KEY" \
    -H "Content-Type: application/json" \
    -d '{}')

  # Parse response
  if echo "$RESPONSE" | grep -q '"status"'; then
    UPDATED=$(echo "$RESPONSE" | grep -o '"updated":[0-9]*' | cut -d':' -f2 | head -1)
    FAILED=$(echo "$RESPONSE" | grep -o '"failed":[0-9]*' | cut -d':' -f2 | head -1)

    UPDATED=${UPDATED:-0}
    FAILED=${FAILED:-0}

    TOTAL_UPDATED=$((TOTAL_UPDATED + UPDATED))
    TOTAL_FAILED=$((TOTAL_FAILED + FAILED))

    SUCCESS_RATE=$((TOTAL_UPDATED * 100 / (TOTAL_UPDATED + TOTAL_FAILED + 1)))

    echo "   📈 Updated: $UPDATED, Failed: $FAILED (Success rate: $SUCCESS_RATE%)"
  else
    echo "   ❌ API Error: ${RESPONSE:0:50}..."
  fi

  # LONGER DELAY for better success rate
  if [ $BATCH -lt $TOTAL_BATCHES ]; then
    echo "   ⏳ Waiting 20 seconds (anti-rate-limit)..."
    sleep 20
  fi

  BATCH=$((BATCH + 1))
done

echo ""
echo "🎉 Improved price refresh complete!"
echo "📊 Final Results:"
echo "   • Updated: $TOTAL_UPDATED products"
echo "   • Failed: $TOTAL_FAILED products"
echo "   • Success Rate: $((TOTAL_UPDATED * 100 / (TOTAL_UPDATED + TOTAL_FAILED + 1)))%"
echo ""
echo "🛍️  Check shop for updated prices!"