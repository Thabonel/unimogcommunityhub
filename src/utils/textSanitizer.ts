
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
    
  // Remove common binary file markers like "PK" (ZIP/DOCX file header)
  sanitized = sanitized.replace(/^PK[\s\S]{0,20}word\//, '');
  
  // Clean up any remaining binary data indicators
  sanitized = sanitized.replace(/PNG[\s\S]{0,30}IHDR/g, '[Image content removed]');
  sanitized = sanitized.replace(/JFIF[\s\S]{0,30}/g, '[Image content removed]');
  
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
  
  // If more than 15% are unusual characters, probably binary
  return (unusualChars / sampleSize) > 0.15;
}
