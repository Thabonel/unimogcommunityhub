# PRD: Barry Semantic Grounding and Citation Quality System

## Document Control

- **Owner:** AI Platform / Barry Team
- **Status:** Draft for approval
- **Target environments:** Local verification, staging, controlled production rollout
- **Created:** 2026-07-26
- **Revised:** 2026-07-27
- **Version:** 2.0
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

This project introduces a semantic layer and a generic evidence contract across Barry's technical-answer pipeline. The semantic layer converts inconsistent manual language, user terminology, vehicle configurations, document roles, content types, specifications, parts, and component relationships into versioned domain concepts. Barry will reason over these concepts before searching raw text.

Technical claims will then be extracted, classified, matched to suitable evidence, verified, and either retained, qualified, or removed before the answer reaches a user. Citations will be returned only when they support a claim in the final answer. Semantic meaning, document type, page type, vehicle applicability, source quality, and retrieval relevance will be enforced as machine-readable policy.

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
- User terminology and manual terminology are connected through scattered keyword rules rather than one governed semantic model.
- Components, systems, operations, specifications, parts, symptoms, and vehicle configurations do not share stable concept identifiers.
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
2. **Meaning before matching:** Retrieval begins with normalized domain concepts, not raw keyword similarity alone.
3. **One concept, many names:** Spelling variants, abbreviations, translations, workshop terms, and owner language resolve to governed concepts.
4. **Claims, not paragraphs:** Grounding is evaluated at the individual technical-claim level.
5. **Source roles are enforceable:** A parts catalogue identifies components; it does not authorize a repair procedure.
6. **Applicability is part of correctness:** Evidence for another model, variant, or configuration is not silently generalized.
7. **Citations must earn their place:** Every returned citation must support at least one retained claim.
8. **No evidence is a valid result:** Barry must state what the available documentation does not establish.
9. **Deterministic checks surround model checks:** Models may assist classification and entailment, but schema, page, URL, role, and numeric checks must not depend only on model judgment.
10. **Quality is released through gates:** Technical-answer changes require benchmark evidence before rollout.
11. **Supporting documents are part of the answer:** A citation is not successful unless the user can open the correct document and page.

---

## 4. Goals

### 4.1 Primary goals

1. Prevent unsupported technical specifications, procedures, part numbers, diagnostic conclusions, and probabilities from reaching users.
2. Introduce a versioned semantic layer for Unimog systems, components, symptoms, operations, specifications, fluids, parts, documents, and vehicle applicability.
3. Resolve user language and manual language to stable concept identifiers before retrieval.
4. Ensure every displayed citation supports a specific claim in the final response.
5. Enforce document-role rules across workshop manuals, owner manuals, maintenance manuals, RPS catalogues, and community sources.
6. Validate model and vehicle applicability before using evidence.
7. Make PDF references deterministic, accessible, and page-correct.
8. Establish a representative automated regression suite and staging release gate.
9. Add telemetry that identifies systemic semantic, retrieval, indexing, validation, and document failures.

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
- Building a universal automotive ontology or an unrestricted general-purpose knowledge graph.
- Adding a separate graph database before PostgreSQL relationship tables prove insufficient.
- Replacing the existing Barry interface or redesigning the complete chat experience.
- Automatically purchasing parts, booking repairs, or controlling a vehicle.

---

## 6. Definitions

| Term | Definition |
|---|---|
| Claim | A statement in Barry's draft that can be true or false and may require evidence. |
| Technical claim | A claim about a component, diagnosis, specification, part, procedure, compatibility, warning, or maintenance action. |
| Semantic layer | A governed domain model that represents technical concepts, aliases, relationships, applicability, and evidence meaning independently from raw document wording. |
| Ontology | The controlled set of concept types and relationship types Barry is permitted to use. |
| Concept | A stable identifier for one technical meaning, such as the steering gear assembly, checking fluid level, or steering-system capacity. |
| Alias | A user, workshop, translated, abbreviated, or misspelled term mapped to a canonical concept. |
| Semantic frame | The structured interpretation of a question: vehicle context, system, component, symptom, operation, requested claim classes, and constraints. |
| Semantic annotation | A versioned mapping between an evidence unit and one or more concepts or relationships. |
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
- Semantic ontology, concept registry, aliases, relationships, and versioning.
- Semantic parsing of questions into systems, components, symptoms, operations, claim classes, and applicability constraints.
- Mapping legacy manual chunks, v2 blocks, RPS records, and validated knowledge to semantic concepts.
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
- There is no semantic coverage metric showing which systems, components, operations, or aliases remain unmapped.
- Synonyms can improve one query while unintentionally changing unrelated retrieval because they are not scoped to concept type, model, language, or context.

---

## 10. Target Architecture

```text
User question
    |
    v
Query classifier
    |
    v
Semantic query interpreter
    |
    +--> canonical system and component concepts
    +--> symptom and operation concepts
    +--> requested claim classes
    +--> vehicle applicability constraints
    +--> ambiguity and safety level
    |
    v
Semantic retrieval planner
    |
    v
Hybrid role-aware retrieval
    |
    +--> semantic concept and relationship filters
    +--> lexical and full-text retrieval
    +--> embedding retrieval
    +--> structured specification and parts lookup
    |
    v
Semantically annotated evidence units
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

## 11. Semantic Layer

### 11.1 Purpose

The semantic layer is the shared technical vocabulary and relationship model between raw sources and Barry's retrieval, validation, and answer-generation stages. It must answer:

- What system and component is the user referring to?
- Which alternate terms mean the same thing in this context?
- What symptom, operation, or property is being requested?
- Which components are part of or connected to other components?
- Which document and page types are allowed to support the requested claim?
- Which models and configurations does the evidence apply to?
- Which specifications, fluids, parts, and procedures are connected to this component?
- Is the question ambiguous enough to require clarification?

The semantic layer does not generate technical facts. It organizes meaning and constrains how source facts may be found and used.

### 11.2 Semantic boundary

The semantic layer sits between source processing and Barry's runtime reasoning:

```text
PDFs, OCR, RPS records, validated answers
    |
    v
