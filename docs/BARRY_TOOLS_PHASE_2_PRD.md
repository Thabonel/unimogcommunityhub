# PRD: Barry Tools v2 — Phase 2 (Capability Expansion & Controlled Rollout)

## Document Control
- **Owner:** AI Platform / Barry Team
- **Status:** Draft
- **Target Environment:** Staging + incremental production rollout
- **Last Updated:** 2026-04-26

---

## 1) Problem Statement
After Phase 1 proves the tool-native architecture, Barry still lacks broad operational capabilities required for travel and ownership workflows (parts ecosystems, route support, local services, marketplace/events).

Phase 2 expands tool coverage while maintaining strict reliability and guardrails.

## 2) Goals
1. Add the extended tool suite for parts, location, and community workflows.
2. Introduce progressive rollout controls (traffic percentage / surface-level flags).
3. Harden observability, cost controls, and fallback behavior under scale.

## 3) Non-Goals
- Full shutdown of legacy paths.
- Major frontend redesign.
- Autonomous multi-step transaction execution (booking/purchasing).

## 4) Scope

### In Scope
- Add tools:
  - `search_rps`
  - `search_epc`
  - `lookup_fuel_prices`
  - `find_nearby_services`
  - `lookup_user_vehicle`
  - `search_marketplace`
  - `get_events`
  - `search_community_content`
  - `calculate_route`
- Add traffic shaping control (e.g., `BARRY_TOOLS_TRAFFIC_PERCENT`).
- Add per-tool policy constraints (budget/timeouts/allowlists).
- Expand evaluation corpus and monitoring dashboards.

### Out of Scope
- Legacy function deletion.
- Tool-generated write operations to user/account data.

## 5) Functional Requirements

### FR-1: Expanded Tool Registry
- All Phase 2 tools exposed via central registry with clear descriptions and schemas.
- Tools return normalized response envelopes.

### FR-2: Location-Aware Behaviors
- Tools using location must gracefully degrade when location is missing.
- Explicit user-facing message when location precision is insufficient.

### FR-3: User Vehicle Context
- `lookup_user_vehicle` integrated as optional context enhancer, not hard requirement.
- If unavailable, Barry still answers with neutral assumptions.

### FR-4: Cost & Latency Controls
- Per-tool timeout thresholds.
- Per-request tool-call budget.
- Skip low-value tool calls when confidence is high from existing grounded sources.

### FR-5: Rollout Controls
- Function-level percentage ramp control.
- Surface-level override for explicit pilot cohorts.

## 6) Non-Functional Requirements
- **Scalability:** sustain expected concurrent traffic with no degradation > agreed SLO.
- **Performance:** p95 latency for multi-tool paths bounded by timeout strategy.
- **Auditability:** request trace includes ordered tool call chain and outcome.

## 7) Success Metrics
1. Improved answer coverage for non-manual use cases (weather/travel/local services).
2. <= 2% tool execution failure rate (non-user-caused).
3. Stable or improved user satisfaction on migrated surfaces.
4. No regression in citation correctness for technical/manual answers.

## 8) Milestones
1. Implement expanded tools + registry updates.
2. Add integration tests and synthetic replay suite.
3. Staging soak test.
4. Ramp production traffic: 10% -> 25% -> 50% (or equivalent surface expansion).
5. Mid-phase review and hardening pass.

## 9) Dependencies
- External APIs (Brave, Mapbox, weather) with keys/quotas.
- Supabase schemas for marketplace/events/profile queries.
- Logging/metrics backend for tool-level telemetry.

## 10) Risks & Mitigations
- **Risk:** API quota/rate-limit exhaustion.
  - **Mitigation:** caching, backoff, fail-soft responses.
- **Risk:** Location inaccuracies cause poor recommendations.
  - **Mitigation:** confidence labels + request clarification.
- **Risk:** Tool sprawl causes maintenance burden.
  - **Mitigation:** strict interface contracts and registry-level linting/tests.

## 11) Testing & Validation
- Contract tests for all new tool schemas.
- Integration tests for representative multi-tool orchestration chains.
- Resilience tests: timeouts, partial failures, malformed upstream payloads.
- Shadow-mode comparisons against legacy responses where applicable.

## 12) Exit Criteria (Phase 2 Done)
- All Phase 2 tools production-capable.
- Controlled rollout reaches >= 50% target traffic/surfaces without SLO breach.
- On-call runbook updated with tool-specific failure playbooks.

