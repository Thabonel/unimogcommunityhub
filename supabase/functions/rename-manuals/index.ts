import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Create Supabase client with service role key
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // List all files in the manuals bucket
    const { data: files, error: listError } = await supabase.storage
      .from('manuals')
      .list('', { limit: 1000 })

    if (listError) {
      throw new Error(`Failed to list files: ${listError.message}`)
    }

    // Filter files with "pending" in the name
    const pendingFiles = files?.filter(file =>
      file.name.toLowerCase().includes('pending')
    ) || []

    console.log(`Found ${pendingFiles.length} files with "pending" in the name`)

    const results = []

    // Process each file
    for (const file of pendingFiles) {
      const oldName = file.name

      // Generate new name by removing "pending_" patterns
      let newName = oldName

      // Remove various pending patterns
      newName = newName.replace(/pending_\d+_[a-z0-9]+_\d+\s*[-_]\s*/gi, '')
      newName = newName.replace(/pending_\d+_[a-z0-9]+_/gi, '')
      newName = newName.replace(/pending_\d+_/gi, '')
      newName = newName.replace(/pending[-_]/gi, '')
      newName = newName.replace(/^pending/gi, '')

      // Clean up any double spaces or underscores
      newName = newName.replace(/\s+/g, ' ').trim()
      newName = newName.replace(/__+/g, '_')
      newName = newName.replace(/--+/g, '-')

      // Ensure the filename still has .pdf extension
      if (!newName.toLowerCase().endsWith('.pdf')) {
        newName = newName.replace(/\.pdf$/i, '') + '.pdf'
      }

      // Skip if the new name is the same
      if (newName === oldName) {
        results.push({
          oldName,
          newName,
          status: 'skipped',
          message: 'No change needed'
        })
        continue
      }

      try {
        // Copy the file with the new name
        const { error: copyError } = await supabase.storage
          .from('manuals')
          .copy(oldName, newName)

        if (copyError) {
          throw new Error(`Failed to copy: ${copyError.message}`)
        }

        // Delete the old file
        const { error: deleteError } = await supabase.storage
          .from('manuals')
          .remove([oldName])

        if (deleteError) {
          console.warn(`File copied but failed to delete original: ${deleteError.message}`)
        }

        // Update the manual_metadata table if the record exists
        const { data: metadata } = await supabase
          .from('manual_metadata')
          .select('id')
          .eq('filename', oldName)
          .single()

        if (metadata) {
          await supabase
            .from('manual_metadata')
            .update({
              filename: newName,
              title: newName.replace('.pdf', '').replace(/[-_]/g, ' '),
              updated_at: new Date().toISOString()
            })
            .eq('id', metadata.id)

          // Also update manual_chunks if they exist
          await supabase
            .from('manual_chunks')
            .update({
              manual_filename: newName
            })
            .eq('manual_id', metadata.id)
        }

        results.push({
          oldName,
          newName,
          status: 'success',
          message: 'Renamed successfully'
        })

      } catch (error) {
        results.push({
          oldName,
          newName,
          status: 'error',
          message: error.message
        })
      }
    }

    // Get final list of files
    const { data: finalFiles } = await supabase.storage
      .from('manuals')
      .list('', { limit: 1000 })

    const finalList = finalFiles?.map(f => ({
      name: f.name,
      size: f.metadata?.size || 0
    })) || []

    return new Response(
      JSON.stringify({
        success: true,
        processed: results,
        currentFiles: finalList
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
        success: false,
        error: error.message
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    )
  }
})