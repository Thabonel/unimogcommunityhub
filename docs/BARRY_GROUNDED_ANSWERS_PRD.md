# PRD: Barry Grounded Answers and Citation Quality System

## Document Control

- **Owner:** AI Platform / Barry Team
- **Status:** Draft for approval
- **Target environments:** Local verification, staging, controlled production rollout
- **Created:** 2026-07-26
- **Primary inference path:** `supabase/functions/barry-tools`
- **Affected surfaces:** Every Barry chat interface that returns technical advice or supporting documents

---

## 1. Executive Summary

Barry can retrieve useful Unimog documentation and produce helpful answers, but retrieval relevance does not by itself prove that every generated claim is supported. Recent steering-box testing exposed four systemic failure modes:

1. Barry attached pages that mentioned a component but did not support the answer.
2. Barry treated exploded diagrams and parts catalogues as repair procedures.
3. Barry introduced unsupported fluid types, capacities, part numbers, probabilities, and repair steps.
4. The PDF viewer attempted to load an entire large manual and could fail before displaying the cited page.

These are platform problems, not isolated question problems. Correcting individual answers will not produce durable quality.

This project introduces a generic evidence contract across Barry's technical-answer pipeline. Technical claims will be extracted, classified, matched to suitable evidence, verified, and either retained, qualified, or removed before the answer reaches a user. Citations will be returned only when they support a claim in the final answer. Document type, page type, vehicle applicability, source quality, and retrieval relevance will be enforced as machine-readable policy.

The project also establishes a repeatable benchmark suite and release gate so prompt, retrieval, indexing, model, and document-processing changes cannot ship when they reduce grounding quality.

---

## 2. Problem Statement

### 2.1 Current behavior

The current `barry-tools` pipeline can:

- classify many technical questions;
- search manual chunks and structured v2 content;
- retrieve page numbers and PDF paths;
- generate an answer from retrieved context;
- run a second technical verification pass;
- return manual references to the frontend;
- open a cited PDF page in the supporting-document panel.

The current safeguards are helpful but incomplete:

- A page citation is primarily validated by whether its page number appears in the answer.
- Retrieval results may be topically related without supporting the specific claim.
- Manual type and content block type are not consistently enforced as evidence permissions.
- The verifier receives text previews but no deterministic claim-to-source ledger.
- No automated suite measures citation entailment, unsupported-claim rate, document-role violations, or page-opening correctness across representative questions.
- Production quality is learned through individual user reports rather than systematic regression detection.

### 2.2 Why question-by-question fixes fail

Question-specific keyword rules and prompt exceptions do not generalize. Each new component, spelling variant, model, document, or phrasing creates another opportunity for the same failure class. This approach:

- increases maintenance cost;
- hides indexing problems behind prompt patches;
- creates inconsistent behavior between vehicle systems;
- cannot provide a measurable release standard;
- encourages silent regressions when models or prompts change.

### 2.3 User impact

Incorrectly grounded technical advice can cause:

- unsafe maintenance or operation;
- use of the wrong fluid, capacity, torque, or part;
- unnecessary repair work;
- loss of trust in Barry and the manual library;
- a misleading impression that documentation supports a recommendation;
- unusable citations when the linked PDF or page does not load.

---

## 3. Product Principles

1. **Evidence before fluency:** A shorter verified answer is better than a complete-sounding unsupported answer.
2. **Claims, not paragraphs:** Grounding is evaluated at the individual technical-claim level.
3. **Source roles are enforceable:** A parts catalogue identifies components; it does not authorize a repair procedure.
4. **Applicability is part of correctness:** Evidence for another model, variant, or configuration is not silently generalized.
5. **Citations must earn their place:** Every returned citation must support at least one retained claim.
6. **No evidence is a valid result:** Barry must state what the available documentation does not establish.
7. **Deterministic checks surround model checks:** Models may assist classification and entailment, but schema, page, URL, role, and numeric checks must not depend only on model judgment.
8. **Quality is released through gates:** Technical-answer changes require benchmark evidence before rollout.
9. **Supporting documents are part of the answer:** A citation is not successful unless the user can open the correct document and page.

---

## 4. Goals

### 4.1 Primary goals

1. Prevent unsupported technical specifications, procedures, part numbers, diagnostic conclusions, and probabilities from reaching users.
2. Ensure every displayed citation supports a specific claim in the final response.
3. Enforce document-role rules across workshop manuals, owner manuals, maintenance manuals, RPS catalogues, and community sources.
4. Validate model and vehicle applicability before using evidence.
5. Make PDF references deterministic, accessible, and page-correct.
6. Establish a representative automated regression suite and staging release gate.
7. Add telemetry that identifies systemic retrieval, indexing, validation, and document failures.

### 4.2 Secondary goals

1. Reduce irrelevant supporting-document tabs.
2. Improve Barry's ability to explain evidence gaps clearly.
3. Make grounding failures diagnosable without exposing private chain-of-thought or sensitive prompts.
4. Support future expansion to additional Unimog models and document sets.

---

## 5. Non-Goals

- Guaranteeing that source manuals themselves contain no errors.
- Replacing qualified mechanical assessment for safety-critical work.
- Automatically generating missing workshop procedures from general model knowledge.
- Treating internet forums, marketplace listings, or prior conversations as authoritative technical evidence.
- Reprocessing every PDF before any pipeline improvement can ship.
- Replacing the existing Barry interface or redesigning the complete chat experience.
- Automatically purchasing parts, booking repairs, or controlling a vehicle.

