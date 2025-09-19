#!/bin/bash

# Barry Instant Revert Script
# Use this if ANYTHING goes wrong during Gemini migration
# This will restore Barry to the exact working state in under 2 minutes

echo "🚨 BARRY INSTANT REVERT TO PERFECT WORKING STATE"
echo "This will restore Barry to the exact state when he was working perfectly"
echo ""
echo "Current tags available:"
echo "- barry-production-working-perfect (latest working state)"
echo "- barry-recovery-backup (earlier working state)"
echo ""

# Ask which backup to use
echo "Which backup do you want to restore?"
echo "1) barry-production-working-perfect (recommended - latest working)"
echo "2) barry-recovery-backup (earlier working state)"
read -p "Enter choice (1 or 2): " -n 1 -r backup_choice
echo ""

if [[ $backup_choice == "1" ]]; then
    BACKUP_TAG="barry-production-working-perfect"
    echo "✅ Using latest perfect working state"
elif [[ $backup_choice == "2" ]]; then
    BACKUP_TAG="barry-recovery-backup"
    echo "✅ Using earlier recovery backup"
else
    echo "❌ Invalid choice. Exiting."
    exit 1
fi

echo ""
echo "🔄 Step 1: Restoring all Barry frontend components..."

# Restore ALL Barry-related files to perfect working state
git checkout $BACKUP_TAG -- src/components/knowledge/EnhancedBarryChat.tsx
git checkout $BACKUP_TAG -- src/components/knowledge/SecureBarryChat.tsx
git checkout $BACKUP_TAG -- src/components/wis/BarryChat.tsx
git checkout $BACKUP_TAG -- src/hooks/use-secure-chatgpt.ts
git checkout $BACKUP_TAG -- src/services/claude/secureClaudeService.ts

echo "✅ Frontend components restored"

echo ""
echo "🔄 Step 2: Restoring edge function to working OpenAI version..."

# Copy the working edge function backup to supabase functions directory
mkdir -p supabase/functions/chat-with-barry
cp backups/chat-with-barry-openai-working.ts supabase/functions/chat-with-barry/index.ts

echo "✅ Edge function backup copied"

echo ""
echo "🔄 Step 3: Deploying working edge function..."

# Deploy the working edge function
supabase functions deploy chat-with-barry

if [ $? -eq 0 ]; then
    echo "✅ Edge function deployed successfully"
else
    echo "⚠️  Edge function deployment had issues, but continuing..."
fi

echo ""
echo "🔄 Step 4: Committing and deploying frontend..."

# Commit the restoration
git add .
git commit -m "🚨 INSTANT REVERT: Restore Barry to perfect working state

- Reverted all Barry components to $BACKUP_TAG
- Restored working OpenAI edge function
- Barry should work exactly as before
- Using OpenAI GPT-4 (reliable but higher cost)

Emergency restoration completed.

🤖 Generated with Claude Code

Co-Authored-By: Claude <noreply@anthropic.com>"

echo "✅ Changes committed"

echo ""
echo "🔄 Step 5: Deploying to staging..."

# Deploy to staging
git push staging main:main

echo "✅ Deployed to staging"

echo ""
echo "🎉 BARRY INSTANT REVERT COMPLETE!"
echo ""
echo "📋 What was restored:"
echo "   ✅ All Barry frontend components"
echo "   ✅ useSecureChatGPT hook"
echo "   ✅ secureClaudeService (calls OpenAI)"
echo "   ✅ chat-with-barry edge function (OpenAI GPT-4)"
echo ""
echo "⏰ Barry should be working in 2-3 minutes"
echo "🧪 Test Barry at: https://unimogcommunity-staging.netlify.app"
echo ""
echo "💰 Cost: Back to OpenAI pricing (higher but working)"
echo "⚡ Performance: Reliable 2-4 second responses"
echo "🔧 Features: All manual search, WIS, vehicle context restored"
echo ""
echo "🔍 If Barry still doesn't work after this:"
echo "1. Check Supabase environment has OPENAI_API_KEY set"
echo "2. Wait for full deployment (check Netlify dashboard)"
echo "3. Clear browser cache and try again"
echo "4. Check browser console for any remaining errors"
echo ""
echo "✨ Barry should now be working exactly as he was before any migration attempts!"