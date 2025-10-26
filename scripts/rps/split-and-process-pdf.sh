#!/bin/bash

# RPS PDF Splitting and Processing Script
# Splits large PDF into 100-page chunks and processes each with Marker OCR
#
# Usage: ./split-and-process-pdf.sh /path/to/pdf.pdf

set -e

PDF_FILE="$1"
CHUNK_SIZE=100
OUTPUT_DIR="$(dirname "$0")/output/pdf_chunks"
RESULTS_DIR="$(dirname "$0")/output/ocr_results"

if [ -z "$PDF_FILE" ]; then
    echo "Usage: $0 /path/to/pdf.pdf"
    exit 1
fi

if [ ! -f "$PDF_FILE" ]; then
    echo "Error: PDF file not found: $PDF_FILE"
    exit 1
fi

if [ -z "$REPLICATE_API_TOKEN" ]; then
    echo "Error: REPLICATE_API_TOKEN environment variable not set"
    exit 1
fi

# Create output directories
mkdir -p "$OUTPUT_DIR"
mkdir -p "$RESULTS_DIR"

# Get total page count
TOTAL_PAGES=$(qpdf --show-npages "$PDF_FILE")
echo "PDF has $TOTAL_PAGES pages"
echo "Splitting into chunks of $CHUNK_SIZE pages..."

# Calculate number of chunks
NUM_CHUNKS=$(( (TOTAL_PAGES + CHUNK_SIZE - 1) / CHUNK_SIZE ))
echo "Will create $NUM_CHUNKS chunks"

# Split PDF into chunks
for (( i=0; i<NUM_CHUNKS; i++ )); do
    START_PAGE=$(( i * CHUNK_SIZE + 1 ))
    END_PAGE=$(( (i + 1) * CHUNK_SIZE ))

    if [ $END_PAGE -gt $TOTAL_PAGES ]; then
        END_PAGE=$TOTAL_PAGES
    fi

    CHUNK_FILE="$OUTPUT_DIR/chunk_$(printf '%03d' $i)_pages_${START_PAGE}-${END_PAGE}.pdf"

    echo "Creating chunk $((i+1))/$NUM_CHUNKS: pages $START_PAGE-$END_PAGE"
    qpdf --pages "$PDF_FILE" "$START_PAGE-$END_PAGE" -- --empty "$CHUNK_FILE"
done

echo ""
echo "PDF splitting complete! Created $NUM_CHUNKS chunks in:"
echo "$OUTPUT_DIR"
echo ""
echo "Next: Run the TypeScript processor to OCR each chunk"
