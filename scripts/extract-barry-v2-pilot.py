#!/usr/bin/env python3
"""
Barry v2 Pilot PDF Extraction Script
Uses PyMuPDF (fitz) for structured content extraction.
Outputs JSON suitable for import into barry_v2_content_blocks.

Usage:
    python3 scripts/extract-barry-v2-pilot.py <pdf-path> [--output <dir>] [--pilot-only]

Pilot PDFs:
    1. u435-maint-00-specifications  (table/spec extraction)
    2. 42-brakes-hydraulic-mechanical (procedure + spec)
    3. u435-02-engine-overview        (diagram + text)
"""

import json, os, sys, re, argparse
from pathlib import Path
from collections import defaultdict

try:
    import fitz
except ImportError:
    print("ERROR: PyMuPDF not found. Activate the rps venv:")
    print("  source scripts/rps/venv/bin/activate")
    sys.exit(1)


# ---- Helpers ----
TOP_HEADING_FONTS = {'helvetica-bold', 'helvetica-boldoblique', 'times-bold', 'times-bolditalic',
                     'courier-bold', 'courier-boldoblique', 'f39', 'f41', 'f45', 'f47', 'f49',
                     'cib', 'cbo', 'ti-b', 'ti-bi', 'co-b', 'co-bo'}

def font_is_heading(fontname, size, max_size_on_page):
    fn = (fontname or '').lower().replace(' ', '')
    size_ratio = size / max_size_on_page if max_size_on_page > 0 else 0
    is_large = size_ratio > 0.6
    is_bold = any(b in fn for b in ['bold', 'black', 'heavy', 'demi'])
    return is_large or is_bold

def font_is_body(fontname, size, max_size_on_page):
    fn = (fontname or '').lower().replace(' ', '')
    size_ratio = size / max_size_on_page if max_size_on_page > 0 else 0
    return size_ratio < 0.75 and not any(b in fn for b in ['bold', 'black', 'heavy', 'demi'])

def clean_text(text):
    if not text:
        return ""
    text = re.sub(r'\s+', ' ', text).strip()
    text = re.sub(r'[ \t]+', ' ', text)
    return text

def is_heading_like(text):
    if not text or len(text) < 2:
        return False
    # All caps heading
    if text.isupper() and len(text) > 3:
        return True
    # Numbered heading like "3.1 Cylinder Head"
    if re.match(r'^\d+(\.\d+)+\s+[A-Z]', text):
        return True
    # Short bold-like text
    if len(text) < 80 and text[0].isupper():
        return True
    return False

def is_warning(text):
    t = text.upper()
    return any(w in t for w in ['WARNING', 'CAUTION', 'ACHTUNG', 'VORSICHT', 'DANGER', 'HINWEIS'])

def is_spec_line(text):
    t = text.lower()
    spec_units = ['nm', 'kgm', 'kpm', 'bar', 'psi', 'mm', 'cm', 'l', 'v', 'a', '°c',
                  'mpa', 'kpa', 'rpm', 'kg', 'n', 'kn', 'mn', 'mbar', 'ncm']
    has_unit = any(u in t for u in spec_units)
    has_number = bool(re.search(r'\d+[.,]?\d*', t))
    return has_unit and has_number

def is_table_like(lines):
    """Heuristic: multiple lines with consistent column alignment"""
    if len(lines) < 3:
        return False
    tab_chars = sum(line.count('\t') for line in lines)
    space_splits = [len(line.split()) for line in lines if line.strip()]
    if not space_splits:
        return False
    avg_splits = sum(space_splits) / len(space_splits)
    return tab_chars > 5 or avg_splits > 4

