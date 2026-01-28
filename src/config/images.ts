/**
 * Centralized image configuration
 * All critical images are stored locally for fastest loading
 * Optimized images use WebP format with JPG/PNG fallbacks
 */

export const SITE_IMAGES = {
  // Logo - Used in header, footer, and mobile menu (optimized: 2.2MB -> 2.8KB)
  logo: '/images-hero/logo-optimized.webp',
  logoFallback: '/images-hero/logo-optimized.png',

  // Hero images - Critical for first impression (optimized: 2.7MB -> 243KB)
  heroMain: '/images-hero/hero-optimized.webp',
  heroMainFallback: '/images-hero/hero-optimized.jpg',
  heroAlt: '/images-hero/hero-alt-optimized.webp',
  heroAltFallback: '/images-hero/hero-alt-optimized.jpg',

  // Feature images (optimized)
  marketplace: '/images-hero/marketplace-optimized.webp',
  marketplaceFallback: '/images-hero/marketplace-optimized.jpg',
  communityForums: '/images-hero/community-forums-optimized.webp',
  communityForumsFallback: '/images-hero/community-forums-optimized.jpg',
  tripPlanner: '/images-hero/trip-planner-optimized.webp',
  tripPlannerFallback: '/images-hero/trip-planner-optimized.jpg',
  aiAssistance: '/images-hero/ai-assistance.png',
  knowledgeBase: '/images-hero/knowledge-base.png',
  messaging: '/images-hero/messaging.png',

  // Default placeholders
  placeholder: '/placeholder.svg',
  barryAvatar: '/barry-avatar-optimized.webp',
  barryAvatarFallback: '/barry-avatar-optimized.png',

  // Favicons
  favicon16: '/favicon-16x16.png',
  favicon32: '/favicon-32x32.png',
  appleTouchIcon: '/apple-touch-icon.png',
} as const;

/**
 * Helper function to get image with cache busting
 * Adds timestamp to force reload when needed
 */
export function getImageUrl(imagePath: string, bustCache = false): string {
  if (bustCache) {
    const timestamp = new Date().getTime();
    return `${imagePath}?t=${timestamp}`;
  }
  return imagePath;
}

/**
 * Check if an image exists and is loadable
 */
export function preloadImage(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
    img.src = src;
  });
}

/**
 * Preload all critical images for better performance
 */
export async function preloadCriticalImages(): Promise<void> {
  const criticalImages = [
    SITE_IMAGES.logo,
    SITE_IMAGES.heroMain,
  ];

  try {
    await Promise.all(criticalImages.map(src => preloadImage(src)));
    console.log('Critical images preloaded successfully');
  } catch (error) {
    console.warn('Some images failed to preload:', error);
  }
}

/**
 * Get image source with WebP detection and fallback
 * Returns the best supported format for the browser
 */
export function getOptimizedImageSrc(webpSrc: string, fallbackSrc: string): string {
  // Check for WebP support using canvas detection
  if (typeof document !== 'undefined') {
    const canvas = document.createElement('canvas');
    if (canvas.getContext && canvas.getContext('2d')) {
      const supportsWebP = canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
      return supportsWebP ? webpSrc : fallbackSrc;
    }
  }
  return fallbackSrc;
}