---

## 6. Definitions

| Term | Definition |
|---|---|
| Claim | A statement in Barry's draft that can be true or false and may require evidence. |
| Technical claim | A claim about a component, diagnosis, specification, part, procedure, compatibility, warning, or maintenance action. |
| Evidence unit | A bounded source record containing document identity, page, content, role, applicability, and provenance. |
| Entailment | Whether the evidence directly supports the claim without adding unstated assumptions. |
| Citation | A user-visible link from a retained claim to an evidence unit. |
| Document role | The permitted use of a source, such as procedure authority or parts identification. |
| Page type | The content function of a page or block, such as procedure, specification, diagram, parts list, warning, or explanation. |
| Applicability | The vehicle model, variant, assembly, year range, configuration, and market for which evidence is valid. |
| Grounding ledger | The machine-readable record connecting draft claims, evidence decisions, final claims, and citations. |
| Abstention | A deliberate statement that available evidence cannot verify a requested detail. |

---

## 7. Users and Use Cases

### 7.1 Primary users

- Unimog owners diagnosing faults.
- Owners performing routine maintenance.
- Technicians locating procedures, specifications, diagrams, and parts.
- Administrators reviewing Barry quality and document processing.
- Developers changing retrieval, prompts, models, or indexing.

### 7.2 Core question classes

- **Diagnostic:** "My steering box is leaking. What should I do?"
- **Procedure:** "How do I remove the front hub?"
- **Specification:** "What is the wheel nut torque?"
- **Fluid or capacity:** "What oil and how much goes in the steering system?"
- **Parts:** "Which seal or repair kit do I need?"
- **Diagram:** "Show me the steering-box exploded view."
- **Applicability:** "Does this procedure apply to my 1987 U1700L?"
- **Mixed:** "Diagnose this leak, tell me the correct fluid, and show the relevant diagram."

---

## 8. Scope

### 8.1 In scope

- `barry-tools` technical-query orchestration.
- Manual and RPS retrieval normalization.
- Evidence-unit construction.
- Claim extraction and classification.
- Deterministic and model-assisted claim validation.
- Document-role and page-type policy.
- Vehicle applicability checks.
- Citation selection and rendering.
- PDF URL and page validation.
- Grounding telemetry.
- Offline and integration benchmark suites.
- Staging release gate and controlled rollout.
- Admin diagnostics required to investigate failures.

### 8.2 Out of scope for initial delivery

- Full OCR replacement for all existing manuals.
- Human annotation of every page before launch.
- Automatic repair of corrupted source PDFs.
- User-facing confidence percentages.
- General web-search evidence for workshop specifications.

---

## 9. Current-State Architecture

```text
User question
    |
    v
Technical query detection
    |
    v
Knowledge/manual retrieval
    |
    v
LLM draft generation
    |
    v
Technical answer verification
    |
    v
Page-number citation filtering
    |
    v
Answer + manualReferences
    |
    v
Right-hand PDF viewer
```

### 9.1 Current strengths

- Technical queries can be routed through deterministic retrieval before generation.
- The model is instructed not to invent unsupported values.
- Technical responses can be rewritten by a verification call.
- Returned references include storage URLs and physical PDF pages.
- The PDF viewer uses a local worker and can render only the cited page.

### 9.2 Current gaps

- Claims are not represented as structured objects.
- Citation support is not checked at sentence or claim level.
- A page may be included because it was retrieved, not because it entailed a retained claim.
- Source-role permissions are expressed mainly through prompts.
- Numeric values are not deterministically compared with evidence.
- Conversation history may introduce unsupported details into a draft.
- Retrieval quality and citation quality are not independently measured.
- Page mappings and document paths lack a complete integrity audit.

---

## 10. Target Architecture

```text
User question
    |
    v
Query classifier
    |
    +--> requested claim classes
    +--> vehicle applicability context
    +--> safety level
    |
    v
Role-aware retrieval
    |
    v
Normalized evidence units
    |
    v
Evidence sufficiency check
    |
    v
Draft generation
    |
    v
Claim extraction
    |
    v
Claim-to-evidence validation
    |
    +--> retain with citation
    +--> rewrite with narrower wording
    +--> replace with abstention
    +--> remove
    |
    v
Final citation reconciliation
    |
    v
Answer + citations + grounding telemetry
    |
    v
Verified PDF document/page rendering
```

---

## 11. Evidence Model

Every retrieval adapter must emit a common evidence unit.

```typescript
type DocumentRole =
  | 'workshop_manual'
  | 'maintenance_manual'
  | 'owners_manual'
  | 'parts_catalog'
  | 'service_bulletin'
  | 'validated_knowledge'
  | 'community_content'
  | 'unknown';

type PageType =
  | 'procedure'
  | 'diagnostic'
  | 'specification'
  | 'warning'
  | 'diagram'
  | 'parts_list'
  | 'explanation'
  | 'index'
  | 'unknown';

type ClaimClass =
  | 'procedure_step'
  | 'diagnostic_cause'
  | 'diagnostic_test'
  | 'specification'
  | 'fluid'
  | 'capacity'
  | 'torque'
  | 'part_number'
  | 'compatibility'
  | 'component_identity'
  | 'safety_warning'
  | 'general_description';

interface EvidenceUnit {
  evidence_id: string;
  document_id: string;
  document_title: string;
  document_role: DocumentRole;
  page_type: PageType;
  physical_pdf_page: number;
  printed_page?: string;
  storage_path: string;
  storage_url: string;
  content_text: string;
  section_title?: string;
  system_tags: string[];
  component_tags: string[];
  model_tags: string[];
  variant_tags: string[];
  configuration_tags: string[];
  source_quality: number;
  extraction_quality: number;
  retrieval_score: number;
  provenance: 'manual_chunks' | 'barry_v2' | 'rps' | 'validated_answer';
}
```

