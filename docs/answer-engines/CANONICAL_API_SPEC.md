# Canonical API for Answer Engines

Purpose: Provide structured, citation‑friendly, canonical data for LLMs and answer engines. Prefer machine‑readable JSON‑LD with stable IDs and provenance.

## Endpoints

- GET `/functions/v1/canonical?type=model&slug=U1700L`
  - Accept: `application/ld+json` (preferred) or `application/json`
  - Returns JSON‑LD describing the entity with stable `@id`, provenance, and attributes.
  - Caching: ETag header set; supports `If-None-Match`.

Future types:
- `type=procedure`, `type=part`, `type=bulletin`

## JSON‑LD Shape (Model)

```json
{
  "@context": {
    "@vocab": "https://schema.org/",
    "unimog": "https://unimogcommunityhub.com/vocab#"
  },
  "@id": "urn:unimog:model:U1700L",
  "@type": "Vehicle",
  "name": "U1700L",
  "model": "U1700L",
  "vehicleModelDate": "2000-2013",
  "url": "https://unimogcommunityhub.com/models/U1700L",
  "additionalProperty": [
    { "@type": "PropertyValue", "name": "series", "value": "437" },
    { "@type": "PropertyValue", "name": "wheelbase_cm", "value": 385 }
  ],
  "isPartOf": {
    "@type": "Dataset",
    "name": "Unimog Model Registry",
    "url": "https://unimogcommunityhub.com/models"
  },
  "citation": [],
  "identifier": "urn:unimog:model:U1700L",
  "dateModified": "2025-01-05T00:00:00Z",
  "license": "https://unimogcommunityhub.com/license",
  "publisher": { "@type": "Organization", "name": "Unimog Community Hub" }
}
```

## Contract

- Stable IDs: Use URNs (`urn:unimog:model:...`, `urn:unimog:procedure:...`).
- Canonical URL: Include absolute link to human page.
- Provenance: `dateModified`, `publisher`, `license`.
- Citations: For content types that derive from manuals, add `citation` entries with source, page, section anchor.
- Versioning: Increment `dateModified` and include optional `version` when content changes.

## Content Negotiation

- Clients should request `application/ld+json`.
- Fallback to `application/json` returns identical structure.

## Rate & Caching

- Use ETag to avoid re‑downloading unchanged entities.
- Respect `Cache-Control` if added later.

## Search & Discovery (Phase 2)

- Add `/functions/v1/canonical/search?q=...&type=...` returning IDs and canonical summaries.
- Publish an OpenAPI spec to document the interface for answer engines.

