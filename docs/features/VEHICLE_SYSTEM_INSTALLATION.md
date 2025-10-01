# 🚗 Vehicle Management System Installation Guide

## Overview
This guide will help you install the complete vehicle management system with all required database tables, services, and privacy features.

## ⚠️ CRITICAL: Database Setup Required

The vehicle system requires new database tables that **must be created before the system will work**.

### Step 1: Create Missing Database Tables

**IMPORTANT**: Execute this SQL in your Supabase SQL Editor:

1. Open your Supabase project dashboard
2. Go to SQL Editor
3. Copy the contents of `docs/sql-to-run/create_missing_vehicle_tables.sql`
4. Execute the SQL

**What this creates:**
- `vehicle_maintenance_schedules` - Track maintenance schedules
- `vehicle_service_logs` - Service history records
- `vehicle_fuel_logs` - Fuel consumption tracking
- `vehicle_fuel_stats` - Computed fuel statistics
- `vehicle_location_logs` - Location check-ins
- `vehicle_usage_stats` - Usage analytics
- `vehicle_photos` - Photo metadata
- `vehicles` storage bucket - For vehicle photos
- Comprehensive RLS policies for all tables
- Performance indexes

### Step 2: Verify Installation

After running the SQL, verify the tables exist:

```sql
-- Check if tables were created
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name LIKE 'vehicle_%'
ORDER BY table_name;

-- Should return:
-- vehicle_fuel_logs
-- vehicle_fuel_stats
-- vehicle_location_logs
-- vehicle_maintenance_schedules
-- vehicle_photos
-- vehicle_service_logs
-- vehicle_usage_stats

-- Check storage bucket
SELECT name FROM storage.buckets WHERE name = 'vehicles';
-- Should return: vehicles
```

## 🔧 System Components

### 1. Core Service Layer
- **`VehicleService`** - Complete CRUD operations with privacy mode support
- **`LocalStorageService`** - Encrypted local storage for privacy mode
- **Database types** - Full TypeScript support

### 2. Privacy Mode Features
- **Encrypted local storage** - User data never leaves device
- **Privacy settings** - User-controlled privacy preferences
- **Data export/import** - Backup and restore capabilities
- **Automatic cleanup** - Configurable data retention

### 3. Vehicle Management Features
- ✅ **Vehicle registry** - Add, edit, delete vehicles
- ✅ **Maintenance scheduling** - Schedule and track maintenance
- ✅ **Service history** - Complete service record tracking
- ✅ **Fuel logging** - Track fuel consumption and costs
- ✅ **Photo management** - Vehicle photos with metadata
- ✅ **Usage analytics** - Track usage patterns and statistics

## 🛡️ Security Features

### Row Level Security (RLS)
All tables have comprehensive RLS policies:
- Users can only access their own vehicle data
- Proper foreign key relationships enforced
- Admin override capabilities where needed

### Privacy Mode
- **Local-only storage** - Data stays on user's device
- **AES encryption** - Data encrypted with user-specific keys
- **No server communication** - Complete privacy protection
- **Data portability** - Easy export/import

## 🎯 Usage Examples

### Basic Vehicle Operations
```typescript
// Create a new vehicle
const newVehicle = await VehicleService.createVehicle({
  user_id: userId,
  model: 'U1700L',
  year: 1988,
  nickname: 'My Unimog'
});

// Get user's vehicles (works in both normal and privacy mode)
const vehicles = await VehicleService.getUserVehicles(userId);

// Add maintenance schedule
const schedule = await VehicleService.createMaintenanceSchedule({
  vehicle_id: vehicleId,
  maintenance_type: 'Oil Change',
  interval_months: 6,
  next_due_date: '2024-06-01'
});
```

### Privacy Mode Operations
```typescript
// Enable privacy mode
LocalStorageService.enablePrivacyMode(userId);

// All vehicle operations now use local storage
const vehicles = await VehicleService.getUserVehicles(userId); // Gets from localStorage

// Export data for backup
const backup = LocalStorageService.exportData(userId);

// Import data from backup
LocalStorageService.importData(userId, backup);
```

### Form Integration
```typescript
// AddVehicleDialog now works with real database
const { addVehicle } = useVehicles(userId);

const handleSubmit = async (formData) => {
  try {
    await addVehicle(formData); // Uses VehicleService internally
    toast.success("Vehicle added successfully!");
  } catch (error) {
    toast.error("Failed to add vehicle");
  }
};
```

## 🔍 Troubleshooting

### Common Issues

#### "Table 'vehicle_maintenance_schedules' doesn't exist"
- **Cause**: Database tables not created
- **Solution**: Run the SQL from `docs/sql-to-run/create_missing_vehicle_tables.sql`

#### "Permission denied for table vehicles"
- **Cause**: RLS policies not applied
- **Solution**: Ensure you ran the complete SQL file including RLS policies

#### "Cannot add vehicle - no response"
- **Cause**: VehicleService not imported correctly
- **Solution**: Check that components import from `@/services/vehicleService`

#### Privacy mode not working
- **Cause**: LocalStorageService not configured
- **Solution**: Import LocalStorageService and check privacy settings

### Verification Commands

```sql
-- Check RLS is enabled
SELECT schemaname, tablename, rowsecurity
FROM pg_tables
WHERE tablename LIKE 'vehicle_%';

-- Check policies exist
SELECT schemaname, tablename, policyname
FROM pg_policies
WHERE tablename LIKE 'vehicle_%';

-- Test vehicle insertion (replace USER_ID)
INSERT INTO vehicles (user_id, model, year)
VALUES ('USER_ID', 'Test Vehicle', 2024);
```

## 📊 System Health Check

Run this checklist to verify everything is working:

- [ ] Database tables created successfully
- [ ] RLS policies active on all tables
- [ ] Storage bucket 'vehicles' exists
- [ ] VehicleService imports without errors
- [ ] LocalStorageService privacy mode works
- [ ] AddVehicleDialog submits successfully
- [ ] MaintenanceScheduleModal saves records
- [ ] Vehicle photos can be uploaded
- [ ] Privacy mode encrypts data locally

## 🚀 Performance Notes

### Indexes Created
The SQL creates performance indexes on:
- `vehicle_id` columns for fast lookups
- Date columns for chronological queries
- Status columns for filtering

### Storage Limits
- Vehicle photos: 50MB max per file
- Supported formats: JPEG, PNG, WebP
- Local storage: ~5MB typical browser limit

## 📈 Next Steps

After installation, consider:

1. **Test with real data** - Add some test vehicles and maintenance records
2. **Configure privacy settings** - Set up privacy mode for privacy-conscious users
3. **Upload vehicle photos** - Test the photo upload functionality
4. **Create maintenance schedules** - Set up recurring maintenance
5. **Generate usage reports** - Verify analytics are working

## 🆘 Support

If you encounter issues:

1. Check the browser console for JavaScript errors
2. Verify database tables exist in Supabase dashboard
3. Test RLS policies with different user accounts
4. Check network requests in browser dev tools
5. Verify environment variables are set correctly

The vehicle management system is now ready for production use! 🎉