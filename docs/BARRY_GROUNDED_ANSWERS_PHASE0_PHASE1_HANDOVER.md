# Barry Grounded Answers Phase 0 and Phase 1 Handover

## Handover Status

- **Date:** 2026-07-27
- **Repository:** `unimogcommunityhub`
- **Working directory:** `/Users/thabonel/Code/unimogcommunityhub`
- **Branch:** `main`
- **Requested scope:** Phase 0 and Phase 1 of `docs/BARRY_GROUNDED_ANSWERS_PRD.md`; Phase 2 added on 2026-07-27 (see Phase 2 Addendum below)
- **Current state:** Phase 0, Phase 1, and Phase 2 implementation, verification, review, and commit complete; staging pushes recorded below
- **Production deployment:** Not authorized and not performed
- **Database migration:** Phase 1 and Phase 2 migrations validated on isolated local PostgreSQL 14 databases; not applied to any Supabase project
- **Staging Supabase backend:** Does not exist. The project owner waived the requirement on 2026-07-27 ("there is no staging supabase, its not necessary"). Phase 1 activation and smoke tests remain pending indefinitely; production must not be used as a substitute.
- **Later PRD phases:** Phase 3 retrieval and beyond not started

The user asked for incremental implementation covering:

1. Phase 0 benchmark baseline and instrumentation.
2. Phase 1 semantic schema design.
3. Initial controlled ontology.
4. Semantic versioning and activation controls.
5. Semantic query-frame types and deterministic alias resolution.
6. Live Supabase schema verification before migrations.
7. All required tests and staging-only deployment.
8. No progression beyond Phase 1 until its acceptance criteria pass.

## Governing Requirements

Read and follow `/Users/thabonel/Code/unimogcommunityhub/AGENTS.md`.

Important repository rules:

- Preserve unrelated user work.
- Run the five review passes: functionality, AI slop, minimalism, robustness, and security.
- Run verification before declaring completion.
- Automatically commit and push completed work to the `staging` remote only.
- Production push to `origin` requires explicit permission. No permission exists for this task.
- Verify the live schema before writing migrations.
- Do not directly apply SQL migrations; the repository workflow requires reviewed SQL and manual execution through the appropriate Supabase environment.
- Include this commit trailer:

```text
Co-Authored-By: Codex Sonnet 4 <noreply@anthropic.com>
```

`PUSH_TO_STAGING.md` was searched for but does not exist in this checkout.

## Unrelated Work That Must Be Preserved

The worktree was already dirty before this implementation. Do not stage, revert, overwrite, or include the following unrelated changes:

- `supabase/.temp/cli-latest`
- `supabase/functions/process-invoice-ocr/index.ts`
- `.codex/`
- `opencode.json`
- `src/__tests__/unit/ocr/fuelOcrShared.test.ts`
- `supabase/functions/_shared/fuel-ocr.ts`

Always stage the Barry files explicitly. Do not use `git add -A`.

## Live Supabase Schema Verification

Read-only verification was completed before the migration was authored. The linked project was not mutated.

The following commands were used successfully during the initial audit:

```bash
npx supabase inspect db table-stats --linked
npx supabase db query --linked "<read-only information_schema and count queries>"
```

The proposed semantic tables did not exist in the linked live schema.

### Existing row counts

| Existing structure | Rows |
|---|---:|
| `manual_chunks` | 2,419 |
| `barry_v2_source_documents` | 151 |
| `barry_v2_manuals` | 71 |
| `barry_v2_content_blocks` | 3,584 |
| `components` | 17 |
| `component_synonyms` | 25 |
| `rps_component_synonyms` | 76 |
| `barry_v2_vehicle_models` | 2 |

The two existing vehicle-model records are `u1700l` and `u435`.

### Document-integrity baseline

