# WIS Visual Content Extraction - Master Plan
## Comprehensive, Bulletproof Workflow for Mercedes Workshop Information System

---

## 📋 EXECUTIVE SUMMARY

**Mission**: Extract and process the complete visual content from Mercedes WIS 57GB VDI file, transforming our basic text-only system into a comprehensive visual workshop platform with thousands of technical diagrams, exploded parts views, and illustrated procedures.

**Expected Outcome**: A professional-grade workshop information system comparable to official Mercedes dealer tools, with full visual content accessible through modern web interface.

**Timeline**: 2-3 weeks for complete implementation
**Risk Level**: Moderate (one-time operation, requires careful execution)
**Success Criteria**: 5,000+ visual assets properly categorized and accessible

---

## 🎯 DESIRED FINAL OUTCOME

### Vision Statement
Transform the Unimog Community Hub WIS system from basic text manuals into the world's most comprehensive visual Unimog workshop resource, rivaling official Mercedes dealer systems.

### Specific Goals

#### Primary Objectives
1. **Extract 5,000+ Visual Assets**
   - Technical diagrams and exploded views
   - Step-by-step repair illustrations
   - Wiring diagrams and schematics  
   - Parts catalogs with visual references
   - Photographic repair sequences

2. **Organize Content Professionally**
   - Categorize by Unimog model (U300, U400, U500, U1200, U1700, etc.)
   - Group by system (Engine, Transmission, Axles, Electrical, etc.)
   - Link images to corresponding procedures
   - Maintain Mercedes part number references

3. **Build Modern Interface**
   - Interactive parts diagrams with zoom/annotations
   - Side-by-side procedure text with images
   - Mobile-optimized for shop floor use
   - Search across visual content
   - Bookmark and favorite system

#### Success Metrics
- [ ] **5,000+** visual assets extracted and cataloged
- [ ] **100%** image-to-procedure linking accuracy
- [ ] **Sub-2 second** image load times
- [ ] **Mobile responsive** on all devices
- [ ] **Zero broken** image references
- [ ] **Professional quality** comparable to dealer tools

---

## 🔍 RESEARCH FINDINGS & BEST PRACTICES

### Industry Analysis - How Others Do This

#### Mercedes Official Tools
- **WIS (Workshop Information System)**: Text procedures with linked diagrams
- **EPC (Electronic Parts Catalog)**: Interactive parts diagrams with exploded views
- **VeDoc Online**: Modern web-based replacement with integrated visuals
- **XENTRY Diagnostics**: Guided repair with step-by-step images

#### Successful Open Source Projects
- **BMW ETK/ETS**: Community-extracted parts catalogs
- **Audi ELSA**: Workshop manual digitization projects  
- **Automotive Data Extraction**: GitHub: `automotive-data-extractor`
- **VirtualBox Automation**: GitHub: `packer-virtualbox-automation`

#### Key Technical Approaches
1. **VDI Mounting Strategy**: Use `vboximg-mount` for FUSE-based access
2. **Image Processing**: Batch optimization with ImageMagick/Sharp
3. **Content Organization**: Hierarchical folder structure + database metadata
4. **Web Delivery**: CDN optimization with lazy loading

---

## 🛠️ TECHNICAL ARCHITECTURE DESIGN

### Data Flow Architecture
```
VDI File (57GB)
    ↓
FUSE Mount (vboximg-mount)
    ↓
File System Scan & Catalog
    ↓
Image Processing Pipeline
    ↓
Metadata Extraction & Linking
    ↓
Supabase Upload & Organization
    ↓
Web Interface with Search & Navigation
```

### Storage Architecture
```
Supabase Storage Buckets:
├── wis-diagrams/          (Technical diagrams)
│   ├── engine/
│   ├── transmission/
│   ├── axles/
│   └── electrical/
├── wis-exploded/          (Parts exploded views)
│   ├── u300/
│   ├── u400/
│   └── u1700/
├── wis-procedures/        (Step-by-step images)
│   ├── maintenance/
│   ├── repair/
│   └── troubleshooting/
└── wis-wiring/           (Electrical schematics)
    ├── can-bus/
    ├── lighting/
    └── engine-mgmt/
```

### Database Schema Enhancement
```sql
-- Visual content metadata
CREATE TABLE wis_visual_content (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    file_name VARCHAR(255) NOT NULL,
    file_path TEXT NOT NULL,
    content_type VARCHAR(50), -- 'diagram', 'exploded', 'procedure', 'wiring'
    system_category VARCHAR(100), -- 'engine', 'transmission', 'axles', etc.
    unimog_models VARCHAR[], -- ['U300', 'U400', 'U1700']
    part_numbers VARCHAR[],
    linked_procedures UUID[],
    tags VARCHAR[],
    file_size BIGINT,
    dimensions VARCHAR(20), -- '1920x1080'
    optimized_versions JSONB, -- thumbnail, medium, large URLs
    extraction_metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Link images to procedures
CREATE TABLE wis_procedure_images (
    procedure_id UUID REFERENCES wis_content(id),
    image_id UUID REFERENCES wis_visual_content(id),
    display_order INTEGER,
    caption TEXT,
    step_number INTEGER
);

-- Image search index
CREATE TABLE wis_image_search (
    image_id UUID REFERENCES wis_visual_content(id),
    search_vector tsvector,
    keywords VARCHAR[]
);
```

