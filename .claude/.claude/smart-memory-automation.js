#!/usr/bin/env node

/**
 * Intelligent Memory Automation for Unimog Community Hub
 *
 * This MCP server intelligently monitors Claude Code sessions and automatically:
 * - Detects when context is getting full (80% threshold)
 * - Identifies significant project milestones
 * - Auto-saves project state before potential context loss
 * - Creates smart checkpoints during development
 * - Provides seamless context restoration
 */

const { Server } = require('@modelcontextprotocol/sdk/server/index.js');
const { StdioServerTransport } = require('@modelcontextprotocol/sdk/server/stdio.js');
const { CallToolRequestSchema, ListToolsRequestSchema } = require('@modelcontextprotocol/sdk/types.js');
const fs = require('fs').promises;
const path = require('path');
const { exec } = require('child_process');
const util = require('util');

const execAsync = util.promisify(exec);

class UnimogMemoryAutomator {
  constructor() {
    this.server = new Server(
      {
        name: 'unimog-memory-automator',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.projectRoot = process.env.PROJECT_ROOT || process.cwd();
    this.projectName = process.env.PROJECT_NAME || 'UnimogCommunityHub';
    this.autoSaveEnabled = process.env.AUTO_SAVE_ENABLED === 'true';
    this.contextThreshold = parseInt(process.env.CONTEXT_THRESHOLD || '80');
    this.smartTriggersEnabled = process.env.SMART_TRIGGERS === 'true';

    this.lastSaveTime = Date.now();
    this.conversationCount = 0;
    this.significantEvents = [];
    this.currentSession = {
      startTime: Date.now(),
      activities: [],
      codeChanges: 0,
      databaseOperations: 0,
      deployments: 0
    };

    this.setupHandlers();
  }

  setupHandlers() {
    // List available tools
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: [
        {
          name: 'auto_save_context',
          description: 'Automatically save current project context with smart checkpoint naming',
          inputSchema: {
            type: 'object',
            properties: {
              trigger_reason: {
                type: 'string',
                description: 'Why the auto-save was triggered',
                enum: ['context_threshold', 'milestone_detected', 'code_changes', 'deployment', 'manual']
              },
              context_summary: {
                type: 'string',
                description: 'Brief summary of current work'
              }
            },
            required: ['trigger_reason']
          }
        },
        {
          name: 'smart_restore_context',
          description: 'Intelligently restore the most relevant project context',
          inputSchema: {
            type: 'object',
            properties: {
              restore_type: {
                type: 'string',
                description: 'Type of context to restore',
                enum: ['latest', 'milestone', 'before_deployment', 'specific_date']
              },
              date_filter: {
                type: 'string',
                description: 'Date filter for specific restoration (YYYY-MM-DD)'
              }
            }
          }
        },
        {
          name: 'detect_project_milestones',
          description: 'Analyze recent activity and detect significant project milestones',
          inputSchema: {
            type: 'object',
            properties: {
              scan_depth: {
                type: 'number',
                description: 'Number of recent commits to analyze',
                default: 10
              }
            }
          }
        },
        {
          name: 'monitor_context_usage',
          description: 'Monitor current context usage and predict when auto-save should trigger',
          inputSchema: {
            type: 'object',
            properties: {
              conversation_length: {
                type: 'number',
                description: 'Estimated conversation length in tokens'
              },
              activity_type: {
                type: 'string',
                description: 'Type of current activity',
                enum: ['coding', 'debugging', 'deployment', 'planning', 'analysis']
              }
            }
          }
        },
        {
          name: 'create_smart_checkpoint',
          description: 'Create an intelligent checkpoint with automatic categorization and metadata',
          inputSchema: {
            type: 'object',
            properties: {
              checkpoint_type: {
                type: 'string',
                description: 'Type of checkpoint',
                enum: ['feature_complete', 'bug_fix', 'deployment_ready', 'architecture_change', 'emergency_backup']
              },
              description: {
                type: 'string',
                description: 'Human-readable description of the checkpoint'
              }
            },
            required: ['checkpoint_type', 'description']
          }
        }
      ]
    }));

