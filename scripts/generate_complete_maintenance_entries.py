#!/usr/bin/env python3
"""
Generate Complete U435 Maintenance Manual Database Entries
Creates entries with all required fields for Barry AI integration
"""

import csv
import json
from pathlib import Path
from typing import List, Dict, Set

class CompleteMaintenanceDBGenerator:
    def __init__(self, csv_path: str):
        self.csv_path = Path(csv_path)

        # Base URL for storage
        self.storage_base_url = "https://ydevatqwkoccxhtejdor.supabase.co/storage/v1/object/public/u435-chapters"

        # Starting page number for maintenance manual (after repair manual)
        # Repair manual likely ends around page 1100, so start maintenance at 1200
        self.base_page_number = 1200

        # Starting chapter number for maintenance manual
        # Repair manual likely has ~33 chapters, so start maintenance at 100
        self.base_chapter_number = 100

        # Maintenance-specific keywords by category
        self.maintenance_keywords = {
            'general': [
                'maintenance', 'service', 'inspection', 'check', 'adjustment',
                'procedure', 'general maintenance', 'preventive maintenance',
                'routine maintenance', 'scheduled maintenance', 'safety'
            ],
            'engine': [
                'engine maintenance', 'engine service', 'engine timing',
                'engine housing', 'engine mount', 'mount maintenance',
                'timing maintenance', 'belt system', 'drive belts', 'exhaust'
            ],
            'fuel': [
                'fuel injector maintenance', 'injector service', 'fuel injection',
                'air filter maintenance', 'air filter service', 'air filter replacement',
                'fuel system maintenance', 'air filter', 'filter', 'air cleaner'
            ],
            'lubrication': [
                'engine lubrication', 'oil maintenance', 'oil service',
                'lubrication system', 'oil level check', 'oil change',
                'lubrication maintenance', 'oil level', 'engine oil'
            ],
            'cooling': [
                'cooling system maintenance', 'coolant level check', 'coolant service',
                'radiator maintenance', 'cooling maintenance', 'coolant replacement',
                'coolant level', 'radiator', 'coolant', 'cooling system', 'thermostat'
            ],
            'brakes': [
                'brake maintenance', 'hydraulic brake maintenance', 'mechanical brake maintenance',
                'pneumatic brake maintenance', 'brake service', 'brake inspection',
                'air compressor maintenance', 'compressor service', 'pedal linkage',
                'brake fluid', 'brake adjustment', 'air brake service'
            ],
            'transmission': [
                'transmission maintenance', 'clutch maintenance', 'clutch service',
                'transmission service', 'clutch adjustment', 'gearbox maintenance'
            ],
            'suspension': [
                'suspension maintenance', 'suspension service', 'suspension inspection',
                'shock absorber', 'spring'
            ],
            'axles': [
                'axle maintenance', 'front axle maintenance', 'rear axle maintenance',
                'wheel maintenance', 'prop shaft maintenance', 'drive shaft maintenance',
                'front axle', 'rear axle', 'wheels', 'differential'
            ],
            'steering': [
                'steering maintenance', 'steering service', 'steering inspection',
                'steering adjustment', 'steering wheel', 'steering box'
            ],
            'electrical': [
                'battery maintenance', 'electrical maintenance', 'headlight maintenance',
                'electrical equipment', 'battery service', 'battery', 'electrical system'
            ],
            'hydraulic': [
                'hydraulic equipment maintenance', 'hydraulic service',
                'hydraulic system maintenance', 'hydraulic system', 'hydraulic pump'
            ],
            'body': [
                'cab maintenance', 'body maintenance', 'door maintenance',
                'window maintenance', 'seat maintenance', 'interior maintenance',
                'body panel maintenance', 'cab', 'door', 'window', 'seat', 'body panel'
            ]
        }

    def load_maintenance_chapters(self) -> List[Dict]:
        """Load maintenance chapter definitions from CSV"""
        chapters = []
        with open(self.csv_path, 'r', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            for row in reader:
                chapters.append({
                    'slug': row['slug'],
                    'title': row['title'],
                    'filename': f"U435_{row['slug']}.pdf",
                    'system_category': row['system_category'],
                    'start_page': int(row['start']),
                    'end_page': int(row['end'])
                })
        return chapters

    def generate_search_terms(self, chapter: Dict) -> Set[str]:
        """Generate comprehensive search terms for a chapter"""
        terms = set()

        # Add maintenance-specific keywords for the system category
        if chapter['system_category'] in self.maintenance_keywords:
            terms.update(self.maintenance_keywords[chapter['system_category']])

        # Add specific terms based on chapter slug
        slug_lower = chapter['slug'].lower()

        # Extract key components from slug
        if 'air_compressor' in slug_lower:
            terms.update(['air compressor', 'compressor', 'compressed air'])
        elif 'belt_system' in slug_lower:
            terms.update(['belt', 'drive belt', 'belt tension'])
        elif 'cooling' in slug_lower:
            terms.update(['cooling', 'coolant check', 'radiator check'])
        elif 'lubrication' in slug_lower:
            terms.update(['oil check', 'oil service', 'lubrication check'])
        elif 'fuel_injectors' in slug_lower:
            terms.update(['fuel injector', 'injector'])
        elif 'transmission' in slug_lower:
            terms.update(['transmission', 'gearbox'])
        elif 'clutch' in slug_lower:
            terms.update(['clutch'])
        elif 'brake' in slug_lower:
            if 'hydraulic' in slug_lower:
                terms.update(['hydraulic brake', 'brake fluid'])
            elif 'mechanical' in slug_lower:
                terms.update(['mechanical brake'])
            elif 'pneumatic' in slug_lower:
                terms.update(['air brake', 'pneumatic brake'])
        elif 'axle' in slug_lower:
            if 'front' in slug_lower:
                terms.update(['front axle'])
            elif 'rear' in slug_lower:
                terms.update(['rear axle'])
        elif 'steering' in slug_lower:
            terms.update(['steering'])
        elif 'suspension' in slug_lower:
            terms.update(['suspension'])
        elif 'battery' in slug_lower or 'batteries' in slug_lower:
            terms.update(['battery'])
        elif 'hydraulic_equipment' in slug_lower:
            terms.update(['hydraulic equipment'])
        elif 'electrical_equipment' in slug_lower:
            terms.update(['electrical equipment'])
        elif 'cab' in slug_lower or 'body' in slug_lower:
            terms.update(['cab', 'body'])

        # Remove very short terms and common stop words
        stop_words = {'the', 'and', 'or', 'of', 'to', 'in', 'for', 'on', 'with', 'by', 'a', 'an'}
        terms = {term for term in terms if term not in stop_words and len(term) > 2}

        return terms

    def create_complete_database_entries(self) -> List[Dict]:
        """Create complete database entries with all required fields"""
        chapters = self.load_maintenance_chapters()
        entries = []

        current_page_number = self.base_page_number
        current_chapter_number = self.base_chapter_number

        for chapter_idx, chapter in enumerate(chapters):
            # Calculate chapter-specific values
            chapter_number = current_chapter_number + chapter_idx
            pdf_page_span = chapter['end_page'] - chapter['start_page'] + 1

            # Generate search terms
            search_terms = self.generate_search_terms(chapter)

            # Create entries for each search term
            for term_idx, term in enumerate(search_terms):
                # Distribute terms across the page range
                pdf_page_offset = (term_idx * pdf_page_span) // len(search_terms) if len(search_terms) > 0 else 0
                pdf_page_number = min(chapter['start_page'] + pdf_page_offset, chapter['end_page'])
                page_number = current_page_number + pdf_page_offset

                # Create storage URL with page anchor
                storage_url = f"{self.storage_base_url}/{chapter['filename']}#page={pdf_page_number}"

                entries.append({
                    'term': term,
                    'page_number': page_number,
                    'chapter_filename': chapter['filename'],
                    'chapter_number': chapter_number,
                    'pdf_page_number': pdf_page_number,
                    'storage_url': storage_url,
                    'system_category': chapter['system_category']
                })

            # Advance page number for next chapter
            current_page_number += pdf_page_span + 5  # Add some spacing between chapters

        return entries

    def generate_complete_sql_insert(self, entries: List[Dict]) -> str:
        """Generate complete SQL INSERT statement with all required fields"""
        sql_lines = [
            "-- U435 Maintenance Manual Complete Database Entries",
            "-- Generated for Barry AI Integration with all required fields",
            "",
            "INSERT INTO u435_manual_index (term, page_number, chapter_filename, chapter_number, pdf_page_number, storage_url, system_category) VALUES"
        ]

        # Group entries to avoid huge single statement
        batch_size = 50
        for i in range(0, len(entries), batch_size):
            batch = entries[i:i + batch_size]

            if i > 0:
                sql_lines.append(";")
                sql_lines.append("")
                sql_lines.append("INSERT INTO u435_manual_index (term, page_number, chapter_filename, chapter_number, pdf_page_number, storage_url, system_category) VALUES")

            value_lines = []
            for entry in batch:
                term = entry['term'].replace("'", "''")  # Escape single quotes
                filename = entry['chapter_filename']
                storage_url = entry['storage_url']
                category = entry['system_category'] or 'general'

                value_lines.append(
                    f"  ('{term}', {entry['page_number']}, '{filename}', {entry['chapter_number']}, "
                    f"{entry['pdf_page_number']}, '{storage_url}', '{category}')"
                )

            sql_lines.append(',\n'.join(value_lines))

        sql_lines.append(";")
        return '\n'.join(sql_lines)

    def save_complete_results(self, entries: List[Dict]):
        """Save complete results to files"""
        output_dir = Path("/Users/thabonel/Code/unimogcommunityhub/scripts")

        # Save as JSON for review
        json_path = output_dir / "complete_maintenance_db_entries.json"
        with open(json_path, 'w') as f:
            json.dump(entries, f, indent=2)

        # Save as SQL for execution
        sql_path = output_dir / "insert_complete_maintenance_entries.sql"
        sql_content = self.generate_complete_sql_insert(entries)
        with open(sql_path, 'w') as f:
            f.write(sql_content)

        print(f"✅ Generated {len(entries)} complete database entries")
        print(f"📄 JSON saved to: {json_path}")
        print(f"🗃️  SQL saved to: {sql_path}")

        # Print summary by system category
        categories = {}
        for entry in entries:
            cat = entry['system_category']
            if cat not in categories:
                categories[cat] = 0
            categories[cat] += 1

        print("\n📊 Complete entries by system category:")
        for cat, count in sorted(categories.items()):
            print(f"  {cat}: {count} terms")

        # Show sample entries
        print("\n📋 Sample entries:")
        for i, entry in enumerate(entries[:3]):
            print(f"  {i+1}. Term: '{entry['term']}'")
            print(f"     File: {entry['chapter_filename']}")
            print(f"     Page: {entry['page_number']} (PDF page {entry['pdf_page_number']})")
            print(f"     URL: {entry['storage_url']}")
            print()

def main():
    csv_path = "/Users/thabonel/Code/unimogcommunityhub/docs/barry-manual-system/maintenance_chapters.csv"

    try:
        generator = CompleteMaintenanceDBGenerator(csv_path)
        entries = generator.create_complete_database_entries()
        generator.save_complete_results(entries)

        print(f"\n🚀 Ready to insert {len(entries)} complete maintenance manual entries into database")
        print("All required fields included: term, page_number, chapter_filename, chapter_number, pdf_page_number, storage_url, system_category")

    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    main()