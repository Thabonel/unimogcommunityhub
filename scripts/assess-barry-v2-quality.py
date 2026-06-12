#!/usr/bin/env python3
"""
Barry v2 Phase 1: Quality Assessment
Analyzes all 71 extraction-ready PDFs for text quality, table detection, image content.
Outputs per-page quality scores and a summary report.

Usage:
    python3 scripts/assess-barry-v2-quality.py
"""

import json, os, sys, re
from pathlib import Path
from collections import defaultdict

try:
    import fitz
except ImportError:
    print("ERROR: PyMuPDF not found. Activate the rps venv:")
    print("  source scripts/rps/venv/bin/activate")
    sys.exit(1)


REGISTRY_PATH = "docs/BARRY_V2_CANONICAL_MANUAL_REGISTRY.json"
OUTPUT_DIR = "docs/quality-assessment"

ALPHA_RE = re.compile(r'[a-zA-Z]')
PRINTABLE_RE = re.compile(r'\S')
SPEC_UNITS = re.compile(r'(?:Nm|kgm|kpm|bar|psi|mm|cm|L|V|A|MPa|kPa|RPM|kg|N|kN|Mn|Ncm|°C)', re.IGNORECASE)

DIAGRAM_KEYWORDS = re.compile(
    r'(Bild|Abb|Fig|Figure|Illustration|Explosionszeichnung|Schnitt|Diagram|Sketch|Layout|Übersicht|View|Ansicht)',
    re.IGNORECASE
)


def assess_page(page):
    """Assess a single PDF page for text quality and content."""
    result = {
        "page_num": page.number + 1,
        "text_chars": 0,
        "alpha_chars": 0,
        "alpha_ratio": 0.0,
        "text_lines": 0,
        "image_count": 0,
        "tables_found": 0,
        "table_rows": 0,
        "has_diagram_caption": False,
        "diagram_caption": "",
        "quality": "unknown",
        "issues": [],
    }

    # Text extraction
    text = page.get_text("text")
    if text.strip():
        result["text_chars"] = len(text.strip())
        result["alpha_chars"] = len(ALPHA_RE.findall(text))
        total_printable = len(PRINTABLE_RE.findall(text))
        result["alpha_ratio"] = round(result["alpha_chars"] / total_printable, 3) if total_printable > 0 else 0
        result["text_lines"] = len([l for l in text.split('\n') if l.strip()])

    # Image detection
    blocks = page.get_text("dict")["blocks"]
    result["image_count"] = sum(1 for b in blocks if b["type"] == 1)

    # Table detection
    try:
        tables = page.find_tables()
        if tables and tables.tables:
            result["tables_found"] = len(tables.tables)
            for t in tables.tables:
                data = t.extract()
                result["table_rows"] += len(data) if data else 0
    except Exception:
        pass

    # Diagram caption detection
    for b in blocks:
        if b["type"] == 0:
            for line in b.get("lines", []):
                for span in line.get("spans", []):
                    text = span.get("text", "")
                    if DIAGRAM_KEYWORDS.search(text):
                        result["has_diagram_caption"] = True
                        result["diagram_caption"] = text.strip()[:200]
                        break

    # Quality classification
    if result["alpha_ratio"] >= 0.65 and result["text_chars"] > 50:
        result["quality"] = "good"
    elif result["alpha_ratio"] >= 0.40 and result["text_chars"] > 30:
        result["quality"] = "fair"
    elif result["text_chars"] > 0:
        result["quality"] = "poor"
    elif result["image_count"] > 0:
        result["quality"] = "image_only"
    else:
        result["quality"] = "empty"

    # Issues
    if result["text_chars"] == 0:
        result["issues"].append("no_text")
    if result["alpha_ratio"] < 0.4 and result["text_chars"] > 0:
        result["issues"].append("garbled_text")
    if result["tables_found"] > 0 and result["alpha_ratio"] < 0.6:
        result["issues"].append("table_garbled")

    return result


def assess_pdf(pdf_path, canonical_id, normalized_title):
    """Assess a single PDF and return per-page results."""
    if not os.path.exists(pdf_path):
        return {
            "canonical_id": canonical_id,
            "normalized_title": normalized_title,
            "error": f"File not found: {pdf_path}",
            "pages": [],
            "summary": {}
        }

    doc = fitz.open(pdf_path)
    total_pages = doc.page_count

    pages = []
    good = fair = poor = image_only = empty = 0
    total_images = 0
    total_tables = 0

    for i in range(total_pages):
        page = doc[i]
        p_result = assess_page(page)
        pages.append(p_result)

        q = p_result["quality"]
        if q == "good": good += 1
        elif q == "fair": fair += 1
        elif q == "poor": poor += 1
        elif q == "image_only": image_only += 1
        else: empty += 1

        total_images += p_result["image_count"]
        total_tables += p_result["tables_found"]

    doc.close()

    summary = {
        "canonical_id": canonical_id,
        "normalized_title": normalized_title,
        "total_pages": total_pages,
        "quality_counts": {"good": good, "fair": fair, "poor": poor, "image_only": image_only, "empty": empty},
        "total_images": total_images,
        "total_tables": total_tables,
        "avg_alpha_ratio": round(
            sum(p["alpha_ratio"] for p in pages) / total_pages, 3
        ) if total_pages > 0 else 0,
        "needs_ocr_pages": poor + image_only + empty,
        "estimated_gpt4o_cost": round((poor + image_only + empty) * 0.0075, 2),
    }

    return {
        "canonical_id": canonical_id,
        "normalized_title": normalized_title,
        "file_path": pdf_path,
        "total_pages": total_pages,
        "summary": summary,
        "pages": pages,
    }


