# Barry Phase 2 Evidence Backfill Design

## Status

- **Date:** 2026-07-27
- **Scope:** Phase 2 semantic evidence backfill only
- **Execution environment:** isolated local PostgreSQL 14 pilot database with a read-only production data extract
- **Staging Supabase:** does not exist; requirement waived by the project owner on 2026-07-27
- **Production:** read-only inspection only; never mutated
- **Phase 3 retrieval:** not started; no semantic retrieval is enabled anywhere

## Live Schema Findings (read-only, 2026-07-27)

Findings that shaped the design:

1. Every `barry_v2_manuals.manual_type` is `workshop`, including `u435-maint-*` and `rps-*` documents. Document role cannot rely on `manual_type`; it uses the verified filename and identity conventions instead.
2. Every `barry_v2_content_blocks.block_type` is `explanation`. Page type cannot rely on `block_type`.
3. Every `barry_v2_specifications.system_tag` is NULL, and every specification has `chapter_id = NULL`; specifications join to manuals only through `block_id`.
4. `u1700lunimog435sm` and `unimog435sm-u1700l` are two 1185-page manuals with identical block content. Duplicate-document reconciliation belongs to the Phase 6 document registry.
5. `manual_chunks` uses its own document identity (`manual_id` + `manual_title`). The same physical document can exist under both `barry_v2` and `manual_chunks` identities.
6. RPS steering groups are PA, PB, PBA, and PBB under RPS number 02155. `rps_parts.vehicle_model` is frequently NULL, so applicability is often unverified.
7. No link between the `manual_chunks` "RPS Catalog" document and a specific RPS number is recorded. RPS parts therefore register under `rps_catalog:{rps_number}` documents rather than being attributed to "RPS Catalog".

## Schema (`20260728000000_barry_semantic_phase2.sql`)

Additive only. No legacy table is altered.

- `barry_backfill_runs` — run identity, mode, filters, status, stats cursor. Enables resume and rollback.
- `barry_documents` — canonical document registry keyed by `(semantic_version_id, document_key)`. Stores verified document role, storage path, page count, model tags, source identity, and provenance.
- `barry_evidence_units` — normalized evidence records keyed by `(semantic_version_id, source_type, source_record_id)`. Stores page type, content hash, tags, extraction quality, owning backfill run, and provenance. Manual text is not duplicated; a normalized content hash is stored instead.
- `barry_evidence_concepts` — extended with `evidence_unit_id`, `model_scope`, `backfill_run_id`, and `provenance` (all `ADD COLUMN IF NOT EXISTS`).
- `rollback_barry_backfill_run(run_key)` — `SECURITY DEFINER`, service-role-only, fixed `search_path`. Deletes only semantic rows created by the named run and marks it `rolled_back`. Idempotent.

RLS mirrors Phase 1: service-role full access, admin read policy, authenticated SELECT grant only.

### Ownership rule

`backfill_run_id` is set on insert and deliberately not updated on conflict. The first run that creates a row owns it. Rollback of a later overlapping run cannot delete rows owned by an earlier run. Verified on the pilot database.

## Classification

### Document role (verified identity only)

| Signal | Role | Confidence |
|---|---|---|
| `u435-maint-*` filename | `maintenance_manual` | 0.95 |
| `rps-*` filename, `RPS*` title, or `rps_catalog` source | `parts_catalog` | 0.95 |
| `manual_type = workshop` or "Workshop Manual" title | `workshop_manual` | 0.90 |
| anything else | `unknown` + review item | 0.30 |

### Page type (structured fields first, deterministic heading rules second)

- RPS parts → `parts_list`; RPS illustrations → `diagram`; specification records → `specification`.
- Exploded-view headings (OCR-tolerant, matches `Exploded v1ew`) → `diagram`, even inside workshop manuals.
- Technical-data/specification headings → `specification`.
- Procedure headings (`Checking`, `Disassembly and Assembly`, ...) → `procedure` only in workshop or maintenance manuals. The same heading in a parts catalogue yields `unknown` plus a review item.
- Visual pages without text → `diagram` in parts catalogues, `unknown` elsewhere.
- Remaining text → `explanation` at 0.6 (always proposed).
- Diagram and parts-list pages may carry only `primary_subject`, `mentioned_component`, and `applicability` annotations. Operation or property matches on those pages are diverted to the review queue.

## Concept matching

Two-pass deterministic matching against the Phase 1 registry:

1. Canonical names and uncontextual aliases.
2. Contextual aliases (for example `pump`, `hub`) only after a context concept resolved in pass 1.

Roles derive from concept type; heading matches become `primary_subject`. Model tags resolve to `vehicle_model.*` concept keys through the registry (`resolveModelScope`). One alias was added to the ontology from verified RPS catalogue terminology: `seal ring` → `part.sealing_ring` (workshop term, 0.9), added to both the runtime registry and the Phase 1 migration seed to preserve parity.

## Governance thresholds

- confidence >= 0.85 → `approved` (deterministic method only)
- 0.6 to 0.85 → `proposed`
- below 0.6 → not inserted; review-queue item only

Model-assisted mappings are not used in this phase. No mapping method may approve itself; `human_reviewed` approvals happen only through the review queue.

## Backfill command

`npm run barry:evidence:backfill -- --db-url=<url> [flags]`

Defaults to dry-run. Flags: `--apply`, `--source=`, `--document=`, `--pages=a-b`, `--semantic-version=`, `--batch=`, `--resume=<cursor>`, `--run-key=`, `--audit-out=`, `--coverage`, `--rollback=<run_key>`.

Every run writes an audit JSON listing each planned or executed document, unit, annotation (with matched name, role, confidence, and reason), and review item.
