#!/usr/bin/env python3
"""
Barry v2 Phase 2: DeepSeek V3 Batch Content Classifier
Classifies content blocks in batches (10/req) for speed (~10 min total).

Usage:
    python3 scripts/classify-barry-v2-blocks.py [--batch-size 10] [--resume]

Output:
    docs/classification/classification_results.json
    docs/classification/classification_update.sql
"""

import json, os, sys, time, uuid, hashlib
from pathlib import Path
from collections import defaultdict

EXTRACTION_DIR = "docs/extraction"
OUTPUT_DIR = "docs/classification"
CHECKPOINT_PATH = Path(OUTPUT_DIR) / "classification_checkpoint.json"
BATCH_SIZE = 10

# DeepSeek API key
DEEPSEEK_API_KEY = ""
_auth_path = os.path.expanduser("~/.local/share/opencode/auth.json")
if os.path.exists(_auth_path):
    with open(_auth_path) as f:
        _auth = json.load(f)
    DEEPSEEK_API_KEY = _auth.get("deepseek", {}).get("key", "")
if not DEEPSEEK_API_KEY:
    DEEPSEEK_API_KEY = os.environ.get("DEEPSEEK_API_KEY", "")
if not DEEPSEEK_API_KEY:
    print("ERROR: No DeepSeek API key found")
    sys.exit(1)

VALID_TYPES = {"procedure", "specification", "warning", "parts_list", "explanation", "diagnostic"}

CLASSIFY_SYSTEM_PROMPT = """You classify Unimog workshop manual content into exact types.

Valid types:
- procedure: Step-by-step instructions with numbered steps or action verbs (remove, install, check, adjust, tighten, loosen, replace, disconnect, connect)
- specification: Measurements, torque values, clearances, capacities, pressures, weights, dimensions with units (Nm, bar, psi, mm, kg, V, A, rpm, etc.)
- warning: Safety warnings containing WARNING, CAUTION, ACHTUNG, VORSICHT, DANGER, or similar
- parts_list: Part numbers (patterns like A 667 203 00 15), NSNs, or itemized parts with quantities
- explanation: General descriptions, theory of operation, system overviews, table of contents, index pages
- diagnostic: Symptom → cause → test → fix troubleshooting patterns

For each block, respond with the type and a confidence score 0.0-1.0.
Respond ONLY with a valid JSON array. No markdown, no explanation."""


def classify_batch(client, batch):
    """Classify a batch of blocks in a single API call."""
    texts = []
    for b in batch:
        text = b["content_text"][:2000]
        if not text or len(text.strip()) < 10:
            text = "[empty block]"
        texts.append(text)

    batch_prompt = ""
    for i, text in enumerate(texts):
        heading = b.get("title", "") if i == 0 else batch[i].get("title", "")
        batch_prompt += f"--- Block {i+1} ---\n"
        if heading:
            batch_prompt += f"Title: {heading}\n"
        batch_prompt += f"{text}\n\n"

    try:
        resp = client.chat.completions.create(
            model="deepseek-chat",
            messages=[
                {"role": "system", "content": CLASSIFY_SYSTEM_PROMPT},
                {"role": "user", "content": f"Classify these {len(batch)} blocks. Return a JSON array:\n{batch_prompt}"}
            ],
            temperature=0.0,
            max_tokens=200 * len(batch),
            response_format={"type": "json_object"},
        )
        raw = resp.choices[0].message.content
        results = json.loads(raw)

        # Handle both array and object responses
        if isinstance(results, dict):
            if "blocks" in results:
                results = results["blocks"]
            elif all(k.startswith("block_") for k in results):
                results = [v for k, v in sorted(results.items())]

        if not isinstance(results, list):
            results = [{"index": 1, "block_type": "explanation", "confidence": 0.0}]

    except Exception as e:
        results = [{"index": i + 1, "block_type": "explanation", "confidence": 0.0,
                     "reasoning": f"API error: {e}"} for i in range(len(batch))]

    # Map results back to batch
    for i, r in enumerate(results):
        bt = r.get("block_type", "").lower().replace(" ", "_").replace("-", "_")
        # Normalize to valid types
        if bt not in VALID_TYPES:
            if any(w in bt for w in ["torque", "spec", "tighten", "measurement", "clearance"]):
                bt = "specification"
            elif any(w in bt for w in ["step", "remove", "install", "procedure"]):
                bt = "procedure"
            elif any(w in bt for w in ["warn", "caution", "danger", "safety"]):
                bt = "warning"
            elif any(w in bt for w in ["part", "nsn"]):
                bt = "parts_list"
            else:
                bt = "explanation"
        r["block_type"] = bt

    return results