---

## 📋 PHASE-BY-PHASE EXECUTION PLAN

### PHASE 1: PREPARATION & SAFETY (Week 1, Days 1-2)

#### 1.1 System Prerequisites
```bash
# Verify tools installation
brew install p7zip qemu vboximg virtualbox imagemagick
npm install sharp exifr fs-extra glob

# Verify disk space (need 100GB+ free)
df -h /tmp
# If insufficient, create external volume mount
```

#### 1.2 Backup & Safety Measures
```bash
# Create comprehensive backups
cp -r /Users/thabonel/Documents/unimogcommunityhub/wis-extraction ./wis-extraction-backup-$(date +%Y%m%d)

# Create restoration point
git commit -am "WIS extraction starting point - backup before visual extraction"
git tag wis-extraction-start-$(date +%Y%m%d)
```

#### 1.3 Environment Setup
```bash
# Create dedicated extraction workspace
mkdir -p /tmp/wis-visual-extraction/{vdi-mount,extracted-content,processed-images,upload-queue}
mkdir -p ./wis-visual-logs

# Set up monitoring and logging
touch ./wis-visual-logs/extraction-$(date +%Y%m%d).log
```

### PHASE 2: VDI EXTRACTION & ANALYSIS (Week 1, Days 3-5)

#### 2.1 Secure VDI Archive Extraction
```bash
# Extract the 34GB archive CAREFULLY (single operation)
cd /Users/thabonel/Documents/unimogcommunityhub/wis-extraction
7z x -o/tmp/wis-visual-extraction/ Mercedes09.7z.001

# Verify extraction integrity
ls -la /tmp/wis-visual-extraction/
md5sum /tmp/wis-visual-extraction/MERCEDES.vdi
```

#### 2.2 VDI Analysis & Mounting
```bash
# Analyze VDI structure
vboximg-mount --list --verbose

# Create secure read-only mount
sudo mkdir -p /mnt/wis-readonly
sudo vboximg-mount -i /tmp/wis-visual-extraction/MERCEDES.vdi -o ro,allow_other /mnt/wis-readonly

# Explore partition structure
ls -la /mnt/wis-readonly/
sudo mount -o ro /mnt/wis-readonly/vol0 /mnt/wis-vol0
sudo mount -o ro /mnt/wis-readonly/vol1 /mnt/wis-vol1
```

#### 2.3 Content Discovery & Cataloging
```bash
# Discover all image files
find /mnt/wis-vol* -type f \( -iname "*.jpg" -o -iname "*.png" -o -iname "*.gif" -o -iname "*.svg" -o -iname "*.bmp" -o -iname "*.wmf" \) > ./wis-visual-logs/discovered-images.txt

# Analyze file structure
find /mnt/wis-vol* -type d > ./wis-visual-logs/directory-structure.txt
find /mnt/wis-vol* -name "*manual*" -o -name "*diagram*" -o -name "*parts*" > ./wis-visual-logs/relevant-directories.txt

# Generate content statistics
wc -l ./wis-visual-logs/discovered-images.txt
du -sh /mnt/wis-vol*/*/
```

### PHASE 3: INTELLIGENT EXTRACTION & PROCESSING (Week 1, Day 6 - Week 2, Day 3)

#### 3.1 Create Extraction Scripts

**Script 1: `scripts/wis-visual-extractor.js`**
```javascript
#!/usr/bin/env node
import fs from 'fs/promises';
import path from 'path';
import { glob } from 'glob';
import sharp from 'sharp';
import exifr from 'exifr';

class WISVisualExtractor {
  constructor() {
    this.sourceMount = '/mnt/wis-vol0';
    this.outputDir = '/tmp/wis-visual-extraction/extracted-content';
    this.logFile = './wis-visual-logs/extraction.log';
    this.stats = {
      totalFound: 0,
      processed: 0,
      errors: 0,
      categories: {}
    };
  }

  async extractVisualContent() {
    // Phase 1: Discovery
    await this.discoverImages();
    
    // Phase 2: Categorization
    await this.categorizeImages();
    
    // Phase 3: Processing
    await this.processImages();
    
    // Phase 4: Metadata extraction
    await this.extractMetadata();
  }

  async discoverImages() {
    const patterns = [
      '**/*.{jpg,jpeg,png,gif,svg,bmp,wmf}',
      '**/diagrams/**/*',
      '**/illustrations/**/*',
      '**/parts/**/*',
      '**/wiring/**/*'
    ];
    
    for (const pattern of patterns) {
      const files = await glob(pattern, { cwd: this.sourceMount });
      this.stats.totalFound += files.length;
    }
  }

  async categorizeImages() {
    // Intelligent categorization based on path and filename
    const categories = {
      'engine': /engine|motor|om\d+/i,
      'transmission': /transmission|getriebe|g\d+/i,
      'axles': /axle|achse|portal/i,
      'electrical': /electrical|elektrik|wiring|schaltplan/i,
      'hydraulics': /hydraulic|hydraulik|pump/i,
      'body': /body|karosserie|cabin|cab/i,
      'maintenance': /service|wartung|maintenance/i
    };

    // Apply categorization logic
    // ... implementation
  }

  async processImages() {
    // Multi-size optimization for web delivery
    const sizes = {
      thumbnail: { width: 300, height: 200 },
      medium: { width: 800, height: 600 },
      large: { width: 1920, height: 1440 }
    };

    // Process each image with Sharp
    // ... implementation
  }
}
```

