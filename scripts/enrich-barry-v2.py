#!/usr/bin/env python3
"""
Barry v2 Phase 2: Enrichment Cross-Reference Resolver
Scans all extracted content blocks for part numbers, spec values,
page references, and tool references. Generates SQL to populate
barry_v2_specifications and barry_v2_content_block_rps_parts.

Usage:
    python3 scripts/enrich-barry-v2.py
"""

import json, os, re, uuid, hashlib
from pathlib import Path
from collections import defaultdict

EXTRACTION_DIR = "docs/extraction"
OUTPUT_DIR = "docs/enrichment"

# Unimog part number patterns
# A 667 203 00 15 (standard Mercedes pattern)
# Also: 000 543 76 10, N 304 105 008 002
PART_PATTERNS = [
    re.compile(r'\b[A-Z]\s\d{3}\s\d{3}\s\d{2}\s\d{2}\b'),      # A 667 203 00 15
    re.compile(r'\b\d{3}\s\d{3}\s\d{2}\s\d{2}\b'),              # 667 203 00 15
    re.compile(r'\b[A-Z]\d{3}\d{3}\d{2}\d{2}\b'),               # A6672030015
    re.compile(r'\b\d{7}\b'),                                     # 7-digit NSN-like
]

# Spec patterns: value + unit
SPEC_PATTERN = re.compile(
    r'(\d+[.,]?\d*)\s*(Nm|Ncm|kpm|kgm|bar|psi|MPa|kPa|mbar|'
    r'mm|cm|L|V|A|°C|°F|rpm|kg|N|kN|Ncm|N·m|'
    r'kg/cm²|kg/m³|g/cm³|m³|cm³)',
    re.IGNORECASE
)

# Torque spec patterns (more specific)
TORQUE_PATTERN = re.compile(
    r'(?:torque|tighten|anzugsmoment|anziehen|anzug|Nm|kpm)\s*'
    r'[:=]?\s*(\d+[.,]?\d*)\s*(?:Nm|kpm|kgm)?',
    re.IGNORECASE
)

# Page cross-reference patterns
PAGE_REF_PATTERN = re.compile(
    r'(?:see|siehe|refer to|page|seite|p\.|page\s*)\s*(\d+[./]?\d*)',
    re.IGNORECASE
)

# Tool reference patterns
TOOL_PATTERN = re.compile(
    r'(?:special\s+)?tool\s*(?:No\.|#|:)?\s*([A-Z0-9\-\.]+)',
    re.IGNORECASE
)


def find_part_numbers(text):
    """Extract Unimog part numbers from text."""
    parts = set()
    for pattern in PART_PATTERNS:
        for match in pattern.finditer(text):
            parts.add(match.group().strip().replace("  ", " "))
    return sorted(parts)


def find_specs(text):
    """Extract specification values from text."""
    specs = []
    for match in SPEC_PATTERN.finditer(text):
        raw_val = match.group(1).replace(",", ".")
        try:
            value = float(raw_val)
        except ValueError:
            continue
        unit = match.group(2)
        # Context: get surrounding text
        start = max(0, match.start() - 40)
        end = min(len(text), match.end() + 40)
        context = text[start:end].strip()
        specs.append({
            "value": value,
            "unit": unit,
            "context": context,
            "match": match.group(),
        })
    return specs


def find_torque_specs(text):
    """Extract torque specifications specifically."""
    torques = []
    for match in TORQUE_PATTERN.finditer(text):
        try:
            value = float(match.group(1).replace(",", "."))
            start = max(0, match.start() - 30)
            end = min(len(text), match.end() + 30)
            context = text[start:end].strip()
            torques.append({
                "value": value,
                "unit": "Nm",
                "context": context,
            })
        except ValueError:
            continue
    return torques


def find_page_refs(text):
    """Extract page cross-references."""
    refs = []
    for match in PAGE_REF_PATTERN.finditer(text):
        refs.append({
            "target_page": match.group(1),
            "context": text[max(0, match.start()-20):match.end()+20].strip(),
        })
    return refs


def find_tool_refs(text):
    """Extract tool references."""
    tools = []
    for match in TOOL_PATTERN.finditer(text):
        tools.append({
            "tool_id": match.group(1),
            "context": text[max(0, match.start()-10):match.end()+10].strip(),
        })
    return tools


def classify_spec_category(context, value, unit):
    """Classify a spec into a category."""
    cl = context.lower()
    if unit.lower() in ("nm", "ncm", "kpm", "kgm"):
        return "torque"
    if unit.lower() in ("bar", "psi", "mpa", "kpa", "mbar"):
        return "pressure"
    if unit.lower() in ("mm", "cm", "m"):
        if "gap" in cl or "clearance" in cl or "spiel" in cl:
            return "clearance"
        return "dimension"
    if unit.lower() in ("v", "a"):
        return "electrical"
    if unit.lower() in ("l", "cm³"):
        return "capacity"
    if unit.lower() in ("kg", "n"):
        return "weight_force"
    if unit.lower() in ("°c", "°f"):
        return "temperature"
    if any(w in cl for w in ["torque", "tighten", "anzug"]):
        return "torque"
    return "other"


