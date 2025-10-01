# Maintenance Data Population Guide

## Overview
This document explains how maintenance data is populated in the Unimog Community Hub, including both the existing mock data and the new functional scheduling system.

## 🗃️ Database Structure

### Current Tables
1. **`maintenance_logs`** - Completed maintenance records
2. **`maintenance_schedule`** - Scheduled future maintenance (NEW)
3. **`maintenance_notification_settings`** - User notification preferences

### New Maintenance Schedule Table
```sql
CREATE TABLE maintenance_schedule (
    id UUID PRIMARY KEY,
    vehicle_id UUID REFERENCES vehicles(id),
    maintenance_type TEXT NOT NULL,        -- e.g., "Oil Change", "Brake Service"
    description TEXT NOT NULL,             -- Detailed description
    scheduled_date DATE NOT NULL,          -- When maintenance is scheduled
    due_odometer INTEGER,                  -- Odometer reading when due
    priority TEXT DEFAULT 'medium',       -- low, medium, high, urgent
    status TEXT DEFAULT 'scheduled',      -- scheduled, overdue, completed, cancelled
    estimated_cost NUMERIC(10,2),         -- Estimated cost
    estimated_duration_hours INTEGER,     -- How long it should take
    location TEXT,                        -- Where work will be done
    service_provider TEXT,                -- Mechanic/workshop name
    reminder_sent_at TIMESTAMPTZ,         -- When reminder was sent
    notes TEXT,                           -- Additional notes
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

## 📊 Data Sources

### 1. Mock Data (Current Implementation)
The dashboard currently displays sample data for demonstration:

```typescript
// Sample maintenance alerts shown in dashboard
const maintenanceAlerts = [
  {
    type: 'Oil Change Due',
    description: 'In 2 weeks or 800km',
    priority: 'medium',
    icon: AlertTriangle,
    color: 'yellow'
  },
  {
    type: 'Annual Inspection',
    description: 'Completed 2 months ago',
    status: 'completed',
    icon: CheckCircle,
    color: 'green'
  },
  {
    type: 'Coolant System',
    description: 'Operating normally',
    status: 'good',
    icon: Thermometer,
    color: 'blue'
  }
];
```

### 2. User-Scheduled Maintenance (NEW)
Users can now schedule maintenance through the functional Schedule button:

#### Schedule Button Workflow:
1. **User clicks "Schedule"** on maintenance alert
2. **Modal opens** with pre-filled maintenance type and description
3. **User fills form** with scheduling details:
   - Scheduled date (auto-suggested based on maintenance type)
   - Odometer due reading
   - Priority level
   - Estimated cost and duration
   - Location and service provider
   - Additional notes
4. **Data saved** to `maintenance_schedule` table
5. **Dashboard updates** to show scheduled maintenance

#### Auto-Suggestions:
The system provides intelligent defaults:
- **Oil Change**: Suggests 14 days from today
- **Filter Replacement**: Suggests 7 days
- **Brake Service**: Suggests 21 days
- **Annual Inspection**: Suggests 365 days
- **Tire Rotation**: Suggests 30 days

### 3. Automated Data Population (Future Enhancement)

#### Vehicle Integration Data:
```typescript
// Data that could be automatically populated
interface AutoPopulatedData {
  currentOdometer: number;        // From vehicle_data_entries
  lastServiceDate: string;        // From maintenance_logs
  nextServiceDue: string;         // Calculated based on intervals
  serviceIntervals: {             // Based on vehicle model
    oilChange: 5000,             // km
    filterReplacement: 10000,    // km
    majorService: 20000          // km
  };
}
```

#### OBD-II Integration (Future):
- Real-time diagnostics
- Automatic fault code detection
- Predictive maintenance alerts
- Engine hours tracking

#### GPS/Telematics Integration (Future):
- Usage patterns (highway vs off-road)
- Operating conditions
- Environmental factors
- Automated odometer updates

## 🔄 Data Flow

### Current Flow:
```
User Input → Schedule Modal → maintenance_schedule table → Dashboard Display
```

### Future Enhanced Flow:
```
Vehicle Sensors → OBD-II Reader → Automated Analysis → Predictive Alerts
GPS Tracking → Usage Analytics → Condition-Based Scheduling
Manual Input → Schedule Modal → Database → Smart Recommendations
External APIs → Parts Availability → Cost Estimates → Service Booking
```

## 📋 Usage Statistics Data

### Current Mock Data Displayed:
- **Total Distance**: 1,247 km (this month)
- **Operating Hours**: 124 hrs
- **Off-Road Usage**: 68%
- **Average Speed**: 45 km/h

### Data Sources for Real Implementation:

#### 1. Manual Entry:
- Users enter odometer readings via `/vehicle-data` page
- Data stored in `vehicle_data_entries` table
- Automatically calculates monthly totals

#### 2. GPS Tracking (Future):
```typescript
interface LocationData {
  coordinates: [number, number];
  timestamp: Date;
  speed: number;
  heading: number;
  terrain_type: 'highway' | 'city' | 'off-road' | 'work-site';
}
```

#### 3. Telematics Integration (Future):
- Engine hours from CAN bus
- Fuel consumption tracking
- Load monitoring
- Performance metrics

## 🏗️ Location History Data

### Current Mock Data:
```typescript
const locationHistory = [
  { location: 'Forest Service Road 42', time: '2 hours ago', type: 'Off-road' },
  { location: 'Highway 1 to Brisbane', time: 'Yesterday', type: 'On-road' },
  { location: 'Mining Site Alpha', time: '2 days ago', type: 'Work site' },
  { location: 'Base Workshop', time: '3 days ago', type: 'Maintenance' }
];
```

### Real Data Sources:

#### 1. Trip Planning Integration:
- Data from saved GPX tracks
- Waypoints and destinations
- Route classifications

#### 2. Manual Check-ins:
- Users can manually log locations
- Categorize activity types
- Add notes about work performed

#### 3. GPS Tracking (Future):
- Automatic location logging
- Geofencing for work sites
- Activity pattern recognition

## 🔧 Implementation Status

### ✅ Completed:
- Database schema for maintenance scheduling
- Functional Schedule button with modal
- Form validation and error handling
- Auto-suggestions for scheduling dates
- Priority levels and status tracking

### 🚧 In Progress:
- Integration with existing vehicle data
- Real-time dashboard updates
- Notification system

### 📋 Planned:
- Automated maintenance reminders
- Integration with external service providers
- Parts availability checking
- Cost estimation APIs
- Mobile app for field updates

## 🚀 Getting Started

### For Users:
1. **Navigate** to `/full-vehicle-dashboard`
2. **Click "Schedule"** button on any maintenance alert
3. **Fill out the form** with your maintenance details
4. **Submit** to save the scheduled maintenance
5. **View scheduled items** in your dashboard

### For Developers:
1. **Run migration** to create `maintenance_schedule` table
2. **Import component**: `MaintenanceScheduleModal`
3. **Add state management** for modal visibility
4. **Connect to vehicle data** via `useVehicles` hook
5. **Handle form submissions** to database

## 📊 Analytics and Reporting

### Current Metrics:
- Maintenance costs by category
- Service frequency
- Vehicle health scores
- Fuel efficiency trends

### Future Analytics:
- Predictive maintenance accuracy
- Cost savings from preventive maintenance
- Service provider ratings
- Parts failure patterns
- Total cost of ownership tracking

This system provides a solid foundation for comprehensive vehicle maintenance management while allowing for future enhancements and automation.