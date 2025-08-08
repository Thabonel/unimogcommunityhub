import { useState, useEffect } from 'react';
import { useAnalytics } from '@/hooks/use-analytics';

export interface VideoValidationResult {
  isValidUrl: boolean;
  videoId: string | null;
  videoType: 'youtube' | 'vimeo' | 'dailymotion' | 'other' | null;
  errorMessage: string | null;
}

export const useVideoValidation = (videoUrl: string) => {
  const [validationResult, setValidationResult] = useState<VideoValidationResult>({
    isValidUrl: true,
    videoId: null,
    videoType: null,
    errorMessage: null
  });
  const { trackFeatureUse } = useAnalytics();

  useEffect(() => {
    if (!videoUrl.trim()) {
      setValidationResult({
        isValidUrl: true,
        videoId: null,
        videoType: null,
        errorMessage: null
      });
      return;
    }

    try {
      const url = new URL(videoUrl);
      
      // YouTube validation
      if (url.hostname.includes('youtube.com') || url.hostname.includes('youtu.be')) {
        let id = null;
        if (url.hostname.includes('youtube.com')) {
          id = url.searchParams.get('v');
        } else if (url.hostname.includes('youtu.be')) {
          id = url.pathname.split('/').pop();
        }
        
        if (id) {
          setValidationResult({
            isValidUrl: true,
            videoId: id,
            videoType: 'youtube',
            errorMessage: null
          });
          
          trackFeatureUse('video_validation', {
            action: 'success',
            provider: 'youtube',
            videoId: id
          });
        } else {
          setValidationResult({
            isValidUrl: false,
            videoId: null,
            videoType: null,
            errorMessage: 'Invalid YouTube URL. Please use a standard YouTube URL format.'
          });
          
          trackFeatureUse('video_validation', {
            action: 'error',
            provider: 'youtube',
            error: 'missing_video_id'
          });
        }
      } 
      // Vimeo validation
      else if (url.hostname.includes('vimeo.com')) {
        const id = url.pathname.split('/').pop();
        if (id && !isNaN(Number(id))) {
          setValidationResult({
            isValidUrl: true,
            videoId: id,
            videoType: 'vimeo',
            errorMessage: null
          });
          
          trackFeatureUse('video_validation', {
            action: 'success',
            provider: 'vimeo',
            videoId: id
          });
        } else {
          setValidationResult({
            isValidUrl: false,
            videoId: null,
            videoType: null,
            errorMessage: 'Invalid Vimeo URL. Please use a standard Vimeo URL format.'
          });
          
          trackFeatureUse('video_validation', {
            action: 'error',
            provider: 'vimeo',
            error: 'invalid_video_id'
          });
        }
      }
      // Dailymotion validation
      else if (url.hostname.includes('dailymotion.com') || url.hostname.includes('dai.ly')) {
        let id;
        if (url.hostname.includes('dailymotion.com')) {
          id = url.pathname.split('/').pop()?.split('_')[0];
        } else {
          id = url.pathname.split('/').pop();
        }
        
        if (id) {
          setValidationResult({
            isValidUrl: true,
            videoId: id,
            videoType: 'dailymotion',
            errorMessage: null
          });
          
          trackFeatureUse('video_validation', {
            action: 'success',
            provider: 'dailymotion',
            videoId: id
          });
        } else {
          setValidationResult({
            isValidUrl: false,
            videoId: null,
            videoType: null,
            errorMessage: 'Invalid Dailymotion URL. Please provide a valid Dailymotion link.'
          });
          
          trackFeatureUse('video_validation', {
            action: 'error',
            provider: 'dailymotion',
            error: 'missing_video_id'
          });
        }
      } 
      // Other video URLs
      else {
        // Validate by file extension
        const validExtensions = ['.mp4', '.webm', '.ogg', '.mov'];
        const hasValidExtension = validExtensions.some(ext => url.pathname.toLowerCase().endsWith(ext));
        
        // Allow common video hosting domains even without extension
        const knownVideoDomains = ['player.vimeo.com', 'dailymotion.com', 'twitch.tv', 'streamable.com'];
        const isKnownDomain = knownVideoDomains.some(domain => url.hostname.includes(domain));
        
        if (hasValidExtension || isKnownDomain) {
          setValidationResult({
            isValidUrl: true,
            videoId: null,
            videoType: 'other',
            errorMessage: null
          });
          
          trackFeatureUse('video_validation', {
            action: 'success',
            provider: hasValidExtension ? 'direct_file' : 'known_domain',
            domain: url.hostname
          });
        } else {
          setValidationResult({
            isValidUrl: false,
            videoId: null,
            videoType: null,
            errorMessage: 'Please enter a valid video URL. Supported formats: .mp4, .webm, .ogg, .mov or known video hosting sites.'
          });
          
          trackFeatureUse('video_validation', {
            action: 'error',
            provider: 'unknown',
            domain: url.hostname,
            error: 'unsupported_format'
          });
        }
      }
    } catch (error) {
      setValidationResult({
        isValidUrl: false,
        videoId: null,
        videoType: null,
        errorMessage: 'Please enter a valid URL.'
      });
      
      trackFeatureUse('video_validation', {
        action: 'error',
        error: 'invalid_url_format',
        input: videoUrl
      });
    }
  }, [videoUrl, trackFeatureUse]);

  return validationResult;
};
