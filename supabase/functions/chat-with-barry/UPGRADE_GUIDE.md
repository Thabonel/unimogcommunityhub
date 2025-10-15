# Barry AI Model Hot-Swap System - Upgrade Guide

## What This System Does

Allows you to switch AI models **instantly** without redeployment:
- Change from GPT-4o to Claude Haiku 4.5 in seconds
- Switch providers (OpenAI → Anthropic → Google) via database update
- Zero downtime - no code changes required
- Automatic fallback if primary model fails
- Admin UI for easy model management

## Architecture

```
┌─────────────────────────────────────┐
│   ai_model_config (Database)        │
│   - barry_query_expansion           │
│   - barry_reranking                 │
│   - barry_verification              │
│   - barry_main_response             │
└─────────────────────────────────────┘
            ↓ (read on every request)
┌─────────────────────────────────────┐
│   AIProviderAdapter                 │
│   - OpenAI support                  │
│   - Anthropic support               │
│   - Google support                  │
│   - Automatic fallback              │
└─────────────────────────────────────┘
            ↓
┌─────────────────────────────────────┐
│   Unified Response Format           │
│   - content                         │
│   - usage (tokens)                  │
│   - model name                      │
│   - provider name                   │
└─────────────────────────────────────┘
```

## How to Update index.ts

### OLD CODE (Lines 400-450 approx - Query Expansion):
```typescript
const expandResponse = await fetch(OPENAI_API_URL, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${OPENAI_API_KEY}`
  },
  body: JSON.stringify({
    model: 'gpt-4o-mini',
    messages: [...],
    temperature: 0.3
  })
});
```

### NEW CODE:
```typescript
import { AIProviderAdapter, getModelConfig } from './ai-provider-adapter.ts';

// Load config from database
const expandConfig = await getModelConfig(supabaseClient, 'barry_query_expansion');
const expandAdapter = new AIProviderAdapter(expandConfig);

// Make request
const expandResponse = await expandAdapter.chat([
  { role: 'system', content: 'You are a search query...' },
  { role: 'user', content: userQuestion }
]);

const terms = JSON.parse(expandResponse.content);
```

## How to Switch Models (ZERO DOWNTIME)

### Method 1: Direct SQL (Instant)
```sql
-- Switch main response to Claude Haiku 4.5
UPDATE ai_model_config
SET
  provider = 'anthropic',
  model_name = 'claude-3-5-haiku-20241022',
  api_key_env_var = 'ANTHROPIC_API_KEY'
WHERE service_name = 'barry_main_response';

-- Takes effect on NEXT request (< 1 second)
```

### Method 2: Admin UI (Coming Next)
1. Go to `/admin` → AI Models tab
2. Click "Edit" on barry_main_response
3. Select Provider: Anthropic
4. Select Model: Claude 3.5 Haiku
5. Click "Save"
6. Done! Next user request uses new model

### Method 3: Supabase MCP (From Claude Code)
```typescript
mcp__supabase__execute_sql({
  query: `
    UPDATE ai_model_config
    SET provider = 'anthropic',
        model_name = 'claude-3-5-haiku-20241022'
    WHERE service_name = 'barry_main_response'
  `
});
```

## Environment Variables Needed

Add to Netlify/Supabase:
```bash
OPENAI_API_KEY=<OPENAI_API_KEY>           # Already have
ANTHROPIC_API_KEY=<ANTHROPIC_API_KEY>    # Add this
GOOGLE_API_KEY=AIza...          # Optional
```

## Model Recommendations by Task

### Query Expansion (Fast, Cheap)
- **Current**: gpt-4o-mini ($0.000015/1K tokens)
- **Alternative**: claude-3-5-haiku-20241022 ($0.00025/1K tokens)
- **Best**: gpt-4o-mini (16x cheaper, equally good)

### Reranking (Fast, Cheap)
- **Current**: gpt-4o-mini
- **Alternative**: claude-3-5-haiku-20241022
- **Best**: gpt-4o-mini (simple scoring task)

### Main Response (Quality Matters)
- **Current**: gpt-4o ($0.0025/1K tokens input)
- **Alternative**: claude-3-5-haiku-20241022 ($0.0008/1K tokens input)
- **Best for Cost**: Claude Haiku (3x cheaper, similar quality)
- **Best for Quality**: claude-3-5-sonnet-20241022 (best reasoning)

## Testing the System

### 1. Apply Migration
```bash
# From Supabase SQL Editor
# Paste contents of: 20251016000000_create_ai_model_config.sql
```

### 2. Test Adapter (Edge Function Logs)
```typescript
// Add to index.ts temporarily
console.log('🔧 Testing model config...');
const config = await getModelConfig(supabaseClient, 'barry_main_response');
console.log('✅ Config loaded:', config);
```

### 3. Live Switch Test
```sql
-- Switch to Claude
UPDATE ai_model_config SET provider = 'anthropic', model_name = 'claude-3-5-haiku-20241022'
WHERE service_name = 'barry_main_response';

