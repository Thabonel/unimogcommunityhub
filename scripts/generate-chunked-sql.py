#!/usr/bin/env python3
"""Generate chunked SQL import files with dollar-quoting for safe content."""

import json, os, uuid, hashlib, datetime
from pathlib import Path

EXTRACTION_DIR = "docs/extraction"
REGISTRY_PATH = "docs/BARRY_V2_CANONICAL_MANUAL_REGISTRY.json"
CHUNK_DIR = "docs/extraction/chunks"
CHUNK_SIZE = 200 * 1024

with open(REGISTRY_PATH) as f:
    registry = json.load(f)


def find_source_doc(title):
    for r in registry.get("records", []):
        if r.get("normalized_title") == title:
            return r.get("canonical_id")
    return None


def esc(val):
    """Escape for SQL: wrap in dollar-quotes to avoid all single-quote issues."""
    if val is None:
        return "NULL"
    s = str(val)
    return "$$" + s.replace("$$", "$$$$") + "$$"


def main():
    os.makedirs(CHUNK_DIR, exist_ok=True)
    files = sorted(Path(EXTRACTION_DIR).glob("*_extraction.json"))
    print(f"Generating chunks from {len(files)} extraction files...")

    chunk_num = 0
    buf = ["-- Barry v2 import (dollar-quoted, safe for any content)\nBEGIN;\n"]
    buf_size = len(buf[0].encode())

    for filepath in files:
        with open(filepath) as f:
            data = json.load(f)

        title = data.get("normalized_title") or Path(data["source"]).stem
        filename = data["source"]
        pages = data["total_pages"]
        source_doc_id = find_source_doc(title)
        manual_uuid = str(uuid.UUID(hashlib.md5(f"manual:{title}".encode()).hexdigest()))
        chapter_uuid = str(uuid.UUID(hashlib.md5(f"chapter:{title}".encode()).hexdigest()))
        blocks = data.get("content_blocks", [])
        slug = title.lower().replace(" ", "-").replace(":", "-")[:80]

        # Estimate size
        est = 500 + len(blocks) * 80
        if buf_size > 0 and buf_size + est > CHUNK_SIZE and len(buf) > 2:
            buf.append("COMMIT;\n")
            chunk_num += 1
            with open(f"{CHUNK_DIR}/import_chunk_{chunk_num:02d}.sql", "w") as f:
                f.writelines(buf)
            print(f"  chunk {chunk_num:02d}: {sum(len(l.encode()) for l in buf)/1024:.0f}KB")
            buf = [f"-- Barry v2 chunk {chunk_num+1}\nBEGIN;\n"]
            buf_size = len(buf[0].encode())

        # Manual INSERT (use dollar-quoting for text fields)
        manual_sql = f"""INSERT INTO barry_v2_manuals (id, source_document_id, title, filename, manual_type, language, total_pages, metadata)
VALUES (
  '{manual_uuid}',
  (SELECT id FROM barry_v2_source_documents WHERE canonical_id = {esc(source_doc_id)} LIMIT 1),
  {esc(title)}, {esc(filename)},
  'workshop', 'en', {pages},
  '{{"source": "pymupdf_extraction"}}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET total_pages = EXCLUDED.total_pages, metadata = EXCLUDED.metadata;

"""
        buf.append(manual_sql)
        buf_size += len(manual_sql.encode())

        # Chapter INSERT
        chapter_sql = f"""INSERT INTO barry_v2_manual_chapters (id, manual_id, title, slug, page_start, page_end)
VALUES ('{chapter_uuid}', '{manual_uuid}', {esc(title)}, {esc(slug)}, 1, {pages})
ON CONFLICT (id) DO NOTHING;

"""
        buf.append(chapter_sql)
        buf_size += len(chapter_sql.encode())

        # Content blocks
        for i, block in enumerate(blocks):
            block_uuid = str(uuid.UUID(hashlib.md5(f"block:{title}:{i}".encode()).hexdigest()))
            bt = block.get("block_type", "explanation")
            btitle = block.get("title", "")
            ps = block.get("page_start", 1)
            pe = block.get("page_end", ps)
            text = (block.get("content_text") or "")[:5000]
            is_primary = "true" if bt in ("procedure", "specification") else "false"
            src_ref = f"p.{ps}"

            row = f"""INSERT INTO barry_v2_content_blocks (id, chapter_id, block_type, title, page_number, page_start, page_end, content_text, content_json, system_tags, model_tags, part_numbers, is_primary, extraction_quality, source_page_reference)
VALUES (
  '{block_uuid}', '{chapter_uuid}', {esc(bt)}, {esc(btitle)},
  {ps}, {ps}, {pe},
  {esc(text)},
  '{{}}'::jsonb, '{{}}'::text[], '{{}}'::text[], '{{}}'::text[],
  {is_primary}, 0.70, {esc(src_ref)}
)
ON CONFLICT (id) DO UPDATE SET content_text = EXCLUDED.content_text;

"""
            if buf_size > 0 and buf_size + len(row.encode()) > CHUNK_SIZE and len(buf) > 5:
                buf.append("COMMIT;\n")
                chunk_num += 1
                with open(f"{CHUNK_DIR}/import_chunk_{chunk_num:02d}.sql", "w") as f:
                    f.writelines(buf)
                buf = [f"-- Barry v2 chunk {chunk_num+1}\nBEGIN;\n-- Manual: {title}\n"]
                buf_size = len(buf[0].encode())

            buf.append(row)
            buf_size += len(row.encode())

    # Flush remaining
    if len(buf) > 2:
        buf.append("COMMIT;\n")
        chunk_num += 1
        with open(f"{CHUNK_DIR}/import_chunk_{chunk_num:02d}.sql", "w") as f:
            f.writelines(buf)
        print(f"  chunk {chunk_num:02d}: {sum(len(l.encode()) for l in buf)/1024:.0f}KB")

    print(f"\nTotal: {chunk_num} chunks in {CHUNK_DIR}/")
    for i in range(1, chunk_num + 1):
        size = os.path.getsize(f"{CHUNK_DIR}/import_chunk_{i:02d}.sql")
        print(f"  chunk_{i:02d}: {size/1024:.0f}KB")


if __name__ == "__main__":
    main()
