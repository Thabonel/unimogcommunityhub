import { supabase } from '@/lib/supabase-client';

// Types for WIS data
export interface WISMedia {
  type: 'photo' | 'diagram' | 'schematic' | 'table' | 'chart';
  bucket: string;
  file_name: string;
  description: string;
}

export interface WISChunk {
  doc_id: string;
  doc_type: 'part' | 'procedure' | 'bulletin';
  ref: string;
  title: string;
  chunk_index?: number;
  content: string;
  media: WISMedia[];
  updated_at?: string;
}

export interface WISDocument {
  doc_id: string;
  doc_type: 'part' | 'procedure' | 'bulletin';
  ref: string;
  title: string;
  chunks: WISChunk[];
  media: WISMedia[];
}

// Model configuration
export interface WISModel {
  name: string;
  code: string;
  prefix: string;
  flag?: string;
  subtitle?: string;
  isDefault?: boolean;
}

export const WIS_MODELS: WISModel[] = [
  {
    name: "Unimog U1700L (435 Series)",
    code: "U1700L",
    prefix: "U1700L OM366 435",
    flag: "🇦🇺",
    subtitle: "Most Popular • Australian Military",
    isDefault: true
  },
  {
    name: "Unimog U1300L (435 Series)",
    code: "U1300L", 
    prefix: "U1300L OM366 435",
    subtitle: "European Variant"
  }
];

// WIS search function
export async function wisSearch(query: string, modelPrefix?: string): Promise<WISChunk[]> {
  const q = modelPrefix ? `${modelPrefix} ${query}` : query;
  
  const { data: hits, error } = await supabase.rpc('wis_search', {
    q,
    limit_rows: 40
  });

  if (error) {
    console.error('WIS search error:', error);
    throw new Error('Failed to search WIS database');
  }

  return hits || [];
}

// Get full document (all chunks for a doc_id)
export async function getFullDocument(docId: string): Promise<WISChunk[]> {
  const { data: chunks, error } = await supabase
    .from('wis_chunks')
    .select('doc_id, doc_type, ref, title, chunk_index, content, media, updated_at')
    .eq('doc_id', docId)
    .order('chunk_index');

  if (error) {
    console.error('Error fetching full document:', error);
    throw new Error('Failed to load full document');
  }

  return chunks || [];
}

// Generate signed URL for media
export async function getMediaUrl(bucket: string, fileName: string, expiresIn: number = 3600): Promise<string> {
  try {
    // First try the RPC function
    const { data: signedUrl, error } = await supabase.rpc('wis_media_url', {
      bucket,
      file_name: fileName,
      expires_in: expiresIn
    });

    if (error) {
      console.warn('RPC wis_media_url failed, falling back to storage.from():', error);
      // Fallback to direct storage API
      const { data } = await supabase.storage.from(bucket).createSignedUrl(fileName, expiresIn);
      return data?.signedUrl || `${supabase.supabaseUrl}/storage/v1/object/public/${bucket}/${fileName}`;
    }

    return signedUrl;
  } catch (error) {
    console.warn('Media URL generation failed, using public URL:', error);
    // Final fallback to public URL
    return `${supabase.supabaseUrl}/storage/v1/object/public/${bucket}/${fileName}`;
  }
}

// Group chunks by document
export function groupChunksByDocument(chunks: WISChunk[]): WISDocument[] {
  const docMap = new Map<string, WISDocument>();

  chunks.forEach(chunk => {
    if (!docMap.has(chunk.doc_id)) {
      docMap.set(chunk.doc_id, {
        doc_id: chunk.doc_id,
        doc_type: chunk.doc_type,
        ref: chunk.ref,
        title: chunk.title,
        chunks: [],
        media: []
      });
    }

    const doc = docMap.get(chunk.doc_id)!;
    doc.chunks.push(chunk);
    
    // Collect unique media items
    chunk.media?.forEach(mediaItem => {
      const exists = doc.media.some(m => 
        m.bucket === mediaItem.bucket && m.file_name === mediaItem.file_name
      );
      if (!exists) {
        doc.media.push(mediaItem);
      }
    });
  });

  return Array.from(docMap.values());
}

// Check if filename is an image
export function isImageFile(fileName: string): boolean {
  return /\.(jpg|jpeg|png|gif|webp)$/i.test(fileName);
}

// Check if filename is a PDF
export function isPDFFile(fileName: string): boolean {
  return /\.pdf$/i.test(fileName);
}

// Filter documents by type
export function filterByDocType(documents: WISDocument[], docType: 'part' | 'procedure' | 'bulletin'): WISDocument[] {
  return documents.filter(doc => doc.doc_type === docType);
}

// Filter for wiring diagrams (procedures/bulletins with diagram/schematic media)
export function filterWiringDiagrams(documents: WISDocument[]): WISDocument[] {
  return documents.filter(doc => 
    (doc.doc_type === 'procedure' || doc.doc_type === 'bulletin') &&
    doc.media.some(m => m.type === 'diagram' || m.type === 'schematic')
  );
}