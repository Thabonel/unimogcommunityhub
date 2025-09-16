import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface ShareDocumentRequest {
  documentData: {
    title: string
    description?: string
    documentType: 'powerpoint' | 'excel' | 'pdf' | 'checklist' | 'procedure'
    fileName: string
    fileContent: string // Base64 encoded file content
    vehicleModels?: string[]
    categories?: string[]
    tags?: string[]
    originalQuery?: string
    generationMethod?: string
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Get the authorization header
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'No authorization header' }),
        {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Create Supabase client with service role for full access
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Create client with user token for user verification
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: authHeader },
        },
      }
    )

    // Verify the user is authenticated
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser()
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Get the request body
    const { documentData }: ShareDocumentRequest = await req.json()
    if (!documentData || !documentData.title || !documentData.fileName || !documentData.fileContent) {
      return new Response(
        JSON.stringify({ error: 'Missing required document data' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    console.log('Sharing generated document:', {
      title: documentData.title,
      type: documentData.documentType,
      fileName: documentData.fileName,
      userId: user.id
    })

    // Decode the file content from base64
    const fileBuffer = Uint8Array.from(atob(documentData.fileContent), c => c.charCodeAt(0))

    // Generate unique file path
    const fileExtension = documentData.fileName.split('.').pop()
    const timestamp = Date.now()
    const uniqueFileName = `${timestamp}_${Math.random().toString(36).substr(2, 9)}.${fileExtension}`
    const filePath = `community-documents/${uniqueFileName}`

    // Upload file to Supabase Storage using service role
    const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
      .from('documents')
      .upload(filePath, fileBuffer, {
        contentType: getContentType(documentData.documentType),
        cacheControl: '3600'
      })

    if (uploadError) {
      console.error('File upload error:', uploadError)
      return new Response(
        JSON.stringify({
          error: 'Failed to upload document to storage',
          details: uploadError.message
        }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    console.log('File uploaded successfully:', filePath)

    // Create document record in community_documents table
    const { data: document, error: dbError } = await supabaseAdmin
      .from('community_documents')
      .insert({
        title: documentData.title,
        description: documentData.description || `Generated ${documentData.documentType} document`,
        document_type: documentData.documentType,
        file_name: documentData.fileName,
        file_path: filePath,
        file_size: fileBuffer.length,
        created_by: user.id,
        is_public: true, // Make community documents public by default
        vehicle_models: documentData.vehicleModels || [],
        categories: documentData.categories || [],
        tags: documentData.tags || [],
        original_query: documentData.originalQuery,
        generation_method: documentData.generationMethod || 'barry_ai'
      })
      .select('*')
      .single()

    if (dbError) {
      console.error('Database insert error:', dbError)

      // Clean up uploaded file
      await supabaseAdmin.storage.from('documents').remove([filePath])

      return new Response(
        JSON.stringify({
          error: 'Failed to save document metadata',
          details: dbError.message
        }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    console.log('Document record created:', document.id)

    // Generate signed URL for immediate access
    const { data: signedUrlData, error: signedUrlError } = await supabaseAdmin.storage
      .from('documents')
      .createSignedUrl(filePath, 3600) // 1 hour expiry

    const signedUrl = signedUrlError ? null : signedUrlData.signedUrl

    return new Response(
      JSON.stringify({
        success: true,
        document: {
          id: document.id,
          title: document.title,
          fileName: document.file_name,
          filePath: document.file_path,
          documentType: document.document_type,
          createdAt: document.created_at,
          downloadUrl: signedUrl
        },
        message: 'Document successfully shared with the community!'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    )

  } catch (error) {
    console.error('Edge function error:', error)
    return new Response(
      JSON.stringify({
        error: 'Internal server error',
        details: error.message
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})

function getContentType(documentType: string): string {
  switch (documentType) {
    case 'powerpoint':
      return 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
    case 'excel':
      return 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    case 'pdf':
      return 'application/pdf'
    case 'checklist':
    case 'procedure':
      return 'application/pdf' // Assuming these are PDF format
    default:
      return 'application/octet-stream'
  }
}