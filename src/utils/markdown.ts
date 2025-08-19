import { remark } from 'remark';
import remarkHtml from 'remark-html';
import remarkGfm from 'remark-gfm';

// Configure the markdown processor
const processor = remark()
  .use(remarkGfm) // GitHub Flavored Markdown (tables, strikethrough, etc.)
  .use(remarkHtml, { sanitize: false }); // Convert to HTML

/**
 * Convert markdown text to HTML
 */
export async function markdownToHtml(markdown: string): Promise<string> {
  const result = await processor.process(markdown);
  return result.toString();
}

/**
 * Synchronous markdown to HTML conversion for simple cases
 * Note: This is a simplified version - for production use async version
 */
export function markdownToHtmlSync(markdown: string): string {
  // Simple preprocessing for common markdown patterns
  let html = markdown
    // Headers
    .replace(/^### (.*$)/gm, '<h3>$1</h3>')
    .replace(/^## (.*$)/gm, '<h2>$1</h2>')
    .replace(/^# (.*$)/gm, '<h1>$1</h1>')
    // Bold and italic
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    // Links
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
    // Line breaks (preserve paragraph breaks)
    .replace(/\n\s*\n/g, '</p><p>')
    .replace(/\n/g, '<br>');

  // Wrap in paragraph tags if content exists
  if (html.trim() && !html.includes('<h1>') && !html.includes('<h2>') && !html.includes('<h3>')) {
    html = `<p>${html}</p>`;
  }

  return html;
}

/**
 * Strip HTML tags from markdown content for plain text preview
 */
export function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}

/**
 * Generate excerpt from markdown content
 */
export function generateExcerpt(markdown: string, maxLength: number = 200): string {
  // Remove markdown formatting for excerpt
  const plainText = markdown
    .replace(/#{1,6}\s/g, '') // Remove headers
    .replace(/\*\*(.+?)\*\*/g, '$1') // Remove bold
    .replace(/\*(.+?)\*/g, '$1') // Remove italic
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Keep link text only
    .replace(/\n+/g, ' ') // Replace line breaks with spaces
    .trim();

  if (plainText.length <= maxLength) {
    return plainText;
  }

  // Find the last complete word within the limit
  const truncated = plainText.substring(0, maxLength);
  const lastSpaceIndex = truncated.lastIndexOf(' ');
  
  return lastSpaceIndex > 0 
    ? truncated.substring(0, lastSpaceIndex) + '...'
    : truncated + '...';
}