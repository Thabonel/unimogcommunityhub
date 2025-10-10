# Barry Edge Function Deployment Instructions

## 🚀 Deploy via Supabase Dashboard (No Docker Required)

### Step 1: Open Supabase Dashboard
1. Go to https://supabase.com/dashboard
2. Select your project: `ydevatqwkoccxhtejdor`
3. Navigate to **Edge Functions** in left sidebar

### Step 2: Find chat-with-barry Function
1. Look for `chat-with-barry` in the functions list
2. Click on the function name

### Step 3: Deploy New Version
1. Click **"Edit Function"** or similar deploy button
2. Copy the ENTIRE contents of:
   `/Users/thabonel/Code/unimogcommunityhub/supabase/functions/chat-with-barry/index.ts`
3. Paste into the editor
4. Click **"Deploy"** button
5. Wait for deployment confirmation (usually 10-30 seconds)

### Step 4: Verify Deployment
After deployment completes:
1. Check function logs for any errors
2. Note the deployment timestamp

---

## ✅ What This Fix Does

### Database Search Restored
- **Semantic Search**: Uses `search_manual_chunks` RPC (vector embeddings)
- **Keyword Fallback**: Searches `manual_chunks` table if semantic fails
- **Real Content**: Returns actual manual text from 1,776 processed chunks

### Smart Intent Detection (from v65)
- **Non-Technical**: "write email", "weather" → General GPT-4o mode
- **Technical**: "replace portal hub", "fix engine" → Database search mode
- **Prevents Crashes**: Won't crash if "Unimog" mentioned in non-technical context

### SHORT Response Directive
- System prompt emphasizes SHORT, directive answers
- Max tokens: 500 (prevents long explanations)
- Example: "Check Section 33.3, page 555 for portal hub seal replacement."

### OpenAI GPT-4o Integration
- Model: `gpt-4o`
- API: `https://api.openai.com/v1/chat/completions`
- Uses `OPENAI_API_KEY` from environment variables

---

## 🧪 Testing After Deployment

### Test 1: Technical Question (Should Use Database)
**Query**: "How to replace portal hub seals?"

**Expected Behavior**:
- ✅ Searches database via `search_manual_chunks` RPC
- ✅ Returns SHORT answer pointing to manual section
- ✅ Includes real PDF reference (e.g., U435_19_Wheel_Hub_Front.pdf)
- ✅ Shows specific page numbers
- ✅ Mode: "manual"

**Check Logs For**:
```
Query classification: { mode: 'manual', rule: 'generic_technical', matched: 'portal' }
Searching manuals for query: How to replace portal hub seals?
Found X semantic matches (or keyword matches)
```

### Test 2: Non-Technical Question (Should Use General Mode)
**Query**: "My Unimog broke down, write an email to my boss saying I'll be late"

**Expected Behavior**:
- ✅ Routes to general assistant mode
- ✅ Writes the email as requested
- ✅ No manual search performed
- ✅ Mode: "chatgpt"

**Check Logs For**:
```
Query classification: { mode: 'chatgpt', rule: 'non_technical', matched: 'write' }
```

### Test 3: Edge Case (Unimog in Non-Technical Context)
**Query**: "Tell me a joke about Unimogs"

**Expected Behavior**:
- ✅ Routes to general mode (not technical repair)
- ✅ Tells a joke
- ✅ No crash
- ✅ Mode: "chatgpt"

---

## 🔍 Monitoring Function Logs

### Access Logs
1. In Supabase Dashboard → Edge Functions → chat-with-barry
2. Click **"Logs"** tab
3. Watch for real-time invocations

### Key Log Messages
- `Query classification:` - Shows routing decision
- `Searching manuals for query:` - Database search triggered
- `Found X semantic matches` - Semantic search succeeded
- `Falling back to keyword search` - Semantic search failed, trying keywords
- `No manual content found` - Nothing in database matched

### Error Indicators
- `Error searching manuals:` - Database search failed
- `OpenAI API error:` - API key or rate limit issue
- `Error in chat-with-barry:` - General function error

---

## 📊 Database Verification (Already Confirmed)

These were verified via Supabase MCP:

### manual_chunks Table
- **Status**: ✅ 1,776 entries
- **Purpose**: Stores processed manual text chunks
- **Search Method**: Keyword search fallback

### u435_manual_index Table
- **Status**: ✅ 696 entries
- **Purpose**: Index of manual topics with page mappings
- **Note**: Not directly used by current search, but database is healthy

### search_manual_chunks Function
- **Status**: ✅ EXISTS
- **Purpose**: Semantic search using vector embeddings
- **Returns**: content, metadata, similarity score

---

## 🚨 Troubleshooting

### If Barry Still Gives Long Answers
- Check `max_tokens: 500` is in OpenAI API call
- Verify system prompt includes "CRITICAL: Keep responses SHORT"
- Check logs to see if database search is actually running

### If Barry Doesn't Search Database
- Check `search_manual_chunks` function exists: `SELECT * FROM pg_proc WHERE proname = 'search_manual_chunks';`
- Verify `manual_chunks` table has data: `SELECT COUNT(*) FROM manual_chunks;`
- Check function logs for "Searching manuals for query:" message

### If Barry Crashes on "Write Email"
- Check classification logs - should show `mode: 'chatgpt'` for non-technical
- Verify `classifyQuery()` function checks non-technical intents FIRST
- Look for `hasNonTechnicalIntent` in logs

---

## 📈 Success Criteria

Barry is fixed when:
1. ✅ Technical questions return SHORT answers with PDF references
2. ✅ Non-technical requests (emails, jokes) work without crashing
3. ✅ Database search shows in logs: "Found X semantic/keyword matches"
4. ✅ Responses reference actual manual sections (not generic advice)
5. ✅ No "Invalid API key" or similar errors in logs

---

**Version**: Hybrid v64 + v65 + OpenAI GPT-4o
**Date**: 2025-09-30
**File**: `/Users/thabonel/Code/unimogcommunityhub/supabase/functions/chat-with-barry/index.ts`
**Status**: Ready for deployment via Supabase Dashboard