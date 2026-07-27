# Barry Phase 3 Shadow Retrieval Design

## Status

- **Date:** 2026-07-27
- **Scope:** PRD Phase 3 in shadow mode only
- **User-visible behavior:** unchanged. Retrieval, generation, verification, citations, and the response contract are identical to Phase 1/2.
- **Production:** not deployed; code pushed to the staging Git remote only.

## What shadow mode means

The semantic retrieval planner runs inside `barry-tools` after the legacy response is finalized. It observes the same retrieval candidates, applies the deterministic evidence policy, ranks with versioned weights, and writes a redacted summary into the existing `barry_grounding_runs` telemetry row. Its output is never read by retrieval, generation, verification, or citation code.

## Components

### Evidence policy (`supabase/functions/_shared/barry-evidence-policy.ts`)

Executable versions of PRD section 13:

- `DOCUMENT_ROLE_PERMISSIONS`: workshop, maintenance, owner's, parts catalogue, service bulletin, validated knowledge, community, unknown. Parts catalogues cannot authorize procedures, torque, fluids, capacities, or diagnosis. Unknown roles permit general discovery only.
- `PAGE_TYPE_PERMISSIONS`: procedure, diagnostic, specification, warning, diagram, parts list, explanation, index, unknown. Diagrams permit component identity only. Index pages permit nothing.
- `isClaimClassPermitted` / `permittedClaimClasses`: a claim class is allowed only when both the document role and page type permit it.
- `decideApplicability`: exact, conditional, unknown, incompatible (PRD section 17).
- Numeric checks: unit normalization (litre, newton metre, bar, psi, kilopascal), range preservation (a range never matches a single value), approximate qualifiers, psi/kPa to bar conversion, exact matching within epsilon.
- Part-number checks: punctuation-insensitive normalization with strict digit/letter equality.
- Citation identity: `document_id + physical_pdf_page + block_id|content_hash` (PRD section 12.2), deduplication, and reconciliation against used keys.

### Shadow retrieval planner (`supabase/functions/_shared/barry-retrieval-planner.ts`)

- Runtime document-role and page-type inference from retrieval metadata using the same deterministic rules as the Phase 2 backfill (verified-identity only; unclassified pages stay `unknown`).
- Bounded relationship expansion: exactly one hop from frame-resolved concepts through the approved relationship allowlist. No expansion from expanded concepts.
- Auditable scoring per PRD section 11.10 with versioned weights (`1.0.0-shadow-phase3`): concept identity, relationship relevance, lexical overlap, structured-source bonus, applicability, role fitness, ambiguity penalty, distance penalty. Embedding score is not yet available in this pipeline and is excluded by design.
- Exclusions: incompatible applicability. Role/page-type combinations that permit none of the requested claim classes are penalized, not silently dropped, so shadow telemetry shows what the policy would do.
- Ambiguity is preserved: ambiguous concept matches attract a penalty; no candidate is silently preferred because it has more indexed content.

### Shadow wiring (`supabase/functions/barry-tools/index.ts`)

For technical queries, after the legacy response is complete:

1. Build shadow candidates from the same `groundingResults` the legacy pipeline used.
2. Run the planner with the request's semantic frame.
3. Compare the shadow ranking with the legacy `citedManualRefs` (overlap, shadow-excluded citations).
4. Attach a redacted summary to the existing fire-and-forget `barry_grounding_runs` insert.

The whole shadow block is wrapped so a shadow failure returns `{ error: 'shadow_retrieval_unavailable' }` and can never affect the response. The database write remains fire-and-forget and works even when the telemetry table is absent.

## Telemetry contract (redacted)

Stored under `semantic_frame_redacted.shadow_retrieval`:

- weights version, candidate counts, ranked/excluded counts;
- exclusion reason codes with counts;
- relationship expansions (concept keys, relationship types, distance only);
- positive-score count;
- legacy citation count, shadow/legacy overlap count, shadow-excluded citation count.

Never stored: raw or normalized user question, candidate text, page content, or claim text.

## What is deliberately not enabled

- No semantic retrieval in the live path. The planner does not filter, rerank, or add to what Barry retrieves or returns.
- No claim extraction, entailment, or grounding ledger (Phase 4).
- No citation reconciliation in the live response (the dedup/reconciliation functions exist and are unit-tested; live adoption requires Phase 4 claim mapping).
- No PDF viewer changes.

## Measuring shadow/legacy divergence

Once `barry_grounding_runs` exists in an environment, divergence is measured by:

- `overlap_count / legacy_citation_count`: citation agreement;
- `shadow_excluded_cited_count`: legacy citations the policy would have blocked;
- `exclusion_reasons`: which policies fire in practice;
- `expansion_count`: relationship usage per query.
