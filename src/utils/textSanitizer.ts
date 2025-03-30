
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
  
  return sanitized;
}
