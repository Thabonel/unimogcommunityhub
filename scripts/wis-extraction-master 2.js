#!/usr/bin/env node

/**
 * Master WIS/EPC Data Extraction Script
 * 
 * This script coordinates the entire WIS/EPC extraction process from VDI to Supabase
 * 
 * Prerequisites:
 * 1. Full 53.5GB MERCEDES.vdi extracted to HFS+ drive
 * 2. VirtualBox installed (or VDI converted to DMG)
 * 3. Supabase credentials configured in .env
 * 
 * Usage:
 * node scripts/wis-extraction-master.js [command] [options]
 * 
 * Commands:
 *   mount       - Mount the VDI file
 *   scan        - Scan for WIS/EPC installations
 *   extract     - Extract data from WIS/EPC
 *   upload      - Upload to Supabase
 *   verify      - Verify extraction completeness
 *   full        - Run complete extraction pipeline
 */

import { createClient } from '@supabase/supabase-js';
import { exec, spawn } from 'child_process';
import { promisify } from 'util';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import chalk from 'chalk';
import ora from 'ora';
import inquirer from 'inquirer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const execAsync = promisify(exec);

// Configuration
const CONFIG = {
  vdiPath: '/Volumes/UnimogManuals/wis-extraction/MERCEDES.vdi',
  mountPoint: '/Volumes/MERCEDES_WIS',
  tempDir: path.join(__dirname, '../wis-extraction'),
  batchSize: 100,
  expectedVdiSize: 53.5 * 1024 * 1024 * 1024, // 53.5GB in bytes
};

// WIS/EPC typical installation paths
const WIS_PATHS = [
  'Program Files/Mercedes-Benz',
  'Program Files (x86)/Mercedes-Benz',
  'Mercedes',
  'WIS',
  'EPC',
  'StarFinder',
  'MB',
  'Program Files/MB',
];

// Initialize Supabase client
const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

class WISExtractor {
  constructor() {
    this.spinner = ora();
    this.stats = {
      procedures: 0,
      parts: 0,
      diagrams: 0,
      errors: [],
    };
  }

  async run(command, options = {}) {
    console.log(chalk.blue.bold('\n🔧 Mercedes WIS/EPC Data Extractor\n'));

    try {
      switch (command) {
        case 'mount':
          await this.mountVDI();
          break;
        case 'scan':
          await this.scanForWIS();
          break;
        case 'extract':
          await this.extractData();
          break;
        case 'upload':
          await this.uploadToSupabase();
          break;
        case 'verify':
          await this.verifyExtraction();
          break;
        case 'full':
          await this.fullPipeline();
          break;
        default:
          await this.interactiveMode();
      }
    } catch (error) {
      console.error(chalk.red('\n❌ Error:'), error.message);
      process.exit(1);
    }
  }

  async interactiveMode() {
    const { action } = await inquirer.prompt([
      {
        type: 'list',
        name: 'action',
        message: 'What would you like to do?',
        choices: [
          { name: '📁 Check VDI file status', value: 'check' },
          { name: '💾 Mount VDI file', value: 'mount' },
          { name: '🔍 Scan for WIS/EPC installations', value: 'scan' },
          { name: '📊 Extract WIS/EPC data', value: 'extract' },
          { name: '☁️  Upload to Supabase', value: 'upload' },
          { name: '✅ Verify extraction', value: 'verify' },
          { name: '🚀 Run complete pipeline', value: 'full' },
          { name: '❌ Exit', value: 'exit' },
        ],
      },
    ]);

    if (action === 'exit') {
      console.log(chalk.yellow('\n👋 Goodbye!\n'));
      process.exit(0);
    }

    await this.run(action);
  }

  async checkVDI() {
    this.spinner.start('Checking VDI file...');
    
    try {
      const stats = await fs.stat(CONFIG.vdiPath);
      const sizeGB = (stats.size / (1024 * 1024 * 1024)).toFixed(2);
      
      if (stats.size < CONFIG.expectedVdiSize * 0.95) {
        this.spinner.fail(chalk.red(`VDI file incomplete: ${sizeGB}GB (expected ~53.5GB)`));
        
        console.log(chalk.yellow('\n📝 To complete extraction:'));
        console.log(chalk.gray('1. Navigate to: /Volumes/EDIT/UNIMOG MANUALS/BIG UNIMOG MANUALS/Benz1/'));
        console.log(chalk.gray('2. Run: 7z x Mercedes09.7z.001 -o"/Volumes/UnimogManuals/wis-extraction"'));
        console.log(chalk.gray('3. Wait for extraction to complete (30-45 minutes)'));
        
        return false;
      }
      
      this.spinner.succeed(chalk.green(`VDI file ready: ${sizeGB}GB`));
      return true;
    } catch (error) {
      this.spinner.fail(chalk.red('VDI file not found'));
      console.log(chalk.yellow('\nVDI expected at:'), CONFIG.vdiPath);
      return false;
    }
  }

