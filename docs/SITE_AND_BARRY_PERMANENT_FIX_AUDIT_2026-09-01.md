# Unimog Community Hub Site and Barry Grounding Audit

**Date:** 2026-09-01

**Scope:** Public production site, manuals experience, Barry technical-answer pipeline, OCR/manual history, and prior remediation attempts

**Status:** Audit complete; permanent remediation design proposed; no production code or data changed by this audit

## Executive verdict

The site has a strong visual foundation and the core navigation is generally responsive, but it is not yet as reliable or complete as it can be. Several public routes expose empty, simulated, broken, or misleading experiences. The most serious issue is Barry: a technical-looking answer can contain unsupported numbers and display unrelated pages as if they support the answer.

The reported U1700 tray-length answer is not primarily an OCR failure. It is a control-flow failure:

1. The query `what is the u1700 tray lenth?` does not match the small hard-coded technical keyword list.
2. Barry therefore classifies it as non-technical.
3. The semantic frame, forced evidence retrieval, evidence-gap prompt, and claim-grounding verifier are all skipped.
4. The model can still call the legacy manual search tool.
5. That search falls back from an all-word search to broad single-keyword matches, beginning with `u1700`.
6. Every retrieved result is returned to the frontend as a supporting reference, whether or not the answer cites it or the page supports a retained claim.
7. The model is free to add plausible-sounding dimensions from general knowledge or conversation/profile context.
8. The safety post-processor scans the generated answer for words such as `fuel`, then appends a warning even when the answer already contains that warning.

The codebase already contains much of the right long-term design: semantic frames, evidence-role rules, claim extraction, deterministic numeric checks, model-assisted entailment, answer reconstruction, and citation reconciliation. However, these protections were developed in phases, several were shadow-only, production activation of the Phase 4 claim verifier was explicitly left undone, and the runtime still uses the initial keyword classifier as the gate to every protection.

The permanent solution is not another keyword patch. It is to make grounding a response invariant: whenever Barry retrieves technical sources or produces a technical claim, the answer must pass claim-level verification, and the frontend may receive only evidence attached to retained claims. An unsupported or unverified answer must fail closed with no citations.

## Audit method and limitations

The audit used:

- live public-route inspection on `https://unimogcommunityhub.com` at desktop and 390 x 844 mobile dimensions;
- browser console and rendered-state inspection;
- repository tracing from the frontend Barry hook through the active `barry-tools` edge function;
- Git history for the Barry runtime and grounding work;
- the current tests and build warnings;
- the documentation index plus the active Barry, PDF, OCR, retrieval, grounding, page-mapping, context-bleeding, and handover documents under `docs` and relevant archived histories.

The repository contains 3,406 documentation files, including 151 whose filenames directly reference Barry, PDF, or OCR. The investigation used the documentation index and reviewed the current design/handover chain and historical remediation families relevant to this failure. Archived backup source files and unrelated product documentation were catalogued but were not treated as current implementation truth.

The live audit was deliberately non-destructive. It did not submit contact forms, create accounts, make purchases, alter production data, or exercise every authenticated workflow. Findings about authenticated-only pages therefore require a separate signed-in acceptance pass.

## Priority findings

