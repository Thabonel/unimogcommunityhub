#!/usr/bin/env python3
"""
Barry v2 Phase 2: Hybrid Extraction Pipeline
Extracts structured content from PDFs using pymupdf for good-text pages
and GPT-4o Vision for poor/table-heavy pages.

Usage:
    python3 scripts/extract-barry-v2-hybrid.py <pdf-path> [--output <dir>] [--batch]
    
Requires OPENAI_API_KEY env var for GPT-4o Vision OCR.
"""

import json, os, sys, re, base64, io, time, argparse
from pathlib import Path
from collections import defaultdict

try:
    import fitz
except ImportError:
    print("ERROR: PyMuPDF not found. Activate venv: source scripts/rps/venv/bin/activate")
    sys.exit(1)

try:
    from openai import OpenAI
except ImportError:
    OpenAI = None
    print("WARNING: openai not installed. Install: pip install openai (optional for pymupdf-only mode)")

QUALITY_PATH = "docs/quality-assessment/quality_assessment.json"
OUTPUT_DIR = "docs/extraction"

ALPHA_RE = re.compile(r'[a-zA-Z]')
SPEC_UNITS_RE = re.compile(r'(?:Nm|kgm|kpm|bar|psi|mm|cm|L|V|A|MPa|kPa|RPM|kg|N|kN|Mn|Ncm|°C)', re.IGNORECASE)
PART_RE = re.compile(r'\b[A-Z]\s\d{3}\s\d{3}\s\d{2}\s\d{2}\b')
WARNING_RE = re.compile(r'(WARNING|CAUTION|ACHTUNG|VORSICHT|DANGER|HINWEIS)', re.IGNORECASE)
ACTION_RE = re.compile(r'(remove|install|disconnect|connect|tighten|loosen|check|inspect|adjust|replace|clean|apply|fill|drain|turn|pull|push|slide|insert|lift|ausbauen|einbauen|lösen|anziehen|prüfen|einstellen)', re.IGNORECASE)

client = None
if OpenAI is not None:
    try:
        _key = os.environ.get("OPENAI_API_KEY")
        if _key:
            client = OpenAI(api_key=_key)
    except Exception as e:
        print(f"GPT-4o Vision init warning: {e}")
if not client:
    print("GPT-4o Vision not available — pymupdf only")


def classify_block(text, prev_heading=""):
    """Classify text into content block type."""
    if not text or len(text.strip()) < 5:
        return 'explanation'
    t = text.strip()

    if WARNING_RE.search(t):
        return 'warning'

    lines = [l.strip() for l in t.split('\n') if l.strip()]
    if not lines:
        return 'explanation'

    numbered_steps = sum(1 for l in lines if re.match(r'^\d+[.)]\s+', l))
    bullet_steps = sum(1 for l in lines if re.match(r'^[-•]\s+', l))
    action_lines = sum(1 for l in lines if ACTION_RE.search(l))
    has_procedure = numbered_steps > 2 or (bullet_steps > 1 and action_lines > 2)
    if has_procedure:
        return 'procedure'

    spec_lines = sum(1 for l in lines if SPEC_UNITS_RE.search(l) and bool(re.search(r'\d', l)))
    spec_ratio = spec_lines / len(lines) if lines else 0
    if spec_ratio > 0.35 and len(lines) > 2:
        return 'specification'

    parts = PART_RE.findall(t)
    if len(parts) > 1:
        return 'parts_list'

    return 'explanation'


def page_to_base64(page):
    """Render a PDF page as a base64 PNG image."""
    pix = page.get_pixmap(dpi=200)
    img_bytes = pix.tobytes("png")
    return base64.b64encode(img_bytes).decode("utf-8")


def ocr_page_with_gpt4o(page, page_num):
    """Send a page image to GPT-4o Vision for OCR."""
    b64 = page_to_base64(page)

    prompt = (
        "Extract ALL text from this technical manual page exactly as written. "
        "Preserve table structure using pipe (|) separators. "
        "Identify headings on their own lines. "
        "Include all numbers, measurements, and technical specifications. "
        "If the page is mostly a diagram or illustration, describe what it shows "
        "and include any labels or callout numbers. "
        "Output ONLY the extracted text, no explanations."
    )

    try:
        response = client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {
                    "role": "user",
                    "content": [
                        {"type": "text", "text": prompt},
                        {"type": "image_url", "image_url": {"url": f"data:image/png;base64,{b64}", "detail": "high"}},
                    ],
                }
            ],
            max_tokens=4000,
            temperature=0.0,
        )
        text = response.choices[0].message.content.strip()
        return text, response.usage
    except Exception as e:
        print(f"    GPT-4o Vision error on page {page_num}: {e}")
        return "", None


