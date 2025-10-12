WIS ETL Worker (Local Runner)

Purpose
- Run a restart-safe ETL over local sources (HTML, JSON, PDFs) and upsert into Supabase using the plan/ops RPCs.

Requirements
- Node 18+
- Env vars: VITE_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
- Buckets created: wis-docs, wis-media, wis-archives

Run
- Example (samples):
  VITE_SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=<SUPABASE_SERVICE_ROLE_KEY> \
  tsx scripts/run-wis-etl.ts --model U435 --scope all --source /Volumes/UnimogManuals/wis-samples

Behavior
- Starts a job via wis_start_ingest_job
- Walks the source directory; for *.html parses title + steps; uploads originals with SHA-256 hashed paths
- Upserts procedures + steps; updates checkpoint every few files
- Records errors to wis_ingest_errors and marks job completed/failed

Notes
- PDF parsing is deferred to a later OCR pipeline; PDFs are uploaded for provenance
- Parts JSON ingestion is stubbed; add a parser when formats are finalized

