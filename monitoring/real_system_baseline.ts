#!/usr/bin/env npx tsx

/**
 * Real System Performance Baseline
 * Measures actual Barry AI & WIS system performance
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { performance } from 'perf_hooks';

// ES module compatibility
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface RealSystemMetrics {
  timestamp: string;
  buildPerformance: {
    buildTime: number;
    buildSuccess: boolean;
    buildSize: number;
  };
  fileSystemMetrics: {
    criticalFilesSizes: Record<string, number>;
    totalProjectSize: number;
    nodeModulesSize: number;
  };
  codeComplexity: {
    totalFiles: number;
    linesOfCode: number;
    componentCount: number;
    edgeFunctionCount: number;
  };
  systemResources: {
    nodeVersion: string;
    platform: string;
    memoryUsage: NodeJS.MemoryUsage;
    cpuCount: number;
  };
}

class RealSystemMonitor {
  
  // Measure build performance
  async measureBuildPerformance(): Promise<{buildTime: number, buildSuccess: boolean, buildSize: number}> {
    console.log('📦 Measuring build performance...');
    
    const startTime = performance.now();
    
    try {
      // Import child_process to run build
      const { execSync } = await import('child_process');
      
      // Clean any existing build
      try {
        execSync('rm -rf dist', { cwd: path.join(__dirname, '..') });
      } catch (e) {
        // Ignore if dist doesn't exist
      }
      
      // Run build
      execSync('npm run build', { 
        cwd: path.join(__dirname, '..'),
        stdio: 'pipe' // Suppress output
      });
      
      const endTime = performance.now();
      const buildTime = endTime - startTime;
      
      // Measure build size
      const distPath = path.join(__dirname, '..', 'dist');
      let buildSize = 0;
      
      try {
        const { execSync } = await import('child_process');
        const sizeOutput = execSync(`du -s "${distPath}"`, { encoding: 'utf8' });
        buildSize = parseInt(sizeOutput.split('\t')[0]) * 1024; // Convert KB to bytes
      } catch (e) {
        console.warn('Could not measure build size');
      }
      
      return {
        buildTime,
        buildSuccess: true,
        buildSize
      };
    } catch (error) {
      const endTime = performance.now();
      return {
        buildTime: endTime - startTime,
        buildSuccess: false,
        buildSize: 0
      };
    }
  }
  
  // Measure file system metrics
  async measureFileSystemMetrics(): Promise<{
    criticalFilesSizes: Record<string, number>;
    totalProjectSize: number;
    nodeModulesSize: number;
  }> {
    console.log('📁 Measuring file system metrics...');
    
    const projectRoot = path.join(__dirname, '..');
    
    // Critical files to measure
    const criticalFiles = [
      'src/components/wis/BarryChat.tsx',
      'src/components/wis/WISMercedesInterface.tsx',
      'src/components/wis/WISBarryPanel.tsx',
      'src/utils/wis-search-enhancement.ts',
      'supabase/functions/chat-with-barry-claude/index.ts',
      'src/lib/supabase-client.ts',
      'package.json',
      'CLAUDE.md'
    ];
    
    const criticalFilesSizes: Record<string, number> = {};
    
    for (const file of criticalFiles) {
      const filePath = path.join(projectRoot, file);
      try {
        const stats = await fs.promises.stat(filePath);
        criticalFilesSizes[file] = stats.size;
      } catch (e) {
        criticalFilesSizes[file] = 0;
      }
    }
    
    // Measure total project size (excluding node_modules)
    let totalProjectSize = 0;
    let nodeModulesSize = 0;
    
    try {
      const { execSync } = await import('child_process');
      
      // Total project size excluding node_modules (macOS compatible)
      const projectSizeOutput = execSync(
        `find "${projectRoot}" -name node_modules -prune -o -name .git -prune -o -type f -print0 | xargs -0 wc -c | tail -1`,
        { encoding: 'utf8' }
      );
      totalProjectSize = parseInt(projectSizeOutput.trim().split(' ')[0]) || 0;
      
      // Node modules size
      const nodeModulesPath = path.join(projectRoot, 'node_modules');
      try {
        const nodeModulesSizeOutput = execSync(`du -s "${nodeModulesPath}"`, { encoding: 'utf8' });
        nodeModulesSize = parseInt(nodeModulesSizeOutput.split('\t')[0]) * 1024;
      } catch (e) {
        nodeModulesSize = 0;
      }
    } catch (e) {
      console.warn('Could not measure directory sizes');
    }
    
    return {
      criticalFilesSizes,
      totalProjectSize,
      nodeModulesSize
    };
  }
  
  // Measure code complexity
  async measureCodeComplexity(): Promise<{
    totalFiles: number;
    linesOfCode: number;
    componentCount: number;
    edgeFunctionCount: number;
  }> {
    console.log('🔍 Measuring code complexity...');
    
    const projectRoot = path.join(__dirname, '..');
    
    try {
      const { execSync } = await import('child_process');
      
      // Count TypeScript/JavaScript files
      const fileCountOutput = execSync(
        `find "${projectRoot}/src" -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" | wc -l`,
        { encoding: 'utf8' }
      );
      const totalFiles = parseInt(fileCountOutput.trim());
      
      // Count lines of code
      const locOutput = execSync(
        `find "${projectRoot}/src" -name "*.ts" -o -name "*.tsx" | head -50 | xargs wc -l | tail -n 1`,
        { encoding: 'utf8' }
      );
      const linesOfCode = parseInt(locOutput.trim().split(' ')[0]) || 0;
      
      // Count React components
      const componentCountOutput = execSync(
        `grep -r "export.*function\\|export default function\\|const.*=.*=>" "${projectRoot}/src/components" | wc -l`,
        { encoding: 'utf8' }
      );
      const componentCount = parseInt(componentCountOutput.trim());
      
      // Count Edge Functions
      const edgeFunctionPath = path.join(projectRoot, 'supabase', 'functions');
      let edgeFunctionCount = 0;
      
      try {
        const functionDirs = await fs.promises.readdir(edgeFunctionPath);
        edgeFunctionCount = functionDirs.filter(dir => 
          fs.statSync(path.join(edgeFunctionPath, dir)).isDirectory()
        ).length;
      } catch (e) {
        edgeFunctionCount = 0;
      }
      
      return {
        totalFiles,
        linesOfCode,
        componentCount,
        edgeFunctionCount
      };
    } catch (error) {
      return {
        totalFiles: 0,
        linesOfCode: 0,
        componentCount: 0,
        edgeFunctionCount: 0
      };
    }
  }
  
  // Get system resources
  async getSystemResources() {
    const os = await import('os');
    
    return {
      nodeVersion: process.version,
      platform: process.platform,
      memoryUsage: process.memoryUsage(),
      cpuCount: os.cpus().length
    };
  }
  
  // Run complete real system baseline
  async runRealBaseline(): Promise<RealSystemMetrics> {
    console.log('🚀 Starting Real Barry AI & WIS System Baseline');
    console.log('===============================================');
    
    const [buildPerformance, fileSystemMetrics, codeComplexity] = await Promise.all([
      this.measureBuildPerformance(),
      this.measureFileSystemMetrics(),
      this.measureCodeComplexity()
    ]);
    
    const systemResources = await this.getSystemResources();
    
    const metrics: RealSystemMetrics = {
      timestamp: new Date().toISOString(),
      buildPerformance,
      fileSystemMetrics,
      codeComplexity,
      systemResources
    };
    
    return metrics;
  }
  
  // Print detailed report
  printDetailedReport(metrics: RealSystemMetrics): void {
    console.log('\\n📊 REAL SYSTEM PERFORMANCE BASELINE');
    console.log('====================================');
    
    console.log('\\n🏗️  Build Performance:');
    console.log(`   Build Time: ${(metrics.buildPerformance.buildTime / 1000).toFixed(1)}s`);
    console.log(`   Build Success: ${metrics.buildPerformance.buildSuccess ? '✅' : '❌'}`);
    console.log(`   Build Size: ${(metrics.buildPerformance.buildSize / 1024 / 1024).toFixed(1)}MB`);
    
    console.log('\\n📁 File System Metrics:');
    console.log(`   Total Project Size: ${(metrics.fileSystemMetrics.totalProjectSize / 1024 / 1024).toFixed(1)}MB`);
    console.log(`   Node Modules Size: ${(metrics.fileSystemMetrics.nodeModulesSize / 1024 / 1024).toFixed(1)}MB`);
    
    console.log('\\n📄 Critical Files:');
    Object.entries(metrics.fileSystemMetrics.criticalFilesSizes).forEach(([file, size]) => {
      console.log(`   ${file}: ${(size / 1024).toFixed(1)}KB`);
    });
    
    console.log('\\n🔍 Code Complexity:');
    console.log(`   Total Files: ${metrics.codeComplexity.totalFiles}`);
    console.log(`   Lines of Code: ${metrics.codeComplexity.linesOfCode.toLocaleString()}`);
    console.log(`   React Components: ${metrics.codeComplexity.componentCount}`);
    console.log(`   Edge Functions: ${metrics.codeComplexity.edgeFunctionCount}`);
    
    console.log('\\n💻 System Resources:');
    console.log(`   Node Version: ${metrics.systemResources.nodeVersion}`);
    console.log(`   Platform: ${metrics.systemResources.platform}`);
    console.log(`   CPU Cores: ${metrics.systemResources.cpuCount}`);
    console.log(`   Memory Usage: ${(metrics.systemResources.memoryUsage.heapUsed / 1024 / 1024).toFixed(1)}MB`);
    console.log(`   Total Memory: ${(metrics.systemResources.memoryUsage.rss / 1024 / 1024).toFixed(1)}MB`);
    
    console.log('\\n✅ Real system baseline measurement complete!');
  }
  
  // Save metrics to file
  async saveMetrics(metrics: RealSystemMetrics): Promise<void> {
    const filePath = path.join(__dirname, 'real_system_baseline.json');
    await fs.promises.writeFile(filePath, JSON.stringify(metrics, null, 2));
    console.log(`📊 Metrics saved to: ${filePath}`);
  }
}

// Main execution
if (import.meta.url === `file://${process.argv[1]}`) {
  async function main() {
    try {
      const monitor = new RealSystemMonitor();
      const metrics = await monitor.runRealBaseline();
      
      await monitor.saveMetrics(metrics);
      monitor.printDetailedReport(metrics);
      
    } catch (error) {
      console.error('❌ Real system baseline failed:', error);
      process.exit(1);
    }
  }
  
  main();
}