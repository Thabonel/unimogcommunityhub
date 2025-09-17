#!/usr/bin/env node

/**
 * Platform Dependency Checker
 * Prevents EBADPLATFORM errors by detecting platform-specific dependencies
 */

import fs from 'fs';
import path from 'path';

const DANGEROUS_PATTERNS = [
  'darwin', 'linux', 'win32', 'x64', 'arm64', 'ia32'
];

function checkPlatformDeps(deps, path = '') {
  const platformConflicts = [];

  for (const [name, info] of Object.entries(deps || {})) {
    // Check if package name contains platform-specific terms
    const hasPlatformPattern = DANGEROUS_PATTERNS.some(pattern =>
      name.toLowerCase().includes(pattern)
    );

    if (hasPlatformPattern) {
      platformConflicts.push({
        package: `${path}${name}`,
        version: info.version || 'unknown',
        reason: 'Platform-specific package name'
      });
    }

    // Recursively check nested dependencies
    if (info.dependencies) {
      platformConflicts.push(...checkPlatformDeps(info.dependencies, `${path}${name} > `));
    }
  }

  return platformConflicts;
}

function checkPackageJson() {
  const packagePath = 'package.json';
  if (!fs.existsSync(packagePath)) {
    console.error('❌ package.json not found');
    return false;
  }

  const pkg = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
  const conflicts = [];

  // Check devDependencies
  if (pkg.devDependencies) {
    for (const [name, version] of Object.entries(pkg.devDependencies)) {
      const hasPlatformPattern = DANGEROUS_PATTERNS.some(pattern =>
        name.toLowerCase().includes(pattern)
      );

      if (hasPlatformPattern) {
        conflicts.push({
          package: name,
          version,
          location: 'devDependencies',
          reason: 'Platform-specific in devDependencies'
        });
      }
    }
  }

  // Check dependencies
  if (pkg.dependencies) {
    for (const [name, version] of Object.entries(pkg.dependencies)) {
      const hasPlatformPattern = DANGEROUS_PATTERNS.some(pattern =>
        name.toLowerCase().includes(pattern)
      );

      if (hasPlatformPattern) {
        conflicts.push({
          package: name,
          version,
          location: 'dependencies',
          reason: 'Platform-specific in dependencies'
        });
      }
    }
  }

  return conflicts;
}

function checkPackageLock() {
  const lockPath = 'package-lock.json';
  if (!fs.existsSync(lockPath)) {
    console.log('ℹ️ package-lock.json not found (this is normal if gitignored)');
    return [];
  }

  const packageLock = JSON.parse(fs.readFileSync(lockPath, 'utf8'));
  return checkPlatformDeps(packageLock.dependencies);
}

function main() {
  console.log('🔍 Checking for platform-specific dependencies...');

  let hasErrors = false;

  // Check package.json
  const packageConflicts = checkPackageJson();
  if (packageConflicts.length > 0) {
    console.error('\n❌ PLATFORM-SPECIFIC DEPENDENCIES IN PACKAGE.JSON:');
    packageConflicts.forEach(conflict => {
      console.error(`  - ${conflict.package} (${conflict.version}) in ${conflict.location}`);
      console.error(`    Reason: ${conflict.reason}`);
    });
    hasErrors = true;
  }

  // Check package-lock.json
  const lockConflicts = checkPackageLock();
  if (lockConflicts.length > 0) {
    console.warn('\n⚠️ PLATFORM-SPECIFIC DEPENDENCIES IN PACKAGE-LOCK.JSON:');
    lockConflicts.slice(0, 10).forEach(conflict => { // Limit output
      console.warn(`  - ${conflict.package} (${conflict.version})`);
      console.warn(`    Reason: ${conflict.reason}`);
    });

    if (lockConflicts.length > 10) {
      console.warn(`  ... and ${lockConflicts.length - 10} more`);
    }

    console.warn('\nℹ️ These may be resolved automatically during npm install on the target platform.');
  }

  // Provide recommendations
  if (hasErrors) {
    console.error('\n🛠️ RECOMMENDED FIXES:');
    console.error('1. Move platform-specific packages to optionalDependencies');
    console.error('2. Use wildcard versions (*) for platform packages');
    console.error('3. Remove explicit platform packages from devDependencies');
    console.error('\nExample fix:');
    console.error('  "optionalDependencies": {');
    console.error('    "@rollup/rollup-darwin-x64": "*",');
    console.error('    "@rollup/rollup-linux-x64-gnu": "*"');
    console.error('  }');

    process.exit(1);
  } else {
    console.log('✅ No problematic platform-specific dependencies found in package.json');

    if (lockConflicts.length === 0) {
      console.log('✅ No platform-specific dependencies detected in package-lock.json');
    }

    console.log('\n✅ Platform dependency check passed!');
  }
}

// Run the check
main();