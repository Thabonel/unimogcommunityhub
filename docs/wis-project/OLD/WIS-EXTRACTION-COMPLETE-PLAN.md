# Mercedes WIS Complete Extraction Plan

## Executive Summary
This document outlines a comprehensive plan to extract the entire Mercedes WIS (Workshop Information System) database from the 54GB VDI file and make it fully available in the UnimogCommunityHub Workshop Database.

## Coverage Analysis
Based on research, the Mercedes WIS database contains:
- **Models**: U300, U400, U500, U1000-U5000 series Unimogs
- **Years**: 1985-present (varies by model)
- **Content**: ~100,000+ procedures, 50,000+ parts, wiring diagrams, bulletins
- **Languages**: Multiple including English, German, Spanish
- **Data Size**: ~54GB total (including images and diagrams)

## Extraction Architecture

### Phase 1: VDI Access and Mounting
```bash
# Option A: Linux Host (Recommended)
sudo apt-get install qemu-utils
sudo modprobe nbd
sudo qemu-nbd --connect=/dev/nbd0 /Volumes/UnimogManuals/wis-extraction/MERCEDES.vdi
sudo mount /dev/nbd0p1 /mnt/wis

# Option B: macOS with Parallels/VMware
# Convert VDI to VMDK first
VBoxManage clonehd MERCEDES.vdi MERCEDES.vmdk --format VMDK
# Mount in VMware Fusion or Parallels
```

### Phase 2: Database Extraction

#### Method 1: Direct Transbase Access (Fastest)
```javascript
// Use Transbase JDBC driver
const config = {
  host: 'localhost',
  port: 2054,
  database: 'wisnet',
  user: 'tbadmin',
  password: '' // No password required
};

// Connect and export tables
const tables = ['procedures', 'parts', 'diagrams', 'bulletins', 'vehicles'];
for (const table of tables) {
  const data = await transbase.query(`SELECT * FROM ${table}`);
  await exportToJSON(data, `${table}.json`);
}
```

#### Method 2: DbVisualizer Export (Most Reliable)
1. Install DbVisualizer Pro
2. Add Transbase JDBC driver
3. Connect to `wisnet@localhost:2054`
4. Export schema and data as SQL
5. Convert SQL to PostgreSQL format
6. Import to Supabase

#### Method 3: ROM File Direct Processing
```python
# Python script to process ROM files
import struct
import os

ROM_FILES = ['rfile000', 'rfile001', 'rfile002', 'rfile003', 
             'rfile004', 'rfile005', 'rfile006', 'rfile007', 'rfile008']

def extract_rom_data(rom_file):
    """Extract data from Transbase ROM file"""
    with open(rom_file, 'rb') as f:
        # ROM files use proprietary format
        # Header contains table definitions
        header = f.read(1024)
        
        # Parse table structure
        tables = parse_rom_header(header)
        
        # Extract records
        for table in tables:
            records = extract_table_records(f, table)
            yield table, records
```

### Phase 3: Data Processing Pipeline

```javascript
// Node.js processing pipeline
const pipeline = {
  // Step 1: Parse raw data
  async parseRawData(inputDir) {
    const procedures = await parseProcedures(`${inputDir}/procedures.json`);
    const parts = await parseParts(`${inputDir}/parts.json`);
    const diagrams = await parseDiagrams(`${inputDir}/diagrams`);
    return { procedures, parts, diagrams };
  },

  // Step 2: Transform to Supabase schema
  async transformData(rawData) {
    return {
      wis_procedures: rawData.procedures.map(p => ({
        procedure_code: p.code,
        title: p.title,
        model_name: p.vehicle_model,
        system: p.system_group,
        subsystem: p.subsystem,
        content: convertToMarkdown(p.html_content),
        steps: extractSteps(p.html_content),
        tools_required: p.tools?.split(',') || [],
        parts_required: p.parts?.split(',') || [],
        safety_warnings: extractSafetyWarnings(p.html_content),
        time_estimate: p.labor_time,
        difficulty: calculateDifficulty(p)
      })),
      
      wis_parts: rawData.parts.map(p => ({
        part_number: p.number,
        description: p.description,
        category: p.group,
        models: p.applicable_models?.split(',') || [],
        superseded_by: p.superseded,
        specifications: {
          weight: p.weight,
          dimensions: p.dimensions,
          material: p.material
        }
      })),
      
      wis_diagrams: await processImages(rawData.diagrams)
    };
  },

  // Step 3: Upload to Supabase
  async uploadToSupabase(data, batchSize = 100) {
    const tables = ['wis_procedures', 'wis_parts', 'wis_bulletins', 'wis_diagrams'];
    
    for (const table of tables) {
      const records = data[table];
      console.log(`Uploading ${records.length} records to ${table}`);
      
      // Upload in batches
      for (let i = 0; i < records.length; i += batchSize) {
        const batch = records.slice(i, i + batchSize);
        await supabase.from(table).insert(batch);
        console.log(`Progress: ${i + batch.length}/${records.length}`);
      }
    }
  }
};
```

