#!/usr/bin/env python3
"""
TransBase Database Parser - Complete WIS Data Extraction
Parses the actual TransBase rfile format from Mercedes WIS
"""

import os
import struct
import re
import json
import sqlite3
from pathlib import Path
from typing import List, Dict, Any
import hashlib

class TransBaseParser:
    """Parser for Mercedes WIS TransBase database files"""
    
    def __init__(self, db_path):
        self.db_path = Path(db_path)
        self.parts = {}
        self.procedures = {}
        self.bulletins = []
        self.models = set()
        self.diagrams = []
        
        # TransBase page size is typically 8192 bytes
        self.page_size = 8192
        
        # Known TransBase signatures
        self.signatures = {
            b'TRAN': 'Transaction',
            b'PAGE': 'Page header',
            b'RECD': 'Record',
            b'INDX': 'Index',
            b'DATA': 'Data block'
        }
        
    def parse_rfile(self, rfile_path):
        """Parse a single rfile database file"""
        print(f"Parsing {rfile_path}...")
        
        file_size = os.path.getsize(rfile_path)
        pages = file_size // self.page_size
        print(f"  File size: {file_size:,} bytes ({pages:,} pages)")
        
        with open(rfile_path, 'rb') as f:
            page_num = 0
            
            while True:
                # Read one page
                page_data = f.read(self.page_size)
                if not page_data:
                    break
                    
                page_num += 1
                if page_num % 1000 == 0:
                    print(f"  Processed {page_num:,} pages...")
                
                # Parse page
                self.parse_page(page_data, page_num)
                
    def parse_page(self, page_data, page_num):
        """Parse a single database page"""
        
        # Skip empty pages
        if page_data[:4] == b'\x00\x00\x00\x00':
            return
            
        # Look for Mercedes part numbers (A000 000 00 00 format)
        part_matches = re.finditer(
            rb'([A-Z]\d{3}\s+\d{3}\s+\d{2}\s+\d{2})',
            page_data
        )
        
        for match in part_matches:
            part_num = match.group(1).decode('ascii', errors='ignore')
            
            # Try to extract description (next 200 bytes after part number)
            start = match.end()
            end = min(start + 200, len(page_data))
            context = page_data[start:end]
            
            # Extract readable text as description
            desc = self.extract_text(context)
            
            if part_num not in self.parts or len(desc) > len(self.parts[part_num]):
                self.parts[part_num] = desc
                
        # Look for procedure keywords
        procedure_patterns = [
            b'Remove\x00',
            b'Install\x00',
            b'Replace\x00',
            b'Check\x00',
            b'Adjust\x00',
            b'Test\x00',
            b'Repair\x00'
        ]
        
        for pattern in procedure_patterns:
            if pattern in page_data:
                # Extract procedure text
                pos = page_data.find(pattern)
                # Read until null terminator or end of page
                end = page_data.find(b'\x00\x00', pos + len(pattern))
                if end == -1:
                    end = len(page_data)
                    
                proc_data = page_data[pos:end]
                proc_text = self.extract_text(proc_data)
                
                if len(proc_text) > 20 and len(proc_text) < 1000:
                    proc_id = f"PROC_{page_num}_{pos}"
                    if proc_id not in self.procedures:
                        self.procedures[proc_id] = {
                            'title': proc_text[:100],
                            'content': proc_text
                        }
                        
        # Look for Unimog model references
        unimog_pattern = rb'(Unimog|UNIMOG)\s+(\d{3,4})'
        model_matches = re.finditer(unimog_pattern, page_data)
        for match in model_matches:
            model = match.group(2).decode('ascii', errors='ignore')
            self.models.add(model)
            
    def extract_text(self, data):
        """Extract readable text from binary data"""
        # Remove non-printable characters
        text = []
        for byte in data:
            if 32 <= byte <= 126:  # Printable ASCII
                text.append(chr(byte))
            elif byte in [9, 10, 13]:  # Tab, newline, carriage return
                text.append(' ')
                
        result = ''.join(text)
        # Clean up multiple spaces
        result = re.sub(r'\s+', ' ', result)
        return result.strip()
        
    def parse_index_files(self, index_dir):
        """Parse index files for better data extraction"""
        index_path = Path(index_dir)
        if not index_path.exists():
            return
            
        print(f"Parsing index files from {index_dir}...")
        
        for idx_file in index_path.glob("**/*.idx"):
            with open(idx_file, 'rb') as f:
                content = f.read()
                # Extract any part numbers or procedures from index
                self.parse_page(content, 0)
                
    def export_to_sql(self, output_file):
        """Export extracted data to SQL format"""
        print(f"\nGenerating SQL export: {output_file}")
        
        sql_lines = []
        sql_lines.append("-- Mercedes WIS Complete Database Import")
        sql_lines.append("-- Extracted from TransBase database files")
        sql_lines.append(f"-- Parts: {len(self.parts)} | Procedures: {len(self.procedures)}")
        sql_lines.append("")
        sql_lines.append("BEGIN;")
        sql_lines.append("")
        
        # Export parts
        sql_lines.append("-- Parts Catalog")
        for part_num, desc in self.parts.items():
            part_clean = part_num.replace("'", "''")
            desc_clean = desc.replace("'", "''")[:500]
            
            sql = f"""INSERT INTO wis_parts (part_number, description, search_vector)
VALUES ('{part_clean}', '{desc_clean}', to_tsvector('english', '{part_clean} {desc_clean}'))
ON CONFLICT (part_number) DO UPDATE SET description = EXCLUDED.description;"""
            sql_lines.append(sql)
            
        sql_lines.append("")
        sql_lines.append("-- Repair Procedures")
        
        # Export procedures
        for proc_id, proc in self.procedures.items():
            title = proc['title'].replace("'", "''")
            content = proc['content'].replace("'", "''")
            
            sql = f"""INSERT INTO wis_procedures (title, content, procedure_type, search_vector)
VALUES ('{title}', '{content}', 'repair', to_tsvector('english', '{title} {content}'))
ON CONFLICT DO NOTHING;"""
            sql_lines.append(sql)
            
        # Add model information
        if self.models:
            sql_lines.append("")
            sql_lines.append("-- Model Information")
            models_str = ', '.join(sorted(self.models))
            sql_lines.append(f"-- Models found: {models_str}")
            
        sql_lines.append("")
        sql_lines.append("COMMIT;")
        
        # Write file
        with open(output_file, 'w', encoding='utf-8') as f:
            f.write('\n'.join(sql_lines))
            
        print(f"  SQL export complete: {len(sql_lines):,} lines")
        
    def export_to_json(self, output_file):
        """Export to JSON for review"""
        print(f"Generating JSON export: {output_file}")
        
        data = {
            'statistics': {
                'total_parts': len(self.parts),
                'total_procedures': len(self.procedures),
                'total_models': len(self.models)
            },
            'models': sorted(list(self.models)),
            'parts': [
                {'part_number': k, 'description': v}
                for k, v in list(self.parts.items())[:1000]
            ],
            'procedures': [
                {'id': k, 'title': v['title'], 'content': v['content']}
                for k, v in list(self.procedures.items())[:500]
            ]
        }
        
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
            
        print(f"  JSON export complete")
        
    def create_sqlite_db(self, output_file):
        """Create SQLite database for local testing"""
        print(f"Creating SQLite database: {output_file}")
        
        conn = sqlite3.connect(output_file)
        cursor = conn.cursor()
        
        # Create tables
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS parts (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                part_number TEXT UNIQUE,
                description TEXT
            )
        """)
        
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS procedures (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT,
                content TEXT
            )
        """)
        
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS models (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                model TEXT UNIQUE
            )
        """)
        
        # Insert data
        for part_num, desc in self.parts.items():
            cursor.execute(
                "INSERT OR IGNORE INTO parts (part_number, description) VALUES (?, ?)",
                (part_num, desc)
            )
            
        for proc in self.procedures.values():
            cursor.execute(
                "INSERT INTO procedures (title, content) VALUES (?, ?)",
                (proc['title'], proc['content'])
            )
            
        for model in self.models:
            cursor.execute(
                "INSERT OR IGNORE INTO models (model) VALUES (?)",
                (model,)
            )
            
        conn.commit()
        
        # Get counts
        parts_count = cursor.execute("SELECT COUNT(*) FROM parts").fetchone()[0]
        procs_count = cursor.execute("SELECT COUNT(*) FROM procedures").fetchone()[0]
        models_count = cursor.execute("SELECT COUNT(*) FROM models").fetchone()[0]
        
        conn.close()
        
        print(f"  SQLite database created:")
        print(f"    Parts: {parts_count:,}")
        print(f"    Procedures: {procs_count:,}")
        print(f"    Models: {models_count}")


def main():
    print("="*60)
    print("MERCEDES WIS TRANSBASE DATABASE PARSER")
    print("="*60)
    
    # Path to extracted database files
    db_dir = Path("/Volumes/UnimogManuals/WIS-COMPLETE-EXTRACTION")
    
    if not db_dir.exists():
        print(f"Error: Database directory not found: {db_dir}")
        return
        
    parser = TransBaseParser(db_dir)
    
    # Parse all rfiles
    for rfile in sorted(db_dir.glob("rfile*.000")):
        parser.parse_rfile(rfile)
        
    # Parse index files if available
    index_dir = db_dir / "index_files"
    if index_dir.exists():
        parser.parse_index_files(index_dir)
        
    # Export results
    output_dir = Path("/Volumes/UnimogManuals/WIS-FINAL")
    output_dir.mkdir(exist_ok=True)
    
    parser.export_to_sql(output_dir / "wis_complete.sql")
    parser.export_to_json(output_dir / "wis_complete.json")
    parser.create_sqlite_db(output_dir / "wis_complete.db")
    
    # Print summary
    print("\n" + "="*60)
    print("EXTRACTION COMPLETE!")
    print("="*60)
    print(f"✅ Parts extracted: {len(parser.parts):,}")
    print(f"✅ Procedures extracted: {len(parser.procedures):,}")
    print(f"✅ Models identified: {len(parser.models)}")
    print(f"\n📁 Output files in: {output_dir}")
    print("   - wis_complete.sql (for Supabase)")
    print("   - wis_complete.json (for review)")
    print("   - wis_complete.db (SQLite for testing)")


if __name__ == "__main__":
    main()