| Source | Rows | Documents | Missing storage path | Missing page count/page | Unverified or non-usable |
|---|---:|---:|---:|---:|---:|
| `manual_chunks` | 2,419 | 8 | 3 | 0 | 2,419 |
| `barry_v2_source_documents` | 151 | 151 | 151 | 96 | 80 |
| `barry_v2_manuals` | 71 | 71 | 71 | 0 | 0 |

All 2,419 `manual_chunks` records reported `pdf_verified = false`.

### Existing systems preserved

- `components`
- `component_synonyms`
- `attributes`
- `attribute_synonyms`
- `wis_properties`
- the RPS synonym workflow
- Barry v2 source-document, manual, content-block, specification, diagnostic, and model tables

The Phase 1 migration adds parallel semantic structures. It does not rename, delete, or repurpose existing tables.

### Supabase access note

A later repeat of `npx supabase db query --linked` reported that no access token was available in that shell. This does not invalidate the earlier completed read-only audit. Do not apply or test the migration against the linked project merely to regain syntax validation. Obtain the correct staging credentials or use an isolated local/staging database.

## Implemented Files

### Shared semantic implementation

`supabase/functions/_shared/barry-semantic.ts`

Contains:

- semantic version constant and typed version definition;
- controlled concept-type union;
- controlled alias-type union;
- controlled relationship-type union;
- Barry claim-class union;
- concept, alias, relationship, registry, ambiguity, constraint, query-frame, and telemetry interfaces;
- Phase 1 ontology registry;
- contextual alias registry;
- typed initial relationship set;
- deterministic text normalization;
- context-aware alias resolution;
- ambiguity preservation;
- semantic query-frame construction;
- redacted telemetry summary construction.

The query frame currently represents:

- semantic version;
- request identifier;
- normalized query for in-memory processing;
- vehicle model and variant concepts;
- system concepts;
- component concepts;
- symptom concepts;
- operation concepts;
- property concepts;
- fluid concepts;
- part concepts;
- tool concepts;
- hazard concepts;
- requested claim classes;
- typed property constraints;
- unresolved terms;
- material ambiguities;
- confidence.

The raw question is not included in the telemetry contract.

### Initial ontology

The runtime registry and migration cover:

- U435 and U1700L models;
- U1700L/38 variant;
- steering, hydraulics, brakes, compressed air, axles, engine, cooling, transmission, electrical, and suspension systems;
- high-value steering, axle, brake, compressor, cooling, fuel, transmission, clutch, and electrical components;
- external leak, overheating, no-start, low-pressure, noise, and vibration symptoms;
- inspection, diagnosis, removal, installation, adjustment, refill, replacement, fluid-level check, and bleeding operations;
- all Barry claim classes;
- fluid capacity, torque, pressure, clearance, fluid specification, and part-number properties;
- ATF, hydraulic oil, and engine oil fluid classes;
- litre, newton metre, and bar units;
- generic sealing-ring and repair-kit part concepts without inventing part numbers;
- puller and pressure-gauge tool concepts;
- workshop, maintenance, owner, parts-catalogue, and validated-knowledge document roles;
- procedure, diagnostic, specification, warning, diagram, parts-list, explanation, and index page types;
- loss-of-steering-assist hazard.

No unverified steering fluid, capacity, seal-kit number, or repair procedure was added.

### Alias handling

Approved Phase 1 aliases include:

- `steeringbox`, `steering box`, and `steering gearbox`;
- contextual steering/cooling uses of `pump`;
- owner and workshop names for portal hub, differential, steering coupling, pitman arm, transfer case, and alternator;
- symptom phrases and spelling variants;
- common operation terms;
- property phrases such as `how much oil`, `tightening torque`, and `part no`.

Material ambiguity is preserved. For example, `the pump is leaking` remains ambiguous between power-steering and water-pump concepts when no system context exists.

### Semantic migration

`supabase/migrations/20260727000000_barry_semantic_phase1.sql`

Creates:

- `barry_semantic_versions`
- `barry_semantic_concepts`
- `barry_semantic_aliases`
- `barry_semantic_relationships`
- `barry_evidence_concepts`
- `barry_semantic_review_queue`
- `barry_grounding_runs`

