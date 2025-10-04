#!/bin/bash

# Deploy SMS Notification Edge Function to Supabase
# Run from project root: bash scripts/deploy-sms-function.sh

echo "🚀 Deploying send-admin-sms Edge Function..."

# Check if supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo "❌ Supabase CLI not installed"
    echo "Install: brew install supabase/tap/supabase"
    exit 1
fi

# Deploy function
supabase functions deploy send-admin-sms \
  --project-ref ydevatqwkoccxhtejdor \
  --no-verify-jwt

if [ $? -eq 0 ]; then
    echo "✅ Edge Function deployed successfully!"
    echo ""
    echo "Next steps:"
    echo "1. Apply database migration (run setup-sms-db.sh)"
    echo "2. Set up cron job in Supabase SQL Editor"
    echo "3. Test from Admin Panel"
else
    echo "❌ Deployment failed"
    exit 1
fi