def main():
    from openai import OpenAI
    client = OpenAI(api_key=DEEPSEEK_API_KEY, base_url="https://api.deepseek.com/v1")

    os.makedirs(OUTPUT_DIR, exist_ok=True)

    # Gather all blocks
    all_blocks = []
    files = sorted(Path(EXTRACTION_DIR).glob("*_extraction.json"))
    for filepath in files:
        with open(filepath) as f:
            data = json.load(f)
        title = data.get("normalized_title") or Path(data["source"]).stem
        for i, block in enumerate(data.get("content_blocks", [])):
            all_blocks.append({
                "source": title,
                "source_file": filepath.name,
                "block_index": i,
                "old_type": block.get("block_type", "explanation"),
                "page_start": block.get("page_start"),
                "title": block.get("title", ""),
                "content_text": block.get("content_text", ""),
                "text_length": len(block.get("content_text", "")),
            })

    print(f"Total blocks: {len(all_blocks)}")

    # Resume from checkpoint
    results = []
    type_counts = defaultdict(int)
    total_cost = 0.0
    classified_ids = set()

    if CHECKPOINT_PATH.exists():
        with open(CHECKPOINT_PATH) as f:
            cp = json.load(f)
        results = cp.get("results", [])
        type_counts = defaultdict(int, cp.get("type_counts", {}))
        total_cost = cp.get("total_cost", 0)
        for r in results:
            classified_ids.add(f"{r['source']}:{r['block_index']}")
        print(f"  Resuming: {len(results)} already classified")

    remaining = [b for b in all_blocks if f"{b['source']}:{b['block_index']}" not in classified_ids]
    print(f"  Remaining: {len(remaining)}")

    if not remaining:
        print("  All blocks already classified. Skipping API calls.")
    else:
        # Process in batches
        start_time = time.time()
        batch_num = 0

        for batch_start in range(0, len(remaining), BATCH_SIZE):
            batch = remaining[batch_start:batch_start + BATCH_SIZE]
            batch_num += 1
            batch_results = classify_batch(client, batch)

            for i, r in enumerate(batch_results):
                block = batch[i] if i < len(batch) else batch[-1]
                new_type = r.get("block_type", "explanation")
                confidence = r.get("confidence", 0)

                # Cost estimate
                text_len = len(block.get("content_text", ""))
                input_tokens = text_len / 4
                output_tokens = 20
                cost = (input_tokens * 0.14 + output_tokens * 0.28) / 1_000_000

                type_counts[new_type] += 1
                total_cost += cost

                results.append({
                    **block,
                    "new_type": new_type,
                    "confidence": confidence,
                    "reasoning": r.get("reasoning", ""),
                    "content_json": r.get("content_json", {}),
                    "cost": round(cost, 6),
                })

            elapsed = time.time() - start_time
            done = len(results)
            rate = done / elapsed if elapsed > 0 else 0
            eta = (len(all_blocks) - done) / rate if rate > 0 else 0
            print(f"  [{done}/{len(all_blocks)}] {dict(type_counts)} ${total_cost:.4f} {rate:.1f}blk/s eta={eta:.0f}s")

            # Save checkpoint every 5 batches
            if batch_num % 5 == 0:
                checkpoint = {
                    "results": results,
                    "type_counts": dict(type_counts),
                    "total_cost": total_cost,
                    "classified_count": len(results),
                    "total_count": len(all_blocks),
                }
                with open(CHECKPOINT_PATH, "w") as f:
                    json.dump(checkpoint, f, indent=2)

            # Rate limit
            time.sleep(0.1)

        # Final save
        checkpoint = {
            "results": results,
            "type_counts": dict(type_counts),
            "total_cost": total_cost,
            "classified_count": len(results),
            "total_count": len(all_blocks),
        }
        with open(CHECKPOINT_PATH, "w") as f:
            json.dump(checkpoint, f, indent=2)

        elapsed = time.time() - start_time
        print(f"\nClassification complete:")
        print(f"  Time: {elapsed:.0f}s ({len(results)/elapsed:.1f} blk/s)")
        print(f"  Cost: ${total_cost:.4f}")
        print(f"  Types: {dict(type_counts)}")

    # Save full results
    output = {
        "classification_date": "2026-06-12",
        "total_blocks": len(all_blocks),
        "total_cost": round(total_cost, 4),
        "type_counts": dict(type_counts),
        "blocks": results,
    }
    out_path = Path(OUTPUT_DIR) / "classification_results.json"
    with open(out_path, "w") as f:
        json.dump(output, f, indent=2)
    print(f"Results: {out_path}")

    # Generate SQL UPDATE
    changes = [r for r in results if r["new_type"] != r["old_type"]]
    print(f"Type changes: {len(changes)}/{len(results)}")

    if changes:
        sql_lines = ["-- Barry v2 Classification UPDATE",
                     f"-- Changing {len(changes)} blocks",
                     "BEGIN;\n"]
        for b in changes:
            buid = str(uuid.UUID(hashlib.md5(f"block:{b['source']}:{b['block_index']}".encode()).hexdigest()))
            sql_lines.append(
                f"UPDATE barry_v2_content_blocks SET block_type = '{b['new_type']}' "
                f"WHERE id = '{buid}';"
            )
        sql_lines.append("\nCOMMIT;")
        sql_path = Path(OUTPUT_DIR) / "classification_update.sql"
        with open(sql_path, "w") as f:
            f.write("\n".join(sql_lines))
        print(f"SQL: {sql_path} ({len(changes)} UPDATES)")

    # Per-source summary
    print(f"\nPer-source type distribution:")
    source_types = defaultdict(lambda: defaultdict(int))
    for r in results:
        source_types[r["source"]][r["new_type"]] += 1
    for source, types in sorted(source_types.items()):
        ts = ", ".join(f"{k}={v}" for k, v in sorted(types.items()))
        print(f"  {source[:40]:40s} {ts}")


if __name__ == "__main__":
    main()