def extract_page_pymupdf(page, page_num):
    """Extract text, images, and tables from a page using pymupdf."""
    result = {
        "page_num": page_num,
        "text": "",
        "text_length": 0,
        "alpha_ratio": 0.0,
        "image_count": 0,
        "images": [],
        "tables": [],
        "quality": "unknown",
        "source": "pymupdf",
    }

    # Text
    text = page.get_text("text")
    if text.strip():
        result["text"] = text.strip()
        result["text_length"] = len(result["text"])
        alpha = len(ALPHA_RE.findall(text))
        total = sum(1 for c in text if c.isprintable() and not c.isspace())
        result["alpha_ratio"] = round(alpha / total, 3) if total > 0 else 0

    # Images
    blocks = page.get_text("dict")["blocks"]
    images = [b for b in blocks if b["type"] == 1]
    result["image_count"] = len(images)
    for img in images:
        bbox = img.get("bbox", [0, 0, 0, 0])
        result["images"].append({
            "x": round(bbox[0], 1), "y": round(bbox[1], 1),
            "w": round(bbox[2] - bbox[0], 1), "h": round(bbox[3] - bbox[1], 1),
        })

    # Tables
    try:
        tabs = page.find_tables()
        if tabs and tabs.tables:
            for t in tabs.tables:
                data = t.extract()
                if data and len(data) > 1:
                    result["tables"].append({
                        "rows": len(data),
                        "cols": len(data[0]) if data else 0,
                        "data": data,
                    })
    except Exception:
        pass

    return result


def extract_pdf_hybrid(pdf_path, canonical_id=None, normalized_title=None, quality_data=None):
    """Extract structured content using hybrid pymupdf + GPT-4o Vision approach."""
    pdf_path = Path(pdf_path)
    print(f"\nExtracting: {pdf_path.name}")

    doc = fitz.open(str(pdf_path))
    total_pages = doc.page_count
    print(f"  Pages: {total_pages}")

    # Load per-page quality if available
    page_quality = {}
    if quality_data:
        for f in quality_data.get("files", []):
            if f.get("canonical_id") == canonical_id or pdf_path.name in f.get("file_path", ""):
                for p in f.get("pages", []):
                    page_quality[p["page_num"]] = p["quality"]
                break

    result = {
        "source": pdf_path.name,
        "source_path": str(pdf_path.absolute()),
        "canonical_id": canonical_id,
        "normalized_title": normalized_title,
        "total_pages": total_pages,
        "pages": [],
        "content_blocks": [],
        "summary": {},
    }

    total_gpt4o = 0
    total_tokens = 0
    total_cost = 0.0

    for i in range(total_pages):
        page = doc[i]
        page_num = i + 1
        quality = page_quality.get(page_num, "good")

        # Extract with pymupdf
        p_result = extract_page_pymupdf(page, page_num)
        p_result["quality"] = quality

        # If page needs OCR, use GPT-4o Vision
        if quality in ("poor", "image_only", "empty") and client is not None and getattr(client, 'api_key', None):
            print(f"  Page {page_num}/{total_pages} [{quality}] → GPT-4o Vision OCR...", end=" ", flush=True)
            gpt4o_text, usage = ocr_page_with_gpt4o(page, page_num)
            if gpt4o_text:
                p_result["text"] = gpt4o_text
                p_result["text_length"] = len(gpt4o_text)
                p_result["source"] = "gpt4o_vision"
                total_gpt4o += 1
                if usage:
                    total_tokens += usage.total_tokens if hasattr(usage, 'total_tokens') else 0
                    # GPT-4o: $2.50/1M input + $10/1M output tokens (image ~1000 tokens)
                    input_tokens = usage.prompt_tokens if hasattr(usage, 'prompt_tokens') else 1000
                    output_tokens = usage.completion_tokens if hasattr(usage, 'completion_tokens') else 500
                    page_cost = (input_tokens * 2.50 + output_tokens * 10.0) / 1_000_000
                    total_cost += page_cost
                print("done")
            else:
                print("failed")
        else:
            print(f"  Page {page_num}/{total_pages} [{quality}] → pymupdf", end="\r", flush=True)

        result["pages"].append(p_result)

    doc.close()

    # Build content blocks from page text
    current_text = ""
    current_heading = ""
    current_start = 1
    blocks = []

    for p in result["pages"]:
        page_num = p["page_num"]
        text = p.get("text", "")

        if not text.strip():
            if current_text:
                blocks.append({
                    "block_type": classify_block(current_text, current_heading),
                    "title": current_heading,
                    "page_start": current_start,
                    "page_end": page_num - 1,
                    "content_text": current_text.strip(),
                    "content_json": {},
                })
                current_text = ""
                current_heading = ""
                current_start = page_num + 1
            continue

        # Simple heuristic: pages with very different content start new blocks
        # For simplicity, one block per page in the initial extraction
        block_type = classify_block(text, current_heading)
        blocks.append({
            "block_type": block_type,
            "title": current_heading if current_heading else f"Page {page_num}",
            "page_start": page_num,
            "page_end": page_num,
            "content_text": text.strip(),
            "content_json": {},
        })

    result["content_blocks"] = blocks

    # Summary
    type_counts = defaultdict(int)
    for b in blocks:
        type_counts[b["block_type"]] += 1

    total_chars = sum(p.get("text_length", 0) for p in result["pages"])
    total_images = sum(p.get("image_count", 0) for p in result["pages"])
    total_tables = sum(len(p.get("tables", [])) for p in result["pages"])

    result["summary"] = {
        "total_blocks": len(blocks),
        "total_chars": total_chars,
        "total_images": total_images,
        "total_tables": total_tables,
        "gpt4o_pages": total_gpt4o,
        "gpt4o_tokens": total_tokens,
        "gpt4o_cost": round(total_cost, 4),
        "type_counts": dict(type_counts),
    }

    return result


