#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Replace 'any' types with more specific types
 */

const replacements = {
  // Catch blocks
  'catch (error: any)': 'catch (error: unknown)',
  'catch (err: any)': 'catch (err: unknown)',
  
  // Common error patterns
  'error: any': 'error: Error | unknown',
  'lastError: any': 'lastError: Error | unknown',
  
  // Function parameters for errors
  'handleSupabaseError(error: any,': 'handleSupabaseError(error: Error | unknown,',
  'isRetryableError(error: any,': 'isRetryableError(error: Error | unknown,',
  'handle(error: any,': 'handle(error: Error | unknown,',
  'categorizeError(error: any,': 'categorizeError(error: Error | unknown,',
  'handleError: (error: any,': 'handleError: (error: Error | unknown,',
  
  // Context patterns
  'context?: Record<string, any>': 'context?: Record<string, unknown>',
  'context: Record<string, any>': 'context: Record<string, unknown>',
  
  // Data patterns
  'wikiData: any)': 'wikiData: Record<string, unknown>)',
  'unimog_wiki_data: any |': 'unimog_wiki_data: Record<string, unknown> |',
  
  // User data
  'userData: { [key: string]: any }': 'userData: Record<string, unknown>',
  
  // Arrays
  'waypoints?: any[]': 'waypoints?: Array<{ lat: number; lng: number; name?: string }>',
  'waypoints: any[],': 'waypoints: Array<{ lat: number; lng: number; name?: string }>,',
  'items: any[]': 'items: unknown[]',
  
  // Map sources
  'source: any,': 'source: mapboxgl.AnySourceData,',
  
  // Promise results
  'Promise<{ error: any }>': 'Promise<{ error: Error | null }>',
  'Promise<{ error: any; data: any }>': 'Promise<{ error: Error | null; data: unknown }>',
};

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;
  
  for (const [pattern, replacement] of Object.entries(replacements)) {
    if (content.includes(pattern)) {
      content = content.replace(new RegExp(escapeRegExp(pattern), 'g'), replacement);
      modified = true;
    }
  }
  
  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    return true;
  }
  return false;
}

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function findFiles(dir, extension) {
  let results = [];
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory() && !file.startsWith('.') && file !== 'node_modules') {
      results = results.concat(findFiles(filePath, extension));
    } else if (stat.isFile() && (file.endsWith('.ts') || file.endsWith('.tsx'))) {
      results.push(filePath);
    }
  }
  
  return results;
}

// Process all TypeScript files
const srcDir = path.join(__dirname, '..', 'src');
const files = findFiles(srcDir, ['.ts', '.tsx']);

let modifiedCount = 0;
for (const file of files) {
  if (processFile(file)) {
    console.log(`Fixed: ${file}`);
    modifiedCount++;
  }
}

console.log(`\n✅ Fixed ${modifiedCount} files with 'any' types`);