Also includes:

- indexes;
- row-level security;
- service-role write policies;
- admin read policies;
- deterministic alias normalization trigger;
- immutable concept-identity trigger;
- service-role-only version activation function;
- single-active-version unique index;
- Phase 1 version seed;
- initial concept, alias, and relationship seeds;
- safe import of compatible legacy `component_synonyms`;
- import of every RPS synonym into the review queue as a controlled proposal;
- no semantic evidence backfill.

The RPS proposal import converts each source row to JSON before reading fields. This supports both RPS shapes seen in the repository:

- `phrase`, `normalized_phrase`, `group_hint`, `weight`; and
- `user_term`, `group_code`, `confidence`.

RPS synonyms are not inserted directly as approved semantic aliases.

The migration uses `request_id text` in `barry_grounding_runs`, because a client conversation identifier is not guaranteed to be a UUID. It stores the semantic version as a stable text label, avoiding a version-ID lookup on every telemetry write.

### Shadow-only Phase 0 instrumentation

`supabase/functions/barry-tools/index.ts`

For every request already classified as technical:

1. Builds a semantic frame before existing retrieval.
2. Does not use that frame to alter retrieval, generation, citations, or the visible response.
3. Writes redacted semantic telemetry to `barry_grounding_runs`.
4. Omits the normalized/raw question and constraint values from the telemetry payload.
5. Swallows telemetry write failures so an absent pre-migration table cannot break Barry.

This is intentionally observation-only. Semantic retrieval is Phase 3 and has not been implemented.

### Legacy classifier export

`supabase/functions/barry-tools/tools/classify-query-v2.ts`

The existing pure classifier was renamed and exported as `classifyQueryV2`. Its behavior is unchanged. The benchmark runner uses it to calculate the legacy baseline.

### Benchmark corpus and runner

- `tests/benchmarks/barry-semantic-phase1-cases.ts`
- `tests/benchmarks/baselines/barry-semantic-phase0.json`
- `scripts/run-barry-semantic-benchmark.ts`
- `package.json`

The committed corpus contains 20 representative cases across:

- steering;
- axles and portal hubs;
- brakes;
- compressed air;
- cooling;
- engine and fuel;
- transmission;
- electrical;
- fluid and capacity questions;
- torque and part-number questions;
- spelling and terminology variants;
- contextual and unresolved ambiguity.

Run it with:

```bash
npm run barry:semantic:benchmark
```

The `tsx` runner may require permission to create a temporary IPC socket in the macOS temporary directory.

### Tests

- `src/__tests__/unit/services/barrySemantic.test.ts`
- `src/__tests__/unit/migrations/barrySemanticPhase1Migration.test.ts`

The tests cover:

- all 20 benchmark cases;
- deterministic normalization;
- telemetry privacy;
- version contract;
- ontology referential consistency;
- relationship referential consistency;
- typed query constraints;
- required migration tables;
- RLS presence;
- runtime/migration ontology agreement;
- RPS review-queue routing;
- activation-function access control;
- absence of destructive table/data statements.

### Documentation

- `docs/BARRY_SEMANTIC_PHASE0_BASELINE.md`
- this handover document

The `docs/` directory is ignored by the repository’s current Git rules. These files must be staged with `git add -f`.

## Benchmark Results

Latest successful semantic benchmark:

| Metric | Result |
|---|---:|
| Cases | 20 |
| Passed | 20 |
| Case pass rate | 100% |
| Concept recall | 100% |
| Claim-class recall | 100% |
| Ambiguity recall | 100% |
| Forbidden-concept violations | 0 |

Legacy baseline over the same corpus:

| Metric | Result |
|---|---:|
| Query-type coverage | 70% |
| System-tag coverage | 40% |
| Model-tag coverage | 95% |

