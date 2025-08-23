# WIS Automated Extraction Guide
## Complete Hands-Off Process for Mercedes WIS/EPC Data

This guide provides a **100% automated extraction process** that requires minimal user intervention. Just run one command and everything else happens automatically.

---

## 🎯 What This Process Will Give You

1. **Searchable WIS Content** - All procedures, parts, and bulletins in your database
2. **Organized File Storage** - All WIS files uploaded to Supabase
3. **Web-Ready Data** - Accessible through your existing WIS viewer at `/knowledge/wis-epc`
4. **No Manual Work** - Everything runs automatically with error recovery

---

## 📋 Prerequisites Check

Before starting, the automated script will check for:
- ✅ VDI file at `/Volumes/UnimogManuals/wis-final-extract/MERCEDES.vdi`
- ✅ Supabase credentials in `.env` file
- ✅ Node.js installed (for upload scripts)
- ✅ Available disk space on **EXTERNAL DRIVE** (need ~60GB free)
- 🛡️ **SAFETY**: All extraction happens on external drives only - NEVER on local drive

---

## 🚀 Quick Start (One Command)

```bash
cd /Users/thabonel/Documents/unimogcommunityhub
./scripts/wis-extraction/extract-all.sh
```

That's it! The script will run for 2-3 hours and extract everything automatically.

---

## 📊 Three-Stage Extraction Process

### Stage 1: MDB Quick Extraction (30 minutes)
**What it does:** Extracts all Microsoft Access database files for immediate searchability

1. **Installs mdb-tools** (if not present)
2. **Mounts VDI** as read-only filesystem
3. **Finds all MDB files** in the WIS directory
4. **Exports tables to CSV** format
5. **Uploads to Supabase** immediately

**Result:** Searchable procedures and parts catalog

### Stage 2: Complete File Harvest (1 hour)
**What it does:** Copies all WIS files for complete archive

1. **Scans entire VDI** for WIS-related files
2. **Creates file manifest** with paths and sizes
3. **Organizes by type** (procedures, parts, bulletins, diagrams)
4. **Uploads to Supabase storage** with folder structure
5. **Generates database entries** for each file

**Result:** Complete WIS file archive in cloud storage

### Stage 3: Advanced Processing (1 hour)
**What it does:** Converts proprietary formats to web-friendly formats

1. **CPG → PNG/JPG** - Converts Mercedes image format
2. **CBF → JSON** - Extracts diagnostic data
3. **ROM → SQL** - Attempts Transbase extraction (if tools available)
4. **Creates search indexes** for all content
5. **Links files to procedures** in database

**Result:** Fully processed, web-ready WIS system

---

## 🔧 Automated Scripts

### Master Script: `extract-all.sh`
```bash
#!/bin/bash
# Location: /scripts/wis-extraction/extract-all.sh

# This script runs everything automatically
# It checks prerequisites, installs tools, and handles errors
# Expected runtime: 2-3 hours

# What it does:
# 1. Checks if VDI exists and is complete
# 2. Installs required tools (mdb-tools, etc.)
# 3. Mounts VDI safely
# 4. Runs Stage 1 (MDB extraction)
# 5. Runs Stage 2 (File harvest)
# 6. Runs Stage 3 (Advanced processing)
# 7. Verifies extraction
# 8. Cleans up temporary files
```

### Quick MDB Script: `extract-mdb-only.sh`
```bash
#!/bin/bash
# Location: /scripts/wis-extraction/extract-mdb-only.sh

# Fastest option - just extracts searchable data
# Runtime: 30 minutes
# Gets you 80% of functionality quickly
```

### Upload Script: `upload-to-supabase.js`
```javascript
// Location: /scripts/wis-extraction/upload-to-supabase.js

// Handles all Supabase uploads
// Automatic retry on failure
// Progress tracking
// Resumes from interruption
```

---

## 📁 File Structure After Extraction

```
/Volumes/UnimogManuals/wis-extracted/
├── mdb-data/              # Extracted Access databases
│   ├── procedures.csv     # All repair procedures
│   ├── parts.csv         # Parts catalog
│   ├── bulletins.csv     # Technical bulletins
│   └── models.csv        # Vehicle models
├── files/                # Original WIS files
│   ├── procedures/       # Procedure documents
│   ├── parts/           # Parts diagrams
│   ├── bulletins/       # Service bulletins
│   └── diagrams/        # Wiring diagrams
├── converted/           # Converted formats
│   ├── images/         # CPG → PNG conversions
│   └── json/          # CBF → JSON data
└── logs/              # Extraction logs
```

