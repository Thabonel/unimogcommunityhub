# Two-Mode Barry: Mechanic + Helper Implementation

**Date**: October 17, 2025
**Status**: ✅ CODE COMPLETE - Ready for deployment
**Version**: v90 (Two-Mode Barry)

## Overview

Barry now has TWO distinct personalities that automatically activate based on question intent:

### 🔧 Mechanic Barry (Technical Mode)
- **Triggers**: Unimog mechanical/technical questions
- **Behavior**: Searches manuals → Verifies relevance → Returns PDF citations
- **Web Search**: DISABLED (manual-only mode)
- **Examples**:
  - "How do I replace the radiator?"
  - "Tell me about the parking brake system"
  - "What's the oil capacity?"

### 🤝 Helper Barry (General Assistant Mode)
- **Triggers**: General questions, weather, trip planning
- **Behavior**: Web search enabled + User context + Extended thinking
- **Manual Search**: Optional (only if highly relevant >0.7 score)
- **Examples**:
  - "What's the weather tomorrow?"
  - "Plan a trip to the Outback"
  - "Where can I buy Unimog parts in Sydney?"

## The Magic: Intelligent Routing

**No more brittle keyword matching!**

```typescript
// OLD WAY (Removed):
if (query.includes('radiator') || query.includes('brake')) {
  searchManuals();
}

// NEW WAY:
const mode = await routeBarryMode(query, supabaseClient);
// Claude Haiku 4.5 decides: MECHANIC or HELPER
```

The routing AI analyzes query intent and chooses the appropriate mode automatically.

## Implementation Details

### Files Modified

1. **`/supabase/functions/chat-with-barry/model-adapter-simple.ts`**
   - Added `options` parameter with `enableWebSearch` and `enableExtendedThinking`
   - Updated `callAnthropic()` to support web search tool
   - Logs when web search/extended thinking are enabled

2. **`/supabase/functions/chat-with-barry/index.ts`**
   - Removed `isTechnicalQuestion()` keyword-based function
   - Added `routeBarryMode()` intelligent routing function
   - Split execution flow: Mechanic vs Helper paths
   - Helper mode: web search + extended thinking enabled
   - Mechanic mode: traditional manual search + PDF citations

3. **`/supabase/migrations/20251017_migrate_barry_to_claude_haiku_45.sql`**
   - Migrates 3 services from OpenAI to Claude Haiku 4.5
   - Adds `barry_routing` service (new)
   - Sets fallback to OpenAI GPT-4o-mini

### AI Model Configuration

**All services now use Claude Haiku 4.5:**

| Service | Provider | Model | Fallback |
|---------|----------|-------|----------|
| `barry_main_response` | Anthropic | claude-haiku-4-5 | gpt-4o-mini |
| `barry_query_expansion` | Anthropic | claude-haiku-4-5 | gpt-4o-mini |
| `barry_reranking` | Anthropic | claude-haiku-4-5 | gpt-4o-mini |
| `barry_verification` | Anthropic | claude-haiku-4-5 | gpt-4o-mini |
| `barry_routing` | Anthropic | claude-haiku-4-5 | gpt-4o-mini |

### Web Search Tool Integration

**Anthropic's Web Search API** (May 2025 release):
- **Cost**: $10 per 1,000 searches (~$0.01 per query)
- **Enabled for**: Helper Barry mode only
- **Use cases**: Weather, current events, locations, trip planning
- **Implementation**: Automatic via Claude API tool parameter

```typescript
// Helper mode enables web search:
const result = await callAI(
  supabaseClient,
  'barry_main_response',
  messages,
  {
    enableWebSearch: true,  // Helper Barry
    enableExtendedThinking: true  // Helper Barry
  }
);
```

## How It Works

### User Query Flow

```
User asks question
    ↓
1. Check curated knowledge base (admin FAQs)
    ↓ (if no match)
2. Intelligent routing (Claude Haiku 4.5)
    ↓
    MECHANIC?              HELPER?
    ↓                      ↓
3a. Search manuals      3b. Enable web search
    Verify pages            Optional manual search
    Inject context          User context
    ↓                      ↓
4. Generate response with:
   - Mechanic: PDF citations, manual-grounded
   - Helper: Real-time data, web sources, extended thinking
```

### Example Scenarios

#### Scenario 1: Technical Question
**User**: "How do I replace the radiator?"
```
→ Routing: MECHANIC
→ Searches manuals
→ Finds: U435_12_Cooling_System.pdf, pages 15-18
→ Returns: Answer + clickable PDF citations
→ Web search: DISABLED
```

#### Scenario 2: Weather Query
**User**: "What's the weather tomorrow?"
```
→ Routing: HELPER
→ Manual search: (optional, low relevance)
→ Web search: ENABLED
→ Extended thinking: ENABLED
→ Returns: Real weather forecast from web
→ Citations: None (no manual relevance)
```

