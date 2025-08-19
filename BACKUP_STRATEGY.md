# Unimog Community Hub - Backup & Recovery Strategy
**Created**: January 19, 2025  
**Purpose**: Instant recovery from any breaking changes

## 🚨 Quick Recovery Commands (Copy & Paste)

### If Site Breaks - Immediate Recovery
```bash
# 1. Find last working backup
git branch -a | grep backup-working

# 2. Restore from specific backup (replace DATE)
git checkout backup-working-2025-01-19

# 3. Force restore if needed
git reset --hard backup-working-2025-01-19

# 4. Test locally
npm run dev

# 5. Push to staging when ready
git push staging HEAD:main --force
```

## 📋 Daily Backup Checklist

### Morning (Before Any Work)
- [ ] Create daily backup branch
- [ ] Test current site functionality
- [ ] Document current working features
- [ ] Note git commit hash

### Evening (After Work)
- [ ] Create end-of-day backup if changes made
- [ ] Test all critical features
- [ ] Push backup branch to origin
- [ ] Update backup log

## 🔧 Backup Implementation Scripts

### 1. Create Backup Script
Save as `scripts/backup.sh`:
```bash
#!/bin/bash
# Automated backup script for Unimog Community Hub

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Get current date and time
DATETIME=$(date +"%Y-%m-%d-%H%M")
DATE=$(date +"%Y-%m-%d")

# Function to create backup
create_backup() {
    echo -e "${YELLOW}Creating backup...${NC}"
    
    # Get current branch
    CURRENT_BRANCH=$(git branch --show-current)
    
    # Create backup branch name
    BACKUP_NAME="backup-working-${DATE}"
    BACKUP_DETAILED="backup-${DATETIME}-${1:-manual}"
    
    # Create main daily backup
    git branch -f $BACKUP_NAME HEAD
    echo -e "${GREEN}✓ Created daily backup: $BACKUP_NAME${NC}"
    
    # Create detailed timestamped backup
    git branch $BACKUP_DETAILED HEAD
    echo -e "${GREEN}✓ Created detailed backup: $BACKUP_DETAILED${NC}"
    
    # Push to origin
    echo -e "${YELLOW}Pushing backups to origin...${NC}"
    git push origin $BACKUP_NAME --force
    git push origin $BACKUP_DETAILED
    
    # Log the backup
    echo "$(date): Created backups $BACKUP_NAME and $BACKUP_DETAILED from $CURRENT_BRANCH" >> backup.log
    
    echo -e "${GREEN}✅ Backup complete!${NC}"
    echo -e "Recovery command: ${YELLOW}git checkout $BACKUP_NAME${NC}"
}

# Function to test site
test_site() {
    echo -e "${YELLOW}Testing site...${NC}"
    
    # Check if dev server is running
    if lsof -Pi :5173 -sTCP:LISTEN -t >/dev/null || lsof -Pi :5174 -sTCP:LISTEN -t >/dev/null ; then
        echo -e "${GREEN}✓ Dev server is running${NC}"
    else
        echo -e "${RED}✗ Dev server not running. Start with: npm run dev${NC}"
        return 1
    fi
    
    # Check for build errors
    npm run build --silent 2>/dev/null
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ Build successful${NC}"
    else
        echo -e "${RED}✗ Build failed! Site may be broken${NC}"
        return 1
    fi
    
    return 0
}

# Main execution
echo -e "${GREEN}=== Unimog Community Hub Backup System ===${NC}"

# Check git status
if [[ -n $(git status -s) ]]; then
    echo -e "${YELLOW}⚠ You have uncommitted changes${NC}"
    read -p "Commit changes before backup? (y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        git add -A
        git commit -m "Auto-commit before backup - ${DATETIME}"
    fi
fi

# Test site before backup
test_site
if [ $? -eq 0 ]; then
    create_backup $1
else
    echo -e "${RED}⚠ Site tests failed!${NC}"
    read -p "Create backup anyway? (y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        create_backup "with-errors"
    fi
fi
```