-- Ask Barry a question → Check logs for "anthropic" provider

-- Switch back to OpenAI
UPDATE ai_model_config SET provider = 'openai', model_name = 'gpt-4o'
WHERE service_name = 'barry_main_response';

-- Ask Barry again → Check logs for "openai" provider
```

## Fallback Configuration

Set automatic fallback if primary fails:
```sql
UPDATE ai_model_config
SET
  fallback_provider = 'openai',
  fallback_model = 'gpt-4o-mini'
WHERE service_name = 'barry_main_response';
```

If Anthropic API is down → automatically uses OpenAI fallback

## Migration Steps (Recommended Order)

1. **Apply Database Migration** ✅
   - Creates ai_model_config table
   - Populates with current OpenAI models

2. **Add Environment Variables**
   - Add ANTHROPIC_API_KEY to Supabase Edge Functions
   - Test with: `Deno.env.get('ANTHROPIC_API_KEY')`

3. **Update index.ts** (Incremental)
   - Start with main response only (lowest risk)
   - Test thoroughly
   - Then update query expansion, reranking, verification

4. **Deploy to Staging**
   - Test model switching
   - Verify fallback works
   - Check logs for errors

5. **Create Admin UI**
   - Add Models tab to /admin
   - CRUD operations on ai_model_config
   - Real-time model preview

6. **Deploy to Production**
   - Monitor first 100 requests
   - Have OpenAI fallback configured
   - Ready to switch if issues arise

## Cost Comparison (Per 1000 User Queries)

### Current: OpenAI Only
- Query expansion: 500 tokens × $0.000015 = $0.0075
- Reranking: 200 tokens × $0.000015 = $0.003
- Verification: 200 tokens × $0.000015 = $0.003
- Main response: 1500 tokens × $0.0025 = $3.75
- **Total: $3.76 per 1000 queries**

### Hybrid: Haiku for Main, OpenAI for Tools
- Query expansion: $0.0075 (keep OpenAI)
- Reranking: $0.003 (keep OpenAI)
- Verification: $0.003 (keep OpenAI)
- Main response: 1500 tokens × $0.0008 = $1.20
- **Total: $1.21 per 1000 queries (68% cost reduction!)**

### Premium: Claude Sonnet for Main
- Tools: $0.0135 (keep OpenAI)
- Main response: 1500 tokens × $0.003 = $4.50
- **Total: $4.51 per 1000 queries (better quality, slight increase)**

## Next Steps

**Immediate (Required for Hot-Swap)**:
1. Apply database migration ✅
2. Add ANTHROPIC_API_KEY to environment
3. Update index.ts to use AIProviderAdapter
4. Test switching via SQL

**Soon (Better UX)**:
5. Build admin UI for model management
6. Add model performance metrics
7. A/B testing framework

**Future (Advanced)**:
8. Auto-failover monitoring
9. Cost tracking per model
10. Response quality scoring
11. Automatic model selection based on query complexity
