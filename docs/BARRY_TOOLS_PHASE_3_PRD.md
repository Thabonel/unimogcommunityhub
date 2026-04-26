# PRD: Barry Tools v2 — Phase 3 (Full Migration, Optimization, and Legacy Decommission)

## Document Control
- **Owner:** AI Platform / Barry Team
- **Status:** Draft
- **Target Environment:** Full production
- **Last Updated:** 2026-04-26

---

## 1) Problem Statement
With core and expanded tools delivered, the platform remains operationally complex while legacy Barry functions continue in parallel. This creates duplicated maintenance, split telemetry, and inconsistent behavior.

Phase 3 completes migration, optimizes quality/cost, and decommissions superseded paths.

## 2) Goals
1. Migrate all Barry chat surfaces to `barry-tools`.
2. Retire legacy Barry pathways safely.
3. Establish long-term governance for tools, evals, and model changes.

## 3) Non-Goals
- Launching unrelated product features outside Barry assistant scope.
- Real-time autonomous actuation (purchases/bookings/vehicle control).

## 4) Scope

### In Scope
- Final migration of all frontend entrypoints to `barry-tools`.
- Legacy deprecation plan:
  - `chat-with-barry-agentic`
  - `barry-openclaw` (as active inference path)
- Cost/performance optimization pass.
- Long-term quality governance (automated eval gates, regression alarms).

### Out of Scope
- Full rewrite of historical analytics systems.

## 5) Functional Requirements

### FR-1: 100% Routing Completion
- All supported Barry surfaces route to `barry-tools` by default.
- Emergency rollback switch preserved for one release cycle.

### FR-2: Legacy Decommission
- Legacy functions marked read-only/disabled after migration soak period.
- Operational docs updated to reference new architecture only.

### FR-3: Quality Governance
- Add release gate requiring eval pass before model/tool prompt changes.
- Introduce periodic benchmark suite covering technical + non-technical tasks.

### FR-4: Cost Governance
- Publish monthly token/tool spend report.
- Enforce configurable caps and alerting thresholds.

## 6) Non-Functional Requirements
- **Reliability:** meet or exceed existing production SLOs across all surfaces.
- **Consistency:** no surface-specific behavior divergence without explicit policy.
- **Maintainability:** clear ownership and versioning policy for each tool.

## 7) Success Metrics
1. 100% production traffic on `barry-tools` for 30 consecutive days.
2. No critical incident attributable to migration after rollback window closes.
3. Lower blended cost per resolved query vs pre-migration baseline.
4. Improved blended quality score across technical + general benchmarks.

## 8) Milestones
1. Complete final surface migrations.
2. Run 2-week full-traffic soak period.
3. Finalize deprecation checklist and archive legacy runbooks.
4. Remove legacy routing references from codepaths and docs.

## 9) Dependencies
- Successful completion of Phase 1 and Phase 2 exit criteria.
- Stakeholder sign-off from support, product, and platform owners.

## 10) Risks & Mitigations
- **Risk:** Hidden dependency on legacy endpoints.
  - **Mitigation:** endpoint usage telemetry + staged disablement.
- **Risk:** Regression from model/prompt iteration.
  - **Mitigation:** mandatory automated eval gate.
- **Risk:** Operator confusion during cutover.
  - **Mitigation:** one-source-of-truth runbook and escalation policy.

## 11) Testing & Validation
- End-to-end smoke tests for every migrated surface.
- Production canary checks with rollback drill.
- Regression suite executed before and after legacy disablement.
- Disaster recovery simulation for tool/API outages.

## 12) Exit Criteria (Phase 3 Done)
- Legacy paths decommissioned.
- Governance controls active and documented.
- `barry-tools` is sole production inference path with stable SLO/SLA compliance.

