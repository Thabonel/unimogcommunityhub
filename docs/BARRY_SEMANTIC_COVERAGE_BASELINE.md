# Barry Semantic Coverage Baseline

Measured on 2026-07-27 against the Phase 2 steering pilot database (local PostgreSQL, production data extract). Coverage is measured from `barry_evidence_units` and `barry_evidence_concepts`, never assumed.

## Totals

| Metric | Value |
|---|---:|
| Documents registered | 74 |
| Evidence units | 440 |
| Annotations | 1,006 |
| Approved annotations | 252 |
| Proposed annotations | 754 |
| Review-queue items (controlled) | 199 |

## By source type

| Source | Units | Annotations | Approved | Proposed |
|---|---:|---:|---:|---:|
| `barry_v2_content_block` | 227 | 538 | 165 | 373 |
| `rps_part` | 196 | 216 | 0 | 216 |
| `manual_chunk` | 113 | 251 | 86 | 165 |
| `rps_illustration` | 1 | 1 | 1 | 0 |

## By page type

| Page type | Units | Annotations | Approved | Proposed |
|---|---:|---:|---:|---:|
| `parts_list` | 196 | 216 | 0 | 216 |
| `procedure` | 98 | 195 | 104 | 91 |
| `diagram` | 88 | 110 | 71 | 39 |
| `explanation` | 87 | 325 | 0 | 325 |
| `specification` | 68 | 160 | 77 | 83 |

## By document role

| Role | Units | Annotations | Approved | Proposed |
|---|---:|---:|---:|---:|
| `workshop_manual` | 292 | 709 | 205 | 504 |
| `parts_catalog` | 236 | 269 | 37 | 232 |
| `maintenance_manual` | 9 | 28 | 10 | 18 |

## By confidence band

| Band | Annotations | Approved | Proposed |
|---|---:|---:|---:|
| high (>= 0.85) | 252 | 252 | 0 |
| medium (0.6 - 0.85) | 754 | 0 | 754 |

## Policy checks

- Parts-catalogue evidence units classified as `procedure`: **0**
- Diagram or parts-list units carrying operation/property annotations: **0** (diverted to review)
- Model-assisted annotations: **0** (none used in Phase 2)
- Approved annotations below the 0.85 threshold: **0**

## Known coverage gaps

- No steering specification records exist in `barry_v2_specifications`.
- Diagnostic tables are empty; no diagnostic evidence mapped.
- RPS applicability is unverified (`vehicle_model` NULL), keeping 216 annotations proposed.
- `explanation` units are all proposed by design (0.6 classification confidence).
- Duplicate 1185-page manuals inflate `barry_v2_content_block` coverage until Phase 6 document-registry deduplication.

## Regenerating

```bash
npm run barry:evidence:backfill -- \
  --db-url=<target> \
  --coverage
```

## Full-Corpus Coverage (2026-08-02, production)

Applied via 15 CLI-executed SQL parts generated from a verified local run (`prod-full-phase2-1`). Verified against production after application.

| Metric | Steering pilot | Full corpus |
|---|---:|---:|
| Documents | 74 | 80 |
| Evidence units | 440 | 9,716 |
| Annotations | 1,006 | 13,229 |
| Approved | 252 | 2,283 |
| Proposed | 754 | 10,946 |
| Review items | 199 | 3,793 |

### Units by role and page type (production)

| Role | Page type | Units |
|---|---|---:|
| workshop_manual | explanation | 2,781 |
| workshop_manual | procedure | 932 |
| workshop_manual | diagram | 437 |
| workshop_manual | specification | 351 |
| workshop_manual | index | 36 |
| maintenance_manual | explanation | 119 |
| maintenance_manual | procedure | 40 |
| maintenance_manual | specification | 15 |
| parts_catalog | parts_list | 3,086 |
| parts_catalog | diagram | 1,253 |
| parts_catalog | explanation | 481 |
| parts_catalog | specification | 5 |
| parts_catalog | index | 1 |
| unknown (unverified role) | various | 179 |

Policy checks: zero parts-catalogue units classified as procedures. The four `unknown`-role documents (UHB handbooks and unverified identities) stay out of authoritative claim classes until their roles are reviewed.

The generated SQL parts are not committed (27MB, regenerable): `BACKFILL_RUN_KEY=prod-full-phase2-1 npx tsx scripts/barry-backfill/generate-backfill-sql.ts` after a local backfill run. Rollback: `SELECT public.rollback_barry_backfill_run('prod-full-phase2-1');` (steering-pilot rows keep their original run ownership).
