# WIS Data Extraction Requirements for External Developer

## Executive Summary
This document outlines the comprehensive requirements for extracting and processing Mercedes Workshop Information System (WIS) data to enable full functionality of the WIS pages and Barry AI assistant with complete technical support capabilities including schematics, images, and detailed procedures.

## 🎯 Project Goals

1. **Enable Full WIS Page Functionality**: Populate all database tables with complete workshop data
2. **Empower Barry AI**: Provide chunked, searchable content with semantic embeddings for intelligent assistance
3. **Visual Documentation**: Extract and organize all diagrams, schematics, and images for inline display
4. **Cross-Referenced Data**: Maintain all relationships between procedures, parts, bulletins, and diagrams

## 📊 Current System Architecture

### Existing Infrastructure
- **Database Tables**: 
  - `wis_models` - Vehicle model information
  - `wis_procedures` - Workshop procedures
  - `wis_parts` - Parts catalog
  - `wis_bulletins` - Technical service bulletins
  - `wis_wiring` - Wiring diagram data
  - `wis_diagrams` - Image and diagram metadata
  - `wis_servers`, `wis_sessions`, `wis_bookmarks`, `wis_usage_logs` - System management

- **Storage Buckets**: 
  - `wis-manuals/` - Public bucket for all WIS content
  - Subfolders: `/manuals`, `/bulletins`, `/parts`, `/diagrams`

- **Frontend Components**:
  - WISSystemPage - Main interface for browsing WIS content
  - WISEPCPage - Premium electronic parts catalog
  - WISContentViewer - Document display component
  - Barry AI Chat - Integrated AI assistant

## 📁 Source Data: 54GB Mercedes WIS VDI Files

### Expected VDI Structure
```
WIS_VDI_Root/
├── WIS_Data/
│   ├── HTML_Manuals/         # Workshop procedures in HTML
│   ├── Parts_Database/       # EPC database files (MDB/SQL)
│   ├── Service_Bulletins/    # TSB documents
│   ├── Wiring_Diagrams/      # Electrical schematics
│   ├── Images/              # Technical images and diagrams
│   └── Resources/           # CSS, JS, supporting files
├── WIS_Support/
│   ├── Torque_Tables/       # Torque specifications
│   ├── Fluid_Specs/         # Fluid requirements
│   ├── Special_Tools/       # Tool catalog
│   ├── Diagnostic_Codes/    # Fault codes
│   └── Time_Standards/      # Labor time guides
└── WIS_Index/               # Search indexes and metadata
```

## 🔧 Detailed Extraction Requirements

### 1. Vehicle Models Data (`wis_models` table)

#### Required Fields:
```sql
- id: UUID (auto-generated)
- model_code: TEXT (e.g., "U1700L", "U1300L", "U2150L")
- model_name: TEXT (e.g., "Unimog U1700L (435 Series)")
- year_from: INTEGER (e.g., 1985)
- year_to: INTEGER (e.g., 1993)
- engine_code: TEXT (e.g., "OM366LA", "OM352A")
- description: TEXT (detailed model description)
```

#### Extraction Notes:
- Must include series designation (e.g., 435, 437)
- Preserve VIN range information for model identification
- Include all engine variants per model
- Map Mercedes internal codes to user-friendly names

### 2. Workshop Procedures (`wis_procedures` table)

#### Required Fields:
```sql
- id: UUID
- vehicle_id: UUID (foreign key to wis_models)
- procedure_code: TEXT (unique WIS identifier)
- title: TEXT
- category: TEXT (e.g., "Engine", "Transmission", "Axles")
- subcategory: TEXT (e.g., "Cooling System", "Clutch")
- description: TEXT
- content: TEXT (full procedure text)
- difficulty_level: INTEGER (1-5)
- estimated_time_minutes: INTEGER
- tools_required: TEXT (comma-separated or JSON array)
- safety_warnings: TEXT
- parts_required: TEXT (part numbers)
```

