#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Consolidate duplicate numbered files by keeping the highest numbered version
 */

function findNumberedDuplicates(dir) {
  const groups = new Map();
  
  function scan(currentDir) {
    const files = fs.readdirSync(currentDir);
    
    for (const file of files) {
      const filePath = path.join(currentDir, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory() && !file.startsWith('.') && file !== 'node_modules') {
        scan(filePath);
      } else if (stat.isFile() && (file.endsWith('.ts') || file.endsWith('.tsx'))) {
        // Check if it's a numbered file
        const match = file.match(/^(.+?)\s*(\d+)\.(tsx?|ts|tsx)$/);
        if (match) {
          const baseName = match[1].trim();
          const number = parseInt(match[2]);
          const ext = match[3];
          const baseFile = `${baseName}.${ext}`;
          const fullBasePath = path.join(currentDir, baseFile);
          
          if (!groups.has(fullBasePath)) {
            groups.set(fullBasePath, []);
          }
          
          groups.get(fullBasePath).push({
            path: filePath,
            number: number,
            exists: fs.existsSync(fullBasePath)
          });
        }
      }
    }
  }
  
  scan(dir);
  return groups;
}

// Find all numbered duplicates
const srcDir = path.join(__dirname, '..', 'src');
const duplicateGroups = findNumberedDuplicates(srcDir);

let totalFiles = 0;
let groupCount = 0;

console.log('## Duplicate Consolidation Plan\n');

const filesToDelete = [];
const filesToKeep = [];

for (const [baseFile, versions] of duplicateGroups) {
  if (versions.length > 0) {
    groupCount++;
    
    // Sort by number to find the highest
    versions.sort((a, b) => b.number - a.number);
    
    const baseExists = fs.existsSync(baseFile);
    const relativePath = path.relative(srcDir, baseFile);
    
    console.log(`\n### ${relativePath}`);
    console.log(`Base file exists: ${baseExists ? 'Yes' : 'No'}`);
    console.log(`Numbered versions: ${versions.map(v => v.number).join(', ')}`);
    
    if (!baseExists) {
      // Keep the highest numbered version and rename it
      const highest = versions[0];
      console.log(`Action: Rename ${path.basename(highest.path)} to ${path.basename(baseFile)}`);
      filesToKeep.push({
        from: highest.path,
        to: baseFile
      });
      
      // Delete all other versions
      for (let i = 1; i < versions.length; i++) {
        filesToDelete.push(versions[i].path);
      }
    } else {
      // Base exists, delete all numbered versions
      console.log(`Action: Keep base file, delete all ${versions.length} numbered versions`);
      for (const version of versions) {
        filesToDelete.push(version.path);
      }
    }
    
    totalFiles += versions.length;
  }
}

console.log('\n## Summary:');
console.log(`- Groups found: ${groupCount}`);
console.log(`- Files to delete: ${filesToDelete.length}`);
console.log(`- Files to rename: ${filesToKeep.length}`);
console.log(`- Total duplicate files: ${totalFiles}`);

// Create cleanup script
const cleanupScript = `#!/bin/bash
# Duplicate file cleanup script
# Generated: ${new Date().toISOString()}

echo "Starting duplicate file cleanup..."

# Delete duplicate files
${filesToDelete.map(f => `rm "${f}"`).join('\n')}

# Rename highest versions to base names
${filesToKeep.map(k => `mv "${k.from}" "${k.to}"`).join('\n')}

echo "Cleanup complete!"
echo "Deleted ${filesToDelete.length} files"
echo "Renamed ${filesToKeep.length} files"
`;

fs.writeFileSync(path.join(__dirname, 'cleanup-duplicates.sh'), cleanupScript, { mode: 0o755 });
console.log('\n✅ Cleanup script created: scripts/cleanup-duplicates.sh');
console.log('Run it with: bash scripts/cleanup-duplicates.sh');