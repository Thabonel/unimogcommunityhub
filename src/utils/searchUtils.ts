
/**
 * Highlights search terms within a text by wrapping them in a <mark> tag
 */
export const highlightText = (text: string, query: string): string => {
  if (!query || !text) return text;
  
  const terms = query
    .toLowerCase()
    .split(' ')
    .filter(term => term.length > 0);
  
  if (terms.length === 0) return text;
  
  let result = text;
  
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
