#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Find duplicate function definitions across files
 */

function extractFunctions(content) {
  const functions = [];
  
  // Match exported functions and const arrow functions
  const patterns = [
    /export\s+function\s+(\w+)/g,
    /export\s+const\s+(\w+)\s*=/g,
    /export\s+async\s+function\s+(\w+)/g,
  ];
  
  for (const pattern of patterns) {
    let match;
    while ((match = pattern.exec(content)) !== null) {
      functions.push(match[1]);
    }
  }
  
  return functions;
}

function findFiles(dir) {
  let results = [];
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory() && !file.startsWith('.') && file !== 'node_modules') {
      results = results.concat(findFiles(filePath));
    } else if (stat.isFile() && (file.endsWith('.ts') || file.endsWith('.tsx'))) {
      results.push(filePath);
    }
  }
  
  return results;
}

// Process all TypeScript files
const srcDir = path.join(__dirname, '..', 'src');
const files = findFiles(srcDir);

const functionMap = new Map();

for (const file of files) {
  const content = fs.readFileSync(file, 'utf8');
  const functions = extractFunctions(content);
  const relativePath = path.relative(srcDir, file);
  
  for (const func of functions) {
    if (!functionMap.has(func)) {
      functionMap.set(func, []);
    }
    functionMap.get(func).push(relativePath);
  }
}

// Find duplicates
const duplicates = new Map();
for (const [func, files] of functionMap) {
  if (files.length > 1) {
    duplicates.set(func, files);
  }
}

// Sort by number of duplicates
const sortedDuplicates = [...duplicates.entries()].sort((a, b) => b[1].length - a[1].length);

console.log('## Duplicate Functions Report\n');
console.log(`Found ${sortedDuplicates.length} functions with duplicates\n`);

// Group by likely related files (numbered versions)
const groups = new Map();

for (const [func, files] of sortedDuplicates) {
  // Find base name (without numbers)
  const baseNames = new Set();
  for (const file of files) {
    const base = file.replace(/\s*\d+\.(tsx?|ts|tsx)$/, '$1');
    baseNames.add(base);
  }
  
  if (baseNames.size === 1) {
    // All are numbered versions of same file
    const base = [...baseNames][0];
    if (!groups.has(base)) {
      groups.set(base, new Set());
    }
    groups.get(base).add(func);
  }
}

console.log('### Files with numbered duplicates:\n');
for (const [base, funcs] of groups) {
  console.log(`- ${base}: ${funcs.size} duplicate functions`);
}

console.log('\n### Top 20 Most Duplicated Functions:\n');
for (let i = 0; i < Math.min(20, sortedDuplicates.length); i++) {
  const [func, files] = sortedDuplicates[i];
  console.log(`\n${i + 1}. **${func}** (${files.length} files):`);
  for (const file of files.slice(0, 5)) {
    console.log(`   - ${file}`);
  }
  if (files.length > 5) {
    console.log(`   ... and ${files.length - 5} more`);
  }
}