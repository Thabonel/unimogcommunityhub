#!/usr/bin/env node
/**
 * WIS Visual Content Extractor
 * Comprehensive extraction of Mercedes WIS visual content from VDI files
 * 
 * This script implements the master plan for extracting 5000+ visual assets
 * from the Mercedes WIS system VDI file, with intelligent categorization,
 * processing, and upload capabilities.
 */

import dotenv from 'dotenv';
dotenv.config();

import fs from 'fs/promises';
import path from 'path';
import { glob } from 'glob';
import sharp from 'sharp';
import { createClient } from '@supabase/supabase-js';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

class WISVisualExtractor {
  constructor() {
    this.config = {
      // Source and working directories
      vdiArchivePath: '/Users/thabonel/Documents/unimogcommunityhub/wis-extraction/',
      workingDir: '/tmp/wis-visual-extraction',
      outputDir: '/tmp/wis-visual-extraction/processed',
      logDir: './wis-visual-logs',
      
      // Processing settings
      batchSize: 50,
      maxConcurrent: 3,
      retryAttempts: 3,
      
      // Image quality settings
      qualitySettings: {
        thumbnail: { width: 300, height: 200, quality: 75 },
        medium: { width: 800, height: 600, quality: 85 },
        large: { width: 1600, height: 1200, quality: 90 }
      },
      
      // Supported image formats
      imageExtensions: ['.jpg', '.jpeg', '.png', '.gif', '.svg', '.bmp', '.wmf', '.emf', '.tiff', '.tif'],
      
      // Mount point for VDI
      mountPoint: '/tmp/wis-visual-extraction/vdi-mount'
    };
    
    // Statistics tracking
    this.stats = {
      startTime: new Date(),
      phase: 'initialization',
      totalDiscovered: 0,
      totalProcessed: 0,
      totalUploaded: 0,
      errors: [],
      categories: {},
      models: {},
      currentBatch: 0,
      totalBatches: 0
    };
    
    // Initialize Supabase client
    this.supabase = createClient(
      process.env.VITE_SUPABASE_URL,
      process.env.VITE_SUPABASE_ANON_KEY
    );
    
    // Log file path
    this.logFile = path.join(this.config.logDir, `extraction-${new Date().toISOString().split('T')[0]}.log`);
  }

  /**
   * Main execution method
   */
  async run() {
    try {
      await this.log('🚀 Starting WIS Visual Extraction Master Process');
      await this.log(`⏰ Started at: ${this.stats.startTime.toISOString()}`);
      
      // Phase 1: Environment validation (already done, but verify)
      await this.validateEnvironment();
      
      // Phase 2: VDI extraction and mounting
      await this.extractAndMountVDI();
      
      // Phase 3: Content discovery and cataloging
      await this.discoverVisualContent();
      
      // Phase 4: Intelligent categorization
      await this.categorizeContent();
      
      // Phase 5: Image processing and optimization
      await this.processImages();
      
      // Phase 6: Upload to Supabase
      await this.uploadContent();
      
      // Phase 7: Database integration
      await this.createDatabaseRecords();
      
      // Final validation
      await this.validateResults();
      
      await this.log('✅ WIS Visual Extraction completed successfully!');
      await this.generateFinalReport();
      
    } catch (error) {
      await this.log(`💥 Critical error in extraction process: ${error.message}`);
      await this.log(`Stack trace: ${error.stack}`);
      await this.handleFailure(error);
      throw error;
    }
  }