def main():
    output_dir = Path(OUTPUT_DIR)
    output_dir.mkdir(parents=True, exist_ok=True)

    files = sorted(Path(EXTRACTION_DIR).glob("*_extraction.json"))
    print(f"Processing {len(files)} extraction files")

    all_parts = defaultdict(set)
    all_specs = []
    all_torques = []
    all_tools = []
    all_page_refs = []
    block_updates = []

    for filepath in files:
        with open(filepath) as f:
            data = json.load(f)

        title = data.get("normalized_title") or Path(data["source"]).stem
        blocks = data.get("content_blocks", [])

        file_parts = set()
        file_specs = []
        file_torques = []

        for bi, block in enumerate(blocks):
            text = block.get("content_text", "")
            page = block.get("page_start", 0)

            if not text or len(text) < 10:
                continue

            # Find part numbers
            parts = find_part_numbers(text)
            for p in parts:
                file_parts.add(p)
                all_parts[title].add(p)

            # Find specifications
            specs = find_specs(text)
            for s in specs:
                all_specs.append({**s, "source": title, "page": page, "block_index": bi})

            # Find torque specs
            torques = find_torque_specs(text)
            for t in torques:
                all_torques.append({**t, "source": title, "page": page, "block_index": bi})

            # Find tool references
            tools = find_tool_refs(text)
            for t in tools:
                all_tools.append({**t, "source": title, "page": page, "block_index": bi})

            # Find page references
            refs = find_page_refs(text)
            for r in refs:
                all_page_refs.append({**r, "source": title, "page": page, "block_index": bi})

            # Record for block update
            if parts or torques:
                block_updates.append({
                    "source": title,
                    "block_index": blocks.index(block),
                    "page": page,
                    "parts": parts,
                    "torques": torques,
                })

        # Per-file report
        if file_parts or file_torques:
            pass  # Detailed output below

    # Deduplicate
    unique_specs = []
    seen_specs = set()
    for s in all_specs:
        key = (round(s["value"], 2), s["unit"], s["source"])
        if key not in seen_specs:
            seen_specs.add(key)
            unique_specs.append(s)

    unique_torques = []
    seen_torques = set()
    for t in all_torques:
        key = (round(t["value"], 2), t["source"])
        if key not in seen_torques:
            seen_torques.add(key)
            unique_torques.append(t)

    # Print report
    print(f"\n{'='*60}")
    print(f"ENRICHMENT RESULTS")
    print(f"{'='*60}")
    print(f"Part numbers found:     {sum(len(v) for v in all_parts.values())}")
    print(f"Unique part numbers:    {len(set(p for ps in all_parts.values() for p in ps))}")
    print(f"Spec values found:      {len(unique_specs)}")
    print(f"Torque specs found:     {len(unique_torques)}")
    print(f"Tool references:        {len(all_tools)}")
    print(f"Page cross-references:  {len(all_page_refs)}")

    # Top part numbers
    part_freq = defaultdict(int)
    for ps in all_parts.values():
        for p in ps:
            part_freq[p] += 1
    top_parts = sorted(part_freq.items(), key=lambda x: -x[1])[:20]

    print(f"\nTop 20 part numbers:")
    for part, freq in top_parts:
        sources = [s for s, ps in all_parts.items() if part in ps][:3]
        print(f"  {part:20s} x{freq:3d} in {', '.join(sources)}")

    # Sample torque specs
    if unique_torques:
        print(f"\nSample torque specs (first 10):")
        for t in unique_torques[:10]:
            print(f"  {t['value']:8.1f} {t['unit']:5s} | {t['context'][:80]}")

    # Generate SQL for specifications
    sql_lines = ["-- Barry v2 Specification Import",
                 f"-- {len(unique_specs)} specs, {len(unique_torques)} torque specs",
                 "BEGIN;\n"]

    spec_count = 0
    for s in unique_specs[:200]:  # Limit to most important
        spec_id = str(uuid.UUID(hashlib.md5(f"spec:{s['source']}:{s['value']}:{s['unit']}:{s['page']}".encode()).hexdigest()))
        category = classify_spec_category(s["context"], s["value"], s["unit"])
        context_esc = s["context"].replace("'", "''")[:200]
        # Look up block UUID from source + block_index
        block_uuid = None
        if s.get("block_index") is not None:
            block_uuid = str(uuid.UUID(hashlib.md5(f"block:{s['source']}:{s['block_index']}".encode()).hexdigest()))
        bref = f"'{block_uuid}'" if block_uuid else "NULL"
        sql_lines.append(
            f"INSERT INTO barry_v2_specifications (id, block_id, category, name, value, unit, "
            f"source_page) VALUES ("
            f"'{spec_id}', {bref}::uuid, '{category}', '{context_esc}', "
            f"{s['value']}, '{s['unit']}', {s['page']}) "
            f"ON CONFLICT (id) DO NOTHING;"
        )
        spec_count += 1

    sql_lines.append(f"\n-- {spec_count} specifications inserted")
    sql_lines.append("\nCOMMIT;")

    sql_path = output_dir / "enrichment_import.sql"
    with open(sql_path, "w") as f:
        f.write("\n".join(sql_lines))
    print(f"\nSQL: {sql_path} ({spec_count} inserts)")

    # Save full results
    output = {
        "part_numbers": {k: sorted(v) for k, v in all_parts.items()},
        "specifications": unique_specs[:500],
        "torque_specs": unique_torques[:200],
        "tool_refs": all_tools[:100],
        "page_refs": all_page_refs[:100],
    }
    with open(output_dir / "enrichment_results.json", "w") as f:
        json.dump(output, f, indent=2)
    print(f"Results: {output_dir / 'enrichment_results.json'}")


if __name__ == "__main__":
    main()