### 2. Create Recovery Script
Save as `scripts/recover.sh`:
```bash
#!/bin/bash
# Quick recovery script for Unimog Community Hub

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${GREEN}=== Unimog Community Hub Recovery System ===${NC}"

# List available backups
echo -e "${YELLOW}Available backups:${NC}"
git branch -a | grep backup | sed 's/^[ *]*//' | sort -r | head -10

echo ""
read -p "Enter backup name to restore (or press Enter for latest): " BACKUP

if [ -z "$BACKUP" ]; then
    # Get latest backup
    BACKUP=$(git branch -a | grep "backup-working" | sed 's/^[ *]*//' | sort -r | head -1)
fi

if [ -z "$BACKUP" ]; then
    echo -e "${RED}No backup found!${NC}"
    exit 1
fi

echo -e "${YELLOW}Restoring from: $BACKUP${NC}"

# Save current state
CURRENT=$(git rev-parse HEAD)
git branch backup-before-recovery-$(date +"%Y%m%d-%H%M%S") HEAD

# Restore
git checkout $BACKUP
if [ $? -ne 0 ]; then
    echo -e "${RED}Failed to checkout backup!${NC}"
    exit 1
fi

# Test
npm install
npm run dev &
DEV_PID=$!
sleep 5

if ps -p $DEV_PID > /dev/null; then
    echo -e "${GREEN}✅ Recovery successful!${NC}"
    echo -e "Dev server running on http://localhost:5173"
    echo -e "Press Ctrl+C to stop"
    wait $DEV_PID
else
    echo -e "${RED}Recovery test failed!${NC}"
fi
```

### 3. Automated Backup Service
Save as `scripts/auto-backup.js`:
```javascript
#!/usr/bin/env node

const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

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
```

## 🎯 Backup Strategy Tiers

### Tier 1: Immediate (Every Change)
- **Git Commits**: After every significant change
- **Branch Backups**: Before risky operations
- **Stash**: For temporary work

### Tier 2: Hourly (During Development)
- **Auto-save branches**: Every hour during active development
- **Tagged snapshots**: For milestone features
- **Test results**: Document what's working

### Tier 3: Daily
- **Morning backup**: Before starting work
- **Evening backup**: After completing work
- **Weekly archive**: Friday end-of-week backup

### Tier 4: Release
- **Pre-deployment**: Before pushing to production
- **Post-deployment**: After successful deployment
- **Version tags**: For each release

## 📁 Backup Naming Convention

```
backup-[type]-[date]-[time]-[description]

Types:
- working: Known good state
- auto: Automated backup
- manual: Manual backup
- release: Release version
- emergency: Before risky operation

Examples:
- backup-working-2025-01-19
- backup-auto-2025-01-19-1430-changes
- backup-manual-2025-01-19-before-big-refactor
- backup-release-v1.2.0
```

## 🔍 Pre-Change Verification Checklist

Before making ANY significant changes:

```bash
# 1. Check current status
git status
npm run dev  # Ensure it's working

# 2. Create safety backup
./scripts/backup.sh pre-change

# 3. Document current state
echo "Working features: Auth, Maps, Knowledge" >> backup.log

# 4. Create feature branch
git checkout -b feature/safe-changes

# 5. Make changes incrementally
# ... make small change ...
git add -p  # Review each change
git commit -m "Small incremental change"
npm run dev  # Test immediately

# 6. If something breaks
./scripts/recover.sh
```

## 🚑 Emergency Recovery Procedures

### Scenario 1: Site Won't Load
```bash
# Immediate recovery
git checkout backup-working-$(date +%Y-%m-%d)
npm install
npm run dev
```

### Scenario 2: Build Errors
```bash
# Check recent changes
git diff HEAD~1

# Revert last commit
git revert HEAD

# Or reset to backup
git reset --hard backup-working-$(date +%Y-%m-%d)
```

