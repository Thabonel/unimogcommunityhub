#!/usr/bin/env python3
"""
Mercedes WIS Database Extractor
Extracts data from proprietary Mercedes WIS formats for AI processing
"""

import os
import json
import struct
import mmap
import zlib
import gzip
import sqlite3
from pathlib import Path
from typing import Dict, List, Any, Optional
import subprocess
import re

class MercedesWISExtractor:
    """Extract data from Mercedes WIS proprietary formats"""
    
    def __init__(self, vdi_mount_path: str = "/Volumes/WIS-Mount"):
        self.mount_path = Path(vdi_mount_path)
        self.ewa_paths = [
            self.mount_path / "Program Files/EWA net",
            self.mount_path / "Program Files (x86)/EWA net",
            self.mount_path / "Mercedes/WIS",
            self.mount_path / "EWA"
        ]
        self.extracted_data = {}
        self.chunks = []
        
    def find_ewa_installation(self) -> Optional[Path]:
        """Locate the EWA/WIS installation directory"""
        for path in self.ewa_paths:
            if path.exists():
                print(f"✅ Found EWA installation at: {path}")
                return path
        print("❌ No EWA installation found")
        return None
    
    # ============== MDB Extraction (Easiest) ==============
    
    def extract_mdb_files(self, ewa_path: Path) -> Dict:
        """Extract data from Microsoft Access MDB files using mdb-tools"""
        mdb_data = {}
        mdb_files = list(ewa_path.glob("**/*.mdb"))
        
        print(f"📊 Found {len(mdb_files)} MDB files")
        
        for mdb_file in mdb_files:
            print(f"  Processing: {mdb_file.name}")
            try:
                # List tables using mdb-tools
                tables_output = subprocess.run(
                    ["mdb-tables", "-1", str(mdb_file)],
                    capture_output=True,
                    text=True
                )
                
                if tables_output.returncode == 0:
                    tables = tables_output.stdout.strip().split('\n')
                    mdb_data[mdb_file.name] = {}
                    
                    for table in tables:
                        if table:
                            # Export table to CSV
                            csv_output = subprocess.run(
                                ["mdb-export", str(mdb_file), table],
                                capture_output=True,
                                text=True
                            )
                            
                            if csv_output.returncode == 0:
                                mdb_data[mdb_file.name][table] = self.parse_csv(csv_output.stdout)
                                print(f"    ✅ Extracted table: {table}")
            except Exception as e:
                print(f"    ❌ Error: {e}")
                
        return mdb_data
    
    def parse_csv(self, csv_text: str) -> List[Dict]:
        """Parse CSV text into list of dictionaries"""
        lines = csv_text.strip().split('\n')
        if len(lines) < 2:
            return []
        
        headers = lines[0].split(',')
        records = []
        
        for line in lines[1:]:
            values = line.split(',')
            record = dict(zip(headers, values))
            records.append(record)
            
        return records
    
    # ============== Transbase ROM Analysis ==============
    
    def analyze_transbase_roms(self, ewa_path: Path) -> Dict:
        """Analyze Transbase ROM files for extractable content"""
        rom_data = {}
        rom_files = list(ewa_path.glob("**/rfile*"))
        
        print(f"📦 Found {len(rom_files)} ROM files")
        
        for rom_file in rom_files:
            print(f"  Analyzing: {rom_file.name}")
            try:
                extracted_text = self.extract_text_from_binary(rom_file)
                if extracted_text:
                    rom_data[rom_file.name] = {
                        'size': rom_file.stat().st_size,
                        'text_snippets': extracted_text[:100],  # First 100 text segments
                        'total_text_found': len(extracted_text)
                    }
                    print(f"    ✅ Found {len(extracted_text)} text segments")
            except Exception as e:
                print(f"    ❌ Error: {e}")
                
        return rom_data
    
    def extract_text_from_binary(self, filepath: Path, min_length: int = 20) -> List[str]:
        """Extract ASCII text strings from binary file"""
        text_segments = []
        
        with open(filepath, 'rb') as f:
            with mmap.mmap(f.fileno(), 0, access=mmap.ACCESS_READ) as mm:
                # Look for ASCII text patterns
                pattern = rb'[\x20-\x7E]{' + str(min_length).encode() + rb',}'
                
                for match in re.finditer(pattern, mm):
                    try:
                        text = match.group().decode('utf-8', errors='ignore')
                        # Filter out nonsense strings
                        if self.is_meaningful_text(text):
                            text_segments.append(text)
                    except:
                        continue
                        
        return text_segments
    
    def is_meaningful_text(self, text: str) -> bool:
        """Check if extracted text is meaningful"""
        # Must contain at least some letters
        if not re.search(r'[a-zA-Z]{3,}', text):
            return False
        
        # Should have reasonable character distribution
        alnum_ratio = len([c for c in text if c.isalnum()]) / len(text)
        if alnum_ratio < 0.5:
            return False
            
        # Check for Mercedes/automotive keywords
        keywords = ['mercedes', 'unimog', 'engine', 'brake', 'transmission', 
                   'oil', 'filter', 'bearing', 'shaft', 'valve', 'sensor',
                   'U300', 'U400', 'U500', 'U1000', 'U2000', 'U3000', 'U4000', 'U5000']
        
        text_lower = text.lower()
        for keyword in keywords:
            if keyword in text_lower:
                return True
                
        # Accept if it looks like a procedure or part description
        if len(text.split()) > 3:  # Multi-word phrase
            return True
            
        return False
    
    # ============== CBF Decompression ==============
    
    def extract_cbf_files(self, ewa_path: Path) -> Dict:
        """Extract compressed CBF files"""
        cbf_data = {}
        cbf_files = list(ewa_path.glob("**/*.cbf"))
        
        print(f"🗜️ Found {len(cbf_files)} CBF files")
        
        for cbf_file in cbf_files:
            print(f"  Processing: {cbf_file.name}")
            try:
                content = self.decompress_cbf(cbf_file)
                if content:
                    cbf_data[cbf_file.name] = {
                        'size': cbf_file.stat().st_size,
                        'decompressed_size': len(content),
                        'content_preview': content[:1000]
                    }
                    print(f"    ✅ Decompressed successfully")
            except Exception as e:
                print(f"    ❌ Error: {e}")
                
        return cbf_data
    
    def decompress_cbf(self, filepath: Path) -> Optional[bytes]:
        """Try various decompression methods on CBF file"""
        with open(filepath, 'rb') as f:
            data = f.read()
            
        # Try different compression algorithms
        methods = [
            ('zlib', lambda x: zlib.decompress(x)),
            ('gzip', lambda x: gzip.decompress(x)),
            ('zlib_offset', lambda x: zlib.decompress(x[2:])),  # Skip header
            ('raw', lambda x: x)
        ]
        
        for method_name, decompress_func in methods:
            try:
                decompressed = decompress_func(data)
                # Check if result looks like text or structured data
                if self.looks_like_text(decompressed):
                    return decompressed
            except:
                continue
                
        return None
    
    def looks_like_text(self, data: bytes) -> bool:
        """Check if data appears to be text"""
        try:
            text = data[:1000].decode('utf-8', errors='ignore')
            printable_ratio = len([c for c in text if c.isprintable()]) / len(text)
            return printable_ratio > 0.7
        except:
            return False
    
    # ============== Image Conversion ==============
    
    def convert_cpg_images(self, ewa_path: Path) -> Dict:
        """Convert CPG images to standard formats"""
        image_data = {}
        cpg_files = list(ewa_path.glob("**/*.cpg"))
        
        print(f"🖼️ Found {len(cpg_files)} CPG image files")
        
        for cpg_file in cpg_files:
            print(f"  Analyzing: {cpg_file.name}")
            try:
                image_info = self.analyze_cpg_format(cpg_file)
                if image_info:
                    image_data[cpg_file.name] = image_info
                    print(f"    ✅ Image type: {image_info.get('type', 'unknown')}")
            except Exception as e:
                print(f"    ❌ Error: {e}")
                
        return image_data
    
    def analyze_cpg_format(self, filepath: Path) -> Optional[Dict]:
        """Analyze CPG file format"""
        with open(filepath, 'rb') as f:
            header = f.read(1024)
            
        # Check for embedded standard formats
        if b'JFIF' in header or b'\xff\xd8' in header:
            return {'type': 'embedded_jpeg', 'offset': header.find(b'\xff\xd8')}
        elif b'PNG' in header or b'\x89PNG' in header:
            return {'type': 'embedded_png', 'offset': header.find(b'\x89PNG')}
        elif b'BM' in header[:2]:
            return {'type': 'embedded_bmp', 'offset': 0}
        else:
            # Proprietary format - needs more analysis
            return {'type': 'proprietary', 'header_hex': header[:32].hex()}
    
    # ============== AI Chunking ==============
    
    def create_ai_chunks(self) -> List[Dict]:
        """Convert extracted data to AI-ready chunks"""
        chunks = []
        
        # Process MDB data
        for mdb_file, tables in self.extracted_data.get('mdb', {}).items():
            for table_name, records in tables.items():
                for record in records:
                    chunk = self.create_chunk_from_record(record, mdb_file, table_name)
                    if chunk:
                        chunks.append(chunk)
        
        # Process extracted text from ROM files
        for rom_file, data in self.extracted_data.get('rom', {}).items():
            for text_segment in data.get('text_snippets', []):
                chunk = self.create_chunk_from_text(text_segment, rom_file)
                if chunk:
                    chunks.append(chunk)
        
        return chunks
    
    def create_chunk_from_record(self, record: Dict, source: str, table: str) -> Optional[Dict]:
        """Create an AI-ready chunk from database record"""
        # Extract meaningful content
        content_parts = []
        metadata = {
            'source': source,
            'table': table,
            'type': 'database_record'
        }
        
        for key, value in record.items():
            if value and str(value).strip():
                # Add to content
                content_parts.append(f"{key}: {value}")
                
                # Extract metadata
                if 'model' in key.lower():
                    metadata['vehicle_model'] = value
                elif 'procedure' in key.lower():
                    metadata['procedure_type'] = value
                elif 'part' in key.lower() and 'number' in key.lower():
                    metadata['part_number'] = value
        
        if content_parts:
            return {
                'content': '\n'.join(content_parts),
                'metadata': metadata
            }
        
        return None
    
    def create_chunk_from_text(self, text: str, source: str) -> Optional[Dict]:
        """Create an AI-ready chunk from extracted text"""
        # Identify content type based on keywords
        content_type = 'general'
        
        if any(word in text.lower() for word in ['procedure', 'step', 'install', 'remove']):
            content_type = 'procedure'
        elif any(word in text.lower() for word in ['part', 'number', 'quantity']):
            content_type = 'parts'
        elif any(word in text.lower() for word in ['fault', 'diagnostic', 'error']):
            content_type = 'diagnostic'
        
        return {
            'content': text,
            'metadata': {
                'source': source,
                'type': content_type,
                'extraction_method': 'binary_text_extraction'
            }
        }
    
    # ============== Main Extraction Pipeline ==============
    
    def extract_all(self) -> Dict:
        """Run complete extraction pipeline"""
        print("🚀 Starting Mercedes WIS Extraction Pipeline")
        print("=" * 50)
        
        # Find EWA installation
        ewa_path = self.find_ewa_installation()
        if not ewa_path:
            print("Cannot proceed without EWA installation")
            return {}
        
        # Extract each format
        print("\n📂 Phase 1: MDB Files (Easiest)")
        self.extracted_data['mdb'] = self.extract_mdb_files(ewa_path)
        
        print("\n📦 Phase 2: Transbase ROM Files")
        self.extracted_data['rom'] = self.analyze_transbase_roms(ewa_path)
        
        print("\n🗜️ Phase 3: CBF Files")
        self.extracted_data['cbf'] = self.extract_cbf_files(ewa_path)
        
        print("\n🖼️ Phase 4: CPG Images")
        self.extracted_data['images'] = self.convert_cpg_images(ewa_path)
        
        print("\n🤖 Phase 5: Creating AI Chunks")
        self.chunks = self.create_ai_chunks()
        
        print("\n✅ Extraction Complete!")
        print(f"  - MDB tables extracted: {sum(len(t) for t in self.extracted_data.get('mdb', {}).values())}")
        print(f"  - ROM text segments: {sum(d.get('total_text_found', 0) for d in self.extracted_data.get('rom', {}).values())}")
        print(f"  - AI chunks created: {len(self.chunks)}")
        
        return self.extracted_data
    
    def save_results(self, output_dir: str = "/Volumes/UnimogManuals/wis-extracted"):
        """Save extraction results"""
        output_path = Path(output_dir)
        output_path.mkdir(parents=True, exist_ok=True)
        
        # Save raw extracted data
        with open(output_path / "extracted_data.json", 'w') as f:
            # Convert to JSON-serializable format
            json_data = {}
            for key, value in self.extracted_data.items():
                if isinstance(value, dict):
                    json_data[key] = {k: str(v)[:1000] if not isinstance(v, (dict, list)) else v 
                                     for k, v in value.items()}
            json.dump(json_data, f, indent=2)
        
        # Save AI chunks
        with open(output_path / "ai_chunks.json", 'w') as f:
            json.dump(self.chunks, f, indent=2)
        
        print(f"\n💾 Results saved to: {output_path}")


if __name__ == "__main__":
    # Run extraction
    extractor = MercedesWISExtractor()
    data = extractor.extract_all()
    extractor.save_results()