  async mountVDI() {
    if (!(await this.checkVDI())) return;

    this.spinner.start('Mounting VDI file...');

    try {
      // Check if already mounted
      const { stdout: mounts } = await execAsync('mount');
      if (mounts.includes(CONFIG.mountPoint)) {
        this.spinner.succeed('VDI already mounted');
        return;
      }

      // Create mount point
      await execAsync(`sudo mkdir -p ${CONFIG.mountPoint}`);

      // Try VirtualBox method first
      try {
        await execAsync(`VBoxManage storageattach MERCEDES --storagectl SATA --port 0 --device 0 --type hdd --medium "${CONFIG.vdiPath}"`);
        this.spinner.succeed('VDI mounted via VirtualBox');
      } catch {
        // Fallback to conversion method
        this.spinner.text = 'Converting VDI to DMG...';
        const dmgPath = CONFIG.vdiPath.replace('.vdi', '.dmg');
        
        if (!(await fs.access(dmgPath).catch(() => false))) {
          await execAsync(`VBoxManage clonemedium disk "${CONFIG.vdiPath}" "${dmgPath}" --format RAW`);
        }
        
        await execAsync(`hdiutil attach "${dmgPath}" -mountpoint ${CONFIG.mountPoint}`);
        this.spinner.succeed('VDI mounted via DMG conversion');
      }
    } catch (error) {
      this.spinner.fail('Failed to mount VDI');
      throw error;
    }
  }

  async scanForWIS() {
    this.spinner.start('Scanning for WIS/EPC installations...');

    const found = [];
    
    for (const wisPath of WIS_PATHS) {
      const fullPath = path.join(CONFIG.mountPoint, wisPath);
      try {
        await fs.access(fullPath);
        const stats = await fs.stat(fullPath);
        if (stats.isDirectory()) {
          found.push(fullPath);
        }
      } catch {
        // Path doesn't exist, continue
      }
    }

    this.spinner.succeed(`Found ${found.length} potential WIS/EPC locations`);
    
    if (found.length > 0) {
      console.log(chalk.green('\n📁 WIS/EPC Locations:'));
      found.forEach(p => console.log(chalk.gray(`  - ${p}`)));
    }

    return found;
  }

  async extractData() {
    const locations = await this.scanForWIS();
    
    if (locations.length === 0) {
      throw new Error('No WIS/EPC installations found');
    }

    console.log(chalk.blue('\n📊 Starting data extraction...\n'));

    // Create temp directory
    await fs.mkdir(CONFIG.tempDir, { recursive: true });

    for (const location of locations) {
      await this.extractFromLocation(location);
    }

    console.log(chalk.green('\n✅ Extraction complete!'));
    console.log(chalk.gray(`  Procedures: ${this.stats.procedures}`));
    console.log(chalk.gray(`  Parts: ${this.stats.parts}`));
    console.log(chalk.gray(`  Diagrams: ${this.stats.diagrams}`));
    
    if (this.stats.errors.length > 0) {
      console.log(chalk.yellow(`  Errors: ${this.stats.errors.length}`));
    }
  }

  async extractFromLocation(location) {
    console.log(chalk.blue(`\n📂 Extracting from: ${location}`));

    // Look for common WIS/EPC database files
    const dbPatterns = [
      '*.mdb',  // Access databases
      '*.db',   // SQLite databases
      '*.xml',  // XML data files
      '*.dat',  // Data files
    ];

    for (const pattern of dbPatterns) {
      const files = await this.findFiles(location, pattern);
      for (const file of files) {
        await this.processDataFile(file);
      }
    }

    // Look for diagrams and images
    const imagePatterns = ['*.jpg', '*.png', '*.gif', '*.bmp', '*.svg'];
    for (const pattern of imagePatterns) {
      const files = await this.findFiles(location, pattern);
      for (const file of files) {
        await this.processDiagram(file);
      }
    }
  }

