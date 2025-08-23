#!/usr/bin/env python3
"""
Process extracted WIS strings and prepare for Supabase import
"""

import re
import json
import hashlib
from pathlib import Path
from collections import defaultdict

class WISProcessor:
    def __init__(self, strings_file):
        self.strings_file = strings_file
        self.data = {
            'parts': {},
            'procedures': [],
            'bulletins': [],
            'models': set()
        }
        
    def process(self):
        """Process the strings file"""
        print(f"Processing {self.strings_file}...")
        
        # Mercedes part number pattern: A123 456 78 90
        part_pattern = re.compile(r'([A-Z]\d{3}\s+\d{3}\s+\d{2}\s+\d{2})')
        
        # Procedure patterns
        procedure_keywords = [
            'Remove', 'Install', 'Check', 'Replace', 'Adjust',
            'Test', 'Inspect', 'Repair', 'Clean', 'Disconnect',
            'Connect', 'Measure', 'Drain', 'Fill', 'Bleed'
        ]
        
        # Unimog models
        unimog_models = ['404', '406', '411', '416', '421', '424', '425', '427', '435', '437',
                        'U1000', 'U1100', 'U1200', 'U1300', 'U1400', 'U1500', 'U1600', 'U1700',
                        'U2100', 'U2150', 'U2450', 'U3000', 'U4000', 'U5000', 'U5023', 'U20']
        
        with open(self.strings_file, 'r', encoding='utf-8', errors='ignore') as f:
            line_count = 0
            for line in f:
                line_count += 1
                if line_count % 100000 == 0:
                    print(f"Processed {line_count:,} lines...")
                
                line = line.strip()
                if len(line) < 10:
                    continue
                
                # Extract part numbers
                parts = part_pattern.findall(line)
                for part in parts:
                    part_clean = re.sub(r'\s+', ' ', part).strip()
                    if part_clean not in self.data['parts']:
                        # Try to extract description from context
                        desc = line.replace(part, '').strip()
                        if len(desc) > 5 and len(desc) < 200:
                            self.data['parts'][part_clean] = desc
                        else:
                            self.data['parts'][part_clean] = ''
                
                # Extract procedures
                for keyword in procedure_keywords:
                    if line.startswith(keyword) and len(line) > 20 and len(line) < 500:
                        # Filter out UI elements and code
                        if not any(x in line.lower() for x in ['icon', 'button', 'checkbox', '_', '.dll', '.exe']):
                            self.data['procedures'].append({
                                'title': line[:100],
                                'content': line,
                                'keyword': keyword
                            })
                            break
                
                # Extract Unimog model references
                for model in unimog_models:
                    if f'U{model}' in line or f'Unimog {model}' in line:
                        self.data['models'].add(model)
                
                # Stop if we have enough data
                if len(self.data['parts']) > 50000 and len(self.data['procedures']) > 5000:
                    print("Collected sufficient data, stopping...")
                    break
        
        print(f"Total lines processed: {line_count:,}")
        
    def deduplicate_procedures(self):
        """Remove duplicate procedures"""
        seen = set()
        unique = []
        for proc in self.data['procedures']:
            # Create hash of content
            proc_hash = hashlib.md5(proc['content'].encode()).hexdigest()
            if proc_hash not in seen:
                seen.add(proc_hash)
                unique.append(proc)
        self.data['procedures'] = unique
        
    def generate_sql(self, output_file):
        """Generate SQL for Supabase import"""
        sql_lines = []
        
        # Insert parts
        for part_num, description in list(self.data['parts'].items())[:10000]:  # Limit to 10k for initial import
            part_num = part_num.replace("'", "''")
            desc = description.replace("'", "''")[:500]  # Limit description length
            
            sql = f"""INSERT INTO wis_parts (part_number, description, search_vector)
VALUES ('{part_num}', '{desc}', to_tsvector('english', '{part_num} {desc}'))
ON CONFLICT (part_number) DO UPDATE SET description = EXCLUDED.description;"""
            sql_lines.append(sql)
        
        # Insert procedures
        for proc in self.data['procedures'][:5000]:  # Limit to 5k for initial import
            title = proc['title'].replace("'", "''")
            content = proc['content'].replace("'", "''")
            
            sql = f"""INSERT INTO wis_procedures (title, content, procedure_type, search_vector)
VALUES ('{title}', '{content}', 'repair', to_tsvector('english', '{title} {content}'))
ON CONFLICT DO NOTHING;"""
            sql_lines.append(sql)
        
        # Write SQL file
        with open(output_file, 'w') as f:
            f.write("-- WIS Data Import from extracted strings\n")
            f.write("-- Auto-generated from MERCEDES.raw extraction\n\n")
            f.write("BEGIN;\n\n")
            
            for sql in sql_lines:
                f.write(sql + "\n")
            
            f.write("\nCOMMIT;\n")
        
        print(f"SQL file generated: {output_file}")
        print(f"Total SQL statements: {len(sql_lines)}")
        
    def save_json(self, output_file):
        """Save data as JSON"""
        # Convert set to list for JSON serialization
        self.data['models'] = list(self.data['models'])
        
        # Convert parts dict to list
        parts_list = [
            {'part_number': k, 'description': v}
            for k, v in list(self.data['parts'].items())[:10000]
        ]
        
        export_data = {
            'parts': parts_list,
            'procedures': self.data['procedures'][:5000],
            'models': self.data['models'],
            'statistics': {
                'total_parts': len(self.data['parts']),
                'total_procedures': len(self.data['procedures']),
                'total_models': len(self.data['models'])
            }
        }
        
        with open(output_file, 'w') as f:
            json.dump(export_data, f, indent=2)
        
        print(f"JSON file saved: {output_file}")
        
    def print_statistics(self):
        """Print extraction statistics"""
        print("\n" + "="*50)
        print("WIS DATA EXTRACTION STATISTICS")
        print("="*50)
        print(f"Parts found: {len(self.data['parts']):,}")
        print(f"Procedures found: {len(self.data['procedures']):,}")
        print(f"Unimog models: {len(self.data['models'])}")
        
        if self.data['models']:
            print(f"Models: {', '.join(sorted(self.data['models']))}")
        
        print("\nSample Parts:")
        for part, desc in list(self.data['parts'].items())[:5]:
            print(f"  {part}: {desc[:50]}...")
        
        print("\nSample Procedures:")
        for proc in self.data['procedures'][:5]:
            print(f"  [{proc['keyword']}] {proc['title'][:70]}...")


if __name__ == "__main__":
    processor = WISProcessor("/Volumes/UnimogManuals/wis-ripped-data/strings_ascii.txt")
    
    print("Starting WIS data processing...")
    processor.process()
    processor.deduplicate_procedures()
    processor.print_statistics()
    
    # Save outputs
    output_dir = Path("/Volumes/UnimogManuals/wis-processed")
    output_dir.mkdir(exist_ok=True)
    
    processor.save_json(output_dir / "wis_data.json")
    processor.generate_sql(output_dir / "wis_import.sql")
    
    print("\n✅ Processing complete!")
    print(f"Output files in: {output_dir}")