#### Content Processing Requirements:
1. **Preserve HTML Structure** where beneficial (tables, lists)
2. **Extract Step Numbers** and maintain sequence
3. **Identify and Link**:
   - Tool requirements per step
   - Torque specifications (highlight in bold)
   - Part numbers mentioned
   - Safety warnings (extract to separate field)
   - Cross-references to other procedures
   - References to diagrams/images

#### AI Chunking Strategy:
- **Chunk Size**: 500-1000 tokens per chunk
- **Chunk Boundaries**: Break at logical steps, never mid-instruction
- **Preserve Context**: Include procedure title and current step number in each chunk
- **Metadata per Chunk**:
  ```json
  {
    "chunk_id": "uuid",
    "procedure_code": "WIS_123456",
    "chunk_sequence": 1,
    "total_chunks": 5,
    "content": "Step 3: Remove the cylinder head bolts...",
    "tools_mentioned": ["torque_wrench", "socket_27mm"],
    "parts_mentioned": ["A0001234", "A0005678"],
    "torque_specs": ["140Nm", "Stage 1: 50Nm, Stage 2: +90°"],
    "safety_level": "warning",
    "related_diagrams": ["diagram_123", "diagram_456"]
  }
  ```

### 3. Parts Catalog (`wis_parts` table)

#### Required Fields:
```sql
- id: UUID
- vehicle_id: UUID (can be null for universal parts)
- part_number: TEXT (Mercedes part number)
- part_name: TEXT
- category: TEXT
- subcategory: TEXT
- description: TEXT (detailed description)
- price_estimate: DECIMAL(10,2) (in EUR)
- availability_status: TEXT
- superseded_by: TEXT (new part number if replaced)
- compatible_models: TEXT[] (array of model codes)
- quantity_per_vehicle: INTEGER
- weight_kg: DECIMAL
- dimensions: JSONB
- notes: TEXT
```

#### Extraction Requirements:
- **Multi-language Support**: Extract both English and German descriptions
- **Supersession Chains**: Track complete replacement history
- **Cross-References**: Include aftermarket equivalent part numbers
- **Bundle Information**: If part comes in a kit, list all components
- **Installation Notes**: Special requirements or modifications needed

### 4. Technical Service Bulletins (`wis_bulletins` table)

#### Required Fields:
```sql
- id: UUID
- vehicle_id: UUID (can be null for multi-model bulletins)
- bulletin_number: TEXT
- title: TEXT
- category: TEXT
- severity: TEXT ("info", "recommended", "mandatory", "safety_critical")
- description: TEXT
- content: TEXT (full bulletin content)
- date_issued: DATE
- date_updated: DATE
- affected_models: TEXT[] (array of model codes)
- affected_vins: TEXT (VIN range)
- parts_required: TEXT[] (part numbers for fix)
- labor_time_hours: DECIMAL
```

#### Priority Classification:
- **CRITICAL**: Safety recalls, fire hazards
- **HIGH**: Driveability issues, major component failures
- **MEDIUM**: Comfort features, minor issues
- **LOW**: Informational updates

### 5. Wiring Diagrams (`wis_wiring` table + file storage)

#### Database Fields:
```sql
- id: UUID
- vehicle_id: UUID
- system: TEXT (e.g., "Engine Management", "Lighting")
- diagram_title: TEXT
- file_path: TEXT (path in storage bucket)
- svg_content: TEXT (inline SVG for web display)
- components: JSONB (component list with locations)
- connections: JSONB (wiring connections matrix)
- wire_colors: JSONB (color code mappings)
- connector_pinouts: JSONB
```

#### File Processing Requirements:
1. **Convert to SVG Format** for interactivity:
   - Preserve layer information
   - Make components clickable
   - Enable zoom without quality loss
   
