#!/usr/bin/env npx tsx

/**
 * Simple Performance Baseline for Barry AI & WIS System
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { performance } from 'perf_hooks';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface SimpleBaselineMetrics {
  timestamp: string;
  criticalFiles: {
    name: string;
    size: number;
    exists: boolean;
  }[];
  systemInfo: {
    nodeVersion: string;
    platform: string;
    memory: number;
  };
  buildTest: {
    attempted: boolean;
    success: boolean;
    duration: number;
  };
}

class SimpleMonitor {
  
  async measureCriticalFiles() {
    const projectRoot = path.join(__dirname, '..');
    
    const criticalFiles = [
      'src/components/wis/BarryChat.tsx',
      'src/components/wis/WISMercedesInterface.tsx', 
      'src/components/wis/WISBarryPanel.tsx',
      'src/utils/wis-search-enhancement.ts',
      'supabase/functions/chat-with-barry-claude/index.ts',
      'package.json',
      'CLAUDE.md'
    ];
    
    const results = [];
    
    for (const file of criticalFiles) {
      const filePath = path.join(projectRoot, file);
      try {
        const stats = await fs.promises.stat(filePath);
        results.push({
          name: file,
          size: stats.size,
          exists: true
        });
      } catch (e) {
        results.push({
          name: file,
          size: 0,
          exists: false
        });
      }
    }
    
    return results;
  }
  
  async testBuild() {
    const startTime = performance.now();
    
    try {
      const { execSync } = await import('child_process');
      
      console.log('🏗️  Testing build process...');
      execSync('npm run build', { 
        cwd: path.join(__dirname, '..'),
        stdio: 'pipe',
        timeout: 60000
      });
      
      const endTime = performance.now();
      
      return {
        attempted: true,
        success: true,
        duration: endTime - startTime
      };
    } catch (error) {
      const endTime = performance.now();
      
      return {
        attempted: true,
        success: false,
        duration: endTime - startTime
      };
    }
  }
  
  async getSystemInfo() {
    const os = await import('os');
    
    return {
      nodeVersion: process.version,
      platform: process.platform,
      memory: Math.round(process.memoryUsage().heapUsed / 1024 / 1024)
    };
  }
  
  async runSimpleBaseline(): Promise<SimpleBaselineMetrics> {
    console.log('🚀 Running Simple Barry AI & WIS Baseline');
    console.log('=========================================');
    
    console.log('📁 Checking critical files...');
    const criticalFiles = await this.measureCriticalFiles();
    
    console.log('💻 Getting system info...');
    const systemInfo = await this.getSystemInfo();
    
    const buildTest = await this.testBuild();
    
    const metrics: SimpleBaselineMetrics = {
      timestamp: new Date().toISOString(),
      criticalFiles,
      systemInfo,
      buildTest
    };
    
    return metrics;
  }
  
  printReport(metrics: SimpleBaselineMetrics) {
    console.log('\\n📊 SIMPLE BASELINE REPORT');
    console.log('==========================');
    
    console.log('\\n📁 Critical Files Status:');
    metrics.criticalFiles.forEach(file => {
      const status = file.exists ? '✅' : '❌';
      const sizeInfo = file.exists ? `(${(file.size / 1024).toFixed(1)}KB)` : '(missing)';
      console.log(`   ${status} ${file.name} ${sizeInfo}`);
    });
    
    const existingFiles = metrics.criticalFiles.filter(f => f.exists).length;
    const totalFiles = metrics.criticalFiles.length;
    console.log(`\\n   Summary: ${existingFiles}/${totalFiles} critical files present`);
    
    console.log('\\n🏗️  Build Test:');
    console.log(`   Attempted: ${metrics.buildTest.attempted ? 'Yes' : 'No'}`);
    console.log(`   Success: ${metrics.buildTest.success ? '✅' : '❌'}`);
    console.log(`   Duration: ${(metrics.buildTest.duration / 1000).toFixed(1)}s`);
    
    console.log('\\n💻 System Info:');
    console.log(`   Node: ${metrics.systemInfo.nodeVersion}`);
    console.log(`   Platform: ${metrics.systemInfo.platform}`);
    console.log(`   Memory: ${metrics.systemInfo.memory}MB`);
    
    console.log('\\n✅ Simple baseline complete!');
    
    // Assessment
    const healthScore = this.calculateHealthScore(metrics);
    console.log(`\\n🎯 System Health Score: ${healthScore}%`);
    
    if (healthScore >= 80) {
      console.log('🟢 System is healthy and ready for optimization');
    } else if (healthScore >= 60) {
      console.log('🟡 System has some issues but is functional');
    } else {
      console.log('🔴 System has significant issues that should be addressed');
    }
  }
  
  calculateHealthScore(metrics: SimpleBaselineMetrics): number {
    let score = 0;
    
    // Critical files (40 points max)
    const fileScore = (metrics.criticalFiles.filter(f => f.exists).length / metrics.criticalFiles.length) * 40;
    score += fileScore;
    
    // Build success (40 points max)
    if (metrics.buildTest.success) {
      score += 40;
      
      // Bonus for fast build
      if (metrics.buildTest.duration < 30000) {
        score += 10;
      }
    }
    
    // System stability (20 points max)
    if (metrics.systemInfo.memory < 100) { // Less than 100MB usage
      score += 20;
    } else if (metrics.systemInfo.memory < 200) {
      score += 10;
    }
    
    return Math.round(score);
  }
  
  async saveMetrics(metrics: SimpleBaselineMetrics) {
    const filePath = path.join(__dirname, 'simple_baseline.json');
    await fs.promises.writeFile(filePath, JSON.stringify(metrics, null, 2));
    console.log(`\\n💾 Metrics saved to: ${filePath}`);
  }
}

// Main execution
if (import.meta.url === `file://${process.argv[1]}`) {
  async function main() {
    try {
      const monitor = new SimpleMonitor();
      const metrics = await monitor.runSimpleBaseline();
      
      monitor.printReport(metrics);
      await monitor.saveMetrics(metrics);
      
    } catch (error) {
      console.error('❌ Simple baseline failed:', error);
      process.exit(1);
    }
  }
  
  main();
}