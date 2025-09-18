# 🔄 WIS Data Flow Architecture

## Overview
Clean, efficient data flow from database to UI with smart caching and state management.

## Data Flow Diagram
```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│  Supabase   │    │     WIS     │    │   React     │    │   Zustand   │    │    React    │
│  Database   │───▶│ DataService │───▶│    Query    │───▶│    Store    │───▶│ Components  │
│             │    │             │    │             │    │             │    │             │
│ • Models    │    │ • getModels │    │ • Caching   │    │ • UI State  │    │ • Display   │
│ • Systems   │    │ • getSystems│    │ • Background│    │ • Navigation│    │ • User      │
│ • Components│    │ • getProcedures │ • Updates   │    │ • Search    │    │   Interactions│
│ • Procedures│    │ • searchProcedures│ • Error   │    │ • Selections│    │             │
│ • Steps     │    │             │    │   Handling  │    │             │    │             │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
       ▲                   │                   │                   │                   │
       │                   │                   │                   │                   │
       └───────────────────┼───────────────────┼───────────────────┼───────────────────┘
                          │                   │                   │
                     Performance            Smart              Optimistic
                     Monitoring            Caching             Updates
```

## Layer Responsibilities

### **1. Database Layer (Supabase)**
- **Purpose**: Store and retrieve WIS data
- **Features**:
  - Row Level Security (RLS)
  - Full-text search with GIN indexes
  - Hierarchical relationships
  - Real-time subscriptions (future)

### **2. Data Service Layer**
- **File**: `/src/services/wis/wisDataService.ts`
- **Purpose**: Single source of truth for all data operations
- **Features**:
  - Clean API abstractions
  - Error handling and logging
  - Type-safe operations
  - Connection pooling

### **3. Caching Layer (React Query)**
- **Purpose**: Smart caching and background updates
- **Features**:
  - Automatic background refetching
  - Stale-while-revalidate strategy
  - Optimistic updates
  - Error retry with exponential backoff

### **4. State Management (Zustand)**
- **File**: `/src/stores/wisStore.ts`
- **Purpose**: UI state and navigation management
- **Features**:
  - Current selections (model, system, component, procedure)
  - UI state (sidebar open, active tabs, loading states)
  - Search state with debouncing
  - User preferences and bookmarks

### **5. Component Layer**
- **Purpose**: Render UI and handle user interactions
- **Features**:
  - Clean separation of concerns
  - Responsive design
  - Accessibility features
  - Performance optimizations

## Data Flow Patterns

### **1. Initial Load**
```
User visits WIS → Load Models → Select Model → Load Systems → Select System → Load Components
                     ↓              ↓             ↓              ↓
                  Cache for    Cache for     Cache for     Cache for
                  30 min       30 min        30 min        30 min
```

### **2. Procedure Navigation**
```
Select Component → Load Procedures → Select Procedure → Load Steps
       ↓               ↓               ↓            ↓
   Cache 30min     Cache 20min     Cache 60min  Cache 60min
                                      ↓
                              Update Navigation
                              History & Breadcrumbs
```

### **3. Search Flow**
```
User Types → Debounce (300ms) → Search API → Cache Results → Display
    ↓              ↓               ↓            ↓           ↓
Clear old     Prevent spam    Full-text    Cache 10min   Highlight
results       requests        search                     matches
```

### **4. Background Updates**
```
Data in cache → Check staleness → Background refetch → Update UI
     ↓               ↓                    ↓              ↓
  Still fresh    > Stale time         Silent update   No flicker
```

## Performance Optimizations

### **Caching Strategy**
- **Models**: 30 min (rarely change)
- **Systems/Components**: 30 min (stable hierarchy)
- **Procedures**: 20 min (occasional updates)
- **Procedure Steps**: 60 min (static once created)
- **Search Results**: 10 min (dynamic content)

### **Prefetching**
- Prefetch systems when model selected
- Prefetch components when system expanded
- Prefetch procedures on component hover

### **Memory Management**
- Automatic garbage collection of unused cache entries
- Selective cache invalidation on updates
- Compressed storage for large datasets

## Error Handling

### **Network Errors**
- Automatic retry with exponential backoff
- Fallback to cached data when possible
- User-friendly error messages

### **Data Errors**
- Graceful degradation with partial data
- Clear error boundaries
- Logging for debugging

### **User Experience**
- Loading states with skeletons
- Optimistic updates for instant feedback
- Offline support (future enhancement)