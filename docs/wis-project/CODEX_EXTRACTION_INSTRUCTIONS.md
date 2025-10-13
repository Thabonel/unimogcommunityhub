# WIS Data Extraction Instructions for Codex

**Date**: October 13, 2025
**Version**: 1.0
**Purpose**: Extract REAL Mercedes WIS data from VM (NO FAKE DATA GENERATION)

---

## CRITICAL: NO HALLUCINATION RULES

**YOU MUST FOLLOW THESE RULES OR YOUR WORK WILL BE REJECTED:**

1. ❌ **NEVER GENERATE FAKE DATA** - Only extract from actual files
2. ❌ **NEVER CREATE PLACEHOLDER DATA** - Empty is better than fake
3. ❌ **NEVER INVENT PART NUMBERS** - Must come from real Mercedes database
4. ❌ **NEVER MAKE UP PROCEDURE CODES** - Must match Transbase exports
5. ✅ **ALWAYS PROVIDE PROOF** - Screenshots, checksums, file listings

---

## SOURCE DATA LOCATION

### VirtualBox VM
- **Host Path**: `/Volumes/UnimogManuals/wis-extraction/MERCEDES.vdi`
- **VM Type**: Windows 7 (32-bit)
- **VM Name**: `WIS-Mercedes` or `MERCEDES`

### Inside Windows VM
- **Database Location**: `C:\DB\WIS\wisnet\190618193631___L_09_19\`
- **Database Type**: Transbase (binary rfiles)
- **Database Files**:
  ```
  rfile00000.000, rfile00000.001  - Main database index
  rfile00001.000                  - Procedures index
  rfile00002.000-003              - Procedures data (5,000-10,000 procedures)
  rfile00003.000-002              - Parts catalog (50,000+ parts)
  rfile00004.000                  - Service bulletins (500-1,000 bulletins)
  rfile00005.000                  - Vehicle models (50-100 Unimog models)
  rfile00006.000                  - Wiring diagrams
  ```

### Transbase Tools
- **Tool Location**: `C:\Program Files\EWA\database\TransBase WIS\`
- **Admin Tool**: `tbadm32.exe`
- **Export Tool**: Use SQL export functionality

---

## EXTRACTION WORKFLOW

### PHASE 1: VM Setup and Verification

#### 1.1 Boot the VM
```bash
# On macOS host
VBoxManage startvm "WIS-Mercedes" --type gui
# Or use VirtualBox GUI to start
```

**PROOF REQUIRED**:
- Screenshot of Windows desktop with file explorer open
- Timestamp visible in screenshot (must show current date/time)

#### 1.2 Verify Database Files Exist
```powershell
# In Windows VM
cd C:\DB\WIS\wisnet\190618193631___L_09_19\
dir rfile*.* /s
```

**PROOF REQUIRED**:
- Screenshot showing rfile listing with sizes
- File sizes must be >100MB (proves not empty)
- Timestamps must be 2019 (original Mercedes data)

#### 1.3 Calculate Source Checksums
```powershell
# In Windows VM - run PowerShell as Administrator
cd C:\DB\WIS\wisnet\190618193631___L_09_19\
Get-FileHash rfile00002.000 -Algorithm SHA256 | Out-File C:\checksums.txt
Get-FileHash rfile00003.000 -Algorithm SHA256 | Out-File -Append C:\checksums.txt
Get-FileHash rfile00004.000 -Algorithm SHA256 | Out-File -Append C:\checksums.txt
```

**PROOF REQUIRED**:
- `checksums.txt` file with SHA256 hashes
- These prove you didn't generate fake data

---

### PHASE 2: Database Export to CSV

#### 2.1 Open Transbase Admin Tool
```powershell
# In Windows VM
cd "C:\Program Files\EWA\database\TransBase WIS"
.\tbadm32.exe
```

#### 2.2 Connect to Database
- Server: `localhost`
- Database: `wisnet`
- User: (check for credentials file or try `admin`/`wisadmin`)

#### 2.3 Export Tables to CSV

**Export Command Template**:
```sql
-- In Transbase admin console
EXPORT TABLE procedures TO 'C:\export\procedures.csv' FORMAT CSV HEADERS;
EXPORT TABLE parts TO 'C:\export\parts.csv' FORMAT CSV HEADERS;
EXPORT TABLE bulletins TO 'C:\export\bulletins.csv' FORMAT CSV HEADERS;
EXPORT TABLE models TO 'C:\export\models.csv' FORMAT CSV HEADERS;
EXPORT TABLE procedure_steps TO 'C:\export\procedure_steps.csv' FORMAT CSV HEADERS;
EXPORT TABLE procedure_parts TO 'C:\export\procedure_parts.csv' FORMAT CSV HEADERS;
EXPORT TABLE procedure_tools TO 'C:\export\procedure_tools.csv' FORMAT CSV HEADERS;
```

**VALIDATION RULES**:
- Each CSV must have >1,000 rows (except models: >50 rows)
- CSV must have proper headers (not "column1, column2")
- File sizes: procedures.csv >50MB, parts.csv >100MB

**PROOF REQUIRED**:
```powershell
# Generate export report
dir C:\export\*.csv | Select-Object Name, Length, LastWriteTime | Out-File C:\export\export_report.txt

