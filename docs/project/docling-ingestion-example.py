#!/usr/bin/env python3
"""
Docling → Chunks → Embeddings → Supabase upsert

Converts a manual (PDF/DOCX/etc.) to Markdown/JSON with Docling, chunks it,
embeds each chunk to 768d (matching pgvector column), and upserts rows into
public.manual_chunks.

Env:
  SUPABASE_URL=https://<your>.supabase.co
  SUPABASE_SERVICE_ROLE_KEY=<SUPABASE_SERVICE_ROLE_KEY>
  OPENAI_API_KEY=<OPENAI_API_KEY>
Args:
  --input /path/to/manual.pdf
  --manual-id <UUID of manual in your system>
  --model text-embedding-3-small   (default)
  --chunk-chars 1800               (soft limit per chunk)
  --overlap 200                    (soft overlap)
Usage:
  pip install docling supabase openai python-slugify
  python scripts/ingest_with_docling.py --input manuals/G605.pdf --manual-id <uuid>
"""

import os, sys, re, math, uuid, argparse
from typing import List, Tuple
from slugify import slugify
from supabase import create_client, Client
from openai import OpenAI

# -------- Embedding utils (project 1536 -> 768) --------

DIM_TARGET = 768

def l2_normalize(vec: List[float]) -> List[float]:
    n = math.sqrt(sum(v*v for v in vec)) or 1.0
    return [v/n for v in vec]

def project_to_768(vec1536: List[float]) -> List[float]:
    """Project 1536d vector to 768d by summing pairs and normalizing"""
    out = [0.0]*DIM_TARGET
    # Sum every 2nd component (1536/768 = 2)
    for i in range(DIM_TARGET):
        out[i] = vec1536[i*2] + vec1536[i*2+1] if i*2+1 < len(vec1536) else vec1536[i*2]
    return l2_normalize(out)

# -------- Chunking --------

HEADING_RE = re.compile(r'^(#{1,6})\s+(.*)', re.M)

def split_markdown(markdown: str, chunk_chars: int = 1800, overlap: int = 200) -> List[Tuple[str, str]]:
    """
    Returns list of (section_title, text) chunks.
    Heuristic: split by headings; within very large sections, window by chars.
    """
    positions = [(m.start(), m.group(1), m.group(2).strip()) for m in HEADING_RE.finditer(markdown)]
    sections = []
    if not positions:
        sections = [("Document", markdown)]
    else:
        for i, (start, hashes, title) in enumerate(positions):
            end = positions[i+1][0] if i+1 < len(positions) else len(markdown)
            body = markdown[start:end].strip()
            # drop the leading heading line from body
            first_nl = body.find("\n")
            body = body[first_nl+1:].strip() if first_nl >= 0 else ""
            sections.append((title, body))

    chunks: List[Tuple[str, str]] = []
    for title, body in sections:
        if len(body) <= chunk_chars + overlap:
            if body.strip():
                chunks.append((title, body.strip()))
            continue
        # sliding window for long sections
        start = 0
        while start < len(body):
            end = min(len(body), start + chunk_chars)
            window = body[start:end].strip()
            if window:
                chunks.append((f"{title} (part {len(chunks)+1})", window))
            if end == len(body): break
            start = max(end - overlap, start + 1)
    return chunks

# -------- Docling conversion --------

def convert_with_docling(input_path: str):
    from docling.document_converter import DocumentConverter
    conv = DocumentConverter()
    res = conv.convert(input_path)
    doc = res.document
    # Primary representations
    md = doc.export_markdown()
    js = doc.export_json()
    return md, js

# -------- Supabase upsert --------

def upsert_chunks(
    sb: Client,
    manual_id: uuid.UUID,
    chunks: List[Tuple[str, str]],
    embedder: OpenAI,
    model: str = "text-embedding-3-small",
):
    texts = [f"{t}\n\n{c}" for t, c in chunks]
    # Embed in batches to respect token limits
    BATCH = 100
    written = 0
    for i in range(0, len(texts), BATCH):
        batch_texts = texts[i:i+BATCH]
        emb = embedder.embeddings.create(model=model, input=batch_texts)
        vecs = [project_to_768(d.embedding) for d in emb.data]

        rows = []
        for j, (section_title, content) in enumerate(chunks[i:i+BATCH]):
            rows.append({
                # id omitted -> use default
                "manual_id": str(manual_id),
                "section_title": section_title[:512] if section_title else None,
                "page_number": None,  # unknown at this stage
                "page_image_url": None,
                "has_visual_elements": False,   # we aren't extracting page images in this step
                "content": content,
                "embedding": vecs[j],
            })

        sb.table("manual_chunks").insert(rows).execute()
        written += len(rows)
        print(f"Upserted {written}/{len(chunks)} chunks")

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--input", required=True, help="Path to manual (PDF/DOCX/…)")
    parser.add_argument("--manual-id", required=True, help="UUID of the manual record")
    parser.add_argument("--model", default="text-embedding-3-small")
    parser.add_argument("--chunk-chars", type=int, default=1800)
    parser.add_argument("--overlap", type=int, default=200)
    args = parser.parse_args()

    try:
        manual_uuid = uuid.UUID(args.manual_id)
    except Exception:
        print("ERROR: --manual-id must be a UUID", file=sys.stderr)
        sys.exit(1)

    SUPABASE_URL = os.environ.get("SUPABASE_URL")
    SUPABASE_KEY = <SUPABASE_ANON_KEY>
    OPENAI_API_KEY = <OPENAI_API_KEY>
    if not (SUPABASE_URL and SUPABASE_KEY and OPENAI_API_KEY):
        print("ERROR: Missing SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY / OPENAI_API_KEY", file=sys.stderr)
        sys.exit(1)

    # Convert
    print(f"Converting with Docling: {args.input}")
    md, js = convert_with_docling(args.input)
    print(f"Docling conversion complete: {len(md)} markdown chars")

    # Chunk
    chunks = split_markdown(md, chunk_chars=args.chunk_chars, overlap=args.overlap)
    if not chunks:
        print("No chunks produced; aborting.", file=sys.stderr)
        sys.exit(2)
    print(f"Produced {len(chunks)} chunks")

    # Embed + upsert
    sb: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
    oa = OpenAI(api_key=OPENAI_API_KEY)
    upsert_chunks(sb, manual_uuid, chunks, oa, model=args.model)

    print("Ingest complete.")

if __name__ == "__main__":
    main()