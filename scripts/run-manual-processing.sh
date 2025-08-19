#!/bin/bash

# Manual Processing Runner Script
# This script processes manuals through the chunking system

echo "🚀 Manual Processing Tool"
echo "========================"
echo ""
echo "This tool will process PDF manuals through the chunking system"
echo "to make them searchable by Barry the AI Mechanic."
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install it first."
    exit 1
fi

# Check if we're in the correct directory
if [ ! -f "package.json" ]; then
    echo "❌ Please run this script from the project root directory"
    exit 1
fi

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

echo ""
echo "Choose an option:"
echo "1. Process manuals with authentication (interactive)"
echo "2. List all manuals and their status"
echo "3. Process all unprocessed manuals (batch mode)"
echo ""
read -p "Enter your choice (1-3): " choice

case $choice in
    1)
        echo "Starting interactive manual processor..."
        node scripts/process-manual-auth.js
        ;;
    2)
        echo "Listing all manuals..."
        node scripts/list-manual-files.js
        ;;
    3)
        echo "Processing all unprocessed manuals..."
        node scripts/process-manuals-sequentially.js
        ;;
    *)
        echo "❌ Invalid choice"
        exit 1
        ;;
esac