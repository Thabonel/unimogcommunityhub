#!/usr/bin/env npx tsx

/**
 * Barry AI Cache Monitoring Dashboard
 * Real-time monitoring of cache performance
 */

import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface CacheStats {
  hits: number;
  misses: number;
  errors: number;
  bypassed: number;
  hitRate: string;
}

interface HealthResponse {
  status: string;
  timestamp: string;
  cache: {
    type: string;
    stats: CacheStats;
  };
  version?: string;
}

class CacheMonitor {
  private healthEndpoint: string;
  private monitoringInterval: number;
  
  constructor(supabaseUrl: string, intervalMs: number = 30000) {
    this.healthEndpoint = `${supabaseUrl}/functions/v1/chat-with-barry-cached/health`;
    this.monitoringInterval = intervalMs;
  }
  
  async fetchCacheStats(): Promise<HealthResponse | null> {
    try {
      const fetch = (await import('node-fetch')).default;
      const response = await fetch(this.healthEndpoint);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      return await response.json() as HealthResponse;
    } catch (error) {
      console.error(`❌ Failed to fetch cache stats: ${error.message}`);
      return null;
    }
  }
  
  displayStats(stats: HealthResponse): void {
    const now = new Date().toLocaleTimeString();
    
    console.clear();
    console.log('🔍 Barry AI Cache Monitoring Dashboard');
    console.log('=====================================');
    console.log(`📊 Last Updated: ${now}`);
    console.log(`🏥 System Status: ${stats.status}`);
    console.log(`⚡ Cache Type: ${stats.cache.type}`);
    console.log('');
    
    const cacheStats = stats.cache.stats;
    const total = cacheStats.hits + cacheStats.misses;
    
    console.log('📈 Cache Performance:');
    console.log(`   Cache Hits:    ${cacheStats.hits.toString().padStart(6)}`);
    console.log(`   Cache Misses:  ${cacheStats.misses.toString().padStart(6)}`);
    console.log(`   Total Queries: ${total.toString().padStart(6)}`);
    console.log(`   Hit Rate:      ${cacheStats.hitRate.padStart(8)}`);
    console.log('');
    
    if (cacheStats.errors > 0) {
      console.log(`⚠️  Cache Errors:  ${cacheStats.errors}`);
    }
    
    if (cacheStats.bypassed > 0) {
      console.log(`🚫 Cache Bypassed: ${cacheStats.bypassed}`);
    }
    
    // Performance assessment
    const hitRate = parseFloat(cacheStats.hitRate.replace('%', ''));
    let performance = '';
    let emoji = '';
    
    if (hitRate >= 70) {
      performance = 'Excellent';
      emoji = '🟢';
    } else if (hitRate >= 50) {
      performance = 'Good';
      emoji = '🟡';
    } else if (hitRate >= 20) {
      performance = 'Poor';
      emoji = '🟠';
    } else {
      performance = 'Very Poor';
      emoji = '🔴';
    }
    
    console.log(`${emoji} Performance: ${performance} (${hitRate}% hit rate)`);
    
    if (total > 0) {
      console.log('');
      console.log('💡 Recommendations:');
      
      if (hitRate < 30) {
        console.log('   • Cache hit rate is low - check query patterns');
        console.log('   • Consider increasing TTL values');
      } else if (hitRate > 80) {
        console.log('   • Excellent cache performance!');
        console.log('   • Consider monitoring memory usage');
      }
      
      if (cacheStats.errors > total * 0.05) {
        console.log('   • High error rate - check function logs');
      }
      
      if (cacheStats.bypassed > total * 0.1) {
        console.log('   • High bypass rate - check X-Skip-Cache usage');
      }
    }
    
    console.log('');
    console.log('🔄 Auto-refreshing every 30 seconds... (Ctrl+C to stop)');
  }
  
  async startMonitoring(): Promise<void> {
    console.log('🚀 Starting Barry AI Cache Monitoring...');
    
    // Initial fetch
    const initialStats = await this.fetchCacheStats();
    if (initialStats) {
      this.displayStats(initialStats);
    } else {
      console.log('❌ Failed to connect to cache health endpoint');
      console.log(`   Endpoint: ${this.healthEndpoint}`);
      return;
    }
    
    // Set up periodic monitoring
    setInterval(async () => {
      const stats = await this.fetchCacheStats();
      if (stats) {
        this.displayStats(stats);
      }
    }, this.monitoringInterval);
  }
  
  async singleCheck(): Promise<void> {
    console.log('🔍 Barry AI Cache Single Check');
    console.log('==============================');
    
    const stats = await this.fetchCacheStats();
    if (stats) {
      this.displayStats(stats);
      
      // Save stats to file
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const fs = await import('fs/promises');
      const statsFile = path.join(__dirname, `cache_stats_${timestamp}.json`);
      
      await fs.writeFile(statsFile, JSON.stringify(stats, null, 2));
      console.log(`📁 Stats saved to: ${statsFile}`);
    } else {
      console.log('❌ Failed to fetch cache statistics');
      process.exit(1);
    }
  }
}

// CLI interface
async function main() {
  const args = process.argv.slice(2);
  const command = args[0];
  
  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  if (!supabaseUrl) {
    console.error('❌ VITE_SUPABASE_URL environment variable is required');
    process.exit(1);
  }
  
  const monitor = new CacheMonitor(supabaseUrl);
  
  try {
    switch (command) {
      case 'watch':
      case 'monitor':
        await monitor.startMonitoring();
        break;
        
      case 'check':
      case 'status':
      default:
        await monitor.singleCheck();
        break;
    }
  } catch (error) {
    console.error('💥 Monitoring failed:', error.message);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\\n👋 Cache monitoring stopped');
  process.exit(0);
});

// Export for programmatic use
export { CacheMonitor };

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}