# Count rows in each CSV
(Get-Content C:\export\procedures.csv).Count | Out-File -Append C:\export\export_report.txt
(Get-Content C:\export\parts.csv).Count | Out-File -Append C:\export\export_report.txt
(Get-Content C:\export\bulletins.csv).Count | Out-File -Append C:\export\export_report.txt
```

---

### PHASE 3: Data Validation

#### 3.1 Validate Mercedes Part Numbers

**Required Format**: `A ### ### ## ##` (e.g., `A 435 350 12 68`)

```powershell
# Check first 10 parts have valid format
Get-Content C:\export\parts.csv | Select-Object -First 10 | Out-File C:\export\part_sample.txt
```

**VALIDATION RULES**:
- Part numbers MUST start with "A" or "N"
- Must have exactly 11 characters (with spaces) or 9 (without spaces)
- Examples: `A 435 350 12 68`, `N 000000 008219`
- ❌ REJECT: `PART-001`, `12345`, `TEST_PART`

#### 3.2 Validate Procedure Codes

**Required Format**: `##.##-P-####[A-Z]` (e.g., `54.20-P-2001A`)

```powershell
# Extract procedure codes
Get-Content C:\export\procedures.csv | Select-Object -First 10 | Out-File C:\export\procedure_sample.txt
```

**VALIDATION RULES**:
- Must have exactly 13-14 characters
- Format: `XX.XX-P-XXXXC` where X=digit, C=letter
- Examples: `54.20-P-2001A`, `35.50-P-1004B`
- ❌ REJECT: `PROC_001`, `OIL_CHANGE`, `TEST`

#### 3.3 Validate Bulletin Numbers

**Required Format**: `TSB-####-###` (e.g., `TSB-2020-001`)

**VALIDATION RULES**:
- Must start with "TSB-" or "SI-"
- Year must be 2010-2020 (reasonable range)
- ❌ REJECT: `BULL-001`, `TEST`, `SAMPLE`

---

### PHASE 4: Convert to JSON Format

#### 4.1 Procedure JSON Format