def classify_block(text, prev_heading="", page_num=0):
    """Classify a text block into a barry_v2 content block type."""
    if not text or len(text.strip()) < 5:
        return 'explanation'

    t = text.strip()
    t_upper = t.upper()

    if is_warning(t):
        return 'warning'

    # Procedure detection — check for step-by-step structure FIRST
    step_markers = re.findall(r'^\s*\d+[.)]\s+', t, re.MULTILINE)
    has_numbered_steps = len(step_markers) > 2
    has_bullet_steps = len(re.findall(r'^\s*[-•]\s+', t, re.MULTILINE)) > 2
    has_action_words = any(w in t.lower() for w in [
        'remove', 'install', 'disconnect', 'connect', 'tighten', 'loosen',
        'check', 'inspect', 'adjust', 'replace', 'clean', 'apply', 'fill',
        'drain', 'turn', 'pull', 'push', 'slide', 'insert', 'lift',
        'ausbauen', 'einbauen', 'lösen', 'anziehen', 'prüfen', 'einstellen'
    ])

    if has_numbered_steps or (has_action_words and has_bullet_steps):
        return 'procedure'

    # Spec detection — only if NOT a procedure
    # Count spec-like lines vs total lines
    lines = [l.strip() for l in t.split('\n') if l.strip()]
    if lines:
        spec_lines = sum(1 for l in lines if is_spec_line(l))
        spec_ratio = spec_lines / len(lines)
        if spec_ratio > 0.4 and len(lines) > 2:
            return 'specification'

    # Check for part number patterns
    part_pattern = re.findall(r'\b[A-Z]\s\d{3}\s\d{3}\s\d{2}\s\d{2}\b', t)
    if len(part_pattern) > 1:
        return 'parts_list'

    if is_heading_like(t):
        return 'explanation'

    return 'explanation'


def extract_printed_page_number(page):
    """
    Try to find the printed page number on a page by looking at bottom margin text.
    Returns None if uncertain.
    """
    blocks = page.get_text("dict")["blocks"]
    margin_texts = []

    for b in blocks:
        if b.get("type") == 0:  # text block
            for line in b.get("lines", []):
                bbox = line.get("bbox", (0, 0, 0, 0))
                y = bbox[1]
                # Bottom 8% of page
                if y > page.rect.height * 0.85:
                    text = clean_text("".join(
                        span.get("text", "") for span in line.get("spans", [])
                    ))
                    if text and text.strip().isdigit():
                        margin_texts.append((y, int(text.strip())))

    if margin_texts:
        # Take the closest to the bottom
        margin_texts.sort(key=lambda x: -x[0])
        return margin_texts[0][1]
    return None


