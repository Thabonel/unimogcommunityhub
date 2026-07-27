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