### 11.1 Required evidence fields

An evidence unit is eligible for a user-visible citation only when it has:

- a stable document identifier;
- a resolvable storage path;
- a physical PDF page greater than zero;
- non-empty extracted content or a verified diagram classification;
- a known or explicitly `unknown` document role;
- a known or explicitly `unknown` page type;
- provenance indicating the source table or pipeline;
- a deterministic evidence identifier.

### 11.2 Evidence identity

The preferred identifier is:

```text
document_id + physical_pdf_page + content_block_id
```

When no structured block exists:

```text
document_id + physical_pdf_page + normalized-content-hash
```

This prevents duplicate citations from different retrieval paths.

---

## 12. Document-Role Policy

The following policy is enforced in code, not only in prompts.

| Document role | Permitted claim classes | Prohibited use |
|---|---|---|
| Workshop manual | Procedures, diagnostics, specifications, warnings, component identity | Claims outside stated model/configuration |
| Maintenance manual | Routine maintenance procedures, intervals, approved fluids, capacities, checks | Internal rebuild procedures unless explicitly present |
| Owner's manual | Operation, routine checks, warnings, user-serviceable maintenance | Specialist overhaul procedures |
| Parts catalogue / RPS | Component identity, assembly relationship, catalogue part number, quantity | Repair sequence, torque, fluid, capacity, diagnosis |
| Service bulletin | The exact correction, applicability, procedure, or specification stated | Generalization beyond bulletin scope |
| Validated knowledge | Only claim classes recorded in its validation metadata | New claims inferred from prose |
| Community content | Experience reports and discovery leads | Authoritative specification or safety-critical procedure |
| Unknown | General discovery only | Any safety-critical technical claim |

### 12.1 Page-type policy

Document role is necessary but not sufficient. For example, an exploded-view page inside a workshop manual may establish component identity but not disassembly order.

| Page type | Permitted claim classes |
|---|---|
| Procedure | Procedure steps, explicitly stated tools, warnings, related specifications |
| Diagnostic | Causes, tests, expected results, stated corrective actions |
| Specification | Values, units, conditions, applicability |
| Warning | Hazards and precautions |
| Diagram | Component identity, location, relationship, callout labels |
| Parts list | Part number, name, quantity, catalogue applicability |
| Explanation | General description and theory of operation |
| Index | Source discovery only; never final evidence |
| Unknown | Non-safety-critical descriptive claims only at low confidence |

### 12.2 Mixed-source answers

Barry may combine sources only when each claim is independently authorized:

- a workshop procedure may cite a workshop manual;
- the required part number may cite an RPS catalogue;
- a warning may cite the procedure or warning page;
- the answer must not imply that the RPS page contains the procedure.

---

## 13. Claim Model and Grounding Ledger

### 13.1 Claim representation

```typescript
interface TechnicalClaim {
  claim_id: string;
  text: string;
  claim_class: ClaimClass;
  safety_critical: boolean;
  numeric_values: Array<{
    value: number;
    unit?: string;
    qualifier?: string;
  }>;
  part_numbers: string[];
  model_mentions: string[];
  source_sentence_index: number;
}

interface ClaimDecision {
  claim_id: string;
  status: 'supported' | 'narrowed' | 'unsupported' | 'conflicted';
  evidence_ids: string[];
  confidence: number;
  reason_code: string;
  final_text?: string;
}

interface GroundingLedger {
  request_id: string;
  query_class: string;
  claims: TechnicalClaim[];
  decisions: ClaimDecision[];
  cited_evidence_ids: string[];
  rejected_evidence_ids: string[];
  policy_version: string;
  verifier_version: string;
}
```

### 13.2 Required claim extraction

The verifier must identify at least:

- each numbered procedure step;
- each diagnostic cause;
- each proposed diagnostic test;
- every number with a unit;
- every fluid or lubricant name;
- every capacity, torque, pressure, clearance, interval, or tolerance;
- every part, kit, stock, or catalogue number;
- every compatibility or model-applicability statement;
- every safety consequence;
- every statement that a manual does or does not contain a procedure.

### 13.3 Claim outcomes

- **Supported:** Evidence directly entails the claim.
- **Narrowed:** A more limited statement is supported and replaces the draft.
- **Unsupported:** The claim is removed or replaced with an explicit evidence gap.
- **Conflicted:** Sources disagree or applicability is ambiguous; Barry presents the conflict and avoids choosing silently.

---

## 14. Validation Pipeline

### 14.1 Stage A: Deterministic validation

Before model-assisted entailment:

1. Validate document and page identifiers.
2. Reject inaccessible or unresolved storage URLs.
3. Deduplicate evidence units.
4. Apply document-role and page-type permissions.
5. Apply model and configuration filters.
6. Compare exact numeric values and normalized units.
7. Compare normalized part numbers.
8. Reject citations to indexes, blank OCR pages, and unrelated document roles.
9. Reject evidence below minimum extraction-quality thresholds for exact specifications.

### 14.2 Stage B: Model-assisted entailment

For each remaining claim/evidence pair, a constrained verifier returns structured JSON:

```json
{
  "claim_id": "claim-4",
  "evidence_id": "manual-1:934:block-2",
  "entails": false,
  "support_level": "mentions_component_only",
  "reason_code": "diagram_does_not_authorize_procedure"
}
```

Permitted support levels:

- `direct`
- `direct_with_condition`
- `component_identity_only`
- `mentions_component_only`
- `contradicts`
- `not_present`
- `unreadable`

The verifier must not receive earlier assistant answers as evidence.

### 14.3 Stage C: Numeric and identifier reconciliation

All retained numeric and identifier claims undergo an additional deterministic check:

- normalized value must appear in eligible evidence;
- normalized unit must match or be safely convertible;
- condition must be retained when the evidence includes one;
- a range must not be rewritten as a single value;
- approximate values must remain approximate;
- part-number punctuation may be normalized, but digits and letters must match;
- conflicting values block the claim unless applicability resolves the conflict.

### 14.4 Stage D: Final-answer reconstruction

The system reconstructs or rewrites the answer using only supported and narrowed claims. Unsupported claims do not remain in hidden prose, headings, tables, warnings, or summaries.

### 14.5 Stage E: Citation reconciliation

After final text is created:

1. Map each retained claim to one or more evidence units.
2. Return only evidence units used by at least one retained claim.
3. Prefer the smallest sufficient citation set.
4. Keep separate citations when different sources support different claim classes.
5. Remove citations mentioned only in the draft.
6. Verify that each citation opens the intended document and physical page.

---

## 15. Retrieval Requirements

### FR-1: Query classification

Barry must classify the requested information into one or more claim classes before retrieval.

Example:

```text
"My steering box is leaking. What do I do?"

Requested:
- diagnostic_cause
- diagnostic_test
- procedure_step
- fluid
- capacity
- safety_warning
```

### FR-2: Role-aware retrieval

Retrieval must filter or prioritize evidence by the claim class requested:

- procedure requests prioritize procedure blocks from workshop manuals;
- specifications prioritize structured specification records;
- parts requests prioritize parts lists and RPS records;
- diagrams prioritize diagram blocks and page renders;
- diagnostics prioritize diagnostic blocks, then supported external inspection procedures.

### FR-3: Retrieval diversity

Top results must not be five near-duplicate chunks from one page. Retrieval should select:

- the best primary evidence;
- adjacent continuation pages when structurally linked;
- one relevant warning or specification when required;
- one parts source only when parts were requested or needed.

### FR-4: Component normalization

Normalization must be data-driven and reusable. It must support:

- spacing variants such as `steeringbox` and `steering box`;
- common abbreviations;
- singular and plural forms;
- user-language aliases;
- model-specific terminology;
- misspellings observed in query logs.

Aliases must live in a versioned taxonomy or synonym table rather than accumulating as prompt-only exceptions.

### FR-5: Evidence sufficiency

Before generation, the pipeline determines whether evidence is sufficient for each requested claim class.

Example:

```json
{
  "diagnostic_cause": "insufficient",
  "diagnostic_test": "partial",
  "procedure_step": "insufficient",
  "component_identity": "sufficient",
  "safety_warning": "sufficient"
}
```

The draft prompt receives this matrix and may not fill missing categories from general model knowledge.

---

## 16. Applicability Requirements

Evidence applicability must consider:

- Unimog model;
- chassis or series;
- year or production range when available;
- engine, axle, gearbox, and steering variants;
- military or civilian configuration;
- market-specific modifications;
- optional equipment.

### FR-6: Applicability decisions

Each evidence unit receives one of:

- `exact`
- `compatible_series`
- `conditional`
- `unknown`
- `incompatible`

Safety-critical specifications require `exact` or a user-visible `conditional` statement. `Unknown` applicability cannot support an exact torque, fluid, capacity, or part number.

### FR-7: User vehicle context

When a stored vehicle profile is available, Barry should use it to narrow retrieval. When a configuration detail materially changes the answer and cannot be inferred safely, Barry should ask one focused follow-up question.

---

## 17. Citation Confidence

Citation confidence is computed from auditable components:

```text
confidence =
  retrieval relevance
  x entailment confidence
  x document-role fitness
  x applicability confidence
  x extraction quality
  x document integrity
```

### 17.1 Initial thresholds

- **0.85 and above:** eligible for specifications, torque, capacity, fluid, and safety-critical procedure claims.
- **0.75 and above:** eligible for ordinary procedure and diagnostic claims.
- **0.65 and above:** eligible for component identity and general description.
- **Below threshold:** may inform retrieval expansion but must not be shown as supporting evidence.

Thresholds must be configuration values and tuned against the benchmark corpus. They must not be silently lowered to increase answer coverage.

### 17.2 User presentation

The initial release does not display numeric confidence to users. Barry communicates uncertainty in plain language:

- "The available diagram identifies these seals but does not provide a replacement procedure."
- "The manual gives different fluids by configuration; confirm which steering system is fitted."
- "I could not verify that part number for your vehicle."

---

## 18. PDF and Document Integrity

### FR-8: Canonical document registry

Every document used by Barry must have one canonical record containing:

- document ID;
- title;
- role;
- storage bucket and path;
- byte size;
- PDF page count;
- checksum;
- language;
- model applicability;
- processing status;
- last integrity check;
- source provenance.

### FR-9: Page mapping

The system must distinguish:

- physical PDF page;
- printed manual page;
- section or job number;
- chapter-extract page.

Physical PDF page is the navigation source of truth. Chapter extracts may be used only after their ranges are verified against the canonical full document.

### FR-10: Integrity audit

A repeatable audit must:

1. confirm the object exists;
2. confirm it is a readable PDF;
3. record page count;
4. sample-render first, middle, last, and known citation pages;
5. verify stored page ranges;
6. flag zero-text or OCR-failed pages;
7. detect duplicate and stale paths;
8. report documents that require reprocessing.

### FR-11: Viewer behavior

The supporting-document viewer must:

- use a bundled worker compatible with the installed PDF library;
- render the cited page first;
- avoid mounting every page in large documents;
- expose direct-open fallback;
- report a precise error category;
- preserve physical page navigation;
- not claim a PDF is unavailable solely because full-document rendering is slow.

---

## 19. Data Model Changes

Schema changes will be delivered through reviewed migrations after confirming the live schema.

### 19.1 Proposed tables

#### `barry_documents`

Canonical document registry and integrity status.

Key fields:

- `id`
- `title`
- `document_role`
- `storage_bucket`
- `storage_path`
- `physical_page_count`
- `checksum`
- `model_tags`
- `configuration_tags`
- `integrity_status`
- `last_verified_at`

#### `barry_evidence_units`

Normalized source records across legacy chunks, v2 blocks, RPS, and validated knowledge.

Key fields:

- `id`
- `document_id`
- `source_record_type`
- `source_record_id`
- `physical_pdf_page`
- `printed_page`
- `page_type`
- `content_text`
- `system_tags`
- `component_tags`
- `model_tags`
- `source_quality`
- `extraction_quality`

#### `barry_grounding_runs`

Request-level grounding telemetry.

Key fields:

- `id`
- `request_id`
- `query_hash`
- `query_class`
- `policy_version`
- `verifier_version`
- `retrieved_evidence_ids`
- `cited_evidence_ids`
- `unsupported_claim_count`
- `conflicted_claim_count`
- `abstained`
- `latency_ms`
- `created_at`

#### `barry_claim_decisions`

Claim-level audit records with restricted retention.

Key fields:

- `id`
- `grounding_run_id`
- `claim_class`
- `claim_text_redacted`
- `status`
- `evidence_ids`
- `confidence`
- `reason_code`

#### `barry_eval_cases`

Versioned benchmark definitions.

Key fields:

- `id`
- `case_key`
- `question`
- `vehicle_context`
- `expected_claim_classes`
- `expected_document_roles`
- `expected_pages`
- `forbidden_claim_patterns`
- `required_answer_patterns`
- `safety_critical`
- `active`

#### `barry_eval_runs` and `barry_eval_results`

Release-level benchmark history and case outcomes.

### 19.2 Migration constraints

- New tables require RLS.
- User question text should not be stored in clear text unless already covered by approved chat-log policy.
- Claim text stored for diagnostics must be redacted or retention-limited.
- Existing `manual_chunks` and `barry_v2_*` records remain source systems during migration.
- No direct SQL changes to Supabase storage tables.

---

## 20. API Contract

The existing response remains backward-compatible while adding optional grounding metadata.

```typescript
interface BarryGroundedResponse {
  content: string;
  manualReferences: Array<{
    evidence_id: string;
    title: string;
    document_role: DocumentRole;
    page_type: PageType;
    page_number: number;
    pdf_page: number;
    storage_url: string;
    supported_claim_ids: string[];
  }>;
  knowledgeMode: string;
  searchResultCount: number;
  skill_chain: string[];
  execution_time_ms: number;
  grounding?: {
    policy_version: string;
    supported_claim_count: number;
    removed_claim_count: number;
    conflicted_claim_count: number;
    abstained: boolean;
  };
}
```

Internal evidence previews, verifier prompts, and detailed reasoning are not returned to users.

---

## 21. Functional Requirements

### FR-12: Claim extraction

Every technical draft must be converted to structured claims before delivery.

### FR-13: Claim-level support

Every retained technical claim must have one or more eligible evidence units or be explicitly identified as general safety advice that does not require a vehicle-specific claim.

### FR-14: Unsupported claims

Unsupported claims must be removed, narrowed, or converted to an evidence-gap statement. They must not remain with phrases such as "likely," "usually," or "common" unless evidence supports those qualifiers.

### FR-15: Conflicting evidence

When eligible evidence conflicts:

- do not select a value based solely on retrieval rank;
- resolve by applicability when possible;
- otherwise present the conflict and request the missing configuration detail.

### FR-16: Parts restrictions

Part numbers require parts-list or structured parts evidence with compatible applicability. A component diagram without a readable part-number mapping is insufficient.

### FR-17: Procedure restrictions

A diagram, parts list, or descriptive page cannot authorize disassembly, adjustment, torque, or installation steps.

