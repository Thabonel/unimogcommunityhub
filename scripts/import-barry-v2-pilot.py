#!/usr/bin/env python3
"""
Barry v2 Pilot Data Importer
Loads extracted JSON into barry_v2_content_blocks and related tables.

Usage:
    python3 scripts/import-barry-v2-pilot.py <extraction-json> [--dry-run]

Requires:
    - Running after extraction (scripts/extract-barry-v2-pilot.py)
    - Supabase service role key for direct DB access
"""

import json, os, sys, argparse
from pathlib import Path
from datetime import datetime

try:
    from supabase import create_client, Client
except ImportError:
    print("ERROR: supabase module not found. Install with:")
    print("  pip install supabase")
    sys.exit(1)


SUPABASE_URL = os.environ.get("VITE_SUPABASE_URL", "https://ydevatqwkoccxhtejdor.supabase.co")
SUPABASE_SERVICE_KEY = os.environ.get("SUPABASE_SERVICE_ROLE_KEY", "")

if not SUPABASE_SERVICE_KEY:
    print("WARNING: SUPABASE_SERVICE_ROLE_KEY not set. Set it to enable database import.")
    print("  export SUPABASE_SERVICE_ROLE_KEY=your-key-here")


def connect_supabase():
    if not SUPABASE_SERVICE_KEY:
        return None
    return create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)


def find_source_document(supabase, filename):
    """Find the source document record for a given filename."""
    result = supabase.table("barry_v2_source_documents") \
        .select("id, normalized_title") \
        .like("filename", f"%{filename}%") \
        .execute()
    return result.data[0] if result.data else None


def create_manual(supabase, source_doc_id, filename, title, pages):
    """Create a barry_v2_manuals entry and return its ID."""
    manual = {
        "source_document_id": source_doc_id,
        "title": title or filename,
        "filename": filename,
        "manual_type": "workshop",
        "language": "en",
        "total_pages": pages,
        "metadata": {"source": "pilot_extraction", "pilot": True},
    }
    result = supabase.table("barry_v2_manuals") \
        .insert(manual) \
        .execute()
    return result.data[0]["id"] if result.data else None


def create_chapter(supabase, manual_id, title, page_start, page_end):
    """Create a barry_v2_manual_chapters entry and return its ID."""
    slug = title.lower().replace(" ", "-")[:80] if title else f"p{page_start}"
    chapter = {
        "manual_id": manual_id,
        "title": title or f"Page {page_start}",
        "slug": slug,
        "page_start": page_start,
        "page_end": page_end or page_start,
    }
    result = supabase.table("barry_v2_manual_chapters") \
        .insert(chapter) \
        .execute()
    return result.data[0]["id"] if result.data else None


def create_content_block(supabase, chapter_id, block):
    """Create a barry_v2_content_blocks entry."""
    content = {
        "chapter_id": chapter_id,
        "block_type": block["block_type"],
        "title": block.get("title", ""),
        "page_number": block.get("page_start"),
        "page_start": block.get("page_start"),
        "page_end": block.get("page_end"),
        "content_text": block["content_text"],
        "content_json": block.get("content_json", {}),
        "system_tags": [],
        "model_tags": [],
        "part_numbers": [],
        "is_primary": block.get("block_type") in ("procedure", "specification"),
        "extraction_quality": 0.70,
        "source_page_reference": f"p.{block.get('page_start', '?')}",
    }
    result = supabase.table("barry_v2_content_blocks") \
        .insert(content) \
        .execute()
    return result.data[0]["id"] if result.data else None


def import_extraction(supabase, json_path, dry_run=True):
    """Import a single extraction JSON into the database."""
    print(f"\n{'='*60}")
    print(f"IMPORTING: {json_path}")
    print(f"{'='*60}")

    with open(json_path) as f:
        data = json.load(f)

    filename = data["source"]
    summary = data["summary"]
    blocks = data["content_blocks"]
    diagrams = data["diagrams_found"]

    print(f"  Source:     {filename}")
    print(f"  Pages:      {data['total_pages']}")
    print(f"  Blocks:     {summary['total_blocks']}")
    print(f"  Diagrams:   {diagrams}")
    print(f"  Types:      {summary.get('type_counts', {})}")

    if dry_run:
        print("  [DRY RUN — no changes made]")
        return

    if not supabase:
        print("  ERROR: No Supabase connection. Set SUPABASE_SERVICE_ROLE_KEY.")
        return

    # Find or create source document
    source_doc = find_source_document(supabase, filename.replace(".pdf", ""))
    if source_doc:
        print(f"  Source doc: {source_doc['normalized_title']} ({source_doc['id']})")
    else:
        print(f"  WARNING: No source document found for '{filename}'")
        print(f"  Create it first via barry_v2_source_documents INSERT")

    # Create manual record
    manual_id = create_manual(
        supabase, source_doc["id"] if source_doc else None,
        filename, data.get("source", filename), data["total_pages"]
    )
    if not manual_id:
        print("  ERROR: Failed to create manual record")
        return
    print(f"  Manual ID:  {manual_id}")

    # Create a single chapter for the whole document (pilot simplicity)
    chapter_id = create_chapter(supabase, manual_id, filename, 1, data["total_pages"])
    if not chapter_id:
        print("  ERROR: Failed to create chapter record")
        return
    print(f"  Chapter ID: {chapter_id}")

    # Insert content blocks in batches
    batch_size = 50
    inserted = 0
    for i in range(0, len(blocks), batch_size):
        batch = blocks[i:i+batch_size]
        for block in batch:
            block_id = create_content_block(supabase, chapter_id, block)
            if block_id:
                inserted += 1

        if (i + batch_size) % 100 == 0 or (i + batch_size) >= len(blocks):
            print(f"  Inserted: {inserted}/{len(blocks)} blocks")

    print(f"  Done: {inserted} content blocks inserted")


def main():
    parser = argparse.ArgumentParser(description="Barry v2 Pilot Data Importer")
    parser.add_argument("json_path", nargs="?", help="Path to extraction JSON file")
    parser.add_argument("--dry-run", action="store_true", default=True,
                        help="Preview without importing (default: true)")
    parser.add_argument("--apply", action="store_true",
                        help="Actually import (requires SUPABASE_SERVICE_ROLE_KEY)")

    args = parser.parse_args()
    dry_run = not args.apply

    supabase = connect_supabase()

    if args.json_path:
        import_extraction(supabase, args.json_path, dry_run)
    else:
        # Import all pilot extractions
        pilot_dir = Path("docs/pilot-extraction")
        if not pilot_dir.exists():
            print(f"ERROR: Pilot extraction directory not found: {pilot_dir}")
            print("Run scripts/extract-barry-v2-pilot.py --pilot-only first.")
            sys.exit(1)

        json_files = sorted(pilot_dir.glob("*_extraction.json"))
        if not json_files:
            print(f"ERROR: No extraction JSON files found in {pilot_dir}")
            sys.exit(1)

        print(f"Found {len(json_files)} extraction files")
        for jf in json_files:
            import_extraction(supabase, str(jf), dry_run)

    if dry_run:
        print(f"\n{'='*60}")
        print("DRY RUN complete. Use --apply to actually import.")
        print(f"{'='*60}")


if __name__ == "__main__":
    main()
