#!/usr/bin/env python3
"""
U435 Workshop Manual Chapter Splitter
Splits the complete U435 PDF into 41 precise parts based on chapters.csv file.
"""

import os
import sys
import csv
from pathlib import Path
from typing import Dict, List, Tuple
import fitz  # PyMuPDF
import argparse

class U435ChapterSplitter:
    def __init__(self, input_pdf_path: str, output_dir: str, chapters_csv_path: str = None):
        self.input_pdf_path = Path(input_pdf_path)
        self.output_dir = Path(output_dir)
        self.output_dir.mkdir(parents=True, exist_ok=True)

        # Default chapters CSV path
        if chapters_csv_path:
            self.chapters_csv_path = Path(chapters_csv_path)
        else:
            # Look for chapters.csv in standard locations
            possible_paths = [
                Path("/Users/thabonel/Documents/Unimog Manuals/chapters.csv"),
                Path.cwd() / "chapters.csv",
                Path(__file__).parent / "chapters.csv"
            ]
            self.chapters_csv_path = None
            for path in possible_paths:
                if path.exists():
                    self.chapters_csv_path = path
                    break

            if not self.chapters_csv_path:
                raise FileNotFoundError("chapters.csv not found. Please provide path with --chapters-csv")

        print(f"📋 Using chapters CSV: {self.chapters_csv_path}")

    def get_chapter_mappings(self) -> List[Dict]:
        """Read chapter mappings from chapters.csv file"""
        chapters = []

        try:
            with open(self.chapters_csv_path, 'r', encoding='utf-8') as csvfile:
                reader = csv.DictReader(csvfile)
                chapter_num = 1

                for row in reader:
                    start_page = int(row['start'])
                    end_page = int(row['end'])
                    slug = row['slug']
                    title = row['title']

                    # Create filename from slug
                    filename = f"U435_{slug}.pdf"

                    # Determine priority based on title keywords
                    priority = 'standard'
                    title_lower = title.lower()
                    if 'wheel hub' in title_lower:
                        priority = 'critical'
                    elif any(keyword in title_lower for keyword in ['engine', 'transmission', 'brake', 'heating']):
                        priority = 'high'

                    # Determine volume (pages 1-467 = volume 1, 468+ = volume 2)
                    volume = 1 if start_page <= 467 else 2

                    chapter = {
                        'filename': filename,
                        'start_page': start_page,
                        'end_page': end_page,
                        'volume': volume,
                        'title': title,
                        'slug': slug,
                        'priority': priority,
                        'chapter_num': chapter_num
                    }

                    chapters.append(chapter)
                    chapter_num += 1

            print(f"📋 Loaded {len(chapters)} chapters from CSV")
            return chapters

        except Exception as e:
            print(f"❌ Error reading chapters CSV: {e}")
            return []

    def split_pdf_into_chapters(self, dry_run: bool = False) -> bool:
        """Split the U435 PDF into individual chapter files"""
        try:
            print(f"📖 Opening U435 PDF: {self.input_pdf_path}")

            # Validate input PDF exists
            if not self.input_pdf_path.exists():
                print(f"❌ Input PDF not found: {self.input_pdf_path}")
                return False

            # Open PDF with PyMuPDF
            pdf_doc = fitz.open(self.input_pdf_path)
            total_pages = pdf_doc.page_count
            print(f"📊 Total pages in PDF: {total_pages}")

            chapters = self.get_chapter_mappings()
            if not chapters:
                print("❌ No chapters loaded from CSV")
                pdf_doc.close()
                return False

            print(f"🎯 Splitting into {len(chapters)} parts")

            # Validate page ranges
            self._validate_page_ranges(chapters, total_pages)

            success_count = 0
            for chapter in chapters:
                start_page = chapter['start_page'] - 1  # Convert to 0-based indexing
                end_page = chapter['end_page'] - 1      # Convert to 0-based indexing
                page_count = end_page - start_page + 1

                priority = chapter.get('priority', 'standard')
                priority_icon = '🎯' if priority == 'critical' else '🔥' if priority == 'high' else '📄'

                output_path = self.output_dir / chapter['filename']

                print(f"{priority_icon} Part {chapter['chapter_num']:2d}: {chapter['title']:<35} "
                      f"Pages {chapter['start_page']:4d}-{chapter['end_page']:4d} "
                      f"({page_count:3d} pages) -> {chapter['filename']}")

                if dry_run:
                    continue

                # Validate page range
                if start_page < 0 or end_page >= total_pages or start_page > end_page:
                    print(f"❌ Invalid page range for {chapter['filename']}: "
                          f"{start_page+1}-{end_page+1} (PDF has {total_pages} pages)")
                    continue

                # Create new PDF for this chapter
                chapter_pdf = fitz.open()
                chapter_pdf.insert_pdf(pdf_doc, from_page=start_page, to_page=end_page)

                # Save chapter PDF
                chapter_pdf.save(output_path)
                chapter_pdf.close()

                # Verify file was created
                if output_path.exists():
                    file_size = output_path.stat().st_size / (1024 * 1024)  # MB
                    print(f"   ✅ Created: {file_size:.1f} MB")
                    success_count += 1
                else:
                    print(f"   ❌ Failed to create: {output_path}")

            pdf_doc.close()

            if not dry_run:
                print(f"\n🎉 Successfully split U435 PDF into {success_count}/{len(chapters)} parts!")
                print(f"📁 Output directory: {self.output_dir}")
            else:
                print(f"\n📋 Dry run complete - would create {len(chapters)} part files")

            return success_count == len(chapters)

        except Exception as e:
            print(f"❌ Error splitting PDF: {e}")
            return False

    def _validate_page_ranges(self, chapters: List[Dict], total_pages: int) -> None:
        """Validate that page ranges don't overlap and are within bounds"""
        print("🔍 Validating page ranges...")

        # Check for overlaps and gaps
        sorted_chapters = sorted(chapters, key=lambda x: x['start_page'])

        for i, chapter in enumerate(sorted_chapters):
            # Check if within PDF bounds
            if chapter['start_page'] < 1 or chapter['end_page'] > total_pages:
                print(f"⚠️  Warning: {chapter['filename']} pages {chapter['start_page']}-{chapter['end_page']} "
                      f"outside PDF bounds (1-{total_pages})")

            # Check for overlaps
            if i > 0:
                prev_chapter = sorted_chapters[i-1]
                if chapter['start_page'] <= prev_chapter['end_page']:
                    print(f"⚠️  Warning: Overlap between {prev_chapter['filename']} (ends {prev_chapter['end_page']}) "
                          f"and {chapter['filename']} (starts {chapter['start_page']})")

        print("✅ Page range validation complete")

    def validate_chapters(self) -> bool:
        """Validate that all chapter PDFs were created successfully"""
        chapters = self.get_chapter_mappings()
        missing_chapters = []
        total_size_mb = 0

        if not chapters:
            print("❌ No chapters loaded for validation")
            return False

        print(f"\n🔍 Validating {len(chapters)} part PDFs...")

        for chapter in chapters:
            chapter_path = self.output_dir / chapter['filename']

            if chapter_path.exists():
                file_size = chapter_path.stat().st_size / (1024 * 1024)  # MB
                total_size_mb += file_size
                priority = chapter.get('priority', 'standard')
                icon = '🎯' if priority == 'critical' else '🔥' if priority == 'high' else '✅'
                print(f"{icon} {chapter['filename']:<45} {file_size:6.1f} MB")
            else:
                missing_chapters.append(chapter['filename'])
                print(f"❌ MISSING: {chapter['filename']}")

        print(f"\n📊 Validation Summary:")
        print(f"   Total parts: {len(chapters)}")
        print(f"   Successfully created: {len(chapters) - len(missing_chapters)}")
        print(f"   Missing: {len(missing_chapters)}")
        print(f"   Total size: {total_size_mb:.1f} MB")

        if missing_chapters:
            print(f"\n❌ Missing parts:")
            for filename in missing_chapters:
                print(f"   - {filename}")
            return False

        print(f"\n🎉 All part PDFs validated successfully!")
        return True

