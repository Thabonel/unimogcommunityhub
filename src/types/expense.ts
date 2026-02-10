// Expense tracking types - Standalone until database migration is run

export interface ExpenseCategory {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  color: string;
  icon_name: string;
  is_default: boolean;
  is_tax_deductible: boolean;
  created_at: string;
  updated_at: string;
}

export interface ExpenseCategoryInsert {
  id?: string;
  user_id: string;
  name: string;
  description?: string;
  color: string;
  icon_name: string;
  is_default?: boolean;
  is_tax_deductible?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface ExpenseCategoryUpdate {
  name?: string;
  description?: string;
  color?: string;
  icon_name?: string;
  is_default?: boolean;
  is_tax_deductible?: boolean;
  updated_at?: string;
}

export interface Expense {
  id: string;
  user_id: string;
  vehicle_id: string;
  category_id: string;
  amount: number;
  currency: string;
  description: string;
  expense_date: string;
  vendor_name?: string;
  invoice_number?: string;
  payment_method?: string;
  is_tax_deductible: boolean;
  vat_amount?: number;
  vat_rate?: number;
  notes?: string;
  is_recurring: boolean;
  recurring_pattern?: string;
  recurring_interval?: number;
  mileage?: number;
  location?: string;
  approval_status: 'pending' | 'approved' | 'rejected';
  approved_by?: string;
  approved_at?: string;
  ocr_confidence_score?: number;
  needs_review: boolean;
  created_at: string;
  updated_at: string;
}

export interface ExpenseInsert {
  id?: string;
  user_id: string;
  vehicle_id: string;
  category_id: string;
  amount: number;
  currency: string;
  description: string;
  expense_date: string;
  vendor_name?: string;
  invoice_number?: string;
  payment_method?: string;
  is_tax_deductible?: boolean;
  vat_amount?: number;
  vat_rate?: number;
  notes?: string;
  is_recurring?: boolean;
  recurring_pattern?: string;
  recurring_interval?: number;
  mileage?: number;
  location?: string;
  approval_status?: 'pending' | 'approved' | 'rejected';
  approved_by?: string;
  approved_at?: string;
  ocr_confidence_score?: number;
  needs_review?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface ExpenseUpdate {
  vehicle_id?: string;
  category_id?: string;
  amount?: number;
  currency?: string;
  description?: string;
  expense_date?: string;
  vendor_name?: string;
  invoice_number?: string;
  payment_method?: string;
  is_tax_deductible?: boolean;
  vat_amount?: number;
  vat_rate?: number;
  notes?: string;
  is_recurring?: boolean;
  recurring_pattern?: string;
  recurring_interval?: number;
  mileage?: number;
  location?: string;
  approval_status?: 'pending' | 'approved' | 'rejected';
  approved_by?: string;
  approved_at?: string;
  ocr_confidence_score?: number;
  needs_review?: boolean;
  updated_at?: string;
}

export interface ExpenseAttachment {
  id: string;
  expense_id: string;
  file_name: string;
  file_type: string;
  file_size: number;
  storage_path: string;
  public_url?: string;
  is_primary: boolean;
  ocr_extracted: boolean;
  ocr_confidence_score?: number;
  created_at: string;
}

export interface ExpenseAttachmentInsert {
  id?: string;
  expense_id: string;
  file_name: string;
  file_type: string;
  file_size: number;
  storage_path: string;
  public_url?: string;
  is_primary?: boolean;
  ocr_extracted?: boolean;
  ocr_confidence_score?: number;
  created_at?: string;
}

export interface ExpenseAttachmentUpdate {
  file_name?: string;
  file_type?: string;
  file_size?: number;
  storage_path?: string;
  public_url?: string;
  is_primary?: boolean;
  ocr_extracted?: boolean;
  ocr_confidence_score?: number;
}
// Additional expense-related types

export type ExpenseType = 'maintenance' | 'fuel' | 'modification' | 'insurance' | 'registration' | 'repair' | 'parts' | 'service' | 'other';

export type ApprovalStatus = 'pending' | 'approved' | 'rejected';

export type RecurringPattern = 'daily' | 'weekly' | 'monthly' | 'yearly';

// Form and UI types
export interface ExpenseFormData {
  vehicle_id: string;
  category_id: string;
  amount: number;
  currency: string;
  description: string;
  expense_date: string;
  vendor_name?: string;
  invoice_number?: string;
  payment_method?: string;
  notes?: string;
  mileage?: number;
  location?: string;
}

export interface ExpenseWithCategory extends Expense {
  category: ExpenseCategory;
  attachments?: ExpenseAttachment[];
}

export interface ExpenseStats {
  total_amount: number;
  currency: string;
  expense_count: number;
  categories: Record<string, number>;
  monthly_totals: Record<string, number>;
}

// Additional specialized types
export type OcrStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'skipped';

export type RecurrencePattern = 'daily' | 'weekly' | 'biweekly' | 'monthly' | 'quarterly' | 'annually';

export type TaxCategory = 'maintenance' | 'fuel' | 'modifications' | 'insurance' | 'depreciation' | 'registration' | 'parts' | 'labor' | 'other';

export type DocumentType = 'invoice' | 'receipt' | 'bill' | 'quote' | 'proof' | 'warranty' | 'other';

export type FileType = 'pdf' | 'image' | 'document' | 'spreadsheet' | 'other';

export type ExtractionType = 'amount' | 'date' | 'vendor' | 'items' | 'vat' | 'total' | 'invoice_number' | 'other';

export type SummaryType = 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';

export interface ExpenseWithDetails extends Expense {
  category?: ExpenseCategory;
  attachments?: ExpenseAttachment[];
  approval_request?: ExpenseApprovalRequest;
  created_by_user?: { display_name: string; email: string };
  approved_by_user?: { display_name: string; email: string };
}

export interface ExpenseFilter {
  vehicleId?: string;
  categoryId?: string;
  startDate?: Date;
  endDate?: Date;
  minAmount?: number;
  maxAmount?: number;
  approvalStatus?: ApprovalStatus;
  tags?: string[];
  searchQuery?: string;
}

export interface ExpenseStats {
  total_expenses: number;
  total_amount: number;
  total_vat: number;
  expense_count: number;
  category_breakdown: Record<string, { count: number; total: number }>;
}

export interface OcrExtractionResult {
  amount?: {
    value: string;
    confidence: number;
  };
  date?: {
    value: string;
    confidence: number;
  };
  vendor?: {
    value: string;
    confidence: number;
  };
  vat?: {
    value: string;
    confidence: number;
  };
  invoice_number?: {
    value: string;
    confidence: number;
  };
}

export interface CategoryBreakdown {
  [categoryName: string]: {
    count: number;
    total: number;
    percentage: number;
  };
}

export interface MonthlyExpenseData {
  month: string;
  total: number;
  expenses: Expense[];
  categoryBreakdown: CategoryBreakdown;
}

export interface VehicleExpenseStats {
  category: string;
  expense_count: number;
  total_amount: number;
  average_amount: number;
  last_expense_date: string;
}
