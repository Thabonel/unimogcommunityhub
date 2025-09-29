#!/usr/bin/env python3
"""
U435 Maintenance Manual Analysis Tool
Using the same foolproof methodology as the repair manual
"""

import sys
import os
import hashlib
import csv
from pathlib import Path
import fitz  # PyMuPDF

class MaintenanceManualAnalyzer:
    def __init__(self, manual_dir: str):
        self.manual_dir = Path(manual_dir)
        if not self.manual_dir.exists():
            raise FileNotFoundError(f"Manual directory not found: {self.manual_dir}")

    def analyze_all_files(self):
        """Analyze all PDF files in the maintenance manual directory"""
        print("U435 MAINTENANCE MANUAL ANALYSIS")
        print("=" * 60)
        print()

        pdf_files = list(self.manual_dir.glob("*.pdf"))
        pdf_files.sort()

        if not pdf_files:
            print("No PDF files found!")
            return []

        results = []
        total_pages = 0

        for pdf_file in pdf_files:
            try:
                result = self.analyze_single_file(pdf_file)
                results.append(result)
                total_pages += result['page_count']

            except Exception as e:
                print(f"❌ Error analyzing {pdf_file.name}: {e}")
                results.append({
                    'filename': pdf_file.name,
                    'page_count': 0,
                    'file_size_mb': 0,
                    'error': str(e)
                })

        print()
        print("SUMMARY:")
        print(f"Total files: {len(pdf_files)}")
        print(f"Total pages: {total_pages}")
        print()

        return results

    def analyze_single_file(self, pdf_path: Path):
        """Analyze a single PDF file"""
        doc = fitz.open(str(pdf_path))
        page_count = doc.page_count
        file_size_mb = pdf_path.stat().st_size / (1024 * 1024)

        # Extract content samples
        first_page_text = ""
        last_page_text = ""

        if page_count > 0:
            first_page_text = doc[0].get_text()[:200].replace('\n', ' ').strip()

        if page_count > 1:
            last_page_text = doc[-1].get_text()[:200].replace('\n', ' ').strip()

        doc.close()

        # Determine if file should be split
        should_split = self.should_split_file(pdf_path.name, page_count, file_size_mb)

        # Print analysis
        split_icon = "🔄" if should_split else "📄"
        print(f"{split_icon} {pdf_path.name:45} | {page_count:3d} pages | {file_size_mb:5.1f}MB")
        if should_split:
            print(f"   → SHOULD SPLIT: {self.get_split_reason(pdf_path.name, page_count, file_size_mb)}")
        print(f"   First: {first_page_text[:60]}...")

        return {
            'filename': pdf_path.name,
            'original_name': pdf_path.stem,
            'page_count': page_count,
            'file_size_mb': file_size_mb,
            'should_split': should_split,
            'split_reason': self.get_split_reason(pdf_path.name, page_count, file_size_mb) if should_split else None,
            'first_page_sample': first_page_text,
            'last_page_sample': last_page_text,
        }

    def should_split_file(self, filename: str, page_count: int, file_size_mb: float) -> bool:
        """Determine if a file should be split based on size and content"""

        # Files that should definitely be split (too large)
        if file_size_mb > 10:  # Over 10MB
            return True

        if page_count > 50:  # Over 50 pages
            return True

        # Files that are likely to contain multiple procedures
        multi_content_indicators = [
            "General",  # 00 - General.pdf (35MB)
            "Body",     # 60 - Body.pdf (17MB)
            "Special Equipment",  # 55 - Special Equipment.pdf (8.3MB)
            "Brakes - Hydraulic + Mechanical"  # 42 - (11MB)
        ]

        for indicator in multi_content_indicators:
            if indicator.lower() in filename.lower():
                return True

        return False

    def get_split_reason(self, filename: str, page_count: int, file_size_mb: float) -> str:
        """Get reason why file should be split"""
        reasons = []

        if file_size_mb > 20:
            reasons.append(f"Very large file ({file_size_mb:.1f}MB)")
        elif file_size_mb > 10:
            reasons.append(f"Large file ({file_size_mb:.1f}MB)")

        if page_count > 50:
            reasons.append(f"Many pages ({page_count})")

        if "General" in filename:
            reasons.append("Contains multiple general topics")
        elif "Body" in filename:
            reasons.append("Contains multiple body systems")
        elif "Special Equipment" in filename:
            reasons.append("Contains multiple equipment types")
        elif "Brakes - Hydraulic + Mechanical" in filename:
            reasons.append("Contains multiple brake systems")

        return ", ".join(reasons) if reasons else "Multiple procedures likely"

    def create_splitting_plan(self, results):
        """Create a plan for splitting large files"""
        print("SPLITTING PLAN:")
        print("=" * 60)

        files_to_split = [r for r in results if r.get('should_split', False)]
        files_to_keep = [r for r in results if not r.get('should_split', False)]

        print(f"\n📄 Files to keep as-is ({len(files_to_keep)}):")
        for result in files_to_keep:
            print(f"   ✅ {result['filename']} ({result['page_count']} pages)")

        print(f"\n🔄 Files that need splitting ({len(files_to_split)}):")
        for result in files_to_split:
            print(f"   🔄 {result['filename']} ({result['page_count']} pages, {result['file_size_mb']:.1f}MB)")
            print(f"      Reason: {result['split_reason']}")

        if files_to_split:
            print(f"\n⚠️  RECOMMENDATION:")
            print(f"   1. Manually review the {len(files_to_split)} large files")
            print(f"   2. Create a maintenance_chapters.csv with proper page boundaries")
            print(f"   3. Use the same foolproof splitter methodology")
            print(f"   4. Extract content anchors for validation")
        else:
            print(f"\n✅ All files are appropriately sized - no splitting needed!")

def main():
    manual_dir = "/Users/thabonel/Documents/Unimog Manuals/Unimog 435 Maintenance Manual - English"

    try:
        analyzer = MaintenanceManualAnalyzer(manual_dir)
        results = analyzer.analyze_all_files()
        analyzer.create_splitting_plan(results)

        # Save results for further processing
        output_file = "/Users/thabonel/Code/unimogcommunityhub/docs/barry-manual-system/maintenance_analysis.txt"
        with open(output_file, 'w') as f:
            f.write("Maintenance Manual Analysis Results\n")
            f.write("=" * 50 + "\n\n")
            for result in results:
                f.write(f"File: {result['filename']}\n")
                f.write(f"Pages: {result['page_count']}\n")
                f.write(f"Size: {result.get('file_size_mb', 0):.1f}MB\n")
                f.write(f"Should Split: {result.get('should_split', False)}\n")
                if result.get('split_reason'):
                    f.write(f"Reason: {result['split_reason']}\n")
                f.write(f"First page: {result.get('first_page_sample', 'N/A')[:100]}...\n")
                f.write("\n" + "-" * 50 + "\n\n")

        print(f"\n📊 Detailed analysis saved to: {output_file}")

    except Exception as e:
        print(f"❌ Error: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()