  /**
   * Environment validation
   */
  async validateEnvironment() {
    this.stats.phase = 'validation';
    await this.log('🔍 Phase 1: Environment Validation');
    
    // Check required tools
    const tools = ['7z', 'vboximg-mount', 'magick'];
    for (const tool of tools) {
      try {
        await execAsync(`which ${tool}`);
        await this.log(`✅ ${tool} available`);
      } catch (error) {
        throw new Error(`Required tool missing: ${tool}`);
      }
    }
    
    // Check disk space
    const { stdout } = await execAsync('df -k /tmp | tail -1');
    const available = parseInt(stdout.split(/\s+/)[3]) * 1024; // Convert to bytes
    const availableGB = available / (1024**3);
    
    await this.log(`📊 Available disk space: ${availableGB.toFixed(2)}GB`);
    
    if (availableGB < 30) {
      throw new Error(`Insufficient disk space. Need at least 30GB, have ${availableGB.toFixed(2)}GB`);
    }
    
    // Check VDI archive accessibility
    const archiveExists = await fs.access(this.config.vdiArchivePath).then(() => true).catch(() => false);
    if (!archiveExists) {
      throw new Error(`VDI archive path not accessible: ${this.config.vdiArchivePath}`);
    }
    
    await this.log('✅ Environment validation completed');
  }

  /**
   * Extract VDI from 7z archive and mount it
   */
  async extractAndMountVDI() {
    this.stats.phase = 'vdi_extraction';
    await this.log('📦 Phase 2: VDI Extraction and Mounting');
    
    // Check if VDI is already extracted
    const vdiPath = path.join(this.config.workingDir, 'MERCEDES.vdi');
    const vdiExists = await fs.access(vdiPath).then(() => true).catch(() => false);
    
    if (!vdiExists) {
      await this.log('📤 Extracting VDI from 7z archive...');
      
      const archiveFile = path.join(this.config.vdiArchivePath, 'Mercedes09.7z.001 4');
      
      // Extract using 7z
      const extractCmd = `7z x "${archiveFile}" -o"${this.config.workingDir}" -y`;
      await this.log(`Executing: ${extractCmd}`);
      
      try {
        const { stdout, stderr } = await execAsync(extractCmd, { maxBuffer: 1024 * 1024 * 100 });
        await this.log(`7z extraction output: ${stdout}`);
        if (stderr) await this.log(`7z stderr: ${stderr}`);
      } catch (error) {
        throw new Error(`VDI extraction failed: ${error.message}`);
      }
      
      await this.log('✅ VDI extraction completed');
    } else {
      await this.log('✅ VDI file already extracted');
    }
    
    // Mount VDI using vboximg-mount
    await this.log('🔗 Mounting VDI file...');
    
    // Ensure mount point exists
    await fs.mkdir(this.config.mountPoint, { recursive: true });
    
    // Mount with read-only flag
    const mountCmd = `vboximg-mount -i "${vdiPath}" -o ro "${this.config.mountPoint}"`;
    await this.log(`Executing: ${mountCmd}`);
    
    try {
      const { stdout, stderr } = await execAsync(mountCmd);
      await this.log(`Mount output: ${stdout}`);
      if (stderr) await this.log(`Mount stderr: ${stderr}`);
    } catch (error) {
      throw new Error(`VDI mounting failed: ${error.message}`);
    }
    
    // Verify mount by checking contents
    const mountContents = await fs.readdir(this.config.mountPoint);
    await this.log(`Mount contents: ${mountContents.join(', ')}`);
    
    if (mountContents.length === 0) {
      throw new Error('VDI mount appears empty');
    }
    
    await this.log('✅ VDI successfully mounted');
  }

  /**
   * Discover all visual content in the mounted VDI
   */
  async discoverVisualContent() {
    this.stats.phase = 'discovery';
    await this.log('🔍 Phase 3: Visual Content Discovery');
    
    const discoveredFiles = new Set();
    
    // Build glob patterns for image discovery
    const patterns = [];
    
    // Add patterns for each image extension
    for (const ext of this.config.imageExtensions) {
      patterns.push(`**/*${ext}`);
      patterns.push(`**/*${ext.toUpperCase()}`);
    }
    
    // Add specific directory patterns
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
      '**/Maintenance/**',
      '**/manual*/**',
      '**/Manual*/**'
    ];
    
    await this.log(`Searching with ${patterns.length} file patterns and ${relevantPaths.length} directory patterns`);
    
