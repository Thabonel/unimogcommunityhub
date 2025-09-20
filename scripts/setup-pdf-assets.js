#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const publicPdfDir = path.join(projectRoot, 'public', 'pdfjs');

const sources = [
  {
    name: 'cMaps',
    from: path.join(projectRoot, 'node_modules', 'pdfjs-dist', 'cmaps'),
    to: path.join(publicPdfDir, 'cmaps')
  },
  {
    name: 'standard fonts',
    from: path.join(projectRoot, 'node_modules', 'pdfjs-dist', 'standard_fonts'),
    to: path.join(publicPdfDir, 'standard_fonts')
  }
];

async function pathExists(targetPath) {
  try {
    await fs.promises.access(targetPath, fs.constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

async function removeDirectoryIfExists(targetPath) {
  if (await pathExists(targetPath)) {
    await fs.promises.rm(targetPath, { recursive: true, force: true });
  }
}

async function copyDirectory(source, destination) {
  await fs.promises.mkdir(destination, { recursive: true });
  const entries = await fs.promises.readdir(source, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(source, entry.name);
    const destPath = path.join(destination, entry.name);

    if (entry.isDirectory()) {
      await copyDirectory(srcPath, destPath);
    } else if (entry.isFile()) {
      await fs.promises.copyFile(srcPath, destPath);
    }
  }
}

async function ensurePdfAssets() {
  let didCopy = false;

  await fs.promises.mkdir(publicPdfDir, { recursive: true });

  for (const { name, from, to } of sources) {
    const hasSource = await pathExists(from);
    if (!hasSource) {
      console.warn(`⚠️  PDF.js ${name} source not found at ${from}. Did you run "npm install"?`);
      continue;
    }

    await removeDirectoryIfExists(to);
    await copyDirectory(from, to);
    console.log(`✅ Copied PDF.js ${name} to ${path.relative(projectRoot, to)}`);
    didCopy = true;
  }

  if (!didCopy) {
    console.warn('⚠️  No PDF.js assets were copied. PDF text rendering may fail.');
  }
}

ensurePdfAssets().catch((error) => {
  console.error('❌ Failed to prepare PDF.js assets:', error);
  process.exitCode = 1;
});
