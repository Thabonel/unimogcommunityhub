
/**
 * Sanitizes text content from uploaded files to ensure it's readable and safe
 * @param text The raw text content from a file
 * @returns Sanitized text content
 */
export function sanitizeText(text: string): string {
  if (!text) return '';
  
  // Remove problematic unicode escape sequences that cause JSON parsing errors
  let sanitized = text.replace(/\\u0000/g, '')  // Remove null bytes
                      .replace(/\u0000/g, '')    // Also remove actual null bytes
                      .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, ''); // Remove control characters
  
  // Replace any Windows-style line endings with Unix-style
  sanitized = sanitized.replace(/\r\n/g, '\n');
  
  // Remove any excessive newlines (more than 2 in a row)
  sanitized = sanitized.replace(/\n{3,}/g, '\n\n');
  
  // Handle other common problematic characters
  sanitized = sanitized
    .replace(/[\uFFFD\uFFFE\uFFFF]/g, '') // Remove replacement characters and BOM
    .replace(/�/g, '');                   // Remove replacement character visually
  
  // Remove Office document binary artifacts
  sanitized = sanitized.replace(/PK[\s\S]{0,50}word\//g, ''); // Remove ZIP header and word/ path
  sanitized = sanitized.replace(/word\/media\/[^\s]+/g, '');  // Remove references to media files
  
  // Clean up any remaining binary data indicators
  sanitized = sanitized.replace(/PNG[\s\S]{0,100}IHDR/g, '[Image content removed]');
  sanitized = sanitized.replace(/JFIF[\s\S]{0,100}/g, '[Image content removed]');
  sanitized = sanitized.replace(/pHYs[\s\S]{0,50}/g, '');
  sanitized = sanitized.replace(/sRGB[\s\S]{0,50}/g, '');
  sanitized = sanitized.replace(/IDAT[\s\S]{0,100}/g, '');
  sanitized = sanitized.replace(/gAMA[\s\S]{0,50}/g, '');
  
  // Replace sequences of non-readable characters with spaces
  sanitized = sanitized.replace(/[^\x20-\x7E\n\t\u00A0-\u00FF]{2,}/g, ' ');
  
  // Remove leftover isolated special characters that aren't useful
  sanitized = sanitized.replace(/[^\x20-\x7E\n\t\u00A0-\u00FF]/g, '');
  
  // Cleanup excessive spaces
  sanitized = sanitized.replace(/ {3,}/g, '  ');
  
  return sanitized;
}

/**
 * Detects if the input appears to be binary data rather than readable text
 * @param text The text to check
 * @returns true if the input appears to be binary data
 */
export function isBinaryContent(text: string): boolean {
  if (!text || text.length < 10) return false;
  
  // Check for common binary file headers
  if (text.startsWith('PK')) return true; // ZIP/DOCX
  if (text.includes('IHDR') && text.includes('PNG')) return true; // PNG
  if (text.includes('JFIF')) return true; // JPEG
  
  // Check for Word document specific markers
  if (text.includes('word/document.xml')) return true;
  if (text.includes('word/_rels')) return true;
  
  // Count unusual characters
  let unusualChars = 0;
  const sampleSize = Math.min(text.length, 1000);
  
  for (let i = 0; i < sampleSize; i++) {
    const code = text.charCodeAt(i);
    if ((code < 32 || code > 126) && 
        code !== 9 && // tab
        code !== 10 && // line feed
        code !== 13) { // carriage return
      unusualChars++;
    }
  }
  
  // If more than 10% are unusual characters, probably binary
  return (unusualChars / sampleSize) > 0.10;
}

/**
 * Tests if extracted text is actually readable
 * @param text The text to check
 * @returns true if the text appears to be readable
 */
export function isReadableText(text: string): boolean {
  if (!text || text.length < 20) return false;
  
  // Remove common formatting artifacts
  const cleanText = text.replace(/\[Image content removed\]/g, '')
                        .replace(/\s+/g, ' ')
                        .trim();
  
  // Check if there's enough actual text content
  if (cleanText.length < 20) return false;
  
  // Check if we have some readable words (at least 3 characters)
  const words = cleanText.split(/\s+/).filter(word => word.length >= 3);
  if (words.length < 5) return false;
  
  // Check if we have some common words that suggest real text
  const commonWords = ['the', 'and', 'for', 'this', 'that', 'with', 'from', 'have', 'are'];
  const hasCommonWords = commonWords.some(word => 
    cleanText.toLowerCase().includes(' ' + word + ' ') || 
    cleanText.toLowerCase().startsWith(word + ' ')
  );
  
  return hasCommonWords;
}
