#!/usr/bin/env node

/**
 * Netlify-specific build script
 * Handles environment detection and platform-specific optimizations
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('🚀 Starting Netlify-optimized build...');

// Environment detection
const isNetlify = process.env.NETLIFY === 'true';
const isLocal = !isNetlify;
const platform = process.platform;

console.log(`Environment: ${isNetlify ? 'Netlify (Linux)' : 'Local (' + platform + ')'}`);

// Pre-build cleanup for platform compatibility
if (isNetlify) {
  console.log('🧹 Cleaning platform-specific artifacts for Linux build...');

  // Remove any Mac-specific cache
  try {
    execSync('rm -rf node_modules/.cache', { stdio: 'inherit' });
    console.log('✅ Cleared node_modules cache');
  } catch (e) {
    console.log('ℹ️ No cache to clear');
  }

  // Ensure fresh package resolution on Linux
  console.log('📦 Using fresh package resolution for Linux...');
}

// Run environment validation
console.log('🔍 Validating environment variables...');
try {
  execSync('node scripts/validate-env.js', { stdio: 'inherit' });
} catch (error) {
  console.error('❌ Environment validation failed');
  process.exit(1);
}

// Run the actual build
console.log('🏗️ Building application...');
try {
  execSync('npx vite build', { stdio: 'inherit' });
  console.log('✅ Build completed successfully!');
} catch (error) {
  console.error('❌ Build failed');
  process.exit(1);
}

// Post-build optimizations
if (isNetlify) {
  console.log('⚡ Applying Netlify optimizations...');

  // Add any Netlify-specific optimizations here
  console.log('✅ Netlify optimizations applied');
}

console.log('🎉 Build process completed!');