// Expense Management Service
// Frontend client for Invoice OCR & Expense Processing backend

import { supabase } from '@/lib/supabase-client'

export interface Expense {
  id: string
  user_id: string
  invoice_number?: string
  invoice_date: string
  due_date?: string
  vendor_name: string
  vendor_address?: string
  vendor_tax_id?: string
  amount: number
  currency: string
  tax_amount: number
  total_amount: number
  category: string
  subcategory?: string
  description?: string
  ocr_status: 'pending' | 'processing' | 'completed' | 'failed' | 'manual'
  ocr_confidence?: number
  ocr_raw_text?: string
  ocr_processed_at?: string
  ocr_error?: string
  document_url?: string
  document_type?: 'pdf' | 'image' | 'photo' | 'scan'
  document_mime_type?: string
  requires_review: boolean
  reviewed_at?: string
  reviewed_by?: string
  tags?: string[]
  project_id?: string
  trip_id?: string
  payment_status: 'unpaid' | 'paid' | 'pending' | 'overdue'
  payment_date?: string
  payment_method?: string
  notes?: string
  metadata?: Record<string, any>
  created_at: string
  updated_at: string
  expense_line_items?: ExpenseLineItem[]
}

export interface ExpenseLineItem {
  id: string
  expense_id: string
  item_description: string
  quantity: number
  unit_price: number
  line_total: number
  tax_rate?: number
  tax_amount: number
  category?: string
  part_number?: string
  sku?: string
  line_number: number
  metadata?: Record<string, any>
  created_at: string
}

export interface ExpenseCategory {
  id: string
  name: string
  parent_category?: string
  icon?: string
  color?: string
  keywords?: string[]
  vendor_patterns?: string[]
  sort_order: number
  is_active: boolean
  created_at: string
}

export interface CreateExpenseRequest {
  invoiceNumber?: string
  invoiceDate: string
  dueDate?: string
  vendorName: string
  vendorAddress?: string
  amount: number
  currency?: string
  taxAmount?: number
  totalAmount: number
  category: string
  subcategory?: string
  description?: string
  tags?: string[]
  projectId?: string
  tripId?: string
  paymentStatus?: 'unpaid' | 'paid' | 'pending' | 'overdue'
  paymentDate?: string
  paymentMethod?: string
  notes?: string
  lineItems?: Omit<ExpenseLineItem, 'id' | 'expense_id' | 'created_at' | 'line_number'>[]
}

export interface ExpenseFilters {
  category?: string
  vendorName?: string
  startDate?: string
  endDate?: string
  minAmount?: number
  maxAmount?: number
  paymentStatus?: 'unpaid' | 'paid' | 'pending' | 'overdue'
  requiresReview?: boolean
  search?: string
  limit?: number
  offset?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface ExpenseStats {
  totalExpenses: number
  totalAmount: number
  averageAmount: number
  byCategory: Record<string, { count: number; total: number }>
  byVendor: Record<string, { count: number; total: number }>
  byPaymentStatus: Record<string, number>
  requiresReview: number
}

export interface OCRProcessingResult {
  success: boolean
  expenseId: string
  invoiceData: {
    invoiceNumber?: string
    invoiceDate?: string
    dueDate?: string
    vendorName?: string
    vendorAddress?: string
    vendorTaxId?: string
    subtotal?: number
    taxAmount?: number
    totalAmount?: number
    currency?: string
    lineItems?: Array<{
      description: string
      quantity: number
      unitPrice: number
      lineTotal: number
      taxAmount?: number
    }>
    confidence: number
  }
  requiresReview: boolean
  processingTime: number
  error?: string
}

export class ExpenseService {
  private static baseUrl = import.meta.env.VITE_SUPABASE_URL

  private static async getAuthToken(): Promise<string> {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      throw new Error('Not authenticated')
    }
    return session.access_token
  }

  private static async apiCall<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = await this.getAuthToken()

