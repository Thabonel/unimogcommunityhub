# Barry AI v67 - Production Baseline Documentation

**Date Locked**: September 30, 2025
**Status**: ✅ Production Ready - Going Live Tonight
**Version**: v67 (Database-First Routing with Keyword Extraction)

---

## 🎯 Purpose of This Package

This folder contains the **frozen production baseline** for Barry AI v67. Use this as the definitive reference for:
- Understanding how Barry works in production
- Debugging issues
- Making future improvements without breaking existing functionality
- Onboarding new developers
- Rollback recovery if needed

**⚠️ DO NOT MODIFY FILES IN THIS FOLDER** - This is a historical snapshot for reference only.

---

## 📁 Documentation Structure

### Core Architecture
- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - Complete system design and data flow
- **[API_CONTRACT.md](./API_CONTRACT.md)** - Frontend/backend interface specification
- **[DATABASE_ROUTING.md](./DATABASE_ROUTING.md)** - How database-first routing works

### Implementation Details
- **[KEYWORD_EXTRACTION.md](./KEYWORD_EXTRACTION.md)** - Noise word filtering logic
- **[IMPLEMENTATION_REFERENCE.md](./IMPLEMENTATION_REFERENCE.md)** - Code walkthrough with line numbers
- **[PERFORMANCE_METRICS.md](./PERFORMANCE_METRICS.md)** - Expected performance baselines

### Operations
- **[DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)** - Step-by-step deployment process
- **[TROUBLESHOOTING.md](./TROUBLESHOOTING.md)** - Common issues and solutions
- **[TEST_CASES.md](./TEST_CASES.md)** - Comprehensive test scenarios

### History & Future
- **[VERSION_HISTORY.md](./VERSION_HISTORY.md)** - Evolution from v64 → v66 → v67
- **[FUTURE_IMPROVEMENTS.md](./FUTURE_IMPROVEMENTS.md)** - Known limitations and enhancement ideas

### Snapshot Files
- **[index.ts.snapshot](./index.ts.snapshot)** - Frozen copy of working Edge Function
- **[routing-config.json](./routing-config.json)** - Configuration reference

---

## 🚀 Quick Start

### For New Developers
1. Start with **ARCHITECTURE.md** to understand the big picture
2. Read **KEYWORD_EXTRACTION.md** to understand the core innovation
3. Review **IMPLEMENTATION_REFERENCE.md** for code details

### For Debugging
1. Check **TROUBLESHOOTING.md** for common issues
2. Review **TEST_CASES.md** to verify expected behavior
3. Compare production logs against **PERFORMANCE_METRICS.md**

### For Making Changes
1. Read **FUTURE_IMPROVEMENTS.md** for known enhancement opportunities
2. Review **API_CONTRACT.md** to maintain backward compatibility
3. Use **TEST_CASES.md** to verify no regressions

---

## 🎉 What Makes v67 Special

### The Core Innovation: Smart Keyword Extraction
```
User asks: "how do I change the fanbelt"
           ↓
v66 (broken): Extracted "change fanbelt" → matched "oil change" ❌
v67 (working): Extracted "fanbelt" → matched "belt system" ✅
```

**Key Insight**: Action verbs (change, fix, replace) are noise words that cause false matches. Technical nouns (fanbelt, radiator, tire) are what matter.

### Database-First Routing
- **696 indexed terms** vs ~100 hardcoded keywords (7x improvement)
- **4 search strategies**: exact_term, alias_match, fts_match, trigram_match
- **Calibrated thresholds**: Different confidence levels for each strategy
- **250ms timeout**: Fast failover to ChatGPT if database is slow
- **Zero maintenance**: Automatically uses terms from manual index

### Production Features
- ✅ Backward compatible with existing frontend
- ✅ Full authentication and rate limiting
- ✅ Comprehensive logging and metrics
- ✅ Graceful error handling
- ✅ Performance optimized

---

## 📊 Key Metrics (Expected Baseline)

