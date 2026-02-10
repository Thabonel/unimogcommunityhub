# Expense Tracking - Quick Start Guide

Get the invoice/receipt tracking system running in 5 minutes.

## Installation (5 minutes)

### Step 1: Create Database Tables (1 min)
Copy and paste into Supabase SQL Editor:

```sql
BEGIN;

CREATE TABLE expense_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  vehicle_id UUID NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  amount DECIMAL(10, 2) NOT NULL,
  currency VARCHAR(3) NOT NULL DEFAULT 'AUD',
  category VARCHAR(50) NOT NULL,
  description TEXT NOT NULL,
  expense_date DATE NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_expense_records_vehicle_id ON expense_records(vehicle_id);
CREATE INDEX idx_expense_records_user_id ON expense_records(user_id);
CREATE INDEX idx_expense_records_expense_date ON expense_records(expense_date);
CREATE INDEX idx_expense_records_category ON expense_records(category);

CREATE TABLE expense_receipts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  expense_id UUID NOT NULL REFERENCES expense_records(id) ON DELETE CASCADE,
  file_name VARCHAR(255) NOT NULL,
  file_type VARCHAR(100) NOT NULL,
  file_size INTEGER NOT NULL,
  storage_path VARCHAR(512) NOT NULL,
  is_primary BOOLEAN DEFAULT FALSE,
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_expense_receipts_expense_id ON expense_receipts(expense_id);

COMMIT;
```

### Step 2: Create Storage Bucket (1 min)
1. Go to Supabase Dashboard > Storage
2. Click "New Bucket"
3. Name: `expense-receipts`
4. Make it Public (or configure RLS)
5. Click Create

### Step 3: Import Components (1 min)
```tsx
import { ExpenseTrackingSection } from '@/components/vehicle/expenses';
```

### Step 4: Add to Your Page (1 min)
```tsx
<ExpenseTrackingSection
  vehicleId={vehicle.id}
  vehicles={allVehicles}
/>
```

### Step 5: Done! (1 min)
Start recording expenses with:
- Drag & drop upload
- Camera capture
- File browser selection

## Basic Usage

### Record an Expense
1. Click "Add Expense"
2. Select vehicle
3. Enter amount and category
4. Upload receipt (any method)
5. Click "Record Expense"

### View Expenses
- Click expense card to see details
- Click "View Receipts" to see uploaded files
- Use search to find expenses
- Filter by category

### Manage Files
- Drag & drop up to 10 files
- Take photo with camera
- Click to browse files
- Remove with X button

## File Support

Supported file types:
- Images: JPEG, PNG, WebP
- Documents: PDF
- Office: Word, Excel

Max size: 10 MB per file
Max files: 10 per expense

## Expense Categories

fuel, maintenance, repair, parts, tires, insurance, registration, toll, parking, accommodation, camping, equipment, other

## Quick Tips

- Use camera capture on mobile for quick photo uploads
- Drag & drop is fastest for desktop
- Search by description or notes
- Filter by category to find expenses quickly
- View all receipts in the viewer
- Multi-currency support built-in

## Troubleshooting

**Camera not working?**
- Check browser permissions
- Must be HTTPS
- Works on Chrome, Firefox, Safari

**Files not uploading?**
- Check file size < 10 MB
- Verify file type is supported
- Try one file at a time
- Check internet connection

**Can't see expenses?**
- Reload page
- Check selected vehicle filter
- Verify RLS policies configured
- Check user authentication

## Next Steps

1. Configure RLS policies (optional but recommended)
2. Test on mobile device
3. Set up expense categories for your use case
4. Consider adding OCR for automatic extraction
5. Create expense reports/exports

## RLS Policy (Optional)

Paste into Supabase SQL Editor for extra security:

```sql
-- Allow users to see only their own expenses
CREATE POLICY "Users can view their own expenses"
  ON expense_records FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own expenses"
  ON expense_records FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own expenses"
  ON expense_records FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own expenses"
  ON expense_records FOR DELETE
  USING (auth.uid() = user_id);

-- Cascade policies to receipts
CREATE POLICY "Users can view their own receipts"
  ON expense_receipts FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM expense_records
      WHERE id = expense_receipts.expense_id
      AND user_id = auth.uid()
    )
  );
```

## Full Component API

See `/src/components/vehicle/expenses/README.md` for complete documentation.

Key components:
- `ExpenseTrackingSection` - Complete system (recommended)
- `ExpenseForm` - Standalone form
- `ExpenseList` - View and filter expenses
- `ReceiptViewer` - View receipts
- `useExpenseUpload` - Custom uploads

## File Locations

```
Components:
  /src/components/vehicle/expenses/

Documentation:
  /docs/EXPENSE_TRACKING_SETUP.md
  /src/components/vehicle/expenses/README.md

Database schema:
  /docs/expense_tracking_schema.sql
```

## Support

Check these files for detailed info:
1. README.md - Component API
2. EXPENSE_TRACKING_SETUP.md - Full setup guide
3. EXPENSE_TRACKING_SUMMARY.md - Implementation details

## Performance

- Instant upload progress
- Fast expense search
- Efficient pagination
- Optimized image preview
- Real-time validation

## Security

- Authenticated access only
- User data isolation
- File type validation
- Size limits enforced
- RLS policies available

## Mobile Features

- Camera capture
- Touch-optimized UI
- Responsive design
- Works offline (with service worker)
- Full touch keyboard support

Ready to go! Start recording expenses now.