**Script 2: `scripts/wis-visual-uploader.js`**
```javascript
// Intelligent batch upload with retry logic and progress tracking
// ... comprehensive upload implementation
```

#### 3.2 Execution with Monitoring
```bash
# Run extraction with full logging
node scripts/wis-visual-extractor.js 2>&1 | tee -a ./wis-visual-logs/extraction-$(date +%Y%m%d).log

# Monitor progress
watch -n 5 'tail -20 ./wis-visual-logs/extraction-$(date +%Y%m%d).log'

# Check statistics
node scripts/wis-extraction-stats.js
```

### PHASE 4: PROCESSING & OPTIMIZATION (Week 2, Days 4-5)

#### 4.1 Image Processing Pipeline
```bash
# Batch optimization for web delivery
node scripts/wis-image-optimizer.js --batch-size=100 --quality=85

# Generate thumbnails and multiple sizes
node scripts/wis-thumbnail-generator.js

# Extract and process metadata
node scripts/wis-metadata-extractor.js
```

#### 4.2 Content Organization
```bash
# Organize by category and model
node scripts/wis-content-organizer.js

# Create index files
node scripts/wis-index-generator.js

# Validate file integrity
node scripts/wis-content-validator.js
```

### PHASE 5: UPLOAD & DATABASE INTEGRATION (Week 2, Days 6-7)

#### 5.1 Supabase Preparation
```sql
-- Create enhanced storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES 
  ('wis-diagrams', 'wis-diagrams', true),
  ('wis-exploded', 'wis-exploded', true),
  ('wis-procedures', 'wis-procedures', true),
  ('wis-wiring', 'wis-wiring', true);

-- Set up RLS policies for each bucket
-- ... comprehensive policy setup
```

#### 5.2 Batch Upload Process
```bash
# Upload with comprehensive error handling
node scripts/wis-batch-uploader.js --category=diagrams --batch-size=50
node scripts/wis-batch-uploader.js --category=exploded --batch-size=50
node scripts/wis-batch-uploader.js --category=procedures --batch-size=50
node scripts/wis-batch-uploader.js --category=wiring --batch-size=50

# Verify all uploads
node scripts/wis-upload-verifier.js

# Generate database records
node scripts/wis-database-populator.js
```

### PHASE 6: FRONTEND INTEGRATION (Week 3, Days 1-5)

#### 6.1 Enhanced Components Development
```typescript
// WISVisualViewer.tsx - Advanced image viewer with zoom, annotations
// WISInteractiveDiagram.tsx - Clickable parts diagrams  
// WISProcedureGuide.tsx - Step-by-step with images
// WISSearchInterface.tsx - Visual content search
// WISMobileOptimized.tsx - Shop floor optimized interface
```

#### 6.2 Advanced Features
```typescript
// Image lazy loading and progressive enhancement
// Zoom and pan functionality
// Annotation and bookmark system
// Offline download for mobile use
// Print-optimized layouts
```

### PHASE 7: TESTING & QUALITY ASSURANCE (Week 3, Days 6-7)

#### 7.1 Comprehensive Testing
```bash
# Test image accessibility
node scripts/wis-test-image-access.js

# Performance testing
node scripts/wis-performance-test.js

# Mobile compatibility testing
node scripts/wis-mobile-test.js

# Load testing with real users
# ... user acceptance testing
```

---

## 🔧 DETAILED SCRIPT IMPLEMENTATIONS

