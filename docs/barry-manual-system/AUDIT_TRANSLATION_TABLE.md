# Translation Table Audit - Complete Verification

## Objective
Verify EVERY index entry in U435 Workshop Manual Volume 1 against the translation table (page_map_with_anchors.csv) to ensure all page mappings are correct.

## Status: IN PROGRESS

### Progress Tracker
- [ ] Section 01 - General Information (pages 5-16)
- [ ] Section 02 - Engine Overview (pages 17-82)
- [ ] Section 07 - Fuel System (pages 85-118)
- [ ] Section 09 - Air Filter System (pages 121-133)
- [ ] Section 08 - Exhaust System (pages 136-144)
- [ ] Section 05 - Lubrication System (pages 146-156)
- [ ] Section 06 - Cooling System (pages 159-173) ← **CRITICAL: Translation table says 159-162, actual is 159-173!**
- [ ] Section 25 - Clutch System (pages 174-182)
- [ ] Section 09 - Manual Transmission (pages 183-270)
- [ ] Section 10 - Transfer Case (pages 281-330)
- [ ] Section 11 - PTO Systems (pages 341-355)
- [ ] Section 40 - Wheels/Prop Shafts (pages 361-375)
- [ ] Section 33 - Front Axle (pages 381-410)
- [ ] Section 35 - Rear Axle (pages 421-450)
- [ ] Section 29 - Pedal Linkage (pages 450-464)
- [ ] Section 12 - Front Axle Drive (pages 468-515)
- [ ] Section 13 - Rear Axle Drive (pages 521-550)
- [ ] Section 19 - Front Wheel Hubs (pages 555-568)
- [ ] Section 32 - Front Suspension (pages 569-595)
- [ ] Section 17 - Rear Suspension (pages 601-640)
- [ ] Section 22 - Rear Wheel Hubs (pages 651-660)
- [ ] Section 23 - Service Brakes (pages 681-770)
- [ ] Section 24 - Parking Brake (pages 781-795)
- [ ] Section 25 - Main Hydraulics (pages 801-840)
- [ ] Section 43 - Pneumatic Brakes (pages 851-890)
- [ ] Section 18 - Steering System (pages 911-930)
- [ ] Section 46 - Steering LS7F (pages 948-965)
- [ ] Section 14 - Electrical Wiring (pages 990-1022)
- [ ] Section 32 - Advanced Electrical (pages 1026-1039)
- [ ] Section 29 - HVAC Heating (pages 1041-1065)
- [ ] Section 27 - Cab Structure (pages 1071-1098)
- [ ] Section 42 - Hydraulic Mechanical Brakes (pages 1101-1127)
- [ ] Section 41 - Eberspacher Heater (pages 1152-1183)

## Findings Log

### SECTION 06 - COOLING SYSTEM ❌ INCORRECT
**Translation Table Claims:**
- Start page: 159
- End page: 162
- Total pages: 4
- Chapter PDF: U435_06_Cooling_System.pdf

**Actual Content in manual_chunks:**
- Starts: Page 159 (Contents Chapter - Cooling System)
- Ends: Page 173 (still showing 20.8 "Checking expansion tank cap for satisfactory operation")
- Total pages: 15 pages (NOT 4!)
- Next section starts: Page 174 (Front engine bearer 22.8)

**Issue:** Translation table is missing pages 163-173 which contain:
- Page 164: Cooling cycle diagram
- Page 166-171: Removal and installation of radiator (THE PROBLEM!)
- Page 172-173: Checking cooling system procedures

**Fix Required:**
- Change end page from 162 → 173

---

## Next Steps
Continue verification section by section, updating this document as we go.

## Test Cases (to verify after fix)
1. Query: "how do I replace the radiator" → Should find pages 170-171
2. Query: "cooling system check" → Should find pages 172-173
3. Query: [add 10 more representative queries]
