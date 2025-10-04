# Unimog Track Compatibility System

## Problem Statement
Standard difficulty ratings (easy/moderate/difficult/extreme) don't answer the critical questions Unimog owners need:
- **Will my Unimog physically FIT?** (width, height, wheelbase)
- **Will my expedition camper clear overhead obstacles?**
- **Can a long wheelbase touring rig make the turns?**
- **Are there low branches that will destroy my roof tent?**

## Solution: Unimog-Specific Track Attributes

---

## Database Schema Extensions

### 1. Extend `tracks` table
```sql
ALTER TABLE tracks ADD COLUMN IF NOT EXISTS
  -- Width constraints
  min_track_width_m numeric(4,2), -- Narrowest section in meters
  min_width_location text, -- Description of where narrow section is

  -- Height constraints
  min_overhead_clearance_m numeric(4,2), -- Lowest overhead obstacle in meters
  min_clearance_location text, -- Where the low obstacle is
  low_branches boolean DEFAULT false, -- General low branch warning

  -- Wheelbase constraints
  max_wheelbase_m numeric(4,2), -- Maximum wheelbase that can navigate
  tight_turns boolean DEFAULT false, -- Has tight turns requiring short WB

  -- Ground clearance
  min_ground_clearance_cm integer, -- Minimum clearance needed

  -- Weight/surface
  soft_ground boolean DEFAULT false, -- Soft sand/mud sections
  bridge_weight_limit_kg integer, -- If there are weight-limited bridges

  -- Unimog suitability (calculated from community data)
  suitable_for_short_wb boolean DEFAULT true,
  suitable_for_long_wb boolean DEFAULT true,
  suitable_for_expedition boolean DEFAULT true,

  -- Last updated
  compatibility_last_updated timestamptz;
```

### 2. New `unimog_compatibility_reports` table
```sql
CREATE TABLE unimog_compatibility_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  track_id uuid REFERENCES tracks(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,

  -- Vehicle details
  unimog_model text NOT NULL, -- 'U1300L', 'U1700L', 'U2450L', etc.
  wheelbase_cm integer NOT NULL, -- Actual wheelbase in cm
  total_height_cm integer NOT NULL, -- Overall height with camper/body
  total_width_cm integer, -- Overall width
  ground_clearance_cm integer,

  -- Body/camper type
  body_type text, -- 'flatbed', 'box_camper', 'popup_camper', 'roof_tent', etc.
  camper_manufacturer text, -- 'Bliss Mobil', 'EarthCruiser', etc.

  -- Fit report
  successfully_completed boolean NOT NULL, -- Did they make it through?

  -- Width issues
  narrowest_section_width_m numeric(4,2), -- Measured or estimated
  width_tight boolean DEFAULT false, -- Was width tight?
  width_issue_location text, -- "Between large boulders at km 5"
  scraped_sides boolean DEFAULT false, -- Did vehicle scrape?

  -- Height issues
  lowest_overhead_m numeric(4,2), -- Measured or estimated
  height_tight boolean DEFAULT false, -- Was height tight?
  height_issue_location text, -- "Low branches km 12-15"
  hit_overhead boolean DEFAULT false, -- Did vehicle hit something?
  overhead_damage text, -- Description if damaged

  -- Turning radius issues
  wheelbase_issue boolean DEFAULT false, -- Wheelbase too long?
  required_reversing boolean DEFAULT false, -- Had to reverse at turns?
  turning_issue_location text, -- "Sharp switchback at km 8"

  -- Ground clearance issues
  ground_contact boolean DEFAULT false, -- Belly scraped?
  clearance_issue_location text,

  -- Recommendations
  recommended_vehicle_type text, -- 'short_wb_only', 'any_unimog', 'expedition_ok'
  notes text, -- General observations
  photos jsonb, -- Array of photo URLs

  -- When
  driven_date date NOT NULL,
  weather_conditions text, -- 'dry', 'wet', 'muddy'

  -- Community feedback
  helpful_count integer DEFAULT 0,

  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX idx_compatibility_track ON unimog_compatibility_reports(track_id);
CREATE INDEX idx_compatibility_model ON unimog_compatibility_reports(unimog_model);
CREATE INDEX idx_compatibility_body ON unimog_compatibility_reports(body_type);
```