### Phase 4: Image and Diagram Processing

```javascript
// Image extraction and optimization
const imageProcessor = {
  async extractImages(wisPath) {
    const imageFormats = ['.jpg', '.png', '.gif', '.bmp', '.tif'];
    const images = [];
    
    // WIS uses proprietary image format
    const wisImageDir = `${wisPath}/images`;
    const files = await fs.readdir(wisImageDir);
    
    for (const file of files) {
      if (file.endsWith('.cpg')) {
        // Convert proprietary CPG format
        const image = await convertCPGtoJPG(file);
        images.push(image);
      }
    }
    
    return images;
  },

  async uploadToStorage(images) {
    for (const image of images) {
      const path = `wis-diagrams/${image.procedure_id}/${image.filename}`;
      await supabase.storage
        .from('wis-diagrams')
        .upload(path, image.data);
    }
  }
};
```

### Phase 5: Wiring Diagram Conversion

```javascript
// Convert WIS wiring diagrams to interactive SVG
const wiringConverter = {
  async convertToSVG(wisWiringFile) {
    // WIS wiring diagrams are in proprietary format
    const rawData = await parseWISWiring(wisWiringFile);
    
    // Convert to SVG for web display
    const svg = createSVG();
    
    // Add components
    for (const component of rawData.components) {
      svg.addComponent(component.type, component.position);
    }
    
    // Add connections
    for (const wire of rawData.wires) {
      svg.addWire(wire.from, wire.to, wire.color, wire.gauge);
    }
    
    return svg.toString();
  }
};
```

## Implementation Timeline

### Week 1: Environment Setup
- [ ] Set up Linux VM or Docker container
- [ ] Install required tools (qemu-utils, DbVisualizer, Node.js)
- [ ] Mount VDI file and verify access
- [ ] Test Transbase connection

### Week 2: Database Extraction
- [ ] Connect to Transbase via JDBC
- [ ] Export all tables to SQL/JSON
- [ ] Document table structures
- [ ] Validate data integrity

### Week 3: Data Transformation
- [ ] Build transformation pipeline
- [ ] Convert procedures to markdown
- [ ] Process parts catalog
- [ ] Extract safety warnings and tools

### Week 4: Image Processing
- [ ] Extract all images from WIS
- [ ] Convert proprietary formats
- [ ] Optimize for web delivery
- [ ] Upload to Supabase Storage

### Week 5: Upload & Integration
- [ ] Upload procedures (batch processing)
- [ ] Upload parts catalog
- [ ] Upload bulletins
- [ ] Link images to procedures

### Week 6: Testing & Optimization
- [ ] Test search functionality
- [ ] Optimize database queries
- [ ] Add caching layer
- [ ] Performance tuning

## Required Tools

### Software Requirements
1. **DbVisualizer Pro** - For database export ($197 license)
2. **QEMU Utils** - For VDI mounting (free)
3. **Node.js 18+** - For processing scripts
4. **Python 3.9+** - For ROM file processing
5. **ImageMagick** - For image conversion

### Hardware Requirements
- **Storage**: 100GB+ free space for extraction
- **RAM**: 16GB+ recommended
- **CPU**: Multi-core for parallel processing

## Automation Script

