#!/usr/bin/env node

/**
 * Upload Critical PDFs to Supabase Storage
 * Part of Barry AI PDF Integration Plan - Day 1
 */

import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { config } from 'dotenv'

// Load environment variables
config()

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://ydevatqwkoccxhtejdor.supabase.co'
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseServiceKey) {
  console.error('❌ SUPABASE_SERVICE_ROLE_KEY not found in environment')
  console.log('💡 This script needs the service role key to upload to storage')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function uploadPDF(localPath, storagePath) {
  try {
    console.log(`📄 Uploading ${localPath} → ${storagePath}`)

    // Read the PDF file
    const fileBuffer = readFileSync(localPath)

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from('manuals')
      .upload(storagePath, fileBuffer, {
        contentType: 'application/pdf',
        upsert: true // Overwrite if exists
      })

    if (error) {
      console.error(`❌ Upload failed for ${storagePath}:`, error.message)
      return false
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('manuals')
      .getPublicUrl(storagePath)

    console.log(`✅ Uploaded successfully: ${urlData.publicUrl}`)
    return true

  } catch (err) {
    console.error(`❌ Error uploading ${localPath}:`, err.message)
    return false
  }
}

async function main() {
  console.log('🚀 Starting PDF Upload Process')
  console.log('📋 Barry AI Perfect Index System - Day 1 Execution')
  console.log('')

  const uploads = [
    {
      local: '/tmp/RPS-Catalog-Complete.pdf',
      storage: 'rps/RPS-Catalog-Complete.pdf',
      description: 'RPS Parts Catalog (786 chunks)'
    },
    {
      local: '/Users/thabonel/Documents/Documents - MacBook Air/MOG/AAAAAMANUALS/U1700Lunimog435sm.pdf',
      storage: 'workshop/U1700L-U435-Workshop-Manual-Volume-1.pdf',
      description: 'U1700L Workshop Manual (1,183 chunks)'
    }
  ]

  let successCount = 0

  for (const upload of uploads) {
    console.log(`📖 ${upload.description}`)
    const success = await uploadPDF(upload.local, upload.storage)
    if (success) successCount++
    console.log('')
  }

  console.log(`📊 Upload Results: ${successCount}/${uploads.length} successful`)

  if (successCount === uploads.length) {
    console.log('🎉 All PDFs uploaded successfully!')
    console.log('')
    console.log('📋 Next Steps (Day 2):')
    console.log('  1. Update manual_chunks with pdf_storage_path')
    console.log('  2. Create dynamic URL generation function')
    console.log('  3. Set up page mapping verification')
  } else {
    console.log('⚠️  Some uploads failed. Check errors above.')
    process.exit(1)
  }
}

main().catch(console.error)