### 3. Unimog models reference table
```sql
CREATE TABLE unimog_models (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  model text UNIQUE NOT NULL, -- 'U1300L', 'U1700L', etc.
  series text, -- '406', '435', '437', etc.
  typical_wheelbase_cm integer,
  typical_height_cm integer, -- Stock vehicle
  typical_width_cm integer,
  typical_clearance_cm integer,
  production_years text, -- '1988-2000'
  is_common boolean DEFAULT true, -- Show in dropdowns
  created_at timestamptz DEFAULT now()
);

-- Pre-populate common models
INSERT INTO unimog_models (model, series, typical_wheelbase_cm, typical_height_cm, typical_width_cm, typical_clearance_cm, production_years, is_common) VALUES
  ('U1300L', '435', 290, 280, 220, 40, '1988-2000', true),
  ('U1700L', '437', 385, 300, 220, 45, '2000-2013', true),
  ('U2450L', '437', 385, 310, 240, 45, '2000-2013', true),
  ('U4000', '437', 385, 310, 240, 45, '2000-2013', true),
  ('U5000', '437', 385, 310, 240, 50, '2000-2013', true),
  ('U400', '405', 280, 260, 210, 38, '1975-1988', true),
  ('U1000', '406', 290, 270, 220, 40, '1975-1988', true),
  ('U1600', '406', 290, 280, 220, 40, '1975-1988', true);
```

---

## UI Components

### 1. Track Detail Modal - Compatibility Section

```
┌─────────────────────────────────────────────────┐
│  🚜 Unimog Compatibility                         │
├─────────────────────────────────────────────────┤
│                                                  │
│  ✅ Suitable For:                                │
│  • Short wheelbase Unimogs (U1300L, U400)       │
│  • Medium wheelbase (U1700L, U2450L)            │
│                                                  │
│  ⚠️  Challenging For:                            │
│  • Long expedition campers (4m+ height)         │
│    └─ Low branches km 12-15 (3.2m clearance)   │
│                                                  │
│  ❌ Not Recommended:                             │
│  • Wide bodies (>2.4m)                          │
│    └─ Narrowest section: 2.2m at rocky pass    │
│                                                  │
├─────────────────────────────────────────────────┤
│  📏 Track Specifications                         │
│                                                  │
│  Width:                                          │
│  ├─ Minimum: 2.2m (km 8.3)                      │
│  ├─ Typical: 3.5-4m                             │
│  └─ Tight sections: 3 locations                 │
│                                                  │
│  Height:                                         │
│  ├─ Minimum overhead: 3.2m (km 12-15)           │
│  ├─ Low branches: Yes (multiple sections)       │
│  └─ Can trim: Some (not all)                    │
│                                                  │
│  Turning Radius:                                 │
│  ├─ Wheelbase limit: <3.5m recommended          │
│  ├─ Tight turns: 2 switchbacks                  │
│  └─ Reversing may be required for long WB       │
│                                                  │
│  Ground Clearance:                               │
│  ├─ Minimum: 35cm required                      │
│  ├─ Rock steps: Multiple sections               │
│  └─ Belly scrapes possible if <40cm             │
│                                                  │
├─────────────────────────────────────────────────┤
│  💬 Recent Compatibility Reports (8)             │
│                                                  │
│  ┌───────────────────────────────────────────┐ │
│  │ davidwswitt - 3 days ago                  │ │
│  │ U1700L + Bliss Mobil camper (4.2m height) │ │
│  │ ✅ Completed successfully                 │ │
│  │                                            │ │
│  │ Width: ✅ No issues (narrowest 2.2m)      │ │
│  │ Height: ⚠️  Tight at km 13 (branches)     │ │
│  │ "Had to trim small branches. Major limbs  │ │
│  │ cleared at 3.2m. Careful navigation."     │ │
│  │                                            │ │
│  │ [📸 3 photos] 👍 12 helpful                │ │
│  └───────────────────────────────────────────┘ │
│                                                  │
│  ┌───────────────────────────────────────────┐ │
│  │ tidesend - 1 week ago                     │ │
│  │ U2450L flatbed (2.8m height)              │ │
│  │ ✅ No issues                              │ │
│  │                                            │ │
│  │ Width: ✅ Plenty of room                  │ │
│  │ Height: ✅ No concerns                    │ │
│  │ Wheelbase: ⚠️  Required reversing once    │ │
│  │ "Tight switchback at km 8.3 needed        │ │
│  │ 3-point turn with 3.85m wheelbase."       │ │
│  │                                            │ │
│  │ [📸 1 photo] 👍 8 helpful                  │ │
│  └───────────────────────────────────────────┘ │
│                                                  │
│  ┌───────────────────────────────────────────┐ │
│  │ unimog_adventurer - 2 weeks ago           │ │
│  │ U400 + roof tent (2.9m height)            │ │
│  │ ✅ Perfect fit                            │ │
│  │                                            │ │
│  │ "Short wheelbase ideal for this track.    │ │
│  │ Tight turns no problem. Height perfect."  │ │
│  │                                            │ │
│  │ 👍 5 helpful                               │ │
│  └───────────────────────────────────────────┘ │
│                                                  │
│  [View All Reports]                              │
│                                                  │
├─────────────────────────────────────────────────┤
│  ✏️ Add Your Compatibility Report               │
│  [Add Report] [Upload Photos]                   │
└─────────────────────────────────────────────────┘
```

