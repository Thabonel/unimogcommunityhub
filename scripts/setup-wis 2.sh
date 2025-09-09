#!/bin/bash

# Load environment variables
source .env

echo "🚀 Setting up WIS Storage and Data"
echo ""

# Create storage bucket
echo "🔧 Creating wis-manuals storage bucket..."
curl -X POST \
  "${VITE_SUPABASE_URL}/storage/v1/bucket" \
  -H "apikey: ${VITE_SUPABASE_ANON_KEY}" \
  -H "Authorization: Bearer ${VITE_SUPABASE_ANON_KEY}" \
  -H "Content-Type: application/json" \
  -d '{
    "id": "wis-manuals",
    "name": "wis-manuals",
    "public": true,
    "file_size_limit": 52428800,
    "allowed_mime_types": ["text/html", "application/json", "application/pdf", "image/*"]
  }' 2>/dev/null

echo "✅ Storage bucket created (or already exists)"
echo ""

# Upload files
echo "📤 Uploading sample files..."

# Upload bulletin
if [ -f "/Volumes/UnimogManuals/wis-ready-to-upload/bulletins/tsb_2020_001_portal_axle.html" ]; then
  curl -X POST \
    "${VITE_SUPABASE_URL}/storage/v1/object/wis-manuals/bulletins/tsb_2020_001_portal_axle.html" \
    -H "apikey: ${VITE_SUPABASE_ANON_KEY}" \
    -H "Authorization: Bearer ${VITE_SUPABASE_ANON_KEY}" \
    -H "Content-Type: text/html" \
    --data-binary "@/Volumes/UnimogManuals/wis-ready-to-upload/bulletins/tsb_2020_001_portal_axle.html" 2>/dev/null
  echo "✅ Uploaded: bulletins/tsb_2020_001_portal_axle.html"
fi

# Upload manual
if [ -f "/Volumes/UnimogManuals/wis-ready-to-upload/manuals/unimog_400_oil_change.html" ]; then
  curl -X POST \
    "${VITE_SUPABASE_URL}/storage/v1/object/wis-manuals/manuals/unimog_400_oil_change.html" \
    -H "apikey: ${VITE_SUPABASE_ANON_KEY}" \
    -H "Authorization: Bearer ${VITE_SUPABASE_ANON_KEY}" \
    -H "Content-Type: text/html" \
    --data-binary "@/Volumes/UnimogManuals/wis-ready-to-upload/manuals/unimog_400_oil_change.html" 2>/dev/null
  echo "✅ Uploaded: manuals/unimog_400_oil_change.html"
fi

# Upload parts JSON
if [ -f "/Volumes/UnimogManuals/wis-ready-to-upload/parts/unimog_portal_axle_parts.json" ]; then
  curl -X POST \
    "${VITE_SUPABASE_URL}/storage/v1/object/wis-manuals/parts/unimog_portal_axle_parts.json" \
    -H "apikey: ${VITE_SUPABASE_ANON_KEY}" \
    -H "Authorization: Bearer ${VITE_SUPABASE_ANON_KEY}" \
    -H "Content-Type: application/json" \
    --data-binary "@/Volumes/UnimogManuals/wis-ready-to-upload/parts/unimog_portal_axle_parts.json" 2>/dev/null
  echo "✅ Uploaded: parts/unimog_portal_axle_parts.json"
fi

echo ""
echo "✨ WIS files uploaded!"
echo "📍 Test at: http://localhost:5173/knowledge/wis"