```bash
#!/bin/bash
# Complete WIS extraction automation

echo "Mercedes WIS Complete Extraction Script"
echo "======================================="

# Step 1: Mount VDI
echo "Mounting VDI file..."
sudo modprobe nbd
sudo qemu-nbd --connect=/dev/nbd0 /path/to/MERCEDES.vdi
sudo mount /dev/nbd0p1 /mnt/wis

# Step 2: Start Transbase service
echo "Starting Transbase..."
cd /mnt/wis/TransBase
./tbkernel -d wisnet &

# Step 3: Export database
echo "Exporting database..."
node scripts/export-transbase.js

# Step 4: Process images
echo "Processing images..."
python scripts/extract-images.py

# Step 5: Transform data
echo "Transforming data..."
node scripts/transform-data.js

# Step 6: Upload to Supabase
echo "Uploading to Supabase..."
node scripts/upload-to-supabase.js

# Step 7: Cleanup
echo "Cleaning up..."
sudo umount /mnt/wis
sudo qemu-nbd --disconnect /dev/nbd0

echo "Extraction complete!"
```

## Alternative: Cloud-Based Processing

### Using AWS EC2
```yaml
# CloudFormation template for WIS extraction
Resources:
  WISExtractionInstance:
    Type: AWS::EC2::Instance
    Properties:
      InstanceType: m5.2xlarge
      ImageId: ami-ubuntu-20.04
      BlockDeviceMappings:
        - DeviceName: /dev/sda1
          Ebs:
            VolumeSize: 200
      UserData:
        Fn::Base64: |
          #!/bin/bash
          apt-get update
          apt-get install -y qemu-utils nodejs python3
          # Mount EBS volume with VDI
          # Run extraction scripts
```

## Data Validation

```javascript
// Validate extracted data
const validator = {
  async validateProcedures(procedures) {
    let valid = 0, invalid = 0;
    
    for (const proc of procedures) {
      if (proc.title && proc.content && proc.model_name) {
        valid++;
      } else {
        invalid++;
        console.log(`Invalid procedure: ${proc.procedure_code}`);
      }
    }
    
    console.log(`Valid: ${valid}, Invalid: ${invalid}`);
    return invalid === 0;
  },
  
  async validateImages(images) {
    for (const image of images) {
      const exists = await checkImageExists(image.path);
      if (!exists) {
        console.log(`Missing image: ${image.path}`);
      }
    }
  }
};
```

## Success Metrics

1. **Complete Data Extraction**
   - ✅ All procedures extracted (target: 100,000+)
   - ✅ All parts cataloged (target: 50,000+)
   - ✅ All diagrams converted (target: 10,000+)
   - ✅ All bulletins imported

2. **Data Quality**
   - ✅ 99%+ procedures have complete content
   - ✅ All safety warnings preserved
   - ✅ Images properly linked
   - ✅ Search functionality works

3. **Performance**
   - ✅ Search returns results in <2 seconds
   - ✅ Images load in <3 seconds
   - ✅ Database queries optimized
   - ✅ Supports 100+ concurrent users

## Risk Mitigation

### Potential Issues & Solutions

1. **Proprietary Format Issues**
   - Risk: Cannot decode ROM files
   - Solution: Use DbVisualizer export method

2. **Large Data Volume**
   - Risk: Upload timeouts
   - Solution: Batch processing, resume capability

3. **Image Format Conversion**
   - Risk: CPG format not convertible
   - Solution: Screenshot fallback method

4. **Database Connection**
   - Risk: Transbase won't start
   - Solution: Use Windows VM with WIS installed

## Cost Estimate

- **One-time Costs**
  - DbVisualizer Pro License: $197
  - AWS EC2 (1 week): ~$200
  - Total: ~$400

- **Ongoing Costs**
  - Supabase Storage (50GB): ~$25/month
  - CDN bandwidth: ~$10/month
  - Total: ~$35/month

## Conclusion

This comprehensive plan provides multiple pathways to extract the complete Mercedes WIS database. The recommended approach is:

1. Use DbVisualizer for reliable database export
2. Process with Node.js transformation pipeline
3. Upload to Supabase in batches
4. Validate data integrity

Total timeline: 6 weeks
Total cost: ~$400 one-time + $35/month ongoing

The result will be a fully searchable, web-accessible Workshop Database containing the complete Mercedes WIS content for all Unimog models from 1985 to present.