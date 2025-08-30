#!/usr/bin/env python3
"""
Final WIS Data Extractor - Direct Binary Parser
Based on research findings about TransBase format
"""

import os
import struct
import re
import json
import sqlite3
from pathlib import Path
from typing import List, Dict, Any
import hashlib

class WISFinalExtractor:
    """Direct parser for Mercedes WIS TransBase database files"""
    
    def __init__(self, db_path):
        self.db_path = Path(db_path)
        self.parts = {}
        self.procedures = {}
        
        # TransBase uses 8KB pages typically
        self.page_size = 8192
        
        # Known Mercedes part number patterns
        self.part_patterns = [
            # Standard format: A123 456 78 90
            re.compile(rb'(A\d{3}\s+\d{3}\s+\d{2}\s+\d{2})'),
            # Compact format: A1234567890
            re.compile(rb'(A\d{10})'),
            # With dots: A123.456.78.90
            re.compile(rb'(A\d{3}\.\d{3}\.\d{2}\.\d{2})'),
            # Other prefixes
            re.compile(rb'([BN]\d{3}\s+\d{3}\s+\d{2}\s+\d{2})')
        ]
        
        # WIS procedure patterns (in multiple languages)
        self.procedure_keywords = [
            # English
            b'Remove', b'Install', b'Replace', b'Check', b'Adjust',
            b'Test', b'Repair', b'Inspect', b'Clean', b'Disconnect',
            b'Connect', b'Measure', b'Drain', b'Fill', b'Bleed',
            b'Torque', b'Calibrate', b'Align', b'Mount', b'Dismount',
            # German
            b'Entfernen', b'Einbauen', b'Ersetzen', b'Pr\xc3\xbcfen',
            b'Einstellen', b'Testen', b'Reparieren', b'Inspizieren'
        ]
        
        # Unimog-specific keywords
        self.unimog_keywords = [
            b'Unimog', b'UNIMOG', b'Portal', b'portal',
            b'U1000', b'U1100', b'U1200', b'U1300', b'U1400',
            b'U1500', b'U1600', b'U1700', b'U2100', b'U2150',
            b'U2450', b'U3000', b'U4000', b'U5000', b'U5023',
            b'404', b'406', b'411', b'416', b'421', b'424',
            b'425', b'427', b'435', b'437'
        ]
        
    def parse_rfile(self, rfile_path):
        """Parse a single rfile with better text extraction"""
        print(f"Parsing {rfile_path}...")
        
        file_size = os.path.getsize(rfile_path)
        total_pages = file_size // self.page_size
        
        print(f"  File size: {file_size:,} bytes ({total_pages:,} pages)")
        
        # Limit pages for initial testing (can be removed later)
        max_pages = min(total_pages, 10000)  # Process first 10k pages initially
        
        with open(rfile_path, 'rb') as f:
            for page_num in range(max_pages):
                if page_num % 1000 == 0:
                    print(f"  Processed {page_num:,}/{max_pages:,} pages... Parts: {len(self.parts)}, Procedures: {len(self.procedures)}")
                
                # Read page
                f.seek(page_num * self.page_size)
                page_data = f.read(self.page_size)
                
                # Skip empty pages
                if not any(page_data[:100]):
                    continue
                
                # Extract parts
                self.extract_parts_from_page(page_data)
                
                # Extract procedures  
                self.extract_procedures_from_page(page_data)
                
        print(f"  Completed {rfile_path.name}: {len(self.parts)} parts, {len(self.procedures)} procedures")
                
    def extract_parts_from_page(self, page_data):
        """Extract Mercedes part numbers from page"""
        
        for pattern in self.part_patterns:
            matches = pattern.finditer(page_data)
            
            for match in matches:
                try:
                    part_raw = match.group(1)
                    
                    # Clean up part number
                    part_num = part_raw.decode('ascii', errors='ignore')
                    part_num = re.sub(r'[^\dA-Z\s\.]', '', part_num)
                    part_num = re.sub(r'\.', ' ', part_num)  # Replace dots with spaces
                    part_num = re.sub(r'\s+', ' ', part_num).strip()
                    
                    # Validate format
                    if re.match(r'^[A-Z]\d{3}\s+\d{3}\s+\d{2}\s+\d{2}$', part_num):
                        # Try to extract description
                        start = match.end()
                        end = min(start + 200, len(page_data))
                        desc_data = page_data[start:end]
                        
                        # Extract readable text
                        desc = self.extract_clean_text(desc_data, max_length=100)
                        
                        # Store part
                        if part_num not in self.parts or len(desc) > len(self.parts[part_num]):
                            self.parts[part_num] = desc
                            
                except:
                    continue
                    
    def extract_procedures_from_page(self, page_data):
        """Extract repair procedures from page"""
        
        for keyword in self.procedure_keywords:
            if keyword not in page_data:
                continue
                
            # Find all occurrences (with safety limit)
            offset = 0
            occurrences = 0
            max_occurrences = 10  # Limit per keyword per page
            
            while occurrences < max_occurrences:
                pos = page_data.find(keyword, offset)
                if pos == -1:
                    break
                    
                # Extract procedure text (up to 500 bytes)
                end = min(pos + 500, len(page_data))
                proc_data = page_data[pos:end]
                
                # Clean text
                proc_text = self.extract_clean_text(proc_data, max_length=400)
                
                # Validate procedure
                if len(proc_text) > 30 and not self.is_garbage_text(proc_text):
                    # Check for Unimog relevance
                    is_unimog = any(kw.decode('ascii', errors='ignore').lower() in proc_text.lower() 
                                   for kw in self.unimog_keywords if kw)
                    
                    proc_id = hashlib.md5(proc_text.encode()).hexdigest()[:8]
                    
                    if proc_id not in self.procedures:
                        self.procedures[proc_id] = {
                            'title': proc_text[:80],
                            'content': proc_text,
                            'is_unimog': is_unimog,
                            'keyword': keyword.decode('ascii', errors='ignore')
                        }
                        
                offset = pos + len(keyword)  # Move past the keyword
                occurrences += 1
                
    def extract_clean_text(self, data, max_length=200):
        """Extract clean readable text from binary data"""
        
        text = []
        for i, byte in enumerate(data[:max_length]):
            # ASCII printable characters
            if 32 <= byte <= 126:
                text.append(chr(byte))
            # Common European characters
            elif byte in [196, 214, 220, 228, 246, 252, 223]:  # ÄÖÜäöüß
                text.append(chr(byte))
            # Space for control characters
            elif byte in [9, 10, 13]:
                text.append(' ')
            # Check for UTF-8 sequences
            elif byte >= 192 and i + 1 < len(data):
                try:
                    # Try to decode UTF-8
                    if byte < 224:  # 2-byte sequence
                        char = data[i:i+2].decode('utf-8', errors='ignore')
                        if char:
                            text.append(char)
                except:
                    pass
                    
        result = ''.join(text)
        
        # Clean up
        result = re.sub(r'\s+', ' ', result)
        result = re.sub(r'[^\w\s\-\.\,\(\)\/]', '', result)
        
        return result.strip()
        
    def is_garbage_text(self, text):
        """Check if text is likely garbage/binary data"""
        
        # Check for too many special characters
        special_count = sum(1 for c in text if c in '{}[]<>@#$%^&*')
        if special_count > len(text) * 0.2:
            return True
            
        # Check for reasonable word structure
        words = text.split()
        if not words:
            return True
            
        # Check average word length
        avg_word_len = sum(len(w) for w in words) / len(words)
        if avg_word_len < 2 or avg_word_len > 15:
            return True
            
        return False
        
    def process_all_files(self):
        """Process all rfiles in extraction directory"""
        
        rfiles = sorted(self.db_path.glob("rfile*.000"))
        print(f"Found {len(rfiles)} database files to process")
        
        # Process only first 3 files for initial extraction
        for rfile in rfiles[:3]:
            if not rfile.exists():
                print(f"  Skipping {rfile.name} - not found")
                continue
            self.parse_rfile(rfile)
            
            # Stop if we have enough data
            if len(self.parts) > 1000 or len(self.procedures) > 500:
                print(f"  Sufficient data extracted. Stopping early.")
                break
            
        # Also process EPC files if we need more data
        if len(self.parts) < 1000:
            epc_files = sorted(self.db_path.glob("*epc*.000"))
            for epc in epc_files[:2]:  # Process first 2 EPC files
                if epc.exists():
                    print(f"Processing EPC file: {epc.name}")
                    self.parse_rfile(epc)
            
    def export_results(self, output_dir):
        """Export extracted data"""
        
        output_path = Path(output_dir)
        output_path.mkdir(exist_ok=True)
        
        # Statistics
        print("\n" + "="*60)
        print("EXTRACTION RESULTS")
        print("="*60)
        print(f"✅ Parts extracted: {len(self.parts):,}")
        print(f"✅ Procedures extracted: {len(self.procedures):,}")
        
        unimog_procs = sum(1 for p in self.procedures.values() if p['is_unimog'])
        print(f"✅ Unimog-specific procedures: {unimog_procs}")
        
        # Sample data
        print("\n📦 Sample Parts:")
        for part, desc in list(self.parts.items())[:10]:
            print(f"  {part}: {desc[:50]}...")
            
        print("\n🔧 Sample Procedures:")
        for proc_id, proc in list(self.procedures.items())[:10]:
            title = proc['title'][:60]
            umog = "🚗" if proc['is_unimog'] else ""
            print(f"  {umog} [{proc['keyword']}] {title}...")
            
        # Export JSON
        data = {
            'statistics': {
                'total_parts': len(self.parts),
                'total_procedures': len(self.procedures),
                'unimog_procedures': unimog_procs
            },
            'parts': [
                {'part_number': k, 'description': v}
                for k, v in self.parts.items()
            ],
            'procedures': [
                {
                    'id': k,
                    'title': v['title'],
                    'content': v['content'],
                    'is_unimog': v['is_unimog']
                }
                for k, v in self.procedures.items()
            ]
        }
        
        json_file = output_path / 'wis_final_extract.json'
        with open(json_file, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
            
        print(f"\n✅ JSON exported: {json_file}")
        
        # Export SQL
        self.export_sql(output_path / 'wis_final_import.sql')
        
        return data
        
    def export_sql(self, sql_file):
        """Generate SQL for Supabase import"""
        
        with open(sql_file, 'w', encoding='utf-8') as f:
            f.write("-- Mercedes WIS Complete Data Import\n")
            f.write("-- Final extraction from TransBase database\n")
            f.write(f"-- Parts: {len(self.parts)} | Procedures: {len(self.procedures)}\n\n")
            f.write("BEGIN;\n\n")
            
            # Insert parts
            f.write("-- Parts Catalog\n")
            for part_num, desc in self.parts.items():
                part_clean = part_num.replace("'", "''")
                desc_clean = desc.replace("'", "''")[:500]
                
                f.write(f"""INSERT INTO wis_parts (part_number, description, search_vector)
VALUES ('{part_clean}', '{desc_clean}', to_tsvector('english', '{part_clean} {desc_clean}'))
ON CONFLICT (part_number) DO UPDATE SET description = EXCLUDED.description;
""")
                
            f.write("\n-- Repair Procedures\n")
            for proc_id, proc in self.procedures.items():
                title = proc['title'].replace("'", "''")
                content = proc['content'].replace("'", "''")
                
                f.write(f"""INSERT INTO wis_procedures (title, content, procedure_type, search_vector)
VALUES ('{title}', '{content}', 'repair', to_tsvector('english', '{title} {content}'))
ON CONFLICT DO NOTHING;
""")
                
            f.write("\nCOMMIT;\n")
            
        print(f"✅ SQL exported: {sql_file}")


import os

def main():
    print("="*60)
    print("MERCEDES WIS FINAL DATA EXTRACTOR")
    print("="*60)
    
    # Path to extracted database files
    db_dir = Path("/Volumes/UnimogManuals/WIS-COMPLETE-EXTRACTION")
    
    if not db_dir.exists():
        print(f"Error: Database directory not found: {db_dir}")
        return
        
    extractor = WISFinalExtractor(db_dir)
    
    # Process all files
    extractor.process_all_files()
    
    # Export results
    output_dir = "/Volumes/UnimogManuals/WIS-FINAL-COMPLETE"
    data = extractor.export_results(output_dir)
    
    print("\n" + "="*60)
    print("🎉 EXTRACTION COMPLETE!")
    print("="*60)
    print("Ready for import to Supabase!")


if __name__ == "__main__":
    main()