2. **Extract Metadata**:
   ```json
   {
     "components": [
       {
         "id": "K1",
         "name": "Main Relay",
         "location": {"x": 150, "y": 200},
         "part_number": "A0001234"
       }
     ],
     "wires": [
       {
         "id": "W1",
         "from": "Battery+",
         "to": "Fuse_F1",
         "color": "Red",
         "gauge": "4mm²"
       }
     ],
     "connectors": [
       {
         "id": "X1",
         "pins": 20,
         "location": "Behind dashboard"
       }
     ]
   }
   ```

3. **Test Points**: Mark and index all test points with expected values

### 6. Images and Diagrams (`wis_diagrams` table + file storage)

#### Database Fields:
```sql
- id: UUID
- name: TEXT
- type: TEXT ("exploded", "assembly", "photo", "schematic")
- procedure_id: UUID (link to procedure)
- part_id: UUID (link to part)
- file_path: TEXT
- file_size: INTEGER
- width: INTEGER
- height: INTEGER
- format: TEXT (PNG, JPG, SVG)
- metadata: JSONB
- ocr_text: TEXT (extracted text from image)
- ai_description: TEXT (generated description)
```

#### Image Processing Requirements:

1. **Optimization**:
   - Convert BMP → PNG
   - Compress without losing detail
   - Generate thumbnails (300px width)
   - Create multiple resolutions (mobile, desktop, print)

2. **Categorization**:
   - **Exploded Views**: Parts assemblies with callout numbers
   - **Assembly Sequences**: Step-by-step assembly photos
   - **Component Photos**: Individual part images
   - **Wear Patterns**: Examples of worn vs new parts
   - **Tool Usage**: Proper tool positioning
   - **Measurement Points**: Where to measure clearances

3. **AI Processing**:
   - Run OCR to extract any text
   - Generate descriptions for accessibility
   - Identify part numbers in callouts
   - Link to related procedures

#### File Naming Convention:
```
{timestamp}_{model}_{system}_{type}_{description}.{ext}

Examples:
1755674108611_u1700l_engine_exploded_cylinder_head.png
1755674108612_u1700l_transmission_assembly_clutch_plate.jpg
1755674108613_all_tools_special_injector_puller.png
```

## 🤖 Barry AI Integration Requirements

### Vector Embeddings for Semantic Search

1. **Generate Embeddings**:
   ```python
   # Using OpenAI text-embedding-ada-002
   for chunk in procedure_chunks:
       embedding = openai.Embedding.create(
           input=chunk.content,
           model="text-embedding-ada-002"
       )
       chunk.embedding = embedding['data'][0]['embedding']
   ```

2. **Store in PostgreSQL with pgvector**:
   ```sql
   CREATE TABLE wis_content_embeddings (
       id UUID PRIMARY KEY,
       content_type TEXT, -- 'procedure', 'part', 'bulletin'
       content_id UUID,
       chunk_text TEXT,
       chunk_metadata JSONB,
       embedding vector(1536)
   );
   
   CREATE INDEX ON wis_content_embeddings 
   USING ivfflat (embedding vector_cosine_ops);
   ```

3. **Search Implementation**:
   ```sql
   -- Find similar content
   SELECT content_id, content_type, chunk_text, 
          1 - (embedding <=> query_embedding) as similarity
   FROM wis_content_embeddings
   WHERE 1 - (embedding <=> query_embedding) > 0.8
   ORDER BY similarity DESC
   LIMIT 10;
   ```

### Manual References for Barry

Each AI response should be able to reference:
- Specific procedure steps with links
- Part numbers with availability
- Relevant diagrams with display capability
- Safety warnings prominently displayed
- Tool requirements with specifications

### Response Format Example:
```json
{
  "answer": "To replace the water pump on your U1700L...",
  "references": [
    {
      "type": "procedure",
      "id": "proc_123",
      "title": "Water Pump Replacement",
      "snippet": "Step 4: Remove the three bolts..."
    },
    {
      "type": "part",
      "id": "part_456",
      "number": "A3662001201",
      "name": "Water Pump Assembly"
    },
    {
      "type": "diagram",
      "id": "diag_789",
      "title": "Cooling System Exploded View",
      "url": "/storage/diagrams/cooling_exploded.png"
    }
  ],
  "warnings": [
    "⚠️ Allow engine to cool before starting procedure"
  ],
  "tools_required": [
    "Torque wrench (20-200 Nm)",
    "Socket set (10-27mm)"
  ]
}
```

