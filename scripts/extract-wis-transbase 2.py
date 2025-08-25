#!/usr/bin/env python3
"""
Mercedes WIS/EPC TransBase Database Extractor
Uses transbase-python driver to connect directly to the database
"""

import os
import sys
import json
import csv
from pathlib import Path

# Try to import transbase driver
try:
    from transbase import transbase
    HAS_TRANSBASE = True
except ImportError:
    HAS_TRANSBASE = False
    print("TransBase driver not installed. Trying JayDeBeApi...")
    
# Fallback to JDBC if native driver not available
try:
    import jaydebeapi
    HAS_JDBC = True
except ImportError:
    HAS_JDBC = False

class WISExtractor:
    def __init__(self):
        self.connection = None
        self.cursor = None
        
        # Connection parameters from research
        self.host = "localhost"
        self.port = 2054
        self.database = "wisnet"
        self.username = "tbadmin"
        self.password = ""  # No password
        
        # For EPC database
        self.epc_username = "tbuser"
        self.epc_password = "C2mpTbicc"
        
    def connect_native(self):
        """Connect using native Python driver"""
        if not HAS_TRANSBASE:
            print("TransBase Python driver not installed!")
            print("Install from: https://github.com/TransactionSoftwareGmbH/transbase-python")
            return False
            
        try:
            # Connection string format: //host:port/database
            conn_str = f"//{self.host}:{self.port}/{self.database}"
            print(f"Connecting to TransBase: {conn_str}")
            
            self.connection = transbase.connect(conn_str, self.username, self.password)
            self.cursor = self.connection.cursor()
            
            # Enable native type casting
            self.cursor.type_cast = True
            
            print("✅ Connected to WIS database!")
            return True
            
        except Exception as e:
            print(f"Connection failed: {e}")
            return False
            
    def connect_jdbc(self):
        """Connect using JDBC driver"""
        if not HAS_JDBC:
            print("JayDeBeApi not installed!")
            print("Install with: pip install JayDeBeApi")
            return False
            
        try:
            # JDBC URL format
            jdbc_url = f"jdbc:transbase://{self.host}:{self.port}/{self.database}"
            driver_class = "transbase.jdbc.Driver"
            
            # Path to JDBC driver JAR
            # This would need to be downloaded from TransBase
            driver_jar = "/path/to/transbase-jdbc.jar"
            
            if not os.path.exists(driver_jar):
                print(f"JDBC driver not found at: {driver_jar}")
                print("Download from TransBase website")
                return False
                
            print(f"Connecting via JDBC: {jdbc_url}")
            
            self.connection = jaydebeapi.connect(
                driver_class,
                jdbc_url,
                [self.username, self.password],
                driver_jar
            )
            self.cursor = self.connection.cursor()
            
            print("✅ Connected via JDBC!")
            return True
            
        except Exception as e:
            print(f"JDBC connection failed: {e}")
            return False
            
    def connect(self):
        """Try to connect using available methods"""
        # Try native driver first
        if self.connect_native():
            return True
            
        # Fallback to JDBC
        if self.connect_jdbc():
            return True
            
        print("❌ Could not connect to database")
        return False
        
    def get_tables(self):
        """Get list of all tables in database"""
        try:
            # Standard SQL query for tables
            self.cursor.execute("""
                SELECT table_name 
                FROM information_schema.tables 
                WHERE table_schema = 'PUBLIC'
            """)
            
            tables = self.cursor.fetchall()
            return [t[0] for t in tables]
            
        except Exception as e:
            print(f"Error getting tables: {e}")
            
            # Try alternative query
            try:
                self.cursor.execute("SHOW TABLES")
                tables = self.cursor.fetchall()
                return [t[0] for t in tables]
            except:
                return []
                
    def get_views(self):
        """Get list of all views (recommended over tables)"""
        try:
            self.cursor.execute("""
                SELECT table_name 
                FROM information_schema.views 
                WHERE table_schema = 'PUBLIC'
            """)
            
            views = self.cursor.fetchall()
            return [v[0] for v in views]
            
        except Exception as e:
            print(f"Error getting views: {e}")
            return []
            
    def extract_parts(self):
        """Extract Mercedes parts from database"""
        print("\n📦 Extracting parts...")
        
        parts = []
        
        # Try different table/view names that might contain parts
        possible_tables = [
            'parts', 'PARTS', 'wis_parts', 'WIS_PARTS',
            'part_numbers', 'PART_NUMBERS', 'spare_parts',
            'SPARE_PARTS', 'epc_parts', 'EPC_PARTS',
            'v_parts', 'V_PARTS'  # Views often start with v_
        ]
        
        for table in possible_tables:
            try:
                # Try to query the table
                query = f"SELECT * FROM {table} LIMIT 10"
                self.cursor.execute(query)
                
                # Get column names
                columns = [desc[0] for desc in self.cursor.description]
                print(f"Found table {table} with columns: {columns}")
                
                # Get all data
                query = f"SELECT * FROM {table}"
                self.cursor.execute(query)
                
                rows = self.cursor.fetchall()
                for row in rows:
                    part = dict(zip(columns, row))
                    parts.append(part)
                    
                print(f"  Extracted {len(rows)} parts from {table}")
                break
                
            except Exception as e:
                continue
                
        return parts
        
    def extract_procedures(self):
        """Extract repair procedures from database"""
        print("\n🔧 Extracting procedures...")
        
        procedures = []
        
        # Try different table/view names
        possible_tables = [
            'procedures', 'PROCEDURES', 'wis_procedures',
            'WIS_PROCEDURES', 'repair_procedures', 'REPAIR_PROCEDURES',
            'service_procedures', 'SERVICE_PROCEDURES',
            'v_procedures', 'V_PROCEDURES'
        ]
        
        for table in possible_tables:
            try:
                query = f"SELECT * FROM {table} LIMIT 10"
                self.cursor.execute(query)
                
                columns = [desc[0] for desc in self.cursor.description]
                print(f"Found table {table} with columns: {columns}")
                
                query = f"SELECT * FROM {table}"
                self.cursor.execute(query)
                
                rows = self.cursor.fetchall()
                for row in rows:
                    proc = dict(zip(columns, row))
                    procedures.append(proc)
                    
                print(f"  Extracted {len(rows)} procedures from {table}")
                break
                
            except Exception as e:
                continue
                
        return procedures
        
    def search_unimog_data(self):
        """Search for Unimog-specific data"""
        print("\n🚗 Searching for Unimog data...")
        
        unimog_data = []
        
        # Get all tables and views
        tables = self.get_tables() + self.get_views()
        
        for table in tables:
            try:
                # Search for Unimog references
                query = f"""
                SELECT * FROM {table} 
                WHERE UPPER(CAST(* AS VARCHAR)) LIKE '%UNIMOG%'
                LIMIT 100
                """
                
                self.cursor.execute(query)
                rows = self.cursor.fetchall()
                
                if rows:
                    print(f"  Found {len(rows)} Unimog references in {table}")
                    columns = [desc[0] for desc in self.cursor.description]
                    
                    for row in rows:
                        data = dict(zip(columns, row))
                        data['_source_table'] = table
                        unimog_data.append(data)
                        
            except Exception as e:
                # Try simpler query
                try:
                    query = f"SELECT * FROM {table} LIMIT 1"
                    self.cursor.execute(query)
                    columns = [desc[0] for desc in self.cursor.description]
                    
                    # Check each text column for Unimog
                    for col in columns:
                        try:
                            query = f"""
                            SELECT * FROM {table} 
                            WHERE UPPER({col}) LIKE '%UNIMOG%'
                            LIMIT 100
                            """
                            self.cursor.execute(query)
                            rows = self.cursor.fetchall()
                            
                            if rows:
                                print(f"  Found {len(rows)} Unimog references in {table}.{col}")
                                
                                for row in rows:
                                    data = dict(zip(columns, row))
                                    data['_source_table'] = table
                                    data['_source_column'] = col
                                    unimog_data.append(data)
                                    
                        except:
                            continue
                            
                except:
                    continue
                    
        return unimog_data
        
    def export_data(self, output_dir):
        """Export all extracted data"""
        output_path = Path(output_dir)
        output_path.mkdir(exist_ok=True)
        
        # Extract all data
        print("\n" + "="*50)
        print("Starting data extraction...")
        print("="*50)
        
        # Get database structure
        tables = self.get_tables()
        views = self.get_views()
        
        print(f"\nFound {len(tables)} tables and {len(views)} views")
        
        if tables:
            print("\nTables:", tables[:10])
        if views:
            print("\nViews:", views[:10])
            
        # Extract specific data
        parts = self.extract_parts()
        procedures = self.extract_procedures()
        unimog_data = self.search_unimog_data()
        
        # Save to JSON
        data = {
            'statistics': {
                'tables': len(tables),
                'views': len(views),
                'parts': len(parts),
                'procedures': len(procedures),
                'unimog_records': len(unimog_data)
            },
            'database_structure': {
                'tables': tables,
                'views': views
            },
            'parts': parts[:1000],  # Limit for initial review
            'procedures': procedures[:1000],
            'unimog_data': unimog_data[:500]
        }
        
        json_file = output_path / 'wis_extracted.json'
        with open(json_file, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
            
        print(f"\n✅ Data exported to: {json_file}")
        
        # Generate SQL for Supabase
        self.generate_sql(parts, procedures, output_path / 'wis_import.sql')
        
        return data
        
    def generate_sql(self, parts, procedures, output_file):
        """Generate SQL import file for Supabase"""
        with open(output_file, 'w', encoding='utf-8') as f:
            f.write("-- Mercedes WIS Data Import\n")
            f.write("-- Extracted via TransBase connection\n\n")
            f.write("BEGIN;\n\n")
            
            # Insert parts
            for part in parts[:10000]:  # Limit to 10k
                part_num = str(part.get('part_number', '')).replace("'", "''")
                desc = str(part.get('description', '')).replace("'", "''")
                
                if part_num:
                    f.write(f"""INSERT INTO wis_parts (part_number, description, search_vector)
VALUES ('{part_num}', '{desc}', to_tsvector('english', '{part_num} {desc}'))
ON CONFLICT (part_number) DO UPDATE SET description = EXCLUDED.description;\n""")
                    
            # Insert procedures
            for proc in procedures[:5000]:  # Limit to 5k
                title = str(proc.get('title', '')).replace("'", "''")
                content = str(proc.get('content', '')).replace("'", "''")
                
                if title:
                    f.write(f"""INSERT INTO wis_procedures (title, content, procedure_type, search_vector)
VALUES ('{title}', '{content}', 'repair', to_tsvector('english', '{title} {content}'))
ON CONFLICT DO NOTHING;\n""")
                    
            f.write("\nCOMMIT;\n")
            
        print(f"✅ SQL file generated: {output_file}")
        
    def close(self):
        """Close database connection"""
        if self.cursor:
            self.cursor.close()
        if self.connection:
            self.connection.close()
        print("Database connection closed")


def main():
    print("="*60)
    print("MERCEDES WIS/EPC TRANSBASE EXTRACTOR")
    print("="*60)
    
    extractor = WISExtractor()
    
    # Try to connect
    if not extractor.connect():
        print("\n❌ Failed to connect to database")
        print("\nTo fix this:")
        print("1. Install TransBase Python driver:")
        print("   git clone https://github.com/TransactionSoftwareGmbH/transbase-python")
        print("   cd transbase-python && pip install .")
        print("\n2. Or install JayDeBeApi:")
        print("   pip install JayDeBeApi")
        print("   Download TransBase JDBC driver")
        return
        
    # Extract data
    output_dir = "/Volumes/UnimogManuals/WIS-TRANSBASE-EXTRACT"
    data = extractor.export_data(output_dir)
    
    # Print summary
    print("\n" + "="*60)
    print("EXTRACTION COMPLETE!")
    print("="*60)
    print(f"✅ Tables found: {data['statistics']['tables']}")
    print(f"✅ Views found: {data['statistics']['views']}")
    print(f"✅ Parts extracted: {data['statistics']['parts']}")
    print(f"✅ Procedures extracted: {data['statistics']['procedures']}")
    print(f"✅ Unimog records: {data['statistics']['unimog_records']}")
    
    # Close connection
    extractor.close()


if __name__ == "__main__":
    main()