| Priority | Finding | Evidence | User impact | Required outcome |
|---|---|---|---|---|
| P0 | Barry can produce unsupported technical values and unrelated citations | `barry-tools/index.ts:324-334, 1238-1241, 1376-1419` | Unsafe advice and false confidence in sources | Mandatory classifier-independent claim grounding and claim-backed citations |
| P0 | The public manuals library renders no manuals | Production console reports `permission denied for function check_admin_access`; client converts the failure to an empty list | Users see “No manuals available yet” despite the advertised library | Fix the storage policy/RPC boundary and load a canonical public manual catalogue |
| P1 | Marketplace and events fail to retrieve public data | Live console fetch/database failures and empty pages | Core community features look abandoned or broken | Repair read policies/API errors and add actionable error states |
| P1 | Contact page contains placeholder contact details and an inert form | `src/pages/Contact.tsx:16-40` | Messages are not delivered; trust and brand risk | Connect a real submission service and replace all placeholder details |
| P1 | Promoted vendor destination is broken | `/vendors/byond-rv` renders “Vendor Not Found” | Homepage CTA sends users to a dead end | Restore vendor data or remove/redirect the CTA |
| P2 | Pricing links existing members to a nonexistent route | `src/components/home/PricingSection.tsx:214` links `/account`; valid route is `/account-settings` | Account-management CTA leads to a 404 | Correct the route and add link-integrity coverage |
| P2 | Route Explorer presents mock routes and simulated upload/export as functional | `src/pages/ExploreRoutes.tsx:14-76, 114-147` | Users can mistake demonstrations for saved community data | Connect real services or label/remove the simulation |
| P2 | WIS is effectively empty and reports a U435 model lookup failure | Live page shows zero procedures, parts, and bulletins | Promoted technical feature appears non-operational | Repair model/data activation and state the beta limitation accurately |
| P2 | Runtime configuration errors are visible on ordinary pages | Environment validation failure, Barry config load failure, Redux production warning, location timeout | Noise, hidden fallback behavior, and harder incident diagnosis | Repair validation/config loading and downgrade expected fallbacks to structured telemetry |
| P2 | Login can briefly display raw translation keys | Observed first render contained keys before resolving | Poor perceived quality and accessibility | Gate render on namespace readiness or ship the critical namespace synchronously |
| P2 | Page titles are identical across routes | All sampled pages used the homepage title | Weak SEO, history, and screen-reader orientation | Add route-specific document metadata |
| P2 | Several icon buttons have no accessible label | One to eight unlabeled buttons on sampled pages | Screen-reader and voice-control friction | Add accessible names and automated axe coverage |
| P2 | Production bundles are very large | Prior production build: map about 1.66 MB and main index about 4.08 MB uncompressed | Slow first load on mobile and remote travel connections | Route-level splitting, dependency audit, and performance budgets |
| P3 | Gear catalogue has a duplicate object key | `src/data/gearCatalog.ts:53-54` | Build warning and avoidable code-quality defect | Remove the duplicate key |

## Live-site observations

### What works well

- The homepage has a clear identity, strong hero composition, and good mobile layout.
- Primary navigation and the pricing presentation are understandable.
- The pages sampled at mobile width did not exhibit horizontal overflow.
- Rendered images sampled during the audit had alternative text.
- Skip links were present.
- The shop has substantial content and the trip map route renders.

### Public manuals failure

The manuals page currently verifies the `manuals` storage bucket by listing objects and then calls `getBucket` when listing fails. `fetchApprovedManuals` converts every thrown error into an empty array. The resulting UI is indistinguishable from a genuinely empty library.

Relevant code:

- `src/services/manuals/manualService.ts:11-42`
- `src/services/manuals/fetchManuals.ts:9-67`
- `supabase/migrations/20260428214948_revoke_secdef_function_access.sql:127-134`

The production console reports that a storage-policy evaluation cannot execute `check_admin_access`. The security migration revoked that function from `PUBLIC` and `anon`. Revoking anonymous admin checks is reasonable, but a public-read storage policy must not call a function the public role cannot execute.

Permanent correction:

1. Stop using storage-object listing as the public manuals catalogue.
2. Read approved manuals from a canonical database view/RPC containing only safe public metadata and storage paths.
3. Give the view/RPC an explicit anonymous read contract; do not make public reads depend on an admin predicate.
4. Keep upload/update/delete policies admin-only.
5. Return a visible error state with a retry action when loading fails; reserve the empty state for a successful zero-row response.
6. Add an anonymous end-to-end test proving that at least the expected approved catalogue is visible and every PDF URL opens.

The recently added OCR-backed search is useful once the catalogue loads. It improves discovery of image-only or low-text PDFs, but it cannot compensate for a catalogue request that fails before search is shown.

