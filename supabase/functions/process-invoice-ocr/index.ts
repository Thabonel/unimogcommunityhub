import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'
import { getUserIdFromAuth, getClientIP } from '../_shared/security.ts'
import {
  GoogleVisionOCR,
  UnstructuredOCR,
  ClaudeVisionOCR,
  InvoiceParser,
  VendorRecognition,
  CategorySuggestion,
  type InvoiceData
} from '../_shared/ocr-providers.ts'

interface InvoiceProcessingRequest {
  documentUrl: string;
  documentType: 'pdf' | 'image' | 'photo' | 'scan';
  ocrProvider?: 'google_vision' | 'unstructured' | 'claude_vision';
  expenseId?: string;
}

interface InvoiceProcessingResponse {
  success: boolean;
  expenseId: string;
  invoiceData: InvoiceData;
  requiresReview: boolean;
  processingTime: number;
  error?: string;
}

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  const startTime = Date.now()

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

    const body: InvoiceProcessingRequest = await req.json()
    const { documentUrl, documentType, ocrProvider = 'google_vision', expenseId } = body

    console.log(`[Invoice OCR] Processing document for user ${userId}`, {
      documentType,
      ocrProvider,
      hasExpenseId: !!expenseId
    })

    const clientIP = getClientIP(req)

    let currentExpenseId = expenseId

    if (!currentExpenseId) {
      const { data: expense, error: createError } = await supabase
        .from('expenses')
        .insert({
          user_id: userId,
          invoice_date: new Date().toISOString().split('T')[0],
          vendor_name: 'Processing...',
          amount: 0,
          total_amount: 0,
          category: 'Uncategorized',
          ocr_status: 'processing',
          document_url: documentUrl,
          document_type: documentType
        })
        .select('id')
        .single()

      if (createError || !expense) {
        throw new Error(`Failed to create expense record: ${createError?.message}`)
      }

      currentExpenseId = expense.id
      console.log(`[Invoice OCR] Created expense record: ${currentExpenseId}`)
    } else {
      await supabase
        .from('expenses')
        .update({ ocr_status: 'processing' })
        .eq('id', currentExpenseId)
    }

    // Ensure currentExpenseId is defined at this point
    if (!currentExpenseId) {
      throw new Error('Failed to obtain expense ID')
    }

    const { data: queueItem, error: queueError } = await supabase
      .from('ocr_processing_queue')
      .insert({
        expense_id: currentExpenseId,
        status: 'processing',
        ocr_provider: ocrProvider,
        processing_started_at: new Date().toISOString(),
        metadata: { user_id: userId, client_ip: clientIP }
      })
      .select('id')
      .single()

    if (queueError) {
      console.warn('[Invoice OCR] Failed to create queue item:', queueError)
    }

    console.log('[Invoice OCR] Downloading document...')
    const documentResponse = await fetch(documentUrl)
    if (!documentResponse.ok) {
      throw new Error(`Failed to download document: ${documentResponse.status}`)
    }
    const documentBlob = await documentResponse.blob()
    console.log(`[Invoice OCR] Document size: ${documentBlob.size} bytes`)

    let ocrResult
    try {
      if (ocrProvider === 'google_vision') {
        const googleApiKey = Deno.env.get('GOOGLE_VISION_API_KEY')
        if (!googleApiKey) {
          throw new Error('Google Vision API key not configured')
        }

        const ocr = new GoogleVisionOCR(googleApiKey)
        ocrResult = await ocr.processDocument(documentBlob)
        console.log(`[Invoice OCR] Google Vision OCR complete, confidence: ${ocrResult.confidence}%`)
      } else if (ocrProvider === 'claude_vision') {
        const anthropicApiKey = Deno.env.get('ANTHROPIC_API_KEY')
        if (!anthropicApiKey) {
          throw new Error('Anthropic API key not configured')
        }

        const ocr = new ClaudeVisionOCR(anthropicApiKey)
        ocrResult = await ocr.processDocument(documentBlob)
        console.log(`[Invoice OCR] Claude Vision OCR complete, confidence: ${ocrResult.confidence}%`)
      } else {
        const unstructuredApiKey = Deno.env.get('UNSTRUCTURED_API_KEY')
        if (!unstructuredApiKey) {
          throw new Error('Unstructured API key not configured')
        }

        const ocr = new UnstructuredOCR(unstructuredApiKey)
        const filename = documentUrl.split('/').pop() || 'document.pdf'
        ocrResult = await ocr.processDocument(documentBlob, filename)
        console.log(`[Invoice OCR] Unstructured OCR complete, confidence: ${ocrResult.confidence}%`)
      }
    } catch (ocrError: any) {
      console.error('[Invoice OCR] OCR processing failed:', ocrError)

      await supabase
        .from('expenses')
        .update({
          ocr_status: 'failed',
          ocr_error: ocrError.message,
          requires_review: true
        })
        .eq('id', currentExpenseId)

      if (queueItem) {
        await supabase
          .from('ocr_processing_queue')
          .update({
            status: 'failed',
            error_message: ocrError.message,
            processing_completed_at: new Date().toISOString()
          })
          .eq('id', queueItem.id)
      }

      throw ocrError
    }

    console.log('[Invoice OCR] Parsing invoice data...')
    const invoiceData = InvoiceParser.parseInvoiceData(ocrResult)
    console.log('[Invoice OCR] Extracted invoice data:', {
      hasInvoiceNumber: !!invoiceData.invoiceNumber,
      hasVendor: !!invoiceData.vendorName,
      hasAmount: !!invoiceData.totalAmount,
      lineItemCount: invoiceData.lineItems?.length || 0,
      confidence: invoiceData.confidence
    })

    console.log('[Invoice OCR] Recognizing vendor...')
    const vendorRecognition = await VendorRecognition.recognizeVendor(
      invoiceData.vendorName || 'Unknown',
      supabase
    )
    console.log('[Invoice OCR] Vendor recognition:', vendorRecognition)

    if (vendorRecognition.vendorId) {
      await supabase
        .from('known_vendors')
        .update({
          times_seen: supabase.rpc('increment', { row_id: vendorRecognition.vendorId }),
          last_seen_at: new Date().toISOString()
        })
        .eq('id', vendorRecognition.vendorId)
    } else if (invoiceData.vendorName && invoiceData.vendorName !== 'Unknown Vendor') {
      const { data: newVendor } = await supabase
        .from('known_vendors')
        .insert({
          name: invoiceData.vendorName,
          times_seen: 1,
          last_seen_at: new Date().toISOString()
        })
        .select('id')
        .single()

      if (newVendor) {
        console.log('[Invoice OCR] Created new vendor:', newVendor.id)
      }
    }

    console.log('[Invoice OCR] Suggesting category...')
    const categoryResult = await CategorySuggestion.suggestCategory(invoiceData, supabase)
    console.log('[Invoice OCR] Category suggestion:', categoryResult)

    const requiresReview = invoiceData.confidence < 70 || !invoiceData.totalAmount

    const updateData: any = {
      invoice_number: invoiceData.invoiceNumber,
      invoice_date: invoiceData.invoiceDate || new Date().toISOString().split('T')[0],
      vendor_name: vendorRecognition.name,
      amount: invoiceData.subtotal || invoiceData.totalAmount || 0,
      tax_amount: invoiceData.taxAmount || 0,
      total_amount: invoiceData.totalAmount || 0,
      currency: invoiceData.currency || 'USD',
      category: categoryResult.category,
      ocr_status: 'completed',
      ocr_confidence: invoiceData.confidence,
      ocr_raw_text: ocrResult.text.substring(0, 5000),
      ocr_processed_at: new Date().toISOString(),
      requires_review: requiresReview,
      metadata: {
        vendor_confidence: vendorRecognition.confidence,
        category_confidence: categoryResult.confidence,
        ocr_provider: ocrProvider,
        line_item_count: invoiceData.lineItems?.length || 0
      }
    }

    console.log('[Invoice OCR] Updating expense record...')
    const { error: updateError } = await supabase
      .from('expenses')
      .update(updateData)
      .eq('id', currentExpenseId)

    if (updateError) {
      throw new Error(`Failed to update expense: ${updateError.message}`)
    }

    if (invoiceData.lineItems && invoiceData.lineItems.length > 0) {
      console.log(`[Invoice OCR] Inserting ${invoiceData.lineItems.length} line items...`)

      const lineItemsData = invoiceData.lineItems.map((item: any, index: number) => ({
        expense_id: currentExpenseId,
        item_description: item.description,
        quantity: item.quantity,
        unit_price: item.unitPrice,
        line_total: item.lineTotal,
        tax_amount: item.taxAmount,
        line_number: index + 1
      }))

      const { error: lineItemsError } = await supabase
        .from('expense_line_items')
        .insert(lineItemsData)

      if (lineItemsError) {
        console.warn('[Invoice OCR] Failed to insert line items:', lineItemsError)
      }
    }

    if (queueItem) {
      const processingTime = Date.now() - startTime
      await supabase
        .from('ocr_processing_queue')
        .update({
          status: 'completed',
          processing_completed_at: new Date().toISOString(),
          processing_time_ms: processingTime
        })
        .eq('id', queueItem.id)
    }

    await supabase
      .from('ocr_api_usage')
      .insert({
        user_id: userId,
        provider: ocrProvider,
        endpoint: 'process-invoice-ocr',
        request_count: 1,
        pages_processed: 1,
        cost_estimate: ocrProvider === 'google_vision' ? 0.0015 :
                       ocrProvider === 'claude_vision' ? 0.004 : 0.001,
        metadata: { expense_id: currentExpenseId }
      })

    const processingTime = Date.now() - startTime

    const response: InvoiceProcessingResponse = {
      success: true,
      expenseId: currentExpenseId,
      invoiceData,
      requiresReview,
      processingTime
    }

    console.log(`[Invoice OCR] Processing complete in ${processingTime}ms`)

    return new Response(
      JSON.stringify(response),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    )

  } catch (error: any) {
    console.error('[Invoice OCR] Error:', error)

    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
        expenseId: null,
        processingTime: Date.now() - startTime
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
