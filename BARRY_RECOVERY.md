# Barry Emergency Recovery Guide

## 🚨 If Barry Breaks - Use This!

### Quick Recovery (5 minutes)
```bash
# Run the emergency recovery script
./scripts/barry-emergency-recovery.sh
```

This script will:
1. Restore all Barry components to their last working state
2. Commit and deploy the recovery automatically
3. Barry should work again in 2-3 minutes

### Manual Recovery (if script fails)
```bash
# Restore components manually
git checkout barry-recovery-backup -- src/components/knowledge/EnhancedBarryChat.tsx
git checkout barry-recovery-backup -- src/components/knowledge/SecureBarryChat.tsx
git checkout barry-recovery-backup -- src/components/wis/BarryChat.tsx
git checkout barry-recovery-backup -- src/hooks/use-secure-chatgpt.ts
git checkout barry-recovery-backup -- src/services/claude/secureClaudeService.ts

# Commit and deploy
git add .
git commit -m "fix: Emergency restore Barry to working state"
git push staging main:main
```

### Backup Information
- **Tag**: `barry-recovery-backup`
- **Commit**: `cfe2a4827`
- **Date**: September 19, 2025, 18:52
- **Status**: Barry fully working with OpenAI GPT-4
- **System**: Frontend uses `useSecureChatGPT` → `chat-with-barry` edge function

### What The Backup Contains
✅ All Barry components working perfectly
✅ OpenAI GPT-4 integration (fast and reliable)
✅ Manual search and WIS integration
✅ User vehicle context
✅ Location-based responses
✅ Full conversation history

### After Recovery
Barry will work with:
- **Frontend**: `useSecureChatGPT` hook
- **Backend**: `chat-with-barry` edge function (OpenAI GPT-4)
- **Cost**: Higher (OpenAI pricing) but guaranteed working
- **Performance**: Good (2-4 second responses)

### If Recovery Still Doesn't Work
1. **Check Environment**: Ensure `OPENAI_API_KEY` is set in Supabase
2. **Check Function**: Verify `chat-with-barry` function is active (version 49)
3. **Check Console**: Look for specific errors in browser console
4. **Contact Support**: If all else fails, this is a system-level issue

---

## 💡 Remember
You're never more than 5 minutes away from having Barry working again!