def main():
    if not os.path.exists(REGISTRY_PATH):
        print(f"ERROR: Registry not found at {REGISTRY_PATH}")
        sys.exit(1)

    with open(REGISTRY_PATH) as f:
        registry = json.load(f)

    extraction_ready = [r for r in registry.get("records", [])
                        if r.get("use_for_extraction") and r.get("canonical_path")]

    if not extraction_ready:
        print("ERROR: No extraction-ready PDFs found in registry")
        sys.exit(1)

    print(f"Phase 1: Quality Assessment")
    print(f"{'='*60}")
    print(f"Scanning {len(extraction_ready)} extraction-ready PDFs...\n")

    # Verify files exist
    missing = [r for r in extraction_ready if not os.path.exists(r["canonical_path"])]
    if missing:
        print(f"WARNING: {len(missing)} PDFs not found on disk:")
        for m in missing[:10]:
            print(f"  - {m['normalized_title']}: {m['canonical_path']}")
        print()

    existing = [r for r in extraction_ready if os.path.exists(r["canonical_path"])]
    print(f"Found {len(existing)} PDFs on disk ({len(extraction_ready) - len(existing)} missing)")

    # Assess each PDF
    results = []
    totals = defaultdict(int)
    total_pages_all = 0
    total_needs_ocr = 0
    total_cost_estimate = 0.0

    os.makedirs(OUTPUT_DIR, exist_ok=True)

    for i, record in enumerate(existing):
        title = record["normalized_title"]
        path = record["canonical_path"]
        canonical_id = record["canonical_id"]

        print(f"  [{i+1}/{len(existing)}] {title}...", end=" ", flush=True)
        result = assess_pdf(path, canonical_id, title)
        results.append(result)

        s = result["summary"]
        print(f"{s['total_pages']}p good={s['quality_counts']['good']} fair={s['quality_counts']['fair']} "
              f"poor={s['quality_counts']['poor']} img={s['quality_counts']['image_only']} "
              f"tables={s['total_tables']} cost=${s['estimated_gpt4o_cost']:.2f}")

        for q, c in s["quality_counts"].items():
            totals[q] += c
        total_pages_all += s["total_pages"]
        total_needs_ocr += s["needs_ocr_pages"]
        total_cost_estimate += s["estimated_gpt4o_cost"]

    # Save per-file results
    output = {
        "assessment_date": "2026-06-12",
        "total_pdfs_assessed": len(existing),
        "total_pdfs_missing": len(missing),
        "total_pages": total_pages_all,
        "total_needs_ocr": total_needs_ocr,
        "estimated_gpt4o_cost_usd": round(total_cost_estimate, 2),
        "quality_totals": dict(totals),
        "files": results,
    }
    out_path = os.path.join(OUTPUT_DIR, "quality_assessment.json")
    with open(out_path, "w") as f:
        json.dump(output, f, indent=2, default=str)

    # Print report
    print(f"\n{'='*60}")
    print(f"QUALITY ASSESSMENT REPORT")
    print(f"{'='*60}")
    print(f"PDFs assessed:  {len(existing)}")
    print(f"PDFs missing:   {len(missing)}")
    print(f"Total pages:    {total_pages_all}")
    print(f"\nPage quality breakdown:")
    print(f"  Good text:    {totals['good']:5d} ({totals['good']/total_pages_all*100:.0f}%)")
    print(f"  Fair text:    {totals['fair']:5d} ({totals['fair']/total_pages_all*100:.0f}%)")
    print(f"  Poor text:    {totals['poor']:5d} ({totals['poor']/total_pages_all*100:.0f}%)")
    print(f"  Image only:   {totals['image_only']:5d} ({totals['image_only']/total_pages_all*100:.0f}%)")
    print(f"  Empty:        {totals['empty']:5d} ({totals['empty']/total_pages_all*100:.0f}%)")
    print(f"\nNeeds OCR:      {total_needs_ocr} pages")
    print(f"Estimated cost: ${total_cost_estimate:.2f} (GPT-4o Vision)")
    print(f"\nResults saved: {out_path}")

    return output


if __name__ == "__main__":
    main()