### Other public-route issues

- `/marketplace` showed no listings and emitted database fetch errors. Some filter labels initially appeared as untranslated keys.
- `/events` showed an empty content area and emitted an event-fetch error without a useful user-facing failure state.
- `/knowledge/wis` reported no activated data and a missing U435 model.
- `/explore-routes` contains five hard-coded American sample trips; upload progress and export success are simulated.
- `/contact` has no submit handler, fields have no submission names or service integration, and the email, telephone number, and address are placeholders.
- `/account` is a 404 even though the pricing page links to it.
- `/vendors/byond-rv` renders “Vendor Not Found”.
- `/shop` renders roughly 293 links on one page; it needs search/pagination or virtualisation and performance validation.
- The Barry floating control slightly overlaps the manuals empty-state content on mobile.
- Auth presentation was inconsistent during the session: most public pages showed Login, while one marketplace render showed an authenticated-style navigation shell. This needs reproduction with a clean session before assigning a root cause.

## Barry incident analysis

### The reported question

`what is the u1700 tray lenth?`

### The defective response characteristics

- It correctly acknowledged that a coachbuilt tray may not have one universal Mercedes factory dimension.
- It nevertheless asserted a 3,700 mm wheelbase, a 3,800-4,200 mm frame length, an earlier 3,200 mm internal tray length, and a 1,600-1,800 mm width without evidence attached to those claims.
- It imported the vehicle’s extra tank and rear winch into the answer even though neither establishes tray length.
- It returned pages about a header tank, windows, wheel hubs, tool boxes, and a turbocharger.
- It duplicated the fuel warning.
- It exposed malformed escaped emphasis around “your”.

The answer is therefore not merely imprecise. Its citation contract is false: the pages displayed below the answer are retrieval candidates, not sources demonstrated to support its claims.

### Exact runtime failure chain

```text
User query
  -> frontend adds page/profile/conversation context to the message
  -> barry-tools receives "u1700 tray lenth"
  -> isTechnicalQuery checks a short substring list
  -> no match for tray/body/length/dimension/lenth
  -> technicalQuery = false
  -> no SemanticQueryFrame
  -> no forced V2 retrieval or evidence-gap instruction
  -> model is allowed to call legacy search tools
  -> legacy keywords = u1700, tray, lenth
  -> all-term full-text search misses
  -> single-keyword ILIKE fallback begins with broad "u1700"
  -> first arbitrary pages become manualRefs
  -> model drafts an unrestricted answer
  -> claim grounding is skipped because technicalQuery is false
  -> citedManualRefs = every manualRef
  -> frontend renders all of them as supporting documents
```

### Root cause 1: a keyword classifier is a safety boundary

`TECHNICAL_QUERY_TERMS` contains terms such as `axle`, `brake`, `oil`, `repair`, and `torque`, but not `tray`, `body`, `length`, `dimension`, `measurement`, `wheelbase`, `chassis`, `payload`, or `cargo`. `normaliseTechnicalQuery` corrects only two joined words and does not correct `lenth`.

That classifier determines whether Barry creates a semantic frame, performs controlled retrieval, adds an evidence constraint, invokes the verifier, and reconciles citations. A false negative therefore disables the entire safety architecture.

Adding `tray` and `length` would fix only this wording. The grounded-answers PRD correctly warns that question-by-question keyword fixes do not generalise.

### Root cause 2: legacy search has no minimum support threshold

The legacy search first requires all extracted words. When that fails, it queries each of the first four words independently with `ILIKE` and stops after filling the result limit. There is no relevance floor, role filter, claim-type constraint, entailment test, or deterministic ordering in that fallback. A vehicle model token such as `u1700` can therefore return almost any page from the model’s large manual.

### Root cause 3: retrieval candidates are relabelled as citations

For non-technical queries, the current response code assigns `citedManualRefs = manualRefs`. It does not check whether:

