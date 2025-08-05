#!/usr/bin/env node

/**
 * Simple secrets check focusing on actual exposed secrets
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔍 Checking for exposed secrets...\n');

// Only check for real exposed secrets
const secretPatterns = [
  /sk_live_[a-zA-Z0-9]{24,}/g,  // Stripe live secret key
  /pk_live_[a-zA-Z0-9]{24,}/g,  // Stripe live public key
  /SG\.[a-zA-Z0-9_-]{22}\.[a-zA-Z0-9_-]{43}/g,  // SendGrid
  /['"]eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9\.[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+['"]/g,  // Hardcoded JWT
  /anonKey:\s*['"]eyJ[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+['"]/g,  // Hardcoded anon key
  /const\s+supabaseAnonKey\s*=\s*['"]eyJ[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+['"]/g,  // Variable assignment
];

let foundSecrets = false;
const results = [];

function checkFile(filePath) {
  const ext = path.extname(filePath);
  if (!['.js', '.jsx', '.ts', '.tsx', '.json', '.md'].includes(ext)) {
    return;
  }
  
  if (filePath.includes('node_modules') || filePath.includes('.git') || filePath.includes('dist')) {
    return;
  }
  
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    
    secretPatterns.forEach(pattern => {
      const matches = content.match(pattern);
      if (matches) {
        foundSecrets = true;
        matches.forEach(match => {
          const lines = content.split('\n');
          const lineIndex = lines.findIndex(line => line.includes(match));
          const lineNumber = lineIndex + 1;
          
          results.push({
            file: filePath,
            line: lineNumber,
            match: match.substring(0, 60) + '...',
          });
        });
      }
    });
  } catch (error) {
    // Ignore errors
  }
}

function getAllFiles(dir) {
  const allFiles = [];
  
  function scanDir(currentDir) {
    if (!fs.existsSync(currentDir)) return;
    
    const entries = fs.readdirSync(currentDir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name);
      
      if (entry.isDirectory() && !['node_modules', '.git', 'dist', 'build'].includes(entry.name)) {
        scanDir(fullPath);
      } else if (entry.isFile()) {
        allFiles.push(fullPath);
      }
    }
  }
  
  scanDir(dir);
  return allFiles;
}

// Check all files
const rootDir = path.dirname(__dirname);
const filesToCheck = getAllFiles(rootDir);
console.log(`Checking ${filesToCheck.length} files...\n`);
filesToCheck.forEach(checkFile);

if (foundSecrets) {
  console.error('❌ EXPOSED SECRETS FOUND!\n');
  results.forEach(result => {
    console.error(`📄 ${result.file}:${result.line}`);
    console.error(`   Found: ${result.match}`);
    console.error('');
  });
  console.error('⚠️  Please remove these secrets before committing!');
  process.exit(1);
} else {
  console.log('✅ No exposed secrets found!');
}