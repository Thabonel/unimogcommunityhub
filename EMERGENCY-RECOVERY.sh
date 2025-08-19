#!/bin/bash

# EMERGENCY RECOVERY SCRIPT
# Use this if the authentication system breaks after changes
# This will restore the last known working state

echo "🚨 EMERGENCY RECOVERY - Restoring to last known working state"
echo "================================================"
echo ""

# The last known working commit
WORKING_COMMIT="22c5775"
WORKING_MESSAGE="Remove complex recovery system and fix Invalid API key error"

echo "📍 Current branch: $(git branch --show-current)"
echo "📍 Current commit: $(git rev-parse --short HEAD)"
echo ""
echo "🔄 Reverting to commit: $WORKING_COMMIT"
echo "   Message: $WORKING_MESSAGE"
echo ""

read -p "⚠️  This will FORCE reset to the working state. Continue? (y/N): " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]
then
    echo ""
    echo "🔧 Resetting to working state..."
    git reset --hard $WORKING_COMMIT
    
    echo "📤 Force pushing to origin/main..."
    git push --force origin main
    
    echo "📤 Force pushing to staging/main..."
    git push --force staging main
    
    echo ""
    echo "✅ RECOVERY COMPLETE!"
    echo "   The site has been restored to the last known working state."
    echo "   Commit: $WORKING_COMMIT"
    echo ""
    echo "📝 Next steps:"
    echo "   1. Wait for deployment to complete (2-3 minutes)"
    echo "   2. Test the site to confirm it's working"
    echo "   3. Review what went wrong before trying again"
else
    echo ""
    echo "❌ Recovery cancelled. No changes made."
fi