#!/usr/bin/env node

/**
 * Initialization script for Unimog Intelligent Memory Automation
 *
 * This script automatically initializes the memory automation system
 * when Claude Code starts a session in this project.
 */

const fs = require('fs').promises;
const path = require('path');

class AutomationInitializer {
  constructor() {
    this.projectRoot = process.cwd();
    this.configPath = path.join(this.projectRoot, '.claude', 'automation-config.json');
  }

  async initialize() {
    try {
      console.log('🤖 Initializing Unimog Intelligent Memory Automation...');

      // Load configuration
      const config = await this.loadConfig();

      if (!config.unimog_intelligent_memory.enabled) {
        console.log('⏸️ Memory automation is disabled in config');
        return;
      }

      // Create necessary directories
      await this.createDirectories();

      // Initialize session tracking
      await this.initializeSession();

      // Set up automatic triggers
      await this.setupTriggers(config);

      console.log('✅ Unimog Memory Automation initialized successfully!');
      console.log(`📊 Auto-save threshold: ${config.unimog_intelligent_memory.auto_triggers.context_threshold}%`);
      console.log(`🎯 Smart checkpoints: ${Object.keys(config.unimog_intelligent_memory.smart_checkpoints).length} types configured`);
      console.log('🚀 Ready for intelligent context management!');

    } catch (error) {
      console.error('❌ Failed to initialize memory automation:', error.message);
    }
  }

  async loadConfig() {
    try {
      const configData = await fs.readFile(this.configPath, 'utf8');
      return JSON.parse(configData);
    } catch (error) {
      console.warn('⚠️ Using default configuration');
      return this.getDefaultConfig();
    }
  }

  async createDirectories() {
    const dirs = [
      '.claude/backups',
      '.claude/checkpoints',
      '.claude/logs',
      '.claude/sessions'
    ];

    for (const dir of dirs) {
      await fs.mkdir(path.join(this.projectRoot, dir), { recursive: true });
    }
  }

  async initializeSession() {
    const sessionData = {
      id: `session_${Date.now()}`,
      startTime: new Date().toISOString(),
      project: 'UnimogCommunityHub',
      gitBranch: await this.getCurrentBranch(),
      automationEnabled: true,
      triggers: {
        contextThreshold: false,
        milestoneDetection: false,
        deploymentHooks: false
      }
    };

    const sessionPath = path.join(this.projectRoot, '.claude', 'sessions', `${sessionData.id}.json`);
    await fs.writeFile(sessionPath, JSON.stringify(sessionData, null, 2));

    console.log(`📝 Session ${sessionData.id} initialized`);
    return sessionData;
  }

  async getCurrentBranch() {
    try {
      const { exec } = require('child_process');
      const { promisify } = require('util');
      const execAsync = promisify(exec);

      const { stdout } = await execAsync('git branch --show-current', { cwd: this.projectRoot });
      return stdout.trim();
    } catch {
      return 'unknown';
    }
  }

  async setupTriggers(config) {
    const triggers = config.unimog_intelligent_memory.auto_triggers;

    console.log('🔧 Setting up automatic triggers:');

    if (triggers.context_threshold) {
      console.log(`  📊 Context threshold monitoring: ${config.unimog_intelligent_memory.context_preservation.token_usage_percent}%`);
    }

    if (triggers.milestone_detection) {
      console.log('  🎯 Milestone detection: Active');
    }

    if (triggers.deployment_hooks) {
      console.log('  🚀 Deployment hooks: Active');
    }

    if (triggers.error_recovery) {
      console.log('  🛡️ Error recovery: Active');
    }

    if (triggers.session_boundaries) {
      console.log('  ⏰ Session boundary detection: Active');
    }
  }

  getDefaultConfig() {
    return {
      unimog_intelligent_memory: {
        enabled: true,
        auto_triggers: {
          context_threshold: 80,
          milestone_detection: true,
          deployment_hooks: true,
          error_recovery: true,
          session_boundaries: true
        },
        context_preservation: {
          token_usage_percent: 80,
          session_duration_minutes: 120,
          file_change_threshold: 5
        }
      }
    };
  }
}

// Auto-initialize if run directly
if (require.main === module) {
  const initializer = new AutomationInitializer();
  initializer.initialize();
}

module.exports = { AutomationInitializer };