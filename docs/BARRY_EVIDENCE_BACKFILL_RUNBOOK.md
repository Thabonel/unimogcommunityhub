# Barry Evidence Backfill Runbook

Operational procedure for the Phase 2 evidence backfill. The command defaults to dry-run; nothing writes without `--apply`.

## Prerequisites

- A PostgreSQL connection to the target database with the Phase 1 and Phase 2 migrations applied.
- Never point the command at the production project `ydevatqwkoccxhtejdor` without explicit authorization.
- The target must contain the source tables (`manual_chunks`, `barry_v2_*`, `rps_*`).

## 1. Dry-run (always first)

```bash
npm run barry:evidence:backfill -- \
  --db-url=<target> \
  --run-key=<descriptive-key> \
  --batch=500 \
  --audit-out=/tmp/backfill-audit.json
```

Review the audit JSON before applying:

- every document's classified role and reason;
- every unit's page type and reason;
- every annotation's matched name, role, confidence, and provenance;
- every review item and its reason;
- disputed or high-risk pages individually.

Do not apply if the dry-run output is not correct.

## 2. Apply

```bash
npm run barry:evidence:backfill -- \
  --db-url=<target> \
  --run-key=<same-key> \
  --batch=500 \
  --apply \
  --audit-out=/tmp/backfill-apply.json
```

Upserts are idempotent. Re-applying the same run key produces no duplicates.

## 3. Scoped runs

- `--source=manual_chunk,rps_part` restricts source types.
- `--document=<document_key>` restricts one document.
- `--pages=920-960` restricts physical pages.
- `--semantic-version=1.0.0-phase1` selects the version.

## 4. Resume

Batches are ordered and the cursor is stored in run stats:

```bash
npm run barry:evidence:backfill -- --db-url=<target> --run-key=<key> --batch=100 --apply
npm run barry:evidence:backfill -- --db-url=<target> --run-key=<key> --batch=100 --resume=100 --apply
```

## 5. Coverage

```bash
npm run barry:evidence:backfill -- --db-url=<target> --coverage
```

Reports totals grouped by source type, document role, page type, review status, and confidence band.

## 6. Rollback

```bash
npm run barry:evidence:backfill -- --db-url=<target> --rollback=<run_key>
```

- Removes only semantic rows created by that run (`barry_evidence_units` and `barry_evidence_concepts`).
- Never touches legacy source tables.
- Row ownership stays with the first creating run, so rolling back an overlapping later run does not delete earlier runs' data.
- Safe to repeat; a second rollback reports `already_rolled_back`.
- The function is service-role-only.

## 7. Review queue workflow

Proposed annotations and diverted mappings land in `barry_semantic_review_queue` with deterministic dedupe keys. Human approval is the only path from `proposed` to `approved` for sub-0.85 mappings. No model output approves itself.

## Failure handling

- Unknown semantic version: command exits before any write.
- Missing `--db-url`: command exits before any connection.
- Dry-run mode never opens a write path; the dry-run store records planned writes in memory only.
