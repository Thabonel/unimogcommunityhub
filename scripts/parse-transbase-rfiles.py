#!/usr/bin/env python3
"""
Direct Parser for Transbase Database rfiles
Extracts WIS data from binary database files without needing Transbase software
"""

import os
import sys
import struct
import json
import re
from pathlib import Path
from typing import Dict, List, Any, Optional
import sqlite3
import hashlib

class TransbaseParser:
    """Parser for Transbase database rfile format"""
    
    def __init__(self, rfile_dir: str):
        self.rfile_dir = Path(rfile_dir)
        self.data = {
            'procedures': [],
            'parts': [],
            'bulletins': [],
            'models': [],
            'diagrams': []
        }
        
    def parse_rfiles(self):
        """Parse all rfiles in directory"""
        print(f"Scanning directory: {self.rfile_dir}")
        
        # Find all rfile* files
        rfiles = sorted(self.rfile_dir.glob("rfile*"))
        print(f"Found {len(rfiles)} rfiles")
        
        for rfile in rfiles:
            print(f"\nProcessing {rfile.name}...")
            self.parse_single_rfile(rfile)
            
    def parse_single_rfile(self, filepath: Path):
        """Parse a single rfile using forensic string extraction"""
        
        with open(filepath, 'rb') as f:
            content = f.read()
            
        # Extract strings (procedures, parts, etc.)
        strings = self.extract_strings(content, min_length=5)
        
        # Identify and categorize data
        for string in strings:
            self.categorize_string(string)
            
    def extract_strings(self, data: bytes, min_length: int = 5) -> List[str]:
        """Extract ASCII and UTF-16 strings from binary data"""
        strings = []
        
        # ASCII strings
        ascii_pattern = rb'[\x20-\x7E]{' + str(min_length).encode() + rb',}'
        for match in re.finditer(ascii_pattern, data):
            try:
                decoded = match.group().decode('ascii', errors='ignore')
                if decoded:
                    strings.append(decoded)
            except:
                pass
                
        # UTF-16 strings (common in Windows databases)
        try:
            # Try UTF-16 LE
            utf16_data = data.decode('utf-16-le', errors='ignore')
            for line in utf16_data.split('\x00'):
                if len(line) >= min_length and line.isprintable():
                    strings.append(line)
        except:
            pass
            
        return strings
        
    def categorize_string(self, text: str):
        """Categorize extracted string into appropriate data type"""
        
        # Skip short or non-meaningful strings
        if len(text) < 10 or text.count(' ') < 2:
            return
            
        # Detect Mercedes part numbers (format: A123 456 78 90)
        part_pattern = r'^[A-Z]\d{3}\s?\d{3}\s?\d{2}\s?\d{2}'
        if re.match(part_pattern, text):
            self.data['parts'].append({
                'part_number': text.split()[0] if ' ' in text else text,
                'description': ' '.join(text.split()[1:]) if ' ' in text else '',
                'raw_text': text
            })
            return
            
        # Detect procedures (usually start with action verbs)
        procedure_keywords = ['Remove', 'Install', 'Check', 'Replace', 'Adjust', 
                            'Test', 'Inspect', 'Repair', 'Clean', 'Disconnect']
        for keyword in procedure_keywords:
            if text.startswith(keyword):
                self.data['procedures'].append({
                    'title': text[:100],
                    'content': text,
                    'type': 'repair'
                })
                return
                
        # Detect bulletins (often have dates or bulletin numbers)
        if re.search(r'\d{4}-\d{2}-\d{2}', text) or re.search(r'SB-\d+', text):
            self.data['bulletins'].append({
                'content': text,
                'raw_text': text
            })
            return
            
        # Detect model information
        if 'Unimog' in text or re.search(r'U\d{3,4}', text):
            self.data['models'].append({
                'description': text,
                'raw_text': text
            })
            
    def extract_structured_data(self, filepath: Path):
        """Extract structured data using known Transbase patterns"""
        
        with open(filepath, 'rb') as f:
            content = f.read()
            
        # Known Transbase record patterns
        # Look for record headers (usually start with specific bytes)
        record_starts = []
        
        # Common patterns in Transbase files
        patterns = [
            b'\x00\x00\x00\x01',  # Record marker
            b'\x00\x00\x00\x02',  # Table marker
            b'TABL',              # Table definition
            b'RECD',              # Record definition
        ]
        
        for pattern in patterns:
            offset = 0
            while True:
                pos = content.find(pattern, offset)
                if pos == -1:
                    break
                record_starts.append(pos)
                offset = pos + 1
                
        # Extract data between record markers
        for i, start in enumerate(record_starts[:-1]):
            end = record_starts[i + 1]
            record_data = content[start:end]
            self.parse_record(record_data)
            
    def parse_record(self, record_data: bytes):
        """Parse individual database record"""
        
        # Skip very small records
        if len(record_data) < 20:
            return
            
        # Try to identify record type
        # Look for common field patterns
        
        # Extract any readable text
        text_data = self.extract_strings(record_data, min_length=3)
        
        if text_data:
            # Join meaningful strings
            combined = ' '.join([s for s in text_data if len(s) > 5])
            if combined:
                self.categorize_string(combined)
                
    def export_to_json(self, output_file: str):
        """Export extracted data to JSON"""
        
        # Remove duplicates
        for key in self.data:
            if self.data[key]:
                # Use hash to identify duplicates
                seen = set()
                unique = []
                for item in self.data[key]:
                    item_hash = hashlib.md5(
                        json.dumps(item, sort_keys=True).encode()
                    ).hexdigest()
                    if item_hash not in seen:
                        seen.add(item_hash)
                        unique.append(item)
                self.data[key] = unique
                
        # Statistics
        print("\n=== Extraction Statistics ===")
        for key, items in self.data.items():
            print(f"{key}: {len(items)} items")
            
        # Write JSON
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(self.data, f, indent=2, ensure_ascii=False)
            
        print(f"\nData exported to: {output_file}")
        
    def export_to_sql(self, output_file: str):
        """Export extracted data to SQL format for Supabase"""
        
        sql_statements = []
        
        # Create procedures insert statements
        for proc in self.data['procedures']:
            title = proc['title'].replace("'", "''")
            content = proc['content'].replace("'", "''")
            sql = f"""
INSERT INTO wis_procedures (title, content, procedure_type, search_vector)
VALUES ('{title}', '{content}', '{proc.get('type', 'general')}', 
        to_tsvector('english', '{title} {content}'))
ON CONFLICT DO NOTHING;
"""
            sql_statements.append(sql)
            
        # Create parts insert statements
        for part in self.data['parts']:
            part_num = part['part_number'].replace("'", "''")
            desc = part['description'].replace("'", "''")
            sql = f"""
INSERT INTO wis_parts (part_number, description, search_vector)
VALUES ('{part_num}', '{desc}', to_tsvector('english', '{part_num} {desc}'))
ON CONFLICT (part_number) DO NOTHING;
"""
            sql_statements.append(sql)
            
        # Create bulletins insert statements
        for bulletin in self.data['bulletins']:
            content = bulletin['content'].replace("'", "''")
            sql = f"""
INSERT INTO wis_bulletins (content, search_vector)
VALUES ('{content}', to_tsvector('english', '{content}'))
ON CONFLICT DO NOTHING;
"""
            sql_statements.append(sql)
            
        # Write SQL file
        with open(output_file, 'w', encoding='utf-8') as f:
            f.write("-- WIS Database Import\n")
            f.write("-- Generated from Transbase rfiles\n\n")
            f.write("BEGIN;\n\n")
            
            for sql in sql_statements:
                f.write(sql + "\n")
                
            f.write("\nCOMMIT;\n")
            
        print(f"SQL export created: {output_file}")
        print(f"Total statements: {len(sql_statements)}")
        
    def create_sqlite_db(self, output_file: str):
        """Create SQLite database for local testing"""
        
        conn = sqlite3.connect(output_file)
        cursor = conn.cursor()
        
        # Create tables
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS procedures (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT,
                content TEXT,
                type TEXT
            )
        """)
        
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS parts (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                part_number TEXT UNIQUE,
                description TEXT
            )
        """)
        
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS bulletins (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                content TEXT
            )
        """)
        
        # Insert data
        for proc in self.data['procedures']:
            cursor.execute(
                "INSERT OR IGNORE INTO procedures (title, content, type) VALUES (?, ?, ?)",
                (proc['title'], proc['content'], proc.get('type', 'general'))
            )
            
        for part in self.data['parts']:
            cursor.execute(
                "INSERT OR IGNORE INTO parts (part_number, description) VALUES (?, ?)",
                (part['part_number'], part['description'])
            )
            
        for bulletin in self.data['bulletins']:
            cursor.execute(
                "INSERT OR IGNORE INTO bulletins (content) VALUES (?)",
                (bulletin['content'],)
            )
            
        conn.commit()
        conn.close()
        
        print(f"SQLite database created: {output_file}")


def main():
    if len(sys.argv) < 2:
        print("Usage: python parse-transbase-rfiles.py <rfiles_directory> [output_dir]")
        print("\nExample:")
        print("  python parse-transbase-rfiles.py /Volumes/UnimogManuals/wis-forensic-extract")
        sys.exit(1)
        
    rfile_dir = sys.argv[1]
    output_dir = sys.argv[2] if len(sys.argv) > 2 else "."
    
    if not os.path.exists(rfile_dir):
        print(f"Error: Directory {rfile_dir} not found")
        sys.exit(1)
        
    # Create output directory
    output_path = Path(output_dir)
    output_path.mkdir(exist_ok=True)
    
    # Initialize parser
    parser = TransbaseParser(rfile_dir)
    
    print("=== Transbase rfile Parser ===")
    print(f"Input directory: {rfile_dir}")
    print(f"Output directory: {output_dir}")
    print("")
    
    # Parse files
    parser.parse_rfiles()
    
    # Also try structured extraction on each file
    for rfile in Path(rfile_dir).glob("rfile*"):
        print(f"\nAttempting structured extraction on {rfile.name}...")
        parser.extract_structured_data(rfile)
    
    # Export results
    json_file = output_path / "wis_data.json"
    sql_file = output_path / "wis_import.sql"
    sqlite_file = output_path / "wis_data.db"
    
    parser.export_to_json(str(json_file))
    parser.export_to_sql(str(sql_file))
    parser.create_sqlite_db(str(sqlite_file))
    
    print("\n=== Extraction Complete ===")
    print(f"JSON data: {json_file}")
    print(f"SQL import: {sql_file}")
    print(f"SQLite DB: {sqlite_file}")
    print("\nNext steps:")
    print("1. Review the extracted data in wis_data.json")
    print("2. Run the SQL import file against Supabase")
    print("3. Or use the SQLite database for local testing")


if __name__ == "__main__":
    main()