def main():
    parser = argparse.ArgumentParser(description='Split U435 Workshop Manual into parts based on chapters.csv')
    parser.add_argument('input_pdf', help='Path to the input U435 PDF file')
    parser.add_argument('output_dir', help='Directory to save part PDFs')
    parser.add_argument('--chapters-csv', help='Path to chapters.csv file (auto-detected if not provided)')
    parser.add_argument('--dry-run', action='store_true',
                        help='Show what would be done without creating files')
    parser.add_argument('--validate-only', action='store_true',
                        help='Only validate existing part files')

    args = parser.parse_args()

    # Check input file exists (unless validate-only)
    if not args.validate_only and not Path(args.input_pdf).exists():
        print(f"❌ Input PDF not found: {args.input_pdf}")
        sys.exit(1)

    try:
        # Create splitter
        splitter = U435ChapterSplitter(args.input_pdf, args.output_dir, args.chapters_csv)

        if args.validate_only:
            success = splitter.validate_chapters()
        else:
            success = splitter.split_pdf_into_chapters(dry_run=args.dry_run)
            if success and not args.dry_run:
                # Also validate after splitting
                splitter.validate_chapters()

        sys.exit(0 if success else 1)

    except FileNotFoundError as e:
        print(f"❌ {e}")
        sys.exit(1)
    except Exception as e:
        print(f"❌ Unexpected error: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()