## 📤 Data Processing Pipeline

### Phase 1: Extraction (Week 1)
```bash
# 1. Convert VDI to RAW format
qemu-img convert -f vdi -O raw mercedes_wis.vdi wis_raw.img

# 2. Mount and extract
sudo mount -o loop,ro wis_raw.img /mnt/wis
cp -r /mnt/wis/* ./wis_extracted/

# 3. Verify extraction
find ./wis_extracted -name "*.html" | wc -l  # Should be 1000+
find ./wis_extracted -name "*.jpg" -o -name "*.png" | wc -l  # Should be 5000+
```

### Phase 2: Parsing & Structuring (Week 2)
```javascript
// Parse HTML procedures
const parseHtmlProcedures = async (htmlFiles) => {
  for (const file of htmlFiles) {
    const html = await fs.readFile(file);
    const $ = cheerio.load(html);
    
    const procedure = {
      title: $('h1').text(),
      steps: [],
      tools: [],
      parts: [],
      warnings: []
    };
    
    // Extract steps
    $('.procedure-step').each((i, el) => {
      procedure.steps.push({
        number: i + 1,
        content: $(el).text(),
        tools: extractTools($(el).text()),
        torque: extractTorqueSpecs($(el).text())
      });
    });
    
    // Extract warnings
    $('.warning, .caution').each((i, el) => {
      procedure.warnings.push({
        level: $(el).hasClass('warning') ? 'warning' : 'caution',
        text: $(el).text()
      });
    });
    
    await saveProcedure(procedure);
  }
};
```

### Phase 3: Generate Embeddings (Week 3)
```python
import openai
from supabase import create_client

def generate_embeddings(procedures):
    for procedure in procedures:
        chunks = chunk_procedure(procedure, max_tokens=1000)
        
        for i, chunk in enumerate(chunks):
            # Generate embedding
            response = openai.Embedding.create(
                input=chunk['content'],
                model="text-embedding-ada-002"
            )
            
            # Store in database
            supabase.table('wis_content_embeddings').insert({
                'content_type': 'procedure',
                'content_id': procedure['id'],
                'chunk_text': chunk['content'],
                'chunk_metadata': {
                    'sequence': i,
                    'total': len(chunks),
                    'tools': chunk['tools'],
                    'parts': chunk['parts']
                },
                'embedding': response['data'][0]['embedding']
            }).execute()
```

### Phase 4: Upload & Organize (Week 4)
```javascript
// Batch upload to Supabase
const uploadToSupabase = async () => {
  // 1. Upload procedures
  const procedures = await loadProcedures();
  for (const batch of chunk(procedures, 100)) {
    await supabase.from('wis_procedures').insert(batch);
  }
  
  // 2. Upload images to storage
  const images = await loadImages();
  for (const image of images) {
    const { data, error } = await supabase.storage
      .from('wis-manuals')
      .upload(`diagrams/${image.filename}`, image.buffer, {
        contentType: image.mimetype
      });
      
    // Store metadata
    await supabase.from('wis_diagrams').insert({
      name: image.name,
      type: image.type,
      file_path: data.path,
      metadata: image.metadata
    });
  }
  
  // 3. Create search indexes
  await supabase.rpc('create_search_indexes');
};
```

## 📊 Success Metrics

### Minimum Viable Dataset
- [ ] **Vehicle Models**: 20+ Unimog models with full specifications
- [ ] **Procedures**: 500+ complete workshop procedures
- [ ] **Parts**: 5,000+ parts with descriptions and numbers
- [ ] **Bulletins**: 100+ technical service bulletins
- [ ] **Wiring Diagrams**: 50+ interactive SVG diagrams
- [ ] **Images**: 2,000+ technical images and diagrams

