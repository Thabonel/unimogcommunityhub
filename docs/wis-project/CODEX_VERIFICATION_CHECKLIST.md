# Codex Extraction Verification Checklist

**Purpose**: Verify Codex delivered REAL Mercedes WIS data (not fake/generated data)
**Date**: October 13, 2025
**Version**: 1.0

---

## ⚠️ CRITICAL: This Checklist Prevents Fake Data

**Use this checklist to verify EVERY deliverable from Codex before importing to database.**

If ANY check fails → **REJECT** the extraction and ask Codex to redo it.

---

## PHASE 1: DELIVERABLES CHECK

### 1.1 Required Files Present

- [ ] `/Volumes/UnimogManuals/WIS-Prepared/` directory exists
- [ ] `extraction_report.md` file exists
- [ ] `checksums.txt` file exists
- [ ] `screenshots/` directory with VM screenshots
- [ ] `export_report.txt` with CSV statistics

### 1.2 Directory Structure

```
/Volumes/UnimogManuals/WIS-Prepared/
├── U400/
│   ├── procedures/     ← Has files?
│   ├── parts/          ← Has files?
│   └── bulletins/      ← Has files?
├── U435/
│   ├── procedures/     ← Has files?
│   ├── parts/          ← Has files?
│   └── bulletins/      ← Has files?
├── U500/
│   ├── procedures/     ← Has files?
│   ├── parts/          ← Has files?
│   └── bulletins/      ← Has files?
└── extraction_report.md
```

- [ ] All model directories (U400, U435, U500) exist
- [ ] Each model has procedures/, parts/, bulletins/ subdirectories
- [ ] Procedures directories are NOT empty

---

## PHASE 2: SOURCE VERIFICATION

### 2.1 Screenshot Verification

**Check**: `screenshots/` directory

