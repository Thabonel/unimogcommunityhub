#!/usr/bin/env node

/**
 * Script to remove console statements from production code
 * Keeps only critical error logging with production guards
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const srcDir = path.join(__dirname, '..', 'src');
let totalRemoved = 0;
let filesModified = 0;

// Patterns to remove
const consolePatterns = [
  /console\.(log|warn|info|debug|trace|dir|table|time|timeEnd|timeLog|group|groupEnd|groupCollapsed)\([^)]*\);?\s*/g,
  /console\.(log|warn|info|debug|trace|dir|table|time|timeEnd|timeLog|group|groupEnd|groupCollapsed)\([^)]*\)\s*{\s*}/g,
  /console\.(log|warn|info|debug|trace|dir|table|time|timeEnd|timeLog|group|groupEnd|groupCollapsed)\(`[^`]*`\);?\s*/g,
];

// Keep critical errors but add production guard
const errorPattern = /console\.error\((.*?)\);?/g;

function processFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    const originalContent = content;
    let removedCount = 0;
    
    // Remove non-error console statements
    consolePatterns.forEach(pattern => {
      const matches = content.match(pattern);
      if (matches) {
        removedCount += matches.length;
        content = content.replace(pattern, '');
      }
    });
    
    // Wrap console.error with production check
    content = content.replace(errorPattern, (match, args) => {
      // Skip if already wrapped
      if (content.includes('if (!import.meta.env.PROD)') && 
          content.indexOf('if (!import.meta.env.PROD)') < content.indexOf(match)) {
        return match;
      }
      
      // For critical errors in catch blocks, keep them but add production guard
      if (filePath.includes('Service') || filePath.includes('error') || filePath.includes('Error')) {
        return `if (!import.meta.env.PROD) console.error(${args});`;
      }
      
      // Remove other console.errors
      removedCount++;
      return '';
    });
    
    // Clean up empty lines left behind
    content = content.replace(/\n\s*\n\s*\n/g, '\n\n');
    
    if (content !== originalContent) {
      fs.writeFileSync(filePath, content);
      filesModified++;
      totalRemoved += removedCount;
      console.log(`✓ ${path.relative(srcDir, filePath)}: Removed ${removedCount} console statements`);
    }
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error.message);
  }
}

function walkDir(dir) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      // Skip node_modules and build directories
      if (!file.includes('node_modules') && !file.includes('dist') && !file.includes('build')) {
        walkDir(filePath);
      }
    } else if (file.endsWith('.ts') || file.endsWith('.tsx')) {
      processFile(filePath);
    }
  });
}

console.log('🧹 Removing console statements from TypeScript files...\n');
walkDir(srcDir);
console.log(`\n✅ Complete! Removed ${totalRemoved} console statements from ${filesModified} files.`);