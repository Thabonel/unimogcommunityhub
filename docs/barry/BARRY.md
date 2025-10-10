# Barry AI - Production Documentation

**Current Version**: v85 (October 2025)
**Status**: Production
**Model**: OpenAI GPT-4o with GPT-4o-mini reranking
**Architecture**: Two-Pass RAG Context Injection

---

## Current Status (October 2025)

Barry is currently running **v85** with a two-pass RAG architecture that provides highly accurate responses by verifying relevance before citing manual sections.

**Quick Facts**:
- Model: GPT-4o (main responses) + GPT-4o-mini (query expansion & reranking)
- Architecture: Search → Verify → Fetch → Respond
- Response time: ~4 seconds average
- Cost: ~$0.012 per query
- Accuracy: 40-60% improvement over simple search (thanks to reranking)

**Key Files**:
- Edge Function: `/supabase/functions/chat-with-barry/index.ts` (v85)
- Documentation: `docs/barry/BARRY_V85_CURRENT_ARCHITECTURE.md` (detailed technical docs)
- Evolution History: `docs/barry/BARRY_EVOLUTION_HISTORY.md` (how we got here)

---

## Quick Links

### For Developers
- **Detailed Architecture**: [BARRY_V85_CURRENT_ARCHITECTURE.md](./BARRY_V85_CURRENT_ARCHITECTURE.md) - Complete technical documentation
- **Quick Reference**: [BARRY_QUICK_REFERENCE.md](./BARRY_QUICK_REFERENCE.md) - One-page dev guide
- **Evolution History**: [BARRY_EVOLUTION_HISTORY.md](./BARRY_EVOLUTION_HISTORY.md) - Timeline and lessons learned

### For Users
- **Frontend Entry Points**:
  - `FloatingBarryButton.tsx` - Main floating button
  - `EnhancedBarryChat.tsx` - Full-featured chat modal
  - `SecureBarryChat.tsx` - Simple chat interface
  - `BarryChat.tsx` - WIS-specific integration

---

## How Barry Works (High-Level)

```
User asks question
    ↓
Barry expands query into technical search terms (GPT-4o-mini)
    ↓
Search manual index for up to 15 candidate snippets
    ↓
Rerank snippets by relevance (GPT-4o-mini scores 0.0-1.0)
    ↓
Keep only relevant snippets (score ≥ 0.5)
    ↓
Fetch full manual content for verified snippets
    ↓
Inject manual sections into system prompt (RAG)
    ↓
Generate response with citations (GPT-4o)
    ↓
Return response + manual references to user
```

---

## Frontend Integration

### Basic Usage

```typescript
import { useGeminiBarry } from '@/hooks/use-gemini-barry';

// In your component
const {
  messages,
  sendMessage,
  isLoading,
  manualReferences
} = useGeminiBarry(location);

// Send a message
await sendMessage('How do I lift the cab?');

// Access manual references for PDF viewer
console.log(manualReferences);
```

### Response Format

```typescript
{
  content: string,           // Barry's response with citations
  manualReferences: Array<{
    manual: string,          // "U435_Part1_Complete.pdf"
    section: string,         // "Cab Structure"
    pageNumber: number,      // 142
    content: string,         // Snippet
    similarity: number       // Relevance score
  }>,
  searchResultCount: number,
  model: "gpt-4o-two-pass-rag-v85"
}
```

---

## Configuration

### Environment Variables (Supabase)

```bash
OPENAI_API_KEY=<OPENAI_API_KEY>  # Required: OpenAI API key for GPT-4o
```

### Database Requirements

#### Tables
- `manual_index` - Curated search index with optimized terms
- `manual_chunks` - Full manual content for text extraction
- `user_profiles` - User context (vehicle, location)

#### Functions
- `search_manual_index(search_query, similarity_threshold, max_results)` - Main search function

---

## Critical v85 Fix

### Problem (v84 and earlier)
Portal hub seal questions returned no results despite manuals containing the information.

### Root Cause
The `manual_index` table has TWO page number fields:
- `page_number`: 555 (page in complete 1500-page manual)
- `pdf_page_number`: 1 (page in extracted chapter PDF)

The `manual_chunks` table only has:
- `page_number`: 555

Version 84 was matching by `pdf_page_number` (1) which didn't exist in `manual_chunks`.

### Fix (v85)
```typescript
// BEFORE (v84) - WRONG:
.eq('pdf_page_number', snippet.pdf_page_number)  // No match!

// AFTER (v85) - CORRECT:
.eq('page_number', snippet.page_number)  // Matches!
```

### Result
Portal hub seals and other chapter-extracted manual sections now found correctly.

---

## Testing Barry

### Test Commands

```bash
# Test Edge Function directly
supabase functions invoke chat-with-barry \
  --data '{"messages":[{"role":"user","content":"How do I lift the cab?"}]}'

# View logs
supabase functions logs chat-with-barry --limit 50

# Check manual index coverage
psql -d unimog -c "SELECT COUNT(*) FROM manual_index WHERE is_active = true;"
```

### Expected Behavior

**Good Response**:
```
Query: "How do I lift the cab?"
Response: "Alright, lifting the cab on your U435 is a two-person job minimum...

References:
- U435 Part 1, Section: Cab Structure, Page 142
- U435 Part 2, Section: Body Maintenance, Page 67"
```

**Correct Refusal**:
```
Query: "Where should I go camping?"
Response: "That's not in the U435 manual, mate. I'm here for Unimog technical questions..."
```