---

## 🔍 How to Monitor Progress

### Watch Real-Time Progress
```bash
# In a new terminal window:
tail -f /Volumes/UnimogManuals/wis-extracted/logs/extraction.log
```

### Check Database Population
```bash
# Shows count of extracted items:
node scripts/wis-extraction/check-progress.js
```

### View in Web Interface
1. Open http://localhost:5173/knowledge/wis-epc
2. Search for any procedure (e.g., "oil change")
3. Data appears as soon as it's uploaded

---

## 🛡️ Safety & Troubleshooting

### 🔒 External Drive Safety
- **ALL extraction happens on external drives only** (`/Volumes/UnimogManuals/`)
- **NO files created on local drive** - script will exit with error if attempted
- **Temporary files** (like RAW conversion) stored on external drive only
- **Safe cleanup** removes only external drive temporary files

### If VDI Won't Mount
- **Solution:** Script automatically tries multiple mount methods
- **Fallback:** Converts VDI to RAW format (on external drive only)

### If MDB Tools Fail
- **Solution:** Script auto-installs via Homebrew
- **Fallback:** Uses Python mdbtools alternative

### If Upload Fails
- **Solution:** Automatic retry with exponential backoff
- **Fallback:** Saves locally on external drive for manual upload later

### If Process Interrupted
- **Solution:** Just run script again - it resumes from last checkpoint
- **No data loss:** All progress is saved on external drive

---

## ✅ Verification Checklist

After extraction completes, the script automatically verifies:

- [ ] At least 1000 procedures extracted
- [ ] At least 5000 parts in catalog
- [ ] Images converted successfully
- [ ] Database searchable
- [ ] Files uploaded to storage
- [ ] Web interface working

---

## 🎯 Expected Results

| Data Type | Expected Count | Storage Location |
|-----------|---------------|------------------|
| Procedures | 3,000+ | Database + Storage |
| Parts | 10,000+ | Database + Storage |
| Bulletins | 500+ | Database + Storage |
| Diagrams | 2,000+ | Storage (images) |
| Models | 50+ | Database |

---

## 🚦 Status Indicators

The script provides clear status updates:

```
✅ Stage 1 Complete: MDB data extracted (2,543 procedures)
⏳ Stage 2 Running: Copying files (45% - 2.3GB/5.1GB)
⏸️ Stage 3 Pending: Will start after Stage 2
```

---

## 💡 Tips for Success

1. **Run overnight** - Process takes 2-3 hours
2. **Don't interrupt** - Script handles everything
3. **Check morning** - Everything will be ready
4. **Partial success is OK** - Even Stage 1 gives useful data

---

## 🔄 Re-Running and Updates

Safe to run multiple times:
```bash
# Full re-run (skips already extracted data)
./scripts/wis-extraction/extract-all.sh

# Force fresh extraction
./scripts/wis-extraction/extract-all.sh --clean

# Just verify existing extraction
./scripts/wis-extraction/verify-extraction.sh
```

---

## 📞 What to Do If Something Goes Wrong

1. **Check the log file** at `/Volumes/UnimogManuals/wis-extracted/logs/extraction.log`
2. **Run verification** with `./scripts/wis-extraction/verify-extraction.sh`
3. **Try quick extraction** with `./scripts/wis-extraction/extract-mdb-only.sh`
4. **All else fails:** The sample data is already working at `/knowledge/wis-epc`

---

## 🎉 Success Confirmation

You'll know it worked when:
1. Script shows "✅ EXTRACTION COMPLETE"
2. Web interface at `/knowledge/wis-epc` shows real data
3. Search returns Mercedes procedures
4. Parts catalog is browsable
5. Log file shows no errors

---

## 📝 Notes

- **No user interaction required** after starting script
- **Automatic error recovery** at every step
- **Incremental progress** - partial extraction is still useful
- **Safe to re-run** - won't duplicate or lose data
- **Works offline** - no internet needed for extraction

---

*Last updated: 2025-01-21*
*Extraction script version: 1.0.0*