def main():
    parser = argparse.ArgumentParser(description="Barry v2 Hybrid Extraction Pipeline")
    parser.add_argument("pdf_path", nargs="?", help="Path to PDF file")
    parser.add_argument("--output", "-o", default=OUTPUT_DIR, help="Output directory")
    parser.add_argument("--batch", action="store_true", help="Run on all 71 extraction-ready PDFs")
    args = parser.parse_args()

    # Load quality data
    quality_data = None
    if os.path.exists(QUALITY_PATH):
        with open(QUALITY_PATH) as f:
            quality_data = json.load(f)
        print(f"Loaded quality assessment: {quality_data.get('total_pages', 0)} pages, "
              f"{quality_data.get('total_needs_ocr', 0)} need OCR")

    if client is None or not getattr(client, 'api_key', None):
        print("WARNING: OPENAI_API_KEY not set — OCR-dependent pages will have low-quality text.")

    output_dir = Path(args.output)
    output_dir.mkdir(parents=True, exist_ok=True)

    if args.batch:
        # Process all extraction-ready PDFs
        with open("docs/BARRY_V2_CANONICAL_MANUAL_REGISTRY.json") as f:
            registry = json.load(f)
        ready = [r for r in registry.get("records", [])
                 if r.get("use_for_extraction") and r.get("canonical_path") and os.path.exists(r["canonical_path"])]
        print(f"Batch processing {len(ready)} PDFs")

        total_pages = 0
        total_cost = 0.0
        total_gpt4o = 0
        total_blocks = 0

        for i, record in enumerate(ready):
            title = record["normalized_title"]
            path = record["canonical_path"]
            print(f"\n[{i+1}/{len(ready)}] {title}")

            result = extract_pdf_hybrid(path, record.get("canonical_id"), title, quality_data)
            if result:
                out_path = output_dir / f"{title}_extraction.json"
                with open(out_path, "w") as f:
                    json.dump(result, f, indent=2, default=str)

                s = result["summary"]
                total_pages += result["total_pages"]
                total_cost += s["gpt4o_cost"]
                total_gpt4o += s["gpt4o_pages"]
                total_blocks += s["total_blocks"]

                print(f"  → {s['total_blocks']} blocks, {s['gpt4o_pages']} OCR pages, ${s['gpt4o_cost']:.4f}")

            time.sleep(0.5)  # Rate limit

        print(f"\n{'='*60}")
        print(f"BATCH COMPLETE")
        print(f"{'='*60}")
        print(f"PDFs processed: {len(ready)}")
        print(f"Total pages:    {total_pages}")
        print(f"Total blocks:   {total_blocks}")
        print(f"GPT-4o pages:   {total_gpt4o}")
        print(f"Total cost:     ${total_cost:.2f}")

    elif args.pdf_path:
        result = extract_pdf_hybrid(args.pdf_path, quality_data=quality_data)
        if result:
            out_path = output_dir / f"{Path(args.pdf_path).stem}_extraction.json"
            with open(out_path, "w") as f:
                json.dump(result, f, indent=2, default=str)
            print(f"\nSaved: {out_path}")
            s = result["summary"]
            print(f"Blocks: {s['total_blocks']}, OCR pages: {s['gpt4o_pages']}, Cost: ${s['gpt4o_cost']:.4f}")
    else:
        parser.print_help()


if __name__ == "__main__":
    main()
