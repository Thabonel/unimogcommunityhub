/**
 * KMZ (Zipped KML) Parser
 * Handles KMZ files which are compressed KML files
 */

import { parseUniversalTrackFile } from './universalTrackParser';

/**
 * Parse KMZ file (zipped KML)
 * Note: This requires the file to be provided as an ArrayBuffer
 */
export async function parseKMZ(arrayBuffer: ArrayBuffer, filename?: string) {
  try {
    // We need to unzip the KMZ file
    // For browser environment, we'll use the native DecompressionStream API if available
    // Or fall back to a simple implementation
    
    // Convert ArrayBuffer to Blob
    const blob = new Blob([arrayBuffer]);
    
    // Try to use DecompressionStream API (modern browsers)
    if ('DecompressionStream' in window) {
      const ds = new DecompressionStream('gzip');
      const decompressedStream = blob.stream().pipeThrough(ds);
      const decompressedBlob = await new Response(decompressedStream).blob();
      const text = await decompressedBlob.text();
      
      // Parse as KML
      return parseUniversalTrackFile(text, filename?.replace('.kmz', '.kml'));
    }
    
    // Fallback: Try to detect if it's actually just a KML file renamed to KMZ
    const text = new TextDecoder().decode(arrayBuffer);
    if (text.includes('<kml') || text.includes('<?xml')) {
      console.warn('KMZ file appears to be uncompressed KML');
      return parseUniversalTrackFile(text, filename?.replace('.kmz', '.kml'));
    }
    
    return {
      success: false,
      error: 'KMZ decompression not supported in this browser. Please extract the KML file manually.'
    };
    
  } catch (error) {
    console.error('KMZ parsing error:', error);
    return {
      success: false,
      error: `Failed to parse KMZ file: ${error}`
    };
  }
}