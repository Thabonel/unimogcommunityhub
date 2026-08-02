# Unlimited-OCR Pilot Evaluation

## Verdict: adopt for Phase 6 document reprocessing

Date: 2026-08-02
Model: `baidu/Unlimited-OCR` (MIT license, 3B params), GGUF Q4_K_M + f16 projector (DevQuasar conversion)
Runtime: llama.cpp `llama-mtmd-cli --jinja` on Apple M5 32GB (Metal). No paid API, no upload of documents to any third party.

## What was tested

Six pages rendered at 300 DPI from the production U1700L/U435 Workshop Manual Volume 1 PDF and parsed with the prompt `document parsing.`: 605, 609, 928, 934, 946, 952.

## Side-by-side findings

### Page 934 (exploded view, steering box)

Current stored chunk text (legacy OCR):

```text
Exploded v1ew Steering box 4 Steering 96 7 Housing 99 9 Needle bearmg 103
12 Ret11mer 108 14 Seal ing ri ng 130 ...
```

Unlimited-OCR: correctly reads "Exploded view" and extracts the entire callout table as structured Markdown — 60+ rows with item numbers and part names (`14 Sealing ring`, `145 Gearing shaft`, `220 Repair set`), plus figure caption, footer, and printed page reference `1.5/3`.

### Page 928 (steering technical data)

Legacy OCR garbled the specification tables. Unlimited-OCR extracted complete, structured tables including:

- steering box ratio 19.33:1; hydraulic torque 3255 Nm at 100 bar;
- capacity table: 2.25 L with three configuration-dependent fluid options (engine oil SAE 10W, ATF, hydraulic fluid) and the governing footnotes preserved verbatim ("Oils listed must not be mixed", "Valid for military vehicles", cold-zone SAE 5W-20/30 note).

This is exactly the configuration-conditional evidence PRD seed case 2 requires. Values were NOT adopted into any answer or mapping; they are quoted here only as extraction-quality evidence.

### Page 946 (universal joint tightness check)

Complete procedure extracted, including dimensional checks (dim. a 6-8 mm; dim. b max 2 mm) and the clamping-bolt torque of 64 Nm. Matches the PRD seed case requirement that page 946 supports only the stated tightness check.

### Pages 605/609 (wheel hub drive)

Clean procedure text ("Disassembly and Assembly of Wheel Hub Drive"), correctly not steering content.

### Page 952 (second exploded view)

Structured callout table extracted like page 934.

## Performance

- First page (cold, model load): ~4 minutes. Warm pages: ~1.5-4 minutes each on the M5.
- Full workshop manual (1,185 pages): roughly 30-70 hours of unattended local batch time. Feasible as overnight batches; a rented GPU (vLLM recipe exists) would cut this to hours if ever wanted.

## Proposed pipeline (Phase 6)

1. Download PDF from storage (public bucket).
2. `pdftoppm -r 300 -png` per page.
3. `llama-mtmd-cli --jinja` with `document parsing.` prompt, temperature 0.
4. Post-process with the model card's `remove_det` routine (strips `<|det|>` layout markers, keeps reading order).
5. Store reprocessed text alongside (never overwriting) legacy chunks until compared; re-run the Phase 2 backfill over improved text (idempotent upserts).

## Upgrade strategy ("constantly upgrade")

- Model is a pipeline parameter; pin by GGUF digest.
- Before adopting any new release, re-run this 6-page evaluation set and compare outputs. No blind upgrades.
- The evaluation set lives at `tests/` scope of this document's described pages; regeneration commands are above.

## Security and provenance notes

- Quantized GGUF path avoids `trust_remote_code` (no remote code execution).
- All processing is local; no manual content leaves the machine.
- Reprocessed text is still source data, not ground truth: extracted values enter the semantic layer only through the existing evidence pipeline and review gates.

## Local setup record

- `brew install llama.cpp` (Ollama 0.30.10 cannot attach a separate GGUF projector; llama.cpp's `llama-mtmd-cli` can).
- Model files (~2.8GB) kept outside the repository.
