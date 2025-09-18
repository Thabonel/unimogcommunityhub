# WIS User Interface Workflows - Detailed Mapping

## Overview
This document maps the exact user interface workflows from the original Mercedes WIS system, showing how mechanics actually used the system to find and execute repair procedures.

## Primary User Workflows

### Workflow 1: Standard Repair Procedure Lookup

#### Step-by-Step User Journey
```
1. Application Launch
   ├── WIS.exe startup
   ├── Database connection verification
   ├── User sees main splash screen with Mercedes branding
   └── Model selection screen appears

2. Model Selection
   ├── User sees grid of available vehicle models
   ├── Models displayed as clickable tiles with images
   ├── User clicks on target model (e.g., "U435")
   └── System loads model-specific database

3. System Navigation
   ├── Left panel: Expandable tree view of vehicle systems
   ├── Systems numbered (01 Engine, 25 Axles, etc.)
   ├── User clicks to expand system category
   └── Sub-systems appear in hierarchical tree

4. Procedure Selection
   ├── User browses through procedure list
   ├── Procedures show brief description and estimated time
   ├── User clicks on specific procedure
   └── Procedure details load in main panel

5. Procedure Execution
   ├── Multi-tab interface appears (Procedure/Tools/Parts/Diagrams)
   ├── Step-by-step instructions with images
   ├── User follows sequential steps
   └── Cross-references to related procedures shown
```

#### Screen Layout During This Workflow
```
┌─────────────────────────────────────────────────────────────┐
│ Mercedes-Benz WIS - U435 Workshop Information              │
├─────────────────┬───────────────────────────────────────────┤
│ System Tree     │ Main Content Panel                        │
│ ├── 01 Engine   │ ┌─── Tabs ───┐                           │
│ ├── 02 Fuel     │ │Proc│Tool│Part│Diag│                    │
│ ├── 03 Cooling  │ ├─────────────────┤                      │
│ ├── 25 Axles ◄  │ │ Step 3 of 12    │                      │
│ │ ├── 25.10 Front│ │                 │                      │
│ │ ├── 25.20 Portal│ │ Remove the hub  │                     │
│ │ └── 25.30 Diff │ │ cover bolts...  │                      │
│ └── 60 Electric │ │                 │                      │
│                 │ │ [Image Here]    │                      │
│                 │ │                 │                      │
│ [Search______]  │ │ ◄ Prev | Next ► │                      │
└─────────────────┴───────────────────────────────────────────┘
```

### Workflow 2: Problem-Based Diagnostic Search

#### User Mental Process
```
Mechanic thinks: "Portal hub is leaking oil"
↓
1. Opens WIS
2. Goes directly to Search box
3. Types "portal hub leak" or "seal replacement"
4. Reviews search results
5. Selects most relevant procedure
6. Follows diagnostic steps to confirm problem
7. Executes repair procedure
```

#### Search Interface Behavior
```
Search Box Location: Top-right of main interface
Search Types Supported:
├── Free text ("portal hub leak")
├── Part numbers ("A 000 330 00 03")
├── Symptom descriptions ("oil leak front axle")
└── System codes ("25.20")

Search Results Display:
┌─────────────────────────────────────────────┐
│ Search Results for: "portal hub seal"      │
├─────────────────────────────────────────────┤
│ ▶ 25.20.02 Replace Portal Hub Seals (2.5h) │
│ ▶ 25.20.03 Portal Hub Adjustment (1.0h)    │
│ ▶ 25.10.05 Front Axle Seal Replacement     │
│ ▶ TB-2019-001 Portal Hub Seal Update       │
└─────────────────────────────────────────────┘
```

### Workflow 3: Parts and Tools Preparation

#### Pre-Work Planning Interface
```
Before Starting Repair:
1. User selects procedure (e.g., "Replace Portal Hub Seals")
2. Clicks "Tools" tab to see required tools
3. Clicks "Parts" tab to see part numbers and quantities
4. May print parts list or tool list
5. Gathers materials before starting work
```

#### Tools Tab Layout
```
┌─────────────────────────────────────────────┐
│ Tools Required - 25.20.02 Portal Hub Seals │
├─────────────────────────────────────────────┤
│ ✓ Standard Tools:                           │
│   • Socket set (8mm - 24mm)               │
│   • Torque wrench (10-150 Nm)             │
│   • Oil drain pan                         │
│                                           │
│ ✓ Special Tools:                          │
│   • Hub puller (Mercedes tool A123456)    │
│   • Seal installation tool (A654321)      │
│   • Portal hub alignment tool (A789012)   │
│                                           │
│ ⚠ Safety Equipment:                       │
│   • Safety glasses                        │
│   • Nitrile gloves                        │
└─────────────────────────────────────────────┘
```

#### Parts Tab Layout
```
┌─────────────────────────────────────────────┐
│ Parts Required - 25.20.02 Portal Hub Seals │
├─────────────────────────────────────────────┤
│ Pos │ Part Number    │ Description     │ Qty │
│ 1   │ A 000 330 00 03│ Oil Seal       │ 2   │
│ 2   │ A 000 330 00 04│ Dust Seal      │ 2   │
│ 3   │ A 000 997 01 47│ O-Ring         │ 1   │
│ 4   │ MB 229.3       │ Portal Hub Oil │ 0.5L│
│ 5   │ A 000 989 25 10│ Gasket         │ 1   │
│                                           │
│ [Print Parts List] [Order Parts] [EPC]    │
└─────────────────────────────────────────────┘
```

