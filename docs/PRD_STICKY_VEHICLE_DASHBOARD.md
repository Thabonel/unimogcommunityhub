# Product Requirements Document
## Sticky Vehicle Dashboard

**Document Version**: 2.0
**Date**: January 7, 2026
**Author**: Product Team
**Status**: Partially Implemented (Sprints 1-4 Complete)
**Stakeholders**: Engineering, Design, QA, Marketing

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Implementation Status](#2-implementation-status)
3. [Problem Statement](#3-problem-statement)
4. [Goals & Success Metrics](#4-goals--success-metrics)
5. [User Personas](#5-user-personas)
6. [Completed Features](#6-completed-features)
7. [Remaining Features](#7-remaining-features)
8. [Technical Architecture](#8-technical-architecture)
9. [Data Models](#9-data-models)
10. [UI/UX Specifications](#10-uiux-specifications)
11. [Security & Privacy](#11-security--privacy)
12. [Testing Strategy](#12-testing-strategy)
13. [Rollout Plan](#13-rollout-plan)
14. [Risks & Mitigations](#14-risks--mitigations)
15. [Dependencies](#15-dependencies)
16. [Appendix](#16-appendix)

---

## 1. Executive Summary

### 1.1 Vision

Transform the UnimogCommunityHub vehicle dashboard from a basic stats display into **the stickiest vehicle tracking experience in the world** - one that users cannot imagine living without.

### 1.2 Progress Overview

| Phase | Status | Description |
|-------|--------|-------------|
| Foundation | COMPLETE | Dashboard surfacing, onboarding lock-in |
| Barry Memory | COMPLETE | Conversation persistence, vehicle personalization |
| Frictionless Logging | PENDING | FAB, offline queue, instant feedback |
| Engagement | PENDING | Streaks, insights, community comparison |
| Data Fortress | PENDING | Value visualization, export, milestones |

### 1.3 Key Differentiators

| Competitor Approach | Our Approach |
|---------------------|--------------|
| Generic insights | Barry AI with vehicle-specific personality (IMPLEMENTED) |
| Online-only logging | Offline-first for expedition users (PLANNED) |
| Forced social features | Privacy-first with tiered opt-in (PLANNED) |
| Gamification for its own sake | Psychological triggers tied to real value (PLANNED) |

---

## 2. Implementation Status

### 2.1 Completed Work

#### Sprint 1: Dashboard Surfacing (COMPLETE)
- VehicleStatsCard component with stats grid
- Quick-add buttons (+Log Fuel, +Log Service)
- Link to full vehicle dashboard
- Basic fuel efficiency and service date display

#### Sprint 2: Onboarding Lock-in (COMPLETE)
- Required vehicle selection during signup
- No skip option - vehicle must be added
- UnimogModelSelector component with model database
- Profile setup flow with vehicle details

#### Sprint 3: Barry Memory (COMPLETE)
- `user_barry_conversations` database table
- Conversation persistence across sessions
- useSimpleBarry hook with history management
- Load/save conversation functionality

#### Sprint 4: Barry Vehicle Personalization (COMPLETE)
- Edge function `chat-with-barry-agentic` v76 deployed
- Vehicle context gatherer pattern implemented
- Barry greets users by vehicle model
- Personalized responses based on vehicle specs

### 2.2 Gap Analysis: Current vs Target

| Feature | Current State | Target State | Priority |
|---------|--------------|--------------|----------|
| FAB (2-tap logging) | Missing | 2-tap from anywhere | P0 |
| Offline-first (IndexedDB) | Missing | Log without internet | P0 |
| Instant feedback with insights | Missing | Variable rewards | P0 |
| Streak system | Missing | Loss aversion | P1 |
| Hero metric display | Partial | Prominent with trends | P1 |
| Barry insight engine | Missing | Variable insights | P1 |
| Community comparison | Missing | Privacy-first social | P2 |
| Achievement system | Missing | Gamification | P2 |
| Data fortress visualization | Missing | Value lock-in | P3 |

---

## 3. Problem Statement

### 3.1 Current State

The existing VehicleStatsCard provides:
- Basic stats grid (fuel efficiency, distance, service dates)
- Quick add buttons for fuel and maintenance
- Link to full dashboard
- Barry conversation persistence

**Remaining Gaps**:

| Gap | Impact | Priority |
|-----|--------|----------|
| 6+ taps to log fuel | Users abandon mid-action | P0 |
| No streak tracking | Loss aversion never activates | P1 |
| No variable rewards | Predictable = boring | P1 |
| No offline support | Unusable in expedition scenarios | P0 |
| No community comparison | Missing social proof | P2 |

### 3.2 User Pain Points

**Expedition User (Hans)**:
> "I'm in the middle of Morocco. I want to log my fuel, but there's no signal. By the time I'm back online, I've forgotten the details."

**Data-Oriented User (Maria)**:
> "I've logged 20 fill-ups but I still don't know if my consumption is normal for a U1300L. The app tells me nothing useful."

**Privacy-Conscious User (Klaus)**:
> "I don't want my vehicle data shared with anyone. Period. If I see a leaderboard I didn't ask for, I'm deleting the app."

---

## 4. Goals & Success Metrics

### 4.1 Primary Goals

| Goal | Metric | Current | Target | Sprint |
|------|--------|---------|--------|--------|
| Reduce friction | Taps to log fuel | 6+ | 2-4 | Sprint 5 |
| Trigger aha moment | Time to first insight | Never | <5 min | Sprint 7 |
| Activate loss aversion | Users with 7+ day streak | 0% | 25% | Sprint 6 |
| Build data fortress | Users with 50+ logs | ~5% | 20% | Sprint 9 |
| Enable community | Opt-in to comparison | 0% | 30% | Sprint 8 |

### 4.2 Retention Metrics

| Metric | Current (Est.) | Target |
|--------|----------------|--------|
| Day 1 Retention | ~20% | 40% |
| Day 7 Retention | ~8% | 30% |
| Day 30 Retention | ~5% | 15% |

### 4.3 North Star Metric

**"Lifer" Conversion Rate**: Percentage of users who become long-term trackers (50+ logs over 6+ months).

Target: 10% of new users become "lifers" within 6 months.

---

## 5. User Personas

### 5.1 The Expedition Overlander (Primary)

**Name**: Hans, 45
**Vehicle**: 1998 U1300L with portal axles

**Needs**:
- Offline-first logging (Sprint 5)
- Predictive maintenance alerts (Sprint 7)
- Fuel consumption for trip planning (Sprint 7)
- Export for insurance/resale (Sprint 9)

### 5.2 The Technical Enthusiast (Secondary)

**Name**: Maria, 38
**Vehicle**: 2010 U500 Expedition

**Needs**:
- Detailed trend analysis (Sprint 7)
- Comparison to similar vehicles (Sprint 8)
- Technical insights from Barry (IMPLEMENTED)
- Achievement recognition (Sprint 6)

### 5.3 The Casual Owner (Tertiary)

**Name**: Klaus, 52
**Vehicle**: 2015 U4023

**Needs**:
- Simple, fast logging (Sprint 5)
- Maintenance reminders (Sprint 7)
- No forced social features (Sprint 8)
- Easy data export (Sprint 9)

---

## 6. Completed Features

### 6.1 Dashboard Vehicle Stats Card

**Status**: IMPLEMENTED

**Location**: `src/components/dashboard/VehicleStatsCard.tsx`

**Features**:
- [x] Stats grid with fuel efficiency, distance, service dates
- [x] Quick add buttons (+Log Fuel, +Log Service)
- [x] Vehicle selector for multi-vehicle users
- [x] Link to full vehicle dashboard

### 6.2 Vehicle Onboarding

**Status**: IMPLEMENTED

**Location**: `src/pages/ProfileSetup.tsx`

**Features**:
- [x] Required vehicle selection (no skip)
- [x] UnimogModelSelector with comprehensive model database
- [x] Vehicle photo upload
- [x] Year and specification capture
- [x] Stored in profiles table with unimog_model, unimog_year, unimog_series

### 6.3 Barry Conversation Persistence

**Status**: IMPLEMENTED

**Location**: `src/hooks/use-simple-barry.ts`

**Database**: `user_barry_conversations` table

**Features**:
- [x] Conversations saved to Supabase
- [x] Message history preserved across sessions
- [x] Load previous conversations
- [x] Title auto-generated from first message
- [x] JSONB storage for messages with timestamps

### 6.4 Barry Vehicle Personalization

**Status**: IMPLEMENTED

**Location**: `supabase/functions/chat-with-barry-agentic/index.ts` (v76)

**Features**:
- [x] Vehicle context gatherer fetches user's vehicle
- [x] System prompt includes vehicle model and year
- [x] Barry greets user by their Unimog model
- [x] Responses tailored to vehicle specifications
- [x] "Forever Architecture" - pluggable context gatherers

---

## 7. Remaining Features

### 7.1 Sprint 5: Frictionless Logging (P0)

**Duration**: 3-4 days
**Priority**: Critical for expedition users

#### 7.1.1 Floating Action Button (FAB)

**Component**: `src/components/dashboard/FloatingActionButton.tsx`

**Specification**:
- Position: fixed, bottom-right (16px margin)
- Size: 56x56dp (40x40dp on mobile <460px)
- States: collapsed (+) | expanded (X with 3 options)
- Options: Quick Fuel, Log Service, Add Trip
- Animation: scale-in with bounce (500ms)

**Acceptance Criteria**:
- [ ] FAB visible on all dashboard scroll positions
- [ ] Single tap expands to 3 options
- [ ] Animation smooth at 60fps
- [ ] Accessible: ARIA label "Log vehicle activity"

#### 7.1.2 Offline Queue Service

**Service**: `src/services/offline/OfflineQueueService.ts`

**Schema**:
```typescript
interface OfflineEntry {
  id: string;              // UUID v4
  type: 'fuel' | 'maintenance' | 'trip';
  data: LogData;
  status: 'pending' | 'syncing' | 'synced' | 'failed';
  createdAt: Date;
  syncAttempts: number;
}
```

**Acceptance Criteria**:
- [ ] Log saved to IndexedDB before Supabase attempt
- [ ] Success UI shown immediately (optimistic update)
- [ ] "Will sync when online" indicator when offline
- [ ] Background sync on connectivity restoration
- [ ] Conflict resolution: client timestamp wins

#### 7.1.3 Quick Log Modal Enhancement

**File**: `src/components/vehicle/fuel/QuickFuelLogModal.tsx`

**Changes**:
- [ ] Auto-fill odometer from last entry + estimated distance
- [ ] Auto-fill last fuel price
- [ ] Save to IndexedDB FIRST, then sync
- [ ] Show success toast within 200ms (optimistic)
- [ ] Add variable insight in success toast

**Dependencies**: Add `idb` package (~3KB)

### 7.2 Sprint 6: Streak System (P1)

**Duration**: 2-3 days
**Priority**: Biggest retention lever

#### 7.2.1 Database Tables

**Migration**: `supabase/migrations/XXX_streak_system.sql`

```sql
CREATE TABLE user_vehicle_streaks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  vehicle_id UUID NOT NULL REFERENCES vehicles(id),
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  last_activity_date DATE,
  freeze_available INTEGER DEFAULT 0,
  freeze_used_dates DATE[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, vehicle_id)
);

CREATE TABLE user_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  achievement_key TEXT NOT NULL,
  achievement_type TEXT NOT NULL,
  earned_at TIMESTAMPTZ DEFAULT NOW(),
  metadata JSONB,
  UNIQUE(user_id, achievement_key)
);
```

#### 7.2.2 Streak Service

**Service**: `src/services/StreakService.ts`

**Rules**:
- Activity types: fuel_log, maintenance_log, trip_log
- Grace period: 36 hours before streak breaks
- Freeze earned: 1 per 7 active days (max 3)
- Warning: notification at 24 hours remaining

#### 7.2.3 Streak UI Components

**New Components**:
- `src/components/dashboard/StreakTracker.tsx` - Main display
- `src/components/dashboard/StreakBadge.tsx` - Fire icon at 7+ days
- `src/components/dashboard/StreakFreezeModal.tsx` - Use freeze

**Badges**: 3-day, 7-day, 14-day, 30-day, 100-day, 365-day

### 7.3 Sprint 7: Hero Metric & Barry Insights (P1)

**Duration**: 2-3 days
**Priority**: Aha moment + variable rewards

#### 7.3.1 Hero Metric Card

**Component**: `src/components/dashboard/HeroMetricCard.tsx`

**Specification**:
- Display: Fuel efficiency at 72px (48px mobile)
- Trend: Arrow + percentage vs last period
- Colors: green (improving), red (declining), gray (neutral)
- Progress: Bar toward personal goal
- Comparison: "Better than X% of Unimog owners"

#### 7.3.2 Barry Insight Engine

**Service**: `src/services/BarryInsightEngine.ts`

**Insight Types**:
- `savings`: "You saved X this month by tracking"
- `trend`: "Your efficiency improved X% since [event]"
- `pattern`: "You typically fuel up on [day]"
- `comparison`: "Top X% of Unimog owners"
- `technical`: "For your terrain, check [component]"

**Algorithm**:
1. Calculate all possible insights from context
2. Score by relevance (recency, magnitude, novelty)
3. Filter insights shown in last 7 days
4. Select top insight by score
5. Generate Barry's personalized message

#### 7.3.3 Barry Insight Card

**Component**: `src/components/dashboard/BarryInsightCard.tsx`

**Specification**:
- Title: "Barry noticed something"
- Message: Conversational tone from insight engine
- Actions: Ask Barry More, View Trend, Dismiss
- Rotation: Different insight each visit

**Database Table**:
```sql
CREATE TABLE user_insights (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  vehicle_id UUID REFERENCES vehicles(id),
  insight_type TEXT NOT NULL,
  message TEXT NOT NULL,
  shown_at TIMESTAMPTZ,
  dismissed BOOLEAN DEFAULT FALSE,
  interacted BOOLEAN DEFAULT FALSE
);
```

### 7.4 Sprint 8: Community Comparison (P2)

**Duration**: 3-4 days
**Priority**: Social proof

#### 7.4.1 Privacy Settings

**Migration**: Add `user_privacy_settings` table

```sql
CREATE TABLE user_privacy_settings (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  share_efficiency_anonymous BOOLEAN DEFAULT FALSE,
  share_efficiency_named BOOLEAN DEFAULT FALSE,
  participate_leaderboard BOOLEAN DEFAULT FALSE,
  contribute_aggregates BOOLEAN DEFAULT TRUE,
  UNIQUE(user_id)
);
```

**Privacy Tiers**:
- Private (default): No data shared
- Anonymous: See aggregates only
- Named: Stats + username visible
- Leaderboard: Rankings (double opt-in)

#### 7.4.2 Community Stats Aggregation

**Edge Function**: `supabase/functions/aggregate-community-stats/index.ts`

Runs nightly, calculates:
- Average fuel efficiency by model
- Percentiles (10, 25, 50, 75, 90)
- Sample sizes
- Cost averages

**Table**:
```sql
CREATE TABLE vehicle_community_stats (
  model TEXT NOT NULL,
  year_range TEXT,
  avg_fuel_efficiency DECIMAL(5,2),
  percentile_50 DECIMAL(5,2),
  sample_size INTEGER,
  last_calculated TIMESTAMPTZ
);
```

#### 7.4.3 Comparison Widget

**Component**: `src/components/dashboard/CommunityComparison.tsx`

### 7.5 Sprint 9: Data Fortress (P3)

**Duration**: 2 days
**Priority**: Long-term lock-in

#### 7.5.1 Data Portfolio Card

**Component**: `src/components/dashboard/DataPortfolioCard.tsx`

**Displays**:
- Total logs count
- Years of tracking
- Distance tracked
- Cost tracked
- Estimated resale value impact

#### 7.5.2 Export Options

**Component**: `src/components/dashboard/ExportOptions.tsx`

**Formats**:
- PDF (formatted report)
- CSV (raw data)
- Tax Report (expenses by year)

#### 7.5.3 Ownership Milestones

**Component**: `src/components/dashboard/OwnershipMilestones.tsx`

**Badges**:
- Data Builder (10 logs)
- Veteran (50 logs)
- Century Club (100 logs)
- Fortress (500 logs)
- 1 Year Complete
- No Gaps in 6 Months

---

## 8. Technical Architecture

### 8.1 Component Architecture (Final State)

```
Dashboard Page
├── VehicleStatsCard (orchestrator) [IMPLEMENTED]
│   ├── HeroMetricCard [Sprint 7]
│   │   ├── TrendIndicator
│   │   └── ProgressBar
│   ├── QuickStatsRow [PARTIAL]
│   │   └── StatCard (x4)
│   ├── StreakTracker [Sprint 6]
│   │   ├── StreakDisplay
│   │   └── StreakFreezeButton
│   ├── BarryInsightCard [Sprint 7]
│   │   └── InsightActions
│   ├── CommunityComparison [Sprint 8]
│   │   ├── ComparisonChart
│   │   └── PrivacySettings
│   └── DataPortfolio [Sprint 9]
│       ├── ValueVisualization
│       └── ExportOptions
├── FloatingActionButton [Sprint 5]
│   └── QuickActionMenu
└── Modals
    ├── QuickLogModal [Sprint 5 Enhancement]
    ├── StreakFreezeModal [Sprint 6]
    └── PrivacySettingsModal [Sprint 8]
```

### 8.2 Service Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    React Components                      │
├─────────────────────────────────────────────────────────┤
│  Hooks Layer                                             │
│  ├── useVehicleStats() [IMPLEMENTED]                    │
│  ├── useSimpleBarry() [IMPLEMENTED]                     │
│  ├── useStreak() [Sprint 6]                             │
│  ├── useBarryInsights() [Sprint 7]                      │
│  ├── useCommunityStats() [Sprint 8]                     │
│  └── useOfflineQueue() [Sprint 5]                       │
├─────────────────────────────────────────────────────────┤
│  Service Layer                                           │
│  ├── VehicleService [IMPLEMENTED]                       │
│  ├── StreakService [Sprint 6]                           │
│  ├── BarryInsightEngine [Sprint 7]                      │
│  ├── CommunityStatsService [Sprint 8]                   │
│  └── OfflineQueueService [Sprint 5]                     │
├─────────────────────────────────────────────────────────┤
│  Data Layer                                              │
│  ├── IndexedDB (offline queue) [Sprint 5]               │
│  ├── Supabase Client [IMPLEMENTED]                      │
│  └── Edge Functions [IMPLEMENTED]                       │
│      └── chat-with-barry-agentic v76                    │
└─────────────────────────────────────────────────────────┘
```

### 8.3 Offline-First Architecture (Sprint 5)

```
User Action (Log Fuel)
         │
         ▼
┌─────────────────┐
│  Save to        │──────────────────────┐
│  IndexedDB      │                      │
└────────┬────────┘                      │
         │                               │
         ▼                               ▼
┌─────────────────┐              ┌─────────────────┐
│  Update Local   │              │  Show Success   │
│  State          │              │  Toast (200ms)  │
└────────┬────────┘              └─────────────────┘
         │
         ▼
┌─────────────────┐
│  Online?        │
└────────┬────────┘
    Yes  │  No
         │   └───────────────┐
         ▼                   ▼
┌─────────────────┐  ┌─────────────────┐
│  Sync to        │  │  Queue for      │
│  Supabase       │  │  Later Sync     │
└────────┬────────┘  └─────────────────┘
         │
         ▼
┌─────────────────┐
│  Update Sync    │
│  Status         │
└─────────────────┘
```

### 8.4 Barry "Forever Architecture" Principle

**CORE RULE**: The chat-with-barry-agentic edge function is a **stable orchestrator that NEVER changes**.

New features are added via **pluggable context gatherers**:

```typescript
// Context gatherer pattern (before routing logic)
let vehicleContext = '';
let vehicleData: any = null;

const needsVehicle = detectVehicleQuery(userQuery);
if (needsVehicle) {
  try {
    const result = await gatherVehicleContext(supabaseAdmin, userId);
    if (result.found) {
      vehicleContext = formatVehicleContext(result);
      vehicleData = result.vehicle;
    }
  } catch (error) {
    console.error('[Vehicle Gatherer] Error:', error);
    // Fail gracefully - core routing continues
  }
}

// Inject into existing flow
if (vehicleContext) {
  systemPrompt += '\n\n' + vehicleContext;
}
```

---

## 9. Data Models

### 9.1 Existing Tables (IMPLEMENTED)

```sql
-- Conversation persistence
CREATE TABLE user_barry_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  vehicle_id UUID REFERENCES vehicles(id),
  title TEXT,
  messages JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 9.2 New Tables (Sprints 5-9)

```sql
-- Sprint 6: Streak tracking
CREATE TABLE user_vehicle_streaks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  vehicle_id UUID NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  last_activity_date DATE,
  freeze_available INTEGER DEFAULT 0,
  freeze_used_dates DATE[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, vehicle_id)
);

-- Sprint 6: Achievement tracking
CREATE TABLE user_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  achievement_key TEXT NOT NULL,
  achievement_type TEXT NOT NULL,
  earned_at TIMESTAMPTZ DEFAULT NOW(),
  metadata JSONB,
  UNIQUE(user_id, achievement_key)
);

-- Sprint 7: Barry insights
CREATE TABLE user_insights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  vehicle_id UUID REFERENCES vehicles(id) ON DELETE SET NULL,
  insight_type TEXT NOT NULL,
  insight_key TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  value TEXT,
  is_positive BOOLEAN,
  shown_at TIMESTAMPTZ,
  dismissed BOOLEAN DEFAULT FALSE,
  interacted BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Sprint 8: Privacy settings
CREATE TABLE user_privacy_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  share_efficiency_anonymous BOOLEAN DEFAULT FALSE,
  share_efficiency_named BOOLEAN DEFAULT FALSE,
  participate_leaderboard BOOLEAN DEFAULT FALSE,
  contribute_aggregates BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Sprint 8: Community statistics
CREATE TABLE vehicle_community_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  model TEXT NOT NULL,
  year_range TEXT,
  avg_fuel_efficiency DECIMAL(5,2),
  avg_maintenance_cost_annual DECIMAL(10,2),
  avg_annual_mileage INTEGER,
  sample_size INTEGER,
  percentile_10 DECIMAL(5,2),
  percentile_25 DECIMAL(5,2),
  percentile_50 DECIMAL(5,2),
  percentile_75 DECIMAL(5,2),
  percentile_90 DECIMAL(5,2),
  last_calculated TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(model, year_range)
);

-- Sprint 5: Offline sync tracking
CREATE TABLE user_sync_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  client_id TEXT NOT NULL,
  entry_type TEXT NOT NULL,
  entry_id UUID NOT NULL,
  synced_at TIMESTAMPTZ DEFAULT NOW(),
  client_created_at TIMESTAMPTZ NOT NULL
);
```

### 9.3 RLS Policies

```sql
-- All user tables: users can only see/modify their own
ALTER TABLE user_vehicle_streaks ENABLE ROW LEVEL SECURITY;
CREATE POLICY streak_user_policy ON user_vehicle_streaks
  FOR ALL USING (auth.uid() = user_id);

-- Community stats: read-only for all authenticated users
ALTER TABLE vehicle_community_stats ENABLE ROW LEVEL SECURITY;
CREATE POLICY community_read_policy ON vehicle_community_stats
  FOR SELECT USING (auth.role() = 'authenticated');
```

---

## 10. UI/UX Specifications

### 10.1 Visual Hierarchy (Final State)

```
┌─────────────────────────────────────────────────────────┐
│  Vehicle Selector                                        │  [IMPLEMENTED]
├─────────────────────────────────────────────────────────┤
│                                                          │
│                    12.3                                  │  [Sprint 7]
│                  L/100km                                 │  Hero Metric
│                ▲ 8% vs last month                       │
│                                                          │
├─────────────────────────────────────────────────────────┤
│  [Cost] [Distance] [Logs] [Streak]                      │  [Sprint 6-7]
├─────────────────────────────────────────────────────────┤
│  Barry noticed something...                              │  [Sprint 7]
│  "Your efficiency improved..."                          │
├─────────────────────────────────────────────────────────┤
│  Your Data Portfolio                                     │  [Sprint 9]
│  87 logs • 2 years                                       │
└─────────────────────────────────────────────────────────┘
                                               ┌───┐
                                               │ + │  [Sprint 5]
                                               └───┘  FAB
```

### 10.2 Color System

| Element | Color | Usage |
|---------|-------|-------|
| Primary | `military-green-500` | CTAs, progress, positive |
| Positive trend | `green-600` | Improvements |
| Negative trend | `red-600` | Declines |
| Warning | `yellow-500` | Maintenance due |
| Streak fire | `orange-500` | Active streaks |

### 10.3 Animations

| Element | Animation | Duration | Sprint |
|---------|-----------|----------|--------|
| FAB appear | Scale from 0 | 500ms | Sprint 5 |
| FAB hover | Scale to 1.1 | 150ms | Sprint 5 |
| Toast appear | Slide from bottom | 200ms | Sprint 5 |
| Streak fire | Pulse | 1000ms loop | Sprint 6 |

---

## 11. Security & Privacy

### 11.1 Privacy Principles

1. **Private by default**: No data shared without explicit consent
2. **Minimal collection**: Only collect what's needed
3. **User control**: Easy access to privacy settings
4. **Easy exit**: One-click to disable, immediate effect

### 11.2 Privacy Tiers (Sprint 8)

| Tier | Data Shared | Visibility | Requires |
|------|-------------|------------|----------|
| Private | None | Only user | Default |
| Anonymous | Aggregate stats only | Community averages | Opt-in |
| Named | Stats + username | Opted-in users | Explicit opt-in |
| Leaderboard | Rankings + username | Public | Double opt-in |

### 11.3 Offline Data Security (Sprint 5)

- IndexedDB data cleared on logout
- No PII in client-side logs
- Sync uses authenticated Supabase client

---

## 12. Testing Strategy

### 12.1 Unit Tests by Sprint

| Sprint | Component | Coverage Target |
|--------|-----------|-----------------|
| 5 | OfflineQueueService | 95% |
| 6 | StreakService | 95% |
| 7 | BarryInsightEngine | 90% |
| 8 | CommunityStatsService | 85% |

### 12.2 Integration Tests

| Flow | Sprint | Priority |
|------|--------|----------|
| Offline logging | 5 | Critical |
| Streak calculation | 6 | Critical |
| Insight generation | 7 | High |
| Privacy toggle | 8 | High |

### 12.3 E2E Tests

| Scenario | Sprint |
|----------|--------|
| FAB → Log → Success | 5 |
| 7-day streak badge earned | 6 |
| Offline → Online sync | 5 |
| Privacy opt-in → View community | 8 |

---

## 13. Rollout Plan

### 13.1 Sprint Timeline

| Sprint | Focus | Duration | Status |
|--------|-------|----------|--------|
| 1 | Dashboard Surfacing | - | COMPLETE |
| 2 | Onboarding Lock-in | - | COMPLETE |
| 3 | Barry Memory | - | COMPLETE |
| 4 | Barry Personalization | - | COMPLETE |
| **5** | **Offline + FAB** | 3-4 days | NEXT |
| 6 | Streak System | 2-3 days | Pending |
| 7 | Hero Metric + Insights | 2-3 days | Pending |
| 8 | Community Comparison | 3-4 days | Pending |
| 9 | Data Fortress | 2 days | Pending |

**Remaining Effort**: 12-16 days

### 13.2 Feature Flags

| Flag | Description | Default |
|------|-------------|---------|
| `offline_logging` | Enable IndexedDB queue | false |
| `streak_system` | Enable streaks | false |
| `barry_insights` | Enable AI insights | false |
| `community_features` | Enable comparison | false |

### 13.3 Success Criteria for Each Sprint

**Sprint 5**: Offline sync success rate >=99%
**Sprint 6**: 25% of users achieve 7-day streak
**Sprint 7**: Barry insight engagement >=15%
**Sprint 8**: 30% opt-in to community features
**Sprint 9**: 20% of users reach 50+ logs

---

## 14. Risks & Mitigations

### 14.1 Technical Risks

| Risk | Sprint | Mitigation |
|------|--------|------------|
| IndexedDB quota exceeded | 5 | Cleanup synced entries |
| Sync conflicts | 5 | Client timestamp wins |
| Insight API latency | 7 | Cache insights |
| Community aggregation perf | 8 | Nightly batch job |

### 14.2 User Experience Risks

| Risk | Sprint | Mitigation |
|------|--------|------------|
| Streak anxiety | 6 | Freeze mechanic, gentle messaging |
| Comparison discouragement | 8 | Focus on improvement, not rank |
| Privacy concerns | 8 | Private by default |

---

## 15. Dependencies

### 15.1 New Packages Required

| Package | Purpose | Size | Sprint |
|---------|---------|------|--------|
| `idb` | IndexedDB wrapper | ~3KB | 5 |
| `uuid` | Client-side IDs | Already installed | 5 |
| `date-fns` | Date calculations | Already installed | 6 |

### 15.2 Edge Functions Required

| Function | Purpose | Sprint |
|----------|---------|--------|
| chat-with-barry-agentic | AI assistant | DEPLOYED (v76) |
| aggregate-community-stats | Nightly stats | 8 |
| generate-barry-insight | Insight generation | 7 |

---

## 16. Appendix

### 16.1 Files Summary

**Completed Components**:
- `src/components/dashboard/VehicleStatsCard.tsx`
- `src/pages/ProfileSetup.tsx`
- `src/hooks/use-simple-barry.ts`
- `supabase/functions/chat-with-barry-agentic/index.ts`

**Components to Create**:
```
src/components/dashboard/
├── FloatingActionButton.tsx [Sprint 5]
├── QuickActionMenu.tsx [Sprint 5]
├── HeroMetricCard.tsx [Sprint 7]
├── StreakTracker.tsx [Sprint 6]
├── StreakBadge.tsx [Sprint 6]
├── StreakFreezeModal.tsx [Sprint 6]
├── BarryInsightCard.tsx [Sprint 7]
├── CommunityComparison.tsx [Sprint 8]
├── DataPortfolioCard.tsx [Sprint 9]
├── ExportOptions.tsx [Sprint 9]
└── OwnershipMilestones.tsx [Sprint 9]
```

**Services to Create**:
```
src/services/
├── offline/
│   ├── OfflineQueueService.ts [Sprint 5]
│   └── offlineDb.ts [Sprint 5]
├── StreakService.ts [Sprint 6]
├── BarryInsightEngine.ts [Sprint 7]
└── CommunityStatsService.ts [Sprint 8]
```

**Hooks to Create**:
```
src/hooks/
├── useOfflineQueue.ts [Sprint 5]
├── useStreak.ts [Sprint 6]
├── useBarryInsights.ts [Sprint 7]
└── useCommunityStats.ts [Sprint 8]
```

### 16.2 Success Metrics Summary

| Metric | Current | Target | Achieved By |
|--------|---------|--------|-------------|
| Day-1 Retention | ~20% | 40% | Sprint 7 |
| Day-7 Retention | ~8% | 30% | Sprint 6 |
| Day-30 Retention | ~5% | 15% | Sprint 8 |
| Taps to log fuel | 6+ | 2-4 | Sprint 5 |
| Users with 7+ day streak | 0% | 25% | Sprint 6 |
| Users with 50+ logs | ~5% | 20% | Sprint 9 |
| Opt-in to comparison | 0% | 30% | Sprint 8 |

### 16.3 Version History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-01-06 | Product Team | Initial PRD |
| 2.0 | 2026-01-07 | Product Team | Updated to reflect implementation status, reorganized by sprint completion |

---

**End of PRD**

*This document serves as the definitive specification for the Sticky Vehicle Dashboard project. Sprints 1-4 are complete. Implementation continues with Sprint 5 (Frictionless Logging).*
