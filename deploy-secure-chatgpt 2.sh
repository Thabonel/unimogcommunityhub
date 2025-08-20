#!/bin/bash

# Deployment script for secure ChatGPT integration

echo "🚀 Deploying Secure ChatGPT Integration"
echo "======================================="
echo ""

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo "❌ Supabase CLI not found. Please install it first:"
    echo "   npm install -g supabase"
    exit 1
fi

echo "✅ Supabase CLI found"
echo ""

# Get project reference
echo "📋 Please enter your Supabase project reference:"
echo "   (You can find this in your Supabase dashboard URL)"
echo "   Example: abcdefghijklmnop"
read -p "Project ref: " PROJECT_REF

if [ -z "$PROJECT_REF" ]; then
    echo "❌ Project reference is required"
    exit 1
fi

# Link the project
echo ""
echo "🔗 Linking Supabase project..."
supabase link --project-ref $PROJECT_REF

if [ $? -ne 0 ]; then
    echo "❌ Failed to link project"
    exit 1
fi

echo "✅ Project linked successfully"

# Deploy the Edge Function
echo ""
echo "📦 Deploying chat-with-barry Edge Function..."
supabase functions deploy chat-with-barry

if [ $? -ne 0 ]; then
    echo "❌ Failed to deploy Edge Function"
    exit 1
fi

echo "✅ Edge Function deployed successfully"

# Show next steps
echo ""
echo "🎉 Deployment Complete!"
echo ""
echo "📋 Next Steps:"
echo "1. Run the database migration in your Supabase SQL editor:"
echo "   - Go to: https://app.supabase.com/project/$PROJECT_REF/sql"
echo "   - Copy and run the contents of:"
echo "     supabase/migrations/20240106_chat_rate_limits.sql"
echo ""
echo "2. Update your .env file:"
echo "   - Remove VITE_OPENAI_API_KEY (no longer needed)"
echo ""
echo "3. Test the integration:"
echo "   - Start your dev server: npm run dev"
echo "   - Log in to your account"
echo "   - Go to Knowledge Base > AI Mechanic"
echo "   - Chat with Barry!"
echo ""
echo "4. Monitor logs:"
echo "   supabase functions logs chat-with-barry --tail"
echo ""
echo "✨ Your ChatGPT integration is now secure!"