Extraction and structural classification
    |
    v
Semantic annotation and concept linking
    |
    v
Versioned semantic layer
    |
    +--> query interpretation
    +--> retrieval planning
    +--> evidence eligibility
    +--> applicability checks
    +--> benchmark coverage
    |
    v
Claim grounding and final answer
```

Embeddings remain useful for discovering semantically similar text, but they are not the semantic layer. Embeddings provide similarity; the semantic layer provides identity, type, relationships, permissions, and applicability.

### 11.3 Core concept types

The initial ontology contains the following concept types:

| Concept type | Purpose | Examples |
|---|---|---|
| `vehicle_model` | Canonical vehicle identity | U435, U1700L |
| `vehicle_variant` | Wheelbase, market, military, or equipment variant | U1700L/38, Australian Army |
| `vehicle_system` | High-level functional system | steering, brakes, cooling |
| `component` | Physical assembly or part class | steering gear, sector shaft, reservoir |
| `symptom` | User-observable condition | leaking, overheating, no steering assist |
| `operation` | Intended task or action | inspect, remove, adjust, refill |
| `claim_class` | Type of fact requested or asserted | capacity, torque, diagnostic cause |
| `property` | Measurable or descriptive property | fluid capacity, operating pressure |
| `fluid` | Canonical fluid or lubricant class | ATF, hydraulic oil, engine oil |
| `unit` | Canonical measurement unit | litre, newton metre, bar |
| `part` | Identified catalogue part | seal ring, repair kit |
| `tool` | Required special or general tool | puller, pressure gauge |
| `document_role` | Source authority category | workshop manual, parts catalogue |
| `page_type` | Evidence function | procedure, specification, diagram |
| `hazard` | Safety consequence or controlled risk | loss of steering assist |

New concept types require schema and policy review. They must not be introduced only through prompts.

### 11.4 Relationship types

The semantic graph supports a controlled set of directed relationships:

| Relationship | Example |
|---|---|
| `part_of` | sector shaft `part_of` steering gear |
| `connected_to` | steering column coupling `connected_to` steering gear input |
| `has_property` | steering system `has_property` fluid capacity |
| `uses_fluid` | steering configuration `uses_fluid` approved hydraulic oil |
| `has_part` | steering gear `has_part` sealing ring |
| `has_symptom` | steering gear `has_symptom` external fluid leak |
| `checked_by` | fluid level `checked_by` documented inspection operation |
| `serviced_by` | component `serviced_by` maintenance operation |
| `specified_by` | capacity property `specified_by` specification evidence |
| `illustrated_by` | steering gear `illustrated_by` exploded diagram |
| `applies_to` | procedure `applies_to` U1700L configuration |
| `supersedes` | service bulletin `supersedes` earlier specification |
| `alias_of` | steeringbox `alias_of` steering gear |
| `broader_than` | steering system `broader_than` steering gear |
| `requires` | removal procedure `requires` special tool |
| `creates_hazard` | fluid loss `creates_hazard` loss of steering assist |

Relationships must be directional and typed. Free-form relationship labels are prohibited in production data.

### 11.5 Canonical concept requirements

Every semantic concept must contain:

```typescript
interface SemanticConcept {
  concept_id: string;
  concept_type: string;
  canonical_name: string;
  description: string;
  system_concept_id?: string;
  language: string;
  model_scope: string[];
  configuration_scope: string[];
  status: 'draft' | 'approved' | 'deprecated';
  semantic_version: string;
  created_by: 'manual_extraction' | 'admin' | 'migration' | 'review';
}
```

Concept identifiers are immutable. Names and descriptions may change through versioned revisions. Deprecated concepts must redirect to approved replacements without rewriting historical grounding records.

### 11.6 Alias and terminology model

Aliases must capture more than a list of synonyms:

```typescript
interface SemanticAlias {
  alias_text: string;
  concept_id: string;
  alias_type:
    | 'workshop_term'
    | 'owner_term'
    | 'abbreviation'
    | 'translation'
    | 'spelling_variant'
    | 'common_misspelling';
  language: string;
  model_scope: string[];
  context_concept_ids: string[];
  confidence: number;
  status: 'proposed' | 'approved' | 'rejected';
}
```

Examples:

- `steeringbox` maps to `steering gear` as a spelling variant.
- `steering box` maps to `steering gear` as an owner term.
- `pitman arm shaft` may map to `sector shaft` only where the manual and configuration establish equivalence.
- An ambiguous abbreviation may require a system or model context before resolution.

Aliases discovered from query logs enter a review queue. Frequency alone does not make an alias technically correct.

### 11.7 Semantic frame for user questions

Every technical question is parsed into a semantic frame before retrieval:

```typescript
interface SemanticQueryFrame {
  query_id: string;
  vehicle_model_concept_id?: string;
  vehicle_variant_concept_ids: string[];
  system_concept_ids: string[];
  component_concept_ids: string[];
  symptom_concept_ids: string[];
  operation_concept_ids: string[];
  requested_claim_classes: ClaimClass[];
  constraints: Array<{
    property_concept_id: string;
    operator: 'equals' | 'contains' | 'unknown';
    value: string;
  }>;
  unresolved_terms: string[];
  ambiguities: Array<{
    term: string;
    candidate_concept_ids: string[];
  }>;
  confidence: number;
}
```

For:

```text
"My steeringbox is leaking, what do I do?"
```

The frame should resolve:

```json
{
  "vehicle_model": "U1700L",
  "system": ["steering"],
  "component": ["steering_gear"],
  "symptom": ["external_fluid_leak"],
  "operation": ["inspect", "diagnose"],
  "requested_claim_classes": [
    "diagnostic_cause",
    "diagnostic_test",
    "procedure_step",
    "fluid",
    "capacity",
    "safety_warning"
  ]
}
```

The query does not authorize the system to assume the leak source, fluid, capacity, seal, or repair procedure.

### 11.8 Semantic annotation of evidence

Each evidence unit must link to concepts with an annotation type and confidence:

```typescript
interface EvidenceSemanticAnnotation {
  evidence_id: string;
  concept_id: string;
  annotation_role:
    | 'primary_subject'
    | 'mentioned_component'
    | 'operation'
    | 'property'
    | 'value_context'
    | 'applicability'
    | 'hazard';
  confidence: number;
  method: 'deterministic' | 'structured_extraction' | 'model_assisted' | 'human_reviewed';
  semantic_version: string;
}
```

A diagram that depicts a steering gear may have `primary_subject = steering_gear` and `page_type = diagram`. That annotation permits component-identity retrieval but does not convert the page into procedure evidence.

### 11.9 Semantic retrieval

Runtime retrieval combines four independent signals:

1. **Semantic match:** Evidence is linked to the requested concepts or approved related concepts.
2. **Lexical match:** Source text contains relevant canonical terms or aliases.
3. **Embedding similarity:** Source meaning is close to the question.
4. **Structured match:** Specifications, parts, procedures, and applicability match typed fields.

Semantic constraints run before final ranking:

- incompatible vehicle applicability is excluded;
- prohibited document-role and page-type combinations are excluded;
- relationship expansion is bounded by approved relationship types and hop limits;
- exact specification queries prefer structured values over prose similarity;
- ambiguous concepts trigger clarification or parallel retrieval without silent selection.

The initial relationship expansion limit is one hop. Two-hop expansion is allowed only for explicit, tested paths such as component to property to specification evidence.

### 11.10 Semantic scoring

Semantic ranking is auditable:

```text
semantic_retrieval_score =
  concept_identity_score
  + relationship_relevance
  + lexical_score
  + embedding_score
  + structured_field_score
  + applicability_score
  + source_role_score
  - ambiguity_penalty
  - relationship_distance_penalty