### FR-18: Diagnostic restrictions

Barry may suggest safe external observations without a manual diagnostic path, but must distinguish observation from diagnosis. Statements about common failure rates or likely causes require evidence.

### FR-19: Conversation isolation

Previous assistant claims and user-supplied technical assertions are context, not evidence. They cannot enter the grounding ledger unless independently supported by retrieved evidence.

### FR-20: Citation minimality

The final reference list should include only citations needed for retained claims. Duplicate pages and unused retrieval results must be omitted.

### FR-21: Evidence gaps

Barry must identify missing categories specifically:

- no verified diagnostic procedure;
- no verified fluid specification;
- no applicable torque value;
- no confirmed part number;
- document present but page unreadable;
- model applicability unknown.

### FR-22: Fail-safe behavior

If claim verification fails because of a model, database, or timeout error:

- do not return the unverified technical draft;
- return a concise evidence-unavailable response;
- preserve safe external inspection advice where permitted;
- log the failure category.

---

## 22. Non-Functional Requirements

### 22.1 Safety

- Zero unsupported safety-critical numeric claims in the release benchmark.
- No unverified procedure may be returned after verifier failure.
- Safety warnings must not imply a source contains a warning when it does not.

### 22.2 Reliability

- Technical pipeline success rate: at least 99.5%, excluding upstream document absence.
- PDF document resolution success: at least 99%.
- No single verifier outage may cause unverified drafts to pass through.

### 22.3 Performance

- Added grounding latency target: p50 below 1.5 seconds, p95 below 4 seconds.
- Total Barry technical-answer p95 target: below 10 seconds during initial rollout.
- Evidence validation must use bounded concurrency and timeouts.

### 22.4 Cost

- Claim validation token use must be measured separately.
- Reuse validation results for duplicate normalized claims and identical evidence hashes.
- Deterministic filters must run before model-assisted entailment.
- Cost increases require a documented quality gain in benchmark results.

### 22.5 Observability

Every technical request must expose internal metrics for:

- retrieval count;
- eligible evidence count;
- claim count by class;
- supported, narrowed, removed, and conflicted claims;
- citations returned;
- abstention;
- verifier latency and status;
- PDF integrity status;
- policy and model version.

### 22.6 Privacy and security

- Treat manual text and user queries as untrusted model input.
- Prevent retrieved content from overriding system policy.
- Do not log credentials, authorization headers, or signed URLs.
- Apply RLS and least-privilege access to grounding telemetry.
- Limit retention of raw claim text.

---

## 23. Benchmark and Evaluation Strategy

### 23.1 Benchmark design

The initial corpus must include at least 100 cases, balanced across:

| Category | Minimum cases |
|---|---:|
| Steering and hydraulics | 10 |
| Brakes and compressed air | 15 |
| Portal hubs and axles | 10 |
| Transmission and transfer case | 10 |
| Engine and fuel | 15 |
| Cooling | 8 |
| Electrical | 8 |
| Suspension and chassis | 8 |
| Fluids and capacities | 8 |
| Torque and exact specifications | 8 |

At least:

- 30 cases must be safety-critical;
- 20 must contain tempting but unsupported details in conversation history;
- 15 must require abstention;
- 15 must require mixed document roles;
- 10 must test spelling variants or informal terminology;
- 10 must test model/configuration ambiguity;
- 10 must test conflicting or duplicate evidence.

### 23.2 Case structure

Each case defines:

- user question;
- vehicle context;
- permitted claim classes;
- expected source roles;
- expected and prohibited pages;
- required facts;
- forbidden claims;
- expected abstention categories;
- expected supporting-document behavior.

### 23.3 Seed regression cases

The first committed cases should include:

1. Steering-box leak: page 934 may support component identity; diagram pages must not produce a repair procedure.
2. Steering fluid and capacity: page 928 must preserve the stated capacity and configuration-dependent fluid conditions.
3. Steering universal joint: page 946 supports only the stated tightness check.
4. Wheel nut torque: exact value, unit, model applicability, and page must agree.
5. Portal hub leak: distinguish diagnosis, inspection, fluid, and seal replacement evidence.
6. Brake pressure: reject values from incompatible variants.
7. Coolant capacity: preserve system and configuration conditions.
8. Battery maintenance: do not generalize chemistry or procedure beyond the cited manual.
9. RPS parts lookup: allow component and part identification but prohibit repair steps.
10. No-evidence procedure: return a useful abstention without fabricated steps.

### 23.4 Evaluation layers

#### Layer 1: Deterministic unit tests

- role-policy matrix;
- page-type permissions;
- numeric matching;
- unit normalization;
- part-number normalization;
- applicability decisions;
- citation deduplication;
- citation-to-claim reconciliation;
- fail-safe behavior.

#### Layer 2: Retrieval tests

- expected document appears in top results;
- expected page appears within top results;
- prohibited document roles are excluded;
- spelling variants produce equivalent retrieval;
- irrelevant adjacent pages do not dominate.

#### Layer 3: Grounding tests

- required claims are retained;
- forbidden claims are removed;
- citations entail their mapped claims;
- unsupported categories produce explicit evidence gaps.

#### Layer 4: End-to-end tests

- authenticated Barry request;
- response schema;
- right-hand supporting document opens;
- correct physical page renders;
- no unused citation tabs;
- verifier failure returns fail-safe response.