### 2. Compatibility Report Form

```
┌─────────────────────────────────────────────────┐
│  Add Unimog Compatibility Report                │
│  Watagan Forest Rd / Dr                         │
├─────────────────────────────────────────────────┤
│                                                  │
│  🚜 Your Vehicle                                 │
│                                                  │
│  Unimog Model: [Dropdown]                       │
│  ├─ U1300L (WB: 2.9m) ●                         │
│  ├─ U1700L (WB: 3.85m)                          │
│  ├─ U2450L (WB: 3.85m)                          │
│  └─ Other... [Custom]                           │
│                                                  │
│  Wheelbase: [290] cm (auto-filled)              │
│                                                  │
│  Body/Camper Type:                               │
│  [○ Flatbed  ● Box Camper  ○ Popup  ○ Roof Tent]│
│                                                  │
│  If camper, manufacturer:                        │
│  [Dropdown: Bliss Mobil, EarthCruiser, DIY...]  │
│                                                  │
│  Total height: [420] cm (include camper)        │
│  Total width:  [240] cm                         │
│  Ground clearance: [45] cm                      │
│                                                  │
├─────────────────────────────────────────────────┤
│  📅 When & Conditions                            │
│                                                  │
│  Date driven: [2025-01-04]                      │
│  Weather: [○ Dry  ● Wet  ○ Muddy  ○ Snow]      │
│                                                  │
├─────────────────────────────────────────────────┤
│  ✅ Did you complete the track?                  │
│  [● Yes  ○ No, turned back]                     │
│                                                  │
├─────────────────────────────────────────────────┤
│  📏 WIDTH Issues                                 │
│                                                  │
│  Was width tight anywhere?                       │
│  [○ No issues  ● Yes, tight  ○ Too narrow]     │
│                                                  │
│  If yes, narrowest section width: [2.2] m       │
│  Location: [Text: "Between large boulders       │
│             around km 8.3"]                      │
│                                                  │
│  Did vehicle scrape sides?                       │
│  [○ No  ● Yes, minor  ○ Yes, significant]      │
│                                                  │
├─────────────────────────────────────────────────┤
│  📐 HEIGHT Issues                                │
│                                                  │
│  Was overhead clearance tight?                   │
│  [○ No issues  ● Yes, tight  ○ Hit obstacles]  │
│                                                  │
│  If yes, lowest clearance: [3.2] m              │
│  Location: [Text: "Low branches km 12-15,       │
│             had to trim small ones"]             │
│                                                  │
│  Did you hit overhead obstacles?                 │
│  [○ No  ● Minor branches  ○ Major damage]      │
│                                                  │
│  Damage description (if any):                    │
│  [Text: "Minor scratches on roof, nothing       │
│          structural. Trimmed what we could."]    │
│                                                  │
├─────────────────────────────────────────────────┤
│  🔄 TURNING Radius Issues                        │
│                                                  │
│  Did wheelbase cause problems?                   │
│  [● No  ○ Tight turns  ○ Couldn't complete]    │
│                                                  │
│  Required reversing/3-point turns?               │
│  [○ No  ● Yes (1-2 times)  ○ Yes (many times)] │
│                                                  │
│  Location: [Text: "One tight switchback at km   │
│             8.3, but manageable"]                │
│                                                  │
├─────────────────────────────────────────────────┤
│  🪨 GROUND Clearance Issues                      │
│                                                  │
│  Belly/differential contact?                     │
│  [● No  ○ Minor scrapes  ○ Significant]        │
│                                                  │
│  Location (if yes): [Text field]                │
│                                                  │
├─────────────────────────────────────────────────┤
│  💡 Recommendation                               │
│                                                  │
│  Who is this track suitable for?                 │
│  [● Any Unimog  ○ Short WB only  ○ Low rigs only]│
│                                                  │
│  Additional notes:                               │
│  [Textarea: "Great trail for expedition rigs.   │
│   Height is the only concern - know where the   │
│   low sections are and scout ahead if needed.   │
│   Absolutely doable with 4m+ camper but         │
│   requires careful navigation km 12-15."]        │
│                                                  │
├─────────────────────────────────────────────────┤
│  📸 Photos (optional but very helpful!)          │
│                                                  │
│  [Upload Photos]                                 │
│  • Narrowest sections                            │
│  • Low overhead obstacles                        │
│  • Tight turns                                   │
│  • Your Unimog on the trail                     │
│                                                  │
│  [+ Add Photo] [+ Add Photo] [+ Add Photo]      │
│                                                  │
├─────────────────────────────────────────────────┤
│  [Cancel]               [Submit Report]          │
└─────────────────────────────────────────────────┘
```

