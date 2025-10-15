# AI Model Hot-Swap System

## Problem Statement

**Risk**: AI model providers frequently deprecate models (e.g., GPT-4o discontinued then reinstated). If a model is shut down, the SaaS stops working.

**Solution**: Database-driven model configuration with instant switching capability.

## Zero-Downtime Model Switching

Switch models in **< 1 second** via database update - no redeployment needed.

### Quick Switch Example
```sql
-- Switch Barry from GPT-4o to Claude Haiku 4.5
UPDATE ai_model_config
SET provider = 'anthropic',
    model_name = 'claude-3-5-haiku-20241022'
WHERE service_name = 'barry_main_response';
-- Takes effect on NEXT request
```

## Architecture

### Components Created

1. **Database Table** (`ai_model_config`)
   - Stores model configuration for each service
   - RLS enabled (admin access only)
   - Updated without redeployment

2. **AI Provider Adapter** (`ai-provider-adapter.ts`)
   - Unified interface for OpenAI, Anthropic, Google
   - Automatic fallback on provider failure
   - Consistent response format

3. **Admin UI** (`AIModelConfig.tsx`)
   - Visual model management
   - Real-time switching
   - Fallback configuration

## Supported Providers

### OpenAI
- Models: `gpt-4o`, `gpt-4o-mini`, `gpt-4-turbo`
- Env Var: `OPENAI_API_KEY`
- Best For: Cost-effective tasks (reranking, verification)

### Anthropic
- Models: `claude-3-5-sonnet-20241022`, `claude-3-5-haiku-20241022`, `claude-3-opus-20240229`
- Env Var: `ANTHROPIC_API_KEY`
- Best For: Complex reasoning, better instruction following

### Google
- Models: `gemini-1.5-pro`, `gemini-1.5-flash`, `gemini-2.0-flash-exp`
- Env Var: `GOOGLE_API_KEY`
- Best For: Multimodal tasks (future)

## Services Configured

Barry uses 4 separate models for different tasks:

1. **barry_query_expansion** - Extracts search terms from questions
2. **barry_reranking** - Scores search results (0.0-1.0)
3. **barry_verification** - Verifies page relevance
4. **barry_main_response** - Generates final answer to users

## How to Switch Models

### Method 1: Admin UI (Recommended)
1. Navigate to `/admin` → AI Models tab
2. Click "Edit" on the service you want to change
3. Select new Provider and Model
4. Optional: Configure fallback
5. Click "Save"
6. Changes take effect immediately

### Method 2: Direct SQL
```sql
-- Check current config
SELECT service_name, provider, model_name, is_active
FROM ai_model_config
ORDER BY service_name;

-- Switch main response to Claude Haiku
UPDATE ai_model_config
SET
  provider = 'anthropic',
  model_name = 'claude-3-5-haiku-20241022',
  api_key_env_var = 'ANTHROPIC_API_KEY',
  fallback_provider = 'openai',
  fallback_model = 'gpt-4o'
WHERE service_name = 'barry_main_response';
```

### Method 3: Supabase MCP (via Claude Code)
```typescript
await mcp__supabase__execute_sql({
  query: `
    UPDATE ai_model_config
    SET provider = 'anthropic', model_name = 'claude-3-5-haiku-20241022'
    WHERE service_name = 'barry_main_response'
  `
});
```

## Cost Comparison (per 1000 queries)

### Current: All OpenAI
- Query tools: $0.0135
- Main response: $3.75
- **Total: $3.76**

### Hybrid: Claude Haiku Main
- Query tools: $0.0135 (keep OpenAI)
- Main response: $1.20 (Claude Haiku)
- **Total: $1.21 (68% cost reduction)**

### Premium: Claude Sonnet Main
- Query tools: $0.0135 (keep OpenAI)
- Main response: $4.50 (Claude Sonnet)
- **Total: $4.51 (better quality, slight increase)**

## Setup Instructions

### 1. Apply Database Migration
```sql
-- Run in Supabase SQL Editor
-- File: supabase/migrations/20251016000000_create_ai_model_config.sql
```

