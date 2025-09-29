# U435 Maintenance Manual Splitting Plan
*Using Same Foolproof Methodology as Repair Manual*

## Files That NEED Splitting (Large/Multi-Topic)

### 🔴 CRITICAL - Must Split:
1. **00 - General.pdf** (35MB)
   - Likely contains: Introduction, specifications, safety, general procedures
   - **Action**: Split into logical sections based on content

2. **60 - Body.pdf** (17MB)
   - Likely contains: Cab, doors, windows, seats, bodywork
   - **Action**: Split by body component

3. **42 - Brakes - Hydraulic + Mechanical.pdf** (11MB)
   - Contains: Two different brake systems
   - **Action**: Split into hydraulic and mechanical sections

4. **55 - Special Equipment.pdf** (8.3MB)
   - Contains: Multiple equipment types
   - **Action**: Split by equipment type

### 🟡 MEDIUM - Consider Splitting:
5. **13 - Air Compressor + Belts.pdf** (8.3MB)
   - Contains: Air compressor AND belt systems
   - **Action**: Could split into compressor vs belts

## Files To Keep As-Is (Single Topic)

✅ **Small Maintenance Files** (2-5MB each):
- 01 - Engine Housing.pdf
- 05 - Engine Timing.pdf
- 07 - Fuel Injectors.pdf
- 09 - Air Filter.pdf
- 18 - Engine Lubrication.pdf
- 24 - Engine Mounts.pdf
- 25 - Clutch.pdf
- 26 - Transmission.pdf
- 29 - Pedal Linkage.pdf
- 31 - Frame.pdf
- 32 - Suspension.pdf
- 33 - Front Axle.pdf
- 35 - Rear Axle.pdf
- 40 - Wheels + Prop Shafts.pdf
- 43 - Brakes - Pneumatic.pdf
- 46 - Steering.pdf
- 49 - Exhaust.pdf
- 50 - Cooling System.pdf
- 54 - Batteries.pdf
- 82 - Headlights.pdf

## Recommended Approach

### Phase 1: Quick Deploy (Keep Large Files)
- Upload all files as-is with U435_Maint_ prefix
- Get Barry working with maintenance knowledge immediately
- Split large files later when we have time

### Phase 2: Proper Splitting (Foolproof Method)
1. **Manually review the 4 large files**
2. **Create maintenance_chapters.csv** with proper boundaries
3. **Extract content anchors** for validation
4. **Use foolproof splitter** with same methodology
5. **Replace large files** with properly split sections

## Database Integration Strategy

### For Now (Phase 1):
```sql
-- Add large files as single units
INSERT INTO u435_manual_index (term, chapter_filename, system_category)
VALUES
('general maintenance', 'U435_Maint_00_General.pdf', 'general'),
('body maintenance', 'U435_Maint_60_Body.pdf', 'body'),
('brake maintenance', 'U435_Maint_42_Brakes_Hydraulic_Mechanical.pdf', 'brakes');
```

### After Splitting (Phase 2):
```sql
-- Replace with granular sections
('general specifications', 'U435_Maint_00_General_Specs.pdf', 'general'),
('safety procedures', 'U435_Maint_00_General_Safety.pdf', 'general'),
('cab maintenance', 'U435_Maint_60_Body_Cab.pdf', 'body'),
('door maintenance', 'U435_Maint_60_Body_Doors.pdf', 'body'),
('hydraulic brake maintenance', 'U435_Maint_42_Brakes_Hydraulic.pdf', 'brakes'),
('mechanical brake maintenance', 'U435_Maint_42_Brakes_Mechanical.pdf', 'brakes');
```

## Immediate Action Plan

1. ✅ **Upload all maintenance files as-is** (U435_Maint_ prefix)
2. ✅ **Add database entries** for Barry to use them
3. ✅ **Test Barry** with maintenance questions
4. ⏳ **Plan proper splitting** of the 4 large files later

This gets Barry working with maintenance knowledge immediately while preserving the option to improve granularity later using the same foolproof methodology.