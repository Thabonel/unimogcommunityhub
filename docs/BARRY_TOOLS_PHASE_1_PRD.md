# PRD: Barry Tools v2 — Phase 1 (Foundation & Pilot)

## Document Control
- **Owner:** AI Platform / Barry Team
- **Status:** Draft
- **Target Environment:** Staging first, limited production pilot
- **Last Updated:** 2026-04-26

---

## 1) Problem Statement
Barry currently performs best on workshop-manual-citation workflows, but non-technical questions can be mishandled because manual-oriented prompting and gatherer orchestration dominate routing behavior.

Phase 1 establishes a new tool-native architecture (`barry-tools`) that allows the model to decide when tools are needed and avoids forcing manual context into every query.

## 2) Goals
1. Launch a new Supabase edge function, `barry-tools`, with Anthropic native tool-use loop.
2. Implement and production-harden the **core tool set** needed for immediate quality gains.
3. Preserve response contract compatibility with current frontend consumers.
4. Pilot on one controlled frontend surface with observable metrics.

## 3) Non-Goals
- Full migration of all Barry surfaces.
- Immediate deprecation of legacy functions (`chat-with-barry-agentic`, `barry-openclaw`).
- Introducing new UI paradigms or response rendering models.

## 4) Scope

### In Scope
- New edge function scaffolding and orchestration loop.
- Core tools:
  - `search_manual`
  - `lookup_knowledge_base`
  - `get_weather`
  - `web_search`
  - `convert_units`
  - `translate_text`
- Shared tool registry and types under `openclaw-core/tools/*`.
- Guardrails parity with existing security/safety flow.
- Pilot routing flag for one frontend entrypoint.

### Out of Scope
- Route planning, nearby services, and marketplace/event search tools.
- RPS/EPC deep parts workflows beyond compatibility stubs.

## 5) Users & Primary Jobs-to-be-Done
1. **Unimog owners/mechanics:** Get accurate manual-backed technical guidance.
2. **Travel users:** Get weather/general trip context without fabricated manual citations.
3. **Support/admin teams:** Observe model/tool behavior and debug incidents quickly.

## 6) Functional Requirements

### FR-1: Tool-Use Runtime Loop
- System prompt + conversation history + tool definitions sent to Anthropic.
- Model may respond with `tool_use` or direct answer.
- Runtime executes requested tools, appends results, and continues.
- Hard stop at configurable max iterations (default: 5).

### FR-2: Response Contract Compatibility
Function output must preserve existing contract:
- `content`
- `manualReferences`
- `knowledgeMode`
- `searchResultCount`
- `skill_chain`

### FR-3: Citation Behavior
- Manual citations only when `search_manual` is called and results exist.
- If no manual results: explicit no-result handling; do not fabricate references.

### FR-4: Guardrails Parity
Carry over:
- Rate limiting
- Prompt injection detection
- Input sanitization
- Dangerous-topic policy + safety disclaimers

### FR-5: Tool Error Handling
- Every tool returns structured success/error envelopes.
- Non-fatal tool failures do not crash final response unless no answer is possible.

## 7) Non-Functional Requirements
- **Latency:** p50 <= current baseline for simple queries; p95 not more than +20% during pilot.
- **Reliability:** >= 99% successful edge responses during pilot window.
- **Observability:** request-level and tool-level logs with latency and outcome.
- **Security:** no regression in blocked-topic or prompt-injection defenses.

## 8) Success Metrics
1. **Manual-citation precision:** no decrease vs baseline.
2. **Off-domain hallucination reduction:** >= 50% reduction in sampled eval set.
3. **Tool invocation efficiency:** average tool calls/query <= 2.0 for pilot surface.
4. **User quality signal:** thumbs-down rate not worse than baseline.

## 9) Milestones
1. Implement function + core tools.
2. Add eval harness and smoke tests.
3. Deploy to staging.
4. Enable pilot on one frontend surface.
5. Run 7-day monitored pilot.

## 10) Dependencies
- Anthropic API credentials and model configuration.
- Brave Search API key.
- Existing manual and KB data stores.
- Existing guardrail utilities.

## 11) Risks & Mitigations
- **Risk:** Tool-call loops increase cost/latency.
  - **Mitigation:** hard iteration cap, per-tool timeout, call budget.
- **Risk:** Web tool data quality variability.
  - **Mitigation:** source labeling + fallback messaging.
- **Risk:** Schema drift from existing frontend contract.
  - **Mitigation:** contract tests for response shape.

## 12) Testing & Validation
- Unit tests for tool input/output schema validation.
- Integration tests for loop behavior (0-tool, 1-tool, multi-tool, tool-error paths).
- Regression tests for safety guardrails and response shape.
- Pilot shadow evaluation against curated query set.

## 13) Exit Criteria (Phase 1 Done)
- Core tool set live on pilot surface.
- Success metrics met for at least 7 consecutive days.
- No P0/P1 safety regressions.

