import { useState } from 'react';
import { toast } from '@/hooks/use-toast';
import { createPost } from '@/services/post';

// Maximum character limit for posts
const MAX_CHARS = 500;

type PostType = 'text' | 'image' | 'video' | 'link';

export const usePostForm = (onPostCreated: () => void) => {
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [postType, setPostType] = useState<PostType>('text');
  const [imageUrl, setImageUrl] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [linkTitle, setLinkTitle] = useState('');
  const [linkDescription, setLinkDescription] = useState('');
  
  const charCount = content.length;
  const isOverLimit = charCount > MAX_CHARS;
  const hasContent = content.trim().length > 0;
  
  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
  };
  
  const handlePostTypeChange = (value: PostType) => {
    setPostType(value);
  };
  
  const setPostTypeButton = (type: 'image' | 'video' | 'link') => {
    setPostType(type);
  };
  
  const validateVideoUrl = (url: string): { isValid: boolean; message?: string } => {
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
  
  const handlePostSubmit = async () => {
    if (!content.trim()) {
      toast({
        title: 'Cannot create empty post',
        description: 'Please add some content to your post',
        variant: 'destructive',
      });
      return;
    }
    
    if (content.length > MAX_CHARS) {
      toast({
        title: 'Post too long',
        description: `Your post exceeds the maximum character limit of ${MAX_CHARS}`,
        variant: 'destructive',
      });
      return;
    }
    
    // Validate video URL if it's a video post
    if (postType === 'video' && videoUrl) {
      const validationResult = validateVideoUrl(videoUrl);
      if (!validationResult.isValid) {
        toast({
          title: 'Invalid video URL',
          description: validationResult.message || 'Please enter a valid URL from YouTube, Vimeo, or a direct video file',
          variant: 'destructive',
        });
        return;
      }
    }
    
    setIsSubmitting(true);
    
    try {
      let finalImageUrl = undefined;
      let finalVideoUrl = undefined;
      let linkInfo = undefined;
      
      switch (postType) {
        case 'image':
          if (imageUrl) finalImageUrl = imageUrl;
          break;
        case 'video':
          if (videoUrl) finalVideoUrl = videoUrl;
          break;
        case 'link':
          if (linkUrl) {
            linkInfo = {
              url: linkUrl,
              title: linkTitle,
              description: linkDescription,
            };
          }
          break;
      }
      
      const result = await createPost(content, finalImageUrl, finalVideoUrl, linkInfo);
      
      if (result) {
        resetForm();
        onPostCreated();
        
        toast({
          title: 'Post created!',
          description: 'Your post has been published successfully.',
          variant: 'default',
        });
      }
    } catch (error) {
      console.error('Error creating post:', error);
      toast({
        title: 'Error creating post',
        description: 'Something went wrong. Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const resetForm = () => {
    setContent('');
    setImageUrl('');
    setVideoUrl('');
    setLinkUrl('');
    setLinkTitle('');
    setLinkDescription('');
    setPostType('text');
  };
  
  return {
    content,
    isSubmitting,
    postType,
    imageUrl,
    videoUrl,
    linkUrl,
    linkTitle,
    linkDescription,
    charCount,
    isOverLimit,
    hasContent,
    MAX_CHARS,
    handleContentChange,
    handlePostTypeChange,
    setPostTypeButton,
    handlePostSubmit,
    setImageUrl,
    setVideoUrl,
    setLinkUrl,
    setLinkTitle,
    setLinkDescription
  };
};
