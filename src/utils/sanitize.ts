/**
 * Input sanitization utilities using DOMPurify
 * Prevents XSS attacks by sanitizing user-generated content
 * 
 * Note: For React components, prefer using the SafeContent component
 * which provides more comprehensive security measures.
 */

import DOMPurify from 'dompurify';

/**
 * Sanitize user input with production-ready security settings
 * Matches the SafeContent component configuration
 */
export const sanitizeInput = (dirty: string): string => {
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: ['p', 'br', 'b', 'i', 'em', 'strong', 'u', 'a', 'ul', 'ol', 'li', 'blockquote', 'code', 'pre'],
    ALLOWED_ATTR: ['href', 'target', 'rel'],
    ALLOW_DATA_ATTR: false,
    USE_PROFILES: { html: true },
    ADD_ATTR: ['rel'],
    FORCE_BODY: true,
    FORBID_TAGS: ['style', 'script', 'iframe', 'form', 'input', 'textarea'],
    FORBID_ATTR: ['style', 'onerror', 'onload', 'onclick']
  });
};

/**
 * Sanitize text-only content (no HTML tags allowed)
 */
export const sanitizeText = (dirty: string): string => {
  return DOMPurify.sanitize(dirty, { 
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [],
    ALLOW_DATA_ATTR: false
  });
};

/**
 * Sanitize basic HTML content (minimal tags for simple formatting)
 */
export const sanitizeBasicHTML = (dirty: string): string => {
  return DOMPurify.sanitize(dirty, { 
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'br'],
    ALLOWED_ATTR: [],
    ALLOW_DATA_ATTR: false,
    FORBID_TAGS: ['style', 'script', 'iframe', 'form', 'input', 'textarea'],
    FORBID_ATTR: ['style', 'onerror', 'onload', 'onclick']
  });
};

/**
 * Sanitize URL to prevent dangerous protocols
 */
export const sanitizeUrl = (url: string): string => {
  if (!url || typeof url !== 'string') return '#';
  
  const cleanUrl = DOMPurify.sanitize(url.trim());
  
  // Block dangerous protocols
  const dangerousProtocols = ['javascript:', 'data:', 'vbscript:', 'file:', 'about:'];
  const lowerUrl = cleanUrl.toLowerCase();
  
  for (const protocol of dangerousProtocols) {
    if (lowerUrl.startsWith(protocol)) {
      return '#';
    }
  }
  
  return cleanUrl;
};

/**
 * React component wrapper for safely rendering sanitized HTML
 * For complex content, prefer using the SafeContent component instead
 */
export const createSanitizedHTML = (content: string, sanitizer = sanitizeInput) => {
  if (!content || typeof content !== 'string') return { __html: '' };
  return { __html: sanitizer(content) };
};