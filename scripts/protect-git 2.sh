#!/bin/bash
# Git Protection Script - Prevents Codespaces conflicts
# Add this to your .bashrc or .zshrc to run automatically

# Check if we're in Codespaces
if [ -n "$CODESPACES" ]; then
    echo "⚠️  Running in GitHub Codespaces environment"
    echo "📝 Setting Codespaces-specific git config..."
    
    # Disable problematic git features in Codespaces
    git config core.preloadindex false
    git config core.fscache false
    git config core.untrackedCache false
    
    # Use simple push mode
    git config push.default simple
    
    # Disable auto-gc in Codespaces
    git config gc.auto 0
else
    echo "✅ Running in local environment"
fi

# Function to clean git locks
clean_git_locks() {
    echo "🧹 Cleaning git locks..."
    find .git -name "*.lock" -delete 2>/dev/null
    echo "✅ Git locks cleaned"
}

# Function to check git health
check_git_health() {
    echo "🔍 Checking git repository health..."
    
    # Check for lock files
    if find .git -name "*.lock" 2>/dev/null | grep -q .; then
        echo "⚠️  Found git lock files - cleaning..."
        clean_git_locks
    else
        echo "✅ No lock files found"
    fi
    
    # Kill any stuck git processes
    if pgrep -f "git" > /dev/null; then
        echo "⚠️  Found running git processes"
        echo "   Run 'killall git' if you experience issues"
    fi
    
    # Check git status
    if git status --porcelain &>/dev/null; then
        echo "✅ Git repository is healthy"
    else
        echo "❌ Git repository may have issues"
    fi
}

# Run health check
check_git_health

# Export functions for use
export -f clean_git_locks
export -f check_git_health