```json
{
  "procedure_code": "54.20-P-2001A",
  "title": "Portal Axle Oil Change - Front Left",
  "category": "Drivetrain",
  "subcategory": "Portal Axle",
  "model_code": "U435",
  "description": "Complete procedure for changing portal axle oil in front left axle assembly",
  "estimated_time_hours": 0.75,
  "difficulty_level": 2,
  "labor_category": "Standard",
  "overview": "This procedure covers draining, flushing, and refilling the portal axle with new gear oil.",
  "safety_warnings": [
    "Engine must be warm but not hot",
    "Wear protective gloves when handling gear oil",
    "Dispose of used oil according to regulations"
  ],
  "steps": [
    {
      "step_number": 1,
      "instruction": "Position vehicle on level ground and engage parking brake",
      "image_reference": "54_20_P_2001A_step1.jpg",
      "caution": "Vehicle must be stable before working underneath"
    },
    {
      "step_number": 2,
      "instruction": "Remove drain plug from portal axle housing",
      "torque_spec": "25 Nm",
      "tool_required": "17mm hex socket"
    },
    {
      "step_number": 3,
      "instruction": "Allow oil to drain completely (approximately 5 minutes)",
      "caution": "Oil may be hot"
    }
  ],
  "parts": [
    {
      "part_number": "A 000 990 76 04",
      "description": "Gear Oil 85W-90 Synthetic",
      "quantity": "2.5L",
      "required": true
    },
    {
      "part_number": "N 000000 008219",
      "description": "Copper Washer M16",
      "quantity": 1,
      "required": true
    }
  ],
  "tools": [
    {
      "tool_code": "129 589 00 33 00",
      "description": "17mm Hex Socket",
      "special_tool": false
    }
  ],
  "related_bulletins": ["TSB-2020-001"],
  "supersedes": null,
  "version": "1.0",
  "source_fingerprint": "wis-54.20-P-2001A-v1",
  "source_date": "2019-06-18"
}
```

**CRITICAL VALIDATION**:
- Every procedure MUST have at least 1 step
- Every procedure MUST have valid Mercedes part numbers
- Every procedure MUST have valid procedure code
- `source_date` must be 2019 (original WIS data)
- ❌ NO placeholder text like "Lorem ipsum", "Example", "Test"

#### 4.2 Parts JSON Format

```json
{
  "part_number": "A 435 350 12 68",
  "description": "Portal Axle Seal Kit - Improved Material",
  "category": "Drivetrain",
  "subcategory": "Portal Axle",
  "price": 145.00,
  "currency": "EUR",
  "quantity_unit": "kit",
  "weight_kg": 0.5,
  "superseded_by": null,
  "supersedes": "A 435 350 12 67",
  "applicable_models": ["U400", "U423", "U430", "U435", "U500"],
  "notes": "Complete seal set for one axle",
  "source_fingerprint": "wis-part-A435350126",
  "source_date": "2019-06-18"
}
```

#### 4.3 Bulletin JSON Format

```json
{
  "bulletin_number": "TSB-2020-001",
  "title": "Portal Axle Seal Leakage - Improved Seal Design",
  "issue_date": "2020-03-15",
  "category": "Drivetrain",
  "affected_models": ["U400", "U423", "U430", "U500"],
  "vin_range": "WDB4371411W000001 - WDB4371411W999999",
  "condition": "Some customers may report oil leakage from portal axle housing seal",
  "root_cause": "Original seal material not optimal for extended high-temperature operation",
  "correction": "Replace with improved seal kit A 435 350 12 68",
  "labor_time_hours": 2.5,
  "warranty_code": "35.50.89",
  "related_procedures": ["54.20-P-2001A", "35.50-P-1004B"],
  "related_parts": ["A 435 350 12 68", "A 435 350 06 80"],
  "source_fingerprint": "wis-bulletin-TSB-2020-001",
  "source_date": "2020-03-15"
}
```

---

### PHASE 5: File Organization

#### 5.1 Directory Structure

```
/Volumes/UnimogManuals/WIS-Prepared/
├── U400/
│   ├── procedures/
│   │   ├── 54.20-P-2001A.json
│   │   ├── 35.50-P-1004B.json
│   │   └── ...
│   ├── parts/
│   │   └── parts_catalog_u400.json
│   └── bulletins/
│       ├── TSB-2020-001.json
│       └── ...
├── U435/
│   ├── procedures/
│   ├── parts/
│   └── bulletins/
├── U500/
│   ├── procedures/
│   ├── parts/
│   └── bulletins/
└── extraction_report.md
```

#### 5.2 File Naming Convention

- **Procedures**: `{procedure_code}.json` (e.g., `54.20-P-2001A.json`)
- **Parts**: `parts_catalog_{model}.json` (e.g., `parts_catalog_u435.json`)
- **Bulletins**: `{bulletin_number}.json` (e.g., `TSB-2020-001.json`)

---

### PHASE 6: Verification Report

#### 6.1 Create Extraction Report

