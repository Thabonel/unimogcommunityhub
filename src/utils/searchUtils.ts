
import { sanitizeText } from './sanitize';

/**
 * Highlights search terms within a text by wrapping them in a <mark> tag
 * Sanitizes input to prevent XSS attacks
 */
export const highlightText = (text: string, query: string): string => {
  if (!query || !text) return sanitizeText(text);
  
  // Sanitize both inputs first
  const safeText = sanitizeText(text);
  const safeQuery = sanitizeText(query);
  
  const terms = safeQuery
    .toLowerCase()
    .split(' ')
    .filter(term => term.length > 0);
  
  if (terms.length === 0) return safeText;
  
  let result = safeText;
  
  terms.forEach(term => {
    const regex = new RegExp(`(${escapeRegExp(term)})`, 'gi');
    result = result.replace(regex, '<mark class="bg-terrain-200 dark:bg-terrain-800 text-unimog-900 dark:text-white px-0.5 rounded-sm">$1</mark>');
  });
  
  return result;
};

/**
 * Escapes special characters in a string for use in a regular expression
 */
export const escapeRegExp = (string: string): string => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};
