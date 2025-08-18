/**
 * Centralized image configuration
 * All critical images are stored locally for fastest loading
 * No external dependencies or environment variables required
 */

export const SITE_IMAGES = {
  // Logo - Used in header, footer, and mobile menu
  logo: '/images-hero/56c274f5-535d-42c0-98b7-fc29272c4faa.png',
  
  // Hero images - Critical for first impression
  heroMain: '/images-hero/2828a9e2-f57a-4737-b4b6-a24cfc14a95a.png',
  heroAlt: '/images-hero/2cfd91cd-2db0-40fa-8b3f-d6b3505e98ef.png',
  
  // Default placeholders
  placeholder: '/placeholder.svg',
  barryAvatar: '/barry-avatar.png',
  
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