# Safe Codespaces Workflow

## Best Practices to Prevent Git Corruption

### Option 1: Separate Environments (Recommended)

```bash
# Local Development
git checkout -b local/feature-name
# Do all work locally
git push origin local/feature-name

# Codespaces Development
git checkout -b codespace/feature-name
# Do all work in Codespaces
git push origin codespace/feature-name
```

### Option 2: Sequential Development

1. **Finish all Codespaces work first**
   - Complete your work in Codespaces
   - Push all changes
   - Close Codespaces completely

2. **Wait 5 minutes** (let GitHub sync)

3. **Pull fresh on local**
   ```bash
   git pull origin main
   git checkout -b new-feature
   ```

### Option 3: Use Protection Script

Before starting work, always run:
```bash
source scripts/protect-git.sh
```

## Warning Signs of Corruption

- Git commands hanging/timing out
- "index.lock" errors that persist
- "fatal: Unable to create" errors
- Git status takes forever

## Quick Recovery

If corruption happens:
```bash
# 1. Kill all git processes
killall git

# 2. Clean locks
rm -f .git/index.lock
rm -f .git/*.lock

# 3. Reset git index
rm -f .git/index
git reset --mixed

# 4. If still broken, use recovery script
bash scripts/protect-git.sh
```

## Prevention Checklist

- [ ] Never use Codespaces + local on same branch
- [ ] Always pull before starting local work
- [ ] Close Codespaces when switching to local
- [ ] Run protect-git.sh regularly
- [ ] Use separate branches for each environment

## GitHub Settings

1. Go to: Settings → Codespaces
2. Disable "Automatically sync changes"
3. Set default retention to 3 days (not 30)

## Git Config for Safety

Add to ~/.gitconfig:
```ini
[core]
    preloadindex = false  # Prevent index corruption
    fscache = false       # Disable file system cache
[codespaces]
    autoSync = false      # Disable auto-sync
```