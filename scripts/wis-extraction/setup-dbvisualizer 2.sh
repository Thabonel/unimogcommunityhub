#!/bin/bash

# Mercedes WIS Database Extraction Setup Script
# Using DbVisualizer for reliable extraction

echo "================================================"
echo "Mercedes WIS Database Extraction Setup"
echo "================================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if running on macOS
if [[ "$OSTYPE" != "darwin"* ]]; then
    echo -e "${RED}This script is designed for macOS. Please modify for your OS.${NC}"
    exit 1
fi

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Step 1: Check for DbVisualizer
echo -e "${YELLOW}Checking for DbVisualizer...${NC}"
if [ -d "/Applications/DbVisualizer.app" ]; then
    echo -e "${GREEN}DbVisualizer found!${NC}"
else
    echo -e "${YELLOW}DbVisualizer not found. Installing...${NC}"
    
    # Download DbVisualizer
    echo "Downloading DbVisualizer..."
    curl -L "https://www.dbvis.com/product_download/dbvis-14.0.3/media/dbvis_macos_14_0_3.dmg" -o ~/Downloads/dbvis.dmg
    
    echo "Please install DbVisualizer from ~/Downloads/dbvis.dmg"
    echo "After installation, run this script again."
    open ~/Downloads/dbvis.dmg
    exit 0
fi

# Step 2: Check for Java
echo -e "${YELLOW}Checking for Java...${NC}"
if command_exists java; then
    java_version=$(java -version 2>&1 | head -n 1)
    echo -e "${GREEN}Java found: $java_version${NC}"
else
    echo -e "${RED}Java not found. Installing OpenJDK...${NC}"
    brew install openjdk@11
    echo 'export PATH="/usr/local/opt/openjdk@11/bin:$PATH"' >> ~/.zshrc
    source ~/.zshrc
fi

# Step 3: Download Transbase JDBC Driver
echo -e "${YELLOW}Setting up Transbase JDBC driver...${NC}"
DRIVER_DIR="$HOME/.dbvis/jdbc-drivers/transbase"
mkdir -p "$DRIVER_DIR"

if [ ! -f "$DRIVER_DIR/transbase-jdbc.jar" ]; then
    echo "Downloading Transbase JDBC driver..."
    # Note: You may need to get this from the WIS installation
    echo -e "${YELLOW}Please copy the Transbase JDBC driver from the WIS installation:${NC}"
    echo "Location: C:\\Program Files\\EWA net\\database\\TransBase EWA\\jdbc\\transbase.jar"
    echo "Copy to: $DRIVER_DIR/transbase-jdbc.jar"
else
    echo -e "${GREEN}Transbase JDBC driver found!${NC}"
fi

# Step 4: Create DbVisualizer connection script
echo -e "${YELLOW}Creating DbVisualizer connection configuration...${NC}"
cat > ~/Documents/wis-connection.xml << 'EOF'
<?xml version="1.0" encoding="UTF-8"?>
<Connection>
    <Name>Mercedes WIS Database</Name>
    <Driver>Transbase</Driver>
    <URL>jdbc:transbase://localhost:2054/wisnet</URL>
    <User>tbadmin</User>
    <Password></Password>
    <Properties>
        <Property name="AutoCommit" value="true"/>
        <Property name="FetchSize" value="1000"/>
    </Properties>
</Connection>
EOF

echo -e "${GREEN}Connection configuration created!${NC}"

# Step 5: Create extraction SQL scripts
echo -e "${YELLOW}Creating extraction SQL scripts...${NC}"
mkdir -p ~/Documents/wis-extraction-sql

# Procedures extraction
cat > ~/Documents/wis-extraction-sql/01-export-procedures.sql << 'EOF'
-- Export WIS Procedures
SELECT 
    procedure_id,
    procedure_code,
    title,
    model,
    system_group,
    subsystem,
    content_html,
    tools_required,
    parts_required,
    labor_time,
    difficulty_level
FROM procedures
ORDER BY model, system_group, procedure_code;
EOF

# Parts extraction
cat > ~/Documents/wis-extraction-sql/02-export-parts.sql << 'EOF'
-- Export WIS Parts Catalog
SELECT 
    part_number,
    description,
    group_code,
    applicable_models,
    superseded_by,
    weight,
    dimensions,
    material
FROM parts
ORDER BY part_number;
EOF

# Bulletins extraction
cat > ~/Documents/wis-extraction-sql/03-export-bulletins.sql << 'EOF'
-- Export WIS Technical Bulletins
SELECT 
    bulletin_number,
    title,
    issue_date,
    affected_models,
    category,
    priority,
    content
FROM bulletins
ORDER BY issue_date DESC;
EOF

# Diagrams extraction
cat > ~/Documents/wis-extraction-sql/04-export-diagrams.sql << 'EOF'
-- Export WIS Diagrams References
SELECT 
    diagram_id,
    diagram_name,
    type,
    procedure_id,
    part_number,
    file_path,
    file_size
FROM diagrams
ORDER BY diagram_id;
EOF

echo -e "${GREEN}SQL extraction scripts created!${NC}"

# Step 6: Instructions for manual steps
echo ""
echo "================================================"
echo "Next Steps:"
echo "================================================"
echo ""
echo "1. Mount the WIS VDI file:"
echo "   - Use Parallels Desktop or VMware Fusion"
echo "   - Or use VirtualBox to run the WIS system"
echo ""
echo "2. Start the WIS database service:"
echo "   - In the VM: Start WIS application"
echo "   - This will start the Transbase service on port 2054"
echo ""
echo "3. Open DbVisualizer and:"
echo "   a. Add Transbase JDBC driver (Tools -> Driver Manager)"
echo "   b. Create new connection using:"
echo "      - URL: jdbc:transbase://localhost:2054/wisnet"
echo "      - User: tbadmin"
echo "      - Password: (leave empty)"
echo ""
echo "4. Run the extraction scripts in ~/Documents/wis-extraction-sql/"
echo ""
echo "5. Export results as CSV or SQL format"
echo ""
echo "Files created:"
echo "  - ~/Documents/wis-connection.xml"
echo "  - ~/Documents/wis-extraction-sql/*.sql"
echo ""
echo -e "${GREEN}Setup complete! Follow the manual steps above to continue.${NC}"