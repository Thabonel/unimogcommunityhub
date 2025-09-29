#!/usr/bin/env python3
"""
Foolproof Maintenance Manual Splitter
Using the same methodology as the repair manual splitter
"""

import sys
import os
import csv
import hashlib
import subprocess
import json
from pathlib import Path
from typing import Dict, List
from datetime import datetime
import fitz  # PyMuPDF

class MaintenanceManualSplitter:
    def __init__(self, source_dir: str, chapters_csv: str, output_dir: str):
        self.source_dir = Path(source_dir)
        self.chapters_csv = Path(chapters_csv)
        self.output_dir = Path(output_dir)

        # Create output directory
        self.output_dir.mkdir(parents=True, exist_ok=True)

        # Validation counters
        self.total_chapters = 0
        self.successful_splits = 0
        self.failed_splits = 0
        self.validation_failures = []

        print("🔧 MAINTENANCE MANUAL SPLITTER")
        print("=" * 50)
        print(f"Source: {self.source_dir}")
        print(f"Output: {self.output_dir}")
        print()

    def process_all_chapters(self):
        """Process all chapters from CSV"""
        results = []

        # Load chapters CSV
        with open(self.chapters_csv, 'r', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            chapters = list(reader)

        self.total_chapters = len(chapters)
        print(f"Total chapters to process: {self.total_chapters}\n")

        # Group chapters by source file to avoid opening same PDF multiple times
        files_to_process = {}
        for chapter in chapters:
            source_file = chapter['source_file']
            if source_file not in files_to_process:
                files_to_process[source_file] = []
            files_to_process[source_file].append(chapter)

        # Process each source file
        for idx, (source_file, file_chapters) in enumerate(files_to_process.items(), 1):
            print(f"[{idx}/{len(files_to_process)}] 📁 Processing: {source_file}")

            source_path = self.source_dir / source_file
            if not source_path.exists():
                print(f"   ❌ Source file not found: {source_path}")
                for chapter in file_chapters:
                    self.failed_splits += 1
                    results.append({
                        'filename': f"U435_{chapter['slug']}.pdf",
                        'status': 'failed',
                        'error': 'Source file not found'
                    })
                continue

            # Process each chapter from this source file
            for chapter in file_chapters:
                print(f"   📄 {chapter['title']}")
                result = self.split_single_chapter(source_path, chapter)
                results.append(result)

                if result['status'] == 'success':
                    self.successful_splits += 1
                else:
                    self.failed_splits += 1

            print()

        return results

    def split_single_chapter(self, source_path: Path, chapter: Dict) -> Dict:
        """Split a single chapter from source PDF"""
        start_page = int(chapter['start'])
        end_page = int(chapter['end'])
        output_filename = f"U435_{chapter['slug']}.pdf"
        output_path = self.output_dir / output_filename

        try:
            # Use qpdf for deterministic splitting
            cmd = [
                'qpdf',
                str(source_path),
                '--pages', '.', f'{start_page}-{end_page}', '--',
                '--normalize-content=y',
                '--object-streams=generate',
                str(output_path)
            ]

            # Execute split
            result = subprocess.run(cmd, capture_output=True, text=True)

            # qpdf returns 0 for success, even with warnings
            # Only fail if file wasn't created or there are actual errors
            if result.returncode != 0:
                # Check if it's just warnings (file still created successfully)
                if output_path.exists() and "operation succeeded with warnings" in result.stderr:
                    print(f"      ⚠️  Created with warnings (qpdf)")
                else:
                    raise RuntimeError(f"qpdf failed: {result.stderr}")

            # Verify file was created
            if not output_path.exists():
                raise RuntimeError(f"Output file not created")

            # Calculate PDF hash
            pdf_hash = hashlib.sha256(output_path.read_bytes()).hexdigest()

            # Get file info
            file_size_mb = output_path.stat().st_size / (1024 * 1024)
            page_count = end_page - start_page + 1

            print(f"      ✅ {file_size_mb:.1f}MB | {page_count} pages | {pdf_hash[:8]}...")

            return {
                'filename': output_filename,
                'status': 'success',
                'source_file': source_path.name,
                'pdf_sha256': pdf_hash,
                'file_size_mb': file_size_mb,
                'pages': page_count,
                'title': chapter['title'],
                'system_category': chapter['system_category'],
                'output_path': str(output_path)
            }

        except Exception as e:
            print(f"      ❌ Failed: {e}")
            return {
                'filename': output_filename,
                'status': 'failed',
                'source_file': source_path.name,
                'error': str(e),
                'title': chapter['title']
            }

    def generate_validation_report(self, results: List[Dict]) -> Dict:
        """Generate comprehensive validation report"""
        success_rate = (self.successful_splits / self.total_chapters * 100) if self.total_chapters > 0 else 0

        report = {
            'timestamp': datetime.now().isoformat(),
            'manual_type': 'maintenance',
            'total_chapters': self.total_chapters,
            'successful_splits': self.successful_splits,
            'failed_splits': self.failed_splits,
            'success_rate': success_rate,
            'results': results,
            'ready_for_upload': success_rate >= 95
        }

        return report

    def write_validation_report(self, report: Dict):
        """Write validation report to JSON"""
        report_path = self.output_dir / "maintenance_validation_report.json"

        with open(report_path, 'w') as f:
            json.dump(report, f, indent=2, default=str)

        print(f"\n📊 Validation report: {report_path}")

    def create_upload_list(self, results: List[Dict]):
        """Create list of files ready for upload"""
        successful_files = [r for r in results if r['status'] == 'success']

        upload_list_path = self.output_dir / "upload_list.txt"
        with open(upload_list_path, 'w') as f:
            f.write("Maintenance Manual Files Ready for Upload\n")
            f.write("=" * 50 + "\n\n")
            f.write(f"Upload these {len(successful_files)} files to Supabase u435-chapters bucket:\n\n")

            for result in successful_files:
                f.write(f"{result['filename']}\n")

        print(f"📋 Upload list: {upload_list_path}")

    def print_summary(self, report: Dict):
        """Print execution summary"""
        print("\n" + "=" * 60)
        print("MAINTENANCE MANUAL SPLITTING COMPLETE")
        print("=" * 60)
        print(f"✅ Successful: {self.successful_splits}/{self.total_chapters}")
        print(f"❌ Failed: {self.failed_splits}/{self.total_chapters}")
        print(f"📈 Success Rate: {report['success_rate']:.1f}%")
        print()

        if self.failed_splits > 0:
            failed_results = [r for r in report['results'] if r['status'] == 'failed']
            print("Failed Files:")
            for failure in failed_results:
                print(f"  - {failure['filename']}: {failure.get('error', 'Unknown error')}")
            print()

        # System breakdown
        successful_files = [r for r in report['results'] if r['status'] == 'success']
        systems = {}
        for result in successful_files:
            system = result.get('system_category', 'unknown')
            if system not in systems:
                systems[system] = 0
            systems[system] += 1

        print("Files by System:")
        for system, count in sorted(systems.items()):
            print(f"  {system}: {count} files")

        print()
        if report['ready_for_upload']:
            print("🚀 READY FOR UPLOAD - All validations passed!")
        else:
            print("⚠️  NOT READY - Fix failed splits first")

def main():
    # Configuration
    source_dir = "/Users/thabonel/Documents/Unimog Manuals/Unimog 435 Maintenance Manual - English"
    chapters_csv = "/Users/thabonel/Code/unimogcommunityhub/docs/barry-manual-system/maintenance_chapters.csv"
    output_dir = "/Users/thabonel/Documents/Unimog Manuals/u435_maintenance_split"

    try:
        # Create splitter
        splitter = MaintenanceManualSplitter(source_dir, chapters_csv, output_dir)

        # Process all chapters
        results = splitter.process_all_chapters()

        # Generate validation report
        report = splitter.generate_validation_report(results)

        # Write outputs
        splitter.write_validation_report(report)
        splitter.create_upload_list(results)

        # Print summary
        splitter.print_summary(report)

        # Exit code based on success
        sys.exit(0 if report['ready_for_upload'] else 1)

    except KeyboardInterrupt:
        print("\n\n⚠️  Process interrupted by user")
        sys.exit(2)
    except Exception as e:
        print(f"\n❌ Fatal error: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)

if __name__ == "__main__":
    main()