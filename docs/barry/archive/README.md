# Barry AI Documentation Archive

**Archive Date**: October 2025
**Current Production Version**: v85

This directory contains **historical** Barry AI documentation that has been superseded by the current v85 implementation.

## Why These Files Are Archived

Barry AI went through significant evolution from May 2025 to October 2025:
- **v50-68**: Keyword-based routing (brittle, false positives)
- **v69**: GPT-5 function calling attempt (failed due to API access)
- **v70-84**: Iterative RAG improvements
- **v85**: Current production (two-pass RAG, 95% accuracy)

The documents in this archive represent earlier architectures, deployment guides, and implementation attempts that are no longer relevant to the current system.

## Current Documentation (Use These Instead)

For current Barry AI information, see:
- **`../BARRY.md`** - Main production documentation
- **`../BARRY_V85_CURRENT_ARCHITECTURE.md`** - Complete technical details
- **`../BARRY_EVOLUTION_HISTORY.md`** - Timeline and lessons learned

## What's In This Archive

### Deployment Guides (Outdated)
Deployment instructions for obsolete versions. Current deployment is via Supabase Edge Functions dashboard.

### Technical Analysis (Historical)
Analysis documents from various iterations. See `BARRY_EVOLUTION_HISTORY.md` for comprehensive timeline instead.

### Implementation Summaries (Superseded)
Implementation notes from intermediate versions. Current architecture documented in `BARRY_V85_CURRENT_ARCHITECTURE.md`.

### Old Version Files (Reference Only)
Baseline snapshots and version-specific documentation for historical reference.

## When to Reference These Files

**Use archived docs if you need to**:
- Understand why certain approaches were tried and abandoned
- Research specific implementation attempts from earlier versions
- Compare current v85 architecture to previous iterations
- Troubleshoot legacy issues if old code surfaces

**DO NOT use archived docs for**:
- Current deployment (use main BARRY.md)
- Understanding current architecture (use BARRY_V85_CURRENT_ARCHITECTURE.md)
- Learning Barry's history (use BARRY_EVOLUTION_HISTORY.md)

## Archive Contents Status

**Status**: Historical reference only
**Maintained**: No - files frozen as-is from their creation dates
**Accuracy**: May contain outdated information, incorrect assumptions, or failed approaches

---

**Remember**: Barry v85 is production. These archived documents reflect the journey, not the destination.