### 3. Track List Filtering

Add filter options in sidebar:
```
┌─────────────────────────────────────────────────┐
│  🔍 Filter Tracks                                │
├─────────────────────────────────────────────────┤
│  My Vehicle Setup:                               │
│                                                  │
│  Model: [U1700L ▼]                              │
│  Height: [420] cm (with camper)                 │
│  Width: [240] cm                                │
│  Wheelbase: [385] cm                            │
│                                                  │
│  Show only compatible tracks: [✓]               │
│                                                  │
│  ⚠️  Show tracks with:                           │
│  [ ] Height concerns                             │
│  [ ] Width concerns                              │
│  [ ] Wheelbase concerns                          │
│  [✓] All compatible                             │
│                                                  │
├─────────────────────────────────────────────────┤
│  Results: 23 tracks (16 filtered out)           │
└─────────────────────────────────────────────────┘
```

---

## Smart Compatibility Calculation

### Algorithm:
```typescript
function calculateTrackCompatibility(
  track: Track,
  vehicle: {
    model: string,
    height_cm: number,
    width_cm: number,
    wheelbase_cm: number
  }
): CompatibilityResult {

  const reports = await getCompatibilityReports(track.id);

  // Find similar vehicles
  const similarReports = reports.filter(r =>
    Math.abs(r.total_height_cm - vehicle.height_cm) < 50 &&
    Math.abs(r.wheelbase_cm - vehicle.wheelbase_cm) < 50
  );

  // Width check
  let widthStatus = 'unknown';
  if (track.min_track_width_m) {
    const vehicleWidthM = vehicle.width_cm / 100;
    const clearance = track.min_track_width_m - vehicleWidthM;

    if (clearance < 0) widthStatus = 'too_wide';
    else if (clearance < 0.2) widthStatus = 'very_tight';
    else if (clearance < 0.5) widthStatus = 'tight';
    else widthStatus = 'ok';
  }

  // Height check
  let heightStatus = 'unknown';
  if (track.min_overhead_clearance_m) {
    const vehicleHeightM = vehicle.height_cm / 100;
    const clearance = track.min_overhead_clearance_m - vehicleHeightM;

    if (clearance < 0) heightStatus = 'too_tall';
    else if (clearance < 0.1) heightStatus = 'very_tight';
    else if (clearance < 0.3) heightStatus = 'tight';
    else heightStatus = 'ok';
  }

  // Wheelbase check
  let wheelbaseStatus = 'unknown';
  if (track.max_wheelbase_m) {
    const vehicleWheelbaseM = vehicle.wheelbase_cm / 100;

    if (vehicleWheelbaseM > track.max_wheelbase_m) {
      wheelbaseStatus = 'too_long';
    } else if (vehicleWheelbaseM > track.max_wheelbase_m - 0.5) {
      wheelbaseStatus = 'tight_turns';
    } else {
      wheelbaseStatus = 'ok';
    }
  }

  // Success rate from similar vehicles
  const successfulSimilar = similarReports.filter(r =>
    r.successfully_completed
  );
  const successRate = similarReports.length > 0
    ? (successfulSimilar.length / similarReports.length) * 100
    : null;

  // Overall compatibility
  const issues = [];
  if (widthStatus === 'too_wide') issues.push('width');
  if (heightStatus === 'too_tall') issues.push('height');
  if (wheelbaseStatus === 'too_long') issues.push('wheelbase');

  let overall = 'compatible';
  if (issues.length > 0) overall = 'incompatible';
  else if (
    widthStatus === 'very_tight' ||
    heightStatus === 'very_tight' ||
    wheelbaseStatus === 'tight_turns'
  ) overall = 'challenging';

  return {
    overall,
    issues,
    widthStatus,
    heightStatus,
    wheelbaseStatus,
    successRate,
    similarReports: similarReports.length,
    warnings: generateWarnings(track, vehicle, reports)
  };
}

function generateWarnings(track, vehicle, reports) {
  const warnings = [];

  // Specific warnings based on reports
  const heightIssues = reports.filter(r => r.height_issue_location);
  if (heightIssues.length > 0 && vehicle.height_cm > 350) {
    warnings.push({
      type: 'height',
      severity: 'warning',
      message: `${heightIssues.length} users reported low branches. Locations: ${
        heightIssues.map(r => r.height_issue_location).join(', ')
      }`
    });
  }

  // Add more warning logic...

  return warnings;
}
```