#### Scenario 3: Hybrid Question
**User**: "Best camping spots near Sydney with good Unimog trails?"
```
→ Routing: HELPER
→ Manual search: Checks for trail recommendations (>0.7 threshold)
→ Web search: ENABLED (current camping info)
→ Extended thinking: ENABLED (route optimization)
→ Returns: Web results + optional manual citations if relevant
```

## Benefits

### 1. No More Keyword Maintenance
- ❌ OLD: Add keywords manually for every new component/topic
- ✅ NEW: AI routing handles intent automatically

### 2. Accurate Real-Time Data
- ❌ OLD: Barry hallucinated weather forecasts
- ✅ NEW: Helper Barry fetches real weather via web search

### 3. Better User Experience
- ❌ OLD: Technical questions without keywords → no citations
- ✅ NEW: Mechanic mode always searches manuals

### 4. Appropriate Citations
- ❌ OLD: Generic questions got random manual citations
- ✅ NEW: Manual citations only when truly relevant

### 5. Full Claude Haiku 4.5 Capabilities
- Extended thinking for complex reasoning
- Web search for real-time information
- 200K context window
- 64K max output tokens

## Cost Analysis

### Before (GPT-4o-mini mix):
- Main response: Claude 3.5 Haiku
- Query/rerank/verify: OpenAI GPT-4o-mini
- **Cost**: ~$0.012 per query
- **Limitation**: No web search, hallucinated data

### After (All Claude Haiku 4.5 + web search):
- All services: Claude Haiku 4.5
- Routing decision: +$0.001
- Web search (Helper mode): +$0.01 per search
- **Cost**: ~$0.015-0.025 per query (depends on mode)
- **Benefit**: Real data, better accuracy, no hallucinations

### Cost Breakdown:
- **Mechanic queries**: ~$0.015 (no web search)
- **Helper queries**: ~$0.025 (includes web search)
- **Net**: Worth the cost for accurate weather/trip data

## Testing Checklist

### Mechanic Barry (Manual Search):
- [ ] "How do I replace the radiator?" → Shows PDF citations
- [ ] "Tell me about the parking brake" → Shows PDF citations
- [ ] "What's the oil capacity?" → Shows PDF citations
- [ ] "How does the portal axle work?" → Shows PDF citations

### Helper Barry (Web Search):
- [ ] "What's the weather tomorrow?" → Real forecast (not hallucinated)
- [ ] "Plan a trip to the Outback" → Current road conditions
- [ ] "Where can I buy Unimog parts in Sydney?" → Web results
- [ ] "What's a good camping spot near me?" → Current info

### Edge Cases:
- [ ] "Tell me about the radiator" → Mechanic mode (manual search)
- [ ] "Radiator weather seal recommendations" → Helper mode (general advice)
- [ ] Mixed technical/general questions → Appropriate mode selection

## Deployment Steps

1. **Apply database migration**:
   ```bash
   supabase db push
   # Or via Supabase CLI:
   psql -f supabase/migrations/20251017_migrate_barry_to_claude_haiku_45.sql
   ```

2. **Deploy Edge Function** (already auto-deployed on git push)

3. **Test both modes**:
   - Technical question → Verify PDF citations
   - Weather question → Verify real forecast

4. **Monitor logs**:
   - Check routing decisions: "🔧 Routing to MECHANIC" vs "🤝 Routing to HELPER"
   - Verify web search activation: "🌐 Web search enabled"
   - Check extended thinking: "🧠 Extended thinking enabled"

5. **Cost monitoring**:
   - Track web search usage
   - Monitor Claude API calls
   - Ensure within budget

## Rollback Plan

If issues occur:

1. **Revert database**:
   ```sql
   UPDATE ai_model_config
   SET provider = 'openai', model_name = 'gpt-4o-mini'
   WHERE service_name IN ('barry_query_expansion', 'barry_reranking', 'barry_verification');

   DELETE FROM ai_model_config WHERE service_name = 'barry_routing';
   ```

2. **Revert code**:
   ```bash
   git revert [commit-hash]
   git push staging main:main
   ```

## Success Metrics

After deployment, verify:
- ✅ Weather queries return accurate forecasts
- ✅ Technical queries return PDF citations
- ✅ Routing decisions are appropriate (check logs)
- ✅ No increase in "I don't know" responses
- ✅ User satisfaction improves

## Future Enhancements

Potential improvements:
- **User feedback loop**: Let users rate routing decisions
- **Adaptive thresholds**: Tune 0.5 (Mechanic) vs 0.7 (Helper) based on data
- **Hybrid mode**: Enable web search + manuals for complex queries
- **Cost optimization**: Cache frequent weather lookups

## Summary

Two-Mode Barry is a **major upgrade** that gives Barry the right tool for every job:
- **Mechanic Barry** for technical Unimog questions (manual-grounded, safe)
- **Helper Barry** for general questions (web-enabled, current data)

No more brittle keyword matching. No more hallucinated weather. Just the right Barry, every time.