```

Weights are versioned configuration and evaluated against the benchmark. A high embedding score cannot override incompatible applicability or prohibited source roles.

### 11.11 Semantic layer requirements

#### SR-1: Stable concept identity

All production semantic records use immutable concept IDs rather than display strings as foreign keys.

#### SR-2: Versioning

Ontology, relationship, alias, and mapping changes carry a semantic version. Every grounding run records the version used.

#### SR-3: Governance

Safety-critical concepts, aliases, relationships, and applicability mappings require human approval before production use.

#### SR-4: Provenance

Every concept and annotation records how it was created and which source supports it.

#### SR-5: Ambiguity handling

The semantic interpreter must preserve ambiguity. It may not select a component or configuration merely because one candidate has more indexed content.

#### SR-6: Controlled expansion

Graph traversal uses an allowlist of relationships and bounded hop count. Generic graph exploration is prohibited in the runtime answer path.

#### SR-7: Backward compatibility

Legacy retrieval continues during backfill. Unmapped records may participate through lexical and embedding retrieval but receive lower confidence and stricter claim permissions.

#### SR-8: No semantic invention

The semantic layer may connect and classify source facts but may not invent a specification, procedure, diagnostic probability, compatibility statement, or part number.

#### SR-9: Review workflow

Unknown terms, low-confidence mappings, repeated retrieval misses, and proposed aliases enter a review queue with usage frequency and affected queries.

#### SR-10: Coverage measurement

Coverage is reported by document, page, vehicle system, component, claim class, model, and query frequency.

### 11.12 Semantic governance

The semantic layer has three approval levels:

| Level | Content | Approval |
|---|---|---|
| Standard | Common terminology, non-critical component hierarchy | Automated proposal plus maintainer review |
| Controlled | Applicability, document role, page type, operations | Maintainer approval |
| Safety-critical | Fluids, capacities, torque, pressure, procedures, hazards, part compatibility | Qualified reviewer approval |

Changes must be reviewable as data diffs. Prompt changes must not be used to bypass semantic governance.

### 11.13 Initial semantic scope

The first production semantic layer targets:

- U435 and U1700L model identity and known configurations;
- steering and hydraulics;
- brakes and compressed air;
- portal hubs and axles;
- engine fluids and cooling;
- high-risk claim classes: fluids, capacities, torque, pressure, part numbers, diagnostics, and procedures;
- workshop manual, maintenance manual, owner's manual, RPS, and validated-knowledge roles.

The architecture must support broader coverage, but initial rollout should prioritize high-risk and high-frequency questions.

### 11.14 Initial implementation approach

The first semantic layer will use Supabase PostgreSQL rather than a separate graph platform:

- normalized concept, alias, relationship, and evidence-mapping tables;
- foreign keys and constraints for identity and relationship validity;
- GIN or trigram indexes for normalized alias lookup;
- ordinary indexed joins for direct concept retrieval;
- bounded recursive queries only for approved relationship expansion;
- an in-memory edge-function cache for the active semantic version and common aliases;
- versioned SQL or reviewed import artifacts for seed data;
- admin review actions for approving proposed aliases and mappings.

A dedicated graph database is considered only if measured production workloads cannot meet latency, explainability, or maintenance requirements with PostgreSQL. Technology choice must follow benchmark evidence rather than the desire to model every possible relationship.

---

## 12. Evidence Model

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
  primary_concept_ids: string[];
  mentioned_concept_ids: string[];
  operation_concept_ids: string[];
  property_concept_ids: string[];
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
  semantic_score: number;
  semantic_version: string;
  provenance: 'manual_chunks' | 'barry_v2' | 'rps' | 'validated_answer';
}
```