### Workflow 4: Cross-Reference Navigation

#### Related Content Discovery
```
While Following Procedure:
├── User sees "Related Procedures" sidebar
├── System automatically suggests:
│   ├── Prerequisite procedures
│   ├── Follow-up procedures
│   ├── Related system procedures
│   └── Recent service bulletins
└── User can click to switch between procedures seamlessly
```

#### Cross-Reference Panel
```
┌─────────────────────────────────────────────┐
│ Related Information                         │
├─────────────────────────────────────────────┤
│ Prerequisites:                              │
│ ▶ 25.20.01 Remove Portal Hub Assembly      │
│                                           │
│ Follow-up:                                  │
│ ▶ 25.20.03 Portal Hub Oil Level Check     │
│ ▶ 25.20.04 Portal Hub Adjustment          │
│                                           │
│ Service Bulletins:                          │
│ ▶ TB-2019-001 Updated Seal Design         │
│ ▶ TB-2020-003 Torque Specification Change │
│                                           │
│ Same Component:                             │
│ ▶ 25.20.05 Portal Hub Bearing Replacement │
└─────────────────────────────────────────────┘
```

## Advanced User Workflows

### Workflow 5: Service Bulletin Integration

#### How Mechanics Found Updates
```
1. System shows notification icon for new bulletins
2. User clicks "Bulletins" tab in any procedure
3. Relevant bulletins automatically filtered for current procedure
4. User sees modification instructions
5. System shows if procedure has been superseded
```

### Workflow 6: Diagnostic Troubleshooting

#### Problem Diagnosis Workflow
```
Starting Point: Vehicle symptom
├── 1. Search by symptom ("hub noise")
├── 2. System shows diagnostic tree
├── 3. User follows decision tree:
│   ├── "Noise during turning?" → Yes/No
│   ├── "Noise when braking?" → Yes/No
│   └── "Oil leakage visible?" → Yes/No
├── 4. System narrows down to specific procedures
└── 5. User executes recommended diagnostic steps
```

### Workflow 7: Multi-Procedure Complex Repairs

#### Large Repair Job Management
```
Example: Complete Axle Overhaul
├── 1. User accesses main procedure (25.10.01 Axle Removal)
├── 2. System shows "Related Procedures" automatically
├── 3. User can bookmark multiple related procedures:
│   ├── 25.20.02 Portal Hub Seals
│   ├── 25.30.01 Differential Service
│   ├── 25.40.01 Brake Service
│   └── 25.10.02 Axle Installation
├── 4. Bookmark tab shows all saved procedures
└── 5. User follows logical sequence with quick switching
```

## User Interface States and Transitions

### State 1: Application Startup
```
Initial State → Model Selection
├── Loading screen (2-3 seconds)
├── Database connectivity check
├── User sees model grid
└── Click triggers: State 2
```

### State 2: Model Selected
```
Model Selection → System Browser
├── Left panel: System tree loads
├── Main panel: Welcome/overview
├── Search box: Active
└── Tree click triggers: State 3
```

### State 3: System Category Open
```
System Browser → Procedure List
├── Left panel: Expanded system tree
├── Main panel: Procedure list for system
├── Procedure details: Preview on hover
└── Procedure click triggers: State 4
```

### State 4: Procedure Active
```
Procedure List → Active Procedure
├── Left panel: Tree remains (with current position highlighted)
├── Main panel: Multi-tab procedure interface
├── Tabs: Procedure/Tools/Parts/Diagrams/Bulletins
└── Navigation: Previous/Next step controls
```

### State 5: Cross-Reference Navigation
```
Active Procedure → Related Procedure
├── Related content panel always visible
├── Click on related item opens in new tab OR replaces current
├── Breadcrumb trail shows navigation path
└── "Back" function returns to previous procedure
```

## Key Interface Design Principles Observed

### 1. Spatial Consistency
- Tree navigation always on left
- Main content always in center
- Related content always on right
- Tool/status bars always at top/bottom

### 2. Progressive Disclosure
- Show overview first, details on demand
- Expand categories only when clicked
- Load images only when step is active
- Pre-load next step for smooth navigation

### 3. Context Preservation
- Always show current location in system tree
- Breadcrumb navigation for complex paths
- Recently viewed procedures list
- Bookmark system for frequent procedures

### 4. Visual Hierarchy
- System numbers (25) larger than subsystem (25.20)
- Procedure titles larger than descriptions
- Current step highlighted differently
- Required vs. optional information clearly distinguished

### 5. Error Prevention
- Confirm before leaving unsaved notes
- Warn when jumping to unrelated procedures
- Validate part numbers when possible
- Show prerequisites before allowing procedure start

## Mobile/Touch Considerations for Modern Implementation

### Original Desktop Optimizations to Adapt
```
Desktop Interface → Modern Web Interface
├── Tree navigation → Collapsible mobile menu
├── Multi-tab layout → Swipe gestures or accordion
├── Hover previews → Touch/tap to preview
├── Right-click menus → Long-press actions
└── Keyboard shortcuts → Gesture shortcuts
```

### Workshop Environment Considerations
- Large buttons for gloved hands
- High contrast for bright workshop lighting
- Offline capability for poor connectivity
- Quick access to frequently used procedures
- Voice search for hands-free operation

This comprehensive workflow mapping shows exactly how mechanics used the original WIS system, providing the blueprint for creating an authentic modern implementation.