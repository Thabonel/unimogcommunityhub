#!/usr/bin/env python3
"""
Extract real Mercedes parts from strings file
"""

import re
import json
from pathlib import Path
from collections import defaultdict

class MercedesPartsExtractor:
    def __init__(self):
        self.parts = {}
        self.procedures = []
        
        # More specific Mercedes part pattern
        self.part_pattern = re.compile(r'([A-Z]\d{3}\s+\d{3}\s+\d{2}\s+\d{2})')
        
        # Common procedure keywords in multiple languages
        self.procedure_keywords = [
            'Remove', 'Install', 'Replace', 'Check', 'Adjust', 'Test', 'Inspect',
            'Torque', 'Connect', 'Disconnect', 'Drain', 'Fill', 'Bleed', 'Clean',
            'Measure', 'Mount', 'Dismount', 'Repair', 'Service', 'Calibrate',
            # German
            'Entfernen', 'Einbauen', 'Ersetzen', 'Prüfen', 'Einstellen', 
            'Testen', 'Reparieren', 'Montieren', 'Demontieren',
            # French
            'Déposer', 'Installer', 'Remplacer', 'Vérifier', 'Régler'
        ]
        
    def extract_from_strings(self, filepath):
        """Extract parts and procedures from strings file"""
        print(f"Processing {filepath}...")
        
        parts_found = 0
        procedures_found = 0
        
        with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
            for line_num, line in enumerate(f):
                if line_num % 100000 == 0:
                    print(f"  Processed {line_num:,} lines... Parts: {parts_found}, Procedures: {procedures_found}")
                
                # Look for part numbers
                matches = self.part_pattern.findall(line)
                for match in matches:
                    # Clean and validate
                    part_num = match.strip()
                    if self.is_valid_mercedes_part(part_num):
                        # Extract description from context
                        desc = self.extract_context(line, match)
                        if part_num not in self.parts or (desc and len(desc) > len(self.parts.get(part_num, ''))):
                            self.parts[part_num] = desc
                            parts_found += 1
                
                # Look for procedures
                for keyword in self.procedure_keywords:
                    if keyword in line and len(line) > 20 and len(line) < 500:
                        # Extract procedure
                        proc = self.clean_procedure(line, keyword)
                        if proc and proc not in self.procedures:
                            self.procedures.append(proc)
                            procedures_found += 1
                            
        print(f"  Total: {len(self.parts)} unique parts, {len(self.procedures)} procedures")
        
    def is_valid_mercedes_part(self, part_num):
        """Validate Mercedes part number"""
        # Check format
        if not re.match(r'^[A-Z]\d{3}\s+\d{3}\s+\d{2}\s+\d{2}$', part_num):
            return False
            
        # Check it's not all zeros or ones
        digits = ''.join(c for c in part_num if c.isdigit())
        if digits == '0' * len(digits) or digits == '1' * len(digits):
            return False
            
        # Common Mercedes prefixes
        prefix = part_num[0]
        if prefix in ['A', 'B', 'N', 'M']:
            return True
            
        return False
        
    def extract_context(self, line, part_match):
        """Extract description from line context"""
        # Clean line
        line = re.sub(r'[^\w\s\-.,/()]', ' ', line)
        line = re.sub(r'\s+', ' ', line).strip()
        
        # Find part position
        pos = line.find(part_match)
        if pos == -1:
            return ""
            
        # Get context around part (before and after)
        start = max(0, pos - 50)
        end = min(len(line), pos + len(part_match) + 100)
        context = line[start:end]
        
        # Remove the part number itself
        context = context.replace(part_match, '').strip()
        
        # Clean up
        context = re.sub(r'\s+', ' ', context)
        
        # Take meaningful portion
        if len(context) > 10:
            return context[:100]
            
        return ""
        
    def clean_procedure(self, line, keyword):
        """Clean and validate procedure text"""
        # Find keyword position
        pos = line.find(keyword)
        if pos == -1:
            return None
            
        # Extract from keyword to end or period
        proc = line[pos:]
        
        # Find natural end
        for end_char in ['.', '\n', ';', '|']:
            end_pos = proc.find(end_char)
            if end_pos > 0:
                proc = proc[:end_pos + 1]
                break
                
        # Clean
        proc = re.sub(r'[^\w\s\-.,/()]', ' ', proc)
        proc = re.sub(r'\s+', ' ', proc).strip()
        
        # Validate
        if len(proc) > 15 and len(proc) < 300:
            # Must have some real words
            words = proc.split()
            if len(words) > 3:
                return proc
                
        return None
        
    def export_results(self, output_dir):
        """Export extracted data"""
        output_path = Path(output_dir)
        output_path.mkdir(exist_ok=True)
        
        print("\n" + "="*60)
        print("MERCEDES PARTS EXTRACTION RESULTS")
        print("="*60)
        print(f"✅ Unique parts found: {len(self.parts)}")
        print(f"✅ Procedures found: {len(self.procedures)}")
        
        # Show samples
        print("\n📦 Sample Mercedes Parts:")
        sample_parts = sorted(self.parts.items())[:30]
        for part, desc in sample_parts:
            print(f"  {part}: {desc if desc else '(no description)'}")
            
        print("\n🔧 Sample Procedures:")
        for proc in self.procedures[:20]:
            print(f"  • {proc}")
            
        # Export JSON
        data = {
            'statistics': {
                'total_parts': len(self.parts),
                'total_procedures': len(self.procedures)
            },
            'parts': [
                {'part_number': k, 'description': v}
                for k, v in self.parts.items()
            ],
            'procedures': self.procedures
        }
        
        json_file = output_path / 'mercedes_parts_final.json'
        with open(json_file, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
            
        print(f"\n✅ JSON exported: {json_file}")
        
        # Generate SQL for Supabase
        sql_file = output_path / 'mercedes_parts_import.sql'
        with open(sql_file, 'w', encoding='utf-8') as f:
            f.write("-- Mercedes WIS Parts Import\n")
            f.write(f"-- Extracted from strings data\n")
            f.write(f"-- Parts: {len(self.parts)} | Procedures: {len(self.procedures)}\n\n")
            f.write("BEGIN;\n\n")
            
            # Delete existing data first
            f.write("-- Clear existing data\n")
            f.write("DELETE FROM wis_parts WHERE part_number LIKE 'TEST%';\n\n")
            
            # Insert parts
            f.write("-- Mercedes Parts Catalog\n")
            for part_num, desc in self.parts.items():
                part_clean = part_num.replace("'", "''")
                desc_clean = (desc or '').replace("'", "''")[:500]
                
                f.write(f"""INSERT INTO wis_parts (part_number, description, search_vector)
VALUES ('{part_clean}', '{desc_clean}', to_tsvector('english', '{part_clean} {desc_clean}'))
ON CONFLICT (part_number) DO UPDATE SET description = EXCLUDED.description;
""")
                
            # Insert procedures
            f.write("\n-- Repair Procedures\n")
            for proc in self.procedures[:1000]:  # Limit to 1000 procedures
                proc_clean = proc.replace("'", "''")
                title = proc_clean[:100]
                
                f.write(f"""INSERT INTO wis_procedures (title, content, procedure_type, search_vector)
VALUES ('{title}', '{proc_clean}', 'repair', to_tsvector('english', '{proc_clean}'))
ON CONFLICT DO NOTHING;
""")
                
            f.write("\nCOMMIT;\n")
            
        print(f"✅ SQL exported: {sql_file}")
        
        return data


def main():
    print("="*60)
    print("MERCEDES PARTS FINAL EXTRACTOR")
    print("="*60)
    
    extractor = MercedesPartsExtractor()
    
    # Process strings file
    strings_file = Path("/Volumes/UnimogManuals/wis-ripped-data/strings_ascii.txt")
    if strings_file.exists():
        extractor.extract_from_strings(strings_file)
    else:
        print(f"Error: {strings_file} not found")
        return
        
    # Export results
    output_dir = "/Volumes/UnimogManuals/MERCEDES-PARTS-FINAL"
    data = extractor.export_results(output_dir)
    
    print("\n" + "="*60)
    print("🎉 EXTRACTION COMPLETE!")
    print("="*60)
    print(f"Ready to import {len(data['parts'])} parts and {len(data['procedures'])} procedures to Supabase")


if __name__ == "__main__":
    main()