def extract_pilot_pdf(pdf_path, output_dir=None):
    """Extract structured content from a single PDF for pilot review."""
    pdf_path = Path(pdf_path)
    if not pdf_path.exists():
        print(f"ERROR: File not found: {pdf_path}")
        return None

    print(f"Extracting: {pdf_path.name} ({pdf_path.stat().st_size / 1024 / 1024:.1f} MB)")

    doc = fitz.open(str(pdf_path))
    pages_total = doc.page_count
    print(f"  Total pages: {pages_total}")

    # Build full-text content blocks per chapter/section
    result = {
        "source": pdf_path.name,
        "source_path": str(pdf_path.absolute()),
        "total_pages": pages_total,
        "has_text": False,
        "chapters": [],
        "content_blocks": [],
        "specifications": [],
        "warnings": [],
        "diagrams_found": 0,
        "page_numbers": {},
        "error": None
    }

    current_heading = ""
    current_text = ""
    current_start_page = 1
    block_id = 0
    all_text = ""

    for page_num in range(pages_total):
        page = doc[page_num]
        page_index = page_num + 1  # 1-based

        # Try to determine printed page number
        printed_num = extract_printed_page_number(page)
        if printed_num:
            result["page_numbers"][page_index] = printed_num

        # Extract text blocks
        text_dict = page.get_text("dict")
        page_text = ""
        max_font_size = 0

        for b in text_dict.get("blocks", []):
            if b.get("type") == 0:  # text
                for line in b.get("lines", []):
                    for span in line.get("spans", []):
                        size = span.get("size", 0)
                        if size > max_font_size:
                            max_font_size = size

        page_heading = ""
        for b in text_dict.get("blocks", []):
            if b.get("type") == 0:
                for line in b.get("lines", []):
                    line_text = ""
                    font_name = ""
                    font_size = 0
                    for span in line.get("spans", []):
                        line_text += span.get("text", "")
                        font_name = span.get("font", "")
                        font_size = span.get("size", 0)

                    line_text = clean_text(line_text)
                    if not line_text:
                        continue

                    all_text += line_text + " "
                    page_text += line_text + "\n"

                    # Detect headings
                    if font_is_heading(font_name, font_size, max_font_size) and len(line_text) > 2:
                        candidate = line_text.rstrip(':')
                        if len(candidate) < 120:
                            page_heading = candidate

            elif b.get("type") == 1:  # image
                result["diagrams_found"] += 1
                img = b
                img_info = {
                    "page": page_index,
                    "width": img.get("width", 0),
                    "height": img.get("height", 0),
                    "x": img.get("bbox", [0,0,0,0])[0],
                    "y": img.get("bbox", [0,0,0,0])[1],
                }
                # Check if image has text references nearby
                img_bbox = img.get("bbox", [0,0,0,0])
                near_text = ""
                for b2 in text_dict.get("blocks", []):
                    if b2.get("type") == 0:
                        b2_bbox = b2.get("bbox", [0,0,0,0])
                        # Within 50px vertically of the image
                        if abs(b2_bbox[1] - img_bbox[3]) < 50 or abs(b2_bbox[3] - img_bbox[1]) < 50:
                            for l in b2.get("lines", []):
                                for s in l.get("spans", []):
                                    near_text += s.get("text", "")
                    near_text = clean_text(near_text)[:200]
                    if near_text:
                        img_info["caption"] = near_text

        # Check if page has text
        if clean_text(page_text):
            result["has_text"] = True

        # Try to extract tables
        tables = []
        try:
            tabs = page.find_tables()
            if tabs and tabs.tables:
                for table in tabs.tables:
                    table_data = []
                    for row in table.extract():
                        cleaned = [clean_text(str(c)) if c else "" for c in row]
                        table_data.append(cleaned)
                    if len(table_data) > 1:  # header + at least 1 row
                        tables.append({
                            "page": page_index,
                            "rows": len(table_data),
                            "cols": len(table_data[0]) if table_data else 0,
                            "data": table_data
                        })
        except Exception as e:
            pass  # table detection may fail on some PDFs

        # Handle heading change
        if page_heading and page_heading != current_heading:
            if current_text.strip():
                block_type = classify_block(current_text.strip(), current_heading, current_start_page)
                block = {
                    "id": block_id,
                    "block_type": block_type,
                    "title": current_heading,
                    "page_start": current_start_page,
                    "page_end": page_index - 1 if page_index > current_start_page else current_start_page,
                    "content_text": current_text.strip(),
                    "content_json": {},
                }
                if block_type == 'specification':
                    result["specifications"].append(block)
                if block_type == 'warning':
                    result["warnings"].append(block)
                result["content_blocks"].append(block)
                block_id += 1

            current_heading = page_heading
            current_text = ""
            current_start_page = page_index

        current_text += page_text + "\n"

        # Add table info to page_text
        for t in tables:
            table_text = "\n".join([" | ".join(row) for row in t["data"]])
            # Don't duplicate table text that's already in page_text

        # Print progress
        if page_index % 50 == 0 or page_index == pages_total:
            print(f"  Page {page_index}/{pages_total}... (blocks: {block_id}, diagrams: {result['diagrams_found']})")

    # Save last block
    if current_text.strip():
        block_type = classify_block(current_text.strip(), current_heading, current_start_page)
        block = {
            "id": block_id,
            "block_type": block_type,
            "title": current_heading,
            "page_start": current_start_page,
            "page_end": pages_total,
            "content_text": current_text.strip(),
            "content_json": {},
        }
        if block_type == 'specification':
            result["specifications"].append(block)
        if block_type == 'warning':
            result["warnings"].append(block)
        result["content_blocks"].append(block)

    doc.close()

    # Summary
    result["summary"] = {
        "total_blocks": len(result["content_blocks"]),
        "specifications": len(result["specifications"]),
        "warnings": len(result["warnings"]),
        "diagrams": result["diagrams_found"],
        "total_chars": len(all_text),
        "text_extracted": result["has_text"],
    }

    # Stats by type
    type_counts = defaultdict(int)
    for b in result["content_blocks"]:
        type_counts[b["block_type"]] += 1
    result["summary"]["type_counts"] = dict(type_counts)

    # Save
    if output_dir:
        out_path = Path(output_dir) / f"{pdf_path.stem}_extraction.json"
        out_path.parent.mkdir(parents=True, exist_ok=True)
        with open(out_path, 'w') as f:
            json.dump(result, f, indent=2, default=str)
        print(f"\nSaved to: {out_path}")

    return result


