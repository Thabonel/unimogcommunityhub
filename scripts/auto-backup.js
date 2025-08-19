#!/usr/bin/env node

import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const BACKUP_INTERVAL = 4 * 60 * 60 * 1000; // 4 hours
const BACKUP_ON_CHANGE = true;
const WATCH_PATHS = ['src', 'public', 'package.json'];
const MAX_BACKUPS = 50; // Keep last 50 backups

class AutoBackup {
  constructor() {
    this.lastBackup = Date.now();
    this.changesSinceBackup = 0;
  }

  async createBackup(reason = 'auto') {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const branchName = `backup-auto-${timestamp}-${reason}`;
    
    console.log(`🔄 Creating backup: ${branchName}`);
    
    return new Promise((resolve, reject) => {
      exec(`git branch ${branchName} HEAD`, (error) => {
        if (error) {
          console.error('❌ Backup failed:', error);
          reject(error);
        } else {
          console.log('✅ Backup created successfully');
          this.lastBackup = Date.now();
          this.changesSinceBackup = 0;
          this.cleanOldBackups();
          resolve(branchName);
        }
      });
    });
  }

  async cleanOldBackups() {
    exec('git branch | grep backup-auto', (error, stdout) => {
      if (!error && stdout) {
        const backups = stdout.split('\n').filter(b => b.trim());
        if (backups.length > MAX_BACKUPS) {
          const toDelete = backups.slice(0, backups.length - MAX_BACKUPS);
          toDelete.forEach(branch => {
            exec(`git branch -D ${branch.trim()}`, () => {});
          });
          console.log(`🗑️  Cleaned ${toDelete.length} old backups`);
        }
      }
    });
  }

  watchForChanges() {
    if (!BACKUP_ON_CHANGE) return;

    WATCH_PATHS.forEach(watchPath => {
      const fullPath = path.join(process.cwd(), watchPath);
      if (fs.existsSync(fullPath)) {
        fs.watch(fullPath, { recursive: true }, (eventType, filename) => {
          if (filename && !filename.includes('.git')) {
            this.changesSinceBackup++;
            
            // Backup after 20 changes
            if (this.changesSinceBackup >= 20) {
              this.createBackup('changes');
            }
          }
        });
      }
    });
    
    console.log('👀 Watching for changes...');
  }

  startIntervalBackup() {
    setInterval(() => {
      if (this.changesSinceBackup > 0) {
        this.createBackup('interval');
      }
    }, BACKUP_INTERVAL);
    
    console.log(`⏰ Interval backup every ${BACKUP_INTERVAL / 1000 / 60} minutes`);
  }

  start() {
    console.log('🚀 Auto-backup service started');
    this.watchForChanges();
    this.startIntervalBackup();
    
    // Initial backup
    this.createBackup('startup');
    
    // Handle shutdown
    process.on('SIGINT', () => {
      console.log('\n📦 Creating final backup before exit...');
      this.createBackup('shutdown').then(() => {
        process.exit(0);
      });
    });
  }
}

// Start the service
const autoBackup = new AutoBackup();
autoBackup.start();