### Quality Metrics
- [ ] **Search Accuracy**: 90%+ relevant results
- [ ] **Cross-References**: All parts linked to procedures
- [ ] **Image Quality**: All diagrams readable at 100% zoom
- [ ] **AI Responses**: Include relevant references in 95% of queries
- [ ] **Load Time**: Pages load in under 2 seconds

### Completeness Checklist
- [ ] All HTML procedures parsed and structured
- [ ] All images optimized and uploaded
- [ ] All wiring diagrams converted to SVG
- [ ] All content has vector embeddings
- [ ] All cross-references established
- [ ] All safety warnings extracted
- [ ] All tools lists complete
- [ ] All part numbers verified

## 🚨 Critical Technical Requirements

### Data Integrity
1. **UTF-8 Encoding**: Must preserve German characters (ü, ö, ä, ß)
2. **Part Number Format**: Maintain Mercedes format (A000 123 45 67)
3. **Date Formats**: Use ISO 8601 (YYYY-MM-DD)
4. **Measurements**: Store in metric (Nm for torque, mm for dimensions)

### File Processing
1. **Image Formats**: PNG for diagrams, JPG for photos, SVG for wiring
2. **Max File Size**: 10MB per image (optimize larger files)
3. **Compression**: Lossy for photos (80% quality), lossless for diagrams
4. **Text Extraction**: OCR all images containing text

### Performance Optimization
1. **Indexing**: Create indexes on all searchable fields
2. **Caching**: Implement Redis caching for frequent queries
3. **Pagination**: Limit results to 50 per page
4. **Lazy Loading**: Load images on scroll

### Security & Access
1. **Public Content**: Basic procedures and safety bulletins
2. **Premium Content**: Detailed procedures, wiring diagrams
3. **Rate Limiting**: 100 requests per minute per user
4. **Audit Logging**: Track all document access

## 📋 Deliverables

### 1. Extraction Package
- [ ] Complete extracted file directory (organized)
- [ ] Extraction scripts (documented)
- [ ] Processing logs with statistics
- [ ] Error report for failed extractions

### 2. Processed Data
- [ ] SQL dump files for direct import
- [ ] Image directory ready for upload
- [ ] JSON files with structured content
- [ ] CSV files for review/editing

### 3. Integration Tools
- [ ] Upload scripts for Supabase
- [ ] Embedding generation scripts
- [ ] Search index creation scripts
- [ ] Data validation scripts

### 4. Documentation
- [ ] Extraction process documentation
- [ ] Data dictionary for all fields
- [ ] API usage examples
- [ ] Troubleshooting guide

### 5. Quality Report
- [ ] Total records extracted per table
- [ ] Missing content identification
- [ ] Data quality metrics
- [ ] Recommended improvements

## 🔄 Ongoing Maintenance

### Version Control
- Track WIS data version (e.g., WIS/EPC 2020.1)
- Document update procedures
- Maintain change logs

### Update Process
1. Identify new/updated content
2. Extract deltas only
3. Update affected embeddings
4. Refresh search indexes
5. Clear relevant caches

### Monitoring
- Track search queries for missing content
- Monitor Barry AI reference accuracy
- Log slow queries for optimization
- Track user feedback on content quality

## 📞 Contact & Support

### Project Coordination
- **Primary Contact**: Thabonel
- **Email**: thabonel0@gmail.com
- **Project Repository**: https://github.com/Thabonel/unimogcommunityhub

### Technical Questions
- Database schema clarifications
- API endpoint specifications
- File format requirements
- Integration testing support

### Delivery
- Staged delivery acceptable (priority order above)
- Weekly progress updates requested
- Test data subset for initial integration
- Full dataset upon completion

---

**Document Version**: 1.0  
**Created**: August 2025  
**Last Updated**: August 2025  
**Status**: Ready for External Developer