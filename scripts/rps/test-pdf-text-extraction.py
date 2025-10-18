#!/usr/bin/env python3
"""
Test PDF Text Extraction
Tests whether the RPS PDF has extractable text or is scanned-only
"""

import sys

try:
    import PyPDF2
    print("PyPDF2 installed: OK")
except ImportError:
    print("ERROR: PyPDF2 not installed. Run: pip install PyPDF2")
    sys.exit(1)

PDF_PATH = '/Users/thabonel/Code/Work/RPS-02155-Unimog-GS-Base-Scale.pdf'

print("\n" + "="*80)
print("PDF TEXT EXTRACTION TEST")
print("="*80 + "\n")

print(f"Testing file: {PDF_PATH}\n")

try:
    with open(PDF_PATH, 'rb') as file:
        pdf_reader = PyPDF2.PdfReader(file)

        total_pages = len(pdf_reader.pages)
        print(f"Total pages in PDF: {total_pages}")

        # Test pages 97-99 (known to contain parts tables)
        test_pages = [96, 97, 98]  # 0-indexed, so 97, 98, 99 in PDF

        print(f"\nTesting pages {test_pages[0]+1}, {test_pages[1]+1}, {test_pages[2]+1} (parts table pages):\n")

        has_text = False
        for page_num in test_pages:
            if page_num < total_pages:
                page = pdf_reader.pages[page_num]
                text = page.extract_text()

                print(f"Page {page_num+1}:")
                print(f"  Characters extracted: {len(text)}")

                if len(text) > 100:
                    has_text = True
                    print(f"  Sample text: {text[:200].strip()}...")
                    print(f"  ✓ Text extraction SUCCESSFUL")
                else:
                    print(f"  ✗ No text extracted (likely scanned image)")
                print()

        print("="*80)
        if has_text:
            print("RESULT: PDF has extractable text layer")
            print("RECOMMENDATION: Use PDF text extraction (Option 3)")
            print("NEXT STEP: Run full table extraction with camelot or tabula")
        else:
            print("RESULT: PDF appears to be scanned images only")
            print("RECOMMENDATION: Use OCR (Option 2) or AI Vision (Option 4)")
            print("NEXT STEP: Test Claude Vision on sample pages")
        print("="*80 + "\n")

except FileNotFoundError:
    print(f"ERROR: PDF file not found at {PDF_PATH}")
    print("Please update PDF_PATH in script")
    sys.exit(1)
except Exception as e:
    print(f"ERROR: {e}")
    sys.exit(1)
