# Barry AI v85 - Current Production Architecture

**Status**: Production (October 2025)
**Version**: v85 - "Fixed Page Number Matching"
**Model**: OpenAI GPT-4o with GPT-4o-mini reranking
**Architecture**: Two-Pass RAG Context Injection

---

## Executive Summary

Barry AI v85 uses a sophisticated **two-pass RAG (Retrieval Augmented Generation)** architecture that ensures accuracy by verifying relevance before citing manual sections. This approach solved the critical issue of Barry citing irrelevant pages (e.g., returning "air filter" information when asked about radiators).

### Key Features
- **Two-pass verification**: Search → Verify relevance → Fetch full content → Generate response
- **AI-powered query expansion**: Extracts intelligent search terms from natural language
- **Content-based fallback**: Handles mismatches between chapter PDFs and complete manuals
- **Reranking**: GPT-4o-mini reranks search results for 40-60% accuracy improvement
- **Safety-first**: Refuses to guess technical information without manual citations

### Why This Architecture?

**Previous Attempts**:
- v69: GPT-5 function calling (AI decides when to search) → Failed due to API access
- v70-84: Various RAG improvements → Good, but had false positive citations

**v85 Solution**:
- Search manuals FIRST (before AI response)
- Verify each result's relevance with AI (threshold: 0.5)
- Only inject verified, relevant content into RAG context
- AI generates response from actual manual text, not assumptions

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                   User Query                             │
└─────────────────┬───────────────────────────────────────┘
                  │
                  ▼
        ┌─────────────────────┐
        │  Query Expansion     │
        │  (GPT-4o-mini)       │  "how do I lift the cab"
        │                      │  → ["cab removal", "cab structure",
        │  Extract search      │     "lifting cab", "cab maintenance"]
        │  terms from natural  │
        │  language            │
        └─────────┬────────────┘
                  │
                  ▼
        ┌─────────────────────┐
        │  PASS 1: Search      │
        │  manual_index        │  Find up to 15 candidate snippets
        │                      │  from indexed U435 manual
        └─────────┬────────────┘
                  │
                  ▼
        ┌─────────────────────┐
        │  Reranking           │  GPT-4o-mini scores each snippet
        │  (GPT-4o-mini)       │  for relevance to original query
        │                      │
        │  Filters out         │  Threshold: 0.5
        │  irrelevant results  │  (keeps snippets scoring ≥0.5)
        └─────────┬────────────┘
                  │
                  ▼
        ┌─────────────────────┐
        │  PASS 2: Fetch       │  For each verified snippet:
        │  Full Content        │  1. Match by page_number (v85 fix!)
        │                      │  2. Fallback to content search
        │  From manual_chunks  │  3. Extract full manual text
        │  table               │
        └─────────┬────────────┘
                  │
                  ▼
        ┌─────────────────────┐
        │  RAG Context         │  System prompt + verified manual
        │  Injection           │  sections injected directly
        │                      │
        │  GPT-4o generates    │  Barry builds response FROM
        │  response            │  actual manual content
        └─────────┬────────────┘
                  │
                  ▼
        ┌─────────────────────┐
        │  Response with       │  Content + Manual references
        │  Citations           │  (manual name, section, page #)
        └─────────────────────┘
```

---

## Technical Implementation

### 1. Query Expansion (Lines 277-319)

**Purpose**: Extract intelligent search terms from natural language questions

```typescript
// User asks: "how do I lift the cab"
// AI extracts: ["cab removal", "cab structure", "lifting cab"]

const expansion = await fetch(OPENAI_API_URL, {
  method: 'POST',
  body: JSON.stringify({
    model: 'gpt-4o-mini',
    messages: [{
      role: 'system',
      content: `Extract 3-5 technical search terms from this U435 Unimog question.
                Return ONLY the search terms, one per line.
                Use standard manual terminology (e.g., "cab structure" not "cab thing").`
    }, {
      role: 'user',
      content: userQuestion
    }],
    max_tokens: 100,
    temperature: 0.3
  })
});

// Result: Multiple focused search terms instead of entire question
```

**Why**: Manual index uses technical terms ("cab structure") while users ask naturally ("how do I lift the cab"). Query expansion bridges this gap.

### 2. Manual Index Search (Lines 326-430)

**Purpose**: Search indexed manual for relevant snippets using expanded terms

```typescript
// Search with each expanded term
for (const searchTerm of expandedTerms) {
  const { data, error } = await supabaseAdmin.rpc('search_manual_index', {
    search_query: searchTerm,
    similarity_threshold: 0.1,  // Low threshold, rely on reranking
    max_results: 5
  });

  allResults.push(...data);
}

// Deduplicate results by page number
const uniqueResults = deduplicateByPage(allResults);

// Returns: Up to 15 candidate snippets
```

**Database Function**: `search_manual_index`
- Uses PostgreSQL full-text search + trigram similarity
- Searches index `term` field (curated manual terms)
- Returns: `id`, `term`, `manual_name`, `page_number`, `section`, `content`

### 3. Relevance Verification with Reranking (Lines 373-430)

**Purpose**: Filter out irrelevant results using AI scoring (40-60% accuracy boost)

```typescript
// GPT-4o-mini scores each snippet for relevance
const verification = await fetch(OPENAI_API_URL, {
  method: 'POST',
  body: JSON.stringify({
    model: 'gpt-4o-mini',
    messages: [{
      role: 'system',
      content: `You are verifying if manual snippets are relevant to a user's question.
                Score each snippet 0.0 (irrelevant) to 1.0 (highly relevant).

                User question: "${userQuestion}"

                Snippet: "${snippet.term} - ${snippet.content}"`
    }],
    max_tokens: 50,
    temperature: 0.0
  })
});

// Extract score (e.g., "0.85")
const score = parseFloat(response);

// Filter: Only keep snippets with score ≥ 0.5
const verifiedSnippets = snippets.filter(s => s.score >= 0.5);
```

**Critical Fix (v84)**: Lowered threshold from 0.6 to 0.5 for better recall

**Cost**: ~$0.00015 per rerank (GPT-4o-mini is cheap)

### 4. Full Content Fetching (Lines 499-627)

**Purpose**: Fetch complete manual content for verified snippets

**CRITICAL v85 FIX**: Match by `page_number` instead of `pdf_page_number`

```typescript
// v85 FIX: Use page_number for matching
// Index has: page_number (555 in big manual) + pdf_page_number (1 in chapter PDF)
// manual_chunks has: page_number (555)

const { data, error } = await supabaseAdmin
  .from('manual_chunks')
  .select('*')
  .eq('name', snippet.manual_name)
  .eq('page_number', snippet.page_number)  // ✅ v85: Correct field!
  .limit(1);

// FALLBACK (v83): Content-based search if filename matching fails
if (!data || data.length === 0) {
  // Search by actual content similarity
  const contentSearch = await supabaseAdmin
    .from('manual_chunks')
    .select('*')
    .ilike('content', `%${snippet.term.slice(0, 50)}%`)
    .limit(3);

  // Pick best match by content similarity
}
```

**Why Two Methods**:
1. **Page number matching**: Fast, accurate for complete manuals
2. **Content fallback**: Handles chapter PDFs with different numbering

### 5. RAG Context Injection (Lines 668-758)

**Purpose**: Inject verified manual content directly into system prompt

```typescript
// Build comprehensive manual context
let manualContext = '';

for (const chunk of verifiedChunks) {
  manualContext += `
=== ${chunk.manual_name} ===
Section: ${chunk.section}
Page: ${chunk.page_number}

${chunk.content}

---
`;
}

// Inject into system prompt
const systemPromptWithManuals = BARRY_SYSTEM_PROMPT + `

MANUAL SECTIONS (USE THESE TO ANSWER):

${manualContext}

Now answer the user's question using ONLY the manual sections above.
ALWAYS cite: Manual name, Section, Page number.
`;
```

**Why Direct Injection**:
- More reliable than function calling (AI sees all context)
- Proven pattern from supabase-community/chatgpt-your-files
- AI can't "forget" to search manuals (context is always there)

### 6. Response Generation (Lines 890-945)

**Purpose**: Generate final response with citations using GPT-4o

```typescript
const response = await fetch(OPENAI_API_URL, {
  method: 'POST',
  body: JSON.stringify({
    model: 'gpt-4o',  // Main model for response quality
    messages: [
      { role: 'system', content: systemPromptWithManuals },
      { role: 'user', content: userQuestion }
    ],
    max_tokens: 800,
    temperature: 0.7
  })
});

const barryResponse = response.choices[0].message.content;

// Return with manual references for frontend PDF viewer
return {
  content: barryResponse,
  manualReferences: verifiedChunks.map(c => ({
    manual: c.manual_name,
    section: c.section,
    pageNumber: c.page_number,
    content: c.content.slice(0, 500),
    similarity: c.relevance_score
  })),
  searchResultCount: verifiedChunks.length,
  model: 'gpt-4o-two-pass-rag-v85'
};
```

---

## Critical Fixes History

### v85: Fixed Page Number Matching (October 9, 2025)
**Problem**: Portal hub seals not found despite being in manuals

**Root Cause**:
- `manual_index` has TWO page fields:
  - `page_number`: 555 (page in complete 1500-page manual)
  - `pdf_page_number`: 1 (page in extracted chapter PDF)
- `manual_chunks` only has: `page_number: 555`
- v84 was matching by `pdf_page_number` (1) → no results ❌

**Fix**: Match by `page_number` instead
```typescript
// BEFORE (v84):
.eq('pdf_page_number', snippet.pdf_page_number)  // Wrong field!

// AFTER (v85):
.eq('page_number', snippet.page_number)  // Correct field!
```

**Result**: Portal hub seals now found correctly ✅

### v84: Smart Keyword Extraction & Lower Threshold
- Extract manual-specific keywords from snippets
- Lower verification threshold: 0.6 → 0.5 (better recall)
- Error handling: Default to keeping snippets instead of rejecting

### v83: Content-Based Fallback
- Handles chapter PDFs vs complete manual mismatches
- When filename/page matching fails, search by actual content
- Fixed: Chapter "U435_19_Wheel_Hub_Front.pdf" → manual "U1700L U435 Workshop Manual Volume 1"

### v82: Two-Pass RAG Architecture
- Revolutionary change: Verify THEN fetch (not just search and hope)
- Pass 1: Get snippets, verify relevance
- Pass 2: Fetch full content only for verified results
- Fixed: No more irrelevant citations (air filter when asking about radiator)

### v81: AI-Powered Query Expansion
- Extract intelligent search terms from natural language questions
- Multi-term search: Try each term, combine unique results
- Fixed: Literal search failures (user says "lift" but index has "removal")

### v80: Complete RAG Rewrite
- Switched from function calling to RAG context injection
- Search FIRST, inject results into prompt
- Based on proven production pattern from supabase-community
- Fixed: AI ignoring search results (function calling gave too much autonomy)

---

## Performance & Cost

### Response Times
- **Query expansion**: ~0.5s (GPT-4o-mini, 100 tokens)
- **Manual search**: ~0.3s (PostgreSQL FTS + trigram)
- **Reranking**: ~0.8s (GPT-4o-mini, 15 snippets)
- **Content fetching**: ~0.4s (PostgreSQL queries)
- **Response generation**: ~2.0s (GPT-4o, 800 tokens)
- **Total**: ~4.0s average (acceptable for quality)

### Cost per Query
- Query expansion: ~$0.000015 (GPT-4o-mini, 100 tokens)
- Reranking: ~$0.00015 (GPT-4o-mini, ~1000 tokens)
- Response: ~$0.012 (GPT-4o, input 2000 + output 800 tokens)
- **Total**: ~$0.012 per query

**Monthly Estimate** (1000 queries):
- Cost: ~$12/month
- Acceptable for quality and accuracy trade-off

---

## Configuration

### Environment Variables
```bash
# Supabase Edge Function environment
OPENAI_API_KEY=<OPENAI_API_KEY>  # OpenAI API key for GPT-4o and GPT-4o-mini

# Database connection (automatic via Supabase)
# No additional configuration needed
```

### Database Tables

#### manual_index
Curated index of U435 manual with optimized search terms
```sql
CREATE TABLE manual_index (
  id UUID PRIMARY KEY,
  term TEXT,                -- Searchable term (e.g., "cab structure")
  manual_name TEXT,         -- Manual filename
  page_number INTEGER,      -- Page in complete manual (555)
  pdf_page_number INTEGER,  -- Page in chapter PDF (1)
  section TEXT,             -- Section name
  chapter_filename TEXT,    -- Chapter PDF filename
  priority INTEGER,         -- Search priority (1=highest)
  content TEXT,             -- Snippet preview
  is_active BOOLEAN         -- Enable/disable entries
);

-- Full-text search index
CREATE INDEX idx_manual_index_term_fts ON manual_index
  USING gin(to_tsvector('english', term));

-- Trigram similarity index
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE INDEX idx_manual_index_term_trgm ON manual_index
  USING gin(term gin_trgm_ops);
```

#### manual_chunks
Complete manual content for full-text extraction
```sql
CREATE TABLE manual_chunks (
  id UUID PRIMARY KEY,
  name TEXT,           -- Manual filename
  chunk_number INTEGER,
  page_number INTEGER, -- Page in complete manual (matches manual_index.page_number)
  section TEXT,
  content TEXT,        -- Full page content
  embedding VECTOR(1536),  -- For future semantic search
  created_at TIMESTAMPTZ
);

-- Page lookup index
CREATE INDEX idx_manual_chunks_name_page ON manual_chunks (name, page_number);
```

---

## API Response Format

### Edge Function Response
```typescript
{
  content: string,           // Barry's response text with citations
  manualReferences: Array<{  // For frontend PDF viewer
    manual: string,          // "U435_Part1_Complete.pdf"
    section: string,         // "Cab Structure"
    pageNumber: number,      // 142
    content: string,         // Snippet (max 500 chars)
    similarity: number       // Relevance score (0.0-1.0)
  }>,
  searchResultCount: number, // Number of manual sections cited
  model: string              // "gpt-4o-two-pass-rag-v85"
}
```

### Frontend Usage
```typescript
const { data, error } = await supabase.functions.invoke('chat-with-barry', {
  body: {
    messages: [
      { role: 'user', content: 'How do I lift the cab?' }
    ],
    location: { latitude: -33.8688, longitude: 151.2093 }
  }
});

// data.content: Barry's response
// data.manualReferences: Array of manual citations for PDF viewer
```

---

## Testing & Verification

### Test Cases

#### Test 1: Cab Removal
**Query**: "how do I lift the cab"
**Expected**: Cab structure/removal manual sections
**Verification**:
- Query expansion extracts: ["cab removal", "cab structure", "lifting cab"]
- Search finds: U435 Part 1, Section "Cab Structure", Page 142
- Response cites: Manual name, section, page number ✅

#### Test 2: Portal Hub Seals (v85 Critical Fix)
**Query**: "how do I replace portal hub seals"
**Expected**: Portal hub maintenance section
**Verification**:
- Search finds: U435 Part 2, Section "Portal Hub Maintenance", Page 555
- v85 matches by page_number (555) not pdf_page_number (1) ✅
- Response includes correct procedure with citations ✅

#### Test 3: Negative Test - No Manual Match
**Query**: "where should I go camping in Australia"
**Expected**: Barry refuses to answer (not in manuals)
**Verification**:
- Search finds: No relevant manual sections
- Barry response: "That's not in the U435 manual, mate..." ✅

### Debug Commands

```bash
# View Edge Function logs
supabase functions logs chat-with-barry --limit 50

# Test Edge Function directly
supabase functions invoke chat-with-barry \
  --data '{"messages":[{"role":"user","content":"test query"}]}'

# Check manual index coverage
psql -d unimog -c "SELECT COUNT(*) FROM manual_index WHERE is_active = true;"

# Verify page number matching
psql -d unimog -c "
  SELECT mi.page_number, mi.pdf_page_number, mc.page_number
  FROM manual_index mi
  LEFT JOIN manual_chunks mc
    ON mi.manual_name = mc.name AND mi.page_number = mc.page_number
  LIMIT 10;"
```

---

## Future Improvements

### Short-Term (Next 1-3 Months)
1. **Streaming responses**: Show "Barry is searching..." progress indicator
2. **Multi-modal search**: Add diagram/image search (GPT-4o supports vision)
3. **Conversation memory**: Track previous searches to avoid redundant queries
4. **Performance optimization**: Cache common queries

### Long-Term (Next 6-12 Months)
1. **Semantic search**: Enhance with embeddings for conceptual queries
2. **Community knowledge**: Allow users to contribute tips (separate from manuals)
3. **Multi-language**: Support German, Turkish, Spanish manuals
4. **WIS integration**: Deep integration with Workshop Information System

### Under Consideration
1. **Gemini migration**: 70% cost savings vs GPT-4o (need quality comparison testing)
2. **GPT-5 upgrade**: When API access widely available (function calling may work now)
3. **Local LLM option**: For offline/air-gapped deployments

---

## Related Documentation

- **Evolution History**: `BARRY_EVOLUTION_HISTORY.md` - Full timeline of Barry's development
- **Quick Reference**: `BARRY_QUICK_REFERENCE.md` - One-page summary for developers
- **Last Session**: `docs/conversation/CONVERSATION_2025-10-08_barry-gpt5-function-calling.md` - GPT-5 attempt
- **Edge Function**: `/supabase/functions/chat-with-barry/index.ts` - Source code (v85)

---

## Conclusion

Barry v85 represents the culmination of months of iteration and refinement. The two-pass RAG architecture with AI-powered verification ensures accuracy while maintaining Barry's helpful personality. The v85 page number fix was the final piece that solved persistent search failures.

**Key Takeaway**: Verify before you cite. The two-pass approach (search → verify → fetch → respond) is more reliable than hoping AI will search correctly on its own.

**Status**: Production-ready, serving real users with high accuracy and safety.

---

**Document Version**: 1.0
**Last Updated**: October 2025
**Maintained By**: UnimogCommunityHub Development Team