    const response = await fetch(
      `${this.baseUrl}/functions/v1/expenses-api/${endpoint}`,
      {
        ...options,
        headers: {
          ...options.headers,
          'Authorization': `Bearer ${token}`
        }
      }
    )

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || `API error: ${response.status}`)
    }

    return response.json()
  }

  static async createExpense(data: CreateExpenseRequest): Promise<Expense> {
    const result = await this.apiCall<{ success: boolean; expense: Expense }>('create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })

    return result.expense
  }

  static async uploadAndProcessInvoice(
    file: File,
    ocrProvider: 'google_vision' | 'unstructured' = 'google_vision'
  ): Promise<{ documentUrl: string; ocrResult: OCRProcessingResult }> {
    const token = await this.getAuthToken()

    // Upload file directly to Supabase storage
    const { data: user } = await supabase.auth.getUser()
    if (!user.user) {
      throw new Error('User not authenticated')
    }

    const filename = `${user.user.id}/${Date.now()}-${file.name}`
    const { error: uploadError } = await supabase.storage
      .from('expense-receipts')
      .upload(filename, file, {
        cacheControl: '3600',
        upsert: false
      })

    if (uploadError) {
      throw new Error(`Upload failed: ${uploadError.message}`)
    }

    // Get signed URL for the uploaded file (private bucket)
    const { data: signedUrlData, error: signedUrlError } = await supabase.storage
      .from('expense-receipts')
      .createSignedUrl(filename, 3600)

    if (signedUrlError || !signedUrlData?.signedUrl) {
      throw new Error(`Failed to create signed URL: ${signedUrlError?.message}`)
    }

    const publicUrl = signedUrlData.signedUrl

    // Call the working process-invoice-ocr function directly
    const documentType = file.type === 'application/pdf' ? 'pdf' : 'image'

    const response = await fetch(
      `${this.baseUrl}/functions/v1/process-invoice-ocr`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          documentUrl: publicUrl,
          documentType,
          ocrProvider
        })
      }
    )

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || `OCR processing failed: ${response.status}`)
    }

    const ocrResult = await response.json()

    return {
      documentUrl: publicUrl,
      ocrResult
    }
  }

  static async listExpenses(
    filters: ExpenseFilters = {}
  ): Promise<{
    expenses: Expense[]
    pagination: {
      total: number
      limit: number
      offset: number
      hasMore: boolean
    }
  }> {
    const queryParams = new URLSearchParams()

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, String(value))
      }
    })

    const result = await this.apiCall<{
      success: boolean
      expenses: Expense[]
      pagination: {
        total: number
        limit: number
        offset: number
        hasMore: boolean
      }
    }>(`list?${queryParams.toString()}`)

    return {
      expenses: result.expenses,
      pagination: result.pagination
    }
  }

  static async getExpense(id: string): Promise<Expense> {
    const result = await this.apiCall<{ success: boolean; expense: Expense }>(
      `get?id=${id}`
    )

    return result.expense
  }

  static async updateExpense(
    id: string,
    data: Partial<CreateExpenseRequest>
  ): Promise<Expense> {
    const result = await this.apiCall<{ success: boolean; expense: Expense }>('update', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ id, data })
    })

    return result.expense
  }

  static async reviewExpense(
    expenseId: string,
    approved: boolean,
    corrections?: Partial<Expense>
  ): Promise<Expense> {
    const result = await this.apiCall<{ success: boolean; expense: Expense }>('review', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ expenseId, approved, corrections })
    })

    return result.expense
  }

  static async deleteExpense(id: string): Promise<void> {
    await this.apiCall<{ success: boolean }>(`delete?id=${id}`, {
      method: 'DELETE'
    })
  }

  static async getStatistics(
    startDate?: string,
    endDate?: string
  ): Promise<ExpenseStats> {
    const queryParams = new URLSearchParams()
    if (startDate) queryParams.append('startDate', startDate)
    if (endDate) queryParams.append('endDate', endDate)

    const result = await this.apiCall<{ success: boolean; stats: ExpenseStats }>(
      `stats?${queryParams.toString()}`
    )

    return result.stats
  }

  static async getCategories(): Promise<ExpenseCategory[]> {
    const result = await this.apiCall<{
      success: boolean
      categories: ExpenseCategory[]
    }>('categories')

    return result.categories
  }

  static async searchExpenses(query: string, limit = 20): Promise<Expense[]> {
    const result = await this.listExpenses({
      search: query,
      limit
    })

    return result.expenses
  }

  static async getExpensesByCategory(
    category: string,
    startDate?: string,
    endDate?: string
  ): Promise<Expense[]> {
    const result = await this.listExpenses({
      category,
      startDate,
      endDate,
      limit: 100
    })

    return result.expenses
  }

  static async getExpensesByVendor(
    vendorName: string,
    startDate?: string,
    endDate?: string
  ): Promise<Expense[]> {
    const result = await this.listExpenses({
      vendorName,
      startDate,
      endDate,
      limit: 100
    })

    return result.expenses
  }

  static async getUnpaidExpenses(): Promise<Expense[]> {
    const result = await this.listExpenses({
      paymentStatus: 'unpaid',
      sortBy: 'invoice_date',
      sortOrder: 'asc',
      limit: 100
    })

    return result.expenses
  }

  static async getExpensesNeedingReview(): Promise<Expense[]> {
    const result = await this.listExpenses({
      requiresReview: true,
      sortBy: 'created_at',
      sortOrder: 'desc',
      limit: 50
    })

    return result.expenses
  }

  static async markAsPaid(
    expenseId: string,
    paymentDate: string,
    paymentMethod: string
  ): Promise<Expense> {
    return this.updateExpense(expenseId, {
      paymentStatus: 'paid',
      paymentDate,
      paymentMethod
    })
  }

  static async addTags(expenseId: string, tags: string[]): Promise<Expense> {
    const expense = await this.getExpense(expenseId)
    const existingTags = expense.tags || []
    const newTags = [...new Set([...existingTags, ...tags])]

    return this.updateExpense(expenseId, {
      tags: newTags
    })
  }

  static async removeTags(expenseId: string, tags: string[]): Promise<Expense> {
    const expense = await this.getExpense(expenseId)
    const existingTags = expense.tags || []
    const newTags = existingTags.filter(tag => !tags.includes(tag))

    return this.updateExpense(expenseId, {
      tags: newTags
    })
  }

  static formatCurrency(amount: number, currency = 'USD'): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency
    }).format(amount)
  }

  static formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  static getCategoryIcon(category: string): string {
    const iconMap: Record<string, string> = {
      'Vehicle Maintenance': 'wrench',
      'Parts & Accessories': 'cog',
      'Fuel': 'fuel',
      'Tires & Wheels': 'circle',
      'Oil & Fluids': 'droplet',
      'Registration & Insurance': 'file-text',
      'Tolls & Parking': 'parking',
      'Trip Expenses': 'map',
      'Tools & Equipment': 'tool',
      'Upgrades & Modifications': 'zap'
    }

    return iconMap[category] || 'receipt'
  }

  static getStatusColor(status: string): string {
    const colorMap: Record<string, string> = {
      'unpaid': 'red',
      'paid': 'green',
      'pending': 'yellow',
      'overdue': 'red'
    }

    return colorMap[status] || 'gray'
  }

  static calculateTotalTax(expenses: Expense[]): number {
    return expenses.reduce((sum, exp) => sum + (exp.tax_amount || 0), 0)
  }

  static calculateTotalByCategory(expenses: Expense[]): Record<string, number> {
    const totals: Record<string, number> = {}

    for (const expense of expenses) {
      if (!totals[expense.category]) {
        totals[expense.category] = 0
      }
      totals[expense.category] += expense.total_amount
    }

    return totals
  }

  static getTopVendors(expenses: Expense[], limit = 5): Array<{ name: string; total: number; count: number }> {
    const vendorMap: Record<string, { total: number; count: number }> = {}

    for (const expense of expenses) {
      if (!vendorMap[expense.vendor_name]) {
        vendorMap[expense.vendor_name] = { total: 0, count: 0 }
      }
      vendorMap[expense.vendor_name].total += expense.total_amount
      vendorMap[expense.vendor_name].count++
    }

    return Object.entries(vendorMap)
      .map(([name, data]) => ({ name, ...data }))
      .sort((a, b) => b.total - a.total)
      .slice(0, limit)
  }

  static validateExpenseData(data: CreateExpenseRequest): string[] {
    const errors: string[] = []

    if (!data.vendorName?.trim()) {
      errors.push('Vendor name is required')
    }

    if (!data.invoiceDate) {
      errors.push('Invoice date is required')
    }

    if (data.totalAmount <= 0) {
      errors.push('Total amount must be greater than 0')
    }

    if (!data.category?.trim()) {
      errors.push('Category is required')
    }

    if (data.lineItems) {
      for (const item of data.lineItems) {
        if (!item.item_description?.trim()) {
          errors.push('Line item description is required')
        }
        if (item.quantity <= 0) {
          errors.push('Line item quantity must be greater than 0')
        }
        if (item.unit_price < 0) {
          errors.push('Line item unit price cannot be negative')
        }
      }
    }

    return errors
  }
}
