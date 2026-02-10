import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'
import { getUserIdFromAuth, sanitizeInput } from '../_shared/security.ts'

interface CreateExpenseRequest {
  invoiceNumber?: string;
  invoiceDate: string;
  dueDate?: string;
  vendorName: string;
  vendorAddress?: string;
  amount: number;
  currency?: string;
  taxAmount?: number;
  totalAmount: number;
  category: string;
  subcategory?: string;
  description?: string;
  tags?: string[];
  projectId?: string;
  tripId?: string;
  paymentStatus?: string;
  paymentDate?: string;
  paymentMethod?: string;
  notes?: string;
  lineItems?: ExpenseLineItem[];
}

interface ExpenseLineItem {
  description: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
  taxAmount?: number;
  category?: string;
  partNumber?: string;
}

interface UpdateExpenseRequest {
  id: string;
  data: Partial<CreateExpenseRequest>;
}

interface ExpenseQueryParams {
  userId?: string;
  category?: string;
  vendorName?: string;
  startDate?: string;
  endDate?: string;
  minAmount?: number;
  maxAmount?: number;
  paymentStatus?: string;
  requiresReview?: boolean;
  search?: string;
  limit?: number;
  offset?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    const { userId, error: authError } = await getUserIdFromAuth(req, supabase)
    if (authError || !userId) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized', details: authError }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
      )
    }

    const url = new URL(req.url)
    const path = url.pathname.split('/').filter(Boolean)
    const action = path[path.length - 1]

    console.log(`[Expenses API] ${req.method} ${action} - User: ${userId}`)

    if (req.method === 'POST') {
      if (action === 'create') {
        return await handleCreateExpense(req, supabase, userId)
      } else if (action === 'upload-and-process') {
        return await handleUploadAndProcess(req, supabase, userId)
      }
    } else if (req.method === 'GET') {
      if (action === 'list') {
        return await handleListExpenses(req, supabase, userId, url)
      } else if (action === 'get') {
        return await handleGetExpense(req, supabase, userId, url)
      } else if (action === 'stats') {
        return await handleGetStats(req, supabase, userId, url)
      } else if (action === 'categories') {
        return await handleGetCategories(req, supabase)
      }
    } else if (req.method === 'PUT') {
      if (action === 'update') {
        return await handleUpdateExpense(req, supabase, userId)
      } else if (action === 'review') {
        return await handleReviewExpense(req, supabase, userId)
      }
    } else if (req.method === 'DELETE') {
      if (action === 'delete') {
        return await handleDeleteExpense(req, supabase, userId, url)
      }
    }

    return new Response(
      JSON.stringify({ error: 'Invalid endpoint or method' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 404 }
    )

  } catch (error: any) {
    console.error('[Expenses API] Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})

async function handleCreateExpense(req: Request, supabase: any, userId: string) {
  const body: CreateExpenseRequest = await req.json()

  const expenseData = {
    user_id: userId,
    invoice_number: body.invoiceNumber ? sanitizeInput(body.invoiceNumber, 100) : null,
    invoice_date: body.invoiceDate,
    due_date: body.dueDate || null,
    vendor_name: sanitizeInput(body.vendorName, 255),
    vendor_address: body.vendorAddress ? sanitizeInput(body.vendorAddress, 500) : null,
    amount: body.amount,
    currency: body.currency || 'USD',
    tax_amount: body.taxAmount || 0,
    total_amount: body.totalAmount,
    category: sanitizeInput(body.category, 100),
    subcategory: body.subcategory ? sanitizeInput(body.subcategory, 100) : null,
    description: body.description ? sanitizeInput(body.description, 1000) : null,
    tags: body.tags || [],
    project_id: body.projectId || null,
    trip_id: body.tripId || null,
    payment_status: body.paymentStatus || 'unpaid',
    payment_date: body.paymentDate || null,
    payment_method: body.paymentMethod ? sanitizeInput(body.paymentMethod, 50) : null,
    notes: body.notes ? sanitizeInput(body.notes, 2000) : null,
    ocr_status: 'manual'
  }

  const { data: expense, error: createError } = await supabase
    .from('expenses')
    .insert(expenseData)
    .select()
    .single()

  if (createError) {
    throw new Error(`Failed to create expense: ${createError.message}`)
  }

  if (body.lineItems && body.lineItems.length > 0) {
    const lineItemsData = body.lineItems.map((item, index) => ({
      expense_id: expense.id,
      item_description: sanitizeInput(item.description, 500),
      quantity: item.quantity,
      unit_price: item.unitPrice,
      line_total: item.lineTotal,
      tax_amount: item.taxAmount || 0,
      category: item.category ? sanitizeInput(item.category, 100) : null,
      part_number: item.partNumber ? sanitizeInput(item.partNumber, 100) : null,
      line_number: index + 1
    }))

    const { error: lineItemsError } = await supabase
      .from('expense_line_items')
      .insert(lineItemsData)

    if (lineItemsError) {
      console.warn('[Expenses API] Failed to insert line items:', lineItemsError)
    }
  }

  console.log(`[Expenses API] Created expense: ${expense.id}`)

  return new Response(
    JSON.stringify({ success: true, expense }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 201 }
  )
}

async function handleUploadAndProcess(req: Request, supabase: any, userId: string) {
  const formData = await req.formData()
  const file = formData.get('file') as File

  if (!file) {
    throw new Error('No file provided')
  }

  const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf']
  if (!allowedTypes.includes(file.type)) {
    throw new Error(`File type ${file.type} not allowed`)
  }

  const maxSize = 10 * 1024 * 1024
  if (file.size > maxSize) {
    throw new Error('File size exceeds 10MB limit')
  }

  const filename = `${userId}/${Date.now()}-${file.name}`
  const bucketName = 'expense-documents'

  const { data: uploadData, error: uploadError } = await supabase.storage
    .from(bucketName)
    .upload(filename, file, {
      cacheControl: '3600',
      upsert: false
    })

  if (uploadError) {
    throw new Error(`Upload failed: ${uploadError.message}`)
  }

  const { data: { publicUrl } } = supabase.storage
    .from(bucketName)
    .getPublicUrl(filename)

  const documentType = file.type === 'application/pdf' ? 'pdf' : 'image'
  const ocrProvider = formData.get('ocrProvider') as string || 'google_vision'

  const ocrResponse = await fetch(`${Deno.env.get('SUPABASE_URL')}/functions/v1/process-invoice-ocr`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': req.headers.get('Authorization')!,
    },
    body: JSON.stringify({
      documentUrl: publicUrl,
      documentType,
      ocrProvider
    })
  })

  const ocrResult = await ocrResponse.json()

  console.log(`[Expenses API] Upload and OCR complete for user ${userId}`)

  return new Response(
    JSON.stringify({
      success: true,
      documentUrl: publicUrl,
      ocrResult
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
  )
}

async function handleListExpenses(req: Request, supabase: any, userId: string, url: URL) {
  const params = Object.fromEntries(url.searchParams) as any as ExpenseQueryParams

  let query = supabase
    .from('expenses')
    .select(`
      *,
      expense_line_items (*)
    `, { count: 'exact' })
    .eq('user_id', userId)

  if (params.category) {
    query = query.eq('category', params.category)
  }

  if (params.vendorName) {
    query = query.ilike('vendor_name', `%${params.vendorName}%`)
  }

  if (params.startDate) {
    query = query.gte('invoice_date', params.startDate)
  }

  if (params.endDate) {
    query = query.lte('invoice_date', params.endDate)
  }

  if (params.minAmount) {
    query = query.gte('total_amount', params.minAmount)
  }

  if (params.maxAmount) {
    query = query.lte('total_amount', params.maxAmount)
  }

  if (params.paymentStatus) {
    query = query.eq('payment_status', params.paymentStatus)
  }

  if (params.requiresReview !== undefined) {
    query = query.eq('requires_review', params.requiresReview)
  }

  if (params.search) {
    query = query.textSearch('search_vector', params.search)
  }

  const sortBy = params.sortBy || 'invoice_date'
  const sortOrder = params.sortOrder || 'desc'
  query = query.order(sortBy, { ascending: sortOrder === 'asc' })

  const limit = Math.min(params.limit || 50, 100)
  const offset = params.offset || 0
  query = query.range(offset, offset + limit - 1)

  const { data: expenses, error, count } = await query

  if (error) {
    throw new Error(`Failed to fetch expenses: ${error.message}`)
  }

  return new Response(
    JSON.stringify({
      success: true,
      expenses,
      pagination: {
        total: count,
        limit,
        offset,
        hasMore: (offset + limit) < (count || 0)
      }
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
  )
}

async function handleGetExpense(req: Request, supabase: any, userId: string, url: URL) {
  const expenseId = url.searchParams.get('id')

  if (!expenseId) {
    throw new Error('Expense ID required')
  }

  const { data: expense, error } = await supabase
    .from('expenses')
    .select(`
      *,
      expense_line_items (*)
    `)
    .eq('id', expenseId)
    .eq('user_id', userId)
    .single()

  if (error) {
    throw new Error(`Failed to fetch expense: ${error.message}`)
  }

  return new Response(
    JSON.stringify({ success: true, expense }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
  )
}

async function handleUpdateExpense(req: Request, supabase: any, userId: string) {
  const body: UpdateExpenseRequest = await req.json()

  const updateData: any = {}

  if (body.data.invoiceNumber !== undefined) updateData.invoice_number = sanitizeInput(body.data.invoiceNumber, 100)
  if (body.data.invoiceDate) updateData.invoice_date = body.data.invoiceDate
  if (body.data.dueDate !== undefined) updateData.due_date = body.data.dueDate
  if (body.data.vendorName) updateData.vendor_name = sanitizeInput(body.data.vendorName, 255)
  if (body.data.amount !== undefined) updateData.amount = body.data.amount
  if (body.data.taxAmount !== undefined) updateData.tax_amount = body.data.taxAmount
  if (body.data.totalAmount !== undefined) updateData.total_amount = body.data.totalAmount
  if (body.data.category) updateData.category = sanitizeInput(body.data.category, 100)
  if (body.data.description !== undefined) updateData.description = sanitizeInput(body.data.description || '', 1000)
  if (body.data.tags !== undefined) updateData.tags = body.data.tags
  if (body.data.paymentStatus) updateData.payment_status = body.data.paymentStatus
  if (body.data.paymentDate !== undefined) updateData.payment_date = body.data.paymentDate
  if (body.data.notes !== undefined) updateData.notes = sanitizeInput(body.data.notes || '', 2000)

  const { data: expense, error } = await supabase
    .from('expenses')
    .update(updateData)
    .eq('id', body.id)
    .eq('user_id', userId)
    .select()
    .single()

  if (error) {
    throw new Error(`Failed to update expense: ${error.message}`)
  }

  console.log(`[Expenses API] Updated expense: ${body.id}`)

  return new Response(
    JSON.stringify({ success: true, expense }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
  )
}

async function handleReviewExpense(req: Request, supabase: any, userId: string) {
  const body = await req.json()
  const { expenseId, approved, corrections } = body

  const updateData: any = {
    requires_review: false,
    reviewed_at: new Date().toISOString(),
    reviewed_by: userId
  }

  if (corrections) {
    Object.assign(updateData, corrections)
  }

  const { data: expense, error } = await supabase
    .from('expenses')
    .update(updateData)
    .eq('id', expenseId)
    .eq('user_id', userId)
    .select()
    .single()

  if (error) {
    throw new Error(`Failed to review expense: ${error.message}`)
  }

  console.log(`[Expenses API] Reviewed expense: ${expenseId}`)

  return new Response(
    JSON.stringify({ success: true, expense }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
  )
}

async function handleDeleteExpense(req: Request, supabase: any, userId: string, url: URL) {
  const expenseId = url.searchParams.get('id')

  if (!expenseId) {
    throw new Error('Expense ID required')
  }

  const { error } = await supabase
    .from('expenses')
    .delete()
    .eq('id', expenseId)
    .eq('user_id', userId)

  if (error) {
    throw new Error(`Failed to delete expense: ${error.message}`)
  }

  console.log(`[Expenses API] Deleted expense: ${expenseId}`)

  return new Response(
    JSON.stringify({ success: true }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
  )
}

async function handleGetStats(req: Request, supabase: any, userId: string, url: URL) {
  const startDate = url.searchParams.get('startDate')
  const endDate = url.searchParams.get('endDate')

  let query = supabase
    .from('expenses')
    .select('*')
    .eq('user_id', userId)

  if (startDate) query = query.gte('invoice_date', startDate)
  if (endDate) query = query.lte('invoice_date', endDate)

  const { data: expenses, error } = await query

  if (error) {
    throw new Error(`Failed to fetch expenses: ${error.message}`)
  }

  const stats = {
    totalExpenses: expenses.length,
    totalAmount: expenses.reduce((sum, exp) => sum + (exp.total_amount || 0), 0),
    averageAmount: expenses.length > 0 ? expenses.reduce((sum, exp) => sum + (exp.total_amount || 0), 0) / expenses.length : 0,
    byCategory: {} as Record<string, { count: number; total: number }>,
    byVendor: {} as Record<string, { count: number; total: number }>,
    byPaymentStatus: {} as Record<string, number>,
    requiresReview: expenses.filter(e => e.requires_review).length
  }

  for (const expense of expenses) {
    if (!stats.byCategory[expense.category]) {
      stats.byCategory[expense.category] = { count: 0, total: 0 }
    }
    stats.byCategory[expense.category].count++
    stats.byCategory[expense.category].total += expense.total_amount || 0

    if (!stats.byVendor[expense.vendor_name]) {
      stats.byVendor[expense.vendor_name] = { count: 0, total: 0 }
    }
    stats.byVendor[expense.vendor_name].count++
    stats.byVendor[expense.vendor_name].total += expense.total_amount || 0

    stats.byPaymentStatus[expense.payment_status] = (stats.byPaymentStatus[expense.payment_status] || 0) + 1
  }

  return new Response(
    JSON.stringify({ success: true, stats }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
  )
}

async function handleGetCategories(req: Request, supabase: any) {
  const { data: categories, error } = await supabase
    .from('expense_categories')
    .select('*')
    .eq('is_active', true)
    .order('sort_order')

  if (error) {
    throw new Error(`Failed to fetch categories: ${error.message}`)
  }

  return new Response(
    JSON.stringify({ success: true, categories }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
  )
}