The benchmark establishes Phase 0 and Phase 1 query-interpretation performance only. It does not measure semantic retrieval, claim entailment, citation precision, PDF landing accuracy, or evidence backfill because those belong to later phases.

## Tests Already Run

Final targeted run on 2026-07-27:

```text
src/__tests__/unit/migrations/barrySemanticPhase1Migration.test.ts: 5 passed
src/__tests__/unit/services/barrySemantic.test.ts: 25 passed
Total: 30 passed
```

The benchmark passed 20 of 20 cases with 100% concept recall, 100% claim-class recall, 100% ambiguity recall, and zero forbidden-concept violations.

After the earlier checkpoint, the RPS migration import was made schema-shape tolerant. The migration test window was widened to match the final SQL layout, and the full targeted suite was rerun and passed.

## Final Verification Evidence (2026-07-27)

### Migration SQL validation

Docker was unavailable, so the migration was applied to an isolated local PostgreSQL 14 scratch database with stubbed Supabase objects (`auth` schema, `auth.users`, `auth.role()`, `public.check_admin_access()`, `anon`/`authenticated`/`service_role` roles, and legacy `components`, `component_synonyms`, and `rps_component_synonyms` tables containing both known RPS row shapes).

Results:

- first apply succeeded;
- second apply succeeded (idempotent, including `DROP POLICY IF EXISTS` guards);
- 86 concepts, 51 aliases, 10 relationships, and 2 RPS review-queue proposals were seeded;
- the unmapped legacy component synonym was correctly excluded;
- both RPS shapes produced `pending`/`controlled` proposals; none became approved aliases;
- `activate_barry_semantic_version` preserved exactly one active version and its `EXECUTE` grant is limited to `service_role`;
- the concept-identity immutability trigger rejected a `concept_key` change;
- SQL alias normalization now strips apostrophes, matching the runtime (`Won't START!!` normalizes to `wont start`).

The scratch database was destroyed after validation. The migration was not applied to the linked production project or any staging Supabase project.

### Type, bundle, test, build, and security results

- `npx tsc --noEmit`: passed.
- Edge bundle: Deno is not installed; `supabase functions serve` requires unavailable Docker. esbuild (`--bundle --external:'https://*'`) bundled `barry-tools/index.ts` successfully and the `../_shared/barry-semantic.ts` import inlined. This is the closest safe repository-supported check.
- Full suite (`npm test -- --run`): 196 passed, 88 failed. All failures are pre-existing or environmental: e2e specs fail on the missing `@playwright/test` package; duplicate ` 2` test directories fail independently; trip-planner, waypoint, geo, and track suites fail without any task-file involvement; OCR and fuel-modal failures belong to the unrelated preserved OCR work. The two task test files pass within the full run.
- `npm run build`: succeeded in 19.2s.
- `node scripts/check-secrets.js`: clean. Task-owned files scanned for project URLs, JWTs, and service-role credentials: no matches.

### Review passes

1. **Functionality:** technical requests build the frame at `supabase/functions/barry-tools/index.ts` before retrieval; the frame is never read by retrieval, generation, or citation code; telemetry insert is fire-and-forget with a swallowed catch, so a missing table or duplicate `request_id` cannot fail the response.
2. **AI slop:** no placeholders, invented facts, speculative mappings, verbose comments, duplicate code, or emojis in task files.
3. **Minimalism:** no Phase 2+ retrieval, grounding, or citation behavior was introduced.
4. **Robustness:** empty queries are gated by `isTechnicalQuery`; normalization, contextual aliases, and material ambiguity are unit-tested; both RPS shapes were exercised against the scratch database; the migration is idempotent. Fire-and-forget telemetry may lose writes if the runtime terminates early; this is accepted for shadow telemetry and documented.
5. **Security:** RLS enabled on all seven tables; authenticated users receive SELECT grants but no read policy (admin-only reads) and no write path; `SECURITY DEFINER` uses a fixed `search_path`; telemetry stores no raw or normalized question; no secrets in task files.

