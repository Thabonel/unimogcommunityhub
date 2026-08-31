# Barry Mandatory Grounding Implementation PRD

**Date:** 2026-09-01

**Status:** Approved for implementation by user instruction

**Target:** Staging Git deployment

## Problem

Barry can misclassify a technical question, skip grounding, retrieve broad manual matches, invent unsupported values, and return every candidate page as a supporting source. The incident query `what is the u1700 tray lenth?` follows this path because the current keyword classifier does not recognize tray, length, dimensions, or the misspelling.

OCR quality is a separate input-quality concern. Better OCR improves searchable evidence but cannot ensure that a page supports a final claim.

## Objective

Make claim verification and citation reconciliation mandatory whenever a request, tool call, or generated answer is technical. No initial classifier decision may bypass the response safety boundary. Every displayed manual reference must support a retained claim.

## Non-goals

- Rebuilding the complete manual corpus in this release.
- Repairing unrelated public-site findings from the site audit.
- Changing production directly.
- Adding speculative answers when evidence is absent.

## Response invariants

1. Retrieval candidates are not citations.
2. Every returned citation maps to an evidence key supporting a retained claim.
3. Unsupported numeric claims are removed.
4. An evidence-gap or verifier-failure response returns no citations.
5. Manual or RPS tool use always triggers final claim inspection.
6. Grounding is enabled by default and cannot fall back to an unverified technical draft.
7. Vehicle modifications and page context are sent as typed context, not prepended to the question.
8. Safety notices are selected from the question and retained claims, then deduplicated.
9. The response exposes a redacted grounding mode and version for operations.

## Stage 1: Mandatory grounding and citation integrity

### Changes

- Build a semantic query frame for every request.
- Expand the governed semantic registry for load platform/tray and dimensional properties, including `lenth`.
- Use semantic intent to select forced technical retrieval.
- Record technical evidence returned by dynamically selected tools.
- Determine grounding after draft generation from semantic intent, technical tool use, and extracted claims.
- Always invoke claim grounding when required.
- Remove the raw-reference and page-number-only citation fallbacks.
- Fail closed with no citations when grounding fails.

### Stage 1 test gate

- Semantic query tests for tray, load platform, body dimensions, length, and `lenth`.
- Policy tests proving manual tool use triggers grounding even after an initial non-technical classification.
- Citation reconciliation tests proving unrelated candidates are excluded.
- Claim-verifier regression proving unsupported U1700 tray dimensions are removed with zero citations.
- Existing semantic, retrieval-planner, evidence-policy, and claim-verifier suites pass.

## Stage 2: Typed context and safety deduplication

### Changes

- Add a typed Barry request context containing vehicle identity, modifications, and page context.
- Keep the literal user question unchanged in the messages array.
- Provide context to the model in a separate system block with relevance restrictions.
- Use only the current question for semantic routing and retrieval.
- Replace answer-word safety scanning with question plus retained-claim hazard selection.
- Deduplicate notices by stable identifier and detect notices already present in the response.

### Stage 2 test gate

- Request-shape tests prove context is not concatenated to the question.
- Context formatter tests prove modifications are labelled untrusted and relevance-gated.
- Regression test with an extra fuel tank and rear winch proves no fuel warning is added to a tray-length evidence-gap answer.
- Safety tests prove one warning per identifier and no duplicate existing warning.
- Existing frontend Barry service tests pass.

## Stage 3: Regression suite and observability

### Changes

- Add pure response-policy helpers so the final safety boundary is directly testable.
- Add the exact incident and paraphrase regressions.
- Return `grounding_mode`, `grounding_required`, `grounding_reason`, `pipeline_version`, and `semantic_version`.
- Preserve redacted grounding telemetry and claim-decision audit writes.
- Update current Barry documentation to describe the canonical path.

### Stage 3 test gate

- Exact incident query with unrelated evidence produces no unsupported values or citations.
- Misspelling and context-pollution variants pass.
- Non-technical general chat without technical tools remains conversational and citation-free.
- Verifier error returns the fail-closed message and zero citations.
- Response normalisation preserves the grounding diagnostics.
- Targeted Barry suite passes.

## Final verification gate

- TypeScript production build succeeds.
- Focused Barry unit and integration tests pass.
- Lint is run on changed source files.
- Secret scan passes.
- `git diff --check` passes.
- Five review passes are completed: functionality, AI-slop, minimalism, robustness, and security.
- Only scoped files plus the two requested audit/PRD documents are committed.
- Commit is pushed to `staging main:main`; production is not pushed.

## Rollout and rollback

Staging receives the mandatory grounding path first. The response diagnostics make the active mode visible during manual testing. The Git rollback point is the commit immediately preceding this implementation. Rollback must not restore raw candidate citations; if model-assisted verification is unavailable, the permitted degraded behavior is a deterministic evidence gap with zero citations.

## Acceptance cases

| Case | Required result |
|---|---|
| `what is the u1700 tray lenth?` | Recognized as a specification request; unsupported values removed; only claim-backed citations, or none |
| Same question with extra tank and winch profile | Profile does not contaminate retrieval or add a fuel warning |
| Manual tool called for a phrase outside the semantic registry | Post-tool grounding still runs |
| Draft states a number absent from evidence | Number removed and no citation attached to that claim |
| Candidate page mentions U1700 but not tray length | Candidate is not returned as a supporting source |
| Verifier times out | Fail-closed response with no citations |
| Ordinary greeting | No unnecessary retrieval, verifier call, citation, or safety warning |

## Implementation results

All three stages were implemented on 2026-09-01.

- Stage 1 gate: 73 tests passed.
- Stage 2 gate: 13 tests passed.
- Stage 3/final Barry gate after review hardening: 80 tests passed.
- Frontend TypeScript check passed.
- Shared Barry TypeScript check passed.
- Production build passed.
- Secret scanner passed across 11,458 files.
- Scoped ESLint passed after disabling the repository's incompatible `react-hooks/exhaustive-deps` rule. The default lint invocation crashes inside the installed rule because it calls the removed ESLint API `context.getSource`.
- The full repository test command is not green independently of this change: 23 files and 90 tests fail in duplicated GPX suites, invoice/OCR providers, and fuel-receipt UI tests. The focused Barry suite is green and none of the full-suite failures touch the changed Barry files.
- `PUSH_TO_STAGING.md` is referenced by project instructions but is not present in this repository. The available `scripts/safe-push.sh` and Git safety rules were used as the fallback checklist.
