#!/bin/bash

# Check if PDFs are linearized (optimized for web viewing)
# Linearized PDFs load faster because they can stream page-by-page

echo "Checking PDF linearization status..."
echo "===================================="
echo ""

# Sample some PDFs from Supabase storage
PDFS=(
  "U435_Engine.pdf"
  "U435_Transmission.pdf"
  "U435_Brakes.pdf"
)

for pdf in "${PDFS[@]}"; do
  echo "Checking: $pdf"

  # Download first 1KB to check linearization flag
  curl -s -r 0-1024 "https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/manuals/$pdf" -o "/tmp/$pdf.sample"

  # Check if PDF contains linearization dictionary
  if strings "/tmp/$pdf.sample" | grep -q "Linearized"; then
    echo "  ✅ LINEARIZED - Optimized for web"
  else
    echo "  ❌ NOT LINEARIZED - Will load slower"
  fi

  echo ""
done

echo "===================================="
echo ""
echo "To linearize PDFs, use:"
echo "  qpdf --linearize input.pdf output.pdf"
echo ""
echo "Benefits of linearization:"
echo "  - Page-by-page streaming"
echo "  - Faster first page render"
echo "  - Better browser caching"
echo "  - Supports HTTP range requests"
