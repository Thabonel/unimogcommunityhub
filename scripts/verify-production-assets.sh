#!/bin/bash

# Script to verify production assets are correctly deployed
# Usage: ./scripts/verify-production-assets.sh [domain]

DOMAIN=${1:-"https://unimoghub.com"}
echo "Checking assets on $DOMAIN"
echo "================================"

# Function to check if a resource loads
check_resource() {
    local url=$1
    local name=$2
    
    response=$(curl -s -o /dev/null -w "%{http_code}" "$url")
    
    if [ "$response" = "200" ]; then
        echo "✅ $name: OK (HTTP $response)"
    else
        echo "❌ $name: FAILED (HTTP $response)"
    fi
}

# Check favicon
echo "Checking favicon..."
check_resource "$DOMAIN/favicon.ico" "favicon.ico"
check_resource "$DOMAIN/favicon-32x32.png" "favicon-32x32.png"
check_resource "$DOMAIN/favicon-16x16.png" "favicon-16x16.png"

echo ""
echo "Checking Supabase hero image..."
check_resource "https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/site_assets/2828a9e2-f57a-4737-b4b6-a24cfc14a95a.png" "Hero image (Supabase)"

echo ""
echo "Checking if main app loads..."
response=$(curl -s "$DOMAIN" | head -100)
if echo "$response" | grep -q "Unimog Community Hub"; then
    echo "✅ Main app HTML contains expected title"
else
    echo "❌ Main app HTML does not contain expected content"
    echo "First 20 lines of response:"
    echo "$response" | head -20
fi

echo ""
echo "Checking React app bundle..."
# Check if there's a main JS bundle
js_files=$(curl -s "$DOMAIN" | grep -o 'src="/assets/index-[^"]*\.js"' | head -1)
if [ -n "$js_files" ]; then
    js_file=$(echo "$js_files" | sed 's/src="//;s/"//')
    check_resource "$DOMAIN$js_file" "React bundle"
else
    echo "❌ No React bundle found in HTML"
fi

echo ""
echo "================================"
echo "Verification complete!"