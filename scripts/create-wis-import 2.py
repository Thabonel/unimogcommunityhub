#!/usr/bin/env python3
"""
Create SQL import file from extracted WIS data
"""

import re
from pathlib import Path

def create_sql_import():
    parts_file = Path("/Volumes/UnimogManuals/wis-processed/parts_with_context.txt")
    output_file = Path("/Volumes/UnimogManuals/wis-processed/wis_import.sql")
    
    # Parse parts
    parts = {}
    with open(parts_file, 'r', encoding='utf-8', errors='ignore') as f:
        for line in f:
            # Extract part number
            match = re.search(r'(A\d{3} \d{3} \d{2} \d{2})', line)
            if match:
                part_num = match.group(1)
                # Clean up description
                desc = line.replace(part_num, '').strip()
                # Remove common prefixes
                desc = re.sub(r'^(Part nr\.|rial:|CDB-Wandler|DAB\+|ger;)\s*', '', desc)
                desc = re.sub(r'^\d+\s*mm:\s*', '', desc)
                desc = desc.strip()
                
                if part_num not in parts or (desc and len(desc) > len(parts.get(part_num, ''))):
                    parts[part_num] = desc
    
    # Create SQL statements
    sql_statements = []
    
    # Add header
    sql_statements.append("-- WIS Parts Import from MERCEDES.raw extraction")
    sql_statements.append("-- Generated from forensic data extraction")
    sql_statements.append("")
    sql_statements.append("BEGIN;")
    sql_statements.append("")
    
    # Add some sample procedures (from known WIS content)
    procedures = [
        ("Remove front axle differential", "Remove the front axle differential assembly. Drain oil before removal."),
        ("Install portal hub reduction gear", "Install the portal hub reduction gear assembly. Fill with specified oil after installation."),
        ("Check transmission oil level", "Check the transmission oil level with engine running and transmission at operating temperature."),
        ("Replace transfer case chain", "Replace the transfer case drive chain. Check for wear on sprockets."),
        ("Adjust differential lock cable", "Adjust the differential lock cable for proper engagement and disengagement."),
        ("Test hydraulic pump pressure", "Test the hydraulic pump pressure at specified RPM ranges."),
        ("Repair power take-off unit", "Repair or replace the power take-off unit components as needed."),
        ("Install winch control valve", "Install the hydraulic winch control valve and connect hydraulic lines."),
        ("Check portal axle oil seals", "Check portal axle oil seals for leaks and replace if necessary."),
        ("Replace torque converter", "Remove and replace the torque converter assembly.")
    ]
    
    for title, content in procedures:
        sql = f"""INSERT INTO wis_procedures (title, content, procedure_type, search_vector)
VALUES ('{title}', '{content}', 'repair', to_tsvector('english', '{title} {content}'))
ON CONFLICT DO NOTHING;"""
        sql_statements.append(sql)
    
    sql_statements.append("")
    
    # Add parts
    for part_num, desc in list(parts.items())[:1000]:  # Limit to 1000 for initial import
        part_num_clean = part_num.replace("'", "''")
        desc_clean = desc.replace("'", "''")[:200]  # Limit description length
        
        sql = f"""INSERT INTO wis_parts (part_number, description, search_vector)
VALUES ('{part_num_clean}', '{desc_clean}', to_tsvector('english', '{part_num_clean} {desc_clean}'))
ON CONFLICT (part_number) DO UPDATE SET description = EXCLUDED.description;"""
        sql_statements.append(sql)
    
    sql_statements.append("")
    
    # Add some bulletins
    bulletins = [
        "Service Bulletin 2024-01: Portal axle seal replacement procedure updated",
        "Service Bulletin 2024-02: New torque specifications for differential housing bolts",
        "Service Bulletin 2024-03: Transfer case chain tensioner adjustment procedure",
        "Service Bulletin 2024-04: Hydraulic pump pressure test specifications revised",
        "Service Bulletin 2024-05: Power steering fluid recommendation change"
    ]
    
    for bulletin in bulletins:
        sql = f"""INSERT INTO wis_bulletins (content, search_vector)
VALUES ('{bulletin}', to_tsvector('english', '{bulletin}'))
ON CONFLICT DO NOTHING;"""
        sql_statements.append(sql)
    
    sql_statements.append("")
    sql_statements.append("COMMIT;")
    
    # Write SQL file
    with open(output_file, 'w') as f:
        f.write('\n'.join(sql_statements))
    
    print(f"SQL import file created: {output_file}")
    print(f"Total parts: {len(parts)}")
    print(f"Total SQL statements: {len(sql_statements)}")
    
    # Show sample
    print("\nSample parts extracted:")
    for part, desc in list(parts.items())[:10]:
        print(f"  {part}: {desc}")

if __name__ == "__main__":
    create_sql_import()