- the final answer mentions the page;
- the page entails a retained claim;
- the document role is allowed to support the claim;
- the model/variant applies;
- a numerical value occurs in the evidence; or
- the answer is an evidence-gap/abstention.

Even the legacy technical fallback only checks for a page number appearing in the prose. Page-number mention is not evidence entailment.

### Root cause 4: the completed verifier is optional and narrowly gated

Phase 4 implemented the correct components and reported 131 targeted tests plus a five-case benchmark. Its handover states:

- production deployment was not performed;
- `BARRY_CLAIM_GROUNDING` defaults off;
- the off state leaves the legacy verifier unchanged;
- activation required a migration and owner-set environment flag.

The current code confirms that flag and still wraps the verifier inside `if (technicalQuery)`. Enabling the flag alone would not fix this incident because this query is classified non-technical before the verifier is considered.

### Root cause 5: context is concatenated before intent and retrieval

The frontend prepends page and vehicle context directly to the user message. Earlier documentation diagnosed context bleeding from vehicle modifications, including an extra 200 L tank. The current answer again imports that tank and a rear winch. Context that may help personalize an answer is being allowed to influence query classification, search terms, and generation without a relevance decision.

Context needs typed channels, not one concatenated string:

- current user question;
- vehicle identity and variant;
- vehicle modifications;
- current page context;
- prior conversation summary;
- retrieved evidence.

Only vehicle identity should automatically constrain technical retrieval. Modifications and prior discussion should be admitted only when the semantic frame identifies them as relevant.

### Root cause 6: safety warnings are triggered from generated prose

`addSafety` scans the final answer rather than the user’s intent or verified retained claims. Mentioning an extra fuel tank causes the fuel warning. The function does not check whether the same warning is already present, which explains the duplicate.

### Root cause 7: tests validate components, not the live invariant

The current tests cover the semantic registry, retrieval planner, evidence policy, claim verifier, response-shape normalisation, and a few old specification flows. There is no test covering:

- a technical classifier false negative;
- a misspelled dimension question;
- a tool-calling non-technical path that returns manual candidates;
- an abstaining answer with zero citations;
- vehicle-profile context pollution;
- the exact `u1700 tray lenth` regression;
- the invariant that every rendered citation supports a retained claim.

The old `tests/specs_flow_test.ts` calls `chat-with-barry-agentic`, while the frontend currently calls `barry-tools` unless explicitly disabled. A passing old endpoint test does not validate production behavior.

## What previous remediation attempts changed

| Remediation family | What it improved | Why this failure remained possible |
|---|---|---|
| PDF-page and storage-path fixes | Corrected broken filenames, page fragments, and resolvable URLs | A correct link can still point to an unrelated page |
| Structure-aware Barry | Added hierarchy, chapters, and structured manual concepts | Several documents described readiness/integration steps rather than an enforced production response contract |
| OpenClaw seven-skill pipeline and response validator | Added domain routing and validation to an earlier runtime | The frontend now normally uses `barry-tools`; old endpoint protections do not prove current-path protection |
| Search/context-prefix cleanup | Removed bracketed prefixes from some searches and repaired PDF lookup | Current frontend still concatenates context, and the current `barry-tools` path uses a different routing/search implementation |
| Context-bleeding diagnosis | Correctly identified vehicle modifications contaminating answers | The documented action checklist was not completed as a typed-context boundary in the active path |
| Barry V2 structured extraction | Preserved sections, blocks, tables, specs, embeddings, and document registry data | The active legacy fallback remains available and raw candidates can bypass semantic evidence policy |
| OCR and scanned-PDF work | Makes photocopied manuals more searchable and preserves previously unreadable text | OCR improves candidate evidence; it does not establish that a candidate entails the answer |
| Semantic Phase 1 | Added governed concepts, aliases, relationships, and query frames | The frame is constructed only after the fragile technical keyword gate passes |
| Phase 2 evidence backfill | Added evidence units/annotations and production data | The handover states that runtime retrieval still did not read the live annotations at that stage |
| Phase 3 retrieval planner | Added role/page permissions, applicability, numeric checks, and ranking | It was shadow-only and explicitly prohibited from changing live responses or citations |
| Phase 4 claim verifier | Added claim extraction, deterministic checks, entailment, answer reconstruction, and citation reconciliation | Production activation was left pending; flag defaults off; classifier false negatives still bypass it |
| Manual-library OCR search | Added a useful UI search over PDFs, including OCR-backed indexing | The public catalogue currently fails its storage permission check, and library search is separate from Barry’s answer validator |