def print_summary(result):
    """Print a human-readable summary of extraction results."""
    if not result:
        return
    s = result.get("summary", {})
    print(f"\n{'='*60}")
    print(f"EXTRACTION SUMMARY: {result['source']}")
    print(f"{'='*60}")
    print(f"  Pages:          {result['total_pages']}")
    print(f"  Text extracted: {result['has_text']}")
    print(f"  Total chars:    {s.get('total_chars', 0):,}")
    print(f"  Content blocks: {s.get('total_blocks', 0)}")
    print(f"  Diagrams:       {s.get('diagrams', 0)}")
    print(f"  By type:        {s.get('type_counts', {})}")
    print(f"  Page numbers:   {len(result.get('page_numbers', {}))} detected")
    print(f"{'='*60}")

    # Show first few blocks
    print("\nFirst 5 blocks:")
    for b in result["content_blocks"][:5]:
        text_preview = b.get("content_text", "")[:120].replace('\n', ' | ')
        print(f"  [{b['id']}] {b['block_type']:15s} p.{b['page_start']} \"{b.get('title','')[:60]}\"")
        print(f"       {text_preview}")

    if result["specifications"]:
        print(f"\nSpec blocks: {len(result['specifications'])}")
    if result["warnings"]:
        print(f"\nWarnings found: {len(result['warnings'])}")


# ---- Main ----
def main():
    parser = argparse.ArgumentParser(description="Barry v2 Pilot PDF Extraction")
    parser.add_argument("pdf_path", nargs="?", help="Path to PDF file")
    parser.add_argument("--output", "-o", default="docs/pilot-extraction",
                        help="Output directory for JSON results")
    parser.add_argument("--pilot-only", action="store_true",
                        help="Run on the 3 pilot PDFs")
    parser.add_argument("--summary", action="store_true",
                        help="Print summary of last extraction only")

    args = parser.parse_args()

    output_dir = Path(args.output)
    output_dir.mkdir(parents=True, exist_ok=True)

    if args.pilot_only:
        # Look up pilot PDFs from canonical registry
        reg_path = Path("docs/BARRY_V2_CANONICAL_MANUAL_REGISTRY.json")
        if not reg_path.exists():
            print("ERROR: Canonical registry not found at docs/BARRY_V2_CANONICAL_MANUAL_REGISTRY.json")
            sys.exit(1)

        with open(reg_path) as f:
            registry = json.load(f)

        pilot_titles = [
            "42-brakes-hydraulic-mechanical",
            "u435-maint-00-specifications",
            "u435-02-engine-overview",
        ]

        pdfs_to_extract = []
        for title in pilot_titles:
            match = next((r for r in registry.get("records", [])
                         if r.get("normalized_title") == title and r.get("use_for_extraction")), None)
            if match and match.get("canonical_path"):
                pdfs_to_extract.append((title, match["canonical_path"]))
            else:
                print(f"WARNING: Pilot candidate '{title}' not found or has no path in registry")

        if not pdfs_to_extract:
            print("ERROR: No pilot PDFs found in registry")
            sys.exit(1)

        print(f"Extracting {len(pdfs_to_extract)} pilot PDFs:\n")
        for title, path in pdfs_to_extract:
            print(f"  [{title}] {path}")

        for title, path in pdfs_to_extract:
            result = extract_pilot_pdf(path, output_dir)
            if result:
                print_summary(result)
                print()

    elif args.pdf_path:
        result = extract_pilot_pdf(args.pdf_path, output_dir)
        if result:
            print_summary(result)
    else:
        parser.print_help()
        print("\nProvide a PDF path or use --pilot-only to extract pilot PDFs.")


if __name__ == "__main__":
    main()