    // Search for files by extension
    for (const pattern of patterns) {
      try {
        const files = await glob(pattern, {
          cwd: this.config.mountPoint,
          nodir: true,
          ignore: ['**/thumb*/**', '**/cache/**', '**/temp/**', '**/tmp/**']
        });
        
        files.forEach(file => discoveredFiles.add(file));
        await this.log(`Pattern ${pattern}: found ${files.length} files`);
      } catch (error) {
        await this.log(`⚠️  Pattern search failed for ${pattern}: ${error.message}`);
      }
    }
    
    // Search in relevant directories
    for (const dirPattern of relevantPaths) {
      try {
        const files = await glob(dirPattern + '/**/*', {
          cwd: this.config.mountPoint,
          nodir: true
        });
        
        // Filter to only image files
        const imageFiles = files.filter(file => {
          const ext = path.extname(file).toLowerCase();
          return this.config.imageExtensions.includes(ext);
        });
        
        imageFiles.forEach(file => discoveredFiles.add(file));
        await this.log(`Directory ${dirPattern}: found ${imageFiles.length} image files`);
      } catch (error) {
        await this.log(`⚠️  Directory search failed for ${dirPattern}: ${error.message}`);
      }
    }
    
    this.stats.totalDiscovered = discoveredFiles.size;
    await this.log(`📊 Discovery complete: ${this.stats.totalDiscovered} visual files found`);
    
    // Save discovery results
    const discoveryData = {
      timestamp: new Date().toISOString(),
      totalFiles: this.stats.totalDiscovered,
      files: [...discoveredFiles]
    };
    
    const discoveryFile = path.join(this.config.outputDir, 'discovery-results.json');
    await fs.mkdir(path.dirname(discoveryFile), { recursive: true });
    await fs.writeFile(discoveryFile, JSON.stringify(discoveryData, null, 2));
    
