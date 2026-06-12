#!/usr/bin/env python3
"""
Barry v2 Phase 2: Media Extraction Pipeline
Extracts images/diagrams from PDFs as PNG files, classifies them,
and generates SQL to link them to content blocks.

Usage:
    python3 scripts/extract-barry-v2-media.py [--pdf <path>] [--all] [--min-size 10000]
"""

import json, os, sys, hashlib, uuid, argparse
from pathlib import Path
from collections import defaultdict

try:
    import fitz
except ImportError:
    print("ERROR: PyMuPDF not found. Activate venv: source scripts/rps/venv/bin/activate")
    sys.exit(1)

REGISTRY_PATH = "docs/BARRY_V2_CANONICAL_MANUAL_REGISTRY.json"
EXTRACTION_DIR = "docs/extraction"
OUTPUT_DIR = "docs/media"
CHUNK_SIZE = 200 * 1024

# Skip the two duplicate 1185-page full manuals (chapters already extracted individually)
SKIP_LARGE_DUPLICATES = True
MAX_IMAGE_SIZE_MB = 5  # Skip images > 5MB (likely full-page renders, not diagrams)

MEDIA_TYPES = {
    "exploded_view": ["explod", "explosions", "aussenansicht", "spr", "assembly"],
    "diagram": ["schnitt", "section", "schema", "schalt", "diagram", "functional", "layout"],
    "photo": ["photo", "foto", "ansicht", "view", "abb", "fig", "bild"],
    "graph": ["graph", "chart", "kurve", "plot", "diagramm"],
}


def classify_image(caption, page_text, x, y, w, h):
    """Classify image type based on position, caption, and context."""
    if not caption:
        caption = ""
    caption_lower = caption.lower()

    # Large images spanning most of the page might be photos
    page_area = 595 * 842  # A4 at 72dpi
    img_area = w * h
    area_ratio = img_area / page_area if page_area > 0 else 0

    for mtype, keywords in MEDIA_TYPES.items():
        if any(k in caption_lower for k in keywords):
            return mtype

    # Position-based: bottom-right images are often photos
    if area_ratio > 0.6:
        return "photo"
    elif area_ratio > 0.3:
        return "diagram"
    else:
        return "diagram"


def extract_page_thumbnails(pdf_path, canonical_id, normalized_title):
    """Render each page as a JPEG thumbnail for display alongside search results."""
    pdf_path = Path(pdf_path)
    if not pdf_path.exists():
        print(f"  SKIP: File not found")
        return []

    doc = fitz.open(str(pdf_path))

    # Skip large duplicate manuals (1185-page U1700L — chapters already extracted individually)
    if doc.page_count > 200:
        title_check = (normalized_title or "").lower().replace("u1700l", "").replace("unimog435sm", "").replace("-", "")
        if not title_check.strip():
            print(f"  SKIP: Duplicate full manual ({doc.page_count} pages, chapters exist separately)")
            doc.close()
            return []

    total_pages = doc.page_count
    print(f"  Pages: {total_pages}")

    extracted = []
    pdf_name = pdf_path.stem

    for page_num in range(total_pages):
        page = doc[page_num]
        page_index = page_num + 1

        # Render at 72 DPI for compact thumbnails (~0.06MP)
        pix = page.get_pixmap(dpi=72)
        img_bytes = pix.tobytes("jpeg")

        filename = f"{pdf_name}_p{page_index:04d}_thumb.jpg"

        # Classify based on text/image ratio
        text = page.get_text("text")
        has_text = len(text.strip()) > 50
        has_images = len(page.get_images()) > 0

        if not has_text and has_images:
            media_type = "photo"
        elif has_text and has_images:
            media_type = "diagram"
        else:
            media_type = "page_render"

        # Extract caption from bottom text
        blocks = page.get_text("dict")["blocks"]
        caption = ""
        for b in reversed(blocks):
            if b.get("type") == 0:
                for line in b.get("lines", []):
                    for span in line.get("spans", []):
                        t = span.get("text", "").strip()
                        if t and (t.startswith("Bild") or t.startswith("Fig") or
                                  t.startswith("Abb") or t.startswith("Figure")):
                            caption = t[:200]
                            break
                if caption:
                    break

        # Save JPEG
        out_dir = Path(OUTPUT_DIR) / "thumbnails" / pdf_name
        out_dir.mkdir(parents=True, exist_ok=True)
        out_path = out_dir / filename
        with open(out_path, "wb") as f:
            f.write(img_bytes)

        extracted.append({
            "filename": filename,
            "local_path": str(out_path),
            "source_pdf": pdf_path.name,
            "normalized_title": normalized_title,
            "canonical_id": canonical_id,
            "page_number": page_index,
            "media_type": media_type,
            "width": pix.width,
            "height": pix.height,
            "file_size_bytes": len(img_bytes),
            "caption": caption,
            "has_text": has_text,
        })

        if (page_index) % 50 == 0:
            pct = page_index * 100 // total_pages
            size_mb = sum(i["file_size_bytes"] for i in extracted) / 1024 / 1024
            print(f"    {pct}% ({page_index}/{total_pages}, {len(extracted)} pages, {size_mb:.0f}MB)")

    doc.close()
    return extracted