### 12.1 Required evidence fields

An evidence unit is eligible for a user-visible citation only when it has:

- a stable document identifier;
- a resolvable storage path;
- a physical PDF page greater than zero;
- non-empty extracted content or a verified diagram classification;
- a known or explicitly `unknown` document role;
- a known or explicitly `unknown` page type;
- a semantic version and at least one primary or mentioned concept for high-confidence technical use;
- provenance indicating the source table or pipeline;
- a deterministic evidence identifier.

### 12.2 Evidence identity

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

## 13. Document-Role Policy

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

### 13.1 Page-type policy

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

### 13.2 Mixed-source answers

Barry may combine sources only when each claim is independently authorized:

- a workshop procedure may cite a workshop manual;
- the required part number may cite an RPS catalogue;
- a warning may cite the procedure or warning page;
- the answer must not imply that the RPS page contains the procedure.

---

## 14. Claim Model and Grounding Ledger

### 14.1 Claim representation

```typescript
interface TechnicalClaim {
  claim_id: string;
  text: string;
  claim_class: ClaimClass;
  subject_concept_ids: string[];
  predicate_concept_id?: string;
  object_concept_ids: string[];
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
  semantic_version: string;
}
```

### 14.2 Required claim extraction

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

### 14.3 Claim outcomes

- **Supported:** Evidence directly entails the claim.
- **Narrowed:** A more limited statement is supported and replaces the draft.
- **Unsupported:** The claim is removed or replaced with an explicit evidence gap.
- **Conflicted:** Sources disagree or applicability is ambiguous; Barry presents the conflict and avoids choosing silently.

---

## 15. Validation Pipeline

### 15.1 Stage A: Deterministic validation

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

### 15.2 Stage B: Model-assisted entailment

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

### 15.3 Stage C: Numeric and identifier reconciliation

All retained numeric and identifier claims undergo an additional deterministic check:

- normalized value must appear in eligible evidence;
- normalized unit must match or be safely convertible;
- condition must be retained when the evidence includes one;
- a range must not be rewritten as a single value;
- approximate values must remain approximate;
- part-number punctuation may be normalized, but digits and letters must match;
- conflicting values block the claim unless applicability resolves the conflict.

### 15.4 Stage D: Final-answer reconstruction

The system reconstructs or rewrites the answer using only supported and narrowed claims. Unsupported claims do not remain in hidden prose, headings, tables, warnings, or summaries.

### 15.5 Stage E: Citation reconciliation

After final text is created:

1. Map each retained claim to one or more evidence units.
2. Return only evidence units used by at least one retained claim.
3. Prefer the smallest sufficient citation set.
4. Keep separate citations when different sources support different claim classes.
5. Remove citations mentioned only in the draft.
6. Verify that each citation opens the intended document and physical page.

---

## 16. Retrieval Requirements

### FR-1: Semantic query interpretation

Barry must convert the question into a `SemanticQueryFrame` before retrieval. The frame includes canonical vehicle, system, component, symptom, operation, and requested claim concepts. Classification that produces only a generic query label is insufficient.

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

### FR-2: Semantic and role-aware retrieval

Retrieval must use semantic concept identity, approved relationship expansion, lexical matching, embeddings, and structured fields. It must then filter or prioritize evidence by the claim class requested:

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

### FR-4: Semantic alias resolution

Normalization must use the governed semantic alias registry. It must support:

- spacing variants such as `steeringbox` and `steering box`;
- common abbreviations;
- singular and plural forms;
- user-language aliases;
- model-specific terminology;
- misspellings observed in query logs.

Aliases must be scoped by concept type, language, model, and context where required. They must live in the versioned semantic layer rather than accumulating as prompt-only exceptions.

### FR-4A: Semantic ambiguity

When a term resolves to multiple plausible concepts, Barry must:

1. use vehicle, system, and conversation context to eliminate incompatible candidates;
2. preserve remaining candidates in the semantic frame;
3. ask a focused clarification when the candidates would produce materially different technical advice;
4. never select a candidate because it has more retrieved pages.

### FR-4B: Relationship expansion

Retrieval may expand from a requested concept only through approved relationships. Every expansion must record:

- source concept;
- relationship type;
- destination concept;
- graph distance;
- semantic version;
- effect on the retrieval score.

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

## 17. Applicability Requirements

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

## 18. Citation Confidence

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

### 18.1 Initial thresholds

- **0.85 and above:** eligible for specifications, torque, capacity, fluid, and safety-critical procedure claims.
- **0.75 and above:** eligible for ordinary procedure and diagnostic claims.
- **0.65 and above:** eligible for component identity and general description.
- **Below threshold:** may inform retrieval expansion but must not be shown as supporting evidence.

Thresholds must be configuration values and tuned against the benchmark corpus. They must not be silently lowered to increase answer coverage.

### 18.2 User presentation

The initial release does not display numeric confidence to users. Barry communicates uncertainty in plain language:

- "The available diagram identifies these seals but does not provide a replacement procedure."
- "The manual gives different fluids by configuration; confirm which steering system is fitted."
- "I could not verify that part number for your vehicle."

---

## 19. PDF and Document Integrity

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

## 20. Data Model Changes

Schema changes will be delivered through reviewed migrations after confirming the live schema.

### 20.1 Proposed tables

#### `barry_semantic_versions`

Immutable releases of the ontology, aliases, relationships, mappings, and retrieval weights.

Key fields:

- `id`
- `version`
- `status`
- `change_summary`
- `approved_by`
- `activated_at`
- `created_at`

Only one version may be active for production retrieval at a time. Grounding runs retain the version they used.

#### `barry_semantic_concepts`

Canonical Unimog domain concepts.

Key fields:

- `id`
- `concept_type`
- `canonical_name`
- `description`
- `system_concept_id`
- `language`
- `model_scope`
- `configuration_scope`
- `status`
- `semantic_version_id`
- `provenance`

#### `barry_semantic_aliases`

Context-aware terminology mappings.

Key fields:

- `id`
- `alias_text_normalized`
- `concept_id`
- `alias_type`
- `language`
- `model_scope`
- `context_concept_ids`
- `confidence`
- `status`
- `semantic_version_id`
- `reviewed_by`

#### `barry_semantic_relationships`

Typed, directed links between concepts.

Key fields:

- `id`
- `source_concept_id`
- `relationship_type`
- `target_concept_id`
- `model_scope`
- `configuration_scope`
- `confidence`
- `status`
- `semantic_version_id`
- `provenance_evidence_ids`

The source, relationship type, target, and applicability scope must be unique within a semantic version.

#### `barry_evidence_concepts`

Many-to-many semantic annotations connecting evidence to concepts.

Key fields:

- `evidence_id`
- `concept_id`
- `annotation_role`
- `confidence`
- `method`
- `semantic_version_id`
- `review_status`

#### `barry_semantic_review_queue`

Proposed aliases, concepts, mappings, ambiguity cases, and repeated unresolved terms.

Key fields:

- `id`
- `review_type`
- `proposed_payload`
- `query_frequency`
- `affected_systems`
- `risk_level`
- `status`
- `reviewed_by`
- `reviewed_at`

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
- `primary_concept_ids`
- `mentioned_concept_ids`
- `operation_concept_ids`
- `property_concept_ids`
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
- `semantic_version`
- `semantic_frame_redacted`
- `unresolved_term_count`
- `ambiguous_concept_count`
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

### 20.2 Migration constraints

- New tables require RLS.
- User question text should not be stored in clear text unless already covered by approved chat-log policy.
- Claim text stored for diagnostics must be redacted or retention-limited.
- Existing `manual_chunks` and `barry_v2_*` records remain source systems during migration.
- Semantic tables augment existing source records; they do not duplicate complete manual text.
- Concept IDs are immutable and deprecated concepts redirect to approved successors.
- Semantic changes are promoted as versioned releases rather than in-place production edits.
- No direct SQL changes to Supabase storage tables.

---

## 21. API Contract

The existing response remains backward-compatible while adding optional grounding metadata.

```typescript
interface BarryGroundedResponse {
  content: string;
  manualReferences: Array<{
    evidence_id: string;
    title: string;
    document_role: DocumentRole;
    page_type: PageType;
    primary_concept_ids: string[];
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
    semantic_version: string;
    resolved_concept_ids: string[];
    unresolved_term_count: number;
    supported_claim_count: number;
    removed_claim_count: number;
    conflicted_claim_count: number;
    abstained: boolean;
  };
}
```

Internal evidence previews, verifier prompts, and detailed reasoning are not returned to users.

---

## 22. Functional Requirements

### FR-12: Semantic frame requirement

Every technical request must produce a valid semantic frame before evidence retrieval. If the frame contains a material unresolved ambiguity, Barry must clarify or restrict the answer to claims that do not depend on resolving it.

### FR-13: Claim extraction

Every technical draft must be converted to structured claims before delivery.

### FR-14: Claim-level support

Every retained technical claim must have one or more eligible evidence units or be explicitly identified as general safety advice that does not require a vehicle-specific claim.

### FR-15: Unsupported claims

Unsupported claims must be removed, narrowed, or converted to an evidence-gap statement. They must not remain with phrases such as "likely," "usually," or "common" unless evidence supports those qualifiers.

### FR-16: Conflicting evidence

When eligible evidence conflicts:

- do not select a value based solely on retrieval rank;
- resolve by applicability when possible;
- otherwise present the conflict and request the missing configuration detail.

### FR-17: Parts restrictions

Part numbers require parts-list or structured parts evidence with compatible applicability. A component diagram without a readable part-number mapping is insufficient.

### FR-18: Procedure restrictions

A diagram, parts list, or descriptive page cannot authorize disassembly, adjustment, torque, or installation steps.

### FR-19: Diagnostic restrictions

Barry may suggest safe external observations without a manual diagnostic path, but must distinguish observation from diagnosis. Statements about common failure rates or likely causes require evidence.

### FR-20: Conversation isolation

Previous assistant claims and user-supplied technical assertions are context, not evidence. They cannot enter the grounding ledger unless independently supported by retrieved evidence.

### FR-21: Citation minimality

The final reference list should include only citations needed for retained claims. Duplicate pages and unused retrieval results must be omitted.

### FR-22: Evidence gaps

Barry must identify missing categories specifically:

- no verified diagnostic procedure;
- no verified fluid specification;
- no applicable torque value;
- no confirmed part number;
- document present but page unreadable;
- model applicability unknown.

### FR-23: Fail-safe behavior

If claim verification fails because of a model, database, or timeout error:

- do not return the unverified technical draft;
- return a concise evidence-unavailable response;
- preserve safe external inspection advice where permitted;
- log the failure category.

---

## 23. Non-Functional Requirements

### 23.1 Safety

- Zero unsupported safety-critical numeric claims in the release benchmark.
- No unverified procedure may be returned after verifier failure.
- Safety warnings must not imply a source contains a warning when it does not.

### 23.2 Reliability

- Technical pipeline success rate: at least 99.5%, excluding upstream document absence.
- PDF document resolution success: at least 99%.
- No single verifier outage may cause unverified drafts to pass through.

### 23.3 Performance

- Added grounding latency target: p50 below 1.5 seconds, p95 below 4 seconds.
- Total Barry technical-answer p95 target: below 10 seconds during initial rollout.
- Evidence validation must use bounded concurrency and timeouts.

### 23.4 Cost

