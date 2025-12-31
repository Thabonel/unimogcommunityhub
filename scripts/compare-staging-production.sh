#!/bin/bash

# Compare Barry responses between staging and production
# Usage: ./scripts/compare-staging-production.sh

set -e

STAGING_URL="https://unimogcommunity-staging.netlify.app"
PRODUCTION_URL="https://unimogcommunityhub.com"

echo "🔍 Comparing Staging vs Production"
echo "===================================="
echo ""

# Test queries
QUERIES=(
  "I need to change the seals on my portal hubs"
  "front hub disassembly"
  "rear diff lock adjustment"
  "what is a unimog"
)

echo "📋 Test Queries:"
for query in "${QUERIES[@]}"; do
  echo "  - $query"
done
echo ""

echo "⚠️  MANUAL TESTING REQUIRED"
echo ""
echo "Test each query on BOTH environments:"
echo ""
echo "1. Open Staging: $STAGING_URL"
echo "2. Open Production: $PRODUCTION_URL"
echo "3. Ask Barry each query above"
echo "4. Compare results:"
echo "   - Same number of citations?"
echo "   - Same RPS pages?"
echo "   - Same manual references?"
echo ""

echo "✅ All results match? Safe to deploy."
echo "❌ Results differ? DO NOT DEPLOY - investigate first."
echo ""

echo "📊 Check Edge Function Logs:"
echo "https://supabase.com/dashboard/project/ydevatqwkoccxhtejdor/functions/chat-with-barry-agentic/logs"
echo ""
echo "Look for routing differences:"
echo "  - Staging: [Hybrid Routing] Mode: manual"
echo "  - Production: [Hybrid Routing] Mode: manual"
echo "  - Should match for same query!"
