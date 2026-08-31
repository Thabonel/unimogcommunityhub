# Barry AI System

**Status:** Canonical runtime reference

**Last updated:** 2026-09-01

## Active request path

The frontend calls the Supabase `barry-tools` edge function through `src/services/openclaw/barryToolsService.ts`. `src/hooks/use-barry-openclaw.ts` uses this path unless `VITE_BARRY_TOOLS_DISABLED=true` is deliberately set.

The active text model is DeepSeek. Older documents describing Claude/OpenClaw seven-skill traffic routing are historical and must not be used to infer current production behavior.

## Grounding contract

Barry uses mandatory claim-level grounding whenever any of the following is true:

- the semantic frame resolves a Unimog technical concept;
- a manual, structured-manual, knowledge-base, or RPS tool is used;
- the generated draft contains a technical claim.

The response boundary is implemented by:

- `supabase/functions/_shared/barry-semantic.ts`
- `supabase/functions/_shared/barry-retrieval-planner.ts`
- `supabase/functions/_shared/barry-evidence-policy.ts`
- `supabase/functions/_shared/barry-claims.ts`
- `supabase/functions/_shared/barry-claim-verifier.ts`
- `supabase/functions/_shared/barry-response-policy.ts`
- `supabase/functions/barry-tools/index.ts`

Mandatory invariants:

1. Search candidates are never returned as citations by default.
2. Every displayed citation must be selected by a retained claim's evidence key.
3. Exact numerical and part-number claims require deterministic evidence matches.
4. Document-role, page-type, and applicability policies are enforced before entailment.
5. Verification errors fail closed and return no citations.
6. Evidence-gap answers return no supporting sources.
7. Initial intent classification cannot bypass post-draft grounding.

## Request context

The literal user question remains unchanged. Vehicle and page context are sent in a separate typed `context` object. The edge function labels this metadata as non-evidence and instructs the model to use the vehicle model only for applicability and to mention modifications only when directly relevant.

Previous assistant responses, profile modifications, page metadata, and user assertions are never technical evidence.

## Retrieval

For recognized technical intent, the edge function performs controlled retrieval before generation:

1. validated knowledge lookup;
2. structured V2 manual search;
3. legacy manual fallback when V2 has no usable result.

RPS evidence is restricted to permitted part/component claim classes. The retrieval planner applies document-role, page-type, applicability, concept, and relevance policy before evidence reaches claim verification.

## Claim verification

The verifier:

1. extracts technical claims from the draft;
2. applies deterministic numeric and identifier checks;
3. removes evidence units that cannot authorize the claim class;
4. uses a bounded model entailment call for remaining claims;
5. reconstructs the answer from supported or narrowed claims;
6. builds citations only from evidence keys attached to retained claims.

If the verifier is unavailable for claims that require model entailment, Barry returns the fail-closed message rather than the draft.

## Safety notices

Safety notices are selected from the current question and retained grounded claims. They are not triggered by discarded draft text or unrelated vehicle modifications. Existing notice text is detected so the same warning is not appended twice.

## Diagnostics

The `barry-tools` response includes:

- `grounding_mode`
- `grounding_required`
- `grounding_reason`
- `pipeline_version`
- `semantic_version`

Redacted semantic and grounding summaries are written to `barry_grounding_runs`. Claim decisions are written to `barry_claim_decisions` when the migration is present. Telemetry write failures do not alter the user response.

## Required tests

Barry changes must run at minimum:

```bash
npx vitest run \
  src/__tests__/unit/services/barryResponsePolicy.test.ts \
  src/__tests__/unit/services/barryClaimVerifier.test.ts \
  src/__tests__/unit/services/barryEvidencePolicy.test.ts \
  src/__tests__/unit/services/barryRetrievalPlanner.test.ts \
  src/__tests__/unit/services/barrySemantic.test.ts \
  src/__tests__/unit/services/barryToolsService.test.ts
```

The exact regression query `what is the u1700 tray lenth?` must remain in the suite.

## Design and handover references

- `docs/BARRY_GROUNDED_ANSWERS_PRD.md`
- `docs/BARRY_GROUNDED_ANSWERS_PHASE4_HANDOVER.md`
- `docs/BARRY_MANDATORY_GROUNDING_IMPLEMENTATION_PRD_2026-09-01.md`
- `docs/SITE_AND_BARRY_PERMANENT_FIX_AUDIT_2026-09-01.md`