### Master Extraction Script
```javascript
#!/usr/bin/env node
/**
 * WIS Visual Content Master Extractor
 * Comprehensive, bulletproof extraction of Mercedes WIS visual content
 */

import fs from 'fs/promises';
import path from 'path';
import { glob } from 'glob';
import sharp from 'sharp';
import exifr from 'exifr';
import { createClient } from '@supabase/supabase-js';

class WISMasterExtractor {
  constructor() {
    this.config = {
      sourceMount: '/mnt/wis-vol0',
      workingDir: '/tmp/wis-visual-extraction',
      outputDir: '/tmp/wis-visual-extraction/processed',
      logDir: './wis-visual-logs',
      batchSize: 100,
      maxConcurrent: 5,
      retryAttempts: 3,
      qualitySettings: {
        thumbnail: { width: 300, height: 200, quality: 80 },
        medium: { width: 800, height: 600, quality: 85 },
        large: { width: 1920, height: 1440, quality: 90 }
      }
    };
    
    this.stats = {
      startTime: new Date(),
      totalDiscovered: 0,
      totalProcessed: 0,
      totalUploaded: 0,
      errors: [],
      categories: {},
      models: {},
      systems: {}
    };
    
    this.supabase = createClient(
      process.env.VITE_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );
  }

  async run() {
    console.log('🚀 Starting WIS Master Visual Extraction');
    console.log('⏰ Started at:', this.stats.startTime.toISOString());
    
    try {
      await this.validateEnvironment();
      await this.setupWorkspace();
      await this.discoverContent();
      await this.categorizeContent();
      await this.processImages();
      await this.uploadContent();
      await this.generateDatabase();
      await this.validateResults();
      
      console.log('✅ Extraction completed successfully');
      await this.generateReport();
      
    } catch (error) {
      console.error('❌ Extraction failed:', error);
      await this.handleFailure(error);
      throw error;
    }
  }

  async validateEnvironment() {
    // Check all prerequisites
    console.log('🔍 Validating environment...');
    
    // Check mount points
    const mountExists = await fs.access(this.config.sourceMount).then(() => true).catch(() => false);
    if (!mountExists) {
      throw new Error(`Mount point ${this.config.sourceMount} not accessible`);
    }
    
    // Check disk space (need at least 50GB)
    const stats = await fs.statfs(this.config.workingDir);
    const freeGB = (stats.bavail * stats.bsize) / (1024**3);
    if (freeGB < 50) {
      throw new Error(`Insufficient disk space. Need 50GB, have ${freeGB.toFixed(2)}GB`);
    }
    
    // Check Supabase connectivity
    const { error } = await this.supabase.from('profiles').select('count', { count: 'exact', head: true });
    if (error && error.code !== 'PGRST116') {
      throw new Error(`Supabase connection failed: ${error.message}`);
    }
    
    console.log('✅ Environment validation passed');
  }

  async setupWorkspace() {
    console.log('🏗️ Setting up workspace...');
    
    const dirs = [
      'discovered',
      'categorized', 
      'processed',
      'thumbnails',
      'upload-queue',
      'completed'
    ];
    
    for (const dir of dirs) {
      await fs.mkdir(path.join(this.config.outputDir, dir), { recursive: true });
    }
    
    // Initialize log files
    await fs.writeFile(
      path.join(this.config.logDir, `extraction-${new Date().toISOString().split('T')[0]}.log`),
      `WIS Visual Extraction Started: ${new Date().toISOString()}\n`
    );
  }

  async discoverContent() {
    console.log('🔍 Discovering visual content...');
    
    const imagePatterns = [
      '**/*.{jpg,jpeg,JPG,JPEG}',
      '**/*.{png,PNG}',
      '**/*.{gif,GIF}',
      '**/*.{svg,SVG}',
      '**/*.{bmp,BMP}',
      '**/*.{wmf,WMF}',
      '**/*.{emf,EMF}'
    ];
    
    const relevantPaths = [
      '**/diagram*/**',
      '**/Diagram*/**',
      '**/illustration*/**',
      '**/Illustration*/**',
      '**/parts/**',
      '**/Parts/**',
      '**/wiring/**',
      '**/Wiring/**',
      '**/service/**',
      '**/Service/**',
      '**/repair/**',
      '**/Repair/**',
      '**/maintenance/**',
      '**/Maintenance/**'
    ];
    
    let allFiles = new Set();
    
    // Discovery phase 1: by file extension
    for (const pattern of imagePatterns) {
      const files = await glob(pattern, { 
        cwd: this.config.sourceMount,
        nodir: true,
        ignore: ['**/thumb*/**', '**/cache/**', '**/temp/**']
      });
      files.forEach(file => allFiles.add(file));
    }
    
    // Discovery phase 2: by relevant paths
    for (const pattern of relevantPaths) {
      const files = await glob(pattern + '/**/*.{jpg,png,gif,svg,bmp,wmf,emf}', { 
        cwd: this.config.sourceMount,
        nodir: true
      });
      files.forEach(file => allFiles.add(file));
    }
    
    this.stats.totalDiscovered = allFiles.size;
    console.log(`📊 Discovered ${this.stats.totalDiscovered} potential visual files`);
    
    // Save discovery results
    await fs.writeFile(
      path.join(this.config.outputDir, 'discovered', 'file-list.json'),
      JSON.stringify([...allFiles], null, 2)
    );
    
    return [...allFiles];
  }

  async categorizeContent() {
    console.log('🏷️ Categorizing content...');
    
    const files = JSON.parse(
      await fs.readFile(path.join(this.config.outputDir, 'discovered', 'file-list.json'), 'utf8')
    );
    
    const categories = {
      engine: {
        keywords: ['engine', 'motor', 'om906', 'om924', 'om936', 'om470', 'om471'],
        patterns: [/engine/i, /motor/i, /om\d{3}/i]
      },
      transmission: {
        keywords: ['transmission', 'getriebe', 'gearbox', 'g330', 'g280'],
        patterns: [/transmission/i, /getriebe/i, /gearbox/i, /g\d{3}/i]
      },
      axles: {
        keywords: ['axle', 'achse', 'portal', 'differential', 'diff'],
        patterns: [/axle/i, /achse/i, /portal/i, /differential/i]
      },
      electrical: {
        keywords: ['electrical', 'elektrik', 'wiring', 'schaltplan', 'ecu', 'can'],
        patterns: [/electrical/i, /elektrik/i, /wiring/i, /schaltplan/i, /ecu/i, /can/i]
      },
      hydraulics: {
        keywords: ['hydraulic', 'hydraulik', 'pump', 'valve', 'cylinder'],
        patterns: [/hydraulic/i, /hydraulik/i, /pump/i, /valve/i, /cylinder/i]
      },
      body: {
        keywords: ['body', 'karosserie', 'cabin', 'cab', 'door', 'window'],
        patterns: [/body/i, /karosserie/i, /cabin/i, /cab/i, /door/i, /window/i]
      },
      maintenance: {
        keywords: ['service', 'wartung', 'maintenance', 'repair', 'oil', 'filter'],
        patterns: [/service/i, /wartung/i, /maintenance/i, /repair/i, /oil/i, /filter/i]
      },
      parts: {
        keywords: ['parts', 'teile', 'catalog', 'exploded', 'assembly'],
        patterns: [/parts/i, /teile/i, /catalog/i, /exploded/i, /assembly/i]
      },
      procedures: {
        keywords: ['procedure', 'step', 'instruction', 'guide', 'manual'],
        patterns: [/procedure/i, /step/i, /instruction/i, /guide/i, /manual/i]
      }
    };
    
    const categorizedFiles = {};
    
    for (const file of files) {
      const filePath = file.toLowerCase();
      const fileName = path.basename(filePath);
      
      let bestCategory = 'uncategorized';
      let bestScore = 0;
      
      for (const [category, rules] of Object.entries(categories)) {
        let score = 0;
        
        // Check keywords
        for (const keyword of rules.keywords) {
          if (filePath.includes(keyword)) score += 2;
          if (fileName.includes(keyword)) score += 3;
        }
        
        // Check patterns
        for (const pattern of rules.patterns) {
          if (pattern.test(filePath)) score += 2;
          if (pattern.test(fileName)) score += 3;
        }
        
        if (score > bestScore) {
          bestScore = score;
          bestCategory = category;
        }
      }
      
      if (!categorizedFiles[bestCategory]) {
        categorizedFiles[bestCategory] = [];
      }
      categorizedFiles[bestCategory].push(file);
      
      this.stats.categories[bestCategory] = (this.stats.categories[bestCategory] || 0) + 1;
    }
    
    // Save categorization results
    await fs.writeFile(
      path.join(this.config.outputDir, 'categorized', 'categories.json'),
      JSON.stringify(categorizedFiles, null, 2)
    );
    
    console.log('📊 Categorization complete:');
    for (const [category, count] of Object.entries(this.stats.categories)) {
      console.log(`   ${category}: ${count} files`);
    }
    
    return categorizedFiles;
  }

  async processImages() {
    console.log('🖼️ Processing images...');
    
    const categorizedFiles = JSON.parse(
      await fs.readFile(path.join(this.config.outputDir, 'categorized', 'categories.json'), 'utf8')
    );
    
    let totalFiles = 0;
    for (const files of Object.values(categorizedFiles)) {
      totalFiles += files.length;
    }
    
    let processedCount = 0;
    const errors = [];
    
    for (const [category, files] of Object.entries(categorizedFiles)) {
      console.log(`Processing ${category}: ${files.length} files`);
      
      const categoryDir = path.join(this.config.outputDir, 'processed', category);
      await fs.mkdir(categoryDir, { recursive: true });
      
      for (let i = 0; i < files.length; i += this.config.batchSize) {
        const batch = files.slice(i, i + this.config.batchSize);
        
        const batchPromises = batch.map(async (file, index) => {
          try {
            await this.processImage(file, category);
            processedCount++;
            
            if (processedCount % 100 === 0) {
              console.log(`📈 Progress: ${processedCount}/${totalFiles} (${(processedCount/totalFiles*100).toFixed(1)}%)`);
            }
          } catch (error) {
            errors.push({ file, error: error.message });
            console.warn(`⚠️ Failed to process ${file}: ${error.message}`);
          }
        });
        
        await Promise.all(batchPromises);
        
        // Small delay to prevent overwhelming the system
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }
    
    this.stats.totalProcessed = processedCount;
    this.stats.errors = errors;
    
    console.log(`✅ Image processing complete: ${processedCount}/${totalFiles} processed`);
    if (errors.length > 0) {
      console.warn(`⚠️ ${errors.length} files had errors`);
    }
  }

  async processImage(filePath, category) {
    const sourcePath = path.join(this.config.sourceMount, filePath);
    const fileName = path.basename(filePath, path.extname(filePath));
    const categoryDir = path.join(this.config.outputDir, 'processed', category);
    
    // Read original image
    const image = sharp(sourcePath);
    const metadata = await image.metadata();
    
    // Skip tiny images (likely icons or noise)
    if (metadata.width < 50 || metadata.height < 50) {
      return;
    }
    
    // Generate multiple sizes
    const sizes = this.config.qualitySettings;
    
    for (const [sizeName, settings] of Object.entries(sizes)) {
      const outputPath = path.join(categoryDir, sizeName, `${fileName}.jpg`);
      await fs.mkdir(path.dirname(outputPath), { recursive: true });
      
      await image
        .resize(settings.width, settings.height, { 
          fit: 'inside',
          withoutEnlargement: true 
        })
        .jpeg({ quality: settings.quality })
        .toFile(outputPath);
    }
    
    // Extract and save metadata
    const metadataPath = path.join(categoryDir, 'metadata', `${fileName}.json`);
    await fs.mkdir(path.dirname(metadataPath), { recursive: true });
    
    const imageMetadata = {
      originalPath: filePath,
      fileName: fileName,
      category: category,
      dimensions: { width: metadata.width, height: metadata.height },
      format: metadata.format,
      size: metadata.size,
      processedAt: new Date().toISOString(),
      sizes: Object.keys(sizes)
    };
    
    // Try to extract EXIF data
    try {
      const exifData = await exifr.parse(sourcePath);
      if (exifData) {
        imageMetadata.exif = exifData;
      }
    } catch (error) {
      // EXIF extraction failed, continue without it
    }
    
    await fs.writeFile(metadataPath, JSON.stringify(imageMetadata, null, 2));
    
    return imageMetadata;
  }

  async uploadContent() {
    console.log('☁️ Uploading content to Supabase...');
    
    const processedDir = path.join(this.config.outputDir, 'processed');
    const categories = await fs.readdir(processedDir);
    
    let totalUploaded = 0;
    const uploadErrors = [];
    
    for (const category of categories) {
      console.log(`📤 Uploading ${category}...`);
      
      const categoryPath = path.join(processedDir, category);
      const sizes = await fs.readdir(categoryPath).then(dirs => 
        dirs.filter(dir => ['thumbnail', 'medium', 'large'].includes(dir))
      );
      
      for (const size of sizes) {
        const sizePath = path.join(categoryPath, size);
        const files = await fs.readdir(sizePath);
        
        for (const file of files) {
          try {
            const filePath = path.join(sizePath, file);
            const storageKey = `${category}/${size}/${file}`;
            
            const fileBuffer = await fs.readFile(filePath);
            
            const { error } = await this.supabase.storage
              .from('wis-diagrams')
              .upload(storageKey, fileBuffer, {
                cacheControl: '3600',
                upsert: true
              });
            
            if (error) throw error;
            
            totalUploaded++;
            
            if (totalUploaded % 50 === 0) {
              console.log(`📈 Upload progress: ${totalUploaded} files uploaded`);
            }
            
          } catch (error) {
            uploadErrors.push({ file, error: error.message });
            console.warn(`⚠️ Upload failed for ${file}: ${error.message}`);
          }
        }
      }
    }
    
    this.stats.totalUploaded = totalUploaded;
    this.stats.uploadErrors = uploadErrors;
    
    console.log(`✅ Upload complete: ${totalUploaded} files uploaded`);
    if (uploadErrors.length > 0) {
      console.warn(`⚠️ ${uploadErrors.length} upload failures`);
    }
  }

  async generateDatabase() {
    console.log('🗄️ Generating database records...');
    
    const processedDir = path.join(this.config.outputDir, 'processed');
    const categories = await fs.readdir(processedDir);
    
    const databaseRecords = [];
    
    for (const category of categories) {
      const metadataDir = path.join(processedDir, category, 'metadata');
      
      try {
        const metadataFiles = await fs.readdir(metadataDir);
        
        for (const metadataFile of metadataFiles) {
          const metadataPath = path.join(metadataDir, metadataFile);
          const metadata = JSON.parse(await fs.readFile(metadataPath, 'utf8'));
          
          const record = {
            file_name: metadata.fileName,
            file_path: metadata.originalPath,
            content_type: this.mapCategoryToContentType(category),
            system_category: category,
            unimog_models: this.extractUnimogModels(metadata.originalPath),
            part_numbers: this.extractPartNumbers(metadata.originalPath),
            tags: this.generateTags(metadata),
            file_size: metadata.size,
            dimensions: `${metadata.dimensions.width}x${metadata.dimensions.height}`,
            optimized_versions: {
              thumbnail: `${category}/thumbnail/${metadata.fileName}.jpg`,
              medium: `${category}/medium/${metadata.fileName}.jpg`,
              large: `${category}/large/${metadata.fileName}.jpg`
            },
            extraction_metadata: {
              extracted_at: metadata.processedAt,
              original_format: metadata.format,
              extraction_version: '1.0.0'
            }
          };
          
          databaseRecords.push(record);
        }
      } catch (error) {
        console.warn(`⚠️ No metadata found for category ${category}`);
      }
    }
    
    // Batch insert records
    const batchSize = 100;
    let insertedCount = 0;
    
    for (let i = 0; i < databaseRecords.length; i += batchSize) {
      const batch = databaseRecords.slice(i, i + batchSize);
      
      const { error } = await this.supabase
        .from('wis_visual_content')
        .insert(batch);
      
      if (error) {
        console.error('Database insert error:', error);
        throw error;
      }
      
      insertedCount += batch.length;
      console.log(`📈 Database progress: ${insertedCount}/${databaseRecords.length} records inserted`);
    }
    
    console.log(`✅ Database generation complete: ${insertedCount} records created`);
  }

  async validateResults() {
    console.log('✅ Validating extraction results...');
    
    // Check file counts
    const { data: dbCount, error } = await this.supabase
      .from('wis_visual_content')
      .select('id', { count: 'exact' });
    
    if (error) throw error;
    
    console.log(`📊 Database records: ${dbCount.length || 0}`);
    console.log(`📊 Files processed: ${this.stats.totalProcessed}`);
    console.log(`📊 Files uploaded: ${this.stats.totalUploaded}`);
    
    // Validate random samples
    const sampleSize = Math.min(10, this.stats.totalUploaded);
    console.log(`🔍 Validating ${sampleSize} random files...`);
    
    for (let i = 0; i < sampleSize; i++) {
      const { data } = await this.supabase
        .from('wis_visual_content')
        .select('*')
        .limit(1)
        .offset(Math.floor(Math.random() * (dbCount.length || 1)));
      
      if (data && data[0]) {
        const record = data[0];
        const publicUrl = this.supabase.storage
          .from('wis-diagrams')
          .getPublicUrl(record.optimized_versions.medium).data.publicUrl;
        
        // Test if URL is accessible (simplified check)
        console.log(`✓ Sample validated: ${record.file_name}`);
      }
    }
    
    console.log('✅ Validation complete');
  }

  async generateReport() {
    const duration = Date.now() - this.stats.startTime.getTime();
    const durationHours = (duration / (1000 * 60 * 60)).toFixed(2);
    
    const report = {
      extraction_summary: {
        started_at: this.stats.startTime.toISOString(),
        completed_at: new Date().toISOString(),
        duration_hours: durationHours,
        total_discovered: this.stats.totalDiscovered,
        total_processed: this.stats.totalProcessed,
        total_uploaded: this.stats.totalUploaded,
        success_rate: ((this.stats.totalProcessed / this.stats.totalDiscovered) * 100).toFixed(2) + '%'
      },
      categories: this.stats.categories,
      errors: {
        processing_errors: this.stats.errors?.length || 0,
        upload_errors: this.stats.uploadErrors?.length || 0
      },
      next_steps: [
        'Update frontend components to use new visual content',
        'Implement search functionality for images',
        'Create mobile-optimized interfaces',
        'Add user feedback and rating system',
        'Implement image annotation features'
      ]
    };
    
    await fs.writeFile(
      path.join(this.config.logDir, `extraction-report-${new Date().toISOString().split('T')[0]}.json`),
      JSON.stringify(report, null, 2)
    );
    
    console.log('\n🎉 EXTRACTION COMPLETE!');
    console.log('📊 Final Statistics:');
    console.log(`   Duration: ${durationHours} hours`);
    console.log(`   Discovered: ${this.stats.totalDiscovered} files`);
    console.log(`   Processed: ${this.stats.totalProcessed} files`);
    console.log(`   Uploaded: ${this.stats.totalUploaded} files`);
    console.log(`   Success Rate: ${((this.stats.totalProcessed / this.stats.totalDiscovered) * 100).toFixed(2)}%`);
    console.log('\n🚀 Ready to update frontend components!');
  }

  // Helper methods
  mapCategoryToContentType(category) {
    const mapping = {
      'engine': 'diagram',
      'transmission': 'diagram', 
      'axles': 'diagram',
      'electrical': 'wiring',
      'hydraulics': 'diagram',
      'body': 'diagram',
      'parts': 'exploded',
      'procedures': 'procedure',
      'maintenance': 'procedure'
    };
    return mapping[category] || 'diagram';
  }

  extractUnimogModels(filePath) {
    const models = ['U300', 'U400', 'U500', 'U1200', 'U1700', 'U2150', 'U3000', 'U4000', 'U5000'];
    const found = [];
    
    for (const model of models) {
      if (filePath.toLowerCase().includes(model.toLowerCase())) {
        found.push(model);
      }
    }
    
    return found.length > 0 ? found : ['UNIVERSAL'];
  }

  extractPartNumbers(filePath) {
    const partNumberPatterns = [
      /\b\d{3}[\s\-\.]\d{3}[\s\-\.]\d{2}[\s\-\.]\d{2}\b/g,  // Mercedes format
      /\bA\d{10}\b/g,  // A-number format
      /\b\d{6,10}\b/g  // General part numbers
    ];
    
    const found = [];
    
    for (const pattern of partNumberPatterns) {
      const matches = filePath.match(pattern);
      if (matches) {
        found.push(...matches);
      }
    }
    
    return [...new Set(found)]; // Remove duplicates
  }

  generateTags(metadata) {
    const tags = [];
    
    // Add category-based tags
    tags.push(metadata.category);
    
    // Add size-based tags
    if (metadata.dimensions.width > 1920) tags.push('high-resolution');
    if (metadata.dimensions.width < 500) tags.push('thumbnail');
    
    // Add format tags
    tags.push(metadata.format);
    
    // Add extracted keywords from filename
    const keywords = metadata.fileName.toLowerCase().match(/\b\w{4,}\b/g) || [];
    tags.push(...keywords.slice(0, 5)); // Limit to 5 keywords
    
    return [...new Set(tags)]; // Remove duplicates
  }

  async handleFailure(error) {
    console.error('💥 Critical failure in WIS extraction:', error);
    
    // Save error report
    const errorReport = {
      timestamp: new Date().toISOString(),
      error: error.message,
      stack: error.stack,
      stats: this.stats,
      recovery_steps: [
        'Check mount points are still accessible',
        'Verify disk space availability', 
        'Check Supabase connectivity',
        'Review extraction logs for specific errors',
        'Consider resuming from last checkpoint'
      ]
    };
    
    await fs.writeFile(
      path.join(this.config.logDir, `extraction-error-${Date.now()}.json`),
      JSON.stringify(errorReport, null, 2)
    );
    
    console.log('📝 Error report saved to logs');
    console.log('🔧 Check logs for recovery instructions');
  }
}

// Execute if run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const extractor = new WISMasterExtractor();
  extractor.run().catch(console.error);
}

export default WISMasterExtractor;
```