## Phase Boundary

Implemented:

- Phase 0 baseline;
- Phase 0 document-path/page-count audit;
- Phase 0 semantic instrumentation without behavior change;
- Phase 1 schemas;
- Phase 1 ontology and relationship allowlist;
- Phase 1 alias resolver and ambiguity handling;
- Phase 1 query-frame types and parser;
- Phase 1 versioning and activation controls;
- Phase 1 legacy synonym migration design.

Not implemented:

- evidence annotation backfill;
- semantic retrieval or relationship traversal;
- retrieval ranking changes;
- evidence-unit normalization;
- document-role/page-type policy engine;
- structured grounding ledger;
- claim extraction or entailment verification;
- numeric and part-number checks;
- citation reconciliation;
- PDF viewer repair;
- 100-case final benchmark;
- production rollout.

Do not start these later phases in this task.

## Remaining Work in Exact Order

### 1. Rerun targeted tests

```bash
npx vitest run \
  src/__tests__/unit/services/barrySemantic.test.ts \
  src/__tests__/unit/migrations/barrySemanticPhase1Migration.test.ts
```

Expected result: 30 passing tests or more if tests are added.

### 2. Rerun benchmark

```bash
npm run barry:semantic:benchmark -- \
  --output=/tmp/barry-semantic-phase1-result.json
```

Expected Phase 1 gate:

- 20/20 cases pass;
- 100% concept recall;
- 100% claim-class recall;
- 100% material ambiguity recall;
- zero forbidden-concept violations.

### 3. Validate migration syntax safely

Preferred options:

1. Start an isolated local Supabase/Postgres instance and apply the migration there.
2. Use a dedicated staging Supabase project.
3. Use a genuine dry-run command that cannot mutate the linked database.

Do not apply the migration to the linked production project.

Docker was unavailable during the initial work, so `supabase db dump` and local database validation could not be completed. If local Postgres remains unavailable, document the limitation clearly and do not represent the migration as applied.

Review these migration details:

- `public.check_admin_access()` exists in the target environment;
- both supported RPS synonym row shapes produce valid review payloads;
- the alias seed `LEFT JOIN` for context concepts parses correctly;
- version activation preserves exactly one active version;
- all policies compile;
- no grants expose writes to authenticated users.

### 4. Type and edge-function checks

At minimum:

```bash
npx tsc --noEmit
```

Also run the repository’s available Supabase/Deno function check or bundle check for:

- `supabase/functions/barry-tools/index.ts`
- `supabase/functions/_shared/barry-semantic.ts`

The new relative import must be confirmed compatible with the Supabase function bundler.

### 5. Full repository tests

```bash
npm test -- --run
```

If the full suite has pre-existing failures, isolate them and prove whether they involve the changed files. Do not modify unrelated failing features without authorization.

### 6. Production frontend build

```bash
npm run build
```

No frontend behavior was intentionally changed, but AGENTS.md requires a production build.

### 7. Security checks

Use the repository commands where available:

```bash
node scripts/check-secrets.js
rg -n "ydevatqwkoccxhtejdor\\.supabase\\.co|eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9" \
  supabase/functions/_shared/barry-semantic.ts \
  supabase/functions/barry-tools/index.ts \
  supabase/migrations/20260727000000_barry_semantic_phase1.sql \
  scripts/run-barry-semantic-benchmark.ts \
  tests/benchmarks \
  src/__tests__/unit/services/barrySemantic.test.ts \
  src/__tests__/unit/migrations/barrySemanticPhase1Migration.test.ts
```

Do not scan or stage the unrelated OCR changes as part of this task.

### 8. Perform the five review passes

1. **Functionality:** trace technical request to pre-retrieval frame and telemetry.
2. **AI slop:** remove placeholders, speculative facts, verbose comments, and invented data.
3. **Minimalism:** confirm no later-phase retrieval or grounding behavior was introduced.
4. **Robustness:** inspect ambiguity, empty input, missing table, duplicate request, and migration idempotency behavior.
5. **Security:** inspect RLS, grants, `SECURITY DEFINER`, search path, telemetry privacy, and secrets.

