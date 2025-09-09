#!/usr/bin/env python3
"""
Process already extracted strings to find valid Mercedes parts and procedures
"""

import re
import json
from pathlib import Path
from collections import defaultdict

class StringsProcessor:
    def __init__(self):
        self.parts = {}
        self.procedures = []
        
        # Mercedes part number patterns - more specific
        self.part_patterns = [
            # Standard format with spaces: A123 456 78 90
            re.compile(r'\b(A\d{3}\s+\d{3}\s+\d{2}\s+\d{2})\b'),
            # Format with dots: A123.456.78.90
            re.compile(r'\b(A\d{3}\.\d{3}\.\d{2}\.\d{2})\b'),
            # Compact format: A1234567890
            re.compile(r'\b(A\d{10})\b'),
            # Other prefixes
            re.compile(r'\b([BN]\d{3}\s+\d{3}\s+\d{2}\s+\d{2})\b'),
        ]
        
        # Common part descriptions
        self.part_keywords = [
            'shaft', 'seal', 'bearing', 'gasket', 'valve', 'pump',
            'filter', 'hub', 'axle', 'gear', 'spring', 'bolt',
            'nut', 'washer', 'bushing', 'pin', 'ring', 'hose',
            'bracket', 'mount', 'sensor', 'switch', 'relay',
            'module', 'actuator', 'cylinder', 'piston', 'rod'
        ]
        
        # Procedure patterns
        self.procedure_patterns = [
            re.compile(r'(Remove\s+[^.]+\.)', re.IGNORECASE),
            re.compile(r'(Install\s+[^.]+\.)', re.IGNORECASE),
            re.compile(r'(Replace\s+[^.]+\.)', re.IGNORECASE),
            re.compile(r'(Check\s+[^.]+\.)', re.IGNORECASE),
            re.compile(r'(Adjust\s+[^.]+\.)', re.IGNORECASE),
            re.compile(r'(Test\s+[^.]+\.)', re.IGNORECASE),
            re.compile(r'(Inspect\s+[^.]+\.)', re.IGNORECASE),
            re.compile(r'(Torque\s+[^.]+\.)', re.IGNORECASE),
        ]
        
    def process_parts_file(self, filepath):
        """Process the parts_raw.txt file"""
        print(f"Processing {filepath}...")
        
        with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
            for line_num, line in enumerate(f):
                if line_num % 10000 == 0:
                    print(f"  Processed {line_num:,} lines... Found {len(self.parts)} valid parts")
                
                # Look for part numbers
                for pattern in self.part_patterns:
                    matches = pattern.findall(line)
                    for match in matches:
                        # Normalize part number
                        part_num = match.replace('.', ' ').strip()
                        part_num = re.sub(r'\s+', ' ', part_num)
                        
                        # Validate format
                        if self.is_valid_part_number(part_num):
                            # Extract description from context
                            desc = self.extract_description(line, match)
                            if desc and len(desc) > 5:
                                if part_num not in self.parts or len(desc) > len(self.parts[part_num]):
                                    self.parts[part_num] = desc
                                    
        print(f"  Total valid parts found: {len(self.parts)}")
        
    def is_valid_part_number(self, part_num):
        """Validate Mercedes part number format"""
        # Standard format: Letter + 3 digits + space + 3 digits + space + 2 digits + space + 2 digits
        if re.match(r'^[A-Z]\d{3}\s\d{3}\s\d{2}\s\d{2}$', part_num):
            # Check for reasonable digit patterns (not all zeros, etc)
            digits = ''.join(c for c in part_num if c.isdigit())
            if digits != '0' * len(digits) and digits != '1' * len(digits):
                return True
        return False
        
    def extract_description(self, line, part_match):
        """Extract description from line context"""
        # Find position of part number
        pos = line.find(part_match)
        if pos == -1:
            return ""
            
        # Get text after part number
        after_text = line[pos + len(part_match):].strip()
        
        # Clean up
        after_text = re.sub(r'[^\w\s\-,.]', ' ', after_text)
        after_text = re.sub(r'\s+', ' ', after_text).strip()
        
        # Take first 100 chars or until special character
        words = after_text.split()[:10]  # Max 10 words
        desc = ' '.join(words)
        
        # Check if it contains any part keywords
        desc_lower = desc.lower()
        if any(keyword in desc_lower for keyword in self.part_keywords):
            return desc[:100]
            
        # If no keywords but reasonable length, still use it
        if len(desc) > 10 and len(desc) < 100:
            return desc
            
        return ""
        
    def process_procedures_file(self, filepath):
        """Process the procedures_raw.txt file"""
        print(f"Processing {filepath}...")
        
        with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
            for line_num, line in enumerate(f):
                if line_num % 10000 == 0:
                    print(f"  Processed {line_num:,} lines... Found {len(self.procedures)} procedures")
                
                # Clean line
                line = line.strip()
                if len(line) < 20 or len(line) > 500:
                    continue
                    
                # Look for procedure patterns
                for pattern in self.procedure_patterns:
                    matches = pattern.findall(line)
                    for match in matches:
                        # Clean up procedure text
                        proc = re.sub(r'\s+', ' ', match).strip()
                        
                        # Validate it's real text
                        if self.is_valid_procedure(proc):
                            self.procedures.append(proc)
                            
        print(f"  Total procedures found: {len(self.procedures)}")
        
    def is_valid_procedure(self, text):
        """Check if text is a valid procedure"""
        # Must have reasonable length
        if len(text) < 15 or len(text) > 300:
            return False
            
        # Must have some words
        words = text.split()
        if len(words) < 3:
            return False
            
        # Check for too many special characters
        special_count = sum(1 for c in text if c in '{}[]<>@#$%^&*')
        if special_count > len(text) * 0.1:
            return False
            
        # Must start with a verb
        first_word = words[0].lower()
        if first_word not in ['remove', 'install', 'replace', 'check', 'adjust', 
                              'test', 'inspect', 'torque', 'connect', 'disconnect']:
            return False
            
        return True
        
    def export_results(self, output_dir):
        """Export clean results"""
        output_path = Path(output_dir)
        output_path.mkdir(exist_ok=True)
        
        print("\n" + "="*60)
        print("CLEAN DATA EXTRACTION RESULTS")
        print("="*60)
        print(f"✅ Valid parts found: {len(self.parts)}")
        print(f"✅ Valid procedures found: {len(self.procedures)}")
        
        # Show samples
        print("\n📦 Sample Parts:")
        for part, desc in list(self.parts.items())[:20]:
            print(f"  {part}: {desc}")
            
        print("\n🔧 Sample Procedures:")
        for proc in self.procedures[:20]:
            print(f"  • {proc}")
            
        # Export JSON
        data = {
            'parts': [
                {'part_number': k, 'description': v}
                for k, v in self.parts.items()
            ],
            'procedures': [
                {'content': p} for p in self.procedures
            ]
        }
        
        json_file = output_path / 'clean_wis_data.json'
        with open(json_file, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
            
        print(f"\n✅ JSON exported: {json_file}")
        
        # Generate SQL
        sql_file = output_path / 'clean_wis_import.sql'
        with open(sql_file, 'w', encoding='utf-8') as f:
            f.write("-- Mercedes WIS Clean Data Import\n")
            f.write(f"-- Parts: {len(self.parts)} | Procedures: {len(self.procedures)}\n\n")
            f.write("BEGIN;\n\n")
            
            # Parts
            f.write("-- Parts Catalog\n")
            for part_num, desc in self.parts.items():
                part_clean = part_num.replace("'", "''")
                desc_clean = desc.replace("'", "''")
                f.write(f"""INSERT INTO wis_parts (part_number, description, search_vector)
VALUES ('{part_clean}', '{desc_clean}', to_tsvector('english', '{part_clean} {desc_clean}'))
ON CONFLICT (part_number) DO UPDATE SET description = EXCLUDED.description;
""")
                
            # Procedures
            f.write("\n-- Repair Procedures\n")
            for proc in self.procedures:
                proc_clean = proc.replace("'", "''")
                f.write(f"""INSERT INTO wis_procedures (title, content, procedure_type, search_vector)
VALUES ('{proc_clean[:100]}', '{proc_clean}', 'repair', to_tsvector('english', '{proc_clean}'))
ON CONFLICT DO NOTHING;
""")
                
            f.write("\nCOMMIT;\n")
            
        print(f"✅ SQL exported: {sql_file}")
        
        return data


def main():
    print("="*60)
    print("MERCEDES WIS STRINGS DATA PROCESSOR")
    print("="*60)
    
    processor = StringsProcessor()
    
    # Process extracted string files
    data_dir = Path("/Volumes/UnimogManuals/wis-ripped-data")
    
    # Process parts
    parts_file = data_dir / "parts_raw.txt"
    if parts_file.exists():
        processor.process_parts_file(parts_file)
    
    # Process procedures
    procedures_file = data_dir / "procedures_raw.txt"
    if procedures_file.exists():
        processor.process_procedures_file(procedures_file)
        
    # Export results
    output_dir = "/Volumes/UnimogManuals/WIS-CLEAN-EXTRACT"
    processor.export_results(output_dir)
    
    print("\n" + "="*60)
    print("🎉 CLEAN EXTRACTION COMPLETE!")
    print("="*60)


if __name__ == "__main__":
    main()