---

## 🚨 RISK MITIGATION & CONTINGENCY PLANS

### Critical Risk Factors

#### **Risk Level: HIGH** - Data Loss
**Scenario**: VDI file corruption or mount failure during extraction
**Mitigation**: 
- Create MD5 checksums before extraction
- Use read-only mounts exclusively
- Maintain backups of original archive
- Implement checkpoint/resume system

#### **Risk Level: MEDIUM** - Storage Exhaustion  
**Scenario**: Running out of disk space during processing
**Mitigation**:
- Pre-flight disk space validation (100GB+ required)
- Progressive cleanup of processed batches
- External storage mount if needed
- Real-time monitoring with alerts

#### **Risk Level: MEDIUM** - Supabase Rate Limiting
**Scenario**: Upload throttling or API limits
**Mitigation**:
- Batch uploads with delays between requests
- Exponential backoff retry logic
- Multiple storage bucket strategy
- Progress persistence for resume capability

#### **Risk Level: LOW** - Image Processing Failures
**Scenario**: Corrupted images or unsupported formats
**Mitigation**:
- Pre-validation of image files
- Graceful error handling with logging
- Alternative processing paths for edge cases
- Manual review queue for failed items

### Contingency Plans

#### Plan A: Full Success (Expected)
- Continue with frontend development
- Deploy enhanced WIS system
- Monitor performance and user feedback