- Claim validation token use must be measured separately.
- Reuse validation results for duplicate normalized claims and identical evidence hashes.
- Deterministic filters must run before model-assisted entailment.
- Cost increases require a documented quality gain in benchmark results.

### 23.5 Observability

Every technical request must expose internal metrics for:

- semantic version;
- concepts resolved by type;
- unresolved and ambiguous terms;
- relationship expansions and graph distance;
- semantic coverage and semantic retrieval contribution;
- retrieval count;
- eligible evidence count;
- claim count by class;
- supported, narrowed, removed, and conflicted claims;
- citations returned;
- abstention;
- verifier latency and status;
- PDF integrity status;
- policy and model version.

### 23.6 Privacy and security

- Treat manual text and user queries as untrusted model input.
- Prevent retrieved content from overriding system policy.
- Do not log credentials, authorization headers, or signed URLs.
- Apply RLS and least-privilege access to grounding telemetry.
- Limit retention of raw claim text.

---

## 24. Benchmark and Evaluation Strategy

### 24.1 Benchmark design

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
- 10 must test aliases that are valid only within a specific system or model context;
- 10 must test semantic relationship expansion against direct concept matching;
- 10 must test model/configuration ambiguity;
- 10 must test conflicting or duplicate evidence.

### 24.2 Case structure

Each case defines:

- user question;
- vehicle context;
- expected semantic frame;
- expected and prohibited concept resolutions;
- expected relationship expansions;
- permitted claim classes;
- expected source roles;
- expected and prohibited pages;
- required facts;
- forbidden claims;
- expected abstention categories;
- expected supporting-document behavior.

### 24.3 Seed regression cases

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

### 24.4 Evaluation layers

#### Layer 1: Deterministic unit tests

- concept identity and deprecation redirects;
- alias normalization and contextual resolution;
- relationship direction and traversal limits;
- semantic version activation;
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

- semantically equivalent questions produce equivalent primary concepts;
- unrelated concepts with similar wording remain separated;
- required relationship expansion paths retrieve the expected evidence;
- prohibited or excessive graph expansion does not affect results;
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

## 25. Quality Metrics

### 25.1 Primary metrics

- **Unsupported technical claim rate:** unsupported retained claims divided by technical claims.
- **Semantic resolution accuracy:** benchmark terms resolved to the expected canonical concepts.
- **Semantic ambiguity preservation:** material ambiguities retained or clarified rather than silently collapsed.
- **Alias equivalence:** approved paraphrases and spelling variants produce equivalent semantic frames and primary evidence.
- **Semantic coverage:** active evidence and frequent production queries mapped to approved concepts.
- **Relationship precision:** graph-expanded evidence relevant to the intended relationship path.
- **Citation precision:** returned citations that support at least one retained claim.
- **Citation recall:** supported technical claims with a citation when one is required.
- **Role violation rate:** claims supported by a prohibited document or page type.
- **Applicability violation rate:** claims based on incompatible or unknown applicability.
- **Numeric accuracy:** exact values, units, ranges, and conditions matching evidence.
- **PDF landing accuracy:** citations opening the intended document and physical page.
- **Appropriate abstention rate:** cases requiring abstention that abstain correctly.

### 25.2 Initial release gates

For the curated benchmark:

- unsupported safety-critical claim rate: **0%**;
- semantic resolution accuracy: **at least 98% overall and 100% for safety-critical benchmark terms**;
- semantic ambiguity preservation: **100% for material benchmark ambiguities**;
- approved alias equivalence: **at least 99%**;
- relationship precision: **at least 98%**;
- role violation rate: **0%**;
- applicability violation rate for exact specifications: **0%**;
- citation precision: **at least 98%**;
- citation recall: **at least 95%**;
- numeric accuracy: **100% for safety-critical values, at least 99% overall**;
- PDF landing accuracy: **at least 99%**;
- appropriate abstention recall: **at least 95%**;
- no benchmark category may regress by more than two percentage points from the accepted baseline.

### 25.3 Operational metrics

- technical-answer latency;
- verifier failure rate;
- evidence-insufficient rate;
- no-citation technical-answer rate;
- PDF load failure rate;
- most frequent rejection reason;
- most frequent missing document role or page type;
- user feedback correlated with grounding outcome.

---

## 26. Release Gate

Changes to any of the following require the Barry grounding suite:

- model or model version;
- system or verifier prompt;
- retrieval query construction;
- ranking weights or thresholds;
- synonym taxonomy;
- semantic ontology, concepts, aliases, relationships, mappings, or ranking weights;
- semantic version activation;
- evidence schema or adapter;
- document processing or OCR;
- PDF path or page mapping;
- citation filtering;
- technical query classification.

### 26.1 Gate behavior

- Pull request checks run deterministic and offline benchmark layers.
- Staging runs integration and end-to-end layers.
- A failed safety-critical case blocks promotion.
- Baseline changes require explicit review and justification.
- Expected pages or forbidden claims cannot be changed merely to make a failing implementation pass.

---

## 27. Monitoring and Operations

### 27.1 Dashboards

The Barry quality dashboard should show:

- semantic resolution accuracy and coverage;
- most frequent unresolved and ambiguous terms;
- proposed aliases and mappings awaiting review;
- relationship expansion frequency and precision;
- grounding success over time;
- unsupported-claim removals by class;
- citation precision samples;
- abstention rate;
- retrieval misses by vehicle system;
- role and applicability violations;
- PDF integrity failures;
- latency and cost by pipeline stage;
- benchmark history by release.

### 27.2 Alerts

Alert when:

- semantic resolution accuracy falls below the accepted baseline;
- safety-critical queries contain unresolved concepts above the accepted threshold;
- an unreviewed semantic version is activated;
- verifier failure exceeds 1% over 15 minutes;
- PDF load failures exceed 2% over 30 minutes;
- technical answers with no eligible evidence spike above baseline;
- citation precision audit falls below 98%;
- a document integrity check changes from passing to failing;
- safety-critical benchmark cases fail.

