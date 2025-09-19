#!/bin/bash

# Barry Emergency Recovery Script
# Use this script if Barry breaks and you need to restore him to working state

echo "🚨 BARRY EMERGENCY RECOVERY INITIATED"
echo "This will restore Barry to his last known working state (barry-recovery-backup)"
echo ""

# Confirm with user
read -p "Are you sure you want to restore Barry? This will overwrite current changes. (y/N): " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Recovery cancelled"
    exit 1
fi

echo "🔄 Restoring Barry components from backup..."

# Restore the 3 main Barry components to working state
git checkout barry-recovery-backup -- src/components/knowledge/EnhancedBarryChat.tsx
git checkout barry-recovery-backup -- src/components/knowledge/SecureBarryChat.tsx
git checkout barry-recovery-backup -- src/components/wis/BarryChat.tsx

# Restore the working hook and service
git checkout barry-recovery-backup -- src/hooks/use-secure-chatgpt.ts
git checkout barry-recovery-backup -- src/services/claude/secureClaudeService.ts

echo "✅ Barry components restored to working state"

# Commit the recovery
git add .
git commit -m "🚨 EMERGENCY: Restore Barry to working backup state

- Restored from barry-recovery-backup tag
- Barry should now work with OpenAI GPT-4 system
- All components using useSecureChatGPT hook
- Edge function chat-with-barry (v49) remains active

🤖 Generated with Claude Code

Co-Authored-By: Claude <noreply@anthropic.com>"

echo "📤 Deploying recovery to staging..."
git push staging main:main

echo ""
echo "🎉 BARRY RECOVERY COMPLETE!"
echo ""
echo "Barry has been restored to his last working state using:"
echo "- Frontend: useSecureChatGPT hook"
echo "- Backend: chat-with-barry edge function (OpenAI GPT-4)"
echo "- Backup point: barry-recovery-backup (Sept 19, 18:52)"
echo ""
echo "⏰ Deployment should complete in 2-3 minutes"
echo "🧪 Test Barry on staging: https://unimogcommunity-staging.netlify.app"
echo ""
echo "If Barry still doesn't work after this recovery:"
echo "1. Check Supabase environment has OPENAI_API_KEY set"
echo "2. Verify chat-with-barry edge function is active"
echo "3. Check browser console for specific errors"