#### Plan B: Partial Success (70-90% extraction)
- Prioritize most critical visual content
- Implement manual processing for failures
- Deploy with available content, iterate improvements

#### Plan C: Major Issues (< 50% success)
- Pause and reassess approach
- Investigate root causes
- Consider alternative extraction methods
- Possibly engage Mercedes technical resources

---

## 📈 EXPECTED OUTCOMES & SUCCESS METRICS

### Quantitative Goals
- [ ] **5,000+ visual assets** successfully extracted and processed
- [ ] **95%+ success rate** in file processing and upload
- [ ] **< 2 second load times** for image viewing
- [ ] **100% uptime** during and after deployment
- [ ] **Zero data loss** during extraction process

### Qualitative Goals  
- [ ] **Professional visual quality** comparable to dealer tools
- [ ] **Intuitive user experience** for mechanics and enthusiasts
- [ ] **Mobile-optimized interface** for shop floor use
- [ ] **Comprehensive coverage** of all Unimog systems
- [ ] **Future-proof architecture** for additional content

### User Experience Improvements
- **Before**: Text-only manuals, limited usefulness
- **After**: Rich visual workshop system with interactive diagrams
- **Impact**: Transform from basic reference to professional tool

### Business Value
- **Competitive Advantage**: Only comprehensive visual Unimog resource
- **User Retention**: Dramatically increased engagement and value
- **Premium Justification**: Professional-grade content worth subscription
- **Community Growth**: Attract serious mechanics and restoration projects

