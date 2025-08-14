#!/bin/bash

# AI Development Agents Installation Script
# For UnimogCommunityHub Development Environment

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[✓]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[!]${NC} $1"
}

print_error() {
    echo -e "${RED}[✗]${NC} $1"
}

# Check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check prerequisites
check_prerequisites() {
    print_status "Checking prerequisites..."
    
    local missing_deps=()
    
    if ! command_exists code; then
        missing_deps+=("VS Code (code command)")
    fi
    
    if ! command_exists npm; then
        missing_deps+=("npm")
    fi
    
    if ! command_exists pip; then
        missing_deps+=("pip/pip3")
    fi
    
    if ! command_exists brew; then
        print_warning "Homebrew not found. Some tools will be skipped."
        print_warning "Install Homebrew from https://brew.sh if you want all tools."
    fi
    
    if [ ${#missing_deps[@]} -gt 0 ]; then
        print_error "Missing required dependencies:"
        for dep in "${missing_deps[@]}"; do
            echo "  - $dep"
        done
        echo ""
        echo "Please install missing dependencies and run this script again."
        exit 1
    fi
    
    print_success "Prerequisites check passed"
}

# Install VS Code extensions
install_vscode_extensions() {
    print_status "Installing VS Code extensions..."
    
    local extensions=(
        "Codium.codiumai"
        "snyk-security.snyk-vulnerability-scanner"
        "SonarSource.sonarlint-vscode"
        "Semgrep.semgrep"
        "mintlify.document"
        "Swimm.swimm"
        "Postman.postman-for-vscode"
    )
    
    for ext in "${extensions[@]}"; do
        if code --install-extension "$ext" 2>/dev/null; then
            print_success "Installed: $ext"
        else
            print_warning "Failed to install: $ext (may already be installed)"
        fi
    done
}

# Install NPM packages
install_npm_packages() {
    print_status "Installing NPM packages..."
    
    local packages=(
        "snyk"
        "dokumentor"
        "newman"
        "prisma"
        "supabase"
        "@vercel/v0"
        "@locofy/cli"
        "@components-ai/cli"
    )
    
    for pkg in "${packages[@]}"; do
        print_status "Installing $pkg..."
        if npm install -g "$pkg" 2>/dev/null; then
            print_success "Installed: $pkg"
        else
            print_warning "Failed to install: $pkg (may need sudo or already installed)"
        fi
    done
}

# Install Python packages
install_python_packages() {
    print_status "Installing Python packages..."
    
    # Determine pip command
    local pip_cmd="pip"
    if ! command_exists pip; then
        if command_exists pip3; then
            pip_cmd="pip3"
        else
            print_warning "pip not found, skipping Python packages"
            return
        fi
    fi
    
    local packages=(
        "semgrep"
        "ggshield"
    )
    
    for pkg in "${packages[@]}"; do
        print_status "Installing $pkg..."
        if $pip_cmd install "$pkg" --user 2>/dev/null; then
            print_success "Installed: $pkg"
        else
            print_warning "Failed to install: $pkg (may need different permissions)"
        fi
    done
}

# Install Homebrew packages (macOS only)
install_brew_packages() {
    if ! command_exists brew; then
        print_warning "Homebrew not found, skipping Homebrew packages"
        return
    fi
    
    print_status "Installing Homebrew packages..."
    
    local packages=(
        "bearer"
        "pulumi"
        "k8sgpt"
    )
    
    for pkg in "${packages[@]}"; do
        print_status "Installing $pkg..."
        if brew list "$pkg" &>/dev/null; then
            print_success "$pkg already installed"
        elif brew install "$pkg" 2>/dev/null; then
            print_success "Installed: $pkg"
        else
            print_warning "Failed to install: $pkg"
        fi
    done
}

# Create configuration file
create_config_file() {
    print_status "Creating configuration template..."
    
    cat > scripts/ai-agents-config.env << 'EOF'
# AI Development Agents Configuration
# Add your API keys and tokens here

# Bug Detection & Security
SNYK_TOKEN=
SONARCLOUD_TOKEN=
CODIUM_API_KEY=
SEMGREP_APP_TOKEN=

# Documentation
MINTLIFY_API_KEY=
SWIMM_API_KEY=

# API Testing
POSTMAN_API_KEY=

# Database
PRISMA_API_KEY=
SUPABASE_ACCESS_TOKEN=
SUPABASE_PROJECT_ID=

# UI/UX Tools
VERCEL_TOKEN=
LOCOFY_API_KEY=
COMPONENTS_AI_KEY=

# DevOps
PULUMI_ACCESS_TOKEN=
K8SGPT_API_KEY=

# Security
GGSHIELD_API_KEY=
BEARER_TOKEN=

# Instructions:
# 1. Fill in your API keys above
# 2. Source this file: source scripts/ai-agents-config.env
# 3. Or add to your shell profile for persistence
EOF
    
    print_success "Configuration template created at scripts/ai-agents-config.env"
}

# Create helper scripts
create_helper_scripts() {
    print_status "Creating helper scripts..."
    
    # Bug scanner script
    cat > scripts/scan-bugs.sh << 'EOF'
#!/bin/bash
echo "Running comprehensive bug scan..."

# Snyk security scan
if command -v snyk >/dev/null 2>&1; then
    echo "Running Snyk security scan..."
    snyk test --all-projects || true
fi

# Semgrep scan
if command -v semgrep >/dev/null 2>&1; then
    echo "Running Semgrep scan..."
    semgrep --config=auto . || true
fi

# SonarLint would run in VS Code automatically

echo "Bug scan complete! Check the results above."
EOF
    chmod +x scripts/scan-bugs.sh
    
    # Documentation generator script
    cat > scripts/generate-docs.sh << 'EOF'
#!/bin/bash
echo "Generating documentation..."

# Use dokumentor if available
if command -v dokumentor >/dev/null 2>&1; then
    dokumentor generate
fi

# Add other documentation generation commands here

echo "Documentation generation complete!"
EOF
    chmod +x scripts/generate-docs.sh
    
    print_success "Helper scripts created"
}

# Main installation flow
main() {
    echo ""
    echo "======================================"
    echo "AI Development Agents Installation"
    echo "======================================"
    echo ""
    
    check_prerequisites
    
    echo ""
    print_status "Starting installation..."
    echo ""
    
    # Run installations
    install_vscode_extensions
    echo ""
    
    install_npm_packages
    echo ""
    
    install_python_packages
    echo ""
    
    install_brew_packages
    echo ""
    
    create_config_file
    create_helper_scripts
    
    echo ""
    echo "======================================"
    print_success "Installation complete!"
    echo "======================================"
    echo ""
    echo "📝 Next steps:"
    echo "1. Configure API keys in scripts/ai-agents-config.env"
    echo "2. Source the config: source scripts/ai-agents-config.env"
    echo "3. Restart VS Code to activate extensions"
    echo "4. Run scripts/scan-bugs.sh for a security scan"
    echo ""
    echo "🛠️  Helper scripts created:"
    echo "  - scripts/scan-bugs.sh - Run bug and security scans"
    echo "  - scripts/generate-docs.sh - Generate documentation"
    echo ""
    
    # Show installed tools summary
    echo "✅ Installed Tools Summary:"
    echo ""
    echo "Bug Detection:"
    echo "  - Codium AI (VS Code)"
    echo "  - Snyk Security Scanner"
    echo "  - SonarLint (VS Code)"
    echo "  - Semgrep"
    echo ""
    echo "Security:"
    echo "  - GitGuardian Shield"
    echo "  - Bearer (if Homebrew available)"
    echo ""
    echo "Documentation:"
    echo "  - Mintlify (VS Code)"
    echo "  - Swimm (VS Code)"
    echo "  - Dokumentor"
    echo ""
    echo "API & Database:"
    echo "  - Newman (Postman CLI)"
    echo "  - Prisma"
    echo "  - Supabase CLI"
    echo ""
    echo "UI/UX:"
    echo "  - Vercel v0"
    echo "  - Locofy CLI"
    echo "  - Components AI"
    echo ""
    echo "DevOps:"
    echo "  - Pulumi (if Homebrew available)"
    echo "  - K8sGPT (if Homebrew available)"
    echo ""
}

# Run main function
main "$@"