| Metric | Target | Threshold |
|--------|--------|-----------|
| Response Time (P50) | ~200ms | <500ms |
| Response Time (P95) | ~400ms | <1000ms |
| Database Query Time | 50-150ms | <250ms |
| Routing Accuracy | >95% | >90% |
| False Positives | <2% | <5% |
| False Negatives | <5% | <10% |

---

## 🧪 Critical Test Cases

### Test 1: Natural Language Query (Primary Fix)
```
Query: "how do I change the fanbelt"
Expected: Manual mode with Belt System PDF
Log: "🔍 Extracted keywords: 'fanbelt'"
Log: "📊 Routing decision: manual (trigram match score: 0.30)"
```

### Test 2: Regression Test
```
Query: "how do I replace the radiator"
Expected: Manual mode with Cooling System PDF
Log: "🔍 Extracted keywords: 'radiator'"
Log: "📊 Routing decision: manual (exact match)"
```

### Test 3: Non-Technical Query
```
Query: "write a letter to my boss"
Expected: ChatGPT mode with helpful letter
Log: "📊 Routing decision: chatgpt (Non-technical intent detected)"
```

---

## 🛠️ Configuration Reference

### Noise Words (Filtered Out)
**Question Words**: how, do, i, the, my, a, an, to, is, can, you, help, me, with, what, where, when, why

**Action Verbs**: change, replace, fix, repair, install, remove, adjust, check, inspect, service, maintain

### Routing Thresholds
```json
{
  "exact_term": 1.0,    // Perfect match
  "alias_match": 0.95,  // Known alternative names
  "fts_match": 0.20,    // Full-text search (very permissive)
  "trigram_match": 0.25 // Fuzzy matching (lowered from 0.40)
}
```

### Timeouts
- Database query: 250ms (then fallback to ChatGPT)
- Full response: No hard limit (streaming)

---

## 📝 Version Summary

### v64 (Previous Working Version)
- Hardcoded keyword arrays
- ~100 terms manually maintained
- Exact matching only
- Limited logging

### v66 (Deployed but Broken)
- Attempted database-first routing
- ❌ Wrong API format (broke frontend)
- ❌ Wrong database table for logging
- **Rolled back immediately**

### v67 (Current Production)
- ✅ Database-first routing (working)
- ✅ Keyword extraction (fixed false matches)
- ✅ Backward compatible API
- ✅ Correct logging
- ✅ Lowered trigram threshold (0.25)
- **Ready for production**

---

## 🔒 Rollback Plan

If v67 has issues, use this 3-step rollback:

### Step 1: Quick Rollback (5 minutes)
1. Open Supabase Dashboard → Edge Functions → chat-with-barry
2. Copy from `/docs/functions/BARRY_DEPLOYED_BACKUP_2025-09-30.ts`
3. Deploy

### Step 2: Verify Rollback
```
Test: "how do I replace the radiator"
Expected: Manual mode with PDFs
Status: Should work with hardcoded keywords
```

### Step 3: Document Issues
Log what went wrong in `docs/barry/BARRY_INCIDENTS.md`

---

## 📧 Contact & Support

**Primary Developer**: Claude Code (via Anthropic)
**Project Owner**: Thabonelo
**Deployment Date**: September 30, 2025
**Repository**: unimogcommunityhub

**For Issues**:
1. Check `TROUBLESHOOTING.md` first
2. Review Edge Function logs in Supabase
3. Compare behavior against `TEST_CASES.md`
4. Document new issues in project documentation

---

## 🎯 Success Criteria

Barry v67 is considered successful if:
- ✅ No 500 errors in production
- ✅ "fanbelt" queries return belt system PDFs
- ✅ "radiator" queries still work (regression test)
- ✅ Non-technical queries go to ChatGPT
- ✅ Response times < 500ms (P95)
- ✅ User satisfaction with relevance
- ✅ No critical bugs reported in first 48 hours

---

**Last Updated**: 2025-09-30 (Production Launch)
**Next Review**: 2025-10-07 (1 week post-launch)
**Status**: 🟢 Active Production Baseline