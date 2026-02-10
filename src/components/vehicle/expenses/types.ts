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

export interface ExpenseUploadFormValues extends ExpenseFormValues {
  receipts: File[];
}
