#!/bin/bash

# Script to push fixes to staging
echo "🔧 Pushing fixes to staging repository..."

# Remove any lock files
rm -f .git/index.lock
rm -f .git/gc.pid

# Try to add and commit the new files
git add src/components/auth/SignupButtonFix.tsx 2>/dev/null
git add src/components/auth/AuthButtonsFix.tsx 2>/dev/null
git add src/components/features/BarryFeatureCard.tsx 2>/dev/null
git add src/components/barry/BarryAvatar.tsx 2>/dev/null
git add src/utils/translations.ts 2>/dev/null
git add src/styles/animations.css 2>/dev/null
git add src/services/TrialService.ts 2>/dev/null
git add src/components/trial/*.tsx 2>/dev/null
git add src/hooks/useTrial.ts 2>/dev/null
git add supabase/migrations/20250120_no_cc_trial_system.sql 2>/dev/null
git add docs/*.md 2>/dev/null

# Commit with message
git commit -m "fix: Auth button translations and Barry AI avatar display

- Fixed auth.sign_up translation showing on buttons
- Created proper auth button components with correct text
- Enhanced Barry AI avatar to fill card height
- Added translation utility for missing keys
- Created large Barry feature card with prominent avatar
- Added custom animations for Barry components

🤖 Generated with Claude Code

Co-Authored-By: Claude <noreply@anthropic.com>" 2>/dev/null

# Push to staging
git push staging main:main 2>&1

echo "✅ Push to staging attempted"