### 2. Add Environment Variables
```bash
# Supabase Edge Functions → Settings → Secrets
ANTHROPIC_API_KEY=sk-ant-api03-xxx
GOOGLE_API_KEY=AIzaxxxx (optional)
```

### 3. Update Barry Edge Function
```typescript
// In index.ts, replace direct API calls with:
import { AIProviderAdapter, getModelConfig } from './ai-provider-adapter.ts';

const config = await getModelConfig(supabaseClient, 'barry_main_response');
const adapter = new AIProviderAdapter(config);
const response = await adapter.chat(messages);
```

### 4. Add Admin UI Route
```typescript
// In src/pages/AdminPage.tsx, add:
import { AIModelConfig } from '@/components/admin/AIModelConfig';

// Add tab:
<Tab value="ai-models" label="AI Models">
  <AIModelConfig />
</Tab>
```

## Fallback Configuration

Automatic failover if primary provider fails:

```sql
UPDATE ai_model_config
SET
  fallback_provider = 'openai',
  fallback_model = 'gpt-4o'
WHERE service_name = 'barry_main_response';
```

If Anthropic API is down → automatically uses OpenAI fallback.

## Testing

### 1. Test Provider Adapter
```typescript
// Temporary test in edge function
const config = await getModelConfig(supabaseClient, 'barry_main_response');
console.log('Config:', config);

const adapter = new AIProviderAdapter(config);
const response = await adapter.chat([
  { role: 'user', content: 'Test message' }
]);
console.log('Response:', response);
```

### 2. Test Live Switching
```sql
-- Switch to Claude
UPDATE ai_model_config SET provider = 'anthropic'
WHERE service_name = 'barry_main_response';

-- Ask Barry a question → Check logs

-- Switch back to OpenAI
UPDATE ai_model_config SET provider = 'openai'
WHERE service_name = 'barry_main_response';

-- Ask again → Check logs
```

### 3. Test Fallback
```sql
-- Set invalid model name
UPDATE ai_model_config
SET model_name = 'invalid-model',
    fallback_provider = 'openai',
    fallback_model = 'gpt-4o-mini'
WHERE service_name = 'barry_main_response';

-- Ask Barry → Should use fallback and log warning
```

## Monitoring

Check edge function logs for:
- `✅ Config loaded:` - Model config fetched successfully
- `⚠️ Primary provider failed, using fallback:` - Fallback triggered
- `Model: XXX, Provider: XXX` - Actual model used for response

## Migration Path

**Phase 1: Infrastructure** ✅
- Database table created
- Provider adapter built
- Admin UI ready

**Phase 2: Integration** (Next)
- Update index.ts to use adapter
- Test on staging
- Deploy to production

**Phase 3: Optimization** (Future)
- Performance metrics per model
- Automatic model selection based on query complexity
- Cost tracking dashboard
- A/B testing framework

## Emergency Model Switch Procedure

If a model is deprecated:

1. **Immediate** (< 30 seconds)
   ```sql
   UPDATE ai_model_config
   SET provider = 'openai', model_name = 'gpt-4o-mini'
   WHERE service_name = 'barry_main_response';
   ```

2. **Test** (1 minute)
   - Ask Barry a technical question
   - Check response quality
   - Verify citations work

3. **Monitor** (5 minutes)
   - Check error rates
   - Watch response times
   - Review user feedback

4. **Optimize** (later)
   - Fine-tune temperature
   - Adjust max_tokens
   - Update fallback config

## Files Created

1. `/supabase/migrations/20251016000000_create_ai_model_config.sql` - Database schema
2. `/supabase/functions/chat-with-barry/ai-provider-adapter.ts` - Provider abstraction
3. `/supabase/functions/chat-with-barry/UPGRADE_GUIDE.md` - Integration guide
4. `/src/components/admin/AIModelConfig.tsx` - Admin UI
5. `/docs/AI_MODEL_HOT_SWAP.md` - This file

## Support

For issues:
1. Check Supabase Edge Function logs
2. Verify environment variables are set
3. Test adapter with simple messages
4. Fall back to OpenAI GPT-4o-mini (always works)
