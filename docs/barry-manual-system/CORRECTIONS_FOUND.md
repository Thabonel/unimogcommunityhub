# Translation Table Corrections Found

## Summary
Found **5 CRITICAL CORRECTIONS** needed in the page_map_with_anchors.csv file.

These corrections will fix Barry's PDF linking issues for radiator queries and other technical procedures.

## Corrections Required

### 1. ⚠️ COOLING SYSTEM (Section 06) - **CRITICAL**
**Status**: 🔴 WRONG END PAGE

- **Current**: pages 159-162 (4 pages)
- **Correct**: pages 159-173 (15 pages!)
- **Impact**: Missing pages 163-173 which contain radiator removal procedures (pages 170-171)
- **Fix**: Change `orig_end_page` from 162 → 173

**Why this matters**:
- User query: "how do I replace the radiator"
- Index finds: Page 170 "Removal and installation of radiator"
- Old mapping: Pages 159-162 don't include page 170!
- New mapping: Pages 159-173 includes pages 170-171 ✓

---

### 2. 🔴 AIR FILTER SYSTEM (Section 09)
- **Current**: pages 121-133 (13 pages)
- **Correct**: pages 121-128 (8 pages)
- **Fix**: Change `orig_end_page` from 133 → 128
- **Note**: Pages 129-133 are the start of Electrical System, not Air Filter

---

### 3. 🔴 PEDAL LINKAGE (Section 29)
- **Current**: pages 450-464 (15 pages)
- **Correct**: pages 450-461 (12 pages)
- **Fix**: Change `orig_end_page` from 464 → 461
- **Note**: Pages 462+ belong to different section

---

### 4. 🔴 FRONT SUSPENSION (Section 32)
- **Current**: pages 569-595 (27 pages)
- **Correct**: pages 569-616 (48 pages)
- **Fix**: Change `orig_end_page` from 595 → 616
- **Note**: Missing pages 596-616 which are part of Front Suspension

---

### 5. 🔴 STEERING LS7F (Section 46)
- **Current**: pages 948-965 (18 pages)
- **Correct**: pages 948-966 (19 pages)
- **Fix**: Change `orig_end_page` from 965 → 966
- **Note**: Off by one page

---

## Section-by-Section Verification

✅ **OK** - Sections with CORRECT page ranges:
- 01: General Information (5-16)
- 02: Engine Overview (17-82)
- 07: Fuel System (85-118)
- 08: Exhaust System (136-144)
- 05: Lubrication System (146-156)
- 25: Clutch System (179-185+) - Note: Table says 163-182, but this is complex (overlaps with Cooling + Engine Bearer)
- 10: Transfer Case (281-330)
- 11: PTO Systems (341-355)
- 40: Wheels Prop Shafts (361-375)
- 33: Front Axle (381-410)
- 35: Rear Axle (421-450)
- 12: Front Axle Drive (468-515)
- 13: Rear Axle Drive (521-550)
- 19: Front Wheel Hubs (555-568)
- 17: Rear Suspension (601-640)
- 22: Rear Wheel Hubs (651-660)
- 23: Service Brakes (681-770)
- 24: Parking Brake (781-795)
- 25: Main Hydraulics (801-840)
- 43: Pneumatic Brakes (851-890)
- 18: Steering System (911-930)
- 14: Electrical Wiring (990-1022)
- 32: Advanced Electrical (1026-1039)
- 29: HVAC Heating (1041-1065)
- 27: Cab Structure (1071-1098)
- 42: Hydraulic Mechanical Brakes (1101-1127)
- 41: Eberspacher Heater (1152-1183)

⚠️ **NEEDS INVESTIGATION** - Sections that don't align cleanly:
- 09: Manual Transmission (183-270) - Current table only shows Air Filter as 09
- 09: Air Filter System (121-133) - Both claim section code "09"!

---

## Implementation Plan

1. ✅ **Found corrections** (THIS DOCUMENT)
2. ⏳ **Fix local CSV file** - Apply the 5 corrections above
3. ⏳ **Test locally** - Verify radiator query works
4. ⏳ **Deploy to Supabase** - Replace u435_manual_index table

---

## Test Cases After Fix

These queries should work correctly after applying fixes:

1. "How do I replace the radiator?"
   - Should find pages 170-171 in U435_06_Cooling_System.pdf
   - Old: Would find pages 159-162 (WRONG)
   - New: Will find pages 170-171 (CORRECT) ✓

2. "Air filter maintenance"
   - Should end at page 128, not 133

3. "Front suspension adjustment"
   - Should now find pages 569-616 (not just up to 595)

4. "Steering adjustment"
   - Should end at page 966, not 965
