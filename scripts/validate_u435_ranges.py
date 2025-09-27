#!/usr/bin/env python3
"""
U435 Chapter Range Validator
Validates the chapters.csv file for consistency, gaps, overlaps, and correctness.
"""

import csv
import sys
from pathlib import Path
from typing import List, Dict, Tuple

class U435RangeValidator:
    def __init__(self, chapters_csv_path: str):
        self.chapters_csv_path = Path(chapters_csv_path)
        if not self.chapters_csv_path.exists():
            raise FileNotFoundError(f"chapters.csv not found: {chapters_csv_path}")

    def load_chapters(self) -> List[Dict]:
        """Load chapters from CSV file"""
        chapters = []
        try:
            with open(self.chapters_csv_path, 'r', encoding='utf-8') as csvfile:
                reader = csv.DictReader(csvfile)
                for row in reader:
                    chapters.append({
                        'start_page': int(row['start']),
                        'end_page': int(row['end']),
                        'slug': row['slug'],
                        'title': row['title']
                    })
            return chapters
        except Exception as e:
            print(f"❌ Error loading chapters CSV: {e}")
            return []

    def validate_ranges(self, expected_total_pages: int = 1185) -> bool:
        """Validate page ranges for gaps, overlaps, and coverage"""
        print("🔍 Validating U435 chapter ranges...")

        chapters = self.load_chapters()
        if not chapters:
            return False

        print(f"📋 Loaded {len(chapters)} chapters from CSV")

        # Sort by start page
        sorted_chapters = sorted(chapters, key=lambda x: x['start_page'])

        issues_found = []

        # Check individual chapter ranges
        for chapter in sorted_chapters:
            if chapter['start_page'] > chapter['end_page']:
                issues_found.append(f"❌ Invalid range in {chapter['slug']}: "
                                  f"start {chapter['start_page']} > end {chapter['end_page']}")

            if chapter['start_page'] < 1 or chapter['end_page'] > expected_total_pages:
                issues_found.append(f"⚠️  {chapter['slug']} pages {chapter['start_page']}-{chapter['end_page']} "
                                  f"outside expected bounds (1-{expected_total_pages})")

        # Check for gaps and overlaps
        for i in range(len(sorted_chapters) - 1):
            current = sorted_chapters[i]
            next_chapter = sorted_chapters[i + 1]

            # Check for overlaps
            if current['end_page'] >= next_chapter['start_page']:
                issues_found.append(f"❌ Overlap: {current['slug']} ends at {current['end_page']}, "
                                  f"{next_chapter['slug']} starts at {next_chapter['start_page']}")

            # Check for gaps
            elif current['end_page'] + 1 < next_chapter['start_page']:
                gap_start = current['end_page'] + 1
                gap_end = next_chapter['start_page'] - 1
                issues_found.append(f"⚠️  Gap: pages {gap_start}-{gap_end} not covered "
                                  f"(between {current['slug']} and {next_chapter['slug']})")

        # Check coverage
        first_page = sorted_chapters[0]['start_page']
        last_page = sorted_chapters[-1]['end_page']

        if first_page > 5:  # Pages 1-4 are expected to be cover/TOC, so only warn if starting after page 5
            issues_found.append(f"❌ Missing coverage: pages 1-{first_page-1} not covered")
        elif first_page > 1:
            print(f"ℹ️  Note: pages 1-{first_page-1} not covered (likely cover pages/TOC)")

        if last_page < expected_total_pages:
            issues_found.append(f"⚠️  Missing coverage: pages {last_page+1}-{expected_total_pages} not covered")

        # Report results
        if issues_found:
            print(f"\n❌ Found {len(issues_found)} issues:")
            for issue in issues_found:
                print(f"  {issue}")
            return False
        else:
            print("✅ All chapter ranges validated successfully!")
            print(f"📊 Coverage: pages {first_page}-{last_page} ({last_page - first_page + 1} pages)")
            print(f"🎯 Target chapters found:")

            # Highlight target chapters
            for chapter in sorted_chapters:
                title_lower = chapter['title'].lower()
                slug_lower = chapter['slug'].lower()
                if (any(keyword in title_lower for keyword in ['wheel hub', 'hub drive']) or
                    any(keyword in slug_lower for keyword in ['wheel_hub'])):
                    priority = '🎯 CRITICAL'
                    print(f"  {priority}: {chapter['slug']} - {chapter['title']} "
                          f"(pages {chapter['start_page']}-{chapter['end_page']})")

            return True

    def generate_statistics(self) -> None:
        """Generate statistics about the chapters"""
        chapters = self.load_chapters()
        if not chapters:
            return

        print("\n📊 Chapter Statistics:")

        # Calculate page counts
        page_counts = []
        for chapter in chapters:
            page_count = chapter['end_page'] - chapter['start_page'] + 1
            page_counts.append(page_count)

        total_pages = sum(page_counts)
        avg_pages = total_pages / len(chapters)
        min_pages = min(page_counts)
        max_pages = max(page_counts)

        print(f"  Total chapters: {len(chapters)}")
        print(f"  Total pages: {total_pages}")
        print(f"  Average pages per chapter: {avg_pages:.1f}")
        print(f"  Smallest chapter: {min_pages} pages")
        print(f"  Largest chapter: {max_pages} pages")

        # Find largest and smallest chapters
        sorted_by_size = sorted(zip(chapters, page_counts), key=lambda x: x[1])

        print(f"\n📏 Largest chapters:")
        for chapter, page_count in sorted_by_size[-3:]:
            print(f"  {chapter['slug']}: {page_count} pages - {chapter['title']}")

        print(f"\n📏 Smallest chapters:")
        for chapter, page_count in sorted_by_size[:3]:
            print(f"  {chapter['slug']}: {page_count} pages - {chapter['title']}")

def main():
    if len(sys.argv) < 2:
        print("Usage: python validate_u435_ranges.py <chapters.csv> [total_pages]")
        print("Example: python validate_u435_ranges.py chapters.csv 1185")
        sys.exit(1)

    chapters_csv = sys.argv[1]
    total_pages = int(sys.argv[2]) if len(sys.argv) > 2 else 1185

    try:
        validator = U435RangeValidator(chapters_csv)

        # Validate ranges
        valid = validator.validate_ranges(total_pages)

        # Generate statistics
        validator.generate_statistics()

        sys.exit(0 if valid else 1)

    except Exception as e:
        print(f"❌ Error: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()