#!/usr/bin/env node

/**
 * Test Barry AI PDF Link Generation
 * Day 3 - Testing enhanced Barry AI with PDF URLs
 */

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ydevatqwkoccxhtejdor.supabase.co'
const supabaseAnonKey = '<JWT_TOKEN>'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function testBarryPdfLinks() {
  console.log('🧪 Testing Barry AI PDF Link Generation')
  console.log('=' .repeat(60))

  const testQueries = [
    {
      query: "how do i replace the windscreen wiper motor",
      expectedPage: 715,
      expectedManual: "U1700L U435 Workshop Manual"
    },
    {
      query: "differential parts diagram",
      expectedPage: null, // RPS pages vary
      expectedManual: "RPS Catalog"
    },
    {
      query: "U1700L oil change procedure",
      expectedPage: null, // Need to find correct page
      expectedManual: "U1700L U435 Workshop Manual"
    }
  ]

  for (const test of testQueries) {
    console.log(`\\n🔍 Testing: "${test.query}"`)
    console.log('-'.repeat(50))

    try {
      const { data, error } = await supabase.functions.invoke('chat-with-barry-agentic', {
        body: {
          messages: [
            {
              role: 'user',
              content: test.query
            }
          ],
          userContext: 'Test User - PDF Link Testing'
        }
      })

      if (error) {
        console.error('❌ Error calling Barry:', error)
        continue
      }

      console.log('📝 Response:', data.content.substring(0, 200) + '...')
      console.log('🔗 Manual References:')

      if (data.manualReferences && data.manualReferences.length > 0) {
        data.manualReferences.forEach((ref, index) => {
          console.log(`  ${index + 1}. ${ref.title || ref.manual_title}`)
          console.log(`     Page: ${ref.page_number}`)
          console.log(`     URL: ${ref.storage_url || 'NO URL'}`)
          console.log(`     Type: ${ref.type}`)

          if (ref.storage_url) {
            console.log('     ✅ PDF URL Generated')

            // Check if it's the expected page
            if (test.expectedPage && ref.page_number === test.expectedPage) {
              console.log(`     🎯 Expected page ${test.expectedPage} found!`)
            }

            // Verify URL format
            if (ref.storage_url.includes('manuals/') && ref.storage_url.includes('#page=')) {
              console.log('     ✅ URL format is correct')
            } else {
              console.log('     ⚠️  URL format needs review')
            }
          } else {
            console.log('     ❌ No PDF URL')
          }
          console.log()
        })
      } else {
        console.log('  ❌ No manual references returned')
      }

      console.log('📊 Knowledge Mode:', data.knowledgeMode)
      console.log('📊 Search Results:', data.searchResultCount)

    } catch (err) {
      console.error('❌ Test error:', err.message)
    }
  }

  // Test the direct URL generation function
  console.log('\\n🧪 Testing Direct URL Generation Function')
  console.log('=' .repeat(60))

  const urlTests = [
    { manual: 'U1700L U435 Workshop Manual Volume 1', page: 715 },
    { manual: 'RPS Catalog', page: 45 }
  ]

  for (const test of urlTests) {
    try {
      const { data, error } = await supabase.rpc('generate_pdf_url', {
        manual_title_param: test.manual,
        page_number_param: test.page
      })

      if (error) {
        console.error(`❌ Error generating URL for ${test.manual}:`, error)
      } else {
        console.log(`✅ ${test.manual} page ${test.page}:`)
        console.log(`   ${data}`)
      }
    } catch (err) {
      console.error('❌ URL generation error:', err.message)
    }
  }
}

testBarryPdfLinks().catch(console.error)