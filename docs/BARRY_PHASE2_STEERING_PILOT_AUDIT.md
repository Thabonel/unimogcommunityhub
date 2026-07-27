# Barry Phase 2 Steering Pilot Audit

## Pilot setup

- **Date:** 2026-07-27
- **Database:** isolated local PostgreSQL 14 instance (created for the pilot, destroyed afterwards)
- **Source data:** read-only extract from the production project. No production writes occurred.
- **Extract scope:** all 71 `barry_v2_manuals`; steering-section and disputed pages of the U1700L/U435 workshop manual (pages 600-615, 920-960); RPS Catalog pages 590-630; the three steering chapter manuals (`46-steering`, `u435-18-steering`, `u435-maint-46-steering`); RPS groups PA, PB, PBA, PBB (196 parts, 1 illustration); all 200 `barry_v2_specifications`.
- **Migrations applied:** Phase 1 then Phase 2, each applied twice to confirm idempotency.

## Run results

| Run | Mode | Units | Approved annotations | Proposed annotations | Review items |
|---|---|---:|---:|---:|---:|
| `pilot-steering-1` | dry-run (batch 100) | 100 | 97 | 205 | 1 |
| `pilot-steering-1` | apply (440 rows) | 440 | 252 | 754 | 199 |
| `pilot-steering-1` | re-apply (idempotency) | 440 (unchanged) | 252 | 754 | 199 |
| `pilot-resume-test` | apply batch 100, resume at 100 | 100 + 100 | - | - | - |
| `pilot-resume-test` | rollback | 0 removed (rows owned by `pilot-steering-1`) | - | - | - |

Final state: 74 documents, 440 evidence units, 1,006 annotations (252 approved, 754 proposed), 199 controlled review items, zero rejected mappings, zero safety-critical review items in the steering scope.

## Disputed-page verification

Each disputed page was checked against its actual extracted content, not its filename or neighbours.

| Page | Document | Content finding | Classification | Annotations |
|---:|---|---|---|---|
| 605 | Workshop manual vol 1 | Wheel-hub drive disassembly | `procedure` | `component.portal_hub` primary subject; no steering concepts |
| 609 | Workshop manual vol 1 | Wheel-hub drive; mentions steering at offset 562 | `procedure` | `component.portal_hub` primary subject; `vehicle_system.steering` mentioned (proposed) |
| 605 | RPS Catalog | Steering-box seal-ring page (visual) | `diagram` | steering and sealing-ring identity only |
| 609 | RPS Catalog | Steering page (visual) | `diagram` | steering identity only |
| 928 | Workshop manual vol 1 | "Technical data Steering box" with torque and ATF in body | `specification` | `component.steering_gear` primary subject; `property.torque` and `fluid.atf` proposed |
| 934 | Workshop manual vol 1 | "Exploded v1ew Steering box" (OCR variant) | `diagram` | component/part identity only; no operation or property annotations |
| 946 | Workshop manual vol 1 | "Checking tightness of universal joint at steering box"; torque mentioned in body | `procedure` | `component.steering_gear` primary subject; inspection/removal operations; `property.torque` proposed |
| 952 | Workshop manual vol 1 | "Exploded view ... Steering box" | `diagram` | component/part identity only |

Deliberate non-mappings:

- Page 946 was not annotated with `component.steering_column_coupling`. The text says "universal joint" but no approved alias establishes that phrase; it remains a review-queue candidate rather than a guessed mapping.
- RPS group PA ("STEERING WHEEL, COLUMN DRIVE SHAFTS AND DRAG LINK") resolves only to `vehicle_system.steering`; no component was invented for it.
- No fluid capacity, seal-kit number, or repair procedure was asserted anywhere. ATF and torque matches on page 928 are `value_context`/`property` annotations at proposed status, pending human review of the actual values.

## Steering concept coverage

| Concept | Approved | Proposed |
|---|---:|---:|
| `vehicle_system.steering` | 87 | 128 |
| `component.steering_gear` | 54 | 101 |
| `component.power_steering_pump` | 6 | 45 |
| `component.steering_reservoir` | 3 | 42 |
| `part.sealing_ring` | 7 | 50 |
| `operation.inspect` | 11 | 41 |
| `operation.check_fluid_level` | 0 | 3 |

## Missing or unavailable evidence

- `barry_v2_specifications` contains no steering rows; the specification adapter processed the 200 extracted specifications but none cover steering.
- `barry_v2_diagnostic_paths` and `barry_v2_diagnostic_symptoms` are empty in production; no diagnostic evidence exists to map.
- RPS parts lack `vehicle_model` values; all 216 RPS part annotations remain proposed pending applicability review.
- `hazard.loss_of_steering_assist` has no annotations; no source text established it.

## Environment limitations

- No staging Supabase project exists; activation and smoke tests are pending infrastructure the owner has deemed unnecessary for now.
- The pilot database was local and temporary. Reproduction requires re-extracting the source data read-only and repeating the runbook steps.
- The `manual_chunks` "RPS Catalog" and RPS 02155 records are treated as separate documents because no verified link exists.