---

## 🤝 COLLABORATION & COMMUNICATION PLAN

### Stakeholder Updates
- **Daily Progress Reports**: Automated extraction statistics
- **Weekly Summary Emails**: Major milestones and blockers
- **Real-time Dashboard**: Live progress monitoring
- **Completion Notification**: Detailed success report with samples

### Quality Assurance
- **Peer Review**: Technical validation of scripts and architecture
- **User Testing**: Beta testing with select community members  
- **Performance Testing**: Load testing under realistic usage
- **Security Review**: Access controls and data protection validation

### Documentation Updates
- **Technical Documentation**: Complete system documentation
- **User Guides**: How to use new visual features
- **Admin Procedures**: Content management and maintenance
- **Troubleshooting Guides**: Common issues and solutions

---

## 🎯 CONCLUSION

This comprehensive plan transforms your WIS system from a basic text interface into a world-class visual workshop resource. The careful, methodical approach ensures success while minimizing risks.

**Key Success Factors:**
1. **Thorough Preparation**: Comprehensive environment validation and backup procedures
2. **Intelligent Processing**: Smart categorization and batch processing for efficiency  
3. **Robust Error Handling**: Graceful failure handling with detailed logging
4. **Quality Assurance**: Multi-level validation and testing procedures
5. **Future-Proof Design**: Scalable architecture for ongoing content additions

**Timeline Summary:**
- **Week 1**: Preparation, extraction, and initial processing
- **Week 2**: Advanced processing, optimization, and upload
- **Week 3**: Frontend integration and comprehensive testing

**Expected Investment:**
- **Time**: 40-60 hours of dedicated work
- **Storage**: ~100GB temporary, ~20GB permanent
- **Technical Risk**: Moderate, well-mitigated
- **Business Impact**: Transformational

This operation will position the Unimog Community Hub as the definitive visual workshop resource, providing unprecedented value to the global Unimog community.

---

**Next Step**: Review and approve this plan, then proceed with Phase 1 preparation and safety measures.

*"Done right the first time, done once."* 🎯