## Why fixes have repeatedly failed to become permanent

The recurring pattern is architectural and operational:

1. Multiple Barry runtimes and endpoints coexist. Documentation often describes an older pipeline as current.
2. Work was labelled complete when a component, schema, staging branch, shadow mode, or handover was complete, not when the production user-visible invariant was proven.
3. Safety was added behind flags with an unsafe legacy path as the default.
4. The same weak initial classifier remained the gate to newer safeguards.
5. Retrieval, citation display, OCR, PDF navigation, and answer verification were tested separately.
6. Regression suites emphasized known “technical” terms and did not target classifier misses, typos, context contamination, or misleading abstention citations.
7. There is no production-visible grounding version/mode in the response or admin diagnostics, so operators cannot immediately tell whether the safe path is active.

## Permanent solution

### Non-negotiable response invariants

These rules must be enforced in code after generation and before returning a response:

1. A retrieval result is never a citation by default.
2. Every displayed citation must support at least one retained claim in the final answer.
3. Every exact numerical technical claim must occur in eligible evidence with a compatible unit, qualifier, applicability, and condition.
4. Parts catalogues and exploded diagrams may identify parts; they may not authorize dimensions, diagnoses, torque values, capacities, or procedures unless the evidence unit is explicitly classified and permitted for that claim.
5. If support is insufficient or verification fails, Barry removes the claim or returns an evidence gap.
6. An evidence-gap answer returns zero “Supporting sources”. Candidate search results may be available only in an explicitly separate diagnostic/search-results view.
7. No initial classifier decision may bypass final claim inspection.
8. The system must fail closed if the verifier, evidence store, or citation reconciliation fails.

### Target pipeline

```text
Typed request envelope
  -> normalize spelling and resolve semantic concepts
  -> form SemanticQueryFrame for every query
  -> determine whether retrieval is useful, not whether safety applies
  -> retrieve canonical evidence units with role/applicability filters
  -> apply minimum evidence sufficiency rules
  -> generate a draft constrained by the evidence set
  -> extract technical claims from every draft
  -> deterministic numeric/identifier/role/applicability checks
  -> bounded model-assisted entailment for remaining claims
  -> reconstruct from supported/narrowed claims only
  -> reconcile citations from the retained claim ledger only
  -> add deduplicated intent/claim-based safety notices
  -> return answer + evidence ledger summary + grounding version
```

### Required code changes

#### 1. Remove `technicalQuery` as the grounding gate

In `supabase/functions/barry-tools/index.ts`:

- Build a semantic frame for every query. The frame may conclude that no technical concept or claim was requested.
- Introduce `requiresGrounding` after tool execution and draft generation. It is true when any of these hold:
  - a manual, RPS, knowledge-base, specification, or procedure tool was called;
  - retrieval returned a technical evidence unit;
  - deterministic claim extraction finds a technical claim;
  - the semantic frame requests a technical claim class.
- Run `groundTechnicalAnswer` whenever `requiresGrounding` is true.
- Do not use the presence or absence of one keyword match to decide whether claim verification applies.

The keyword classifier may remain temporarily as a retrieval-efficiency hint, but it must not have safety authority.

#### 2. Delete the raw-reference fallback

Replace the current citation selection with one source only: evidence keys in the final grounding ledger.

Conceptually:

```ts
const citedManualRefs = groundingResult.ok
  ? referencesForEvidenceKeys(groundingResult.retainedEvidenceKeys)
  : [];
```