  async findFiles(directory, pattern) {
    try {
      const { stdout } = await execAsync(`find "${directory}" -name "${pattern}" -type f`);
      return stdout.trim().split('\n').filter(Boolean);
    } catch {
      return [];
    }
  }

  async processDataFile(filePath) {
    const fileName = path.basename(filePath);
    const ext = path.extname(filePath).toLowerCase();

    try {
      if (ext === '.mdb') {
        // Process Access database
        await this.processAccessDB(filePath);
      } else if (ext === '.xml') {
        // Process XML file
        await this.processXML(filePath);
      } else if (ext === '.db') {
        // Process SQLite database
        await this.processSQLiteDB(filePath);
      }
    } catch (error) {
      this.stats.errors.push({ file: fileName, error: error.message });
    }
  }

  async processAccessDB(filePath) {
    // Use mdbtools to extract Access database
    try {
      const { stdout: tables } = await execAsync(`mdb-tables -1 "${filePath}"`);
      const tableList = tables.trim().split('\n').filter(Boolean);

      for (const table of tableList) {
        const { stdout: data } = await execAsync(`mdb-export "${filePath}" "${table}"`);
        
        // Parse CSV data and save to temp files
        const outputPath = path.join(CONFIG.tempDir, `${table}.json`);
        const records = this.parseCSV(data);
        
        await fs.writeFile(outputPath, JSON.stringify(records, null, 2));
        
        // Update stats based on table name
        if (table.toLowerCase().includes('procedure')) {
          this.stats.procedures += records.length;
        } else if (table.toLowerCase().includes('part')) {
          this.stats.parts += records.length;
        }
      }
    } catch (error) {
      // mdbtools might not be installed
      console.log(chalk.yellow(`  ⚠️  Cannot process Access DB (install mdbtools): ${path.basename(filePath)}`));
    }
  }

  async processXML(filePath) {
    const content = await fs.readFile(filePath, 'utf-8');
    const outputPath = path.join(CONFIG.tempDir, `${path.basename(filePath)}.json`);
    
    // Basic XML to JSON conversion (you might want to use a proper XML parser)
    await fs.writeFile(outputPath, JSON.stringify({ source: filePath, content }, null, 2));
  }

  async processSQLiteDB(filePath) {
    try {
      // Extract SQLite data
      const { stdout } = await execAsync(`sqlite3 "${filePath}" ".dump"`);
      const outputPath = path.join(CONFIG.tempDir, `${path.basename(filePath)}.sql`);
      await fs.writeFile(outputPath, stdout);
    } catch {
      console.log(chalk.yellow(`  ⚠️  Cannot process SQLite DB: ${path.basename(filePath)}`));
    }
  }

  async processDiagram(filePath) {
    const fileName = path.basename(filePath);
    const destPath = path.join(CONFIG.tempDir, 'diagrams', fileName);
    
    await fs.mkdir(path.dirname(destPath), { recursive: true });
    await fs.copyFile(filePath, destPath);
    
    this.stats.diagrams++;
  }