### 9. Update documentation with final evidence

Update `docs/BARRY_SEMANTIC_PHASE0_BASELINE.md` if final results differ. Add `barry_grounding_runs` to the list of proposed tables if it is still omitted.

Record:

- final test counts;
- build result;
- security result;
- migration validation method and result;
- any known limitations.

### 10. Stage only task files

Use explicit paths:

```bash
git add \
  package.json \
  scripts/run-barry-semantic-benchmark.ts \
  src/__tests__/unit/services/barrySemantic.test.ts \
  src/__tests__/unit/migrations/barrySemanticPhase1Migration.test.ts \
  supabase/functions/_shared/barry-semantic.ts \
  supabase/functions/barry-tools/index.ts \
  supabase/functions/barry-tools/tools/classify-query-v2.ts \
  supabase/migrations/20260727000000_barry_semantic_phase1.sql \
  tests/benchmarks/barry-semantic-phase1-cases.ts \
  tests/benchmarks/baselines/barry-semantic-phase0.json

git add -f \
  docs/BARRY_SEMANTIC_PHASE0_BASELINE.md \
  docs/BARRY_GROUNDED_ANSWERS_PHASE0_PHASE1_HANDOVER.md
```

Confirm staged scope:

```bash
git diff --cached --stat
git diff --cached --name-only
```

### 11. Commit

Suggested commit:

```text
feat: add Barry semantic foundation

Co-Authored-By: Codex Sonnet 4 <noreply@anthropic.com>
```

### 12. Push only to staging

```bash
git push staging main:main
```

Do not run:

```bash
git push origin main
```

Do not deploy the edge function or migration to the linked production Supabase project.

### 13. Staging smoke test

Once the staging environment has the reviewed migration and function:

1. Submit `my steeringbox is leaking, what do I do`.
2. Confirm the visible answer and references are unchanged by the shadow semantic frame.
3. Confirm one `barry_grounding_runs` record exists.
4. Confirm no raw user question is present in that record.
5. Confirm concepts include steering gear, steering system, external leak, inspection, and diagnosis.
6. Submit `the pump is leaking`.
7. Confirm telemetry records the material pump ambiguity.
8. Confirm telemetry failure cannot break a Barry response.

If the Git staging environment does not include a staging Supabase backend, report the backend smoke test as pending rather than applying anything to production.

## Known Risks and Decisions

### Migration executed only on an isolated scratch database

The SQL was applied twice to a disposable local PostgreSQL 14 instance and passed. It has not been applied to any Supabase project. Backend application to a staging Supabase project remains pending.

### Shadow telemetry table availability

Until the migration exists in an environment, the telemetry insert fails silently by design. Barry’s user-visible behavior remains available.

### Fire-and-forget telemetry

The implementation follows the function’s existing asynchronous logging pattern. The runtime may terminate before a write finishes. A later operational hardening pass may use the supported edge-runtime background-task mechanism, but that should not be introduced without bundler/runtime verification.

### Semantic version activation

The Phase 1 seed is marked active in a new semantic table, but no retrieval code consumes that table yet. It does not activate semantic retrieval.

### Evidence mappings intentionally empty

`barry_evidence_concepts` exists but receives no backfill in Phase 1. Creating guessed mappings would violate the evidence-first design.

### Generic parts only

The ontology contains generic sealing-ring and repair-kit concepts. It contains no alleged `PA 9001`, `PA 9002`, fluid capacity, or oil specification because the earlier steering-box answer did not establish those facts from valid evidence.

### Final PRD acceptance is not claimed

The full PRD’s acceptance criteria require later phases, including claim-level grounding, citation correctness, PDF loading, and a 100-case suite. Only the Phase 0 and Phase 1 foundation can pass in this task.

## Recommended Completion Report

When finished, report:

