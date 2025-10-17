# Two-Mode Barry Deployment Guide

**Version**: v90
**Date**: October 17, 2025

## Pre-Deployment Checklist

- ✅ Code changes complete (model-adapter-simple.ts, index.ts)
- ✅ Migration SQL created
- ✅ Documentation written
- ⏳ Database migration pending
- ⏳ Testing pending
- ⏳ Staging deployment pending

## Step-by-Step Deployment

### 1. Apply Database Migration

**IMPORTANT**: Run this FIRST before pushing code changes.

```bash
# Option A: Via Supabase Dashboard
1. Go to https://supabase.com/dashboard/project/ydevatqwkoccxhtejdor/editor
2. Open SQL Editor
3. Paste contents of: supabase/migrations/20251017_migrate_barry_to_claude_haiku_45.sql
4. Run query
5. Verify output shows all 5 services updated

# Option B: Via CLI (if you have supabase CLI)
supabase db push

# Option C: Via MCP tool (after exiting plan mode)
mcp__supabase__apply_migration(...)
```

**Expected output**:
```
5 services configured:
- barry_main_response (already Claude Haiku 4.5)
- barry_query_expansion (OpenAI → Claude Haiku 4.5)
- barry_reranking (OpenAI → Claude Haiku 4.5)
- barry_verification (OpenAI → Claude Haiku 4.5)
- barry_routing (NEW)
```

### 2. Commit and Push to Staging

```bash
git add -A
git commit -m "feat(barry): implement two-mode Barry with intelligent routing and web search

Barry now has two distinct modes:
- Mechanic Barry: Technical questions → manual search + PDF citations
- Helper Barry: General questions → web search + real-time data

Changes:
- Intelligent routing via Claude Haiku 4.5 (replaces keyword matching)
- Web search enabled for Helper mode (weather, trip planning)
- Extended thinking for complex reasoning
- Migrated all services to Claude Haiku 4.5
- Added barry_routing service for mode selection

Benefits:
- No more keyword maintenance
- Accurate weather forecasts (no hallucination)
- Appropriate citations (only when relevant)
- Better user experience

🤖 Generated with Claude Code

Co-Authored-By: Claude <noreply@anthropic.com>"

git push staging main:main
```

### 3. Monitor Deployment

Watch Netlify staging build:
```
https://app.netlify.com/sites/unimogcommunity-staging/deploys
```

Look for:
- ✅ Build completes successfully
- ✅ Edge Function deployed
- ✅ No TypeScript errors

### 4. Test Mechanic Barry

Go to staging Barry page and test technical questions:

**Test 1**: "How do I replace the radiator?"
- Expected: Manual search → PDF citations shown
- Log should show: "🔧 Routing to MECHANIC BARRY"

**Test 2**: "Tell me about the parking brake system"
- Expected: Manual search → PDF citations shown
- Log should show: "🔧 Routing to MECHANIC BARRY"

**Test 3**: "What's the oil capacity?"
- Expected: Manual search → PDF citations shown
- Log should show: "🔧 Routing to MECHANIC BARRY"

### 5. Test Helper Barry

**Test 4**: "What's the weather tomorrow?"
- Expected: Real weather forecast (not hallucinated)
- Log should show: "🤝 Routing to HELPER BARRY"
- Log should show: "🌐 Web search enabled"
- Verify forecast matches actual weather

**Test 5**: "Plan a trip to the Outback"
- Expected: Current road conditions, recommendations
- Log should show: "🤝 Routing to HELPER BARRY"
- Log should show: "🧠 Extended thinking enabled"

**Test 6**: "Where can I buy Unimog parts in Sydney?"
- Expected: Web results with locations
- Log should show: "🤝 Routing to HELPER BARRY"

### 6. Check Logs

View Edge Function logs in Supabase:
```
https://supabase.com/dashboard/project/ydevatqwkoccxhtejdor/logs/edge-functions
```

Look for:
- Routing decisions: MECHANIC vs HELPER
- Web search activation
- Extended thinking activation
- No errors or warnings

### 7. Verify Cost Tracking

Check Anthropic API usage:
```
https://console.anthropic.com/usage
```

Monitor:
- Claude Haiku 4.5 API calls
- Web search calls ($10/1000 searches)
- Ensure within expected range (~$0.015-0.025 per query)

### 8. Production Deployment (Only After Approval)

**DO NOT deploy to production without explicit permission.**

After staging testing is successful:
1. Get user approval
2. Run same tests on production
3. Monitor for 24 hours
4. Check user feedback

```bash
# Production deployment (ONLY WITH PERMISSION)
git push origin main
```

## Troubleshooting

### Issue: "No config found for barry_routing"

**Solution**: Database migration didn't run. Go back to Step 1.

### Issue: Weather still hallucinated

**Possible causes**:
1. Routing chose MECHANIC mode instead of HELPER
2. Web search not enabled in API call
3. Anthropic API key not set

**Debug**:
```bash
# Check logs for routing decision
# Should see: "🤝 Routing to HELPER BARRY"
# And: "🌐 Web search enabled"
```

### Issue: No PDF citations on technical questions

**Possible causes**:
1. Routing chose HELPER mode instead of MECHANIC
2. Manual search failed
3. Verification filtered out all results

**Debug**:
```bash
# Check logs for routing decision
# Should see: "🔧 Routing to MECHANIC BARRY"
# And manual search logs
```

### Issue: "Invalid API key" errors

**Solution**: Verify ANTHROPIC_API_KEY is set in Netlify environment variables.

## Rollback Procedure

If critical issues occur:

### 1. Revert Code
```bash
git revert HEAD
git push staging main:main
```

### 2. Revert Database
```sql
UPDATE ai_model_config
SET provider = 'openai', model_name = 'gpt-4o-mini'
WHERE service_name IN ('barry_query_expansion', 'barry_reranking', 'barry_verification');

DELETE FROM ai_model_config WHERE service_name = 'barry_routing';
```

## Success Criteria

Deployment is successful when:
- ✅ Technical questions return PDF citations
- ✅ Weather queries return accurate forecasts
- ✅ Routing decisions are appropriate (check logs)
- ✅ No increase in errors
- ✅ Response times < 5 seconds
- ✅ User satisfaction maintained or improved

## Next Steps After Deployment

1. Monitor for 24 hours
2. Collect user feedback
3. Analyze routing decisions
4. Tune thresholds if needed
5. Consider production deployment

## Contact

If issues occur:
- Check logs first
- Review troubleshooting section
- Ask user before making changes
