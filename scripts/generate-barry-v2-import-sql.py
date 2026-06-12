#!/usr/bin/env python3
"""
Barry v2 Extraction SQL Generator
Generates SQL INSERT statements from extraction JSON files for Supabase SQL Editor.

Usage:
    python3 scripts/generate-barry-v2-import-sql.py [--all] [--file <path>] [--limit <n>]

Output: docs/extraction/import_manual_records.sql (or stdout)
"""

import json, os, sys, uuid
from pathlib import Path

EXTRACTION_DIR = "docs/extraction"
OUTPUT_DIR = "docs/extraction"
REGISTRY_PATH = "docs/BARRY_V2_CANONICAL_MANUAL_REGISTRY.json"


def load_registry():
    with open(REGISTRY_PATH) as f:
        return json.load(f)


def find_source_doc(registry, title):
    """Find source document UUID by normalized title."""
    for r in registry.get("records", []):
        if r.get("normalized_title") == title:
            return r
    return None


def safe(val):
    """Escape a string for SQL."""
    if val is None:
        return "NULL"
    return "'" + str(val).replace("'", "''") + "'"


def truncate_text(text, max_len=8000):
    """Truncate text to fit in SQL insert."""
    if text and len(text) > max_len:
        return text[:max_len] + "\n-- [TRUNCATED]"
    return text


def generate_import_sql(extraction_files, registry=None):
    """Generate SQL INSERT statements for barry_v2_manuals, chapters, and content blocks."""
    lines = []
    lines.append("-- Barry v2 Extraction Import")
    lines.append("-- Generated: " + __import__('datetime').datetime.now().isoformat())
    lines.append("-- BEGIN;\n")

    for filepath in extraction_files:
        with open(filepath) as f:
            data = json.load(f)

        title = data.get("normalized_title") or Path(data["source"]).stem
        filename = data["source"]
        pages = data["total_pages"]
        source_doc = find_source_doc(registry, title) if registry else None
        source_doc_id = source_doc.get("canonical_id") if source_doc else None

        manual_id = str(uuid.uuid4())
        chapter_id = str(uuid.uuid4())

        # Generate UUID deterministically from title for idempotency
        import hashlib
        manual_uuid = str(uuid.UUID(hashlib.md5(f"manual:{title}".encode()).hexdigest()))
        chapter_uuid = str(uuid.UUID(hashlib.md5(f"chapter:{title}".encode()).hexdigest()))

        lines.append(f"-- === {title} ===")
        lines.append(f"-- Pages: {pages}, Blocks: {len(data.get('content_blocks', []))}")

        # INSERT manual
        lines.append(f"""
INSERT INTO barry_v2_manuals (id, source_document_id, title, filename, manual_type, language, total_pages, metadata)
VALUES (
  '{manual_uuid}',
  (SELECT id FROM barry_v2_source_documents WHERE canonical_id = {safe(source_doc_id)} LIMIT 1),
  {safe(title)},
  {safe(filename)},
  'workshop',
  'en',
  {pages},
  '{{"source": "pymupdf_extraction", "pilot": true, "generated": "2026-06-12"}}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  total_pages = EXCLUDED.total_pages,
  metadata = EXCLUDED.metadata;
""")

        # INSERT chapter (one per document for pilot)
        lines.append(f"""
INSERT INTO barry_v2_manual_chapters (id, manual_id, title, slug, page_start, page_end)
VALUES (
  '{chapter_uuid}',
  '{manual_uuid}',
  {safe(title)},
  {safe(title.lower().replace(' ', '-').replace(':', '-')[:80])},
  1,
  {pages}
)
ON CONFLICT (id) DO NOTHING;
""")

        # Batch INSERT content blocks
        blocks = data.get("content_blocks", [])
        if not blocks:
            lines.append("-- No content blocks extracted\n")
            continue

        lines.append(f"INSERT INTO barry_v2_content_blocks (id, chapter_id, block_type, title, page_number, page_start, page_end, content_text, content_json, system_tags, model_tags, part_numbers, is_primary, extraction_quality, source_page_reference) VALUES")

        for i, block in enumerate(blocks):
            block_uuid = str(uuid.UUID(hashlib.md5(f"block:{title}:{i}".encode()).hexdigest()))
            block_type = block.get("block_type", "explanation")
            btitle = block.get("title", "")
            page_start = block.get("page_start", 1)
            page_end = block.get("page_end", page_start)
            text = truncate_text(block.get("content_text", ""), 6000)
            is_primary = "true" if block_type in ("procedure", "specification") else "false"

            comma = "," if i < len(blocks) - 1 else ";"

            lines.append(f"""(
  '{block_uuid}', '{chapter_uuid}', '{block_type}',
  {safe(btitle)},
  {page_start}, {page_start}, {page_end},
  {safe(text)},
  '{{}}'::jsonb,
  '{{}}'::text[], '{{}}'::text[], '{{}}'::text[],
  {is_primary},
  0.70,
  {safe(f"p.{page_start}")}
){comma}""")

        lines.append("")

    lines.append("COMMIT;")
    return "\n".join(lines)


def main():
    registry = load_registry()

    files = sorted(Path(EXTRACTION_DIR).glob("*_extraction.json"))
    if not files:
        print(f"No extraction files found in {EXTRACTION_DIR}")
        sys.exit(1)

    print(f"Found {len(files)} extraction files")

    # Generate SQL for all files
    sql = generate_import_sql(files, registry)

    out_path = Path(OUTPUT_DIR) / "import_extraction_data.sql"
    with open(out_path, "w") as f:
        f.write(sql)
    print(f"Written: {out_path}")
    print(f"Size: {len(sql):,} bytes")

    # Summary
    total_blocks = 0
    for filepath in files:
        with open(filepath) as f:
            data = json.load(f)
        total_blocks += len(data.get("content_blocks", []))
    print(f"Total INSERT statements: {total_blocks} content blocks across {len(files)} manuals")


if __name__ == "__main__":
    main()
