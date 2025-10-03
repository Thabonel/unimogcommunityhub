/**
 * Share Utilities - Industry Best Practices
 * Based on Twitter, Facebook, LinkedIn, and Reddit share implementations
 */

/**
 * Check if Web Share API is available (native mobile sharing)
 * Available on iOS Safari, Android Chrome, and modern mobile browsers
 */
export const isWebShareSupported = (): boolean => {
  return typeof navigator !== 'undefined' && !!navigator.share;
};

/**
 * Native Web Share API (Mobile Priority - Option 3 Hybrid Approach)
 * Uses device's built-in share menu on mobile devices
 * Falls back to custom dialog on desktop
 */
export const shareViaWebShareAPI = async (
  title: string,
  text: string,
  url: string
): Promise<boolean> => {
  if (!isWebShareSupported()) {
    return false; // Fallback to custom dialog
  }

  try {
    await navigator.share({
      title,
      text,
      url,
    });
    return true;
  } catch (error) {
    // User cancelled or error occurred
    if ((error as Error).name === 'AbortError') {
      console.log('Share cancelled by user');
    } else {
      console.error('Error sharing:', error);
    }
    return false;
  }
};

/**
 * Copy text to clipboard
 * Uses modern Clipboard API with fallback to legacy method
 */
export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    // Modern Clipboard API (preferred)
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }

    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    const successful = document.execCommand('copy');
    document.body.removeChild(textArea);

    return successful;
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
    return false;
  }
};

/**
 * Share to Facebook
 * Uses Facebook's official sharer.php endpoint
 */
export const shareToFacebook = (url: string): void => {
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
  window.open(facebookUrl, '_blank', 'width=600,height=400,noopener,noreferrer');
};

/**
 * Share to Twitter/X
 * Uses Twitter's intent/tweet endpoint
 */
export const shareToTwitter = (url: string, text?: string): void => {
  const tweetText = text ? encodeURIComponent(text) : '';
  const twitterUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${tweetText}`;
  window.open(twitterUrl, '_blank', 'width=600,height=400,noopener,noreferrer');
};

/**
 * Share to LinkedIn
 * Uses LinkedIn's shareArticle endpoint
 */
export const shareToLinkedIn = (url: string, title?: string): void => {
  const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
  window.open(linkedInUrl, '_blank', 'width=600,height=400,noopener,noreferrer');
};

/**
 * Share to WhatsApp
 * Uses WhatsApp Web on desktop, native app on mobile
 */
export const shareToWhatsApp = (url: string, text?: string): void => {
  const message = text ? `${text}\n\n${url}` : url;
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
  window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
};

/**
 * Share to Reddit
 * Uses Reddit's submit endpoint
 */
export const shareToReddit = (url: string, title?: string): void => {
  const redditUrl = `https://reddit.com/submit?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title || '')}`;
  window.open(redditUrl, '_blank', 'width=600,height=400,noopener,noreferrer');
};

/**
 * Share via Email
 * Opens user's default email client
 */
export const shareToEmail = (subject: string, body: string): void => {
  const mailtoUrl = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  window.location.href = mailtoUrl;
};

/**
 * Share to Telegram
 * Uses Telegram's share URL scheme
 */
export const shareToTelegram = (url: string, text?: string): void => {
  const message = text ? `${text}\n${url}` : url;
  const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text || '')}`;
  window.open(telegramUrl, '_blank', 'noopener,noreferrer');
};

/**
 * Generate share text for a post
 * Formats post content for social media sharing
 */
export const generateShareText = (
  postContent: string,
  authorName: string,
  maxLength: number = 200
): string => {
  const truncated = postContent.length > maxLength
    ? `${postContent.slice(0, maxLength)}...`
    : postContent;

  return `Check out this post from ${authorName} on Unimog Community Hub: "${truncated}"`;
};

/**
 * Generate shareable URL for a post
 * Creates a full URL that can be shared externally
 */
export const generatePostShareUrl = (postId: string): string => {
  const baseUrl = window.location.origin;
  return `${baseUrl}/community/post/${postId}`;
};

/**
 * Track share event
 * Logs which platform was used for analytics
 */
export interface ShareEvent {
  postId: string;
  platform: 'facebook' | 'twitter' | 'linkedin' | 'whatsapp' | 'email' | 'reddit' | 'telegram' | 'copy' | 'native';
  timestamp: Date;
}

export const createShareEvent = (
  postId: string,
  platform: ShareEvent['platform']
): ShareEvent => {
  return {
    postId,
    platform,
    timestamp: new Date(),
  };
};
