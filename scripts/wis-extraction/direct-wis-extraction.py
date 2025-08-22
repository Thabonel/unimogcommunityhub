#!/usr/bin/env python3
"""
Direct WIS Database Extraction using Python
Alternative to DbVisualizer for automated extraction
"""

import os
import csv
import json
import socket
import struct
import time
from pathlib import Path

# Configuration
WIS_HOST = "localhost"  # or "10.0.2.15" for QEMU NAT
WIS_PORT = 2054
EXPORT_DIR = "/Volumes/UnimogManuals/wis-complete-extraction"

def wait_for_wis():
    """Wait for WIS database to be available"""
    print("⏳ Waiting for WIS database on port 2054...")
    max_attempts = 30
    for i in range(max_attempts):
        try:
            sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            sock.settimeout(1)
            result = sock.connect_ex((WIS_HOST, WIS_PORT))
            sock.close()
            if result == 0:
                print("✅ WIS database is accessible!")
                return True
        except:
            pass
        time.sleep(2)
        print(f"   Attempt {i+1}/{max_attempts}...")
    return False

def extract_via_http():
    """
    Try to extract via HTTP if WIS has web interface
    """
    import urllib.request
    import urllib.parse
    
    # Common WIS web interfaces
    urls = [
        f"http://{WIS_HOST}:8080/wis/export",
        f"http://{WIS_HOST}:8081/api/export",
        f"http://{WIS_HOST}:9090/wisnet/data"
    ]
    
    for url in urls:
        try:
            response = urllib.request.urlopen(url, timeout=5)
            if response.status == 200:
                print(f"✅ Found WIS web interface at {url}")
                return response.read()
        except:
            continue
    return None

def extract_from_shared_folder():
    """
    Check if VM has shared folder with exports
    """
    shared_paths = [
        "/Volumes/MERCEDES/export",
        "/Volumes/WIS/export",
        "/tmp/wis-export"
    ]
    
    for path in shared_paths:
        if os.path.exists(path):
            print(f"✅ Found shared folder: {path}")
            return path
    return None

def parse_rfile_header(data):
    """
    Parse Transbase rfile header structure
    """
    if len(data) < 256:
        return None
    
    # Transbase rfile format (simplified)
    # 0x00-0x0F: Magic header
    # 0x10-0x1F: Version info
    # 0x20-0x3F: Table metadata
    # 0x40+: Data records
    
    magic = data[0:4]
    if magic == b'TBRF':  # Transbase RFile
        version = struct.unpack('>I', data[4:8])[0]
        table_count = struct.unpack('>I', data[8:12])[0]
        return {
            'version': version,
            'tables': table_count,
            'data_offset': 256
        }
    return None

def extract_strings_from_binary(filepath, min_length=4):
    """
    Extract readable strings from binary rfiles
    """
    strings = []
    with open(filepath, 'rb') as f:
        data = f.read()
        
        # Look for UTF-8 strings
        current = []
        for byte in data:
            if 32 <= byte <= 126:  # Printable ASCII
                current.append(chr(byte))
            else:
                if len(current) >= min_length:
                    strings.append(''.join(current))
                current = []
        
        if len(current) >= min_length:
            strings.append(''.join(current))
    
    return strings

def process_rfiles():
    """
    Process rfiles from exported directory
    """
    rfile_dir = "/Volumes/UnimogManuals/wis-rfiles"
    if not os.path.exists(rfile_dir):
        print(f"⚠️  Rfiles directory not found: {rfile_dir}")
        return
    
    print("📂 Processing rfiles...")
    
    # Map rfiles to WIS data types
    rfile_mapping = {
        'rfile00002': 'procedures',
        'rfile00003': 'parts', 
        'rfile00004': 'bulletins',
        'rfile00005': 'models',
        'rfile00006': 'wiring'
    }
    
    os.makedirs(EXPORT_DIR, exist_ok=True)
    
    for rfile, data_type in rfile_mapping.items():
        rfile_path = os.path.join(rfile_dir, rfile)
        if os.path.exists(rfile_path):
            print(f"  Processing {rfile} → {data_type}...")
            
            # Extract strings from binary
            strings = extract_strings_from_binary(rfile_path)
            
            # Save to CSV
            output_dir = os.path.join(EXPORT_DIR, data_type)
            os.makedirs(output_dir, exist_ok=True)
            output_file = os.path.join(output_dir, f"{data_type}.csv")
            
            with open(output_file, 'w', newline='', encoding='utf-8') as f:
                writer = csv.writer(f)
                writer.writerow(['content'])  # Simple extraction
                for s in strings:
                    if len(s) > 10:  # Filter out short strings
                        writer.writerow([s])
            
            print(f"    ✅ Extracted {len(strings)} items to {output_file}")

def main():
    """
    Main extraction process
    """
    print("🚀 Direct WIS Extraction Tool")
    print("=" * 40)
    
    # Check if WIS is accessible
    if not wait_for_wis():
        print("❌ WIS database not accessible")
        print("   Make sure:")
        print("   1. QEMU VM is running")
        print("   2. Windows is logged in (Admin/12345)")
        print("   3. WIS application is started")
        return
    
    # Try different extraction methods
    print("\n📡 Attempting extraction methods...")
    
    # Method 1: HTTP API
    web_data = extract_via_http()
    if web_data:
        print("✅ Extracted via HTTP")
        with open(f"{EXPORT_DIR}/wis-http-export.json", 'wb') as f:
            f.write(web_data)
    
    # Method 2: Shared folder
    shared = extract_from_shared_folder()
    if shared:
        print(f"✅ Found exports in: {shared}")
    
    # Method 3: Process existing rfiles
    process_rfiles()
    
    print("\n✅ Extraction attempt complete!")
    print(f"📁 Check: {EXPORT_DIR}")

if __name__ == "__main__":
    main()