- Phase 0 and Phase 1 complete;
- live schema was verified read-only before migration design;
- migration was validated only in the named safe environment and not production;
- semantic benchmark result;
- unit/full test totals;
- build result;
- security scan result;
- exact commit hash;
- staging push result;
- whether a staging backend smoke test was possible;
- later phases explicitly not started;
- unrelated files preserved.


## Phase 2 Addendum (2026-07-27)

Phase 2 (semantic evidence backfill) was implemented after the owner waived the staging-backend requirement. Phase 3 was not started.

### Gate A outcome

No dedicated staging Supabase project exists. The account holds only the production project plus unrelated applications. The owner directed that staging infrastructure is unnecessary. Phase 1 staging activation and smoke tests were not performed and remain pending; production was not used as a substitute.

### Implemented

- `supabase/migrations/20260728000000_barry_semantic_phase2.sql`: `barry_backfill_runs`, `barry_documents`, `barry_evidence_units`; `barry_evidence_concepts` extended with `evidence_unit_id`, `model_scope`, `backfill_run_id`, `provenance`; service-role-only `rollback_barry_backfill_run`; RLS mirroring Phase 1. Additive and idempotent.
- `scripts/barry-backfill/`: deterministic document-role and page-type classification; evidence adapters for `manual_chunk`, `barry_v2_content_block`, `rps_part`, `rps_illustration`, and `barry_v2_specification`; pg store with idempotent upserts; dry-run store; coverage aggregation; CLI with dry-run default, source/document/page filters, batch limits, resume cursor, coverage, and rollback.
- One governed ontology addition from verified RPS terminology: `seal ring` alias for `part.sealing_ring`, added to the runtime registry and Phase 1 migration seed with parity.
- Tests: 38 new (12 classification, 14 adapter, 7 backfill behavior, 5 migration contract... see counts below). Legacy retrieval untouched; `barry-tools` unchanged in Phase 2.

### Verification results

- Targeted tests: 68 passed (30 Phase 1 + 38 Phase 2).
- Semantic benchmark: 20/20, 100% concept recall, 100% claim-class recall, 100% ambiguity recall, zero forbidden-concept violations.
- `npx tsc --noEmit`: passed.
- Edge bundle (esbuild): passed.
- Full suite: 234 passed, 88 failed; failure set identical to the pre-existing Phase 1 baseline (no new failures).
- `npm run build`: passed (20.2s).
- Secret scan: clean; no project URLs, JWTs, or keys in task files.

### Pilot execution (local PostgreSQL 14, read-only production extract)

- Phase 1 and Phase 2 migrations each applied twice; idempotent.
- Steering pilot: 74 documents, 440 evidence units, 1,006 annotations (252 approved, 754 proposed), 199 controlled review items.
- Re-apply produced zero duplicates. Resume cursor verified. Rollback verified and ownership-corrected (first creating run owns rows).
- Coverage measured: see `docs/BARRY_SEMANTIC_COVERAGE_BASELINE.md`.
- Disputed pages 605, 609, 928, 934, 946, and 952 individually audited against actual content: see `docs/BARRY_PHASE2_STEERING_PILOT_AUDIT.md`.
- Zero parts-catalogue units classified as procedures; zero operation/property annotations on diagram or parts-list pages; zero model-assisted annotations.

### Phase 2 known limitations

- No staging or production application of either migration; the pilot database was local and temporary.
- `barry_v2_specifications` has NULL `chapter_id` (joins through `block_id`) and NULL `system_tag`; no steering specification records exist.
- RPS part applicability is unverified (`vehicle_model` NULL); 216 RPS annotations remain proposed.
- Duplicate 1185-page manuals (`u1700lunimog435sm`, `unimog435sm-u1700l`) inflate block coverage pending Phase 6 deduplication.
- `manual_chunks` "RPS Catalog" is not verifiably linked to an RPS number; RPS records register as `rps_catalog:{rps_number}` documents.

