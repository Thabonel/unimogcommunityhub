
/**
 * Helper functions for video URL parsing and validation
 */

export interface ParsedVideo {
  videoId: string;
  provider: 'youtube' | 'vimeo' | 'dailymotion' | 'direct';
}

/**
 * Parse a video URL to extract the video ID and provider
 */
export function parseVideoUrl(videoUrl: string): ParsedVideo | null {
  try {
    const url = new URL(videoUrl);
    
    // YouTube
    if (url.hostname.includes('youtube.com') || url.hostname.includes('youtu.be')) {
      const videoId = url.hostname.includes('youtube.com') 
        ? url.searchParams.get('v')
        : url.pathname.split('/').pop();
      
      if (!videoId) return null;
      
      return {
        videoId,
        provider: 'youtube'
      };
    }
    
    // Vimeo
    if (url.hostname.includes('vimeo.com')) {
      const videoId = url.pathname.split('/').pop();
      
      if (!videoId || isNaN(Number(videoId))) return null;
      
      return {
        videoId,
        provider: 'vimeo'
      };
    }
    
    // Dailymotion
    if (url.hostname.includes('dailymotion.com') || url.hostname.includes('dai.ly')) {
      let videoId;
      if (url.hostname.includes('dailymotion.com')) {
        videoId = url.pathname.split('/').pop()?.split('_')[0];
      } else {
        videoId = url.pathname.split('/').pop();
      }
      
      if (!videoId) return null;
      
      return {
        videoId,
        provider: 'dailymotion'
      };
    }
    
    // Direct video URL
    return {
      videoId: videoUrl,
      provider: 'direct'
    };
    
  } catch (error) {
    console.error("Error parsing video URL:", error);
    return null;
  }
}
