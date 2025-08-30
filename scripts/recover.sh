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