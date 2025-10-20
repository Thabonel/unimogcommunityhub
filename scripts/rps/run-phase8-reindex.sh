#!/bin/bash

# Phase 8 Foolproof RPS Reindex Runner
# This script activates the Python venv and runs the TypeScript reindex script

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# Check venv exists
if [ ! -d "venv" ]; then
  echo "Error: Python virtual environment not found"
  echo "Run: python3 -m venv venv && source venv/bin/activate && pip install pymupdf"
  exit 1
fi

# Check PyMuPDF is installed
if ! source venv/bin/activate && python3 -c "import fitz" 2>/dev/null; then
  echo "Error: PyMuPDF not installed in venv"
  echo "Run: source venv/bin/activate && pip install pymupdf"
  exit 1
fi

# Check environment variables
if [ -z "$VITE_SUPABASE_URL" ] && [ -z "$SUPABASE_URL" ]; then
  echo "Error: Missing VITE_SUPABASE_URL or SUPABASE_URL"
  exit 1
fi

if [ -z "$SUPABASE_SERVICE_ROLE_KEY" ]; then
  echo "Error: Missing SUPABASE_SERVICE_ROLE_KEY"
  exit 1
fi

# Parse mode
MODE="test"
if [ "$1" = "--mode=full" ] || [ "$1" = "full" ]; then
  MODE="full"
fi

echo "========================================"
echo "Phase 8: Foolproof RPS Reindex"
echo "Mode: $MODE"
echo "========================================"
echo ""

# Activate venv
source venv/bin/activate

# Run TypeScript script
npx tsx phase8-foolproof-reindex.ts --mode="$MODE"

# Deactivate venv
deactivate

echo ""
echo "Script completed."
