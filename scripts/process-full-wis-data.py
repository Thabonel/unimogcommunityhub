#!/usr/bin/env python3
"""
Process full WIS data extraction - comprehensive parser
"""

import re
import json
import hashlib
from pathlib import Path
from collections import defaultdict, Counter

class FullWISProcessor:
    def __init__(self, data_dir):
        self.data_dir = Path(data_dir)
        self.parts = {}
        self.procedures = []
        self.models = set()
        self.bulletins = []
        
    def process_parts(self):
        """Process parts_raw.txt file"""
        parts_file = self.data_dir / "parts_raw.txt"
        if not parts_file.exists():
            print(f"Parts file not found: {parts_file}")
            return
            
        print(f"Processing parts from {parts_file}...")
        
        # Mercedes part pattern: A123 456 78 90 or variations
        part_patterns = [
            re.compile(r'(A\d{3}\s+\d{3}\s+\d{2}\s+\d{2})'),
            re.compile(r'(B\d{3}\s+\d{3}\s+\d{2}\s+\d{2})'),
            re.compile(r'(N\d{3}\s+\d{3}\s+\d{2}\s+\d{2})'),
            re.compile(r'([A-Z]\d{9,10})')  # Alternative format
        ]
        
        line_count = 0
        with open(parts_file, 'r', encoding='utf-8', errors='ignore') as f:
            for line in f:
                line_count += 1
                if line_count % 10000 == 0:
                    print(f"  Processed {line_count:,} part lines...")
                
                line = line.strip()
                if not line or len(line) < 10:
                    continue
                
                # Try each pattern
                for pattern in part_patterns:
                    matches = pattern.findall(line)
                    for match in matches:
                        part_num = re.sub(r'\s+', ' ', match).strip()
                        
                        # Extract description (rest of line after part number)
                        desc = line.replace(match, '').strip()
                        
                        # Clean description
                        desc = re.sub(r'^(Part nr\.|Part number:|PN:|P/N:)\s*', '', desc)
                        desc = re.sub(r'^\d+\s*mm:\s*', '', desc)
                        desc = desc[:200]  # Limit length
                        
                        # Store best description for each part
                        if part_num not in self.parts or len(desc) > len(self.parts[part_num]):
                            self.parts[part_num] = desc
        
        print(f"  Found {len(self.parts):,} unique parts")
        
    def process_procedures(self):
        """Process procedures_raw.txt file"""
        procedures_file = self.data_dir / "procedures_raw.txt"
        if not procedures_file.exists():
            print(f"Procedures file not found: {procedures_file}")
            return
            
        print(f"Processing procedures from {procedures_file}...")
        
        procedure_keywords = [
            'Remove', 'Install', 'Check', 'Replace', 'Adjust',
            'Test', 'Inspect', 'Repair', 'Clean', 'Disconnect',
            'Connect', 'Measure', 'Drain', 'Fill', 'Bleed',
            'Torque', 'Calibrate', 'Align', 'Mount', 'Dismount',
            'Service', 'Overhaul', 'Rebuild', 'Diagnose'
        ]
        
        # Unimog-specific component keywords
        component_keywords = [
            'axle', 'differential', 'portal', 'transmission', 'transfer',
            'hydraulic', 'pump', 'valve', 'cylinder', 'brake', 'clutch',
            'engine', 'turbo', 'radiator', 'steering', 'suspension',
            'winch', 'PTO', 'power take', 'torque', 'converter',
            'gearbox', 'driveshaft', 'propshaft', 'hub', 'bearing',
            'seal', 'gasket', 'filter', 'cooler', 'actuator'
        ]
        
        seen_procedures = set()
        line_count = 0
        
        with open(procedures_file, 'r', encoding='utf-8', errors='ignore') as f:
            for line in f:
                line_count += 1
                if line_count % 10000 == 0:
                    print(f"  Processed {line_count:,} procedure lines...")
                
                line = line.strip()
                if not line or len(line) < 20 or len(line) > 500:
                    continue
                
                # Check if line starts with procedure keyword
                for keyword in procedure_keywords:
                    if line.startswith(keyword):
                        # Check if it contains component keywords
                        line_lower = line.lower()
                        if any(comp in line_lower for comp in component_keywords):
                            # Create hash to avoid duplicates
                            proc_hash = hashlib.md5(line.encode()).hexdigest()
                            if proc_hash not in seen_procedures:
                                seen_procedures.add(proc_hash)
                                self.procedures.append({
                                    'title': line[:100],
                                    'content': line,
                                     'keyword': keyword
                                })
                        break
        
        print(f"  Found {len(self.procedures):,} unique procedures")
        
    def process_models(self):
        """Process models_raw.txt file"""
        models_file = self.data_dir / "models_raw.txt"
        if not models_file.exists():
            print(f"Models file not found: {models_file}")
            return
            
        print(f"Processing models from {models_file}...")
        
        # Unimog model patterns
        model_patterns = [
            re.compile(r'U\s*(\d{3,4})'),
            re.compile(r'Unimog\s+(\d{3,4})'),
            re.compile(r'Type\s+(\d{3,4})'),
            re.compile(r'Model\s+(\d{3,4})')
        ]
        
        with open(models_file, 'r', encoding='utf-8', errors='ignore') as f:
            for line in f:
                for pattern in model_patterns:
                    matches = pattern.findall(line)
                    for match in matches:
                        if match.isdigit():
                            model = match.lstrip('0')  # Remove leading zeros
                            if len(model) >= 3:  # Valid model numbers
                                self.models.add(model)
        
        print(f"  Found {len(self.models)} unique models: {', '.join(sorted(self.models)[:20])}")
        
    def extract_bulletins(self):
        """Extract service bulletins from strings"""
        strings_file = self.data_dir / "strings_ascii.txt"
        if not strings_file.exists():
            return
            
        print("Extracting service bulletins...")
        
        bulletin_patterns = [
            re.compile(r'(Service\s+Bulletin[^:]*:.*?)(?=Service\s+Bulletin|\n\n|$)', re.IGNORECASE),
            re.compile(r'(SB[-\s]\d+:.*?)(?=SB[-\s]\d+|\n\n|$)', re.IGNORECASE),
            re.compile(r'(Technical\s+Service\s+Bulletin.*?)(?=Technical|\n\n|$)', re.IGNORECASE)
        ]
        
        with open(strings_file, 'r', encoding='utf-8', errors='ignore') as f:
            content = f.read(10000000)  # Read first 10MB
            
            for pattern in bulletin_patterns:
                matches = pattern.findall(content)
                for match in matches:
                    if 20 < len(match) < 500:
                        self.bulletins.append(match.strip())
        
        # Remove duplicates
        self.bulletins = list(set(self.bulletins))
        print(f"  Found {len(self.bulletins)} bulletins")
        
    def generate_sql(self, output_file):
        """Generate comprehensive SQL import file"""
        print(f"\nGenerating SQL import file: {output_file}")
        
        sql_lines = []
        sql_lines.append("-- Comprehensive WIS Data Import")
        sql_lines.append("-- Extracted from MERCEDES.raw forensic analysis")
        sql_lines.append(f"-- Parts: {len(self.parts):,} | Procedures: {len(self.procedures):,}")
        sql_lines.append("")
        sql_lines.append("BEGIN;")
        sql_lines.append("")
        
        # Add procedures (limit to 5000 for initial import)
        sql_lines.append("-- Repair Procedures")
        for proc in self.procedures[:5000]:
            title = proc['title'].replace("'", "''")
            content = proc['content'].replace("'", "''")
            sql = f"""INSERT INTO wis_procedures (title, content, procedure_type, search_vector)
VALUES ('{title}', '{content}', 'repair', to_tsvector('english', '{title} {content}'))
ON CONFLICT DO NOTHING;"""
            sql_lines.append(sql)
        
        sql_lines.append("")
        sql_lines.append("-- Parts Catalog")
        
        # Add parts (limit to 10000 for initial import)
        for part_num, desc in list(self.parts.items())[:10000]:
            part_clean = part_num.replace("'", "''")
            desc_clean = desc.replace("'", "''")
            
            # Generate better description if empty
            if not desc_clean:
                if 'A9' in part_num:
                    desc_clean = 'Mercedes-Benz Genuine Part'
                elif 'A4' in part_num:
                    desc_clean = 'Unimog Specific Component'
                else:
                    desc_clean = 'OEM Replacement Part'
            
            sql = f"""INSERT INTO wis_parts (part_number, description, search_vector)
VALUES ('{part_clean}', '{desc_clean}', to_tsvector('english', '{part_clean} {desc_clean}'))
ON CONFLICT (part_number) DO UPDATE SET description = EXCLUDED.description;"""
            sql_lines.append(sql)
        
        # Add models reference
        if self.models:
            sql_lines.append("")
            sql_lines.append("-- Model References")
            models_list = ', '.join(sorted(self.models))
            sql_lines.append(f"-- Found models: {models_list}")
        
        # Add bulletins
        if self.bulletins:
            sql_lines.append("")
            sql_lines.append("-- Service Bulletins")
            for bulletin in self.bulletins[:100]:
                bulletin_clean = bulletin.replace("'", "''")
                # Extract bulletin number if present
                bulletin_match = re.search(r'(SB[-\s]?\d+|Bulletin\s+\d+)', bulletin, re.IGNORECASE)
                if bulletin_match:
                    bulletin_num = bulletin_match.group(1)
                else:
                    bulletin_num = f"AUTO-{hashlib.md5(bulletin.encode()).hexdigest()[:8]}"
                
                sql = f"""INSERT INTO wis_bulletins (bulletin_number, content, search_vector)
VALUES ('{bulletin_num}', '{bulletin_clean}', to_tsvector('english', '{bulletin_clean}'))
ON CONFLICT DO NOTHING;"""
                sql_lines.append(sql)
        
        sql_lines.append("")
        sql_lines.append("COMMIT;")
        
        # Write file
        with open(output_file, 'w', encoding='utf-8') as f:
            f.write('\n'.join(sql_lines))
        
        print(f"  SQL file created with {len(sql_lines):,} statements")
        
    def generate_json(self, output_file):
        """Generate JSON export of all data"""
        print(f"\nGenerating JSON export: {output_file}")
        
        export_data = {
            'statistics': {
                'total_parts': len(self.parts),
                'total_procedures': len(self.procedures),
                'total_models': len(self.models),
                'total_bulletins': len(self.bulletins)
            },
            'models': sorted(list(self.models)),
            'sample_parts': [
                {'part_number': k, 'description': v}
                for k, v in list(self.parts.items())[:100]
            ],
            'sample_procedures': self.procedures[:100],
            'sample_bulletins': self.bulletins[:20]
        }
        
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(export_data, f, indent=2)
        
        print(f"  JSON export complete")
        
    def print_summary(self):
        """Print extraction summary"""
        print("\n" + "="*60)
        print("WIS DATA EXTRACTION SUMMARY")
        print("="*60)
        print(f"✅ Parts extracted: {len(self.parts):,}")
        print(f"✅ Procedures extracted: {len(self.procedures):,}")
        print(f"✅ Models identified: {len(self.models)}")
        print(f"✅ Bulletins found: {len(self.bulletins)}")
        
        if self.parts:
            print("\n📦 Sample Parts:")
            for part, desc in list(self.parts.items())[:5]:
                desc_preview = desc[:50] + "..." if len(desc) > 50 else desc
                print(f"  • {part}: {desc_preview}")
        
        if self.procedures:
            print("\n🔧 Sample Procedures:")
            for proc in self.procedures[:5]:
                title = proc['title'][:60] + "..." if len(proc['title']) > 60 else proc['title']
                print(f"  • [{proc['keyword']}] {title}")
        
        if self.models:
            print(f"\n🚗 Unimog Models: {', '.join(sorted(self.models))}")


def main():
    print("="*60)
    print("COMPREHENSIVE WIS DATA PROCESSOR")
    print("="*60)
    
    processor = FullWISProcessor("/Volumes/UnimogManuals/wis-ripped-data")
    
    # Process all data types
    processor.process_parts()
    processor.process_procedures()
    processor.process_models()
    processor.extract_bulletins()
    
    # Generate outputs
    output_dir = Path("/Volumes/UnimogManuals/wis-processed")
    output_dir.mkdir(exist_ok=True)
    
    processor.generate_sql(output_dir / "wis_full_import.sql")
    processor.generate_json(output_dir / "wis_full_data.json")
    processor.print_summary()
    
    print("\n✅ Processing complete!")
    print(f"📁 Output files in: {output_dir}")
    print("   - wis_full_import.sql (ready for Supabase)")
    print("   - wis_full_data.json (for review)")


if __name__ == "__main__":
    main()