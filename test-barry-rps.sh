#!/bin/bash

# Test Barry's RPS database integration
# Tests the three new context gatherers

SUPABASE_URL="https://ydevatqwkoccxhtejdor.supabase.co"
EDGE_FUNCTION_URL="${SUPABASE_URL}/functions/v1/chat-with-barry-agentic"

# Get anon key from environment or use placeholder
ANON_KEY="${VITE_SUPABASE_ANON_KEY:-eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlkZXZhdHF3a29jY3hodGVqZG9yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjg4ODUxMzUsImV4cCI6MjA0NDQ2MTEzNX0.0xtQEoVG5B7JiHs6YmVp-jNbAyiflWVNKG_9nARb_5c}"

# Admin user ID for testing
USER_ID="f91c4216-27cb-4b39-ba52-01dd95765b21"

echo "🧪 Testing Barry RPS Database Integration"
echo "=========================================="
echo ""

# Test 1: Group Code Query
echo "📋 Test 1: Group Code Query - 'What parts are in the PBA group?'"
echo "Expected: Should list parts in PBA group from rps_parts table"
echo ""

curl -X POST "${EDGE_FUNCTION_URL}" \
  -H "Authorization: Bearer ${ANON_KEY}" \
  -H "Content-Type: application/json" \
  -d '{
    "conversationHistory": [
      {
        "role": "user",
        "content": "What parts are in the PBA group?"
      }
    ],
    "userId": "'${USER_ID}'"
  }' 2>/dev/null | jq -r '.content' | head -50

echo ""
echo "---"
echo ""

# Test 2: Item Number Query
echo "📋 Test 2: Item Number Query - 'Tell me about PA 051'"
echo "Expected: Should show PITMAN ARM details with NSN/NIIN"
echo ""

curl -X POST "${EDGE_FUNCTION_URL}" \
  -H "Authorization: Bearer ${ANON_KEY}" \
  -H "Content-Type: application/json" \
  -d '{
    "conversationHistory": [
      {
        "role": "user",
        "content": "Tell me about PA 051"
      }
    ],
    "userId": "'${USER_ID}'"
  }' 2>/dev/null | jq -r '.content' | head -50

echo ""
echo "---"
echo ""

# Test 3: Description Search Query
echo "📋 Test 3: Description Search - 'What is the part number for the steering wheel?'"
echo "Expected: Should find PA 004 or similar steering wheel parts"
echo ""

curl -X POST "${EDGE_FUNCTION_URL}" \
  -H "Authorization: Bearer ${ANON_KEY}" \
  -H "Content-Type: application/json" \
  -d '{
    "conversationHistory": [
      {
        "role": "user",
        "content": "What is the part number for the steering wheel?"
      }
    ],
    "userId": "'${USER_ID}'"
  }' 2>/dev/null | jq -r '.content' | head -50

echo ""
echo "---"
echo ""

# Test 4: Existing Functionality - General Query
echo "📋 Test 4: General Query - 'Hello Barry'"
echo "Expected: Should respond normally without crashing"
echo ""

curl -X POST "${EDGE_FUNCTION_URL}" \
  -H "Authorization: Bearer ${ANON_KEY}" \
  -H "Content-Type: application/json" \
  -d '{
    "conversationHistory": [
      {
        "role": "user",
        "content": "Hello Barry"
      }
    ],
    "userId": "'${USER_ID}'"
  }' 2>/dev/null | jq -r '.content' | head -30

echo ""
echo "=========================================="
echo "✅ Testing Complete"
