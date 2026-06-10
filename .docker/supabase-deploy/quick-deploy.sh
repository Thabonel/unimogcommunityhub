#!/bin/bash

# Quick Deployment Script for Supabase Edge Functions
echo "🚀 Supabase Edge Function Quick Deploy"
echo "======================================"

# Check if .env exists
if [ ! -f ".env" ]; then
    echo "⚠️  No .env file found. Creating from template..."
    cp .env.template .env
    echo "✏️  Please edit .env with your credentials:"
    echo "   nano .env"
    echo ""
    echo "Required variables:"
    echo "   - SUPABASE_ACCESS_TOKEN (from: https://supabase.com/dashboard/account/tokens)"
    echo "   - ANTHROPIC_API_KEY (from: https://console.anthropic.com/settings/keys)"
    echo "   - SUPABASE_SERVICE_ROLE_KEY (from: Supabase Dashboard > Settings > API)"
    echo ""
    echo "Run this script again after editing .env"
    exit 1
fi

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker and try again."
    exit 1
fi

# Check for required variables in .env
source .env

if [ -z "$SUPABASE_ACCESS_TOKEN" ] || [ "$SUPABASE_ACCESS_TOKEN" = "your_access_token_here" ]; then
    echo "❌ Please set SUPABASE_ACCESS_TOKEN in .env file"
    exit 1
fi

if [ -z "$ANTHROPIC_API_KEY" ] || [ "$ANTHROPIC_API_KEY" = "your_anthropic_api_key_here" ]; then
    echo "❌ Please set ANTHROPIC_API_KEY in .env file"
    exit 1
fi

# Start deployment
echo "✅ Environment variables configured"
echo "🐳 Starting Docker deployment..."
echo ""

# Run docker-compose
docker-compose up --build

echo ""
echo "🎉 Deployment completed!"
echo "💡 Check Supabase Dashboard > Edge Functions to verify deployment"
echo "🔗 Test your function at: https://ydevatqwkoccxhtejdor.supabase.co/functions/v1/process-invoice-ocr"