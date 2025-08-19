export const validateVideoUrl = (url: string): { isValid: boolean; message?: string } => {
  if (!url.trim()) return { isValid: true }; // Empty URL is valid (no video)
  
  try {
    const parsedUrl = new URL(url);
    
    // YouTube validation
    if (parsedUrl.hostname.includes('youtube.com') || parsedUrl.hostname.includes('youtu.be')) {
      let id = null;
      if (parsedUrl.hostname.includes('youtube.com')) {
        id = parsedUrl.searchParams.get('v');
      } else if (parsedUrl.hostname.includes('youtu.be')) {
        id = parsedUrl.pathname.split('/').pop();
      }
      
      if (!id) {
        return { 
          isValid: false, 
          message: 'Invalid YouTube URL. Please provide a valid YouTube link.' 
        };
      }
      return { isValid: true };
    } 
    // Vimeo validation
    else if (parsedUrl.hostname.includes('vimeo.com')) {
      const id = parsedUrl.pathname.split('/').pop();
      if (!id || isNaN(Number(id))) {
        return { 
          isValid: false, 
          message: 'Invalid Vimeo URL. Please provide a valid Vimeo link.' 
        };
      }
      return { isValid: true };
    }
    // Dailymotion validation
    else if (parsedUrl.hostname.includes('dailymotion.com') || parsedUrl.hostname.includes('dai.ly')) {
      let id;
      if (parsedUrl.hostname.includes('dailymotion.com')) {
        id = parsedUrl.pathname.split('/').pop()?.split('_')[0];
      } else {
        id = parsedUrl.pathname.split('/').pop();
      }
      
      if (!id) {
        return { 
          isValid: false, 
          message: 'Invalid Dailymotion URL. Please provide a valid Dailymotion link.' 
        };
      }
      return { isValid: true };
    }
    // Other video URLs
    else {
      const validExtensions = ['.mp4', '.webm', '.ogg', '.mov'];
      const hasValidExtension = validExtensions.some(ext => parsedUrl.pathname.toLowerCase().endsWith(ext));
      
      // Allow common video hosting domains even without extension
      const knownVideoDomains = ['player.vimeo.com', 'dailymotion.com', 'twitch.tv', 'streamable.com'];
      const isKnownDomain = knownVideoDomains.some(domain => parsedUrl.hostname.includes(domain));
      
      if (!hasValidExtension && !isKnownDomain) {
        return { 
          isValid: false, 
          message: 'Unsupported video URL. Please use YouTube, Vimeo, or a direct video file URL (.mp4, .webm, etc.)' 
        };
      }
      return { isValid: true };
    }
  } catch (error) {
    return { 
      isValid: false, 
      message: 'Invalid URL format. Please check the URL and try again.' 
    };
  }
};