There must be no `: manualRefs` branch and no page-number-only citation validation.

#### 3. Make Phase 4 fail-closed behavior the default

- Apply and verify the claim-audit migration.
- Deploy the verifier-enabled edge function.
- Remove the unsafe off state after the controlled rollout. A kill switch may disable model-assisted verification only if deterministic checks plus evidence-gap responses remain active.
- Return `grounding_mode`, `pipeline_version`, `semantic_version`, and a redacted decision summary for admin diagnostics.
- Add a health/diagnostic endpoint that proves the deployed mode without exposing prompts, secrets, or user content.

#### 4. Use the live evidence annotations and role-aware planner

- Read canonical Phase 2 evidence units and approved annotations in the live retrieval path.
- Activate the Phase 3 planner as a filter/ranker rather than telemetry only.
- Use V2 specification records first for dimension/capacity/torque/property questions.
- Treat vehicle model as an applicability constraint, not as a broad full-text search token.
- Enforce a minimum score and minimum role fitness. Zero qualifying evidence is a valid outcome.
- Keep RPS results out of non-parts answers unless a specific classified evidence unit is permitted for the requested claim.
- Complete duplicate-document reconciliation and canonical page identity before expanding the corpus.

#### 5. Normalize language without maintaining endless special cases

- Use the existing semantic alias types for workshop terms, owner terms, spelling variants, and common misspellings.
- Add governed concepts for body/tray/load platform, chassis, dimensions, length, width, payload, and wheelbase.
- Add typo-tolerant normalization before concept resolution, with conservative edit-distance limits and telemetry for unresolved terms.
- Store approved aliases from observed query logs through review rather than scattering replacements through runtime code.

This makes `tray length`, `body length`, `load platform dimensions`, and `lenth` converge on the same semantic request without making any individual phrase a safety switch.

#### 6. Isolate context

Change the frontend/service contract from a prefixed string to structured fields:

```ts
{
  question,
  vehicle: { model, variant },
  modifications: [...],
  pageContext: {...},
  conversationSummary
}
```

Server rules:

- retrieve using the current question plus approved identity/applicability constraints;
- do not inject modifications into retrieval unless the semantic frame references the affected system/component;
- never treat previous assistant claims as evidence;
- log which context fields were admitted, by type only, for debugging;
- add a regression where an extra fuel tank and winch are present but the answer does not mention them unless relevant.

#### 7. Correct safety-message handling

- Select warnings from user intent, verified procedure steps, and retained hazard concepts.
- Deduplicate by stable warning ID.
- Do not scan discarded draft text.
- Do not use warning text as technical evidence.

#### 8. Separate sources from search results in the UI

- Rename/render the existing source list only when the ledger contains supporting evidence.
- If product requirements need discovery results, show them separately as “Related manual search results”, never “Supporting documents”.
- Expose the claim supported by each source in an accessible disclosure where practical.
- Do not render a source block for an abstention with no supporting claim.

#### 9. Consolidate the runtime and documentation

- Declare `barry-tools` the single canonical endpoint or deliberately migrate back to another endpoint; do not leave the choice implicit.
- Remove or hard-disable unused production fallbacks after soak.
- Mark older OpenClaw/agentic architecture documents as historical and make `docs/reference/barry-system.md` describe the deployed path, flags, versions, and ownership.
- Use status vocabulary consistently: implemented, deployed to staging, deployed to production, flag enabled, verified in production.

## Release plan

### Phase A: Immediate containment

1. Add the exact reported query and variants to an integration regression fixture.
2. Stop returning raw `manualRefs` as citations for any path.
3. If an answer contains unverified technical numbers, replace it with an evidence-gap response.
4. Deduplicate safety warnings.
5. Add grounding mode/version to diagnostics.

This phase intentionally favors fewer answers over misleading answers.

### Phase B: Canonical grounded path

1. Build a semantic frame for every request.
2. Introduce post-draft `requiresGrounding` detection.
3. Wire live retrieval to the role-aware evidence planner and production annotations.
4. Make claim reconstruction and citation reconciliation mandatory.
5. Introduce the typed context envelope.