### Phase 2 documentation

- `docs/BARRY_PHASE2_EVIDENCE_BACKFILL_DESIGN.md`
- `docs/BARRY_PHASE2_STEERING_PILOT_AUDIT.md`
- `docs/BARRY_SEMANTIC_COVERAGE_BASELINE.md`
- `docs/BARRY_EVIDENCE_BACKFILL_RUNBOOK.md`

## Phase 3 Addendum (2026-07-27, shadow mode only)

PRD Phase 3 was implemented in shadow mode. User-visible behavior is unchanged; no semantic retrieval, claim verification, citation reconciliation, or PDF work is live.

### Implemented

- `supabase/functions/_shared/barry-evidence-policy.ts`: executable document-role and page-type permission matrices, applicability decisions, numeric/unit/part-number deterministic checks, citation identity, deduplication, and reconciliation.
- `supabase/functions/_shared/barry-retrieval-planner.ts`: runtime role/page-type inference, one-hop bounded relationship expansion, auditable scoring with versioned weights (`1.0.0-shadow-phase3`), applicability exclusion, ambiguity penalties.
- `supabase/functions/_shared/barry-semantic.ts`: exported `matchSemanticConcepts` (two-pass context-aware matcher) shared by the planner.
- `supabase/functions/barry-tools/index.ts`: shadow planning over legacy retrieval candidates with a redacted `shadow_retrieval` summary in the existing fire-and-forget telemetry row. Shadow failure degrades to `{ error: 'shadow_retrieval_unavailable' }` and cannot affect the response.
- `docs/BARRY_PHASE3_SHADOW_RETRIEVAL.md`.

### Verification results

- Targeted tests: 94 passed (68 Phase 1/2 + 26 Phase 3).
- Semantic benchmark: 20/20, 100% recall all metrics, zero forbidden-concept violations.
- `npx tsc --noEmit`: passed.
- Edge bundle (esbuild): passed; planner and policy modules inline correctly.
- Full suite: 260 passed, 88 failed; failure set hash identical to the Phase 1/2 pre-existing baseline.
- `npm run build`: passed (21.6s).
- Secret scan: clean; no project URLs, JWTs, or keys in task files.

### Phase 3 known limitations

- Shadow telemetry requires `barry_grounding_runs` to exist in the environment; it is still not applied to any Supabase project. Until then the insert fails silently by design.
- Embedding scoring is unavailable in this pipeline and excluded from shadow weights.
- Runtime role/page-type inference is conservative; most candidates classify `unknown` until the Phase 2 annotations exist in a live database.
- Live citation reconciliation awaits Phase 4 claim mapping; only the deterministic functions and shadow comparison exist.
- Phase 4 was not started.

## Production Activation Addendum (2026-07-27)

The project owner applied the Phase 1 and Phase 2 migrations to the production Supabase project via the SQL editor and explicitly authorized the `barry-tools` function deployment. Read-only verification confirmed:

- all 10 semantic tables exist with RLS enabled;
- one active semantic version (`1.0.0-phase1`), 86 concepts, 10 relationships, 56 aliases;
- all 76 RPS synonyms queued as pending/controlled proposals, none auto-approved;
- Phase 2 evidence tables correctly empty (no backfill run yet).

The `barry-tools` deployment (commit `23e58e664`) was verified with live smoke tests:

1. `my steeringbox is leaking, what do I do` — normal response (cautious, evidence-limited, no invented procedure), one `barry_grounding_runs` row, no raw or normalized question stored, frame resolved steering system, steering gear, external leak, inspect, and diagnose; shadow retrieval considered 5 candidates with 5/5 legacy citation overlap, zero exclusions, and 4 one-hop expansions.
2. `the pump is leaking` — ambiguity retained: both `component.power_steering_pump` and `component.water_pump` recorded as candidates with neither silently selected; Barry answered normally without inventing a diagnosis.

Phase 2 evidence backfill against production remains available but has not been authorized or run.
