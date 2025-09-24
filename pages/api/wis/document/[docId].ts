import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from "@supabase/supabase-js";

// Server-side Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { docId } = req.query;

  if (!docId || typeof docId !== 'string') {
    return res.status(400).json({ error: 'Document ID is required' });
  }

  try {
    console.log('🔍 API: Received docId:', docId);

    // Skip WIS chunks completely - they contain only fake generated data
    // Go directly to real manual_chunks (Unimog manuals)
    let chunks = null;
    let chunksError = null;
    if (!chunks || chunks.length === 0) {
      console.log('🔄 Trying manual_chunks with exact match for:', docId);

      // Try exact match first
      let { data: manualChunks, error: manualError } = await supabase
        .from('manual_chunks')
        .select('id, manual_title, section_title, content, page_number')
        .eq('manual_title', docId)
        .order('page_number');

      console.log('📊 Manual chunks exact match:', { chunks_count: manualChunks?.length || 0, error: manualError });

      // If no exact match, try enhanced fuzzy matching
      if (!manualChunks || manualChunks.length === 0) {
        console.log('🔄 Trying enhanced fuzzy matching for:', docId);

        const searchTerms = docId.toLowerCase().split(' ').filter(term => term.length > 2);
        console.log('🔍 Search terms extracted:', searchTerms);

        // Enhanced fuzzy matching patterns
        const fuzzyPatterns = [];

        // U1700L specific patterns
        if (searchTerms.some(term => term.includes('u1700') || term.includes('435'))) {
          fuzzyPatterns.push('%U1700L%', '%U435%', '%Workshop Manual%');
        }

        // Generic repair manual patterns
        if (searchTerms.includes('light') && searchTerms.includes('repair')) {
          fuzzyPatterns.push('%Light Repair%');
        }
        if (searchTerms.includes('medium') && searchTerms.includes('repair')) {
          fuzzyPatterns.push('%Medium Repair%');
        }
        if (searchTerms.includes('heavy') && searchTerms.includes('repair')) {
          fuzzyPatterns.push('%Heavy Repair%');
        }

        // Default patterns for any manual
        if (searchTerms.includes('manual') || searchTerms.includes('service')) {
          fuzzyPatterns.push('%Manual%', '%Service%', '%Workshop%');
        }

        // Try each pattern
        for (const pattern of fuzzyPatterns) {
          console.log('🎯 Trying fuzzy pattern:', pattern);

          const { data: fuzzyChunks, error: fuzzyError } = await supabase
            .from('manual_chunks')
            .select('id, manual_title, section_title, content, page_number')
            .ilike('manual_title', pattern)
            .order('page_number')
            .limit(100); // Increased limit for better coverage

          console.log(`📊 Fuzzy match "${pattern}":`, { chunks_count: fuzzyChunks?.length || 0, error: fuzzyError });

          if (!fuzzyError && fuzzyChunks && fuzzyChunks.length > 0) {
            manualChunks = fuzzyChunks;
            manualError = null;
            console.log('✅ Found matching manual:', fuzzyChunks[0].manual_title);
            break; // Stop at first successful match
          }
        }

        // Last resort: try partial word matching
        if (!manualChunks || manualChunks.length === 0) {
          console.log('🔄 Last resort: trying partial word matching');

          for (const term of searchTerms) {
            if (term.length > 3) { // Only use meaningful terms
              const { data: partialChunks, error: partialError } = await supabase
                .from('manual_chunks')
                .select('id, manual_title, section_title, content, page_number')
                .ilike('manual_title', `%${term}%`)
                .order('page_number')
                .limit(50);

              console.log(`📊 Partial match "${term}":`, { chunks_count: partialChunks?.length || 0, error: partialError });

              if (!partialError && partialChunks && partialChunks.length > 0) {
                manualChunks = partialChunks;
                manualError = null;
                console.log('✅ Found partial match:', partialChunks[0].manual_title);
                break;
              }
            }
          }
        }
      }

      if (manualError) {
        console.error('Error fetching manual chunks:', manualError);
        return res.status(500).json({ error: 'Failed to fetch document' });
      }

      // Transform manual chunks to match expected format
      if (manualChunks && manualChunks.length > 0) {
        chunks = manualChunks.map(chunk => ({
          doc_id: chunk.manual_title,
          doc_type: 'manual',
          ref: `${chunk.manual_title} - Page ${chunk.page_number}`,
          title: chunk.section_title || chunk.manual_title,
          chunk_index: chunk.page_number,
          content: chunk.content,
          chunk_id: chunk.id, // Include the actual chunk ID for image lookup
          media: [], // Manual chunks don't have embedded media yet
          updated_at: null
        }));
        chunksError = null;
      }
    }

    if (chunksError) {
      console.error('Error fetching document chunks:', chunksError);
      return res.status(500).json({ error: 'Failed to fetch document' });
    }

    if (!chunks || chunks.length === 0) {
      return res.status(404).json({ error: 'Document not found' });
    }

    // Fetch real manual images AND full PDF for this document
    const mediaMap = new Map();
    let media = [];

    try {
      // Get manual images associated with the chunks
      const chunkIds = chunks.map(chunk => chunk.chunk_id).filter(id => id);

      if (chunkIds.length > 0) {
        const { data: manualImages, error: imagesError } = await supabase
          .from('manual_images')
          .select('image_path, description, alt_text')
          .in('chunk_id', chunkIds);

        if (!imagesError && manualImages && manualImages.length > 0) {
          console.log(`📸 Found ${manualImages.length} images for manual chunks`);

          // Generate signed URLs for the manual images
          for (const image of manualImages) {
            if (image.image_path) {
              try {
                // Extract bucket name from path (e.g., "u1700l-u435/page_0081_img_00.png" -> "u1700l-u435")
                const pathParts = image.image_path.split('/');
                const bucketName = pathParts[0];
                const fileName = pathParts.slice(1).join('/');

                // Generate signed URL for the image
                const { data: signedUrlData, error: urlError } = await supabase.storage
                  .from(bucketName)
                  .createSignedUrl(fileName, 3600); // 1 hour expiry

                if (!urlError && signedUrlData?.signedUrl) {
                  const mediaItem = {
                    type: 'image',
                    bucket: bucketName,
                    file_name: fileName,
                    description: image.description || image.alt_text || `Manual image from ${fileName}`,
                    signed_url: signedUrlData.signedUrl
                  };

                  media.push(mediaItem);
                  mediaMap.set(fileName, mediaItem);
                }
              } catch (urlError) {
                console.error('Error generating signed URL for image:', image.image_path, urlError);
              }
            }
          }
        }
      }

      // ALSO provide full PDF access for the complete manual
      if (chunks[0].doc_id === 'U1700L U435 Workshop Manual Volume 1') {
        try {
          const { data: pdfUrl, error: pdfError } = await supabase.storage
            .from('manuals')
            .createSignedUrl('U1700L-U435-Workshop-Manual-Volume-1.pdf', 3600);

          if (!pdfError && pdfUrl?.signedUrl) {
            const pdfMediaItem = {
              type: 'pdf',
              bucket: 'manuals',
              file_name: 'U1700L-U435-Workshop-Manual-Volume-1.pdf',
              description: 'Complete U1700L U435 Workshop Manual (Full PDF)',
              signed_url: pdfUrl.signedUrl
            };

            media.unshift(pdfMediaItem); // Put PDF first in the list
            mediaMap.set('full-pdf', pdfMediaItem);
            console.log('📄 Added full PDF access to media list');
          }
        } catch (pdfError) {
          console.error('Error generating signed URL for full PDF:', pdfError);
        }
      }

      console.log(`✅ Generated ${media.length} signed URLs (images + PDF)`);
    } catch (error) {
      console.error('Error fetching manual media:', error);
    }

    const document = {
      doc_id: chunks[0].doc_id,
      doc_type: chunks[0].doc_type,
      ref: chunks[0].ref,
      title: chunks[0].title,
      chunks: chunks,
      media: media,
      updated_at: chunks[0].updated_at
    };

    console.log('✅ API: Returning document:', {
      doc_id: document.doc_id,
      title: document.title,
      chunks_count: document.chunks.length,
      media_count: document.media.length,
      requested_docId: docId
    });

    return res.status(200).json(document);

  } catch (error) {
    console.error('Document API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}