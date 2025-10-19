# Content Architecture for Extraction & Synthesis

Goal: Make content easy for models to extract, synthesize, and cite with high fidelity.

## Principles

- Stable Anchors: Every section, step, figure has a stable `id`.
- Small, Atomic Blocks: Keep chunks < 1,200 tokens where possible.
- Single Source of Truth: Canonical facts originate from database tables and are exposed via the Canonical API.
- Explicit Provenance: Every synthesized answer can point to section/page anchors and canonical IDs.

## Practical Rules

1. Headings & IDs
   - In Markdown/HTML, add explicit `id` attributes: `<h3 id="om352-oil-seals">OM352 Oil Seals</h3>`
   - For lists of steps, add `id` per step: `<li id="proc-U1700L-oil-01">…</li>`

2. Page/Section Mapping
   - For PDFs, maintain a mapping table: `(doc_id, section_id, page_number)`.
   - Expose via API to allow `citation.page` references.

3. Canonical IDs
   - Use URNs for entities and sections: `urn:unimog:procedure:U1700L:ENG:OIL:step-01`.
   - Store `canonical_id` on rows and include in API responses.

4. Citations
   - Store citation entries with fields: `source_type` (manual, bulletin), `source_id`, `section_id`, `page`, `figure`, `lines`.
   - API returns `citations: [ { source: ..., page: 12, anchor: "#proc-U1700L-oil-01" } ]`.

5. Attribution Formatting
   - In UI, render citations as footnotes with links to anchors.
   - In API, include machine‑readable `citations[]` with stable anchors.

6. Change Tracking
   - Maintain `updated_at` and `version` where applicable.
   - Add `checksum` (SHA‑256) to large content blobs for de‑duplication and integrity.

## Future Schema (DB)

- `canonical_entities(id, type, slug, canonical_id, schema_uri, version, updated_at)`
- `canonical_claims(entity_id, predicate, object, datatype, lang, confidence, source_id)`
- `sources(id, type, url, title, publisher, retrieved_at)`
- `entity_aliases(entity_id, alias)`
- `section_anchors(entity_id, local_id, page, fragment)`

These can be materialized from existing WIS tables to avoid duplication.

