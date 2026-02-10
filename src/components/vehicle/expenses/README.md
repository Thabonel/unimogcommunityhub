# Expense Tracking Component Library

Complete invoice and receipt management system for the Unimog Community Hub. Track vehicle expenses with multi-method file upload support, real-time validation, and comprehensive categorization.

## Features

- **Multi-Method Upload**: Drag & drop, file browser, camera capture
- **Real-Time Progress**: Upload progress indicators for each file
- **Mobile Optimized**: Touch-friendly interface with camera support
- **File Validation**: Client-side validation with user-friendly errors
- **Receipt Viewer**: Image preview and file download support
- **Expense Management**: Full CRUD operations with filtering and search
- **Category Support**: 13 predefined categories with icons
- **Multi-Currency**: Support for major currencies (USD, EUR, GBP, AUD, etc.)

## Components

### CameraCapture
Mobile camera component for capturing invoice photos directly.

```tsx
import { CameraCapture } from '@/components/vehicle/expenses';

<CameraCapture
  isOpen={isOpen}
  onCapture={(file) => console.log('Photo captured:', file)}
  onClose={() => setIsOpen(false)}
/>
```

**Props:**
- `isOpen`: Dialog open state
- `onCapture`: Callback when photo is captured
- `onClose`: Called when dialog closes

### ReceiptUploadZone
Flexible upload zone with drag & drop, file browser, and camera integration.

```tsx
import { ReceiptUploadZone } from '@/components/vehicle/expenses';

<ReceiptUploadZone
  files={uploadedFiles}
  onFilesChange={setUploadedFiles}
  uploadProgress={progress}
  maxFiles={10}
/>
```

**Props:**
- `files`: Array of File objects
- `onFilesChange`: Called when files list changes
- `uploadProgress`: Optional upload progress array
- `disabled`: Disable interactions
- `maxFiles`: Maximum number of files (default: 10)

### ExpenseForm
Complete form for expense entry with validation.

```tsx
import { ExpenseForm } from '@/components/vehicle/expenses';

<ExpenseForm
  vehicles={vehicles}
  onSubmit={async (data, files) => {
    // Handle submission
  }}
  onCancel={() => setModalOpen(false)}
/>
```

**Props:**
- `vehicles`: Array of Vehicle objects
- `onSubmit`: Form submission handler
- `onCancel`: Cancel button handler
- `isUpdate`: Show update mode UI
- `initialValues`: Pre-fill form values

### ExpenseCard
Individual expense display card with actions.

```tsx
import { ExpenseCard } from '@/components/vehicle/expenses';

<ExpenseCard
  expense={expenseRecord}
  receiptCount={3}
  onEdit={() => handleEdit(expense)}
  onDelete={() => handleDelete(expense)}
  onViewReceipts={() => handleViewReceipts(expense)}
/>
```

**Props:**
- `expense`: ExpenseRecord object
- `receiptCount`: Number of receipts
- `onEdit`: Edit button handler
- `onDelete`: Delete button handler
- `onViewReceipts`: View receipts handler

### ExpenseList
Organized expense list with search, filter, and sort.

```tsx
import { ExpenseList } from '@/components/vehicle/expenses';

<ExpenseList
  expenses={expenses}
  receiptCounts={counts}
  selectedVehicleId={vehicleId}
  onAddExpense={() => setModalOpen(true)}
  onEdit={handleEdit}
  onDelete={handleDelete}
  onViewReceipts={handleView}
  isLoading={isLoading}
/>
```

**Props:**
- `expenses`: Array of ExpenseRecord
- `receiptCounts`: Map of expense ID to receipt count
- `selectedVehicleId`: Filter by vehicle
- `onAddExpense`: Add button handler
- `onEdit`: Edit handler
- `onDelete`: Delete handler
- `onViewReceipts`: View receipts handler
- `isLoading`: Loading state

### ExpenseUploadModal
Modal wrapper for the expense form.

```tsx
import { ExpenseUploadModal } from '@/components/vehicle/expenses';

<ExpenseUploadModal
  isOpen={isOpen}
  vehicles={vehicles}
  onSubmit={handleSubmit}
  onClose={() => setIsOpen(false)}
/>
```

### ReceiptViewer
Multi-receipt viewer with image preview and file download.

```tsx
import { ReceiptViewer } from '@/components/vehicle/expenses';

<ReceiptViewer
  isOpen={isOpen}
  receipts={receipts}
  onClose={() => setIsOpen(false)}
  onDelete={handleDeleteReceipt}
  publicUrlGetter={(path) => getPublicUrl(path)}
/>
```

**Props:**
- `isOpen`: Dialog open state
- `receipts`: Array of ExpenseReceipt
- `onClose`: Close handler
- `onDownload`: Download handler
- `onDelete`: Delete handler
- `publicUrlGetter`: Function to get public URLs

