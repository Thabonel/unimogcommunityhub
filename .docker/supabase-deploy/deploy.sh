#!/bin/bash

# Supabase Edge Function Deployment Script
set -e

echo "🚀 Starting Supabase Edge Function Deployment..."

# Check required environment variables
if [ -z "$SUPABASE_ACCESS_TOKEN" ]; then
  echo "❌ SUPABASE_ACCESS_TOKEN is required"
  exit 1
fi

if [ -z "$SUPABASE_PROJECT_ID" ]; then
  echo "❌ SUPABASE_PROJECT_ID is required"  
  exit 1
fi

# Login to Supabase
echo "🔐 Authenticating with Supabase..."
supabase login --token "$SUPABASE_ACCESS_TOKEN"

# Link to project
echo "🔗 Linking to Supabase project..."
supabase link --project-ref "$SUPABASE_PROJECT_ID"

# Set environment variables for edge functions
if [ -n "$ANTHROPIC_API_KEY" ]; then
  echo "🔑 Setting ANTHROPIC_API_KEY..."
  supabase secrets set ANTHROPIC_API_KEY="$ANTHROPIC_API_KEY"
fi

if [ -n "$SUPABASE_SERVICE_ROLE_KEY" ]; then
  echo "🔑 Setting SUPABASE_SERVICE_ROLE_KEY..."
  supabase secrets set SUPABASE_SERVICE_ROLE_KEY="$SUPABASE_SERVICE_ROLE_KEY"
fi

if [ -n "$GOOGLE_VISION_API_KEY" ]; then
  echo "🔑 Setting GOOGLE_VISION_API_KEY..."
  supabase secrets set GOOGLE_VISION_API_KEY="$GOOGLE_VISION_API_KEY"
fi

# Deploy the specific edge function
echo "📦 Deploying process-invoice-ocr function..."
supabase functions deploy process-invoice-ocr

# Verify deployment
echo "✅ Deployment completed!"
echo "📝 Testing function accessibility..."

# Test the function endpoint
FUNCTION_URL="https://$SUPABASE_PROJECT_ID.supabase.co/functions/v1/process-invoice-ocr"
echo "🔗 Function URL: $FUNCTION_URL"

# Simple health check
if curl -s -X OPTIONS "$FUNCTION_URL" > /dev/null; then
  echo "✅ Function is accessible and responding to OPTIONS requests"
else
  echo "⚠️  Function may not be fully ready yet (normal for new deployments)"
fi

echo "🎉 Deployment process complete!"
echo ""
echo "Next steps:"
echo "1. Test the function from your frontend"
echo "2. Check Supabase Dashboard > Edge Functions for logs"
echo "3. Monitor the function performance"