### 27.3 Review queue

Create an admin review queue for:

- user-reported incorrect answers;
- high-impact abstentions caused by missing documentation;
- conflicting sources;
- low-extraction-quality pages;
- repeated retrieval misses;
- documents with broken paths or mappings.

Review outcomes should update source metadata, governed semantic concepts or aliases, relationships, evidence annotations, or benchmark cases. They should not default to question-specific prompt exceptions.

---

## 28. Rollout Plan

### Phase 0: Baseline and instrumentation

- Capture the current benchmark baseline.
- Add expected semantic frames, concept resolutions, and relationship paths to seed cases.
- Add request, evidence, claim, and citation identifiers.
- Add grounding telemetry without changing user-visible behavior.
- Audit current document paths and page counts.

### Phase 1: Semantic foundation

- Create semantic version, concept, alias, relationship, evidence-mapping, and review-queue schemas.
- Define the initial controlled ontology and relationship allowlist.
- Seed U435/U1700L vehicle, system, high-risk component, symptom, operation, property, fluid, and claim concepts.
- Import and review existing RPS synonyms as proposed semantic aliases.
- Build the semantic query-frame parser and deterministic alias resolver.
- Add semantic versioning and activation controls.

### Phase 2: Semantic evidence backfill

- Map priority workshop, maintenance, owner's manual, and RPS records to concepts.
- Classify primary subjects, mentioned components, operations, properties, applicability, document roles, and page types.
- Measure semantic coverage by query frequency and safety risk.
- Route low-confidence and conflicting mappings to review.
- Keep legacy retrieval operational for unmapped content.

### Phase 3: Hybrid semantic retrieval and deterministic evidence policy

- Introduce normalized evidence units.
- Add semantic retrieval planning and bounded relationship expansion.
- Combine concept, lexical, embedding, and structured retrieval scores.
- Implement document-role and page-type rules.
- Implement applicability and numeric checks.
- Add citation deduplication and final reconciliation.
- Run in shadow mode against current technical answers.

### Phase 4: Claim-level verifier

- Add structured claim extraction.
- Link claim subjects, predicates, and objects to semantic concepts.
- Add constrained entailment decisions.
- Reconstruct answers from supported claims.
- Fail closed when verification fails.
- Enable on staging.

### Phase 5: Benchmark release gate

- Commit the seed corpus.
- Add semantic, deterministic, retrieval, grounding, and integration runners.
- Store versioned results.
- Require passing results for Barry technical changes.

### Phase 6: Document integrity and indexing improvements

- Establish canonical document registry.
- Audit PDFs, storage paths, page counts, and page mappings.
- Complete semantic backfill of document roles, page types, concepts, and applicability.
- Reprocess low-quality pages by priority.

### Phase 7: Controlled production rollout

- Shadow mode.
- Internal/admin cohort.
- 10% technical traffic.
- 25%.
- 50%.
- 100% after success criteria and soak period.

Each step requires:

- no failed safety-critical benchmark;
- semantic resolution and relationship precision at or above thresholds;
- no material latency or error-rate breach;
- citation and grounding metrics at or above thresholds;
- tested rollback.

---

## 29. Rollback Strategy

- Keep the previous `barry-tools` function version deployable.
- Keep the previously accepted semantic version available for immediate reactivation.
- Feature-flag semantic retrieval separately from semantic annotation backfill.
- Feature-flag claim-level verification separately from retrieval changes.
- Do not roll back to a mode that returns unverified drafts after verifier failure.
- If model-assisted verification is disabled during an incident, use deterministic policy plus evidence-gap responses.
- Preserve grounding telemetry during rollback for diagnosis.

---

## 30. Dependencies

- Supabase schema visibility and migration review.
- Agreement on the initial ontology, relationship allowlist, semantic governance roles, and version activation process.
- Stable access to `manual_chunks`, `barry_v2_*`, RPS, and validated knowledge data.
- Canonical Supabase Storage paths.
- DeepSeek structured-output reliability or an equivalent verifier model.
- Frontend compatibility with enriched manual references.
- A staging user/session for authenticated end-to-end tests.
- Reviewer availability for safety-critical benchmark cases.

---

## 31. Risks and Mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| Verification adds latency | Slower answers | Deterministic prefilters, bounded concurrency, caching, compact evidence |
| Verifier rejects useful claims | Excessive abstention | Tune against reviewed benchmarks without lowering safety gates |
| Existing metadata is incomplete | Reduced coverage | Use `unknown` explicitly, prioritize backfill by query demand |
| Semantic concepts become too broad | Incorrect evidence merging | Enforce typed concepts, scoped aliases, reviewed relationships, and benchmark separation cases |
| Semantic concepts become too granular | Sparse retrieval and maintenance burden | Begin with high-risk concepts and split only when applicability or claim behavior differs |
| Ontology changes cause silent drift | Inconsistent answers | Immutable versions, activation gates, grounding-run version records, and rollback |
| Alias collisions resolve to the wrong component | Unsafe retrieval | Context-scoped aliases, ambiguity preservation, and safety-critical human review |
| Graph expansion retrieves loosely related evidence | Irrelevant citations | Relationship allowlist, hop limits, distance penalties, and relationship-precision gates |
| OCR text is poor | False support or missed evidence | Extraction-quality scores and page reprocessing queue |
| Source documents conflict | Incorrect silent selection | Conflict state and applicability-based resolution |
| Benchmark overfits known questions | False confidence | Category coverage, paraphrases, hidden evaluation set, production sampling |
| Model update changes JSON behavior | Pipeline errors | Strict schema validation, retries with bounds, fail-safe response |
| Full PDF paths are large | Viewer timeout | Target-page rendering, local worker, range support, direct-open fallback |
| Telemetry stores sensitive text | Privacy exposure | Hashing, redaction, limited retention, RLS |
| Rules become question-specific | Maintenance burden | Enforce taxonomy and policy abstractions; reject prompt-only exceptions |

