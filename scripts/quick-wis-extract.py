#!/usr/bin/env python3
"""
Quick WIS data extractor - reads RAW file directly without mounting
"""

import os
import re
import mmap
import json
from pathlib import Path
from collections import defaultdict

class QuickWISExtractor:
    def __init__(self, raw_file_path):
        self.raw_file = raw_file_path
        self.data = defaultdict(list)
        self.part_pattern = re.compile(rb'[A-Z]\d{3}\s?\d{3}\s?\d{2}\s?\d{2}')
        self.procedure_pattern = re.compile(rb'(Remove|Install|Check|Replace|Adjust|Test|Repair|Disconnect|Connect)\s+[A-Za-z\s]{10,100}')
        
    def extract_chunks(self, chunk_size=100*1024*1024):  # 100MB chunks
        """Extract data in chunks to handle large file"""
        print(f"Processing {self.raw_file} in {chunk_size/(1024*1024)}MB chunks...")
        
        file_size = os.path.getsize(self.raw_file)
        total_chunks = file_size // chunk_size + 1
        
        with open(self.raw_file, 'rb') as f:
            for chunk_num in range(total_chunks):
                if chunk_num % 10 == 0:
                    print(f"Processing chunk {chunk_num}/{total_chunks}...")
                
                f.seek(chunk_num * chunk_size)
                chunk = f.read(chunk_size)
                
                # Extract part numbers
                parts = self.part_pattern.findall(chunk)
                for part in parts:
                    part_str = part.decode('ascii', errors='ignore')
                    if part_str and len(part_str) > 8:
                        self.data['parts'].append(part_str)
                
                # Extract procedures
                procedures = self.procedure_pattern.findall(chunk)
                for proc in procedures:
                    proc_str = proc.decode('ascii', errors='ignore')
                    if proc_str and len(proc_str) > 15:
                        self.data['procedures'].append(proc_str)
                
                # Look for Unimog references
                if b'Unimog' in chunk or b'UNIMOG' in chunk:
                    # Extract context around Unimog mentions
                    for match in re.finditer(rb'.{0,100}[Uu]nimog.{0,100}', chunk):
                        context = match.group().decode('ascii', errors='ignore')
                        if len(context) > 20:
                            self.data['unimog_refs'].append(context)
                
                # Early exit if we have enough data
                if len(self.data['parts']) > 10000 and len(self.data['procedures']) > 1000:
                    print("Found sufficient data, stopping early...")
                    break
    
    def save_results(self, output_dir):
        """Save extracted data"""
        output_path = Path(output_dir)
        output_path.mkdir(exist_ok=True)
        
        # Remove duplicates
        for key in self.data:
            self.data[key] = list(set(self.data[key]))
        
        # Save to JSON
        with open(output_path / 'wis_extracted.json', 'w') as f:
            json.dump(dict(self.data), f, indent=2)
        
        # Save parts to CSV
        with open(output_path / 'parts.csv', 'w') as f:
            f.write("part_number\n")
            for part in sorted(self.data['parts']):
                f.write(f"{part}\n")
        
        # Save procedures
        with open(output_path / 'procedures.txt', 'w') as f:
            for proc in sorted(self.data['procedures']):
                f.write(f"{proc}\n\n")
        
        # Statistics
        print("\n=== Extraction Results ===")
        print(f"Parts found: {len(self.data['parts'])}")
        print(f"Procedures found: {len(self.data['procedures'])}")
        print(f"Unimog references: {len(self.data['unimog_refs'])}")
        
        # Sample data
        print("\nSample parts:")
        for part in list(self.data['parts'])[:5]:
            print(f"  - {part}")
        
        print("\nSample procedures:")
        for proc in list(self.data['procedures'])[:5]:
            print(f"  - {proc[:80]}...")

if __name__ == "__main__":
    extractor = QuickWISExtractor("/Volumes/UnimogManuals/wis-extraction/MERCEDES.raw")
    extractor.extract_chunks()
    extractor.save_results("/Volumes/UnimogManuals/wis-quick-extract")