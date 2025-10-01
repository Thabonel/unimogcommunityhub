# Deploy Barry v65 - Intelligent Intent Detection

## Problem Fixed
- ❌ **Before**: "My Unimog broke, write an email to my boss" → Barry crashed (triggered mechanic mode)
- ✅ **After**: Same query → Barry writes the email (detects general intent)

## Files Created

### 1. Database Migration
**File**: `supabase/migrations/20250930_create_barry_tables.sql`
**Purpose**: Creates `chat_logs` and `chat_rate_limits` tables

### 2. Edge Function
**File**: `supabase/functions/chat-with-barry/index.ts`
**Version**: 65 - Intelligent Intent Detection
**Purpose**: Smart routing between general AI and technical manual mode

## Deployment Steps

### Step 1: Run SQL Migration

**Option A: Supabase Dashboard**
1. Go to https://supabase.com/dashboard
2. Select your project
3. Click "SQL Editor" in sidebar
4. Click "New Query"
5. Copy contents of `supabase/migrations/20250930_create_barry_tables.sql`
6. Paste and click "Run"
7. Verify: Tables `chat_logs` and `chat_rate_limits` created

**Option B: Supabase CLI**
```bash
supabase db push
```

### Step 2: Deploy Edge Function

**Option A: Supabase Dashboard**
1. Go to Edge Functions section
2. Find `chat-with-barry` function
3. Click "Deploy new version"
4. Copy contents of `supabase/functions/chat-with-barry/index.ts`
5. Paste and deploy
6. Verify version 71 (or latest) deployed

**Option B: Supabase CLI**
```bash
supabase functions deploy chat-with-barry
```

## Testing

### Test 1: General Question with "Unimog"
**Query**: "My Unimog broke down, can you write an email to my boss telling him I'll be late?"

**Expected Result**:
- ✅ Barry writes a professional email
- ✅ Uses GPT-4o general mode
- ✅ Intent detected: `non_technical_intent`

### Test 2: Technical Question
**Query**: "How do I replace portal hub seals on my U435?"

**Expected Result**:
- ✅ Barry provides technical procedure
- ✅ References manual: `U435_19_Wheel_Hub_Front.pdf`
- ✅ Intent detected: `technical_repair_question`

### Test 3: Weather (General)
**Query**: "What's the weather like?"

**Expected Result**:
- ✅ Barry asks for location or uses provided coordinates
- ✅ Uses GPT-4o general mode
- ✅ Intent detected: `non_technical_intent`

### Test 4: Pure Technical
**Query**: "Unimog engine repair procedure"

**Expected Result**:
- ✅ Barry provides manual references
- ✅ Technical mode activated
- ✅ Intent detected: `technical_repair_question`

## Key Changes from v64

### 1. Smart Intent Detection (Lines 98-144)
```typescript
// Check non-technical intents FIRST
if (nonTechnicalIntents.some(intent => lower.includes(intent))) {
  return { mode: 'general', reason: 'non_technical_intent' };
}

// Then check for technical intents
const hasTechnicalAction = technicalActions.some(action => lower.includes(action));
const hasVehiclePart = vehicleParts.some(part => lower.includes(part));

if (hasTechnicalAction || hasVehiclePart) {
  return { mode: 'technical', reason: 'technical_repair_question' };
}
```

### 2. Non-Fatal Error Handling (Lines 285-303, 333-347)
```typescript
// Rate limiting - non-fatal
try {
  // ... rate limit logic
} catch (error) {
  console.log('Rate limit check failed (non-fatal):', error);
}

// Chat logging - non-fatal
try {
  // ... log chat
} catch (error) {
  console.log('Chat log failed (non-fatal):', error);
}
```

### 3. No Complex RPC Dependencies
- Uses simple in-memory manual index
- No database RPC calls that could fail
- Faster response times

## Intent Detection Keywords

### Non-Technical (General GPT-4o Mode)
- Writing: `write`, `letter`, `email`, `compose`, `draft`
- Excuses: `tell my boss`, `late`, `excuse`
- General: `weather`, `forecast`, `directions`, `joke`, `story`
- Questions: `what is`, `who is`, `when is`, `where is`

### Technical (Manual Mode)
- Actions: `replace`, `remove`, `install`, `fix`, `repair`
- Questions: `how do i`, `how to`, `procedure`, `steps`
- Parts: `engine`, `transmission`, `brake`, `portal hub`, `axle`

## Rollback Plan

If issues occur:

**Option 1: Quick Rollback**
- Redeploy previous version from Supabase dashboard history

**Option 2: Restore v62**
- Use the working v62 code provided earlier

**Option 3: Delete Tables (if needed)**
```sql
DROP TABLE IF EXISTS chat_logs CASCADE;
DROP TABLE IF EXISTS chat_rate_limits CASCADE;
```

## Monitoring

After deployment, check:
1. **Supabase Dashboard** → Edge Functions → Logs
2. Look for: `Intent detected: general` vs `Intent detected: technical`
3. Verify no errors in function logs
4. Check `chat_logs` table populating correctly

## Success Criteria

✅ Barry responds to general questions (even with "Unimog" mentioned)
✅ Barry provides technical help for repair questions
✅ No crashes or non-2xx errors
✅ Chat logs and rate limiting working
✅ Manual references appear for technical questions

## Support

If issues persist:
1. Check Supabase Edge Function logs
2. Verify environment variables set (OPENAI_API_KEY)
3. Confirm tables created with RLS policies
4. Test with simple question: "hello"