---

## 32. Security Requirements

- Validate all model-produced JSON against strict schemas.
- Validate concept IDs, relationship types, semantic versions, and graph traversal limits server-side.
- Prevent user or retrieved text from creating or activating semantic concepts at runtime.
- Treat retrieved manual content as data, never instructions.
- Sanitize storage paths and only allow approved Supabase buckets/domains.
- Do not expose service-role credentials to the frontend.
- Apply bounded input lengths and tool-call limits.
- Prevent prompt injection in conversation history from disabling grounding policy.
- Record policy version and verifier version for auditability.
- Run repository secret scans before staging pushes.

---

## 33. Testing and Verification Protocol

Every implementation phase requires:

1. Unit tests for ontology, aliases, relationships, policy, and normalization code.
2. Semantic frame tests for synonyms, spelling variants, ambiguity, and model context.
3. Contract tests for semantic mappings, evidence adapters, and response schema.
4. Retrieval tests against representative stored data.
5. Verifier tests with supported, unsupported, conditional, and conflicting claims.
6. PDF path and cited-page rendering tests.
7. TypeScript and edge-function build checks.
8. Production frontend build.
9. Security scan.
10. Five-pass review:
   - functionality;
   - AI slop and placeholder removal;
   - minimalism;
   - robustness;
   - security.
11. Staging deployment and documented smoke test.

---

## 34. Acceptance Criteria

The project is complete when:

1. A versioned semantic layer represents the initial vehicle, system, component, symptom, operation, property, fluid, part, document-role, page-type, and hazard scope.
2. Every technical request produces a semantic frame before retrieval.
3. Approved aliases resolve equivalent language while material ambiguity is preserved or clarified.
4. Evidence is semantically annotated with provenance, confidence, applicability, and semantic version.
5. Semantic relationship expansion is typed, bounded, auditable, and meets the precision gate.
6. Every technical response is processed through a structured grounding ledger.
7. Unsupported technical claims cannot pass through when the verifier fails.
8. Document-role and page-type policy is enforced in executable code.
9. Exact values and part numbers receive deterministic evidence checks.
10. Vehicle applicability is represented and enforced.
11. Returned citations map to retained claims and unused citations are removed.
12. The supporting-document panel opens the correct canonical PDF page.
13. A minimum 100-case benchmark is versioned and repeatable.
14. Release gates meet the thresholds in Section 25.
15. Semantic, grounding, and PDF integrity dashboards expose production health.
16. Staging completes the rollout gates without a safety-critical failure.
17. Documentation and operational runbooks reflect the final architecture.

---

## 35. Initial Implementation Deliverables

### Code

- Shared semantic concept, alias, relationship, annotation, and query-frame types.
- Semantic query interpreter and context-aware alias resolver.
- Bounded semantic relationship traversal and hybrid retrieval planner.
- Semantic version loader, cache, activation check, and rollback support.
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

- Reviewed migrations for semantic versions, concepts, aliases, relationships, evidence mappings, review queue, canonical documents, grounding runs, claim decisions, and evaluation history.
- RLS policies and retention policy.
- Backfill process for existing manual, v2, validated knowledge, and RPS records.

### Tests

- Ontology and semantic version tests.
- Contextual alias and ambiguity tests.
- Relationship traversal and semantic ranking tests.
- Semantic mapping and coverage tests.
- Policy matrix unit tests.
- Normalization tests.
- Claim grounding tests.
- Retrieval tests.
- Seed benchmark cases.
- Authenticated end-to-end PDF citation test.

### Operations

- Semantic coverage and review dashboard.
- Semantic version promotion and rollback runbook.
- Alias, relationship, and mapping review workflow.
- Staging rollout checklist.
- Rollback procedure.
- Quality dashboard.
- Alert definitions.
- Document integrity report.
- Reviewer workflow.

---

## 36. Decisions Required Before Implementation

1. Confirm whether detailed claim text may be stored temporarily for debugging, or whether only redacted text and hashes are permitted.
2. Confirm the technical reviewer responsible for approving safety-critical concepts, relationships, mappings, and benchmark facts.
3. Confirm whether the first semantic release targets only U435/U1700L documentation or all indexed models.
4. Confirm whether the existing `admin-rps-synonyms` data should be migrated into the semantic alias review queue.
5. Confirm acceptable initial p95 latency and cost increase for semantic interpretation and technical grounding.
6. Confirm whether production rollout requires an admin-only pilot before percentage-based traffic.

These decisions affect rollout and retention but do not block building the offline policy engine, evidence adapters, or seed benchmark.

---

## 37. Recommended Implementation Order

1. Extend the benchmark with expected semantic frames and capture the current baseline.
2. Define the initial ontology, relationships, governance rules, and immutable version model.
3. Implement the semantic registry, contextual aliases, query interpreter, and review queue.
4. Annotate priority evidence and measure semantic coverage.
5. Implement hybrid semantic retrieval with bounded relationship expansion.
6. Introduce normalized evidence units and document-role policy.
7. Add deterministic numeric, part-number, applicability, and citation checks.
8. Add the grounding ledger and fail-safe behavior.
9. Add claim extraction and constrained entailment linked to semantic concepts.
10. Add final answer reconstruction and citation reconciliation.
11. Audit documents and complete priority semantic backfill.
12. Add dashboards, alerts, semantic version release gates, and rollback.
13. Roll out through staging and controlled production cohorts.

This order produces measurable quality improvements early and prevents the verifier from being judged only through anecdotal questions.
