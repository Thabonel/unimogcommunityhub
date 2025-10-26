#!/bin/bash
# Clean and re-upload RPS illustrations to Supabase Storage
# This script deletes all existing files and uploads the deduplicated 627 PNG files

set -e  # Exit on error

SUPABASE_URL="https://ydevatqwkoccxhtejdor.supabase.co"
BUCKET_NAME="rps_illustrations"
FOLDER_PATH="rps_illustrations"
LOCAL_DIR="scripts/rps/output/ai_illustrations"

echo "🗑️  Step 1: Deleting all existing files from Supabase storage..."
echo "   Bucket: $BUCKET_NAME"
echo "   Folder: $FOLDER_PATH"
echo ""

# Get service role key from environment
if [ -z "$SUPABASE_SERVICE_ROLE_KEY" ]; then
  echo "❌ ERROR: SUPABASE_SERVICE_ROLE_KEY not set"
  echo "   Run: export SUPABASE_SERVICE_ROLE_KEY='your_service_role_key'"
  exit 1
fi

# List all files in the bucket (this will show what we're about to delete)
echo "📋 Fetching list of files to delete..."
RESPONSE=$(curl -s -X POST "$SUPABASE_URL/storage/v1/object/list/$BUCKET_NAME" \
  -H "Authorization: Bearer $SUPABASE_SERVICE_ROLE_KEY" \
  -H "Content-Type: application/json" \
  -d "{\"prefix\": \"$FOLDER_PATH/\", \"limit\": 1000}")

FILE_COUNT=$(echo "$RESPONSE" | jq '. | length')
echo "   Found $FILE_COUNT files in storage"
echo ""

# Delete all files in the folder
if [ "$FILE_COUNT" -gt 0 ]; then
  echo "🗑️  Deleting all files from storage bucket..."

  # Extract file paths and create delete request
  FILES_TO_DELETE=$(echo "$RESPONSE" | jq '[.[] | .name]')

  DELETE_RESPONSE=$(curl -s -X DELETE "$SUPABASE_URL/storage/v1/object/$BUCKET_NAME" \
    -H "Authorization: Bearer $SUPABASE_SERVICE_ROLE_KEY" \
    -H "Content-Type: application/json" \
    -d "{\"prefixes\": [\"$FOLDER_PATH/\"]}")

  echo "   ✅ Deleted all files from bucket"
else
  echo "   ℹ️  No files to delete (bucket already empty)"
fi

echo ""
echo "📤 Step 2: Uploading 627 deduplicated PNG files..."
echo "   Source: $LOCAL_DIR"
echo ""

# Count local files
LOCAL_FILE_COUNT=$(ls "$LOCAL_DIR"/*.png 2>/dev/null | wc -l | tr -d ' ')
echo "   Local files to upload: $LOCAL_FILE_COUNT"
echo ""

if [ "$LOCAL_FILE_COUNT" -eq 0 ]; then
  echo "❌ ERROR: No PNG files found in $LOCAL_DIR"
  exit 1
fi

# Upload each file
UPLOADED=0
FAILED=0

for FILE in "$LOCAL_DIR"/*.png; do
  FILENAME=$(basename "$FILE")

  # Upload file
  UPLOAD_RESPONSE=$(curl -s -X POST \
    "$SUPABASE_URL/storage/v1/object/$BUCKET_NAME/$FOLDER_PATH/$FILENAME" \
    -H "Authorization: Bearer $SUPABASE_SERVICE_ROLE_KEY" \
    -H "Content-Type: image/png" \
    --data-binary "@$FILE")

  # Check if upload succeeded
  if echo "$UPLOAD_RESPONSE" | jq -e '.Key' > /dev/null 2>&1; then
    UPLOADED=$((UPLOADED + 1))
    if [ $((UPLOADED % 50)) -eq 0 ]; then
      echo "   Uploaded $UPLOADED files..."
    fi
  else
    FAILED=$((FAILED + 1))
    echo "   ❌ Failed: $FILENAME"
  fi
done

echo ""
echo "✅ UPLOAD COMPLETE!"
echo ""
echo "📊 Summary:"
echo "   Total local files: $LOCAL_FILE_COUNT"
echo "   Successfully uploaded: $UPLOADED"
echo "   Failed: $FAILED"
echo ""
echo "🎯 Next steps:"
echo "   1. Open https://unimogcommunity-staging.netlify.app/admin/rps-illustrations"
echo "   2. Verify images load correctly"
echo "   3. Test Barry with: 'Show me turbocharger exploded view'"
echo ""
