#!/bin/bash

# Safe Amazon Price Refresh Script
# Prompts for service role key securely

echo "🚀 Amazon Price Refresh Tool"
echo "============================================"
echo "This will update all 119 products with current Amazon prices"
echo "Estimated time: 20-25 minutes"
echo ""

# Prompt for service role key securely
echo "🔑 Please enter your Supabase service role key:"
echo "   (Find it at: https://supabase.com/dashboard/project/ydevatqwkoccxhtejdor/settings/api)"
echo "   (Look for 'service_role' key, starts with 'eyJ...')"
echo ""
read -s -p "Service Role Key: " SERVICE_ROLE_KEY
echo ""

if [ -z "$SERVICE_ROLE_KEY" ]; then
  echo "❌ No key provided. Exiting."
  exit 1
fi

echo "✅ Key received. Starting price refresh..."
echo ""

# Edge function URL
FUNCTION_URL="https://ydevatqwkoccxhtejdor.supabase.co/functions/v1/scrape-amazon-prices"

# Counters
BATCH=1
TOTAL_BATCHES=15
TOTAL_UPDATED=0
TOTAL_FAILED=0

echo "📦 Processing in 15 batches of 8 products each"
echo "⏳ 10-second delays between batches to avoid rate limiting"
echo ""

while [ $BATCH -le $TOTAL_BATCHES ]; do
  echo "📦 Batch $BATCH/$TOTAL_BATCHES - $(date '+%H:%M:%S')"

  # Call the edge function
  RESPONSE=$(curl -s -X POST "$FUNCTION_URL" \
    -H "Authorization: Bearer $SERVICE_ROLE_KEY" \
    -H "Content-Type: application/json" \
    -d '{}')

  # Check if response contains expected JSON
  if echo "$RESPONSE" | grep -q '"status"'; then
    # Parse response
    STATUS=$(echo "$RESPONSE" | grep -o '"status":"[^"]*"' | cut -d'"' -f4)
    UPDATED=$(echo "$RESPONSE" | grep -o '"updated":[0-9]*' | cut -d':' -f2 | head -1)
    FAILED=$(echo "$RESPONSE" | grep -o '"failed":[0-9]*' | cut -d':' -f2 | head -1)

    # Handle empty values
    UPDATED=${UPDATED:-0}
    FAILED=${FAILED:-0}

    TOTAL_UPDATED=$((TOTAL_UPDATED + UPDATED))
    TOTAL_FAILED=$((TOTAL_FAILED + FAILED))

    if [ "$STATUS" = "success" ]; then
      echo "   ✅ Updated: $UPDATED, Failed: $FAILED"
    else
      echo "   ⚠️  Status: $STATUS, Updated: $UPDATED, Failed: $FAILED"
    fi
  else
    echo "   ❌ Invalid response from edge function"
    echo "   Response: ${RESPONSE:0:100}..."
  fi

  # Wait between batches (except last one)
  if [ $BATCH -lt $TOTAL_BATCHES ]; then
    echo "   ⏳ Waiting 10 seconds..."
    sleep 10
  fi

  BATCH=$((BATCH + 1))
done

echo ""
echo "🎉 Price refresh complete!"
echo "📊 Summary:"
echo "   • Total products updated: $TOTAL_UPDATED"
echo "   • Total failed: $TOTAL_FAILED"
echo "   • Products processed: $((TOTAL_UPDATED + TOTAL_FAILED))"
echo ""
echo "🛍️  Check your shop for updated prices!"
echo "🔗 Staging: https://unimogcommunity-staging.netlify.app/shop"