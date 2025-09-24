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

    // Try to get chunks from wis_chunks first (WIS system)
    let { data: chunks, error: chunksError } = await supabase
      .from('wis_chunks')
      .select('doc_id, doc_type, ref, title, chunk_index, content, media, updated_at')
      .eq('doc_id', docId)
      .order('chunk_index');

    console.log('📊 WIS chunks query result:', { chunks_count: chunks?.length || 0, error: chunksError });

    // If no WIS chunks found, try manual_chunks (Unimog manuals)
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

    // Collect unique media items and generate signed URLs
    const mediaMap = new Map();
    
    for (const chunk of chunks) {
      if (chunk.media && Array.isArray(chunk.media)) {
        for (const mediaItem of chunk.media) {
          const key = `${mediaItem.bucket}-${mediaItem.file_name}`;
          if (!mediaMap.has(key)) {
            try {
              const { data: signedUrl, error: urlError } = await supabase.rpc('wis_media_url', {
                bucket: mediaItem.bucket,
                file_name: mediaItem.file_name,
                expires_in: 3600
              });

              mediaMap.set(key, {
                ...mediaItem,
                signedUrl: urlError ? null : signedUrl
              });
            } catch (error) {
              console.warn(`Failed to generate URL for ${mediaItem.file_name}:`, error);
              mediaMap.set(key, mediaItem);
            }
          }
        }
      }
    }

    const document = {
      doc_id: chunks[0].doc_id,
      doc_type: chunks[0].doc_type,
      ref: chunks[0].ref,
      title: chunks[0].title,
      chunks: chunks,
      media: Array.from(mediaMap.values()),
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