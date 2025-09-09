# Safe WIS Data Extraction Plan

## Problem Summary
- Direct extraction of 88GB VDI crashed your Mac (filled local drive)
- VirtualBox doesn't work on Apple Silicon
- UTM setup exists but extraction went to wrong location
- Need to get WIS data WITHOUT crashing system

## Solution: Use Sample Data First

### Option 1: Create Mock Data for Testing (SAFEST - Do This First)

Instead of extracting from VDI, let's create sample WIS data structure:

```bash
# Create on EXTERNAL drive only
mkdir -p /Volumes/UnimogManuals/wis-samples/manuals
mkdir -p /Volumes/UnimogManuals/wis-samples/parts
mkdir -p /Volumes/UnimogManuals/wis-samples/wiring
```

#### Sample Files We'll Create:
1. **Mock PDF manuals** (use any Unimog PDFs you have)
2. **Sample HTML procedures** (we'll create these)
3. **Test parts data** (JSON format)

### Option 2: Use UTM with Strict Controls

#### UTM Configuration:
1. **RAM**: Max 4GB
2. **Shared Folder**: `/Volumes/UnimogManuals/wis-data` (EXTERNAL ONLY)
3. **No local folder access**

#### Safe Extraction Process:
1. Boot Windows 7 in UTM
2. Login: Admin / 12345
3. Open Windows Explorer
4. Navigate to `C:\Program Files\Mercedes-Benz\WIS\`
5. Copy ONLY these folders to shared drive:
   - `Unimog\` folder only (not all Mercedes)
   - Max 10 files at a time

### Option 3: Cloud-Based Processing

#### Use Remote Desktop Service:
1. Upload VDI to cloud VM service (AWS/Azure)
2. Extract there with plenty of space
3. Download only Unimog-specific files

## File Structure Inside WIS (Based on Documentation)

```
C:\Program Files\Mercedes-Benz\
├── WIS\
│   ├── Data\
│   │   ├── Manuals\
│   │   │   ├── Unimog_400\
│   │   │   ├── Unimog_500\
│   │   │   └── Unimog_5000\
│   │   ├── Procedures\
│   │   └── Bulletins\
│   ├── Database\
│   └── Resources\
└── EPC\
    ├── Parts\
    └── Diagrams\
```

## What We Actually Need (Priority)

### Phase 1: Sample Data (5-10 files)
- 3-5 Unimog service manual PDFs
- 2-3 parts diagrams
- 1-2 wiring diagrams

### Phase 2: Core Manuals (After testing)
- Unimog 400 series manuals
- Unimog 500 series manuals  
- Common procedures

### Skip These (Save 80GB):
- Other Mercedes models
- Video tutorials
- Duplicate languages
- Old versions

## Implementation Steps

### Step 1: Create Sample Structure
```bash
# On EXTERNAL drive only
cd /Volumes/UnimogManuals/wis-samples

# Create sample manual files (we'll use placeholders)
echo "Unimog 400 Service Manual" > manuals/unimog_400_service.txt
echo "Unimog 500 Parts Catalog" > parts/unimog_500_parts.txt
```

### Step 2: Upload Samples to Supabase
```typescript
// Upload to Supabase storage
const { data, error } = await supabase.storage
  .from('wis-manuals')
  .upload('samples/unimog_400_service.txt', file);
```

### Step 3: Test Display in WIS Viewer
- Verify upload works
- Test display interface
- Confirm no storage issues

### Step 4: Progressive Extraction
Only after sample testing:
1. Extract 1GB at a time
2. Upload immediately to Supabase
3. Delete local copy
4. Repeat

## Safety Checklist

Before ANY extraction:
- [ ] Verify 100GB+ free on EXTERNAL drive
- [ ] No extraction to local drive
- [ ] Monitor disk space constantly
- [ ] Have kill switch ready (Force Quit)

## Emergency Recovery

If space fills again:
```bash
# Stop all processes
killall UTM
killall cp
killall rsync

# Clear any temp files
rm -rf ~/wis-temp 2>/dev/null
rm -rf /tmp/wis* 2>/dev/null
```

## Next Immediate Action

Create sample data first:
1. Use placeholder files
2. Test complete upload/display flow
3. Verify system works
4. THEN attempt real extraction

This approach ensures:
- No risk of crash
- Test system completely
- Progressive safe extraction
- Always have rollback option