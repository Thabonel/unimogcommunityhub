#!/bin/bash
# Complete RPS Setup - Automated extraction and upload pipeline
# This script processes all RPS groups and uploads them to Supabase Storage

set -e

echo "🚀 RPS Complete Setup Pipeline"
echo "================================"
echo ""

# Check for required environment variables
if [ -z "$ANTHROPIC_API_KEY" ]; then
    echo "❌ Error: ANTHROPIC_API_KEY not set"
    echo "   Export it: export ANTHROPIC_API_KEY=your_key_here"
    exit 1
fi

if [ -z "$VITE_SUPABASE_URL" ]; then
    echo "❌ Error: VITE_SUPABASE_URL not set"
    echo "   Load from .env.local: source .env.local"
    exit 1
fi

if [ -z "$SUPABASE_SERVICE_ROLE_KEY" ]; then
    echo "❌ Error: SUPABASE_SERVICE_ROLE_KEY not set"
    echo "   Get it from Supabase Dashboard → Settings → API"
    exit 1
fi

# Navigate to RPS scripts directory
cd "$(dirname "$0")"
echo "📂 Working directory: $(pwd)"
echo ""

# Step 1: Install dependencies
echo "📦 Step 1: Installing dependencies..."
npm install @anthropic-ai/sdk @supabase/supabase-js dotenv tsx
echo "✅ Dependencies installed"
echo ""

# Step 2: Run batch extraction
echo "🔍 Step 2: Extracting all RPS groups..."
echo "This will process 24 groups across 8 chunks"
echo "Estimated time: 30-45 minutes"
echo "Estimated cost: ~$2.50 (Anthropic API)"
echo ""
read -p "Continue? (y/n) " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Aborted by user"
    exit 1
fi

npx tsx batch-extract-all.ts

if [ $? -ne 0 ]; then
    echo "❌ Batch extraction failed"
    exit 1
fi

echo "✅ Extraction complete"
echo ""

# Step 3: Upload to Supabase Storage
echo "📤 Step 3: Uploading to Supabase Storage..."
npx tsx upload-to-supabase.ts

if [ $? -ne 0 ]; then
    echo "❌ Upload failed"
    exit 1
fi

echo "✅ Upload complete"
echo ""

# Step 4: Verify uploads
echo "🔍 Step 4: Verifying uploads..."
SUMMARY=$(cat output/upload_summary.json)
SUCCESSFUL=$(echo "$SUMMARY" | grep -o '"successful_uploads":[0-9]*' | grep -o '[0-9]*')
FAILED=$(echo "$SUMMARY" | grep -o '"failed_uploads":[0-9]*' | grep -o '[0-9]*')

echo "📊 Results:"
echo "   ✅ Successful: $SUCCESSFUL"
echo "   ❌ Failed: $FAILED"
echo ""

if [ "$FAILED" -gt 0 ]; then
    echo "⚠️ Some uploads failed. Check output/upload_summary.json"
    exit 1
fi

# Step 5: Summary
echo "🎉 RPS Setup Complete!"
echo "======================="
echo ""
echo "✅ All RPS groups extracted and uploaded"
echo "✅ Data available in Supabase Storage bucket: rps-parts"
echo "✅ Barry can now answer parts catalog questions"
echo ""
echo "📄 Output files:"
echo "   - output/extraction_summary.json"
echo "   - output/upload_summary.json"
echo "   - output/group_*_complete.json (24 files)"
echo ""
echo "🔗 Next steps:"
echo "   1. Deploy Barry edge function with RPS integration"
echo "   2. Test: Ask Barry 'What is NIIN 12-126-0420?'"
echo "   3. Test: Ask Barry 'Show me Group AA parts'"
echo ""
