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
    // Try to get chunks from wis_chunks first (WIS system)
    let { data: chunks, error: chunksError } = await supabase
      .from('wis_chunks')
      .select('doc_id, doc_type, ref, title, chunk_index, content, media, updated_at')
      .eq('doc_id', docId)
      .order('chunk_index');

    // If no WIS chunks found, try manual_chunks (Unimog manuals)
    if (!chunks || chunks.length === 0) {
      // Try exact match first
      let { data: manualChunks, error: manualError } = await supabase
        .from('manual_chunks')
        .select('id, manual_title, section_title, content, page_number')
        .eq('manual_title', docId)
        .order('page_number');

      // If no exact match, try fuzzy matching for common variations
      if (!manualChunks || manualChunks.length === 0) {
        const searchTerms = docId.toLowerCase().split(' ').filter(term => term.length > 2);
        let searchQuery = '';

        if (searchTerms.includes('u1700l') || searchTerms.includes('service') || searchTerms.includes('manual')) {
          const { data: fuzzyChunks, error: fuzzyError } = await supabase
            .from('manual_chunks')
            .select('id, manual_title, section_title, content, page_number')
            .ilike('manual_title', '%U1700L%')
            .order('page_number')
            .limit(50); // Limit to first 50 pages for performance

          if (!fuzzyError && fuzzyChunks && fuzzyChunks.length > 0) {
            manualChunks = fuzzyChunks;
            manualError = null;
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

    return res.status(200).json(document);

  } catch (error) {
    console.error('Document API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}