    await this.log('✅ Discovery results saved');
    return [...discoveredFiles];
  }

  /**
   * Categorize discovered content intelligently
   */
  async categorizeContent() {
    this.stats.phase = 'categorization';
    await this.log('🏷️  Phase 4: Intelligent Content Categorization');
    
    // Load discovery results
    const discoveryFile = path.join(this.config.outputDir, 'discovery-results.json');
    const discoveryData = JSON.parse(await fs.readFile(discoveryFile, 'utf8'));
    const files = discoveryData.files;
    
    // Define categorization rules
    const categories = {
      engine: {
        keywords: ['engine', 'motor', 'om906', 'om924', 'om936', 'om470', 'om471', 'om906la', 'om924la'],
        patterns: [/engine/i, /motor/i, /om\d{3}/i, /diesel/i, /turbo/i, /injection/i]
      },
      transmission: {
        keywords: ['transmission', 'getriebe', 'gearbox', 'g330', 'g280', 'clutch', 'gear'],
        patterns: [/transmission/i, /getriebe/i, /gearbox/i, /g\d{3}/i, /clutch/i, /gear/i]
      },
      axles: {
        keywords: ['axle', 'achse', 'portal', 'differential', 'diff', 'drive', 'propeller'],
        patterns: [/axle/i, /achse/i, /portal/i, /differential/i, /diff/i, /drive/i]
      },
      electrical: {
        keywords: ['electrical', 'elektrik', 'wiring', 'schaltplan', 'ecu', 'can', 'harness', 'fuse'],
        patterns: [/electrical/i, /elektrik/i, /wiring/i, /schaltplan/i, /ecu/i, /can/i, /electric/i]
      },
      hydraulics: {
        keywords: ['hydraulic', 'hydraulik', 'pump', 'valve', 'cylinder', 'oil', 'pressure'],
        patterns: [/hydraulic/i, /hydraulik/i, /pump/i, /valve/i, /cylinder/i, /pressure/i]
      },
      body: {
        keywords: ['body', 'karosserie', 'cabin', 'cab', 'door', 'window', 'panel', 'frame'],
        patterns: [/body/i, /karosserie/i, /cabin/i, /cab/i, /door/i, /window/i, /frame/i]
      },
      maintenance: {
        keywords: ['service', 'wartung', 'maintenance', 'repair', 'oil', 'filter', 'inspect'],
        patterns: [/service/i, /wartung/i, /maintenance/i, /repair/i, /oil/i, /filter/i]
      },
      parts: {
        keywords: ['parts', 'teile', 'catalog', 'exploded', 'assembly', 'component'],
        patterns: [/parts/i, /teile/i, /catalog/i, /exploded/i, /assembly/i, /component/i]
      },
      procedures: {
        keywords: ['procedure', 'step', 'instruction', 'guide', 'manual', 'how'],
        patterns: [/procedure/i, /step/i, /instruction/i, /guide/i, /manual/i, /how/i]
      },
      wiring: {
        keywords: ['wiring', 'wire', 'cable', 'harness', 'connector', 'plug', 'socket'],
        patterns: [/wiring/i, /wire/i, /cable/i, /harness/i, /connector/i, /plug/i]
      }
    };
    
    const categorizedFiles = {};
    let processedCount = 0;
    
    await this.log(`Starting categorization of ${files.length} files...`);
    
    for (const file of files) {
      const filePath = file.toLowerCase();
      const fileName = path.basename(filePath).toLowerCase();
      const dirPath = path.dirname(filePath).toLowerCase();
      
      let bestCategory = 'uncategorized';
      let bestScore = 0;
      
      // Score each category
      for (const [category, rules] of Object.entries(categories)) {
        let score = 0;
        
        // Check keywords in path components
        for (const keyword of rules.keywords) {
          if (filePath.includes(keyword.toLowerCase())) score += 2;
          if (fileName.includes(keyword.toLowerCase())) score += 3;
          if (dirPath.includes(keyword.toLowerCase())) score += 2;
        }
        
        // Check regex patterns
        for (const pattern of rules.patterns) {
          if (pattern.test(filePath)) score += 2;
          if (pattern.test(fileName)) score += 3;
          if (pattern.test(dirPath)) score += 2;
        }
        
        if (score > bestScore) {
          bestScore = score;
          bestCategory = category;
        }
      }
      
      // Initialize category array if needed
      if (!categorizedFiles[bestCategory]) {
        categorizedFiles[bestCategory] = [];
      }
      
      categorizedFiles[bestCategory].push(file);
      this.stats.categories[bestCategory] = (this.stats.categories[bestCategory] || 0) + 1;
      
      processedCount++;
      if (processedCount % 1000 === 0) {
        await this.log(`📊 Categorization progress: ${processedCount}/${files.length}`);
      }
    }
    
    // Save categorization results
    const categorizationFile = path.join(this.config.outputDir, 'categorized-files.json');
    await fs.writeFile(categorizationFile, JSON.stringify(categorizedFiles, null, 2));
    
    await this.log('📊 Categorization complete:');
    for (const [category, count] of Object.entries(this.stats.categories)) {
      await this.log(`   ${category}: ${count} files`);
    }
    
    await this.log('✅ Content categorization completed');
    return categorizedFiles;
  }

  /**
   * Process images with optimization for web delivery
   */
  async processImages() {
    this.stats.phase = 'processing';
    await this.log('🖼️  Phase 5: Image Processing and Optimization');
    
    // Load categorized files
    const categorizationFile = path.join(this.config.outputDir, 'categorized-files.json');
    const categorizedFiles = JSON.parse(await fs.readFile(categorizationFile, 'utf8'));
    
    let totalFiles = 0;
    for (const files of Object.values(categorizedFiles)) {
      totalFiles += files.length;
    }
    
    this.stats.totalBatches = Math.ceil(totalFiles / this.config.batchSize);
    
    await this.log(`Starting processing of ${totalFiles} files in ${this.stats.totalBatches} batches`);
    
    let processedCount = 0;
    const errors = [];
    
    for (const [category, files] of Object.entries(categorizedFiles)) {
      await this.log(`Processing category: ${category} (${files.length} files)`);
      
      // Create category directories
      for (const size of Object.keys(this.config.qualitySettings)) {
        const categoryDir = path.join(this.config.outputDir, 'images', category, size);
        await fs.mkdir(categoryDir, { recursive: true });
      }
      
      // Create metadata directory
      const metadataDir = path.join(this.config.outputDir, 'metadata', category);
      await fs.mkdir(metadataDir, { recursive: true });
      
      // Process files in batches
      for (let i = 0; i < files.length; i += this.config.batchSize) {
        const batch = files.slice(i, i + this.config.batchSize);
        this.stats.currentBatch++;
        
        await this.log(`Processing batch ${this.stats.currentBatch}/${this.stats.totalBatches} (${batch.length} files)`);
        
        const batchPromises = batch.map(async (file, index) => {
          try {
            await this.processImage(file, category);
            processedCount++;
            
            if (processedCount % 100 === 0) {
              const progress = (processedCount / totalFiles * 100).toFixed(1);
              await this.log(`📈 Progress: ${processedCount}/${totalFiles} (${progress}%)`);
            }
          } catch (error) {
            errors.push({ file, category, error: error.message });
            await this.log(`⚠️  Failed to process ${file}: ${error.message}`);
          }
        });
        
        await Promise.all(batchPromises);
        
        // Small delay between batches
        await new Promise(resolve => setTimeout(resolve, 200));
      }
    }
    
    this.stats.totalProcessed = processedCount;
    this.stats.errors = errors;
    
    await this.log(`✅ Image processing complete: ${processedCount}/${totalFiles} processed`);
    if (errors.length > 0) {
      await this.log(`⚠️  ${errors.length} files had processing errors`);
      
      // Save error report
      const errorFile = path.join(this.config.outputDir, 'processing-errors.json');
      await fs.writeFile(errorFile, JSON.stringify(errors, null, 2));
    }
  }

  /**
   * Process a single image file
   */
  async processImage(filePath, category) {
    const sourcePath = path.join(this.config.mountPoint, filePath);
    const fileName = path.basename(filePath, path.extname(filePath));
    const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9._-]/g, '_');
    
    // Check if source file exists and is readable
    try {
      await fs.access(sourcePath);
    } catch (error) {
      throw new Error(`Source file not accessible: ${sourcePath}`);
    }
    
    // Get original image metadata
    let metadata;
    try {
      const image = sharp(sourcePath);
      metadata = await image.metadata();
    } catch (error) {
      throw new Error(`Cannot read image metadata: ${error.message}`);
    }
    
    // Skip very small images (likely icons or artifacts)
    if (metadata.width < 32 || metadata.height < 32) {
      throw new Error(`Image too small: ${metadata.width}x${metadata.height}`);
    }
    
    // Skip extremely large images that might be corrupted
    if (metadata.width > 10000 || metadata.height > 10000) {
      throw new Error(`Image too large: ${metadata.width}x${metadata.height}`);
    }
    
    // Process multiple sizes
    const processedVersions = {};
    
    for (const [sizeName, settings] of Object.entries(this.config.qualitySettings)) {
      const outputPath = path.join(
        this.config.outputDir, 
        'images', 
        category, 
        sizeName, 
        `${sanitizedFileName}.jpg`
      );
      
      try {
        await sharp(sourcePath)
          .resize(settings.width, settings.height, {
            fit: 'inside',
            withoutEnlargement: true
          })
          .jpeg({ quality: settings.quality })
          .toFile(outputPath);
          
        processedVersions[sizeName] = outputPath;
      } catch (error) {
        throw new Error(`Failed to create ${sizeName} version: ${error.message}`);
      }
    }
    
    // Create metadata record
    const imageMetadata = {
      originalPath: filePath,
      fileName: sanitizedFileName,
      originalFileName: fileName,
      category: category,
      dimensions: {
        width: metadata.width,
        height: metadata.height
      },
      format: metadata.format,
      size: metadata.size,
      density: metadata.density,
      hasProfile: !!metadata.icc,
      processedAt: new Date().toISOString(),
      processedVersions: processedVersions,
      unimogModels: this.extractUnimogModels(filePath),
      partNumbers: this.extractPartNumbers(filePath),
      tags: this.generateTags(filePath, fileName, category)
    };
    
    // Save metadata
    const metadataPath = path.join(
      this.config.outputDir,
      'metadata',
      category,
      `${sanitizedFileName}.json`
    );
    
    await fs.writeFile(metadataPath, JSON.stringify(imageMetadata, null, 2));
    
    return imageMetadata;
  }

  /**
   * Upload processed content to Supabase
   */
  async uploadContent() {
    this.stats.phase = 'upload';
    await this.log('☁️  Phase 6: Content Upload to Supabase');
    
    // Verify Supabase connectivity first
    try {
      const { data, error } = await this.supabase.from('profiles').select('count', { count: 'exact', head: true });
      if (error && error.code !== 'PGRST116') {
        throw new Error(`Supabase connection failed: ${error.message}`);
      }
      await this.log('✅ Supabase connection verified');
    } catch (error) {
      throw new Error(`Supabase connection test failed: ${error.message}`);
    }
    
    // Get list of categories to upload
    const imagesDir = path.join(this.config.outputDir, 'images');
    const categories = await fs.readdir(imagesDir);
    
    let totalUploaded = 0;
    const uploadErrors = [];
    
    for (const category of categories) {
      await this.log(`📤 Uploading category: ${category}`);
      
      const categoryPath = path.join(imagesDir, category);
      const sizes = await fs.readdir(categoryPath);
      
      for (const size of sizes) {
        const sizePath = path.join(categoryPath, size);
        const files = await fs.readdir(sizePath);
        
        await this.log(`  📎 Uploading ${files.length} ${size} images from ${category}`);
        
        // Upload in batches to avoid overwhelming Supabase
        for (let i = 0; i < files.length; i += 10) {
          const batch = files.slice(i, i + 10);
          
          const uploadPromises = batch.map(async (file) => {
            try {
              const filePath = path.join(sizePath, file);
              const storageKey = `${category}/${size}/${file}`;
              
              // Read file data
              const fileBuffer = await fs.readFile(filePath);
              
              // Upload to Supabase storage
              const { error } = await this.supabase.storage
                .from('wis-diagrams')
                .upload(storageKey, fileBuffer, {
                  cacheControl: '3600',
                  upsert: true,
                  contentType: 'image/jpeg'
                });
              
              if (error) throw error;
              
              totalUploaded++;
              
              if (totalUploaded % 50 === 0) {
                await this.log(`📈 Upload progress: ${totalUploaded} files uploaded`);
              }
              
            } catch (error) {
              uploadErrors.push({ 
                category, 
                size, 
                file, 
                error: error.message 
              });
            }
          });
          
          await Promise.all(uploadPromises);
          
          // Small delay between batches
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      }
    }
    
    this.stats.totalUploaded = totalUploaded;
    this.stats.uploadErrors = uploadErrors;
    
    await this.log(`✅ Upload complete: ${totalUploaded} files uploaded to Supabase`);
    
    if (uploadErrors.length > 0) {
      await this.log(`⚠️  ${uploadErrors.length} upload failures`);
      
      // Save upload error report
      const errorFile = path.join(this.config.outputDir, 'upload-errors.json');
      await fs.writeFile(errorFile, JSON.stringify(uploadErrors, null, 2));
    }
  }

  /**
   * Create database records for uploaded content
   */
  async createDatabaseRecords() {
    this.stats.phase = 'database';
    await this.log('🗄️  Phase 7: Database Record Creation');
    
    // Collect all metadata files
    const metadataDir = path.join(this.config.outputDir, 'metadata');
    const categories = await fs.readdir(metadataDir);
    
    const allRecords = [];
    
    for (const category of categories) {
      const categoryMetadataDir = path.join(metadataDir, category);
      const metadataFiles = await fs.readdir(categoryMetadataDir);
      
      for (const metadataFile of metadataFiles) {
        const metadataPath = path.join(categoryMetadataDir, metadataFile);
        const metadata = JSON.parse(await fs.readFile(metadataPath, 'utf8'));
        
        const record = {
          file_name: metadata.fileName,
          file_path: metadata.originalPath,
          content_type: this.mapCategoryToContentType(category),
          system_category: category,
          unimog_models: metadata.unimogModels,
          part_numbers: metadata.partNumbers,
          tags: metadata.tags,
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
            extraction_version: '2.0.0',
            source_vdi: 'MERCEDES.vdi'
          }
        };
        
        allRecords.push(record);
      }
    }
    
    await this.log(`Creating ${allRecords.length} database records...`);
    
    // Insert records in batches
    const batchSize = 100;
    let insertedCount = 0;
    
    for (let i = 0; i < allRecords.length; i += batchSize) {
      const batch = allRecords.slice(i, i + batchSize);
      
      try {
        const { error } = await this.supabase
          .from('wis_visual_content')
          .insert(batch);
        
        if (error) throw error;
        
        insertedCount += batch.length;
        await this.log(`📈 Database progress: ${insertedCount}/${allRecords.length} records inserted`);
        
      } catch (error) {
        await this.log(`❌ Database insert error for batch ${i}: ${error.message}`);
        throw error;
      }
      
      // Small delay between batches
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    await this.log(`✅ Database record creation complete: ${insertedCount} records created`);
  }

  /**
   * Validate extraction results
   */
  async validateResults() {
    this.stats.phase = 'validation';
    await this.log('✅ Phase 8: Results Validation');
    
    // Check database record count
    const { data: dbRecords, error } = await this.supabase
      .from('wis_visual_content')
      .select('id', { count: 'exact' });
    
    if (error) throw error;
    
    const dbCount = dbRecords?.length || 0;
    
    await this.log(`📊 Database records: ${dbCount}`);
    await this.log(`📊 Files processed: ${this.stats.totalProcessed}`);
    await this.log(`📊 Files uploaded: ${this.stats.totalUploaded}`);
    
    // Validate random samples
    if (dbCount > 0) {
      const sampleSize = Math.min(5, dbCount);
      await this.log(`🔍 Validating ${sampleSize} random samples...`);
      
      for (let i = 0; i < sampleSize; i++) {
        const { data } = await this.supabase
          .from('wis_visual_content')
          .select('*')
          .limit(1)
          .offset(Math.floor(Math.random() * dbCount));
        
        if (data && data[0]) {
          const record = data[0];
          await this.log(`✓ Sample validated: ${record.file_name} (${record.system_category})`);
        }
      }
    }
    
    await this.log('✅ Results validation completed');
  }

  /**
   * Generate final extraction report
   */
  async generateFinalReport() {
    const endTime = new Date();
    const duration = endTime - this.stats.startTime;
    const durationHours = (duration / (1000 * 60 * 60)).toFixed(2);
    
    const report = {
      extraction_summary: {
        started_at: this.stats.startTime.toISOString(),
        completed_at: endTime.toISOString(),
        duration_hours: parseFloat(durationHours),
        total_discovered: this.stats.totalDiscovered,
        total_processed: this.stats.totalProcessed,
        total_uploaded: this.stats.totalUploaded,
        success_rate: this.stats.totalDiscovered > 0 ? 
          ((this.stats.totalProcessed / this.stats.totalDiscovered) * 100).toFixed(2) + '%' : '0%'
      },
      categories: this.stats.categories,
      processing_stats: {
        batches_processed: this.stats.currentBatch,
        total_batches: this.stats.totalBatches,
        processing_errors: this.stats.errors?.length || 0,
        upload_errors: this.stats.uploadErrors?.length || 0
      },
      quality_metrics: {
        images_per_hour: this.stats.totalProcessed / parseFloat(durationHours),
        average_batch_size: this.config.batchSize,
        error_rate: this.stats.totalDiscovered > 0 ? 
          ((this.stats.errors?.length || 0) / this.stats.totalDiscovered * 100).toFixed(2) + '%' : '0%'
      },
      next_steps: [
        'Update frontend components to display visual content',
        'Implement search functionality across images',
        'Create mobile-optimized viewing interfaces',
        'Add user rating and feedback systems',
        'Implement image annotation capabilities',
        'Consider adding AI-powered image analysis'
      ]
    };
    
    // Save report
    const reportFile = path.join(this.config.logDir, `extraction-report-${new Date().toISOString().split('T')[0]}.json`);
    await fs.writeFile(reportFile, JSON.stringify(report, null, 2));
    
    // Display final summary
    await this.log('\n🎉 WIS VISUAL EXTRACTION COMPLETE!');
    await this.log('═'.repeat(50));
    await this.log(`📊 FINAL STATISTICS:`);
    await this.log(`   Duration: ${durationHours} hours`);
    await this.log(`   Discovered: ${this.stats.totalDiscovered} files`);
    await this.log(`   Processed: ${this.stats.totalProcessed} files`);
    await this.log(`   Uploaded: ${this.stats.totalUploaded} files`);
    await this.log(`   Success Rate: ${((this.stats.totalProcessed / this.stats.totalDiscovered) * 100).toFixed(2)}%`);
    await this.log(`   Processing Speed: ${(this.stats.totalProcessed / parseFloat(durationHours)).toFixed(0)} images/hour`);
    await this.log('\n🚀 The Unimog Community Hub now has world-class visual workshop content!');
    await this.log('📝 Full report saved to:', reportFile);
  }

  /**
   * Utility methods
   */

  async log(message) {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] ${message}`;
    console.log(logMessage);
    
    try {
      await fs.appendFile(this.logFile, logMessage + '\n');
    } catch (error) {
      console.warn('Failed to write to log file:', error.message);
    }
  }

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
      'maintenance': 'procedure',
      'wiring': 'wiring'
    };
    return mapping[category] || 'diagram';
  }

  extractUnimogModels(filePath) {
    const models = [
      'U300', 'U400', 'U500', 'U1200', 'U1700', 'U2150', 'U3000', 
      'U4000', 'U5000', 'U318', 'U418', 'U518'
    ];
    
    const found = [];
    const pathUpper = filePath.toUpperCase();
    
    for (const model of models) {
      if (pathUpper.includes(model)) {
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

  generateTags(filePath, fileName, category) {
    const tags = new Set();
    
    // Add category
    tags.add(category);
    
    // Extract meaningful words from path and filename
    const allText = (filePath + ' ' + fileName).toLowerCase();
    const words = allText.match(/\b[a-z]{3,}\b/g) || [];
    
    // Add relevant technical terms
    const technicalTerms = [
      'engine', 'transmission', 'axle', 'differential', 'hydraulic',
      'electrical', 'wiring', 'diagram', 'exploded', 'assembly',
      'service', 'repair', 'maintenance', 'procedure', 'parts',
      'manual', 'guide', 'instruction'
    ];
    
    for (const word of words) {
      if (technicalTerms.includes(word)) {
        tags.add(word);
      }
    }
    
    // Add file type indicators
    if (filePath.includes('exploded')) tags.add('exploded-view');
    if (filePath.includes('diagram')) tags.add('technical-diagram');
    if (filePath.includes('wiring')) tags.add('electrical-diagram');
    if (filePath.includes('procedure')) tags.add('step-by-step');
    
    return [...tags].slice(0, 10); // Limit to 10 tags
  }

  async handleFailure(error) {
    const errorReport = {
      timestamp: new Date().toISOString(),
      phase: this.stats.phase,
      error_message: error.message,
      error_stack: error.stack,
      statistics: this.stats,
      recovery_instructions: [
        'Check if VDI is still properly mounted',
        'Verify disk space availability',
        'Check Supabase connectivity and credentials',
        'Review extraction logs for specific error patterns',
        'Consider resuming from last successful checkpoint',
        'If VDI mount failed, unmount and remount with: fusermount -u /tmp/wis-visual-extraction/vdi-mount'
      ]
    };
    
    const errorFile = path.join(this.config.logDir, `extraction-error-${Date.now()}.json`);
    await fs.writeFile(errorFile, JSON.stringify(errorReport, null, 2));
    
    await this.log('💥 Critical error report saved to:', errorFile);
    await this.log('🔧 Check the error report for recovery instructions');
  }
}

// Execute if run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const extractor = new WISVisualExtractor();
  extractor.run().catch(console.error);
}

export default WISVisualExtractor;