## Hooks

### useExpenseUpload
Manages file uploads to Supabase Storage.

```tsx
import { useExpenseUpload } from '@/components/vehicle/expenses';

const {
  uploadFiles,
  deleteFile,
  getPublicUrl,
  uploadProgress,
  isUploading,
  validateFile,
} = useExpenseUpload();

// Upload files
const { success, files, errors } = await uploadFiles(
  fileArray,
  expenseId
);

// Delete file
const result = await deleteFile(storagePath);

// Get public URL
const url = getPublicUrl(storagePath);
```

## Types

```tsx
export type ExpenseCategory =
  | "fuel"
  | "maintenance"
  | "repair"
  | "parts"
  | "tires"
  | "insurance"
  | "registration"
  | "toll"
  | "parking"
  | "accommodation"
  | "camping"
  | "equipment"
  | "other";

export interface ExpenseRecord {
  id: string;
  vehicle_id: string;
  user_id: string;
  amount: number;
  currency: string;
  category: ExpenseCategory;
  description: string;
  expense_date: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface ExpenseReceipt {
  id: string;
  expense_id: string;
  file_name: string;
  file_type: string;
  file_size: number;
  storage_path: string;
  is_primary: boolean;
  uploaded_at: string;
  created_at: string;
}

export interface ExpenseFormValues {
  vehicle_id: string;
  amount: number;
  currency: string;
  category: ExpenseCategory;
  description: string;
  expense_date: Date;
  notes?: string;
}
```

## Complete Integration Example

```tsx
import React, { useState } from 'react';
import { ExpenseTrackingSection } from '@/components/vehicle/expenses';
import { Vehicle } from '@/hooks/vehicle-maintenance/types';

interface VehicleDashboardProps {
  vehicle: Vehicle;
  allVehicles: Vehicle[];
}

export const VehicleDashboard: React.FC<VehicleDashboardProps> = ({
  vehicle,
  allVehicles,
}) => {
  return (
    <div className="space-y-8">
      {/* Vehicle Info */}
      <div>
        <h1 className="text-3xl font-bold">{vehicle.name}</h1>
        <p className="text-muted-foreground">
          {vehicle.year} {vehicle.model}
        </p>
      </div>

      {/* Expense Tracking */}
      <ExpenseTrackingSection
        vehicleId={vehicle.id}
        vehicles={allVehicles}
      />
    </div>
  );
};
```

## File Upload Configuration

### Supported File Types
- Images: JPEG, JPG, PNG, WebP
- Documents: PDF
- Office: Word (.doc, .docx), Excel (.xls, .xlsx)

### Size Limits
- Maximum file size: 10 MB per file
- Maximum files per upload: 10 files
- Total storage: Depends on Supabase plan

## Mobile Features

The component library is fully optimized for mobile:

- **Camera Access**: Direct camera integration on mobile browsers
- **Touch Gestures**: Swipe to navigate receipts
- **Responsive Layout**: Adaptive UI for all screen sizes
- **Offline Support**: Works with service worker caching

## Error Handling

All components include comprehensive error handling:

- Network errors with retry logic
- File validation with user-friendly messages
- Upload failures with recovery options
- Storage quota exceeded handling
- Permission denied error messages

## Performance Optimizations

- Lazy load receipt images
- Pagination for large expense lists
- Efficient search with debouncing
- Optimized file upload with chunking
- Minimal re-renders with React.memo

## Browser Support

- Chrome/Edge: Full support
- Firefox: Full support (camera on HTTPS)
- Safari: Full support (iOS 14.5+)
- Mobile browsers: Full support with camera access

## Accessibility

- Keyboard navigation support
- Screen reader friendly
- High contrast support
- Focus management
- ARIA labels and descriptions

## Security

- Client-side file validation
- Server-side RLS policies
- Signed URLs for sensitive files
- XSS protection
- CSRF token handling

## FAQ

**Q: Can users edit expense details after creation?**
A: Yes, pass the expense as `initialValues` to the form and set `isUpdate={true}`.

**Q: How do I get public URLs for receipts?**
A: Use the `getPublicUrl()` function from `useExpenseUpload` hook.

**Q: Can I customize the expense categories?**
A: Yes, modify the `expenseCategories` array in `ExpenseForm.tsx` and the `ExpenseCategory` type.

**Q: How do I handle offline uploads?**
A: Implement a service worker with IndexedDB queue for failed uploads.

**Q: Can I add receipt OCR?**
A: Yes, integrate a third-party OCR service like Tesseract.js or use Supabase Functions.

## Future Enhancements

- Receipt OCR for automatic data extraction
- AI-powered expense categorization
- Multi-currency conversion
- Receipt search by text
- Expense forecasting
- Budget alerts
- Recurring expense templates
- CSV/PDF exports
- Team expense splitting