  parseCSV(csvData) {
    const lines = csvData.trim().split('\n');
    if (lines.length < 2) return [];

    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
    const records = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''));
      const record = {};
      headers.forEach((header, index) => {
        record[header] = values[index] || '';
      });
      records.push(record);
    }

    return records;
  }

  async uploadToSupabase() {
    console.log(chalk.blue('\n☁️  Uploading to Supabase...\n'));

    const tempFiles = await fs.readdir(CONFIG.tempDir);
    
    for (const file of tempFiles) {
      if (file.endsWith('.json')) {
        await this.uploadJSONFile(path.join(CONFIG.tempDir, file));
      }
    }

    // Upload diagrams
    const diagramsDir = path.join(CONFIG.tempDir, 'diagrams');
    try {
      const diagrams = await fs.readdir(diagramsDir);
      for (const diagram of diagrams) {
        await this.uploadDiagram(path.join(diagramsDir, diagram));
      }
    } catch {
      // No diagrams directory
    }

    console.log(chalk.green('\n✅ Upload complete!'));
  }

  async uploadJSONFile(filePath) {
    const content = JSON.parse(await fs.readFile(filePath, 'utf-8'));
    const fileName = path.basename(filePath, '.json');

    if (fileName.toLowerCase().includes('procedure')) {
      await this.uploadProcedures(content);
    } else if (fileName.toLowerCase().includes('part')) {
      await this.uploadParts(content);
    }
  }

  async uploadProcedures(procedures) {
    const batches = this.chunk(procedures, CONFIG.batchSize);
    
    for (const batch of batches) {
      const formatted = batch.map(p => ({
        procedure_code: p.code || p.id || `PROC_${Date.now()}`,
        title: p.title || p.name || 'Unknown Procedure',
        content: p.content || p.description || '',
        model: p.model || 'All Models',
        system: p.system || 'General',
        tools_required: p.tools ? p.tools.split(',') : [],
        parts_required: p.parts ? p.parts.split(',') : [],
      }));

      const { error } = await supabase
        .from('wis_procedures')
        .upsert(formatted, { onConflict: 'procedure_code' });

      if (error) {
        console.error(chalk.red('  Error uploading procedures:'), error.message);
      }
    }
  }

  async uploadParts(parts) {
    const batches = this.chunk(parts, CONFIG.batchSize);
    
    for (const batch of batches) {
      const formatted = batch.map(p => ({
        part_number: p.number || p.id || `PART_${Date.now()}`,
        description: p.description || p.name || 'Unknown Part',
        models: p.models ? p.models.split(',') : [],
        category: p.category || 'General',
      }));

      const { error } = await supabase
        .from('wis_parts')
        .upsert(formatted, { onConflict: 'part_number' });

      if (error) {
        console.error(chalk.red('  Error uploading parts:'), error.message);
      }
    }
  }

  async uploadDiagram(filePath) {
    const fileName = path.basename(filePath);
    const fileBuffer = await fs.readFile(filePath);

    const { error } = await supabase.storage
      .from('wis-diagrams')
      .upload(fileName, fileBuffer, {
        contentType: this.getContentType(fileName),
        upsert: true,
      });

    if (error) {
      console.error(chalk.red(`  Error uploading diagram ${fileName}:`), error.message);
    }
  }

  getContentType(fileName) {
    const ext = path.extname(fileName).toLowerCase();
    const types = {
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.gif': 'image/gif',
      '.svg': 'image/svg+xml',
      '.bmp': 'image/bmp',
    };
    return types[ext] || 'application/octet-stream';
  }

  chunk(array, size) {
    const chunks = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  }

  async verifyExtraction() {
    console.log(chalk.blue('\n✅ Verifying extraction...\n'));

    const { data: procedures } = await supabase
      .from('wis_procedures')
      .select('count', { count: 'exact' });

    const { data: parts } = await supabase
      .from('wis_parts')
      .select('count', { count: 'exact' });

    const { data: diagrams } = await supabase
      .from('wis_diagrams')
      .select('count', { count: 'exact' });

    console.log(chalk.green('📊 Database Status:'));
    console.log(chalk.gray(`  Procedures: ${procedures?.length || 0}`));
    console.log(chalk.gray(`  Parts: ${parts?.length || 0}`));
    console.log(chalk.gray(`  Diagrams: ${diagrams?.length || 0}`));

    // Test the viewer
    console.log(chalk.blue('\n🌐 Test the WIS/EPC viewer:'));
    console.log(chalk.gray('  http://localhost:5173/knowledge/wis-epc'));
  }

  async fullPipeline() {
    console.log(chalk.blue.bold('\n🚀 Running full extraction pipeline...\n'));

    const steps = [
      { name: 'Checking VDI', fn: () => this.checkVDI() },
      { name: 'Mounting VDI', fn: () => this.mountVDI() },
      { name: 'Scanning for WIS/EPC', fn: () => this.scanForWIS() },
      { name: 'Extracting data', fn: () => this.extractData() },
      { name: 'Uploading to Supabase', fn: () => this.uploadToSupabase() },
      { name: 'Verifying extraction', fn: () => this.verifyExtraction() },
    ];

    for (const step of steps) {
      console.log(chalk.blue(`\n▶️  ${step.name}...`));
      try {
        await step.fn();
      } catch (error) {
        console.error(chalk.red(`❌ Failed at ${step.name}:`), error.message);
        break;
      }
    }

    console.log(chalk.green.bold('\n✨ Pipeline complete!\n'));
  }
}

// Main execution
const extractor = new WISExtractor();
const command = process.argv[2];
extractor.run(command).catch(console.error);