# Barry Web Search Implementation - January 2026

## Summary

Added web search capability to Barry using the Brave Search API. When users ask questions like "find me an HX35 turbo in Australia", Barry now searches the web and includes relevant supplier links in the response.

## Problem Statement

Barry could not search the internet to help users find parts, suppliers, or external information. When asked "find me an HX35 turbo in Australia", Barry would respond that he couldn't browse the web.

**User Request**: Add web search so Barry can find parts suppliers, prices, and availability online.

## Solution Architecture

### API Selection: Brave Search

| API | Cost (1,000/mo) | Free Tier | Quality Score | Latency |
|-----|-----------------|-----------|---------------|---------|
| **Brave Search** | **$0** | 2,000/mo | 14.89 (best) | 669ms |
| Tavily | $0-8 | 1,000 credits | 13.67 | 998ms |
| Google Custom | $0 | 100/day | Excellent | Fast |
| SerpAPI | $75/mo | Trial only | Good | Variable |

**Why Brave Search**:
- Free tier covers 2,000 searches/month
- Best benchmark performance for AI agents
- Lowest latency (669ms)
- Independent index (35B+ pages)
- Supports Australian localization (`country=AU`)

### Implementation Pattern

Following Barry's "Forever Architecture" pattern - adding a pluggable context gatherer without modifying core routing logic:

```
User Query
    |
    v
[Detect Purchase/Search Intent]
    |
    v (if detected)
[Web Search Gatherer] <-- NEW
    |
    v
[Inject results into systemPrompt]
    |
    v
[Single Claude API call]
    |
    v
[Response with web citations]
```

## Files Changed

### Backend (Edge Function)

**File**: `supabase/functions/chat-with-barry-agentic/index.ts`

1. Added feature flag and API key constants:
```typescript
const FEATURE_FLAG_WEB_SEARCH = (Deno.env.get('FEATURE_FLAG_WEB_SEARCH') || '').toLowerCase() === 'true';
const BRAVE_SEARCH_API_KEY = Deno.env.get('BRAVE_SEARCH_API_KEY');
```

2. Added web search gatherer functions:
- `detectWebSearchIntent()` - Detects purchase intent + product mentions
- `searchBrave()` - Calls Brave Search API
- `formatWebSearchContext()` - Formats results for system prompt
- `extractPrice()` - Extracts prices from descriptions

3. Integrated gatherer into main flow (after weather gatherer)

4. Updated response format to include `webSearchResults`

5. Fixed CORS headers to include `x-supabase-client-platform`

### Frontend

**File**: `src/services/claude/secureGeminiService.ts`
- Added `WebSearchResult` interface
- Added handling for `webSearchResults` in response
- Added `lastWebSearchResults` state and getter

**File**: `src/hooks/use-secure-gemini.ts`
- Added `webSearchResults` state
- Exposed `webSearchResults` in hook return

**File**: `src/components/knowledge/SecureBarryChat.tsx`
- Added imports for `ExternalLink` and `Search` icons
- Added web search results display as clickable cards

## Intent Detection Logic

**Search Intent Keywords**:
```
find, buy, purchase, where can i get, supplier,
for sale, price, cost, shop, store, online,
australia, ebay, marketplace, second hand, used,
who sells, where to buy, order, stock, availability
```

**Product Keywords**:
```
turbo, part, seal, bearing, pump, filter, hose, gasket, brake,
clutch, axle, wheel, tire, engine, gearbox, transmission, diff,
alternator, starter, radiator, injector, valve, piston, cylinder,
manifold, exhaust, muffler, spring, shock, bushing, u-joint
```

Detection requires BOTH a search intent keyword AND a product keyword.

## Environment Variables Required

Add these to Supabase Edge Function secrets:

```
BRAVE_SEARCH_API_KEY=<your-brave-api-key>
FEATURE_FLAG_WEB_SEARCH=true
```

Get your API key from: https://api.search.brave.com/

## Deployment Steps

1. **Code is pushed to staging** (commits 1036f384c, 7d8f9a7d4)

2. **Deploy Edge Function**:
```bash
npx supabase login
npx supabase functions deploy chat-with-barry-agentic
```

3. **Add Secrets** in Supabase Dashboard -> Edge Functions -> Secrets

4. **Test Query**: "find me an HX35 turbo in Australia"

## Expected Behavior

When a user asks a purchase-related question:

1. Barry detects purchase intent + product mention
2. Searches Brave API for "query + Unimog" with country=AU
3. Returns up to 5 results with title, URL, description, price
4. Injects results into system prompt
5. Claude generates response referencing the web results
6. Frontend displays clickable result cards below the message

## Cost Analysis

| Usage | Searches | Cost |
|-------|----------|------|
| Free tier | 2,000/month | $0 |
| Light usage (estimated) | 500/month | $0 |
| Heavy usage | 5,000/month | $15 |

## Rollback Plan

To disable web search without code changes:
- Set `FEATURE_FLAG_WEB_SEARCH` to empty string or `false`
- Or remove `BRAVE_SEARCH_API_KEY` secret

## Issues Encountered

### CORS Error

**Problem**: After deploying frontend, got CORS error:
```
Request header field x-supabase-client-platform is not allowed by Access-Control-Allow-Headers
```

**Cause**: Supabase JS client now sends a new header that wasn't in the allowed list.

**Solution**: Added `x-supabase-client-platform` to CORS headers:
```typescript
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform',
};
```

## Linear Issue

[WHE-101: feat(barry): Add Web Search Capability using Brave Search API](https://linear.app/wheels-and-wins/issue/WHE-101/featbarry-add-web-search-capability-using-brave-search-api)

## Git Commits

1. `1036f384c` - feat(barry): Add web search capability using Brave Search API
2. `7d8f9a7d4` - fix(barry): Add x-supabase-client-platform to CORS headers

## Date

January 27, 2026
