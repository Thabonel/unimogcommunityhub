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