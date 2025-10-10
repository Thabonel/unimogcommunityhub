# Barry AI - Quick Reference Card

**Version**: v85 (October 2025)
**For**: Developers and maintainers

---

## Quick Facts

```
Model:          GPT-4o (responses) + GPT-4o-mini (expansion & reranking)
Architecture:   Two-Pass RAG Context Injection
Response Time:  ~4 seconds
Cost per Query: ~$0.012
Accuracy:       ~95%
Edge Function:  /supabase/functions/chat-with-barry/index.ts
```

---

## Architecture Flow (One-Liner)

Query → Expand → Search → Rerank → Verify → Fetch → Inject → Respond

---

## Environment Variables

```bash
# Required in Supabase Edge Function secrets
OPENAI_API_KEY=sk-...
```

---

## Database Tables

```sql
manual_index        -- Search index with curated terms
manual_chunks       -- Full manual content for extraction
```

---

## Key Functions

```sql
-- Main search function
search_manual_index(search_query text, similarity_threshold float, max_results int)

-- Returns: manual_index entries matching query
```

---

## Common Operations

### Test Barry Locally (via Supabase CLI)
```bash
supabase functions invoke chat-with-barry \
  --data '{"messages":[{"role":"user","content":"How do I lift the cab?"}]}'
```

### View Edge Function Logs
```bash
supabase functions logs chat-with-barry --limit 50
```

### Check Manual Index Coverage
```sql
SELECT COUNT(*) FROM manual_index WHERE is_active = true;
```

### Find Manual by Name
```sql
SELECT * FROM manual_chunks
WHERE name ILIKE '%U435%'
LIMIT 10;
```

---

## Response Format

```typescript
{
  content: string,           // Barry's response
  manualReferences: Array<{  // For PDF viewer
    manual: string,
    section: string,
    pageNumber: number,
    content: string,
    similarity: number
  }>,
  searchResultCount: number,
  model: "gpt-4o-two-pass-rag-v85"
}
```

---

## Frontend Integration

```typescript
import { useGeminiBarry } from '@/hooks/use-gemini-barry';

const { messages, sendMessage, isLoading, manualReferences } = useGeminiBarry(location);

await sendMessage('How do I lift the cab?');
```

---

## Troubleshooting

### Issue: "No manual sections found"
**Check**:
1. Query expansion working? (logs show extracted terms?)
2. Manual index populated? (`SELECT COUNT(*) FROM manual_index`)
3. Search threshold too high? (currently 0.1)

**Fix**: Adjust search query or add more index terms

---

### Issue: "Wrong manual sections cited"
**Check**:
1. Reranking scores (should be ≥0.5 for kept results)
2. Verification threshold (currently 0.5)

**Fix**: Increase verification threshold or improve search terms

---

### Issue: "Slow responses (>10 seconds)"
**Check**:
1. OpenAI API status (status.openai.com)
2. Too many search results (currently max 15)
3. Edge Function timeout settings

**Fix**: Reduce max_results or check API health

---

### Issue: "Portal hub seals not found"
**Status**: FIXED in v85

**Root Cause**: Page number field mismatch
- `manual_index.pdf_page_number` (1) ❌
- `manual_chunks.page_number` (555) ✅

**Fix**: Changed to match by `page_number` instead of `pdf_page_number`

---

## Critical Code Locations

```
Edge Function:
  /supabase/functions/chat-with-barry/index.ts

Frontend Components:
  /src/components/knowledge/FloatingBarryButton.tsx
  /src/components/knowledge/EnhancedBarryChat.tsx
  /src/components/knowledge/SecureBarryChat.tsx

Frontend Hooks:
  /src/hooks/use-gemini-barry.ts

Services:
  /src/services/gemini/geminiService.ts
```

---

## Performance Metrics

| Phase | Time | Cost |
|-------|------|------|
| Query Expansion | ~0.5s | ~$0.00002 |
| Search | ~0.3s | Free |
| Reranking | ~0.8s | ~$0.00015 |
| Verification | ~0.4s | ~$0.00003 |
| Content Fetch | ~0.2s | Free |
| Response Gen | ~1.8s | ~$0.012 |
| **TOTAL** | **~4.0s** | **~$0.012** |

---

## Version History (Condensed)

- **v85** (Oct 31): Page number fix ← **CURRENT**
- **v84** (Oct 30): Threshold tuning
- **v83** (Oct 28): Content fallback
- **v82** (Oct 25): Two-pass verification
- **v81** (Oct 20): Query expansion
- **v70** (Oct 9): Reranking added (+40-60% accuracy)
- **v69** (Oct 8): GPT-5 attempt (failed)

---

## Key Learnings

1. **RAG > Function Calling**: Proven pattern beats bleeding edge
2. **Verify Before Citing**: Two-pass prevents false positives
3. **AI for Augmentation**: Use AI to help, not decide
4. **Iterative Works**: v50→v85 in 5 months = 95% accuracy

---

## Emergency Contacts

**If Barry is broken**:
1. Check Edge Function logs (Supabase dashboard)
2. Verify OPENAI_API_KEY in environment
3. Test manual search function directly
4. Check OpenAI API status

**Last Resort**:
- Revert Edge Function to previous version
- Check git history for last known good commit
- Review `BARRY_EVOLUTION_HISTORY.md` for architecture context

---

## Documentation Links

- **Main Docs**: `BARRY.md`
- **Technical Details**: `BARRY_V85_CURRENT_ARCHITECTURE.md`
- **Evolution**: `BARRY_EVOLUTION_HISTORY.md`
- **Archived**: `archive/README.md`

---

**Last Updated**: October 2025
**Status**: Production stable