**Template**:
```markdown
# WIS Extraction Report

## Extraction Details
- **Date**: YYYY-MM-DD HH:MM:SS
- **VM**: MERCEDES.vdi
- **Database**: Transbase wisnet
- **Extraction Method**: CSV export + JSON conversion

## Source File Verification
| File | Size | SHA256 |
|------|------|--------|
| rfile00002.000 | XXX MB | abc123... |
| rfile00003.000 | XXX MB | def456... |
| rfile00004.000 | XXX MB | ghi789... |

## Data Extracted
| Table | Rows Exported | JSON Files Created | Status |
|-------|---------------|-------------------|---------|
| procedures | 5,234 | 5,234 | ✓ |
| parts | 52,156 | 52,156 | ✓ |
| bulletins | 687 | 687 | ✓ |
| models | 87 | 87 | ✓ |

## Validation Results
| Check | Expected | Actual | Status |
|-------|----------|--------|---------|
| Procedure count | 5,000-10,000 | 5,234 | ✓ |
| Part count | 50,000+ | 52,156 | ✓ |
| Bulletin count | 500-1,000 | 687 | ✓ |
| Mercedes part format | 100% | 100% | ✓ |
| Procedure code format | 100% | 100% | ✓ |
| Source date verification | 2019 | 2019 | ✓ |

## Sample Data Verification
### Sample Procedure Codes
- 54.20-P-2001A ✓
- 35.50-P-1004B ✓
- 25.10-P-3005C ✓

### Sample Part Numbers
- A 435 350 12 68 ✓
- A 000 990 76 04 ✓
- N 000000 008219 ✓

### Sample Bulletin Numbers
- TSB-2020-001 ✓
- TSB-2019-045 ✓
- SI-2018-112 ✓

## File Statistics
- **Total Files Created**: 58,164
- **Total Size**: 2.3 GB
- **Largest File**: procedures/35.50-P-1004B.json (450 KB)
- **Smallest File**: bulletins/SI-2015-003.json (12 KB)

## Quality Checks
- [ ] All procedures have >1 step
- [ ] All procedures have valid part numbers
- [ ] All parts have Mercedes format numbers
- [ ] No placeholder text detected
- [ ] No fake data patterns found
- [ ] Source dates match original (2019)
- [ ] Checksums match source files

## Sign-Off
**Extracted By**: Codex
**Verified By**: [Human Review Required]
**Date**: YYYY-MM-DD
**Status**: Ready for Database Import
```

---

## CRITICAL REJECTION CRITERIA

**Your extraction will be REJECTED if**:

1. ❌ Any procedure has fake procedure codes (not Mercedes format)
2. ❌ Any part has fake part numbers (not `A ###` or `N ###` format)
3. ❌ CSV files have <1,000 rows (proves not real export)
4. ❌ Source checksums not provided
5. ❌ Timestamps are today's date (not 2019)
6. ❌ Any placeholder text found ("Lorem ipsum", "Example", "Test")
7. ❌ File sizes too small (<10KB per procedure)
8. ❌ Missing verification report
9. ❌ Screenshots not provided
10. ❌ Row counts don't match expectations

---

## FINAL DELIVERABLES

**Required Files**:
1. ✅ `/Volumes/UnimogManuals/WIS-Prepared/` - All JSON files organized by model
2. ✅ `extraction_report.md` - Complete verification report with checksums
3. ✅ `checksums.txt` - SHA256 hashes of source rfiles
4. ✅ `screenshots/` - VM screenshots showing real file explorer
5. ✅ `export_report.txt` - CSV export statistics

**Expected Counts**:
- **Procedures**: 5,000-10,000 JSON files
- **Parts**: 50,000-100,000 entries
- **Bulletins**: 500-1,000 JSON files
- **Total Size**: 2-5 GB

---

## CONTACT FOR QUESTIONS

If you encounter issues:
1. Document the error with screenshots
2. Provide exact error messages
3. Show attempted solutions
4. Ask specific questions (not "it doesn't work")

**Remember**: Real data is messy, fake data is perfect. We want messy.

---

**Version**: 1.0
**Last Updated**: October 13, 2025
**Status**: Ready for Codex Execution