#### Layer 5: Human review

A qualified reviewer samples safety-critical and newly added document categories. Human review complements but does not replace automated gates.

---

## 24. Quality Metrics

### 24.1 Primary metrics

- **Unsupported technical claim rate:** unsupported retained claims divided by technical claims.
- **Citation precision:** returned citations that support at least one retained claim.
- **Citation recall:** supported technical claims with a citation when one is required.
- **Role violation rate:** claims supported by a prohibited document or page type.
- **Applicability violation rate:** claims based on incompatible or unknown applicability.
- **Numeric accuracy:** exact values, units, ranges, and conditions matching evidence.
- **PDF landing accuracy:** citations opening the intended document and physical page.
- **Appropriate abstention rate:** cases requiring abstention that abstain correctly.

### 24.2 Initial release gates

For the curated benchmark:

- unsupported safety-critical claim rate: **0%**;
- role violation rate: **0%**;
- applicability violation rate for exact specifications: **0%**;
- citation precision: **at least 98%**;
- citation recall: **at least 95%**;
- numeric accuracy: **100% for safety-critical values, at least 99% overall**;
- PDF landing accuracy: **at least 99%**;
- appropriate abstention recall: **at least 95%**;
- no benchmark category may regress by more than two percentage points from the accepted baseline.

### 24.3 Operational metrics

- technical-answer latency;
- verifier failure rate;
- evidence-insufficient rate;
- no-citation technical-answer rate;
- PDF load failure rate;
- most frequent rejection reason;
- most frequent missing document role or page type;
- user feedback correlated with grounding outcome.

---

## 25. Release Gate

Changes to any of the following require the Barry grounding suite:

- model or model version;
- system or verifier prompt;
- retrieval query construction;
- ranking weights or thresholds;
- synonym taxonomy;
- evidence schema or adapter;
- document processing or OCR;
- PDF path or page mapping;
- citation filtering;
- technical query classification.

### 25.1 Gate behavior

- Pull request checks run deterministic and offline benchmark layers.
- Staging runs integration and end-to-end layers.
- A failed safety-critical case blocks promotion.
- Baseline changes require explicit review and justification.
- Expected pages or forbidden claims cannot be changed merely to make a failing implementation pass.

---

## 26. Monitoring and Operations

### 26.1 Dashboards

The Barry quality dashboard should show:

- grounding success over time;
- unsupported-claim removals by class;
- citation precision samples;
- abstention rate;
- retrieval misses by vehicle system;
- role and applicability violations;
- PDF integrity failures;
- latency and cost by pipeline stage;
- benchmark history by release.

### 26.2 Alerts

Alert when:

- verifier failure exceeds 1% over 15 minutes;
- PDF load failures exceed 2% over 30 minutes;
- technical answers with no eligible evidence spike above baseline;
- citation precision audit falls below 98%;
- a document integrity check changes from passing to failing;
- safety-critical benchmark cases fail.

### 26.3 Review queue

Create an admin review queue for:

- user-reported incorrect answers;
- high-impact abstentions caused by missing documentation;
- conflicting sources;
- low-extraction-quality pages;
- repeated retrieval misses;
- documents with broken paths or mappings.

Review outcomes should update source metadata, synonyms, evidence classification, or benchmark cases. They should not default to question-specific prompt exceptions.

---

## 27. Rollout Plan

### Phase 0: Baseline and instrumentation

- Capture the current benchmark baseline.
- Add request, evidence, claim, and citation identifiers.
- Add grounding telemetry without changing user-visible behavior.
- Audit current document paths and page counts.

### Phase 1: Deterministic evidence policy

- Introduce normalized evidence units.
- Implement document-role and page-type rules.
- Implement applicability and numeric checks.
- Add citation deduplication and final reconciliation.
- Run in shadow mode against current technical answers.

### Phase 2: Claim-level verifier

- Add structured claim extraction.
- Add constrained entailment decisions.
- Reconstruct answers from supported claims.
- Fail closed when verification fails.
- Enable on staging.

### Phase 3: Benchmark release gate

- Commit the seed corpus.
- Add deterministic and integration runners.
- Store versioned results.
- Require passing results for Barry technical changes.

### Phase 4: Document integrity and indexing improvements

- Establish canonical document registry.
- Audit PDFs, storage paths, page counts, and page mappings.
- Backfill document roles, page types, and applicability.
- Reprocess low-quality pages by priority.

### Phase 5: Controlled production rollout

- Shadow mode.
- Internal/admin cohort.
- 10% technical traffic.
- 25%.
- 50%.
- 100% after success criteria and soak period.

Each step requires:

- no failed safety-critical benchmark;
- no material latency or error-rate breach;
- citation and grounding metrics at or above thresholds;
- tested rollback.

---

## 28. Rollback Strategy

- Keep the previous `barry-tools` function version deployable.
- Feature-flag claim-level verification separately from retrieval changes.
- Do not roll back to a mode that returns unverified drafts after verifier failure.
- If model-assisted verification is disabled during an incident, use deterministic policy plus evidence-gap responses.
- Preserve grounding telemetry during rollback for diagnosis.

---

## 29. Dependencies

