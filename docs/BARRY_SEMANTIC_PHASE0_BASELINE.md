# Barry Semantic Grounding Phase 0 Baseline

## Scope

This baseline was captured before applying any semantic database migration. It covers the current linked Supabase schema, existing terminology systems, document metadata integrity, and the initial deterministic semantic benchmark.

## Live Schema Verification

Read-only inspection completed on 2026-07-27 against the linked Supabase project.

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

The proposed `barry_semantic_versions`, `barry_semantic_concepts`, `barry_semantic_aliases`, `barry_semantic_relationships`, `barry_evidence_concepts`, `barry_semantic_review_queue`, and `barry_grounding_runs` tables do not exist in the live schema.

## Existing Systems to Preserve

- The legacy `components`, `component_synonyms`, `attributes`, `attribute_synonyms`, and `wis_properties` tables remain operational.
- The RPS synonym workflow remains operational.
- Barry v2 document, model, chapter, content block, specification, and diagnostic tables remain operational.
- Phase 1 adds a versioned semantic layer without renaming, deleting, or changing these systems.
- Existing RPS synonyms enter the semantic review queue as proposals. They do not become approved semantic aliases automatically.

## Document Integrity Baseline

| Source | Rows | Documents | Missing storage path | Missing page count/page | Unverified or non-usable |
|---|---:|---:|---:|---:|---:|
| `manual_chunks` | 2,419 | 8 | 3 | 0 | 2,419 |
| `barry_v2_source_documents` | 151 | 151 | 151 | 96 | 80 |
| `barry_v2_manuals` | 71 | 71 | 71 | 0 | 0 |

These counts identify future document-registry and semantic-annotation work. Phase 1 does not backfill evidence or change document paths.

## Query Interpretation Baseline

The committed benchmark contains 20 representative steering, brake, axle, engine, cooling, transmission, electrical, fluid, capacity, torque, parts, synonym, and ambiguity cases.

| Metric | Legacy baseline | Phase 1 result |
|---|---:|---:|
| Query-type coverage | 70% | 100% case pass rate |
| System-tag coverage | 40% | 100% concept recall |
| Model-tag coverage | 95% | 100% model/concept recall |
| Claim-class recall | Not available | 100% |
| Ambiguity recall | Not available | 100% |
| Forbidden-concept violations | Not available | 0 |

The baseline measures deterministic query interpretation only. It does not claim that semantic evidence retrieval, evidence annotation, claim grounding, or citation validation has been implemented.

## Phase Boundary

Phase 0 and Phase 1 provide:

- a repeatable benchmark;
- immutable semantic version contracts;
- an initial controlled ontology;
- contextual alias resolution;
- semantic query frames;
- schema and activation controls;
- proposed legacy synonym migration.

Evidence backfill, hybrid semantic retrieval, claim-level verification, and production activation remain later phases.

## Final Verification Results (2026-07-27)

| Check | Result |
|---|---|
| Targeted unit tests | 30/30 passed (25 semantic service, 5 migration contract) |
| Semantic benchmark | 20/20 cases, 100% concept recall, 100% claim-class recall, 100% ambiguity recall, 0 forbidden-concept violations |
| TypeScript | `npx tsc --noEmit` passed |
| Edge bundle | esbuild bundle of `barry-tools/index.ts` succeeded; `../_shared/barry-semantic.ts` inlines correctly (Deno unavailable) |
| Full test suite | 196 passed, 88 failed; all failures pre-existing or environmental (missing `@playwright/test`, duplicate ` 2` test directories, trip-planner suites, OCR work-in-progress suites). No failure involves task files |
| Production build | `npm run build` succeeded in 19.2s |
| Secret scan | `node scripts/check-secrets.js` clean; task files contain no project URLs, JWTs, or keys |
| Migration SQL validation | Applied twice to an isolated local PostgreSQL 14 scratch database with Supabase stubs. Both runs succeeded (idempotent). Seeded 86 concepts, 51 aliases, 10 relationships, 2 RPS review proposals. Not applied to any Supabase project |

The migration was validated only against the isolated scratch database. It has not been applied to the linked production project or any staging Supabase project.
