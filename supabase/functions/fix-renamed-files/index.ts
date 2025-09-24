import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
}

interface RenamedFile {
  name: string
  id: string
  created_at: string
  updated_at: string
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    )

    console.log('🔍 Starting storage fix for renamed files...')

    // Step 1: Get all renamed files (those with the bulk rename timestamp)
    const { data: renamedFiles, error: queryError } = await supabaseClient
      .from('storage.objects')
      .select('name, id, created_at, updated_at')
      .eq('bucket_id', 'manuals')
      .eq('updated_at', '2025-09-24 02:52:58.292022+00')

    if (queryError) {
      console.error('❌ Database query error:', queryError)
      throw queryError
    }

    console.log(`📋 Found ${renamedFiles.length} renamed files to fix`)

    const results: Array<{name: string, status: string, error?: string}> = []

    // Step 2: Test each file's accessibility
    for (const file of renamedFiles as RenamedFile[]) {
      console.log(`🔍 Testing file: ${file.name}`)

      try {
        // Test 1: Try to download a small chunk to see if file exists
        const { data: downloadData, error: downloadError } = await supabaseClient
          .storage
          .from('manuals')
          .download(file.name)

        if (downloadError) {
          console.log(`❌ Download failed for ${file.name}: ${downloadError.message}`)
          results.push({
            name: file.name,
            status: 'BROKEN',
            error: downloadError.message
          })
          continue
        }

        if (downloadData) {
          console.log(`✅ File ${file.name} is accessible (${downloadData.size} bytes)`)
          results.push({ name: file.name, status: 'WORKING' })
        }

      } catch (error) {
        console.log(`💥 Unexpected error testing ${file.name}:`, error)
        results.push({
          name: file.name,
          status: 'ERROR',
          error: error.message
        })
      }
    }

    // Step 3: Provide summary
    const workingCount = results.filter(r => r.status === 'WORKING').length
    const brokenCount = results.filter(r => r.status === 'BROKEN').length
    const errorCount = results.filter(r => r.status === 'ERROR').length

    console.log(`📊 Summary: ${workingCount} working, ${brokenCount} broken, ${errorCount} errors`)

    return new Response(
      JSON.stringify({
        success: true,
        summary: {
          total: results.length,
          working: workingCount,
          broken: brokenCount,
          errors: errorCount
        },
        results
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )

  } catch (error) {
    console.error('💥 Function error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})