- Supabase schema visibility and migration review.
- Stable access to `manual_chunks`, `barry_v2_*`, RPS, and validated knowledge data.
- Canonical Supabase Storage paths.
- DeepSeek structured-output reliability or an equivalent verifier model.
- Frontend compatibility with enriched manual references.
- A staging user/session for authenticated end-to-end tests.
- Reviewer availability for safety-critical benchmark cases.

---

## 30. Risks and Mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| Verification adds latency | Slower answers | Deterministic prefilters, bounded concurrency, caching, compact evidence |
| Verifier rejects useful claims | Excessive abstention | Tune against reviewed benchmarks without lowering safety gates |
| Existing metadata is incomplete | Reduced coverage | Use `unknown` explicitly, prioritize backfill by query demand |
| OCR text is poor | False support or missed evidence | Extraction-quality scores and page reprocessing queue |
| Source documents conflict | Incorrect silent selection | Conflict state and applicability-based resolution |
| Benchmark overfits known questions | False confidence | Category coverage, paraphrases, hidden evaluation set, production sampling |
| Model update changes JSON behavior | Pipeline errors | Strict schema validation, retries with bounds, fail-safe response |
| Full PDF paths are large | Viewer timeout | Target-page rendering, local worker, range support, direct-open fallback |
| Telemetry stores sensitive text | Privacy exposure | Hashing, redaction, limited retention, RLS |
| Rules become question-specific | Maintenance burden | Enforce taxonomy and policy abstractions; reject prompt-only exceptions |

---

## 31. Security Requirements

- Validate all model-produced JSON against strict schemas.
- Treat retrieved manual content as data, never instructions.
- Sanitize storage paths and only allow approved Supabase buckets/domains.
- Do not expose service-role credentials to the frontend.
- Apply bounded input lengths and tool-call limits.
- Prevent prompt injection in conversation history from disabling grounding policy.
- Record policy version and verifier version for auditability.
- Run repository secret scans before staging pushes.

---

## 32. Testing and Verification Protocol

Every implementation phase requires:

1. Unit tests for new policy and normalization code.
2. Contract tests for evidence adapters and response schema.
3. Retrieval tests against representative stored data.
4. Verifier tests with supported, unsupported, conditional, and conflicting claims.
5. PDF path and cited-page rendering tests.
6. TypeScript and edge-function build checks.
7. Production frontend build.
8. Security scan.
9. Five-pass review:
   - functionality;
   - AI slop and placeholder removal;
   - minimalism;
   - robustness;
   - security.
10. Staging deployment and documented smoke test.

---

## 33. Acceptance Criteria

The project is complete when:

1. Every technical response is processed through a structured grounding ledger.
2. Unsupported technical claims cannot pass through when the verifier fails.
3. Document-role and page-type policy is enforced in executable code.
4. Exact values and part numbers receive deterministic evidence checks.
5. Vehicle applicability is represented and enforced.
6. Returned citations map to retained claims and unused citations are removed.
7. The supporting-document panel opens the correct canonical PDF page.
8. A minimum 100-case benchmark is versioned and repeatable.
9. Release gates meet the thresholds in Section 24.
10. Grounding and PDF integrity dashboards expose production health.
11. Staging completes the rollout gates without a safety-critical failure.
12. Documentation and operational runbooks reflect the final architecture.

---

## 34. Initial Implementation Deliverables

### Code

- Shared evidence, claim, decision, and policy types.
- Retrieval adapters for legacy manual, v2, RPS, and validated knowledge sources.
- Document-role and page-type policy engine.
- Numeric, unit, part-number, and applicability validators.
- Structured claim extractor and entailment verifier.
- Final-answer and citation reconciler.
- Fail-safe technical response path.
- PDF integrity audit utility.
- Benchmark runner and release-gate command.

### Database

- Reviewed migrations for canonical documents, evidence metadata, grounding runs, claim decisions, and evaluation history.
- RLS policies and retention policy.
- Backfill process for existing manual and RPS records.

### Tests

- Policy matrix unit tests.
- Normalization tests.
- Claim grounding tests.
- Retrieval tests.
- Seed benchmark cases.
- Authenticated end-to-end PDF citation test.

### Operations

- Staging rollout checklist.
- Rollback procedure.
- Quality dashboard.
- Alert definitions.
- Document integrity report.
- Reviewer workflow.

---

## 35. Decisions Required Before Implementation

1. Confirm whether detailed claim text may be stored temporarily for debugging, or whether only redacted text and hashes are permitted.
2. Confirm the reviewer responsible for approving safety-critical benchmark facts.
3. Confirm whether the first rollout targets only U435/U1700L documentation or all indexed models.
4. Confirm acceptable initial p95 latency and cost increase for technical grounding.
5. Confirm whether production rollout requires an admin-only pilot before percentage-based traffic.

These decisions affect rollout and retention but do not block building the offline policy engine, evidence adapters, or seed benchmark.

---

## 36. Recommended Implementation Order

1. Build the benchmark and capture the current baseline.
2. Introduce normalized evidence units and document-role policy.
3. Add deterministic numeric, part-number, applicability, and citation checks.
4. Add the grounding ledger and fail-safe behavior.
5. Add claim extraction and constrained entailment.
6. Add final answer reconstruction and citation reconciliation.
7. Audit documents and backfill metadata.
8. Add dashboards, alerts, and the release gate.
9. Roll out through staging and controlled production cohorts.

This order produces measurable quality improvements early and prevents the verifier from being judged only through anecdotal questions.
