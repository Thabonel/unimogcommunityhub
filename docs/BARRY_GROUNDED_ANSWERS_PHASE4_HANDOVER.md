# Barry Grounded Answers Phase 4 Handover

## Status

- **Date:** 2026-08-07
- **Scope:** Phase 4 (claim-level verifier) of `docs/BARRY_GROUNDED_ANSWERS_PRD.md`
- **State:** implementation, verification, and review complete; committed and pushed to staging
- **Production deployment:** not performed; requires the owner to apply the migration and set the flag
- **Activation model:** flag-gated live behavior (owner decision 2026-08-07). No shadow-compare mode was built.

## What was built

### Claim model and deterministic extraction

`supabase/functions/_shared/barry-claims.ts`

- `TechnicalClaim`, `ClaimDecision`, `GroundingLedger` types per PRD section 14.
- Deterministic line-level claim extraction: numbered procedure steps, numeric values with units (torque/capacity/specification by unit), Mercedes-style and coded part numbers, fluid terms, safety language, compatibility statements, model mentions.
- Claim-to-concept linkage through the existing `matchSemanticConcepts`.
- Safety-critical classification per PRD governance levels.
- `redactClaimText` (values and part numbers replaced with `<value>`) and `summarizeLedger` (count-only, no claim text) for telemetry.

### Validation pipeline

`supabase/functions/_shared/barry-claim-verifier.ts`

- `buildEvidenceUnits` converts legacy retrieval rows into typed evidence units using the Phase 3 planner (document role, page type, applicability, concept matches).
- Stage A deterministic eligibility: document-role and page-type permissions per claim class; incompatible applicability excluded; `unknown` applicability cannot support exact torque/fluid/capacity/part-number claims (FR-6).
- Stage C deterministic value checks run before any model call: all claim numerics must strictly match one evidence unit (ranges must match ranges; a range may not be rewritten as a single value, PRD 15.3); conflicting same-unit values produce `conflicted`; part numbers must match parts evidence.
- Stage B model-assisted entailment for the remaining claim classes: one bounded DeepSeek call (max 12 claims, 4 evidence units per claim, 500-character previews, JSON-object response). Verdicts are validated: unknown claim IDs and statuses rejected, evidence keys outside the eligible set dropped, `supported` without evidence keys becomes unsupported, and narrowed replacement text may not introduce numeric values absent from the cited evidence.
- Stage D reconstruction: supported lines kept verbatim, narrowed lines replaced, unsupported/conflicted lines removed; evidence-gap notes name the missing claim classes (FR-22); conflicts produce a configuration-confirmation note; zero supported claims marks the ledger abstained.
- Stage E citation reconciliation: only evidence units backing retained claims are returned.
- Fail closed (FR-23): model error, timeout, invalid JSON, or missing model returns `ok: false` and the caller substitutes a generic evidence-unavailable message. The unverified draft is never returned.

### Integration

`supabase/functions/barry-tools/index.ts`

- `BARRY_CLAIM_GROUNDING` env flag (default off). Off: legacy `verifyTechnicalAnswer` path unchanged.
- On: the grounding pipeline produces the live answer and the final citation list (replacing the page-number regex filter for technical queries).
- Telemetry: the existing `barry_grounding_runs` redacted payload gains a `claim_grounding` summary (counts by class and status, abstention, verifier status/latency, pipeline version). No claim text, raw question, or values are stored.
- Claim-level audit rows insert into `barry_claim_decisions` fire-and-forget; a missing table cannot break a response. Audit rows are written on successful grounding runs only.

### Migration

`supabase/migrations/20260808000000_barry_claim_decisions.sql`

- `barry_claim_decisions`: redacted claim text, class, status, reason code, confidence, evidence keys, pipeline version, request link.
- RLS enabled; service-role write; admin read; authenticated users hold no write grant.
- Validated on an isolated local PostgreSQL scratch database with stubbed Supabase objects: first and second apply succeeded (idempotent), the exact runtime row shape inserts, and an invalid `status` is rejected by the check constraint. Scratch database destroyed. Not applied to any Supabase project.

### Benchmark fixtures

`tests/benchmarks/barry-grounding-phase4-cases.ts` — five grounding cases built from the documented steering-box failure modes: invented fluid/capacity, diagram-as-procedure, range-rewritten-as-value, invented part number, and a supported specification control. Consumed by `barryGroundingBenchmark.test.ts`. The full 100-case release gate remains Phase 5.

### Planner fix

`inferPageType` in `supabase/functions/_shared/barry-retrieval-planner.ts` now classifies parts-catalogue candidates as `parts_list`, matching the Phase 2 backfill classification. Previously runtime inference returned `unknown`, which would have made RPS evidence ineligible for part-number claims.

## Verification results

- Targeted tests: 131 passed (95 Phase 1/2/3 + 36 Phase 4).
- Semantic benchmark: 20/20, 100% concept recall, 100% claim-class recall, 100% ambiguity recall, zero forbidden-concept violations.
- Grounding benchmark fixtures: 5/5 pass.
- `npx tsc --noEmit`: passed.
- Edge bundle (esbuild): passed; both new shared modules inline.
- Full suite: 304 passed, 88 failed; failure count identical to the pre-existing baseline (trip-planner, OCR integration, duplicate ` 2` directories; none touch task files).
- `npm run build`: passed (19.2s).
- `node scripts/check-secrets.js`: clean. Task files scanned for project URLs and JWTs: no matches.

## Review passes

1. **Functionality:** flag off leaves the legacy path byte-identical; flag on routes technical answers through extraction, deterministic checks, bounded model entailment, reconstruction, and claim-backed citations; fail-closed path verified by test.
2. **AI slop:** no placeholders, invented facts, or unused exports; an unused helper was removed during review.
3. **Minimalism:** no retrieval, PDF, or rollout-phase behavior introduced; one env flag is the only new runtime surface.
4. **Robustness:** invalid model JSON, thrown model errors, missing model, over-cap claims, and out-of-set evidence keys all resolve to safe outcomes; migration is idempotent.
5. **Security:** RLS and grants mirror Phase 1; telemetry and audit rows contain no raw question, claim values, or part numbers; no secrets in task files.

## Not implemented (later phases)

- 100-case benchmark and release gate (Phase 5).
- PDF viewer repair and document integrity audit (Phase 6).
- Controlled rollout cohorts (Phase 7).
- Duplicate-claim result caching across requests (PRD 23.4).
- Claim decisions audit rows on the fail-closed path.

## To activate in production

1. Apply `supabase/migrations/20260808000000_barry_claim_decisions.sql` in the SQL editor.
2. Set `BARRY_CLAIM_GROUNDING=true` on the `barry-tools` function and redeploy.
3. Smoke tests:
   - `my steeringbox is leaking, what do I do` — answer must not invent fluid, capacity, or procedure; one `barry_grounding_runs` row with a `claim_grounding` summary; claim rows in `barry_claim_decisions` contain no values or part numbers.
   - `what oil and how much goes in the steering system` — configuration-conditional fluids only if supported; otherwise a named evidence gap.
   - Disable the DeepSeek key temporarily — response must be the fail-closed message, never an unverified draft.
