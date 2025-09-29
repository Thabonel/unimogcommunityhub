#!/usr/bin/env python3
"""
Examine Large Maintenance Files for Content Boundaries
Using the same methodology as repair manual analysis
"""

import sys
import os
from pathlib import Path
import fitz  # PyMuPDF

class MaintenanceContentExaminer:
    def __init__(self, manual_dir: str):
        self.manual_dir = Path(manual_dir)

        # Files that need splitting (large/multi-topic)
        self.large_files = [
            "00 - General.pdf",           # 35MB
            "60 - Body.pdf",              # 17MB
            "42 - Brakes - Hydraulic + Mechanical.pdf",  # 11MB
            "55 - Special Equipment.pdf", # 8.3MB
            "13 - Air Compressor + Belts.pdf"  # 8.3MB (optional)
        ]

    def examine_all_large_files(self):
        """Examine all large files to find content boundaries"""
        print("EXAMINING LARGE MAINTENANCE FILES FOR SPLITTING")
        print("=" * 60)
        print()

        boundaries_found = []

        for filename in self.large_files:
            file_path = self.manual_dir / filename
            if file_path.exists():
                print(f"🔍 Examining: {filename}")
                boundaries = self.find_content_boundaries(file_path)
                boundaries_found.extend(boundaries)
                print()
            else:
                print(f"❌ File not found: {filename}")

        return boundaries_found

    def find_content_boundaries(self, pdf_path: Path):
        """Find logical content boundaries in a PDF"""
        try:
            doc = fitz.open(str(pdf_path))
            total_pages = doc.page_count

            print(f"   📄 Pages: {total_pages}")
            print(f"   📊 Size: {pdf_path.stat().st_size / (1024*1024):.1f}MB")
            print()

            boundaries = []

            # Sample pages throughout the document to find section breaks
            sample_pages = self.get_sample_pages(total_pages)

            print("   Content samples:")
            for page_num in sample_pages:
                if page_num <= total_pages:
                    page = doc[page_num - 1]  # Convert to 0-based
                    text = page.get_text()[:200].replace('\n', ' ').strip()

                    # Look for section indicators
                    is_section_start = self.is_section_boundary(text)
                    indicator = "🔸" if is_section_start else "   "

                    print(f"   {indicator} Page {page_num:3d}: {text[:80]}...")

                    if is_section_start:
                        boundaries.append({
                            'file': pdf_path.name,
                            'page': page_num,
                            'content': text[:100],
                            'boundary_type': self.get_boundary_type(text)
                        })

            doc.close()

            # Suggest logical splits
            suggested_splits = self.suggest_splits(pdf_path.name, boundaries, total_pages)

            print(f"   💡 Suggested splits:")
            for split in suggested_splits:
                print(f"      {split['start']:3d}-{split['end']:3d}: {split['title']}")

            return suggested_splits

        except Exception as e:
            print(f"   ❌ Error examining {pdf_path.name}: {e}")
            return []

    def get_sample_pages(self, total_pages: int) -> list:
        """Get strategic page samples for boundary detection"""
        if total_pages <= 10:
            return list(range(1, total_pages + 1))

        # Sample first, last, and evenly distributed pages
        samples = [1]  # Always include first page

        # Add evenly distributed samples
        step = max(1, total_pages // 15)  # About 15 samples max
        for i in range(step, total_pages, step):
            samples.append(i)

        # Always include last page
        if total_pages not in samples:
            samples.append(total_pages)

        return sorted(samples)

    def is_section_boundary(self, text: str) -> bool:
        """Detect if text indicates a section boundary"""
        text_lower = text.lower()

        # Common section indicators in maintenance manuals
        section_indicators = [
            "contents",
            "chapter",
            "section",
            "part ",
            "procedure",
            "maintenance",
            "service",
            "inspection",
            "adjustment",
            "removal",
            "installation",
            "troubleshooting",
            "specifications",
            "tools required",
            "safety"
        ]

        # Check for numbered sections
        import re
        if re.match(r'^\s*\d+[\.\s]', text):
            return True

        # Check for section indicators at start
        for indicator in section_indicators:
            if text_lower.startswith(indicator):
                return True

        return False

    def get_boundary_type(self, text: str) -> str:
        """Classify the type of boundary"""
        text_lower = text.lower()

        if "contents" in text_lower:
            return "table_of_contents"
        elif "chapter" in text_lower:
            return "chapter_start"
        elif "procedure" in text_lower or "maintenance" in text_lower:
            return "procedure_start"
        elif "specifications" in text_lower:
            return "specifications"
        elif "safety" in text_lower:
            return "safety_section"
        else:
            return "section_break"

    def suggest_splits(self, filename: str, boundaries: list, total_pages: int) -> list:
        """Suggest logical splits based on filename and boundaries"""
        splits = []

        if "General" in filename:
            # 00 - General.pdf likely contains multiple topics
            splits = [
                {'start': 1, 'end': 10, 'title': 'General Information', 'slug': '00_General_Info'},
                {'start': 11, 'end': 25, 'title': 'Safety Procedures', 'slug': '00_Safety'},
                {'start': 26, 'end': 40, 'title': 'Specifications', 'slug': '00_Specifications'},
                {'start': 41, 'end': total_pages, 'title': 'General Maintenance', 'slug': '00_General_Maintenance'}
            ]

        elif "Body" in filename:
            # 60 - Body.pdf contains cab, doors, windows, etc.
            page_per_section = total_pages // 4
            splits = [
                {'start': 1, 'end': page_per_section, 'title': 'Cab Structure', 'slug': '60_Cab_Structure'},
                {'start': page_per_section + 1, 'end': page_per_section * 2, 'title': 'Doors Windows', 'slug': '60_Doors_Windows'},
                {'start': page_per_section * 2 + 1, 'end': page_per_section * 3, 'title': 'Seats Interior', 'slug': '60_Seats_Interior'},
                {'start': page_per_section * 3 + 1, 'end': total_pages, 'title': 'Body Panels', 'slug': '60_Body_Panels'}
            ]

        elif "Brakes - Hydraulic + Mechanical" in filename:
            # Split hydraulic and mechanical brake systems
            mid_point = total_pages // 2
            splits = [
                {'start': 1, 'end': mid_point, 'title': 'Hydraulic Brakes Maintenance', 'slug': '42_Brakes_Hydraulic'},
                {'start': mid_point + 1, 'end': total_pages, 'title': 'Mechanical Brakes Maintenance', 'slug': '42_Brakes_Mechanical'}
            ]

        elif "Special Equipment" in filename:
            # Multiple equipment types
            page_per_section = max(1, total_pages // 3)
            splits = [
                {'start': 1, 'end': page_per_section, 'title': 'Hydraulic Equipment', 'slug': '55_Hydraulic_Equipment'},
                {'start': page_per_section + 1, 'end': page_per_section * 2, 'title': 'Electrical Equipment', 'slug': '55_Electrical_Equipment'},
                {'start': page_per_section * 2 + 1, 'end': total_pages, 'title': 'Mechanical Equipment', 'slug': '55_Mechanical_Equipment'}
            ]

        elif "Air Compressor + Belts" in filename:
            # Split air compressor and belt systems
            mid_point = total_pages // 2
            splits = [
                {'start': 1, 'end': mid_point, 'title': 'Air Compressor Maintenance', 'slug': '13_Air_Compressor'},
                {'start': mid_point + 1, 'end': total_pages, 'title': 'Belt System Maintenance', 'slug': '13_Belt_System'}
            ]

        # Adjust splits based on discovered boundaries
        if boundaries:
            # Use actual boundaries to refine splits
            boundary_pages = [b['page'] for b in boundaries]
            # Logic to adjust splits based on actual content boundaries
            # This would require more sophisticated analysis

        return splits

def main():
    manual_dir = "/Users/thabonel/Documents/Unimog Manuals/Unimog 435 Maintenance Manual - English"

    try:
        examiner = MaintenanceContentExaminer(manual_dir)
        boundaries = examiner.examine_all_large_files()

        print("\n" + "=" * 60)
        print("SUMMARY OF SUGGESTED SPLITS")
        print("=" * 60)

        # Save results for CSV creation
        output_file = "/Users/thabonel/Code/unimogcommunityhub/docs/barry-manual-system/maintenance_content_analysis.txt"
        with open(output_file, 'w') as f:
            f.write("Maintenance Manual Content Analysis\n")
            f.write("=" * 50 + "\n\n")

            for boundary in boundaries:
                f.write(f"File: {boundary['file']}\n")
                f.write(f"Start Page: {boundary['start']}\n")
                f.write(f"End Page: {boundary['end']}\n")
                f.write(f"Title: {boundary['title']}\n")
                f.write(f"Slug: {boundary['slug']}\n")
                f.write(f"Content sample: {boundary.get('content', 'N/A')}\n")
                f.write("\n" + "-" * 30 + "\n\n")

        print(f"\n📊 Analysis saved to: {output_file}")
        print(f"Next step: Create maintenance_chapters.csv based on these findings")

    except Exception as e:
        print(f"❌ Error: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()