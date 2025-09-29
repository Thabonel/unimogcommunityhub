#!/usr/bin/env python3
"""
Generate U435 Maintenance Manual Database Entries
Creates comprehensive search terms for Barry AI integration
"""

import csv
import json
from pathlib import Path
from typing import List, Dict, Set

class MaintenanceDBGenerator:
    def __init__(self, csv_path: str):
        self.csv_path = Path(csv_path)
        self.entries = []

        # Maintenance-specific keywords by category
        self.maintenance_keywords = {
            'general': [
                'maintenance', 'service', 'inspection', 'check', 'adjustment',
                'procedure', 'general maintenance', 'preventive maintenance',
                'routine maintenance', 'scheduled maintenance'
            ],
            'engine': [
                'engine maintenance', 'engine service', 'engine timing',
                'engine housing', 'engine mount', 'mount maintenance',
                'timing maintenance', 'belt system', 'drive belts'
            ],
            'fuel': [
                'fuel injector maintenance', 'injector service', 'fuel injection',
                'air filter maintenance', 'air filter service', 'air filter replacement',
                'fuel system maintenance'
            ],
            'lubrication': [
                'engine lubrication', 'oil maintenance', 'oil service',
                'lubrication system', 'oil level check', 'oil change',
                'lubrication maintenance'
            ],
            'cooling': [
                'cooling system maintenance', 'coolant level check', 'coolant service',
                'radiator maintenance', 'cooling maintenance', 'coolant replacement'
            ],
            'brakes': [
                'brake maintenance', 'hydraulic brake maintenance', 'mechanical brake maintenance',
                'pneumatic brake maintenance', 'brake service', 'brake inspection',
                'air compressor maintenance', 'compressor service', 'pedal linkage'
            ],
            'transmission': [
                'transmission maintenance', 'clutch maintenance', 'clutch service',
                'transmission service', 'clutch adjustment'
            ],
            'suspension': [
                'suspension maintenance', 'suspension service', 'suspension inspection'
            ],
            'axles': [
                'axle maintenance', 'front axle maintenance', 'rear axle maintenance',
                'wheel maintenance', 'prop shaft maintenance', 'drive shaft maintenance'
            ],
            'steering': [
                'steering maintenance', 'steering service', 'steering inspection'
            ],
            'electrical': [
                'battery maintenance', 'electrical maintenance', 'headlight maintenance',
                'electrical equipment', 'battery service'
            ],
            'hydraulic': [
                'hydraulic equipment maintenance', 'hydraulic service',
                'hydraulic system maintenance'
            ],
            'body': [
                'cab maintenance', 'body maintenance', 'door maintenance',
                'window maintenance', 'seat maintenance', 'interior maintenance',
                'body panel maintenance'
            ]
        }

        # Component-specific terms
        self.component_terms = {
            'air_compressor': ['air compressor', 'compressor', 'compressed air'],
            'belt_system': ['belt', 'drive belt', 'belt system', 'belt tension'],
            'cooling_system': ['radiator', 'coolant', 'cooling system', 'thermostat'],
            'fuel_injectors': ['fuel injector', 'injector', 'fuel injection'],
            'air_filter': ['air filter', 'filter', 'air cleaner'],
            'lubrication': ['oil pump', 'oil filter', 'engine oil', 'lubrication'],
            'brakes_hydraulic': ['hydraulic brakes', 'brake fluid', 'brake cylinder'],
            'brakes_mechanical': ['mechanical brakes', 'brake adjustment', 'brake cable'],
            'brakes_pneumatic': ['pneumatic brakes', 'air brakes'],
            'transmission': ['transmission', 'gearbox', 'transmission oil'],
            'clutch': ['clutch', 'clutch disc', 'clutch pressure plate'],
            'front_axle': ['front axle', 'front differential', 'front drive'],
            'rear_axle': ['rear axle', 'rear differential', 'rear drive'],
            'steering': ['steering', 'steering wheel', 'steering box'],
            'suspension': ['suspension', 'shock absorber', 'spring'],
            'electrical': ['battery', 'electrical system', 'wiring'],
            'hydraulic': ['hydraulic system', 'hydraulic pump', 'hydraulic oil'],
            'body': ['cab', 'door', 'window', 'seat', 'body panel']
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
                    'system_category': row['system_category']
                })
        return chapters

    def generate_search_terms(self, chapter: Dict) -> Set[str]:
        """Generate comprehensive search terms for a chapter"""
        terms = set()

        # Basic terms from title
        title_words = chapter['title'].lower().split()
        terms.update(title_words)

        # Add maintenance-specific keywords for the system category
        if chapter['system_category'] in self.maintenance_keywords:
            terms.update(self.maintenance_keywords[chapter['system_category']])

        # Add component-specific terms based on filename/slug
        slug_lower = chapter['slug'].lower()
        for component, component_terms in self.component_terms.items():
            if component in slug_lower:
                terms.update(component_terms)

        # Add specific terms based on chapter content
        if 'air_compressor' in slug_lower:
            terms.update(['air compressor maintenance', 'compressor service', 'compressed air system'])
        elif 'belt_system' in slug_lower:
            terms.update(['belt maintenance', 'drive belt service', 'belt tension adjustment'])
        elif 'cooling' in slug_lower:
            terms.update(['coolant level', 'radiator service', 'cooling system check'])
        elif 'lubrication' in slug_lower:
            terms.update(['oil level', 'oil change procedure', 'engine oil service'])
        elif 'brake' in slug_lower:
            if 'hydraulic' in slug_lower:
                terms.update(['brake fluid', 'hydraulic brake service', 'brake bleeding'])
            elif 'mechanical' in slug_lower:
                terms.update(['brake adjustment', 'mechanical brake service'])
            elif 'pneumatic' in slug_lower:
                terms.update(['air brake service', 'pneumatic brake maintenance'])
        elif 'transmission' in slug_lower:
            terms.update(['transmission service', 'gearbox maintenance', 'transmission oil'])
        elif 'clutch' in slug_lower:
            terms.update(['clutch adjustment', 'clutch service', 'clutch maintenance'])
        elif 'axle' in slug_lower:
            if 'front' in slug_lower:
                terms.update(['front axle service', 'front differential maintenance'])
            elif 'rear' in slug_lower:
                terms.update(['rear axle service', 'rear differential maintenance'])
        elif 'steering' in slug_lower:
            terms.update(['steering service', 'steering maintenance', 'steering adjustment'])
        elif 'suspension' in slug_lower:
            terms.update(['suspension service', 'shock absorber maintenance'])
        elif 'battery' in slug_lower or 'batteries' in slug_lower:
            terms.update(['battery maintenance', 'battery service', 'battery check'])
        elif 'hydraulic_equipment' in slug_lower:
            terms.update(['hydraulic service', 'hydraulic system maintenance'])
        elif 'electrical_equipment' in slug_lower:
            terms.update(['electrical service', 'electrical system maintenance'])
        elif 'cab' in slug_lower or 'body' in slug_lower:
            terms.update(['cab maintenance', 'body service'])

        # Remove very common words that aren't useful for search
        stop_words = {'the', 'and', 'or', 'of', 'to', 'in', 'for', 'on', 'with', 'by'}
        terms = {term for term in terms if term not in stop_words and len(term) > 2}

        return terms

    def create_database_entries(self) -> List[Dict]:
        """Create database entries for all maintenance chapters"""
        chapters = self.load_maintenance_chapters()
        entries = []

        for chapter in chapters:
            # Generate search terms
            search_terms = self.generate_search_terms(chapter)

            # Create entry for each search term
            for term in search_terms:
                entries.append({
                    'term': term,
                    'chapter_filename': chapter['filename'],
                    'system_category': chapter['system_category']
                })

        return entries

    def generate_sql_insert(self, entries: List[Dict]) -> str:
        """Generate SQL INSERT statement for the entries"""
        sql_lines = [
            "-- U435 Maintenance Manual Database Entries",
            "-- Generated for Barry AI Integration",
            "",
            "INSERT INTO u435_manual_index (term, chapter_filename, system_category) VALUES"
        ]

        # Group entries to avoid huge single statement
        batch_size = 50
        for i in range(0, len(entries), batch_size):
            batch = entries[i:i + batch_size]

            if i > 0:
                sql_lines.append(";")
                sql_lines.append("")
                sql_lines.append("INSERT INTO u435_manual_index (term, chapter_filename, system_category) VALUES")

            value_lines = []
            for entry in batch:
                term = entry['term'].replace("'", "''")  # Escape single quotes
                filename = entry['chapter_filename']
                category = entry['system_category']
                value_lines.append(f"  ('{term}', '{filename}', '{category}')")

            sql_lines.append(',\n'.join(value_lines))

        sql_lines.append(";")
        return '\n'.join(sql_lines)

    def save_results(self, entries: List[Dict]):
        """Save results to files"""
        output_dir = Path("/Users/thabonel/Code/unimogcommunityhub/scripts")

        # Save as JSON for review
        json_path = output_dir / "maintenance_db_entries.json"
        with open(json_path, 'w') as f:
            json.dump(entries, f, indent=2)

        # Save as SQL for execution
        sql_path = output_dir / "insert_maintenance_entries.sql"
        sql_content = self.generate_sql_insert(entries)
        with open(sql_path, 'w') as f:
            f.write(sql_content)

        print(f"✅ Generated {len(entries)} database entries")
        print(f"📄 JSON saved to: {json_path}")
        print(f"🗃️  SQL saved to: {sql_path}")

        # Print summary by system category
        categories = {}
        for entry in entries:
            cat = entry['system_category']
            if cat not in categories:
                categories[cat] = 0
            categories[cat] += 1

        print("\n📊 Entries by system category:")
        for cat, count in sorted(categories.items()):
            print(f"  {cat}: {count} terms")

def main():
    csv_path = "/Users/thabonel/Code/unimogcommunityhub/docs/barry-manual-system/maintenance_chapters.csv"

    try:
        generator = MaintenanceDBGenerator(csv_path)
        entries = generator.create_database_entries()
        generator.save_results(entries)

        print(f"\n🚀 Ready to insert {len(entries)} maintenance manual entries into database")
        print("Next step: Execute the generated SQL file")

    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    main()