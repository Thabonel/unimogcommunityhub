# Community-Proven WIS Extraction Method

## Key Findings from Mercedes Communities

### Critical Tools Identified:
1. **OSFMount** - Direct VDI mounting without VirtualBox (Windows only)
2. **7zip** - Essential for multi-part archive extraction
3. **Transbase CLI tools** - `tbrun`, `tbexport` for database dumps
4. **VBoxManage** - VirtualBox command-line VDI tools

### Community-Verified Process:

#### Step 1: Direct VDI Mounting (No VM Required)
```bash
# Use OSFMount on Windows to mount VDI directly
# This bypasses all VM complexity and gives direct NTFS access
```

#### Step 2: Locate Transbase Files
- Files: `tbase.sys`, `rfile000-rfile008`
- Typical location: `C:\WIS\Database\` or similar
- Copy entire database directory to external drive

#### Step 3: Transbase Data Export
```bash
# Use Transbase CLI tools (found in WIS installation)
tbexport -database WIS -table PROCEDURES -format CSV -output procedures.csv
tbexport -database WIS -table PARTS -format CSV -output parts.csv
tbexport -database WIS -table BULLETINS -format CSV -output bulletins.csv
```

#### Step 4: PostgreSQL Import
```sql
-- Import CSV files to PostgreSQL
COPY wis_procedures FROM 'procedures.csv' DELIMITER ',' CSV HEADER;
COPY wis_parts FROM 'parts.csv' DELIMITER ',' CSV HEADER;
COPY wis_bulletins FROM 'bulletins.csv' DELIMITER ',' CSV HEADER;
```

## Recommended Immediate Action Plan:

### Option A: Windows Machine Access
- Get access to Windows machine with OSFMount
- Mount VDI directly, copy database files
- Use Transbase tools for clean CSV export

### Option B: VirtualBox Command Line (macOS)
```bash
# Convert VDI to raw format (already done)
# Use VBoxManage to access file system
VBoxManage clonemedium disk MERCEDES.vdi output.raw --format RAW
```

### Option C: Linux VM Approach
- Create Ubuntu VM on external drive
- Mount VDI inside Linux using qemu-img tools
- Extract files using standard Linux tools

## Community Links for Reference:
- Scribd Installation Guides: Step-by-step VDI mounting
- benzworld.org: Technical extraction discussions
- Transbase documentation: CLI export commands

## Next Steps:
1. Test OSFMount approach (Windows required)
2. If no Windows access, use Linux VM method
3. Focus on copying raw database files first
4. Worry about conversion after successful extraction