def main():
    parser = argparse.ArgumentParser(description="Barry v2 Media Extraction")
    parser.add_argument("--pdf", help="Single PDF path to process")
    parser.add_argument("--all", action="store_true", help="Process all extraction-ready PDFs")
    parser.add_argument("--min-size", type=int, default=20000, help="Minimum file size in bytes")
    args = parser.parse_args()

    output_dir = Path(OUTPUT_DIR)
    output_dir.mkdir(parents=True, exist_ok=True)
    thumb_dir = output_dir / "thumbnails"
    thumb_dir.mkdir(parents=True, exist_ok=True)

    with open(REGISTRY_PATH) as f:
        registry = json.load(f)

    if args.all:
        ready = [r for r in registry.get("records", [])
                 if r.get("use_for_extraction") and r.get("canonical_path") and os.path.exists(r["canonical_path"])]
        print(f"Rendering page thumbnails for {len(ready)} PDFs...")
        all_images = []
        for i, record in enumerate(ready):
            path = record["canonical_path"]
            cid = record.get("canonical_id")
            title = record.get("normalized_title", "")
            print(f"  [{i+1}/{len(ready)}] {title}...")
            images = extract_page_thumbnails(path, cid, title)
            all_images.extend(images)
            print(f"    -> {len(images)} page thumbnails")

        total_mb = sum(i["file_size_bytes"] for i in all_images) / 1024 / 1024
        print(f"\nTotal thumbnails: {len(all_images)} ({total_mb:.0f}MB)")

        # Save manifest
        manifest = {"total_images": len(all_images), "total_size_mb": round(total_mb, 1), "images": all_images}
        with open(output_dir / "media_manifest.json", "w") as f:
            json.dump(manifest, f, indent=2)
        print(f"Manifest: {output_dir / 'media_manifest.json'}")

        # Generate SQL
        sql_lines = [f"-- Barry v2 Media: {len(all_images)} thumbnails\nBEGIN;\n"]
        for img in all_images:
            media_id = str(uuid.UUID(hashlib.md5(f"media:{img['filename']}".encode()).hexdigest()))
            block_uuid = None
            # Try to find matching block UUID
            # Strategy 1: match by normalized_title from extraction file
            nt = img.get("normalized_title", "")
            if nt and Path(EXTRACTION_DIR, f"{nt}_extraction.json").exists():
                with open(Path(EXTRACTION_DIR, f"{nt}_extraction.json")) as f:
                    ext_data = json.load(f)
                for bi, block in enumerate(ext_data.get("content_blocks", [])):
                    if block.get("page_start") == img["page_number"]:
                        block_uuid = str(uuid.UUID(hashlib.md5(f"block:{nt}:{bi}".encode()).hexdigest()))
                        break

            # Strategy 2: try matching by source stem (pdf_name)
            if not block_uuid and img.get("source_pdf"):
                stem = Path(img["source_pdf"]).stem
                for ext_file in Path(EXTRACTION_DIR).glob(f"{stem}*.json"):
                    with open(ext_file) as f:
                        ext_data = json.load(f)
                    text_title = ext_data.get("normalized_title") or ext_data.get("source", "").replace(".pdf", "")
                    for bi, block in enumerate(ext_data.get("content_blocks", [])):
                        if block.get("page_start") == img["page_number"]:
                            block_uuid = str(uuid.UUID(hashlib.md5(f"block:{text_title}:{bi}".encode()).hexdigest()))
                            break
            bref = f"'{block_uuid}'" if block_uuid else "NULL"
            cap = (img.get("caption") or "").replace("'", "''")
            sql_lines.append(
                f"INSERT INTO barry_v2_content_media (id, block_id, media_type, storage_path, filename, "
                f"mime_type, caption, page_number, width, height, file_size_bytes) "
                f"VALUES ('{media_id}', {bref}::uuid, '{img['media_type']}', "
                f"'manual-images/thumbnails/{img['filename']}', '{img['filename']}', "
                f"'image/jpeg', '{cap}', {img['page_number']}, "
                f"{img['width']}, {img['height']}, {img['file_size_bytes']}) "
                f"ON CONFLICT (id) DO NOTHING;"
            )
        sql_lines.append("\nCOMMIT;")
        with open(output_dir / "media_import.sql", "w") as f:
            f.write("\n".join(sql_lines))
        print(f"SQL: {output_dir / 'media_import.sql'} ({len(all_images)} inserts)")

    elif args.pdf:
        images = extract_page_thumbnails(args.pdf, None, Path(args.pdf).stem)
        print(f"\nExtracted {len(images)} page thumbnails")
        total = sum(i["file_size_bytes"] for i in images) / 1024
        print(f"Total: {total:.0f}KB")
    else:
        parser.print_help()


if __name__ == "__main__":
    main()