### Scenario 3: Database Issues
```bash
# Always backup database before changes
# Use Supabase dashboard to create backup
# Or use SQL backup:
pg_dump $DATABASE_URL > backup-$(date +%Y%m%d).sql
```

### Scenario 4: Production Emergency
```bash
# Immediate rollback
git checkout main
git reset --hard backup-working-latest
git push origin main --force

# Notify team
echo "Emergency rollback performed at $(date)" >> emergency.log
```

## 📊 Backup Monitoring Dashboard

Create `backup-status.html`:
```html
<!DOCTYPE html>
<html>
<head>
    <title>Backup Status Dashboard</title>
    <style>
        body { font-family: Arial; padding: 20px; }
        .backup { padding: 10px; margin: 5px; border: 1px solid #ccc; }
        .recent { background: #e7f5e7; }
        .old { background: #fff5e7; }
        .critical { background: #ffe7e7; }
    </style>
</head>
<body>
    <h1>Unimog Hub - Backup Status</h1>
    <div id="status"></div>
    <script>
        // This would connect to your backup monitoring
        fetch('/api/backup-status')
            .then(r => r.json())
            .then(data => {
                // Display backup status
            });
    </script>
</body>
</html>
```

## 🔐 Backup Security

### Encryption
```bash
# Encrypt sensitive backups
tar czf - backup-folder | openssl enc -aes-256-cbc -salt -out backup.tar.gz.enc

# Decrypt when needed
openssl enc -aes-256-cbc -d -in backup.tar.gz.enc | tar xzf -
```

### Offsite Backup
1. **GitHub**: All branches pushed to origin
2. **Local**: External drive backups weekly
3. **Cloud**: Automated sync to cloud storage
4. **Database**: Supabase automatic backups

## 📈 Backup Metrics to Track

- **Last Successful Backup**: Timestamp
- **Backup Frequency**: Backups per day
- **Recovery Time**: Time to restore
- **Backup Size**: Storage used
- **Test Restores**: Successful recovery tests

## 🎯 Key Performance Indicators

| Metric | Target | Current |
|--------|--------|---------|
| Backup Frequency | Every 4 hours | TBD |
| Recovery Time | < 5 minutes | TBD |
| Backup Success Rate | 100% | TBD |
| Storage Used | < 5GB | TBD |
| Test Restores/Month | 4 | TBD |

## 📝 Backup Log Template

```markdown
## Backup Log Entry
**Date**: 2025-01-19
**Time**: 14:30
**Type**: Manual
**Branch**: backup-working-2025-01-19
**Commit**: 8be7182
**Status**: Success
**Features Working**: 
- ✅ Authentication
- ✅ Knowledge/Manuals
- ✅ Barry AI
- ✅ Maps
- ✅ Marketplace
**Notes**: Full restoration from earlier issue
**Recovery Tested**: Yes
```

## 🚀 Quick Start Tomorrow Morning

```bash
# 1. Create morning backup
./scripts/backup.sh morning

# 2. Start auto-backup service
node scripts/auto-backup.js &

# 3. Start development
npm run dev

# 4. Create pre-work snapshot
git checkout -b work-$(date +%Y%m%d)

# You're protected and ready to code!
```

## 💡 Golden Rules

1. **Never work on main branch directly**
2. **Always test locally before pushing**
3. **Create backup before any major change**
4. **Test recovery process weekly**
5. **Document what's working in each backup**
6. **Keep last 7 daily backups minimum**
7. **Tag important milestones**

## 🆘 Support Contacts

- **Developer**: Thabonel
- **Email**: thabonel0@gmail.com
- **Emergency Recovery**: `./scripts/recover.sh`
- **Last Known Good**: backup-working-2025-01-19

---

*This backup strategy ensures you can recover from any breaking change within 5 minutes. Implement these procedures to maintain site stability and developer confidence.*

**Remember**: The best backup is the one you just tested!