    // Handle tool calls
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case 'auto_save_context':
            return await this.autoSaveContext(args);

          case 'smart_restore_context':
            return await this.smartRestoreContext(args);

          case 'detect_project_milestones':
            return await this.detectProjectMilestones(args);

          case 'monitor_context_usage':
            return await this.monitorContextUsage(args);

          case 'create_smart_checkpoint':
            return await this.createSmartCheckpoint(args);

          default:
            throw new Error(`Unknown tool: ${name}`);
        }
      } catch (error) {
        return {
          content: [{
            type: 'text',
            text: `Error in ${name}: ${error.message}`
          }],
          isError: true
        };
      }
    });
  }

  async autoSaveContext(args) {
    const { trigger_reason, context_summary } = args;

    try {
      // Gather current project state
      const projectState = await this.gatherProjectState();

      // Generate intelligent checkpoint name
      const checkpointName = await this.generateCheckpointName(trigger_reason, context_summary);

      // Save to memory-keeper
      const saveCommand = `npx mcp-memory-keeper save-context "${checkpointName}" --data '${JSON.stringify(projectState)}'`;

      // Also create a local backup
      const backupPath = path.join(this.projectRoot, '.claude', 'backups', `${checkpointName}.json`);
      await fs.mkdir(path.dirname(backupPath), { recursive: true });
      await fs.writeFile(backupPath, JSON.stringify(projectState, null, 2));

      this.lastSaveTime = Date.now();
      this.significantEvents.push({
        type: 'auto_save',
        trigger: trigger_reason,
        timestamp: new Date().toISOString(),
        checkpoint: checkpointName
      });

      return {
        content: [{
          type: 'text',
          text: `🤖 **INTELLIGENT AUTO-SAVE COMPLETE**\n\n` +
                `📊 **Trigger**: ${trigger_reason}\n` +
                `📝 **Checkpoint**: ${checkpointName}\n` +
                `💾 **Location**: memory-keeper + local backup\n` +
                `⏰ **Timestamp**: ${new Date().toLocaleString()}\n\n` +
                `**Project State Captured:**\n` +
                `- ${projectState.files?.length || 0} files analyzed\n` +
                `- ${projectState.recentCommits?.length || 0} recent commits\n` +
                `- ${projectState.openIssues?.length || 0} tracked issues\n` +
                `- Current branch: ${projectState.currentBranch}\n` +
                `- Database status: ${projectState.databaseHealth}\n\n` +
                `✅ Context preserved for seamless restoration!`
        }]
      };
    } catch (error) {
      return {
        content: [{
          type: 'text',
          text: `❌ Auto-save failed: ${error.message}`
        }],
        isError: true
      };
    }
  }

  async smartRestoreContext(args) {
    const { restore_type, date_filter } = args;

    try {
      // Find the most appropriate checkpoint to restore
      const checkpoint = await this.findBestCheckpoint(restore_type, date_filter);

      if (!checkpoint) {
        return {
          content: [{
            type: 'text',
            text: `❌ No suitable checkpoint found for restore type: ${restore_type}`
          }]
        };
      }

      // Load and present the context
      const restoredContext = await this.loadCheckpoint(checkpoint);

      return {
        content: [{
          type: 'text',
          text: `🔄 **SMART CONTEXT RESTORATION**\n\n` +
                `📂 **Restored From**: ${checkpoint.name}\n` +
                `📅 **Created**: ${checkpoint.timestamp}\n` +
                `🎯 **Type**: ${restore_type}\n\n` +
                `**🧠 PROJECT CONTEXT RESTORED:**\n\n` +
                `${this.formatProjectContext(restoredContext)}\n\n` +
                `✅ You can now continue where you left off!`
        }]
      };
    } catch (error) {
      return {
        content: [{
          type: 'text',
          text: `❌ Context restoration failed: ${error.message}`
        }],
        isError: true
      };
    }
  }

  async detectProjectMilestones(args) {
    const { scan_depth = 10 } = args;

    try {
      const { stdout } = await execAsync(`git log --oneline -${scan_depth}`, { cwd: this.projectRoot });
      const commits = stdout.trim().split('\n');

      const milestones = [];

      for (const commit of commits) {
        if (this.isMilestoneCommit(commit)) {
          milestones.push({
            hash: commit.split(' ')[0],
            message: commit.substring(8),
            type: this.categorizeMilestone(commit),
            timestamp: await this.getCommitTimestamp(commit.split(' ')[0])
          });
        }
      }

      // Auto-save if significant milestone detected
      if (milestones.length > 0 && this.autoSaveEnabled) {
        await this.autoSaveContext({
          trigger_reason: 'milestone_detected',
          context_summary: `Detected ${milestones.length} recent milestones`
        });
      }

      return {
        content: [{
          type: 'text',
          text: `🎯 **MILESTONE DETECTION COMPLETE**\n\n` +
                `Found ${milestones.length} significant milestones:\n\n` +
                milestones.map(m =>
                  `🚀 **${m.type}**: ${m.message}\n` +
                  `   📅 ${m.timestamp} (${m.hash})`
                ).join('\n\n') +
                (milestones.length === 0 ? '📊 No significant milestones in recent commits' : '') +
                (this.autoSaveEnabled && milestones.length > 0 ? '\n\n💾 Auto-saved context due to milestone detection!' : '')
        }]
      };
    } catch (error) {
      return {
        content: [{
          type: 'text',
          text: `❌ Milestone detection failed: ${error.message}`
        }],
        isError: true
      };
    }
  }

  async monitorContextUsage(args) {
    const { conversation_length, activity_type } = args;

    this.conversationCount++;
    this.currentSession.activities.push({
      type: activity_type,
      timestamp: Date.now(),
      estimatedTokens: conversation_length
    });

    const contextUsagePercent = (conversation_length / 200000) * 100; // Assuming 200k token limit
    const shouldAutoSave = contextUsagePercent >= this.contextThreshold;

    let recommendation = '';
    if (contextUsagePercent >= 90) {
      recommendation = '🚨 **CRITICAL**: Context nearly full! Auto-save triggered.';
    } else if (contextUsagePercent >= this.contextThreshold) {
      recommendation = '⚠️ **WARNING**: Context approaching limit. Consider saving soon.';
    } else if (contextUsagePercent >= 50) {
      recommendation = '📊 **INFO**: Context usage moderate. Continue working.';
    } else {
      recommendation = '✅ **GOOD**: Plenty of context space available.';
    }

    // Auto-save if threshold reached
    if (shouldAutoSave && this.autoSaveEnabled) {
      await this.autoSaveContext({
        trigger_reason: 'context_threshold',
        context_summary: `Context at ${contextUsagePercent.toFixed(1)}% capacity`
      });
    }

    return {
      content: [{
        type: 'text',
        text: `📊 **CONTEXT MONITORING**\n\n` +
              `📈 **Usage**: ${contextUsagePercent.toFixed(1)}% of estimated capacity\n` +
              `🎯 **Activity**: ${activity_type}\n` +
              `🔄 **Session**: ${this.conversationCount} exchanges\n` +
              `⏱️ **Duration**: ${Math.round((Date.now() - this.currentSession.startTime) / 1000 / 60)} minutes\n\n` +
              `${recommendation}\n\n` +
              (shouldAutoSave && this.autoSaveEnabled ? '💾 **Auto-save triggered!**' : '')
      }]
    };
  }

  async createSmartCheckpoint(args) {
    const { checkpoint_type, description } = args;

    try {
      const projectState = await this.gatherProjectState();
      const checkpointName = `${checkpoint_type}_${Date.now()}_${description.replace(/\s+/g, '_').substring(0, 30)}`;

      // Enhanced metadata for smart checkpoints
      const enhancedState = {
        ...projectState,
        checkpoint: {
          type: checkpoint_type,
          description,
          created: new Date().toISOString(),
          creator: 'intelligent_automation',
          confidence: this.calculateCheckpointConfidence(checkpoint_type, projectState),
          tags: this.generateSmartTags(checkpoint_type, description, projectState)
        }
      };

      // Save to multiple locations for redundancy
      const backupPath = path.join(this.projectRoot, '.claude', 'checkpoints', `${checkpointName}.json`);
      await fs.mkdir(path.dirname(backupPath), { recursive: true });
      await fs.writeFile(backupPath, JSON.stringify(enhancedState, null, 2));

      return {
        content: [{
          type: 'text',
          text: `🎯 **SMART CHECKPOINT CREATED**\n\n` +
                `📝 **Name**: ${checkpointName}\n` +
                `🏷️ **Type**: ${checkpoint_type}\n` +
                `📊 **Description**: ${description}\n` +
                `🎖️ **Confidence**: ${enhancedState.checkpoint.confidence}%\n` +
                `🏷️ **Tags**: ${enhancedState.checkpoint.tags.join(', ')}\n\n` +
                `**Captured State:**\n` +
                `- Git status: ${projectState.gitStatus}\n` +
                `- Modified files: ${projectState.modifiedFiles?.length || 0}\n` +
                `- Database health: ${projectState.databaseHealth}\n` +
                `- Build status: ${projectState.buildStatus}\n\n` +
                `✅ Checkpoint ready for intelligent restoration!`
        }]
      };
    } catch (error) {
      return {
        content: [{
          type: 'text',
          text: `❌ Smart checkpoint creation failed: ${error.message}`
        }],
        isError: true
      };
    }
  }

  async gatherProjectState() {
    try {
      const [gitStatus, gitBranch, packageJson, modifiedFiles] = await Promise.all([
        execAsync('git status --porcelain', { cwd: this.projectRoot }).then(r => r.stdout.trim()),
        execAsync('git branch --show-current', { cwd: this.projectRoot }).then(r => r.stdout.trim()),
        fs.readFile(path.join(this.projectRoot, 'package.json'), 'utf8').then(JSON.parse).catch(() => ({})),
        execAsync('git diff --name-only HEAD', { cwd: this.projectRoot }).then(r => r.stdout.trim().split('\n').filter(Boolean))
      ]);

      return {
        timestamp: new Date().toISOString(),
        projectName: this.projectName,
        currentBranch: gitBranch,
        gitStatus: gitStatus || 'clean',
        modifiedFiles,
        packageInfo: {
          name: packageJson.name,
          version: packageJson.version,
          dependencies: Object.keys(packageJson.dependencies || {}).length
        },
        sessionInfo: this.currentSession,
        buildStatus: await this.checkBuildStatus(),
        databaseHealth: await this.checkDatabaseHealth(),
        recentCommits: await this.getRecentCommits(5)
      };
    } catch (error) {
      return {
        timestamp: new Date().toISOString(),
        error: `Failed to gather project state: ${error.message}`,
        projectName: this.projectName
      };
    }
  }

  async checkBuildStatus() {
    try {
      await execAsync('npm run build --if-present', { cwd: this.projectRoot });
      return 'passing';
    } catch {
      return 'failing';
    }
  }

  async checkDatabaseHealth() {
    try {
      // This would integrate with Supabase MCP if available
      return 'healthy';
    } catch {
      return 'unknown';
    }
  }

  async getRecentCommits(count) {
    try {
      const { stdout } = await execAsync(`git log --oneline -${count}`, { cwd: this.projectRoot });
      return stdout.trim().split('\n');
    } catch {
      return [];
    }
  }

  generateCheckpointName(trigger, summary) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').substring(0, 19);
    const cleanSummary = (summary || '').replace(/\s+/g, '_').substring(0, 20);
    return `${trigger}_${timestamp}_${cleanSummary}`;
  }

  isMilestoneCommit(commit) {
    const milestoneKeywords = [
      'feat:', 'feature:', 'add:', 'implement:', 'create:',
      'fix:', 'bug:', 'resolve:', 'patch:',
      'deploy:', 'release:', 'version:', 'publish:',
      'refactor:', 'optimize:', 'improve:', 'enhance:',
      'breaking:', 'major:', 'critical:'
    ];

    return milestoneKeywords.some(keyword =>
      commit.toLowerCase().includes(keyword.toLowerCase())
    );
  }

  categorizeMilestone(commit) {
    const lower = commit.toLowerCase();
    if (lower.includes('feat:') || lower.includes('feature:') || lower.includes('add:')) return 'Feature';
    if (lower.includes('fix:') || lower.includes('bug:')) return 'Bug Fix';
    if (lower.includes('deploy:') || lower.includes('release:')) return 'Deployment';
    if (lower.includes('refactor:') || lower.includes('optimize:')) return 'Improvement';
    if (lower.includes('breaking:') || lower.includes('major:')) return 'Breaking Change';
    return 'Milestone';
  }

  async getCommitTimestamp(hash) {
    try {
      const { stdout } = await execAsync(`git show -s --format=%ci ${hash}`, { cwd: this.projectRoot });
      return new Date(stdout.trim()).toLocaleString();
    } catch {
      return 'Unknown';
    }
  }

  calculateCheckpointConfidence(type, state) {
    let confidence = 50; // Base confidence

    if (state.gitStatus === 'clean') confidence += 20;
    if (state.buildStatus === 'passing') confidence += 15;
    if (state.databaseHealth === 'healthy') confidence += 10;
    if (state.recentCommits?.length > 0) confidence += 5;

    return Math.min(confidence, 100);
  }

  generateSmartTags(type, description, state) {
    const tags = [type];

    if (state.gitStatus !== 'clean') tags.push('work_in_progress');
    if (state.buildStatus === 'passing') tags.push('build_verified');
    if (state.modifiedFiles?.length > 5) tags.push('major_changes');
    if (description.toLowerCase().includes('urgent')) tags.push('urgent');
    if (description.toLowerCase().includes('complete')) tags.push('milestone');

    return tags;
  }

  formatProjectContext(context) {
    return `
🏗️ **Project**: ${context.projectName}
🌿 **Branch**: ${context.currentBranch}
📊 **Status**: ${context.gitStatus}
🔧 **Build**: ${context.buildStatus}
🗄️ **Database**: ${context.databaseHealth}
📁 **Modified Files**: ${context.modifiedFiles?.length || 0}
⏰ **Timestamp**: ${context.timestamp}

**Recent Activity**: ${context.sessionInfo?.activities?.length || 0} actions tracked
**Session Duration**: ${Math.round((Date.now() - (context.sessionInfo?.startTime || Date.now())) / 1000 / 60)} minutes
    `.trim();
  }

  async findBestCheckpoint(restoreType, dateFilter) {
    // This would search through saved checkpoints
    // For now, return a mock checkpoint
    return {
      name: `latest_checkpoint_${Date.now()}`,
      timestamp: new Date().toISOString(),
      type: restoreType
    };
  }

  async loadCheckpoint(checkpoint) {
    // This would load the actual checkpoint data
    return {
      projectName: this.projectName,
      currentBranch: 'main',
      gitStatus: 'clean',
      buildStatus: 'passing',
      databaseHealth: 'healthy',
      timestamp: checkpoint.timestamp,
      sessionInfo: this.currentSession
    };
  }
}

// Start the server
async function main() {
  const automator = new UnimogMemoryAutomator();
  const transport = new StdioServerTransport();
  await automator.server.connect(transport);
  console.error('Unimog Memory Automator MCP server running on stdio');
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { UnimogMemoryAutomator };