---

## Display Icons & Colors

### Compatibility Status Icons:
```typescript
const statusIcons = {
  compatible: '✅',
  challenging: '⚠️',
  incompatible: '❌',
  unknown: '❓'
};

const statusColors = {
  compatible: 'text-green-600',
  challenging: 'text-yellow-600',
  incompatible: 'text-red-600',
  unknown: 'text-gray-400'
};
```

### Track List Display:
```
Watagan Forest Rd / Dr
✅ U1700L compatible  ⚠️  4m+ campers (low branches)
47.13 km • Difficult • 23 reports
```

---

## Implementation Plan

### Phase 1: Data Collection (Week 1-2)
```sql
-- Migration files to create
20250105_create_unimog_compatibility_tables.sql
20250105_populate_unimog_models.sql
20250105_extend_tracks_compatibility.sql
```

**Tasks:**
1. Create database tables
2. Populate unimog_models reference data
3. Create RLS policies
4. Build compatibility report form component
5. Deploy and start collecting data

### Phase 2: Display & Calculation (Week 3)
1. Build track compatibility display section
2. Implement compatibility calculation algorithm
3. Add filtering by vehicle specs
4. Show compatibility badges in track list

### Phase 3: Community Features (Week 4)
1. Photo uploads for compatibility reports
2. Helpful voting on reports
3. Similar vehicle filtering
4. Email notifications for new reports on saved tracks

---

## Example Migration File

```sql
-- 20250105_create_unimog_compatibility_tables.sql

CREATE TABLE unimog_models (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  model text UNIQUE NOT NULL,
  series text,
  typical_wheelbase_cm integer,
  typical_height_cm integer,
  typical_width_cm integer,
  typical_clearance_cm integer,
  production_years text,
  is_common boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE unimog_compatibility_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  track_id uuid REFERENCES tracks(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,

  unimog_model text NOT NULL,
  wheelbase_cm integer NOT NULL,
  total_height_cm integer NOT NULL,
  total_width_cm integer,
  ground_clearance_cm integer,

  body_type text,
  camper_manufacturer text,

  successfully_completed boolean NOT NULL,

  narrowest_section_width_m numeric(4,2),
  width_tight boolean DEFAULT false,
  width_issue_location text,
  scraped_sides boolean DEFAULT false,

  lowest_overhead_m numeric(4,2),
  height_tight boolean DEFAULT false,
  height_issue_location text,
  hit_overhead boolean DEFAULT false,
  overhead_damage text,

  wheelbase_issue boolean DEFAULT false,
  required_reversing boolean DEFAULT false,
  turning_issue_location text,

  ground_contact boolean DEFAULT false,
  clearance_issue_location text,

  recommended_vehicle_type text,
  notes text,
  photos jsonb,

  driven_date date NOT NULL,
  weather_conditions text,

  helpful_count integer DEFAULT 0,

  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE tracks ADD COLUMN IF NOT EXISTS
  min_track_width_m numeric(4,2),
  min_width_location text,
  min_overhead_clearance_m numeric(4,2),
  min_clearance_location text,
  low_branches boolean DEFAULT false,
  max_wheelbase_m numeric(4,2),
  tight_turns boolean DEFAULT false,
  min_ground_clearance_cm integer,
  suitable_for_short_wb boolean DEFAULT true,
  suitable_for_long_wb boolean DEFAULT true,
  suitable_for_expedition boolean DEFAULT true,
  compatibility_last_updated timestamptz;

CREATE INDEX idx_compatibility_track ON unimog_compatibility_reports(track_id);
CREATE INDEX idx_compatibility_model ON unimog_compatibility_reports(unimog_model);
```

---

## Next Steps

Ready to implement? I'll create:
1. ✅ Database migrations (compatibility tables)
2. ✅ Compatibility report form component
3. ✅ Track detail modal with compatibility section
4. ✅ Vehicle profile settings (save your Unimog specs)
5. ✅ Filtering system

This will make your platform THE go-to resource for Unimog trail planning!