### Phase C: Corpus and OCR integrity

1. Complete the canonical document registry and duplicate reconciliation.
2. Backfill high-value dimension/body/tray evidence and document applicability.
3. Reprocess low-quality scanned pages using the proven OCR pipeline, preserving provenance and extraction quality.
4. Promote OCR text only after page-level comparison and review.
5. Verify physical PDF page mapping for every benchmark citation.

### Phase D: Benchmark release gate

Implement the PRD’s missing Phase 5 as a system-level suite against the actual production endpoint contract. Minimum initial set: 100 questions, including:

- at least 20 spelling/informal-language variants;
- at least 15 evidence-gap questions;
- at least 15 exact-number questions;
- at least 10 document-role traps using parts/RPS pages;
- at least 10 wrong-model or ambiguous-applicability cases;
- at least 10 context-pollution cases;
- the exact `what is the u1700 tray lenth?` question and paraphrases;
- PDF-opening checks for every expected citation.

Hard release gates:

- zero unsupported safety-critical claims;
- zero unsupported exact numerical claims;
- zero citations on unsupported/abstaining answers;
- zero RPS/document-role violations;
- 100 percent citation-to-retained-claim linkage;
- 100 percent cited URL and physical-page opening success;
- no regression in error rate or agreed latency budget.

Do not count a fluent answer, a tool call, or the presence of references as a pass.

### Phase E: Controlled production rollout

1. Run old and new paths in shadow comparison without returning old citations as truth.
2. Enable for internal/admin users.
3. Roll through 10, 25, 50, and 100 percent of technical/retrieval traffic.
4. Require benchmark success and a soak period at every step.
5. Monitor unsupported-claim removals, evidence-gap rate, verifier failures, role exclusions, latency, and citation-open errors.
6. Roll back generation if necessary, but retain fail-closed deterministic validation.

## Required regression cases for this incident

| Query/context | Expected behavior |
|---|---|
| `what is the u1700 tray lenth?` | Resolve U1700 plus tray/body dimension intent despite typo; use eligible dimension evidence or state that the corpus does not establish one; no unrelated citations |
| `what is the tray length?` with U1700L profile | Use model only as applicability context; do not mention unrelated modifications |
| Same query with extra 200 L tank and rear winch in profile | Do not introduce tank/winch unless the question asks about usable fitted length and evidence supports the reasoning |
| Same query after a prior fuel-system conversation | Current intent must not inherit fuel evidence or warning |
| No qualifying dimension evidence | Return a concise evidence gap and zero supporting sources |
| RPS pages mentioning tool boxes or tray modifications | Do not use them to support a general tray dimension unless the classified evidence directly contains and applies the dimension |
| Evidence contains one exact dimension for another variant | Preserve variant qualification or reject as incompatible |
| Draft invents a 3,700 mm value | Numeric validator removes it unless eligible evidence contains the value and unit for the applicable claim |
| Model/verifier timeout | Fail closed; no unverified draft or citations |
| Answer already includes a fuel warning | Stable-ID deduplication yields at most one warning |

## Site remediation sequence

After the Barry containment work, the broader site should be repaired in this order:

1. Public manuals permission/catalogue and explicit error state.
2. Marketplace/events read failures.
3. Real contact channel and removal of placeholder identity details.
4. Broken `/account` and vendor links.
5. Truthful Route Explorer behavior and WIS activation messaging.
6. Runtime environment/config warnings and authentication-shell consistency.
7. Translation loading, accessible labels, route-specific metadata, and Barry mobile overlap.
8. Bundle splitting, shop pagination/search, and build-warning cleanup.

Each public data feature should have three distinct tested states: loading, successful empty result, and failure. The current pattern often turns failures into empty content, which hides operational defects from users and monitoring.

## Acceptance criteria

The Barry issue is permanently resolved only when all of the following are true:

- The exact incident query passes against the deployed canonical endpoint.
- Changing or misspelling the component/property wording does not bypass grounding.
- All final technical claims have ledger decisions.
- All exact numbers have deterministic evidence matches.
- Every displayed source is referenced by a retained claim’s evidence key.
- An evidence-gap response displays no supporting sources.
- Parts/RPS role constraints are enforced in live retrieval and verification.
- Vehicle modifications do not enter unrelated retrieval or prose.
- Grounding mode and pipeline version are observable in production diagnostics.
- The 100-question release gate passes and is required in CI for Barry changes.
- The old unsafe citation fallback is absent, not merely disabled by configuration.

The public-site audit is closed when:

- anonymous users can browse and search approved manuals;
- marketplace and event failures are fixed or shown explicitly;
- all promoted links resolve to functioning destinations;
- the contact form delivers to a real monitored channel;
- simulated features are connected or clearly labelled;
- critical routes have unique titles and no raw translation keys;
- automated accessibility and link-integrity checks pass;
- performance budgets are defined and enforced.

## Documentation reviewed for the Barry investigation

Primary current references:

- `docs/README.md`
- `docs/reference/barry-system.md`
- `docs/BARRY_GROUNDED_ANSWERS_PRD.md`
- `docs/BARRY_GROUNDED_ANSWERS_PHASE0_PHASE1_HANDOVER.md`
- `docs/BARRY_PHASE2_EVIDENCE_BACKFILL_DESIGN.md`
- `docs/BARRY_PHASE2_STEERING_PILOT_AUDIT.md`
- `docs/BARRY_PHASE3_SHADOW_RETRIEVAL.md`
- `docs/BARRY_GROUNDED_ANSWERS_PHASE4_HANDOVER.md`
- `docs/BARRY_SEMANTIC_PHASE0_BASELINE.md`
- `docs/BARRY_SEMANTIC_COVERAGE_BASELINE.md`
- `docs/BARRY_EVIDENCE_BACKFILL_RUNBOOK.md`
- `docs/BARRY_V2_PRD.md`
- `docs/BARRY_V2_SYSTEM_DESIGN.md`
- `docs/BARRY_V2_EXECUTIVE_SUMMARY.md`
- `docs/BARRY_V2_HANDOVER_2026-06-12.md`
- `docs/BARRY_V2_CANONICAL_MANUAL_REGISTRY.md`
- `docs/BARRY_V2_MANUAL_PDF_INDEX.md`
- `docs/BARRY_UNLIMITED_OCR_PILOT.md`
- `docs/STRUCTURE_AWARE_BARRY_IMPLEMENTATION_COMPLETE.md`
- `docs/fix-barry-search-and-pdf.md`
- `docs/troubleshooting/barry-context-bleeding-issue-2026-03-10.md`
- `docs/plans/EXECUTION_PLAN_PDF_BARRY_PERFECTION.md`
- `docs/plans/PERFECT_BARRY_INDEX_SYSTEM.md`
- `docs/plans/2026-01-30-barry-pdf-page-fix-SUMMARY.md`
- `docs/2026-04-26-barry-tools-handover.md`
- `docs/BARRY_TOOLS_PHASE_1_PRD.md`
- `docs/BARRY_TOOLS_PHASE_2_PRD.md`
- `docs/BARRY_TOOLS_PHASE_3_PRD.md`

Historical material was used to identify recurring remediation patterns, but not as evidence of current production behavior. Current source code and the live site take precedence where documentation conflicts.

## Final conclusion

The site can become a strong, dependable community product, but the audit found material gaps between presentation and live function. Barry’s present defect is fully explainable and reproducible from the source code. The codebase does not need another isolated search tweak: it needs the already-designed grounding system promoted from optional, classifier-gated components into one mandatory end-to-end contract.

OCR remains important for the photocopied manuals. It should continue as the evidence-ingestion layer. It must not be treated as the answer-safety layer. The durable boundary is claim verification plus citation reconciliation immediately before the response leaves the server.
