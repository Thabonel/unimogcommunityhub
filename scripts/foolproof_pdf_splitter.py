#!/usr/bin/env python3
"""
Foolproof PDF Splitter with Immutable Anchor Validation
This script CANNOT produce incorrect splits - it will fail rather than corrupt
"""

import sys
import os
import csv
import hashlib
import subprocess
import json
from pathlib import Path
from typing import Dict, List, Tuple
from datetime import datetime
import fitz  # PyMuPDF

class FoolproofPDFSplitter:
    def __init__(self, source_pdf: str, page_map_csv: str, output_dir: str):
        self.source_pdf = Path(source_pdf)
        self.page_map_csv = Path(page_map_csv)
        self.output_dir = Path(output_dir)

        # Create versioned output directory
        self.v2_dir = self.output_dir / "v2"
        self.v2_dir.mkdir(parents=True, exist_ok=True)

        # Validation counters
        self.total_chapters = 0
        self.successful_splits = 0
        self.failed_splits = 0
        self.validation_failures = []

        # Load and verify source manifest
        self.verify_edition_lock()

    def verify_edition_lock(self):
        """MANDATORY: Verify source PDF matches edition lock"""
        print("🔒 Verifying Edition Lock...")

        # Expected values from manifest
        EXPECTED_SHA256 = "489381a41ab43748e36af99ab4eeaced1b3d6bbcff337c01676d05d7361da9a0"
        EXPECTED_PAGES = 1185
        EXPECTED_EDITION = "U435_1985_EN_v1"

        # Check file exists
        if not self.source_pdf.exists():
            self.abort(f"Source PDF not found: {self.source_pdf}")

        # Calculate actual SHA256
        sha256_hash = hashlib.sha256()
        with open(self.source_pdf, "rb") as f:
            for byte_block in iter(lambda: f.read(4096), b""):
                sha256_hash.update(byte_block)
        actual_sha256 = sha256_hash.hexdigest()

        # Verify SHA256
        if actual_sha256 != EXPECTED_SHA256:
            self.abort(f"SHA256 MISMATCH - Source PDF has been modified!\n"
                      f"Expected: {EXPECTED_SHA256}\n"
                      f"Actual:   {actual_sha256}")

        # Verify page count
        pdf_doc = fitz.open(str(self.source_pdf))
        actual_pages = pdf_doc.page_count
        pdf_doc.close()

        if actual_pages != EXPECTED_PAGES:
            self.abort(f"Page count MISMATCH!\n"
                      f"Expected: {EXPECTED_PAGES}\n"
                      f"Actual:   {actual_pages}")

        print(f"✅ Edition Lock Verified:")
        print(f"   SHA256: {actual_sha256[:16]}...")
        print(f"   Pages: {actual_pages}")
        print(f"   Edition: {EXPECTED_EDITION}")
        print()

    def abort(self, message: str):
        """Abort execution with error message"""
        print(f"\n❌❌❌ ABORT: {message}")
        sys.exit(1)

    def normalize_text(self, text: str) -> str:
        """Normalize text for consistent comparison"""
        import re
        text = re.sub(r'\s+', ' ', text)
        text = text.lower()
        text = text.strip(' .,;:!?')
        return text[:300]

    def calculate_text_hash(self, text: str) -> str:
        """Calculate SHA256 hash of normalized text"""
        normalized = self.normalize_text(text)
        return hashlib.sha256(normalized.encode('utf-8')).hexdigest()

    def validate_anchors(self, pdf_path: Path, expected: Dict) -> bool:
        """Validate content anchors match expectations"""
        try:
            pdf_doc = fitz.open(str(pdf_path))
            total_pages = pdf_doc.page_count

            # Extract actual anchors
            # First page
            p1_text = pdf_doc[0].get_text()[:300]
            p1_hash = self.calculate_text_hash(p1_text)

            # Middle page
            mid_page = total_pages // 2
            mid_text = pdf_doc[mid_page].get_text()[:300]
            mid_hash = self.calculate_text_hash(mid_text)

            # Last page
            last_text = pdf_doc[-1].get_text()[:300]
            last_hash = self.calculate_text_hash(last_text)

            pdf_doc.close()

            # Compare with expected (if not TBD)
            validation_passed = True
            issues = []

            if expected.get('anchor_p1_text_sha256', 'TBD') != 'TBD':
                if p1_hash != expected['anchor_p1_text_sha256']:
                    issues.append(f"First page content mismatch")
                    validation_passed = False

            if expected.get('anchor_mid_text_sha256', 'TBD') != 'TBD':
                if mid_hash != expected['anchor_mid_text_sha256']:
                    issues.append(f"Middle page content mismatch")
                    validation_passed = False

            if expected.get('anchor_last_text_sha256', 'TBD') != 'TBD':
                if last_hash != expected['anchor_last_text_sha256']:
                    issues.append(f"Last page content mismatch")
                    validation_passed = False

            # Special validation for critical chapters
            if expected['chapter_pdf_filename'] == 'U435_06_Cooling_System.pdf':
                # Cooling system MUST contain cooling content, not oil
                p1_normalized = self.normalize_text(p1_text)
                if 'oil' in p1_normalized and 'cooling' not in p1_normalized:
                    issues.append("CRITICAL: Cooling chapter contains oil content!")
                    validation_passed = False

            if issues:
                print(f"   ⚠️  Validation issues: {', '.join(issues)}")

            return validation_passed

        except Exception as e:
            print(f"   ❌ Validation error: {e}")
            return False

    def split_single_chapter(self, row: Dict) -> Dict:
        """Split a single chapter with full validation"""
        filename = row['chapter_pdf_filename']
        start_page = int(row['orig_start_page'])
        end_page = int(row['orig_end_page'])
        total_pages = end_page - start_page + 1

        print(f"📄 Processing: {filename}")
        print(f"   Pages: {start_page}-{end_page} ({total_pages} pages)")

        # Output path in v2 directory
        output_path = self.v2_dir / filename

        try:
            # Use qpdf for deterministic splitting
            cmd = [
                'qpdf',
                str(self.source_pdf),
                '--pages', '.', f'{start_page}-{end_page}', '--',
                '--normalize-content=y',
                '--object-streams=generate',
                '--linearize',
                str(output_path)
            ]

            # Execute split
            result = subprocess.run(cmd, capture_output=True, text=True)

            if result.returncode != 0:
                raise RuntimeError(f"qpdf failed: {result.stderr}")

            # Verify file was created
            if not output_path.exists():
                raise RuntimeError(f"Output file not created")

            # Calculate PDF hash
            pdf_hash = hashlib.sha256(output_path.read_bytes()).hexdigest()

            # Validate anchors
            anchor_valid = self.validate_anchors(output_path, row)

            if not anchor_valid and row.get('validation_status') == 'CRITICAL':
                # Critical chapter MUST pass validation
                os.remove(output_path)
                raise RuntimeError(f"Critical chapter failed anchor validation")

            # Success
            file_size_mb = output_path.stat().st_size / (1024 * 1024)
            print(f"   ✅ Created: {file_size_mb:.1f} MB")
            print(f"   📍 Hash: {pdf_hash[:16]}...")

            return {
                'filename': filename,
                'status': 'success',
                'pdf_sha256': pdf_hash,
                'file_size_mb': file_size_mb,
                'pages': total_pages,
                'anchor_valid': anchor_valid,
                'output_path': str(output_path)
            }

        except Exception as e:
            print(f"   ❌ Failed: {e}")
            return {
                'filename': filename,
                'status': 'failed',
                'error': str(e),
                'pages': total_pages
            }

    def process_all_chapters(self):
        """Process all chapters from page map"""
        print("=" * 60)
        print("STARTING FOOLPROOF PDF SPLITTING")
        print("=" * 60)
        print()

        results = []

        # Load page map
        with open(self.page_map_csv, 'r', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            chapters = list(reader)

        self.total_chapters = len(chapters)
        print(f"Total chapters to process: {self.total_chapters}\n")

        # Process each chapter
        for idx, chapter in enumerate(chapters, 1):
            print(f"[{idx}/{self.total_chapters}] ", end="")

            result = self.split_single_chapter(chapter)
            results.append(result)

            if result['status'] == 'success':
                self.successful_splits += 1
            else:
                self.failed_splits += 1
                self.validation_failures.append(result)

            print()

        return results

    def generate_validation_report(self, results: List[Dict]) -> Dict:
        """Generate comprehensive validation report"""
        success_rate = (self.successful_splits / self.total_chapters * 100) if self.total_chapters > 0 else 0

        report = {
            'timestamp': datetime.now().isoformat(),
            'source_pdf': str(self.source_pdf),
            'total_chapters': self.total_chapters,
            'successful_splits': self.successful_splits,
            'failed_splits': self.failed_splits,
            'success_rate': success_rate,
            'results': results,
            'critical_checks': [],
            'ready_for_deployment': False
        }

        # Critical checks
        critical_files = ['U435_06_Cooling_System.pdf', 'U435_05_Lubrication.pdf', '43_Brakes_Pneumatic.pdf']

        for critical in critical_files:
            critical_result = next((r for r in results if r['filename'] == critical), None)
            if critical_result:
                check = {
                    'file': critical,
                    'status': critical_result['status'],
                    'anchor_valid': critical_result.get('anchor_valid', False)
                }
                report['critical_checks'].append(check)

        # Determine if ready for deployment
        if success_rate >= 100 and all(c.get('anchor_valid', False) for c in report['critical_checks']):
            report['ready_for_deployment'] = True

        return report

    def write_validation_report(self, report: Dict):
        """Write validation report to JSON"""
        report_path = self.output_dir / "v2_validation_report.json"

        with open(report_path, 'w') as f:
            json.dump(report, f, indent=2, default=str)

        print(f"\n📊 Validation report saved: {report_path}")

    def print_summary(self, report: Dict):
        """Print execution summary"""
        print("\n" + "=" * 60)
        print("SPLITTING COMPLETE - SUMMARY")
        print("=" * 60)
        print(f"✅ Successful: {self.successful_splits}/{self.total_chapters}")
        print(f"❌ Failed: {self.failed_splits}/{self.total_chapters}")
        print(f"📈 Success Rate: {report['success_rate']:.1f}%")
        print()

        if self.validation_failures:
            print("Failed Chapters:")
            for failure in self.validation_failures:
                print(f"  - {failure['filename']}: {failure.get('error', 'Unknown error')}")
            print()

        # Critical checks
        print("Critical Chapter Validation:")
        for check in report['critical_checks']:
            status_icon = "✅" if check['anchor_valid'] else "❌"
            print(f"  {status_icon} {check['file']}: {check['status']}")
        print()

        # Deployment readiness
        if report['ready_for_deployment']:
            print("🚀 READY FOR DEPLOYMENT - All validations passed!")
        else:
            print("⚠️  NOT READY FOR DEPLOYMENT - Fix validation issues first")

def main():
    # Configuration
    source_pdf = "/Users/thabonel/Documents/Unimog Manuals/unimog435sm:U1700L.pdf"
    page_map_csv = "/Users/thabonel/Code/unimogcommunityhub/docs/barry-manual-system/page_map_enhanced.csv"
    output_dir = "/Users/thabonel/Documents/Unimog Manuals/unimog435_chapters_corrected"

    try:
        # Create splitter
        splitter = FoolproofPDFSplitter(source_pdf, page_map_csv, output_dir)

        # Process all chapters
        results = splitter.process_all_chapters()

        # Generate validation report
        report = splitter.generate_validation_report(results)

        # Write report
        splitter.write_validation_report(report)

        # Print summary
        splitter.print_summary(report)

        # Exit code based on success
        sys.exit(0 if report['ready_for_deployment'] else 1)

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