---

## Performance & Cost

### Current Performance (v85)
- Response time: ~4 seconds average
- Success rate: >95% for technical questions
- False positive citations: <5% (thanks to reranking)

### Cost Analysis
- Per query: ~$0.012 (mostly GPT-4o response generation)
- Monthly (1000 queries): ~$12
- Acceptable trade-off for accuracy and safety

### Optimization Opportunities
1. Cache common queries
2. Reduce reranking threshold for faster responses (trade accuracy)
3. Consider Gemini Flash 1.5 migration (70% cost savings)

---

## Future Considerations

### Potential Migrations

#### Option 1: Gemini Flash 1.5
- **Cost savings**: 70-75% cheaper than GPT-4o
- **Performance**: 2-3x faster responses
- **Risk**: Need to verify response quality matches GPT-4o
- **Effort**: ~4 hours implementation
- **Status**: Planned but not prioritized

#### Option 2: GPT-5 Upgrade
- **Benefits**: Better reasoning, more reliable function calling
- **Status**: Attempted Oct 2025, failed due to API access
- **Retry**: When GPT-5 widely available (check API access)

### Enhancement Ideas
1. Streaming responses with progress indicators
2. Multi-modal search (diagrams + text)
3. Conversation memory (avoid redundant searches)
4. Community knowledge integration (user tips separate from manuals)
5. Multi-language support (German, Turkish, Spanish manuals)

---

## Troubleshooting

### Common Issues

#### Issue: "No manual sections found"
**Cause**: Query too vague or manual index missing terms
**Fix**:
- Check query expansion (is AI extracting good search terms?)
- Verify manual index has relevant entries
- Check `search_manual_index` threshold (currently 0.1)

#### Issue: "Wrong manual sections cited"
**Cause**: Reranking threshold too low or verification failing
**Fix**:
- Check reranking scores (should be ≥0.5)
- Increase verification threshold in code
- Verify manual index entries are accurate

#### Issue: "Slow responses (>10 seconds)"
**Cause**: Too many search results or API slowness
**Fix**:
- Reduce max_results in search
- Check OpenAI API status
- Monitor Edge Function logs for bottlenecks

### Debug Checklist
1. Check Edge Function logs: `supabase functions logs chat-with-barry`
2. Verify OPENAI_API_KEY is set in Supabase environment
3. Test query expansion: Add logging to see extracted terms
4. Test search: Run `search_manual_index` directly
5. Test reranking: Check scores being returned
6. Verify database: Ensure manual_index and manual_chunks populated

---

## Version History Summary

- **v85** (Oct 2025): Fixed page number matching (page_number vs pdf_page_number)
- **v84**: Smart keyword extraction, lower verification threshold (0.6→0.5)
- **v83**: Content-based fallback for chapter PDF mismatches
- **v82**: Revolutionary two-pass RAG architecture (verify then fetch)
- **v81**: AI-powered query expansion
- **v80**: Complete RAG rewrite (search first, inject context)
- **v70-79**: Various incremental improvements
- **v69**: GPT-5 function calling attempt (abandoned due to API access)
- **v50-68**: Earlier iterations (see archive)

Full timeline: [BARRY_EVOLUTION_HISTORY.md](./BARRY_EVOLUTION_HISTORY.md)

---

## Related Files

### Core Implementation
- `/supabase/functions/chat-with-barry/index.ts` - Edge Function (v85)
- `/src/hooks/use-gemini-barry.ts` - React hook for Barry integration
- `/src/services/gemini/geminiService.ts` - Service layer

### Frontend Components
- `/src/components/knowledge/FloatingBarryButton.tsx` - Main entry point
- `/src/components/knowledge/EnhancedBarryChat.tsx` - Full-featured modal
- `/src/components/knowledge/SecureBarryChat.tsx` - Simple interface
- `/src/components/wis/BarryChat.tsx` - WIS integration

### Documentation
- `BARRY_V85_CURRENT_ARCHITECTURE.md` - Detailed technical docs
- `BARRY_EVOLUTION_HISTORY.md` - Development timeline
- `BARRY_QUICK_REFERENCE.md` - Quick dev reference
- `archive/` - Historical documentation

---

## Support

### For Development Questions
- Check: [BARRY_QUICK_REFERENCE.md](./BARRY_QUICK_REFERENCE.md)
- Review: Edge Function logs in Supabase dashboard
- Debug: Use test commands above

### For Architecture Questions
- Read: [BARRY_V85_CURRENT_ARCHITECTURE.md](./BARRY_V85_CURRENT_ARCHITECTURE.md)
- History: [BARRY_EVOLUTION_HISTORY.md](./BARRY_EVOLUTION_HISTORY.md)

### For Issues
- Check Edge Function logs first
- Review recent conversation file in `docs/conversation/`
- Test with debug commands above

---

## Conclusion

Barry v85 is production-ready and serving real users with high accuracy. The two-pass RAG architecture ensures safety by verifying relevance before citing manuals, and the v85 page number fix solved persistent search issues.

**Key Success Factors**:
1. Verify before citing (two-pass approach)
2. AI-powered query expansion (natural language → technical terms)
3. Reranking for accuracy (40-60% improvement)
4. Content fallback for robustness (handles chapter PDFs)
5. Safety-first design (refuses to guess without manual citations)

**Status**: Stable and recommended for production use.

---

**Document Version**: 2.0
**Last Updated**: October 2025
**Previous Version**: v1.0 (Gemini migration plan - archived)
