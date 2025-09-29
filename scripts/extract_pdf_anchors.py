#!/usr/bin/env python3
"""
PDF Anchor Extraction Tool
Extracts immutable content anchors for validation during PDF splitting
"""

import sys
import hashlib
import csv
import os
from pathlib import Path
from typing import Dict, Tuple
import fitz  # PyMuPDF
import re

class AnchorExtractor:
    def __init__(self, source_pdf_path: str, page_map_csv: str):
        self.source_pdf = Path(source_pdf_path)
        self.page_map_csv = Path(page_map_csv)

        if not self.source_pdf.exists():
            raise FileNotFoundError(f"Source PDF not found: {self.source_pdf}")

        # Verify source integrity
        self.verify_source_integrity()

        # Open PDF once for all operations
        self.pdf_doc = fitz.open(str(self.source_pdf))

    def verify_source_integrity(self):
        """Verify PDF matches expected fingerprint"""
        expected_sha256 = "489381a41ab43748e36af99ab4eeaced1b3d6bbcff337c01676d05d7361da9a0"

        # Calculate actual SHA256
        sha256_hash = hashlib.sha256()
        with open(self.source_pdf, "rb") as f:
            for byte_block in iter(lambda: f.read(4096), b""):
                sha256_hash.update(byte_block)
        actual_sha256 = sha256_hash.hexdigest()

        if actual_sha256 != expected_sha256:
            raise ValueError(f"Source PDF SHA256 mismatch!\n"
                           f"Expected: {expected_sha256}\n"
                           f"Actual: {actual_sha256}\n"
                           f"ABORT: Source file has been modified!")

        print(f"✅ Source PDF verified: SHA256 matches")

    def normalize_text(self, text: str) -> str:
        """Normalize text for consistent hashing"""
        # Remove extra whitespace
        text = re.sub(r'\s+', ' ', text)
        # Convert to lowercase
        text = text.lower()
        # Remove punctuation at ends
        text = text.strip(' .,;:!?')
        # Limit to 300 chars
        return text[:300]

    def extract_page_text(self, page_num: int, chars: int = 300) -> str:
        """Extract text from specific page"""
        if page_num < 1 or page_num > self.pdf_doc.page_count:
            raise ValueError(f"Page {page_num} out of range (1-{self.pdf_doc.page_count})")

        page = self.pdf_doc[page_num - 1]  # Convert to 0-based
        text = page.get_text()
        return text[:chars] if text else ""

    def calculate_text_hash(self, text: str) -> str:
        """Calculate SHA256 hash of normalized text"""
        normalized = self.normalize_text(text)
        return hashlib.sha256(normalized.encode('utf-8')).hexdigest()

    def extract_anchors(self, start_page: int, end_page: int) -> Dict[str, str]:
        """Extract triple anchors for a chapter range"""
        anchors = {}

        # First page anchor
        p1_text = self.extract_page_text(start_page)
        anchors['p1_text'] = self.normalize_text(p1_text)[:100]  # First 100 chars for display
        anchors['p1_text_sha256'] = self.calculate_text_hash(p1_text)

        # Middle page anchor
        mid_page = (start_page + end_page) // 2
        mid_text = self.extract_page_text(mid_page)
        anchors['mid_text'] = self.normalize_text(mid_text)[:100]
        anchors['mid_text_sha256'] = self.calculate_text_hash(mid_text)
        anchors['mid_page_num'] = mid_page

        # Last page anchor
        last_text = self.extract_page_text(end_page)
        anchors['last_text'] = self.normalize_text(last_text)[:100]
        anchors['last_text_sha256'] = self.calculate_text_hash(last_text)

        return anchors

    def process_page_map(self):
        """Process page map CSV and extract all anchors"""
        results = []

        with open(self.page_map_csv, 'r', encoding='utf-8') as f:
            reader = csv.DictReader(f)

            for row_num, row in enumerate(reader, 2):
                try:
                    start_page = int(row['orig_start_page'])
                    end_page = int(row['orig_end_page'])
                    filename = row['chapter_pdf_filename']
                    title = row['section_title']

                    print(f"Processing {row_num-1}: {title} (pages {start_page}-{end_page})")

                    # Extract anchors
                    anchors = self.extract_anchors(start_page, end_page)

                    # Update row with anchor data
                    row['anchor_p1_text_sha256'] = anchors['p1_text_sha256']
                    row['anchor_mid_text_sha256'] = anchors['mid_text_sha256']
                    row['anchor_last_text_sha256'] = anchors['last_text_sha256']

                    # Add actual text samples for verification
                    row['anchor_p1_actual'] = anchors['p1_text']
                    row['anchor_mid_actual'] = anchors['mid_text']
                    row['anchor_last_actual'] = anchors['last_text']
                    row['mid_page_num'] = anchors['mid_page_num']

                    # Validate expected vs actual for first page
                    expected_p1 = row.get('anchor_p1_expected', '').lower()
                    if expected_p1 and expected_p1 != 'tbd':
                        if expected_p1 not in anchors['p1_text']:
                            print(f"  ⚠️  WARNING: Expected '{expected_p1}' not found in first page")
                            print(f"      Actual: {anchors['p1_text'][:50]}...")

                    results.append(row)

                except Exception as e:
                    print(f"  ❌ Error processing row {row_num}: {e}")
                    row['validation_status'] = 'ERROR'
                    results.append(row)

        return results

    def write_enhanced_csv(self, results, output_path: str):
        """Write enhanced CSV with anchor data"""
        if not results:
            print("No results to write")
            return

        # Get all fieldnames from first result
        fieldnames = list(results[0].keys())

        with open(output_path, 'w', newline='', encoding='utf-8') as f:
            writer = csv.DictWriter(f, fieldnames=fieldnames)
            writer.writeheader()
            writer.writerows(results)

        print(f"\n✅ Enhanced CSV written to: {output_path}")

    def generate_validation_report(self, results):
        """Generate detailed validation report"""
        report = []
        report.append("PDF ANCHOR EXTRACTION REPORT")
        report.append("=" * 50)
        report.append(f"Source PDF: {self.source_pdf}")
        report.append(f"Total chapters: {len(results)}")
        report.append("")

        issues = []
        for row in results:
            filename = row['chapter_pdf_filename']
            start = row['orig_start_page']
            end = row['orig_end_page']

            # Check for validation issues
            if row.get('validation_status') == 'ERROR':
                issues.append(f"  ❌ {filename}: Processing error")
            elif row.get('validation_status') == 'CRITICAL':
                issues.append(f"  🔴 {filename}: Critical - known content mismatch")

            # Sample validation output
            if filename == 'U435_06_Cooling_System.pdf':
                report.append(f"CRITICAL CHECK: Cooling System (pages {start}-{end})")
                report.append(f"  First page text: {row.get('anchor_p1_actual', 'N/A')[:80]}...")
                report.append(f"  Expected: 'cooling system'")
                report.append("")

        if issues:
            report.append("ISSUES FOUND:")
            report.extend(issues)
        else:
            report.append("✅ All chapters processed successfully")

        return "\n".join(report)

    def close(self):
        """Clean up resources"""
        if hasattr(self, 'pdf_doc'):
            self.pdf_doc.close()

def main():
    # Paths
    source_pdf = "/Users/thabonel/Documents/Unimog Manuals/unimog435sm:U1700L.pdf"
    page_map_csv = "/Users/thabonel/Code/unimogcommunityhub/docs/barry-manual-system/page_map_enhanced.csv"
    output_csv = "/Users/thabonel/Code/unimogcommunityhub/docs/barry-manual-system/page_map_with_anchors.csv"

    try:
        # Create extractor
        extractor = AnchorExtractor(source_pdf, page_map_csv)

        # Process all chapters
        print("Extracting content anchors from source PDF...")
        results = extractor.process_page_map()

        # Write enhanced CSV
        extractor.write_enhanced_csv(results, output_csv)

        # Generate report
        report = extractor.generate_validation_report(results)
        print("\n" + report)

        # Save report
        report_path = "/Users/thabonel/Code/unimogcommunityhub/docs/barry-manual-system/anchor_extraction_report.txt"
        with open(report_path, 'w') as f:
            f.write(report)
        print(f"\nReport saved to: {report_path}")

        # Clean up
        extractor.close()

    except Exception as e:
        print(f"❌ Fatal error: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()