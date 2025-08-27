import DOMPurify from 'dompurify';

interface SafeContentProps {
  content: string;
  className?: string;
  allowedTags?: string[];
  allowedAttributes?: string[];
}

/**
 * Safe content renderer that sanitizes user-generated HTML to prevent XSS attacks
 * Uses DOMPurify with secure defaults for production environments
 */
export const SafeContent = ({ 
  content, 
  className = '',
  allowedTags = ['p', 'br', 'b', 'i', 'em', 'strong', 'u', 'a', 'ul', 'ol', 'li', 'blockquote', 'code', 'pre'],
  allowedAttributes = ['href', 'target', 'rel']
}: SafeContentProps) => {
  // Configure DOMPurify for secure defaults
  const cleanContent = DOMPurify.sanitize(content, {
    ALLOWED_TAGS: allowedTags,
    ALLOWED_ATTR: allowedAttributes,
    ALLOW_DATA_ATTR: false,
    USE_PROFILES: { html: true },
    // Force target="_blank" links to have rel="noopener noreferrer"
    ADD_ATTR: ['rel'],
    FORCE_BODY: true,
    // Remove dangerous elements
    FORBID_TAGS: ['style', 'script', 'iframe', 'form', 'input', 'textarea'],
    FORBID_ATTR: ['style', 'onerror', 'onload', 'onclick']
  });

  // Add rel="noopener noreferrer" to all external links
  const processedContent = cleanContent.replace(
    /(<a\s+[^>]*target=["']_blank["'][^>]*)>/gi,
    (match) => {
      if (!match.includes('rel=')) {
        return match.replace('>', ' rel="noopener noreferrer">');
      }
      return match + '>';
    }
  );

  return (
    <div 
      className={className}
      dangerouslySetInnerHTML={{ __html: processedContent }} 
    />
  );
};

export default SafeContent;