- [ ] Screenshot shows Windows file explorer (not macOS Finder)
- [ ] Screenshot shows `C:\DB\WIS\wisnet\` path
- [ ] Screenshot shows `rfile*.000` files with sizes >100MB
- [ ] Screenshot timestamp is visible (current date/time)
- [ ] No evidence of Photoshop/fake (look for UI inconsistencies)

**❌ REJECT IF**:
- Screenshots are macOS Finder (proves didn't use VM)
- Files shown are tiny (<1MB) stub files
- Timestamp missing or suspicious

### 2.2 Checksum Verification

**Check**: `checksums.txt` file

```bash
# Verify format
cat /Volumes/UnimogManuals/WIS-Prepared/checksums.txt
```

- [ ] File contains SHA256 hashes (64 hex characters each)
- [ ] At least 3 checksums present (rfile00002, rfile00003, rfile00004)
- [ ] Format: `SHA256_HASH  C:\DB\WIS\...\rfileXXXXX.XXX`

**Sample Valid Format**:
```
A1B2C3D4E5F6... C:\DB\WIS\wisnet\190618193631___L_09_19\R2\rfile00002.000
F6E5D4C3B2A1... C:\DB\WIS\wisnet\190618193631___L_09_19\R3\rfile00003.000
```

**❌ REJECT IF**:
- Checksums are fake (all zeros, sequential, or obviously fake)
- File paths don't match Windows VM structure

### 2.3 Export Report Verification

**Check**: `export_report.txt` file

```bash
cat /Volumes/UnimogManuals/WIS-Prepared/export_report.txt
```

- [ ] Shows CSV file names with sizes
- [ ] procedures.csv >50MB
- [ ] parts.csv >100MB
- [ ] Row counts shown (procedures: 5,000-10,000, parts: 50,000+)

**❌ REJECT IF**:
- Files too small (<1MB)
- Row counts too low (<1,000 rows)
- No row count information

---

## PHASE 3: DATA FORMAT VALIDATION

### 3.1 Procedure File Validation

```bash
# Pick 10 random procedure files
find /Volumes/UnimogManuals/WIS-Prepared/*/procedures -name "*.json" | head -10 | while read file; do
  echo "Checking: $file"
  jq . "$file" > /dev/null 2>&1 && echo "  ✓ Valid JSON" || echo "  ✗ INVALID JSON"
  jq -r '.procedure_code' "$file"
  jq -r '.parts[0].part_number' "$file" 2>/dev/null
done
```

**For EACH sampled file check**:

- [ ] File is valid JSON (not corrupted)
- [ ] Has `procedure_code` field matching format: `##.##-P-####[A-Z]`
- [ ] Has at least 1 step in `steps` array
- [ ] Parts have Mercedes format: `A ### ### ## ##` or `N ### ### ## ##`
- [ ] File size >10KB (not a stub)
- [ ] No placeholder text ("Lorem ipsum", "Example", "Test", "TODO")

**Example Valid Procedure Code**: `54.20-P-2001A` ✓
**Example Invalid Procedure Code**: `PROC_OIL_CHANGE_001` ✗

### 3.2 Parts File Validation

```bash
# Check parts catalog
jq '.parts[0:10] | .[] | .part_number' /Volumes/UnimogManuals/WIS-Prepared/U435/parts/*.json
```

- [ ] Part numbers match Mercedes format: `A ### ### ## ##`
- [ ] At least 1,000 parts per model
- [ ] Part descriptions are not "Part 1", "Part 2", "Example Part"
- [ ] Prices are reasonable (€10-€10,000 range, not €0.00 or €999,999)

**Example Valid Part Numbers**:
- `A 435 350 12 68` ✓
- `A 000 990 76 04` ✓
- `N 000000 008219` ✓

**Example Invalid Part Numbers**:
- `PART-001` ✗
- `12345` ✗
- `TEST_PART` ✗

### 3.3 Bulletin File Validation

```bash
# Check bulletins
jq -r '.bulletin_number' /Volumes/UnimogManuals/WIS-Prepared/*/bulletins/*.json | head -10
```

- [ ] Bulletin numbers match format: `TSB-####-###` or `SI-####-###`
- [ ] Issue dates are 2010-2020 (reasonable range)
- [ ] Related parts have valid Mercedes numbers
- [ ] Affected models are real Unimog models (U400, U435, U500, etc.)

**Example Valid Bulletin Numbers**:
- `TSB-2020-001` ✓
- `SI-2018-112` ✓

**Example Invalid Bulletin Numbers**:
- `BULL-001` ✗
- `TEST` ✗

---

## PHASE 4: STATISTICAL VALIDATION

### 4.1 File Counts

```bash
# Count files
echo "Procedures: $(find /Volumes/UnimogManuals/WIS-Prepared/*/procedures -name "*.json" | wc -l)"
echo "Parts catalogs: $(find /Volumes/UnimogManuals/WIS-Prepared/*/parts -name "*.json" | wc -l)"
echo "Bulletins: $(find /Volumes/UnimogManuals/WIS-Prepared/*/bulletins -name "*.json" | wc -l)"
```

**Expected Ranges**:
- [ ] Procedures: 5,000-10,000 total
- [ ] Parts catalogs: 3-6 total (1-2 per model)
- [ ] Bulletins: 500-1,000 total

**❌ REJECT IF**:
- Procedures <1,000 (too few, likely fake)
- Procedures >20,000 (too many, likely duplicates)
- Bulletins <100 (too few)

### 4.2 File Size Distribution

```bash
# Check file sizes
find /Volumes/UnimogManuals/WIS-Prepared/*/procedures -name "*.json" -exec ls -lh {} \; | awk '{print $5}' | sort | uniq -c
```

- [ ] Most procedure files are 10-500KB (realistic size)
- [ ] Very few files <5KB (these might be stubs)
- [ ] No files >5MB (suspiciously large)

**❌ REJECT IF**:
- All files are exactly the same size (generated pattern)
- Majority of files are <5KB (likely stubs)

### 4.3 Source Date Verification

```bash
# Check source_date fields
jq -r '.source_date' /Volumes/UnimogManuals/WIS-Prepared/*/procedures/*.json | sort | uniq -c | head -20
```

- [ ] Most `source_date` values are "2019-06-18" (original WIS date)
- [ ] No `source_date` values are today's date (would prove fake generation)
- [ ] Dates are in range 2015-2020 (reasonable for Mercedes data)

**❌ REJECT IF**:
- All dates are October 2025 (generated today)
- Dates are in future (2026+)

---

## PHASE 5: CONTENT QUALITY VALIDATION

### 5.1 Random Procedure Deep Check

```bash
# Pick one random procedure for deep inspection
RANDOM_PROC=$(find /Volumes/UnimogManuals/WIS-Prepared/*/procedures -name "*.json" | shuf -n 1)
echo "Deep checking: $RANDOM_PROC"
jq . "$RANDOM_PROC"
```

**Check the following manually**:

- [ ] Title makes sense (not "Procedure 123" or "Test Procedure")
- [ ] Description is meaningful (not placeholder text)
- [ ] Steps are detailed (not "Step 1: Do something")
- [ ] Steps reference specific tools (not "Use tool")
- [ ] Parts referenced match parts catalog
- [ ] Torque specifications are realistic (10-500 Nm, not 0 or 999999)
- [ ] Safety warnings are specific (not generic "Be careful")

**Example Good Step**:
```json
{
  "step_number": 2,
  "instruction": "Remove drain plug from portal axle housing using 17mm hex socket",
  "torque_spec": "25 Nm",
  "caution": "Oil may be hot. Wear protective gloves."
}
```

**Example Bad Step** (REJECT):
```json
{
  "step_number": 2,
  "instruction": "Perform step 2",
  "torque_spec": "999 Nm",
  "caution": "Be careful"
}
```

### 5.2 Check for AI Generation Patterns

**Look for these AI hallucination patterns**:

- [ ] No "Lorem ipsum" text found
- [ ] No sequential naming ("Part 1", "Part 2", "Part 3")
- [ ] No placeholder text ("TODO", "FIXME", "Example")
- [ ] No generic descriptions ("This is a part", "This is a procedure")
- [ ] No fake email addresses (test@example.com)
- [ ] No test data patterns ("Test User", "Sample Data")

```bash
# Search for suspicious patterns
grep -r "Lorem ipsum" /Volumes/UnimogManuals/WIS-Prepared/ && echo "❌ FAKE DATA DETECTED"
grep -r "TODO" /Volumes/UnimogManuals/WIS-Prepared/ && echo "❌ PLACEHOLDER DETECTED"
grep -r "Example" /Volumes/UnimogManuals/WIS-Prepared/ && echo "❌ EXAMPLE DATA DETECTED"
grep -r "Test" /Volumes/UnimogManuals/WIS-Prepared/ | grep -v "test drive" && echo "❌ TEST DATA DETECTED"
```

**❌ REJECT IF**: Any suspicious patterns found

---

## PHASE 6: EXTRACTION REPORT REVIEW

### 6.1 Read Extraction Report

```bash
cat /Volumes/UnimogManuals/WIS-Prepared/extraction_report.md
```

**Verify report includes**:

- [ ] Extraction date/time
- [ ] Source file checksums (SHA256)
- [ ] Table export statistics (rows exported)
- [ ] JSON file creation counts
- [ ] Validation results table
- [ ] Sample data verification (procedure codes, part numbers, bulletins)
- [ ] Quality checks completed
- [ ] Sign-off section

### 6.2 Verify Statistics Match Reality

**Cross-check report claims against actual files**:

```bash
# Compare report claim vs actual count
REPORT_CLAIM=$(grep "Total Procedures:" /Volumes/UnimogManuals/WIS-Prepared/extraction_report.md | awk '{print $3}')
ACTUAL_COUNT=$(find /Volumes/UnimogManuals/WIS-Prepared/*/procedures -name "*.json" | wc -l)

echo "Report claims: $REPORT_CLAIM procedures"
echo "Actually found: $ACTUAL_COUNT procedures"

if [ "$REPORT_CLAIM" -eq "$ACTUAL_COUNT" ]; then
  echo "✓ Counts match"
else
  echo "✗ COUNTS DON'T MATCH - SUSPICIOUS"
fi
```

- [ ] Report claims match actual file counts
- [ ] Report statistics are reasonable (not 999999 procedures)

**❌ REJECT IF**: Report claims don't match reality

---

## PHASE 7: FINAL DECISION

### 7.1 Scoring

**Assign points for each passed check**:
- PHASE 1 (Deliverables): ___/5 points
- PHASE 2 (Source Verification): ___/8 points
- PHASE 3 (Data Format): ___/12 points
- PHASE 4 (Statistical Validation): ___/8 points
- PHASE 5 (Content Quality): ___/7 points
- PHASE 6 (Report Review): ___/5 points

**Total Score**: ___/45 points

### 7.2 Decision Matrix

| Score | Decision |
|-------|----------|
| 45/45 | ✅ **ACCEPT** - Perfect extraction, proceed to import |
| 40-44 | ⚠️ **CONDITIONAL** - Minor issues, request fixes |
| 30-39 | ❌ **REJECT** - Major issues, redo extraction |
| <30   | ❌ **REJECT** - Likely fake data, redo with stricter supervision |

### 7.3 Final Checklist

Before accepting extraction:

- [ ] I have verified source screenshots are real
- [ ] I have verified checksums are provided
- [ ] I have spot-checked 10+ procedure files
- [ ] I have verified Mercedes part number formats
- [ ] I have verified procedure code formats
- [ ] I have checked for AI generation patterns
- [ ] I have verified file counts match expectations
- [ ] I have verified source dates are 2019 (not today)
- [ ] I have reviewed the extraction report
- [ ] I am confident this is REAL Mercedes data (not fake/generated)

**If all boxes checked** → **APPROVED FOR IMPORT**

---

## NEXT STEPS AFTER APPROVAL

1. ✅ Run database cleanup: `docs/wis-project/sql/CLEANUP_FAKE_DATA.sql`
2. ✅ Upload files to Supabase storage bucket: `wis-docs`
3. ✅ Run ETL processor to import data
4. ✅ Test WIS Barry with real queries
5. ✅ Verify search results are real procedures (not fake)

---

## IF EXTRACTION REJECTED

**Send this feedback to Codex**:

```
❌ EXTRACTION REJECTED

Failed Checks:
- [List specific failed checks from this document]

Issues Found:
- [List specific problems: fake part numbers, missing checksums, etc.]

Required Actions:
1. [Specific fix needed]
2. [Specific fix needed]
3. [Specific fix needed]

Please redo extraction following ALL validation rules in CODEX_EXTRACTION_INSTRUCTIONS.md.

Focus on these failed areas and provide proof that data is real (not generated).
```

---

**Version**: 1.0
**Last Updated**: October 13, 2025
**Status**: Ready for Use
